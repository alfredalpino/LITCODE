/**
 * 15-generic-constraints — extends
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 15-generic-constraints/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function lengthOf<T extends { length: number }>(x: T): number {
  return x.length;
}
console.log(lengthOf("abc"), lengthOf([1, 2]));
export {};
