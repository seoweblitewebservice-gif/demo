"use client";
import { useMemo } from "react";
import { CATEGORIES, type ToolDef } from "@/lib/registry";
import { TOOL_COPY } from "@/data/toolCopy";
import { CATEGORY_ESSAYS } from "@/data/categoryEssays";
import { CATEGORY_TIPS, CATEGORY_GLOSSARY, CATEGORY_DATA_NOTE } from "@/data/categoryExtras";
import { GUIDE2 } from "@/data/categoryGuide2";
import { GUIDE3 } from "@/data/categoryGuide3";
import { LIMITS } from "@/data/categoryGuide4";
import { SUPPLEMENT } from "@/data/categorySupplement";
import { MAJOR_CITIES } from "@/data/cities";
import { distanceKm, bearingBetween, compassPoint, fmt, normLng } from "@/lib/geo";
import { formatDms, latLngToUtm, formatUtm, latLngToMgrs } from "@/lib/coords";
import { sunTimes, fmtDurationHours } from "@/lib/astronomy";

interface Example { lead: string; body: string }

function buildExamples(tool: ToolDef): Example[] {
  const NYC = { lat: 40.7128, lng: -74.006 };
  const LON = { lat: 51.5074, lng: -0.1278 };
  const TYO = { lat: 35.6762, lng: 139.6503 };
  const SYD = { lat: -33.8688, lng: 151.2093 };
  const BER = { lat: 52.52, lng: 13.405 };
  const PAR = { lat: 48.8566, lng: 2.3522 };
  switch (tool.category) {
    case "distance": {
      const e1 = distanceKm(NYC, LON), e2 = distanceKm(TYO, SYD), e3 = distanceKm(PAR, BER);
      return [
        { lead: "New York → London", body: `measures ${fmt(e1, 0)} km (${fmt(e1 * 0.621371, 0)} mi) on the great circle, initial bearing ${fmt(bearingBetween(NYC, LON), 0)}° — ${compassPoint(bearingBetween(NYC, LON))}, the familiar north-east arc over the Atlantic.` },
        { lead: "Tokyo → Sydney", body: `comes in at ${fmt(e2, 0)} km, bearing ${fmt(bearingBetween(TYO, SYD), 0)}° (${compassPoint(bearingBetween(TYO, SYD))}) — a southern-hemisphere leg that flat maps dramatically misdraw.` },
        { lead: "Paris → Berlin", body: `is a short European hop of ${fmt(e3, 0)} km where road distance runs noticeably longer; compare the driving calculator to feel the detour penalty (~${fmt((1050 / e3 - 1) * 100, 0)}% here).` },
      ];
    }
    case "radius":
      return [5, 10, 25].map((r) => ({
        lead: `${r}-mile circle`,
        body: `encloses ${fmt(Math.PI * (r * 1.60934) ** 2 * 247.105, 0)} acres (${fmt(Math.PI * (r * 1.60934) ** 2, 0)} km²) with a circumference of ${fmt(2 * Math.PI * r * 1.60934, 0)} km — useful calibration for what a radius of that size really covers.`,
      }));
    case "routing":
      return [
        { lead: "10 km urban drive", body: "at a 40 km/h free-flow average takes about 15 minutes before congestion; add 20–40% at peak and the labelled estimate becomes a plan." },
        { lead: "15-minute cycling isochrone", body: "typically stretches 5–7 km along continuous cycleways but shrinks to ~3 km across a river with one bridge — the anisotropy circles can't show." },
        { lead: "Ten-stop optimisation", body: "regularly saves 15–30% of the distance of a 'logical' typed order, because human intuition underweights cross-town backtracking." },
      ];
    case "coordinates": {
      const utm = latLngToUtm(NYC)!;
      return [
        { lead: "40.7128, −74.006 (Lower Manhattan)", body: `is ${formatDms(40.7128, "lat")}, ${formatDms(-74.006, "lng")} in chart notation and ${formatUtm(utm)} on the UTM grid — three dialects, one physical corner of City Hall Park.` },
        { lead: "MGRS at 10 digits", body: `reads ${latLngToMgrs(NYC, 5)} for the same point: precision follows your digit count, 10 digits ≈ 1 m.` },
        { lead: "One decimal place", body: "is ≈ 11 km of latitude; five decimals ≈ 1.1 m. Consumer GPS earns five; quoting seven implies a survey you didn't run." },
      ];
    }
    case "earth": {
      const h1 = 3.86 * Math.sqrt(1.7), h2 = 3.86 * Math.sqrt(100);
      return [
        { lead: "Beach stance (1.7 m eyes)", body: `puts the horizon at ≈ ${fmt(h1, 1)} km with standard refraction; a 100 m lighthouse deck pushes it to ≈ ${fmt(h2, 0)} km.` },
        { lead: "Your antipode", body: `for New York lies at ${(-NYC.lat).toFixed(2)}, ${normLng(NYC.lng + 180).toFixed(2)} — Indian Ocean, illustrating why most land antipodes are water.` },
        { lead: "Line-of-sight check", body: "over 10 km of terrain adds ~6 m of curvature drop even after refraction; hills taller than your mast heights plus that bulge block the view." },
      ];
    }
    case "sun": {
      const eq = (lat: number) => sunTimes(lat, 0, 2025, 3, 20).dayLengthHours;
      return [
        { lead: "Equinox day length", body: `runs ≈ ${fmtDurationHours(eq(0))} at the Equator, ${fmtDurationHours(eq(45))} at 45° and ${fmtDurationHours(eq(66.5))} at the polar circle — latitude, not calendar, sets the swing.` },
        { lead: "Golden hour", body: "lengthens toward winter as the sun's path shallows: the −4°→+6° window that is ~70 minutes at equinox can exceed two hours near solstice at mid-latitudes." },
        { lead: "Timezone vs solar time", body: "diverge by over an hour in much of western Europe in summer; stating both keeps shared sunrise plans honest." },
      ];
    }
    case "population": {
      const near = MAJOR_CITIES.map((c) => ({ ...c, d: distanceKm(LON, c) })).filter((c) => c.d <= 500);
      const pop = near.reduce((s, c) => s + c.pop, 0);
      return [
        { lead: "500 km around London", body: `captures ${near.length} major cities in the curated dataset — Paris, Brussels, Amsterdam among them — summing to ≈ ${(pop / 1000).toFixed(1)} million people, a transparent lower-bound market size.` },
        { lead: "Density contrast", body: "Mumbai (~32,000/km²) vs Los Angeles (~3,200/km²) is a clean 10× — ratios like this are the stable part of snapshot data." },
        { lead: "Cost index ratio", body: "Zurich ≈ 118 vs Bengaluru ≈ 23 (NYC = 100) means the same basket costs roughly 5× as much — the ratio, not either absolute, is the trustworthy figure." },
      ];
    }
    case "location":
      return [
        { lead: "Indoor vs outdoor GPS", body: "a phone under open sky reports ±5–15 m and resolves to the correct street segment; indoors the network fix can be ±300 m, enough to flip counties near a border — nudge the pin when it matters." },
        { lead: "Postal vs administrative", body: "a point in an unincorporated US area can honestly answer 'no city' administratively while carrying a mailing city; the fields stay separate here so both truths are visible." },
        { lead: "Five decimals", body: "(40.71280) is ≈ 1 m — the right precision to store; the sixth decimal is beyond consumer GPS and the seventh is theatre." },
      ];
    case "files":
      return [
        { lead: "A 1,000-point GPX track", body: "parses in milliseconds locally, yields distance/gain/duration stats, and converts to GeoJSON with elevation preserved as the third coordinate." },
        { lead: "KMZ gotcha", body: "a KMZ is a ZIP archive — unzipping reveals the .kml inside, which then loads with placemarks, names and ExtendedData intact." },
        { lead: "10,000-row CSV", body: "stays fluid with clustering; the skipped-row counter reports invalid coordinates instead of silently dropping them." },
      ];
    case "creation":
      return [
        { lead: "Five labelled pins", body: "read instantly in a slide; thirty unstyled dots don't — restraint is the craft, and colour-by-category carries the grouping." },
        { lead: "Share-state URL", body: "encodes pins, colours and labels as parameters: the link reopens the exact map on any device with zero server storage." },
        { lead: "PNG at retina ratio", body: "drops straight into worksheets and decks, while the companion GeoJSON/CSV keeps the same data editable afterwards." },
      ];
    default:
      return [
        { lead: "The Equator", body: "is 40,075 km around — the yardstick that makes great-circle distances legible: New York to London is about 14% of it." },
        { lead: "One degree of latitude", body: "is ≈ 111 km everywhere; one degree of longitude shrinks with cos(latitude), ≈ 55 km at 60°N — the reason flat approximations fail." },
        { lead: "Antipodal pairs", body: "are always ≈ 20,015 km apart, the maximum possible surface distance, whoever and wherever you are." },
      ];
  }
}

const RELATED_QA: Record<string, [string, string][]> = {
  location: [
    ["Why do two tools give me different cities for the same point?", "Postal cities, suburbs and administrative municipalities are different datasets; the fields are kept separate so you can choose the layer your form needs."],
    ["Can I trust GPS indoors?", "Treat indoor fixes as neighbourhood-level; verify on the map and nudge the pin for anything important."],
  ],
  distance: [
    ["Why is my car's odometer higher than the tool?", "Odometers follow the driven path including detours; great-circle distance is the physical lower bound, road distance the network truth."],
    ["Do bearings work near the poles?", "Initial bearings remain defined, but compass navigation converges oddly near poles — great-circle math stays correct where intuition fails."],
  ],
  routing: [
    ["Why no live traffic?", "Free public routing engines report free-flow times; the label on every result tells you to add your local congestion buffer."],
    ["Why did my route snap to a different street?", "Endpoints snap to the nearest routable way; place pins on roads for stable results."],
  ],
  radius: [
    ["Circle or isochrone — which do I need?", "Geometric reach → circle; time-based reach → isochrone. They answer different questions and rarely look alike."],
    ["Are areas legal-grade?", "Spherical-excess areas are excellent for analysis; legal boundaries need licensed surveys and local datum practice."],
  ],
  coordinates: [
    ["Which format should I store?", "Decimal degrees on WGS84, five or six decimals; convert at the edges for display."],
    ["Why did my point land in the ocean?", "Almost always a lat/lng swap — the two-second map check exists precisely to catch it."],
  ],
  files: [
    ["Are my files uploaded?", "No — parsing is entirely local; the network tab shows only map tiles."],
    ["Which export loses least?", "GeoJSON preserves properties best; GPX preserves time/elevation; KML carries presentation. Keep the original regardless."],
  ],
  creation: [
    ["How many pins can a share link hold?", "Dozens comfortably; for hundreds, move to CSV-to-map with clustering."],
    ["Who owns the map I make?", "You own your composition; basemap imagery carries OpenStreetMap's ODbL attribution when reused."],
  ],
  earth: [
    ["Why does line-of-sight ignore my forest?", "The DEM sees bare terrain; land cover is local knowledge you add on top."],
    ["How precise is the elevation?", "Typically a few metres vertically at 90 m spacing — planning-grade, not survey-grade."],
  ],
  sun: [
    ["Why do sunrise times differ from my weather app?", "Apps may use different zenith conventions or rounded coordinates; the NOAA algorithm with the official 90.833° zenith is the standard definition."],
    ["Do time zones affect day length?", "No — day length is pure latitude and date; zones only shift the clock labels."],
  ],
  lines: [
    ["Are the tropics fixed?", "No — they drift with the axial tilt's 41,000-year oscillation, currently a few tens of metres per year."],
    ["Why is GPS zero east of Greenwich's line?", "WGS84's meridian is a satellite-geodesy construct ≈100 m from the historic Airy transit — datums are precise agreements, not physical rails."],
  ],
  population: [
    ["Can I cite these numbers?", "Cite them as labelled estimates with the printed vintage; legal or funding work should use census sources."],
    ["Why is my rural radius population low?", "Curated datasets capture major cities; rural settlement is intentionally out of scope and the sum is labelled a lower bound."],
  ],
};

export default function ToolContent({ tool }: { tool: ToolDef }) {
  const category = CATEGORIES.find((c) => c.id === tool.category)!;
  const copy = TOOL_COPY[tool.slug];
  const essay = CATEGORY_ESSAYS[tool.category];
  const tips = CATEGORY_TIPS[tool.category];
  const guide2 = GUIDE2[tool.category];
  const guide3 = GUIDE3[tool.category];
  const qa = [...(RELATED_QA[tool.category] ?? []), ...guide2.qa, ...guide3.qa];
  const glossary = [...CATEGORY_GLOSSARY[tool.category], ...guide3.gloss];
  const examples = useMemo(() => buildExamples(tool), [tool]);

  const limits = LIMITS[tool.category];

  return (
    <div className="doc mx-auto max-w-3xl space-y-8">
      <section aria-label="At a glance" className="rounded-lg border border-line bg-card px-4 py-3">
        <p className="!mb-0 text-[15px]"><strong>At a glance:</strong> {tool.short} Coverage: {tool.scope}. Free, no account, and shareable via the URL above.</p>
      </section>
      {copy && (
        <section aria-label="About this tool">
          <h2 className="font-display text-2xl font-bold tracking-tight">{copy.h2}</h2>
          {copy.paras.map((p, i) => <p key={i} className="mt-3">{p}</p>)}
        </section>
      )}

      <section aria-label="Worked examples">
        <h2 className="font-display text-2xl font-bold tracking-tight">Worked examples</h2>
        <ul className="mt-3 space-y-3">
          {examples.map((e) => (
            <li key={e.lead} className="rounded-lg border border-line bg-card px-4 py-3">
              <span className="font-sans text-sm font-extrabold text-brand-strong">{e.lead} — </span>
              <span className="text-[15px] text-mute">{e.body}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Deeper understanding">
        <h2 className="font-display text-2xl font-bold tracking-tight">{essay.title}</h2>
        {essay.paras.map((p, i) => <p key={i} className="mt-3">{p}</p>)}
      </section>

      <section aria-label="Tips and common mistakes">
        <h2 className="font-display text-2xl font-bold tracking-tight">Tips &amp; common mistakes</h2>
        {tips.map((t, i) => <p key={i} className="mt-3">{t}</p>)}
      </section>

      <section aria-label="Field guide">
        <h2 className="font-display text-2xl font-bold tracking-tight">{guide2.title}</h2>
        {guide2.paras.map((p, i) => <p key={i} className="mt-3">{p}</p>)}
        <h3 className="mt-4 font-sans text-base font-extrabold">How professionals use this</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-6">
          {guide2.pros.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </section>

      <section aria-label="Step-by-step masterclass">
        <h2 className="font-display text-2xl font-bold tracking-tight">Step-by-step masterclass</h2>
        <ol className="mt-3 space-y-3">
          {guide3.master.map(([t, b], i) => (
            <li key={t} className="rounded-lg border border-line bg-card px-4 py-3">
              <span className="font-sans text-sm font-extrabold text-brand-strong">{i + 1}. {t} — </span>
              <span className="text-[15px] text-mute">{b}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3">{guide3.regional}</p>
      </section>

      {qa.length > 0 && (
        <section aria-label="Related questions">
          <h2 className="font-display text-2xl font-bold tracking-tight">Related questions people ask</h2>
          <div className="mt-3 space-y-3">
            {qa.map(([q, a]) => (
              <div key={q}>
                <h3 className="font-sans text-[15px] font-extrabold">{q}</h3>
                <p className="mt-1">{a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-label="Glossary">
        <h2 className="font-display text-2xl font-bold tracking-tight">Quick glossary</h2>
        <dl className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {glossary.map(([t, d]) => (
            <div key={t} className="rounded-lg border border-line bg-card px-3 py-2">
              <dt className="font-sans text-sm font-extrabold text-brand-strong">{t}</dt>
              <dd className="text-sm text-mute">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      {SUPPLEMENT[tool.category] && (
        <section aria-label="Further reading">
          <h2 className="font-display text-2xl font-bold tracking-tight">{SUPPLEMENT[tool.category]!.title}</h2>
          <p className="mt-3">{SUPPLEMENT[tool.category]!.para}</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-6">
            {SUPPLEMENT[tool.category]!.bullets.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </section>
      )}

      <section aria-label="Honest limits and when to escalate">
        <h2 className="font-display text-2xl font-bold tracking-tight">Honest limits &amp; when to escalate</h2>
        {limits.paras.map((p, i) => <p key={i} className="mt-3">{p}</p>)}
        <ul className="mt-2 list-disc space-y-1.5 pl-6">
          {limits.escalate.map((e) => <li key={e}>{e}</li>)}
        </ul>
      </section>

      <section aria-label="Data and methodology note">
        <h2 className="font-display text-2xl font-bold tracking-tight">Data &amp; methodology note</h2>
        <p className="mt-3">{tool.method ? `${tool.method} ` : ""}{CATEGORY_DATA_NOTE[tool.category]}</p>
        <p className="mt-2">
          Category context: <strong>{category.label}</strong> — {category.short}{" "}
          This page is one of the {`${category.label.toLowerCase()} tools`} on MapForge; the related-tools links below and the header's Tools menu connect every sibling instrument.
        </p>
      </section>
    </div>
  );
}
