/**
 * Unified validation runner.
 */

import { result } from "../utils";
import type { CheckResult, CheckLevel } from "../types";

import { checkFrontmatter } from "./frontmatter";
import { checkStructure } from "./structure";
import { checkSelfcontained } from "./self-contained";

export async function validate(
  skillDir: string,
  skillName: string,
  level: CheckLevel,
): Promise<CheckResult> {
  const r = result();
  const run = (lvl: CheckLevel) => level === "all" || level === lvl;

  if (run("frontmatter")) {
    const sub = await checkFrontmatter(skillDir, skillName);
    r.errors.push(...sub.errors);
    r.warnings.push(...sub.warnings);
    if (!sub.passed) r.passed = false;
  }
  if (run("structure")) {
    const sub = await checkStructure(skillDir, skillName);
    r.errors.push(...sub.errors);
    r.warnings.push(...sub.warnings);
    if (!sub.passed) r.passed = false;
  }
  if (run("selfcontained")) {
    const sub = await checkSelfcontained(skillDir, skillName);
    r.errors.push(...sub.errors);
    r.warnings.push(...sub.warnings);
    if (!sub.passed) r.passed = false;
  }
  return r;
}
