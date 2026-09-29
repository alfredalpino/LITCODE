"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ClipboardCheck,
  FolderKanban,
  Network,
  Target,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { loadEvents } from "@/lib/events";
import {
  buildMasterySummary,
  deriveSkillState,
  loadSkillGraph,
  type MasterySummary,
  type MasterySummaryItem,
  type SkillGraphFile,
} from "@/lib/skill-graph";
import {
  computeDsaSnapshot,
  computeLabRows,
  interviewReadinessLine,
  recentActivity,
  streakLabel,
} from "@/lib/learning-metrics";
import type { Catalog } from "@/types";
import type { DsaIndexItem } from "@/lib/dsa/types";
import type { StreakState } from "@/lib/stats";
import { ProgressNextSteps } from "@/components/ProgressNextSteps";
import { EmptyState } from "@/components/EmptyState";

interface ProgressViewProps {
  catalog: Catalog;
  progress: Record<string, boolean>;
  dsaSolved: Record<string, boolean>;
  dsaItems: DsaIndexItem[];
  streak: StreakState;
  labSolvedCount: number;
  labTotalCount: number;
  onOpenModule?: (labId: string, moduleId: string) => void;
  onOpenChallenge?: (challengeId: string) => void;
}

const BUCKET_META: Record<
  keyof MasterySummary,
  { title: string; blurb: string; icon: typeof Target }
> = {
  next: {
    title: "Next",
    blurb: "Ready now — prerequisites met, evidence says go.",
    icon: Target,
  },
  weak: {
    title: "Weak",
    blurb: "Fails or low mastery — reinforce before grinding more problems.",
    icon: AlertTriangle,
  },
  learning: {
    title: "Learning",
    blurb: "Exposed or practicing — keep the predict → run → break loop.",
    icon: BookOpen,
  },
  known: {
    title: "Known",
    blurb: "Passing evidence — not yet mastered.",
    icon: Sparkles,
  },
  mastered: {
    title: "Mastered",
    blurb: "Strong pass rate / high mastery from local evidence.",
    icon: CheckCircle2,
  },
};

function BucketList({
  items,
  empty,
  onOpenModule,
  onOpenChallenge,
}: {
  items: MasterySummaryItem[];
  empty: string;
  onOpenModule?: (labId: string, moduleId: string) => void;
  onOpenChallenge?: (challengeId: string) => void;
}) {
  if (!items.length) {
    return <p className="lc-muted">{empty}</p>;
  }
  return (
    <ul className="lf-mastery__list">
      {items.slice(0, 8).map(({ node, evidence }) => (
        <li key={node.id}>
          <div>
            <strong>{node.title}</strong>
            <span className="lc-muted">
              {node.kind}
              {node.language ? ` · ${node.language}` : ""} · mastery{" "}
              {Math.round(evidence.mastery * 100)}%
              {evidence.fails ? ` · ${evidence.fails} fail(s)` : ""}
            </span>
          </div>
          {node.moduleRef && onOpenModule && (
            <button
              type="button"
              className="lc-link"
              onClick={() =>
                onOpenModule(node.moduleRef!.labId, node.moduleRef!.moduleId)
              }
            >
              Open lab
            </button>
          )}
          {node.challengeRef && onOpenChallenge && (
            <button
              type="button"
              className="lc-link"
              onClick={() => onOpenChallenge(node.challengeRef!.challengeId)}
            >
              Open problem
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Evidence-based Progress surface — Concept → Skill → Exercise → Challenge → Mastery.
 */
export function ProgressView({
  catalog,
  progress,
  dsaSolved,
  dsaItems,
  streak,
  labSolvedCount,
  labTotalCount,
  onOpenModule,
  onOpenChallenge,
}: ProgressViewProps) {
  const [summary, setSummary] = useState<MasterySummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bridgeNote, setBridgeNote] = useState("");

  const events = useMemo(() => loadEvents(), [progress, dsaSolved]);
  const labRows = useMemo(
    () => computeLabRows(catalog, progress),
    [catalog, progress]
  );
  const dsaSnap = useMemo(
    () => computeDsaSnapshot(dsaSolved, dsaItems, events),
    [dsaSolved, dsaItems, events]
  );
  const activity = useMemo(() => recentActivity(events), [events]);
  const streakText = streakLabel(streak);
  const readiness = interviewReadinessLine(dsaSnap);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const graph: SkillGraphFile = await loadSkillGraph();
        const state = deriveSkillState(graph, progress, dsaSolved, loadEvents(), {
          persist: true,
        });
        if (cancelled) return;
        setSummary(buildMasterySummary(graph, state, 3));
        const jsTs = graph.nodes.filter(
          (n) =>
            n.language === "javascript" &&
            n.related?.some((id) => id.startsWith("ts."))
        ).length;
        setBridgeNote(
          `Cross-lab bridges active: ${jsTs} JS↔TS concept links · pattern↔lab related on DSA patterns.`
        );
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Skill graph unavailable");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [progress, dsaSolved]);

  const hasAnyEvidence =
    labSolvedCount > 0 ||
    dsaSnap.solved > 0 ||
    dsaSnap.attemptedFromEvents > 0 ||
    activity.length > 0;

  return (
    <div className="lc-feed lf-progress">
      <section className="lc-card lc-card--wide">
        <h2>Progress</h2>
        <p className="lc-muted">
          Evidence from this browser — not vanity counts. LITCODE path:{" "}
          <strong>Concept → Skill → Exercise → Challenge → Mastery</strong>.
        </p>
        {bridgeNote && <p className="lc-card__hint">{bridgeNote}</p>}
        {error && <p className="lc-muted">{error}</p>}
      </section>

      <section className="lf-progress-dashboard" aria-label="Learning snapshot">
        <div className="lf-stat-grid">
          <article className="lf-stat-card">
            <span className="lf-stat-card__label">Labs (modules marked)</span>
            <strong>
              {labSolvedCount}/{labTotalCount}
            </strong>
            <p className="lc-muted">Includes scaffolds — ready-only rows below.</p>
          </article>
          <article className="lf-stat-card">
            <span className="lf-stat-card__label">DSA marked solved</span>
            <strong>{dsaSnap.solved}</strong>
            <p className="lc-muted">
              Judged: {dsaSnap.judgedSolved}/{dsaSnap.judgedTotal}
            </p>
          </article>
          <article className="lf-stat-card">
            <span className="lf-stat-card__label">Judged attempts (events)</span>
            <strong>{dsaSnap.attemptedFromEvents}</strong>
            <p className="lc-muted">
              {dsaSnap.failedFromEvents > 0
                ? `${dsaSnap.failedFromEvents} recorded fail(s)`
                : "Fails only when submit events exist"}
            </p>
          </article>
          <article className="lf-stat-card">
            <span className="lf-stat-card__label">Interview readiness</span>
            <strong className="lf-stat-card__line">{readiness}</strong>
            {streakText && <p className="lc-muted">{streakText}</p>}
          </article>
        </div>

        <div className="lf-progress-split">
          <section className="lc-card">
            <h3>Labs by language</h3>
            <ul className="lf-lab-rows">
              {labRows.map((row) => {
                const pct = row.readyTotal
                  ? Math.round((row.readyDone / row.readyTotal) * 100)
                  : 0;
                return (
                  <li key={row.labId}>
                    <div className="lf-lab-rows__head">
                      <strong>{row.title}</strong>
                      <span className="lc-muted">{row.language}</span>
                    </div>
                    <div
                      className="lf-progress-bar lc-progress-bar"
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <i style={{ width: `${pct}%` }} />
                    </div>
                    <p className="lc-muted">
                      Ready {row.readyDone}/{row.readyTotal} · {row.attemptedTotal} touched
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="lc-card">
            <h3>
              <Activity size={14} /> Recent activity
            </h3>
            {!activity.length ? (
              <EmptyState
                title="No events yet"
                body="Open a lab module or submit a judged problem to populate activity."
              />
            ) : (
              <ul className="lf-activity-list">
                {activity.map((a) => (
                  <li key={a.id}>
                    <time dateTime={new Date(a.ts).toISOString()}>
                      {new Date(a.ts).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                    <span>{a.label}</span>
                    {a.detail && <em className="lc-muted">{a.detail}</em>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {!hasAnyEvidence && (
          <EmptyState
            title="Start building evidence"
            body="Complete a ready lab module or pass a judged challenge — mastery buckets and recommendations unlock from real events."
          />
        )}
      </section>

      <ProgressNextSteps
        progress={progress}
        dsaSolved={dsaSolved}
        onOpenModule={onOpenModule}
        onOpenChallenge={onOpenChallenge}
      />

      {summary &&
        (["next", "weak", "learning", "known", "mastered"] as const).map((key) => {
          const meta = BUCKET_META[key];
          const Icon = meta.icon;
          return (
            <section key={key} className="lc-card lc-card--wide lf-mastery">
              <div className="lc-card__head">
                <h3>
                  <Icon size={14} /> {meta.title}
                </h3>
              </div>
              <p className="lc-card__hint">{meta.blurb}</p>
              <BucketList
                items={summary[key]}
                empty={
                  key === "next"
                    ? "Complete a ready module or judged problem to unlock next steps."
                    : "Nothing in this bucket yet — keep practicing."
                }
                onOpenModule={onOpenModule}
                onOpenChallenge={onOpenChallenge}
              />
            </section>
          );
        })}

      <section className="lc-card lc-card--wide lf-progress__stub">
        <div className="lc-card__head">
          <h3>
            <ClipboardCheck size={14} /> Assessments
          </h3>
        </div>
        <p className="lc-muted">
          <span className="lf-status-pill">Planned</span> Checkpoint quizzes across concept
          clusters — not faked in this release.
        </p>
      </section>

      <section className="lc-card lc-card--wide lf-progress__stub">
        <div className="lc-card__head">
          <h3>
            <FolderKanban size={14} /> Projects
          </h3>
        </div>
        <p className="lc-muted">
          <span className="lf-status-pill">Planned</span> Multi-file project runner required
          before JS project modules count as ready.
        </p>
      </section>

      <section className="lc-card lc-card--wide">
        <div className="lc-card__head">
          <h3>
            <Network size={14} /> How evidence works
          </h3>
        </div>
        <ul className="lf-progress__legend">
          <li>Predict submit / skip → concept exposed or practicing</li>
          <li>Module complete → passing on linked skill node</li>
          <li>Judged pass / fail → challenge + pattern mastery</li>
          <li>Failed patterns boost related lab concepts in “What next?”</li>
        </ul>
      </section>
    </div>
  );
}
