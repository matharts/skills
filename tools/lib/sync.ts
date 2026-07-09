/**
 * Internal shared-source → Skill sync + backup + rollback.
 */

import { readdir, mkdir, cp, rm } from "node:fs/promises";
import { join, relative } from "node:path";

import { exists, walk, listSkills } from "./utils";

// ── Paths ────────────────────────────────────────────────────

const REPO_ROOT = join(import.meta.dir, "..", "..");
const SHARED_SOURCE = join(REPO_ROOT, "internal", "shared-source");
const SKILLS_DIR = join(REPO_ROOT, "skills");
const BACKUP_DIR = join(REPO_ROOT, ".sync-backup");

// ── Helpers ──────────────────────────────────────────────────

const stamp = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
};

// ── Backup ───────────────────────────────────────────────────

async function backup(skillDir: string, skillName: string, files: string[]): Promise<string> {
  const root = join(BACKUP_DIR, `${skillName}_${stamp()}`);
  await mkdir(root, { recursive: true });
  for (const src of files) {
    if (await exists(src)) {
      const dst = join(root, relative(skillDir, src));
      await mkdir(join(dst, ".."), { recursive: true });
      await cp(src, dst);
    }
  }
  return root;
}

// ── Core sync ────────────────────────────────────────────────

export interface SyncOptions {
  interactive?: boolean;
  dryRun?: boolean;
}

async function copyFile(src: string, dst: string, opts: SyncOptions): Promise<boolean> {
  if (!(await exists(src))) {
    console.error(`  WARN: source not found: ${src}`);
    return false;
  }
  if (opts.interactive && (await exists(dst))) console.log(`  OVERWRITE: ${dst}`);
  if (opts.dryRun) {
    console.log(`  DRY-RUN: ${relative(REPO_ROOT, src)} -> ${relative(REPO_ROOT, dst)}`);
    return true;
  }
  await mkdir(join(dst, ".."), { recursive: true });
  await cp(src, dst);
  console.log(`  SYNC: ${relative(REPO_ROOT, src)} -> ${relative(REPO_ROOT, dst)}`);
  return true;
}

export async function syncSharedSource(opts: SyncOptions = {}): Promise<void> {
  if (!(await exists(SHARED_SOURCE))) {
    console.error(`ERROR: ${SHARED_SOURCE} not found`);
    process.exit(1);
  }

  const skills = await listSkills(SKILLS_DIR);
  if (skills.length === 0) return console.warn("WARNING: no skill directories found");

  const sharedRefs = await walk(join(SHARED_SOURCE, "references"), ".md");
  const sharedAssets = await walk(join(SHARED_SOURCE, "assets"));
  if (sharedRefs.length === 0 && sharedAssets.length === 0) {
    return console.log("No shared files to sync");
  }

  for (const skillName of skills) {
    const skillDir = join(SKILLS_DIR, skillName);
    console.log(`\n[${skillName}]`);

    const targets: string[] = [];
    for (const ref of sharedRefs) {
      targets.push(join(skillDir, "references", relative(join(SHARED_SOURCE, "references"), ref)));
    }
    for (const asset of sharedAssets) {
      targets.push(join(skillDir, "assets", relative(join(SHARED_SOURCE, "assets"), asset)));
    }

    if (!opts.dryRun) await backup(skillDir, skillName, targets);

    for (const ref of sharedRefs) {
      const dst = join(skillDir, "references", relative(join(SHARED_SOURCE, "references"), ref));
      await copyFile(ref, dst, opts);
    }
    for (const asset of sharedAssets) {
      const dst = join(skillDir, "assets", relative(join(SHARED_SOURCE, "assets"), asset));
      await copyFile(asset, dst, opts);
    }
  }

  console.log("\nSync complete.");
}

// ── Rollback ─────────────────────────────────────────────────

export async function rollbackSync(): Promise<void> {
  if (!(await exists(BACKUP_DIR))) return console.log("No backup directory found");

  const backups = (await readdir(BACKUP_DIR)).sort().reverse();
  if (backups.length === 0) return console.log("No backups available");

  const latest = backups[0];
  const latestPath = join(BACKUP_DIR, latest);
  console.log(`Rolling back to: ${latest}`);

  const skillName = latest.split("_")[0];
  for (const file of await walk(latestPath)) {
    const rel = relative(latestPath, file);
    const target = join(SKILLS_DIR, skillName, rel);
    await mkdir(join(target, ".."), { recursive: true });
    await cp(file, target);
    console.log(`  RESTORE: ${rel}`);
  }
  console.log("Rollback complete.");
}