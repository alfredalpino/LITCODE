import type { Lab } from "../types";
import type { DsaIndexItem } from "../lib/dsa/types";
import { FeatureCards } from "./FeatureCards";

interface ContestViewProps {
  hardProblems: DsaIndexItem[];
  onOpen: (id: string) => void;
  onStartWeekly: () => void;
}

export function ContestView({ hardProblems, onOpen, onStartWeekly }: ContestViewProps) {
  return (
    <div className="lc-feed">
      <FeatureCards
        cards={[
          {
            id: "weekly",
            title: "Weekly Contest",
            subtitle: "Start a timed Hard set",
            tone: "amber",
            icon: "judge",
            onClick: onStartWeekly,
          },
          {
            id: "biweekly",
            title: "Biweekly",
            subtitle: "Open a random Hard drill",
            tone: "blue",
            icon: "problems",
            onClick: () => {
              const pick = hardProblems[Math.floor(Math.random() * Math.min(hardProblems.length, 40))];
              if (pick) onOpen(pick.id);
            },
          },
          {
            id: "virtual",
            title: "Virtual",
            subtitle: "Browse Hard problems below",
            tone: "teal",
            icon: "company",
            onClick: () => {
              const el = document.querySelector(".lc-table-wrap");
              el?.scrollIntoView({ behavior: "smooth" });
            },
          },
        ]}
      />

      <div className="lc-card lc-card--wide">
        <h2>This week's set</h2>
        <p className="lc-muted">
          Contest mode opens Hard-tagged problems. Submit in the editor — Accepted
          solutions count toward your streak.
        </p>
        <button type="button" className="run-btn" onClick={onStartWeekly}>
          Start weekly contest
        </button>
      </div>

      <div className="lc-table-wrap" style={{ marginTop: 16 }}>
        <table className="lc-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Topics</th>
            </tr>
          </thead>
          <tbody>
            {hardProblems.slice(0, 12).map((p) => (
              <tr key={p.id} onClick={() => onOpen(p.id)}>
                <td>
                  <span className="lc-table__num">{p.num}.</span> {p.title}
                </td>
                <td className="col-diff is-hard">{p.difficulty}</td>
                <td className="col-acc">{p.topics.slice(0, 3).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface InterviewViewProps {
  labs: Lab[];
  solvedLabs: number;
  totalLabs: number;
  solvedDsa: number;
  totalDsa: number;
  streak: number;
  onOpenLabs: () => void;
  onOpenCompanyPack: (company: string) => void;
  companies: string[];
}

export function InterviewView({
  labs,
  solvedLabs,
  totalLabs,
  solvedDsa,
  totalDsa,
  streak,
  onOpenLabs,
  onOpenCompanyPack,
  companies,
}: InterviewViewProps) {
  return (
    <div className="lc-feed">
      <div className="lc-card lc-card--wide">
        <h2>Interview dashboard</h2>
        <div className="lc-interview-stats">
          <div>
            <strong>{solvedLabs}/{totalLabs}</strong>
            <span>Lab modules done</span>
          </div>
          <div>
            <strong>{solvedDsa}</strong>
            <span>DSA accepted</span>
          </div>
          <div>
            <strong>{streak}</strong>
            <span>Day streak</span>
          </div>
          <div>
            <strong>{totalDsa.toLocaleString()}</strong>
            <span>Problems available</span>
          </div>
        </div>
      </div>

      <h3 className="lc-section-title">Study plans</h3>
      <div className="lc-plans">
        {labs.map((lab) => (
          <button key={lab.id} type="button" className="lc-plan" onClick={onOpenLabs}>
            <strong>{lab.title}</strong>
            <span>{lab.modules.length} modules · {lab.stats.codeFiles} code labs</span>
          </button>
        ))}
        <button
          type="button"
          className="lc-plan"
          onClick={() => onOpenCompanyPack(companies[0] ?? "Google")}
        >
          <strong>FAANG warm-up</strong>
          <span>Company-filtered DSA pack</span>
        </button>
      </div>

      <h3 className="lc-section-title">Company packs</h3>
      <div className="lc-companies">
        {companies.slice(0, 12).map((c) => (
          <button key={c} type="button" className="lc-company" onClick={() => onOpenCompanyPack(c)}>
            {c}
          </button>
        ))}
      </div>
      <p className="lc-muted" style={{ marginTop: 12 }}>
        Real company tags from liquidslr/leetcode-company-wise-problems.
      </p>
    </div>
  );
}
