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
