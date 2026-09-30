import { problem, starters } from "./dsa-seed-builder.mjs";

export function appendSeedBatchB2(SEEDS) {
function add(spec) {
  SEEDS.push(problem(spec));
}
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
}
