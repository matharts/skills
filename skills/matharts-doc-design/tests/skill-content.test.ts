import { expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const skillDir = join(import.meta.dir, "..");

test("matharts-doc-design documents review, rewrite, and combined modes", async () => {
  const skill = await readFile(join(skillDir, "SKILL.md"), "utf-8");
  const readme = await readFile(join(skillDir, "README.md"), "utf-8");
  const styleReference = await readFile(
    join(skillDir, "references", "open-source-style.md"),
    "utf-8",
  );

  for (const content of [skill, readme]) {
    expect(content).toContain("审查模式");
    expect(content).toContain("改写模式");
    expect(content).toContain("诊断维度");
    expect(content).toContain("改写原则");
  }

  expect(skill).toContain("硬边界");
  expect(readme).toContain("开源协作结构");
  expect(readme).toContain("Quick Start");
  expect(styleReference).toContain("Open Source Markdown Style System");
  expect(styleReference).toContain("读者任务路径");
  expect(styleReference).toContain("文档类型指导");
  expect(styleReference).toContain("推荐章节顺序");
  expect(styleReference).toContain("不推荐结构");
  expect(styleReference).toContain("中文技术文档风格");

  expect(readme).toContain("Advanced Usage");

  expect(skill).toContain("用户说 `review`");
  expect(skill).toContain("选择审查、改写或组合模式");
  expect(readme).toContain("## 工作模式");
  expect(skill).toContain("Findings");
  expect(skill).toContain("Suggested Shape");
  expect(skill).toContain("README");
  expect(skill).toContain("RFC");
  expect(skill).toContain("ADR");
  expect(styleReference).toContain("Guide");
  expect(styleReference).toContain("AGENTS.md");
  expect(skill).toContain("只列 actionable findings");
  expect(skill).toContain("不输出泛泛优点");
  expect(skill).toContain("下游 Skill 为准");
  expect(skill).toContain("位置：<文件、章节或行号>");
  expect(skill).toContain("影响：<它如何影响读者任务、维护成本或协作流程>");
  expect(skill).toContain("建议：<可执行的修改动作>");
  expect(styleReference).toContain("当对应下游 Skill 存在时，以其模板字段为准");
  expect(skill).toContain("示例选择规则");
  expect(skill).toContain("不推荐输出");
  expect(skill).toContain("默认只读取与当前任务类型最接近的一个示例");
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
    "## 风格参考",
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
  const requiredConsumers = ["matharts-doc-rfc", "matharts-doc-adr"];
  const readmeSkill = await readFile(
    join(skillDir, "..", "matharts-doc-readme", "SKILL.md"),
    "utf-8",
  );

  expect(skill).toContain("`metadata.extends` 只声明依赖关系，不会自动加载本 Skill");
  expect(skill).not.toContain("通过 `metadata.extends` 继承通用文档设计规则");
  expect(readmeSkill).toContain("本 Skill 自包含");
  expect(readmeSkill).not.toContain("必须同时加载并遵循 `matharts-doc-design`");

  for (const consumer of requiredConsumers) {
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

test("matharts-doc-design routes mixed intent and target selection deterministically", async () => {
  const skill = await readFile(join(skillDir, "SKILL.md"), "utf-8");

  expect(skill).toContain("同时要求审查和改写");
  expect(skill).toContain("先审查，再改写");
  expect(skill).toContain("用户提供文本片段");
  expect(skill).toContain("存在多个候选目标");
  expect(skill).toContain("目标不存在或不可写");
  expect(skill).not.toContain("输出改写稿或先确认目标");

  const combined = skill.indexOf("| 同时要求审查和改写 |");
  const review = skill.indexOf("| 用户说 `review`");
  const rewrite = skill.indexOf("| 用户说优化、改写");
  expect(combined).toBeLessThan(review);
  expect(combined).toBeLessThan(rewrite);
});

test("matharts-doc-design repeats one finding shape without inventing a count", async () => {
  const skill = await readFile(join(skillDir, "SKILL.md"), "utf-8");
  const findingsTemplate = skill.match(/```markdown\n## Findings([\s\S]*?)```/)?.[1] ?? "";

  expect(findingsTemplate).toContain("[P1|P2|P3]");
  expect(findingsTemplate.match(/位置：/g)?.length).toBe(1);
  expect(skill).toContain("每个实际问题重复一次；不为满足数量补问题");
});

test("matharts-doc-design makes structural suggestions conditional", async () => {
  const skill = await readFile(join(skillDir, "SKILL.md"), "utf-8");

  expect(skill).toContain("只有存在信息架构或章节顺序问题时，才输出 `Suggested Shape`");
  expect(skill.indexOf("只有存在信息架构或章节顺序问题时")).toBeLessThan(
    skill.indexOf("## Suggested Shape"),
  );
});

test("matharts-doc-design loads the open source style reference on demand", async () => {
  const skill = await readFile(join(skillDir, "SKILL.md"), "utf-8");
  const reference = await readFile(
    join(skillDir, "references", "open-source-style.md"),
    "utf-8",
  );

  expect(skill).toContain("references/open-source-style.md");
  expect(skill).toContain("涉及文档入口、读者路径、文档类型或开源协作结构时读取");
  expect(skill).toContain("中文技术写作风格");
  expect(skill).not.toContain("### 推荐章节顺序");
  expect(reference).toContain("## 推荐章节顺序");
  expect(reference).toContain("## 中文技术文档风格");
});

test("matharts-doc-design combines examples only for independent task goals", async () => {
  const skill = await readFile(join(skillDir, "SKILL.md"), "utf-8");

  expect(skill).toContain("任务同时包含多个独立目标");
  expect(skill).toContain("README 结构重排 + 中文措辞改写");
  expect(skill).not.toContain("同时跨 README、RFC、中文风格或审查输出");
});

test("matharts-doc-design README keeps one source of truth for style rules", async () => {
  const readme = await readFile(join(skillDir, "README.md"), "utf-8");

  expect(readme).not.toContain("顶级开源项目");
  expect(readme).not.toContain("### 推荐章节顺序");
  expect(readme).not.toContain("### 不推荐结构");
  expect(readme).toContain("references/open-source-style.md");
});
