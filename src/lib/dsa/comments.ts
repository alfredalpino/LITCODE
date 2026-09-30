export const COMMENTS_KEY = "sde-lab-problem-comments-v1";

export type LocalComment = {
  id: string;
  problemId: string;
  body: string;
  ts: number;
};

export type KeyValueStore = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

function browserStore(): KeyValueStore | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage;
}

function readAll(store: KeyValueStore): LocalComment[] {
  const raw = store.getItem(COMMENTS_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (item): item is LocalComment =>
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as LocalComment).problemId === "string" &&
      typeof (item as LocalComment).body === "string"
  );
}

export function loadComments(
  problemId: string,
  store: KeyValueStore | null = browserStore()
): LocalComment[] {
  if (!store) return [];
  try {
    return readAll(store)
      .filter((comment) => comment.problemId === problemId)
      .sort((a, b) => b.ts - a.ts);
  } catch {
    return [];
  }
}

export function saveComment(
  problemId: string,
  body: string,
  store: KeyValueStore | null = browserStore(),
  now = Date.now()
): LocalComment | null {
  if (!store) return null;
  const trimmed = body.trim();
  if (!trimmed) return null;
  try {
    const all = readAll(store);
    const comment: LocalComment = {
      id: `${now}`,
      problemId,
      body: trimmed,
      ts: now,
    };
    all.unshift(comment);
    store.setItem(COMMENTS_KEY, JSON.stringify(all.slice(0, 500)));
    return comment;
  } catch {
    return null;
  }
}
