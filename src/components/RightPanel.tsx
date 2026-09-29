"use client";

import { useMemo, useState } from "react";
import { Flame, Search, TrendingUp } from "lucide-react";
import clsx from "clsx";
import type { StreakState } from "../lib/stats";
import type { CompanyPackMeta } from "../lib/dsa/types";

type CompanyWindow = "thirty" | "threeMonths" | "all";

interface RightPanelProps {
  streak: StreakState;
  solvedLabs: number;
  totalLabs: number;
  solvedDsa: number;
  totalDsa: number;
  companies: CompanyPackMeta[];
  activeCompany: string | null;
  onCompany: (name: string | null) => void;
  onOpenProgress: () => void;
  sourceNote?: string;
  visible?: boolean;
}

function monthGrid(history: string[]) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const set = new Set(history);
  const cells: Array<{ day: number | null; active: boolean; isToday: boolean }> = [];
  for (let i = 0; i < startPad; i++) cells.push({ day: null, active: false, isToday: false });
  const today = now.getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, active: set.has(key), isToday: d === today });
  }
  return cells;
}

function windowCount(c: CompanyPackMeta, w: CompanyWindow) {
  if (w === "thirty") return c.thirty || 0;
  if (w === "threeMonths") return c.threeMonths || 0;
  return c.all || c.count || 0;
}

export function RightPanel({
  streak,
  solvedLabs,
  totalLabs,
  solvedDsa,
  totalDsa,
  companies,
  activeCompany,
  onCompany,
  onOpenProgress,
  sourceNote,
  visible = true,
}: RightPanelProps) {
  const cells = useMemo(() => monthGrid(streak.history ?? []), [streak.history]);
  const [window, setWindow] = useState<CompanyWindow>("threeMonths");
  const [browse, setBrowse] = useState("");
  const [showAll, setShowAll] = useState(false);

  if (!visible) return null;

  const monthLabel = new Date().toLocaleString("en", { month: "long", year: "numeric" });

  const ranked = useMemo(() => {
    return [...companies]
      .map((c) => ({ ...c, rankCount: windowCount(c, window) }))
      .filter((c) => c.rankCount > 0)
      .sort((a, b) => b.rankCount - a.rankCount || a.name.localeCompare(b.name));
  }, [companies, window]);

  const trending = ranked.slice(0, 10);
  const q = browse.trim().toLowerCase();
  const browsed = showAll
    ? ranked.filter((c) => !q || c.name.toLowerCase().includes(q)).slice(0, 80)
    : trending;

  return (
    <aside className="lc-right" aria-label="Progress">
      <section className="lc-card">
        <div className="lc-card__head">
          <h3>{monthLabel}</h3>
          <div className="lc-card__streak">
            <Flame size={14} />
            {streak.count} day streak
          </div>
        </div>
        <div className="lc-cal">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <span key={d} className="lc-cal__dow">
              {d}
            </span>
          ))}
          {cells.map((c, i) => (
            <span
              key={i}
              className={clsx(
                "lc-cal__day",
                c.day && "has-day",
                c.active && "is-active",
                c.isToday && "is-today"
              )}
            >
              {c.day ?? ""}
            </span>
          ))}
        </div>
      </section>

      <section className="lc-card lc-card--clickable" onClick={onOpenProgress}>
        <h3>Progress</h3>
        <div className="lc-progress-row">
          <span>Lab modules</span>
          <strong>
            {solvedLabs}/{totalLabs}
          </strong>
        </div>
        <div className="lc-progress-bar">
          <i style={{ width: `${totalLabs ? (solvedLabs / totalLabs) * 100 : 0}%` }} />
        </div>
        <div className="lc-progress-row">
          <span>DSA solved</span>
          <strong>
            {solvedDsa}/{totalDsa.toLocaleString()}
          </strong>
        </div>
        <div className="lc-progress-bar lc-progress-bar--dsa">
          <i
            style={{
              width: `${totalDsa ? Math.min(100, (solvedDsa / Math.max(totalDsa, 1)) * 100) : 0}%`,
            }}
          />
        </div>
        <p className="lc-card__hint">Click for interview dashboard</p>
      </section>

      <section className="lc-card">
        <div className="lc-card__head">
          <h3>
            <TrendingUp size={14} /> Trending Companies
          </h3>
          {activeCompany && (
            <button type="button" className="lc-link" onClick={() => onCompany(null)}>
              Clear
            </button>
          )}
        </div>
        <p className="lc-card__hint" style={{ marginTop: -4 }}>
          Student-reported interview frequency windows
        </p>

        <div className="lc-window-tabs">
          {(
            [
              ["thirty", "30d"],
              ["threeMonths", "3mo"],
              ["all", "All"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={clsx("lc-window-tab", window === id && "is-active")}
              onClick={() => setWindow(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="lc-companies lc-companies--ranked">
          {browsed.map((c, idx) => {
            const max = ranked[0]?.rankCount || 1;
            const width = Math.max(8, Math.round((c.rankCount / max) * 100));
            return (
              <button
                key={c.name}
                type="button"
                className={clsx("lc-company", "lc-company--row", activeCompany === c.name && "is-active")}
                onClick={() => onCompany(activeCompany === c.name ? null : c.name)}
                title={`${c.name} · ${c.rankCount} problems in this window`}
              >
                <em className="lc-company__rank">{idx + 1}</em>
                <span className="lc-company__name">{c.name}</span>
                <i className="lc-company__bar" style={{ width: `${width}%` }} />
                <span className="lc-company__count">{c.rankCount}</span>
              </button>
            );
          })}
        </div>

        <div className="lc-company-tools">
          <button type="button" className="lc-link" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Show top 10" : `Browse all ${companies.length}`}
          </button>
          {showAll && (
            <label className="lc-company-search">
              <Search size={12} />
              <input
                value={browse}
                onChange={(e) => setBrowse(e.target.value)}
                placeholder="Filter companies…"
              />
            </label>
          )}
        </div>
        {sourceNote && <p className="lc-card__hint">{sourceNote}</p>}
      </section>
    </aside>
  );
}
