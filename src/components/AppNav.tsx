"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  FlaskConical,
  Flame,
  LayoutDashboard,
  ListChecks,
  Mic,
  Search,
  Settings,
  Timer,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import clsx from "clsx";
import { track } from "@/lib/analytics";

export type NavSection =
  | "problems"
  | "labs"
  | "progress"
  | "contest"
  | "interview"
  | "profile";

export type NotifItem = {
  id: string;
  title: string;
  body: string;
  ts: number;
  read?: boolean;
};

export type GlobalSearchHit = {
  id: string;
  title: string;
  meta: string;
  onSelect: () => void;
};

interface AppNavProps {
  section: NavSection;
  streak: number;
  searchQuery: string;
  onSearch: (q: string) => void;
  searchHits: GlobalSearchHit[];
  searchLoading?: boolean;
  onSection: (s: NavSection) => void;
  notifications: NotifItem[];
  onMarkNotificationsRead: () => void;
  onClearNotifications: () => void;
  appTheme: "dark" | "light";
  onAppTheme: (t: "dark" | "light") => void;
  fontSize: number;
  onFontSize: (n: number) => void;
}

const NAV_ITEMS: Array<{
  id: NavSection;
  label: string;
  icon: typeof ListChecks;
  /** Persistent honesty chip — Contest is not live. */
  badge?: string;
  muted?: boolean;
}> = [
  { id: "labs", label: "Labs", icon: FlaskConical },
  { id: "problems", label: "Problems", icon: ListChecks },
  { id: "progress", label: "Progress", icon: LayoutDashboard },
  { id: "interview", label: "Interview", icon: Mic },
  {
    id: "contest",
    label: "Contest",
    icon: Trophy,
    badge: "Deferred",
    muted: true,
  },
];

function formatTimer(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function AppNav({
  section,
  streak,
  searchQuery,
  onSearch,
  searchHits,
  searchLoading = false,
  onSection,
  notifications,
  onMarkNotificationsRead,
  onClearNotifications,
  appTheme,
  onAppTheme,
  fontSize,
  onFontSize,
}: AppNavProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSec, setTimerSec] = useState(0);
  const unread = notifications.filter((n) => !n.read).length;
  const notifRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => setTimerSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (notifRef.current && !notifRef.current.contains(t)) setNotifOpen(false);
      if (settingsRef.current && !settingsRef.current.contains(t)) setSettingsOpen(false);
      if (searchRef.current && !searchRef.current.contains(t)) setSearchFocused(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setSearchFocused(true);
      }
      if (e.key === "Escape") {
        setSearchFocused(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const showSearchPanel =
    searchFocused && (searchQuery.trim().length >= 2 || searchLoading);

  return (
    <header className="lc-nav">
      <div className="lc-nav__left">
        <button
          type="button"
          className="lc-nav__brand"
          onClick={() => {
            onSection("labs");
            track("nav_section", { section: "labs" });
          }}
        >
          <span className="lc-nav__mark" aria-hidden />
          <span className="lc-nav__brand-text">LITCODE</span>
        </button>

        <nav className="lc-nav__links" aria-label="Primary">
          {NAV_ITEMS.map(({ id, label, icon: Icon, badge, muted }) => (
            <button
              key={id}
              type="button"
              className={clsx(
                "lc-nav__link",
                muted && "lc-nav__link--muted",
                section === id && "is-active"
              )}
              aria-current={section === id ? "page" : undefined}
              aria-label={badge ? `${label} (${badge})` : label}
              onClick={() => {
                onSection(id);
                track("nav_section", { section: id });
              }}
            >
              <Icon size={16} aria-hidden className="lc-nav__link-icon" />
              <span>{label}</span>
              {badge ? (
                <span className="lc-nav__deferred" aria-hidden>
                  {badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <nav className="lc-nav__mobile" aria-label="Primary mobile">
          {NAV_ITEMS.map(({ id, label, icon: Icon, badge, muted }) => (
            <button
              key={id}
              type="button"
              className={clsx(
                "lc-nav__link",
                muted && "lc-nav__link--muted",
                section === id && "is-active"
              )}
              aria-label={badge ? `${label} (${badge})` : label}
              onClick={() => {
                onSection(id);
                track("nav_section", { section: id });
              }}
            >
              <Icon size={15} aria-hidden className="lc-nav__link-icon" />
              <span>{label}</span>
              {badge ? (
                <span className="lc-nav__deferred" aria-hidden>
                  {badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
      </div>

      <div className="lc-nav__right">
        <div className="lc-nav__search-wrap" ref={searchRef}>
          <label className="lc-nav__search">
            <Search size={15} aria-hidden />
            <input
              ref={inputRef}
              type="search"
              placeholder="Search problems, labs, topics…"
              value={searchQuery}
              onChange={(e) => {
                onSearch(e.target.value);
                if (e.target.value.trim().length >= 2) {
                  track("search_used", { len: e.target.value.trim().length });
                }
              }}
              onFocus={() => setSearchFocused(true)}
              aria-expanded={showSearchPanel}
              aria-controls="lc-global-search-results"
              autoComplete="off"
            />
            <kbd className="lc-nav__kbd" aria-hidden>
              ⌘K
            </kbd>
            {searchQuery.length > 0 && (
              <button
                type="button"
                className="lc-nav__search-clear"
                aria-label="Clear search"
                onClick={() => {
                  onSearch("");
                  inputRef.current?.focus();
                }}
              >
                <X size={14} />
              </button>
            )}
          </label>
          {showSearchPanel && (
            <div
              id="lc-global-search-results"
              className="lc-search-panel"
              role="listbox"
              aria-label="Search results"
            >
              {searchLoading && (
                <p className="lc-search-panel__empty">Searching…</p>
              )}
              {!searchLoading && searchHits.length === 0 && (
                <p className="lc-search-panel__empty">
                  No matches — try a topic, company, or module title.
                </p>
              )}
              {!searchLoading &&
                searchHits.map((hit) => (
                  <button
                    key={hit.id}
                    type="button"
                    role="option"
                    className="lc-search-panel__hit"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      hit.onSelect();
                      setSearchFocused(false);
                    }}
                  >
                    <strong>{hit.title}</strong>
                    <span>{hit.meta}</span>
                  </button>
                ))}
            </div>
          )}
        </div>

        <div className="lc-nav__pop" ref={notifRef}>
          <button
            type="button"
            className="lc-icon-btn"
            aria-label="Notifications"
            aria-expanded={notifOpen}
            onClick={() => {
              setNotifOpen((v) => !v);
              setSettingsOpen(false);
              if (!notifOpen) onMarkNotificationsRead();
            }}
          >
            <Bell size={16} />
            {unread > 0 && <span className="lc-badge">{unread}</span>}
          </button>
          {notifOpen && (
            <div className="lc-dropdown lc-dropdown--notif">
              <div className="lc-dropdown__head">
                <strong>Notifications</strong>
                <button type="button" onClick={onClearNotifications}>
                  Clear
                </button>
              </div>
              {notifications.length === 0 ? (
                <p className="lc-dropdown__empty">You're all caught up.</p>
              ) : (
                <ul className="lc-dropdown__list">
                  {notifications.map((n) => (
                    <li key={n.id}>
                      <strong>{n.title}</strong>
                      <span>{n.body}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="lc-nav__streak" title="Daily activity streak">
          <Flame size={15} aria-hidden />
          <span>{streak}</span>
        </div>

        <button
          type="button"
          className={clsx("lc-icon-btn lc-nav__timer", timerRunning && "is-active")}
          title={timerRunning ? "Pause stopwatch" : "Start stopwatch"}
          aria-label={
            timerRunning
              ? `Stopwatch running ${formatTimer(timerSec)}. Click to pause.`
              : `Stopwatch ${formatTimer(timerSec)}. Click to start.`
          }
          onClick={() => setTimerRunning((v) => !v)}
          onContextMenu={(e) => {
            e.preventDefault();
            setTimerRunning(false);
            setTimerSec(0);
          }}
        >
          <Timer size={16} />
          <span className="lc-nav__timer-label">{formatTimer(timerSec)}</span>
        </button>

        <button
          type="button"
          className={clsx("lc-icon-btn", section === "profile" && "is-active")}
          aria-label="Profile"
          onClick={() => onSection("profile")}
        >
          <UserRound size={16} />
        </button>

        <div className="lc-nav__pop" ref={settingsRef}>
          <button
            type="button"
            className="lc-icon-btn"
            aria-label="Settings"
            aria-expanded={settingsOpen}
            onClick={() => {
              setSettingsOpen((v) => !v);
              setNotifOpen(false);
            }}
          >
            <Settings size={16} />
          </button>
          {settingsOpen && (
            <div className="lc-dropdown lc-dropdown--settings">
              <div className="lc-dropdown__head">
                <strong>Settings</strong>
              </div>
              <label className="lc-setting">
                <span>App theme</span>
                <select
                  value={appTheme}
                  onChange={(e) => onAppTheme(e.target.value as "dark" | "light")}
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </label>
              <label className="lc-setting">
                <span>Editor font size</span>
                <input
                  type="range"
                  min={12}
                  max={18}
                  value={fontSize}
                  onChange={(e) => onFontSize(Number(e.target.value))}
                />
                <em>{fontSize}px</em>
              </label>
              <p className="lc-setting__hint">Preferences save in this browser.</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
