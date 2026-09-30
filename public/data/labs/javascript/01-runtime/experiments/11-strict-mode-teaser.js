// 01-runtime / 11-strict-mode-teaser.js
// Run: node 01-runtime/experiments/11-strict-mode-teaser.js

"use strict";

// In strict mode, assigning to an undeclared identifier throws.
try {
  undeclared = 1; // ReferenceError in strict mode
} catch (err) {
  console.log("strict assignment error:", err.name, "-", err.message);
}

// Octal legacy literals like 0123 are forbidden in strict mode (SyntaxError if present).
// We demonstrate a safe strict behavior instead:
console.log("strict mode is active in this file via 'use strict'");

function showThis() {
  console.log("top-level function this === undefined?", this === undefined);
}
showThis();
