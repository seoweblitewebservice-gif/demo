"use client";
import { useEffect, useRef, useState } from "react";
import type { Map as MLMap, GeoJSONSource } from "maplibre-gl";
import type { LatLng } from "@/lib/geo";
import { isochrone, type TravelMode } from "@/lib/routing";
import { downloadText } from "@/lib/formats";
import { readUrlParams, syncUrl, Seg, Spinner, ErrorBox } from "@/components/ui";
import { DynamicMap, pinElement, PlaceField, type PlaceValue } from "./shared";

const CONTOUR_OPTIONS = [10, 15, 20, 30, 45, 60, 90, 120];
const COLORS = ["#14584f", "#1d6e63", "#2a8578", "#479e92", "#d95d32", "#b45309", "#9d174d", "#7c2d12"];

export default function DriveTimeTool({ params }: { params?: Record<string, unknown> }) {
  const [mode, setMode] = useState<TravelMode>("driving");
  const [contours, setContours] = useState<number[]>(() => {
    const c = readUrlParams().get("t");
    if (c) return c.split(",").map(Number).filter((n) => CONTOUR_OPTIONS.includes(n)).slice(0, 4);
    if (Array.isArray(params?.contours)) return (params!.contours as number[]).filter((n) => CONTOUR_OPTIONS.includes(n)).slice(0, 4);
    return params?.serviceArea ? [15] : [15, 30];
  });
  const [center, setCenter] = useState<PlaceValue | null>(() => {
    const p = readUrlParams();
    const lat = parseFloat(p.get("lat") ?? ""), lng = parseFloat(p.get("lng") ?? "");
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geo, setGeo] = useState<GeoJSON.FeatureCollection | null>(null);
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    syncUrl({
      lat: center?.lat.toFixed(5) ?? null, lng: center?.lng.toFixed(5) ?? null,
      t: contours.join(","), m: mode,
    });
  }, [center, contours, mode]);

  useEffect(() => {
    const map = mapRef.current, lib = libRef.current;
    if (!map || !lib) return;
    if (center) {
      if (!markerRef.current) markerRef.current = new lib.Marker({ element: pinElement("#1d6e63") }).setLngLat([center.lng, center.lat]).addTo(map);
      else markerRef.current.setLngLat([center.lng, center.lat]);
    }
    const src = map.getSource("iso") as GeoJSONSource | undefined;
    src?.setData(geo ?? { type: "FeatureCollection", features: [] });
  }, [center, geo]);

  const generate = async () => {
    if (!center) { setError("Pick a starting point first."); return; }
    if (!contours.length) { setError("Select at least one time contour."); return; }
    setBusy(true); setError(null);
    const r = await isochrone(center, mode, [...contours].sort((a, b) => b - a));
    setBusy(false);
    if (!r.ok) { setError(r.message); setGeo(null); return; }
    setGeo(r.geojson);
    const map = mapRef.current;
    if (map) {
      const coords: number[][] = [];
      r.geojson.features.forEach((f: any) => {
        const g = f.geometry;
        const collect = (c: any) => { if (typeof c[0] === "number") coords.push(c); else c.forEach(collect); };
        collect(g.coordinates);
      });
      const lngs = coords.map((c) => c[0]), lats = coords.map((c) => c[1]);
      map.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], { padding: 50, maxZoom: 14, duration: 700 });
    }
  };

  const toggleContour = (c: number) => setContours((cs) => cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c].sort((a, b) => a - b).slice(0, 4));

  return (
    <div className="grid gap-4 lg:grid-cols-[380px,1fr]">
      <div className="card order-2 space-y-4 p-4 lg:order-1">
        <PlaceField label="Starting point" value={center} onChange={(v) => { setCenter(v); if (v) mapRef.current?.flyTo({ center: [v.lng, v.lat], zoom: 13, essential: true }); }} placeholder="Search address or click map…" />
        <div>
          <span className="label">Travel mode</span>
          <Seg options={[{ value: "driving" as TravelMode, label: "🚗 Drive" }, { value: "cycling" as TravelMode, label: "🚲 Bike" }, { value: "walking" as TravelMode, label: "🚶 Walk" }]} value={mode} onChange={setMode} ariaLabel="Travel mode" />
        </div>
        <div>
          <span className="label">Time contours (minutes)</span>
          <div className="flex flex-wrap gap-1.5">
            {CONTOUR_OPTIONS.map((c) => (
              <button
                key={c} type="button"
                onClick={() => toggleContour(c)}
                aria-pressed={contours.includes(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${contours.includes(c) ? "bg-brand text-white dark:text-[#08211d]" : "border border-line bg-well text-mute hover:border-brand"}`}
              >
                {c} min
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-mute">Select up to 4 contours. Multiple times show layered reachable areas.</p>
        </div>
        <button type="button" className="btn btn-primary w-full" onClick={generate} disabled={busy}>
          {busy ? <Spinner label="Computing reachable area…" /> : "Generate reachable area"}
        </button>
        {error && <ErrorBox>{error}</ErrorBox>}
        {geo && (
          <div className="space-y-2 border-t border-line pt-3">
            <div className="text-sm font-semibold">{geo.features.length} contour polygon{geo.features.length > 1 ? "s" : ""} generated</div>
            <ul className="space-y-1 text-xs text-mute">
              {contours.map((c) => <li key={c} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[CONTOUR_OPTIONS.indexOf(c) % COLORS.length] }} /> within {c} minutes</li>)}
            </ul>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => downloadText("mapbench-isochrone.geojson", JSON.stringify(geo, null, 2), "application/geo+json")}>Export GeoJSON</button>
          </div>
        )}
      </div>
      <div className="order-1 lg:order-2">
        <DynamicMap center={center ?? { lat: 40.7128, lng: -74.006 }} zoom={center ? 12 : 2} className="tall" onReady={(map, lib) => {
          mapRef.current = map; libRef.current = lib;
          map.addSource("iso", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({
            id: "iso-fill", type: "fill", source: "iso",
            paint: {
              "fill-color": ["match", ["to-number", ["get", "contour"]],
                10, COLORS[0], 15, COLORS[1], 20, COLORS[2], 30, COLORS[3], 45, COLORS[4], 60, COLORS[5], 90, COLORS[6], 120, COLORS[7], "#1d6e63"],
              "fill-opacity": 0.22,
            },
          });
          map.addLayer({
            id: "iso-line", type: "line", source: "iso",
            paint: {
              "line-color": ["match", ["to-number", ["get", "contour"]],
                10, COLORS[0], 15, COLORS[1], 20, COLORS[2], 30, COLORS[3], 45, COLORS[4], 60, COLORS[5], 90, COLORS[6], 120, COLORS[7], "#1d6e63"],
              "line-width": 2,
            },
          });
          map.on("click", (e: any) => setCenter({ lat: e.lngLat.lat, lng: e.lngLat.lng }));
        }} />
      </div>
    </div>
  );
}
