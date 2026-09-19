import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/registry";
import { ALL_GUIDES } from "@/data/allGuides";
import { LOCALES } from "@/lib/i18n";
import { isToolLocalized } from "@/data/localizedTools";
import countriesTopo from "world-atlas/countries-110m.json";

const BASE = "https://www.mapbench.site";
const slugify = (value: string) => value.normalize("NFKD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const englishOnly = (path: string) => ({ en: `${BASE}${path}`, "x-default": `${BASE}${path}` });
const localizedToolAlternates = (path: string, slug: string) => Object.fromEntries([
  ["en", `${BASE}${path}`],
  ["x-default", `${BASE}${path}`],
  ...LOCALES.filter(locale => isToolLocalized(locale, slug)).map(locale => [locale, `${BASE}/${locale}${path}`]),
]);

const countryPages = Array.from(
  new Set(
    ((countriesTopo as any).objects.countries.geometries as any[])
      .map(g => g.properties?.name)
      .filter(Boolean)
  )
).map(name => ({
  url: `${BASE}/maps/blank/${slugify(name)}`,
  changeFrequency: "monthly" as const,
  priority: 0.7,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/tools", "/maps", "/guides", "/about", "/methodology", "/data-sources", "/privacy", "/terms", "/contact"];
  const staticPages = staticPaths.map(path => ({
    url: `${BASE}${path}`,
    changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
    priority: path === "" ? 1 : path === "/tools" ? 0.9 : 0.6,
    alternates: { languages: englishOnly(path || "/") },
  }));

  const toolPages = TOOLS.map(t => ({
    url: `${BASE}/tools/${t.slug}`,
    changeFrequency: "monthly" as const,
    priority: t.popular ? 0.8 : 0.7,
    alternates: {
      languages: localizedToolAlternates(`/tools/${t.slug}`, t.slug),
    },
  }));

  const guidePages = ALL_GUIDES.map(g => ({
    url: `${BASE}/guides/${g.slug}`,
    lastModified: new Date(g.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
    alternates: {
      languages: englishOnly(`/guides/${g.slug}`),
    },
  }));

  const localizedTools = LOCALES.flatMap(locale =>
    TOOLS.filter(t => isToolLocalized(locale, t.slug)).map(t => ({
      url: `${BASE}/${locale}/tools/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: t.popular ? 0.65 : 0.55,
      alternates: {
        languages: localized(`/tools/${t.slug}`),
      },
    }))
  );

  const localizedGuides: MetadataRoute.Sitemap = [];

  return [...staticPages, ...toolPages, ...guidePages, ...countryPages, ...localizedTools, ...localizedGuides];
}
