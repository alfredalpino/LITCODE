/**
 * 18-typeof — config
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 18-typeof/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

const config = {
  apiUrl: "https://example.test",
  retries: 3,
} as const;
type Config = typeof config;
type ConfigKey = keyof Config;
console.log((Object.keys(config) as ConfigKey[]).join(","));
export {};
