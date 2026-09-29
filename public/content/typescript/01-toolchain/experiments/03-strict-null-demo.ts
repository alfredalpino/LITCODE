/**
 * Experiment 03 — strict null (fixed baseline)
 *
 * 1. Read challenges/broken/02-null-access.ts and predict the error
 * 2. Run: npx tsc --noEmit --strict 01-toolchain/challenges/broken/02-null-access.ts
 * 3. Compare to this fixed version
 * 4. Try other fixes: early return, ??, optional chaining with fallback — still no `!`
 *
 * RUN: npx tsx 01-toolchain/experiments/03-strict-null-demo.ts
 */

export function firstChar(text: string | null): string {
  if (text === null) {
    return "";
  }
  return text.charAt(0);
}

console.log(firstChar("TypeScript"));
console.log(firstChar(null));
