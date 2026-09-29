# Netlify Fetch Playground

A small **browser + serverless** target for modules **24 (networking)** and **25 (fetch)**.

You call real HTTP endpoints instead of inventing mock responses. Predict → request → observe.

## What you get

| Route | Purpose |
|---|---|
| `GET/POST … /api/echo` | Mirrors method, query, headers, body (+ geo when deployed) |
| `GET/POST … /api/status` | Returns the status code you ask for (`?code=404`) |

Static UI: `public/index.html`

Functions use Netlify’s modern pattern (`default` export + `config.path`) — the same guidance the Netlify Cursor plugin applies when writing APIs.

## Run locally

```bash
cd javascript-laboratory/netlify-fetch-playground
npx netlify login    # once
npx netlify dev      # serves UI + functions together
```

Open the printed local URL and use the form, or:

```bash
curl -s 'http://localhost:8888/api/status?code=418' | jq
curl -s -X POST http://localhost:8888/api/echo \
  -H 'content-type: application/json' \
  -d '{"probe":true}'
```

## Lab prompts

1. Call `/api/status?code=500`. What are `response.status` and `response.ok`?
2. POST JSON to `/api/echo`. Which request headers did the function see?
3. Change method to `DELETE` on `/api/echo`. Does the body travel? Why?

## Deploy (optional)

```bash
npx netlify deploy --prod
```

Requires a Netlify account and site link. Preview deploys work the same without `--prod`.
