import { problem, sortNested, starters } from "./dsa-seed-builder.mjs";

export function appendSeedBatchB(SEEDS) {
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
}
