# LITCODE

**Predict. Run. Break. Prove.**

Practice-first developer laboratory — free, open-source direction — language labs + judged interview DSA.

This directory **is** the Next.js project. Open it in Cursor / run `npm` commands from here.

---

## Layout

| Path | Purpose |
|---|---|
| `app/` | Next.js App Router (landing + studio routes) |
| `src/` | UI, studio shell, libs |
| `public/` | Static assets + synced `content/` + `dsa/` |
| `scripts/` | Sync, DSA bank, company packs |
| `docs/` | Audits, architecture, phase reports, decisions |
| `javascript-laboratory/` | JS curriculum source |
| `python-dsa-laboratory/` | Python + DSA curriculum source |
| `typescript-development-laboratory/` | TypeScript curriculum source |
| `BRAND.md` · `brand-*.md` · `logo/` · `assets/` | Brand system |

---

## Run locally

```bash
npm install   # first time
npm run build && npm start
# → http://localhost:3000
```

Dev (rebuilds content catalog from the lab folders in this repo):

```bash
npm run dev
```

`scripts/sync-content.mjs` walks the three `*-laboratory` folders and mirrors them into `public/content/`.

---

## Docs

Architecture, audits, and phase notes: [`docs/`](./docs/) (start with [`docs/WORKSPACE_INDEX.md`](./docs/WORKSPACE_INDEX.md)).

---

## Brand

See [BRAND.md](./BRAND.md) and `colors.md` / `typography.md` / `voice-and-tone.md`.  
Accent: Omarchy / Tokyo Night signal blue `#7AA2F7`.

---

## Notes

- `localStorage` keys remain `sde-lab-*` until a migration ships.
- Git remote / Netlify slug may still say `sde-laboratory-studio` until renamed.
