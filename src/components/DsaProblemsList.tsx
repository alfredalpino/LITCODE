import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, Shuffle, Star } from "lucide-react";
import clsx from "clsx";
import type { DsaIndexItem } from "../lib/dsa/types";
import { acceptanceRate } from "../lib/stats";

interface DsaProblemsListProps {
  items: DsaIndexItem[];
  topics: string[];
  companies: string[];
  total: number;
  solved: Record<string, boolean>;
  favorites: string[];
  searchQuery: string;
  companyFilter: string | null;
  favoritesOnly?: boolean;
  difficultyPreset?: "All" | "Easy" | "Medium" | "Hard";
  title?: string;
  subtitle?: string;
  onOpen: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCompanyFilter: (name: string | null) => void;
}

export function DsaProblemsList({
  items,
  companies,
  total,
  solved,
  favorites,
  searchQuery,
  companyFilter,
  favoritesOnly = false,
  difficultyPreset = "All",
  title = "DSA Arena",
  subtitle,
  onOpen,
  onToggleFavorite,
  onCompanyFilter,
}: DsaProblemsListProps) {
  const [diff, setDiff] = useState<"All" | "Easy" | "Medium" | "Hard">(difficultyPreset);
  const [topic, setTopic] = useState("All");
  const [status, setStatus] = useState<"All" | "Todo" | "Solved">("All");
  const [page, setPage] = useState(0);
  const pageSize = 50;

  useEffect(() => {
    setDiff(difficultyPreset);
    setPage(0);
  }, [difficultyPreset]);

  useEffect(() => {
    setPage(0);
  }, [companyFilter, favoritesOnly, searchQuery]);

  const topicCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const it of items) {
      for (const t of it.topics) map[t] = (map[t] ?? 0) + 1;
    }
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14);
  }, [items]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const company = companyFilter ?? "All";
    const list = items.filter((it) => {
      if (favoritesOnly && !favorites.includes(it.id)) return false;
      if (diff !== "All" && it.difficulty !== diff) return false;
      if (topic !== "All" && !it.topics.includes(topic)) return false;
      if (company !== "All" && !it.companies.includes(company)) return false;
      const done = !!solved[it.id];
      if (status === "Todo" && done) return false;
      if (status === "Solved" && !done) return false;
      if (!q) return true;
      return (
        it.title.toLowerCase().includes(q) ||
        String(it.num).includes(q) ||
        it.topics.some((t) => t.toLowerCase().includes(q)) ||
        it.companies.some((c) => c.toLowerCase().includes(q)) ||
        (it.slug ?? "").includes(q)
      );
    });
    if (company !== "All") {
      return [...list].sort((a, b) => (b.frequency ?? 0) - (a.frequency ?? 0));
    }
    return list;
  }, [
    items,
    searchQuery,
    diff,
    topic,
    companyFilter,
    status,
    solved,
    favoritesOnly,
    favorites,
  ]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const solvedCount = Object.keys(solved).length;

  function shuffleOpen() {
    if (!filtered.length) return;
    const pick = filtered[Math.floor(Math.random() * Math.min(filtered.length, 500))];
    onOpen(pick.id);
  }

  return (
    <div className="lc-feed">
      <div className="lc-banners">
        <div className="lc-banner lc-banner--a">
          <strong>{title}</strong>
          <span>
            {subtitle ??
              `${total.toLocaleString()} industry-level drills${
                companyFilter ? ` · ${companyFilter}` : ""
              }`}
          </span>
        </div>
        <div className="lc-banner lc-banner--b">
          <strong>Auto-Judge</strong>
          <span>Run & Submit on curated + judged patterns</span>
        </div>
        <div className="lc-banner lc-banner--c">
          <strong>Company tags</strong>
          <span>Filter from the right panel or toolbar</span>
        </div>
      </div>

      <div className="lc-topics">
        {topicCounts.map(([name, count]) => (
          <button
            key={name}
            type="button"
            className={clsx("lc-topic", topic === name && "is-active")}
            onClick={() => {
              setTopic(topic === name ? "All" : name);
              setPage(0);
            }}
          >
            {name} <em>{count}</em>
          </button>
        ))}
      </div>

      <div className="lc-subcats">
        {["All Topics", "Algorithms", "Database", "Shell", "Concurrency", "JavaScript"].map(
          (label, i) => (
            <button
              key={label}
              type="button"
              className={clsx("lc-subcat", i === 0 && topic === "All" && "is-active")}
              onClick={() => {
                setTopic("All");
                setPage(0);
              }}
            >
              {label}
            </button>
          )
        )}
      </div>

      <div className="lc-toolbar">
        <div className="lc-toolbar__hint">
          {filtered.length.toLocaleString()} questions · page {page + 1}/{pageCount}
        </div>
        <select
          value={diff}
          onChange={(e) => {
            setDiff(e.target.value as typeof diff);
            setPage(0);
          }}
        >
          <option value="All">Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as typeof status);
            setPage(0);
          }}
        >
          <option value="All">Status</option>
          <option value="Todo">Todo</option>
          <option value="Solved">Solved</option>
        </select>
        <select
          value={companyFilter ?? "All"}
          onChange={(e) => {
            onCompanyFilter(e.target.value === "All" ? null : e.target.value);
            setPage(0);
          }}
        >
          <option value="All">Companies</option>
          {(companyFilter && !companies.includes(companyFilter)
            ? [companyFilter, ...companies]
            : companies
          )
            .slice(0, 120)
            .map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="lc-toolbar__solved">
          {solvedCount}/{total.toLocaleString()} Solved
          <button type="button" className="lc-icon-btn" onClick={shuffleOpen} aria-label="Shuffle">
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
              <th className="col-acc">{companyFilter ? "Frequency" : "Acceptance"}</th>
              <th className="col-diff">Difficulty</th>
              <th className="col-fav" />
            </tr>
          </thead>
          <tbody>
            {pageItems.map((it) => {
              const done = !!solved[it.id];
              return (
                <tr key={it.id} onClick={() => onOpen(it.id)}>
                  <td className="col-status">
                    {done ? (
                      <CheckCircle2 size={16} className="is-solved" />
                    ) : (
                      <Circle size={16} className="is-todo" />
                    )}
                  </td>
                  <td className="col-title">
                    <span className="lc-table__num">{it.num}.</span> {it.title}
                    {it.hasJudge && <span className="lc-table__meta">Judge</span>}
                    {it.kind === "leetcode" && <span className="lc-table__meta">LC</span>}
                  </td>
                  <td className="col-acc">
                    {companyFilter
                      ? `${(it.frequency ?? 0).toFixed(1)}%`
                      : `${acceptanceRate(it.id)}%`}
                  </td>
                  <td className={clsx("col-diff", `is-${it.difficulty.toLowerCase()}`)}>
                    {it.difficulty}
                  </td>
                  <td className="col-fav">
                    <button
                      type="button"
                      className={clsx("fav-btn", favorites.includes(it.id) && "is-on")}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(it.id);
                      }}
                    >
                      <Star size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="lc-pager">
        <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          {page + 1} / {pageCount}
        </span>
        <button
          type="button"
          disabled={page >= pageCount - 1}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
