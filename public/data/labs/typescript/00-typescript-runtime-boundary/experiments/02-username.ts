/**
 * Experiment 02 — username annotation
 * RUN: npx tsx 00-typescript-runtime-boundary/experiments/02-username.ts
 */

const username: string = "Ubaid";

console.log(username);
console.log(typeof username);

// BREAK (uncomment to see a type error under `npm run typecheck`):
// const bad: string = 42;

export {};
