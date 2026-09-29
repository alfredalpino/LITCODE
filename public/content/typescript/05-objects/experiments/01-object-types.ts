/**
 * 05-objects — object types
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 05-objects/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type User = { id: string; name: string; email?: string; readonly createdAt: number };
const u: User = { id: "u1", name: "Ada", createdAt: Date.now() };
console.log(u.name, u.email ?? "(no email)");
export {};
