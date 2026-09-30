// 01-runtime / 02-syntax-error.js
// INTENTIONALLY INVALID — demonstrates parse-time failure.
//
// Run: node 01-runtime/experiments/02-syntax-error.js
// Expect: SyntaxError. No "started" log should appear.
//
// After observing, try the valid twin: 02b-valid-syntax.js

"use strict";

console.log("started");

console.log("broken
