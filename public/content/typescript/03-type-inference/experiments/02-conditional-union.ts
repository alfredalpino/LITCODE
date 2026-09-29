/**
 * 02 — conditional expressions infer unions
 * RUN: npx tsx 03-type-inference/experiments/02-conditional-union.ts
 */

const value = Math.random() > 0.5 ? "hello" : 42;

console.log(value);

function describe(v: typeof value): string {
  if (typeof v === "string") {
    return v.toUpperCase();
  }
  return v.toFixed(0);
}

console.log(describe(value));

export {};
