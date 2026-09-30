/**
 * 08-literal-types — string mode
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 08-literal-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

const config = { mode: "dark" };
function apply(mode: "light" | "dark") {
  console.log(mode);
}
// apply(config.mode); // string not assignable
apply("dark");
console.log(config);
export {};
