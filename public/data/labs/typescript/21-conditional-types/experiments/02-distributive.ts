/**
 * 21-conditional-types — distributive
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 21-conditional-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type ToArray<T> = T extends unknown ? T[] : never;
type X = ToArray<string | number>; // string[] | number[]
const samples: X = ["a"];
console.log(samples);
export {};
