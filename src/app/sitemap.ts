/**
 * Disabled in favour of src/app/sitemap.xml/route.ts
 * which emits pretty-printed Google Sitemap Protocol XML.
 * Keeping this file empty-export-free would conflict; Next.js
 * prefers one sitemap source — the route handler is authoritative.
 */
import type { MetadataRoute } from "next";

/** @deprecated Use /sitemap.xml route handler */
export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}
