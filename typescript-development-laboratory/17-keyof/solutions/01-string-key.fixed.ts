function read<T extends Record<string, number>, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
console.log(read({ a: 1 }, "a"));
export {};
