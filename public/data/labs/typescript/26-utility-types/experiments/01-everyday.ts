/**
 * 26-utility-types — everyday
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 26-utility-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type User = { id: string; name: string; email: string };
type UserPatch = Partial<User>;
type UserPreview = Pick<User, "id" | "name">;
type UserSecure = Omit<User, "email">;
type Roles = Record<"admin" | "user", boolean>;
const patch: UserPatch = { email: "a@b.co" };
const preview: UserPreview = { id: "1", name: "Ada" };
const secure: UserSecure = { id: "1", name: "Ada" };
const roles: Roles = { admin: true, user: false };
console.log(patch, preview, secure, roles);
export {};
