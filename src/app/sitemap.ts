import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/registry";
import { ALL_GUIDES } from "@/data/allGuides";

const BASE = "https://mapforge.tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    "", "/tools", "/maps", "/guides", "/about", "/methodology", "/data-sources", "/privacy", "/terms",
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

  return [...staticPages, ...toolPages, ...guidePages];
}
