/**
 * 14-generics — any generic
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 14-generics/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function first(xs: any[]): any {
  return xs[0];
}
console.log(first([1, 2]).toFixed(1));
export {};
