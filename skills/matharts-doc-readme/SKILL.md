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
