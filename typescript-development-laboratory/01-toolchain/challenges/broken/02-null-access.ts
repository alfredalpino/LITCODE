/** Broken: null access under strictNullChecks */
export function firstChar(text: string | null): string {
  return text.charAt(0);
}

console.log(firstChar("TypeScript"));
