import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Map Tools & Blank Maps",
  description: "Free online map and geographic tools for distance, area, radius, routing, coordinates, elevation, GPS files and printable blank maps. No account required.",
  alternates: { canonical: "/" },
};

import { CATEGORIES, TOOLS } from "@/lib/registry";
import { ALL_GUIDES } from "@/data/allGuides";
import { TOOL_COPY } from "@/data/toolCopy";
import BlankMapsHomeGrid from "@/components/BlankMapsHomeGrid";

export default function HomePage() {
  return (
    <div className="doc">
      {/* ---------- HERO ---------- */}
      <section className="border-b border-line py-10 text-center sm:py-14">
        <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Free Map Tools &amp; Blank Maps
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-mute">
          Every geographic calculation you need — distance, area, radius, drive time, coordinates, elevation,
          sunrise, ZIP and county lookups — plus downloadable blank maps. No sign-up. Free forever.
          Your files and positions never leave your browser.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-sans">
          <Link href="/tools" className="btn btn-primary">Explore All Tools</Link>
          <Link href="/maps" className="btn btn-ghost">Browse Blank Maps</Link>
        </div>
      </section>

      {/* ---------- FULL TOOL LIST ---------- */}
      <section aria-labelledby="all-tools" className="mx-auto max-w-3xl py-10">
        <h2 id="all-tools" className="sect-h">Free Map Tools</h2>
        <p className="mt-3">
          Each tool below opens an interactive page with a working map, live results, unit conversion and
          shareable links. The complete list is grouped the way people actually search — find yours and click through.
        </p>
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="mt-8">
            <h3 className="font-sans text-[11px] font-extrabold uppercase tracking-[0.14em] text-mute">
              {cat.label} — {TOOLS.filter((t) => t.category === cat.id).length} tools
            </h3>
            <div className="mt-3 space-y-6">
              {TOOLS.filter((t) => t.category === cat.id).map((t) => (
                <article key={t.slug}>
                  <h4 className="text-lg">
                    <Link href={`/tools/${t.slug}`} className="toollink">{t.name}</Link>
                    <span className="ml-2 align-middle font-sans text-[10px] font-bold uppercase tracking-wide text-mute">{t.scope}</span>
                  </h4>
                  <p className="mt-0.5">{t.intro}{TOOL_COPY[t.slug] ? ` ${TOOL_COPY[t.slug].paras[0]}` : ""}</p>
                  <p className="font-sans text-sm">
                    <Link href={`/tools/${t.slug}`} className="font-extrabold text-brand-strong hover:underline">Open tool →</Link>
                    <span className="ml-3 text-xs text-mute">free · no account · shareable results</span>
                  </p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ---------- BLANK MAPS ---------- */}
      <section aria-labelledby="blank-maps" className="border-t border-line bg-well/50 py-10">
        <div className="container-sf">
          <h2 id="blank-maps" className="sect-h">Free Printable Blank Maps</h2>
          <p className="mt-3 max-w-3xl">
            Clean outline maps rendered from public-domain Natural Earth and US Census geometry.
            Download any of them as SVG or PNG for worksheets, presentations and design work —
            no watermarks, no attribution required.
          </p>
          <div className="mt-5">
            <BlankMapsHomeGrid />
          </div>
          <p className="mt-4 font-sans text-sm">
            <Link href="/maps" className="font-extrabold text-brand-strong hover:underline">Browse all 180+ blank maps (world, every country, US nation &amp; states) →</Link>
          </p>
        </div>
      </section>

      {/* ---------- GUIDES ---------- */}
      <section aria-labelledby="studies" className="mx-auto max-w-3xl py-10">
        <h2 id="studies" className="sect-h">From the Blog</h2>
        <p className="mt-3">Field notes, workflows and honest explainers — every post links the tools it actually uses. <Link href="/guides" className="font-sans font-extrabold text-brand-strong hover:underline">Read all posts →</Link></p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 font-sans">
          {ALL_GUIDES.slice(3).map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="card group p-4">
              <div className="text-[10px] font-extrabold uppercase tracking-wide text-mute">{g.readMins} min read</div>
              <div className="mt-1 font-display text-[15px] font-bold leading-snug group-hover:text-brand-strong">{g.title}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- WHAT IS ---------- */}
      <section aria-labelledby="what-is" className="border-t border-line py-10">
        <div className="mx-auto max-w-3xl">
          <h2 id="what-is" className="sect-h">What is MapForge?</h2>
          <p className="mt-3">
            MapForge is a free, browser-first platform of geographic utilities. It answers everyday questions —
            <em>“what county am I in?”</em>, <em>“how far apart are these towns?”</em>, <em>“what's inside my delivery radius?”</em> —
            with proper geodesic math instead of flat-map shortcuts, and it does the heavy lifting on your own device.
          </p>
          <p>
            There is nothing to install and no account to create. Maps are drawn from OpenStreetMap,
            routes come from the open Valhalla engine, elevations from the Copernicus DEM, and blank maps from
            public-domain Natural Earth and US Census data. Everything is credited on the{" "}
            <Link href="/data-sources" className="font-sans font-bold text-brand-strong hover:underline">data sources page</Link>.
          </p>
          <h3 className="mt-6 font-display text-lg font-bold">Who is it for?</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li><strong>Students &amp; teachers</strong> — printable blank maps and coordinate practice.</li>
            <li><strong>Travelers &amp; hikers</strong> — distances, drive times, elevation profiles, GPX viewers.</li>
            <li><strong>Small businesses</strong> — delivery radii, service areas, stop optimisation.</li>
            <li><strong>Analysts &amp; GIS hobbyists</strong> — KML/GeoJSON/CSV inspection and conversion, matrices, exports.</li>
          </ul>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section aria-labelledby="how" className="border-t border-line bg-well/50 py-10">
        <div className="mx-auto max-w-3xl">
          <h2 id="how" className="sect-h">How our map tools work</h2>
          <div className="mt-4 space-y-5">
            {[
              ["Location tools", "Your browser's GPS gives a position only to the page; a single reverse-geocoding request to OpenStreetMap Nominatim turns it into county, city, state, ZIP and country. Nothing is stored."],
              ["Distance & radius tools", "Great-circle (haversine) math on the WGS84 sphere; areas by spherical excess; radius circles drawn vertex-by-vertex so they stay true at any latitude. Results convert between miles, km, meters, feet and nautical miles."],
              ["Drive time & routing", "Real road-network routing from the FOSSGIS Valhalla server — drive, walk or cycle — including isochrone polygons that show everywhere reachable in your chosen minutes. Times are free-flow estimates, and we say so."],
              ["Coordinate tools", "Full conversions between decimal degrees, DMS, UTM, MGRS and Plus Codes, computed locally with the standard geodetic series — including the Norway/Svalbard UTM zone exceptions."],
              ["File tools", "KML, GPX, GeoJSON and CSV files are parsed entirely in your browser (FileReader + DOMParser). Validate, inspect, measure elevation stats, and convert between formats without uploading anything."],
              ["Blank maps", "Natural Earth (1:110m) and Census (1:10m) TopoJSON is projected with d3-geo right in your browser and exported as crisp SVG or high-resolution PNG."],
            ].map(([t, b]) => (
              <div key={t}>
                <h3 className="font-display text-base font-bold">{t}</h3>
                <p className="mt-1">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section aria-labelledby="faq" className="mx-auto max-w-3xl py-10">
        <h2 id="faq" className="sect-h">Frequently asked questions</h2>
        <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 font-sans">
          {[
            ["Is MapForge really free?", "Yes. Every tool and every blank map is free, with no account, trial or premium tier."],
            ["Do you upload my files or location?", "No. Files are parsed locally; your GPS position is used only in-memory to show results. See the privacy page for the exact external requests."],
            ["How accurate are distances?", "Spherical geodesy on WGS84 — within ~0.3% of ellipsoidal geodesics. Methodology documents every formula."],
            ["Are drive times live traffic?", "No — free-flow estimates from the road network, clearly labelled as such."],
            ["Can I use exports commercially?", "Yes, subject to the underlying open-data licences (mainly ODbL attribution for OSM-derived maps)."],
            ["Why is population data labelled with a year?", "Because honesty matters: our city dataset is an ≈2020-vintage estimate, and we say so on every page that uses it."],
          ].map(([q, a]) => (
            <details key={q} className="card px-4 py-3">
              <summary className="cursor-pointer font-sans text-sm font-bold">{q}</summary>
              <p className="mt-2 font-serif text-sm text-mute">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              ["Is MapForge really free?", "Yes. Every tool and every blank map is free, with no account, trial or premium tier."],
              ["Do you upload my files or location?", "No. Files are parsed locally; your GPS position is used only in-memory to show results. See the privacy page for the exact external requests."],
              ["How accurate are distances?", "Spherical geodesy on WGS84 — within ~0.3% of ellipsoidal geodesics. Methodology documents every formula."],
              ["Are drive times live traffic?", "No — free-flow estimates from the road network, clearly labelled as such."],
              ["Can I use exports commercially?", "Yes, subject to the underlying open-data licences (mainly ODbL attribution for OSM-derived maps)."],
              ["Why is population data labelled with a year?", "Because honesty matters: our city dataset is an ≈2020-vintage estimate, and we say so on every page that uses it."]
            ].map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a }
            }))
          })
        }}
      />

      {/* ---------- DATA SOURCES ---------- */}
      <section aria-labelledby="sources" className="border-t border-line py-10">
        <div className="mx-auto max-w-3xl">
          <h2 id="sources" className="sect-h">Data sources</h2>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li><strong>Maps &amp; geocoding:</strong> OpenStreetMap contributors (tiles via OpenFreeMap, Photon, Nominatim, Overpass) — ODbL.</li>
            <li><strong>Routing &amp; isochrones:</strong> FOSSGIS Valhalla, with Project OSRM as driving fallback — ODbL data.</li>
            <li><strong>Elevation:</strong> Open-Meteo API on the Copernicus GLO-90 DEM (~90 m).</li>
            <li><strong>Blank maps:</strong> Natural Earth and US Census TIGER via world-atlas/us-atlas — public domain.</li>
            <li><strong>City dataset:</strong> curated major-city populations, ≈2020 vintage — used only where labelled as an estimate.</li>
          </ul>
          <p className="mt-3 font-sans text-sm">
            <Link href="/data-sources" className="font-extrabold text-brand-strong hover:underline">Full attribution &amp; licences →</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
