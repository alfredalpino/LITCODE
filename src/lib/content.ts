import type { Catalog } from "../types";

const CONTENT_BASE = "/content";

export async function loadCatalog(): Promise<Catalog> {
  const res = await fetch(`${CONTENT_BASE}/catalog.json`);
  if (!res.ok) throw new Error("Failed to load content catalog");
  return res.json();
}

export async function loadText(relPath: string): Promise<string> {
  const res = await fetch(`${CONTENT_BASE}/${relPath}`);
  if (!res.ok) throw new Error(`Failed to load ${relPath}`);
  return res.text();
}

export function contentUrl(relPath: string): string {
  return `${CONTENT_BASE}/${relPath}`;
}
