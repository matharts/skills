---
name: matharts-doc-design
description: Use when document design, structure, readability, or style is the primary concern for MathArts Markdown docs, including review, rewrite, formatting, visual hierarchy, CJK-Latin spacing, tables, code blocks, callouts, Mermaid diagrams, and documentation reading experience.
license: MIT
compatibility: Designed for opencode and codex
metadata:
  version: "0.1.0"
  status: "experimental"
  category: "documentation"
  tags: "typography,markdown,formatting,visual-hierarchy,document-design,review,rewrite"
  maintainers: "@matharts/core"
---

# matharts-doc-design

MathArts 文档设计诊断与改写基准层。它负责文档的结构、视觉层级、排版一致性和阅读体验；不负责虚构事实、替用户做业务结论，或替代 README/RFC/ADR 等具体文档 Skill 的内容规则。

## 何时使用

- 需要审查文档结构、排版、信息密度或阅读体验
- 需要优化、改写、整理、标准化、润色 Markdown 文档
- 需要统一标题、表格、代码块、提示块、Mermaid 图示、中英文混排
- 需要给 README、RFC、ADR、指南、计划、`AGENTS.md` 提供通用文档设计基线

## 何时不用

- 需要 README 内容完整性时，用 `matharts-doc-readme`
- 需要 RFC 字段合同时，用 `matharts-doc-rfc`
- 需要 ADR 状态流转或决策记录合同时，用 `matharts-doc-adr`
- 只问事实内容时，不使用本 Skill
- 通用风格建议与下游 Skill 冲突时，以下游 Skill 为准

## 工作模式

先判断用户意图，再选择审查、改写或组合模式。组合模式优先于单一模式。

| 用户表达 | 模式 | 行为 |
| -------- | ---- | ---- |
| 同时要求审查和改写 | 组合模式 | 先审查，再改写；除非用户要求保留审查报告，否则最终只输出修改结果和简短摘要 |
| 用户说 `review`、审查、评审、检查 | 审查模式 | 只输出问题清单、风险和修改建议，不直接改文件 |
| 用户说优化、改写、整理、标准化、美化 | 改写模式 | 目标文件明确且在工作区内时直接编辑文档，并在最后给简短变更说明 |
| 用户意图不清楚 | 审查模式 | 先给建议，避免贸然改原文 |

## 审查模式

以问题优先，按影响排序。重点指出会影响理解、维护、安装、评审或下游执行的问题。

只列 actionable findings：

- 不输出泛泛优点、鼓励性评价或“整体不错”之类的填充内容
- 每条 finding 必须包含具体位置、影响和建议动作
- 没有可行动问题时，明确说“未发现需要修改的问题”，再列剩余风险或测试缺口
- 不把个人偏好包装成缺陷；只有影响读者任务、维护成本或协作流程时才列为问题
- 同类小问题合并为一条，避免噪声淹没真正风险

所有审查先输出 findings：

```markdown
## Findings

- [P1|P2|P3] <问题标题>
  位置：<文件、章节或行号>
  影响：<它如何影响读者任务、维护成本或协作流程>
  建议：<可执行的修改动作>
```

每个实际问题重复一次；不为满足数量补问题。

只有存在信息架构或章节顺序问题时，才输出 `Suggested Shape`。此时在 findings 后追加：

```markdown
## Suggested Shape

<建议的文档结构或关键段落顺序。>
```

纯排版问题不追加结构建议。

不推荐输出：

```markdown
- 文档整体不错，但还可以更清晰。
```

这种输出没有位置、影响和建议动作，不能帮助维护者判断优先级或直接修改。

严重度定义：

| 等级 | 含义 |
| ---- | ---- |
| P1 | 会误导读者、破坏流程、造成安装/执行风险 |
| P2 | 明显降低可读性、可维护性或审查效率 |
| P3 | 风格一致性、措辞、局部排版问题 |

## 改写模式

按输入形态选择动作：

- 用户提供文本片段：直接返回改写稿，不修改文件
- 用户给出唯一且可写的工作区文件：直接修改该文件
- 存在多个候选目标且无法可靠判断：先确认目标
- 目标不存在或不可写：说明原因并返回建议稿

改写时保持事实和技术含义不变。优先重排结构，再润色句子，最后统一排版。

改写原则：

- 不改变事实、技术约束、接口语义或决策结论
- 不凭空补业务背景、状态、负责人、日期或版本
- 保留用户已有术语；只统一明显不一致的写法
- 对不确定内容使用 `TODO:` 或在结果中提出问题
- 不把短文档过度复杂化；能用清晰段落解决时不强行加表格
- 不把所有内容都整理成三段式；让结构服务内容，而不是反过来

完成后简短说明：

```markdown
已优化：<文件>

主要调整：
- <结构或层级调整>
- <排版或可读性调整>
```

## 风格参考

涉及文档入口、读者路径、文档类型或开源协作结构时读取 `references/open-source-style.md`。中文技术写作风格任务也读取此参考。纯排版任务不加载该参考。

只有下游 Skill 明确要求时，才把字段缺失列为 finding；基础层不自行定义 README、RFC 或 ADR 的必填字段。

## 诊断维度

| 维度 | 检查点 |
| ---- | ------ |
| 文档入口 | 开头是否快速说明这是什么、给谁用、怎么开始 |
| 信息架构 | 章节顺序是否符合读者任务路径，标题是否连续 |
| 视觉层级 | 标题、表格、列表、代码块是否形成可扫描结构 |
| 信息密度 | 长段是否可拆分，列表是否过长，是否需要分组 |
| 可信边界 | 是否混入未经确认的事实、状态、版本或承诺 |
| 执行可用性 | 命令、路径、模板、示例是否能被直接复制或跟随 |
| 维护性 | 是否有重复规则、过期入口、矛盾描述或悬空引用 |
| 排版一致性 | 中英文混排、标点、表格、代码块、提示块是否统一 |

## 示例层

当规则不够具体时，按需读取 `examples/` 中的示例，不要把示例全文复制进目标文档。

### 示例选择规则

默认只读取与当前任务类型最接近的一个示例。只有任务同时包含多个独立目标，例如“README 结构重排 + 中文措辞改写”时，才分别读取对应示例。示例用于校准结构和语气，不用于补充目标文档中不存在的事实。

| 场景 | 示例 |
| ---- | ---- |
| README 入口、快速开始、常见任务重排 | `examples/before-after-readme.md` |
| RFC 从简短想法升级为可评审提案 | `examples/before-after-rfc.md` |
| 中文技术文档去口号、去翻译腔、稳定术语 | `examples/before-after-zh-style.md` |
| 审查模式输出 findings 和 suggested shape | `examples/review-findings.md` |
| 改写模式完成后的简短总结 | `examples/rewrite-summary.md` |

## 排版规则

### 标题层级

- 一级标题 `#` 仅用于文档标题，每文档仅一个
- 标题层级不跳级（`##` → `###`，不 `##` → `####`）
- 章节编号只在长文档或规范文档中使用；短 README 不强制编号
- 标题描述读者任务或内容主题，避免只写“其他”“说明”“补充”

### 元信息区

规范、计划、RFC、ADR 类文档在标题下方使用元信息表格。普通 README 不强制。

```markdown
| 属性     | 值                    |
| -------- | --------------------- |
| 文档状态 | Draft / Review / Final |
| 版本     | x.y.z                 |
```

### 中英文混排

- 中文与英文/数字之间加一个半角空格
- 专有名词保持原文大小写，如 `AGENTS.md`、`SKILL.md`、`README.md`
- 中文标点使用全角，英文命令、路径、代码中的标点保持原样

### 表格

- 表头与分隔行必须对齐
- 单元格内容前后各留一个空格
- 空单元格使用 `—` 占位
- 表格用于比较、元信息、矩阵和清单；不要用表格包裹普通段落

### 代码块

- 必须标注语言，如 `bash`、`markdown`、`typescript`
- 行内命令、路径、字段名使用反引号
- 命令示例应尽量可复制；需要占位时使用清晰的 `<placeholder>`

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
- 只在流程或关系比文字更清楚时使用图示

### 段落密度

- 段落之间空一行
- 一个段落通常表达一个观点
- 列表难以扫描时，按读者任务或主题分组；只有比较关系明确时才改成表格
- 章节同时承载多个独立任务或需要频繁滚动时，再增加标题或拆分文档

### 文档状态标识

| 状态 | 含义 |
| ---- | ---- |
| Draft | 草稿，内容可能大幅变化 |
| Review | 评审中，收集反馈 |
| Final | 定稿，变更需走 RFC |

## 与其他 Skill 的关系

本 Skill 是基础风格层，被 `matharts-doc-readme`、`matharts-doc-rfc`、`matharts-doc-adr` 等消费。`metadata.extends` 只声明依赖关系，不会自动加载本 Skill。消费方必须明确要求 Agent 同时加载本 Skill，再补充各自的内容结构、字段和流程要求。

硬边界：

- `matharts-doc-design` 只管结构、层级、排版、语气、读者路径和可读性
- `matharts-doc-design` 可以建议 README/RFC/ADR 的章节顺序，但不定义必填字段
- `matharts-doc-rfc` 才定义 RFC 内容合同、生命周期和评审字段
- `matharts-doc-adr` 才定义 ADR 决策记录格式和状态流转
- `matharts-doc-readme` 才定义 README 的项目入口、安装、使用和发布信息要求
- 当通用风格建议与下游 Skill 的内容合同冲突时，以下游 Skill 为准
