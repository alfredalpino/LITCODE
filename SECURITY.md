# Security

## Reporting

Open a GitHub security advisory or email the maintainer. Do not file a public issue for an unfixed vulnerability.

## What this app does with code you run

- JavaScript, TypeScript, and Python execute in the browser.
- Other languages are sent to the Judge0-compatible endpoint in `JUDGE0_URL` via `POST /api/execute`.
- Payloads are schema-checked (Zod) and size-limited before they leave the server.
- Do not point `JUDGE0_URL` at a shared instance you do not trust with student source code.

## Secrets

- Never commit `.env.local` or real tokens.
- `.env.example` lists every variable the server reads. `JUDGE0_AUTH_TOKEN` and `SENTRY_DSN` stay empty in the example.
- Production must set `JUDGE0_URL` and `NEXT_PUBLIC_SITE_URL`. The server throws at startup when they are missing.

## Dependencies

GitHub Actions runs `npm audit --audit-level=high` on every pull request. Dependabot opens weekly update PRs.
