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
