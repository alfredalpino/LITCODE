/**
 * 06 — object vs {}
 * RUN: npx tsx 02-basic-types/experiments/06-object-vs-empty.ts
 */

const asObject: object = { a: 1 };
// const bad: object = 1; // error — primitives not assignable to object
// const alsoBad: object = null; // error under strict

const asEmpty: {} = 1; // surprising to many: non-nullish values often assignable to {}
const asEmpty2: {} = "x";
// const asEmpty3: {} = null; // error

console.log(asObject, asEmpty, asEmpty2);
console.log("Prefer explicit shapes: { a: number } over object or {}.");

export {};
