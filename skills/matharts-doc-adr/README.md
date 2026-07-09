# matharts-doc-adr

记录已经接受的重要决策（事后记录文档）。

## 职责

- 生成 ADR 文档（决策背景、决定、理由、影响）
- 从 Accepted 的 RFC 自动生成 ADR
- 追踪被替代的决策（Superseded）
- 维护决策历史

## 依赖

- `matharts-doc-design` — 继承排版规则

## 安装

```bash
npx skills add matharts/skills --skill matharts-doc-adr -a opencode
```

## 状态

`experimental` — 结构和规则可能变化。
