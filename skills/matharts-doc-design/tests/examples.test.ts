import { expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const skillDir = join(import.meta.dir, "..");

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

test("Chinese style example explains the rewrite in Chinese", async () => {
  const content = await readFile(join(skillDir, "examples", "before-after-zh-style.md"), "utf-8");

  expect(content).toContain("## 为什么这样改");
  expect(content).toContain("去掉");
  expect(content).toContain("术语");
  expect(content).not.toContain("## Why This Works");
});

test("mode fixtures separate raw scenarios from expected behavior", async () => {
  const fixture = await readFile(join(skillDir, "tests", "scenarios", "review-mode.md"), "utf-8");
  const expected = await readFile(
    join(skillDir, "tests", "fixtures", "expected", "review-mode.md.output"),
    "utf-8",
  );

  const rewriteFixture = await readFile(
    join(skillDir, "tests", "scenarios", "rewrite-mode.md"),
    "utf-8",
  );
  const rewriteExpected = await readFile(
    join(skillDir, "tests", "fixtures", "expected", "rewrite-mode.md.output"),
    "utf-8",
  );

  expect(fixture).not.toContain("## Findings");
  expect(expected).toContain("## Findings");
  expect(expected).toContain("位置：");
  expect(expected).toContain("影响：");
  expect(expected).toContain("建议：");
  expect(rewriteFixture).not.toContain("已优化：");
  expect(rewriteExpected).toContain("已优化：docs/example.md");
  expect(rewriteExpected).toContain("主要调整：");
});
