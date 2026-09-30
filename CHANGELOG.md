# Changelog

All notable changes to LITCODE are documented in this file.

## [2.0.0] - 2026-09-30

### Added
- Vitest unit suite under `tests/` and `src/**/*.spec.ts`, plus script-level Node tests
- GitHub Actions CI: lint, typecheck, test, dependency audit
- Dockerfile / docker-compose with health checks for sandboxed runs
- Zod validation for `/api/execute`, startup env checks, `/api/health` and `/api/metrics`
- Structured logging (pino) and optional Sentry DSN error capture
- Dependabot for npm and GitHub Actions

### Changed
- Split DSA arena UI into focused components under the 500-line guideline
- Deduped curriculum generator scripts out of `public/content`
- Split judged seed bank builder into `scripts/dsa-seed-batch-*.mjs`

### Security
- Documented reporting in `SECURITY.md`
- Execute payloads size-limited and schema-validated before Judge0 proxying
