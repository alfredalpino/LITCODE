/**
 * 09-type-narrowing — unsafe
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 09-type-narrowing/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Input = { value: string } | null;
function upper(i: Input): string {
  return i.value.toUpperCase();
}
console.log(upper({ value: "ok" }));
export {};
