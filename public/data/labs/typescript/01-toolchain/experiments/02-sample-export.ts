/**
 * Experiment 02 — sample export for emit inspection
 * After `npm run build`, inspect:
 *   dist/01-toolchain/experiments/02-sample-export.js
 *   dist/01-toolchain/experiments/02-sample-export.d.ts
 *   dist/01-toolchain/experiments/02-sample-export.js.map
 */

export type Greeter = (name: string) => string;

export function greet(name: string): string {
  return `Hello ${name}`;
}

export const labName = "typescript-development-laboratory" as const;
