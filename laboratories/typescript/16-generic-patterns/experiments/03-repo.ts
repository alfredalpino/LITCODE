/**
 * 16-generic-patterns — repo
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 16-generic-patterns/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Entity = { id: string };
function createRepo<T extends Entity>() {
  const items = new Map<string, T>();
  return {
    save(item: T) {
      items.set(item.id, item);
    },
    get(id: string): T | undefined {
      return items.get(id);
    },
  };
}
const users = createRepo<{ id: string; name: string }>();
users.save({ id: "1", name: "Ada" });
console.log(users.get("1"));
export {};
