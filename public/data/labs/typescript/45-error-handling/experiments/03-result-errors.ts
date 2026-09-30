/**
 * 45-error-handling — result
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 45-error-handling/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Result<T> = { ok: true; value: T } | { ok: false; error: string };
function divide(a: number, b: number): Result<number> {
  if (b === 0) return { ok: false, error: "div0" };
  return { ok: true, value: a / b };
}
console.log(divide(10, 2), divide(1, 0));
export {};
