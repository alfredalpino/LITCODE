/**
 * 48-api-design — validate
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 48-api-design/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type UserDTO = { id: string; name: string };
function parseUser(raw: unknown): UserDTO | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || typeof r.name !== "string") return null;
  return { id: r.id, name: r.name };
}
console.log(parseUser({ id: "1", name: "Ada" }), parseUser({ id: 1 }));
export {};
