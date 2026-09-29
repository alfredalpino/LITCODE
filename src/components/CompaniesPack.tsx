"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Circle,
  Search,
} from "lucide-react";
import clsx from "clsx";
import type { DsaIndexItem } from "../lib/dsa/types";
import { ChallengeKindBadge } from "./ContentStatusBadge";
import { EmptyState } from "./EmptyState";

interface CompaniesPackProps {
  company: string;
  items: DsaIndexItem[];
  solved: Record<string, boolean>;
  onBack: () => void;
  onOpen: (id: string) => void;
  onClearCompany?: () => void;
}

export function CompaniesPack({
  company,
  items,
  solved,
  onBack,
  onOpen,
}: CompaniesPackProps) {
  const [q, setQ] = useState("");
  const [diff, setDiff] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [status, setStatus] = useState<"All" | "Todo" | "Solved">("All");
  const [judgeOnly, setJudgeOnly] = useState(false);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((it) => {
      if (diff !== "All" && it.difficulty !== diff) return false;
      if (judgeOnly && !it.hasJudge) return false;
      if (status === "Todo" && solved[it.id]) return false;
      if (status === "Solved" && !solved[it.id]) return false;
      if (
        needle &&
        !it.title.toLowerCase().includes(needle) &&
        !it.topics.some((t) => t.toLowerCase().includes(needle))
      ) {
        return false;
      }
      return true;
    });
  }, [items, q, diff, status, judgeOnly, solved]);

  const solvedCount = items.filter((i) => solved[i.id]).length;

  return (
    <div className="lc-feed lf-company-pack">
      <header className="lf-company-pack__hero">
        <button type="button" className="lf-companies-page__back" onClick={onBack}>
          <ArrowLeft size={16} />
          All companies
        </button>
        <div className="lf-company-pack__title-row">
          <div>
            <p className="lc-labs__eyebrow">
              <Building2 size={14} /> Company pack
            </p>
            <h1>{company}</h1>
            <p className="lc-muted">
              {items.length.toLocaleString()} tagged problems · {solvedCount} solved
              · filters stay on this pack (not the global Problems index)
            </p>
          </div>
          <div className="lf-company-pack__stats">
            <div>
              <strong>{items.length}</strong>
              <span>problems</span>
            </div>
            <div>
              <strong>{items.filter((i) => i.hasJudge).length}</strong>
              <span>judged</span>
            </div>
          </div>
        </div>

        <div className="lf-company-pack__toolbar">
          <label className="lf-companies-page__search">
            <Search size={15} aria-hidden />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search in ${company}…`}
              aria-label="Search company problems"
            />
          </label>
          <select
            value={diff}
            onChange={(e) => setDiff(e.target.value as typeof diff)}
            aria-label="Difficulty"
          >
            <option value="All">Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            aria-label="Status"
          >
            <option value="All">Status</option>
            <option value="Todo">Todo</option>
            <option value="Solved">Solved</option>
          </select>
          <label className="lf-company-pack__toggle">
            <input
              type="checkbox"
              checked={judgeOnly}
              onChange={(e) => setJudgeOnly(e.target.checked)}
            />
            Judged only
          </label>
        </div>
      </header>

      {filtered.length === 0 ? (
        <EmptyState
          title="No problems in this pack match"
          body="Clear filters or turn off Judged only."
        />
      ) : (
        <div className="lc-table-wrap">
          <table className="lc-table">
            <thead>
              <tr>
                <th style={{ width: 40 }} />
                <th style={{ width: 64 }}>#</th>
                <th>Title</th>
                <th>Kind</th>
                <th>Difficulty</th>
                <th>Topics</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it) => (
                <tr
                  key={it.id}
                  className="is-click"
                  onClick={() => onOpen(it.id)}
                >
                  <td>
                    {solved[it.id] ? (
                      <CheckCircle2 size={16} className="is-solved-icon" />
                    ) : (
                      <Circle size={16} className="lc-muted" />
                    )}
                  </td>
                  <td className="lc-muted">{it.num || "—"}</td>
                  <td>
                    <button type="button" className="lc-table__title">
                      {it.title}
                    </button>
                  </td>
                  <td>
                    <ChallengeKindBadge hasJudge={it.hasJudge} />
                  </td>
                  <td>
                    <span
                      className={clsx(
                        "diff-badge",
                        `is-${it.difficulty.toLowerCase()}`
                      )}
                    >
                      {it.difficulty}
                    </span>
                  </td>
                  <td className="lc-muted">
                    {it.topics.slice(0, 3).join(", ")}
                    {it.topics.length > 3 ? "…" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
