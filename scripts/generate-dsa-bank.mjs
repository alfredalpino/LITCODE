#!/usr/bin/env node
/**
 * Generates DSA practice bank: 10,000+ indexed problems.
 * Full bodies stored for curated seeds + compact hydrate stubs for the rest.
 * https://github.com/topics/dsa-questions
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "dsa");
const TARGET = 10000;

const TOPICS = [
  "Array", "Hash Table", "Two Pointers", "Sliding Window", "Stack", "Queue",
  "Linked List", "Binary Tree", "BST", "Heap", "Graph", "BFS", "DFS",
  "Backtracking", "Dynamic Programming", "Greedy", "Binary Search", "Sorting",
  "Bit Manipulation", "Math", "String", "Trie", "Union Find", "Prefix Sum",
  "Monotonic Stack", "Design", "Intervals", "Matrix", "Recursion",
];

const DIFFS = ["Easy", "Medium", "Hard"];

const PACKS_PATH = path.join(OUT, "company-packs.json");
if (!fs.existsSync(PACKS_PATH)) {
  console.error("Missing public/dsa/company-packs.json — run: npm run companies:gen");
  process.exit(1);
}
const COMPANY_PACKS = JSON.parse(fs.readFileSync(PACKS_PATH, "utf8"));

function titleKey(title) {
  return String(title).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function companiesForSlug(slug) {
  const p = COMPANY_PACKS.problems[slug];
  if (!p) return [];
  return p.companies.map((c) => c.name);
}

function frequencyFor(slug, company) {
  const p = COMPANY_PACKS.problems[slug];
  if (!p) return 0;
  const hit = p.companies.find((c) => c.name === company);
  return hit?.frequency ?? 0;
}
const TWISTS = [
  "",
  ". Follow-up: explain the space/time tradeoff aloud as if in an onsite",
  ". Interview twist: stream the input one element at a time",
  ". Follow-up: return the lexicographically smallest answer when ties exist",
  ". Constraint twist: at most O(1) extra memory besides the output",
  ". Production twist: validate untrusted API inputs",
];

const SEEDS = JSON.parse(
  fs.readFileSync(path.join(__dirname, "dsa-seeds.json"), "utf8")
);

const JUDGED = new Set(["pair-sum", "graph-reach", "dp-path", "stack-monotonic", "string-pattern"]);

const PATTERNS = [
  {
    key: "pair-sum",
    titles: ["Pair Sum Target", "Find Complementary Indices", "Hash Map Pair Lookup", "Two Value Sum Query"],
    topics: ["Array", "Hash Table"],
    fn: "solve",
    difficultyBias: [0.55, 0.35, 0.1],
    descTemplate:
      "You are given an integer array `nums` of length up to {{n}} and a target integer.\n\nReturn indices of two distinct elements that sum to the target{{twist}}. If none exist, return `[-1, -1]`.\n\nOptimize for average `O(n)` with a hash map.",
    starter: {
      javascript: "function solve(nums, target) {\n  \n}\n",
      typescript: "function solve(nums: number[], target: number): number[] {\n  \n}\n",
      python: "from typing import List\n\ndef solve(nums: List[int], target: int) -> List[int]:\n    ...\n",
    },
  },
  {
    key: "window-max",
    titles: ["Longest Window Under Limit", "Shrinkable Window Constraint", "Subarray Score With Bound", "Maximum Window Length Drill"],
    topics: ["Array", "Sliding Window"],
    fn: "solve",
    difficultyBias: [0.35, 0.5, 0.15],
    descTemplate:
      "Given `nums` and `k`, find the maximum length of a contiguous subarray whose sum is ≤ `k`{{twist}}.\n\nLength can reach {{n}}. Use a linear sliding window.",
    starter: {
      javascript: "function solve(nums, k) {\n  \n}\n",
      typescript: "function solve(nums: number[], k: number): number {\n  \n}\n",
      python: "from typing import List\n\ndef solve(nums: List[int], k: int) -> int:\n    ...\n",
    },
  },
  {
    key: "binary-search-answer",
    titles: ["Minimize Maximum Load", "Capacity To Ship Style", "Koko Eating Style", "Split Array Largest Sum Variant"],
    topics: ["Binary Search", "Array", "Greedy"],
    fn: "solve",
    difficultyBias: [0.15, 0.55, 0.3],
    descTemplate:
      "Assign workloads into `m` workers. Return the minimum possible maximum load{{twist}}.\n\nBinary search the answer. Scale ≈ {{n}}.",
    starter: {
      javascript: "function solve(weights, m) {\n  \n}\n",
      typescript: "function solve(weights: number[], m: number): number {\n  \n}\n",
      python: "from typing import List\n\ndef solve(weights: List[int], m: int) -> int:\n    ...\n",
    },
  },
  {
    key: "graph-reach",
    titles: ["Connected Components Count", "Undirected Graph Islands", "Friend Circles Style", "Reachable Clusters"],
    topics: ["Graph", "DFS", "BFS", "Union Find"],
    fn: "solve",
    difficultyBias: [0.25, 0.5, 0.25],
    descTemplate:
      "`n` nodes `0..n-1` and undirected edges. Return the number of connected components{{twist}}. `n` ≤ {{n}}.",
    starter: {
      javascript: "function solve(n, edges) {\n  \n}\n",
      typescript: "function solve(n: number, edges: number[][]): number {\n  \n}\n",
      python: "from typing import List\n\ndef solve(n: int, edges: List[List[int]]) -> int:\n    ...\n",
    },
  },
  {
    key: "dp-path",
    titles: ["Minimum Path Sum Grid", "Grid Path Cost", "Dungeon-Style Path Cost", "Right/Down Path Aggregate"],
    topics: ["Dynamic Programming", "Matrix"],
    fn: "solve",
    difficultyBias: [0.2, 0.5, 0.3],
    descTemplate:
      "Grid of non-negative costs. Move only right/down from top-left to bottom-right. Return min path cost{{twist}}. Size ≈ {{n}}.",
    starter: {
      javascript: "function solve(grid) {\n  \n}\n",
      typescript: "function solve(grid: number[][]): number {\n  \n}\n",
      python: "from typing import List\n\ndef solve(grid: List[List[int]]) -> int:\n    ...\n",
    },
  },
  {
    key: "stack-monotonic",
    titles: ["Daily Temperatures Style", "Next Greater Element Stream", "Monotonic Stack Span", "Nearest Larger Right Neighbor"],
    topics: ["Stack", "Monotonic Stack", "Array"],
    fn: "solve",
    difficultyBias: [0.3, 0.55, 0.15],
    descTemplate:
      "For each index, return steps until a strictly greater value appears to the right (else 0){{twist}}. Length ≤ {{n}}. Monotonic stack.",
    starter: {
      javascript: "function solve(temps) {\n  \n}\n",
      typescript: "function solve(temps: number[]): number[] {\n  \n}\n",
      python: "from typing import List\n\ndef solve(temps: List[int]) -> List[int]:\n    ...\n",
    },
  },
  {
    key: "string-pattern",
    titles: ["Isomorphic Mapping Check", "Pattern Match Frequency", "String Signature Drill", "Bijection Character Map"],
    topics: ["String", "Hash Table"],
    fn: "solve",
    difficultyBias: [0.45, 0.4, 0.15],
    descTemplate:
      "Are strings `s` and `t` isomorphic under a consistent 1:1 mapping?{{twist}} Lengths ≤ {{n}}.",
    starter: {
      javascript: "function solve(s, t) {\n  \n}\n",
      typescript: "function solve(s: string, t: string): boolean {\n  \n}\n",
      python: "def solve(s: str, t: str) -> bool:\n    ...\n",
    },
  },
  {
    key: "heap-topk",
    titles: ["Top K Frequent Elements Drill", "Priority Queue Selection", "Streaming Top-K Tracker", "Bucket Frequency Drill"],
    topics: ["Heap", "Hash Table", "Sorting"],
    fn: "solve",
    difficultyBias: [0.25, 0.55, 0.2],
    descTemplate:
      "Return the `k` most frequent elements from `nums` (any order){{twist}}. `n` ≤ {{n}}.",
    starter: {
      javascript: "function solve(nums, k) {\n  \n}\n",
      typescript: "function solve(nums: number[], k: number): number[] {\n  \n}\n",
      python: "from typing import List\n\ndef solve(nums: List[int], k: int) -> List[int]:\n    ...\n",
    },
  },
  {
    key: "tree-dfs",
    titles: ["Binary Tree Diameter Style", "Max Depth Path Aggregate", "Subtree Path Signature", "Tree Edge Path Length"],
    topics: ["Binary Tree", "DFS", "Recursion"],
    fn: "solve",
    difficultyBias: [0.25, 0.5, 0.25],
    descTemplate:
      "Binary tree as level-order array. Return longest path edge-count between any nodes{{twist}}. Size ≤ {{n}}.",
    starter: {
      javascript: "function solve(levelOrder) {\n  \n}\n",
      typescript: "function solve(levelOrder: (number | null)[]): number {\n  \n}\n",
      python: "from typing import List, Optional\n\ndef solve(levelOrder: List[Optional[int]]) -> int:\n    ...\n",
    },
  },
  {
    key: "backtrack",
    titles: ["Permutations Generation Drill", "Combination Sum Style", "Subset Enumeration Drill", "N-Queens Count Style"],
    topics: ["Backtracking", "Array"],
    fn: "solve",
    difficultyBias: [0.2, 0.45, 0.35],
    descTemplate:
      "Return all permutations of distinct integers{{twist}}. n ≤ 8 — focus on pruning.",
    starter: {
      javascript: "function solve(nums) {\n  \n}\n",
      typescript: "function solve(nums: number[]): number[][] {\n  \n}\n",
      python: "from typing import List\n\ndef solve(nums: List[int]) -> List[List[int]]:\n    ...\n",
    },
  },
];

function pickDiff(bias, r) {
  let x = r;
  for (let i = 0; i < bias.length; i++) {
    x -= bias[i];
    if (x <= 0) return DIFFS[i];
  }
  return "Medium";
}

function hash(n) {
  let x = (n * 2654435761) >>> 0;
  x ^= x >>> 16;
  return x;
}

function buildTests(patternKey, seed) {
  if (patternKey === "pair-sum") {
    const a = (seed % 17) + 2;
    const b = (seed % 13) + 3;
    return [
      { id: "Case 1", input: [[a, b, a + b + 1], a + b], expected: [0, 1] },
      { id: "Case 2", input: [[1, 2, 3], 100], expected: [-1, -1] },
    ];
  }
  if (patternKey === "graph-reach") {
    return [
      { id: "Case 1", input: [5, [[0, 1], [1, 2], [3, 4]]], expected: 2 },
      { id: "Case 2", input: [3, [[0, 1], [1, 2]]], expected: 1 },
    ];
  }
  if (patternKey === "dp-path") {
    return [
      { id: "Case 1", input: [[[1, 3, 1], [1, 5, 1], [4, 2, 1]]], expected: 7 },
      { id: "Case 2", input: [[[1, 2, 3], [4, 5, 6]]], expected: 12 },
    ];
  }
  if (patternKey === "stack-monotonic") {
    return [
      { id: "Case 1", input: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
      { id: "Case 2", input: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
    ];
  }
  if (patternKey === "string-pattern") {
    return [
      { id: "Case 1", input: ["egg", "add"], expected: true },
      { id: "Case 2", input: ["foo", "bar"], expected: false },
      { id: "Case 3", input: ["paper", "title"], expected: true },
    ];
  }
  return [{ id: "Explore", input: [[1, 2, 3], 2], expected: undefined }];
}

fs.mkdirSync(OUT, { recursive: true });

const index = [];
const seedsMap = {};
const seenTitles = new Set();
const seenSlugs = new Set();

for (const seed of SEEDS) {
  const tk = titleKey(seed.title);
  const slug = COMPANY_PACKS.titleIndex[tk];
  const companies = slug
    ? companiesForSlug(slug)
    : Array.isArray(seed.companies)
      ? seed.companies
      : [];
  index.push({
    id: seed.id,
    num: index.length + 1,
    title: seed.title,
    difficulty: seed.difficulty,
    topics: seed.topics,
    companies,
    kind: "seed",
    pattern: seed.pattern || undefined,
    hasJudge: true,
    slug: slug || undefined,
    frequency: slug ? Math.max(0, ...companies.map((c) => frequencyFor(slug, c))) : undefined,
  });
  seedsMap[seed.id] = {
    ...seed,
    companies,
    kind: "seed",
    hasJudge: true,
    slug: slug || undefined,
  };
  seenTitles.add(tk);
  if (slug) seenSlugs.add(slug);
}

// Real company-tagged LeetCode problems — keep only high-signal interview set:
// appears at ≥3 companies OR peak frequency ≥40 (student-reported company tags).
const packSlugs = Object.keys(COMPANY_PACKS.problems).sort();
for (const slug of packSlugs) {
  if (seenSlugs.has(slug)) continue;
  const p = COMPANY_PACKS.problems[slug];
  const tk = titleKey(p.title);
  if (seenTitles.has(tk)) continue;
  const companies = p.companies.map((c) => c.name);
  const maxFreq = Math.max(0, ...p.companies.map((c) => c.frequency || 0));
  const companyCount = companies.length;
  if (companyCount < 3 && maxFreq < 40) continue;
  index.push({
    id: `lc-${slug}`,
    num: index.length + 1,
    title: p.title,
    difficulty: p.difficulty,
    topics: p.topics?.length ? p.topics : ["Interview"],
    companies,
    kind: "leetcode",
    hasJudge: false,
    slug,
    link: p.link,
    frequency: p.companies[0]?.frequency ?? 0,
  });
  seenTitles.add(tk);
  seenSlugs.add(slug);
}

// No synthetic filler bank — interview set only.
const catalogCompanies = COMPANY_PACKS.companies.map((c) => c.name);

fs.writeFileSync(
  path.join(OUT, "index.json"),
  JSON.stringify({
    catalog: {
      generatedAt: new Date().toISOString(),
      total: index.length,
      topics: TOPICS,
      companies: catalogCompanies,
      patterns: PATTERNS.map((p) => p.key),
      companySource: COMPANY_PACKS.source,
      companyCount: COMPANY_PACKS.companyCount,
      companyProblemCount: COMPANY_PACKS.problemCount,
      sourceNote:
        "Interview-crucial DSA set merged from liquidslr/leetcode-company-wise-problems and snehasishroy/leetcode-companywise-interview-questions. Each problem lists only companies that tagged it. Includes curated judged seeds. Filter: ≥3 companies or peak frequency ≥40.",
    },
    index,
  })
);

fs.writeFileSync(path.join(OUT, "seeds.json"), JSON.stringify(seedsMap));
fs.writeFileSync(
  path.join(OUT, "patterns.json"),
  JSON.stringify({ twists: TWISTS, patterns: PATTERNS })
);

// Precompute judged test packs keyed by pattern+seed bucket to keep client light
const testPacks = {};
for (const key of JUDGED) {
  testPacks[key] = {};
  for (let s = 0; s < 64; s++) {
    testPacks[key][s] = buildTests(key, hash(s + 99));
  }
}
fs.writeFileSync(path.join(OUT, "test-packs.json"), JSON.stringify(testPacks));

console.log(
  `DSA interview bank: ${index.length} problems · ${SEEDS.length} judged seeds · company-tagged LC only → public/dsa/`
);
