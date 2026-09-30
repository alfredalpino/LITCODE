/**
 * 11-interfaces — basics
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 11-interfaces/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

interface User {
  id: string;
  name: string;
  email?: string;
  greet(): string;
}
const u: User = {
  id: "1",
  name: "Ada",
  greet() {
    return `hi ${this.name}`;
  },
};
console.log(u.greet());
export {};
