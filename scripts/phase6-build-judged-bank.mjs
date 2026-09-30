#!/usr/bin/env node
/**
 * Phase 6 — curated auto-judged DSA bank (≥50).
 * Quality bar: pattern teaching, ≥4 tests (Interview: first 2 visible), hints ladder,
 * patternDiscussion. Reference solvers verify every expected before write.
 *
 * Usage: node scripts/phase6-build-judged-bank.mjs
 * Then:  npm run dsa:gen
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { problem, sortNested, sortPair, starters } from "./dsa-seed-builder.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "dsa-seeds.json");

// ─── Reference solvers ───────────────────────────────────────────────

const SEEDS = [
  problem({
    id: "seed-0001",
    title: "Two Sum",
    difficulty: "Easy",
    topics: ["Array", "Hash Table"],
    companies: ["Google", "Amazon", "Meta"],
    functionName: "twoSum",
    pattern: "hashmap",
    description:
      "Given an array of integers `nums` and an integer `target`, return **indices** of the two numbers such that they add up to `target`.\n\nYou may assume each input has **exactly one** solution, and you may not use the same element twice. Return the answer in any order.\n\nBuild the hashmap intuition: as you scan, ask “have I already seen the complement?”",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "Exactly one valid answer exists"],
    hints: [
      "Brute force checks every pair — O(n²). What information would let you skip the inner scan?",
      "Store value → index as you walk left to right. Look up `target - nums[i]` before inserting `nums[i]`.",
      "Insert after the lookup so you never reuse the same index.",
    ],
    patternDiscussion:
      "**Pattern: Hash map complement.** Trade space for a single pass. The invariant is: the map holds every value seen so far with its index. At index `i`, if `target - nums[i]` is present, you are done. This is the gateway pattern for anagrams, two-sum variants, and “seen before” questions.",
    starter: starters(
      "twoSum",
      "(nums, target)",
      "(nums: number[], target: number): number[]",
      "(nums: List[int], target: int) -> List[int]"
    ),
    cases: [
      [[2, 7, 11, 15], 9],
      [[3, 2, 4], 6],
      [[3, 3], 6],
      [[1, 5, 3, 7], 8],
      [[0, 4, 3, 0], 0],
    ],
    solve(nums, target) {
      const map = new Map();
      for (let i = 0; i < nums.length; i++) {
        const need = target - nums[i];
        if (map.has(need)) return [map.get(need), i];
        map.set(nums[i], i);
      }
      return [];
    },
    normalizeExpected: sortPair,
  }),

  problem({
    id: "seed-0002",
    title: "Valid Parentheses",
    difficulty: "Easy",
    topics: ["Stack", "String"],
    companies: ["Amazon", "Bloomberg", "Meta"],
    functionName: "isValid",
    pattern: "stack",
    description:
      "Given a string `s` containing just `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nOpen brackets must be closed by the same type, in the correct order.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 10^4"],
    hints: [
      "Matching must be LIFO — the last open must close first.",
      "Push opens. On a close, the stack top must be its matching open.",
      "Empty stack at the end is required; early empty on close is invalid.",
    ],
    patternDiscussion:
      "**Pattern: Stack matching.** Parentheses, path simplification, and expression evaluation all maintain an ordered unfinished work stack. The invariant: the stack holds unmatched opens in nesting order.",
    starter: starters("isValid", "(s)", "(s: string): boolean", "(s: str) -> bool"),
    cases: [["()"], ["()[]{}"], ["(]"], ["([)]"], ["{[]}"], ["((("], [""]],
    solve(s) {
      const stack = [];
      const map = { ")": "(", "]": "[", "}": "{" };
      for (const c of s) {
        if (c === "(" || c === "[" || c === "{") stack.push(c);
        else {
          if (!stack.length || stack.pop() !== map[c]) return false;
        }
      }
      return stack.length === 0;
    },
  }),

  problem({
    id: "seed-0003",
    title: "Maximum Subarray",
    difficulty: "Medium",
    topics: ["Array", "Dynamic Programming"],
    companies: ["Microsoft", "LinkedIn", "Amazon"],
    functionName: "maxSubArray",
    pattern: "kadane",
    description:
      "Given an integer array `nums`, find the contiguous subarray with the largest sum, and return its **sum**.\n\nLinear time is expected.",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "[4,-1,2,1] sums to 6.",
      },
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    hints: [
      "At each index, decide: extend the previous subarray, or start fresh here?",
      "Track `bestEndingHere = max(x, bestEndingHere + x)` and a global max.",
      "All-negative arrays: the answer is the largest (least negative) element.",
    ],
    patternDiscussion:
      "**Pattern: Kadane / best ending here.** Classic 1D DP where the state collapses to one running value. Name the decision: restart vs extend. Same skeleton shows up in max product subarray with an extra min tracker.",
    starter: starters(
      "maxSubArray",
      "(nums)",
      "(nums: number[]): number",
      "(nums: List[int]) -> int"
    ),
    cases: [
      [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
      [[1]],
      [[5, 4, -1, 7, 8]],
      [[-1, -2, -3]],
      [[1, -1, 1, -1, 1]],
    ],
    solve(nums) {
      let best = nums[0];
      let cur = nums[0];
      for (let i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);
        best = Math.max(best, cur);
      }
      return best;
    },
  }),

  problem({
    id: "seed-0004",
    title: "Merge Intervals",
    difficulty: "Medium",
    topics: ["Array", "Sorting", "Intervals"],
    companies: ["Meta", "Google", "Bloomberg"],
    functionName: "merge",
    pattern: "intervals",
    description:
      "Given `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals and return a covering non-overlapping set sorted by start.",
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
      },
    ],
    constraints: ["1 <= intervals.length <= 10^4"],
    hints: [
      "Sort by start time first — order is the hard part.",
      "Walk sorted intervals; merge when `start <= currentEnd`.",
      "Touching endpoints (`[1,4],[4,5]`) usually merge for closed intervals.",
    ],
    patternDiscussion:
      "**Pattern: Sort + sweep intervals.** After sorting, a single pass maintains the active merged interval. Same skeleton: meeting rooms, insert interval, employee free time.",
    starter: starters(
      "merge",
      "(intervals)",
      "(intervals: number[][]): number[][]",
      "(intervals: List[List[int]]) -> List[List[int]]"
    ),
    cases: [
      [[[1, 3], [2, 6], [8, 10], [15, 18]]],
      [[[1, 4], [4, 5]]],
      [[[1, 4], [0, 2], [3, 5]]],
      [[[1, 1]]],
      [[[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]]],
    ],
    solve(intervals) {
      const sorted = intervals.map((x) => [...x]).sort((a, b) => a[0] - b[0]);
      const out = [sorted[0]];
      for (let i = 1; i < sorted.length; i++) {
        const last = out[out.length - 1];
        const cur = sorted[i];
        if (cur[0] <= last[1]) last[1] = Math.max(last[1], cur[1]);
        else out.push(cur);
      }
      return out;
    },
  }),

  problem({
    id: "seed-0005",
    title: "Binary Search",
    difficulty: "Easy",
    topics: ["Array", "Binary Search"],
    companies: ["Microsoft", "Amazon"],
    functionName: "search",
    pattern: "binary-search",
    description:
      "Given a sorted array `nums` and `target`, return its index or `-1`. Must run in `O(log n)`.",
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
    ],
    constraints: ["1 <= nums.length <= 10^4", "nums sorted ascending"],
    hints: [
      "Maintain inclusive or exclusive bounds consistently — pick one style and stick to it.",
      "Compare `nums[mid]` to target; discard half each step.",
      "Loop while `lo <= hi` (inclusive form). Return mid on equality.",
    ],
    patternDiscussion:
      "**Pattern: Binary search on a sorted range.** The skill is not the template — it is naming the invariant for `lo`/`hi`. Later: search on answer, lower/upper bound, rotated arrays.",
    starter: starters(
      "search",
      "(nums, target)",
      "(nums: number[], target: number): number",
      "(nums: List[int], target: int) -> int"
    ),
    cases: [
      [[-1, 0, 3, 5, 9, 12], 9],
      [[-1, 0, 3, 5, 9, 12], 2],
      [[5], 5],
      [[5], -5],
      [[1, 2, 3, 4, 5, 6, 7], 1],
    ],
    solve(nums, target) {
      let lo = 0;
      let hi = nums.length - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
      }
      return -1;
    },
  }),

  problem({
    id: "seed-0006",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topics: ["Array", "Dynamic Programming"],
    companies: ["Amazon", "Meta", "Bloomberg"],
    functionName: "maxProfit",
    pattern: "running-min",
    description:
      "Given daily `prices`, buy once and sell later for maximum profit. Return `0` if no profit is possible.",
    examples: [{ input: "prices = [7,1,5,3,6,4]", output: "5" }],
    constraints: ["1 <= prices.length <= 10^5"],
    hints: [
      "You only need the cheapest price seen so far before today.",
      "Track `minPrice` and `best = max(best, price - minPrice)`.",
      "If prices only fall, answer is 0.",
    ],
    patternDiscussion:
      "**Pattern: Running minimum / one-pass state.** Same family as Kadane: maintain the best prefix fact you need. Interview follow-up: at most two transactions → more DP states.",
    starter: starters(
      "maxProfit",
      "(prices)",
      "(prices: number[]): number",
      "(prices: List[int]) -> int"
    ),
    cases: [
      [[7, 1, 5, 3, 6, 4]],
      [[7, 6, 4, 3, 1]],
      [[1, 2]],
      [[2, 1, 2, 1, 0, 1, 2]],
      [[3, 3, 3]],
    ],
    solve(prices) {
      let minP = Infinity;
      let best = 0;
      for (const p of prices) {
        minP = Math.min(minP, p);
        best = Math.max(best, p - minP);
      }
      return best;
    },
  }),

  problem({
    id: "seed-0007",
    title: "Number of Islands",
    difficulty: "Medium",
    topics: ["Matrix", "DFS", "BFS"],
    companies: ["Amazon", "Google", "Meta"],
    functionName: "numIslands",
    pattern: "grid-dfs",
    description:
      "Given a grid of `'1'` (land) and `'0'` (water), return the number of islands formed by horizontally/vertically connected land.",
    examples: [{ input: "one connected landmass", output: "1" }],
    constraints: ["1 <= m, n <= 300"],
    hints: [
      "Each unvisited land cell starts a new island.",
      "Flood-fill (DFS/BFS) marks the whole component so you do not recount.",
      "Mutate the grid or keep a visited set — either is fine in interview if you say so.",
    ],
    patternDiscussion:
      "**Pattern: Grid flood fill / connected components.** Count components by launching DFS/BFS from each unvisited land. Same idea: number of provinces, surrounded regions, max area of island.",
    starter: starters(
      "numIslands",
      "(grid)",
      "(grid: string[][]): number",
      "(grid: List[List[str]]) -> int"
    ),
    cases: [
      [
        [
          ["1", "1", "1", "1", "0"],
          ["1", "1", "0", "1", "0"],
          ["1", "1", "0", "0", "0"],
          ["0", "0", "0", "0", "0"],
        ],
      ],
      [
        [
          ["1", "1", "0", "0", "0"],
          ["1", "1", "0", "0", "0"],
          ["0", "0", "1", "0", "0"],
          ["0", "0", "0", "1", "1"],
        ],
      ],
      [[["0"]]],
      [[["1"]]],
      [
        [
          ["1", "0", "1"],
          ["0", "1", "0"],
          ["1", "0", "1"],
        ],
      ],
    ],
    solve(grid) {
      const g = grid.map((r) => [...r]);
      const m = g.length;
      const n = g[0].length;
      const dfs = (i, j) => {
        if (i < 0 || j < 0 || i >= m || j >= n || g[i][j] !== "1") return;
        g[i][j] = "0";
        dfs(i + 1, j);
        dfs(i - 1, j);
        dfs(i, j + 1);
        dfs(i, j - 1);
      };
      let count = 0;
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          if (g[i][j] === "1") {
            count++;
            dfs(i, j);
          }
        }
      }
      return count;
    },
  }),

  problem({
    id: "seed-0008",
    title: "Climbing Stairs",
    difficulty: "Easy",
    topics: ["Dynamic Programming", "Math"],
    companies: ["Adobe", "Apple"],
    functionName: "climbStairs",
    pattern: "1d-dp",
    description:
      "A staircase has `n` steps. You can climb 1 or 2 steps at a time. How many distinct ways to reach the top?",
    examples: [
      { input: "n = 2", output: "2" },
      { input: "n = 3", output: "3" },
    ],
    constraints: ["1 <= n <= 45"],
    hints: [
      "Ways(n) = Ways(n-1) + Ways(n-2) — Fibonacci.",
      "You only need the previous two values.",
      "Base: n=1 → 1, n=2 → 2.",
    ],
    patternDiscussion:
      "**Pattern: 1D recurrence / Fibonacci DP.** State = number of ways to reach step i. Transition from allowed step sizes. First DP muscle-memory problem.",
    starter: starters("climbStairs", "(n)", "(n: number): number", "(n: int) -> int"),
    cases: [[2], [3], [5], [1], [10]],
    solve(n) {
      if (n <= 2) return n;
      let a = 1;
      let b = 2;
      for (let i = 3; i <= n; i++) {
        const c = a + b;
        a = b;
        b = c;
      }
      return b;
    },
  }),

  problem({
    id: "seed-0009",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topics: ["String", "Sliding Window", "Hash Table"],
    companies: ["Amazon", "Bloomberg", "Adobe"],
    functionName: "lengthOfLongestSubstring",
    pattern: "sliding-window",
    description:
      "Find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3" },
      { input: 's = "bbbbb"', output: "1" },
    ],
    constraints: ["0 <= s.length <= 5 * 10^4"],
    hints: [
      "Grow a window `[left, right]` while all chars inside are unique.",
      "When you see a duplicate, advance `left` past the previous occurrence.",
      "Map char → last index; set `left = max(left, lastIndex + 1)`.",
    ],
    patternDiscussion:
      "**Pattern: Variable sliding window.** Maintain the longest valid window under a uniqueness constraint. Shrink from the left when the invariant breaks. Sibling problems: longest with at most K distinct, min window substring.",
    starter: starters(
      "lengthOfLongestSubstring",
      "(s)",
      "(s: string): number",
      "(s: str) -> int"
    ),
    cases: [["abcabcbb"], ["bbbbb"], ["pwwkew"], [""], ["au"], ["dvdf"]],
    solve(s) {
      const last = new Map();
      let left = 0;
      let best = 0;
      for (let right = 0; right < s.length; right++) {
        const c = s[right];
        if (last.has(c) && last.get(c) >= left) left = last.get(c) + 1;
        last.set(c, right);
        best = Math.max(best, right - left + 1);
      }
      return best;
    },
  }),

  problem({
    id: "seed-0010",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    topics: ["Array", "Prefix Sum"],
    companies: ["Meta", "Apple", "Amazon"],
    functionName: "productExceptSelf",
    pattern: "prefix-suffix",
    description:
      "Return `answer` where `answer[i]` is the product of all `nums` elements except `nums[i]`. `O(n)` time, **no division**.",
    examples: [{ input: "nums = [1,2,3,4]", output: "[24,12,8,6]" }],
    constraints: ["2 <= nums.length <= 10^5"],
    hints: [
      "answer[i] = (product of left of i) × (product of right of i).",
      "First pass: fill left products into the output array.",
      "Second pass: multiply by a running right product.",
    ],
    patternDiscussion:
      "**Pattern: Prefix/suffix products.** Two linear passes replace division and handle zeros cleanly. General idea: precompute directional aggregates.",
    starter: starters(
      "productExceptSelf",
      "(nums)",
      "(nums: number[]): number[]",
      "(nums: List[int]) -> List[int]"
    ),
    cases: [
      [[1, 2, 3, 4]],
      [[-1, 1, 0, -3, 3]],
      [[2, 3]],
      [[0, 0]],
      [[4, 5, 1, 8, 2]],
    ],
    solve(nums) {
      const n = nums.length;
      const out = Array(n).fill(1);
      let left = 1;
      for (let i = 0; i < n; i++) {
        out[i] = left;
        left *= nums[i];
      }
      let right = 1;
      for (let i = n - 1; i >= 0; i--) {
        out[i] *= right;
        right *= nums[i];
      }
      return out;
    },
  }),
];

// Continue with seeds 0011–0052 in same file via push
function add(spec) {
  SEEDS.push(problem(spec));
}

add({
  id: "seed-0011",
  title: "Contains Duplicate",
  difficulty: "Easy",
  topics: ["Array", "Hash Table"],
  companies: ["Amazon", "Apple"],
  functionName: "containsDuplicate",
  pattern: "hashmap",
  description: "Return `true` if any value appears at least twice in `nums`.",
  examples: [{ input: "nums = [1,2,3,1]", output: "true" }],
  constraints: ["1 <= nums.length <= 10^5"],
  hints: [
    "Sorting makes neighbors equal — or use a set.",
    "Insert into a set; if already present, duplicate found.",
    "Space vs time: set is O(n), sort is O(n log n) with O(1) extra if allowed to mutate.",
  ],
  patternDiscussion:
    "**Pattern: Membership set.** Detect duplicates / uniqueness with a hash set. Precursor to consecutive sequence and anagram frequency maps.",
  starter: starters(
    "containsDuplicate",
    "(nums)",
    "(nums: number[]): boolean",
    "(nums: List[int]) -> bool"
  ),
  cases: [[[1, 2, 3, 1]], [[1, 2, 3, 4]], [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], [[0]]],
  solve(nums) {
    const s = new Set();
    for (const x of nums) {
      if (s.has(x)) return true;
      s.add(x);
    }
    return false;
  },
});

add({
  id: "seed-0012",
  title: "Valid Anagram",
  difficulty: "Easy",
  topics: ["String", "Hash Table"],
  companies: ["Bloomberg", "Amazon"],
  functionName: "isAnagram",
  pattern: "hashmap",
  description: "Return `true` if `t` is an anagram of `s` (same multiset of characters).",
  examples: [{ input: 's = "anagram", t = "nagaram"', output: "true" }],
  constraints: ["1 <= s.length, t.length <= 5 * 10^4", "lowercase English letters"],
  hints: [
    "Lengths must match first.",
    "Count frequencies of s; decrement with t.",
    "Any negative count or leftover means not anagram.",
  ],
  patternDiscussion:
    "**Pattern: Frequency map / signature.** Anagrams share a count vector. Same tool for group anagrams (key = sorted string or count tuple).",
  starter: starters(
    "isAnagram",
    "(s, t)",
    "(s: string, t: string): boolean",
    "(s: str, t: str) -> bool"
  ),
  cases: [
    ["anagram", "nagaram"],
    ["rat", "car"],
    ["a", "a"],
    ["ab", "a"],
    ["listen", "silent"],
  ],
  solve(s, t) {
    if (s.length !== t.length) return false;
    const c = Array(26).fill(0);
    for (let i = 0; i < s.length; i++) {
      c[s.charCodeAt(i) - 97]++;
      c[t.charCodeAt(i) - 97]--;
    }
    return c.every((x) => x === 0);
  },
});

add({
  id: "seed-0013",
  title: "Group Anagrams",
  difficulty: "Medium",
  topics: ["String", "Hash Table"],
  companies: ["Meta", "Amazon"],
  functionName: "groupAnagrams",
  pattern: "hashmap",
  description:
    "Group the strings in `strs` that are anagrams of each other. Return the groups in any order; order inside a group may be any.",
  examples: [
    {
      input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
      output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
    },
  ],
  constraints: ["1 <= strs.length <= 10^4"],
  hints: [
    "Choose a canonical key per anagram class.",
    "Sorted characters of the word is a simple key.",
    "Map key → list of words; return the lists.",
  ],
  patternDiscussion:
    "**Pattern: Hash by signature.** Bucket by an invariant of the anagram class. Sorting key is clear; count-tuple key is faster asymptotically for fixed alphabet.",
  starter: starters(
    "groupAnagrams",
    "(strs)",
    "(strs: string[]): string[][]",
    "(strs: List[str]) -> List[List[str]]"
  ),
  cases: [
    [["eat", "tea", "tan", "ate", "nat", "bat"]],
    [[""]],
    [["a"]],
    [["abc", "bca", "cab", "xyz"]],
    [["ddddddddddg", "dgggggggggg"]],
  ],
  solve(strs) {
    const map = new Map();
    for (const w of strs) {
      const key = [...w].sort().join("");
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(w);
    }
    return [...map.values()];
  },
  normalizeExpected(groups) {
    return groups
      .map((g) => [...g].sort())
      .sort((a, b) => a[0].localeCompare(b[0]));
  },
});

add({
  id: "seed-0014",
  title: "Top K Frequent Elements",
  difficulty: "Medium",
  topics: ["Heap", "Hash Table"],
  companies: ["Amazon", "Meta"],
  functionName: "topKFrequent",
  pattern: "heap",
  description:
    "Return the `k` most frequent elements from `nums`. Answer may be returned in any order.",
  examples: [{ input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" }],
  constraints: ["1 <= nums.length <= 10^5", "k is in the valid range"],
  hints: [
    "Count frequencies first.",
    "Bucket sort by frequency, or use a heap of size k.",
    "With buckets of size n+1, collecting from high freq is O(n).",
  ],
  patternDiscussion:
    "**Pattern: Frequency + selection (heap / bucket).** Hash for counts, then select top-k. Interview: defend heap vs bucket vs full sort.",
  starter: starters(
    "topKFrequent",
    "(nums, k)",
    "(nums: number[], k: number): number[]",
    "(nums: List[int], k: int) -> List[int]"
  ),
  cases: [
    [[1, 1, 1, 2, 2, 3], 2],
    [[1], 1],
    [[4, 4, 4, 5, 5, 6], 1],
    [[1, 2, 3, 4, 5], 5],
    [[7, 7, 7, 7, 8, 8, 9], 2],
  ],
  solve(nums, k) {
    const freq = new Map();
    for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);
    return [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, k)
      .map(([v]) => v);
  },
  normalizeExpected: (a) => [...a].sort((x, y) => x - y),
});

add({
  id: "seed-0015",
  title: "Longest Consecutive Sequence",
  difficulty: "Medium",
  topics: ["Array", "Hash Table"],
  companies: ["Google", "Amazon"],
  functionName: "longestConsecutive",
  pattern: "hashmap",
  description:
    "Given unsorted `nums`, return the length of the longest sequence of consecutive integers. Aim for `O(n)`.",
  examples: [{ input: "nums = [100,4,200,1,3,2]", output: "4" }],
  constraints: ["0 <= nums.length <= 10^5"],
  hints: [
    "Put numbers in a set for O(1) membership.",
    "Only start a run from `x` when `x-1` is absent.",
    "Walk forward while `x+1` exists; track max length.",
  ],
  patternDiscussion:
    "**Pattern: Set + start-of-run scan.** Avoid O(n log n) sort by only expanding sequences from true starts. Linear amortized over the set.",
  starter: starters(
    "longestConsecutive",
    "(nums)",
    "(nums: number[]): number",
    "(nums: List[int]) -> int"
  ),
  cases: [
    [[100, 4, 200, 1, 3, 2]],
    [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]],
    [[]],
    [[1]],
    [[9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]],
  ],
  solve(nums) {
    const set = new Set(nums);
    let best = 0;
    for (const x of set) {
      if (set.has(x - 1)) continue;
      let len = 1;
      let y = x;
      while (set.has(y + 1)) {
        y++;
        len++;
      }
      best = Math.max(best, len);
    }
    return best;
  },
});

add({
  id: "seed-0016",
  title: "Valid Palindrome",
  difficulty: "Easy",
  topics: ["String", "Two Pointers"],
  companies: ["Meta", "Microsoft"],
  functionName: "isPalindrome",
  pattern: "two-pointers",
  description:
    "Return `true` if `s` is a palindrome after converting to lowercase and removing all non-alphanumeric characters.",
  examples: [
    { input: 's = "A man, a plan, a canal: Panama"', output: "true" },
  ],
  constraints: ["1 <= s.length <= 2 * 10^5"],
  hints: [
    "Two pointers from both ends.",
    "Skip non-alphanumeric characters as you go.",
    "Compare lowercased characters.",
  ],
  patternDiscussion:
    "**Pattern: Opposite two pointers.** Converge from ends under a filter. Same motion: container with most water, reverse words, many string cleans.",
  starter: starters(
    "isPalindrome",
    "(s)",
    "(s: string): boolean",
    "(s: str) -> bool"
  ),
  cases: [
    ["A man, a plan, a canal: Panama"],
    ["race a car"],
    [" "],
    ["0P"],
    ["ab_a"],
  ],
  solve(s) {
    let lo = 0;
    let hi = s.length - 1;
    const ok = (c) => /[a-z0-9]/i.test(c);
    while (lo < hi) {
      while (lo < hi && !ok(s[lo])) lo++;
      while (lo < hi && !ok(s[hi])) hi--;
      if (s[lo].toLowerCase() !== s[hi].toLowerCase()) return false;
      lo++;
      hi--;
    }
    return true;
  },
});

add({
  id: "seed-0017",
  title: "Two Sum II — Sorted Input",
  difficulty: "Easy",
  topics: ["Array", "Two Pointers"],
  companies: ["Amazon"],
  functionName: "twoSumSorted",
  pattern: "two-pointers",
  description:
    "`numbers` is sorted ascending. Return **1-indexed** indices of two numbers that sum to `target`. Exactly one solution. Use constant extra space.",
  examples: [{ input: "numbers = [2,7,11,15], target = 9", output: "[1,2]" }],
  constraints: ["2 <= numbers.length <= 3 * 10^4", "Exactly one solution"],
  hints: [
    "Hash map works but wastes the sorted property.",
    "Left + right pointers: if sum too small, move left; too big, move right.",
    "Return 1-based indices.",
  ],
  patternDiscussion:
    "**Pattern: Two pointers on sorted array.** Monotonic motion because the array is sorted. Contrast with hash-map Two Sum on unsorted input.",
  starter: starters(
    "twoSumSorted",
    "(numbers, target)",
    "(numbers: number[], target: number): number[]",
    "(numbers: List[int], target: int) -> List[int]"
  ),
  cases: [
    [[2, 7, 11, 15], 9],
    [[2, 3, 4], 6],
    [[-1, 0], -1],
    [[1, 2, 3, 4, 4, 9, 56, 90], 8],
    [[5, 25, 75], 100],
  ],
  solve(numbers, target) {
    let lo = 0;
    let hi = numbers.length - 1;
    while (lo < hi) {
      const sum = numbers[lo] + numbers[hi];
      if (sum === target) return [lo + 1, hi + 1];
      if (sum < target) lo++;
      else hi--;
    }
    return [];
  },
});

add({
  id: "seed-0018",
  title: "3Sum",
  difficulty: "Medium",
  topics: ["Array", "Two Pointers"],
  companies: ["Meta", "Amazon", "Microsoft"],
  functionName: "threeSum",
  pattern: "two-pointers",
  description:
    "Return all unique triplets `[a,b,c]` such that `a + b + c = 0`. Triplets must be unique (no duplicate triplets in the result).",
  examples: [
    { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
  ],
  constraints: ["3 <= nums.length <= 3000"],
  hints: [
    "Sort first.",
    "Fix one index; two-sum the rest with pointers.",
    "Skip duplicate values for the fixed index and for both pointers.",
  ],
  patternDiscussion:
    "**Pattern: Sort + two pointers k-sum.** Reduce 3Sum to 2Sum on a suffix. Deduping is the interview trap — skip equal neighbors deliberately.",
  starter: starters(
    "threeSum",
    "(nums)",
    "(nums: number[]): number[][]",
    "(nums: List[int]) -> List[List[int]]"
  ),
  cases: [
    [[-1, 0, 1, 2, -1, -4]],
    [[0, 1, 1]],
    [[0, 0, 0]],
    [[-2, 0, 1, 1, 2]],
    [[1, 2, -2, -1]],
  ],
  solve(nums) {
    const a = [...nums].sort((x, y) => x - y);
    const out = [];
    for (let i = 0; i < a.length; i++) {
      if (i > 0 && a[i] === a[i - 1]) continue;
      let lo = i + 1;
      let hi = a.length - 1;
      while (lo < hi) {
        const sum = a[i] + a[lo] + a[hi];
        if (sum === 0) {
          out.push([a[i], a[lo], a[hi]]);
          lo++;
          hi--;
          while (lo < hi && a[lo] === a[lo - 1]) lo++;
          while (lo < hi && a[hi] === a[hi + 1]) hi--;
        } else if (sum < 0) lo++;
        else hi--;
      }
    }
    return out;
  },
  normalizeExpected: sortNested,
});

add({
  id: "seed-0019",
  title: "Container With Most Water",
  difficulty: "Medium",
  topics: ["Array", "Two Pointers"],
  companies: ["Amazon", "Bloomberg"],
  functionName: "maxArea",
  pattern: "two-pointers",
  description:
    "`height[i]` is a vertical line at x = i. Choose two lines that form a container with the x-axis holding the most water. Return that max area.",
  examples: [{ input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" }],
  constraints: ["2 <= height.length <= 10^5"],
  hints: [
    "Area = min(h[lo], h[hi]) * (hi - lo).",
    "Start at both ends; move the shorter line inward.",
    "Why shorter? The width shrinks; only a taller replacement can improve.",
  ],
  patternDiscussion:
    "**Pattern: Two pointers greedy on width.** Always advance the limiting side. Proof sketch: any better pair for the shorter line must be inside, but width is smaller with height ≤ current short.",
  starter: starters(
    "maxArea",
    "(height)",
    "(height: number[]): number",
    "(height: List[int]) -> int"
  ),
  cases: [
    [[1, 8, 6, 2, 5, 4, 8, 3, 7]],
    [[1, 1]],
    [[4, 3, 2, 1, 4]],
    [[1, 2, 1]],
    [[2, 3, 4, 5, 18, 17, 6]],
  ],
  solve(height) {
    let lo = 0;
    let hi = height.length - 1;
    let best = 0;
    while (lo < hi) {
      best = Math.max(best, Math.min(height[lo], height[hi]) * (hi - lo));
      if (height[lo] < height[hi]) lo++;
      else hi--;
    }
    return best;
  },
});

add({
  id: "seed-0020",
  title: "Move Zeroes",
  difficulty: "Easy",
  topics: ["Array", "Two Pointers"],
  companies: ["Meta", "Apple"],
  functionName: "moveZeroes",
  pattern: "two-pointers",
  description:
    "Move all zeros in `nums` to the end while preserving the relative order of non-zeros. Modify in place and **return the array**.",
  examples: [{ input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" }],
  constraints: ["1 <= nums.length <= 10^4"],
  hints: [
    "Write non-zeros into the next free write index.",
    "Fill the rest with zeros.",
    "Same-direction two pointers / stable partition.",
  ],
  patternDiscussion:
    "**Pattern: Same-direction two pointers (partition).** `write` lags behind `read`. Stable compaction shows up in remove element, remove duplicates sorted, Dutch flag.",
  starter: starters(
    "moveZeroes",
    "(nums)",
    "(nums: number[]): number[]",
    "(nums: List[int]) -> List[int]"
  ),
  cases: [
    [[0, 1, 0, 3, 12]],
    [[0]],
    [[1, 2, 3]],
    [[0, 0, 1]],
    [[4, 0, 5, 0, 0, 6]],
  ],
  solve(nums) {
    const a = [...nums];
    let w = 0;
    for (let r = 0; r < a.length; r++) {
      if (a[r] !== 0) a[w++] = a[r];
    }
    while (w < a.length) a[w++] = 0;
    return a;
  },
});

add({
  id: "seed-0021",
  title: "Remove Duplicates from Sorted Array",
  difficulty: "Easy",
  topics: ["Array", "Two Pointers"],
  companies: ["Microsoft", "Amazon"],
  functionName: "removeDuplicates",
  pattern: "two-pointers",
  description:
    "`nums` is sorted. Remove duplicates **in place** so each unique appears once. Return the new length `k`; the first `k` entries of the returned array must hold the unique values in order. (Return the full array after compaction for this judge.)",
  examples: [{ input: "nums = [1,1,2]", output: "[1,2]" }],
  constraints: ["1 <= nums.length <= 3 * 10^4"],
  hints: [
    "Slow pointer marks the end of the unique prefix.",
    "When nums[fast] differs from nums[slow], advance slow and copy.",
    "Return the unique prefix (length k).",
  ],
  patternDiscussion:
    "**Pattern: Slow/fast on sorted data.** Sorted adjacency makes uniqueness local. Extension: allow at most two duplicates.",
  starter: starters(
    "removeDuplicates",
    "(nums)",
    "(nums: number[]): number[]",
    "(nums: List[int]) -> List[int]"
  ),
  cases: [
    [[1, 1, 2]],
    [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]],
    [[1]],
    [[1, 2, 3]],
    [[2, 2, 2, 2]],
  ],
  solve(nums) {
    if (!nums.length) return [];
    const a = [...nums];
    let slow = 0;
    for (let fast = 1; fast < a.length; fast++) {
      if (a[fast] !== a[slow]) a[++slow] = a[fast];
    }
    return a.slice(0, slow + 1);
  },
});

add({
  id: "seed-0022",
  title: "Trapping Rain Water",
  difficulty: "Hard",
  topics: ["Array", "Two Pointers", "Stack"],
  companies: ["Amazon", "Google", "Bloomberg"],
  functionName: "trap",
  pattern: "two-pointers",
  description:
    "Given `height` of elevation map bars of width 1, compute how much water it can trap after raining.",
  examples: [{ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }],
  constraints: ["0 <= height.length <= 2 * 10^4"],
  hints: [
    "Water at i is min(leftMax, rightMax) - height[i] (if positive).",
    "Two pointers can track leftMax/rightMax without extra arrays.",
    "Process the side with the smaller max — that side's water is decided.",
  ],
  patternDiscussion:
    "**Pattern: Two pointers with bounding maxima.** Hard variant of container water. Alternative: monotonic stack of indices for next greater bars.",
  starter: starters(
    "trap",
    "(height)",
    "(height: number[]): number",
    "(height: List[int]) -> int"
  ),
  cases: [
    [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]],
    [[4, 2, 0, 3, 2, 5]],
    [[]],
    [[5]],
    [[5, 4, 1, 2]],
  ],
  solve(height) {
    let lo = 0;
    let hi = height.length - 1;
    let leftMax = 0;
    let rightMax = 0;
    let water = 0;
    while (lo < hi) {
      if (height[lo] < height[hi]) {
        if (height[lo] >= leftMax) leftMax = height[lo];
        else water += leftMax - height[lo];
        lo++;
      } else {
        if (height[hi] >= rightMax) rightMax = height[hi];
        else water += rightMax - height[hi];
        hi--;
      }
    }
    return water;
  },
});

add({
  id: "seed-0023",
  title: "Daily Temperatures",
  difficulty: "Medium",
  topics: ["Stack", "Monotonic Stack"],
  companies: ["Meta", "Amazon"],
  functionName: "dailyTemperatures",
  pattern: "monotonic-stack",
  description:
    "For each day, return how many days you wait until a warmer temperature. If none, 0.",
  examples: [
    {
      input: "temperatures = [73,74,75,71,69,72,76,73]",
      output: "[1,1,4,2,1,1,0,0]",
    },
  ],
  constraints: ["1 <= temperatures.length <= 10^5"],
  hints: [
    "Maintain indices of unresolved days in decreasing temperature order.",
    "When a warmer day arrives, pop and fill answers.",
    "Stack stores candidates waiting for a greater element to the right.",
  ],
  patternDiscussion:
    "**Pattern: Monotonic stack (next greater).** Store indices while the stack stays monotone. Classic: next greater element, stock span, largest rectangle in histogram.",
  starter: starters(
    "dailyTemperatures",
    "(temperatures)",
    "(temperatures: number[]): number[]",
    "(temperatures: List[int]) -> List[int]"
  ),
  cases: [
    [[73, 74, 75, 71, 69, 72, 76, 73]],
    [[30, 40, 50, 60]],
    [[30, 60, 90]],
    [[90, 80, 70]],
    [[55, 38, 53, 81, 61, 93, 97, 32, 43, 78]],
  ],
  solve(temps) {
    const n = temps.length;
    const ans = Array(n).fill(0);
    const stack = [];
    for (let i = 0; i < n; i++) {
      while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
        const j = stack.pop();
        ans[j] = i - j;
      }
      stack.push(i);
    }
    return ans;
  },
});

add({
  id: "seed-0024",
  title: "Min Stack",
  difficulty: "Medium",
  topics: ["Stack", "Design"],
  companies: ["Amazon", "Bloomberg"],
  functionName: "minStackOps",
  pattern: "stack",
  description:
    "Simulate a MinStack. You receive `ops`: a list of `[op, value?]` where op is `\"push\"`, `\"pop\"`, `\"top\"`, or `\"getMin\"`. Return the list of results from `top` and `getMin` (ignore push/pop). `getMin` must be O(1).",
  examples: [
    {
      input: 'ops = [["push",-2],["push",0],["push",-3],["getMin"],["pop"],["top"],["getMin"]]',
      output: "[-3,0,-2]",
    },
  ],
  constraints: ["Operations are valid (no pop/top/getMin on empty)"],
  hints: [
    "Keep a parallel stack of minima.",
    "On push, push min(x, currentMin) onto the min stack.",
    "On pop, pop both stacks.",
  ],
  patternDiscussion:
    "**Pattern: Augmented stack.** Store auxiliary state with each push so queries are O(1). Same idea: max stack, queue via two stacks.",
  starter: starters(
    "minStackOps",
    "(ops)",
    "(ops: [string, number?][]): number[]",
    "(ops: List[List]) -> List[int]"
  ),
  cases: [
    [
      [
        ["push", -2],
        ["push", 0],
        ["push", -3],
        ["getMin"],
        ["pop"],
        ["top"],
        ["getMin"],
      ],
    ],
    [[["push", 1], ["push", 2], ["top"], ["getMin"], ["pop"], ["getMin"]]],
    [[["push", 0], ["push", 1], ["push", 0], ["getMin"], ["pop"], ["getMin"]]],
    [[["push", 5], ["getMin"], ["top"]]],
  ],
  solve(ops) {
    const st = [];
    const mn = [];
    const out = [];
    for (const op of ops) {
      const name = op[0];
      if (name === "push") {
        const x = op[1];
        st.push(x);
        mn.push(mn.length ? Math.min(mn[mn.length - 1], x) : x);
      } else if (name === "pop") {
        st.pop();
        mn.pop();
      } else if (name === "top") out.push(st[st.length - 1]);
      else if (name === "getMin") out.push(mn[mn.length - 1]);
    }
    return out;
  },
});

add({
  id: "seed-0025",
  title: "Evaluate Reverse Polish Notation",
  difficulty: "Medium",
  topics: ["Stack", "Math"],
  companies: ["Amazon", "LinkedIn"],
  functionName: "evalRPN",
  pattern: "stack",
  description:
    "Evaluate an arithmetic expression in Reverse Polish Notation. Valid operators: `+`, `-`, `*`, `/`. Division truncates toward zero. Tokens are strings.",
  examples: [{ input: 'tokens = ["2","1","+","3","*"]', output: "9" }],
  constraints: ["1 <= tokens.length <= 10^4"],
  hints: [
    "Push numbers; on operator, pop two operands.",
    "Order matters for `-` and `/`: first popped is right operand.",
    "Truncate toward zero: use truncating division, not floor for negatives.",
  ],
  patternDiscussion:
    "**Pattern: Stack expression evaluation.** Postfix maps naturally to a stack. Same family as calculator with parentheses (shunting / two stacks).",
  starter: starters(
    "evalRPN",
    "(tokens)",
    "(tokens: string[]): number",
    "(tokens: List[str]) -> int"
  ),
  cases: [
    [["2", "1", "+", "3", "*"]],
    [["4", "13", "5", "/", "+"]],
    [["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]],
    [["3", "-4", "+"]],
    [["4", "-2", "/", "2", "*"]],
  ],
  solve(tokens) {
    const st = [];
    for (const t of tokens) {
      if (t === "+" || t === "-" || t === "*" || t === "/") {
        const b = st.pop();
        const a = st.pop();
        let v;
        if (t === "+") v = a + b;
        else if (t === "-") v = a - b;
        else if (t === "*") v = a * b;
        else v = truncDiv(a, b);
        st.push(v);
      } else st.push(Number(t));
    }
    return st[0];
  },
});

function truncDiv(a, b) {
  const q = a / b;
  return q < 0 ? Math.ceil(q) : Math.floor(q);
}

add({
  id: "seed-0026",
  title: "Binary Tree Level Order",
  difficulty: "Medium",
  topics: ["Binary Tree", "BFS"],
  companies: ["Amazon", "Meta"],
  functionName: "levelOrder",
  pattern: "bfs",
  description:
    "Binary tree given as level-order array (`null` for missing). Return values level by level left to right.",
  examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" }],
  constraints: ["Number of nodes in [0, 2000]"],
  hints: [
    "BFS with a queue.",
    "Process exactly `size` nodes per level.",
    "Build children from the array representation carefully.",
  ],
  patternDiscussion:
    "**Pattern: Tree BFS / level sync.** Capture queue size at level start. Foundation for zigzag, right side view, average of levels.",
  starter: starters(
    "levelOrder",
    "(levelOrderArr)",
    "(levelOrderArr: (number|null)[]): number[][]",
    "(levelOrderArr: List[Optional[int]]) -> List[List[int]]"
  ),
  cases: [
    [[3, 9, 20, null, null, 15, 7]],
    [[1]],
    [[]],
    [[1, 2, 3, 4, 5]],
    [[1, null, 2, null, 3]],
  ],
  solve(arr) {
    if (!arr.length || arr[0] == null) return [];
    const nodes = arr.map((v) => (v == null ? null : { v, left: null, right: null }));
    for (let i = 0, j = 1; j < nodes.length; i++) {
      if (!nodes[i]) continue;
      if (j < nodes.length) nodes[i].left = nodes[j++];
      if (j < nodes.length) nodes[i].right = nodes[j++];
    }
    const root = nodes[0];
    const q = [root];
    const out = [];
    while (q.length) {
      const size = q.length;
      const level = [];
      for (let i = 0; i < size; i++) {
        const n = q.shift();
        level.push(n.v);
        if (n.left) q.push(n.left);
        if (n.right) q.push(n.right);
      }
      out.push(level);
    }
    return out;
  },
});

add({
  id: "seed-0027",
  title: "Maximum Depth of Binary Tree",
  difficulty: "Easy",
  topics: ["Binary Tree", "DFS"],
  companies: ["LinkedIn", "Google"],
  functionName: "maxDepth",
  pattern: "tree-dfs",
  description:
    "Binary tree as level-order array. Return its maximum depth (root = depth 1).",
  examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "3" }],
  constraints: ["0 <= nodes <= 10^4"],
  hints: [
    "Depth(null) = 0.",
    "Depth(node) = 1 + max(depth(left), depth(right)).",
    "Iterative BFS also works — count levels.",
  ],
  patternDiscussion:
    "**Pattern: Tree DFS recurrence.** Define answer on null, combine children. Template for diameter, balanced check, path sums.",
  starter: starters(
    "maxDepth",
    "(levelOrderArr)",
    "(levelOrderArr: (number|null)[]): number",
    "(levelOrderArr: List[Optional[int]]) -> int"
  ),
  cases: [
    [[3, 9, 20, null, null, 15, 7]],
    [[1, null, 2]],
    [[]],
    [[1]],
    [[1, 2, 3, 4, null, null, null, 5]],
  ],
  solve(arr) {
    if (!arr.length || arr[0] == null) return 0;
    const nodes = arr.map((v) => (v == null ? null : { v, left: null, right: null }));
    for (let i = 0, j = 1; j < nodes.length; i++) {
      if (!nodes[i]) continue;
      if (j < nodes.length) nodes[i].left = nodes[j++];
      if (j < nodes.length) nodes[i].right = nodes[j++];
    }
    const dfs = (n) => (n ? 1 + Math.max(dfs(n.left), dfs(n.right)) : 0);
    return dfs(nodes[0]);
  },
});

add({
  id: "seed-0028",
  title: "Invert Binary Tree",
  difficulty: "Easy",
  topics: ["Binary Tree", "DFS"],
  companies: ["Google"],
  functionName: "invertTree",
  pattern: "tree-dfs",
  description:
    "Invert a binary tree (swap every left/right). Input and output are level-order arrays (`null` padded only as needed for structure; trailing nulls may be omitted in the sense of compact serialization — return full level-order including nulls for internal missing children up to last real node).",
  examples: [{ input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" }],
  constraints: ["0 <= nodes <= 100"],
  hints: [
    "Swap left and right, then recurse.",
    "Or BFS and swap children at each node.",
    "Serialize carefully after inversion.",
  ],
  patternDiscussion:
    "**Pattern: Structural tree recursion.** Transform both subtrees and recombine. Warm-up for mirror checks and serialize/deserialize.",
  starter: starters(
    "invertTree",
    "(levelOrderArr)",
    "(levelOrderArr: (number|null)[]): (number|null)[]",
    "(levelOrderArr: List[Optional[int]]) -> List[Optional[int]]"
  ),
  cases: [
    [[4, 2, 7, 1, 3, 6, 9]],
    [[2, 1, 3]],
    [[]],
    [[1]],
    [[1, 2]],
  ],
  solve(arr) {
    if (!arr.length || arr[0] == null) return [];
    const nodes = arr.map((v) => (v == null ? null : { v, left: null, right: null }));
    for (let i = 0, j = 1; j < nodes.length; i++) {
      if (!nodes[i]) continue;
      if (j < nodes.length) nodes[i].left = nodes[j++];
      if (j < nodes.length) nodes[i].right = nodes[j++];
    }
    const invert = (n) => {
      if (!n) return null;
      const L = invert(n.left);
      const R = invert(n.right);
      n.left = R;
      n.right = L;
      return n;
    };
    const root = invert(nodes[0]);
    const out = [];
    const q = [root];
    while (q.length) {
      const n = q.shift();
      if (!n) {
        out.push(null);
        continue;
      }
      out.push(n.v);
      q.push(n.left);
      q.push(n.right);
    }
    while (out.length && out[out.length - 1] == null) out.pop();
    return out;
  },
});

add({
  id: "seed-0029",
  title: "Same Tree",
  difficulty: "Easy",
  topics: ["Binary Tree", "DFS"],
  companies: ["Amazon"],
  functionName: "isSameTree",
  pattern: "tree-dfs",
  description:
    "Two trees as level-order arrays. Return whether they are structurally identical with the same node values.",
  examples: [{ input: "p = [1,2,3], q = [1,2,3]", output: "true" }],
  constraints: ["0 <= nodes <= 100"],
  hints: [
    "Both null → true; one null → false.",
    "Values equal and both subtrees same.",
    "BFS pairwise also works.",
  ],
  patternDiscussion:
    "**Pattern: Simultaneous tree walk.** Compare structure and values together. Builds toward subtree-of-another-tree and symmetric tree.",
  starter: starters(
    "isSameTree",
    "(p, q)",
    "(p: (number|null)[], q: (number|null)[]): boolean",
    "(p: List[Optional[int]], q: List[Optional[int]]) -> bool"
  ),
  cases: [
    [[1, 2, 3], [1, 2, 3]],
    [[1, 2], [1, null, 2]],
    [[1, 2, 1], [1, 1, 2]],
    [[], []],
    [[1], [1]],
  ],
  solve(pArr, qArr) {
    const build = (arr) => {
      if (!arr.length || arr[0] == null) return null;
      const nodes = arr.map((v) => (v == null ? null : { v, left: null, right: null }));
      for (let i = 0, j = 1; j < nodes.length; i++) {
        if (!nodes[i]) continue;
        if (j < nodes.length) nodes[i].left = nodes[j++];
        if (j < nodes.length) nodes[i].right = nodes[j++];
      }
      return nodes[0];
    };
    const same = (a, b) => {
      if (!a && !b) return true;
      if (!a || !b || a.v !== b.v) return false;
      return same(a.left, b.left) && same(a.right, b.right);
    };
    return same(build(pArr), build(qArr));
  },
});

add({
  id: "seed-0030",
  title: "Diameter of Binary Tree",
  difficulty: "Medium",
  topics: ["Binary Tree", "DFS"],
  companies: ["Meta", "Google"],
  functionName: "diameterOfBinaryTree",
  pattern: "tree-dfs",
  description:
    "Return the length of the diameter (number of **edges** on the longest path between any two nodes). Tree as level-order array.",
  examples: [{ input: "root = [1,2,3,4,5]", output: "3" }],
  constraints: ["1 <= nodes <= 10^4"],
  hints: [
    "Diameter through a node = leftHeight + rightHeight.",
    "DFS returns height; update global diameter along the way.",
    "Path may not pass through the root.",
  ],
  patternDiscussion:
    "**Pattern: Tree DP on the way up.** Return height to parent; side-effect global best path through node. Same shape: max path sum.",
  starter: starters(
    "diameterOfBinaryTree",
    "(levelOrderArr)",
    "(levelOrderArr: (number|null)[]): number",
    "(levelOrderArr: List[Optional[int]]) -> int"
  ),
  cases: [
    [[1, 2, 3, 4, 5]],
    [[1, 2]],
    [[1]],
    [[1, 2, 3, 4, null, null, 5, 6]],
    [[4, 2, null, 1, 3]],
  ],
  solve(arr) {
    if (!arr.length || arr[0] == null) return 0;
    const nodes = arr.map((v) => (v == null ? null : { v, left: null, right: null }));
    for (let i = 0, j = 1; j < nodes.length; i++) {
      if (!nodes[i]) continue;
      if (j < nodes.length) nodes[i].left = nodes[j++];
      if (j < nodes.length) nodes[i].right = nodes[j++];
    }
    let best = 0;
    const height = (n) => {
      if (!n) return 0;
      const L = height(n.left);
      const R = height(n.right);
      best = Math.max(best, L + R);
      return 1 + Math.max(L, R);
    };
    height(nodes[0]);
    return best;
  },
});

add({
  id: "seed-0031",
  title: "Search in Rotated Sorted Array",
  difficulty: "Medium",
  topics: ["Array", "Binary Search"],
  companies: ["Meta", "Amazon", "Microsoft"],
  functionName: "searchRotated",
  pattern: "binary-search",
  description:
    "`nums` was sorted ascending then rotated at an unknown pivot. Return index of `target` or `-1` in `O(log n)`.",
  examples: [{ input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" }],
  constraints: ["1 <= nums.length <= 5000", "All values unique"],
  hints: [
    "One half of mid is always sorted.",
    "Check which half is sorted; see if target lies in it.",
    "Discard the other half.",
  ],
  patternDiscussion:
    "**Pattern: Binary search with rotated invariant.** Identify the sorted half each step. Sister: find minimum in rotated array.",
  starter: starters(
    "searchRotated",
    "(nums, target)",
    "(nums: number[], target: number): number",
    "(nums: List[int], target: int) -> int"
  ),
  cases: [
    [[4, 5, 6, 7, 0, 1, 2], 0],
    [[4, 5, 6, 7, 0, 1, 2], 3],
    [[1], 0],
    [[1, 3], 3],
    [[5, 1, 3], 5],
  ],
  solve(nums, target) {
    let lo = 0;
    let hi = nums.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (nums[mid] === target) return mid;
      if (nums[lo] <= nums[mid]) {
        if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
        else lo = mid + 1;
      } else {
        if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
        else hi = mid - 1;
      }
    }
    return -1;
  },
});

add({
  id: "seed-0032",
  title: "Find Minimum in Rotated Sorted Array",
  difficulty: "Medium",
  topics: ["Array", "Binary Search"],
  companies: ["Amazon", "Microsoft"],
  functionName: "findMin",
  pattern: "binary-search",
  description:
    "Rotated sorted unique array. Return the minimum element in `O(log n)`.",
  examples: [{ input: "nums = [3,4,5,1,2]", output: "1" }],
  constraints: ["1 <= nums.length <= 5000", "All unique"],
  hints: [
    "If nums[lo] < nums[hi], the range is sorted — min is nums[lo].",
    "If mid > hi value, min is to the right of mid.",
    "Else min is at mid or to the left.",
  ],
  patternDiscussion:
    "**Pattern: Binary search for pivot.** The unsorted boundary hides the minimum. Cleaner than search-rotated because you only chase the drop.",
  starter: starters(
    "findMin",
    "(nums)",
    "(nums: number[]): number",
    "(nums: List[int]) -> int"
  ),
  cases: [
    [[3, 4, 5, 1, 2]],
    [[4, 5, 6, 7, 0, 1, 2]],
    [[11, 13, 15, 17]],
    [[2, 1]],
    [[1]],
  ],
  solve(nums) {
    let lo = 0;
    let hi = nums.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (nums[mid] > nums[hi]) lo = mid + 1;
      else hi = mid;
    }
    return nums[lo];
  },
});

add({
  id: "seed-0033",
  title: "Koko Eating Bananas",
  difficulty: "Medium",
  topics: ["Binary Search", "Array"],
  companies: ["Google", "Amazon"],
  functionName: "minEatingSpeed",
  pattern: "binary-search-answer",
  description:
      "`piles[i]` bananas; Koko eats at speed `k` bananas/hour (one pile per hour, ceil). Return the minimum `k` to finish all piles within `h` hours.",
  examples: [{ input: "piles = [3,6,7,11], h = 8", output: "4" }],
  constraints: ["1 <= piles.length <= 10^4", "piles.length <= h <= 10^9"],
  hints: [
    "Monotonic: larger k always finishes earlier.",
    "Binary search k from 1 to max(pile).",
    "Feasibility: sum(ceil(pile/k)) <= h.",
  ],
  patternDiscussion:
    "**Pattern: Binary search on the answer.** Search the decision space when feasibility is monotone. Same family: ship packages, split array largest sum, capacity problems.",
  starter: starters(
    "minEatingSpeed",
    "(piles, h)",
    "(piles: number[], h: number): number",
    "(piles: List[int], h: int) -> int"
  ),
  cases: [
    [[3, 6, 7, 11], 8],
    [[30, 11, 23, 4, 20], 5],
    [[30, 11, 23, 4, 20], 6],
    [[1, 1, 1, 1], 4],
    [[1000000000], 2],
  ],
  solve(piles, h) {
    let lo = 1;
    let hi = Math.max(...piles);
    const ok = (k) => {
      let hours = 0;
      for (const p of piles) hours += Math.ceil(p / k);
      return hours <= h;
    };
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (ok(mid)) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  },
});

add({
  id: "seed-0034",
  title: "House Robber",
  difficulty: "Medium",
  topics: ["Dynamic Programming", "Array"],
  companies: ["Airbnb", "Amazon"],
  functionName: "rob",
  pattern: "1d-dp",
  description:
    "Houses in a line with `nums[i]` money. Cannot rob adjacent houses. Return max amount.",
  examples: [{ input: "nums = [1,2,3,1]", output: "4" }],
  constraints: ["1 <= nums.length <= 100"],
  hints: [
    "At i: rob i + best(i-2), or skip i take best(i-1).",
    "Keep two rolling variables.",
    "Empty / single house base cases.",
  ],
  patternDiscussion:
    "**Pattern: 1D DP with adjacency constraint.** State = best up to i. Circular variant (House Robber II) runs two linear passes.",
  starter: starters(
    "rob",
    "(nums)",
    "(nums: number[]): number",
    "(nums: List[int]) -> int"
  ),
  cases: [
    [[1, 2, 3, 1]],
    [[2, 7, 9, 3, 1]],
    [[2, 1, 1, 2]],
    [[1]],
    [[0, 0, 0]],
  ],
  solve(nums) {
    let prev2 = 0;
    let prev1 = 0;
    for (const x of nums) {
      const cur = Math.max(prev1, prev2 + x);
      prev2 = prev1;
      prev1 = cur;
    }
    return prev1;
  },
});

add({
  id: "seed-0035",
  title: "House Robber II",
  difficulty: "Medium",
  topics: ["Dynamic Programming", "Array"],
  companies: ["Google", "Amazon"],
  functionName: "robCircular",
  pattern: "1d-dp",
  description:
    "Houses arranged in a **circle** — first and last are adjacent. Return max rob amount.",
  examples: [{ input: "nums = [2,3,2]", output: "3" }],
  constraints: ["1 <= nums.length <= 100"],
  hints: [
    "Cannot take both first and last.",
    "Solve linear robber on range [0..n-2] and [1..n-1]; take max.",
    "n=1 is a special case.",
  ],
  patternDiscussion:
    "**Pattern: Reduce circular to two linear DP runs.** Common trick when endpoints conflict.",
  starter: starters(
    "robCircular",
    "(nums)",
    "(nums: number[]): number",
    "(nums: List[int]) -> int"
  ),
  cases: [
    [[2, 3, 2]],
    [[1, 2, 3, 1]],
    [[1, 2, 3]],
    [[1]],
    [[1, 3, 1, 3, 1]],
  ],
  solve(nums) {
    if (nums.length === 1) return nums[0];
    const linear = (arr) => {
      let a = 0;
      let b = 0;
      for (const x of arr) {
        const c = Math.max(b, a + x);
        a = b;
        b = c;
      }
      return b;
    };
    return Math.max(linear(nums.slice(0, -1)), linear(nums.slice(1)));
  },
});

add({
  id: "seed-0036",
  title: "Coin Change",
  difficulty: "Medium",
  topics: ["Dynamic Programming"],
  companies: ["Amazon", "Microsoft", "Uber"],
  functionName: "coinChange",
  pattern: "1d-dp",
  description:
    "Given coin `coins` and `amount`, return fewest coins to make that amount, or `-1` if impossible. Unlimited supply of each coin.",
  examples: [{ input: "coins = [1,2,5], amount = 11", output: "3" }],
  constraints: ["1 <= coins.length <= 12", "0 <= amount <= 10^4"],
  hints: [
    "dp[x] = min coins to make x.",
    "dp[0]=0; for each coin, update forward.",
    "Unreachable stays Infinity → return -1.",
  ],
  patternDiscussion:
    "**Pattern: Unbounded knapsack / coin DP.** Outer coins or outer amount both work; know the difference vs 0/1 knapsack loop direction.",
  starter: starters(
    "coinChange",
    "(coins, amount)",
    "(coins: number[], amount: number): number",
    "(coins: List[int], amount: int) -> int"
  ),
  cases: [
    [[1, 2, 5], 11],
    [[2], 3],
    [[1], 0],
    [[1, 2, 5], 100],
    [[186, 419, 83, 408], 6249],
  ],
  solve(coins, amount) {
    const INF = amount + 1;
    const dp = Array(amount + 1).fill(INF);
    dp[0] = 0;
    for (let x = 1; x <= amount; x++) {
      for (const c of coins) {
        if (c <= x) dp[x] = Math.min(dp[x], dp[x - c] + 1);
      }
    }
    return dp[amount] >= INF ? -1 : dp[amount];
  },
});

add({
  id: "seed-0037",
  title: "Unique Paths",
  difficulty: "Medium",
  topics: ["Dynamic Programming", "Matrix"],
  companies: ["Bloomberg", "Amazon"],
  functionName: "uniquePaths",
  pattern: "2d-dp",
  description:
    "Robot on `m x n` grid starts top-left, can only move right or down. How many unique paths to bottom-right?",
  examples: [{ input: "m = 3, n = 7", output: "28" }],
  constraints: ["1 <= m, n <= 100"],
  hints: [
    "dp[i][j] = dp[i-1][j] + dp[i][j-1].",
    "First row/col are all 1s.",
    "Can compress to 1D array.",
  ],
  patternDiscussion:
    "**Pattern: Grid path DP.** Combine from top and left. Obstacles variant zeros some cells. Combinatorial closed form C(m+n-2, m-1) is a follow-up.",
  starter: starters(
    "uniquePaths",
    "(m, n)",
    "(m: number, n: number): number",
    "(m: int, n: int) -> int"
  ),
  cases: [
    [3, 7],
    [3, 2],
    [1, 1],
    [1, 10],
    [7, 3],
  ],
  solve(m, n) {
    const dp = Array(n).fill(1);
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) dp[j] += dp[j - 1];
    }
    return dp[n - 1];
  },
});

add({
  id: "seed-0038",
  title: "Jump Game",
  difficulty: "Medium",
  topics: ["Array", "Greedy"],
  companies: ["Amazon", "Google"],
  functionName: "canJump",
  pattern: "greedy",
  description:
    "From index 0, each `nums[i]` is max jump length. Return whether you can reach the last index.",
  examples: [{ input: "nums = [2,3,1,1,4]", output: "true" }],
  constraints: ["1 <= nums.length <= 10^4"],
  hints: [
    "Track the farthest reachable index.",
    "If i > farthest, stuck.",
    "Update farthest = max(farthest, i + nums[i]).",
  ],
  patternDiscussion:
    "**Pattern: Greedy reachability.** Maintain a frontier. Jump Game II minimizes jumps with a similar layered greedy.",
  starter: starters(
    "canJump",
    "(nums)",
    "(nums: number[]): boolean",
    "(nums: List[int]) -> bool"
  ),
  cases: [
    [[2, 3, 1, 1, 4]],
    [[3, 2, 1, 0, 4]],
    [[0]],
    [[2, 0, 0]],
    [[1, 1, 1, 0]],
  ],
  solve(nums) {
    let far = 0;
    for (let i = 0; i < nums.length; i++) {
      if (i > far) return false;
      far = Math.max(far, i + nums[i]);
    }
    return true;
  },
});

add({
  id: "seed-0039",
  title: "Jump Game II",
  difficulty: "Medium",
  topics: ["Array", "Greedy"],
  companies: ["Amazon"],
  functionName: "jump",
  pattern: "greedy",
  description:
    "Same jump rules; return the **minimum** number of jumps to reach the last index. Guaranteed reachable.",
  examples: [{ input: "nums = [2,3,1,1,4]", output: "2" }],
  constraints: ["1 <= nums.length <= 10^4"],
  hints: [
    "BFS layers on the array without a queue.",
    "Within current end, track farthest; when i hits end, jump++.",
    "Stop before the last index.",
  ],
  patternDiscussion:
    "**Pattern: Greedy BFS on a line.** Each jump covers a window; next window is max reach inside. O(n) time.",
  starter: starters(
    "jump",
    "(nums)",
    "(nums: number[]): number",
    "(nums: List[int]) -> int"
  ),
  cases: [
    [[2, 3, 1, 1, 4]],
    [[2, 3, 0, 1, 4]],
    [[1]],
    [[1, 2, 3]],
    [[1, 1, 1, 1]],
  ],
  solve(nums) {
    let jumps = 0;
    let end = 0;
    let far = 0;
    for (let i = 0; i < nums.length - 1; i++) {
      far = Math.max(far, i + nums[i]);
      if (i === end) {
        jumps++;
        end = far;
      }
    }
    return jumps;
  },
});

add({
  id: "seed-0040",
  title: "Course Schedule",
  difficulty: "Medium",
  topics: ["Graph", "BFS", "DFS"],
  companies: ["Amazon", "Google", "Meta"],
  functionName: "canFinish",
  pattern: "topo-sort",
  description:
    "`numCourses` labeled `0..n-1`. `prerequisites[i] = [a,b]` means b before a. Return whether you can finish all courses (no cycle).",
  examples: [{ input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" }],
  constraints: ["1 <= numCourses <= 2000"],
  hints: [
    "This is cycle detection in a directed graph.",
    "Kahn's algorithm: peel indegree-0 nodes.",
    "If you process fewer than n nodes, there is a cycle.",
  ],
  patternDiscussion:
    "**Pattern: Topological sort / cycle detect.** Kahn BFS or DFS colors. Course Schedule II asks for an order — same algorithm collecting the peel sequence.",
  starter: starters(
    "canFinish",
    "(numCourses, prerequisites)",
    "(numCourses: number, prerequisites: number[][]): boolean",
    "(numCourses: int, prerequisites: List[List[int]]) -> bool"
  ),
  cases: [
    [2, [[1, 0]]],
    [2, [[1, 0], [0, 1]]],
    [1, []],
    [3, [[0, 1], [0, 2], [1, 2]]],
    [4, [[1, 0], [2, 1], [3, 2], [1, 3]]],
  ],
  solve(n, edges) {
    const indeg = Array(n).fill(0);
    const g = Array.from({ length: n }, () => []);
    for (const [a, b] of edges) {
      g[b].push(a);
      indeg[a]++;
    }
    const q = [];
    for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
    let seen = 0;
    while (q.length) {
      const u = q.shift();
      seen++;
      for (const v of g[u]) {
        if (--indeg[v] === 0) q.push(v);
      }
    }
    return seen === n;
  },
});

add({
  id: "seed-0041",
  title: "Number of Connected Components",
  difficulty: "Medium",
  topics: ["Graph", "Union Find", "DFS"],
  companies: ["Amazon", "LinkedIn"],
  functionName: "countComponents",
  pattern: "union-find",
  description:
    "`n` nodes `0..n-1` and undirected `edges`. Return the number of connected components.",
  examples: [{ input: "n = 5, edges = [[0,1],[1,2],[3,4]]", output: "2" }],
  constraints: ["1 <= n <= 2000"],
  hints: [
    "Union-find: start with n components; each successful union decrements.",
    "Or DFS/BFS flood from each unvisited node.",
    "Careful with duplicate edges / self-loops.",
  ],
  patternDiscussion:
    "**Pattern: Union-Find / graph components.** Interview staple for dynamic connectivity. Path compression + union by rank is the expected polish.",
  starter: starters(
    "countComponents",
    "(n, edges)",
    "(n: number, edges: number[][]): number",
    "(n: int, edges: List[List[int]]) -> int"
  ),
  cases: [
    [5, [[0, 1], [1, 2], [3, 4]]],
    [5, [[0, 1], [1, 2], [2, 3], [3, 4]]],
    [1, []],
    [3, []],
    [4, [[0, 1], [2, 3], [1, 2]]],
  ],
  solve(n, edges) {
    const parent = Array.from({ length: n }, (_, i) => i);
    const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
    let comps = n;
    for (const [a, b] of edges) {
      const ra = find(a);
      const rb = find(b);
      if (ra !== rb) {
        parent[ra] = rb;
        comps--;
      }
    }
    return comps;
  },
});

add({
  id: "seed-0042",
  title: "Clone Graph",
  difficulty: "Medium",
  topics: ["Graph", "DFS", "Hash Table"],
  companies: ["Meta", "Google"],
  functionName: "cloneGraph",
  pattern: "graph-dfs",
  description:
    "Undirected connected graph given as adjacency list `adj` where `adj[i]` lists neighbors of node `i` (nodes `0..n-1`). Return a deep-copied adjacency list of the clone (same indexing).",
  examples: [{ input: "adj = [[1,2],[0,2],[0,1]]", output: "same structure" }],
  constraints: ["1 <= n <= 100"],
  hints: [
    "Map original node id → clone id (same ids here).",
    "DFS/BFS: create clone when first seeing a node, then wire neighbors.",
    "Avoid infinite loops with the visited/clone map.",
  ],
  patternDiscussion:
    "**Pattern: Graph clone with a visited map.** The map breaks cycles. Same idea as copy list with random pointer.",
  starter: starters(
    "cloneGraph",
    "(adj)",
    "(adj: number[][]): number[][]",
    "(adj: List[List[int]]) -> List[List[int]]"
  ),
  cases: [
    [[[1, 2], [0, 2], [0, 1]]],
    [[[]]],
    [[[1], [0]]],
    [[[1, 3], [0, 2], [1, 3], [0, 2]]],
    [[[1], [0, 2], [1]]],
  ],
  solve(adj) {
    return adj.map((nbrs) => [...nbrs]);
  },
});

add({
  id: "seed-0043",
  title: "Subsets",
  difficulty: "Medium",
  topics: ["Backtracking", "Array"],
  companies: ["Meta", "Amazon"],
  functionName: "subsets",
  pattern: "backtracking",
  description:
    "Return all subsets of `nums` (the power set). Any order. `nums` has unique elements.",
  examples: [{ input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" }],
  constraints: ["1 <= nums.length <= 10"],
  hints: [
    "Backtracking: decide include/exclude for each index.",
    "Or iterative: double the list by adding each new element.",
    "Push a copy of the path when recording.",
  ],
  patternDiscussion:
    "**Pattern: Include/exclude backtracking.** Template for combinations, subsets with dupes (skip), and bitmask enumeration.",
  starter: starters(
    "subsets",
    "(nums)",
    "(nums: number[]): number[][]",
    "(nums: List[int]) -> List[List[int]]"
  ),
  cases: [[[1, 2, 3]], [[0]], [[1, 2]], [[4, 5, 6, 7]]],
  solve(nums) {
    const out = [];
    const path = [];
    const dfs = (i) => {
      if (i === nums.length) {
        out.push([...path]);
        return;
      }
      dfs(i + 1);
      path.push(nums[i]);
      dfs(i + 1);
      path.pop();
    };
    dfs(0);
    return out;
  },
  normalizeExpected: sortNested,
});

add({
  id: "seed-0044",
  title: "Permutations",
  difficulty: "Medium",
  topics: ["Backtracking", "Array"],
  companies: ["Microsoft", "Amazon"],
  functionName: "permute",
  pattern: "backtracking",
  description: "Return all permutations of distinct `nums`. Any order.",
  examples: [{ input: "nums = [1,2,3]", output: "all 6 permutations" }],
  constraints: ["1 <= nums.length <= 6"],
  hints: [
    "Swap-based or used[] boolean backtracking.",
    "When path length == n, record.",
    "Undo the choice (swap back / unmark).",
  ],
  patternDiscussion:
    "**Pattern: Backtracking permutations.** Choose unused elements; undo. Combination Sum adds pruning on remaining target.",
  starter: starters(
    "permute",
    "(nums)",
    "(nums: number[]): number[][]",
    "(nums: List[int]) -> List[List[int]]"
  ),
  cases: [[[1, 2, 3]], [[0, 1]], [[1]], [[1, 2, 3, 4]]],
  solve(nums) {
    const out = [];
    const a = [...nums];
    const dfs = (i) => {
      if (i === a.length) {
        out.push([...a]);
        return;
      }
      for (let j = i; j < a.length; j++) {
        [a[i], a[j]] = [a[j], a[i]];
        dfs(i + 1);
        [a[i], a[j]] = [a[j], a[i]];
      }
    };
    dfs(0);
    return out;
  },
  normalizeExpected: sortNested,
});

add({
  id: "seed-0045",
  title: "Combination Sum",
  difficulty: "Medium",
  topics: ["Backtracking", "Array"],
  companies: ["Airbnb", "Amazon"],
  functionName: "combinationSum",
  pattern: "backtracking",
  description:
    "Unique positive `candidates`. Return all unique combinations that sum to `target`. Same number may be chosen unlimited times. Combinations in any order.",
  examples: [{ input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]" }],
  constraints: ["1 <= candidates.length <= 30"],
  hints: [
    "DFS with remaining target.",
    "To avoid duplicate combos, only reuse from current index forward.",
    "Prune when candidate > remaining.",
  ],
  patternDiscussion:
    "**Pattern: Backtracking with reuse + index discipline.** Unlimited reuse keeps the same index; Combination Sum II advances index and skips dupes.",
  starter: starters(
    "combinationSum",
    "(candidates, target)",
    "(candidates: number[], target: number): number[][]",
    "(candidates: List[int], target: int) -> List[List[int]]"
  ),
  cases: [
    [[2, 3, 6, 7], 7],
    [[2, 3, 5], 8],
    [[2], 1],
    [[2, 3], 5],
    [[8, 7, 4, 3], 11],
  ],
  solve(candidates, target) {
    const out = [];
    const path = [];
    const dfs = (start, remain) => {
      if (remain === 0) {
        out.push([...path]);
        return;
      }
      for (let i = start; i < candidates.length; i++) {
        const c = candidates[i];
        if (c > remain) continue;
        path.push(c);
        dfs(i, remain - c);
        path.pop();
      }
    };
    dfs(0, target);
    return out;
  },
  normalizeExpected: sortNested,
});

add({
  id: "seed-0046",
  title: "Word Search",
  difficulty: "Medium",
  topics: ["Matrix", "Backtracking"],
  companies: ["Amazon", "Bloomberg", "Microsoft"],
  functionName: "exist",
  pattern: "backtracking",
  description:
    "Given `board` of characters and `word`, return whether `word` exists in the grid by adjacent (4-dir) cells. A cell may not be reused in one path.",
  examples: [
    {
      input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
      output: "true",
    },
  ],
  constraints: ["1 <= m,n <= 6", "1 <= word.length <= 15"],
  hints: [
    "Try DFS from every cell matching word[0].",
    "Mark visited (mutate temporarily); unmark on return.",
    "Prune when character mismatches.",
  ],
  patternDiscussion:
    "**Pattern: Grid backtracking / DFS path.** Mark/unmark is the undo. Word Search II adds a trie for multi-word pruning.",
  starter: starters(
    "exist",
    "(board, word)",
    "(board: string[][], word: string): boolean",
    "(board: List[List[str]], word: str) -> bool"
  ),
  cases: [
    [
      [
        ["A", "B", "C", "E"],
        ["S", "F", "C", "S"],
        ["A", "D", "E", "E"],
      ],
      "ABCCED",
    ],
    [
      [
        ["A", "B", "C", "E"],
        ["S", "F", "C", "S"],
        ["A", "D", "E", "E"],
      ],
      "SEE",
    ],
    [
      [
        ["A", "B", "C", "E"],
        ["S", "F", "C", "S"],
        ["A", "D", "E", "E"],
      ],
      "ABCB",
    ],
    [[["A"]], "A"],
    [[["A", "B"], ["C", "D"]], "ACDB"],
  ],
  solve(board, word) {
    const m = board.length;
    const n = board[0].length;
    const b = board.map((r) => [...r]);
    const dfs = (i, j, k) => {
      if (k === word.length) return true;
      if (i < 0 || j < 0 || i >= m || j >= n || b[i][j] !== word[k]) return false;
      const ch = b[i][j];
      b[i][j] = "#";
      const ok =
        dfs(i + 1, j, k + 1) ||
        dfs(i - 1, j, k + 1) ||
        dfs(i, j + 1, k + 1) ||
        dfs(i, j - 1, k + 1);
      b[i][j] = ch;
      return ok;
    };
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (dfs(i, j, 0)) return true;
      }
    }
    return false;
  },
});

add({
  id: "seed-0047",
  title: "Merge Two Sorted Lists",
  difficulty: "Easy",
  topics: ["Linked List", "Two Pointers"],
  companies: ["Amazon", "Microsoft"],
  functionName: "mergeTwoLists",
  pattern: "linked-list",
  description:
    "Lists given as sorted arrays. Merge into one sorted list (return as array). Mimics merging two sorted linked lists.",
  examples: [{ input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }],
  constraints: ["0 <= length <= 50"],
  hints: [
    "Two pointers; always take the smaller head.",
    "Append leftovers from the non-exhausted list.",
    "Dummy head simplifies coding on real nodes.",
  ],
  patternDiscussion:
    "**Pattern: Two-pointer merge.** Same as merge step in mergesort. On real nodes, dummy + tail pointer avoids edge cases.",
  starter: starters(
    "mergeTwoLists",
    "(list1, list2)",
    "(list1: number[], list2: number[]): number[]",
    "(list1: List[int], list2: List[int]) -> List[int]"
  ),
  cases: [
    [[1, 2, 4], [1, 3, 4]],
    [[], []],
    [[], [0]],
    [[5], [1, 2, 4]],
    [[1, 1, 1], [1, 1]],
  ],
  solve(a, b) {
    const out = [];
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      if (a[i] <= b[j]) out.push(a[i++]);
      else out.push(b[j++]);
    }
    while (i < a.length) out.push(a[i++]);
    while (j < b.length) out.push(b[j++]);
    return out;
  },
});

add({
  id: "seed-0048",
  title: "Reverse Linked List",
  difficulty: "Easy",
  topics: ["Linked List"],
  companies: ["Amazon", "Apple", "Microsoft"],
  functionName: "reverseList",
  pattern: "linked-list",
  description: "Reverse a singly linked list represented as an array; return the reversed array.",
  examples: [{ input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }],
  constraints: ["0 <= length <= 5000"],
  hints: [
    "Iterative: prev, curr, next pointers.",
    "Rewire curr.next = prev; advance.",
    "Recursive: reverse rest, then head.next.next = head.",
  ],
  patternDiscussion:
    "**Pattern: Pointer rewiring.** Master iterative reverse before recursive. Foundation for reverse-k-group and palindrome list.",
  starter: starters(
    "reverseList",
    "(head)",
    "(head: number[]): number[]",
    "(head: List[int]) -> List[int]"
  ),
  cases: [[[1, 2, 3, 4, 5]], [[1, 2]], [[]], [[1]], [[1, 2, 3]]],
  solve(head) {
    return [...head].reverse();
  },
});

add({
  id: "seed-0049",
  title: "Missing Number",
  difficulty: "Easy",
  topics: ["Array", "Bit Manipulation", "Math"],
  companies: ["Amazon", "Microsoft"],
  functionName: "missingNumber",
  pattern: "bit-math",
  description:
    "`nums` contains `n` distinct numbers in `[0, n]` with one missing. Return the missing number. Prefer O(n) time and O(1) extra space.",
  examples: [{ input: "nums = [3,0,1]", output: "2" }],
  constraints: ["1 <= nums.length <= 10^4"],
  hints: [
    "Gauss: expected sum is n(n+1)/2; subtract actual.",
    "XOR of all indices and values cancels pairs.",
    "Sorting works but is slower than needed.",
  ],
  patternDiscussion:
    "**Pattern: Bit/math cancellation.** XOR or sum formulas recover the missing piece without a set. Related: single number, missing ranges.",
  starter: starters(
    "missingNumber",
    "(nums)",
    "(nums: number[]): number",
    "(nums: List[int]) -> int"
  ),
  cases: [[[3, 0, 1]], [[0, 1]], [[9, 6, 4, 2, 3, 5, 7, 0, 1]], [[0]], [[1]]],
  solve(nums) {
    const n = nums.length;
    let x = n;
    for (let i = 0; i < n; i++) x ^= i ^ nums[i];
    return x;
  },
});

add({
  id: "seed-0050",
  title: "Valid Sudoku",
  difficulty: "Medium",
  topics: ["Matrix", "Hash Table"],
  companies: ["Amazon", "Apple"],
  functionName: "isValidSudoku",
  pattern: "hashmap",
  description:
    "Determine if a 9×9 Sudoku board is valid. Only filled cells (`'1'`-`'9'`) are checked; `'.'` is empty. Rows, columns, and 3×3 boxes must not contain duplicates.",
  examples: [{ input: "partial valid board", output: "true" }],
  constraints: ["board is 9x9"],
  hints: [
    "Track seen digits per row, col, box.",
    "Box id = (r/3)*3 + (c/3).",
    "Return false on first conflict.",
  ],
  patternDiscussion:
    "**Pattern: Constraint sets on a grid.** Encode uniqueness with sets or bitmasks. Sudoku solver adds backtracking on the same constraints.",
  starter: starters(
    "isValidSudoku",
    "(board)",
    "(board: string[][]): boolean",
    "(board: List[List[str]]) -> bool"
  ),
  cases: [
    [
      [
        ["5", "3", ".", ".", "7", ".", ".", ".", "."],
        ["6", ".", ".", "1", "9", "5", ".", ".", "."],
        [".", "9", "8", ".", ".", ".", ".", "6", "."],
        ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
        ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
        ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
        [".", "6", ".", ".", ".", ".", "2", "8", "."],
        [".", ".", ".", "4", "1", "9", ".", ".", "5"],
        [".", ".", ".", ".", "8", ".", ".", "7", "9"],
      ],
    ],
    [
      [
        ["8", "3", ".", ".", "7", ".", ".", ".", "."],
        ["6", ".", ".", "1", "9", "5", ".", ".", "."],
        [".", "9", "8", ".", ".", ".", ".", "6", "."],
        ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
        ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
        ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
        [".", "6", ".", ".", ".", ".", "2", "8", "."],
        [".", ".", ".", "4", "1", "9", ".", ".", "5"],
        [".", ".", ".", ".", "8", ".", ".", "7", "9"],
      ],
    ],
    [
      [
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
      ],
    ],
    [
      [
        ["1", "2", ".", ".", "3", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", "1", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
      ],
    ],
  ],
  solve(board) {
    const rows = Array.from({ length: 9 }, () => new Set());
    const cols = Array.from({ length: 9 }, () => new Set());
    const boxes = Array.from({ length: 9 }, () => new Set());
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const v = board[r][c];
        if (v === ".") continue;
        const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
        if (rows[r].has(v) || cols[c].has(v) || boxes[b].has(v)) return false;
        rows[r].add(v);
        cols[c].add(v);
        boxes[b].add(v);
      }
    }
    return true;
  },
});

add({
  id: "seed-0051",
  title: "Spiral Matrix",
  difficulty: "Medium",
  topics: ["Matrix", "Array"],
  companies: ["Microsoft", "Amazon"],
  functionName: "spiralOrder",
  pattern: "matrix",
  description: "Return all elements of `matrix` in spiral order.",
  examples: [{ input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]" }],
  constraints: ["1 <= m,n <= 10"],
  hints: [
    "Maintain top/bottom/left/right bounds.",
    "Traverse edges; shrink bounds; stop when crossed.",
    "Watch single-row and single-column cases.",
  ],
  patternDiscussion:
    "**Pattern: Layer peel / boundary walk.** Simulation with shrinking windows. Rotate-image is a related matrix transform.",
  starter: starters(
    "spiralOrder",
    "(matrix)",
    "(matrix: number[][]): number[]",
    "(matrix: List[List[int]]) -> List[int]"
  ),
  cases: [
    [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
    [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]],
    [[[1]]],
    [[[1, 2], [3, 4]]],
    [[[1, 2, 3]]],
  ],
  solve(matrix) {
    const out = [];
    let top = 0;
    let bottom = matrix.length - 1;
    let left = 0;
    let right = matrix[0].length - 1;
    while (top <= bottom && left <= right) {
      for (let c = left; c <= right; c++) out.push(matrix[top][c]);
      top++;
      for (let r = top; r <= bottom; r++) out.push(matrix[r][right]);
      right--;
      if (top <= bottom) {
        for (let c = right; c >= left; c--) out.push(matrix[bottom][c]);
        bottom--;
      }
      if (left <= right) {
        for (let r = bottom; r >= top; r--) out.push(matrix[r][left]);
        left++;
      }
    }
    return out;
  },
});

add({
  id: "seed-0052",
  title: "Set Matrix Zeroes",
  difficulty: "Medium",
  topics: ["Matrix", "Array"],
  companies: ["Amazon", "Microsoft"],
  functionName: "setZeroes",
  pattern: "matrix",
  description:
    "If an element is 0, set its entire row and column to 0. Do it in place and return the matrix. Prefer O(1) extra space.",
  examples: [
    { input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]", output: "[[1,0,1],[0,0,0],[1,0,1]]" },
  ],
  constraints: ["1 <= m,n <= 200"],
  hints: [
    "Use first row/col as markers.",
    "Remember separately whether first row/col originally had a zero.",
    "Second pass applies markers; third cleans first row/col.",
  ],
  patternDiscussion:
    "**Pattern: In-place matrix marking.** Encode information in the matrix itself to hit O(1) space. Interview loves the first-row/col trick.",
  starter: starters(
    "setZeroes",
    "(matrix)",
    "(matrix: number[][]): number[][]",
    "(matrix: List[List[int]]) -> List[List[int]]"
  ),
  cases: [
    [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]],
    [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]],
    [[[1]]],
    [[[0]]],
    [[[1, 0], [1, 1]]],
  ],
  solve(matrix) {
    const m = matrix.map((r) => [...r]);
    const rows = m.length;
    const cols = m[0].length;
    let firstRow = false;
    let firstCol = false;
    for (let c = 0; c < cols; c++) if (m[0][c] === 0) firstRow = true;
    for (let r = 0; r < rows; r++) if (m[r][0] === 0) firstCol = true;
    for (let r = 1; r < rows; r++) {
      for (let c = 1; c < cols; c++) {
        if (m[r][c] === 0) {
          m[r][0] = 0;
          m[0][c] = 0;
        }
      }
    }
    for (let r = 1; r < rows; r++) {
      for (let c = 1; c < cols; c++) {
        if (m[r][0] === 0 || m[0][c] === 0) m[r][c] = 0;
      }
    }
    if (firstRow) for (let c = 0; c < cols; c++) m[0][c] = 0;
    if (firstCol) for (let r = 0; r < rows; r++) m[r][0] = 0;
    return m;
  },
});

// ─── Write ───────────────────────────────────────────────────────────

assert.equal(SEEDS.length, 52, `expected 52 seeds, got ${SEEDS.length}`);
const ids = new Set(SEEDS.map((s) => s.id));
assert.equal(ids.size, SEEDS.length, "duplicate seed ids");

fs.writeFileSync(OUT, JSON.stringify(SEEDS, null, 2) + "\n");
console.log(`Wrote ${SEEDS.length} verified judged seeds → ${OUT}`);
console.log(
  "Patterns:",
  [...new Set(SEEDS.map((s) => s.pattern))].sort().join(", ")
);
