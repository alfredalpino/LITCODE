import { useEffect, useRef, useState } from "react";
import { Bell, Flame, Search, Settings, X } from "lucide-react";
import clsx from "clsx";

export type NavSection = "problems" | "labs" | "contest" | "interview";

export type NotifItem = {
  id: string;
  title: string;
  body: string;
  ts: number;
  read?: boolean;
};

interface AppNavProps {
  section: NavSection;
  streak: number;
  searchQuery: string;
  onSearch: (q: string) => void;
  onSection: (s: NavSection) => void;
  notifications: NotifItem[];
  onMarkNotificationsRead: () => void;
  onClearNotifications: () => void;
  editorTheme: "vs-dark" | "light";
  onEditorTheme: (t: "vs-dark" | "light") => void;
  fontSize: number;
  onFontSize: (n: number) => void;
}

export function AppNav({
  section,
  streak,
  searchQuery,
  onSearch,
  onSection,
  notifications,
  onMarkNotificationsRead,
  onClearNotifications,
  editorTheme,
  onEditorTheme,
  fontSize,
  onFontSize,
}: AppNavProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [proOpen, setProOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;
  const notifRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (notifRef.current && !notifRef.current.contains(t)) setNotifOpen(false);
      if (settingsRef.current && !settingsRef.current.contains(t)) setSettingsOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className="lc-nav">
      <div className="lc-nav__left">
        <button
          type="button"
          className="lc-nav__brand"
          onClick={() => onSection("problems")}
        >
          <span className="lc-nav__mark" />
          <span className="lc-nav__brand-text">SDE Lab</span>
        </button>

        <nav className="lc-nav__links" aria-label="Primary">
          {(
            [
              ["problems", "Problems"],
              ["labs", "Labs"],
              ["contest", "Contest"],
              ["interview", "Interview"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={clsx("lc-nav__link", section === id && "is-active")}
              onClick={() => onSection(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="lc-nav__right">
        <label className={clsx("lc-nav__search", mobileSearch && "is-expanded")}>
          <Search size={14} />
          <input
            type="search"
            placeholder="Search questions, labs…"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            onFocus={() => setMobileSearch(true)}
            onBlur={() => setMobileSearch(false)}
          />
        </label>

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
          <Flame size={15} />
          <span>{streak}</span>
        </div>

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
                <span>Editor theme</span>
                <select
                  value={editorTheme}
                  onChange={(e) =>
                    onEditorTheme(e.target.value as "vs-dark" | "light")
                  }
                >
                  <option value="vs-dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </label>
              <label className="lc-setting">
                <span>Font size</span>
                <input
                  type="range"
                  min={12}
                  max={18}
                  value={fontSize}
                  onChange={(e) => onFontSize(Number(e.target.value))}
                />
                <em>{fontSize}px</em>
              </label>
              <p className="lc-setting__hint">
                Preferences save in this browser.
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          className="lc-nav__premium"
          onClick={() => setProOpen(true)}
        >
          Pro
        </button>
      </div>

      {proOpen && (
        <div className="lc-modal" role="dialog" aria-modal="true">
          <button
            type="button"
            className="lc-modal__backdrop"
            aria-label="Close"
            onClick={() => setProOpen(false)}
          />
          <div className="lc-modal__card">
            <button
              type="button"
              className="lc-modal__close"
              onClick={() => setProOpen(false)}
            >
              <X size={16} />
            </button>
            <h2>SDE Lab Pro</h2>
            <p>
              Unlock solution walkthroughs, contest rankings, and company-tagged
              interview packs. This local build keeps everything free — Pro is a
              preview of the product surface.
            </p>
            <ul>
              <li>Official editorial-style writeups</li>
              <li>Weekly contest brackets</li>
              <li>Company drill playlists</li>
            </ul>
            <button type="button" className="run-btn" onClick={() => setProOpen(false)}>
              Continue free
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
