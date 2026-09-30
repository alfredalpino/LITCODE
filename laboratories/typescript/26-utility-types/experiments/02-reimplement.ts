/**
 * 26-utility-types — reimplement
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 26-utility-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type U = { a: number; b: string };
const p: MyPartial<U> = { a: 1 };
const k: MyPick<U, "b"> = { b: "x" };
console.log(p, k);
export {};
