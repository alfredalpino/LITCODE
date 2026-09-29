/**
 * 08-literal-types — as const
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 08-literal-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

const routes = ["home", "about", "contact"] as const;
type Route = (typeof routes)[number];
function go(r: Route) {
  console.log("→", r);
}
go("home");
console.log(routes);
export {};
