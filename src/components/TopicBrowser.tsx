import { useMemo, useState } from "react";
import {
  BarChart3,
  Binary,
  ChevronDown,
  ChevronUp,
  Database,
  Grid2x2,
  Layers,
  Terminal,
} from "lucide-react";
import clsx from "clsx";
import {
  LC_CATEGORIES,
  type LcCategoryId,
  topicsForCategory,
} from "../lib/leetcode-categories";

const CAT_ICONS: Record<LcCategoryId, typeof Layers> = {
  all: Layers,
  algorithms: Binary,
  database: Database,
  shell: Terminal,
  concurrency: Grid2x2,
  pandas: BarChart3,
};

interface TopicBrowserProps {
  topicCounts: Array<[string, number]>;
  activeTopic: string;
  activeCategory: LcCategoryId;
  onTopic: (topic: string) => void;
  onCategory: (category: LcCategoryId) => void;
  /** How many tags to show when collapsed */
  collapsedCount?: number;
}

export function TopicBrowser({
  topicCounts,
  activeTopic,
  activeCategory,
  onTopic,
  onCategory,
  collapsedCount = 18,
}: TopicBrowserProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleTopics = useMemo(
    () => topicsForCategory(topicCounts, activeCategory),
    [topicCounts, activeCategory]
  );

  const shown = expanded ? visibleTopics : visibleTopics.slice(0, collapsedCount);
  const canToggle = visibleTopics.length > collapsedCount;

  return (
    <div className="lc-topic-browser">
      <div className="lc-topic-cloud">
        {shown.map(([name, count]) => (
          <button
            key={name}
            type="button"
            className={clsx("lc-topic", activeTopic === name && "is-active")}
            onClick={() => onTopic(activeTopic === name ? "All" : name)}
            title={`${name} · ${count.toLocaleString()} problems`}
          >
            {name} <em>{count.toLocaleString()}</em>
          </button>
        ))}
        {canToggle && (
          <button
            type="button"
            className="lc-topic-collapse"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? (
              <>
                Collapse <ChevronUp size={14} />
              </>
            ) : (
              <>
                Expand <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </div>

      <div className="lc-subcats" role="tablist" aria-label="Problem categories">
        {LC_CATEGORIES.map((cat) => {
          const Icon = CAT_ICONS[cat.id];
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={clsx(
                "lc-subcat",
                `lc-subcat--${cat.tone}`,
                active && "is-active"
              )}
              onClick={() => {
                onCategory(cat.id);
                if (activeTopic !== "All") onTopic("All");
              }}
            >
              <Icon size={14} className="lc-subcat__icon" />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

