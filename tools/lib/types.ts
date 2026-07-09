// ── Shared types for MathArts skill tools ───────────────────

export interface Frontmatter {
  name?: string;
  description?: string;
  license?: string;
  compatibility?: string;
  metadata?: Record<string, string>;
  "allowed-tools"?: string;
}

export interface CheckResult {
  errors: string[];
  warnings: string[];
  passed: boolean;
}

export type CheckLevel = "all" | "frontmatter" | "structure" | "selfcontained" | "snapshot";

export const CHECK_LEVELS: CheckLevel[] = [
  "all",
  "frontmatter",
  "structure",
  "selfcontained",
  "snapshot",
];