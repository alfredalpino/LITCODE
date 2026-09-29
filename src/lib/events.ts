/**
 * Local-first learning-loop event log (LEARNING_ENGINE.md).
 * Key kept under sde-lab-* prefix (DEC-022) — no auth required.
 */

export const EVENTS_KEY = "sde-lab-events-v1";
const MAX_EVENTS = 800;

export type ProgressEventType =
  | "module_opened"
  | "prediction_submitted"
  | "prediction_skipped"
  | "run"
  | "break_attempt"
  | "hint_revealed"
  | "exercise_passed"
  | "challenge_passed"
  | "challenge_failed"
  | "review_submitted"
  | "module_completed"
  | "assessment_passed";

export type ProgressEvent = {
  id: string;
  ts: number;
  type: ProgressEventType;
  labId?: string;
  moduleId?: string;
  challengeId?: string;
  skillNodeIds?: string[];
  meta?: Record<string, unknown>;
};

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function loadEvents(): ProgressEvent[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ProgressEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveEvents(events: ProgressEvent[]): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
}

export function appendEvent(
  partial: Omit<ProgressEvent, "id" | "ts"> & { id?: string; ts?: number }
): ProgressEvent {
  const event: ProgressEvent = {
    id: partial.id ?? newId(),
    ts: partial.ts ?? Date.now(),
    type: partial.type,
    labId: partial.labId,
    moduleId: partial.moduleId,
    challengeId: partial.challengeId,
    skillNodeIds: partial.skillNodeIds,
    meta: partial.meta,
  };
  const next = [...loadEvents(), event];
  saveEvents(next);
  return event;
}

export function countEventsByType(type: ProgressEventType): number {
  return loadEvents().filter((e) => e.type === type).length;
}

/** Pure helper for tests — append into an in-memory list with cap. */
export function appendEventToList(
  list: ProgressEvent[],
  event: ProgressEvent,
  max = MAX_EVENTS
): ProgressEvent[] {
  return [...list, event].slice(-max);
}
