"use client";

import clsx from "clsx";
import type { ModuleStatus } from "@/types";
import { statusLabel } from "@/lib/module-status";

interface ContentStatusBadgeProps {
  status: ModuleStatus;
  className?: string;
  compact?: boolean;
}

export function ContentStatusBadge({
  status,
  className,
  compact = false,
}: ContentStatusBadgeProps) {
  return (
    <span
      className={clsx(
        "lf-status-badge",
        `is-${status}`,
        compact && "is-compact",
        className
      )}
      title={
        status === "ready"
          ? "Runnable lab with lesson + experiments"
          : status === "deprecated"
            ? "Deprecated module"
            : "Scaffold — curriculum shell, not a complete lab yet"
      }
    >
      {compact ? (status === "ready" ? "Ready" : status === "deprecated" ? "Dep" : "Scaffold") : statusLabel(status)}
    </span>
  );
}

interface ChallengeKindBadgeProps {
  hasJudge: boolean;
  kind?: string;
  className?: string;
}

export function ChallengeKindBadge({ hasJudge, kind, className }: ChallengeKindBadgeProps) {
  if (hasJudge) {
    return (
      <span className={clsx("lf-status-badge is-judge", className)} title="Auto-judged in LITCODE">
        Auto-judge
      </span>
    );
  }
  return (
    <span
      className={clsx("lf-status-badge is-external", className)}
      title="Practice here; verify externally (e.g. LeetCode)"
    >
      {kind === "leetcode" ? "External (LC)" : "External"}
    </span>
  );
}
