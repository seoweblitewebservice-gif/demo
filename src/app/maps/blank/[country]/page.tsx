import type { Metadata } from "next";
import Link from "next/link";
import MapsClient from "@/components/MapsClient";
import countriesTopo from "world-atlas/countries-110m.json";

function slugify(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const countryNames = Array.from(
  new Set(
    ((countriesTopo as any).objects.countries.geometries as any[])
      .map((g) => g.properties?.name)
      .filter(Boolean)
  )
).sort((a, b) => a.localeCompare(b));

export function generateStaticParams() {
  return countryNames.map((name) => ({ country: slugify(name) }));
}

function getCountry(slug: string) {
  return countryNames.find((name) => slugify(name) === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const name = getCountry(country) ?? country.replace(/-/g, " ");
  return {
    title: `${name} Blank Map — SVG & PNG`,
    description: `Download a free printable ${name} blank map in SVG or high-resolution PNG. Choose blank, labeled, colored or city map variants.`,
    alternates: { canonical: `/maps/blank/${country}` },
  };
}

export default async function CountryMapPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const name = getCountry(country);

  if (!name) {
    return (
      <div className="card p-6">
        Country map not found.{" "}
        <Link className="text-brand-strong underline" href="/maps">Back to maps</Link>
      </div>
    );
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-3 text-xs text-mute">
        <Link href="/maps" className="hover:text-brand-strong">Maps</Link> /{" "}
        <span className="font-semibold text-ink">{name}</span>
      </nav>

      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{name} Blank Map</h1>
      <p className="doc mt-3 max-w-3xl">
        Download a free printable outline map of {name} in SVG or high-resolution PNG. Switch between blank, labeled,
        colored and city variants, then export the map directly from your browser.
      </p>

      <div className="mt-8">
        <MapsClient initialMapSlug={slugify(name)} />
      </div>

      <section className="doc mx-auto mt-10 max-w-3xl">
        <h2 className="sect-h">Free {name} map</h2>
        <p>
          This dedicated page provides a {name} outline map for printing, worksheets, presentations and geography
          projects. The map is generated from Natural Earth boundary data and rendered in your browser.
        </p>

        <h2 className="sect-h mt-8">Map variants</h2>
        <p>
          Choose a blank outline, labeled map, colored map, or a version with major cities. SVG is suitable for printing
          and editing, while PNG is convenient for documents and quick sharing.
        </p>

        <p className="mt-6">
          <Link href="/maps" className="font-bold text-brand-strong hover:underline">← Browse all country maps</Link>
        </p>
      </section>
    </div>
  );
}
