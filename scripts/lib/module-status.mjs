/**
 * Catalog honesty heuristics for lab modules (DEC-018 / Phase 4).
 * Shared by sync-content.mjs and unit tests — keep pure (no fs side effects except via injected readers).
 */

/** @typedef {"scaffold" | "ready" | "deprecated"} ModuleStatus */
/** @typedef {"predict" | "experiment" | "break" | "explain"} LoopStage */

/**
 * @param {string} text
 * @returns {ModuleStatus | null}
 */
export function parseStatusOverride(text) {
  if (!text) return null;
  const m = text.match(
    /(?:^|\n)\s*(?:status|module[_-]?status)\s*[:=]\s*(scaffold|ready|deprecated)\s*(?:\n|$)/i
  );
  if (m) return m[1].toLowerCase();
  return null;
}

/**
 * @param {string} readmeText
 * @returns {boolean}
 */
export function looksLikeScaffoldReadme(readmeText) {
  if (!readmeText) return true;
  const t = readmeText.toLowerCase();
  return (
    t.includes("scaffolded") ||
    t.includes("🧱 scaffold") ||
    t.includes("status:** 🧱") ||
    t.includes("planned contents") ||
    (t.includes("until this module is expanded") && t.includes("scaffold"))
  );
}

/**
 * @param {{
 *   docs?: Array<{ category?: string; name?: string; isPrimary?: boolean }>;
 *   codeFiles?: Array<{ category?: string }>;
 * }} mod
 */
export function deriveFlags(mod) {
  const docs = mod.docs ?? [];
  const codeFiles = mod.codeFiles ?? [];
  const hasPredictions = docs.some((d) => d.category === "predictions");
  const hasChallenges =
    docs.some((d) => d.category === "challenges") ||
    codeFiles.some((c) => c.category === "challenges");
  const hasReview = docs.some(
    (d) => d.category === "review" || (d.name ?? "").toLowerCase() === "review.md"
  );
  const runnable = codeFiles.filter(
    (c) =>
      c.category === "experiments" ||
      c.category === "exercises" ||
      c.category === "debug" ||
      c.category === "challenges"
  );
  const hasPrimary = docs.some((d) => d.isPrimary);
  /** @type {LoopStage[]} */
  const loop = [];
  if (hasPredictions) loop.push("predict");
  if (runnable.length > 0) loop.push("experiment");
  if (hasChallenges) loop.push("break");
  if (hasReview) loop.push("explain");
  return {
    hasPredictions,
    hasChallenges,
    hasReview,
    hasPrimary,
    runnableCount: runnable.length,
    loop,
  };
}

/**
 * @param {{
 *   docs?: Array<{ category?: string; name?: string; isPrimary?: boolean; path?: string }>;
 *   codeFiles?: Array<{ category?: string }>;
 * }} mod
 * @param {{ readmeText?: string; overrideText?: string | null }} [opts]
 */
export function deriveModuleMeta(mod, opts = {}) {
  const flags = deriveFlags(mod);
  const override =
    parseStatusOverride(opts.overrideText ?? "") ??
    parseStatusOverride(opts.readmeText ?? "");

  /** @type {ModuleStatus} */
  let status;
  if (override) {
    status = override;
  } else if (looksLikeScaffoldReadme(opts.readmeText ?? "")) {
    status = "scaffold";
  } else if (flags.hasPrimary && flags.runnableCount > 0) {
    status = "ready";
  } else if (flags.hasPrimary && (flags.hasPredictions || flags.hasReview)) {
    // Primary lesson + pedagogy affordances but no runnable code yet → still scaffold for honesty
    status = "scaffold";
  } else {
    status = "scaffold";
  }

  return {
    status,
    hasPredictions: flags.hasPredictions,
    hasChallenges: flags.hasChallenges,
    loop: flags.loop,
  };
}
