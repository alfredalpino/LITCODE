import { CheckCircle2, Circle, ChevronDown, FileText, Search } from "lucide-react";
import { useMemo, useState } from "react";
import clsx from "clsx";
import type { Lab, LabModule } from "../types";
import { moduleKey, type ProgressMap } from "../lib/progress";

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lab.modules;
    return lab.modules.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.docs.some((d) => d.title.toLowerCase().includes(q))
    );
  }, [lab.modules, query]);

  const doneCount = lab.modules.filter(
    (m) => progress[moduleKey(lab.id, m.id)]
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
              {doneCount}/{lab.modules.length} modules · {lab.stats.codeFiles} labs
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

        <div className="sidebar__scroll">
          <ul className="module-list">
            {filtered.map((mod) => {
              const done = !!progress[moduleKey(lab.id, mod.id)];
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
                    <span className="module-item__meta">
                      {mod.codeFiles.length > 0
                        ? `${mod.codeFiles.length} files`
                        : "read"}
                    </span>
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
