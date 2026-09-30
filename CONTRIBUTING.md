# Contributing

1. Fork and clone the repository.
2. `cp .env.example .env.local`
3. `npm install`
4. `npm run dev`
5. Before a pull request: `npm run lint && npm run typecheck && npm test`

CI runs those three checks plus `npm audit` on every pull request. Keep each change focused: one behavior, and a test that pins it.

Curriculum generator scripts live in the `laboratories/*/scripts` folders. `scripts/sync-content.mjs` does not copy those `scripts/` directories into `public/data`.
