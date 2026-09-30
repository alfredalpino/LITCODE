/**
 * Experiment 03 — inspect erasure mindset
 *
 * This file cannot read the .js emit by itself until you compile.
 * After `npx tsc -p 00-typescript-runtime-boundary/tsconfig.emit.json`,
 * open dist/.../01-greet.js and compare.
 *
 * RUN: npx tsx 00-typescript-runtime-boundary/experiments/03-inspect-erasure.ts
 */

import { greet } from "./01-greet.js";

console.log("--- runtime probes ---");
console.log("typeof greet:", typeof greet);
console.log("greet length (arity):", greet.length);
console.log("greetSource hint: function body exists; type annotations do not.");

 // Demonstrates: JS will coerce / interpolate numbers if you bypass types.
console.log("If called as greet(42 as never) mentally — runtime would print:", `Hello ${42}`);

export {};
