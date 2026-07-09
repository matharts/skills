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
  package.json / bun.lock          # Bun 项目配置
  skills/
    matharts-agent-skill-dev/      # 创建/审查/维护 Skill 包（元 Skill）
    matharts-doc-design/           # 统一文档排版、Markdown 样式、视觉层级
    matharts-repo-bootstrap/       # 初始化或标准化 MathArts 仓库
    matharts-agent-guide/          # 生成和维护 AGENTS.md
    matharts-doc-readme/           # 生成和审查项目 README.md
    matharts-doc-rfc/              # 生成和审查重大变更提案
    matharts-doc-adr/              # 记录已接受的重要决策
  docs/
    guides/                         # Skill 编写/审查/版本/安装指南
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
# 安装依赖
bun install

# 校验所有 Skill
bun tools/validate-skill.ts --check all

# 仅校验规范合规
npx skills-ref validate skills/*/
```

## 许可证

MIT License. See `LICENSE`.
