/**
 * 11-interfaces — bad impl
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 11-interfaces/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

interface Repo {
  get(id: string): { id: string; title: string };
}
const repo: Repo = {
  get(id) {
    return { id, title: 42 as any };
  },
};
console.log(repo.get("1"));
export {};
