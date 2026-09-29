/**
 * 02 — any vs unknown
 * RUN: npx tsx 02-basic-types/experiments/02-any-vs-unknown.ts
 * Also: hover / typecheck — which lines would error if uncommented?
 */

let flexible: any = "hello";
flexible = 42;
flexible = { x: 1 };
console.log("any access without narrowing:", flexible.x);
console.log("any can call anything (may throw at runtime):");
try {
  flexible.notReal();
} catch (e) {
  console.log("runtime error from any misuse:", e instanceof Error ? e.message : e);
}

let careful: unknown = JSON.parse('{"x":1}');
// careful.x; // ERROR if uncommented — unknown must be narrowed

if (typeof careful === "object" && careful !== null && "x" in careful) {
  console.log("unknown after narrowing, x =", (careful as { x: unknown }).x);
  // Still prefer validation libraries later — `in` is not full validation.
}

export {};
