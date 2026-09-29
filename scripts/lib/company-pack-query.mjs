/**
 * Pure helpers for company-packs.json lookups (shared by dsa:gen + tests).
 */

export function companiesForSlug(packs, slug) {
  const p = packs.problems[slug];
  if (!p) return [];
  return p.companies.map((c) => c.name);
}

export function frequencyFor(packs, slug, company) {
  const p = packs.problems[slug];
  if (!p) return 0;
  const hit = p.companies.find((c) => c.name === company);
  return hit?.frequency ?? 0;
}

/** Mirror of CompaniesBrowse / RightPanel window counts. */
export function windowCount(companyMeta, window) {
  if (window === "thirty") return companyMeta.thirty || 0;
  if (window === "threeMonths") return companyMeta.threeMonths || 0;
  return companyMeta.all || companyMeta.count || 0;
}
