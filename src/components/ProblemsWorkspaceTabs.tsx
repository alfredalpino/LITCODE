"use client";

import { Star } from "lucide-react";
import clsx from "clsx";
import type { ProblemsRail } from "@/types/workspace";

interface ProblemsWorkspaceTabsProps {
  rail: ProblemsRail;
  favoritesCount: number;
  onRail: (tab: ProblemsRail) => void;
}

export function ProblemsWorkspaceTabs({
  rail,
  favoritesCount,
  onRail,
}: ProblemsWorkspaceTabsProps) {
  return (
    <div className="lc-subnav" role="tablist" aria-label="Problems workspace">
      <button
        type="button"
        role="tab"
        aria-selected={rail !== "lists"}
        className={clsx("lc-subnav__tab", rail !== "lists" && "is-active")}
        onClick={() => onRail("explore")}
      >
        All problems
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={rail === "lists"}
        className={clsx("lc-subnav__tab", rail === "lists" && "is-active")}
        onClick={() => onRail("lists")}
      >
        <Star size={14} aria-hidden />
        Favorites
        {favoritesCount > 0 && <em>{favoritesCount}</em>}
      </button>
    </div>
  );
}
