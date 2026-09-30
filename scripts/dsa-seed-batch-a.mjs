import { problem, sortPair, starters } from "./dsa-seed-builder.mjs";

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


export { SEEDS as seedBatchA };
