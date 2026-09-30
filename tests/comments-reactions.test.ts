import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { loadComments, saveComment, type KeyValueStore } from "../src/lib/dsa/comments.ts";
import { loadReaction, saveReaction } from "../src/lib/dsa/reactions.ts";

function memoryStore(): KeyValueStore {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
  };
}

describe("problem notes and reactions", () => {
  it("saves and reloads comments for one problem", () => {
    const store = memoryStore();
    const saved = saveComment("seed-0001", "  edge case  ", store, 10);
    assert.ok(saved);
    assert.equal(saved?.body, "edge case");
    assert.equal(loadComments("seed-0001", store)[0]?.body, "edge case");
    assert.equal(loadComments("other", store).length, 0);
    assert.equal(saveComment("seed-0001", "   ", store), null);
  });

  it("toggles a reaction and clears it", () => {
    const store = memoryStore();
    assert.equal(loadReaction("seed-0001", store), null);
    saveReaction("seed-0001", "up", store);
    assert.equal(loadReaction("seed-0001", store), "up");
    saveReaction("seed-0001", null, store);
    assert.equal(loadReaction("seed-0001", store), null);
  });

  it("ignores corrupt storage", () => {
    const store = memoryStore();
    store.setItem("sde-lab-problem-comments-v1", "{");
    store.setItem("sde-lab-problem-reactions-v1", "{");
    assert.deepEqual(loadComments("seed-0001", store), []);
    assert.equal(loadReaction("seed-0001", store), null);
  });
});
