# Company packs

Pipeline that builds company → problem packs for the LITCODE tanker.

## Sources

Cloned into `.cache/` (gitignored) on demand:

1. [liquidslr/leetcode-company-wise-problems](https://github.com/liquidslr/leetcode-company-wise-problems)
2. [snehasishroy/leetcode-companywise-interview-questions](https://github.com/snehasishroy/leetcode-companywise-interview-questions)

## Commands

```bash
npm run companies:gen   # → public/data/companies/company-packs.json
npm run dsa:gen         # consumes packs → public/data/dsa/*
```

`predev` / `prebuild` run both after lab sync.

## Runtime

The app loads packs from `/data/companies/company-packs.json` only (see `src/lib/dsa/loader.ts`). Do not serve company data from elsewhere.
