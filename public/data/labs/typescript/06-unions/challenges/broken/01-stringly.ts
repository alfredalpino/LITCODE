/**
 * 06-unions — stringly
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 06-unions/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Job = { status: string; result?: string; error?: string };
function message(j: Job): string {
  if (j.status === "done") return j.result!.toUpperCase();
  return j.error ?? "unknown";
}
console.log(message({ status: "done", result: "ok" }));
export {};
