# matharts-doc-design

MathArts 文档设计诊断与改写基准层。它统一结构、视觉层级、Markdown 排版、信息密度和阅读体验。

## 工作模式

| 模式 | 触发 | 输出 |
| ---- | ---- | ---- |
| 组合模式 | 同时要求审查和改写 | 先审查再改写，默认只总结最终修改 |
| 审查模式 | review、审查、评审、检查 | 问题清单、风险、修改建议 |
| 改写模式 | 优化、改写、整理、标准化、美化 | 目标文件明确时直接编辑文档并总结变更 |

意图不清楚时默认使用审查模式，避免贸然改原文。

审查模式只列 actionable findings：每条问题必须说明位置、影响和建议动作。不输出泛泛优点，不把个人偏好包装成缺陷。

改写片段时直接返回改写稿；目标唯一且可写时直接修改；存在多个候选目标时先确认。`Suggested Shape` 只用于信息架构或章节顺序问题。

## Quick Start

| 目标 | 说法 |
| ---- | ---- |
| 只审查文档 | `review 这个 README` |
| 直接优化文件 | `优化 docs/guide.md` |
| 不确定怎么改 | `先审查，再给 suggested shape` |
| 统一中文风格 | `按 MathArts 中文技术文档风格改写` |

## Advanced Usage

- 示例选择：默认只读取最相关的一个示例；任务包含多个独立目标时，再分别读取对应示例。
- 下游优先：README/RFC/ADR 的内容合同由对应下游 Skill 定义，本 Skill 只处理结构、层级、语气和可读性。

## 诊断维度

- 文档入口是否清楚
- 信息架构和标题层级是否连续
- 视觉层级是否便于扫描
- 信息密度是否合适
- 命令、路径、模板是否可执行
- 中英文混排、表格、代码块、提示块是否一致
- 是否存在过期入口、矛盾描述或未经确认的事实

## Open Source Markdown Style System

完整规则以 `references/open-source-style.md` 为唯一来源。Agent 在任务涉及文档入口、读者路径、文档类型、开源协作结构或中文技术写作风格时读取该文件；纯排版任务不加载。

## 示例层

需要更具体的写法时读取这些示例：

| 示例 | 用途 |
| ---- | ---- |
| `examples/before-after-readme.md` | README 入口、快速开始、常见任务重排 |
| `examples/before-after-rfc.md` | RFC 从简短想法升级为可评审提案 |
| `examples/before-after-zh-style.md` | 中文技术文档去口号、去翻译腔、稳定术语 |
| `examples/review-findings.md` | 审查模式输出 findings 和 suggested shape |
| `examples/rewrite-summary.md` | 改写模式完成后的简短总结 |

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

硬边界：

- `matharts-doc-design` 只管结构、层级、排版、语气、读者路径和可读性
- README/RFC/ADR 的必填字段、生命周期和内容合同由对应下游 Skill 定义
- 通用风格建议与下游 Skill 冲突时，以下游 Skill 为准

## 被依赖

以下 Skill 通过 `metadata.extends` 声明对本 Skill 的依赖：

- `matharts-doc-readme`
- `matharts-doc-rfc`
- `matharts-doc-adr`

`metadata.extends` 不会触发自动安装或加载。消费方必须明确要求 Agent 同时加载并遵循 `matharts-doc-design`。

## 安装

```bash
npx skills add matharts/skills --skill matharts-doc-design -a opencode
```

## 状态

`experimental` — 结构和规则可能变化。
