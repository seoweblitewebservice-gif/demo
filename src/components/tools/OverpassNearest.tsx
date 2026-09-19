"use client";
import { useEffect, useRef, useState } from "react";
import type { Map as MLMap, GeoJSONSource } from "maplibre-gl";
import { bearingBetween, compassPoint, distanceKm, fmt, type LatLng } from "@/lib/geo";
import { geolocation } from "@/lib/geocode";
import { escapeXml } from "@/lib/formats";
import { readUrlParams, syncUrl, ErrorBox, Field, Spinner, Seg } from "@/components/ui";
import { DynamicMap, pinElement, PlaceField, type PlaceValue } from "./shared";

interface Cfg { tag: string; label: string; kindLabel: string; defaultKm: number }

const CFGS: Record<string, Cfg> = {
  hospital: { tag: 'nwr["amenity"~"^(hospital|clinic|doctors)$"]', label: "hospitals & clinics", kindLabel: "health facility", defaultKm: 15 },
  beach: { tag: 'nwr["natural"="beach"]', label: "beaches", kindLabel: "beach", defaultKm: 50 },
  border: { tag: 'nwr["highway"="border_crossing"]', label: "border crossings", kindLabel: "border crossing", defaultKm: 150 },
  peak: { tag: 'nwr["natural"="peak"]', label: "mountain peaks", kindLabel: "peak", defaultKm: 60 },
  water: { tag: 'nwr["natural"="water"];nwr["waterway"="river"]', label: "lakes & rivers", kindLabel: "water body", defaultKm: 40 },
  brands: { tag: 'nwr["brand:wikidata"~"^(Q38076|Q37158)$"]', label: "McDonald's & Starbucks", kindLabel: "outlet", defaultKm: 10 },
};

interface Poi { name: string; sub: string; lat: number; lng: number; distKm: number; bearing: number }

export default function OverpassNearest({ params }: { params?: Record<string, unknown> }) {
  const cfg = CFGS[(params?.cfg as string) ?? "hospital"] ?? CFGS.hospital;
  const [center, setCenter] = useState<PlaceValue | null>(() => {
    const p = readUrlParams();
    const lat = parseFloat(p.get("lat") ?? ""), lng = parseFloat(p.get("lng") ?? "");
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  });
  const [radiusKm, setRadiusKm] = useState(cfg.defaultKm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pois, setPois] = useState<Poi[] | null>(null);
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => { syncUrl({ lat: center?.lat.toFixed(5) ?? null, lng: center?.lng.toFixed(5) ?? null, r: radiusKm }); }, [center, radiusKm]);

  const search = async () => {
    if (!center) { setError("Set a location first — search, click the map or use GPS."); return; }
    setBusy(true); setError(null);
    try {
      const meters = Math.round(radiusKm * 1000);
      const q = `[out:json][timeout:25];(${cfg.tag}(around:${meters},${center.lat},${center.lng}););out center 60;`;
      const res = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: new URLSearchParams({ data: q }) });
      if (res.status === 429) { setError("The OpenStreetMap query service is rate-limited right now. Wait a few seconds and retry."); setBusy(false); return; }
      if (!res.ok) throw new Error();
      const data = await res.json();
      const list: Poi[] = (data.elements ?? [])
        .map((e: any) => {
          const lat = e.lat ?? e.center?.lat, lng = e.lon ?? e.center?.lon;
          if (lat === undefined) return null;
          return {
            name: e.tags?.name || `${cfg.kindLabel}${e.tags?.operator ? " · " + e.tags.operator : ""}`,
            sub: [e.tags?.["brand"], e.tags?.access, e.tags?.ele ? `${Math.round(parseFloat(e.tags.ele))} m` : ""].filter(Boolean).join(" · "),
            lat, lng,
            distKm: distanceKm(center, { lat, lng }),
            bearing: bearingBetween(center, { lat, lng }),
          };
        })
        .filter(Boolean)
        .sort((a: Poi, b: Poi) => a.distKm - b.distKm)
        .slice(0, 40);
      setPois(list);
    } catch {
      setError("The live OpenStreetMap query failed. Please try again in a moment.");
    }
    setBusy(false);
  };

  useEffect(() => {
    const map = mapRef.current, lib = libRef.current;
    if (!map || !lib) return;
    if (center) {
      if (!markerRef.current) markerRef.current = new lib.Marker({ element: pinElement("#d95d32") }).setLngLat([center.lng, center.lat]).addTo(map);
      else markerRef.current.setLngLat([center.lng, center.lat]);
    }
    (map.getSource("np") as GeoJSONSource | undefined)?.setData({
      type: "FeatureCollection",
      features: (pois ?? []).map((p, i) => ({ type: "Feature", properties: { name: p.name, idx: i }, geometry: { type: "Point", coordinates: [p.lng, p.lat] } })),
    });
  }, [center, pois]);

  return (
    <div className="grid gap-4 lg:grid-cols-[400px,1fr]">
      <div className="card order-2 space-y-4 p-4 lg:order-1">
        <PlaceField label="Search around" value={center} onChange={(v) => { setCenter(v); setPois(null); if (v) mapRef.current?.flyTo({ center: [v.lng, v.lat], zoom: 11, essential: true }); }} />
        <button
          type="button" className="btn btn-ghost btn-sm"
          onClick={async () => {
            try { const p = await geolocation(); setCenter({ ...p, label: "My location" }); mapRef.current?.flyTo({ center: [p.lng, p.lat], zoom: 11, essential: true }); }
            catch (e: any) { setError(e?.message ?? "Geolocation failed."); }
          }}
        >
          📍 Use my location
        </button>
        <Field label={`Search radius (km, up to 300)`}>
          <input type="number" min={1} max={300} step={1} className="input" value={radiusKm} onChange={(e) => setRadiusKm(Math.min(300, Math.max(1, parseFloat(e.target.value) || 1)))} />
        </Field>
        <button type="button" className="btn btn-primary w-full" onClick={search} disabled={busy}>
          {busy ? <Spinner label={`Querying live OSM for ${cfg.label}…`} /> : `Find nearest ${cfg.label}`}
        </button>
        {error && <ErrorBox>{error}</ErrorBox>}
        {pois && (
          <div className="border-t border-line pt-3">
            <div className="label">{pois.length} result{pois.length !== 1 ? "s" : ""} · live OpenStreetMap</div>
            <ul className="max-h-80 space-y-1 overflow-y-auto">
              {pois.map((p, i) => (
                <li key={i}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-well"
                    onClick={() => {
                      const map = mapRef.current, lib = libRef.current;
                      if (!map || !lib) return;
                      new lib.Popup().setLngLat([p.lng, p.lat]).setHTML(`<strong>${escapeXml(p.name)}</strong>`).addTo(map);
                      map.panTo([p.lng, p.lat], { duration: 400 });
                    }}
                  >
                    <span className="flex-1 truncate font-medium">{p.name}{p.sub ? <span className="ml-1 text-xs text-mute">{p.sub}</span> : null}</span>
                    <span className="shrink-0 text-xs text-mute">{p.distKm < 1 ? `${Math.round(p.distKm * 1000)} m` : `${fmt(p.distKm)} km`} · {compassPoint(p.bearing)}</span>
                  </button>
                </li>
              ))}
              {!pois.length && <li className="px-2 py-3 text-sm text-mute">Nothing mapped in range — widen the radius. Coverage follows OpenStreetMap mappers.</li>}
            </ul>
          </div>
        )}
      </div>
      <div className="order-1 lg:order-2">
        <DynamicMap center={center ?? { lat: 30, lng: 10 }} zoom={center ? 10 : 1.8} className="tall" onReady={(map, lib) => {
          mapRef.current = map; libRef.current = lib;
          map.addSource("np", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({ id: "np-dots", type: "circle", source: "np", paint: { "circle-color": "#8a4f9e", "circle-radius": 7, "circle-stroke-color": "#fff", "circle-stroke-width": 2 } });
          map.addLayer({ id: "np-labels", type: "symbol", source: "np", layout: { "text-field": ["get", "name"], "text-size": 11, "text-offset": [0, 1.4], "text-font": ["Noto Sans Regular"], "text-optional": true }, paint: { "text-color": "#1c2126", "text-halo-color": "#fff", "text-halo-width": 1.4 } });
          map.on("click", (e: any) => { setCenter({ lat: e.lngLat.lat, lng: e.lngLat.lng }); setPois(null); });
        }} />
      </div>
    </div>
  );
}
