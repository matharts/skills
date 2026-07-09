# matharts-doc-design

MathArts 文档设计诊断与改写基准层。它统一结构、视觉层级、Markdown 排版、信息密度和阅读体验。

## 双模式

| 模式 | 触发 | 输出 |
| ---- | ---- | ---- |
| 审查模式 | review、审查、评审、检查 | 问题清单、风险、修改建议 |
| 改写模式 | 优化、改写、整理、标准化、美化 | 直接编辑文档并总结变更 |

意图不清楚时默认使用审查模式，避免贸然改原文。

## 诊断维度

- 文档入口是否清楚
- 信息架构和标题层级是否连续
- 视觉层级是否便于扫描
- 信息密度是否合适
- 命令、路径、模板是否可执行
- 中英文混排、表格、代码块、提示块是否一致
- 是否存在过期入口、矛盾描述或未经确认的事实

## 改写原则

- 不改变事实和技术含义
- 不凭空补状态、负责人、日期或版本
- 优先重排结构，再润色句子，最后统一排版
- 保留用户已有术语
- 对不确定内容使用 `TODO:` 或提出问题
- 不把短文档过度复杂化

## 职责

- 审查和改写通用 MathArts 文档
- 统一标题层级与编号规则
- 规范元信息区、中英文混排、表格、代码块、提示块、Mermaid 图示
- 控制段落密度和视觉层级
- 为 README/RFC/ADR 等文档类 Skill 提供基础风格层

## 被依赖

以下 Skill 通过 `metadata.extends` 继承本 Skill 的文档设计规则：

- `matharts-doc-readme`
- `matharts-doc-rfc`
- `matharts-doc-adr`

## 安装

```bash
npx skills add matharts/skills --skill matharts-doc-design -a opencode
```

## 状态

`experimental` — 结构和规则可能变化。
