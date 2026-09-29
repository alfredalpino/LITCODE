/**
 * LeetCode problem-list categories + topic tags
 * (All Topics / Algorithms / Database / Shell / Concurrency / pandas)
 */

export type LcCategoryId =
  | "all"
  | "algorithms"
  | "database"
  | "shell"
  | "concurrency"
  | "pandas";

export type LcCategory = {
  id: LcCategoryId;
  label: string;
  tone: "neutral" | "orange" | "blue" | "green" | "purple" | "violet";
};

export const LC_CATEGORIES: LcCategory[] = [
  { id: "all", label: "All Topics", tone: "neutral" },
  { id: "algorithms", label: "Algorithms", tone: "orange" },
  { id: "database", label: "Database", tone: "blue" },
  { id: "shell", label: "Shell", tone: "green" },
  { id: "concurrency", label: "Concurrency", tone: "purple" },
  { id: "pandas", label: "pandas", tone: "violet" },
];

/** Exclusive non-algorithm categories (LeetCode problem-list tabs) */
export const LC_CATEGORY_TOPICS: Record<
  Exclude<LcCategoryId, "all" | "algorithms">,
  string[]
> = {
  database: ["Database", "SQL"],
  shell: ["Shell", "Bash"],
  concurrency: ["Concurrency", "Multithreading", "Lock"],
  pandas: ["pandas", "Pandas", "DataFrame"],
};

const EXCLUSIVE_SET = new Set(
  Object.values(LC_CATEGORY_TOPICS)
    .flat()
    .map((t) => t.toLowerCase())
);

function norm(t: string) {
  return t.trim().toLowerCase();
}

export function isAlgorithmTopic(topic: string): boolean {
  const n = norm(topic);
  if (!n || n === "none" || n === "interview") return false;
  return !EXCLUSIVE_SET.has(n);
}

export function topicInCategory(topic: string, category: LcCategoryId): boolean {
  if (category === "all") return true;
  if (category === "algorithms") return isAlgorithmTopic(topic);
  return LC_CATEGORY_TOPICS[category].some((t) => norm(t) === norm(topic));
}

export function problemInCategory(
  topics: string[],
  category: LcCategoryId
): boolean {
  if (category === "all") return true;
  if (category === "algorithms") {
    const usable = topics.filter((t) => {
      const n = norm(t);
      return n && n !== "none" && n !== "interview";
    });
    if (!usable.length) return true; // untagged drills stay in Algorithms
    return usable.some(isAlgorithmTopic);
  }
  return topics.some((t) => topicInCategory(t, category));
}

export function topicsForCategory(
  allTopicCounts: Array<[string, number]>,
  category: LcCategoryId
): Array<[string, number]> {
  return allTopicCounts.filter(([name]) => {
    if (norm(name) === "none") return false;
    return topicInCategory(name, category);
  });
}
