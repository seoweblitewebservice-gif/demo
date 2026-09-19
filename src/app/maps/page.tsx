import type { Metadata } from "next";
import Link from "next/link";
import MapsClient from "@/components/MapsClient";

export const metadata: Metadata = {
  title: "Free Printable Blank Maps — SVG & PNG (World, US States, Countries)",
  description: "Click any blank map to preview four variants (blank, labeled, colored, with cities) and download print-ready SVG or high-resolution PNG. World, all US states and 170+ countries, generated from public-domain Natural Earth and US Census data.",
  alternates: { canonical: "/maps" },
};

const MAP_FAQS: [string, string][] = [
  ["Are these maps really free to use?", "Yes — completely free, including commercial use. The boundary data comes from Natural Earth and the US Census Bureau, both public domain, and the outlines are generated in your browser with no watermark or branding."],
  ["What's the difference between the four variants?", "Blank is a clean outline for worksheets and quizzes; Labeled adds region or country names; Colored fills each region with a soft tint for presentations; With cities overlays major-city dots from our curated dataset. Every variant downloads in both SVG and PNG."],
  ["SVG or PNG — which should I choose?", "SVG for anything printed or resized (worksheets, posters, design files): it stays razor-sharp at any size and stays editable. PNG (2400 px) for slides, documents and quick sharing where a raster image is simpler."],
  ["Where does the boundary data come from?", "Country and world outlines from Natural Earth's 1:110m public-domain dataset; US states and the national outline from US Census TIGER/TopoJSON (1:10m). Both are rendered client-side with d3-geo — nothing is uploaded or tracked."],
  ["Can I request a map that isn't listed?", "The library already covers the world, every mapped country and all US states. For custom regions, draw them with the Map Area Calculator or Polygon Area tool and export GeoJSON/SVG from there."],
  ["Do I need to credit MapForge?", "No attribution is required for public-domain data. A credit line is appreciated but never obligatory; if you reuse OpenStreetMap-derived imagery elsewhere on the site, OSM's ODbL asks for '© OpenStreetMap contributors'."],
];

export default function MapsPage() {
  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-3 text-xs text-mute">
        <Link href="/" className="hover:text-brand-strong">Home</Link> / <span className="font-semibold text-ink">Blank Maps</span>
      </nav>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Free Printable Blank Maps</h1>
      <p className="doc mt-3 max-w-3xl">
        Blank outline maps for every classroom, presentation and design job — the world, all 50 US states plus DC, and 170+
        countries. Click any map to preview it in four variants (blank, labeled, colored, with cities) and download
        print-ready SVG or high-resolution PNG. Everything is generated from public-domain data, in your browser,
        with no watermark and no account.
      </p>

      <div className="mt-8">
        <MapsClient />
      </div>

      <div className="doc mx-auto mt-12 max-w-3xl space-y-8">
        <section aria-labelledby="about-maps">
          <h2 id="about-maps" className="sect-h">About these blank maps</h2>
          <p>
            Every outline on this page is generated live from public-domain boundary data. Country and world shapes use
            Natural Earth's 1:110 million scale dataset; US state and national outlines use the US Census Bureau's
            TIGER-derived TopoJSON at 1:10 million scale. Rendering happens entirely in your browser with d3-geo
            projections — SVG downloads stay vector-crisp at any size, and PNG exports are drawn at 2400 pixels wide.
          </p>
          <p>
            Because the data is public domain, there is genuinely no small print: use the maps in worksheets, videos,
            commercial decks, choropleth bases or wall art. A credit line is welcomed, never required.
          </p>
        </section>

        <section aria-labelledby="common-uses">
          <h2 id="common-uses" className="sect-h">Common uses</h2>
          <ul className="list-disc space-y-1.5 pl-6">
            <li><strong>Education:</strong> geography quizzes, fill-in-the-blank worksheets, history projects, coloring sheets.</li>
            <li><strong>Business:</strong> sales territory maps, delivery zones, franchise planning slides.</li>
            <li><strong>Data visualization:</strong> choropleth base layers for D3, Observable, Datawrapper or Tableau.</li>
            <li><strong>Content creation:</strong> YouTube explainers, blog illustrations, social media graphics.</li>
            <li><strong>Personal:</strong> travel scratch-maps, bucket-list trackers, custom posters.</li>
          </ul>
        </section>

        <section aria-labelledby="related-map-tools">
          <h2 id="related-map-tools" className="sect-h">Related tools</h2>
          <ul className="list-disc space-y-1.5 pl-6 font-sans text-sm">
            <li><Link href="/tools/map-area-calculator" className="font-bold text-brand-strong hover:underline">Map Area Calculator</Link> — draw shapes on a live map and measure their area.</li>
            <li><Link href="/tools/polygon-area-calculator" className="font-bold text-brand-strong hover:underline">Polygon Area Calculator</Link> — trace regions from clicks or pasted coordinates.</li>
            <li><Link href="/tools/pin-drop-map" className="font-bold text-brand-strong hover:underline">Pin Drop Map</Link> — annotate a live map with labelled, coloured pins and export it.</li>
            <li><Link href="/tools/cities-within-radius" className="font-bold text-brand-strong hover:underline">Cities Within Radius</Link> — the dataset behind the "with cities" variant, as an interactive tool.</li>
            <li><Link href="/tools/what-country-am-i-in" className="font-bold text-brand-strong hover:underline">What Country Am I In?</Link> — resolve any point to its country on the live map.</li>
          </ul>
        </section>

        <section aria-labelledby="maps-faq">
          <h2 id="maps-faq" className="sect-h">Frequently asked questions</h2>
          <div className="mt-4 space-y-2 font-sans">
            {MAP_FAQS.map(([q, a]) => (
              <details key={q} className="card px-4 py-3">
                <summary className="cursor-pointer text-sm font-bold">{q}</summary>
                <p className="mt-2 font-serif text-sm leading-relaxed text-mute">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: MAP_FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
          }),
        }}
      />
    </div>
  );
}
