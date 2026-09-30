#!/usr/bin/env node
/**
 * Discovers and runs the Node test suite without shell globs.
 * DataFactor / CI sandboxes often fail to expand `tests/*.test.ts`.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function listFiles(dir, predicate) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs)
    .filter(predicate)
    .map((name) => path.join(dir, name))
    .sort();
}

const files = [
  ...listFiles("tests", (name) => /\.test\.(ts|mts|mjs|js)$/.test(name)),
  ...listFiles("scripts", (name) => /^test-.*\.(mjs|mts|js)$/.test(name)),
  ...listFiles("src", (name) => false),
];

function walkSrc(dir, acc = []) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return acc;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walkSrc(rel, acc);
    else if (/\.(test|spec)\.(ts|tsx|mts|mjs|js)$/.test(entry.name)) acc.push(rel);
  }
  return acc;
}

files.push(...walkSrc("src").sort());

if (files.length === 0) {
  console.error("No test files found under tests/, scripts/test-*, or src/**/*.{test,spec}.*");
  process.exit(1);
}

process.env.NODE_ENV = process.env.NODE_ENV || "test";
const result = spawnSync(
  process.execPath,
  ["--import", "tsx", "--test", ...files],
  { cwd: root, stdio: "inherit", env: process.env }
);
process.exit(result.status ?? 1);
