/**
 * 04 — void vs undefined
 * RUN: npx tsx 02-basic-types/experiments/04-void-vs-undefined.ts
 *
 * PREDICT: which assignments compile? Uncomment carefully under typecheck.
 */

function returnsUndefined(): undefined {
  return undefined;
}

function returnsVoid(): void {
  // may return undefined implicitly
}

function logHello(): void {
  console.log("hello");
}

const cb: () => void = () => 42; // often allowed: return value is ignored in void context
console.log("cb() =>", cb());

console.log("returnsUndefined():", returnsUndefined());
returnsVoid();
logHello();

// Contextual void is about ignoring returns — not identical to the undefined type in all positions.

export {};
