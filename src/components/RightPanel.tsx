import { useMemo } from "react";
import { Flame } from "lucide-react";
import clsx from "clsx";
import type { StreakState } from "../lib/stats";

interface RightPanelProps {
  streak: StreakState;
  solvedLabs: number;
  totalLabs: number;
  solvedDsa: number;
  totalDsa: number;
  companies: Array<{ name: string; count: number }>;
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

export function RightPanel({
  streak,
  solvedLabs,
  totalLabs,
  solvedDsa,
  totalDsa,
  companies,
  visible = true,
}: RightPanelProps) {
  const cells = useMemo(() => monthGrid(streak.history ?? []), [streak.history]);
  if (!visible) return null;

  const monthLabel = new Date().toLocaleString("en", { month: "long", year: "numeric" });

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

      <section className="lc-card">
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
      </section>

      <section className="lc-card">
        <h3>Trending Companies</h3>
        <div className="lc-companies">
          {companies.map((c) => (
            <button key={c.name} type="button" className="lc-company">
              {c.name}
              <span>{c.count}</span>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}
