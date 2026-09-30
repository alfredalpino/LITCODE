/**
 * 18-typeof — duplicate
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 18-typeof/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

const defaults = { theme: "dark", locale: "en" };
type Defaults = { theme: string; locale: string };
const d: Defaults = defaults;
console.log(d);
export {};
