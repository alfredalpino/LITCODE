"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  ChevronLeft,
  ChevronRight,
  Search,
  TrendingUp,
} from "lucide-react";
import clsx from "clsx";
import type { CompanyPackMeta } from "../lib/dsa/types";

export type CompanyWindow = "thirty" | "threeMonths" | "all";

/** 4 columns × 5 rows */
const PAGE_SIZE = 20;

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

function pageWindow(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

export function CompaniesBrowse({
  companies,
  activeCompany,
  onCompany,
  onBack,
  totalProblems,
}: CompaniesBrowseProps) {
  const [window, setWindow] = useState<CompanyWindow>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"rank" | "alpha">("rank");
  const [page, setPage] = useState(1);

  const ranked = useMemo(() => {
    const rows = companies
      .map((c) => ({
        ...c,
        rankCount: windowCount(c, window),
      }))
      // Empty folders / zero tags for this window — not useful on the grid
      .filter((c) => c.rankCount > 0);
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
      q ? ranked.filter((c) => c.name.toLowerCase().includes(q)) : ranked,
    [ranked, q]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [window, sort, query]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const max = ranked[0]?.rankCount || 1;
  const pager = pageWindow(safePage, totalPages);

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
              {filtered.length.toLocaleString()} companies with tags in this window ·{" "}
              {totalProblems.toLocaleString()} problems in the index. Sources: liquidslr +
              snehasishroy company-wise interview lists — small packs with 1–2 titles are real.
            </p>
          </div>
          <div className="lf-companies-page__stat">
            <TrendingUp size={18} />
            <div>
              <strong>
                {safePage}/{totalPages}
              </strong>
              <span>
                page · {PAGE_SIZE} per page · {WINDOW_LABEL[window]}
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
        <>
          <ul className="lf-companies-grid lf-companies-grid--paged" aria-label="Company packs">
            {pageItems.map((c, idx) => {
              const globalRank = (safePage - 1) * PAGE_SIZE + idx + 1;
              const letter = c.name.charAt(0).toUpperCase();
              const width = Math.max(6, Math.round((c.rankCount / max) * 100));
              const active = activeCompany === c.name;
              return (
                <li key={c.name}>
                  <button
                    type="button"
                    className={clsx("lf-company-card", active && "is-active")}
                    onClick={() => onCompany(active ? null : c.name)}
                  >
                    <span className="lf-company-card__rank" aria-hidden>
                      {sort === "rank" ? globalRank : letter}
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

          <nav className="lf-companies-pager" aria-label="Company pages">
            <button
              type="button"
              className="lf-companies-pager__nav"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
              Prev
            </button>

            <div className="lf-companies-pager__pages">
              {pager.map((item, i) =>
                item === "…" ? (
                  <span key={`e-${i}`} className="lf-companies-pager__ellipsis" aria-hidden>
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    className={clsx(
                      "lf-companies-pager__page",
                      item === safePage && "is-active"
                    )}
                    aria-current={item === safePage ? "page" : undefined}
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              className="lf-companies-pager__nav"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
            >
              Next
              <ChevronRight size={16} />
            </button>

            <p className="lf-companies-pager__meta">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length.toLocaleString()}
            </p>
          </nav>
        </>
      )}
    </div>
  );
}
