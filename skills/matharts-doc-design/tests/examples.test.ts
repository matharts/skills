import { expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const skillDir = import.meta.dir.replace(/\\tests$/, "");

test("matharts-doc-design ships and references practical examples", async () => {
  const skill = await readFile(join(skillDir, "SKILL.md"), "utf-8");
  const readme = await readFile(join(skillDir, "README.md"), "utf-8");

  const examples = [
    "before-after-readme.md",
    "before-after-rfc.md",
    "before-after-zh-style.md",
    "review-findings.md",
    "rewrite-summary.md",
  ];

  for (const example of examples) {
    const content = await readFile(join(skillDir, "examples", example), "utf-8");
    expect(content.length).toBeGreaterThan(100);
    expect(skill).toContain(`examples/${example}`);
    expect(readme).toContain(`examples/${example}`);
  }

  expect(skill).toContain("示例层");
  expect(readme).toContain("示例层");
});

test("markdown examples use outer fences that allow nested code blocks", async () => {
  const examples = [
    "before-after-readme.md",
    "before-after-rfc.md",
    "before-after-zh-style.md",
    "review-findings.md",
    "rewrite-summary.md",
  ];

  for (const example of examples) {
    const content = await readFile(join(skillDir, "examples", example), "utf-8");
    const markdownFenceLines = content
      .split(/\r?\n/)
      .filter((line) => line.startsWith("```markdown") || line.startsWith("````markdown"));

    for (const line of markdownFenceLines) {
      expect(line.startsWith("````markdown")).toBe(true);
    }
  }
});

test("markdown examples have balanced fenced code blocks", async () => {
  const examples = [
    "before-after-readme.md",
    "before-after-rfc.md",
    "before-after-zh-style.md",
    "review-findings.md",
    "rewrite-summary.md",
  ];

  for (const example of examples) {
    const content = await readFile(join(skillDir, "examples", example), "utf-8");
    const stack: number[] = [];

    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^(`{3,})(?:\w+)?\s*$/);
      if (!match) continue;

      const fenceLength = match[1].length;
      const current = stack.at(-1);
      if (current && fenceLength < current) {
        continue;
      }
      if (current) {
        stack.pop();
      } else {
        stack.push(fenceLength);
      }
    }

    expect(stack).toEqual([]);
  }
});
