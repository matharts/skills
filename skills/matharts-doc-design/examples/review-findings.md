# Review Findings Example

Use this shape when the user asks for `review`, 审查, 评审, or 检查.

````markdown
## Findings

- [P1] Missing first-contact clarity
  位置：README.md opening section
  影响：First-time readers cannot tell what the project is, who should use it, or the safest next step.
  建议：Add a short positioning paragraph and a Quick Start section before internal details.

- [P2] Contribution path is hidden
  位置：README.md Contributing area
  影响：Contributors may open changes without knowing when RFC review is required.
  建议：Add a Contributing section that links contribution workflow to review expectations.

- [P3] Generic headings reduce scanning
  位置：README.md headings
  影响：Headings such as "Other" and "Notes" hide reader tasks and slow scanning.
  建议：Replace them with task-oriented headings such as "Common Tasks" or "Maintenance Notes".

## Suggested Shape

1. Project positioning
2. Quick Start
3. Common Tasks
4. Documentation Paths
5. Contributing and Review
6. License
````

## Review Rules

- Lead with actionable problems, not general praise.
- Explain why the issue matters to readers or maintainers.
- Include position, impact, and suggested action for every finding.
- Suggest a concrete shape without rewriting the entire document.
