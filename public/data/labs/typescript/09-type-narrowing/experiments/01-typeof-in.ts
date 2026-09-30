/**
 * 09-type-narrowing — typeof / in
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 09-type-narrowing/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function len(x: string | string[]): number {
  if (typeof x === "string") return x.length;
  return x.length;
}
function label(p: { name: string } | { id: number }): string {
  if ("name" in p) return p.name;
  return String(p.id);
}
console.log(len("ab"), len(["a", "b"]), label({ name: "x" }));
export {};
