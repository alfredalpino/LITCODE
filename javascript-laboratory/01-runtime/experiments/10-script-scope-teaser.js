// 01-runtime / 10-script-scope-teaser.js
// Classic Node script (not ESM). Observe global object behavior.
// Run: node 01-runtime/experiments/10-script-scope-teaser.js
//
// IMPORTANT: Browser classic scripts attach top-level `var` to `window`.
// Node's classic scripts historically wrapped files (CommonJS-like module wrapper),
// so top-level `var` is NOT necessarily a property of `globalThis`.
// This experiment exists to STOP you from assuming one global model everywhere.

"use strict";

var viaVar = "var-binding";
let viaLet = "let-binding";

console.log("viaVar value:", viaVar);
console.log("viaLet value:", viaLet);

console.log("globalThis.viaVar →", globalThis.viaVar);
console.log("globalThis.viaLet →", globalThis.viaLet);

// Explicit global assignment (host global object):
globalThis.explicitGlobal = "on-globalThis";
console.log("globalThis.explicitGlobal →", globalThis.explicitGlobal);

console.log(
  "\nTakeaway: binding rules + host packaging interact. Deep dive in modules 03 & 19."
);
