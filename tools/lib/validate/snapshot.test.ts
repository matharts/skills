import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { checkSnapshot } from "./snapshot";

let root = "";

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "snapshot-test-"));
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

test("fails fixtures without matching expected output", async () => {
  const skillDir = join(root, "matharts-test-skill");
  const fixturesDir = join(skillDir, "tests", "fixtures");
  await mkdir(join(fixturesDir, "expected"), { recursive: true });
  await writeFile(join(fixturesDir, "case.md"), "actual\n");

  const result = await checkSnapshot(skillDir, "matharts-test-skill");

  expect(result.passed).toBe(false);
  expect(result.errors.join("\n")).toContain("missing snapshot");
});
