/**
 * 20-mapped-types — modifiers
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 20-mapped-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type ReadonlyDeepish<T> = { readonly [K in keyof T]: T[K] };
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type R = ReadonlyDeepish<{ a: number }>;
type M = Mutable<Readonly<{ a: number }>>;
const r: R = { a: 1 };
const m: M = { a: 2 };
m.a = 3;
console.log(r, m);
export {};
