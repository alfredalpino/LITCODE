/**
 * 21-conditional-types — non-dist
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 21-conditional-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type ToArray<T> = T extends unknown ? T[] : never;
type Wanted = (string | number)[]; // one array type
type Got = ToArray<string | number>; // distributed
console.log("Wanted vs Got — see comments / tsc");
export {};
