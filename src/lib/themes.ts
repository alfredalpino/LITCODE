/** Curated app themes — values set `html[data-theme]`. */

export const APP_THEMES = [
  {
    id: "campfire",
    label: "Campfire",
    description: "Dark neutrals, fiery orange signal",
    scheme: "dark",
    swatch: { bg: "#1a1b26", panel: "#1f2335", accent: "#ff7a33" },
  },
  {
    id: "paper",
    label: "Paper",
    description: "Light surfaces, ink text",
    scheme: "light",
    swatch: { bg: "#f5f6f8", panel: "#ffffff", accent: "#c2410c" },
  },
  {
    id: "midnight",
    label: "Midnight",
    description: "Deeper void, cool chalk",
    scheme: "dark",
    swatch: { bg: "#0a0c12", panel: "#12151f", accent: "#6b9eff" },
  },
  {
    id: "forest",
    label: "Forest",
    description: "Green-gray neutrals, moss accent",
    scheme: "dark",
    swatch: { bg: "#121814", panel: "#1a221c", accent: "#7cb87c" },
  },
  {
    id: "high-contrast",
    label: "High contrast",
    description: "Near-black / bright text, strong borders",
    scheme: "dark",
    swatch: { bg: "#000000", panel: "#0a0a0a", accent: "#ffb000" },
  },
] as const;

export type AppThemeId = (typeof APP_THEMES)[number]["id"];

const THEME_IDS = new Set<string>(APP_THEMES.map((t) => t.id));

/** Map legacy stored values + validate. */
export function normalizeThemeId(raw: unknown): AppThemeId {
  if (raw === "light") return "paper";
  if (raw === "dark" || raw === "vs-dark") return "campfire";
  if (typeof raw === "string" && THEME_IDS.has(raw)) return raw as AppThemeId;
  return "campfire";
}

export function themeScheme(id: AppThemeId): "dark" | "light" {
  return APP_THEMES.find((t) => t.id === id)?.scheme ?? "dark";
}

/** Monaco editor theme for a given app theme. */
export function monacoThemeFor(id: AppThemeId): "vs-dark" | "light" | "hc-black" {
  if (id === "paper") return "light";
  if (id === "high-contrast") return "hc-black";
  return "vs-dark";
}

export function themeColorMeta(id: AppThemeId): string {
  const t = APP_THEMES.find((x) => x.id === id);
  return t?.swatch.bg ?? "#1a1b26";
}
