// 00-orientation / Experiment 01
// Purpose: verify Node can execute scripts in this laboratory.
//
// Run: node 00-orientation/experiments/01-verify-environment.js

"use strict";

const major = Number(process.versions.node.split(".")[0]);

console.log("JavaScript Laboratory — environment check");
console.log("Node version:", process.versions.node);
console.log("V8 version:  ", process.versions.v8);
console.log("Platform:    ", process.platform);
console.log("Arch:        ", process.arch);

if (Number.isNaN(major) || major < 18) {
  console.log("STATUS: FAIL — need Node.js 18+");
  process.exitCode = 1;
} else {
  console.log("STATUS: OK — you can proceed to predictions");
}

// Deep note (read after it runs):
// - `process` is a Node.js host API, not an ECMAScript language primitive.
// - `process.versions.v8` reveals which engine Node embeds on this build.
// - Seeing a V8 version does NOT mean "V8 behavior = JavaScript language law."
