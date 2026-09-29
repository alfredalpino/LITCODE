/**
 * 10-type-guards — honesty
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 10-type-guards/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type User = { id: string; email: string };
// Dishonest guard — trusts shape without checking email format
function isUser(u: unknown): u is User {
  return typeof u === "object" && u !== null && "id" in u && "email" in u;
}
const raw: unknown = { id: 1, email: false };
if (isUser(raw)) {
  console.log("guard said User, runtime:", raw);
}
export {};
