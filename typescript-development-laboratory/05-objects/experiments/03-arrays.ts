/**
 * 05-objects — arrays
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 05-objects/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

const xs: number[] = [1, 2, 3];
xs.push(4);
const frozen: readonly number[] = [10, 20];
function sum(nums: readonly number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}
console.log(sum(xs), sum(frozen));
export {};
