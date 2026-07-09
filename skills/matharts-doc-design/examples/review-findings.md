# Review Findings Example

Use this shape when the user asks for `review`, 审查, 评审, or 检查.

```markdown
## Findings

- [P1] Missing first-contact clarity
  The README starts with implementation folders but never says what the project is, who should use it, or the safest next step. Add a short positioning paragraph and a Quick Start section before internal details.

- [P2] Contribution path is hidden
  The document mentions PRs near the end but does not explain what changes require RFC review. Add a Contributing section that links contribution workflow to review expectations.

- [P3] Generic headings reduce scanning
  Headings such as "Other" and "Notes" hide reader tasks. Replace them with task-oriented headings such as "Common Tasks" or "Maintenance Notes".

## Suggested Shape

1. Project positioning
2. Quick Start
3. Common Tasks
4. Documentation Paths
5. Contributing and Review
6. License
```

## Review Rules

- Lead with actionable problems, not general praise.
- Explain why the issue matters to readers or maintainers.
- Suggest a concrete shape without rewriting the entire document.
