import type { DsaIndexFile, DsaIndexItem, DsaProblem } from "./types";

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

export function loadDsaIndex(): Promise<DsaIndexFile> {
  if (!indexPromise) {
    indexPromise = fetch("/dsa/index.json").then((r) => {
      if (!r.ok) throw new Error("Failed to load DSA index");
      return r.json();
    });
  }
  return indexPromise;
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
    return p;
  }

  const [indexFile, patternsFile, packs] = await Promise.all([
    loadDsaIndex(),
    loadPatterns(),
    loadTestPacks(),
  ]);

  const meta = indexFile.index.find((i) => i.id === id) as HydrateMeta | undefined;
  if (!meta || !meta.pattern) throw new Error(`Problem ${id} not found`);

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
