import { expect, test } from "bun:test";

import { runCheck } from "./cli";

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
