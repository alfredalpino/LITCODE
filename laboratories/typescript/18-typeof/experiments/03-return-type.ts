/**
 * 18-typeof — ReturnType
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 18-typeof/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function makeUser() {
  return { id: "1", active: true };
}
type User = ReturnType<typeof makeUser>;
const u: User = { id: "2", active: false };
console.log(u);
export {};
