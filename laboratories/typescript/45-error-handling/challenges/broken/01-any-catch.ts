/**
 * 45-error-handling — any catch
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 45-error-handling/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

try {
  JSON.parse("{");
} catch (e: any) {
  console.log(e.message.toUpperCase());
}
export {};
