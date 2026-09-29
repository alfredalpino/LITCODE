import Editor from "@monaco-editor/react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  Send,
  Terminal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { SplitPane } from "./SplitPane";
import { judgeSolution, runCode } from "../lib/runner";
import { loadDsaIndex, loadDsaProblem } from "../lib/dsa/loader";
import type { DsaIndexItem, DsaProblem } from "../lib/dsa/types";
import type { ConsoleLine, LabLanguage } from "../types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DsaArenaProps {
  onBackToLabs?: () => void;
}

type ConsoleTab = "testcase" | "result";

export function DsaArena({}: DsaArenaProps) {
  const [items, setItems] = useState<DsaIndexItem[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [diffFilter, setDiffFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [problem, setProblem] = useState<DsaProblem | null>(null);
  const [language, setLanguage] = useState<LabLanguage>("javascript");
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [consoleTab, setConsoleTab] = useState<ConsoleTab>("testcase");
  const [activeCase, setActiveCase] = useState(0);
  const [lines, setLines] = useState<ConsoleLine[]>([]);
  const [caseResults, setCaseResults] = useState<
    Array<{ id: string; pass: boolean; error?: string }> | null
  >(null);
  const [listOpen, setListOpen] = useState(true);

  useEffect(() => {
    loadDsaIndex().then((file) => {
      setItems(file.index);
      setTopics(file.catalog.topics);
      setTotal(file.catalog.total);
      const first = file.index[0];
      if (first) setSelectedId(first.id);
    });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    loadDsaProblem(selectedId).then((p) => {
      if (cancelled) return;
      setProblem(p);
      setCode(p.starter[language] ?? p.starter.javascript);
      setLines([]);
      setCaseResults(null);
      setActiveCase(0);
      setConsoleTab("testcase");
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    if (!problem) return;
    setCode(problem.starter[language] ?? problem.starter.javascript);
  }, [language, problem?.id]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (diffFilter !== "All" && it.difficulty !== diffFilter) return false;
      if (topicFilter !== "All" && !it.topics.includes(topicFilter)) return false;
      if (!q) return true;
      return (
        it.title.toLowerCase().includes(q) ||
        String(it.num).includes(q) ||
        it.topics.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [items, query, diffFilter, topicFilter]);

  const selectedIndex = items.findIndex((i) => i.id === selectedId);

  function go(delta: number) {
    const next = items[selectedIndex + delta];
    if (next) setSelectedId(next.id);
  }

  async function handleRun(submit: boolean) {
    if (!problem) return;
    setRunning(true);
    setConsoleTab("result");
    try {
      if (problem.hasJudge && problem.tests?.length) {
        const judged = await judgeSolution({
          language,
          code,
          functionName: problem.functionName,
          tests: problem.tests.filter((t) => t.expected !== undefined) as Array<{
            id: string;
            input: unknown[];
            expected: unknown;
          }>,
        });
        setLines(judged.lines);
        setCaseResults(judged.results);
        if (submit) {
          const allPass = judged.passed === judged.total && judged.total > 0;
          setLines((prev) => [
            ...prev,
            {
              id: `submit-${Date.now()}`,
              kind: allPass ? "log" : "error",
              text: allPass
                ? `Submitted — Accepted (${judged.passed}/${judged.total})`
                : `Submitted — Wrong Answer (${judged.passed}/${judged.total})`,
              ts: Date.now(),
            },
          ]);
        }
      } else {
        const result = await runCode(language, code);
        setLines([
          {
            id: `info-${Date.now()}`,
            kind: "info",
            text: "This problem is practice-mode (no auto-judge). Console shows your program output.",
            ts: Date.now(),
          },
          ...result.lines,
        ]);
        setCaseResults(null);
      }
    } finally {
      setRunning(false);
    }
  }

  const monacoLang =
    language === "python" ? "python" : language === "typescript" ? "typescript" : "javascript";

  const descriptionPane = (
    <section className="dsa-desc">
      <div className="dsa-desc__head">
        <div className="dsa-desc__tabs">
          <span className="dsa-desc__tab is-active">Description</span>
          <span className="dsa-desc__tab is-muted">Editorial</span>
          <span className="dsa-desc__tab is-muted">Solutions</span>
        </div>
        {problem && (
          <div className="dsa-desc__meta">
            <h1>
              {problem.id.startsWith("seed") ? items.find((i) => i.id === problem.id)?.num : problem.title.includes("#") ? selectedIndex + 1 : selectedIndex + 1}. {problem.title}
            </h1>
            <div className="dsa-desc__badges">
              <span className={clsx("diff-badge", `is-${problem.difficulty.toLowerCase()}`)}>
                {problem.difficulty}
              </span>
              {problem.topics.slice(0, 4).map((t) => (
                <span key={t} className="topic-chip">
                  {t}
                </span>
              ))}
              {problem.hasJudge && <span className="topic-chip is-judge">Auto-Judge</span>}
            </div>
          </div>
        )}
      </div>
      <div className="dsa-desc__body">
        {problem ? (
          <>
            <article className="markdown-body markdown-body--dark">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.description}</ReactMarkdown>
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
          </>
        ) : (
          <div className="reader__state">Loading problem…</div>
        )}
      </div>
      <footer className="reader__nav">
        <button type="button" className="reader__nav-btn" disabled={selectedIndex <= 0} onClick={() => go(-1)}>
          <ChevronLeft size={16} />
          <span>
            <small>Previous</small>
            <strong>{items[selectedIndex - 1]?.title ?? "—"}</strong>
          </span>
        </button>
        <button
          type="button"
          className="reader__nav-btn reader__nav-btn--next"
          disabled={selectedIndex < 0 || selectedIndex >= items.length - 1}
          onClick={() => go(1)}
        >
          <span>
            <small>Next</small>
            <strong>{items[selectedIndex + 1]?.title ?? "—"}</strong>
          </span>
          <ChevronRight size={16} />
        </button>
      </footer>
    </section>
  );

  const editorPane = (
    <div className="dsa-editor">
      <div className="workbench__toolbar">
        <div className="workbench__file">
          <span className="workbench__file-name">&lt;/&gt; Code</span>
        </div>
        <div className="workbench__actions">
          <select
            className="lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as LabLanguage)}
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
          </select>
          <button
            type="button"
            className="tool-btn"
            title="Reset code"
            onClick={() => problem && setCode(problem.starter[language])}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
      <div className="workbench__editor">
        <Editor
          height="100%"
          language={monacoLang}
          value={code}
          onChange={(v) => setCode(v ?? "")}
          theme="vs-dark"
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
    </div>
  );

  const consolePane = (
    <div className="dsa-console">
      <div className="console__bar">
        <div className="dsa-console__tabs">
          <button
            type="button"
            className={clsx("console__toggle", consoleTab === "testcase" && "is-active-tab")}
            onClick={() => setConsoleTab("testcase")}
          >
            Testcase
          </button>
          <button
            type="button"
            className={clsx("console__toggle", consoleTab === "result" && "is-active-tab")}
            onClick={() => setConsoleTab("result")}
          >
            <Terminal size={14} />
            Test Result
          </button>
        </div>
        <div className="console__bar-actions">
          <button type="button" className="run-btn run-btn--ghost" disabled={running} onClick={() => handleRun(false)}>
            <Play size={14} fill="currentColor" />
            Run
          </button>
          <button type="button" className="run-btn" disabled={running} onClick={() => handleRun(true)}>
            <Send size={14} />
            {running ? "Judging…" : "Submit"}
          </button>
        </div>
      </div>

      {consoleTab === "testcase" && problem && (
        <div className="dsa-cases">
          <div className="dsa-cases__pills">
            {(problem.tests ?? []).map((t, i) => (
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
                {t.id}
              </button>
            ))}
          </div>
          {problem.tests?.[activeCase] && (
            <pre className="dsa-cases__preview">
              {JSON.stringify(
                {
                  input: problem.tests[activeCase].input,
                  expected: problem.tests[activeCase].expected ?? "(manual)",
                },
                null,
                2
              )}
            </pre>
          )}
        </div>
      )}

      {consoleTab === "result" && (
        <div className="console__output" role="log">
          {caseResults && (
            <p className={clsx("dsa-summary", caseResults.every((r) => r.pass) ? "is-ok" : "is-bad")}>
              Passed test cases: {caseResults.filter((r) => r.pass).length} / {caseResults.length}
            </p>
          )}
          {lines.length === 0 ? (
            <p className="console__empty">Run or Submit to see results. Drag gutters to resize all panes.</p>
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
    <div className="dsa-arena">
      <aside className={clsx("dsa-list", listOpen && "is-open")}>
        <div className="dsa-list__head">
          <div>
            <p className="sidebar__eyebrow">DSA Arena</p>
            <p className="sidebar__progress">{total.toLocaleString()} industry problems</p>
          </div>
          <button type="button" className="icon-btn" onClick={() => setListOpen(false)} aria-label="Collapse">
            <ChevronLeft size={16} />
          </button>
        </div>
        <input
          className="dsa-list__search"
          placeholder="Search title, topic, #"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="dsa-list__filters">
          <select value={diffFilter} onChange={(e) => setDiffFilter(e.target.value as typeof diffFilter)}>
            <option value="All">All difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
            <option value="All">All topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="dsa-list__scroll">
          {filtered.slice(0, 400).map((it) => (
            <button
              key={it.id}
              type="button"
              className={clsx("dsa-list__item", selectedId === it.id && "is-active")}
              onClick={() => {
                setSelectedId(it.id);
                if (window.matchMedia("(max-width: 900px)").matches) setListOpen(false);
              }}
            >
              <span className="dsa-list__num">{it.num}</span>
              <span className="dsa-list__title">{it.title}</span>
              <span className={clsx("diff-badge", `is-${it.difficulty.toLowerCase()}`)}>
                {it.difficulty[0]}
              </span>
            </button>
          ))}
          {filtered.length > 400 && (
            <p className="dsa-list__more">Showing 400 of {filtered.length.toLocaleString()} — refine filters</p>
          )}
        </div>
      </aside>

      {!listOpen && (
        <button type="button" className="dsa-list-toggle" onClick={() => setListOpen(true)}>
          Problems
        </button>
      )}

      <div className="dsa-workspace">
        <SplitPane
          orientation="horizontal"
          storageKey="dsa-main-split"
          initialRatio={0.42}
          minFirst={260}
          minSecond={320}
          first={descriptionPane}
          second={
            <SplitPane
              orientation="vertical"
              storageKey="dsa-editor-console"
              initialRatio={0.62}
              minFirst={140}
              minSecond={120}
              first={editorPane}
              second={consolePane}
            />
          }
        />
      </div>
    </div>
  );
}
