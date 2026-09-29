import { useCallback, useEffect, useMemo, useState } from "react";
import { TopBar } from "./components/TopBar";
import { Sidebar } from "./components/Sidebar";
import { Reader } from "./components/Reader";
import { CodeWorkbench } from "./components/CodeWorkbench";
import { SplitPane } from "./components/SplitPane";
import { DsaArena } from "./components/DsaArena";
import { loadCatalog } from "./lib/content";
import {
  loadProgress,
  moduleKey,
  saveProgress,
  type ProgressMap,
} from "./lib/progress";
import type { AppMode, Catalog, Lab, LabModule, MobilePane } from "./types";
import "./App.css";

export default function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<AppMode>("labs");
  const [labId, setLabId] = useState<string>("javascript");
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [refId, setRefId] = useState<string | null>(null);
  const [refPath, setRefPath] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobilePane, setMobilePane] = useState<MobilePane>("read");
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());

  useEffect(() => {
    loadCatalog()
      .then((c) => {
        setCatalog(c);
        const first = c.labs[0];
        if (first) {
          setLabId(first.id);
          const firstMod = first.modules[0];
          if (firstMod) setModuleId(firstMod.id);
        }
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const apply = () => {
      if (mq.matches) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        document.querySelector<HTMLButtonElement>(".run-btn")?.click();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setSidebarOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const lab: Lab | undefined = useMemo(
    () => catalog?.labs.find((l) => l.id === labId),
    [catalog, labId]
  );

  const moduleIndex = useMemo(() => {
    if (!lab || !moduleId) return -1;
    return lab.modules.findIndex((m) => m.id === moduleId);
  }, [lab, moduleId]);

  const module: LabModule | null = useMemo(() => {
    if (!lab || moduleIndex < 0 || refId) return null;
    return lab.modules[moduleIndex] ?? null;
  }, [lab, moduleIndex, refId]);

  const prevModule = lab && moduleIndex > 0 ? lab.modules[moduleIndex - 1] : null;
  const nextModule =
    lab && moduleIndex >= 0 && moduleIndex < lab.modules.length - 1
      ? lab.modules[moduleIndex + 1]
      : null;

  const onLabChange = useCallback(
    (id: string) => {
      setMode("labs");
      setLabId(id);
      setRefId(null);
      setRefPath(null);
      const next = catalog?.labs.find((l) => l.id === id);
      setModuleId(next?.modules[0]?.id ?? null);
    },
    [catalog]
  );

  const toggleComplete = useCallback(() => {
    if (!lab || !module) return;
    const key = moduleKey(lab.id, module.id);
    setProgress((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveProgress(next);
      return next;
    });
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

  return (
    <div className="app-shell">
      <TopBar
        labs={catalog.labs}
        activeLabId={lab.id}
        onLabChange={onLabChange}
        mode={mode}
        onModeChange={setMode}
        mobilePane={mobilePane}
        onMobilePane={setMobilePane}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        moduleTitle={mode === "dsa" ? "DSA Arena" : module?.title}
      />

      {mode === "dsa" ? (
        <div className="app-body app-body--dsa">
          <DsaArena />
        </div>
      ) : (
        <div className="app-body">
          <Sidebar
            lab={lab}
            activeModuleId={moduleId}
            activeRefId={refId}
            progress={progress}
            open={sidebarOpen}
            onClose={() => {
              if (window.matchMedia("(max-width: 900px)").matches) {
                setSidebarOpen(false);
              }
            }}
            onSelectModule={(mod) => {
              setModuleId(mod.id);
              setRefId(null);
              setRefPath(null);
              setMobilePane("read");
            }}
            onSelectReference={(path, id) => {
              setRefPath(path);
              setRefId(id);
              setModuleId(null);
              setMobilePane("read");
            }}
          />

          <main
            className={`workspace workspace--${mobilePane}`}
            data-sidebar={sidebarOpen ? "open" : "closed"}
          >
            <div className="workspace__desktop">
              <SplitPane
                storageKey="sde-main-split"
                initialRatio={0.44}
                minFirst={260}
                minSecond={300}
                first={
                  <Reader
                    module={module}
                    referencePath={refPath}
                    referenceTitle={
                      lab.references.find((r) => r.id === refId)?.title
                    }
                    prevModule={prevModule}
                    nextModule={nextModule}
                    onPrev={
                      prevModule
                        ? () => {
                            setModuleId(prevModule.id);
                            setRefId(null);
                            setRefPath(null);
                          }
                        : undefined
                    }
                    onNext={
                      nextModule
                        ? () => {
                            setModuleId(nextModule.id);
                            setRefId(null);
                            setRefPath(null);
                          }
                        : undefined
                    }
                  />
                }
                second={
                  <CodeWorkbench
                    module={module}
                    defaultLanguage={lab.language}
                    onMarkComplete={module ? toggleComplete : undefined}
                    completed={completed}
                  />
                }
              />
            </div>

            <div className="workspace__mobile">
              {mobilePane === "read" ? (
                <Reader
                  module={module}
                  referencePath={refPath}
                  referenceTitle={
                    lab.references.find((r) => r.id === refId)?.title
                  }
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
              ) : (
                <CodeWorkbench
                  module={module}
                  defaultLanguage={lab.language}
                  onMarkComplete={module ? toggleComplete : undefined}
                  completed={completed}
                />
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
