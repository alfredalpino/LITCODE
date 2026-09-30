/**
 * 17-keyof — keyof
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 17-keyof/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type User = { id: string; name: string; age: number };
type UserKey = keyof User;
const keys: UserKey[] = ["id", "name", "age"];
console.log(keys);
export {};
