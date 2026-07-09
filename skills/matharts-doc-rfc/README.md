# matharts-doc-rfc

生成和审查重大变更提案（事前讨论文档）。

## 职责

- 生成 RFC 文档（背景、动机、方案、替代方案、迁移策略）
- 审查 RFC 完整性
- 管理 RFC 状态流转（Draft → Review → Accepted/Rejected/Withdrawn）
- RFC Accepted 后触发 ADR 生成

## 依赖

- `matharts-doc-design` — 继承排版规则

## 安装

```bash
npx skills add matharts/skills --skill matharts-doc-rfc -a opencode
```

## 状态

`experimental` — 结构和规则可能变化。
