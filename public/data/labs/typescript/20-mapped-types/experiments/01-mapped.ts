/**
 * 20-mapped-types — mapped
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 20-mapped-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Optional<T> = { [K in keyof T]?: T[K] };
type User = { id: string; name: string };
type UserPatch = Optional<User>;
const patch: UserPatch = { name: "Ada" };
console.log(patch);
export {};
