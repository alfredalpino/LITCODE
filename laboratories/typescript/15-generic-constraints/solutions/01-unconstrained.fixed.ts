function idOf<T extends { id: string }>(x: T): string {
  return x.id;
}
console.log(idOf({ id: "1" }));
export {};
