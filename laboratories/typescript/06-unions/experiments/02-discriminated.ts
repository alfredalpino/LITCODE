/**
 * 06-unions — discriminated
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 06-unions/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Ok = { ok: true; value: string };
type Err = { ok: false; error: string };
type Result = Ok | Err;

function show(r: Result): string {
  if (r.ok) return r.value;
  return r.error;
}
console.log(show({ ok: true, value: "yes" }));
console.log(show({ ok: false, error: "nope" }));
export {};
