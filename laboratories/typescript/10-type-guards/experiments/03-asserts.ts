/**
 * 10-type-guards — asserts
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 10-type-guards/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function assertDefined<T>(x: T | null | undefined): asserts x is T {
  if (x == null) throw new Error("undefined");
}
const maybe: string | undefined = "lab";
assertDefined(maybe);
console.log(maybe.toUpperCase());
export {};
