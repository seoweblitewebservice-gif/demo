"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";
import { EARTH_R_KM, fmt, normLng, type LatLng } from "@/lib/geo";
import { nominatimReverse } from "@/lib/geocode";
import { readUrlParams, syncUrl, Field, Spinner, Stat, ErrorBox } from "@/components/ui";
import { DynamicMap, pinElement, PlaceField, type PlaceValue } from "./shared";

// ---------- Horizon ----------
export function HorizonTool() {
  const [h1, setH1] = useState(2);
  const [h2, setH2] = useState(0);
  const horizon = (h: number) => Math.sqrt(2 * (EARTH_R_KM / (1 - 0.13)) * (h / 1000)); // km, with standard refraction
  const d1 = horizon(Math.max(0, h1));
  const d2 = horizon(Math.max(0, h2));
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card space-y-4 p-4">
        <Field label="Observer eye height above ground/sea (metres)">
          <input type="number" min={0} step="0.1" className="input" value={h1} onChange={(e) => setH1(Math.max(0, parseFloat(e.target.value) || 0))} />
        </Field>
        <Field label="Second observer height (metres) — optional, for ship-to-ship visibility">
          <input type="number" min={0} step="0.1" className="input" value={h2} onChange={(e) => setH2(Math.max(0, parseFloat(e.target.value) || 0))} />
        </Field>
        <div className="grid grid-cols-2 gap-2 border-t border-line pt-3">
          <Stat label="Horizon distance" value={`${fmt(d1)} km`} sub={`${fmt(d1 * 0.621371)} miles`} />
          {h2 > 0
            ? <Stat label="Max mutual visibility" value={`${fmt(d1 + d2)} km`} sub="both horizons added" />
            : <Stat label="Rule of thumb" value={`3.86 × √h km`} sub="h in metres" />}
        </div>
        <p className="text-xs leading-relaxed text-mute">
          Formula: d = √(2R·h) with Earth radius R and effective-radius refraction correction (k = 0.13).
          Standing on a beach (eyes ≈ 1.7 m) the horizon is about 4.7 km away; from a 100 m cliff it's about 38 km.
        </p>
      </div>
      <div className="card flex flex-col justify-center p-6">
        <svg viewBox="0 0 400 240" className="w-full" role="img" aria-label="Diagram of an observer looking at the horizon over a curved Earth">
          <circle cx="200" cy="620" r="470" fill="var(--sf-brand)" opacity=".18" />
          <circle cx="200" cy="620" r="470" fill="none" stroke="var(--sf-brand)" strokeWidth="2" />
          <line x1="96" y1="168" x2="96" y2="140" stroke="var(--sf-ember)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="96" cy="134" r="7" fill="var(--sf-ember)" />
          <line x1="96" y1="140" x2="330" y2="176" stroke="var(--sf-ink)" strokeWidth="1.5" strokeDasharray="5 4" />
          <text x="150" y="120" fontSize="13" fill="var(--sf-mute)" fontFamily="sans-serif">line of sight</text>
          <text x="230" y="210" fontSize="13" fill="var(--sf-mute)" fontFamily="sans-serif">Earth curvature + refraction</text>
        </svg>
      </div>
    </div>
  );
}

// ---------- Antipode ----------
export function AntipodeTool() {
  const [place, setPlace] = useState<PlaceValue | null>(() => {
    const p = readUrlParams();
    const lat = parseFloat(p.get("lat") ?? ""), lng = parseFloat(p.get("lng") ?? "");
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  });
  const [antiName, setAntiName] = useState<{ s: "idle" | "busy" | "done" | "err"; label?: string }>({ s: "idle" });
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const antipode = useMemo<LatLng | null>(() => place ? { lat: -place.lat, lng: normLng(place.lng + 180) } : null, [place]);

  useEffect(() => { syncUrl({ lat: place?.lat.toFixed(5) ?? null, lng: place?.lng.toFixed(5) ?? null }); }, [place]);

  useEffect(() => {
    let cancelled = false;
    if (!antipode) return;
    setAntiName({ s: "busy" });
    const t = setTimeout(async () => {
      const r = await nominatimReverse(antipode.lat, antipode.lng, 5);
      if (cancelled) return;
      if (r.ok) setAntiName({ s: "done", label: r.result.displayName.split(",").slice(-2).join(",").trim() || "Open ocean" });
      else setAntiName({ s: "done", label: "Open ocean" });
    }, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [antipode]);

  useEffect(() => {
    const map = mapRef.current, lib = libRef.current;
    if (!map || !lib) return;
    markersRef.current.forEach((m) => m.remove()); markersRef.current = [];
    if (place) markersRef.current.push(new lib.Marker({ element: pinElement("#1d6e63", "A") }).setLngLat([place.lng, place.lat]).addTo(map));
    if (antipode) markersRef.current.push(new lib.Marker({ element: pinElement("#d95d32", "B") }).setLngLat([antipode.lng, antipode.lat]).addTo(map));
    if (antipode) map.flyTo({ center: [antipode.lng, antipode.lat], zoom: 3, essential: true });
  }, [place, antipode]);

  return (
    <div className="grid gap-4 lg:grid-cols-[400px,1fr]">
      <div className="card order-2 space-y-4 p-4 lg:order-1">
        <PlaceField label="Start anywhere" value={place} onChange={setPlace} placeholder="Search a city…" />
        <p className="text-xs text-mute">…or click the map to dig your tunnel.</p>
        {place && antipode && (
          <div className="space-y-3 border-t border-line pt-3">
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Your point" value={`${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`} />
              <Stat label="Antipode" value={`${antipode.lat.toFixed(4)}, ${antipode.lng.toFixed(4)}`} />
            </div>
            <div className="rounded-lg bg-brand-soft px-4 py-3 text-sm">
              <div className="text-[11px] font-bold uppercase tracking-wide text-mute">You would emerge in</div>
              {antiName.s === "busy" && <Spinner label="Checking…" />}
              {antiName.s === "done" && <div className="font-display text-lg font-bold text-brand-strong">{antiName.label}</div>}
            </div>
            <p className="text-xs text-mute">Latitude flips sign and longitude flips by 180° — that's all the math an antipode needs. About 85% of land antipodes fall in the ocean.</p>
            <a className="btn btn-ghost btn-sm" href={`/tools/coordinates-to-address?lat=${antipode.lat}&lng=${antipode.lng}`}>Full address lookup of the antipode →</a>
          </div>
        )}
      </div>
      <div className="order-1 lg:order-2">
        <DynamicMap center={place ?? { lat: 20, lng: 0 }} zoom={place ? 3 : 1.6} className="tall" onReady={(map, lib) => {
          mapRef.current = map; libRef.current = lib;
          map.on("click", (e: any) => setPlace({ lat: e.lngLat.lat, lng: e.lngLat.lng }));
        }} />
      </div>
    </div>
  );
}
