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
