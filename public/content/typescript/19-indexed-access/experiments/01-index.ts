/**
 * 19-indexed-access — T[K]
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 19-indexed-access/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type User = { id: string; age: number };
type Id = User["id"];
type Age = User["age"];
const id: Id = "u1";
const age: Age = 30;
console.log(id, age);
export {};
