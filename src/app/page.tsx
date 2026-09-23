import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Map Tools & Blank Maps",
  description:
    "Free online map and geographic tools for distance, area, radius, routing, coordinates, elevation, GPS files and printable blank maps. No account required.",
  alternates: {
    canonical: "/",
    languages: {
      en: "https://www.mapbench.site/",
      "x-default": "https://www.mapbench.site/",
      ...Object.fromEntries(
        ["es", "de", "fr", "it", "pt", "nl", "pl", "ru", "sv", "da", "no", "fi", "cs", "ro", "el", "hu", "tr", "uk", "ar", "ja", "ko", "zh", "hi"].map((l) => [
          l,
          `https://www.mapbench.site/${l}`,
        ]),
      ),
    },
  },
};

import { CATEGORIES, TOOLS } from "@/lib/registry";
import { ALL_GUIDES } from "@/data/allGuides";
import { TOOL_COPY } from "@/data/toolCopy";
import BlankMapsHomeGrid from "@/components/BlankMapsHomeGrid";

const POPULAR_QUESTIONS: { q: string; href: string }[] = [
  { q: "What county am I in?", href: "/tools/what-county-am-i-in" },
  { q: "How far can I drive in 30 minutes?", href: "/tools/drive-time-map" },
  { q: "Find my location", href: "/tools/find-my-location" },
  { q: "Geocode a list of addresses (batch)", href: "/tools/batch-geocoder" },
  { q: "Distance between two cities", href: "/tools/distance-between-two-places" },
  { q: "Draw a radius on a map", href: "/tools/map-radius" },
  { q: "Measure lot size or acreage on a map", href: "/tools/lot-size-calculator" },
  { q: "What is my latitude and longitude?", href: "/tools/latitude-longitude-finder" },
  { q: "Find ZIP codes within 50 miles", href: "/tools/zip-codes-within-radius" },
  { q: "Qibla direction from my location", href: "/tools/qibla-direction-finder" },
  { q: "Distance matrix for many places", href: "/tools/distance-matrix-calculator" },
  { q: "Sunrise and sunset times", href: "/tools/sunrise-sunset-calculator" },
];

const HOME_FAQ: [string, string][] = [
  [
    "What is MapBench?",
    "MapBench is a free collection of interactive map tools and printable blank maps. Measure distance, draw radii, plan drive times, look up coordinates, elevation, ZIP codes and more — all in your browser, with no account.",
  ],
  [
    "Are the tools really free?",
    "Yes. Every tool and every blank map is free forever. There is no premium tier, trial, or paywall.",
  ],
  [
    "Do I need to create an account?",
    "No. Nothing requires sign-up. Open a tool and start using it immediately.",
  ],
  [
    "Do the tools work on mobile?",
    "Yes. Pages are responsive. Location tools use your phone GPS when you allow permission; maps pinch-zoom and work on modern mobile browsers.",
  ],
  [
    "What data sources does MapBench use?",
    "OpenStreetMap (maps & geocoding), Valhalla/OSRM (routing), Copernicus DEM via Open-Meteo (elevation), Natural Earth and US Census (blank maps). Full attribution is on the data sources page.",
  ],
  [
    "Do the tools work outside the United States?",
    "Yes. Most tools are worldwide. A few (like strong ZIP coverage) are US-focused and labelled as such on the tool page.",
  ],
  [
    "Can I use the blank maps commercially?",
    "Yes. Blank maps are generated from public-domain Natural Earth and Census geometry. You may use them in textbooks, presentations, YouTube, merchandise and commercial projects — check the data sources page for any OSM-related attribution if you export OSM-based maps.",
  ],
  [
    "How accurate are the distance and area calculations?",
    "Distances use great-circle math on WGS84 (within about 0.3% of full ellipsoidal geodesics). Areas use spherical excess. Drive times are free-flow road estimates, not live traffic — and we say so on those pages.",
  ],
  [
    "Is my location data stored or shared?",
    "No. GPS stays in your browser. A reverse-geocode request only sends coordinates to public geocoders to fetch an address. Files (KML, GPX, CSV) are parsed locally and never uploaded to our servers.",
  ],
  [
    "Can I embed a tool on my own website?",
    "You can link to any tool page freely. Full iframe embed is not a product feature yet — use a direct link or contact us if you need a partnership setup.",
  ],
  [
    "How often is the data updated?",
    "Map tiles and geocoding follow OpenStreetMap’s continuous updates. Elevation and boundary datasets refresh when upstream providers publish new releases. City population figures are labelled with their approximate vintage.",
  ],
  [
    "Why does Find My Location look wrong with a VPN?",
    "Device GPS is independent of VPN, but many VPN apps block or delay location APIs. When GPS fails we fall back to IP location — which shows the VPN exit city (sometimes over water). Allow location permission or turn off VPN location-blocking for a precise result.",
  ],
];

export default function HomePage() {
  return (
    <div className="doc">
      {/* ---------- HERO with map background ---------- */}
      <section className="hero-map relative overflow-hidden border-b border-line">
        <div className="hero-map-bg" aria-hidden />
        <div className="hero-map-fade" aria-hidden />
        <div className="relative z-[1] mx-auto max-w-3xl px-4 py-14 text-center sm:py-20">
          <p className="mb-3 font-sans text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-strong">
            Free · No sign-up · Runs in your browser
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.12] tracking-tight text-ink sm:text-5xl md:text-[3.25rem]">
            Free Map Tools & Blank Maps
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-mute sm:text-base">
            {TOOLS.length}+ interactive geographic tools and printable blank maps. Drive time maps, radius
            circles, distance calculators, county finders, elevation lookup, and more. All free, no account
            required — your files and positions never leave your browser.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-sans">
            <Link href="/tools" className="btn btn-primary px-6 py-3 text-[15px]">
              Explore All Tools
            </Link>
            <Link href="/maps" className="btn btn-ghost bg-card/80 px-6 py-3 text-[15px] backdrop-blur-sm">
              Browse Blank Maps
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- POPULAR QUESTIONS ---------- */}
      <section aria-labelledby="popular-q" className="border-b border-line py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h2 id="popular-q" className="text-center font-display text-2xl font-bold tracking-tight sm:text-[1.65rem]">
            Popular questions our tools answer
          </h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {POPULAR_QUESTIONS.map((item) => (
              <Link
                key={item.href + item.q}
                href={item.href}
                className="rounded-lg border border-line bg-card px-4 py-3.5 text-left font-sans text-sm font-semibold text-ink shadow-sm transition hover:border-brand hover:bg-brand-soft/40 hover:text-brand-strong"
              >
                {item.q}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FULL TOOL LIST ---------- */}
      <section aria-labelledby="all-tools" className="mx-auto max-w-3xl px-4 py-10">
        <h2 id="all-tools" className="sect-h">
          Free Map Tools
        </h2>
        <p className="mt-3">
          Every tool runs in your browser. No downloads, no accounts, no usage limits. Worldwide coverage
          where the underlying open data exists.
        </p>
        {CATEGORIES.map((cat) => {
          const list = TOOLS.filter((t) => t.category === cat.id);
          if (!list.length) return null;
          return (
            <div key={cat.id} className="mt-8">
              <h3 className="font-sans text-[11px] font-extrabold uppercase tracking-[0.14em] text-mute">
                {cat.label} — {list.length} tools
              </h3>
              <div className="mt-3 space-y-6">
                {list.map((t) => (
                  <article key={t.slug}>
                    <h4 className="text-lg">
                      <Link href={`/tools/${t.slug}`} className="toollink">
                        {t.name}
                      </Link>
                      <span className="ml-2 align-middle font-sans text-[10px] font-bold uppercase tracking-wide text-mute">
                        {t.scope}
                      </span>
                    </h4>
                    <p className="mt-0.5">
                      {t.intro}
                      {TOOL_COPY[t.slug] ? ` ${TOOL_COPY[t.slug].paras[0]}` : ""}
                    </p>
                    <p className="font-sans text-sm">
                      <Link href={`/tools/${t.slug}`} className="font-extrabold text-brand-strong hover:underline">
                        Open tool →
                      </Link>
                      <span className="ml-3 text-xs text-mute">free · no account · shareable results</span>
                    </p>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ---------- BLANK MAPS ---------- */}
      <section aria-labelledby="blank-maps" className="border-t border-line bg-well/50 py-10">
        <div className="container-sf">
          <h2 id="blank-maps" className="sect-h">
            Free Printable Blank Maps
          </h2>
          <p className="mt-3 max-w-3xl">
            Clean outline maps rendered from public-domain Natural Earth and US Census geometry. Download as
            SVG or PNG for worksheets, presentations and design work — no watermarks.
          </p>
          <div className="mt-5">
            <BlankMapsHomeGrid />
          </div>
          <p className="mt-4 font-sans text-sm">
            <Link href="/maps" className="font-extrabold text-brand-strong hover:underline">
              Browse all blank maps (world, countries, US states) →
            </Link>
          </p>
        </div>
      </section>

      {/* ---------- GUIDES ---------- */}
      <section aria-labelledby="studies" className="mx-auto max-w-3xl px-4 py-10">
        <h2 id="studies" className="sect-h">
          From the Blog
        </h2>
        <p className="mt-3">
          Field notes and workflows — every post links the tools it uses.{" "}
          <Link href="/guides" className="font-sans font-extrabold text-brand-strong hover:underline">
            Read all posts →
          </Link>
        </p>
        <div className="mt-4 grid gap-4 font-sans sm:grid-cols-3">
          {ALL_GUIDES.slice(0, 3).map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="card group p-4">
              <div className="text-[10px] font-extrabold uppercase tracking-wide text-mute">{g.readMins} min read</div>
              <div className="mt-1 font-display text-[15px] font-bold leading-snug group-hover:text-brand-strong">{g.title}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- DATA SOURCES (competitor-style list) ---------- */}
      <section aria-labelledby="sources" className="border-t border-line py-10">
        <div className="mx-auto max-w-3xl px-4">
          <h2 id="sources" className="sect-h">
            Data sources
          </h2>
          <p className="mt-3">Every dataset used by MapBench is public, open, and free:</p>
          <ul className="mt-3 list-disc space-y-1.5 pl-6">
            <li>
              <strong>Map tiles:</strong> OpenFreeMap (OpenStreetMap data, free, no API key)
            </li>
            <li>
              <strong>Geocoding:</strong> Photon (autocomplete) + Nominatim (reverse geocoding)
            </li>
            <li>
              <strong>Routing:</strong> Valhalla on FOSSGIS public server (drive-time isochrones)
            </li>
            <li>
              <strong>US boundaries:</strong> US Census Bureau TIGER/Line
            </li>
            <li>
              <strong>World boundaries:</strong> Natural Earth 1:50m (public domain)
            </li>
            <li>
              <strong>Elevation:</strong> Copernicus GLO-90 DEM (~90 m) via Open-Meteo
            </li>
            <li>
              <strong>Time zones:</strong> IANA tz database via timezone boundary data
            </li>
          </ul>
          <p className="mt-3 font-sans text-sm">
            <Link href="/data-sources" className="font-extrabold text-brand-strong hover:underline">
              Full attribution & licences →
            </Link>
          </p>
        </div>
      </section>

      {/* ---------- FAQ (expanded, competitor-style accordion) ---------- */}
      <section aria-labelledby="faq" className="border-t border-line bg-well/40 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h2 id="faq" className="sect-h">
            Frequently asked questions
          </h2>
          <div className="mt-6 divide-y divide-line rounded-xl border border-line bg-card">
            {HOME_FAQ.map(([q, a]) => (
              <details key={q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-sans text-[15px] font-semibold text-ink marker:content-none">
                  <span>{q}</span>
                  <span className="shrink-0 text-lg font-light text-mute transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 pr-8 font-serif text-sm leading-relaxed text-mute">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: HOME_FAQ.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />
    </div>
  );
}
