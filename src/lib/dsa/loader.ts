import type {
  CompanyPacksFile,
  DsaIndexFile,
  DsaIndexItem,
  DsaProblem,
} from "./types";

type PatternsFile = {
  twists: string[];
  patterns: Array<{
    key: string;
    titles: string[];
    topics: string[];
    fn: string;
    descTemplate: string;
    starter: DsaProblem["starter"];
  }>;
};

let indexPromise: Promise<DsaIndexFile> | null = null;
let seedsPromise: Promise<Record<string, DsaProblem>> | null = null;
let patternsPromise: Promise<PatternsFile> | null = null;
let testPacksPromise: Promise<Record<string, Record<string, DsaProblem["tests"]>>> | null =
  null;
let companyPacksPromise: Promise<CompanyPacksFile> | null = null;

export function loadDsaIndex(): Promise<DsaIndexFile> {
  if (!indexPromise) {
    indexPromise = fetch("/dsa/index.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load DSA index");
        return r.json();
      })
      .catch((err) => {
        indexPromise = null;
        throw err;
      });
  }
  return indexPromise;
}

export function loadCompanyPacks(): Promise<CompanyPacksFile> {
  if (!companyPacksPromise) {
    companyPacksPromise = fetch("/dsa/company-packs.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load company packs");
        return r.json();
      })
      .catch((err) => {
        companyPacksPromise = null;
        throw err;
      });
  }
  return companyPacksPromise;
}

function loadSeeds() {
  if (!seedsPromise) {
    seedsPromise = fetch("/dsa/seeds.json").then((r) => {
      if (!r.ok) throw new Error("Failed to load DSA seeds");
      return r.json();
    });
  }
  return seedsPromise;
}

function loadPatterns() {
  if (!patternsPromise) {
    patternsPromise = fetch("/dsa/patterns.json").then((r) => {
      if (!r.ok) throw new Error("Failed to load DSA patterns");
      return r.json();
    });
  }
  return patternsPromise;
}

function loadTestPacks() {
  if (!testPacksPromise) {
    testPacksPromise = fetch("/dsa/test-packs.json").then((r) => {
      if (!r.ok) throw new Error("Failed to load DSA test packs");
      return r.json();
    });
  }
  return testPacksPromise;
}

type HydrateMeta = DsaIndexItem & {
  n?: number;
  twistIndex?: number;
  seed?: number;
  titleBaseIndex?: number;
};

export async function loadDsaProblem(id: string): Promise<DsaProblem> {
  if (id.startsWith("seed-")) {
    const seeds = await loadSeeds();
    const p = seeds[id];
    if (!p) throw new Error(`Seed ${id} missing`);
    // Prefer index slug when seed JSON omitted it
    if (!p.slug) {
      const indexFile = await loadDsaIndex();
      const meta = indexFile.index.find((i) => i.id === id);
      if (meta?.slug) return { ...p, slug: meta.slug };
    }
    return p;
  }

  const [indexFile, patternsFile, packs] = await Promise.all([
    loadDsaIndex(),
    loadPatterns(),
    loadTestPacks(),
  ]);

  const meta = indexFile.index.find((i) => i.id === id) as HydrateMeta | undefined;
  if (!meta) throw new Error(`Problem ${id} not found`);

  if (meta.kind === "leetcode" || id.startsWith("lc-")) {
    const slug = meta.slug || id.replace(/^lc-/, "");
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
        typescript:
          "function solve(...args: unknown[]): unknown {\n  \n}\n",
        python: "def solve(*args):\n    ...\n",
      },
      tests: [{ id: "Explore", input: [] }],
      kind: "leetcode",
      hasJudge: false,
      slug,
    };
  }

  if (!meta.pattern) throw new Error(`Problem ${id} not found`);

  const pattern = patternsFile.patterns.find((p) => p.key === meta.pattern);
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
