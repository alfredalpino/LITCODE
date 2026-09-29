import type { Catalog } from "../types";

const CONTENT_BASE = "/content";

async function fetchJson<T>(url: string, attempts = 3): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} loading ${url}`);
      }
      return (await res.json()) as T;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // Brief backoff — covers mid-restart / transient network blips
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 200 * (i + 1)));
      }
    }
  }
  throw lastError ?? new Error(`Failed to load ${url}`);
}

export async function loadCatalog(): Promise<Catalog> {
  return fetchJson<Catalog>(`${CONTENT_BASE}/catalog.json`);
}

export async function loadText(relPath: string): Promise<string> {
  let lastError: Error | null = null;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(`${CONTENT_BASE}/${relPath}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load ${relPath} (${res.status})`);
      return res.text();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (i < 2) await new Promise((r) => setTimeout(r, 200 * (i + 1)));
    }
  }
  throw lastError ?? new Error(`Failed to load ${relPath}`);
}

export function contentUrl(relPath: string): string {
  return `${CONTENT_BASE}/${relPath}`;
}
