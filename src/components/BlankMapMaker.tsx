"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoAlbersUsa, geoPath, geoCentroid, type GeoPermissibleObjects } from "d3-geo";
import { feature, merge } from "topojson-client";
import worldLand from "world-atlas/land-110m.json";
import countriesTopo from "world-atlas/countries-110m.json";
import { MAJOR_CITIES } from "@/data/cities";
import { downloadDataUrl, downloadText } from "@/lib/formats";
import { readUrlParams } from "./ui";
import { Seg, Spinner } from "./ui";

type Variant = "blank" | "labeled" | "colored" | "cities";

interface MapItem {
  id: string;
  name: string;
  sub: string;
  feature: GeoJSON.Feature;
  albers?: boolean;
  cityCountry?: string; // filter MAJOR_CITIES for the "cities" variant
}

const PALETTE = ["#dfe8dd", "#e8e2d4", "#e2e6ea", "#ece0d4", "#e4e2ec", "#e0eae6"];

// Continent membership (Natural Earth names as bundled in world-atlas).
const CONTINENTS: Record<string, string[]> = {
  Europe: ["Iceland", "Norway", "Sweden", "Finland", "Denmark", "United Kingdom", "Ireland", "France", "Spain", "Portugal", "Germany", "Netherlands", "Belgium", "Luxembourg", "Switzerland", "Austria", "Italy", "Poland", "Czechia", "Slovakia", "Hungary", "Romania", "Bulgaria", "Greece", "Albania", "Macedonia", "North Macedonia", "Serbia", "Croatia", "Slovenia", "Bosnia and Herz.", "Montenegro", "Kosovo", "Ukraine", "Belarus", "Lithuania", "Latvia", "Estonia", "Moldova", "Malta"],
  Asia: ["Russia", "Turkey", "Kazakhstan", "Uzbekistan", "Turkmenistan", "Kyrgyzstan", "Tajikistan", "Afghanistan", "Pakistan", "India", "China", "Mongolia", "Japan", "South Korea", "North Korea", "Bangladesh", "Myanmar", "Thailand", "Laos", "Vietnam", "Cambodia", "Malaysia", "Indonesia", "Philippines", "Sri Lanka", "Nepal", "Bhutan", "Taiwan", "Iraq", "Iran", "Syria", "Jordan", "Israel", "Lebanon", "Saudi Arabia", "Yemen", "Oman", "United Arab Emirates", "Qatar", "Kuwait", "Georgia", "Armenia", "Azerbaijan", "Cyprus"],
  Africa: ["Morocco", "Algeria", "Tunisia", "Libya", "Egypt", "Mauritania", "Mali", "Niger", "Chad", "Sudan", "S. Sudan", "Ethiopia", "Eritrea", "Djibouti", "Somalia", "Kenya", "Tanzania", "Uganda", "Rwanda", "Burundi", "Dem. Rep. Congo", "Congo", "Gabon", "Eq. Guinea", "Cameroon", "Central African Rep.", "Nigeria", "Benin", "Togo", "Ghana", "Côte d'Ivoire", "Burkina Faso", "Liberia", "Sierra Leone", "Guinea", "Guinea-Bissau", "Senegal", "Gambia", "Zambia", "Zimbabwe", "Mozambique", "Malawi", "Angola", "Namibia", "Botswana", "South Africa", "Lesotho", "eSwatini", "Madagascar"],
  "North America": ["Canada", "United States of America", "Mexico", "Guatemala", "Belize", "Honduras", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Cuba", "Jamaica", "Haiti", "Dominican Rep.", "Bahamas", "Greenland"],
  "South America": ["Colombia", "Venezuela", "Guyana", "Suriname", "Fr. Guiana", "Ecuador", "Peru", "Brazil", "Bolivia", "Paraguay", "Uruguay", "Argentina", "Chile", "Falkland Is."],
  Oceania: ["Australia", "New Zealand", "Papua New Guinea", "Fiji", "Solomon Is.", "Vanuatu", "New Caledonia"],
};

function projectFor(f: GeoJSON.Feature, albers: boolean, w: number, h: number) {
  return (albers ? geoAlbersUsa() : geoMercator()).fitExtent([[8, 8], [w - 8, h - 8]], f as GeoPermissibleObjects);
}

function svgFor(item: MapItem, variant: Variant, w: number, h: number, allFeatures?: { f: GeoJSON.Feature; name: string; albers?: boolean }[]): string {
  const projection = projectFor(item.feature, !!item.albers, w, h);
  const path = geoPath(projection);
  const fill = variant === "colored" || variant === "cities" ? "#e4ede3" : "#ffffff";
  const stroke = variant === "colored" || variant === "cities" ? "#2e6b4f" : "#5c6670";
  let inner = "";
  if (allFeatures && allFeatures.length > 1) {
    // multi-feature maps (US states / world countries): draw every piece
    const proj = projectFor(
      { type: "FeatureCollection", features: allFeatures.map((x) => x.f) } as unknown as GeoJSON.Feature,
      !!item.albers, w, h,
    );
    const p2 = geoPath(proj);
    inner = allFeatures.map((x, i) => {
      const d = p2(x.f as GeoPermissibleObjects) ?? "";
      const col = variant === "colored" || variant === "cities" ? PALETTE[i % PALETTE.length] : "#ffffff";
      return `<path d="${d}" fill="${col}" stroke="${stroke}" stroke-width="0.7"/>`;
    }).join("");
    if (variant === "labeled") {
      inner += allFeatures.map((x) => {
        const c = geoPath(proj).centroid(x.f as GeoPermissibleObjects);
        return `<text x="${c[0].toFixed(1)}" y="${c[1].toFixed(1)}" font-family="sans-serif" font-size="7" fill="#26221a" text-anchor="middle">${x.name.slice(0, 12)}</text>`;
      }).join("");
    }
    if (variant === "cities") {
      const pts = MAJOR_CITIES.filter((c) => !item.cityCountry || c.country === item.cityCountry);
      inner += pts.map((c) => {
        const xy = proj([c.lng, c.lat]);
        return xy ? `<circle cx="${xy[0].toFixed(1)}" cy="${xy[1].toFixed(1)}" r="2" fill="#a3540c"/>` : "";
      }).join("");
    }
  } else {
    const d = path(item.feature as GeoPermissibleObjects) ?? "";
    inner = `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="1.1" stroke-linejoin="round"/>`;
    if (variant === "labeled") {
      const c = path.centroid(item.feature as GeoPermissibleObjects);
      inner += `<text x="${c[0].toFixed(1)}" y="${c[1].toFixed(1)}" font-family="Georgia,serif" font-size="16" fill="#26221a" text-anchor="middle">${item.name}</text>`;
    }
    if (variant === "cities") {
      const pts = MAJOR_CITIES.filter((c) => !item.cityCountry || c.country === item.cityCountry);
      inner += pts.map((c) => {
        const xy = projection([c.lng, c.lat]);
        return xy ? `<circle cx="${xy[0].toFixed(1)}" cy="${xy[1].toFixed(1)}" r="2.4" fill="#a3540c"/>` : "";
      }).join("");
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#ffffff"/>${inner}</svg>`;
}

export default function BlankMapMaker() {
  const countries: MapItem[] = useMemo(() => {
    const fc = feature(countriesTopo as any, (countriesTopo as any).objects.countries) as unknown as GeoJSON.FeatureCollection;
    return (fc.features as any[])
      .filter((f) => f.properties?.name)
      .map((f) => ({
        id: `c-${f.properties.name}`, name: f.properties.name as string,
        sub: "country outline", feature: f as GeoJSON.Feature,
        cityCountry: f.properties.name === "United States of America" ? "United States" : (f.properties.name as string),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const [states, setStates] = useState<MapItem[] | null>(null);
  const [usNation, setUsNation] = useState<MapItem | null>(null);
  useEffect(() => {
    let alive = true;
    import("us-atlas/states-10m.json").then((mod: any) => {
      const topo = mod.default ?? mod;
      const fc = feature(topo, topo.objects.states) as unknown as GeoJSON.FeatureCollection;
      if (!alive) return;
      setStates((fc.features as any[]).map((f) => ({
        id: `s-${f.properties.name}`, name: f.properties.name as string,
        sub: "US state outline", feature: f as GeoJSON.Feature, albers: true, cityCountry: "United States",
      })).sort((a, b) => a.name.localeCompare(b.name)));
      const merged = merge(topo, topo.objects.states.geometries);
      setUsNation({ id: "us", name: "United States", sub: "50 states + DC", feature: { type: "Feature", properties: {}, geometry: merged } as GeoJSON.Feature, albers: true, cityCountry: "United States" });
    }).catch(() => { /* states optional */ });
    return () => { alive = false; };
  }, []);

  const world: MapItem = useMemo(() => ({
    id: "world", name: "World", sub: "all land, single outline",
    feature: feature(worldLand as any, (worldLand as any).objects.land) as unknown as GeoJSON.Feature,
  }), []);

  const continents: MapItem[] = useMemo(() => Object.entries(CONTINENTS).map(([name, members]) => {
    const geoms = (countriesTopo as any).objects.countries.geometries.filter((g: any) => members.includes(g.properties?.name));
    const merged = merge(countriesTopo as any, geoms);
    return {
      id: `cont-${name.toLowerCase().replace(/\s+/g, "-")}`,
      name, sub: `${geoms.length} countries`,
      feature: { type: "Feature", properties: {}, geometry: merged } as GeoJSON.Feature,
    };
  }), []);

  const [sel, setSel] = useState<MapItem>(world);
  const [variant, setVariant] = useState<Variant>("blank");
  const detailRef = useRef<HTMLDivElement>(null);
  const [paramSel] = useState(() => readUrlParams().get("map"));

  // Deep links: /maps?map=s-California, c-India, cont-europe, us, world
  useEffect(() => {
    if (!paramSel) return;
    const all = [world, usNation, ...states ?? [], ...continents, ...countries].filter(Boolean) as MapItem[];
    const m = all.find((i) => i.id === paramSel || i.name.toLowerCase().replace(/\s+/g, "-") === paramSel);
    if (m) setSel(m);
  }, [paramSel, states, usNation, continents, countries, world]);

  const pick = (item: MapItem) => {
    setSel(item);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 30);
  };

  const popular = useMemo(() => {
    const byName = (n: string) => countries.find((c) => c.name === n);
    return [usNation, world, byName("India"), byName("Brazil"), byName("Australia"), byName("France")].filter(Boolean) as MapItem[];
  }, [countries, usNation, world]);

  const slug = sel.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div className="space-y-8">
      {/* ---------- options panel ---------- */}
      <div ref={detailRef} className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <div className="font-display text-lg font-bold">{sel.name} — blank map</div>
            <div className="text-xs text-mute">{sel.sub} · public domain · choose a variant, then download</div>
          </div>
          <Seg
            ariaLabel="Map variant"
            options={[
              { value: "blank" as Variant, label: "Blank" },
              { value: "labeled" as Variant, label: "Labeled" },
              { value: "colored" as Variant, label: "Colored" },
              { value: "cities" as Variant, label: "With cities" },
            ]}
            value={variant}
            onChange={setVariant}
          />
        </div>
        <div className="grid gap-0 lg:grid-cols-[1fr,260px]">
          <div className="bg-white p-3 dark:bg-[#141210]" dangerouslySetInnerHTML={{ __html: svgFor(sel, variant, 720, 440, sel.id === "us" && states ? states.map((s) => ({ f: s.feature, name: s.name, albers: true })) : sel.id === "world-countries" ? countries.map((c) => ({ f: c.feature, name: c.name })) : undefined) }} />
          <div className="space-y-3 border-t border-line p-4 lg:border-l lg:border-t-0">
            <div className="label">Download</div>
            <button type="button" className="btn btn-primary w-full" onClick={() => downloadText(`mapforge-${slug}-${variant}.svg`, svgFor(sel, variant, 1200, 720), "image/svg+xml")}>
              SVG (print-ready)
            </button>
            <button
              type="button" className="btn btn-ghost w-full"
              onClick={() => {
                const blob = new Blob([svgFor(sel, variant, 1200, 720)], { type: "image/svg+xml" });
                const url = URL.createObjectURL(blob);
                const img = new Image();
                img.onload = () => {
                  const canvas = document.createElement("canvas");
                  canvas.width = 2400; canvas.height = 1440;
                  const ctx = canvas.getContext("2d")!;
                  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 2400, 1440);
                  ctx.drawImage(img, 0, 0, 2400, 1440);
                  downloadDataUrl(`mapforge-${slug}-${variant}.png`, canvas.toDataURL("image/png"));
                  URL.revokeObjectURL(url);
                };
                img.src = url;
              }}
            >
              PNG (2400 px)
            </button>
            <div className="rounded-lg bg-well px-3 py-2.5 text-xs leading-relaxed text-mute">
              Variants: <strong>blank</strong> outline · <strong>labeled</strong> with names · <strong>colored</strong> region fills · <strong>with cities</strong> major-city dots. Free for any use — Natural Earth &amp; US Census data are public domain.
            </div>
          </div>
        </div>
      </div>

      {/* ---------- popular ---------- */}
      <section aria-labelledby="popular-maps">
        <h2 id="popular-maps" className="sect-h">Popular maps</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {popular.map((m) => (
            <button key={m.id} type="button" onClick={() => pick(m)} className={`card group overflow-hidden text-left ${sel.id === m.id ? "!border-brand" : "hover:border-brand"}`}>
              <span className="block bg-white p-2 dark:bg-[#141210]" dangerouslySetInnerHTML={{ __html: svgFor(m, "blank", 160, 100) }} />
              <span className="block border-t border-line px-3 py-2">
                <span className="block font-display text-sm font-bold group-hover:text-brand-strong">{m.name}</span>
                <span className="block text-[11px] text-mute">{m.sub}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ---------- continents ---------- */}
      <section aria-labelledby="continents-list">
        <h2 id="continents-list" className="sect-h">World &amp; Continents ({continents.length + 1})</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          <button type="button" onClick={() => pick(world)} className={`card px-3 py-2.5 text-left ${sel.id === world.id ? "!border-brand" : "hover:border-brand"}`}>
            <span className="block font-display text-sm font-bold">World</span>
            <span className="block text-[11px] text-mute">all land, one outline</span>
          </button>
          {continents.map((c) => (
            <button key={c.id} type="button" onClick={() => pick(c)} className={`card px-3 py-2.5 text-left ${sel.id === c.id ? "!border-brand" : "hover:border-brand"}`}>
              <span className="block font-display text-sm font-bold">{c.name}</span>
              <span className="block text-[11px] text-mute">{c.sub}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ---------- US states ---------- */}
      <section aria-labelledby="us-states">
        <h2 id="us-states" className="sect-h">United States {states ? `(${states.length + 1})` : ""}</h2>
        {!states && <div className="mt-4 flex justify-center py-6"><Spinner label="Loading US state outlines…" /></div>}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {usNation && (
            <button type="button" onClick={() => pick(usNation)} className={`card px-3 py-2.5 text-left ${sel.id === usNation.id ? "!border-brand" : "hover:border-brand"}`}>
              <span className="block font-display text-sm font-bold">United States</span>
              <span className="block text-[11px] text-mute">50 states + DC</span>
            </button>
          )}
          {(states ?? []).map((s) => (
            <button key={s.id} type="button" onClick={() => pick(s)} className={`card px-3 py-2.5 text-left ${sel.id === s.id ? "!border-brand" : "hover:border-brand"}`}>
              <span className="block font-display text-sm font-bold">{s.name}</span>
              <span className="block text-[11px] text-mute">state outline</span>
            </button>
          ))}
        </div>
      </section>

      {/* ---------- countries ---------- */}
      <section aria-labelledby="countries-list">
        <h2 id="countries-list" className="sect-h">Countries ({countries.length})</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {countries.map((c) => (
            <button key={c.id} type="button" onClick={() => pick(c)} className={`card px-3 py-2.5 text-left ${sel.id === c.id ? "!border-brand" : "hover:border-brand"}`}>
              <span className="block truncate font-display text-sm font-bold">{c.name}</span>
              <span className="block text-[11px] text-mute">country outline</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
