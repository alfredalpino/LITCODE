import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  initialRatio?: number;
  minLeft?: number;
  minRight?: number;
  storageKey?: string;
}

export function SplitPane({
  left,
  right,
  initialRatio = 0.46,
  minLeft = 280,
  minRight = 320,
  storageKey = "sde-split-ratio",
}: SplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    const n = saved ? Number(saved) : initialRatio;
    return Number.isFinite(n) ? Math.min(0.75, Math.max(0.25, n)) : initialRatio;
  });
  const dragging = useRef(false);

  useEffect(() => {
    localStorage.setItem(storageKey, String(ratio));
  }, [ratio, storageKey]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const next = x / rect.width;
    const minL = minLeft / rect.width;
    const minR = minRight / rect.width;
    setRatio(Math.min(1 - minR, Math.max(minL, next)));
  }, [minLeft, minRight]);

  const stop = useCallback(() => {
    dragging.current = false;
    document.body.classList.remove("is-resizing");
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stop);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stop);
    };
  }, [onPointerMove, stop]);

  return (
    <div className="split-pane" ref={containerRef}>
      <div className="split-pane__left" style={{ width: `${ratio * 100}%` }}>
        {left}
      </div>
      <button
        type="button"
        className="split-pane__gutter"
        aria-label="Resize panels"
        onPointerDown={(e) => {
          e.preventDefault();
          dragging.current = true;
          document.body.classList.add("is-resizing");
        }}
        onDoubleClick={() => setRatio(initialRatio)}
      />
      <div className="split-pane__right">{right}</div>
    </div>
  );
}
