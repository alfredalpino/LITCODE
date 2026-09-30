import { problem, starters } from "./dsa-seed-builder.mjs";

export function appendSeedBatchC(SEEDS) {
function add(spec) {
  SEEDS.push(problem(spec));
}
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
}
