import { useMemo, useState } from "react";
import { CheckCircle2, Circle, Shuffle, Star } from "lucide-react";
import clsx from "clsx";
import type { Lab, LabModule } from "../types";
import { acceptanceRate } from "../lib/stats";
import { moduleKey } from "../lib/progress";

interface LabLibraryProps {
  labs: Lab[];
  lab: Lab;
  progress: Record<string, boolean>;
  favorites: string[];
  searchQuery: string;
  favoritesOnly?: boolean;
  onLabChange: (id: string) => void;
  onOpenModule: (mod: LabModule) => void;
  onToggleFavorite: (id: string) => void;
  onShuffle?: () => void;
}

function difficultyFor(order: number, total: number): "Easy" | "Medium" | "Hard" {
  const t = order / Math.max(total, 1);
  if (t < 0.35) return "Easy";
  if (t < 0.7) return "Medium";
  return "Hard";
}

export function LabLibrary({
  labs,
  lab,
  progress,
  favorites,
  searchQuery,
  favoritesOnly = false,
  onLabChange,
  onOpenModule,
  onToggleFavorite,
  onShuffle,
}: LabLibraryProps) {
  const [diff, setDiff] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [topic, setTopic] = useState("All");
  const [status, setStatus] = useState<"All" | "Todo" | "Solved">("All");

  const topicCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of lab.modules) {
      const t = m.title.split(" ")[0] ?? "Other";
      map[t] = (map[t] ?? 0) + 1;
    }
    return map;
  }, [lab.modules]);

  const rows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return lab.modules
      .map((m) => {
        const done = !!progress[moduleKey(lab.id, m.id)];
        const d = difficultyFor(m.order, lab.modules.length);
        return { m, done, d, acc: acceptanceRate(m.id) };
      })
      .filter(({ m, done, d }) => {
        const favId = `${lab.id}:${m.id}`;
        if (favoritesOnly && !favorites.includes(favId)) return false;
        if (diff !== "All" && d !== diff) return false;
        if (status === "Todo" && done) return false;
        if (status === "Solved" && !done) return false;
        if (topic !== "All") {
          const first = m.title.split(" ")[0];
          if (first !== topic) return false;
        }
        if (!q) return true;
        return (
          m.title.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          String(m.order).includes(q)
        );
      });
  }, [lab, progress, searchQuery, diff, topic, status, favoritesOnly, favorites]);

  const solved = lab.modules.filter((m) => progress[moduleKey(lab.id, m.id)]).length;

  return (
    <div className="lc-feed">
      <div className="lc-lab-switch">
        {labs.map((l) => (
          <button
            key={l.id}
            type="button"
            className={clsx("lc-lab-switch__btn", lab.id === l.id && "is-active")}
            onClick={() => onLabChange(l.id)}
          >
            {l.short}
            <em>{l.modules.length}</em>
          </button>
        ))}
      </div>

      {favoritesOnly && (
        <p className="lc-banner-note">Showing favorites for {lab.title}. Switch labs above to see more.</p>
      )}

      <div className="lc-banners">
        <div className="lc-banner lc-banner--a">
          <strong>{lab.title}</strong>
          <span>Learn → Predict → Code → Explain</span>
        </div>
        <div className="lc-banner lc-banner--b">
          <strong>{lab.stats.codeFiles} runnable labs</strong>
          <span>Browser sandbox ready</span>
        </div>
        <div className="lc-banner lc-banner--c">
          <strong>{lab.references.length} references</strong>
          <span>Facts, glossary, playbooks</span>
        </div>
      </div>

      <div className="lc-topics">
        {Object.entries(topicCounts)
          .slice(0, 12)
          .map(([name, count]) => (
            <button
              key={name}
              type="button"
              className={clsx("lc-topic", topic === name && "is-active")}
              onClick={() => setTopic(topic === name ? "All" : name)}
            >
              {name} <em>{count}</em>
            </button>
          ))}
      </div>

      <div className="lc-subcats">
        {["All Topics", "Language", "Runtime", "Interview", "Projects"].map((label, i) => (
          <button
            key={label}
            type="button"
            className={clsx("lc-subcat", i === 0 && topic === "All" && "is-active")}
            onClick={() => setTopic("All")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="lc-toolbar">
        <div className="lc-toolbar__hint">Use the top search to filter · {rows.length} shown</div>
        <select value={diff} onChange={(e) => setDiff(e.target.value as typeof diff)}>
          <option value="All">Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          <option value="All">Status</option>
          <option value="Todo">Todo</option>
          <option value="Solved">Solved</option>
        </select>
        <div className="lc-toolbar__solved">
          {solved}/{lab.modules.length} Solved
          <button type="button" className="lc-icon-btn" onClick={onShuffle} aria-label="Shuffle">
            <Shuffle size={14} />
          </button>
        </div>
      </div>

      <div className="lc-table-wrap">
        <table className="lc-table">
          <thead>
            <tr>
              <th className="col-status" />
              <th className="col-title">Title</th>
              <th className="col-acc">Acceptance</th>
              <th className="col-diff">Difficulty</th>
              <th className="col-fav" />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ m, done, d, acc }) => {
              const favId = `${lab.id}:${m.id}`;
              return (
                <tr key={m.id} onClick={() => onOpenModule(m)}>
                  <td className="col-status">
                    {done ? (
                      <CheckCircle2 size={16} className="is-solved" />
                    ) : (
                      <Circle size={16} className="is-todo" />
                    )}
                  </td>
                  <td className="col-title">
                    <span className="lc-table__num">{String(m.order).padStart(2, "0")}.</span>{" "}
                    {m.title}
                    {m.codeFiles.length > 0 && (
                      <span className="lc-table__meta">{m.codeFiles.length} files</span>
                    )}
                  </td>
                  <td className="col-acc">{acc}%</td>
                  <td className={clsx("col-diff", `is-${d.toLowerCase()}`)}>{d}</td>
                  <td className="col-fav">
                    <button
                      type="button"
                      className={clsx("fav-btn", favorites.includes(favId) && "is-on")}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(favId);
                      }}
                      aria-label="Favorite"
                    >
                      <Star size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <p className="lc-empty">No modules match your filters.</p>}
      </div>
    </div>
  );
}
