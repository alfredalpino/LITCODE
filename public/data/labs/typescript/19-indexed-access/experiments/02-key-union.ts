/**
 * 19-indexed-access — key union
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 19-indexed-access/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type User = { id: string; age: number; name: string };
type IdOrName = User["id" | "name"];
const x: IdOrName = "Ada";
console.log(x);
export {};
