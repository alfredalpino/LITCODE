/**
 * 22-infer — parameters
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 22-infer/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type MyParams<T> = T extends (...args: infer P) => unknown ? P : never;
type P = MyParams<(a: string, b: number) => void>;
const p: P = ["x", 1];
console.log(p);
export {};
