import { expect, test } from "bun:test";

import { runCheck, runValidation } from "./cli";

test("snapshot validation is deferred once", async () => {
  const warnings: string[] = [];
  const originalWarn = console.warn;
  console.warn = (message) => warnings.push(String(message));

  try {
    expect(await runValidation("snapshot")).toBe(true);
  } finally {
    console.warn = originalWarn;
  }

  expect(warnings).toEqual([
    "L3 deferred: no Agent runner configured; Skill behavior was not tested",
  ]);
});

test("check --sync runs sync after blocking validation passes", async () => {
  const calls: string[] = [];

  const exitCode = await runCheck(["--sync"], {
    runValidation: async (level) => {
      calls.push(`validate:${level}`);
      return level !== "snapshot";
    },
    syncSharedSource: async () => {
      calls.push("sync");
    },
  });

  expect(exitCode).toBe(0);
  expect(calls).toEqual([
    "validate:frontmatter",
    "validate:structure",
    "validate:selfcontained",
    "validate:snapshot",
    "sync",
  ]);
});

test("check does not block on snapshot failures", async () => {
  const exitCode = await runCheck([], {
    runValidation: async (level) => level !== "snapshot",
    syncSharedSource: async () => {},
  });

  expect(exitCode).toBe(0);
});

test("check does not sync after blocking validation fails", async () => {
  let synced = false;

  const exitCode = await runCheck(["--sync"], {
    runValidation: async (level) => level !== "structure",
    syncSharedSource: async () => {
      synced = true;
    },
  });

  expect(exitCode).toBe(1);
  expect(synced).toBe(false);
});

test("check prints stage headings", async () => {
  const logs: string[] = [];

  await runCheck([], {
    runValidation: async () => true,
    syncSharedSource: async () => {},
    log: (message) => logs.push(message),
  });

  expect(logs).toEqual([
    "\n--- L0: frontmatter ---",
    "\n--- L1: structure ---",
    "\n--- L2: self-contained ---",
    "\n--- L3: deferred ---",
  ]);
});
