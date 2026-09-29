// 01-runtime / 09-layers-evidence.js
// PREDICT: predictions/P05-layers.md
// Run: node 01-runtime/experiments/09-layers-evidence.js

"use strict";

// --- Language (ECMAScript) ---
const languageResult = (1 + 2) * 3;
console.log("[language] (1 + 2) * 3 =", languageResult);

// --- Host (Node.js) ---
console.log("[host] process.pid =", process.pid);
console.log("[host] process.release.name =", process.release && process.release.name);

// --- Engine (embedded by this Node build) ---
console.log("[engine] process.versions.v8 =", process.versions.v8);
console.log("[engine] process.versions.node =", process.versions.node);

console.log(
  "\nRemember: engine version explains implementation, not new language laws."
);
