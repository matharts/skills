# RFC-003：对齐 ecosystem 边界并声明 skills 为 Foundation

| 属性 | 值 |
| --- | --- |
| 状态 | Accepted |
| 作者 | MathArts maintainers |
| 日期 | 2026-07-12 |
| 决策日期 | 2026-07-12 |
| 相关 Issue | [#1](https://github.com/matharts/skills/issues/1)、[#2](https://github.com/matharts/skills/issues/2) |

## 摘要

提议将 `matharts/skills` 的主要层级声明为 Foundation，建立 `CHARTER.md`，并把 README 与 Draft Design 中尚未存在的 `matharts/standards`、`matharts/docs` 引用替换为当前组织事实：组织级治理、Policy、Standard、Guidance 和 Template 由 `matharts/ecosystem` 承载，项目与领域事实留在目标仓库。

## 背景

当前仓库已经实现跨仓库复用的 Agent Skills、校验工具和分发约束，但缺少 Charter。README 和 Draft Design 仍描述一个尚未建立的三仓模型：`standards` 负责正式标准、`docs` 负责长期知识、`skills` 负责执行。

MathArts 已接受 Organization Specification 3.0，并建立 `matharts/ecosystem` 作为组织级治理事实来源。继续引用不存在的仓库会让维护者和 Agent 无法判断规则来源，也会使仓库地图长期保持已确认偏差。

## 动机

仓库需要在不创建新组织资产的前提下恢复可验证边界：维护者应能从本仓库判断它属于哪一层，Agent 应能找到组织规则来源，分发后的 Skill 也必须继续保持自包含。

## 目标

- 为 `matharts/skills` 建立可审查的 Charter；
- 在四层模型中确定一个主要层级；
- 让现行 README、AGENTS 和 Draft Design 指向真实存在的权威来源；
- 保留 Skill 参考摘要，但明确它们不是正式规范；
- 保留历史计划，不重写过去的设计上下文。

## 问题

需要正式回答：

1. `matharts/skills` 在四层模型中的主要层级是什么？
2. 组织级 Policy、Standard 和 Template 的来源是什么？
3. Skill 内的参考摘要与正式规范是什么关系？
4. 现有 Draft Design 和 README 如何迁移而不删除历史计划？

## 推荐方案

### 1. 声明 Foundation 层级

`matharts/skills` 提供领域无关、跨仓库复用的 Agent 工程能力，符合 Foundation 层职责。它不是 Organization 层治理来源，也不拥有 Domain 或 Application 规则。

### 2. 以 ecosystem 承载组织级规则

- `matharts/ecosystem`：组织使命、仓库边界、Agent Policy、候选与已接受 Standard、Guidance、Template；
- `matharts/skills`：把明确来源的规则转化为可执行、可安装、可测试的 Skill；
- 项目仓库：保存领域事实、局部约束和真实任务证据。

### 3. 保留自包含参考摘要

Skill 可以携带完成执行所需的最小参考摘要，但必须：

- 标明来源、适用范围和版本；
- 不把摘要描述为正式标准；
- 不要求安装时访问未随包分发的仓库；
- 在来源变化时通过明确任务更新，而不是隐式远程同步。

### 4. 保留历史计划

`docs/plans/` 中的旧方案保留为历史，不进行机械重写。现行 README、Charter 和 Draft Design 更新为当前边界，避免用历史材料覆盖现状。

## 非目标

- 创建 `matharts/standards` 或 `matharts/docs`；
- 接受 `ecosystem` 中仍为 Draft 或 Proposed 的专题资产；
- 修改任何 Skill 的运行时行为或公共触发条件；
- 引入远程规范同步服务；
- 改变 agentskills.io、自包含或 `npx skills` 安装约定；
- 将领域 Skill 移入本仓库。

## 备选方案

### 继续等待 standards/docs 仓库

不推荐。当前没有经过治理批准的建仓需求，保留引用会持续制造失效边界。

### 将 skills 声明为 Organization

不推荐。本仓库实现可执行工程能力，不负责组织使命、治理和标准接受。

### 将 skills 声明为 Application

不推荐。Skill 是供多个仓库复用的基础能力包，不是面向最终用户组合领域能力的产品应用。

## 影响

- 新增 `CHARTER.md`；
- README 的生态位置改为 `ecosystem → skills → project`；
- Draft Design 提升到 0.7.0，更新当前边界和参考摘要来源；
- 历史计划、Skill 包、工具代码和安装方式保持不变；
- `matharts/ecosystem/REPOSITORIES.md` 应在本提案被接受并合并后同步。

## 风险与代价

- Foundation 定位可能被误解为允许本仓库吸收所有跨仓库工具；Charter 必须继续用领域无关、自包含和真实复用约束范围；
- `ecosystem` 中存在 Draft 与 Proposed 资产，Skill 不得因为引用它们就把候选规则视为已接受规范；
- 随 Skill 分发的参考摘要可能与来源漂移，需要明确来源、版本和维护任务；
- 同一 Pull Request 同时包含 RFC 与候选实现，维护者必须先接受决策，再合并 Charter 和 Design 变化。

## 兼容性

本提案不改变 Skill 名称、frontmatter、安装命令、运行时行为或分发结构。现有项目无需迁移已安装 Skill。变化只影响仓库级文档入口、组织边界和未来参考摘要的来源表达。

## 迁移与验证

1. 搜索现行 README、AGENTS 和 Draft Design 中的失效仓库引用；
2. 建立 Charter 并同步主要层级与职责；
3. 保留历史计划中的原始描述；
4. 运行 `bun test` 与 `bun tools/cli.ts validate --check all`；
5. 由维护者审查本 RFC，并在接受时把状态改为 Accepted；
6. 合并后关闭 #1、#2，并通知 ecosystem 更新仓库地图。

## 验收条件

- [x] 维护者接受 Foundation 主要层级；
- [x] README、Charter、AGENTS 和 Draft Design 不再把不存在的仓库描述为现行来源；
- [x] 组织规则、Skill 实现与项目事实边界一致；
- [x] 历史计划保持可追溯；
- [x] 必需 CI 与 L0–L2 Skill 校验通过；`origin/main` 已有的全量测试失败由 [#4](https://github.com/matharts/skills/issues/4) 独立跟踪；
- [x] ecosystem 后续同步已明确。

## 开放问题

无。维护者接受 Foundation 主要层级；决策记录在 ADR-008；参考摘要暂由各 Skill 声明来源与版本，出现稳定跨 Skill 需求后再提议统一策略。

## 讨论入口

- [skills#1](https://github.com/matharts/skills/issues/1)：建立 Charter；
- [skills#2](https://github.com/matharts/skills/issues/2)：修正失效仓库引用；
- 本 RFC 对应的 Pull Request。

## 决策

**Accepted。**

- `matharts/skills` 的主要层级为 Foundation；
- 组织级规则来源为 `matharts/ecosystem`，领域和项目事实留在目标仓库；
- Skill 可以分发标明来源与版本的最小参考摘要，但摘要不替代权威来源；
- `docs/plans/` 中的旧三仓模型保留为历史，不作为现行边界；
- 本决策由 [`ADR-008`](../adr/ADR-008-skills-foundation-boundary.md) 记录；
- 维护者通过明确指令批准合并本 RFC 及其实施 PR。
