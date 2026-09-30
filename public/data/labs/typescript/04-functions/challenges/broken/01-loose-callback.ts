/**
 * 04-functions — loose callback
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 04-functions/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function runTwice(fn: Function) {
  fn();
  fn("oops");
}
runTwice((x: number) => console.log(x.toFixed(2)));
export {};
