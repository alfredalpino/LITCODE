"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import {
  loadSkillGraph,
  relatedLabConcepts,
  type SkillNode,
} from "@/lib/skill-graph";

interface PatternRelatedLabsProps {
  patternKey?: string;
  onOpenModule?: (labId: string, moduleId: string) => void;
}

/**
 * Hint-ladder companion: pattern → related lab modules (Phase 8 transfer).
 */
export function PatternRelatedLabs({
  patternKey,
  onOpenModule,
}: PatternRelatedLabsProps) {
  const [labs, setLabs] = useState<SkillNode[]>([]);

  useEffect(() => {
    let cancelled = false;
    if (!patternKey) {
      setLabs([]);
      return;
    }
    (async () => {
      try {
        const graph = await loadSkillGraph();
        if (cancelled) return;
        setLabs(relatedLabConcepts(graph, patternKey));
      } catch {
        if (!cancelled) setLabs([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [patternKey]);

  if (!patternKey || labs.length === 0) return null;

  return (
    <div className="dsa-related-labs">
      <h3>
        <BookOpen size={14} /> Related lab concepts
      </h3>
      <p className="dsa-hints__lead">
        Pattern teaching links back into language labs — warm up here if the challenge feels thin.
      </p>
      <ul className="dsa-related-labs__list">
        {labs.map((n) => (
          <li key={n.id}>
            <span>
              <strong>{n.title}</strong>
              <span className="lc-muted">
                {n.language}
                {n.moduleRef ? ` · ${n.moduleRef.moduleId}` : ""}
              </span>
            </span>
            {n.moduleRef && onOpenModule && (
              <button
                type="button"
                className="lc-link"
                onClick={() =>
                  onOpenModule(n.moduleRef!.labId, n.moduleRef!.moduleId)
                }
              >
                Open lab
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
