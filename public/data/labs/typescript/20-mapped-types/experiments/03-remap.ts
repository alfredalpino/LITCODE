/**
 * 20-mapped-types — remap
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 20-mapped-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
type User = { name: string };
type UserGetters = Getters<User>;
const g: UserGetters = {
  getName: () => "Ada",
};
console.log(g.getName());
export {};
