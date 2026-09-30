/**
 * Public site origin for SEO (sitemap, robots, Open Graph, canonical).
 *
 * Set `NEXT_PUBLIC_SITE_URL` in `.env.local` (local) and Vercel env (deploy).
 * No trailing slash. Must match the real host users open — wrong values poison
 * canonical URLs and OG previews.
 *
 * Placeholder default below is intentional until the operator locks a real
 * production domain. Do not treat it as confirmation that litcode.dev is live.
 * Local: `http://localhost:3000`. Production: your Vercel URL or custom domain.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://litcode.dev";

export const SITE_NAME = "LITCODE";
export const SITE_TAGLINE = "Predict. Run. Break. Prove.";
export const SITE_DESCRIPTION =
  "Free, open-source developer laboratory — language labs, judged problems, company packs, and interview practice. Predict. Run. Break. Prove.";
