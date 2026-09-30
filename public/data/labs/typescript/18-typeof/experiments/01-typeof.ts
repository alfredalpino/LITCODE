/**
 * 18-typeof — typeof
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 18-typeof/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

const user = { id: "1", name: "Ada" };
type User = typeof user;
const u: User = { id: "2", name: "Grace" };
console.log(u);
export {};
