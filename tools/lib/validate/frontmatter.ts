/**
 * L0: SKILL.md frontmatter validation.
 */

import { join } from "node:path";
import { parse as parseYaml } from "yaml";

import {
  NAME_PATTERN,
  CONTINUOUS_HYPHEN,
  MAX_DESCRIPTION_LENGTH,
  exists,
  read,
  extractFrontmatterRaw,
  result,
  fail,
} from "../utils";
import type { CheckResult, Frontmatter } from "../types";

const VALID_STATUSES = new Set(["experimental", "active", "deprecated", "superseded"]);

function parseFrontmatter(content: string): Frontmatter | null {
  const raw = extractFrontmatterRaw(content);
  if (!raw) return null;
  try { return parseYaml(raw) as Frontmatter; } catch { return null; }
}

export async function checkFrontmatter(skillDir: string, skillName: string): Promise<CheckResult> {
  const r = result();
  const path = join(skillDir, "SKILL.md");

  if (!(await exists(path))) return fail(r, `${skillName}: SKILL.md not found`), r;

  const content = await read(path);
  const fm = parseFrontmatter(content);
  if (!fm) return fail(r, `${skillName}: invalid YAML frontmatter`), r;

  const name = fm.name ?? "";
  if (name !== skillName) fail(r, `${skillName}: name '${name}' ≠ directory`);
  if (!NAME_PATTERN.test(name)) fail(r, `${skillName}: name '${name}' invalid characters`);
  if (CONTINUOUS_HYPHEN.test(name)) fail(r, `${skillName}: name '${name}' consecutive hyphens`);
  if (name.length > 64) fail(r, `${skillName}: name exceeds 64 chars`);

  const desc = fm.description ?? "";
  if (!desc) fail(r, `${skillName}: description empty`);
  if (desc.length > MAX_DESCRIPTION_LENGTH) {
    fail(r, `${skillName}: description ${desc.length}/${MAX_DESCRIPTION_LENGTH} chars`);
  }

  const meta = fm.metadata;
  if (meta && typeof meta === "object") {
    for (const [key, value] of Object.entries(meta)) {
      if (typeof value !== "string") fail(r, `${skillName}: metadata.${key} is ${typeof value}, expected string`);
    }
    if (meta.status && !VALID_STATUSES.has(meta.status)) {
      fail(r, `${skillName}: invalid status '${meta.status}'`);
    }
    if (meta.version && !/^\d+\.\d+\.\d+/.test(meta.version)) {
      fail(r, `${skillName}: version '${meta.version}' not semver`);
    }
  }

  return r;
}