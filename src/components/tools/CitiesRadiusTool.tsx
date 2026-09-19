"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MLMap, GeoJSONSource } from "maplibre-gl";
import { bearingBetween, compassPoint, destination, distanceKm, fmt, fmtDist, kmTo, toKm, type LatLng, type UnitKey } from "@/lib/geo";
import { MAJOR_CITIES, type MajorCity } from "@/data/cities";
import { downloadText, toCsv } from "@/lib/formats";
import { readUrlParams, syncUrl, Field, Stat } from "@/components/ui";
import { DynamicMap, pinElement, PlaceField, type PlaceValue } from "./shared";

export default function CitiesRadiusTool({ params }: { params?: Record<string, unknown> }) {
  const populationMode = params?.mode === "population";
  const [unit, setUnit] = useState<UnitKey>("km");
  const [radius, setRadius] = useState(250);
  const [center, setCenter] = useState<PlaceValue | null>(() => {
    const p = readUrlParams();
    const lat = parseFloat(p.get("lat") ?? ""), lng = parseFloat(p.get("lng") ?? "");
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  });
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const radiusKm = toKm(radius, unit);

  useEffect(() => { syncUrl({ lat: center?.lat.toFixed(5) ?? null, lng: center?.lng.toFixed(5) ?? null, r: radius, u: unit }); }, [center, radius, unit]);

  const hits = useMemo(() => {
    if (!center) return [];
    return MAJOR_CITIES
      .map((c) => ({ ...c, distKm: distanceKm(center, c), bearing: bearingBetween(center, c) }))
      .filter((c) => c.distKm <= radiusKm)
      .sort((a, b) => a.distKm - b.distKm);
  }, [center, radiusKm]);

  const totalPop = useMemo(() => hits.reduce((s, c) => s + c.pop, 0), [hits]);

  useEffect(() => {
    const map = mapRef.current, lib = libRef.current;
    if (!map || !lib) return;
    if (center) {
      if (!markerRef.current) markerRef.current = new lib.Marker({ element: pinElement("#d95d32") }).setLngLat([center.lng, center.lat]).addTo(map);
      else markerRef.current.setLngLat([center.lng, center.lat]);
    }
    const coords: [number, number][] = [];
    if (center) for (let i = 0; i <= 128; i++) { const p = destination(center, (i / 128) * 360, radiusKm); coords.push([p.lng, p.lat]); }
    (map.getSource("cr-ring") as GeoJSONSource | undefined)?.setData(center ? { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [coords] } } : { type: "FeatureCollection", features: [] });
    (map.getSource("cr-cities") as GeoJSONSource | undefined)?.setData({
      type: "FeatureCollection",
      features: hits.map((c) => ({ type: "Feature", properties: { name: c.name, pop: c.pop }, geometry: { type: "Point", coordinates: [c.lng, c.lat] } })),
    });
    if (center) map.flyTo({ center: [center.lng, center.lat], zoom: Math.max(3, Math.min(10, 7 - Math.log2(radiusKm / 50))), essential: true });
  }, [center, radiusKm, hits]);

  const exportCsv = () => {
    downloadText("mapforge-cities-in-radius.csv", toCsv(
      ["city", "country", "distance_km", "bearing_deg", "population_thousands", "lat", "lng"],
      hits.map((c) => [c.name, c.country, c.distKm.toFixed(1), c.bearing.toFixed(1), c.pop, c.lat, c.lng]),
    ), "text/csv");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[400px,1fr]">
      <div className="card order-2 space-y-4 p-4 lg:order-1">
        <PlaceField label="Centre point" value={center} onChange={setCenter} placeholder="Search centre city…" />
        <div className="grid grid-cols-2 gap-3">
          <Field label={`Radius (${unit})`}>
            <input type="number" min={1} step="any" className="input" value={radius} onChange={(e) => setRadius(Math.max(1, parseFloat(e.target.value) || 1))} />
          </Field>
          <Field label="Unit">
            <select className="select" value={unit} onChange={(e) => { const next = e.target.value as UnitKey; setRadius(Number(kmTo(toKm(radius, unit), next).toFixed(1))); setUnit(next); }}>
              <option value="km">Kilometers</option><option value="mi">Miles</option><option value="nmi">Nautical miles</option>
            </select>
          </Field>
        </div>
        {center && (
          <div className="space-y-3 border-t border-line pt-3">
            {populationMode ? (
              <>
                <Stat label="Estimated population in radius" value={`≈ ${(totalPop * 1000).toLocaleString("en-US")}`} sub={`${hits.length} major cities in the curated dataset · clearly an estimate, not a census count`} />
                <div className="rounded-lg border border-ember/40 bg-[var(--sf-warn-bg)] px-3 py-2.5 text-xs leading-relaxed">
                  This sums municipal populations of major cities (≈2020 vintage) from our open dataset. It underestimates rural settlement and is intended for quick comparisons, not funding applications.
                </div>
              </>
            ) : (
              <Stat label="Cities in radius" value={hits.length} sub={`of ${MAJOR_CITIES.length} major cities in the dataset`} />
            )}
            <div className="flex items-center justify-between">
              <span className="label !mb-0">Results</span>
              <button type="button" className="btn btn-ghost btn-sm" disabled={!hits.length} onClick={exportCsv}>Download CSV</button>
            </div>
            <div className="max-h-80 overflow-y-auto rounded-lg border border-line">
              <table className="tbl">
                <thead><tr><th>City</th><th className="text-right">Distance</th><th className="text-right">Pop. (k)</th></tr></thead>
                <tbody>
                  {hits.map((c) => (
                    <tr key={c.name + c.country}>
                      <td><div className="font-semibold">{c.name}</div><div className="text-xs text-mute">{c.country} · {compassPoint(c.bearing)}</div></td>
                      <td className="text-right">{fmt(c.distKm, 0)} km</td>
                      <td className="text-right">{c.pop.toLocaleString()}</td>
                    </tr>
                  ))}
                  {!hits.length && <tr><td colSpan={3} className="py-4 text-center text-mute">No dataset cities inside this radius — try a larger radius.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className="order-1 lg:order-2">
        <DynamicMap center={center ?? { lat: 30, lng: 10 }} zoom={center ? 6 : 1.8} className="tall" onReady={(map, lib) => {
          mapRef.current = map; libRef.current = lib;
          map.addSource("cr-ring", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addSource("cr-cities", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({ id: "cr-ring-f", type: "fill", source: "cr-ring", paint: { "fill-color": "#d95d32", "fill-opacity": 0.07 } });
          map.addLayer({ id: "cr-ring-l", type: "line", source: "cr-ring", paint: { "line-color": "#d95d32", "line-width": 2 } });
          map.addLayer({ id: "cr-city-dots", type: "circle", source: "cr-cities", paint: { "circle-color": "#1d6e63", "circle-radius": ["interpolate", ["linear"], ["get", "pop"], 100, 4, 10000, 12], "circle-stroke-color": "#fff", "circle-stroke-width": 1.5 } });
          map.addLayer({ id: "cr-city-labels", type: "symbol", source: "cr-cities", layout: { "text-field": ["get", "name"], "text-size": 11, "text-offset": [0, 1.4], "text-font": ["Noto Sans Regular"] }, paint: { "text-color": "#1c2126", "text-halo-color": "#fff", "text-halo-width": 1.5 } });
          map.on("click", (e: any) => setCenter({ lat: e.lngLat.lat, lng: e.lngLat.lng }));
        }} />
      </div>
    </div>
  );
}
