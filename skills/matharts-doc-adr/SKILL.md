---
name: matharts-doc-adr
description: Record accepted architecture and design decisions as ADR documents. Use when documenting an important decision that has been made, recording decision rationale, tracking superseded decisions, or converting an accepted RFC into an ADR. Triggers on ADR, architecture decision, decision record, decision rationale, why we decided, decision history.
license: MIT
compatibility: Designed for opencode and codex
metadata:
  version: "0.1.0"
  status: "experimental"
  category: "documentation"
  tags: "adr,decision,architecture-decision,decision-record"
  extends: "matharts-doc-design"
  dependencies: "matharts-doc-design>=0.1.0"
  maintainers: "@matharts/core"
---

# matharts-doc-adr

记录已经接受的重要决策（事后记录文档）。

`metadata.extends` 只声明依赖关系。执行本 Skill 时，必须同时加载并遵循 `matharts-doc-design`；若两者冲突，以本 Skill 的 ADR 内容合同为准。

## 何时使用

- RFC 被 Accepted 后需要记录最终决策
- 需要记录一个重要决策的背景和理由
- 需要追踪被替代的决策

## 执行指令

### 生成 ADR

1. 在 `docs/adr/` 目录创建 `ADR-<NNN>-<slug>.md`
2. 按以下结构编写，遵循 `matharts-doc-design` 排版规则：
   - **元信息区**：状态（Accepted）、日期、supersedes（如有）
   - **决策背景**：什么情况下需要做这个决策
   - **最终决定**：做了什么决定
   - **决策理由**：为什么这样决定
   - **影响后果**：这个决定带来的影响
   - **替代方案**：考虑过的其他方案
   - **后续动作**：接下来需要做什么

### 从 RFC 生成 ADR

RFC 被 `Accepted` 后：
1. 沿用 RFC 编号或新建编号
2. 状态初始为 `Accepted`
3. 在 ADR 顶部引用原 RFC：`> 本 ADR 源自 RFC-<NNN>`
4. 补充实施记录与影响后果

### 状态管理

| 状态 | 含义 |
| ---- | ---- |
| Accepted | 决策已接受 |
| Superseded | 被后续 ADR 替代 |

### 替代追踪

当新决策替代旧决策时：
1. 旧 ADR 状态置为 `Superseded`
2. 新 ADR 的 `supersedes` 字段引用旧 ADR
3. 旧 ADR 中添加链接指向新 ADR

### 审查 ADR

检查清单：
- [ ] 决策背景清楚
- [ ] 决策理由充分
- [ ] 影响后果已分析
- [ ] 替代方案已记录
- [ ] 如替代旧 ADR，supersedes 字段正确
- [ ] 遵循 `matharts-doc-design` 排版规则

### 模板

生成时参考 `assets/templates/ADR.template.md`。
