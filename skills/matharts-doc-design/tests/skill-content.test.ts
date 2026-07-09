import { expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const skillDir = import.meta.dir.replace(/\\tests$/, "");

test("matharts-doc-design documents dual review and rewrite modes", async () => {
  const skill = await readFile(join(skillDir, "SKILL.md"), "utf-8");
  const readme = await readFile(join(skillDir, "README.md"), "utf-8");

  for (const content of [skill, readme]) {
    expect(content).toContain("审查模式");
    expect(content).toContain("改写模式");
    expect(content).toContain("诊断维度");
    expect(content).toContain("改写原则");
    expect(content).toContain("Open Source Markdown Style System");
    expect(content).toContain("读者任务路径");
    expect(content).toContain("文档类型指导");
    expect(content).toContain("协作边界");
  }

  expect(skill).toContain("用户说 `review`");
  expect(skill).toContain("Findings");
  expect(skill).toContain("Suggested Shape");
  expect(skill).toContain("README");
  expect(skill).toContain("RFC");
  expect(skill).toContain("ADR");
  expect(skill).toContain("Guide");
  expect(skill).toContain("AGENTS.md");
});
