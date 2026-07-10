# RFC-001: 暂停占位式 L3 快照校验

| 属性 | 值 |
| ---- | -- |
| 状态 | Accepted |
| 作者 | MathArts Core |
| 日期 | 2026-07-10 |

## 背景

`docs/DESIGN.md` 将 L3 定义为：运行 Skill，再把输出与期望快照比较。当前实现没有执行 Skill，只比较 `tests/fixtures/` 与 `tests/fixtures/expected/` 下两份人工维护的相同文件。

这类比较会产生假阳性。`matharts-doc-design` 曾同时存在互相矛盾的行为 rubric 和期望输出，但 L3 仍然通过。

## 动机

校验结果必须准确表达它证明了什么。在没有 Agent runner 前，不应把重复文件一致性称为 Skill 输出快照测试。

## 目标

- 明确标记 L3 尚未实现，不再产生行为已验证的假象
- 保留 `snapshot` CLI 参数，避免破坏已有命令
- 保留可供未来 runner 使用的场景、rubric 和期望输出
- 保持 L0、L1、L2 行为不变

## 非目标

- 引入 Agent runner、模型 API 或 LLM-as-judge
- 决定未来 runner 使用的模型、评分算法或费用策略
- 改变 Skill 的运行时行为

## 设计方案

1. `validate --check snapshot` 输出一次跳过提示并返回成功。
2. `validate --check all` 和 `check` 继续展示 L3 阶段，但明确标记为未实现；不逐 Skill 输出重复 warning。
3. 删除只做文件相等比较的 snapshot validator 及其单元测试。
4. 删除 `matharts-doc-design/tests/fixtures/` 下的重复副本。
5. 将期望输出移动到 `matharts-doc-design/tests/scenarios/*.expected.md`，与输入和 rubric 放在一起；现有内容测试继续校验这些资产的契约。
6. 修订 `docs/DESIGN.md`：L3 标记为 Deferred，并记录恢复条件。

恢复真实 L3 需要先确定以下接口：

- 可重复调用的 Agent runner
- 输入 Skill、场景和工作区的方式
- 确定性比较或显式评分规则
- 超时、费用和离线行为

## 替代方案

### 立即实现真实 L3

不采用。当前仓库没有 Agent runner，也没有模型与费用策略；现在实现会引入远大于问题本身的基础设施。

### 把重复文件比较正式定义为 L3

不采用。它只能证明两份副本相同，不能证明 Skill 行为，继续保留没有有效质量信号。

## 兼容性

`snapshot` 仍是合法的 `--check` 值并返回成功，因此现有 CI 命令不会失败。变化仅在于输出明确说明 L3 未执行。

## 迁移策略

1. 先更新 CLI 测试，固定单次跳过提示。
2. 删除 snapshot 比较器和重复 fixture。
3. 移动 `matharts-doc-design` 前向测试资产并更新内容测试。
4. 更新设计文档和验收文档中的 L3 状态。
5. 运行全量测试、L0-L2 校验和差异检查。

## 开放问题

无。真实 L3 的 runner 设计留给后续 RFC。

## 讨论

在本 RFC 对应的 Pull Request 中讨论。
