import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { exists } from "./utils";
import { rollbackSync, syncSharedSource } from "./sync";

let root = "";
let paths: {
  repoRoot: string;
  sharedSource: string;
  skillsDir: string;
  backupDir: string;
};

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "sync-test-"));
  paths = {
    repoRoot: root,
    sharedSource: join(root, "internal", "shared-source"),
    skillsDir: join(root, "skills"),
    backupDir: join(root, ".sync-backup"),
  };

  await mkdir(join(paths.sharedSource, "references"), { recursive: true });
  await writeFile(join(paths.sharedSource, "references", "shared.md"), "shared\n");

  for (const skillName of ["skill-a", "skill-b"]) {
    await mkdir(join(paths.skillsDir, skillName, "references"), { recursive: true });
    await writeFile(join(paths.skillsDir, skillName, "references", "shared.md"), `${skillName} original\n`);
  }
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

test("rollback restores every skill touched by one sync batch", async () => {
  await syncSharedSource({ paths });
  await rollbackSync({ paths });

  await expect(readFile(join(paths.skillsDir, "skill-a", "references", "shared.md"), "utf-8"))
    .resolves.toBe("skill-a original\n");
  await expect(readFile(join(paths.skillsDir, "skill-b", "references", "shared.md"), "utf-8"))
    .resolves.toBe("skill-b original\n");
});

test("rollback removes files created by sync", async () => {
  await rm(join(paths.skillsDir, "skill-b", "references", "shared.md"), { force: true });

  await syncSharedSource({ paths });
  await rollbackSync({ paths });

  expect(await exists(join(paths.skillsDir, "skill-b", "references", "shared.md"))).toBe(false);
});
