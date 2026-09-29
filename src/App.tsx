import { useCallback, useEffect, useMemo, useState } from "react";
import { AppNav, type NavSection, type NotifItem } from "./components/AppNav";
import { LeftRail, type RailTab } from "./components/LeftRail";
import { RightPanel } from "./components/RightPanel";
import { LabLibrary } from "./components/LabLibrary";
import { DsaProblemsList } from "./components/DsaProblemsList";
import { ContestView, InterviewView } from "./components/SectionViews";
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

const SETTINGS_KEY = "sde-lab-settings-v1";
const NOTIF_KEY = "sde-lab-notifs-v1";

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw) as { theme: "vs-dark" | "light"; fontSize: number };
  } catch {
    /* ignore */
  }
  return { theme: "vs-dark" as const, fontSize: 13 };
}

function loadNotifs(): NotifItem[] {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    if (raw) return JSON.parse(raw) as NotifItem[];
  } catch {
    /* ignore */
  }
  return [
    {
      id: "welcome",
      title: "Welcome to SDE Lab",
      body: "Problems, Labs, Contest, and Interview are live. Mark modules complete to fill progress.",
      ts: Date.now(),
      read: false,
    },
  ];
}

export default function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<AppMode>("dsa");
  const [section, setSection] = useState<NavSection>("problems");
  const [rail, setRail] = useState<RailTab>("explore");
  const [view, setView] = useState<WorkspaceView>("list");
  const [labId, setLabId] = useState("javascript");
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [dsaId, setDsaId] = useState<string | null>(null);
  const [dsaItems, setDsaItems] = useState<DsaIndexItem[]>([]);
  const [dsaTopics, setDsaTopics] = useState<string[]>([]);
  const [dsaCompanies, setDsaCompanies] = useState<string[]>([]);
  const [dsaTotal, setDsaTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const [contestDiff, setContestDiff] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [mobilePane, setMobilePane] = useState<MobilePane>("read");
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());
  const [dsaSolved, setDsaSolved] = useState(() => loadDsaSolved());
  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [streak, setStreak] = useState<StreakState>(() => loadStreak());
  const [settings, setSettings] = useState(loadSettings);
  const [notifications, setNotifications] = useState<NotifItem[]>(loadNotifs);

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
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    document.documentElement.style.setProperty("--editor-font-size", `${settings.fontSize}px`);
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        document.querySelector<HTMLButtonElement>(".run-btn")?.click();
      }
      if (e.key === "Escape" && view === "solve") setView("list");
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
    for (const it of dsaItems) {
      for (const c of it.companies) counts[c] = (counts[c] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  }, [dsaItems]);

  const hardProblems = useMemo(
    () => dsaItems.filter((i) => i.difficulty === "Hard"),
    [dsaItems]
  );

  const pushNotif = useCallback((title: string, body: string) => {
    setNotifications((prev) => [
      { id: `${Date.now()}`, title, body, ts: Date.now(), read: false },
      ...prev,
    ].slice(0, 30));
  }, []);

  const goSection = useCallback((s: NavSection) => {
    setSection(s);
    setView("list");
    setSearchQuery("");
    if (s === "problems") {
      setMode("dsa");
      setRail("explore");
      setCompanyFilter(null);
      setContestDiff("All");
    } else if (s === "labs") {
      setMode("labs");
      setRail("library");
    } else if (s === "contest") {
      setMode("dsa");
      setRail("explore");
      setContestDiff("Hard");
    } else if (s === "interview") {
      setMode("dsa");
      setRail("study");
    }
  }, []);

  const goRail = useCallback((tab: RailTab) => {
    setRail(tab);
    setView("list");
    if (tab === "library") {
      setSection("labs");
      setMode("labs");
    } else if (tab === "explore") {
      setSection("problems");
      setMode("dsa");
      setCompanyFilter(null);
      setContestDiff("All");
    } else if (tab === "study") {
      setSection("interview");
      setMode("dsa");
    } else if (tab === "lists") {
      setSection("problems");
      setMode("dsa");
    }
  }, []);

  const openModule = useCallback((mod: LabModule) => {
    setModuleId(mod.id);
    setMode("labs");
    setSection("labs");
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
    pushNotif("Module updated", `${module.title} progress saved.`);
  }, [lab, module, pushNotif]);

  if (error) {
    return (
      <div className="boot-error">
        <h1>Could not load laboratory content</h1>
        <p>{error}</p>
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

  const listKind: "labs" | "problems" | "contest" | "interview" | "favorites" =
    rail === "lists"
      ? "favorites"
      : section === "interview" || rail === "study"
        ? "interview"
        : section === "contest"
          ? "contest"
          : section === "labs" || rail === "library"
            ? "labs"
            : "problems";

  return (
    <div className="app-shell lc-shell">
      <AppNav
        section={section}
        streak={streak.count}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onSection={goSection}
        notifications={notifications}
        onMarkNotificationsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onClearNotifications={() => setNotifications([])}
        editorTheme={settings.theme}
        onEditorTheme={(theme) => setSettings((s) => ({ ...s, theme }))}
        fontSize={settings.fontSize}
        onFontSize={(fontSize) => setSettings((s) => ({ ...s, fontSize }))}
      />

      <div className={clsxBody(showRail, showRight)}>
        {showRail && (
          <LeftRail
            active={rail}
            favoritesCount={favorites.length}
            onChange={goRail}
          />
        )}

        <div className="lc-main">
          {view === "list" && listKind === "labs" && (
            <LabLibrary
              labs={catalog.labs}
              lab={lab}
              progress={progress}
              favorites={favorites}
              searchQuery={searchQuery}
              onLabChange={(id) => {
                setLabId(id);
                setMode("labs");
                setSection("labs");
                setRail("library");
              }}
              onOpenModule={openModule}
              onToggleFavorite={(id) => setFavorites(toggleFavorite(id))}
              onShuffle={() => {
                const pool = lab.modules;
                if (!pool.length) return;
                openModule(pool[Math.floor(Math.random() * pool.length)]);
              }}
            />
          )}

          {view === "list" && (listKind === "problems" || listKind === "favorites") && (
            <DsaProblemsList
              items={dsaItems}
              topics={dsaTopics}
              companies={dsaCompanies}
              total={dsaTotal}
              solved={dsaSolved}
              favorites={favorites}
              searchQuery={searchQuery}
              companyFilter={companyFilter}
              favoritesOnly={listKind === "favorites"}
              difficultyPreset={contestDiff}
              title={
                listKind === "favorites"
                  ? "My Lists · Favorites"
                  : companyFilter
                    ? `${companyFilter} interview pack`
                    : "Problems"
              }
              subtitle={
                listKind === "favorites"
                  ? `${favorites.filter((f) => !f.includes(":")).length || favorites.length} saved DSA items`
                  : companyFilter
                    ? `Filtered to ${companyFilter}`
                    : undefined
              }
              onOpen={openDsa}
              onToggleFavorite={(id) => setFavorites(toggleFavorite(id))}
              onCompanyFilter={setCompanyFilter}
            />
          )}

          {view === "list" && listKind === "contest" && (
            <ContestView
              hardProblems={hardProblems}
              onOpen={openDsa}
              onStartWeekly={() => {
                setContestDiff("Hard");
                setCompanyFilter(null);
                pushNotif("Contest started", "Hard difficulty filter applied. Good luck.");
                const pick = hardProblems[Math.floor(Math.random() * Math.min(hardProblems.length, 40))];
                if (pick) openDsa(pick.id);
              }}
            />
          )}

          {view === "list" && listKind === "interview" && (
            <InterviewView
              labs={catalog.labs}
              solvedLabs={labSolvedCount}
              totalLabs={labTotalCount}
              solvedDsa={Object.keys(dsaSolved).length}
              totalDsa={dsaTotal}
              streak={streak.count}
              companies={dsaCompanies}
              onOpenLabs={() => goSection("labs")}
              onOpenCompanyPack={(c) => {
                setCompanyFilter(c);
                setSection("problems");
                setRail("explore");
                setMode("dsa");
                setContestDiff("All");
                pushNotif("Company pack", `Filtered Problems to ${c}.`);
              }}
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
                      onPrev={prevModule ? () => setModuleId(prevModule.id) : undefined}
                      onNext={nextModule ? () => setModuleId(nextModule.id) : undefined}
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
              onAccepted={(id) => {
                setDsaSolved(markDsaSolved(id));
                pushNotif("Accepted", `Problem ${id} marked solved.`);
              }}
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
            activeCompany={companyFilter}
            onCompany={(name) => {
              setCompanyFilter(name);
              setSection("problems");
              setRail("explore");
              setMode("dsa");
              setContestDiff("All");
              setView("list");
            }}
            onOpenProgress={() => goSection("interview")}
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
