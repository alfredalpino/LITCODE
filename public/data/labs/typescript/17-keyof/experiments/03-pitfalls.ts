/**
 * 17-keyof — pitfalls
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 17-keyof/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type A = { a: 1 };
type B = { b: 2 };
type U = A | B;
type KU = keyof U; // "a" & "b" → never for disjoint — actually intersection of keys
console.log("keyof union is intersection of keys (often surprising)");
type Both = A & B;
type KB = keyof Both;
const _k: KB = "a";
console.log(_k);
export {};
