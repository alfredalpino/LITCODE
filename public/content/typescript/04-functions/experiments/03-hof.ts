/**
 * 04-functions — higher-order once
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 04-functions/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function once<T extends (...args: never[]) => unknown>(fn: T): T {
  let called = false;
  let result: ReturnType<T>;
  return ((...args: Parameters<T>) => {
    if (!called) {
      called = true;
      result = fn(...args) as ReturnType<T>;
    }
    return result;
  }) as T;
}
const init = once(() => {
  console.log("init ran");
  return 42;
});
console.log(init(), init());
export {};
