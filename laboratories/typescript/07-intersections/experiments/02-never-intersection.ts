/**
 * 07-intersections — never intersection
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 07-intersections/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type A = { tag: "a"; n: number };
type B = { tag: "b"; n: string };
type Impossible = A & B;
// const x: Impossible = ... // tag: "a" & "b" → never
console.log("A & B on conflicting literals collapses tag to never (tsc)");
export {};
