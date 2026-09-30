/**
 * 13-structural-typing — wrong id
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 13-structural-typing/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function refund(orderId: string, userId: string) {
  console.log(orderId, userId);
}
const userId = "u1";
const orderId = "o9";
refund(userId, orderId); // swapped — still compiles
export {};
