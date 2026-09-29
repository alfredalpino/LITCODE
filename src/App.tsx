import { useCallback, useEffect, useMemo, useState } from "react";
import { AppNav, type NavSection } from "./components/AppNav";
import { LeftRail, type RailTab } from "./components/LeftRail";
import { RightPanel } from "./components/RightPanel";
import { LabLibrary } from "./components/LabLibrary";
import { DsaProblemsList } from "./components/DsaProblemsList";
import { Reader } from "./components/Reader";
import { CodeWorkbench } from "./components/CodeWorkbench";
import { SplitPane } from "./components/SplitPane";
import { DsaArena } from "./components/DsaArena";
import { loadCatalog } from "./lib/content";
import { loadDsaIndex } from "./lib/dsa/loader";
import type { DsaIndexItem } from "./lib/dsa/types";
import {
  loadProgress,
  moduleKey,
  saveProgress,
  type ProgressMap,
} from "./lib/progress";
import {
  loadDsaSolved,
  loadFavorites,
  loadStreak,
  markDsaSolved,
  toggleFavorite,
  touchStreak,
  type StreakState,
} from "./lib/stats";
import type { AppMode, Catalog, Lab, LabModule, MobilePane } from "./types";
import "./App.css";
import "./lc-shell.css";

type WorkspaceView = "list" | "solve";

export default function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<AppMode>("labs");
  const [section, setSection] = useState<NavSection>("labs");
  const [rail, setRail] = useState<RailTab>("library");
  const [view, setView] = useState<WorkspaceView>("list");
  const [labId, setLabId] = useState("javascript");
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [dsaId, setDsaId] = useState<string | null>(null);
  const [dsaItems, setDsaItems] = useState<DsaIndexItem[]>([]);
  const [dsaTopics, setDsaTopics] = useState<string[]>([]);
  const [dsaCompanies, setDsaCompanies] = useState<string[]>([]);
  const [dsaTotal, setDsaTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobilePane, setMobilePane] = useState<MobilePane>("read");
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());
  const [dsaSolved, setDsaSolved] = useState(() => loadDsaSolved());
  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [streak, setStreak] = useState<StreakState>(() => loadStreak());

  useEffect(() => {
    setStreak(touchStreak());
    loadCatalog()
      .then((c) => {
        setCatalog(c);
        const first = c.labs[0];
        if (first) setLabId(first.id);
      })
      .catch((err: Error) => setError(err.message));

    loadDsaIndex()
      .then((file) => {
        setDsaItems(file.index);
        setDsaTopics(file.catalog.topics);
        setDsaCompanies(file.catalog.companies);
        setDsaTotal(file.catalog.total);
      })
      .catch(() => {
        /* DSA optional at boot */
      });
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        document.querySelector<HTMLButtonElement>(".run-btn")?.click();
      }
      if (e.key === "Escape" && view === "solve") {
        setView("list");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view]);

  const lab: Lab | undefined = useMemo(
    () => catalog?.labs.find((l) => l.id === labId),
    [catalog, labId]
  );

  const moduleIndex = useMemo(() => {
    if (!lab || !moduleId) return -1;
    return lab.modules.findIndex((m) => m.id === moduleId);
  }, [lab, moduleId]);

  const module: LabModule | null =
    lab && moduleIndex >= 0 ? lab.modules[moduleIndex] : null;
  const prevModule = lab && moduleIndex > 0 ? lab.modules[moduleIndex - 1] : null;
  const nextModule =
    lab && moduleIndex >= 0 && moduleIndex < lab.modules.length - 1
      ? lab.modules[moduleIndex + 1]
      : null;

  const labSolvedCount = useMemo(() => {
    if (!catalog) return 0;
    let n = 0;
    for (const l of catalog.labs) {
      for (const m of l.modules) {
        if (progress[moduleKey(l.id, m.id)]) n++;
      }
    }
    return n;
  }, [catalog, progress]);

  const labTotalCount = useMemo(
    () => catalog?.labs.reduce((acc, l) => acc + l.modules.length, 0) ?? 0,
    [catalog]
  );

  const companyWidgets = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const it of dsaItems.slice(0, 2000)) {
      for (const c of it.companies) counts[c] = (counts[c] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  }, [dsaItems]);

  const onLabChange = useCallback((id: string) => {
    setMode("labs");
    setSection("labs");
    setLabId(id);
    setView("list");
    setModuleId(null);
    setSearchQuery("");
  }, []);

  const onModeChange = useCallback((m: AppMode) => {
    setMode(m);
    setView("list");
    setSection(m === "dsa" ? "problems" : "labs");
    setSearchQuery("");
  }, []);

  const openModule = useCallback((mod: LabModule) => {
    setModuleId(mod.id);
    setView("solve");
    setMobilePane("read");
    setStreak(touchStreak());
  }, []);

  const openDsa = useCallback((id: string) => {
    setDsaId(id);
    setMode("dsa");
    setView("solve");
    setMobilePane("read");
    setStreak(touchStreak());
  }, []);

  const toggleComplete = useCallback(() => {
    if (!lab || !module) return;
    const key = moduleKey(lab.id, module.id);
    setProgress((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveProgress(next);
      return next;
    });
    setStreak(touchStreak());
  }, [lab, module]);

  if (error) {
    return (
      <div className="boot-error">
        <h1>Could not load laboratory content</h1>
        <p>{error}</p>
        <p>
          Run <code>npm run sync</code> then restart the dev server.
        </p>
      </div>
    );
  }

  if (!catalog || !lab) {
    return (
      <div className="boot-loading">
        <div className="boot-spinner" />
        <p>Loading laboratories…</p>
      </div>
    );
  }

  const completed = module ? !!progress[moduleKey(lab.id, module.id)] : false;
  const showRight = view === "list";
  const showRail = view === "list";

  return (
    <div className="app-shell lc-shell">
      <AppNav
        labs={catalog.labs}
        mode={mode}
        section={section}
        activeLabId={lab.id}
        streak={streak.count}
        onSection={(s) => {
          setSection(s);
          if (s === "problems" || s === "dsa") {
            setMode("dsa");
            setView("list");
          } else if (s === "labs") {
            setMode("labs");
            setView("list");
          } else if (s === "progress") {
            setView("list");
          }
        }}
        onLabChange={onLabChange}
        onModeChange={onModeChange}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />

      <div className={clsxBody(showRail, showRight)}>
        {showRail && (
          <LeftRail
            active={rail}
            onChange={(tab) => {
              setRail(tab);
              setView("list");
            }}
          />
        )}

        <div className="lc-main">
          {view === "list" && mode === "labs" && (
            <LabLibrary
              lab={lab}
              progress={progress}
              favorites={favorites}
              searchQuery={searchQuery}
              onOpenModule={openModule}
              onToggleFavorite={(id) => setFavorites(toggleFavorite(id))}
              onShuffle={() => {
                const pool = lab.modules;
                if (!pool.length) return;
                openModule(pool[Math.floor(Math.random() * pool.length)]);
              }}
            />
          )}

          {view === "list" && mode === "dsa" && (
            <DsaProblemsList
              items={dsaItems}
              topics={dsaTopics}
              companies={dsaCompanies}
              total={dsaTotal}
              solved={dsaSolved}
              favorites={favorites}
              searchQuery={searchQuery}
              onOpen={openDsa}
              onToggleFavorite={(id) => setFavorites(toggleFavorite(id))}
            />
          )}

          {view === "solve" && mode === "labs" && module && (
            <div className="lc-solve">
              <div className="lc-solve__bar">
                <button type="button" className="dsa-back" onClick={() => setView("list")}>
                  ← Problem List
                </button>
                <span className="lc-solve__title">
                  {String(module.order).padStart(2, "0")}. {module.title}
                </span>
                <div className="topbar__mobile-toggle">
                  <button
                    type="button"
                    className={`pane-tab ${mobilePane === "read" ? "is-active" : ""}`}
                    onClick={() => setMobilePane("read")}
                  >
                    Description
                  </button>
                  <button
                    type="button"
                    className={`pane-tab ${mobilePane === "code" ? "is-active" : ""}`}
                    onClick={() => setMobilePane("code")}
                  >
                    Code
                  </button>
                </div>
              </div>

              <div className="workspace__desktop lc-solve__panes">
                <SplitPane
                  storageKey="sde-main-split"
                  initialRatio={0.44}
                  minFirst={260}
                  minSecond={300}
                  first={
                    <Reader
                      module={module}
                      referencePath={null}
                      prevModule={prevModule}
                      nextModule={nextModule}
                      onPrev={
                        prevModule
                          ? () => setModuleId(prevModule.id)
                          : undefined
                      }
                      onNext={
                        nextModule
                          ? () => setModuleId(nextModule.id)
                          : undefined
                      }
                    />
                  }
                  second={
                    <CodeWorkbench
                      module={module}
                      defaultLanguage={lab.language}
                      onMarkComplete={toggleComplete}
                      completed={completed}
                    />
                  }
                />
              </div>

              <div className="workspace__mobile lc-solve__panes">
                {mobilePane === "read" ? (
                  <Reader
                    module={module}
                    referencePath={null}
                    prevModule={prevModule}
                    nextModule={nextModule}
                    onPrev={prevModule ? () => setModuleId(prevModule.id) : undefined}
                    onNext={nextModule ? () => setModuleId(nextModule.id) : undefined}
                  />
                ) : (
                  <CodeWorkbench
                    module={module}
                    defaultLanguage={lab.language}
                    onMarkComplete={toggleComplete}
                    completed={completed}
                  />
                )}
              </div>
            </div>
          )}

          {view === "solve" && mode === "dsa" && dsaId && (
            <DsaArena
              problemId={dsaId}
              items={dsaItems}
              onBack={() => setView("list")}
              onChangeProblem={setDsaId}
              onAccepted={(id) => setDsaSolved(markDsaSolved(id))}
              mobilePane={mobilePane}
              onMobilePane={setMobilePane}
            />
          )}
        </div>

        {showRight && (
          <RightPanel
            streak={streak}
            solvedLabs={labSolvedCount}
            totalLabs={labTotalCount}
            solvedDsa={Object.keys(dsaSolved).length}
            totalDsa={dsaTotal || 10000}
            companies={companyWidgets}
          />
        )}
      </div>
    </div>
  );
}

function clsxBody(rail: boolean, right: boolean) {
  return [
    "lc-body",
    rail ? "has-rail" : "no-rail",
    right ? "has-right" : "no-right",
  ].join(" ");
}
