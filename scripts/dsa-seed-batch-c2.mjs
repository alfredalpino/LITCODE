import { problem, sortNested, starters } from "./dsa-seed-builder.mjs";

export function appendSeedBatchC2(SEEDS) {
function add(spec) {
  SEEDS.push(problem(spec));
}
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


}
