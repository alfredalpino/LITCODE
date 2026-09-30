# LITCODE

**Predict. Run. Break. Prove.**

[![License: MIT](https://img.shields.io/badge/License-MIT-ff7a33.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178C6.svg)](https://www.typescriptlang.org/)

**LITCODE** is a free, open-source developer laboratory for learning languages and practicing interview DSA — without grind-app theater.

Language labs · judged problems · company packs · interview mode · Tokyo Night studio UI.

> Repo: [github.com/alfredalpino/LITCODE](https://github.com/alfredalpino/LITCODE)

---

## Why LITCODE

Most “LeetCode clones” dump a problem bank and a timer. LITCODE is built around a tighter loop:

1. **Predict** what the code will do  
2. **Run** it in a real language environment  
3. **Break** your assumptions with tests and edge cases  
4. **Prove** you understand it — not that you memorized a pattern name  

---

## Features

| Area | What you get |
|------|----------------|
| **Language labs** | Learning tracks for JS, TypeScript, Python, Ruby, Rust, C/C++, Java, Go, Kotlin, Swift, PHP, C# — with real language logos in the studio |
| **Judged DSA** | Auto-judged challenges (Run = visible cases, Submit = full suite) plus a large company-tagged interview set |
| **Company packs** | Browse companies and open packs sourced from public company-wise interview lists ([liquidslr](https://github.com/liquidslr/leetcode-company-wise-problems) + [snehasishroy](https://github.com/snehasishroy/leetcode-companywise-interview-questions)) |
| **Per-problem companies** | On each title, see which companies have asked it (ranked by reported frequency) |
| **Multi-language arena** | JS / TS / Python run in-browser; other languages execute via a sandboxed remote judge (`/api/execute`, Judge0-compatible) |
| **Interview mode** | Judged-only practice with visible vs hidden tests |
| **Studio UX** | Omarchy / Tokyo Night shell, fiery orange LITCODE accent, animated campfire mark |

---

## Quick start

```bash
git clone https://github.com/alfredalpino/LITCODE.git
cd LITCODE
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app refuses to boot when `JUDGE0_URL` is missing. `.env.example` has a public Judge0 CE default you can keep for local practice.

Production-style run:

```bash
npm run build && npm start
```

Docker (self-contained sandbox):

```bash
docker compose up --build
# health: http://localhost:3000/api/health
```

Files: `Dockerfile`, `docker-compose.yml`, `.dockerignore`.

### Useful scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (syncs lab content, regenerates company packs + DSA bank) |
| `npm run build` | Production build |
| `npm run lint` | Oxlint (`correctness` rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test:coverage` | Vitest with v8 coverage |
| `npm test` | Vitest (`tests/`, `src/**/*.spec.ts`) then Node script tests (`scripts/test-*`) |
| `npm run companies:gen` | Rebuild company packs from upstream CSVs |
| `npm run dsa:gen` | Rebuild the DSA interview index |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests, and `npm audit` on every push and pull request.

### Environment

Copy `.env.example` to `.env.local`. Required and optional variables:

| Variable | Required | Purpose |
|----------|----------|---------|
| `NODE_ENV` | Set by Next | `development`, `test`, or `production` |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical site URL (SEO / OG). No trailing slash |
| `JUDGE0_URL` | Yes, except tests and `next build` | Judge0 base URL |
| `JUDGE0_AUTH_TOKEN` | No | Auth token if your Judge0 instance requires it |
| `LITCODE_EXECUTE_URL` | No | Server-side origin for `/api/execute` |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | No | Optional POST endpoint for learning events |
| `SENTRY_DSN` | No | Optional error-tracking sink |
| `LOG_LEVEL` | No | pino level (`info` by default) |

---

## Project layout

```
LITCODE/
├── app/                 # Next.js App Router (landing + studio + API)
├── src/                 # UI, studio shell, runners, DSA loaders
├── public/              # Static assets, synced content/, dsa/
├── scripts/             # Sync, DSA bank, company packs, tests
├── docs/                # Architecture, audits, decisions, brand
├── laboratories/        # Curriculum sources (mirrored into public/data)
├── companies/           # Company pack pipeline
└── public/data/         # Runtime tanker (catalog, labs, DSA, companies)
```

Curriculum folders are walked by `scripts/sync-content.mjs` into `public/data/` on `predev` / `prebuild`. Generator scripts under each laboratory's `scripts/` directory stay out of that mirror so they are not duplicated into the tanker.

---

## Stack

- **Next.js 16** · **React 19** · **TypeScript**
- Monaco editor · Framer Motion · Sucrase (TS in-browser)
- Pyodide for Python in the browser
- Judge0-compatible remote execute for compiled / other languages
- Deployable on Vercel

---

## Contributing

Issues and PRs are welcome.

1. Fork and clone  
2. `cp .env.example .env.local && npm install && npm run dev`  
3. Keep changes focused; run `npm run lint && npm test` before opening a PR  
4. Prefer honest lab status (`ready` vs `scaffold`) — don’t mark unfinished modules as ready  

Deeper notes: [`docs/WORKSPACE_INDEX.md`](./docs/WORKSPACE_INDEX.md)

---

## Brand

See [docs/brand/BRAND.md](./docs/brand/BRAND.md).

- Product name: **LITCODE**  
- Tagline: **Predict. Run. Break. Prove.**  
- Accent: fiery orange (`#ff7a33` on dark UI)  
- Theme: Omarchy / Tokyo Night  

---

## License

MIT — see [LICENSE](./LICENSE).

---

Built for people who want signal over subscription gates.
