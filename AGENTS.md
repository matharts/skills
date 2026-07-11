# AGENTS.md — matharts/skills

## 仓库定位

`matharts/skills` 是 MathArts Foundation 层的 Agent Capability Registry，遵循 [agentskills.io](https://agentskills.io) 规范。仓库职责边界、依赖方向和生命周期以 [`CHARTER.md`](CHARTER.md) 为准。

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
| `CHARTER.md` | 仓库层级、职责边界、所有权和生命周期 | 谨慎（需 RFC） |
| `AGENTS.md` | 本文件 | 是（由 matharts-agent-guide 维护） |
| `LICENSE` | MIT 许可证 | 否 |
| `docs/DESIGN.md` | 仓库设计文档 | 谨慎（需 RFC） |

## 校验要求

所有 PR 必须通过：
- L0：frontmatter 规范校验（`skills-ref validate`）
- L1：结构校验（必备文件、行数限制、无 `internal/` 引用）
- L2：自包含校验（复制到 sandbox 后无路径回溯）

运行：`bun tools/cli.ts validate --check all`

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
