# Phase 10 — Commercial Readiness

**Date:** 2026-09-30  
**Status:** Delivered (SEO + messaging hooks; pricing doc-only)

## SEO & discoverability

| Item | Implementation |
| --- | --- |
| Metadata | `app/layout.tsx` — title template, description, keywords, OG, Twitter, canonical |
| Site URL | `NEXT_PUBLIC_SITE_URL` → `src/lib/site.ts` (default `https://litcode.dev`) |
| Robots | `app/robots.ts` |
| Sitemap | `app/sitemap.ts` — `/`, `/labs`, `/problems`, `/progress`, `/interview`, `/contest`, `/profile` |

**Deploy:** Set `NEXT_PUBLIC_SITE_URL` to the production Vercel URL before launch.

## Landing & messaging

- Product name **LITCODE**; tagline **Predict. Run. Break. Prove.**
- Default entry **`/labs`** (lab-forward loop); Problems positioned as judged + indexed practice
- Honest deferrals: contests, assessments, multi-file projects

## Analytics (privacy-conscious)

- `src/lib/analytics.ts` — no-op unless `NEXT_PUBLIC_ANALYTICS_ENDPOINT` is set
- Events: `nav_section`, `search_used`, `module_opened`, `challenge_opened` (dev: `console.debug`)
- Learning evidence remains **local** (`sde-lab-events-v1`); analytics is optional telemetry only

## Pricing architecture (documentation only)

Not implemented in product — intended tiers for a future billing phase:

| Tier | Audience | Includes | Excludes (v1) |
| --- | --- | --- | --- |
| **Free** | Self-learners | Labs (ready modules), judged Problems subset, local progress | Cloud sync, contests, team seats |
| **Pro** | Interview prep | Full judged bank, Interview mode, company packs, export (future) | Enterprise SSO |
| **Team** | Bootcamps / cohorts | Seat admin, shared assignments (future) | On-prem runner |

Monetization gates should attach to **server-backed** features (sync, contests, isolation) — not local-only progress.

## Legal / ops checklist (pre-launch P0)

- [ ] Privacy policy (localStorage + optional analytics endpoint)
- [ ] Terms (user-generated code runs in browser; no warranty on external DSA links)
- [ ] Production `NEXT_PUBLIC_SITE_URL` + OG image
- [ ] Netlify env for analytics endpoint (if used)

## Verification

```bash
npm run build
# Inspect .next/server/app/robots.meta / sitemap output or curl /robots.txt on preview
```
