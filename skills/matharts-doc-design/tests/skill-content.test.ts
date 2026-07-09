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
    expect(content).toContain("推荐章节顺序");
    expect(content).toContain("不推荐结构");
    expect(content).toContain("中文技术文档风格");
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
  expect(skill).toContain("只列 actionable findings");
  expect(skill).toContain("不输出泛泛优点");
  expect(skill).toContain("下游 Skill 为准");
  expect(skill).toContain("位置：<文件、章节或行号>");
  expect(skill).toContain("影响：<它如何影响读者任务、维护成本或协作流程>");
  expect(skill).toContain("建议：<可执行的修改动作>");
  expect(skill).toContain("当对应下游 Skill 存在时，以其模板字段为准");
});
