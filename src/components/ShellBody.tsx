"use client";

import { useCallback, useState } from "react";
import { ChevronRight, PanelLeftClose } from "lucide-react";
import clsx from "clsx";
import type { ReactNode } from "react";

const LEFT_COLLAPSE_KEY = "sde-lc-left-collapsed";

function readBool(key: string, fallback = false) {
  if (typeof window === "undefined") return fallback;
  const v = localStorage.getItem(key);
  if (v == null) return fallback;
  return v === "1" || v === "true";
}

interface ShellBodyProps {
  showRail: boolean;
  showRight: boolean;
  rail: ReactNode;
  main: ReactNode;
  right: ReactNode;
}

/** Left rail collapsible; right panel fixed width (no drag-resize). */
export function ShellBody({ showRail, showRight, rail, main, right }: ShellBodyProps) {
  const [leftCollapsed, setLeftCollapsed] = useState(() => readBool(LEFT_COLLAPSE_KEY));

  const toggleLeft = useCallback(() => {
    setLeftCollapsed((v) => {
      const next = !v;
      localStorage.setItem(LEFT_COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }, []);

  return (
    <div
      className={clsx(
        "lc-body",
        showRail && "has-rail",
        showRight && "has-right",
        showRail && leftCollapsed && "is-left-collapsed"
      )}
    >
      {showRail && (
        <div
          className={clsx("lc-rail-wrap", leftCollapsed && "is-collapsed")}
          style={{ width: leftCollapsed ? 0 : 88 }}
        >
          {!leftCollapsed && rail}
        </div>
      )}

      {showRail && (
        <div className="lc-side-gutter lc-side-gutter--left">
          <button
            type="button"
            className="lc-side-toggle"
            aria-label={leftCollapsed ? "Expand left sidebar" : "Collapse left sidebar"}
            title={leftCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={toggleLeft}
          >
            {leftCollapsed ? <ChevronRight size={14} /> : <PanelLeftClose size={14} />}
          </button>
        </div>
      )}

      <div className="lc-main">{main}</div>

      {showRight && (
        <div className="lc-right-wrap lc-right-wrap--fixed" style={{ width: 300 }}>
          {right}
        </div>
      )}
    </div>
  );
}
