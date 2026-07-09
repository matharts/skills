/**
 * Shared utilities for MathArts skill tools.
 */

import { readdir, readFile, access } from "node:fs/promises";
import { join } from "node:path";

import type { CheckResult } from "./types";

// ── Constants ────────────────────────────────────────────────

export const NAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
export const CONTINUOUS_HYPHEN = /--/;
export const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---/;
export const MAX_SKILL_MD_LINES = 500;
export const MAX_DESCRIPTION_LENGTH = 1024;

// ── File ops ─────────────────────────────────────────────────

export async function exists(p: string): Promise<boolean> {
  try { await access(p); return true; } catch { return false; }
}

export async function read(p: string): Promise<string> {
  return readFile(p, "utf-8");
}

export async function walk(dir: string, ext?: string): Promise<string[]> {
  const files: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true, recursive: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (ext && !entry.name.endsWith(ext)) continue;
      files.push(join(entry.parentPath ?? dir, entry.name));
    }
  } catch { /* dir may not exist */ }
  return files;
}

export async function listSkills(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort();
}

// ── Validation helpers ───────────────────────────────────────

export function result(): CheckResult {
  return { errors: [], warnings: [], passed: true };
}

export function fail(r: CheckResult, msg: string): void {
  r.errors.push(msg);
  r.passed = false;
}

export function warn(r: CheckResult, msg: string): void {
  r.warnings.push(msg);
}

export function printResult(name: string, r: CheckResult): boolean {
  console.log(`[${r.passed ? "PASS" : "FAIL"}] ${name}`);
  for (const e of r.errors) console.log(`  ERROR: ${e}`);
  for (const w of r.warnings) console.log(`  WARN:  ${w}`);
  return r.passed;
}

// ── Frontmatter ──────────────────────────────────────────────

export function extractFrontmatterRaw(content: string): string | null {
  const m = content.match(FRONTMATTER_RE);
  return m ? m[1] : null;
}