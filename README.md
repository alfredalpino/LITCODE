# SDE Laboratory Studio

LeetCode-style learning UI for the three local laboratories:

- **JavaScript Laboratory**
- **Python + DSA Laboratory**
- **TypeScript Laboratory**

Reading material on the left, Monaco editor + console on the right. Mobile uses Read / Code tabs.

## Local development

```bash
npm install
npm run sync   # copies lab content into public/content
npm run dev
```

`predev` / `prebuild` run sync automatically.

## Run code in the browser

| Language | Runtime |
|---|---|
| JavaScript | Sandboxed `AsyncFunction` |
| TypeScript | Sucrase strip → JS |
| Python | Pyodide (CDN, first run downloads runtime) |

## Deploy

Static Vite build on Netlify. See `netlify.toml`.
