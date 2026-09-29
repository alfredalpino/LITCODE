"use client";

import { useEffect, useState } from "react";
import { Eye, PenLine } from "lucide-react";
import { appendEvent } from "@/lib/events";

interface PredictGateProps {
  labId: string;
  moduleId: string;
  /** Soft by default; hard requires non-empty prediction before unlock. */
  hard?: boolean;
  hasPredictions: boolean;
  onUnlocked: () => void;
}

/**
 * Soft predict → run gate (LEARNING_ENGINE / DEC-014).
 * Default: prompt + allow skip (logged). Hard: require non-empty text.
 */
export function PredictGate({
  labId,
  moduleId,
  hard = false,
  hasPredictions,
  onUnlocked,
}: PredictGateProps) {
  const storageKey = `sde-lab-predict-gate:${labId}:${moduleId}`;
  const [text, setText] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw === "1") {
        setUnlocked(true);
        onUnlocked();
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  if (!hasPredictions || !hydrated || unlocked) return null;

  function unlock(kind: "prediction_submitted" | "prediction_skipped") {
    appendEvent({
      type: kind,
      labId,
      moduleId,
      meta: kind === "prediction_submitted" ? { length: text.trim().length } : { peek: true },
    });
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
    setUnlocked(true);
    onUnlocked();
  }

  function handleSubmit() {
    if (hard && !text.trim()) return;
    unlock(text.trim() ? "prediction_submitted" : "prediction_skipped");
  }

  return (
    <div className="lf-predict-gate" role="region" aria-label="Predict before run">
      <div className="lf-predict-gate__head">
        <PenLine size={14} />
        <strong>Predict before you run</strong>
      </div>
      <p>
        Write what you expect (output, error, or type behavior). LITCODE logs this locally — no
        account required.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="I predict…"
        rows={3}
        aria-label="Your prediction"
      />
      <div className="lf-predict-gate__actions">
        <button type="button" className="run-btn run-btn--compact" onClick={handleSubmit}>
          {hard ? "Lock in prediction" : "Save & unlock Run"}
        </button>
        {!hard && (
          <button
            type="button"
            className="lc-link"
            onClick={() => unlock("prediction_skipped")}
          >
            <Eye size={13} /> I want to peek
          </button>
        )}
      </div>
    </div>
  );
}
