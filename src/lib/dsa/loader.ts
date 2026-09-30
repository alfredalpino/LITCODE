import type { CompanyPacksFile, DsaIndexFile, DsaProblem } from "./types";
import {
  buildGeneratedProblem,
  buildLeetCodeProblem,
  type HydrateMeta,
  type PatternsFile,
} from "./hydrate";

const DSA_BASE = "/data/dsa";
const COMPANIES_BASE = "/data/companies";

let indexPromise: Promise<DsaIndexFile> | null = null;
let seedsPromise: Promise<Record<string, DsaProblem>> | null = null;
let patternsPromise: Promise<PatternsFile> | null = null;
let testPacksPromise: Promise<Record<string, Record<string, DsaProblem["tests"]>>> | null =
  null;
let companyPacksPromise: Promise<CompanyPacksFile> | null = null;

export function loadDsaIndex(): Promise<DsaIndexFile> {
  if (!indexPromise) {
    indexPromise = fetch(`${DSA_BASE}/index.json`)
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
    companyPacksPromise = fetch(`${COMPANIES_BASE}/company-packs.json`)
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
    seedsPromise = fetch(`${DSA_BASE}/seeds.json`).then((r) => {
      if (!r.ok) throw new Error("Failed to load DSA seeds");
      return r.json();
    });
  }
  return seedsPromise;
}

function loadPatterns() {
  if (!patternsPromise) {
    patternsPromise = fetch(`${DSA_BASE}/patterns.json`).then((r) => {
      if (!r.ok) throw new Error("Failed to load DSA patterns");
      return r.json();
    });
  }
  return patternsPromise;
}

function loadTestPacks() {
  if (!testPacksPromise) {
    testPacksPromise = fetch(`${DSA_BASE}/test-packs.json`).then((r) => {
      if (!r.ok) throw new Error("Failed to load DSA test packs");
      return r.json();
    });
  }
  return testPacksPromise;
}

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
    return buildLeetCodeProblem(meta);
  }

  return buildGeneratedProblem(meta, patternsFile, packs);
}
