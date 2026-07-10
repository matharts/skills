# ADR-007: 按需加载文档风格参考

| 属性 | 值 |
| ---- | -- |
| 状态 | Accepted |
| 日期 | 2026-07-10 |
| Supersedes | — |

> 本 ADR 源自 `docs/rfcs/RFC-002-open-source-markdown-style.md`。

## 决策背景

`matharts-doc-design` 同时覆盖基础排版和开源文档阅读路径。把所有文档类型指导写入 `SKILL.md` 会让纯排版任务加载无关内容，也会增加核心规则与详细参考之间的重复。

## 最终决定

`SKILL.md` 只保留模式选择、硬边界和 reference 加载条件。详细的读者任务路径、文档类型结构和中文技术文档风格放入 `references/open-source-style.md`，仅在任务涉及文档入口、读者路径、文档类型或开源协作结构时加载。

## 决策理由

按需加载符合 Skill 的渐进披露原则，同时保持分发包自包含。核心执行规则仍可直接读取，详细风格参考不会占用无关任务的上下文。

## 影响后果

- `references/open-source-style.md` 必须随 Skill 一起分发并通过自包含校验
- 纯排版任务不加载该 reference
- README/RFC/ADR 的内容合同继续由下游 Skill 定义
- 测试需要覆盖 reference 路由、示例事实保持和前向测试资产

## 替代方案

- 全部保留在 `SKILL.md`：会增加无关上下文和重复内容
- 放在仓库根共享文件：分发后会产生不可用引用
- 删除开源风格层：无法覆盖已确认的读者路径和协作边界需求

## 后续动作

- 使用真实文档任务继续人工前向测试
- 真实 L3 Agent runner 继续按 ADR-006 保持 Deferred，直到独立 RFC 定义运行和评分接口
