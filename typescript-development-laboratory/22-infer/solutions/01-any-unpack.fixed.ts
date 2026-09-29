async function load(): Promise<{ id: string }> {
  return { id: "1" };
}
type Payload = MyAwaited<ReturnType<typeof load>>;
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T;
const demo: Payload = { id: "1" };
console.log(demo);
void load;
export {};
