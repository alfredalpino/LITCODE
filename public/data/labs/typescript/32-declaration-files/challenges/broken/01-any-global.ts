/**
 * 32-declaration-files — any global
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 32-declaration-files/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

const g = globalThis as any;
g.APP_NAME = 42;
console.log(String(g.APP_NAME).toUpperCase());
export {};
