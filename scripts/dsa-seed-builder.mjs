/**
 * Validation harness for the judged DSA seed bank.
 * Seed specs live in phase6-build-judged-bank.mjs and call these helpers.
 */
import assert from "node:assert/strict";

export function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((x, i) => deepEqual(x, b[i]));
  }
  if (a && b && typeof a === "object") {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every((k) => deepEqual(a[k], b[k]));
  }
  return false;
}

export function starters(fn, jsSig, tsSig, pySig) {
  return {
    javascript: `function ${fn}${jsSig} {\n  \n}\n`,
    typescript: `function ${fn}${tsSig} {\n  \n}\n`,
    python: pySig.includes("List") || pySig.includes("Optional") || pySig.includes("Dict")
      ? `from typing import List, Optional, Dict\n\ndef ${fn}${pySig}:\n    ...\n`
      : `def ${fn}${pySig}:\n    ...\n`,
  };
}

export function problem(spec) {
  const {
    id,
    title,
    difficulty,
    topics,
    companies = ["Interview"],
    functionName,
    description,
    examples,
    constraints,
    pattern,
    hints,
    patternDiscussion,
    starter,
    cases,
    solve,
    normalizeExpected,
  } = spec;

  const tests = cases.map((input, i) => {
    let expected = solve(...input);
    if (normalizeExpected) expected = normalizeExpected(expected);
    return {
      id: i < 2 ? `Visible ${i + 1}` : `Hidden ${i - 1}`,
      input,
      expected,
    };
  });

  // Re-verify
  for (const t of tests) {
    let got = solve(...t.input);
    if (normalizeExpected) got = normalizeExpected(got);
    assert.ok(
      deepEqual(got, t.expected),
      `${id} ${t.id}: solver mismatch ${JSON.stringify(got)} vs ${JSON.stringify(t.expected)}`
    );
  }
  assert.ok(tests.length >= 4, `${id} needs ≥4 tests for visible/hidden split`);
  assert.ok(hints?.length >= 3, `${id} needs ≥3 hints`);
  assert.ok(pattern && patternDiscussion, `${id} needs pattern + discussion`);

  return {
    id,
    title,
    difficulty,
    topics,
    companies,
    functionName,
    description,
    examples,
    constraints,
    pattern,
    hints,
    patternDiscussion,
    starter,
    tests,
  };
}

/** Stable sort for unordered index pairs / sets of ints */
export function sortPair(p) {
  return [...p].sort((a, b) => a - b);
}

export function sortNested(arr) {
  return arr.map((row) => [...row]).sort((a, b) => {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) - (b[i] ?? 0);
    }
    return 0;
  });
}

