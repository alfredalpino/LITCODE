import type { KeyValueStore } from "./comments";

export const REACTIONS_KEY = "sde-lab-problem-reactions-v1";

export type Reaction = "up" | "down" | null;

function browserStore(): KeyValueStore | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage;
}

function readAll(store: KeyValueStore): Record<string, Reaction> {
  const raw = store.getItem(REACTIONS_KEY);
  if (!raw) return {};
  const parsed = JSON.parse(raw) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
  return parsed as Record<string, Reaction>;
}

export function loadReaction(
  problemId: string,
  store: KeyValueStore | null = browserStore()
): Reaction {
  if (!store) return null;
  try {
    const all = readAll(store);
    const value = all[problemId];
    return value === "up" || value === "down" ? value : null;
  } catch {
    return null;
  }
}

export function saveReaction(
  problemId: string,
  reaction: Reaction,
  store: KeyValueStore | null = browserStore()
): void {
  if (!store) return;
  try {
    const all = readAll(store);
    if (!reaction) delete all[problemId];
    else all[problemId] = reaction;
    store.setItem(REACTIONS_KEY, JSON.stringify(all));
  } catch {
    /* ignore quota */
  }
}
