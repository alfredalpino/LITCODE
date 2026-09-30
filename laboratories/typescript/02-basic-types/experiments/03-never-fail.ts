/**
 * 03 — never
 * RUN: npx tsx 02-basic-types/experiments/03-never-fail.ts
 */

function fail(message: string): never {
  throw new Error(message);
}

function area(shape: { kind: "circle"; r: number } | { kind: "square"; s: number }): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.r ** 2;
    case "square":
      return shape.s ** 2;
    default: {
      // If you add a new kind and forget a case, this line should error.
      const _exhaustive: never = shape;
      return fail(`unexpected shape: ${JSON.stringify(_exhaustive)}`);
    }
  }
}

console.log(area({ kind: "circle", r: 2 }));
console.log(area({ kind: "square", s: 3 }));

export { fail, area };
