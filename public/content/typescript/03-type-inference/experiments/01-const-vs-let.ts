/**
 * 01 — const vs let inference
 * RUN: npx tsx 03-type-inference/experiments/01-const-vs-let.ts
 *
 * PREDICT types (write in P01) before hovering:
 *   x, y, arr, mixed
 */

const x = "hello";
let y = "hello";
const arr = [1, 2, 3];
const mixed = [1, "two", 3];

console.log({ x, y, arr, mixed });

// Uncomment to test assignability mentally:
// const mode: "hello" | "bye" = x; // ?
// const mode2: "hello" | "bye" = y; // ?

export {};
