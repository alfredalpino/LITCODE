const STREAK_KEY = "sde-lab-streak-v1";
const DSA_SOLVED_KEY = "sde-dsa-solved-v1";
const FAV_KEY = "sde-favorites-v1";

export type StreakState = {
  lastActive: string; // YYYY-MM-DD
  count: number;
  history: string[];
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function loadStreak(): StreakState {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw) as StreakState;
  } catch {
    /* ignore */
  }
  return { lastActive: "", count: 0, history: [] };
}

export function touchStreak(): StreakState {
  const cur = loadStreak();
  const today = todayKey();
  if (cur.lastActive === today) return cur;
  const next: StreakState = {
    lastActive: today,
    count: cur.lastActive === yesterdayKey() ? cur.count + 1 : 1,
    history: [...new Set([...(cur.history ?? []), today])].slice(-60),
  };
  localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  return next;
}

export function loadDsaSolved(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(DSA_SOLVED_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function markDsaSolved(id: string) {
  const map = loadDsaSolved();
  map[id] = true;
  localStorage.setItem(DSA_SOLVED_KEY, JSON.stringify(map));
  touchStreak();
  return map;
}

export function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(id: string): string[] {
  const cur = loadFavorites();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  localStorage.setItem(FAV_KEY, JSON.stringify(next));
  return next;
}

/**
 * Removed: deterministic fake acceptance % (PRODUCT_AUDIT / DEC-026).
 * Prefer ChallengeKindBadge (Auto-judge vs External).
 */
export function acceptanceRate(_id: string): null {
  return null;
}
