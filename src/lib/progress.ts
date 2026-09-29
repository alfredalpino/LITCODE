const KEY = "sde-lab-studio-progress-v1";

export type ProgressMap = Record<string, boolean>;

export function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function saveProgress(map: ProgressMap) {
  localStorage.setItem(KEY, JSON.stringify(map));
}

export function moduleKey(labId: string, moduleId: string) {
  return `${labId}:${moduleId}`;
}
