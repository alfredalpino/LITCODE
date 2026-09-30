"use client";

import {
  ArrowLeft,
  Bug,
  ChevronLeft,
  ChevronRight,
  Play,
  Send,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { SplitPane } from "./SplitPane";
import { loadDsaProblem } from "../lib/dsa/loader";
import { runArenaAttempt } from "../lib/dsa/arena-run";
import {
  getJudgeLanguage,
  starterForLanguage,
  type JudgeLanguageId,
} from "../lib/judge-languages";
import type { CompanyPacksFile, DsaIndexItem, DsaProblem } from "../lib/dsa/types";
import type { ConsoleLine, MobilePane } from "../types";
import { loadComments, type LocalComment } from "../lib/dsa/comments";
import { loadReaction, type Reaction } from "../lib/dsa/reactions";
import { DsaArenaDescription, type LeftTab } from "./DsaArenaDescription";
import { DsaArenaEditor } from "./DsaArenaEditor";
import { DsaArenaConsole } from "./DsaArenaConsole";
import {
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
  editorTheme?: "vs-dark" | "light" | "hc-black";
  interviewMode?: boolean;
  onOpenModule?: (labId: string, moduleId: string) => void;
  /** Open company pack page (unlocked — no paywall). */
  onOpenCompany?: (name: string) => void;
  /** Optional packs — used to rank company chips by interview frequency. */
  companyPacks?: CompanyPacksFile | null;
}

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
    try {
      const result = await runArenaAttempt({
        problem,
        language,
        langMeta,
        code,
        submit,
        debug,
        interviewMode,
        hintLevel,
      });
      setLines(result.lines);
      setCaseResults(result.caseResults);
      if (result.appendLines?.length) {
        setLines((prev) => [...prev, ...result.appendLines!]);
      }
      if (result.accepted) onAccepted?.(problem.id);
    } finally {
      setRunning(false);
    }
  }

  const leftRatio = layout === "focus" ? 0.28 : layout === "default" ? 0.5 : 0.42;
  const editorRatio = layout === "stack" ? 0.62 : 0.7;

  const descriptionPane = (
    <DsaArenaDescription
      problem={problem}
      problemId={problemId}
      indexMeta={indexMeta}
      leftTab={leftTab}
      setLeftTab={setLeftTab}
      showTopics={showTopics}
      setShowTopics={setShowTopics}
      showCompanies={showCompanies}
      setShowCompanies={setShowCompanies}
      showHints={showHints}
      setShowHints={setShowHints}
      hintLevel={hintLevel}
      setHintLevel={setHintLevel}
      showPattern={showPattern}
      setShowPattern={setShowPattern}
      rankedCompanies={rankedCompanies}
      visibleCompanies={visibleCompanies}
      hiddenCompanyCount={hiddenCompanyCount}
      companiesExpanded={companiesExpanded}
      setCompaniesExpanded={setCompaniesExpanded}
      COMPANY_PREVIEW={COMPANY_PREVIEW}
      onOpenCompany={onOpenCompany}
      onOpenModule={onOpenModule}
      commentDraft={commentDraft}
      setCommentDraft={setCommentDraft}
      comments={comments}
      setComments={setComments}
      reaction={reaction}
      setReaction={setReaction}
      selectedIndex={selectedIndex}
      itemsLength={items.length}
      go={go}
      loadComments={loadComments}
    />
  );

  const editorPane = (
    <DsaArenaEditor
      language={language}
      langMeta={langMeta}
      langOpen={langOpen}
      setLangOpen={setLangOpen}
      setLanguage={setLanguage}
      langRef={langRef}
      problem={problem}
      code={code}
      setCode={setCode}
      editorTheme={editorTheme}
      setLayout={setLayout}
      savedFlash={savedFlash}
    />
  );

  const consolePane = (
    <DsaArenaConsole
      problem={problem}
      interviewMode={interviewMode}
      consoleTab={consoleTab}
      setConsoleTab={setConsoleTab}
      activeCase={activeCase}
      setActiveCase={setActiveCase}
      caseResults={caseResults}
      lines={lines}
    />
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
