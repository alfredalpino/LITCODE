/**
 * 22-infer — awaited
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 22-infer/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T;
type A = MyAwaited<Promise<Promise<string>>>;
const a: A = "done";
console.log(a);
export {};
