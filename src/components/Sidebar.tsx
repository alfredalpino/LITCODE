import { CheckCircle2, Circle, ChevronDown, FileText, Search } from "lucide-react";
import { useMemo, useState } from "react";
import clsx from "clsx";
import type { Lab, LabModule } from "../types";
import { moduleKey, type ProgressMap } from "../lib/progress";
import { moduleStatus } from "../lib/module-status";
import { ContentStatusBadge } from "./ContentStatusBadge";

interface SidebarProps {
  lab: Lab;
  activeModuleId: string | null;
  activeRefId: string | null;
  progress: ProgressMap;
  onSelectModule: (mod: LabModule) => void;
  onSelectReference: (path: string, id: string) => void;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({
  lab,
  activeModuleId,
  activeRefId,
  progress,
  onSelectModule,
  onSelectReference,
  open,
  onClose,
}: SidebarProps) {
  const [query, setQuery] = useState("");
  const [refsOpen, setRefsOpen] = useState(true);
  const [readyOnly, setReadyOnly] = useState(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lab.modules.filter((m) => {
      if (readyOnly && moduleStatus(m) !== "ready") return false;
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.docs.some((d) => d.title.toLowerCase().includes(q))
      );
    });
  }, [lab.modules, query, readyOnly]);

  const readyCount = lab.modules.filter((m) => moduleStatus(m) === "ready").length;
  const doneCount = lab.modules.filter(
    (m) => moduleStatus(m) === "ready" && progress[moduleKey(lab.id, m.id)]
  ).length;

  return (
    <>
      <div
        className={clsx("sidebar-backdrop", open && "is-open")}
        onClick={onClose}
        aria-hidden
      />
      <aside className={clsx("sidebar", open && "is-open")} aria-label="Curriculum">
        <div className="sidebar__head">
          <div>
            <p className="sidebar__eyebrow">{lab.title}</p>
            <p className="sidebar__progress">
              {doneCount}/{readyCount} ready · {lab.stats.codeFiles} labs
            </p>
          </div>
        </div>

        <label className="sidebar__search">
          <Search size={14} />
          <input
            type="search"
            placeholder="Search modules…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <label className="lf-filter-check sidebar__ready-filter">
          <input
            type="checkbox"
            checked={readyOnly}
            onChange={(e) => setReadyOnly(e.target.checked)}
          />
          Ready only
        </label>

        <div className="sidebar__scroll">
          <ul className="module-list">
            {filtered.map((mod) => {
              const done = !!progress[moduleKey(lab.id, mod.id)];
              const st = moduleStatus(mod);
              return (
                <li key={mod.id}>
                  <button
                    type="button"
                    className={clsx(
                      "module-item",
                      activeModuleId === mod.id && !activeRefId && "is-active"
                    )}
                    onClick={() => {
                      onSelectModule(mod);
                      onClose();
                    }}
                  >
                    <span className="module-item__status" aria-hidden>
                      {done ? (
                        <CheckCircle2 size={14} className="is-done" />
                      ) : (
                        <Circle size={14} />
                      )}
                    </span>
                    <span className="module-item__order">
                      {String(mod.order).padStart(2, "0")}
                    </span>
                    <span className="module-item__title">{mod.title}</span>
                    <ContentStatusBadge status={st} compact />
                  </button>
                </li>
              );
            })}
          </ul>

          {lab.references.length > 0 && (
            <div className="sidebar__refs">
              <button
                type="button"
                className="sidebar__refs-toggle"
                onClick={() => setRefsOpen((v) => !v)}
              >
                <ChevronDown
                  size={14}
                  className={clsx("chev", refsOpen && "is-open")}
                />
                References
              </button>
              {refsOpen && (
                <ul className="ref-list">
                  {lab.references.map((ref) => (
                    <li key={ref.id}>
                      <button
                        type="button"
                        className={clsx(
                          "ref-item",
                          activeRefId === ref.id && "is-active"
                        )}
                        onClick={() => {
                          onSelectReference(ref.path, ref.id);
                          onClose();
                        }}
                      >
                        <FileText size={13} />
                        {ref.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
