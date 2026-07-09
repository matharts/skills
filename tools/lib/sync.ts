/**
 * Internal shared-source → Skill sync + backup + rollback.
 */

import { readdir, mkdir, cp, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

import { exists, walk, listSkills, read } from "./utils";

// ── Paths ────────────────────────────────────────────────────

const REPO_ROOT = join(import.meta.dir, "..", "..");
const SHARED_SOURCE = join(REPO_ROOT, "internal", "shared-source");
const SKILLS_DIR = join(REPO_ROOT, "skills");
const BACKUP_DIR = join(REPO_ROOT, ".sync-backup");

interface SyncPaths {
  repoRoot: string;
  sharedSource: string;
  skillsDir: string;
  backupDir: string;
}

interface BackupEntry {
  skillName: string;
  rel: string;
  existed: boolean;
}

interface BackupManifest {
  entries: BackupEntry[];
}

const defaultPaths = (): SyncPaths => ({
  repoRoot: REPO_ROOT,
  sharedSource: SHARED_SOURCE,
  skillsDir: SKILLS_DIR,
  backupDir: BACKUP_DIR,
});

// ── Helpers ──────────────────────────────────────────────────

const stamp = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
};

const batchName = () => `${stamp()}_${Math.random().toString(36).slice(2, 8)}`;

// ── Backup ───────────────────────────────────────────────────

async function backupSkill(
  batchRoot: string,
  skillDir: string,
  skillName: string,
  files: string[],
  manifest: BackupManifest,
): Promise<void> {
  for (const src of files) {
    const rel = relative(skillDir, src);
    manifest.entries.push({ skillName, rel, existed: await exists(src) });
    if (await exists(src)) {
      const dst = join(batchRoot, skillName, rel);
      await mkdir(dirname(dst), { recursive: true });
      await cp(src, dst);
    }
  }
}

// ── Core sync ────────────────────────────────────────────────

export interface SyncOptions {
  interactive?: boolean;
  dryRun?: boolean;
  paths?: SyncPaths;
}

export interface RollbackOptions {
  paths?: SyncPaths;
}

async function copyFile(src: string, dst: string, opts: SyncOptions, paths: SyncPaths): Promise<boolean> {
  if (!(await exists(src))) {
    console.error(`  WARN: source not found: ${src}`);
    return false;
  }
  if (opts.interactive && (await exists(dst))) console.log(`  OVERWRITE: ${dst}`);
  if (opts.dryRun) {
    console.log(`  DRY-RUN: ${relative(paths.repoRoot, src)} -> ${relative(paths.repoRoot, dst)}`);
    return true;
  }
  await mkdir(dirname(dst), { recursive: true });
  await cp(src, dst);
  console.log(`  SYNC: ${relative(paths.repoRoot, src)} -> ${relative(paths.repoRoot, dst)}`);
  return true;
}

export async function syncSharedSource(opts: SyncOptions = {}): Promise<void> {
  const paths = opts.paths ?? defaultPaths();

  if (!(await exists(paths.sharedSource))) {
    console.error(`ERROR: ${paths.sharedSource} not found`);
    process.exit(1);
  }

  const skills = await listSkills(paths.skillsDir);
  if (skills.length === 0) return console.warn("WARNING: no skill directories found");

  const sharedRefs = await walk(join(paths.sharedSource, "references"), ".md");
  const sharedAssets = await walk(join(paths.sharedSource, "assets"));
  if (sharedRefs.length === 0 && sharedAssets.length === 0) {
    return console.log("No shared files to sync");
  }

  const batchRoot = join(paths.backupDir, batchName());
  const manifest: BackupManifest = { entries: [] };
  if (!opts.dryRun) await mkdir(batchRoot, { recursive: true });

  for (const skillName of skills) {
    const skillDir = join(paths.skillsDir, skillName);
    console.log(`\n[${skillName}]`);

    const targets: string[] = [];
    for (const ref of sharedRefs) {
      targets.push(join(skillDir, "references", relative(join(paths.sharedSource, "references"), ref)));
    }
    for (const asset of sharedAssets) {
      targets.push(join(skillDir, "assets", relative(join(paths.sharedSource, "assets"), asset)));
    }

    if (!opts.dryRun) await backupSkill(batchRoot, skillDir, skillName, targets, manifest);

    for (const ref of sharedRefs) {
      const dst = join(skillDir, "references", relative(join(paths.sharedSource, "references"), ref));
      await copyFile(ref, dst, opts, paths);
    }
    for (const asset of sharedAssets) {
      const dst = join(skillDir, "assets", relative(join(paths.sharedSource, "assets"), asset));
      await copyFile(asset, dst, opts, paths);
    }
  }

  if (!opts.dryRun) {
    await writeFile(join(batchRoot, "manifest.json"), JSON.stringify(manifest, null, 2));
  }

  console.log("\nSync complete.");
}

// ── Rollback ─────────────────────────────────────────────────

export async function rollbackSync(opts: RollbackOptions = {}): Promise<void> {
  const paths = opts.paths ?? defaultPaths();

  if (!(await exists(paths.backupDir))) return console.log("No backup directory found");

  const backups = (await readdir(paths.backupDir)).sort().reverse();
  if (backups.length === 0) return console.log("No backups available");

  const latest = backups[0];
  const latestPath = join(paths.backupDir, latest);
  console.log(`Rolling back to: ${latest}`);

  const manifestPath = join(latestPath, "manifest.json");
  if (!(await exists(manifestPath))) {
    console.error(`ERROR: rollback manifest not found: ${manifestPath}`);
    process.exit(1);
  }

  const manifest = JSON.parse(await read(manifestPath)) as BackupManifest;
  for (const entry of manifest.entries) {
    const target = join(paths.skillsDir, entry.skillName, entry.rel);
    if (entry.existed) {
      const backupFile = join(latestPath, entry.skillName, entry.rel);
      await mkdir(dirname(target), { recursive: true });
      await cp(backupFile, target);
      console.log(`  RESTORE: ${entry.skillName}/${entry.rel}`);
    } else {
      await rm(target, { force: true });
      console.log(`  REMOVE: ${entry.skillName}/${entry.rel}`);
    }
  }
  console.log("Rollback complete.");
}
