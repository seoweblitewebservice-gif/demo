import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/registry";
import { ALL_GUIDES } from "@/data/allGuides";
import countriesTopo from "world-atlas/countries-110m.json";

const BASE = "https://mapforge.tools";
const slugify = (value: string) => value.normalize("NFKD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const countryPages = Array.from(new Set(((countriesTopo as any).objects.countries.geometries as any[]).map((g) => g.properties?.name).filter(Boolean))).map((name) => ({
  url: `${BASE}/maps/blank/${slugify(name)}`,
  changeFrequency: "monthly" as const,
  priority: 0.7,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    "", "/tools", "/maps", "/guides", "/about", "/methodology", "/data-sources", "/privacy", "/terms", "/contact",
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/tools" ? 0.9 : 0.6,
  }));

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: `${BASE}/tools/${t.slug}`,
    changeFrequency: "monthly" as const,
    priority: t.popular ? 0.8 : 0.7,
  }));

  const guidePages: MetadataRoute.Sitemap = ALL_GUIDES.map((g) => ({
    url: `${BASE}/guides/${g.slug}`,
    lastModified: new Date(g.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...toolPages, ...guidePages, ...countryPages];
}
