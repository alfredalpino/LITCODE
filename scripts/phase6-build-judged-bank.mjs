#!/usr/bin/env node
/**
 * Phase 6 — curated auto-judged DSA bank (≥50).
 * Usage: node scripts/phase6-build-judged-bank.mjs && npm run dsa:gen
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { seedBatchA } from "./dsa-seed-batch-a.mjs";
import { appendSeedBatchB } from "./dsa-seed-batch-b.mjs";
import { appendSeedBatchB2 } from "./dsa-seed-batch-b2.mjs";
import { appendSeedBatchC } from "./dsa-seed-batch-c.mjs";
import { appendSeedBatchC2 } from "./dsa-seed-batch-c2.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "dsa-seeds.json");

const SEEDS = [...seedBatchA];
appendSeedBatchB(SEEDS);
appendSeedBatchB2(SEEDS);
appendSeedBatchC(SEEDS);
appendSeedBatchC2(SEEDS);

assert.equal(SEEDS.length, 52, `expected 52 seeds, got ${SEEDS.length}`);
const ids = new Set(SEEDS.map((s) => s.id));
assert.equal(ids.size, SEEDS.length, "duplicate seed ids");

fs.writeFileSync(OUT, JSON.stringify(SEEDS, null, 2) + "\n");
console.log(`Wrote ${SEEDS.length} verified judged seeds → ${OUT}`);
console.log(
  "Patterns:",
  [...new Set(SEEDS.map((s) => s.pattern))].sort().join(", ")
);
