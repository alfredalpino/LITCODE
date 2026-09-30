/**
 * 21-conditional-types — extract
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 21-conditional-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type OnlyString<T> = T extends string ? T : never;
type S = OnlyString<string | number | boolean>;
const s: S = "ok";
console.log(s);
export {};
