/**
 * Experiment 01 — verify toolchain
 * RUN: npx tsx 01-toolchain/experiments/01-verify-toolchain.ts
 */

import process from "node:process";

console.log("node:", process.version);
console.log("cwd:", process.cwd());

const major = Number(process.versions.node.split(".")[0]);
if (Number.isNaN(major) || major < 18) {
  console.error("Need Node 18+");
  process.exitCode = 1;
} else {
  console.log("toolchain environment: OK (Node major >= 18)");
  console.log("Next: npx tsc -v && npx tsx -v && npm run typecheck");
}

export {};
