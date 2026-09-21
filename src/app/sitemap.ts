import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/registry";
import { ALL_GUIDES } from "@/data/allGuides";
import { LOCALES } from "@/lib/i18n";
import { isToolLocalized } from "@/data/localizedTools";
import countriesTopo from "world-atlas/countries-110m.json";

/**
 * Google Sitemap Protocol sitemap.
 * Next.js serializes this to valid XML:
 *   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 *     <url><loc>…</loc><lastmod>…</lastmod>…</url>
 *   </urlset>
 * Only absolute HTTPS canonical URLs for indexable pages (HTTP 200 routes).
 * Excludes: /api/*, query params, noindex, placeholders, duplicates.
 */
const BASE = "https://www.mapbench.site";

/** Stable lastmod so the sitemap does not rewrite every request. */
const SITE_LASTMOD = new Date("2026-09-21");

const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function entry(
  path: string,
  opts: {
    lastModified?: Date;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
    languages?: Record<string, string>;
  } = {},
): MetadataRoute.Sitemap[number] {
  const loc = path === "/" || path === "" ? BASE : `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const item: MetadataRoute.Sitemap[number] = {
    url: loc,
    lastModified: opts.lastModified ?? SITE_LASTMOD,
    changeFrequency: opts.changeFrequency ?? "monthly",
    priority: opts.priority ?? 0.5,
  };
  if (opts.languages && Object.keys(opts.languages).length > 0) {
    item.alternates = { languages: opts.languages };
  }
  return item;
}

function toolHreflang(slug: string): Record<string, string> {
  const path = `/tools/${slug}`;
  const langs: Record<string, string> = {
    en: `${BASE}${path}`,
    "x-default": `${BASE}${path}`,
  };
  for (const locale of LOCALES) {
    if (isToolLocalized(locale, slug)) {
      langs[locale] = `${BASE}/${locale}${path}`;
    }
  }
  return langs;
}

/** Country blank maps from Natural Earth — each has a real /maps/blank/[slug] page. */
function countryBlankEntries(): MetadataRoute.Sitemap {
  const names = new Set<string>();
  const geometries =
    (countriesTopo as { objects?: { countries?: { geometries?: { properties?: { name?: string } }[] } } })
      ?.objects?.countries?.geometries ?? [];
  for (const g of geometries) {
    const name = g?.properties?.name;
    if (name) names.add(name);
  }
  return Array.from(names)
    .map((name) => slugify(name))
    .filter(Boolean)
    .sort()
    .map((slug) =>
      entry(`/maps/blank/${slug}`, {
        changeFrequency: "monthly",
        priority: 0.6,
        lastModified: new Date("2026-01-01"),
      }),
    );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];

  // —— Core English static pages (all return 200, indexable) ——
  const staticPages: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/tools", priority: 0.95, freq: "weekly" },
    { path: "/maps", priority: 0.9, freq: "weekly" },
    { path: "/guides", priority: 0.75, freq: "weekly" },
    { path: "/about", priority: 0.5, freq: "monthly" },
    { path: "/methodology", priority: 0.5, freq: "monthly" },
    { path: "/data-sources", priority: 0.5, freq: "monthly" },
    { path: "/contact", priority: 0.4, freq: "monthly" },
    { path: "/privacy", priority: 0.3, freq: "yearly" },
    { path: "/terms", priority: 0.3, freq: "yearly" },
  ];
  for (const p of staticPages) {
    urls.push(
      entry(p.path, {
        priority: p.priority,
        changeFrequency: p.freq,
        languages: {
          en: p.path === "/" ? `${BASE}/` : `${BASE}${p.path}`,
          "x-default": p.path === "/" ? `${BASE}/` : `${BASE}${p.path}`,
        },
      }),
    );
  }

  // —— Locale home + tools + guides indexes (routes exist under src/app/[locale]) ——
  for (const locale of LOCALES) {
    urls.push(entry(`/${locale}`, { priority: 0.7, changeFrequency: "weekly" }));
    urls.push(entry(`/${locale}/tools`, { priority: 0.65, changeFrequency: "weekly" }));
    urls.push(entry(`/${locale}/guides`, { priority: 0.45, changeFrequency: "monthly" }));
  }

  // —— English tool pages ——
  for (const t of TOOLS) {
    urls.push(
      entry(`/tools/${t.slug}`, {
        priority: t.popular ? 0.85 : 0.7,
        changeFrequency: "monthly",
        languages: toolHreflang(t.slug),
      }),
    );
  }

  // —— Localized tools only when localized copy exists (avoids thin/empty locale URLs) ——
  for (const locale of LOCALES) {
    for (const t of TOOLS) {
      if (!isToolLocalized(locale, t.slug)) continue;
      urls.push(
        entry(`/${locale}/tools/${t.slug}`, {
          priority: t.popular ? 0.65 : 0.55,
          changeFrequency: "monthly",
          languages: toolHreflang(t.slug),
        }),
      );
    }
  }

  // —— Guides ——
  for (const g of ALL_GUIDES) {
    urls.push(
      entry(`/guides/${g.slug}`, {
        lastModified: g.date ? new Date(g.date) : SITE_LASTMOD,
        priority: 0.55,
        changeFrequency: "yearly",
      }),
    );
  }

  // —— Blank country maps ——
  urls.push(...countryBlankEntries());

  // Deduplicate by loc (keep first / highest priority order above)
  const seen = new Set<string>();
  const deduped: MetadataRoute.Sitemap = [];
  for (const item of urls) {
    const key = item.url.replace(/\/$/, "") || BASE;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  return deduped;
}
