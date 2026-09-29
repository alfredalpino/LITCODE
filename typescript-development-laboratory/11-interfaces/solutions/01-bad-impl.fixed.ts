interface Repo {
  get(id: string): { id: string; title: string };
}
const repo: Repo = {
  get(id) {
    return { id, title: "ok" };
  },
};
console.log(repo.get("1"));
export {};
