# Chinese Technical Style Before / After

Use this example when a MathArts document sounds slogan-like, translated, or unstable in terminology.

## Before

````markdown
# 强大的 MathArts Skill Registry

MathArts Skill Registry 用于维护可分发的 Agent Skill。维护者可以在这里创建、校验和发布 Skill 包。它拥有强大、优雅、丝滑的能力体系。

## 能力说明

当你需要新增或修改 Skill 时，先确认目标 Skill 的目录、`SKILL.md` frontmatter 和测试夹具。新增 Skill 要创建独立目录，并让 `name` 与目录名一致；校验 Skill 要运行 `bun tools/cli.ts check`；修改共享规则要先写 RFC。
````

## After

````markdown
# MathArts Skill Registry

MathArts Skill Registry 用于维护可分发的 Agent Skill。维护者可以在这里创建、校验和发布 Skill 包。

## 适用场景

当你需要新增或修改 Skill 时，先确认目标 Skill 的目录、`SKILL.md` frontmatter 和测试夹具。

## 常见任务

| 任务 | 做法 |
| ---- | ---- |
| 新增 Skill | 创建独立目录，并让 `name` 与目录名一致 |
| 校验 Skill | 运行 `bun tools/cli.ts check` |
| 修改共享规则 | 先写 RFC，再同步到相关 Skill |
````

## 为什么这样改

- 去掉“强大”“优雅”“极致”“丝滑”等口号词。
- 术语保持稳定，全文使用 `Skill`，不在“技能”“能力包”“模块”之间摇摆。
- 保留必要英文术语，避免生硬翻译。
- 用读者任务和可验证命令替代空泛能力描述。
