import type { Lab } from "../types";
import type { DsaIndexItem } from "../lib/dsa/types";
import { FeatureCards } from "./FeatureCards";
import { ProgressNextSteps } from "./ProgressNextSteps";
import { ChallengeKindBadge } from "./ContentStatusBadge";
import { CheckCircle2, Circle, Clock, Play, Send } from "lucide-react";
import clsx from "clsx";

interface ContestViewProps {
  hardProblems: DsaIndexItem[];
  onOpen: (id: string) => void;
  onStartWeekly: () => void;
}

export function ContestView({ hardProblems, onOpen, onStartWeekly }: ContestViewProps) {
  return (
    <div className="lc-feed">
      <FeatureCards
        cards={[
          {
            id: "weekly",
            title: "Weekly Contest",
            subtitle: "Coming later — isolation + auth required",
            tone: "amber",
            icon: "judge",
            onClick: onStartWeekly,
          },
          {
            id: "biweekly",
            title: "Biweekly",
            subtitle: "Deferred — use Interview mode for judged practice",
            tone: "blue",
            icon: "problems",
            onClick: () => {
              const judged = hardProblems.filter((p) => p.hasJudge);
              const pick = judged[Math.floor(Math.random() * Math.min(judged.length, 40))];
              if (pick) onOpen(pick.id);
            },
          },
          {
            id: "virtual",
            title: "Virtual",
            subtitle: "Not a live contest — browse Hard below",
            tone: "teal",
            icon: "company",
            onClick: () => {
              const el = document.querySelector(".lc-table-wrap");
              el?.scrollIntoView({ behavior: "smooth" });
            },
          },
        ]}
      />

      <div className="lc-card lc-card--wide lf-contest-deferred">
        <span className="lf-status-pill">Deferred</span>
        <h2>Live contests ship later</h2>
        <p className="lc-muted">
          LITCODE does not simulate ranked contests without isolation and auth. Use{" "}
          <strong>Interview</strong> for judged reps, or start a <strong>Hard</strong> practice
          path below.
        </p>
        <button type="button" className="run-btn" onClick={onStartWeekly}>
          Start Hard practice path
        </button>
      </div>

      <div className="lc-table-wrap" style={{ marginTop: 16 }}>
        <table className="lc-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Kind</th>
            </tr>
          </thead>
          <tbody>
            {hardProblems.slice(0, 12).map((p) => (
              <tr key={p.id} onClick={() => onOpen(p.id)}>
                <td>
                  <span className="lc-table__num">{p.num}.</span> {p.title}
                </td>
                <td className="col-diff is-hard">{p.difficulty}</td>
                <td>
                  <ChallengeKindBadge hasJudge={p.hasJudge} kind={p.kind} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface InterviewViewProps {
  labs: Lab[];
  judgedProblems: DsaIndexItem[];
  solved: Record<string, boolean>;
  progress: Record<string, boolean>;
  streak: number;
  onOpenLabs: () => void;
  onOpenChallenge: (id: string) => void;
  onOpenModule?: (labId: string, moduleId: string) => void;
}

/**
 * Interview mode shell — judged set only (LEARNING_ENGINE §6).
 * Statement / constraints / examples / run / submit live in DsaArena after open.
 */
export function InterviewView({
  labs,
  judgedProblems,
  solved,
  progress,
  streak,
  onOpenLabs,
  onOpenChallenge,
  onOpenModule,
}: InterviewViewProps) {
  const solvedJudged = judgedProblems.filter((p) => solved[p.id]).length;

  return (
    <div className="lc-feed lf-interview">
      <div className="lc-card lc-card--wide">
        <h2>Interview mode</h2>
        <p className="lc-muted">
          Statement-first practice on <strong>auto-judged</strong> challenges only. Run = visible
          tests; Submit = full suite. Timing is browser-elapsed — not judge hardware.
        </p>
        <div className="lc-interview-stats">
          <div>
            <strong>
              {solvedJudged}/{judgedProblems.length}
            </strong>
            <span>Judged solved</span>
          </div>
          <div>
            <strong>{streak}</strong>
            <span>Day streak</span>
          </div>
          <div>
            <strong>{labs.length}</strong>
            <span>Language labs</span>
          </div>
          <div>
            <strong>
              <Clock size={14} /> local
            </strong>
            <span>No server anti-cheat</span>
          </div>
        </div>
        <div className="lf-interview__actions">
          <button
            type="button"
            className="run-btn"
            disabled={!judgedProblems.length}
            onClick={() => {
              const todo = judgedProblems.find((p) => !solved[p.id]) ?? judgedProblems[0];
              if (todo) onOpenChallenge(todo.id);
            }}
          >
            <Play size={14} /> Start next judged
          </button>
          <button type="button" className="lc-link" onClick={onOpenLabs}>
            Warm up in Labs
          </button>
        </div>
      </div>

      <ProgressNextSteps
        progress={progress}
        dsaSolved={solved}
        onOpenModule={onOpenModule}
        onOpenChallenge={onOpenChallenge}
      />

      <h3 className="lc-section-title">Judged interview set</h3>
      <p className="lc-muted" style={{ marginBottom: 8 }}>
        Structure after open: statement → constraints → examples → code → Run → Submit → results.
      </p>
      <div className="lc-table-wrap">
        <table className="lc-table">
          <thead>
            <tr>
              <th className="col-status" />
              <th>Title</th>
              <th>Pattern / topics</th>
              <th>Difficulty</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {judgedProblems.map((p) => {
              const done = !!solved[p.id];
              return (
                <tr key={p.id} onClick={() => onOpenChallenge(p.id)}>
                  <td className="col-status">
                    {done ? (
                      <CheckCircle2 size={16} className="is-solved" />
                    ) : (
                      <Circle size={16} className="is-todo" />
                    )}
                  </td>
                  <td>
                    <span className="lc-table__num">{p.num}.</span> {p.title}
                    <ChallengeKindBadge hasJudge className="lf-inline-badge" />
                  </td>
                  <td className="col-acc">
                    {p.pattern ?? p.topics.slice(0, 2).join(", ")}
                  </td>
                  <td className={clsx("col-diff", `is-${p.difficulty.toLowerCase()}`)}>
                    {p.difficulty}
                  </td>
                  <td>
                    <span className="lf-interview__cta">
                      <Send size={12} /> Open
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
