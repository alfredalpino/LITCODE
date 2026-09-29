/**
 * 13-structural-typing — extra
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 13-structural-typing/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type User = { id: string };
function take(u: User) {
  console.log(u.id);
}
const full = { id: "1", role: "admin" };
take(full);
export {};
