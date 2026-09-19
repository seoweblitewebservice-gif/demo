import type { Metadata } from "next";
import Link from "next/link";
import MapsClient from "@/components/MapsClient";

const countryNames = [
  "Afghanistan","Albania","Algeria","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia",
  "Bosnia and Herz.","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon",
  "Canada","Central African Rep.","Chad","Chile","China","Colombia","Congo","Costa Rica","Croatia","Cuba",
  "Cyprus","Czechia","Denmark","Djibouti","Dominican Rep.","Ecuador","Egypt","El Salvador","Estonia","eSwatini",
  "Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Guatemala",
  "Guinea","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland",
  "Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia",
  "Lebanon","Lesotho","Liberia","Libya","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives",
  "Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Mongolia","Montenegro","Morocco","Mozambique",
  "Myanmar","Namibia","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia",
  "Norway","Oman","Pakistan","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Sierra Leone","Singapore","Slovakia",
  "Slovenia","Solomon Is.","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan",
  "Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tunisia",
  "Turkey","Turkmenistan","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America",
  "Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

function slugify(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function generateStaticParams() {
  return countryNames.map((name) => ({ country: slugify(name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const name = countryNames.find((n) => slugify(n) === country);
  const label = name ?? country.replace(/-/g, " ");
  return {
    title: `${label} Blank Map — SVG & PNG`,
    description: `Download a free printable ${label} blank map in SVG or high-resolution PNG. Choose blank, labeled, colored or city map variants.`,
    alternates: { canonical: `/maps/blank/${country}` },
  };
}

export default async function CountryMapPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const name = countryNames.find((n) => slugify(n) === country);
  if (!name) return <div className="card p-6">Country map not found. <Link className="text-brand-strong underline" href="/maps">Back to maps</Link></div>;

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-3 text-xs text-mute">
        <Link href="/maps" className="hover:text-brand-strong">Maps</Link> / <span className="font-semibold text-ink">{name}</span>
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
          This page provides a dedicated {name} outline map for printing, worksheets, presentations and geography projects.
          The map is generated from public-domain Natural Earth boundary data and rendered in the browser.
        </p>
        <h2 className="sect-h mt-8">Map variants</h2>
        <p>
          Choose a blank outline, labeled map, colored map, or a version with major cities. SVG is suitable for printing
          and editing, while PNG is convenient for documents and quick sharing.
        </p>
      </section>
    </div>
  );
}
