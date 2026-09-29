"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Network } from "lucide-react";
import { loadEvents } from "@/lib/events";
import {
  deriveSkillState,
  loadSkillGraph,
  recommendNext,
  type NextStepRecommendation,
  type SkillGraphFile,
} from "@/lib/skill-graph";

interface ProgressNextStepsProps {
  progress: Record<string, boolean>;
  dsaSolved: Record<string, boolean>;
  onOpenModule?: (labId: string, moduleId: string) => void;
  onOpenChallenge?: (challengeId: string) => void;
}

/**
 * Graph + events next-step for Progress / Profile / Interview (SKILL_GRAPH.md).
 */
export function ProgressNextSteps({
  progress,
  dsaSolved,
  onOpenModule,
  onOpenChallenge,
}: ProgressNextStepsProps) {
  const [recs, setRecs] = useState<NextStepRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const graph: SkillGraphFile = await loadSkillGraph();
        const state = deriveSkillState(graph, progress, dsaSolved, loadEvents(), {
          persist: true,
        });
        if (cancelled) return;
        setRecs(recommendNext(graph, state, 3));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Skill graph unavailable");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [progress, dsaSolved]);

  return (
    <section className="lc-card lc-card--wide lf-next-steps">
      <div className="lc-card__head">
        <h3>
          <Network size={14} /> What should I learn next?
        </h3>
      </div>
      <p className="lc-card__hint">
        Cross-lab recommendations from events + skill graph — explainable, not a black box.
      </p>
      {error && <p className="lc-muted">{error}</p>}
      {!error && recs.length === 0 && (
        <p className="lc-muted">
          Complete a ready lab module or solve a judged challenge to unlock graph-backed next steps.
        </p>
      )}
      <ul className="lf-next-steps__list">
        {recs.map(({ node, reason }) => (
          <li key={node.id}>
            <div>
              <strong>{node.title}</strong>
              <span className="lc-muted">{reason}</span>
            </div>
            {node.moduleRef && onOpenModule && (
              <button
                type="button"
                className="lc-link"
                onClick={() =>
                  onOpenModule(node.moduleRef!.labId, node.moduleRef!.moduleId)
                }
              >
                Open lab <ArrowRight size={12} />
              </button>
            )}
            {node.challengeRef && onOpenChallenge && (
              <button
                type="button"
                className="lc-link"
                onClick={() => onOpenChallenge(node.challengeRef!.challengeId)}
              >
                Open challenge <ArrowRight size={12} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
