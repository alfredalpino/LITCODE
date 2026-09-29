import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelRightClose } from "lucide-react";
import clsx from "clsx";

const LEFT_KEY = "sde-lc-left-w";
const RIGHT_KEY = "sde-lc-right-w";
const LEFT_COLLAPSE_KEY = "sde-lc-left-collapsed";
const RIGHT_COLLAPSE_KEY = "sde-lc-right-collapsed";

function readNum(key: string, fallback: number) {
  const n = Number(localStorage.getItem(key));
  return Number.isFinite(n) ? n : fallback;
}

function readBool(key: string, fallback = false) {
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

export function ShellBody({ showRail, showRight, rail, main, right }: ShellBodyProps) {
  const [leftW, setLeftW] = useState(() => Math.min(220, Math.max(64, readNum(LEFT_KEY, 88))));
  const [rightW, setRightW] = useState(() =>
    Math.min(420, Math.max(200, readNum(RIGHT_KEY, 280)))
  );
  const [leftCollapsed, setLeftCollapsed] = useState(() => readBool(LEFT_COLLAPSE_KEY));
  const [rightCollapsed, setRightCollapsed] = useState(() => readBool(RIGHT_COLLAPSE_KEY));
  const drag = useRef<"left" | "right" | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(LEFT_KEY, String(leftW));
  }, [leftW]);
  useEffect(() => {
    localStorage.setItem(RIGHT_KEY, String(rightW));
  }, [rightW]);
  useEffect(() => {
    localStorage.setItem(LEFT_COLLAPSE_KEY, leftCollapsed ? "1" : "0");
  }, [leftCollapsed]);
  useEffect(() => {
    localStorage.setItem(RIGHT_COLLAPSE_KEY, rightCollapsed ? "1" : "0");
  }, [rightCollapsed]);

  const onMove = useCallback((e: PointerEvent) => {
    if (!drag.current || !bodyRef.current) return;
    const rect = bodyRef.current.getBoundingClientRect();
    if (drag.current === "left") {
      const w = e.clientX - rect.left;
      setLeftW(Math.min(240, Math.max(64, w)));
      setLeftCollapsed(false);
    } else {
      const w = rect.right - e.clientX;
      setRightW(Math.min(440, Math.max(200, w)));
      setRightCollapsed(false);
    }
  }, []);

  const stop = useCallback(() => {
    drag.current = null;
    document.body.classList.remove("is-resizing", "is-resizing-x");
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [onMove, stop]);

  return (
    <div
      ref={bodyRef}
      className={clsx(
        "lc-body",
        showRail && "has-rail",
        showRight && "has-right",
        showRail && leftCollapsed && "is-left-collapsed",
        showRight && rightCollapsed && "is-right-collapsed"
      )}
    >
      {showRail && (
        <div
          className={clsx("lc-rail-wrap", leftCollapsed && "is-collapsed")}
          style={{ width: leftCollapsed ? 0 : leftW }}
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
            onClick={() => setLeftCollapsed((v) => !v)}
          >
            {leftCollapsed ? <ChevronRight size={14} /> : <PanelLeftClose size={14} />}
          </button>
          {!leftCollapsed && (
            <button
              type="button"
              className="lc-side-resize"
              aria-label="Resize left sidebar"
              onPointerDown={(e) => {
                e.preventDefault();
                drag.current = "left";
                document.body.classList.add("is-resizing", "is-resizing-x");
              }}
              onDoubleClick={() => setLeftW(88)}
            />
          )}
        </div>
      )}

      <div className="lc-main">{main}</div>

      {showRight && (
        <div className="lc-side-gutter lc-side-gutter--right">
          {!rightCollapsed && (
            <button
              type="button"
              className="lc-side-resize"
              aria-label="Resize right sidebar"
              onPointerDown={(e) => {
                e.preventDefault();
                drag.current = "right";
                document.body.classList.add("is-resizing", "is-resizing-x");
              }}
              onDoubleClick={() => setRightW(280)}
            />
          )}
          <button
            type="button"
            className="lc-side-toggle"
            aria-label={rightCollapsed ? "Expand right sidebar" : "Collapse right sidebar"}
            title={rightCollapsed ? "Expand panel" : "Collapse panel"}
            onClick={() => setRightCollapsed((v) => !v)}
          >
            {rightCollapsed ? <ChevronLeft size={14} /> : <PanelRightClose size={14} />}
          </button>
        </div>
      )}

      {showRight && (
        <div
          className={clsx("lc-right-wrap", rightCollapsed && "is-collapsed")}
          style={{ width: rightCollapsed ? 0 : rightW }}
        >
          {!rightCollapsed && right}
        </div>
      )}
    </div>
  );
}
