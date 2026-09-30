/**
 * 06-unions — primitive unions
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 06-unions/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function formatId(id: string | number): string {
  return typeof id === "string" ? id.toUpperCase() : id.toFixed(0);
}
console.log(formatId("abc"), formatId(42));
export {};
