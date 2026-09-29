/**
 * 26-utility-types — exclude extract
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 26-utility-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type T = "a" | "b" | "c";
type WithoutB = Exclude<T, "b">;
type OnlyA = Extract<T, "a" | "z">;
const x: WithoutB = "a";
const y: OnlyA = "a";
console.log(x, y);
export {};
