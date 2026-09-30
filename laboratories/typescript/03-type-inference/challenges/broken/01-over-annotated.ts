/**
 * Over-annotated — simplify locals; keep export contracts clear.
 */

export function add(a: number, b: number): number {
  const sum: number = ((x: number, y: number): number => {
    const total: number = x + y;
    return total;
  })(a, b);
  return sum;
}

console.log(add(2, 3));

export {};
