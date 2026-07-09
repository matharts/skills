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

// ── Validate ─────────────────────────────────────────────────

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
  try { await stat(skillsRoot); } catch {
    console.error(`ERROR: skills directory not found: ${skillsRoot}`);
    process.exit(1);
  }

  const skills = await listSkills(skillsRoot);
  if (skills.length === 0) {
    console.warn(`WARNING: no skill directories in ${skillsRoot}`);
    process.exit(0);
  }

  let allPassed = true;
  for (const name of skills) {
    const r = await validate(join(skillsRoot, name), name, level as CheckLevel);
    if (!printResult(name, r)) allPassed = false;
  }

  process.exit(allPassed ? 0 : 1);
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

async function cmdCheck(args: string[]): Promise<void> {
  const doSync = args.includes("--sync");

  // validate all — run via cmdValidate with "all" level
  await cmdValidate(["--check", "all"]);

  if (doSync) {
    console.log("\n--- Sync shared-source ---");
    await syncSharedSource();
  }
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

main();