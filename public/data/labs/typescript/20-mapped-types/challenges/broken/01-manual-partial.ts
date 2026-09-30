/**
 * 20-mapped-types — manual partial
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 20-mapped-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type User = { id: string; name: string; email: string };
type UserPatch = { id?: string; name?: string; email?: string };
const p: UserPatch = { email: "a@b.co" };
console.log(p);
export {};
