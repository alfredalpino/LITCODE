/**
 * 19-indexed-access — hardcoded
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 19-indexed-access/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type User = { id: string; role: "admin" | "user" };
function setRole(role: string) {
  console.log(role);
}
setRole("nope");
export {};
