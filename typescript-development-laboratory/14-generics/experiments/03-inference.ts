/**
 * 14-generics — inference
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 14-generics/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
const p = pair("x", 1);
console.log(p);
export {};
