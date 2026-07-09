#!/usr/bin/env bun
/**
 * MathArts Skills CLI — unified entry point.
 *
 * Commands:
 *   bun tools/cli.ts validate [--check <level>] [skills_dir]
 *   bun tools/cli.ts sync [--interactive] [--dry-run]
 *   bun tools/cli.ts rollback
 *   bun tools/cli.ts check [--sync] [--fix]
 */

import { parseArgs } from "util";
import { stat } from "node:fs/promises";
import { join } from "node:path";

import { listSkills, printResult } from "./lib/utils";
import type { CheckLevel } from "./lib/types";
import { CHECK_LEVELS } from "./lib/types";
import { validate } from "./lib/validate/index";
import { syncSharedSource, rollbackSync } from "./lib/sync";

interface CheckDeps {
  runValidation: (level: CheckLevel) => Promise<boolean>;
  syncSharedSource: () => Promise<void>;
  log: (message: string) => void;
}

async function runSkillsRef(skillsRoot: string, skills: string[]): Promise<boolean> {
  if (process.env.MATHARTS_SKIP_SKILLS_REF === "1") return true;

  let passed = true;
  for (const name of skills) {
    const proc = Bun.spawn(["npx", "--yes", "skills-ref", "validate", join(skillsRoot, name)], {
      stdout: "inherit",
      stderr: "inherit",
    });
    const code = await proc.exited;
    if (code !== 0) passed = false;
  }
  return passed;
}

// ── Validate ─────────────────────────────────────────────────

async function runValidation(level: CheckLevel, skillsRoot = "skills"): Promise<boolean> {
  try { await stat(skillsRoot); } catch {
    console.error(`ERROR: skills directory not found: ${skillsRoot}`);
    return false;
  }

  const skills = await listSkills(skillsRoot);
  if (skills.length === 0) {
    console.warn(`WARNING: no skill directories in ${skillsRoot}`);
    return true;
  }

  let allPassed = true;
  if (level === "all" || level === "frontmatter") {
    allPassed = await runSkillsRef(skillsRoot, skills);
  }

  for (const name of skills) {
    const r = await validate(join(skillsRoot, name), name, level);
    if (!printResult(name, r)) allPassed = false;
  }

  return allPassed;
}

async function cmdValidate(args: string[]): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    options: { check: { type: "string", default: "all" } },
    allowPositionals: true,
  });

  const level = values.check!;
  if (!(CHECK_LEVELS as string[]).includes(level)) {
    console.error(`ERROR: unknown check '${level}'. valid: ${CHECK_LEVELS.join(", ")}`);
    process.exit(1);
  }

  const skillsRoot = positionals[0] ?? "skills";
  const passed = await runValidation(level as CheckLevel, skillsRoot);
  process.exit(passed ? 0 : 1);
}

// ── Sync ─────────────────────────────────────────────────────

async function cmdSync(args: string[]): Promise<void> {
  const { values } = parseArgs({
    args,
    options: {
      interactive: { type: "boolean", default: false },
      "dry-run": { type: "boolean", default: false },
    },
  });
  await syncSharedSource({ interactive: values.interactive!, dryRun: values["dry-run"]! });
}

// ── Rollback ─────────────────────────────────────────────────

async function cmdRollback(_args: string[]): Promise<void> {
  await rollbackSync();
}

// ── Check (all-in-one) ───────────────────────────────────────

export async function runCheck(
  args: string[],
  deps: Partial<CheckDeps> = {},
): Promise<number> {
  const resolvedDeps: CheckDeps = {
    runValidation: (level) => runValidation(level),
    syncSharedSource: () => syncSharedSource(),
    log: (message) => console.log(message),
    ...deps,
  };
  const doSync = args.includes("--sync");
  const blockingLevels: Array<{ level: CheckLevel; heading: string }> = [
    { level: "frontmatter", heading: "L0: frontmatter" },
    { level: "structure", heading: "L1: structure" },
    { level: "selfcontained", heading: "L2: self-contained" },
  ];
  let allBlockingPassed = true;

  for (const { level, heading } of blockingLevels) {
    resolvedDeps.log(`\n--- ${heading} ---`);
    if (!(await resolvedDeps.runValidation(level))) allBlockingPassed = false;
  }

  resolvedDeps.log("\n--- L3: snapshot (warning-only) ---");
  await resolvedDeps.runValidation("snapshot");

  if (!allBlockingPassed) return 1;

  if (doSync) {
    console.log("\n--- Sync shared-source ---");
    await resolvedDeps.syncSharedSource();
  }

  return 0;
}

async function cmdCheck(args: string[]): Promise<void> {
  process.exit(await runCheck(args));
}

// ── Main ─────────────────────────────────────────────────────

const USAGE = `
Usage:
  bun tools/cli.ts validate [--check <level>] [skills_dir]
  bun tools/cli.ts sync [--interactive] [--dry-run]
  bun tools/cli.ts rollback
  bun tools/cli.ts check [--sync]

Commands:
  validate   Run L0-L3 validation checks (default: all)
  sync       Sync internal/shared-source/ → skills/*/
  rollback   Rollback last sync
  check      validate all + optional sync

Check levels: ${CHECK_LEVELS.join(", ")}`;

async function main(): Promise<void> {
  const cmd = Bun.argv[2];
  const args = Bun.argv.slice(3);

  switch (cmd) {
    case "validate": return cmdValidate(args);
    case "sync": return cmdSync(args);
    case "rollback": return cmdRollback(args);
    case "check": return cmdCheck(args);
    case "--help":
    case "-h":
      console.log(USAGE);
      process.exit(0);
    default:
      console.error(`ERROR: unknown command '${cmd}'\n${USAGE}`);
      process.exit(1);
  }
}

if (import.meta.main) {
  main();
}
