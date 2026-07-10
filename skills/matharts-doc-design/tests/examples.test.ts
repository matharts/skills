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

test("before and after examples preserve factual claims", async () => {
  const cases = [
    [
      "before-after-readme.md",
      [
        "Shared Bun utilities for validating, syncing, and maintaining MathArts Skill packages.",
        "bun tools/cli.ts check",
        "bun tools/cli.ts sync",
        "Changes to validation behavior require tests",
      ],
    ],
    [
      "before-after-rfc.md",
      [
        "Rollback must restore existing files and remove files created by sync.",
        "Create one backup batch per sync operation and store a manifest of touched files.",
        "Per-Skill backup directories",
        ".sync-backup/",
      ],
    ],
    [
      "before-after-zh-style.md",
      [
        "MathArts Skill Registry 用于维护可分发的 Agent Skill。",
        "维护者可以在这里创建、校验和发布 Skill 包。",
        "bun tools/cli.ts check",
        "修改共享规则",
      ],
    ],
  ] as const;

  for (const [example, facts] of cases) {
    const content = await readFile(join(skillDir, "examples", example), "utf-8");
    const before = content.match(/## Before\s+````markdown\n([\s\S]*?)\n````\s+## After/)?.[1] ?? "";
    const after = content.match(/## After\s+````markdown\n([\s\S]*?)\n````/)?.[1] ?? "";

    for (const fact of facts) {
      expect(after).toContain(fact);
      expect(before).toContain(fact);
    }
  }

  const rfc = await readFile(join(skillDir, "examples", "before-after-rfc.md"), "utf-8");
  const rfcAfter = rfc.match(/## After\s+````markdown\n([\s\S]*?)\n````/)?.[1] ?? "";
  expect(rfcAfter).not.toContain("| Owner |");
});

test("mode contract artifacts separate raw scenarios from expected shapes", async () => {
  const fixture = await readFile(join(skillDir, "tests", "scenarios", "review-mode.md"), "utf-8");
  const expected = await readFile(
    join(skillDir, "tests", "scenarios", "review-mode.expected.md"),
    "utf-8",
  );

  const rewriteFixture = await readFile(
    join(skillDir, "tests", "scenarios", "rewrite-mode.md"),
    "utf-8",
  );
  const rewriteExpected = await readFile(
    join(skillDir, "tests", "scenarios", "rewrite-mode.expected.md"),
    "utf-8",
  );

  expect(fixture).not.toContain("## Findings");
  expect(expected).toContain("## Findings");
  expect(expected).toContain("位置：");
  expect(expected).toContain("影响：");
  expect(expected).toContain("建议：");
  expect(rewriteFixture).not.toContain("## 快速开始");
  expect(rewriteExpected).toContain("# Example");
  expect(rewriteExpected).toContain("## 快速开始");
  expect(rewriteExpected).toContain("运行 `example start`。");
  expect(rewriteExpected).not.toContain("已优化：");
  expect(rewriteExpected).not.toContain("RFC");
  expect(expected).not.toContain("RFC");
});

test("forward-test scenarios declare behavioral rubrics", async () => {
  const reviewRubric = await readFile(
    join(skillDir, "tests", "scenarios", "review-mode.rubric.md"),
    "utf-8",
  );
  const rewriteRubric = await readFile(
    join(skillDir, "tests", "scenarios", "rewrite-mode.rubric.md"),
    "utf-8",
  );

  expect(reviewRubric).toContain("不得修改文件");
  expect(reviewRubric).toContain("位置、影响和建议");
  expect(rewriteRubric).toContain("不得虚构");
  expect(rewriteRubric).toContain("直接返回改写稿");
});

test("combined and formatting-only scenarios cover conditional routing", async () => {
  const combined = await readFile(
    join(skillDir, "tests", "scenarios", "combined-mode.rubric.md"),
    "utf-8",
  );
  const formatting = await readFile(
    join(skillDir, "tests", "scenarios", "formatting-only-review.rubric.md"),
    "utf-8",
  );
  const formattingExpected = await readFile(
    join(skillDir, "tests", "scenarios", "formatting-only-review.expected.md"),
    "utf-8",
  );

  expect(combined).toContain("组合模式");
  expect(combined).toContain("先审查，再改写");
  expect(formatting).toContain("不得输出 `Suggested Shape`");
  expect(formatting).toContain("不得加载 `references/open-source-style.md`");
  expect(formattingExpected).not.toContain("## Suggested Shape");
});
