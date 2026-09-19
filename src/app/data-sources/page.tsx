import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Sources & Attribution",
  description: "The open datasets behind MapBench: OpenStreetMap, OpenFreeMap, Photon, Nominatim, FOSSGIS Valhalla, OSRM, Open-Meteo, Natural Earth and the US Census — with licences.",
  alternates: { canonical: "/data-sources" },
};

const SOURCES = [
  ["Map tiles", "OpenFreeMap", "Vector tiles derived from OpenStreetMap, served free with no key.", "© OpenStreetMap contributors — Open Database License (ODbL)"],
  ["Place search (forward geocoding)", "Photon (komoot)", "Free geocoder built on OpenStreetMap data.", "Data © OpenStreetMap contributors (ODbL)"],
  ["Reverse geocoding", "Nominatim", "OpenStreetMap's community reverse geocoder, rate-limited to ~1 request/second.", "Data © OpenStreetMap contributors (ODbL); Nominatim usage policy applies"],
  ["Routing, isochrones, route optimisation", "FOSSGIS Valhalla", "The FOSSGIS-operated public Valhalla server on OpenStreetMap roads.", "Data © OpenStreetMap contributors (ODbL); FOSSGIS fair-use policy"],
  ["Routing fallback (driving)", "OSRM demo server", "Project OSRM public endpoint used if Valhalla is unreachable.", "Data © OpenStreetMap contributors (ODbL)"],
  ["Elevation", "Open-Meteo Elevation API", "Copernicus GLO-90 global DEM at ~90 m resolution.", "Contains modified Copernicus data; free API, no key required"],
  ["Nearby places (POI)", "Overpass API", "Live queries against OpenStreetMap.", "Data © OpenStreetMap contributors (ODbL)"],
  ["Blank maps — world & countries", "Natural Earth (via world-atlas)", "Public-domain 1:110m cultural/physical geometry.", "Public domain — no attribution required"],
  ["Blank maps — US states & nation", "US Census TIGER (via us-atlas)", "1:10m state boundary topology.", "US government work — public domain"],
  ["Major cities dataset", "Curated by MapBench", "~200 major cities with approximate municipal populations, ≈2020 vintage. Used only where clearly labelled as estimates.", "CC-BY 4.0 (MapBench compilation)"],
  ["Astronomy", "Implemented locally", "NOAA solar algorithm & synodic lunar cycle — no external service.", "Standard public algorithms"],
];

export default function DataSourcesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl font-bold tracking-tight">Data Sources</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">
        MapBench is built entirely on open data and free public services. Here is exactly what powers what — and what licence it carries.
      </p>
      <div className="mt-6 space-y-3">
        {SOURCES.map(([name, provider, desc, license]) => (
          <div key={name} className="card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="font-bold">{name}</div>
              <span className="chip chip-brand">{provider}</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-mute">{desc}</p>
            <p className="mt-1.5 text-xs font-semibold text-mute">License: {license}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-mute">
        OpenStreetMap data is continuously updated; results reflect the state of the database at query time. If you reuse exported
        basemap imagery, ODbL attribution (“© OpenStreetMap contributors”) is required by the licence.
      </p>
    </div>
  );
}
