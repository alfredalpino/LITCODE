/**
 * 04-functions — optional default rest
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 04-functions/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function buildUrl(path: string, query?: string, ...segments: string[]): string {
  const base = segments.length ? `/${segments.join("/")}${path}` : path;
  return query ? `${base}?${query}` : base;
}
function pad(n: number, width = 2): string {
  return String(n).padStart(width, "0");
}
console.log(buildUrl("/items", "q=ts", "api", "v1"));
console.log(pad(7), pad(7, 4));
export {};
