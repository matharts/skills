# README Before / After

## Before

````markdown
# tools

Shared Bun utilities for validating, syncing, and maintaining MathArts Skill packages.

Use this package when you maintain `matharts/skills` or review Skill package changes.

## install

bun install

## usage

Run `bun tools/cli.ts check` to validate all Skills. Run `bun tools/cli.ts sync` to sync shared source.

Changes to validation behavior require tests and a short note in the relevant plan or design document.
````

## After

````markdown
# MathArts Tools

> Shared Bun utilities for validating, syncing, and maintaining MathArts Skill packages.

## Who This Is For

Use this package when you maintain `matharts/skills` or review Skill package changes.

## Quick Start

```bash
bun install
bun tools/cli.ts check
```

## Common Tasks

| Task | Command |
| ---- | ------- |
| Validate all Skills | `bun tools/cli.ts check` |
| Sync shared source | `bun tools/cli.ts sync` |

## Contributing

Changes to validation behavior require tests and a short note in the relevant plan or design document.
````

## Why This Works

- The opening tells readers what the project is and who should use it.
- Commands are copyable and language-tagged.
- Tasks are grouped by reader intent instead of repository internals.
- Contribution expectations are visible before readers start editing.
