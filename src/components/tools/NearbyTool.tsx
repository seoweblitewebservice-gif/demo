"use client";
import { useEffect, useRef, useState } from "react";
import type { Map as MLMap, GeoJSONSource } from "maplibre-gl";
import { bearingBetween, compassPoint, distanceKm, fmt, type LatLng } from "@/lib/geo";
import { geolocation } from "@/lib/geocode";
import { escapeXml } from "@/lib/formats";
import { readUrlParams, syncUrl, ErrorBox, Field, Spinner, Seg } from "@/components/ui";
import { DynamicMap, pinElement, PlaceField, type PlaceValue } from "./shared";

const CATEGORIES = [
  { id: "food", label: "Food & drink", q: '["amenity"~"^(restaurant|cafe|fast_food|bar|pub)$"]' },
  { id: "health", label: "Health", q: '["amenity"~"^(hospital|clinic|pharmacy|doctors)$"]' },
  { id: "fuel", label: "Fuel", q: '["amenity"="fuel"]' },
  { id: "money", label: "Money", q: '["amenity"~"^(bank|atm)$"]' },
  { id: "grocery", label: "Groceries", q: '["shop"~"^(supermarket|convenience|greengrocer|bakery)$"]' },
  { id: "parking", label: "Parking", q: '["amenity"="parking"]' },
  { id: "lodging", label: "Lodging", q: '["tourism"~"^(hotel|hostel|guest_house)$"]' },
  { id: "education", label: "Education", q: '["amenity"~"^(school|university|college|library)$"]' },
];

interface Poi { name: string; lat: number; lng: number; tags: Record<string, string>; distKm: number; bearing: number }

export default function NearbyTool() {
  const [center, setCenter] = useState<PlaceValue | null>(() => {
    const p = readUrlParams();
    const lat = parseFloat(p.get("lat") ?? ""), lng = parseFloat(p.get("lng") ?? "");
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  });
  const [cat, setCat] = useState("food");
  const [radiusM, setRadiusM] = useState(1500);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pois, setPois] = useState<Poi[] | null>(null);
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => { syncUrl({ lat: center?.lat.toFixed(5) ?? null, lng: center?.lng.toFixed(5) ?? null, cat, r: radiusM }); }, [center, cat, radiusM]);

  const search = async () => {
    if (!center) { setError("Pick a location first — search, click the map, or use GPS."); return; }
    const c = CATEGORIES.find((x) => x.id === cat)!;
    setBusy(true); setError(null);
    try {
      const q = `[out:json][timeout:25];nwr${c.q}(around:${radiusM},${center.lat},${center.lng});out center 80;`;
      
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST", body: new URLSearchParams({ data: q }),
      });
      if (res.status === 429) { setError("The Overpass API is rate-limiting us right now. Wait a few seconds and try again."); setBusy(false); return; }
      if (!res.ok) throw new Error();
      const data = await res.json();
      const list: Poi[] = (data.elements ?? [])
        .map((e: any) => ({
          name: e.tags?.name || e.tags?.operator || catLabel(cat),
          lat: e.lat ?? e.center?.lat, lng: e.lon ?? e.center?.lon, tags: e.tags ?? {},
          distKm: distanceKm(center, { lat: e.lat ?? e.center?.lat, lng: e.lon ?? e.center?.lon }),
          bearing: bearingBetween(center, { lat: e.lat ?? e.center?.lat, lng: e.lon ?? e.center?.lon }),
        }))
        .filter((p: Poi) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
        .sort((a: Poi, b: Poi) => a.distKm - b.distKm);
      setPois(list);
    } catch {
      setError("The OpenStreetMap query service is temporarily unavailable. Please try again in a moment.");
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
    (map.getSource("nb") as GeoJSONSource | undefined)?.setData({
      type: "FeatureCollection",
      features: (pois ?? []).map((p) => ({ type: "Feature", properties: { name: p.name }, geometry: { type: "Point", coordinates: [p.lng, p.lat] } })),
    });
  }, [center, pois]);

  return (
    <div className="grid gap-4 lg:grid-cols-[400px,1fr]">
      <div className="card order-2 space-y-4 p-4 lg:order-1">
        <PlaceField label="Search around" value={center} onChange={(v) => { setCenter(v); setPois(null); if (v) mapRef.current?.flyTo({ center: [v.lng, v.lat], zoom: 14, essential: true }); }} />
        <div className="flex gap-2">
          <button
            type="button" className="btn btn-ghost btn-sm"
            onClick={async () => {
              try { const p = await geolocation(); setCenter({ ...p, label: "My location" }); mapRef.current?.flyTo({ center: [p.lng, p.lat], zoom: 14, essential: true }); }
              catch (e: any) { setError(e?.message ?? "Geolocation failed."); }
            }}
          >📍 Use my location</button>
        </div>
        <div>
          <span className="label">Category</span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" onClick={() => setCat(c.id)} aria-pressed={cat === c.id}
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${cat === c.id ? "bg-brand text-white dark:text-[#08211d]" : "border border-line bg-well text-mute hover:border-brand"}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <Field label="Search radius (metres)">
          <input type="number" min={100} max={5000} step={100} className="input" value={radiusM} onChange={(e) => setRadiusM(Math.min(5000, Math.max(100, parseInt(e.target.value) || 100)))} />
        </Field>
        <button type="button" className="btn btn-primary w-full" onClick={search} disabled={busy}>
          {busy ? <Spinner label="Querying OpenStreetMap…" /> : "Find nearby places"}
        </button>
        {error && <ErrorBox>{error}</ErrorBox>}
        {pois && (
          <div className="border-t border-line pt-3">
            <div className="label">{pois.length} result{pois.length !== 1 ? "s" : ""} (live OSM data)</div>
            <ul className="max-h-80 space-y-1 overflow-y-auto">
              {pois.map((p, i) => (
                <li key={i}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-well"
                    onClick={() => {
                      const map = mapRef.current, lib = libRef.current;
                      if (!map || !lib) return;
                      new lib.Popup().setLngLat([p.lng, p.lat]).setText(p.name).addTo(map);
                      map.panTo([p.lng, p.lat], { duration: 400 });
                    }}
                  >
                    <span className="flex-1 truncate font-medium">{p.name}</span>
                    <span className="shrink-0 text-xs text-mute">{fmt(p.distKm * 1000, 0)} m · {compassPoint(p.bearing)}</span>
                  </button>
                </li>
              ))}
              {!pois.length && <li className="px-2 py-3 text-sm text-mute">Nothing mapped in this category nearby — try a larger radius.</li>}
            </ul>
          </div>
        )}
      </div>
      <div className="order-1 lg:order-2">
        <DynamicMap center={center ?? { lat: 30, lng: 10 }} zoom={center ? 14 : 1.8} className="tall" onReady={(map, lib) => {
          mapRef.current = map; libRef.current = lib;
          map.addSource("nb", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({ id: "nb-dots", type: "circle", source: "nb", paint: { "circle-color": "#8a4f9e", "circle-radius": 7, "circle-stroke-color": "#fff", "circle-stroke-width": 2 } });
          map.on("click", (e: any) => { setCenter({ lat: e.lngLat.lat, lng: e.lngLat.lng }); setPois(null); });
        }} />
      </div>
    </div>
  );
}

function catLabel(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? "Place";
}
