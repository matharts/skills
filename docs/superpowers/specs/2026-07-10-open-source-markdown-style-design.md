# Open Source Markdown Style Design

> Status: Draft for review
> Date: 2026-07-10
> Scope: `matharts-doc-design`

## Purpose

Upgrade `matharts-doc-design` from a general document formatting baseline into a MathArts Markdown style system inspired by top-tier open source projects. The Skill should preserve its existing dual workflow:

- Review mode for `review` / 审查 / 评审 / 检查
- Rewrite mode for 优化 / 改写 / 整理 / 标准化 / 美化

The new layer should make MathArts documents feel more like mature open source documentation: useful at first contact, clear about contribution and governance boundaries, and precise when recording decisions.

## Style Sources

The style system combines three reference families:

| Family | Examples | What to absorb |
| ------ | -------- | -------------- |
| Engineering infrastructure | Kubernetes, Rust, Go | rigor, lifecycle clarity, decision boundaries |
| Developer product | React, Vite, Next.js | friendly entry points, examples, quick starts |
| Community collaboration | Homebrew, Node.js, GitLab | contribution paths, review expectations, maintenance boundaries |

MathArts should not copy any single project's surface style. It should combine rigor, readability, and collaboration clarity into a restrained technical voice.

## Core Model

The Skill should teach agents to structure Markdown around the reader's task path:

1. Establish what the document is and who it is for.
2. Give the fastest safe next step.
3. Separate common tasks from deep reference.
4. Make decisions, constraints, and trade-offs explicit.
5. Route contributors to the right process.

This should become a named section in `SKILL.md`, such as `Open Source Markdown Style System`.

## Document Type Guidance

The Skill should include lightweight guidance by document type.

| Document type | Primary reader question | Preferred shape |
| ------------- | ----------------------- | --------------- |
| README | What is this, why use it, how do I start? | positioning, quick start, docs, examples, contributing, license |
| RFC | Should this change happen? | context, motivation, constraints, proposal, alternatives, drawbacks, lifecycle |
| ADR | What was decided and why? | status, context, decision, consequences, supersession |
| Guide | How do I complete this task? | prerequisites, steps, verification, troubleshooting |
| AGENTS.md | How should agents work here? | repo purpose, constraints, commands, ownership, escalation boundaries |
| Contributing/process docs | How do I participate safely? | workflow, standards, review expectations, communication paths |

## Writing Rules

The Skill should add rules that go beyond simple Markdown syntax:

- Lead with reader value before implementation detail.
- Prefer task-oriented headings over generic headings.
- Put examples near the first concept that needs them.
- Use tables for comparison, metadata, matrices, and routing decisions.
- Use links as paths to action, not as a pile of references.
- Write concise paragraphs with the conclusion first.
- Make lifecycle and ownership explicit when a document governs a process.
- Keep tone confident but not promotional.

## Review Mode Updates

Review mode should add findings for open source documentation maturity:

- Missing first-contact clarity
- Missing quick start or next-step routing
- Poor separation between tutorial, task guide, reference, and governance
- Hidden contribution or review process
- Decision documents without alternatives, drawbacks, or consequences
- Excessive internal jargon
- Links that do not tell the reader where to go next

The existing `Findings` and `Suggested Shape` format should remain.

## Rewrite Mode Updates

Rewrite mode should preserve facts while applying the style system:

- Reorder sections around reader tasks.
- Add missing scaffolding only when the source already implies it.
- Use `TODO:` for facts that are needed but not present.
- Replace vague headings with concrete ones.
- Convert long lists into grouped lists or tables when it improves scanning.
- Keep short documents short.

## Testing

Add tests that verify:

- `SKILL.md` and `README.md` mention the open source Markdown style system.
- The Skill includes document type guidance for README, RFC, ADR, Guide, and AGENTS.md.
- Existing dual-mode guidance remains present.
- L3 fixtures for `matharts-doc-design` cover review and rewrite examples with open source style language.

Run:

```bash
C:\Users\Administrator\.bun\bin\bun.exe test
C:\Users\Administrator\.bun\bin\bun.exe tools\cli.ts check
```

## Out of Scope

- Adding a full style guide under `references/`
- Changing README/RFC/ADR Skill content contracts
- Introducing rendered HTML or visual design assets
- Copying proprietary wording or long passages from external projects
