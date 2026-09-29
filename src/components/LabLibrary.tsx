"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Code2,
  Play,
  Shuffle,
  Star,
} from "lucide-react";
import clsx from "clsx";
import type { Lab, LabModule } from "@/types";
import { moduleKey } from "@/lib/progress";
import { FeatureCards } from "./FeatureCards";

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

const LANG_BLURB: Record<string, string> = {
  javascript: "Runtime, language core, and browser mental models — learn by predicting then running.",
  python: "Pythonic DSA drills and language labs — predict, run, explain.",
  typescript: "Types erase at runtime. Build intuition for what the compiler knows vs what survives.",
};

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
  const [status, setStatus] = useState<"All" | "Todo" | "Solved">("All");

  const solved = lab.modules.filter((m) => progress[moduleKey(lab.id, m.id)]).length;
  const pct = lab.modules.length ? Math.round((solved / lab.modules.length) * 100) : 0;

  const nextModule =
    lab.modules.find((m) => !progress[moduleKey(lab.id, m.id)]) || lab.modules[0];

  const rows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return lab.modules
      .map((m) => {
        const done = !!progress[moduleKey(lab.id, m.id)];
        const d = difficultyFor(m.order, lab.modules.length);
        return { m, done, d };
      })
      .filter(({ m, done, d }) => {
        const favId = `${lab.id}:${m.id}`;
        if (favoritesOnly && !favorites.includes(favId)) return false;
        if (diff !== "All" && d !== diff) return false;
        if (status === "Todo" && done) return false;
        if (status === "Solved" && !done) return false;
        if (!q) return true;
        return (
          m.title.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          String(m.order).includes(q)
        );
      });
  }, [lab, progress, searchQuery, diff, status, favoritesOnly, favorites]);

  return (
    <div className="lc-feed lc-labs">
      <header className="lc-labs__hero">
        <div className="lc-labs__hero-copy">
          <p className="lc-labs__eyebrow">Learn by doing</p>
          <h1>{lab.title}</h1>
          <p>{LANG_BLURB[lab.id] ?? "Laboratory curriculum — learn by predicting, then running."}</p>
          <div className="lc-labs__hero-actions">
            <button
              type="button"
              className="run-btn"
              disabled={!nextModule}
              onClick={() => nextModule && onOpenModule(nextModule)}
            >
              <Play size={14} />
              {solved === 0 ? "Start first module" : "Continue learning"}
            </button>
            <button type="button" className="lc-link" onClick={onShuffle}>
              <Shuffle size={14} /> Shuffle module
            </button>
          </div>
        </div>
        <div className="lc-labs__ring" aria-label={`${pct}% complete`}>
          <svg viewBox="0 0 84 84">
            <circle cx="42" cy="42" r="34" className="lc-labs__ring-bg" />
            <circle
              cx="42"
              cy="42"
              r="34"
              className="lc-labs__ring-fg"
              style={{
                strokeDasharray: `${2 * Math.PI * 34}`,
                strokeDashoffset: `${2 * Math.PI * 34 * (1 - pct / 100)}`,
              }}
            />
          </svg>
          <div className="lc-labs__ring-label">
            <strong>{pct}%</strong>
            <span>
              {solved}/{lab.modules.length}
            </span>
          </div>
        </div>
      </header>

      <div className="lc-lab-switch">
        {labs.map((l) => {
          const done = l.modules.filter((m) => progress[moduleKey(l.id, m.id)]).length;
          return (
            <button
              key={l.id}
              type="button"
              className={clsx("lc-lab-switch__btn", lab.id === l.id && "is-active")}
              onClick={() => onLabChange(l.id)}
            >
              <Code2 size={14} />
              {l.short}
              <em>
                {done}/{l.modules.length}
              </em>
            </button>
          );
        })}
      </div>

      <FeatureCards
        cards={[
          {
            id: "lab",
            title: lab.title,
            subtitle: `${lab.modules.length} modules · Learn → Predict → Code → Explain`,
            tone: "blue",
            icon: "lab",
            active: true,
            cta: "Open first module",
            onClick: () => lab.modules[0] && onOpenModule(lab.modules[0]),
          },
          {
            id: "run",
            title: `${lab.stats.codeFiles} runnable labs`,
            subtitle: "Continue at your next incomplete module",
            tone: "amber",
            icon: "run",
            cta: "Resume",
            onClick: () => nextModule && onOpenModule(nextModule),
          },
          {
            id: "refs",
            title: `${lab.references.length} references`,
            subtitle: "Shuffle a practice module from this lab",
            tone: "teal",
            icon: "refs",
            cta: "Random",
            onClick: () => onShuffle?.(),
          },
        ]}
      />

      <div className="lc-toolbar">
        <div className="lc-toolbar__hint">
          <BookOpen size={14} /> {rows.length} modules in {lab.short}
        </div>
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
      </div>

      <div className="lc-lab-grid">
        {rows.map(({ m, done, d }) => {
          const favId = `${lab.id}:${m.id}`;
          return (
            <article
              key={m.id}
              className={clsx("lc-lab-card", done && "is-done")}
              onClick={() => onOpenModule(m)}
            >
              <div className="lc-lab-card__top">
                <span className={clsx("lc-lab-card__status", done ? "is-done" : "is-todo")}>
                  {done ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                </span>
                <span className={clsx("col-diff", `is-${d.toLowerCase()}`)}>{d}</span>
                <button
                  type="button"
                  className={clsx("fav-btn", favorites.includes(favId) && "is-on")}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(favId);
                  }}
                >
                  <Star size={14} />
                </button>
              </div>
              <h3>
                <span>{String(m.order).padStart(2, "0")}</span> {m.title}
              </h3>
              <p>
                {m.docs.length} docs · {m.codeFiles?.length ?? 0} code files
              </p>
              <footer>
                <span>Open lab</span>
                <Play size={13} />
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}
