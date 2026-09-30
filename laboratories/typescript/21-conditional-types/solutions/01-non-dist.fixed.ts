type ToArrayFlat<T> = [T] extends [unknown] ? T[] : never;
type Got = ToArrayFlat<string | number>; // (string | number)[]
const x: Got = ["a", 1];
console.log(x);
export {};
