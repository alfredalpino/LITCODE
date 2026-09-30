/**
 * 15-generic-constraints — unconstrained
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 15-generic-constraints/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function idOf<T>(x: T): string {
  return (x as { id: string }).id;
}
console.log(idOf({ id: "1" }));
export {};
