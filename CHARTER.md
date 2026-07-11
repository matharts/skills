# MathArts Skills 仓库立项书

- **主要层级**：Foundation
- **状态**：Incubating
- **负责人**：MathArts maintainers
- **最近审查**：2026-07-12
- **相关提案**：[`RFC-003`](docs/rfcs/RFC-003-align-ecosystem-boundary.md)

## 使命

建设、维护和分发领域无关、可自包含、可验证的 Agent Skills，使 MathArts 各仓库能够复用稳定的 Agent 工程能力。

## 存在理由

MathArts 的仓库初始化、文档维护、任务执行和工程审查需要可安装、可版本化、可测试的 Agent 能力包。这些实现不应散落在项目 Prompt、对话或各领域仓库中重复维护。

本仓库将组织级 Policy、Standard、Guidance 和 Template 转化为 Agent 可执行能力，但不拥有这些规则的接受权，也不成为领域知识和项目事实的权威来源。

## 职责范围

本仓库负责：

- 维护符合 [agentskills.io](https://agentskills.io) 规范的 Skill 包；
- 维护 Skill 的执行指令、脚本、参考摘要、模板、示例和测试；
- 提供 Skill 校验、同步、打包、版本和分发工具；
- 定义本仓库内部的 Skill 包结构与质量要求；
- 验证 Skill 能否脱离仓库根目录独立安装和运行；
- 记录影响 Skill 公共契约、分发或长期维护的 RFC 与 ADR。

## 非职责范围

本仓库不负责：

- 接受或维护 MathArts 组织级 Policy、Standard 和治理规则；
- 定义单个项目的 Architecture、Specification 或局部实现；
- 承载某次任务的真实 Task Contract、Delivery 或 Review；
- 把领域算法、术语、流派和数据规则提升为跨仓库通用能力；
- 维护产品 UI、业务功能或应用运行时；
- 用 Skill 内的参考摘要替代来源仓库中的现行规范。

组织级治理和跨仓库候选规范由 [`matharts/ecosystem`](https://github.com/matharts/ecosystem) 维护；领域事实留在对应领域仓库。

## 层级与依赖方向

本仓库属于 **Foundation**：提供领域无关、跨仓库复用的 Agent 工程能力。

- **组织运行时依赖**：无；
- **开发工具链**：Bun、agentskills.io 生态工具及仓库声明的开发依赖；
- **文档引用**：可以引用 `matharts/ecosystem` 中已接受的组织规范和明确采用的候选资产；
- **领域依赖**：通用 Skill 不得依赖 `epheon`、`ziwei` 或其他 Domain/Application 仓库；
- **分发约束**：每个 Skill 必须自包含，不能依赖本仓库根目录或未随包分发的外部文件。

组织规范不得以运行时依赖方式注入 Skill；需要离线执行的最小规则可以作为标明来源和版本的参考摘要随 Skill 分发。

## 目标读者与使用者

- MathArts 仓库维护者和贡献者；
- 创建、审查和维护 Agent Skill 的工程人员；
- 在项目仓库中安装和运行 Skill 的 Agent；
- 需要复用跨仓库 Agent 工程能力的项目团队。

## 权威资产

| 资产 | 职责 |
| --- | --- |
| [`README.md`](README.md) | 面向使用者的仓库入口、安装方式和 Skill 清单 |
| [`CHARTER.md`](CHARTER.md) | 仓库存在理由、主要层级、职责边界和生命周期 |
| [`AGENTS.md`](AGENTS.md) | Agent 执行约束和验证命令 |
| [`docs/DESIGN.md`](docs/DESIGN.md) | 当前 Skill 包结构、分发机制和仓库设计；状态为 Draft |
| [`docs/rfcs/`](docs/rfcs/) | 重大变更的提案和决策记录 |
| `skills/*/SKILL.md` | 各 Skill 的执行入口和分发期事实 |
| `tools/` 与测试 | 校验、同步、打包和可执行验证事实 |

当描述与实现冲突时，以当前代码、测试和发布产物确认工程事实；组织级规则冲突按 `matharts/ecosystem` 中已接受的规范处理。

## 所有权与决策责任

MathArts maintainers 负责：

- 维护仓库边界和 Foundation 定位；
- 审查 Skill 公共契约、版本和分发变化；
- 决定 RFC 的接受、拒绝或替代；
- 保证 Skill 声明、实现、测试和发布产物一致；
- 处理安全、弃用、迁移和维护责任。

Agent 可以调查、起草、实现和验证，但不得自行接受架构提案、扩大仓库职责或把候选规则声明为组织标准。

## 生命周期与成功标准

仓库当前为 **Incubating**。进入 Active 前至少应满足：

- [ ] Charter、README、AGENTS 和 Draft Design 的边界保持一致；
- [ ] 核心 Skill 具备可重复的结构、自包含和内容验证；
- [ ] 至少一个 Skill 在目标仓库的真实任务中完成安装与执行验证；
- [ ] 版本、发布、弃用和安全责任具有可执行流程；
- [ ] 维护者确认 Foundation 定位和长期维护方式稳定。

成功表现为：Skill 可以被独立安装和验证；组织规则、Skill 实现和领域事实边界清楚；项目不依赖聊天记录即可恢复使用与维护上下文。

## 演化与退役

新增或改变 Skill 公共契约、安装方式、仓库结构和长期兼容策略时，应按本仓库规则评估 RFC。职责消失、被替代或无法维护时，应保留迁移与历史记录后归档，不得静默删除。
