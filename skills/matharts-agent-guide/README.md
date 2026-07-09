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
