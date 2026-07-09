# MathArts Skills 仓库 Phase 1 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建 `matharts/skills` 仓库的完整 Phase 1 基础设施，包含 7 个核心 Skill、校验工具链、CI/CD 和仓库级文档。

**Architecture:** 遵循 agentskills.io 规范，以 `SKILL.md` + YAML frontmatter 为唯一元数据载体。仓库采用 monorepo 结构，`skills/` 目录下每个子目录为独立 Skill 包。`tools/validate-skill.ts` 提供 L0-L2 校验，`.github/workflows/validate.yml` 在 CI 中自动执行。`matharts-doc-design` 作为文档排版基础层被其他文档类 Skill 继承。

**Tech Stack:** Bun（工具链）、YAML frontmatter、Markdown、GitHub Actions、agentskills.io 规范（`skills-ref`）

**Design Spec:** `DESIGN.md` (v0.6.3)

## Global Constraints

- 所有 Skill 遵循 [agentskills.io](https://agentskills.io) 规范，`SKILL.md` 为唯一标准文件
- `SKILL.md` frontmatter 的 `name` 必须匹配父目录名（1-64 字符，小写字母/数字/连字符）
- `SKILL.md` 正文 <= 500 行；`description` <= 1024 字符
- `metadata` 值强制为 string，数组以逗号分隔
- 分发期 Skill 必须自包含，禁止引用 `internal/` 或仓库根
- 安装使用 `npx skills add matharts/skills --skill <name> -a opencode`，不自造安装器
- 第一批所有 Skill 状态为 `experimental`，版本 `0.1.0`
- Bun 运行时（工具链）
- CI 校验：L0（frontmatter）+ L1（结构）+ L2（自包含）必须通过，L3（快照）第一阶段可选

---

## 依赖关系总览

```
README.md ──────────────────▶ AGENTS.md ──────────▶ matharts-agent-guide ──▶ matharts-repo-bootstrap
                                                        ▲
validate-skill.ts ──▶ matharts-agent-skill-dev          │
                  ──▶ matharts-doc-design ──▶ matharts-doc-readme
                                          ──▶ matharts-doc-rfc
                                          ──▶ matharts-doc-adr
                  
所有 Skill 完成后 ──▶ sync-shared-source.ts ──▶ CI/CD 集成测试
```

**并行组：**
- 组 A：Task 1 + Task 3（无依赖，可并行）
- 组 B：Task 4 + Task 5（均依赖 Task 3，可并行）
- 组 C：Task 6 + Task 7 + Task 8（均依赖 Task 3+5，可并行）
- 串行链：Task 2 → Task 9 → Task 10
- 收尾：Task 11 → Task 12

---

## 阶段一：基础设施（Task 1-3）

### Task 1: 完善 README.md

**Files:**
- Modify: `README.md`

**Design Ref:** DESIGN.md §1, §2, §19, §20

**Interfaces:**
- Consumes: 仓库定位（DESIGN §1-2）
- Produces: 完整的仓库 README，供 AGENTS.md 和人类阅读者消费

- [ ] **Step 1: 扩展 README.md 内容**

将现有 `README.md`（7 行）扩展为包含以下章节的完整仓库说明：

```markdown
# MathArts Skills

> MathArts 开源生态的可复用 Agent Skills 与能力模块仓库。

## 仓库定位

`matharts/skills` 是 MathArts 开源生态的 **Agent Capability Registry**，用于沉淀、维护、分发 MathArts 各项目共享的 Agent Skills 与能力模块，使 AI Agent 能够在不同 MathArts 仓库中稳定执行高质量任务。

GitHub 描述：Reusable Agent Skills and capability modules for the MathArts open-source ecosystem.

## 核心目标

将 MathArts 的知识、规范、流程、工程经验和项目约定，封装为 AI Agent 可以稳定复用、组合和执行的能力。

## 仓库结构

```text
matharts-skills/
  README.md / LICENSE / AGENTS.md
  skills/
    matharts-agent-skill-dev/      # 创建/审查/维护 Skill 包（元 Skill）
    matharts-doc-design/           # 统一文档排版、Markdown 样式、视觉层级
    matharts-repo-bootstrap/       # 初始化或标准化 MathArts 仓库
    matharts-agent-guide/          # 生成和维护 AGENTS.md
    matharts-doc-readme/           # 生成和审查项目 README.md
    matharts-doc-rfc/              # 生成和审查重大变更提案
    matharts-doc-adr/              # 记录已接受的重要决策
  docs/guides/                          # Skill 编写/审查/版本/安装指南
  tools/                           # Bun 工具链（校验、同步、打包）
  internal/                        # 开发期暂存区（不进入分发）
```

## 安装

使用 agentskills 官方 CLI：

```bash
# 列出可用 Skill
npx skills add matharts/skills --list

# 安装单个 Skill
npx skills add matharts/skills --skill matharts-doc-rfc -a opencode

# 版本锁定
npx skills add matharts/skills@v0.1.0 --skill matharts-doc-rfc -a opencode -y
```

## Skill 列表

| Skill | 版本 | 状态 | 职责 |
| ----- | ---- | ---- | ---- |
| `matharts-agent-skill-dev` | 0.1.0 | experimental | 创建/审查/维护 Skill 包（元 Skill） |
| `matharts-doc-design` | 0.1.0 | experimental | 统一文档排版、Markdown 样式、视觉层级 |
| `matharts-repo-bootstrap` | 0.1.0 | experimental | 初始化或标准化 MathArts 仓库 |
| `matharts-agent-guide` | 0.1.0 | experimental | 生成和维护 AGENTS.md |
| `matharts-doc-readme` | 0.1.0 | experimental | 生成和审查项目 README.md |
| `matharts-doc-rfc` | 0.1.0 | experimental | 生成和审查重大变更提案 |
| `matharts-doc-adr` | 0.1.0 | experimental | 记录已接受的重要决策 |

## 生态位置

- `matharts/standards` = 正式标准源头
- `matharts/skills` = Agent 执行层（本仓库）
- `matharts/docs` = 长期知识库
- 项目仓库 = 安装 Skill 副本后运行

## 开发

```bash
# 校验所有 Skill
bun tools/validate-skill.ts --check all

# 仅校验规范合规
npx skills-ref validate skills/*/
```

## 许可证

MIT License. See `LICENSE`.
```

- [ ] **Step 2: 验证 README.md 格式**

确认 README.md 包含：仓库定位、核心目标、仓库结构、安装方式、Skill 列表、生态位置、开发指南、许可证。

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: expand README.md with full repository overview"
```

---

### Task 2: 创建 AGENTS.md

**Files:**
- Create: `AGENTS.md`

**Design Ref:** DESIGN.md §6.4, §19

**Interfaces:**
- Consumes: README.md（Task 1）
- Produces: 仓库级 Agent 规则文件，供 `matharts-agent-guide` Skill 和所有 Agent 消费

- [ ] **Step 1: 创建 AGENTS.md**

```markdown
# AGENTS.md — matharts/skills

## 仓库定位

`matharts/skills` 是 MathArts 开源生态的 Agent Capability Registry，遵循 [agentskills.io](https://agentskills.io) 规范。

## 核心原则

- 每个 Skill 是独立能力包，核心文件为 `SKILL.md`（YAML frontmatter + Markdown 正文）
- 分发期 Skill 必须自包含，禁止引用 `internal/` 或仓库根共享文件
- `SKILL.md` frontmatter 的 `name` 必须匹配父目录名
- `SKILL.md` 正文 <= 500 行，`description` <= 1024 字符
- `metadata` 值强制为 string，数组以逗号分隔
- 安装使用 `npx skills`，不自造工具

## Skills

本仓库自身的 Skill 开发不需要安装外部 Skill。以下列出本仓库提供的 Skill：

- matharts/skills/matharts-doc-design@v0.1.0
- matharts/skills/matharts-agent-skill-dev@v0.1.0
- matharts/skills/matharts-doc-readme@v0.1.0
- matharts/skills/matharts-doc-rfc@v0.1.0
- matharts/skills/matharts-doc-adr@v0.1.0
- matharts/skills/matharts-agent-guide@v0.1.0
- matharts/skills/matharts-repo-bootstrap@v0.1.0

## 目录约定

| 目录/文件 | 用途 | 可修改 |
| --------- | ---- | ------ |
| `skills/*/` | Skill 包目录 | 是（需通过 validate-skill.ts） |
| `tools/` | Bun 工具链 | 是 |
| `docs/guides/` | Skill 编写/审查指南 | 是（由 matharts-agent-skill-dev 维护） |
| `internal/shared-source/` | 开发期共享内容暂存区 | 是（单向同步进各 Skill） |
| `README.md` | 仓库说明 | 是 |
| `AGENTS.md` | 本文件 | 是（由 matharts-agent-guide 维护） |
| `LICENSE` | MIT 许可证 | 否 |
| `DESIGN.md` | 仓库设计文档 | 谨慎（需 RFC） |

## 校验要求

所有 PR 必须通过：
- L0：frontmatter 规范校验（`skills-ref validate`）
- L1：结构校验（必备文件、行数限制、无 `internal/` 引用）
- L2：自包含校验（复制到 sandbox 后无路径回溯）

运行：`bun tools/validate-skill.ts --check all`

## 文档规范

- 遵循 `matharts-doc-design` Skill 定义的排版规则
- 中英文混排时中文与英文/数字之间加空格
- 标题层级不跳级
- 表格对齐、代码块标注语言

## 何时写 RFC

- 改变仓库结构或 Skill 规范
- 新增/废弃/替代 Skill
- 修改安装机制或版本规则
- 任何影响下游项目的不兼容变更

## 何时写 ADR

- RFC 被 Accepted 后自动生成
- 记录已做出的重要决策（技术选型、架构变更）
```

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs: create AGENTS.md with repository-level agent rules"
```

---

### Task 3: 创建 tools/validate-skill.ts

**Files:**
- Create: `tools/validate-skill.ts`
- Create: `tools/package.json`

**Design Ref:** DESIGN.md §16, §17, §19

**Interfaces:**
- Consumes: 各 Skill 目录下的 `SKILL.md`
- Produces: L0/L1/L2 校验结果（exit code 0 = pass, non-zero = fail）
- 被 Task 4-8 的所有 Skill 依赖（校验通过才能合并）
- 被 `.github/workflows/validate.yml`（Task 11）调用

- [ ] **Step 1: 创建 tools/package.json**

```json
{
  "name": "matharts-skills-tools",
  "private": true,
  "dependencies": {
    "yaml": "^2.4.0"
  }
}
```

- [ ] **Step 2: 创建 tools/validate-skill.ts 骨架**

实现分层校验工具，支持 `--check` 参数选择校验级别：

```typescript
#!/usr/bin/env bun
/**
 * MathArts Skill 校验工具 — 仓库 QA，非安装器。
 *
 * 用法:
 *     bun tools/validate-skill.ts --check all [skills_dir]
 *     bun tools/validate-skill.ts --check frontmatter [skills_dir]
 *     bun tools/validate-skill.ts --check structure [skills_dir]
 *     bun tools/validate-skill.ts --check selfcontained [skills_dir]
 *     bun tools/validate-skill.ts --check snapshot [skills_dir]
 *
 * 默认 skills_dir 为 ./skills
 */

import { parseArgs } from "util";
import { readdir, readFile, mkdir, cp, rm, access, stat } from "fs/promises";
import { join, relative, resolve, sep } from "path";
import { tmpdir } from "os";
import { parse as parseYaml } from "yaml";

const NAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const CONTINUOUS_HYPHEN = /--/;
const VALID_STATUSES = new Set(["experimental", "active", "deprecated", "superseded"]);
const MAX_SKILL_MD_LINES = 500;
const MAX_DESCRIPTION_LENGTH = 1024;

interface ValidationResult {
  errors: string[];
  warnings: string[];
  passed: boolean;
}

function createResult(): ValidationResult {
  return { errors: [], warnings: [], passed: true };
}

function addError(result: ValidationResult, msg: string): void {
  result.errors.push(msg);
  result.passed = false;
}

function addWarn(result: ValidationResult, msg: string): void {
  result.warnings.push(msg);
}

async function fileExists(p: string): Promise<boolean> {
  try { await access(p); return true; } catch { return false; }
}

async function readDirRecursive(dir: string, ext: string): Promise<string[]> {
  const results: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true, recursive: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.toString());
      if (entry.toString().endsWith(ext)) results.push(fullPath);
    }
  } catch { /* dir not found */ }
  return results;
}

function parseFrontmatter(content: string): Record<string, any> | null {
  if (!content.startsWith("---")) return null;
  const parts = content.split("---");
  if (parts.length < 3) return null;
  try {
    return parseYaml(parts[1]) as Record<string, any>;
  } catch {
    return null;
  }
}

async function checkFrontmatter(skillDir: string, skillName: string, result: ValidationResult): Promise<void> {
  const skillMd = join(skillDir, "SKILL.md");
  if (!(await fileExists(skillMd))) {
    addError(result, `${skillName}: SKILL.md not found`);
    return;
  }

  const content = await readFile(skillMd, "utf-8");
  const fm = parseFrontmatter(content);
  if (!fm) {
    addError(result, `${skillName}: SKILL.md has no valid YAML frontmatter`);
    return;
  }

  const name = fm.name ?? "";
  if (name !== skillName) {
    addError(result, `${skillName}: frontmatter name '${name}' does not match directory name`);
  }
  if (!NAME_PATTERN.test(name)) {
    addError(result, `${skillName}: name '${name}' contains invalid characters`);
  }
  if (CONTINUOUS_HYPHEN.test(name)) {
    addError(result, `${skillName}: name '${name}' contains continuous hyphens`);
  }
  if (name.length > 64) {
    addError(result, `${skillName}: name exceeds 64 characters`);
  }

  const desc = fm.description ?? "";
  if (!desc) {
    addError(result, `${skillName}: description is empty`);
  }
  if (String(desc).length > MAX_DESCRIPTION_LENGTH) {
    addError(result, `${skillName}: description exceeds ${MAX_DESCRIPTION_LENGTH} characters (${String(desc).length})`);
  }

  const metadata = fm.metadata;
  if (metadata && typeof metadata === "object") {
    for (const [key, value] of Object.entries(metadata)) {
      if (typeof value !== "string") {
        addError(result, `${skillName}: metadata.${key} value is not a string (got ${typeof value})`);
      }
    }
    const status = metadata.status;
    if (status && !VALID_STATUSES.has(status)) {
      addError(result, `${skillName}: invalid status '${status}', must be one of ${[...VALID_STATUSES].join(", ")}`);
    }
    const version = metadata.version;
    if (version && !/^\d+\.\d+\.\d+/.test(version)) {
      addError(result, `${skillName}: version '${version}' is not valid semver`);
    }
  }
}

async function checkStructure(skillDir: string, skillName: string, result: ValidationResult): Promise<void> {
  const skillMd = join(skillDir, "SKILL.md");
  const readmeMd = join(skillDir, "README.md");

  if (!(await fileExists(skillMd))) addError(result, `${skillName}: SKILL.md not found`);
  if (!(await fileExists(readmeMd))) addError(result, `${skillName}: README.md not found`);

  if (await fileExists(skillMd)) {
    const content = await readFile(skillMd, "utf-8");
    const lines = content.split("\n");
    if (lines.length > MAX_SKILL_MD_LINES) {
      addError(result, `${skillName}: SKILL.md has ${lines.length} lines (max ${MAX_SKILL_MD_LINES})`);
    }
  }

  const mdFiles = await readDirRecursive(skillDir, ".md");
  for (const mdFile of mdFiles) {
    const content = await readFile(mdFile, "utf-8");
    const rel = relative(skillDir, mdFile);
    if (content.includes("../internal") || content.includes("..\\internal")) {
      addError(result, `${skillName}: ${rel} references internal/ via relative path`);
    }
    if (content.includes("../../..") || content.includes("..\\..\\")) {
      addWarn(result, `${skillName}: ${rel} has deep relative path traversal`);
    }
  }

  if (await fileExists(join(skillDir, "skill.json"))) {
    addError(result, `${skillName}: skill.json exists (all metadata must be in SKILL.md frontmatter)`);
  }
  if (await fileExists(join(skillDir, "VERSION"))) {
    addError(result, `${skillName}: VERSION file exists (version must be in frontmatter metadata.version)`);
  }
}

async function checkSelfcontained(skillDir: string, skillName: string, result: ValidationResult): Promise<void> {
  const sandbox = join(tmpdir(), `skill-validate-${Date.now()}`, skillName);
  try {
    await mkdir(sandbox, { recursive: true });
    await cp(skillDir, sandbox, { recursive: true });

    const mdFiles = await readDirRecursive(sandbox, ".md");
    for (const mdFile of mdFiles) {
      const content = await readFile(mdFile, "utf-8");
      const rel = relative(sandbox, mdFile);
      const depth = rel.split(sep).length - 1;

      for (const line of content.split("\n")) {
        if (line.includes("../")) {
          const count = (line.match(/\.\.\//g) || []).length;
          if (count > depth) {
            addError(result, `${skillName}: ${rel} references path outside skill directory: ${line.trim().slice(0, 80)}`);
          }
        }
      }
    }
  } finally {
    await rm(join(tmpdir(), `skill-validate-${Date.now()}`), { recursive: true, force: true });
  }
}

async function checkSnapshot(skillDir: string, skillName: string, result: ValidationResult): Promise<void> {
  const fixturesDir = join(skillDir, "tests", "fixtures");
  const expectedDir = join(fixturesDir, "expected");

  if (!(await fileExists(fixturesDir))) {
    addWarn(result, `${skillName}: no tests/fixtures/ directory (L3 skipped)`);
    return;
  }
  if (!(await fileExists(expectedDir))) {
    addWarn(result, `${skillName}: no tests/fixtures/expected/ directory (L3 skipped)`);
  }
}

async function validateSkill(skillDir: string, skillName: string, check: string): Promise<ValidationResult> {
  const result = createResult();

  if (check === "all" || check === "frontmatter") await checkFrontmatter(skillDir, skillName, result);
  if (check === "all" || check === "structure") await checkStructure(skillDir, skillName, result);
  if (check === "all" || check === "selfcontained") await checkSelfcontained(skillDir, skillName, result);
  if (check === "all" || check === "snapshot") await checkSnapshot(skillDir, skillName, result);

  return result;
}

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    options: {
      check: { type: "string", default: "all" },
    },
    allowPositionals: true,
  });

  const check = values.check!;
  const validChecks = ["all", "frontmatter", "structure", "selfcontained", "snapshot"];
  if (!validChecks.includes(check)) {
    console.error(`ERROR: invalid check '${check}', must be one of ${validChecks.join(", ")}`);
    process.exit(1);
  }

  const skillsRoot = positionals[0] || "skills";
  try {
    await stat(skillsRoot);
  } catch {
    console.error(`ERROR: skills directory not found: ${skillsRoot}`);
    process.exit(1);
  }

  const entries = await readdir(skillsRoot, { withFileTypes: true });
  const skillDirs = entries
    .filter(e => e.isDirectory() && !e.name.startsWith("."))
    .map(e => e.name)
    .sort();

  if (skillDirs.length === 0) {
    console.warn(`WARNING: no skill directories found in ${skillsRoot}`);
    process.exit(0);
  }

  let allPassed = true;
  for (const name of skillDirs) {
    const dir = join(skillsRoot, name);
    const result = await validateSkill(dir, name, check);
    const status = result.passed ? "PASS" : "FAIL";
    console.log(`[${status}] ${name}`);
    for (const e of result.errors) console.log(`  ERROR: ${e}`);
    for (const w of result.warnings) console.log(`  WARN:  ${w}`);
    if (!result.passed) allPassed = false;
  }

  process.exit(allPassed ? 0 : 1);
}

main();
```

- [ ] **Step 3: 验证工具可运行**

```bash
cd E:\~\Code\Github\matharts\skills
bun install
bun tools/validate-skill.ts --help
```

预期：显示帮助信息，无报错。

- [ ] **Step 4: Commit**

```bash
git add tools/validate-skill.ts tools/package.json
git commit -m "feat: add validate-skill.ts with L0/L1/L2 validation"
```

---

## 阶段二：核心 Skill（Task 4-5，可并行）

### Task 4: 创建 matharts-agent-skill-dev

**Files:**
- Create: `skills/matharts-agent-skill-dev/SKILL.md`
- Create: `skills/matharts-agent-skill-dev/README.md`

**Design Ref:** DESIGN.md §6.1, §11, §12, §13

**Interfaces:**
- Consumes: validate-skill.ts（Task 3）的校验规则
- Produces: 元 Skill，后续用于审查其他 Skill

- [ ] **Step 1: 创建 skills/matharts-agent-skill-dev/SKILL.md**

```markdown
---
name: matharts-agent-skill-dev
description: Create, review, and maintain MathArts Agent Skill packages. Use when scaffolding a new skill, checking self-containment, writing SKILL.md frontmatter, reviewing skill size or scope, deciding whether to split or下沉 a skill, or maintaining skill lifecycle. Triggers on skill development, skill scaffolding, skill review, skill creation, new capability, skill lifecycle.
license: MIT
compatibility: Designed for opencode and codex
metadata:
  version: "0.1.0"
  status: "experimental"
  category: "meta"
  tags: "skill-dev,scaffolding,review,lifecycle"
  maintainers: "@matharts/core"
---

# matharts-agent-skill-dev

创建、审查、维护 MathArts Skill 包。这是"生产 Skill 的 Skill"。

## 何时使用

- 需要创建新的 Agent Skill
- 需要审查现有 Skill 的合规性
- 需要判断一个能力是否应封装为 Skill
- 需要判断 Skill 是否过大/过小/职责混乱
- 需要判断 Skill 是否应拆分或下沉到领域仓库

## 执行指令

### 创建新 Skill

1. 确认 Skill 名称符合规范（1-64 字符，小写字母/数字/连字符，匹配目录名）
2. 创建目录 `skills/<skill-name>/`
3. 创建 `SKILL.md`，包含：
   - YAML frontmatter（name, description, metadata）
   - 正文 <= 500 行
4. 创建 `README.md`（面向人类说明）
5. 按需创建 `references/`、`assets/`、`scripts/`、`examples/`、`tests/`
6. 运行 `bun tools/validate-skill.ts --check all skills/<skill-name>/` 确认通过

### 审查 Skill

检查清单：
- [ ] `name` 匹配目录名
- [ ] `description` <= 1024 字符，包含"做什么"+"何时使用"触发词
- [ ] `metadata` 值全为 string
- [ ] `SKILL.md` 正文 <= 500 行
- [ ] 无 `skill.json` 或 `VERSION` 文件
- [ ] 分发态自包含，无 `internal/` 引用
- [ ] 无跨 Skill 相对路径回溯
- [ ] `tests/fixtures/` 包含 valid/invalid 样本

### 判断边界

判断一个能力是否应放在 `matharts/skills`：

> 若一个 Skill 依赖具体领域术语、算法、流派、输入输出、精度边界或历史来源，则应下沉到领域仓库。

### 判断是否拆分

Skill 过大的信号：
- `SKILL.md` 正文接近 500 行且仍在增长
- 职责超过两个独立领域
- `description` 需要列举大量不相关触发词

拆分策略：将独立职责拆为独立 Skill，通过 `metadata.dependencies` 声明关系。

## 参考

- 当需要查看完整 frontmatter 字段规范时，读取 `references/frontmatter-spec.snapshot.md`
- 当需要查看 agentskills.io 规范细节时，读取 `references/agentskills-spec.snapshot.md`
```

- [ ] **Step 2: 创建 skills/matharts-agent-skill-dev/README.md**

```markdown
# matharts-agent-skill-dev

创建、审查、维护 MathArts Agent Skill 包。这是"生产 Skill 的 Skill"。

## 职责

- 创建新 Skill（脚手架生成）
- 审查 Skill 合规性（frontmatter、结构、自包含）
- 判断能力边界（是否应封装为 Skill、是否应下沉到领域仓库）
- 判断 Skill 是否应拆分或合并
- 维护 Skill 生命周期（experimental → active → deprecated）

## 安装

```bash
npx skills add matharts/skills --skill matharts-agent-skill-dev -a opencode
```

## 依赖

无外部 Skill 依赖。

## 状态

`experimental` — 结构和规则可能变化。
```

- [ ] **Step 3: 运行校验**

```bash
bun tools/validate-skill.ts --check all skills/matharts-agent-skill-dev/
```

预期：`[PASS] matharts-agent-skill-dev`

- [ ] **Step 4: Commit**

```bash
git add skills/matharts-agent-skill-dev/
git commit -m "feat: add matharts-agent-skill-dev skill"
```

---

### Task 5: 创建 matharts-doc-design

**Files:**
- Create: `skills/matharts-doc-design/SKILL.md`
- Create: `skills/matharts-doc-design/README.md`

**Design Ref:** DESIGN.md §6.2, §11, §12

**Interfaces:**
- Consumes: validate-skill.ts（Task 3）
- Produces: 文档排版基础层，被 `matharts-doc-readme`/`matharts-doc-rfc`/`matharts-doc-adr` 通过 `metadata.extends` 继承

- [ ] **Step 1: 创建 skills/matharts-doc-design/SKILL.md**

```markdown
---
name: matharts-doc-design
description: Standardize MathArts document typography, Markdown styling, visual hierarchy, and reading experience. Use when formatting documents, setting heading levels, styling tables, code blocks, blockquotes, badges, NOTE/WARNING/IMPORTANT blocks, Mermaid diagrams, CJK-Latin mixed typesetting, or document status indicators. Triggers on document formatting, typography, visual hierarchy, markdown styling, document layout, CJK typesetting.
license: MIT
compatibility: Designed for opencode and codex
metadata:
  version: "0.1.0"
  status: "experimental"
  category: "documentation"
  tags: "typography,markdown,formatting,visual-hierarchy,document-design"
  maintainers: "@matharts/core"
---

# matharts-doc-design

统一 MathArts 文档排版、Markdown 样式、视觉层级与阅读体验。只负责"长相"，不负责具体文档内容。

## 何时使用

- 需要统一文档排版风格
- 需要确定标题层级、编号规则
- 需要规范表格/代码块/引用块样式
- 需要处理中英文混排
- 需要添加文档状态标识

## 排版规则

### 标题层级

- 一级标题 `#` 仅用于文档标题，每文档仅一个
- 标题层级不跳级（`##` → `###`，不 `##` → `####`）
- 章节编号格式：`## N. 标题` 或 `## N.M 标题`

### 元信息区

文档标题下方紧跟元信息表格：

```markdown
| 属性     | 值                    |
| -------- | --------------------- |
| 文档状态 | Draft / Review / Final |
| 版本     | x.y.z                 |
```

### 中英文混排

- 中文与英文/数字之间加一个半角空格
- 专有名词保持原文大小写（如 `AGENTS.md`、`SKILL.md`）
- 中文标点使用全角，英文标点使用半角

### 表格

- 表头与分隔行必须对齐
- 单元格内容前后各留一个空格
- 空单元格使用 `—`（em dash）占位

### 代码块

- 必须标注语言（如 ` ```python `、` ```markdown `）
- 行内代码使用反引号

### 引用块与提示

| 类型 | 格式 |
| ---- | ---- |
| NOTE | `> **NOTE:** 内容` |
| WARNING | `> **WARNING:** 内容` |
| IMPORTANT | `> **IMPORTANT:** 内容` |

### Mermaid 图示

- 图表前后各空一行
- 使用 ` ```mermaid ` 代码块
- 节点文本使用双引号包裹

### 段落密度

- 段落之间空一行
- 列表项之间视复杂度决定是否空行
- 长文档每 50-80 行设置一个二级标题

### 文档状态标识

| 状态 | 含义 |
| ---- | ---- |
| Draft | 草稿，内容可能大幅变化 |
| Review | 评审中，收集反馈 |
| Final | 定稿，变更需走 RFC |

## 与其他 Skill 的关系

本 Skill 作为基础风格层被 `matharts-doc-readme`/`matharts-doc-rfc`/`matharts-doc-adr` 等消费。消费方通过 `metadata.extends` 继承其规则并覆盖。
```

- [ ] **Step 2: 创建 skills/matharts-doc-design/README.md**

```markdown
# matharts-doc-design

统一 MathArts 文档排版、Markdown 样式、视觉层级与阅读体验。只负责"长相"，不负责具体文档内容。

## 职责

- 标题层级与编号规则
- 元信息区格式
- 中英文混排规范
- 表格/代码块/引用块样式
- NOTE/WARNING/IMPORTANT 格式
- Mermaid 图示规范
- 段落密度控制
- 文档状态标识

## 被依赖

以下 Skill 通过 `metadata.extends` 继承本 Skill 的排版规则：

- `matharts-doc-readme`
- `matharts-doc-rfc`
- `matharts-doc-adr`

## 安装

```bash
npx skills add matharts/skills --skill matharts-doc-design -a opencode
```

## 状态

`experimental` — 结构和规则可能变化。
```

- [ ] **Step 3: 运行校验**

```bash
bun tools/validate-skill.ts --check all skills/matharts-doc-design/
```

预期：`[PASS] matharts-doc-design`

- [ ] **Step 4: Commit**

```bash
git add skills/matharts-doc-design/
git commit -m "feat: add matharts-doc-design skill (document typography base layer)"
```

---

## 阶段三：文档类 Skill（Task 6-8，可并行）

### Task 6: 创建 matharts-doc-readme

**Files:**
- Create: `skills/matharts-doc-readme/SKILL.md`
- Create: `skills/matharts-doc-readme/README.md`
- Create: `skills/matharts-doc-readme/assets/templates/README.template.md`

**Design Ref:** DESIGN.md §6.5, §11, §12

**Interfaces:**
- Consumes: `matharts-doc-design`（Task 5）的排版规则
- Produces: README.md 生成/审查能力

- [ ] **Step 1: 创建 skills/matharts-doc-readme/SKILL.md**

```markdown
---
name: matharts-doc-readme
description: Generate and review MathArts project README.md files. Use when creating a new project README, auditing an existing README for completeness, or standardizing README structure across MathArts repositories. Triggers on README, readme, project documentation, getting started, quick start, installation guide, project overview.
license: MIT
compatibility: Designed for opencode and codex
metadata:
  version: "0.1.0"
  status: "experimental"
  category: "documentation"
  tags: "readme,project-doc,getting-started,installation"
  extends: "matharts-doc-design"
  dependencies: "matharts-doc-design>=0.1.0"
  maintainers: "@matharts/core"
---

# matharts-doc-readme

生成和审查 MathArts 项目的 `README.md`。

## 何时使用

- 需要为新项目生成 README.md
- 需要审查现有 README.md 的完整性
- 需要统一 MathArts 项目的 README 结构

## 执行指令

### 生成 README.md

按以下结构生成，遵循 `matharts-doc-design` 排版规则：

1. **标题与描述**：`# 项目名` + 一句话描述（`> 引用块`）
2. **元信息区**：文档状态、版本、许可证
3. **功能列表**：核心功能，使用无序列表
4. **安装**：安装命令/步骤
5. **快速开始**：最小可运行示例
6. **生态位置**：在 MathArts 生态中的位置（依赖哪些 Skill、被哪些项目使用）
7. **项目结构**：目录树概览
8. **贡献入口**：指向 `CONTRIBUTING.md` 或 `AGENTS.md`
9. **许可证**：License 类型

### 审查 README.md

检查清单：
- [ ] 包含项目定位（一句话描述）
- [ ] 包含安装步骤
- [ ] 包含快速开始示例
- [ ] 包含生态位置说明
- [ ] 包含许可证声明
- [ ] 遵循 `matharts-doc-design` 排版规则
- [ ] 中英文混排正确

### 模板

生成时参考 `assets/templates/README.template.md`。

## 排版规则

继承 `matharts-doc-design` 的全部排版规则。
```

- [ ] **Step 2: 创建 skills/matharts-doc-readme/README.md**

```markdown
# matharts-doc-readme

生成和审查 MathArts 项目的 `README.md`。

## 职责

- 为新项目生成结构化 README.md
- 审查现有 README.md 的完整性
- 统一 MathArts 项目的 README 结构

## 依赖

- `matharts-doc-design` — 继承排版规则

## 安装

```bash
npx skills add matharts/skills --skill matharts-doc-readme -a opencode
```

## 状态

`experimental` — 结构和规则可能变化。
```

- [ ] **Step 3: 创建 skills/matharts-doc-readme/assets/templates/README.template.md**

```markdown
# {{PROJECT_NAME}}

> {{ONE_LINE_DESCRIPTION}}

| 属性     | 值                    |
| -------- | --------------------- |
| 文档状态 | {{STATUS}}            |
| 版本     | {{VERSION}}           |
| 许可证   | {{LICENSE}}           |

## 功能

- {{FEATURE_1}}
- {{FEATURE_2}}

## 安装

```bash
{{INSTALL_COMMAND}}
```

## 快速开始

```bash
{{QUICK_START_COMMAND}}
```

## 生态位置

{{ECOSYSTEM_POSITION}}

## 项目结构

```text
{{DIRECTORY_TREE}}
```

## 贡献

参见 `AGENTS.md` 或 `CONTRIBUTING.md`。

## 许可证

{{LICENSE}}
```

- [ ] **Step 4: 运行校验**

```bash
bun tools/validate-skill.ts --check all skills/matharts-doc-readme/
```

预期：`[PASS] matharts-doc-readme`

- [ ] **Step 5: Commit**

```bash
git add skills/matharts-doc-readme/
git commit -m "feat: add matharts-doc-readme skill"
```

---

### Task 7: 创建 matharts-doc-rfc

**Files:**
- Create: `skills/matharts-doc-rfc/SKILL.md`
- Create: `skills/matharts-doc-rfc/README.md`
- Create: `skills/matharts-doc-rfc/assets/templates/RFC.template.md`

**Design Ref:** DESIGN.md §6.6, §11, §12

**Interfaces:**
- Consumes: `matharts-doc-design`（Task 5）的排版规则
- Produces: RFC 文档生成/审查能力

- [ ] **Step 1: 创建 skills/matharts-doc-rfc/SKILL.md**

```markdown
---
name: matharts-doc-rfc
description: Create, review, and standardize MathArts RFC documents. Use when proposing major changes to architecture, API, standards, algorithms, repository structure, or governance workflows. Triggers on RFC, proposal, design review, RFE, change request, major change, architecture decision, API change.
license: MIT
compatibility: Designed for opencode and codex
metadata:
  version: "0.1.0"
  status: "experimental"
  category: "documentation"
  tags: "rfc,proposal,design-review,change-request"
  extends: "matharts-doc-design"
  dependencies: "matharts-doc-design>=0.1.0"
  maintainers: "@matharts/core"
---

# matharts-doc-rfc

生成和审查重大变更提案（事前讨论文档）。

## 何时使用

- 需要提出影响架构、API、标准、算法策略的重大变更
- 需要提出影响仓库结构、治理流程的变更
- 需要正式的讨论和审查流程

## 执行指令

### 生成 RFC

1. 在 `docs/rfcs/` 目录创建 `RFC-<NNN>-<slug>.md`
2. 按以下结构编写，遵循 `matharts-doc-design` 排版规则：
   - **元信息区**：状态（Draft）、作者、日期
   - **背景**：为什么需要这个变更
   - **动机**：解决什么问题
   - **目标**：本次变更要达成的目标
   - **非目标**：明确不在本次范围内的内容
   - **设计方案**：详细的技术方案
   - **替代方案**：考虑过的其他方案及不选择的原因
   - **兼容性**：向后兼容性分析
   - **迁移策略**：如何从当前状态迁移到新状态
   - **开放问题**：尚未确定的问题
   - **讨论入口**：如何参与讨论（Issue 链接等）

### 状态管理

| 状态 | 含义 |
| ---- | ---- |
| Draft | 草稿，正在编写 |
| Review | 进入评审，收集反馈 |
| Accepted | 通过，准备实施 |
| Rejected | 被拒绝 |
| Withdrawn | 作者撤回 |

### RFC → ADR 衔接

RFC 被 `Accepted` 后，由 `matharts-doc-adr` Skill 自动生成对应 ADR 文件。

### 审查 RFC

检查清单：
- [ ] 背景与动机清楚
- [ ] 目标与非目标明确
- [ ] 设计方案详细可执行
- [ ] 替代方案已考虑
- [ ] 兼容性分析完整
- [ ] 迁移策略可行
- [ ] 遵循 `matharts-doc-design` 排版规则

### 模板

生成时参考 `assets/templates/RFC.template.md`。
```

- [ ] **Step 2: 创建 skills/matharts-doc-rfc/README.md**

```markdown
# matharts-doc-rfc

生成和审查重大变更提案（事前讨论文档）。

## 职责

- 生成 RFC 文档（背景、动机、方案、替代方案、迁移策略）
- 审查 RFC 完整性
- 管理 RFC 状态流转（Draft → Review → Accepted/Rejected/Withdrawn）
- RFC Accepted 后触发 ADR 生成

## 依赖

- `matharts-doc-design` — 继承排版规则

## 安装

```bash
npx skills add matharts/skills --skill matharts-doc-rfc -a opencode
```

## 状态

`experimental` — 结构和规则可能变化。
```

- [ ] **Step 3: 创建 skills/matharts-doc-rfc/assets/templates/RFC.template.md**

```markdown
# RFC-{{NNN}}: {{TITLE}}

| 属性     | 值                    |
| -------- | --------------------- |
| 状态     | Draft                 |
| 作者     | {{AUTHOR}}            |
| 日期     | {{DATE}}              |

## 背景

{{BACKGROUND}}

## 动机

{{MOTIVATION}}

## 目标

{{GOALS}}

## 非目标

{{NON_GOALS}}

## 设计方案

{{DESIGN}}

## 替代方案

{{ALTERNATIVES}}

## 兼容性

{{COMPATIBILITY}}

## 迁移策略

{{MIGRATION}}

## 开放问题

{{OPEN_QUESTIONS}}

## 讨论

{{DISCUSSION_LINK}}
```

- [ ] **Step 4: 运行校验**

```bash
bun tools/validate-skill.ts --check all skills/matharts-doc-rfc/
```

预期：`[PASS] matharts-doc-rfc`

- [ ] **Step 5: Commit**

```bash
git add skills/matharts-doc-rfc/
git commit -m "feat: add matharts-doc-rfc skill"
```

---

### Task 8: 创建 matharts-doc-adr

**Files:**
- Create: `skills/matharts-doc-adr/SKILL.md`
- Create: `skills/matharts-doc-adr/README.md`
- Create: `skills/matharts-doc-adr/assets/templates/ADR.template.md`

**Design Ref:** DESIGN.md §6.7, §11, §12

**Interfaces:**
- Consumes: `matharts-doc-design`（Task 5）的排版规则
- Produces: ADR 文档生成/审查能力

- [ ] **Step 1: 创建 skills/matharts-doc-adr/SKILL.md**

```markdown
---
name: matharts-doc-adr
description: Record accepted architecture and design decisions as ADR documents. Use when documenting an important decision that has been made, recording decision rationale, tracking superseded decisions, or converting an accepted RFC into an ADR. Triggers on ADR, architecture decision, decision record, decision rationale, why we decided, decision history.
license: MIT
compatibility: Designed for opencode and codex
metadata:
  version: "0.1.0"
  status: "experimental"
  category: "documentation"
  tags: "adr,decision,architecture-decision,decision-record"
  extends: "matharts-doc-design"
  dependencies: "matharts-doc-design>=0.1.0"
  maintainers: "@matharts/core"
---

# matharts-doc-adr

记录已经接受的重要决策（事后记录文档）。

## 何时使用

- RFC 被 Accepted 后需要记录最终决策
- 需要记录一个重要决策的背景和理由
- 需要追踪被替代的决策

## 执行指令

### 生成 ADR

1. 在 `docs/adr/` 目录创建 `ADR-<NNN>-<slug>.md`
2. 按以下结构编写，遵循 `matharts-doc-design` 排版规则：
   - **元信息区**：状态（Accepted）、日期、supersedes（如有）
   - **决策背景**：什么情况下需要做这个决策
   - **最终决定**：做了什么决定
   - **决策理由**：为什么这样决定
   - **影响后果**：这个决定带来的影响
   - **替代方案**：考虑过的其他方案
   - **后续动作**：接下来需要做什么

### 从 RFC 生成 ADR

RFC 被 `Accepted` 后：
1. 沿用 RFC 编号或新建编号
2. 状态初始为 `Accepted`
3. 在 ADR 顶部引用原 RFC：`> 本 ADR 源自 RFC-<NNN>`
4. 补充实施记录与影响后果

### 状态管理

| 状态 | 含义 |
| ---- | ---- |
| Accepted | 决策已接受 |
| Superseded | 被后续 ADR 替代 |

### 替代追踪

当新决策替代旧决策时：
1. 旧 ADR 状态置为 `Superseded`
2. 新 ADR 的 `supersedes` 字段引用旧 ADR
3. 旧 ADR 中添加链接指向新 ADR

### 审查 ADR

检查清单：
- [ ] 决策背景清楚
- [ ] 决策理由充分
- [ ] 影响后果已分析
- [ ] 替代方案已记录
- [ ] 如替代旧 ADR，supersedes 字段正确
- [ ] 遵循 `matharts-doc-design` 排版规则

### 模板

生成时参考 `assets/templates/ADR.template.md`。
```

- [ ] **Step 2: 创建 skills/matharts-doc-adr/README.md**

```markdown
# matharts-doc-adr

记录已经接受的重要决策（事后记录文档）。

## 职责

- 生成 ADR 文档（决策背景、决定、理由、影响）
- 从 Accepted 的 RFC 自动生成 ADR
- 追踪被替代的决策（Superseded）
- 维护决策历史

## 依赖

- `matharts-doc-design` — 继承排版规则

## 安装

```bash
npx skills add matharts/skills --skill matharts-doc-adr -a opencode
```

## 状态

`experimental` — 结构和规则可能变化。
```

- [ ] **Step 3: 创建 skills/matharts-doc-adr/assets/templates/ADR.template.md**

```markdown
# ADR-{{NNN}}: {{TITLE}}

| 属性         | 值                    |
| ------------ | --------------------- |
| 状态         | Accepted              |
| 日期         | {{DATE}}              |
| Supersedes   | {{SUPERSEDES}}        |

> 本 ADR 源自 {{RFC_REFERENCE}}

## 决策背景

{{CONTEXT}}

## 最终决定

{{DECISION}}

## 决策理由

{{RATIONALE}}

## 影响后果

{{CONSEQUENCES}}

## 替代方案

{{ALTERNATIVES}}

## 后续动作

{{FOLLOW_UP}}
```

- [ ] **Step 4: 运行校验**

```bash
bun tools/validate-skill.ts --check all skills/matharts-doc-adr/
```

预期：`[PASS] matharts-doc-adr`

- [ ] **Step 5: Commit**

```bash
git add skills/matharts-doc-adr/
git commit -m "feat: add matharts-doc-adr skill"
```

---

## 阶段四：Agent 规则与仓库初始化（Task 9-10，串行）

### Task 9: 创建 matharts-agent-guide

**Files:**
- Create: `skills/matharts-agent-guide/SKILL.md`
- Create: `skills/matharts-agent-guide/README.md`

**Design Ref:** DESIGN.md §6.4, §11, §12

**Interfaces:**
- Consumes: AGENTS.md（Task 2）的格式约定
- Produces: AGENTS.md 生成/维护能力，被 `matharts-repo-bootstrap` 依赖

- [ ] **Step 1: 创建 skills/matharts-agent-guide/SKILL.md**

```markdown
---
name: matharts-agent-guide
description: Generate and maintain AGENTS.md for MathArts project repositories. Use when creating a new AGENTS.md, updating an outdated one, adjusting rules by repository type, declaring which skills to install and their versions, or declaring documentation/architecture/testing/release conventions. Triggers on AGENTS.md, agent rules, repository conventions, skill installation list, agent configuration.
license: MIT
compatibility: Designed for opencode and codex
metadata:
  version: "0.1.0"
  status: "experimental"
  category: "meta"
  tags: "agents-md,repository-rules,agent-configuration,conventions"
  maintainers: "@matharts/core"
---

# matharts-agent-guide

生成和维护各仓库的 `AGENTS.md`。

## 何时使用

- 需要为新仓库生成 AGENTS.md
- 需要审查/更新现有 AGENTS.md
- 需要按仓库类型调整 Agent 规则
- 需要声明应安装的 Skill 及版本

## 执行指令

### 生成 AGENTS.md

每个 MathArts 项目仓库都需要一个 `AGENTS.md`，告诉 Agent：

1. **仓库定位**：这个仓库是什么、做什么
2. **所属组织部分**：在 MathArts 生态中的位置
3. **应使用的 Skill**：列出应安装的 Skill 及版本
4. **可修改/谨慎修改的目录**：目录权限矩阵
5. **何时写 RFC/ADR**：触发条件
6. **文档风格规则**：遵循 `matharts-doc-design`
7. **领域规则**：由哪个领域 Skill 负责
8. **当前仓库特殊约束**：特定于该仓库的限制

### Skills 段格式

AGENTS.md 中的 Skills 段使用统一格式：

```markdown
## Skills

- matharts/skills/matharts-doc-design@v0.1.0
- matharts/skills/matharts-doc-rfc@v0.1.0
- matharts/skills/matharts-doc-adr@v0.1.0
```

- 每条以 `owner/repo/skill-name@<ref>` 形式书写
- 依赖项必须排在消费方之前
- 自动补全传递依赖并按拓扑顺序排序

### 依赖解析

根据各 Skill `SKILL.md` frontmatter 的 `metadata.extends` 与 `metadata.dependencies` 自动补全传递依赖并按拓扑顺序排序（依赖项排在消费方之前）。

### 审查 AGENTS.md

检查清单：
- [ ] 仓库定位清楚
- [ ] Skills 段格式正确
- [ ] 依赖排序正确（依赖项在前）
- [ ] 目录权限矩阵完整
- [ ] RFC/ADR 触发条件明确
- [ ] 无 deprecated Skill 引用

### 状态维护

定期检查 AGENTS.md 是否过时：
- Skill 版本更新后是否需要同步
- deprecated Skill 是否已替换
- 仓库结构变化后目录约定是否更新
```

- [ ] **Step 2: 创建 skills/matharts-agent-guide/README.md**

```markdown
# matharts-agent-guide

生成和维护各仓库的 `AGENTS.md`。

## 职责

- 生成项目仓库的 AGENTS.md
- 审查 AGENTS.md 是否过时
- 按仓库类型调整 Agent 规则
- 声明应安装的 Skill 与版本
- 自动解析依赖并按拓扑排序

## 安装

```bash
npx skills add matharts/skills --skill matharts-agent-guide -a opencode
```

## 状态

`experimental` — 结构和规则可能变化。
```

- [ ] **Step 3: 运行校验**

```bash
bun tools/validate-skill.ts --check all skills/matharts-agent-guide/
```

预期：`[PASS] matharts-agent-guide`

- [ ] **Step 4: Commit**

```bash
git add skills/matharts-agent-guide/
git commit -m "feat: add matharts-agent-guide skill"
```

---

### Task 10: 创建 matharts-repo-bootstrap

**Files:**
- Create: `skills/matharts-repo-bootstrap/SKILL.md`
- Create: `skills/matharts-repo-bootstrap/README.md`

**Design Ref:** DESIGN.md §6.3, §11, §12

**Interfaces:**
- Consumes: `matharts-agent-guide`（Task 9）的 AGENTS.md 生成能力
- Produces: 仓库初始化/标准化能力

- [ ] **Step 1: 创建 skills/matharts-repo-bootstrap/SKILL.md**

```markdown
---
name: matharts-repo-bootstrap
description: Initialize or standardize a MathArts repository to meet organizational conventions. Use when creating a new MathArts repository from scratch, standardizing an existing repository structure, generating base files like README AGENTS.md skeleton LICENSE and directory structure, or running an initialization checklist. Triggers on repo initialization, repository setup, new repository, bootstrap, standardize repository, repo scaffold.
license: MIT
compatibility: Designed for opencode and codex
metadata:
  version: "0.1.0"
  status: "experimental"
  category: "meta"
  tags: "bootstrap,repo-init,scaffold,standardize"
  maintainers: "@matharts/core"
---

# matharts-repo-bootstrap

初始化或标准化一个 MathArts 仓库（从零变成符合组织规范的基础仓库）。

## 何时使用

- 需要从零创建一个新的 MathArts 仓库
- 需要将现有仓库标准化为 MathArts 规范
- 需要生成基础文件骨架

## 执行指令

### 初始化新仓库

1. **基础目录结构**：

```text
project/
  README.md
  AGENTS.md          # 空骨架，标注"由 matharts-agent-guide 填充"
  LICENSE
  docs/
    rfcs/
    adr/
  .github/
    workflows/
    ISSUE_TEMPLATE/
    PULL_REQUEST_TEMPLATE.md
```

2. **README.md**：调用 `matharts-doc-readme` 生成
3. **AGENTS.md**：仅生成空骨架/占位符，标注"由 matharts-agent-guide 填充"
4. **LICENSE**：提示选择（默认 MIT）
5. **.github/workflows**：建议基础 CI 配置
6. **Issue/PR 模板**：建议标准模板
7. **docs/rfcs/ 和 docs/adr/**：创建空目录

### 与 matharts-agent-guide 的边界

| 方面 | bootstrap | agents-md |
| ---- | --------- | --------- |
| 阶段 | 仓库初始化一次性 | 初始化后持续维护 |
| AGENTS.md 产出 | 仅生成空骨架/占位符 | 填充和维护实质规则 |
| 其它文件 | 一次性生成全套基础文件 | 不负责 |

### 初始化 Checklist

- [ ] README.md 已生成
- [ ] AGENTS.md 骨架已创建
- [ ] LICENSE 已选择
- [ ] docs/ 目录已创建
- [ ] docs/rfcs/ 目录已创建
- [ ] docs/adr/ 目录已创建
- [ ] .github/ 基础配置已建议
- [ ] 推荐应安装的 Skill 已列出
- [ ] 初始化完毕后建议调用 `matharts-agent-guide` 填充 AGENTS.md

### 标准化现有仓库

对现有仓库运行标准化检查：
1. 检查缺失文件（README.md、AGENTS.md、LICENSE）
2. 检查目录结构（docs/、docs/rfcs/、docs/adr/）
3. 检查 .github/ 配置
4. 输出缺失项清单
5. 逐项补充或建议补充
```

- [ ] **Step 2: 创建 skills/matharts-repo-bootstrap/README.md**

```markdown
# matharts-repo-bootstrap

初始化或标准化一个 MathArts 仓库（从零变成符合组织规范的基础仓库）。

## 职责

- 从零初始化新 MathArts 仓库
- 标准化现有仓库结构
- 生成基础文件骨架（README、AGENTS.md 骨架、LICENSE 提示）
- 创建标准目录结构（docs/、docs/rfcs/、docs/adr/）
- 提供初始化 checklist

## 与 matharts-agent-guide 的关系

- `matharts-repo-bootstrap`：一次性初始化，生成 AGENTS.md 空骨架
- `matharts-agent-guide`：持续维护 AGENTS.md 实质规则

## 安装

```bash
npx skills add matharts/skills --skill matharts-repo-bootstrap -a opencode
```

## 状态

`experimental` — 结构和规则可能变化。
```

- [ ] **Step 3: 运行校验**

```bash
bun tools/validate-skill.ts --check all skills/matharts-repo-bootstrap/
```

预期：`[PASS] matharts-repo-bootstrap`

- [ ] **Step 4: Commit**

```bash
git add skills/matharts-repo-bootstrap/
git commit -m "feat: add matharts-repo-bootstrap skill"
```

---

## 阶段五：工具链与 CI/CD（Task 11-12）

### Task 11: 创建 tools/sync-shared-source.ts

**Files:**
- Create: `tools/sync-shared-source.ts`
- Create: `internal/shared-source/.gitkeep`

**Design Ref:** DESIGN.md §3.4, §3.4.1

**Interfaces:**
- Consumes: `internal/shared-source/` 目录内容
- Produces: 物理复制共享内容到各 Skill 的 `references/` 和 `assets/`
- 依赖 Task 4-8 全部完成

- [ ] **Step 1: 创建 internal/shared-source/.gitkeep**

创建目录结构占位：

```bash
mkdir -p internal/shared-source
touch internal/shared-source/.gitkeep
```

- [ ] **Step 2: 创建 tools/sync-shared-source.ts**

```typescript
#!/usr/bin/env bun
/**
 * 将 internal/shared-source/ 的内容单向物理复制进各 Skill 的 references/ 和 assets/。
 *
 * 用法:
 *     bun tools/sync-shared-source.ts [--interactive] [--rollback] [--dry-run]
 *
 * 同步方向: internal/shared-source/ → skills/*/references/ 和 skills/*/assets/
 * Skill 侧的本地修改不应反向同步回 internal/。
 */

import { parseArgs } from "util";
import { readdir, readFile, writeFile, mkdir, cp, rm, access } from "fs/promises";
import { join, relative, resolve, sep } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(join(__filename, "..", ".."));
const SHARED_SOURCE = join(REPO_ROOT, "internal", "shared-source");
const SKILLS_DIR = join(REPO_ROOT, "skills");
const BACKUP_DIR = join(REPO_ROOT, ".sync-backup");

async function fileExists(p: string): Promise<boolean> {
  try { await access(p); return true; } catch { return false; }
}

async function readDirRecursive(dir: string, ext?: string): Promise<string[]> {
  const results: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true, recursive: true });
    for (const entry of entries) {
      const name = entry.toString();
      if (!ext || name.endsWith(ext)) {
        results.push(join(dir, name));
      }
    }
  } catch { /* dir not found */ }
  return results;
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

async function backupTargets(skillDir: string, skillName: string, filesToCopy: string[]): Promise<string> {
  const ts = timestamp();
  const backupRoot = join(BACKUP_DIR, `${skillName}_${ts}`);
  await mkdir(backupRoot, { recursive: true });

  for (const src of filesToCopy) {
    if (await fileExists(src)) {
      const rel = relative(skillDir, src);
      const dst = join(backupRoot, rel);
      await mkdir(join(dst, ".."), { recursive: true });
      await cp(src, dst);
    }
  }

  return backupRoot;
}

async function syncFile(src: string, dst: string, interactive: boolean, dryRun: boolean, repoRoot: string): Promise<boolean> {
  if (!(await fileExists(src))) {
    console.error(`  WARN: source not found: ${src}`);
    return false;
  }

  if ((await fileExists(dst)) && interactive) {
    // Bun 环境下简化为非交互模式
    console.log(`  OVERWRITE: ${dst}`);
  }

  if (dryRun) {
    console.log(`  DRY-RUN: ${src} -> ${dst}`);
    return true;
  }

  await mkdir(join(dst, ".."), { recursive: true });
  await cp(src, dst);
  console.log(`  SYNC: ${relative(repoRoot, src)} -> ${relative(repoRoot, dst)}`);
  return true;
}

async function collectFiles(dir: string, ext?: string): Promise<string[]> {
  if (!(await fileExists(dir))) return [];
  return readDirRecursive(dir, ext);
}

async function syncSharedSource(interactive: boolean, dryRun: boolean): Promise<void> {
  if (!(await fileExists(SHARED_SOURCE))) {
    console.error(`ERROR: ${SHARED_SOURCE} not found`);
    process.exit(1);
  }

  const entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  const skillDirs = entries
    .filter(e => e.isDirectory() && !e.name.startsWith("."))
    .map(e => e.name)
    .sort();

  if (skillDirs.length === 0) {
    console.warn("WARNING: no skill directories found");
    return;
  }

  const sharedRefs = await collectFiles(join(SHARED_SOURCE, "references"), ".md");
  const sharedAssets = await collectFiles(join(SHARED_SOURCE, "assets"));

  if (sharedRefs.length === 0 && sharedAssets.length === 0) {
    console.log("No shared files to sync");
    return;
  }

  for (const skillName of skillDirs) {
    const skillDir = join(SKILLS_DIR, skillName);
    console.log(`\n[${skillName}]`);

    const filesToCopy: string[] = [];
    for (const refFile of sharedRefs) {
      const rel = relative(join(SHARED_SOURCE, "references"), refFile);
      filesToCopy.push(join(skillDir, "references", rel));
    }
    for (const assetFile of sharedAssets) {
      const rel = relative(join(SHARED_SOURCE, "assets"), assetFile);
      filesToCopy.push(join(skillDir, "assets", rel));
    }

    if (!dryRun) {
      await backupTargets(skillDir, skillName, filesToCopy);
    }

    for (const refFile of sharedRefs) {
      const rel = relative(join(SHARED_SOURCE, "references"), refFile);
      const target = join(skillDir, "references", rel);
      await syncFile(refFile, target, interactive, dryRun, REPO_ROOT);
    }

    for (const assetFile of sharedAssets) {
      const rel = relative(join(SHARED_SOURCE, "assets"), assetFile);
      const target = join(skillDir, "assets", rel);
      await syncFile(assetFile, target, interactive, dryRun, REPO_ROOT);
    }
  }

  console.log("\nSync complete.");
}

async function rollback(): Promise<void> {
  if (!(await fileExists(BACKUP_DIR))) {
    console.log("No backup directory found");
    return;
  }

  const backups = (await readdir(BACKUP_DIR)).sort().reverse();
  if (backups.length === 0) {
    console.log("No backups available");
    return;
  }

  const latest = backups[0];
  const latestPath = join(BACKUP_DIR, latest);
  console.log(`Rolling back to: ${latest}`);

  const backupFiles = await readDirRecursive(latestPath);
  const skillName = latest.split("_")[0];

  for (const backupFile of backupFiles) {
    const rel = relative(latestPath, backupFile);
    const target = join(SKILLS_DIR, skillName, rel);
    await mkdir(join(target, ".."), { recursive: true });
    await cp(backupFile, target);
    console.log(`  RESTORE: ${rel}`);
  }

  console.log("Rollback complete.");
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      interactive: { type: "boolean", default: false },
      rollback: { type: "boolean", default: false },
      "dry-run": { type: "boolean", default: false },
    },
  });

  if (values.rollback) {
    await rollback();
  } else {
    await syncSharedSource(values.interactive!, values["dry-run"]!);
  }
}

main();
```

- [ ] **Step 3: 验证工具可运行**

```bash
bun tools/sync-shared-source.ts --dry-run
```

预期：无报错，显示 "No shared files to sync" 或列出当前共享文件。

- [ ] **Step 4: Commit**

```bash
git add tools/sync-shared-source.ts internal/shared-source/.gitkeep
git commit -m "feat: add sync-shared-source.ts for internal shared content distribution"
```

---

### Task 12: 创建 CI/CD 工作流与 docs/guides/

**Files:**
- Create: `.github/workflows/validate.yml`
- Create: `docs/guides/SKILL_AUTHORING_GUIDE.md`

**Design Ref:** DESIGN.md §9 (CI/CD), §10 (docs/guides/)

**Interfaces:**
- Consumes: validate-skill.ts（Task 3）
- Produces: CI 自动校验 + Skill 编写指南

- [ ] **Step 1: 创建 .github/workflows/validate.yml**

```yaml
name: Validate Skills

on:
  push:
    paths:
      - 'skills/**'
      - 'tools/**'
  pull_request:
    paths:
      - 'skills/**'
      - 'tools/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: L0 - Frontmatter validation
        run: bun tools/validate-skill.ts --check frontmatter

      - name: L1 - Structure validation
        run: bun tools/validate-skill.ts --check structure

      - name: L2 - Self-contained validation
        run: bun tools/validate-skill.ts --check selfcontained

      - name: L3 - Snapshot validation (warning only)
        run: bun tools/validate-skill.ts --check snapshot
        continue-on-error: true
```

- [ ] **Step 2: 创建 docs/guides/SKILL_AUTHORING_GUIDE.md**

```markdown
# Skill 编写指南

本指南说明如何创建一个符合 MathArts 规范的 Agent Skill。

## 目录结构

最小结构（第一阶段）：

```text
skills/<skill-name>/
  SKILL.md      # 必需：frontmatter + 执行指令
  README.md     # 必需：面向人类的说明
```

完整结构（按需添加）：

```text
skills/<skill-name>/
  SKILL.md
  README.md
  scripts/      # 可执行脚本
  references/   # 按需加载的参考文档
  assets/       # 模板与静态资源
  examples/     # 正反例
  tests/        # 测试 fixtures
```

## SKILL.md 格式

### Frontmatter

```yaml
---
name: <skill-name>          # 必须匹配目录名
description: <描述>           # <= 1024 字符，含触发词
license: MIT
compatibility: <兼容性说明>
metadata:
  version: "0.1.0"
  status: "experimental"
  category: "<分类>"
  tags: "<逗号分隔标签>"
  extends: "<基础 Skill>"     # 可选
  dependencies: "<依赖列表>"   # 可选
  maintainers: "<维护者>"
---
```

### 正文

- 不超过 500 行
- 包含"何时使用"和"执行指令"
- 超出内容拆入 `references/`，正文中指明加载时机

## description 写作指南

description 是 Agent 决定是否激活 Skill 的唯一依据。

- 必须包含"做什么"：具体动作和产物类型
- 必须包含"何时使用"：触发场景关键词
- 禁止模糊表述（如"通用文档助手"）

## 校验

创建完成后运行：

```bash
bun tools/validate-skill.ts --check all skills/<skill-name>/
```

确保全部 PASS。
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/validate.yml docs/guides/SKILL_AUTHORING_GUIDE.md
git commit -m "feat: add CI validation workflow and skill authoring guide"
```

---

## 阶段六：全量校验与收尾（Task 13）

### Task 13: 全量校验与集成测试

**Files:**
- 无新建文件

**Design Ref:** DESIGN.md §19

**Interfaces:**
- Consumes: Task 1-12 全部产出
- Produces: Phase 1 验收通过确认

- [ ] **Step 1: 运行全量校验**

```bash
bun tools/validate-skill.ts --check all
```

预期：所有 7 个 Skill 均 `[PASS]`。

- [ ] **Step 2: 验证目录结构**

确认仓库结构符合 DESIGN.md §11 最小结构：

```text
matharts-skills/
  README.md / LICENSE / AGENTS.md
  skills/
    matharts-agent-skill-dev/      {SKILL.md, README.md}
    matharts-doc-design/           {SKILL.md, README.md}
    matharts-repo-bootstrap/       {SKILL.md, README.md}
    matharts-agent-guide/          {SKILL.md, README.md}
    matharts-doc-readme/           {SKILL.md, README.md, assets/templates/README.template.md}
    matharts-doc-rfc/              {SKILL.md, README.md, assets/templates/RFC.template.md}
    matharts-doc-adr/              {SKILL.md, README.md, assets/templates/ADR.template.md}
  docs/guides/SKILL_AUTHORING_GUIDE.md
  tools/validate-skill.ts
```

- [ ] **Step 3: 验证验收标准（DESIGN §19）**

逐项检查：

- [ ] 仓库定位清楚；README.md 说明清楚
- [ ] AGENTS.md 说明清楚 Agent 如何维护本仓库
- [ ] 每个 Skill 有 SKILL.md + README.md；不存在 skill.json 或 VERSION
- [ ] SKILL.md frontmatter 的 name 与父目录名一致
- [ ] description <= 1024 字符且含触发词
- [ ] MathArts 扩展字段全部位于 metadata，值均为 string
- [ ] 第一批 Skill 不依赖仓库根共享文件
- [ ] validate-skill.ts L0+L1+L2 全部通过
- [ ] internal/shared-source 工作流文档化
- [ ] 没有将正式 standards 职责混入本仓库
- [ ] 没有领域算法 Skill 混入第一批
- [ ] matharts-doc-design 已作为基础层存在
- [ ] readme/rfc/adr 的 extends/dependencies 正确声明对 design 的依赖
- [ ] tools/validate-skill.ts 可在 CI 中运行

- [ ] **Step 4: 手工安装一条龙测试**

```bash
# 在临时目录测试安装
mkdir /tmp/test-install && cd /tmp/test-install
npx skills add matharts/skills --skill matharts-doc-rfc -a opencode
# 确认 .agents/skills/matharts-doc-rfc/ 存在且包含 SKILL.md
```

> 注：此步骤需要仓库已推送到 GitHub。如尚未推送，可手动复制 Skill 目录到 `.agents/skills/` 模拟安装。

- [ ] **Step 5: 最终 Commit**

```bash
git add -A
git commit -m "chore: phase 1 complete — all 7 skills, toolchain, CI, and docs validated"
```

---

## 任务总览与时间估算

| Task | 内容 | 前置依赖 | 可并行 | 预计时间 |
| ---- | ---- | -------- | ------ | -------- |
| 1 | README.md | 无 | 与 Task 3 并行 | 30 min |
| 2 | AGENTS.md | Task 1 | — | 30 min |
| 3 | validate-skill.ts | 无 | 与 Task 1-2 并行 | 2 hr |
| 4 | matharts-agent-skill-dev | Task 3 | 与 Task 5 并行 | 1 hr |
| 5 | matharts-doc-design | Task 3 | 与 Task 4 并行 | 1 hr |
| 6 | matharts-doc-readme | Task 3+5 | 与 Task 7-8 并行 | 1 hr |
| 7 | matharts-doc-rfc | Task 3+5 | 与 Task 6-8 并行 | 1 hr |
| 8 | matharts-doc-adr | Task 3+5 | 与 Task 6-7 并行 | 1 hr |
| 9 | matharts-agent-guide | Task 2 | — | 1 hr |
| 10 | matharts-repo-bootstrap | Task 9 | — | 1 hr |
| 11 | sync-shared-source.ts | Task 4-8 | — | 1 hr |
| 12 | CI/CD + docs/guides/ | Task 3 | 与 Task 4-10 并行 | 30 min |
| 13 | 全量校验与收尾 | Task 1-12 | — | 1 hr |

**总预计：约 12-15 小时工作量（2-4 个工作日）**

---

## 第二阶段可选内容（不在本计划范围）

以下内容标记为 🟡，根据实际需求在后续选择性实施：

- `internal/shared-source/` 实际内容填充
- `.github/workflows/release.yml`（自动发布流程）
- `scripts/` 安全规范实施
- metadata 扩展治理流程
- 离线安装方案 2-3（内部 Git 镜像、打包分发）
- 废弃与替代流程（§14.1）
- 预发布版本规范（Alpha/Beta/RC）
- L3 快照测试实施
- 响应时间承诺
- 更多 docs/guides/ 文件（REVIEW/VERSIONING/INSTALLATION）
