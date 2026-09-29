/**
 * Needs a literal union — fix WITHOUT `as Status` on a widened string.
 * Ban initially: `as`, `any`, `!`
 *
 * Approaches to try:
 * - annotate `let status: Status = "idle"`
 * - use `const` + narrow updates
 * - satisfies / as const patterns (later modules)
 */

type Status = "idle" | "loading" | "success";

let status = "idle";

function setStatus(s: Status) {
  console.log(s);
}

setStatus(status); // Error: string not assignable to Status

export {};
