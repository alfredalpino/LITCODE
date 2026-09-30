/**
 * Broken challenge — unsafe greet
 *
 * GOAL:
 * - greet should accept only strings at compile time
 * - remove `any` / unjustified assertions
 * - keep a working runtime greeting for valid strings
 *
 * RUN (after fix): npx tsx 00-typescript-runtime-boundary/challenges/broken/02-unsafe-greet.ts
 */

function greet(name: any): any {
  return "Hello " + name;
}

// These should become compile errors after your fix:
console.log(greet("Ubaid"));
console.log(greet(42));
console.log(greet({ name: "nope" }));

export {};
