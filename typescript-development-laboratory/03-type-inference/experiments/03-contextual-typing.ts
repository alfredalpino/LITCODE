/**
 * 03 — contextual typing
 * RUN: npx tsx 03-type-inference/experiments/03-contextual-typing.ts
 */

type Mapper = (n: number) => string;

const mapper: Mapper = (n) => {
  // `n` is number from context — no annotation required
  return n.toFixed(2);
};

const nums = [1, 2, 3];
const printed = nums.map((n) => n.toFixed(2)); // n contextual from array type

console.log(mapper(3.14159), printed);

export {};
