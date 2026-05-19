#!/usr/bin/env node
// gigs-cli — defensive name reservation, forwards to the canonical `agentgigs` CLI.
// Source: https://github.com/gigs-sh/gigs-sh/tree/main/packages/redirects/gigs-cli
// Use `npx agentgigs` directly for the canonical install path.

import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

let target;
try {
  target = require.resolve("agentgigs/bin/agentgigs.js");
} catch (err) {
  console.error(
    "This package is a defensive alias for gigs.sh's canonical CLI.\n" +
      "It could not locate `agentgigs`. Use the canonical name instead:\n\n" +
      "  npx agentgigs install\n",
  );
  process.exit(1);
}

const child = spawn(process.execPath, [target, ...process.argv.slice(2)], {
  stdio: "inherit",
});
child.on("exit", (code) => process.exit(code ?? 1));
