"use client";

import Editor from "@monaco-editor/react";
import {
  ArrowLeft,
  Bug,
  Building2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Maximize2,
  MessageSquare,
  Play,
  RotateCcw,
  Send,
  Tags,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SplitPane } from "./SplitPane";
import { judgeSolution, runCode } from "../lib/runner";
import { remoteExecutable } from "../lib/remote-execute";
import { loadDsaProblem } from "../lib/dsa/loader";
import { appendEvent } from "../lib/events";
import {
  findNodeByChallengeId,
  loadSkillGraph,
  loadSkillState,
  recordChallengeResult,
  saveSkillState,
} from "../lib/skill-graph";
import { splitVisibleHidden } from "../lib/workbench";
import {
  getJudgeLanguage,
  runnableLanguageLabels,
  starterForLanguage,
  toRunnerLanguage,
  type JudgeLanguageId,
} from "../lib/judge-languages";
import { getRunnerAvailability } from "../lib/browser-runners";
import type { CompanyPacksFile, DsaIndexItem, DsaProblem } from "../lib/dsa/types";
import type { ConsoleLine, MobilePane } from "../types";
import { PatternRelatedLabs } from "./PatternRelatedLabs";
import { loadComments, saveComment, type LocalComment } from "../lib/dsa/comments";
import { loadReaction, saveReaction, type Reaction } from "../lib/dsa/reactions";
import {
  DsaLanguageSelect,
  DsaLayoutSelect,
  type ArenaLayoutId,
} from "./DsaArenaToolbar";

interface DsaArenaProps {
  problemId: string;
  items: DsaIndexItem[];
  onBack: () => void;
  onChangeProblem: (id: string) => void;
  onAccepted?: (id: string) => void;
  mobilePane: MobilePane;
  onMobilePane: (p: MobilePane) => void;
  editorTheme?: "vs-dark" | "light";
  interviewMode?: boolean;
  onOpenModule?: (labId: string, moduleId: string) => void;
  /** Open company pack page (unlocked — no paywall). */
  onOpenCompany?: (name: string) => void;
  /** Optional packs — used to rank company chips by interview frequency. */
  companyPacks?: CompanyPacksFile | null;
}

type LeftTab = "description" | "editorial" | "solutions" | "submissions" | "comments";
type ConsoleTab = "testcase" | "result";

export function DsaArena({
  problemId,
  items,
  onBack,
  onChangeProblem,
  onAccepted,
  mobilePane,
  onMobilePane,
  editorTheme = "vs-dark",
  interviewMode = false,
  onOpenModule,
  onOpenCompany,
  companyPacks = null,
}: DsaArenaProps) {
  const [problem, setProblem] = useState<DsaProblem | null>(null);
  const [language, setLanguage] = useState<JudgeLanguageId>("javascript");
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [consoleTab, setConsoleTab] = useState<ConsoleTab>("testcase");
  const [leftTab, setLeftTab] = useState<LeftTab>("description");
  const [activeCase, setActiveCase] = useState(0);
  const [lines, setLines] = useState<ConsoleLine[]>([]);
  const [caseResults, setCaseResults] = useState<
    Array<{ id: string; pass: boolean; error?: string }> | null
  >(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [showPattern, setShowPattern] = useState(false);
  const [companiesExpanded, setCompaniesExpanded] = useState(false);
  const [showTopics, setShowTopics] = useState(false);
  const [showCompanies, setShowCompanies] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [layout, setLayout] = useState<ArenaLayoutId>("stack");
  const [commentDraft, setCommentDraft] = useState("");
  const [comments, setComments] = useState<LocalComment[]>([]);
  const [reaction, setReaction] = useState<Reaction>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  const selectedIndex = items.findIndex((i) => i.id === problemId);
  const indexMeta = items[selectedIndex];
  const langMeta = getJudgeLanguage(language);

  const COMPANY_PREVIEW = 12;
  const rankedCompanies = useMemo(() => {
    const names =
      problem?.companies?.length
        ? problem.companies
        : indexMeta?.companies ?? [];
    const slug = problem?.slug || indexMeta?.slug || "";
    const pack = slug ? companyPacks?.problems?.[slug] : undefined;
    if (pack?.companies?.length) {
      return pack.companies
        .map((c: { name: string; frequency: number }) => ({
          name: c.name,
          frequency: c.frequency || 0,
        }))
        .sort(
          (
            a: { name: string; frequency: number },
            b: { name: string; frequency: number }
          ) => b.frequency - a.frequency || a.name.localeCompare(b.name)
        );
    }
    return names.map((name) => ({ name, frequency: 0 }));
  }, [problem, indexMeta, companyPacks]);

  const visibleCompanies = companiesExpanded
    ? rankedCompanies
    : rankedCompanies.slice(0, COMPANY_PREVIEW);
  const hiddenCompanyCount = Math.max(0, rankedCompanies.length - COMPANY_PREVIEW);

  useEffect(() => {
    let cancelled = false;
    loadDsaProblem(problemId).then((p) => {
      if (cancelled) return;
      setProblem(p);
      setCode(starterForLanguage(language, p.functionName, p.starter));
      setLines([]);
      setCaseResults(null);
      setActiveCase(0);
      setConsoleTab("testcase");
      setLeftTab("description");
      setHintLevel(0);
      setShowPattern(false);
      setShowTopics(false);
      setShowCompanies(false);
      setCompaniesExpanded(false);
      setShowHints(false);
      setComments(loadComments(problemId));
      setReaction(loadReaction(problemId));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId]);

  useEffect(() => {
    if (!problem) return;
    setCode(starterForLanguage(language, problem.functionName, problem.starter));
  }, [language, problem?.id]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 1200);
    }, 800);
    return () => window.clearTimeout(t);
  }, [code]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (langRef.current && !langRef.current.contains(t)) setLangOpen(false);
      if (layoutRef.current && !layoutRef.current.contains(t)) setLayoutOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function go(delta: number) {
    const next = items[selectedIndex + delta];
    if (next) onChangeProblem(next.id);
  }

  async function handleRun(submit: boolean, debug = false) {
    if (!problem) return;
    setRunning(true);
    setConsoleTab("result");
    const started = performance.now();
    const runnerLang = toRunnerLanguage(language);
    const execLang = runnerLang ?? language;

    try {
      if (!runnerLang && !remoteExecutable(language)) {
        const avail = getRunnerAvailability(language);
        setLines([
          {
            id: `lang-${Date.now()}`,
            kind: avail.status === "planned" ? "info" : "warn",
            text:
              avail.status === "planned"
                ? `${langMeta?.label ?? language}: ${avail.engine} runtime is on the ship list (${avail.sizeHint ?? "WASM"}). ${avail.note}`
                : `${langMeta?.label ?? language}: ${avail.note}`,
            ts: Date.now(),
          },
          {
            id: `lang-hint-${Date.now()}`,
            kind: "info",
            text: `Run/Submit: ${runnableLanguageLabels()} in-browser, or C++/Rust/Java/Go via Judge0.`,
            ts: Date.now(),
          },
        ]);
        setCaseResults(null);
        setRunning(false);
        return;
      }

      if (debug) {
        setLines([
          {
            id: `debug-${Date.now()}`,
            kind: "info",
            text: "Debug: step-through debugger ships with worker isolation. For now, Run with console.log / print / echo breakpoints.",
            ts: Date.now(),
          },
        ]);
      }

      if (problem.hasJudge && problem.tests?.length) {
        const scored = problem.tests.filter((t) => t.expected !== undefined) as Array<{
          id: string;
          input: unknown[];
          expected: unknown;
        }>;
        const { visible, hidden } = splitVisibleHidden(scored, 2);
        const suite =
          interviewMode && !submit && visible.length > 0 ? visible : scored;
        const judged = await judgeSolution({
          language: execLang,
          code,
          functionName: problem.functionName,
          tests: suite,
        });
        const elapsed = Math.round(performance.now() - started);
        setLines([
          ...judged.lines,
          {
            id: `timing-${Date.now()}`,
            kind: "info",
            text: `Runtime: ${elapsed}ms · ${submit ? "Submit" : "Run"}${
              debug ? " · Debug note attached" : ""
            } · ${langMeta?.label ?? language}`,
            ts: Date.now(),
          },
        ]);
        setCaseResults(judged.results);
        if (submit) {
          const allPass = judged.passed === judged.total && judged.total > 0;
          setLines((prev) => [
            ...prev,
            {
              id: `submit-${Date.now()}`,
              kind: allPass ? "log" : "error",
              text: allPass
                ? `Accepted (${judged.passed}/${judged.total}${
                    interviewMode && hidden.length ? ` · ${hidden.length} hidden` : ""
                  })`
                : `Wrong Answer (${judged.passed}/${judged.total})`,
              ts: Date.now(),
            },
          ]);
          appendEvent({
            type: allPass ? "challenge_passed" : "challenge_failed",
            challengeId: problem.id,
            meta: { interviewMode, elapsedMs: elapsed, hintsUsed: hintLevel, language },
          });
          void loadSkillGraph()
            .then((graph) => {
              const node = findNodeByChallengeId(graph, problem.id);
              if (!node) return;
              saveSkillState(
                recordChallengeResult(loadSkillState(), node.id, allPass, hintLevel)
              );
            })
            .catch(() => undefined);
          if (allPass) onAccepted?.(problem.id);
        }
      } else {
        const result = await runCode(execLang, code);
        setLines([
          {
            id: `info-${Date.now()}`,
            kind: "info",
            text: interviewMode
              ? `No auto-judge on this title — ${langMeta?.label ?? language} console below.`
              : `${langMeta?.label ?? language} console (practice mode).`,
            ts: Date.now(),
          },
          ...result.lines,
        ]);
        setCaseResults(null);
        if (submit && !interviewMode) onAccepted?.(problem.id);
      }
    } finally {
      setRunning(false);
    }
  }

  const leftRatio = layout === "focus" ? 0.28 : layout === "default" ? 0.5 : 0.42;
  const editorRatio = layout === "stack" ? 0.62 : 0.7;

  const descriptionPane = (
    <section className="lc-prob-left">
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
          <div className="lc-prob-comments">
            <header className="lc-prob-comments__head">
              <h2>
                <MessageSquare size={16} /> Comments
              </h2>
              <span className="lc-prob-comments__count">{comments.length}</span>
            </header>
            <p className="lc-muted">
              Private notes on this device — not a public forum yet.
            </p>
            <textarea
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              placeholder="Leave a note for yourself…"
              rows={3}
            />
            <div className="lc-prob-comments__actions">
              <button
                type="button"
                className="run-btn"
                disabled={!commentDraft.trim()}
                onClick={() => {
                  saveComment(problemId, commentDraft.trim());
                  setCommentDraft("");
                  setComments(loadComments(problemId));
                }}
              >
                Post locally
              </button>
            </div>
            <ul className="lc-prob-comments__list">
              {comments.map((c) => (
                <li key={c.id}>
                  <time>{new Date(c.ts).toLocaleString()}</time>
                  <p>{c.body}</p>
                </li>
              ))}
              {comments.length === 0 && (
                <li className="lc-muted">No comments yet — be the first note here.</li>
              )}
            </ul>
          </div>
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
            disabled={selectedIndex < 0 || selectedIndex >= items.length - 1}
            onClick={() => go(1)}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>
    </section>
  );

  const editorPane = (
    <div className="lc-prob-code">
      <div className="lc-prob-code__bar">
        <div className="lc-prob-code__left">
          <span className="lc-prob-code__label">&lt;/&gt; Code</span>
          <DsaLanguageSelect
            language={language}
            label={langMeta?.label ?? language}
            open={langOpen}
            onOpenChange={setLangOpen}
            onSelect={(id) => {
              setLanguage(id);
              setLangOpen(false);
            }}
            containerRef={langRef}
          />
          {langMeta && !langMeta.runnable && langMeta.availability === "planned" && (
            <span className="lc-prob-code__badge">Runtime soon</span>
          )}
          {langMeta && !langMeta.runnable && langMeta.availability !== "planned" && (
            <span className="lc-prob-code__badge">Coming later</span>
          )}
          {langMeta?.runnable && (
            <span className="lc-prob-code__badge lc-prob-code__badge--ok">In-browser</span>
          )}
        </div>
        <div className="lc-prob-code__right">
          <button
            type="button"
            className="lc-icon-btn"
            title="Reset to starter"
            onClick={() =>
              problem &&
              setCode(starterForLanguage(language, problem.functionName, problem.starter))
            }
          >
            <RotateCcw size={15} />
          </button>
          <button
            type="button"
            className="lc-icon-btn"
            title="Widen editor"
            onClick={() => setLayout("focus")}
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>
      <div className="lc-prob-code__editor">
        <Editor
          height="100%"
          language={langMeta?.monaco ?? "javascript"}
          value={code}
          onChange={(v) => setCode(v ?? "")}
          theme={editorTheme}
          options={{
            fontSize: 13.5,
            fontFamily: '"JetBrains Mono", Menlo, monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            automaticLayout: true,
            padding: { top: 12 },
            tabSize: 2,
            wordWrap: "on",
          }}
        />
      </div>
      <div className="lc-prob-code__status">
        <span>{savedFlash ? "Saved" : " "}</span>
        <span className="lc-muted">{langMeta?.label}</span>
      </div>
    </div>
  );

  const consolePane = (
    <div className="lc-prob-console">
      <div className="lc-prob-console__tabs">
        <button
          type="button"
          className={clsx(consoleTab === "testcase" && "is-active")}
          onClick={() => setConsoleTab("testcase")}
        >
          Testcase
        </button>
        <button
          type="button"
          className={clsx(consoleTab === "result" && "is-active")}
          onClick={() => setConsoleTab("result")}
        >
          Test Result
        </button>
      </div>
      {consoleTab === "testcase" && problem && (
        <div className="dsa-cases">
          <div className="dsa-cases__pills">
            {(interviewMode
              ? splitVisibleHidden(
                  (problem.tests ?? []).filter((t) => t.expected !== undefined),
                  2
                ).visible
              : problem.tests ?? []
            ).map((t, i) => (
              <button
                key={t.id}
                type="button"
                className={clsx(
                  "case-pill",
                  activeCase === i && "is-active",
                  caseResults?.[i] && (caseResults[i].pass ? "is-pass" : "is-fail")
                )}
                onClick={() => setActiveCase(i)}
              >
                Case {i + 1}
              </button>
            ))}
          </div>
          {(() => {
            const shown = interviewMode
              ? splitVisibleHidden(
                  (problem.tests ?? []).filter((t) => t.expected !== undefined),
                  2
                ).visible
              : problem.tests ?? [];
            const active = shown[activeCase];
            if (!active) {
              return (
                <p className="console__empty">No testcases on this problem.</p>
              );
            }
            return (
              <pre className="dsa-cases__preview">
                {JSON.stringify(
                  {
                    input: active.input,
                    expected: active.expected ?? "(manual)",
                  },
                  null,
                  2
                )}
              </pre>
            );
          })()}
        </div>
      )}
      {consoleTab === "result" && (
        <div className="console__output" role="log">
          {caseResults && (
            <p
              className={clsx(
                "dsa-summary",
                caseResults.every((r) => r.pass) ? "is-ok" : "is-bad"
              )}
            >
              Passed: {caseResults.filter((r) => r.pass).length} / {caseResults.length}
            </p>
          )}
          {lines.length === 0 ? (
            <p className="console__empty">You must run your code first</p>
          ) : (
            lines.map((l) => (
              <pre key={l.id} className={clsx("console__line", `is-${l.kind}`)}>
                {l.text}
              </pre>
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={clsx("lc-prob", `lc-prob--${layout}`)}>
      <header className="lc-prob-top">
        <div className="lc-prob-top__left">
          <button type="button" className="dsa-back" onClick={onBack}>
            <ArrowLeft size={14} /> Problem List
          </button>
          <button
            type="button"
            className="lc-icon-btn"
            disabled={selectedIndex <= 0}
            onClick={() => go(-1)}
            aria-label="Previous problem"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="lc-icon-btn"
            disabled={selectedIndex < 0 || selectedIndex >= items.length - 1}
            onClick={() => go(1)}
            aria-label="Next problem"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="lc-prob-top__center">
          <button
            type="button"
            className="run-btn run-btn--ghost"
            disabled={running}
            onClick={() => handleRun(false)}
          >
            <Play size={14} fill="currentColor" />
            Run
          </button>
          <button
            type="button"
            className="run-btn run-btn--ghost"
            disabled={running}
            onClick={() => handleRun(false, true)}
          >
            <Bug size={14} />
            Debug
          </button>
          <button
            type="button"
            className="run-btn"
            disabled={running}
            onClick={() => handleRun(true)}
          >
            <Send size={14} />
            {running ? "Judging…" : "Submit"}
          </button>
        </div>

        <DsaLayoutSelect
          layout={layout}
          open={layoutOpen}
          onOpenChange={setLayoutOpen}
          onSelect={(id) => {
            setLayout(id);
            setLayoutOpen(false);
          }}
          containerRef={layoutRef}
        />
      </header>

      <div className="workspace__mobile-bar">
        <div className="topbar__mobile-toggle">
          <button
            type="button"
            className={clsx("pane-tab", mobilePane === "read" && "is-active")}
            onClick={() => onMobilePane("read")}
          >
            Description
          </button>
          <button
            type="button"
            className={clsx("pane-tab", mobilePane === "code" && "is-active")}
            onClick={() => onMobilePane("code")}
          >
            Code
          </button>
        </div>
      </div>

      <div className="lc-prob__desktop workspace__desktop">
        <SplitPane
          orientation="horizontal"
          storageKey={`dsa-main-${layout}`}
          initialRatio={leftRatio}
          minFirst={240}
          minSecond={300}
          first={descriptionPane}
          second={
            <SplitPane
              orientation="vertical"
              storageKey={`dsa-editor-console-${layout}`}
              initialRatio={editorRatio}
              minFirst={120}
              minSecond={100}
              first={editorPane}
              second={consolePane}
            />
          }
        />
      </div>

      <div className="workspace__mobile">
        {mobilePane === "read" ? (
          descriptionPane
        ) : (
          <SplitPane
            orientation="vertical"
            storageKey="dsa-mobile-editor-console"
            initialRatio={0.6}
            minFirst={120}
            minSecond={100}
            first={editorPane}
            second={consolePane}
          />
        )}
      </div>
    </div>
  );
}
