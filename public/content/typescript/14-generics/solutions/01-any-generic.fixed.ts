function first<T>(xs: T[]): T | undefined {
  return xs[0];
}
console.log(first([1, 2])?.toFixed(1));
export {};
