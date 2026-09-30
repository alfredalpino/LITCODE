import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  companiesForSlug,
  frequencyFor,
  windowCount,
} from "./lib/company-pack-query.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

describe("company packs query helpers", () => {
  const packs = JSON.parse(
    readFileSync(path.join(ROOT, "public/data/companies/company-packs.json"), "utf8")
  );

  it("pack file has companies and problems indexes", () => {
    assert.ok(packs.companyCount >= 100);
    assert.ok(packs.problemCount >= 1000);
    assert.ok(Array.isArray(packs.companies) && packs.companies.length > 0);
    assert.ok(packs.problems && typeof packs.problems === "object");
  });

  it("companiesForSlug returns names for known problem", () => {
    const names = companiesForSlug(packs, "01-matrix");
    assert.ok(names.includes("Amazon"));
    assert.ok(names.includes("Google"));
  });

  it("frequencyFor returns tag frequency for company on slug", () => {
    const f = frequencyFor(packs, "01-matrix", "Amazon");
    assert.equal(typeof f, "number");
    assert.ok(f > 0);
    assert.equal(frequencyFor(packs, "01-matrix", "NotACompany"), 0);
    assert.deepEqual(companiesForSlug(packs, "no-such-slug"), []);
  });

  it("windowCount picks the active frequency window", () => {
    const google = packs.companies.find((c) => c.name === "Google");
    assert.ok(google);
    assert.ok(windowCount(google, "thirty") <= windowCount(google, "all"));
    assert.equal(windowCount(google, "threeMonths"), google.threeMonths);
    assert.equal(windowCount(google, "all"), google.all);
  });
});
