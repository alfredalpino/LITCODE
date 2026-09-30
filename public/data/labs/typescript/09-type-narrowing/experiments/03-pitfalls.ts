/**
 * 09-type-narrowing — pitfalls
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 09-type-narrowing/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function maybe(x: string | null) {
  if (x === null) return;
  const y = x;
  console.log(y.toUpperCase());
}
maybe("hi");
maybe(null);
export {};
