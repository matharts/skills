/**
 * L2: Copy skill to sandbox, verify no path escapes skill directory.
 */

import { mkdir, cp, rm } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { tmpdir } from "node:os";

import { read, walk, result, fail } from "../utils";
import type { CheckResult } from "../types";

export async function checkSelfcontained(skillDir: string, skillName: string): Promise<CheckResult> {
  const r = result();
  const id = `skill-validate-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const sandbox = join(tmpdir(), id, skillName);

  try {
    await mkdir(sandbox, { recursive: true });
    await cp(skillDir, sandbox, { recursive: true });

    for (const md of await walk(sandbox, ".md")) {
      const content = await read(md);
      const rel = relative(sandbox, md);
      const depth = rel.split(sep).length - 1;

      for (const line of content.split("\n")) {
        if ((line.match(/\.\.(?:\/|\\)/g) ?? []).length > depth) {
          fail(r, `${skillName}: ${rel} escapes skill dir: ${line.trim().slice(0, 80)}`);
          break;
        }
      }
    }
  } finally {
    await rm(join(tmpdir(), id), { recursive: true, force: true }).catch(() => {});
  }

  return r;
}
