/**
 * Sample fix for 03-strict-null-demo / mental model
 */

export function firstChar(text: string | null): string {
  if (text === null) {
    return "";
  }
  return text.charAt(0);
}

console.log(firstChar("TypeScript"));
console.log(firstChar(null));
