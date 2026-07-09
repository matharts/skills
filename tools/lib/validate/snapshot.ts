/**
 * L3: Compare test fixtures against expected outputs.
 */

import { join, relative } from "node:path";

import { exists, read, walk, result, fail, warn } from "../utils";
import type { CheckResult } from "../types";

export async function checkSnapshot(skillDir: string, skillName: string): Promise<CheckResult> {
  const r = result();
  const fixturesDir = join(skillDir, "tests", "fixtures");
  const expectedDir = join(fixturesDir, "expected");

  if (!(await exists(fixturesDir))) return warn(r, `${skillName}: no tests/fixtures/ (L3 skipped)`), r;
  if (!(await exists(expectedDir))) return warn(r, `${skillName}: no tests/fixtures/expected/ (L3 skipped)`), r;

  for (const fixture of await walk(fixturesDir)) {
    if (fixture.includes("expected")) continue;
    const expected = join(expectedDir, relative(fixturesDir, fixture) + ".output");
    if (await exists(expected)) {
      const actual = await read(fixture);
      const want = await read(expected);
      if (actual !== want) fail(r, `${skillName}: snapshot mismatch for ${relative(fixturesDir, fixture)}`);
    }
  }

  return r;
}