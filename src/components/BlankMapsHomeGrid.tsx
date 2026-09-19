"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { geoMercator, geoAlbersUsa, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature, merge } from "topojson-client";
import worldLand from "world-atlas/land-110m.json";
import countriesTopo from "world-atlas/countries-110m.json";

interface Thumb { id: string; name: string; d: string }

function pathFor(f: GeoJSON.Feature, albers: boolean): string {
  const projection = albers
    ? geoAlbersUsa().fitExtent([[4, 4], [156, 96]], f as GeoPermissibleObjects)
    : geoMercator().fitExtent([[4, 4], [156, 96]], f as GeoPermissibleObjects);
  return geoPath(projection)(f as GeoPermissibleObjects) ?? "";
}

const COUNTRY_PREVIEWS = [
  "India", "Brazil", "Australia", "Canada", "France", "Germany",
  "Japan", "Mexico", "Spain", "United Kingdom", "Italy", "South Africa",
];

export default function BlankMapsHomeGrid() {
  const thumbs = useMemo<Thumb[]>(() => {
    const land = feature(worldLand as any, (worldLand as any).objects.land) as unknown as GeoJSON.Feature;
    const fc = feature(countriesTopo as any, (countriesTopo as any).objects.countries) as unknown as GeoJSON.FeatureCollection;
    const out: Thumb[] = [{ id: "world", name: "World", d: pathFor(land, false) }];
    for (const name of COUNTRY_PREVIEWS) {
      const f = (fc.features as any[]).find((x) => x.properties?.name === name);
      if (f) out.push({ id: name.toLowerCase().replace(/\s+/g, "-"), name, d: pathFor(f, false) });
    }
    return out;
  }, []);

  const [us, setUs] = useState<Thumb | null>(null);
  useEffect(() => {
    let alive = true;
    import("us-atlas/states-10m.json").then((mod: any) => {
      const topo = mod.default ?? mod;
      const merged = merge(topo, topo.objects.states.geometries);
      if (alive) setUs({ id: "united-states", name: "United States", d: pathFor({ type: "Feature", properties: {}, geometry: merged } as GeoJSON.Feature, true) });
    }).catch(() => { /* preview optional */ });
    return () => { alive = false; };
  }, []);

  const all = us ? [thumbs[0], us, ...thumbs.slice(1)] : thumbs;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {all.map((t) => (
        <Link key={t.id} href="/maps" className="card group overflow-hidden">
          <div className="bg-white p-2 dark:bg-[#141210]">
            <svg viewBox="0 0 160 100" className="h-auto w-full" role="img" aria-label={`Blank map of ${t.name}`}>
              <path d={t.d} fill="var(--sf-brand-soft)" stroke="var(--sf-brand)" strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="border-t border-line px-3 py-2">
            <span className="font-display text-sm font-bold group-hover:text-brand-strong">{t.name}</span>
            <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-mute">SVG · PNG</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
