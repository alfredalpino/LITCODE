type Events = { login: { userId: string } };
function emit<K extends keyof Events>(type: K, payload: Events[K]) {
  console.log(type, payload);
}
emit("login", { userId: "u1" });
export {};
