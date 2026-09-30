/**
 * 26-utility-types — wrong omit
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 26-utility-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type User = { id: string; password: string };
type PublicUser = User;
function toPublic(u: User): PublicUser {
  return u;
}
console.log(toPublic({ id: "1", password: "secret" }));
export {};
