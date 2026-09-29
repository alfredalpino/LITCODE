import {
  Bell,
  Flame,
  Search,
  Settings,
} from "lucide-react";
import clsx from "clsx";
import type { AppMode, Lab } from "../types";

export type NavSection = "problems" | "labs" | "dsa" | "progress";

interface AppNavProps {
  labs: Lab[];
  mode: AppMode;
  section: NavSection;
  activeLabId: string;
  streak: number;
  onSection: (s: NavSection) => void;
  onLabChange: (id: string) => void;
  onModeChange: (mode: AppMode) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
}

export function AppNav({
  labs,
  mode,
  section,
  activeLabId,
  streak,
  onSection,
  onLabChange,
  onModeChange,
  searchQuery,
  onSearch,
}: AppNavProps) {
  return (
    <header className="lc-nav">
      <div className="lc-nav__left">
        <button
          type="button"
          className="lc-nav__brand"
          onClick={() => {
            onModeChange("labs");
            onSection("problems");
          }}
        >
          <span className="lc-nav__mark" />
          <span className="lc-nav__brand-text">SDE Lab</span>
        </button>

        <nav className="lc-nav__links" aria-label="Primary">
          <button
            type="button"
            className={clsx(
              "lc-nav__link",
              section === "problems" && mode === "dsa" && "is-active"
            )}
            onClick={() => {
              onModeChange("dsa");
              onSection("problems");
            }}
          >
            Problems
          </button>
          <button
            type="button"
            className={clsx(
              "lc-nav__link",
              section === "labs" && mode === "labs" && "is-active"
            )}
            onClick={() => {
              onModeChange("labs");
              onSection("labs");
            }}
          >
            Labs
          </button>
          <button
            type="button"
            className={clsx("lc-nav__link", section === "dsa" && "is-active")}
            onClick={() => {
              onModeChange("dsa");
              onSection("dsa");
            }}
          >
            Contest
          </button>
          <button
            type="button"
            className={clsx("lc-nav__link", section === "progress" && "is-active")}
            onClick={() => onSection("progress")}
          >
            Interview
          </button>
        </nav>
      </div>

      <div className="lc-nav__labs">
        {labs.map((lab) => (
          <button
            key={lab.id}
            type="button"
            className={clsx(
              "lc-nav__pill",
              mode === "labs" && activeLabId === lab.id && "is-active"
            )}
            onClick={() => {
              onLabChange(lab.id);
              onSection("labs");
            }}
          >
            {lab.short}
          </button>
        ))}
        <button
          type="button"
          className={clsx("lc-nav__pill lc-nav__pill--dsa", mode === "dsa" && "is-active")}
          onClick={() => {
            onModeChange("dsa");
            onSection("problems");
          }}
        >
          DSA
        </button>
      </div>

      <div className="lc-nav__right">
        <label className="lc-nav__search">
          <Search size={14} />
          <input
            type="search"
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </label>
        <button type="button" className="lc-icon-btn" aria-label="Notifications">
          <Bell size={16} />
        </button>
        <div className="lc-nav__streak" title="Daily streak">
          <Flame size={15} />
          <span>{streak}</span>
        </div>
        <button type="button" className="lc-icon-btn" aria-label="Settings">
          <Settings size={16} />
        </button>
        <button type="button" className="lc-nav__premium">
          Pro
        </button>
      </div>
    </header>
  );
}
