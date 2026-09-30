/**
 * 22-infer — infer return
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 22-infer/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type MyReturn<T> = T extends (...args: never[]) => infer R ? R : never;
type R = MyReturn<() => number>;
const r: R = 1;
console.log(r);
export {};
