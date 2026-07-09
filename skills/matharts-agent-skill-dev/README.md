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
