# RFC Before / After

## Before

```markdown
# Add sync rollback

We need rollback because sync can overwrite files.

## Plan

Add backups.
```

## After

```markdown
# RFC-0001: Add Sync Rollback

| Field | Value |
| ----- | ----- |
| Status | Draft |
| Owner | MathArts Core |

## Summary

Add rollback support for shared-source sync so maintainers can recover overwritten Skill files.

## Motivation

`tools/cli.ts sync` can touch every Skill package. A failed or mistaken sync should not require manual recovery across many directories.

## Constraints

- Skill packages must remain self-contained.
- Rollback must restore existing files and remove files created by sync.

## Proposal

Create one backup batch per sync operation and store a manifest of touched files.

## Alternatives

- Per-Skill backup directories: simpler, but cannot restore one sync operation as a unit.

## Drawbacks

The backup manifest adds a small amount of toolchain state under `.sync-backup/`.
```

## Why This Works

- The RFC states motivation, constraints, proposal, alternatives, and drawbacks.
- The reader can evaluate the decision rather than infer it from a vague plan.
- The lifecycle metadata appears before detailed discussion.
