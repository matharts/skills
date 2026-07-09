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
