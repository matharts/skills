/**
 * L1: SKILL.md structure, line count, internal/ references, forbidden files.
 */

import { join, relative } from "node:path";

import { MAX_SKILL_MD_LINES, exists, read, walk, result, fail, warn } from "../utils";
import type { CheckResult } from "../types";

export async function checkStructure(skillDir: string, skillName: string): Promise<CheckResult> {
  const r = result();
  const skillMd = join(skillDir, "SKILL.md");
  const readmeMd = join(skillDir, "README.md");

  if (!(await exists(skillMd))) fail(r, `${skillName}: SKILL.md not found`);
  if (!(await exists(readmeMd))) fail(r, `${skillName}: README.md not found`);

  if (await exists(skillMd)) {
    const lines = (await read(skillMd)).split("\n").length;
    if (lines > MAX_SKILL_MD_LINES) {
      fail(r, `${skillName}: SKILL.md ${lines} lines (max ${MAX_SKILL_MD_LINES})`);
    }
  }

  for (const md of await walk(skillDir, ".md")) {
    const content = await read(md);
    const rel = relative(skillDir, md);
    if (/\.\.\/internal|\.\.\\internal/.test(content)) fail(r, `${skillName}: ${rel} references internal/`);
    if (/\.\.\/\.\.\/\.\.\/|\.\.\\\.\.\\\.\.\\/.test(content)) warn(r, `${skillName}: ${rel} deep traversal`);
  }

  for (const f of ["skill.json", "VERSION"]) {
    if (await exists(join(skillDir, f))) {
      fail(r, `${skillName}: ${f} exists — metadata must be in SKILL.md frontmatter`);
    }
  }

  return r;
}