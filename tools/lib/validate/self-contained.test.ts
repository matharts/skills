import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { checkSelfcontained } from "./self-contained";

let root = "";

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "self-contained-test-"));
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

test("fails Windows-style path escapes", async () => {
  const skillDir = join(root, "matharts-test-skill");
  await mkdir(skillDir, { recursive: true });
  await writeFile(join(skillDir, "SKILL.md"), "Read ..\\..\\internal\\shared-source\\rules.md\n");

  const result = await checkSelfcontained(skillDir, "matharts-test-skill");

  expect(result.passed).toBe(false);
  expect(result.errors.join("\n")).toContain("escapes skill dir");
});
