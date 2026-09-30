/**
 * 08-literal-types — state
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 08-literal-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Traffic = "red" | "yellow" | "green";
function next(t: Traffic): Traffic {
  if (t === "red") return "green";
  if (t === "green") return "yellow";
  return "red";
}
console.log(next("green"));
export {};
