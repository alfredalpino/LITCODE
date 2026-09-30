/**
 * 09-type-narrowing — equality
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 09-type-narrowing/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Resp = { status: 200; body: string } | { status: 404; error: string };
function read(r: Resp): string {
  if (r.status === 200) return r.body;
  return r.error;
}
console.log(read({ status: 200, body: "ok" }));
export {};
