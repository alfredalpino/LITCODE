/**
 * 45-error-handling — normalize
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 45-error-handling/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type AppError = { code: string; message: string };
function toAppError(e: unknown): AppError {
  if (e instanceof Error) return { code: "ERR", message: e.message };
  return { code: "ERR", message: String(e) };
}
try {
  throw new Error("boom");
} catch (e) {
  console.log(toAppError(e));
}
export {};
