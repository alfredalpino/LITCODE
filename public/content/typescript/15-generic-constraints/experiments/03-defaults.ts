/**
 * 15-generic-constraints — defaults
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 15-generic-constraints/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type ApiResponse<T = unknown> = { data: T; status: number };
const r: ApiResponse<string> = { data: "ok", status: 200 };
const u: ApiResponse = { data: { n: 1 }, status: 200 };
console.log(r, u);
export {};
