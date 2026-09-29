import type { CompanyPacksFile, DsaIndexItem } from "./types";

/** Problems tagged for a company — prefer pack frequency data, fall back to index tags. */
export function itemsForCompany(
  company: string,
  items: DsaIndexItem[],
  packs: CompanyPacksFile | null
): DsaIndexItem[] {
  if (!company) return [];

  if (packs?.problems) {
    const slugs = new Set<string>();
    const freq = new Map<string, number>();
    for (const [slug, meta] of Object.entries(packs.problems)) {
      const hit = meta.companies.find((c) => c.name === company);
      if (hit) {
        slugs.add(slug);
        freq.set(slug, hit.frequency || 0);
      }
    }
    const matched = items
      .filter((it) => {
        const slug = it.slug || (it.id.startsWith("lc-") ? it.id.slice(3) : "");
        return (slug && slugs.has(slug)) || it.companies.includes(company);
      })
      .map((it) => {
        const slug = it.slug || (it.id.startsWith("lc-") ? it.id.slice(3) : "");
        return {
          ...it,
          frequency: (slug && freq.get(slug)) || it.frequency || 0,
        };
      });
    matched.sort(
      (a, b) => (b.frequency || 0) - (a.frequency || 0) || a.title.localeCompare(b.title)
    );
    return matched;
  }

  return items
    .filter((it) => it.companies.includes(company))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function companySlug(name: string): string {
  return encodeURIComponent(name);
}

export function companyFromSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}
