/**
 * 21-conditional-types — conditional
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 21-conditional-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type IsString<T> = T extends string ? true : false;
type A = IsString<"hi">;
type B = IsString<42>;
const a: A = true;
const b: B = false;
console.log(a, b);
export {};
