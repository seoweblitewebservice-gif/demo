import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/registry";
import { ALL_GUIDES } from "@/data/allGuides";
import { LOCALES } from "@/lib/i18n";
import { isToolLocalized } from "@/data/localizedTools";
import countriesTopo from "world-atlas/countries-110m.json";

const BASE = "https://www.mapbench.site";

const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function englishOnly(path: string) {
  const p = path || "/";
  return { en: `${BASE}${p}`, "x-default": `${BASE}${p}` };
}

function localizedToolAlternates(path: string, slug: string) {
  return Object.fromEntries([
    ["en", `${BASE}${path}`],
    ["x-default", `${BASE}${path}`],
    ...LOCALES.filter((locale) => isToolLocalized(locale, slug)).map((locale) => [
      locale,
      `${BASE}/${locale}${path}`,
    ]),
  ]);
}

/** All country blank-map pages from Natural Earth geometries */
const countryPages: MetadataRoute.Sitemap = Array.from(
  new Set(
    ((countriesTopo as { objects: { countries: { geometries: { properties?: { name?: string } }[] } } }).objects
      .countries.geometries as { properties?: { name?: string } }[])
      .map((g) => g.properties?.name)
      .filter((n): n is string => Boolean(n)),
  ),
)
  .map((name) => ({
    url: `${BASE}/maps/blank/${slugify(name)}`,
    changeFrequency: "monthly" as const,
    priority: 0.65,
    lastModified: new Date("2026-01-01"),
  }))
  .sort((a, b) => a.url.localeCompare(b.url));

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Core static pages
  const staticDefs: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/tools", priority: 0.95, changeFrequency: "weekly" },
    { path: "/maps", priority: 0.9, changeFrequency: "weekly" },
    { path: "/guides", priority: 0.75, changeFrequency: "weekly" },
    { path: "/about", priority: 0.5, changeFrequency: "monthly" },
    { path: "/methodology", priority: 0.5, changeFrequency: "monthly" },
    { path: "/data-sources", priority: 0.5, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.4, changeFrequency: "monthly" },
  ];

  const staticPages: MetadataRoute.Sitemap = staticDefs.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
    alternates: { languages: englishOnly(path || "/") },
  }));

  // Locale home + tools index (where locale routes exist)
  const localeIndexPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => [
    {
      url: `${BASE}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE}/${locale}/tools`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    },
    {
      url: `${BASE}/${locale}/guides`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.45,
    },
  ]);

  // English tool pages
  const toolPages: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: `${BASE}/tools/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: t.popular ? 0.85 : 0.72,
    alternates: {
      languages: localizedToolAlternates(`/tools/${t.slug}`, t.slug),
    },
  }));

  // Localized tool pages (only when copy exists)
  const localizedTools: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    TOOLS.filter((t) => isToolLocalized(locale, t.slug)).map((t) => ({
      url: `${BASE}/${locale}/tools/${t.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: t.popular ? 0.68 : 0.55,
      alternates: {
        languages: localizedToolAlternates(`/tools/${t.slug}`, t.slug),
      },
    })),
  );

  // Blog / guides
  const guidePages: MetadataRoute.Sitemap = ALL_GUIDES.map((g) => ({
    url: `${BASE}/guides/${g.slug}`,
    lastModified: new Date(g.date),
    changeFrequency: "yearly" as const,
    priority: 0.55,
    alternates: { languages: englishOnly(`/guides/${g.slug}`) },
  }));

  return [
    ...staticPages,
    ...localeIndexPages,
    ...toolPages,
    ...localizedTools,
    ...guidePages,
    ...countryPages,
  ];
}
