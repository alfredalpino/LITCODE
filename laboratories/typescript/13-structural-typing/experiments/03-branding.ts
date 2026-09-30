/**
 * 13-structural-typing — branding
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 13-structural-typing/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type UserId = string & { readonly __brand: "UserId" };
function asUserId(s: string): UserId {
  return s as UserId;
}
function loadUser(id: UserId) {
  console.log("load", id);
}
loadUser(asUserId("u1"));
// loadUser("u1"); // tsc error — string not UserId
export {};
