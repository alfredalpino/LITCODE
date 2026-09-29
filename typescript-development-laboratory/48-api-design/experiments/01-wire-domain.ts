/**
 * 48-api-design — wire vs domain
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 48-api-design/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type UserDTO = { id: string; name: string };
type User = { id: string; displayName: string };
function toDomain(dto: UserDTO): User {
  return { id: dto.id, displayName: dto.name };
}
console.log(toDomain({ id: "1", name: "Ada" }));
export {};
