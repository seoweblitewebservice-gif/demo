import { TOOLS } from "@/lib/registry";
import { ALL_GUIDES } from "@/data/allGuides";
import { LOCALES } from "@/lib/i18n";
import { isToolLocalized } from "@/data/localizedTools";
import countriesTopo from "world-atlas/countries-110m.json";

export const dynamic = "force-static";
export const revalidate = 86400;

const BASE = "https://www.mapbench.site";
const LASTMOD = "2026-09-21";

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface UrlRow {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

function urlBlock(row: UrlRow): string {
  const lines = [`  <url>`, `    <loc>${escapeXml(row.loc)}</loc>`];
  if (row.lastmod) lines.push(`    <lastmod>${row.lastmod}</lastmod>`);
  if (row.changefreq) lines.push(`    <changefreq>${row.changefreq}</changefreq>`);
  if (row.priority) lines.push(`    <priority>${row.priority}</priority>`);
  lines.push(`  </url>`);
  return lines.join("\n");
}

function buildUrls(): UrlRow[] {
  const rows: UrlRow[] = [];
  const seen = new Set<string>();

  const add = (path: string, changefreq: string, priority: string, lastmod = LASTMOD) => {
    const loc =
      path === "/" || path === ""
        ? BASE
        : `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
    const key = loc.replace(/\/$/, "");
    if (seen.has(key)) return;
    seen.add(key);
    rows.push({ loc, lastmod, changefreq, priority });
  };

  // Core static pages
  add("/", "weekly", "1.0");
  add("/tools", "weekly", "0.9");
  add("/maps", "weekly", "0.9");
  add("/guides", "weekly", "0.7");
  add("/about", "monthly", "0.5");
  add("/methodology", "monthly", "0.5");
  add("/data-sources", "monthly", "0.5");
  add("/contact", "monthly", "0.4");
  add("/privacy", "yearly", "0.3");
  add("/terms", "yearly", "0.3");

  // Locale indexes
  for (const locale of LOCALES) {
    add(`/${locale}`, "weekly", "0.7");
    add(`/${locale}/tools`, "weekly", "0.65");
    add(`/${locale}/guides`, "monthly", "0.45");
  }

  // English tools
  for (const t of TOOLS) {
    add(`/tools/${t.slug}`, "monthly", t.popular ? "0.85" : "0.7");
  }

  // Localized tools (only with copy)
  for (const locale of LOCALES) {
    for (const t of TOOLS) {
      if (isToolLocalized(locale, t.slug)) {
        add(`/${locale}/tools/${t.slug}`, "monthly", t.popular ? "0.65" : "0.55");
      }
    }
  }

  // Guides
  for (const g of ALL_GUIDES) {
    const lm = g.date ? String(g.date).slice(0, 10) : LASTMOD;
    add(`/guides/${g.slug}`, "yearly", "0.55", lm);
  }

  // Country blank maps
  const geometries =
    (countriesTopo as { objects?: { countries?: { geometries?: { properties?: { name?: string } }[] } } })
      ?.objects?.countries?.geometries ?? [];
  const names = new Set<string>();
  for (const g of geometries) {
    if (g?.properties?.name) names.add(g.properties.name);
  }
  for (const name of Array.from(names).sort((a, b) => a.localeCompare(b))) {
    const slug = slugify(name);
    if (slug) add(`/maps/blank/${slug}`, "monthly", "0.6", "2026-01-01");
  }

  return rows;
}

export async function GET() {
  const rows = buildUrls();
  const body = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...rows.map(urlBlock),
    `</urlset>`,
    "",
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
