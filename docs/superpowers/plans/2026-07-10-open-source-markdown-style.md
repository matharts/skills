# Open Source Markdown Style Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `matharts-doc-design` with a top-tier open source Markdown style layer covering reader entry, task paths, decision transparency, and collaboration boundaries.

**Architecture:** Keep `matharts-doc-design` self-contained in `SKILL.md` and `README.md`; add content tests and L3 fixtures under the Skill package. The update extends the existing dual review/rewrite workflow without changing downstream README/RFC/ADR content contracts.

**Tech Stack:** Markdown Skill package, Bun tests, repository `tools/cli.ts` validation, official `skills-ref`.

## Global Constraints

- `SKILL.md` frontmatter `name` remains `matharts-doc-design`.
- `description` stays under 1024 characters and starts with `Use when`.
- `metadata` values remain strings.
- `SKILL.md` body stays under 500 lines.
- The Skill remains self-contained and does not reference `internal/`.
- Existing dual workflow remains present: review mode and rewrite mode.
- No long copied wording from external projects.

---

### Task 1: Content Test for Open Source Style Layer

**Files:**
- Modify: `skills/matharts-doc-design/tests/skill-content.test.ts`

**Interfaces:**
- Consumes: existing test that reads `SKILL.md` and `README.md`
- Produces: failing assertions that require the open source Markdown style layer

- [ ] **Step 1: Extend the failing test**

Add assertions that require:

```typescript
expect(content).toContain("Open Source Markdown Style System");
expect(content).toContain("读者任务路径");
expect(content).toContain("文档类型指导");
expect(content).toContain("协作边界");
```

Also assert that `SKILL.md` mentions `README`, `RFC`, `ADR`, `Guide`, and `AGENTS.md`.

- [ ] **Step 2: Run the targeted test**

Run:

```bash
C:\Users\Administrator\.bun\bin\bun.exe test skills\matharts-doc-design\tests\skill-content.test.ts
```

Expected: FAIL because the current Skill does not include the open source style system.

### Task 2: Update Skill and README

**Files:**
- Modify: `skills/matharts-doc-design/SKILL.md`
- Modify: `skills/matharts-doc-design/README.md`

**Interfaces:**
- Consumes: specification at `docs/superpowers/specs/2026-07-10-open-source-markdown-style-design.md`
- Produces: self-contained Skill guidance for open source Markdown style

- [ ] **Step 1: Add `Open Source Markdown Style System` to `SKILL.md`**

Add sections covering:

- reader entry
- task paths
- document type guidance
- writing rules
- review mode updates
- rewrite mode updates

- [ ] **Step 2: Add the same concept to README**

Add concise documentation for:

- mixed reference families
- document type guidance
- style principles

- [ ] **Step 3: Run the targeted test**

Run:

```bash
C:\Users\Administrator\.bun\bin\bun.exe test skills\matharts-doc-design\tests\skill-content.test.ts
```

Expected: PASS.

### Task 3: Update L3 Fixtures

**Files:**
- Modify: `skills/matharts-doc-design/tests/fixtures/review-mode.md`
- Modify: `skills/matharts-doc-design/tests/fixtures/expected/review-mode.md.output`
- Modify: `skills/matharts-doc-design/tests/fixtures/rewrite-mode.md`
- Modify: `skills/matharts-doc-design/tests/fixtures/expected/rewrite-mode.md.output`

**Interfaces:**
- Consumes: snapshot validator that compares fixture and expected output
- Produces: fixtures that demonstrate open source style language

- [ ] **Step 1: Update review fixture**

Include findings for missing first-contact clarity, missing next-step routing, or hidden contribution process.

- [ ] **Step 2: Update rewrite fixture**

Include a summary that mentions reader task path, concrete headings, and collaboration boundaries.

- [ ] **Step 3: Run all tests**

Run:

```bash
C:\Users\Administrator\.bun\bin\bun.exe test
```

Expected: all tests pass.

### Task 4: Validate and Commit

**Files:**
- All modified files from Tasks 1-3

**Interfaces:**
- Consumes: repository validation CLI
- Produces: committed implementation

- [ ] **Step 1: Run full validation**

Run:

```bash
C:\Users\Administrator\.bun\bin\bun.exe tools\cli.ts check
```

Expected: L0/L1/L2 pass; L3 passes for `matharts-doc-design`.

- [ ] **Step 2: Commit**

Run:

```bash
git add docs/superpowers/plans/2026-07-10-open-source-markdown-style.md skills/matharts-doc-design
git commit -m "feat: add open source markdown style guidance"
```
