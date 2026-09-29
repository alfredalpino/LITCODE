import type { Catalog } from "@/types";
import { moduleKey } from "@/lib/progress";
import { moduleStatus } from "@/lib/module-status";
import type { ProgressEvent } from "@/lib/events";
import type { DsaIndexItem } from "@/lib/dsa/types";
import type { StreakState } from "@/lib/stats";

export type LabLanguageRow = {
  labId: string;
  title: string;
  language: string;
  readyTotal: number;
  readyDone: number;
  attemptedTotal: number;
};

export type ActivityRow = {
  id: string;
  ts: number;
  label: string;
  detail: string;
};

export type DsaProgressSnapshot = {
  solved: number;
  judgedSolved: number;
  judgedTotal: number;
  attemptedFromEvents: number;
  failedFromEvents: number;
};

export function computeLabRows(
  catalog: Catalog,
  progress: Record<string, boolean>
): LabLanguageRow[] {
  return catalog.labs.map((lab) => {
    const ready = lab.modules.filter((m) => moduleStatus(m) === "ready");
    const readyDone = ready.filter((m) => progress[moduleKey(lab.id, m.id)]).length;
    const attemptedTotal = lab.modules.filter(
      (m) => progress[moduleKey(lab.id, m.id)]
    ).length;
    return {
      labId: lab.id,
      title: lab.title,
      language: lab.language,
      readyTotal: ready.length,
      readyDone,
      attemptedTotal,
    };
  });
}

export function computeDsaSnapshot(
  dsaSolved: Record<string, boolean>,
  dsaItems: DsaIndexItem[],
  events: ProgressEvent[]
): DsaProgressSnapshot {
  const judged = dsaItems.filter((i) => i.hasJudge);
  const judgedSolved = judged.filter((i) => dsaSolved[i.id]).length;
  const solved = Object.keys(dsaSolved).length;
  let attemptedFromEvents = 0;
  let failedFromEvents = 0;
  const seen = new Set<string>();
  for (const e of events) {
    if (!e.challengeId) continue;
    if (e.type === "challenge_passed" || e.type === "challenge_failed") {
      if (!seen.has(e.challengeId)) {
        seen.add(e.challengeId);
        attemptedFromEvents += 1;
      }
      if (e.type === "challenge_failed") failedFromEvents += 1;
    }
  }
  return {
    solved,
    judgedSolved,
    judgedTotal: judged.length,
    attemptedFromEvents,
    failedFromEvents,
  };
}

export function recentActivity(events: ProgressEvent[], limit = 8): ActivityRow[] {
  const sorted = [...events].sort((a, b) => b.ts - a.ts);
  const rows: ActivityRow[] = [];
  for (const e of sorted) {
    if (rows.length >= limit) break;
    let label = e.type.replace(/_/g, " ");
    let detail = "";
    if (e.moduleId && e.labId) detail = `${e.labId} · ${e.moduleId}`;
    if (e.challengeId) detail = e.challengeId;
    rows.push({ id: e.id, ts: e.ts, label, detail });
  }
  return rows;
}

export function streakLabel(streak: StreakState): string | null {
  if (!streak.count || streak.count < 1) return null;
  if (!streak.history?.length) return `${streak.count} day streak`;
  return `${streak.count} day streak · ${streak.history.length} active days (60d window)`;
}

export function interviewReadinessLine(snapshot: DsaProgressSnapshot): string {
  if (snapshot.judgedTotal === 0) return "Judged bank loading or unavailable.";
  const pct = Math.round((snapshot.judgedSolved / snapshot.judgedTotal) * 100);
  if (snapshot.judgedSolved === 0) {
    return "Start with judged Easy/Medium — pass events unlock stronger readiness signals.";
  }
  if (pct < 25) {
    return `Early judged coverage (${snapshot.judgedSolved}/${snapshot.judgedTotal}) — keep Interview mode reps.`;
  }
  if (pct < 60) {
    return `Building judged depth (${pct}%) — weak patterns surface in Progress buckets.`;
  }
  return `Strong judged coverage (${pct}%) — prioritize weak nodes and Hard judged set.`;
}
