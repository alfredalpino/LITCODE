#!/usr/bin/env node
/**
 * Builds company → problem packs from:
 *  1. liquidslr/leetcode-company-wise-problems
 *  2. snehasishroy/leetcode-companywise-interview-questions (latest snapshot)
 *
 * Per-problem `companies` lists ONLY companies that tagged that problem.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "data", "companies", "company-packs.json");
const CACHE = path.join(ROOT, ".cache");

const SOURCES = [
  {
    id: "liquidslr",
    repo: "https://github.com/liquidslr/leetcode-company-wise-problems.git",
    cache: path.join(CACHE, "leetcode-company-wise-problems"),
    tmp: "/tmp/lc-companies",
    url: "https://github.com/liquidslr/leetcode-company-wise-problems",
    windows: [
      { key: "thirty", match: /^1\.\s*Thirty Days\.csv$/i },
      { key: "threeMonths", match: /^2\.\s*Three Months\.csv$/i },
      { key: "sixMonths", match: /^3\.\s*Six Months\.csv$/i },
      { key: "moreThanSix", match: /^4\.\s*More Than Six Months\.csv$/i },
      { key: "all", match: /^5\.\s*All\.csv$/i },
    ],
    skipDirs: new Set(),
    displayName: (folder) => folder,
    linkKeys: ["Link", "link", "URL", "url"],
    titleKeys: ["Title", "title"],
    freqKeys: ["Frequency", "frequency"],
    freqIsPercent: false,
  },
  {
    id: "snehasishroy",
    repo: "https://github.com/snehasishroy/leetcode-companywise-interview-questions.git",
    cache: path.join(CACHE, "leetcode-companywise-interview-questions"),
    tmp: "/tmp/lc-companies-sneha",
    url: "https://github.com/snehasishroy/leetcode-companywise-interview-questions",
    windows: [
      { key: "thirty", match: /^thirty-days\.csv$/i },
      { key: "threeMonths", match: /^three-months\.csv$/i },
      { key: "sixMonths", match: /^six-months\.csv$/i },
      { key: "moreThanSix", match: /^more-than-six-months\.csv$/i },
      { key: "all", match: /^all\.csv$/i },
    ],
    skipDirs: new Set(["meta", "src", "target", ".github"]),
    displayName: (folder) => prettyCompany(folder),
    linkKeys: ["URL", "url", "Link", "link"],
    titleKeys: ["Title", "title"],
    freqKeys: ["Frequency %", "Frequency", "frequency"],
    freqIsPercent: true,
  },
];

function prettyCompany(slug) {
  const special = {
    tcs: "TCS",
    ibm: "IBM",
    "de-shaw": "DE Shaw",
    deshaw: "DE Shaw",
    "jp-morgan": "JPMorgan",
    jpmorgan: "JPMorgan",
    "morgan-stanley": "Morgan Stanley",
    "goldman-sachs": "Goldman Sachs",
    "walmart-labs": "Walmart Labs",
    bytedance: "ByteDance",
    tiktok: "TikTok",
    meta: "Meta",
    amazon: "Amazon",
    google: "Google",
    microsoft: "Microsoft",
    bloomberg: "Bloomberg",
    apple: "Apple",
    uber: "Uber",
    oracle: "Oracle",
    linkedin: "LinkedIn",
    salesforce: "Salesforce",
    infosys: "Infosys",
    accenture: "Accenture",
    adobe: "Adobe",
    nvidia: "Nvidia",
  };
  const key = slug.toLowerCase();
  if (special[key]) return special[key];
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

/** Collapse near-duplicate display names (amazon / Amazon). */
function canonicalCompany(name) {
  const key = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const aliases = {
    facebook: "Meta",
    meta: "Meta",
    fb: "Meta",
    goog: "Google",
    google: "Google",
    amzn: "Amazon",
    amazon: "Amazon",
    msft: "Microsoft",
    microsoft: "Microsoft",
    byteDance: "ByteDance",
    bytedance: "ByteDance",
    tiktok: "TikTok",
  };
  if (aliases[key]) return aliases[key];
  return name;
}

function ensureRepo(src) {
  if (fs.existsSync(path.join(src.cache, ".git"))) {
    try {
      execSync("git pull --ff-only", { cwd: src.cache, stdio: "ignore" });
    } catch {
      /* offline ok */
    }
    return src.cache;
  }
  if (fs.existsSync(src.tmp) && fs.readdirSync(src.tmp).some((n) => !n.startsWith("."))) {
    return src.tmp;
  }
  fs.mkdirSync(path.dirname(src.cache), { recursive: true });
  console.log(`Cloning ${src.id} …`);
  try {
    execSync(`git clone --depth 1 ${src.repo} "${src.cache}"`, { stdio: "inherit" });
    return src.cache;
  } catch (err) {
    console.warn(`Could not clone ${src.id}:`, err.message || err);
    return null;
  }
}

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = splitCsvLine(lines[0]).map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    if (cols.length < 2) continue;
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = (cols[idx] ?? "").trim();
    });
    rows.push(row);
  }
  return rows;
}

function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQ = !inQ;
      continue;
    }
    if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function normDiff(d) {
  const x = (d || "").toUpperCase();
  if (x.startsWith("E")) return "Easy";
  if (x.startsWith("H")) return "Hard";
  return "Medium";
}

function slugFromLink(link) {
  if (!link) return "";
  try {
    const u = new URL(link);
    const parts = u.pathname.split("/").filter(Boolean);
    const i = parts.indexOf("problems");
    if (i >= 0 && parts[i + 1]) return parts[i + 1].toLowerCase();
    return (parts[parts.length - 1] || "").toLowerCase();
  } catch {
    return (link.replace(/\/$/, "").split("/").pop() || "").toLowerCase();
  }
}

function titleKey(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function pick(row, keys) {
  for (const k of keys) {
    if (row[k] != null && String(row[k]).trim()) return String(row[k]).trim();
  }
  return "";
}

function parseFreq(raw, isPercent) {
  if (!raw) return 0;
  const n = Number(String(raw).replace(/%/g, "").trim());
  if (!Number.isFinite(n)) return 0;
  return isPercent ? Math.round(n) : Math.round(n);
}

function findFile(files, match) {
  return files.find((f) => match.test(f));
}

function readWindow(dir, files, match) {
  const file = findFile(files, match);
  if (!file) return [];
  return parseCsv(fs.readFileSync(path.join(dir, file), "utf8"));
}

/** @type {Map<string, any>} */
const problems = new Map();
/** @type {Map<string, any>} */
const companyMeta = new Map();
const usedSources = [];

function bumpCompany(company, windowsPatch) {
  const prev = companyMeta.get(company) || {
    name: company,
    thirty: 0,
    threeMonths: 0,
    sixMonths: 0,
    moreThanSix: 0,
    all: 0,
  };
  for (const k of Object.keys(windowsPatch)) {
    prev[k] = Math.max(prev[k] || 0, windowsPatch[k] || 0);
  }
  prev.count = prev.all || Math.max(0, prev.thirty, prev.threeMonths, prev.sixMonths, prev.moreThanSix);
  companyMeta.set(company, prev);
}

function stampProblem(company, row, src, key) {
  const title = pick(row, src.titleKeys);
  const link = pick(row, src.linkKeys);
  const slug = slugFromLink(link);
  if (!slug || !title) return;
  const freq = parseFreq(pick(row, src.freqKeys), src.freqIsPercent);
  const topics = String(row.Topics || row.topics || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const difficulty = normDiff(row.Difficulty || row.difficulty);

  if (!problems.has(slug)) {
    problems.set(slug, {
      slug,
      title,
      difficulty,
      topics,
      link: link || `https://leetcode.com/problems/${slug}/`,
      companies: {},
    });
  } else {
    const p = problems.get(slug);
    if ((!p.topics || !p.topics.length) && topics.length) p.topics = topics;
    if (!p.title) p.title = title;
  }

  const p = problems.get(slug);
  const prev = p.companies[company];
  // Prefer all-window frequency; otherwise keep max across sources/windows
  if (key === "all") {
    p.companies[company] = Math.max(prev ?? 0, freq);
  } else if (prev == null) {
    p.companies[company] = freq;
  } else {
    p.companies[company] = Math.max(prev, freq);
  }
}

function ingestSource(src) {
  const root = ensureRepo(src);
  if (!root) return false;
  let companiesSeen = 0;
  for (const dirEnt of fs.readdirSync(root, { withFileTypes: true })) {
    if (!dirEnt.isDirectory() || dirEnt.name.startsWith(".")) continue;
    if (src.skipDirs.has(dirEnt.name.toLowerCase())) continue;
    const dir = path.join(root, dirEnt.name);
    let files;
    try {
      files = fs.readdirSync(dir).filter((f) => f.endsWith(".csv"));
    } catch {
      continue;
    }
    if (!files.length) continue;

    const company = canonicalCompany(src.displayName(dirEnt.name));
    const windows = {
      thirty: 0,
      threeMonths: 0,
      sixMonths: 0,
      moreThanSix: 0,
      all: 0,
    };

    for (const { key, match } of src.windows) {
      const rows = readWindow(dir, files, match);
      windows[key] = Math.max(windows[key], rows.length);
      const stamp = key === "all" || key === "thirty" || key === "threeMonths";
      if (!stamp) continue;
      for (const row of rows) stampProblem(company, row, src, key);
    }

    if (windows.all > 0 || windows.thirty > 0 || windows.threeMonths > 0) {
      bumpCompany(company, windows);
      companiesSeen++;
    }
  }
  console.log(`  ${src.id}: ${companiesSeen} company folders ingested`);
  usedSources.push(src.url);
  return true;
}

console.log("Building company packs from liquidslr + snehasishroy …");
let any = false;
for (const src of SOURCES) {
  if (ingestSource(src)) any = true;
}

if (!any) {
  if (fs.existsSync(OUT)) {
    console.warn("No sources available; keeping existing company-packs.json");
    process.exit(0);
  }
  throw new Error("Could not load any company-wise question repository");
}

const companies = [...companyMeta.values()]
  .filter((c) => (c.count || 0) > 0)
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

const problemsOut = {};
for (const [slug, p] of [...problems.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const companyList = Object.entries(p.companies)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, frequency]) => ({ name, frequency }));
  // A problem with zero companies should not appear
  if (!companyList.length) continue;
  problemsOut[slug] = {
    title: p.title,
    difficulty: p.difficulty,
    topics: p.topics,
    link: p.link,
    companies: companyList,
  };
}

const titleIndex = {};
for (const [slug, p] of Object.entries(problemsOut)) {
  titleIndex[titleKey(p.title)] = slug;
}

const payload = {
  source: usedSources.join(" + "),
  sources: usedSources,
  generatedAt: new Date().toISOString(),
  companyCount: companies.length,
  problemCount: Object.keys(problemsOut).length,
  companies,
  problems: problemsOut,
  titleIndex,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(payload));
console.log(
  `Company packs: ${companies.length} companies · ${Object.keys(problemsOut).length} problems → public/data/companies/company-packs.json`
);
console.log(
  `Top: ${companies
    .slice(0, 8)
    .map((c) => `${c.name}(${c.count})`)
    .join(", ")}`
);
console.log(`Sources: ${usedSources.join(" · ")}`);
