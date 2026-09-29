import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

describe("content catalog smoke", () => {
  it("serves expected language labs with modules", () => {
    const catalog = JSON.parse(
      readFileSync(path.join(ROOT, "public/content/catalog.json"), "utf8")
    );
    assert.ok(catalog.generatedAt);
    const ids = catalog.labs.map((l) => l.id);
    assert.ok(ids.includes("javascript"), ids.join(", "));
    assert.ok(ids.includes("python-dsa"), ids.join(", "));
    assert.ok(ids.includes("typescript"), ids.join(", "));

    const js = catalog.labs.find((l) => l.id === "javascript");
    assert.ok(js.modules.length >= 10, `javascript modules: ${js.modules.length}`);
    assert.equal(js.language, "javascript");

    for (const lab of catalog.labs) {
      assert.ok(lab.id && lab.title && lab.language, lab.id);
      assert.ok(Array.isArray(lab.modules), lab.id);
    }
  });
});
