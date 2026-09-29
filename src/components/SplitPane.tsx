import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";

interface SplitPaneProps {
  first: ReactNode;
  second: ReactNode;
  orientation?: "horizontal" | "vertical";
  initialRatio?: number;
  minFirst?: number;
  minSecond?: number;
  storageKey?: string;
  className?: string;
}

export function SplitPane({
  first,
  second,
  orientation = "horizontal",
  initialRatio = 0.5,
  minFirst = 180,
  minSecond = 160,
  storageKey = "sde-split",
  className,
}: SplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    const n = saved ? Number(saved) : initialRatio;
    return Number.isFinite(n) ? Math.min(0.82, Math.max(0.18, n)) : initialRatio;
  });
  const dragging = useRef(false);

  useEffect(() => {
    localStorage.setItem(storageKey, String(ratio));
  }, [ratio, storageKey]);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const vertical = orientation === "vertical";
      const pos = vertical ? e.clientY - rect.top : e.clientX - rect.left;
      const size = vertical ? rect.height : rect.width;
      if (size <= 0) return;
      const next = pos / size;
      const minA = minFirst / size;
      const minB = minSecond / size;
      setRatio(Math.min(1 - minB, Math.max(minA, next)));
    },
    [orientation, minFirst, minSecond]
  );

  const stop = useCallback(() => {
    dragging.current = false;
    document.body.classList.remove(
      "is-resizing",
      "is-resizing-x",
      "is-resizing-y"
    );
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [onPointerMove, stop]);

  const vertical = orientation === "vertical";
  const firstStyle = vertical
    ? { height: `${ratio * 100}%` }
    : { width: `${ratio * 100}%` };

  return (
    <div
      className={clsx(
        "split-pane",
        vertical ? "split-pane--vertical" : "split-pane--horizontal",
        className
      )}
      ref={containerRef}
    >
      <div className="split-pane__first" style={firstStyle}>
        {first}
      </div>
      <button
        type="button"
        className="split-pane__gutter"
        aria-label={vertical ? "Resize console" : "Resize panels"}
        onPointerDown={(e) => {
          e.preventDefault();
          dragging.current = true;
          document.body.classList.add(
            "is-resizing",
            vertical ? "is-resizing-y" : "is-resizing-x"
          );
        }}
        onDoubleClick={() => setRatio(initialRatio)}
      />
      <div className="split-pane__second">{second}</div>
    </div>
  );
}
