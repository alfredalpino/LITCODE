/**
 * 07-intersections — conflict
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 07-intersections/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Button = { kind: "button"; label: string };
type Link = { kind: "link"; href: string };
type Control = Button & Link; // oops
function render(c: Control) {
  console.log(c);
}
// render({ kind: "button", label: "Go", href: "/" });
console.log("Control is effectively uninhabitable");
export {};
