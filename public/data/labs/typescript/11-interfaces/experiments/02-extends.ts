/**
 * 11-interfaces — extends
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 11-interfaces/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

interface Identified {
  id: string;
}
interface User extends Identified {
  name: string;
}
const u: User = { id: "1", name: "Ada" };
console.log(u);
export {};
