# ADR-008：将 skills 定位为 Foundation 层 Agent 能力仓库

| 属性 | 值 |
| --- | --- |
| 状态 | Accepted |
| 日期 | 2026-07-12 |
| Supersedes | — |

> 本 ADR 源自 [`RFC-003`](../rfcs/RFC-003-align-ecosystem-boundary.md)。

## 决策背景

`matharts/skills` 已经维护跨仓库复用的 Agent Skills、校验工具和分发约束，但缺少 Charter。README 与 Draft Design 仍把尚未建立的 `matharts/standards`、`matharts/docs` 描述为现行规则来源，与已经建立的 `matharts/ecosystem` 和四层仓库模型不一致。

## 最终决定

- 将 `matharts/skills` 的主要层级声明为 Foundation；
- 由 `matharts/ecosystem` 承载组织治理、Agent Policy、Standard、Guidance 和 Template；
- 由 `matharts/skills` 把明确来源的规则转化为领域无关、可执行、可安装和可测试的 Skill；
- 领域和项目事实继续由目标仓库维护；
- Skill 可以携带标明来源与版本的最小参考摘要，但摘要不替代权威来源；
- 历史计划中的旧三仓模型保留为历史，不作为现行边界。

## 决策理由

Skills 是供多个仓库复用的领域无关工程能力，符合 Foundation 层定义。把组织规则保留在 `ecosystem` 可以避免执行实现拥有规范接受权，也不需要为尚未验证的职责提前创建 `standards` 或 `docs` 仓库。

## 影响后果

- `CHARTER.md` 成为仓库层级、边界、所有权和生命周期的权威来源；
- README、AGENTS 和 Draft Design 必须与 Charter 保持一致；
- 新增通用 Skill 时必须证明跨仓库复用价值，不能吸收领域或产品职责；
- 候选规范只有在任务或仓库明确采用时才能进入 Skill 执行合同；
- 参考摘要需要记录来源和版本，并承担漂移维护成本；
- `matharts/ecosystem/REPOSITORIES.md` 需要在合并后同步。

## 替代方案

- 等待创建 `matharts/standards` 与 `matharts/docs`：缺少已验证需求，会继续保留失效边界；
- 声明为 Organization：会混淆组织治理和可执行 Skill 实现；
- 声明为 Application：不符合跨仓库复用、领域无关的基础能力性质。

## 后续动作

- 合并 RFC-003、Charter 和边界文档更新；
- 关闭 skills#1 与 skills#2；
- 在 `matharts/ecosystem` 同步仓库地图；
- 由 skills#4 独立修复主分支已有的内容契约测试失败；
- 通过真实项目任务继续验证 Foundation 边界和 Skill 自包含能力。
