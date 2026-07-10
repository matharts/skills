---
name: matharts-doc-rfc
description: Create, review, and standardize MathArts RFC documents. Use when proposing major changes to architecture, API, standards, algorithms, repository structure, or governance workflows. Triggers on RFC, proposal, design review, RFE, change request, major change, architecture decision, API change.
license: MIT
compatibility: Designed for opencode and codex
metadata:
  version: "0.1.0"
  status: "experimental"
  category: "documentation"
  tags: "rfc,proposal,design-review,change-request"
  extends: "matharts-doc-design"
  dependencies: "matharts-doc-design>=0.1.0"
  maintainers: "@matharts/core"
---

# matharts-doc-rfc

生成和审查重大变更提案（事前讨论文档）。

`metadata.extends` 只声明依赖关系。执行本 Skill 时，必须同时加载并遵循 `matharts-doc-design`；若两者冲突，以本 Skill 的 RFC 内容合同为准。

## 何时使用

- 需要提出影响架构、API、标准、算法策略的重大变更
- 需要提出影响仓库结构、治理流程的变更
- 需要正式的讨论和审查流程

## 执行指令

### 生成 RFC

1. 在 `docs/rfcs/` 目录创建 `RFC-<NNN>-<slug>.md`
2. 按以下结构编写，遵循 `matharts-doc-design` 排版规则：
   - **元信息区**：状态（Draft）、作者、日期
   - **背景**：为什么需要这个变更
   - **动机**：解决什么问题
   - **目标**：本次变更要达成的目标
   - **非目标**：明确不在本次范围内的内容
   - **设计方案**：详细的技术方案
   - **替代方案**：考虑过的其他方案及不选择的原因
   - **兼容性**：向后兼容性分析
   - **迁移策略**：如何从当前状态迁移到新状态
   - **开放问题**：尚未确定的问题
   - **讨论入口**：如何参与讨论（Issue 链接等）

### 状态管理

| 状态 | 含义 |
| ---- | ---- |
| Draft | 草稿，正在编写 |
| Review | 进入评审，收集反馈 |
| Accepted | 通过，准备实施 |
| Rejected | 被拒绝 |
| Withdrawn | 作者撤回 |

### RFC → ADR 衔接

RFC 被 `Accepted` 后，由 `matharts-doc-adr` Skill 自动生成对应 ADR 文件。

### 审查 RFC

检查清单：
- [ ] 背景与动机清楚
- [ ] 目标与非目标明确
- [ ] 设计方案详细可执行
- [ ] 替代方案已考虑
- [ ] 兼容性分析完整
- [ ] 迁移策略可行
- [ ] 遵循 `matharts-doc-design` 排版规则

### 模板

生成时参考 `assets/templates/RFC.template.md`。
