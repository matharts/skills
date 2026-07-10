import { expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const skillDir = join(import.meta.dir, "..");

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
    expect(content).toContain("Quick Start");
  }

  expect(readme).toContain("Advanced Usage");

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
  expect(skill).toContain("示例选择规则");
  expect(skill).toContain("不推荐输出");
  expect(skill).toContain("优先读取与当前任务类型最接近的一个示例");
  expect(skill).toContain("何时不用");
  expect(skill).toContain("需要 README 内容完整性时，用 `matharts-doc-readme`");
  expect(skill).toContain("需要 RFC 字段合同时，用 `matharts-doc-rfc`");
  expect(skill).toContain("只问事实内容时，不使用本 Skill");
});

test("matharts-doc-design keeps execution sections in reader-task order", async () => {
  const skill = await readFile(join(skillDir, "SKILL.md"), "utf-8");
  const sections = [
    "## 何时使用",
    "## 何时不用",
    "## 工作模式",
    "## 审查模式",
    "## 改写模式",
    "## Open Source Markdown Style System",
    "## 诊断维度",
    "## 示例层",
    "## 排版规则",
    "## 与其他 Skill 的关系",
  ];

  const positions = sections.map((section) => skill.indexOf(section));
  for (const position of positions) {
    expect(position).toBeGreaterThan(-1);
  }
  expect(positions).toEqual([...positions].sort((a, b) => a - b));
});

test("matharts-doc-design discovery is scoped to design concerns", async () => {
  const skill = await readFile(join(skillDir, "SKILL.md"), "utf-8");
  const description = skill.match(/^description: (.+)$/m)?.[1] ?? "";

  expect(description).toStartWith("Use when");
  expect(description).toContain("document design");
  expect(description).toContain("structure");
  expect(description).toContain("readability");
  expect(description).toContain("style");
  expect(description).toContain("primary concern");
  expect(description.length).toBeLessThanOrEqual(500);
});

test("matharts-doc-design treats extends as a declaration, not runtime inheritance", async () => {
  const skill = await readFile(join(skillDir, "SKILL.md"), "utf-8");
  const consumers = ["matharts-doc-readme", "matharts-doc-rfc", "matharts-doc-adr"];

  expect(skill).toContain("`metadata.extends` 只声明依赖关系，不会自动加载本 Skill");
  expect(skill).not.toContain("通过 `metadata.extends` 继承通用文档设计规则");

  for (const consumer of consumers) {
    const consumerSkill = await readFile(join(skillDir, "..", consumer, "SKILL.md"), "utf-8");
    expect(consumerSkill).toContain("必须同时加载并遵循 `matharts-doc-design`");
  }
});

test("matharts-doc-design keeps document contracts in downstream skills", async () => {
  const skill = await readFile(join(skillDir, "SKILL.md"), "utf-8");

  expect(skill).toContain("只有下游 Skill 明确要求时，才把字段缺失列为 finding");
  expect(skill).not.toContain("RFC/ADR 是否缺少替代方案、缺点或后果");
  expect(skill).not.toContain("列表项超过 7 项");
  expect(skill).not.toContain("每 50-80 行设置一个二级标题");
});
