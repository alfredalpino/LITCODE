/**
 * 12-type-aliases — domain
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 12-type-aliases/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Email = string;
type User = { id: string; email: Email };
type UserId = User["id"];
const u: User = { id: "1", email: "a@b.co" };
const id: UserId = u.id;
console.log(id, u.email);
export {};
