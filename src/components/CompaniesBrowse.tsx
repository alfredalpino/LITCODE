"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Search,
  TrendingUp,
} from "lucide-react";
import clsx from "clsx";
import type { CompanyPackMeta } from "../lib/dsa/types";

export type CompanyWindow = "thirty" | "threeMonths" | "all";

function windowCount(c: CompanyPackMeta, w: CompanyWindow) {
  if (w === "thirty") return c.thirty || 0;
  if (w === "threeMonths") return c.threeMonths || 0;
  return c.all || c.count || 0;
}

const WINDOW_LABEL: Record<CompanyWindow, string> = {
  thirty: "Last 30 days",
  threeMonths: "Last 3 months",
  all: "All time",
};

interface CompaniesBrowseProps {
  companies: CompanyPackMeta[];
  activeCompany: string | null;
  onCompany: (name: string | null) => void;
  onBack: () => void;
  totalProblems: number;
}

export function CompaniesBrowse({
  companies,
  activeCompany,
  onCompany,
  onBack,
  totalProblems,
}: CompaniesBrowseProps) {
  const [window, setWindow] = useState<CompanyWindow>("threeMonths");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"rank" | "alpha">("rank");

  const ranked = useMemo(() => {
    const rows = companies.map((c) => ({
      ...c,
      rankCount: windowCount(c, window),
    }));
    if (sort === "alpha") {
      return rows.sort((a, b) => a.name.localeCompare(b.name));
    }
    return rows.sort(
      (a, b) => b.rankCount - a.rankCount || a.name.localeCompare(b.name)
    );
  }, [companies, window, sort]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      q
        ? ranked.filter((c) => c.name.toLowerCase().includes(q))
        : ranked,
    [ranked, q]
  );

  const max = ranked[0]?.rankCount || 1;
  const letterIndex = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((c, i) => {
      const letter = c.name.charAt(0).toUpperCase();
      if (!map.has(letter)) map.set(letter, i);
    });
    return map;
  }, [filtered]);

  return (
    <div className="lc-feed lf-companies-page">
      <header className="lf-companies-page__hero">
        <button type="button" className="lf-companies-page__back" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to Problems
        </button>
        <div className="lf-companies-page__hero-row">
          <div>
            <p className="lc-labs__eyebrow">
              <Building2 size={14} /> Company packs
            </p>
            <h1>Browse companies</h1>
            <p className="lc-muted">
              {companies.length} companies · student-reported interview tags across{" "}
              {totalProblems.toLocaleString()} problems. Pick a pack to filter Problems.
            </p>
          </div>
          <div className="lf-companies-page__stat">
            <TrendingUp size={18} />
            <div>
              <strong>{filtered.length}</strong>
              <span>
                {q ? "matching" : "companies"} · {WINDOW_LABEL[window]}
              </span>
            </div>
          </div>
        </div>

        <div className="lf-companies-page__controls">
          <div className="lc-window-tabs" role="tablist" aria-label="Frequency window">
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
                role="tab"
                aria-selected={window === id}
                className={clsx("lc-window-tab", window === id && "is-active")}
                onClick={() => setWindow(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <label className="lf-companies-page__search">
            <Search size={15} aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies…"
              aria-label="Search companies"
            />
            {query ? (
              <button
                type="button"
                className="lf-companies-page__clear"
                onClick={() => setQuery("")}
              >
                Clear
              </button>
            ) : null}
          </label>

          <select
            className="lf-companies-page__sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as "rank" | "alpha")}
            aria-label="Sort companies"
          >
            <option value="rank">Sort by frequency</option>
            <option value="alpha">Sort A–Z</option>
          </select>
        </div>

        {sort === "alpha" && letterIndex.size > 0 && (
          <nav className="lf-companies-page__letters" aria-label="Jump to letter">
            {[..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((letter) => {
              const has = letterIndex.has(letter);
              return (
                <button
                  key={letter}
                  type="button"
                  disabled={!has}
                  onClick={() => {
                    const el = document.getElementById(`company-letter-${letter}`);
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  {letter}
                </button>
              );
            })}
          </nav>
        )}
      </header>

      {activeCompany && (
        <div className="lf-companies-page__active" role="status">
          Filtering Problems by <strong>{activeCompany}</strong>
          <button type="button" className="lc-link" onClick={() => onCompany(null)}>
            Clear filter
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="lf-empty-state">
          <Building2 size={28} />
          <h2>No companies match</h2>
          <p>Try another search or switch the frequency window.</p>
        </div>
      ) : (
        <ul className="lf-companies-grid">
          {filtered.map((c, idx) => {
            const letter = c.name.charAt(0).toUpperCase();
            const isLetterStart =
              sort === "alpha" && letterIndex.get(letter) === idx;
            const width = Math.max(6, Math.round((c.rankCount / max) * 100));
            const active = activeCompany === c.name;
            return (
              <li
                key={c.name}
                id={isLetterStart ? `company-letter-${letter}` : undefined}
              >
                <button
                  type="button"
                  className={clsx("lf-company-card", active && "is-active")}
                  onClick={() => onCompany(active ? null : c.name)}
                >
                  <span className="lf-company-card__rank" aria-hidden>
                    {sort === "rank" ? idx + 1 : letter}
                  </span>
                  <span className="lf-company-card__main">
                    <strong>{c.name}</strong>
                    <span className="lf-company-card__meta">
                      {c.rankCount.toLocaleString()} tagged · {WINDOW_LABEL[window]}
                    </span>
                    <span className="lf-company-card__track" aria-hidden>
                      <i style={{ width: `${width}%` }} />
                    </span>
                  </span>
                  <span className="lf-company-card__cta">
                    {active ? "Selected" : "Open pack"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
