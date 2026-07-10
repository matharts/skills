---
name: matharts-agent-skill-dev
description: Create, review, and maintain MathArts Agent Skill packages. Use when scaffolding a new skill, checking self-containment, writing SKILL.md frontmatter, reviewing skill size or scope, deciding whether to split or delegate a skill, or maintaining skill lifecycle. Triggers on skill development, skill scaffolding, skill review, skill creation, new capability, skill lifecycle.
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
6. 运行 `bun tools/cli.ts validate --check all skills/<skill-name>/` 确认通过

### 审查 Skill

检查清单：
- [ ] `name` 匹配目录名
- [ ] `description` <= 1024 字符，包含"做什么"+"何时使用"触发词
- [ ] `metadata` 值全为 string
- [ ] `SKILL.md` 正文 <= 500 行
- [ ] 无 `skill.json` 或 `VERSION` 文件
- [ ] 分发态自包含，无 `internal/` 引用
- [ ] 无跨 Skill 相对路径回溯
- [ ] 规则由单元测试覆盖；复杂行为保留场景、rubric 和期望输出

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
