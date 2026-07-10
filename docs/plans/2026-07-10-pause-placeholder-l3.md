# Pause Placeholder L3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop reporting duplicate-file comparison as Skill behavior validation while preserving the existing CLI contract and forward-test assets.

**Architecture:** Keep `snapshot` as a valid check level, but intercept it once in the CLI and report L3 as deferred. Remove the unused per-Skill comparator, then colocate each `matharts-doc-design` scenario with its rubric and expected output.

**Tech Stack:** Bun, TypeScript, Markdown

---

### Task 1: Defer L3 at the CLI boundary

**Files:**
- Modify: `tools/cli.test.ts`
- Modify: `tools/cli.ts`
- Modify: `tools/lib/validate/index.ts`
- Delete: `tools/lib/validate/snapshot.ts`
- Delete: `tools/lib/validate/snapshot.test.ts`

- [ ] **Step 1: Write the failing CLI test**

Import `runValidation`, capture `console.warn`, call `runValidation("snapshot")`, and assert it returns `true` with exactly one message: `L3 deferred: no Agent runner configured; Skill behavior was not tested`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test tools/cli.test.ts`

Expected: FAIL because `runValidation` is not exported and snapshot validation still iterates over Skills.

- [ ] **Step 3: Implement the CLI boundary**

Export `runValidation` and return early for `snapshot` after one `console.warn`. Change the L3 heading to `L3: deferred`, remove snapshot dispatch from `tools/lib/validate/index.ts`, and delete the duplicate-file comparator and its tests.

- [ ] **Step 4: Run the CLI tests**

Run: `bun test tools/cli.test.ts`

Expected: all tests pass with no repeated per-Skill L3 warning.

### Task 2: Colocate forward-test assets

**Files:**
- Modify: `skills/matharts-doc-design/tests/examples.test.ts`
- Create: `skills/matharts-doc-design/tests/scenarios/review-mode.expected.md`
- Create: `skills/matharts-doc-design/tests/scenarios/rewrite-mode.expected.md`
- Delete: `skills/matharts-doc-design/tests/fixtures/review-mode.md`
- Delete: `skills/matharts-doc-design/tests/fixtures/rewrite-mode.md`
- Delete: `skills/matharts-doc-design/tests/fixtures/expected/review-mode.md.output`
- Delete: `skills/matharts-doc-design/tests/fixtures/expected/rewrite-mode.md.output`

- [ ] **Step 1: Point the content test at the future scenario paths**

Read expected outputs from `tests/scenarios/review-mode.expected.md` and `tests/scenarios/rewrite-mode.expected.md`.

- [ ] **Step 2: Run the content test to verify it fails**

Run: `bun test skills/matharts-doc-design/tests/examples.test.ts`

Expected: FAIL because the colocated expected files do not exist.

- [ ] **Step 3: Move the reviewed expected outputs and delete duplicates**

Create the two `.expected.md` files with the already-reviewed output, then delete the four files under `tests/fixtures/`.

- [ ] **Step 4: Run all Skill tests**

Run: `bun test skills/matharts-doc-design/tests`

Expected: all tests pass.

### Task 3: Align repository documentation

**Files:**
- Modify: `docs/DESIGN.md`
- Modify: `docs/plans/2026-07-10-phase1-acceptance.md`
- Modify: `docs/rfcs/RFC-001-pause-placeholder-l3.md`
- Create: `docs/adr/ADR-006-defer-l3-validation.md`

- [ ] **Step 1: Mark the RFC Accepted**

Set RFC-001 status to `Accepted` after user approval and record the decision in ADR-006.

- [ ] **Step 2: Document current L3 status**

Mark L3 as Deferred in the testing strategy, remove claims that the current CLI executes Skills or updates snapshots, and state the runner prerequisites from RFC-001. Preserve L0-L2 requirements.

- [ ] **Step 3: Update phase acceptance evidence**

Replace snapshot-pass claims with the accurate statement that L3 is deferred and forward-test assets are reviewed manually.

- [ ] **Step 4: Verify the full change**

Run:

```bash
bun test skills/matharts-doc-design/tests tools/cli.test.ts
MATHARTS_SKIP_SKILLS_REF=1 bun tools/cli.ts validate --check all
git diff --check
```

Expected: tests and L0-L2 pass; validation prints one L3 deferred message; diff check is clean.
