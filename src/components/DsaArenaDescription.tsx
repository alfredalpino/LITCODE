"use client";

import type { Dispatch, SetStateAction } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  MessageSquare,
  Tags,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { appendEvent } from "../lib/events";
import type { DsaIndexItem, DsaProblem } from "../lib/dsa/types";
import type { LocalComment } from "../lib/dsa/comments";
import { saveReaction, type Reaction } from "../lib/dsa/reactions";
import { PatternRelatedLabs } from "./PatternRelatedLabs";
import { DsaArenaComments } from "./DsaArenaComments";

export type LeftTab = "description" | "editorial" | "solutions" | "submissions" | "comments";

export function DsaArenaDescription(props: {
  problem: DsaProblem | null;
  problemId: string;
  indexMeta: DsaIndexItem | undefined;
  leftTab: LeftTab;
  setLeftTab: (tab: LeftTab) => void;
  showTopics: boolean;
  setShowTopics: Dispatch<SetStateAction<boolean>>;
  showCompanies: boolean;
  setShowCompanies: Dispatch<SetStateAction<boolean>>;
  showHints: boolean;
  setShowHints: Dispatch<SetStateAction<boolean>>;
  hintLevel: number;
  setHintLevel: Dispatch<SetStateAction<number>>;
  showPattern: boolean;
  setShowPattern: Dispatch<SetStateAction<boolean>>;
  rankedCompanies: Array<{ name: string; frequency: number }>;
  visibleCompanies: Array<{ name: string; frequency: number }>;
  hiddenCompanyCount: number;
  companiesExpanded: boolean;
  setCompaniesExpanded: Dispatch<SetStateAction<boolean>>;
  COMPANY_PREVIEW: number;
  onOpenCompany?: (name: string) => void;
  onOpenModule?: (labId: string, moduleId: string) => void;
  commentDraft: string;
  setCommentDraft: Dispatch<SetStateAction<string>>;
  comments: LocalComment[];
  setComments: Dispatch<SetStateAction<LocalComment[]>>;
  reaction: Reaction;
  setReaction: Dispatch<SetStateAction<Reaction>>;
  selectedIndex: number;
  itemsLength: number;
  go: (delta: number) => void;
  loadComments: (problemId: string) => LocalComment[];
}) {
  const {
    problem,
    problemId,
    indexMeta,
    leftTab,
    setLeftTab,
    showTopics,
    setShowTopics,
    showCompanies,
    setShowCompanies,
    showHints,
    setShowHints,
    hintLevel,
    setHintLevel,
    showPattern,
    setShowPattern,
    rankedCompanies,
    visibleCompanies,
    hiddenCompanyCount,
    companiesExpanded,
    setCompaniesExpanded,
    COMPANY_PREVIEW,
    onOpenCompany,
    onOpenModule,
    commentDraft,
    setCommentDraft,
    comments,
    setComments,
    reaction,
    setReaction,
    selectedIndex,
    itemsLength,
    go,
    loadComments,
  } = props;

  return <section className="lc-prob-left">
      <div className="lc-prob-left__tabs" role="tablist">
        {(
          [
            ["description", "Description"],
            ["editorial", "Editorial"],
            ["solutions", "Solutions"],
            ["submissions", "Submissions"],
            ["comments", "Comments"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={leftTab === id}
            className={clsx("lc-prob-left__tab", leftTab === id && "is-active")}
            onClick={() => setLeftTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="lc-prob-left__scroll">
        {leftTab === "description" && problem && (
          <>
            <div className="lc-prob-left__title-row">
              <h1>
                {indexMeta?.num ? `${indexMeta.num}. ` : ""}
                {problem.title}
              </h1>
            </div>
            <div className="lc-prob-left__actions">
              <span
                className={clsx(
                  "diff-badge",
                  `is-${problem.difficulty.toLowerCase()}`
                )}
              >
                {problem.difficulty}
              </span>
              <button
                type="button"
                className={clsx("lc-prob-chip", showTopics && "is-open")}
                onClick={() => {
                  setShowTopics((v) => !v);
                  setShowCompanies(false);
                  setShowHints(false);
                }}
              >
                <Tags size={13} /> Topics
              </button>
              <button
                type="button"
                className={clsx("lc-prob-chip", showCompanies && "is-open")}
                onClick={() => {
                  setShowCompanies((v) => !v);
                  setShowTopics(false);
                  setShowHints(false);
                }}
              >
                <Building2 size={13} /> Companies
              </button>
              <button
                type="button"
                className={clsx("lc-prob-chip", showHints && "is-open")}
                onClick={() => {
                  setShowHints((v) => !v);
                  setShowTopics(false);
                  setShowCompanies(false);
                }}
              >
                <Lightbulb size={13} /> Hint
              </button>
              {problem.hasJudge && (
                <span className="lc-prob-chip is-static">Auto-Judge</span>
              )}
            </div>

            {showTopics && (
              <div className="lc-prob-panel">
                <h3>Topics</h3>
                <div className="lc-prob-panel__chips">
                  {problem.topics.map((t) => (
                    <span key={t} className="topic-chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {showCompanies && (
              <div className="lc-prob-panel">
                <h3>
                  Companies
                  {rankedCompanies.length > 0 ? (
                    <span className="lc-muted"> · {rankedCompanies.length}</span>
                  ) : null}
                </h3>
                <p className="lc-muted">
                  Only companies that have asked this problem (merged interview lists).
                  Sorted by reported frequency. Click a tag to open that pack.
                </p>
                <div className="lc-prob-panel__chips">
                  {rankedCompanies.length === 0 ? (
                    <span className="lc-muted">No company has this title tagged yet.</span>
                  ) : (
                    <>
                      {visibleCompanies.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          className="topic-chip lc-prob-company"
                          title={
                            c.frequency
                              ? `${c.name} · frequency ${c.frequency}`
                              : c.name
                          }
                          onClick={() => onOpenCompany?.(c.name)}
                        >
                          {c.name}
                          {c.frequency > 0 ? (
                            <span className="lc-prob-company__freq">{c.frequency}</span>
                          ) : null}
                        </button>
                      ))}
                      {!companiesExpanded && hiddenCompanyCount > 0 ? (
                        <button
                          type="button"
                          className="topic-chip lc-prob-company lc-prob-company--more"
                          onClick={() => setCompaniesExpanded(true)}
                        >
                          +{hiddenCompanyCount} more
                        </button>
                      ) : null}
                      {companiesExpanded && rankedCompanies.length > COMPANY_PREVIEW ? (
                        <button
                          type="button"
                          className="topic-chip lc-prob-company lc-prob-company--more"
                          onClick={() => setCompaniesExpanded(false)}
                        >
                          Show less
                        </button>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            )}

            {showHints && (
              <div className="lc-prob-panel">
                <h3>Hints</h3>
                {problem.hints?.length ? (
                  <>
                    <ol className="dsa-hints__list">
                      {problem.hints.slice(0, hintLevel).map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ol>
                    {hintLevel < problem.hints.length ? (
                      <button
                        type="button"
                        className="tool-btn"
                        onClick={() => {
                          const next = hintLevel + 1;
                          setHintLevel(next);
                          appendEvent({
                            type: "hint_revealed",
                            challengeId: problem.id,
                            meta: { level: next },
                          });
                        }}
                      >
                        Reveal hint {hintLevel + 1} / {problem.hints.length}
                      </button>
                    ) : (
                      <p className="dsa-hints__done">All hints revealed.</p>
                    )}
                  </>
                ) : (
                  <p className="lc-muted">No curated hints for this problem yet.</p>
                )}
              </div>
            )}

            <article className="markdown-body markdown-body--dark">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {problem.description}
              </ReactMarkdown>
            </article>
            {problem.examples?.map((ex, i) => (
              <div key={i} className="dsa-example">
                <h3>Example {i + 1}</h3>
                <pre>
                  <strong>Input:</strong> {ex.input}
                  {"\n"}
                  <strong>Output:</strong> {ex.output}
                  {ex.explanation ? `\nExplanation: ${ex.explanation}` : ""}
                </pre>
              </div>
            ))}
            {problem.constraints?.length > 0 && (
              <div className="dsa-constraints">
                <h3>Constraints</h3>
                <ul>
                  {problem.constraints.map((c) => (
                    <li key={c}>
                      <code>{c}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {problem.pattern && (
              <p className="dsa-pattern-tag">
                Pattern: <code>{problem.pattern}</code>
              </p>
            )}
            <PatternRelatedLabs
              patternKey={problem.pattern}
              onOpenModule={onOpenModule}
            />
            {problem.patternDiscussion && (
              <section className="dsa-pattern-box" aria-label="Pattern discussion">
                <header className="dsa-pattern-box__head">
                  <Lightbulb size={16} aria-hidden />
                  <div>
                    <h3>Pattern discussion</h3>
                    <p className="dsa-pattern-box__lead">
                      Approach and trade-offs — not a full code dump.
                    </p>
                  </div>
                </header>
                {!showPattern ? (
                  <button
                    type="button"
                    className="dsa-pattern-box__reveal"
                    onClick={() => {
                      setShowPattern(true);
                      appendEvent({
                        type: "hint_revealed",
                        challengeId: problem.id,
                        meta: { kind: "patternDiscussion" },
                      });
                    }}
                  >
                    Reveal pattern teaching
                    <span>Spoiler</span>
                  </button>
                ) : (
                  <article className="markdown-body markdown-body--dark dsa-pattern-box__body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {problem.patternDiscussion}
                    </ReactMarkdown>
                    <button
                      type="button"
                      className="dsa-pattern-box__hide"
                      onClick={() => setShowPattern(false)}
                    >
                      Hide discussion
                    </button>
                  </article>
                )}
              </section>
            )}
          </>
        )}

        {leftTab === "description" && !problem && (
          <div className="reader__state">Loading problem…</div>
        )}

        {leftTab === "editorial" && (
          <div className="lc-prob-placeholder">
            <h2>Editorial</h2>
            <p>
              Curated editorials ship with the judged pack. Use Pattern discussion and
              Hints on Description for teaching-first walkthroughs today.
            </p>
          </div>
        )}

        {leftTab === "solutions" && (
          <div className="lc-prob-placeholder">
            <h2>Solutions</h2>
            <p>
              Community solutions stay local-first. Submit an Accepted run to mark
              progress; pattern discussion teaches the approach without dumping code.
            </p>
          </div>
        )}

        {leftTab === "submissions" && (
          <div className="lc-prob-placeholder">
            <h2>Submissions</h2>
            <p>
              Submission history lives in your Progress evidence (local events). Cloud
              sync is deferred — your Accepts already update the skill graph.
            </p>
          </div>
        )}

        {leftTab === "comments" && (
          <DsaArenaComments
            problemId={problemId}
            commentDraft={commentDraft}
            setCommentDraft={setCommentDraft}
            comments={comments}
            setComments={setComments}
            loadComments={loadComments}
          />
        )}

      </div>

      <footer className="lc-prob-left__foot">
        <div className="lc-prob-left__social" role="group" aria-label="Feedback">
          <button
            type="button"
            className={clsx("lc-icon-btn lc-prob-react", reaction === "up" && "is-active is-up")}
            title={reaction === "up" ? "Remove helpful" : "Helpful"}
            aria-pressed={reaction === "up"}
            onClick={() => {
              const next: Reaction = reaction === "up" ? null : "up";
              setReaction(next);
              saveReaction(problemId, next);
            }}
          >
            <ThumbsUp size={14} />
          </button>
          <button
            type="button"
            className={clsx(
              "lc-icon-btn lc-prob-react",
              reaction === "down" && "is-active is-down"
            )}
            title={reaction === "down" ? "Remove not helpful" : "Not helpful"}
            aria-pressed={reaction === "down"}
            onClick={() => {
              const next: Reaction = reaction === "down" ? null : "down";
              setReaction(next);
              saveReaction(problemId, next);
            }}
          >
            <ThumbsDown size={14} />
          </button>
          <button
            type="button"
            className={clsx(
              "lc-icon-btn lc-prob-react lc-prob-react--comments",
              leftTab === "comments" && "is-active"
            )}
            title="Comments"
            onClick={() => setLeftTab("comments")}
          >
            <MessageSquare size={14} />
            <span>{comments.length}</span>
          </button>
        </div>
        <div className="lc-prob-left__nav">
          <button
            type="button"
            className="reader__nav-btn"
            disabled={selectedIndex <= 0}
            onClick={() => go(-1)}
          >
            <ChevronLeft size={16} />
            Prev
          </button>
          <button
            type="button"
            className="reader__nav-btn"
            disabled={selectedIndex < 0 || selectedIndex >= itemsLength - 1}
            onClick={() => go(1)}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>
    </section>;
}
