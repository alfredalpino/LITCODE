import { BookOpen, Code2, Menu, X } from "lucide-react";
import clsx from "clsx";
import type { CSSProperties } from "react";
import type { AppMode, Lab, MobilePane } from "../types";

interface TopBarProps {
  labs: Lab[];
  activeLabId: string;
  onLabChange: (id: string) => void;
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  mobilePane: MobilePane;
  onMobilePane: (pane: MobilePane) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  moduleTitle?: string;
}

export function TopBar({
  labs,
  activeLabId,
  onLabChange,
  mode,
  onModeChange,
  mobilePane,
  onMobilePane,
  sidebarOpen,
  onToggleSidebar,
  moduleTitle,
}: TopBarProps) {
  const active = labs.find((l) => l.id === activeLabId);

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <button
          type="button"
          className="icon-btn topbar__menu"
          aria-label={sidebarOpen ? "Close curriculum" : "Open curriculum"}
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div className="topbar__logo" aria-hidden>
          <span className="topbar__logo-mark" />
        </div>
        <div className="topbar__titles">
          <span className="topbar__name">SDE Laboratory</span>
          <span className="topbar__sub">
            {mode === "dsa" ? "DSA Arena" : active?.short ?? "Lab"}
            {moduleTitle ? ` · ${moduleTitle}` : ""}
          </span>
        </div>
      </div>

      <nav className="topbar__labs" aria-label="Laboratories">
        {labs.map((lab) => (
          <button
            key={lab.id}
            type="button"
            className={clsx(
              "lab-chip",
              mode === "labs" && activeLabId === lab.id && "is-active"
            )}
            style={{ "--chip-accent": lab.accent } as CSSProperties}
            onClick={() => onLabChange(lab.id)}
          >
            {lab.short}
          </button>
        ))}
        <button
          type="button"
          className={clsx("lab-chip lab-chip--dsa", mode === "dsa" && "is-active")}
          style={{ "--chip-accent": "#22c55e" } as CSSProperties}
          onClick={() => onModeChange("dsa")}
        >
          DSA Arena
        </button>
      </nav>

      <div className="topbar__mobile-toggle" role="tablist" aria-label="Pane">
        <button
          type="button"
          role="tab"
          aria-selected={mobilePane === "read"}
          className={clsx("pane-tab", mobilePane === "read" && "is-active")}
          onClick={() => onMobilePane("read")}
        >
          <BookOpen size={15} />
          Read
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobilePane === "code"}
          className={clsx("pane-tab", mobilePane === "code" && "is-active")}
          onClick={() => onMobilePane("code")}
        >
          <Code2 size={15} />
          Code
        </button>
      </div>
    </header>
  );
}
