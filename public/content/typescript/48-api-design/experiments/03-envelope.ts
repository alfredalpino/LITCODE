/**
 * 48-api-design — envelope
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 48-api-design/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type ApiOk<T> = { ok: true; data: T };
type ApiErr = { ok: false; error: { code: string; message: string } };
type ApiResponse<T> = ApiOk<T> | ApiErr;
function ok<T>(data: T): ApiOk<T> {
  return { ok: true, data };
}
function err(code: string, message: string): ApiErr {
  return { ok: false, error: { code, message } };
}
const res: ApiResponse<{ id: string }> = ok({ id: "1" });
console.log(res);
void err;
export {};
