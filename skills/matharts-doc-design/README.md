# matharts-doc-design

统一 MathArts 文档排版、Markdown 样式、视觉层级与阅读体验。只负责"长相"，不负责具体文档内容。

## 职责

- 标题层级与编号规则
- 元信息区格式
- 中英文混排规范
- 表格/代码块/引用块样式
- NOTE/WARNING/IMPORTANT 格式
- Mermaid 图示规范
- 段落密度控制
- 文档状态标识

## 被依赖

以下 Skill 通过 `metadata.extends` 继承本 Skill 的排版规则：

- `matharts-doc-readme`
- `matharts-doc-rfc`
- `matharts-doc-adr`

## 安装

```bash
npx skills add matharts/skills --skill matharts-doc-design -a opencode
```

## 状态

`experimental` — 结构和规则可能变化。
