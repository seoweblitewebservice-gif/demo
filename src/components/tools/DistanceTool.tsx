"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MLMap, GeoJSONSource } from "maplibre-gl";
import { bearingBetween, compassPoint, distanceKm, fmtDist, fmt, midpoint, UNITS, type LatLng, type UnitKey } from "@/lib/geo";
import { readUrlParams, syncUrl, Field, Stat, ErrorBox } from "@/components/ui";
import { DynamicMap, pinElement, PlaceField, type PlaceValue } from "./shared";

function parsePair(s: string | null): LatLng | null {
  if (!s) return null;
  const [a, b] = s.split(",");
  const lat = parseFloat(a), lng = parseFloat(b);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
}

export default function DistanceTool({ params }: { params?: Record<string, unknown> }) {
  const emphasize = (params?.emphasize as string) ?? "";
  const [unit, setUnit] = useState<UnitKey>((params?.defaultUnit as UnitKey) ?? "mi");
  const [a, setA] = useState<PlaceValue | null>(() => {
    const p = parsePair(readUrlParams().get("a")); return p ? { ...p, label: "Point A" } : null;
  });
  const [b, setB] = useState<PlaceValue | null>(() => {
    const p = parsePair(readUrlParams().get("b")); return p ? { ...p, label: "Point B" } : null;
  });
  const [knots, setKnots] = useState(10);
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const result = useMemo(() => {
    if (!a || !b) return null;
    const km = distanceKm(a, b);
    const bearing = bearingBetween(a, b);
    const finalBearing = (bearingBetween(b, a) + 180) % 360;
    const mid = midpoint(a, b);
    return { km, bearing, finalBearing, mid };
  }, [a, b]);

  useEffect(() => {
    if (a) syncUrl({ a: `${a.lat.toFixed(5)},${a.lng.toFixed(5)}` }); else syncUrl({ a: null });
    if (b) syncUrl({ b: `${b.lat.toFixed(5)},${b.lng.toFixed(5)}` }); else syncUrl({ b: null });
  }, [a, b]);

  useEffect(() => {
    const map = mapRef.current, lib = libRef.current;
    if (!map || !lib) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    const pts: LatLng[] = [];
    if (a) { markersRef.current.push(new lib.Marker({ element: pinElement("#1d6e63", "A") }).setLngLat([a.lng, a.lat]).addTo(map)); pts.push(a); }
    if (b) { markersRef.current.push(new lib.Marker({ element: pinElement("#d95d32", "B") }).setLngLat([b.lng, b.lat]).addTo(map)); pts.push(b); }
    const src = map.getSource("dist-line") as GeoJSONSource | undefined;
    src?.setData(a && b ? {
      type: "Feature", properties: {},
      geometry: { type: "LineString", coordinates: [[a.lng, a.lat], [b.lng, b.lat]] },
    } : { type: "FeatureCollection", features: [] } as any);
    if (pts.length === 2) {
      const dx = Math.abs(pts[0].lng - pts[1].lng);
      if (dx > 180) return; // avoid wrapping across antimeridian
      map.fitBounds([[Math.min(pts[0].lng, pts[1].lng), Math.min(pts[0].lat, pts[1].lat)], [Math.max(pts[0].lng, pts[1].lng), Math.max(pts[0].lat, pts[1].lat)]], { padding: 70, maxZoom: 12, duration: 600 });
    } else if (pts.length === 1) {
      map.flyTo({ center: [pts[0].lng, pts[0].lat], zoom: 8, essential: true });
    }
  }, [a, b]);

  const isNautical = emphasize === "nautical";

  return (
    <div className="grid gap-4 lg:grid-cols-[380px,1fr]">
      <div className="card order-2 space-y-4 p-4 lg:order-1">
        <PlaceField label="From" value={a} onChange={setA} placeholder={emphasize === "zip" ? "ZIP code or place…" : emphasize === "city" ? "City name…" : "Place or address…"} />
        <div className="flex justify-center">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setA(b); setB(a); }} aria-label="Swap A and B">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M7 16V4m0 0L3 8m4-4 4 4m6 0v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Swap
          </button>
        </div>
        <PlaceField label="To" value={b} onChange={setB} placeholder={emphasize === "zip" ? "ZIP code or place…" : emphasize === "city" ? "City name…" : "Place or address…"} />
        <Field label="Unit">
          <select className="select" value={unit} onChange={(e) => setUnit(e.target.value as UnitKey)}>
            {Object.entries(UNITS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Field>
        {isNautical && (
          <Field label="Speed (knots) — for passage estimate">
            <input type="number" min={0.5} step="0.5" className="input" value={knots} onChange={(e) => setKnots(Math.max(0.5, parseFloat(e.target.value) || 0.5))} />
          </Field>
        )}

        {a && b && result && (
          <div className="space-y-3 border-t border-line pt-3">
            <div className="grid grid-cols-2 gap-2">
              <Stat label={`Distance (${unit})`} value={fmtDist(result.km, unit)} />
              <Stat label="Initial bearing" value={`${fmt(result.bearing, 1)}°`} sub={`${compassPoint(result.bearing)} (from true north)`} />
            </div>
            {emphasize === "greatcircle" && (
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Final bearing" value={`${fmt(result.finalBearing, 1)}°`} sub={compassPoint(result.finalBearing)} />
                <Stat label="Midpoint" value={`${result.mid.lat.toFixed(3)}, ${result.mid.lng.toFixed(3)}`} />
              </div>
            )}
            {isNautical && (
              <div className="rounded-lg bg-brand-soft px-3 py-2.5 text-sm">
                Straight-line passage at {knots} kn ≈ <strong>{fmt((result.km * 0.539957) / knots, 1)} hours</strong>
              </div>
            )}
            <details className="text-sm">
              <summary className="cursor-pointer font-semibold text-brand-strong">All units</summary>
              <table className="tbl mt-2">
                <tbody>
                  {Object.entries(UNITS).map(([k, v]) => (
                    <tr key={k}><td className="text-mute">{v.label}</td><td className="text-right font-semibold">{fmtDist(result.km, k as UnitKey)}</td></tr>
                  ))}
                </tbody>
              </table>
            </details>
          </div>
        )}
        {(!a || !b) && <p className="text-sm text-mute">Set both points — search a name or paste coordinates — to see results.</p>}
        {emphasize === "crow" && <p className="text-xs text-mute">This is a straight-line (great-circle) distance. Road distance is available in the Driving Distance Calculator.</p>}
      </div>
      <div className="order-1 lg:order-2">
        <DynamicMap
          center={a ?? { lat: 30, lng: 0 }} zoom={a ? 6 : 1.6} className="tall"
          onReady={(map, lib) => {
            mapRef.current = map; libRef.current = lib;
            map.addSource("dist-line", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
            map.addLayer({ id: "dist-line-l", type: "line", source: "dist-line", paint: { "line-color": "#1d6e63", "line-width": 2, "line-dasharray": [2, 2] } });
          }}
        />
      </div>
    </div>
  );
}
