/**
 * 16-generic-patterns — loose emit
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 16-generic-patterns/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function emit(type: string, payload: any) {
  console.log(type, payload);
}
emit("login", { nope: true });
export {};
