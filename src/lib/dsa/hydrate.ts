import type { DsaIndexItem, DsaProblem } from "./types";

type PatternDef = {
  key: string;
  titles: string[];
  topics: string[];
  fn: string;
  descTemplate: string;
  starter: DsaProblem["starter"];
};

export type PatternsFile = {
  twists: string[];
  patterns: PatternDef[];
};

export type HydrateMeta = DsaIndexItem & {
  n?: number;
  twistIndex?: number;
  seed?: number;
  titleBaseIndex?: number;
};

export function buildLeetCodeProblem(meta: DsaIndexItem): DsaProblem {
  const slug = meta.slug || meta.id.replace(/^lc-/, "");
  const link = meta.link || `https://leetcode.com/problems/${slug}/`;
  const topics = meta.topics?.length ? meta.topics : ["Interview"];
  const companyLine = meta.companies.slice(0, 12).join(", ");
  return {
    id: meta.id,
    title: meta.title,
    difficulty: meta.difficulty,
    topics,
    companies: meta.companies,
    functionName: "solve",
    description: [
      `Interview problem tagged by real company lists ([company-wise packs](https://github.com/snehasishroy/leetcode-companywise-interview-questions)).`,
      "",
      `**${meta.title}** · ${meta.difficulty}`,
      "",
      topics.length ? `Topics: ${topics.join(", ")}` : "",
      companyLine ? `Asked at: ${companyLine}${meta.companies.length > 12 ? "…" : ""}` : "",
      "",
      `Official statement: [leetcode.com/problems/${slug}](${link})`,
      "",
      "Practice here with the starter below. Prefer the optimal approach you would defend in an onsite.",
    ]
      .filter(Boolean)
      .join("\n"),
    examples: [
      {
        input: "See LeetCode examples",
        output: "Match the official expected output",
        explanation: "Open the LeetCode link for canonical I/O samples.",
      },
    ],
    constraints: ["Follow the official LeetCode constraints for this title"],
    starter: {
      javascript:
        "/**\n * Implement the solution you would ship in interview.\n * Rename / adjust signature to match the problem.\n */\nfunction solve(...args) {\n  \n}\n",
      typescript: "function solve(...args: unknown[]): unknown {\n  \n}\n",
      python: "def solve(*args):\n    ...\n",
    },
    tests: [{ id: "Explore", input: [] }],
    kind: "leetcode",
    hasJudge: false,
    slug,
  };
}

export function buildGeneratedProblem(
  meta: HydrateMeta,
  patternsFile: PatternsFile,
  packs: Record<string, Record<string, DsaProblem["tests"]>>
): DsaProblem {
  if (!meta.pattern) throw new Error(`Problem ${meta.id} not found`);
  const pattern = patternsFile.patterns.find((item) => item.key === meta.pattern);
  if (!pattern) throw new Error(`Pattern ${meta.pattern} missing`);

  const twist = patternsFile.twists[meta.twistIndex ?? 0] ?? "";
  const n = meta.n ?? 5000;
  const description = pattern.descTemplate
    .replaceAll("{{n}}", String(n))
    .replaceAll("{{twist}}", twist);

  const packBucket = String((meta.seed ?? 0) % 64);
  const tests =
    (meta.hasJudge && packs[meta.pattern]?.[packBucket]) ||
    [{ id: "Explore", input: [[1, 2, 3], 2] }];

  return {
    id: meta.id,
    title: meta.title,
    difficulty: meta.difficulty,
    topics: meta.topics,
    companies: meta.companies,
    functionName: pattern.fn,
    description,
    examples: [
      {
        input: "See test cases panel",
        output: meta.hasJudge ? "Auto-judged" : "Manual verification",
        explanation: `Pattern: ${meta.pattern}`,
      },
    ],
    constraints: [`Scale ≈ ${n}`, "Prefer the optimal asymptotic approach"],
    starter: pattern.starter,
    tests,
    pattern: meta.pattern,
    kind: "generated",
    hasJudge: meta.hasJudge,
  };
}
