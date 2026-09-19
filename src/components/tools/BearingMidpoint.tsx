"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MLMap, GeoJSONSource } from "maplibre-gl";
import { bearingBetween, compassPoint, fmt, midpoint as calcMidpoint, parseCoordPair, fmtCoords, isValidLat, isValidLng, type LatLng } from "@/lib/geo";
import { formatPairDms } from "@/lib/coords";
import { nominatimReverse } from "@/lib/geocode";
import { readUrlParams, syncUrl, Stat, CopyBtn, Spinner, ErrorBox, Field } from "@/components/ui";
import { DynamicMap, pinElement, PlaceField, type PlaceValue } from "./shared";

function usePairUrl(keyA = "a", keyB = "b") {
  const p = readUrlParams();
  const read = (k: string): PlaceValue | null => {
    const m = p.get(k)?.split(",");
    if (!m) return null;
    const lat = parseFloat(m[0]), lng = parseFloat(m[1]);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  };
  return { initA: read(keyA), initB: read(keyB) };
}

export function BearingTool({ params }: { params?: Record<string, unknown> }) {
  const coordInputs = !!params?.coordInputs;
  const compassFocus = !!params?.compassFocus;
  const { initA, initB } = usePairUrl();
  const [a, setA] = useState<PlaceValue | null>(initA);
  const [b, setB] = useState<PlaceValue | null>(initB);
  const [rawA, setRawA] = useState("");
  const [rawB, setRawB] = useState("");
  const [degrees, setDegrees] = useState("90");
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const res = useMemo(() => {
    if (!a || !b) return null;
    const initial = bearingBetween(a, b);
    const back = bearingBetween(b, a);
    return { initial, back };
  }, [a, b]);

  useEffect(() => {
    syncUrl({ a: a ? `${a.lat},${a.lng}` : null, b: b ? `${b.lat},${b.lng}` : null });
  }, [a, b]);

  useEffect(() => {
    const map = mapRef.current, lib = libRef.current;
    if (!map || !lib) return;
    markersRef.current.forEach((m) => m.remove()); markersRef.current = [];
    if (a) markersRef.current.push(new lib.Marker({ element: pinElement("#1d6e63", "A") }).setLngLat([a.lng, a.lat]).addTo(map));
    if (b) markersRef.current.push(new lib.Marker({ element: pinElement("#d95d32", "B") }).setLngLat([b.lng, b.lat]).addTo(map));
    const src = map.getSource("brg") as GeoJSONSource | undefined;
    src?.setData(a && b ? { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [[a.lng, a.lat], [b.lng, b.lat]] } } as any : { type: "FeatureCollection", features: [] } as any);
    if (a && b) map.fitBounds([[Math.min(a.lng, b.lng), Math.min(a.lat, b.lat)], [Math.max(a.lng, b.lng), Math.max(a.lat, b.lat)]], { padding: 70, maxZoom: 12, duration: 600 });
  }, [a, b]);

  const deg = parseFloat(degrees);
  const showCompass = compassFocus && Number.isFinite(deg);

  return (
    <div className="grid gap-4 lg:grid-cols-[380px,1fr]">
      <div className="card order-2 space-y-4 p-4 lg:order-1">
        {showCompass && (
          <Field label="Bearing in degrees" hint="0° = North, 90° = East, 180° = South, 270° = West">
            <input type="number" step="any" className="input" value={degrees} onChange={(e) => setDegrees(e.target.value)} />
          </Field>
        )}
        {showCompass && (
          <div className="rounded-lg bg-brand-soft px-4 py-3 text-center">
            <div className="font-display text-3xl font-bold text-brand-strong">{compassPoint(((deg % 360) + 360) % 360)}</div>
            <div className="mt-1 text-xs text-mute">{(((deg % 360) + 360) % 360).toFixed(1)}° clockwise from true north · 16-point rose</div>
          </div>
        )}
        <div className={showCompass ? "border-t border-line pt-3" : ""}>
          {coordInputs ? (
            <>
              <Field label="Point A (lat, lng)">
                <input className="input" placeholder="40.7128, -74.0060" value={rawA} onChange={(e) => { setRawA(e.target.value); const p = parseCoordPair(e.target.value); if (p) setA(p); }} />
              </Field>
              <div className="mt-3">
                <Field label="Point B (lat, lng)">
                  <input className="input" placeholder="51.5074, -0.1278" value={rawB} onChange={(e) => { setRawB(e.target.value); const p = parseCoordPair(e.target.value); if (p) setB(p); }} />
                </Field>
              </div>
            </>
          ) : (
            <>
              <PlaceField label="From (origin)" value={a} onChange={setA} />
              <div className="mt-3"><PlaceField label="To (destination)" value={b} onChange={setB} /></div>
            </>
          )}
        </div>
        {res && (
          <div className="grid grid-cols-2 gap-2 border-t border-line pt-3">
            <Stat label="Initial bearing" value={`${fmt(res.initial, 2)}°`} sub={compassPoint(res.initial)} />
            <Stat label="Back bearing" value={`${fmt(res.back, 2)}°`} sub={compassPoint(res.back)} />
          </div>
        )}
        {res && <p className="text-xs text-mute">Bearings are relative to true north. For magnetic navigation, apply your local declination (see NOAA/BGS geomagnetic models).</p>}
      </div>
      <div className="order-1 lg:order-2">
        <DynamicMap center={{ lat: 30, lng: 0 }} zoom={1.6} className="tall" onReady={(map, lib) => {
          mapRef.current = map; libRef.current = lib;
          map.addSource("brg", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({ id: "brg-l", type: "line", source: "brg", paint: { "line-color": "#d95d32", "line-width": 2 } });
        }} />
      </div>
    </div>
  );
}

export function MidpointTool({ params }: { params?: Record<string, unknown> }) {
  const coordInputs = !!params?.coordInputs;
  const { initA, initB } = usePairUrl();
  const [a, setA] = useState<PlaceValue | null>(initA);
  const [b, setB] = useState<PlaceValue | null>(initB);
  const [rawA, setRawA] = useState("");
  const [rawB, setRawB] = useState("");
  const [nearest, setNearest] = useState<{ state: "idle" | "loading" | "done" | "err"; label?: string }>({ state: "idle" });
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const mid = useMemo(() => (a && b ? calcMidpoint(a, b) : null), [a, b]);

  useEffect(() => { syncUrl({ a: a ? `${a.lat},${a.lng}` : null, b: b ? `${b.lat},${b.lng}` : null }); }, [a, b]);

  useEffect(() => {
    let cancelled = false;
    if (!mid) { setNearest({ state: "idle" }); return; }
    setNearest({ state: "loading" });
    const t = setTimeout(async () => {
      const r = await nominatimReverse(mid.lat, mid.lng, 10);
      if (cancelled) return;
      if (r.ok) setNearest({ state: "done", label: r.result.displayName.split(",").slice(0, 3).join(",") });
      else setNearest({ state: "err" });
    }, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [mid]);

  useEffect(() => {
    const map = mapRef.current, lib = libRef.current;
    if (!map || !lib) return;
    markersRef.current.forEach((m) => m.remove()); markersRef.current = [];
    if (a) markersRef.current.push(new lib.Marker({ element: pinElement("#1d6e63", "A") }).setLngLat([a.lng, a.lat]).addTo(map));
    if (b) markersRef.current.push(new lib.Marker({ element: pinElement("#d95d32", "B") }).setLngLat([b.lng, b.lat]).addTo(map));
    if (mid) markersRef.current.push(new lib.Marker({ element: pinElement("#8a4f9e", "M") }).setLngLat([mid.lng, mid.lat]).addTo(map));
    const src = map.getSource("mid-line") as GeoJSONSource | undefined;
    src?.setData(a && b ? { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [[a.lng, a.lat], [b.lng, b.lat]] } } as any : { type: "FeatureCollection", features: [] } as any);
    if (a && b && Math.abs(a.lng - b.lng) <= 180) {
      map.fitBounds([[Math.min(a.lng, b.lng), Math.min(a.lat, b.lat)], [Math.max(a.lng, b.lng), Math.max(a.lat, b.lat)]], { padding: 70, maxZoom: 12, duration: 600 });
    } else if (mid) map.flyTo({ center: [mid.lng, mid.lat], zoom: 4, essential: true });
  }, [a, b, mid]);

  return (
    <div className="grid gap-4 lg:grid-cols-[380px,1fr]">
      <div className="card order-2 space-y-4 p-4 lg:order-1">
        {coordInputs ? (
          <>
            <Field label="Point A (lat, lng)">
              <input className="input" placeholder="40.7128, -74.006" value={rawA} onChange={(e) => { setRawA(e.target.value); const p = parseCoordPair(e.target.value); if (p) setA(p); }} />
            </Field>
            <div className="mt-3"><Field label="Point B (lat, lng)">
              <input className="input" placeholder="48.8566, 2.3522" value={rawB} onChange={(e) => { setRawB(e.target.value); const p = parseCoordPair(e.target.value); if (p) setB(p); }} />
            </Field></div>
          </>
        ) : (
          <>
            <PlaceField label="Place A" value={a} onChange={setA} />
            <div className="mt-3"><PlaceField label="Place B" value={b} onChange={setB} /></div>
          </>
        )}
        {mid && (
          <div className="space-y-2 border-t border-line pt-3">
            <Stat label="Geographic midpoint" value={fmtCoords(mid)} sub={formatPairDms(mid)} />
            <div className="flex gap-2">
              <CopyBtn text={fmtCoords(mid)} label="Copy decimal" />
              <CopyBtn text={formatPairDms(mid)} label="Copy DMS" />
            </div>
            <div className="text-sm text-mute">
              {nearest.state === "loading" && <Spinner label="Finding the nearest place…" />}
              {nearest.state === "done" && <>Nearest named place: <strong className="text-ink">{nearest.label}</strong></>}
              {nearest.state === "err" && <ErrorBox>No nearby place name found — the midpoint may be in open ocean or a remote area.</ErrorBox>}
            </div>
          </div>
        )}
        {!mid && <p className="text-sm text-mute">Set both places to compute the great-circle midpoint.</p>}
      </div>
      <div className="order-1 lg:order-2">
        <DynamicMap center={{ lat: 30, lng: 0 }} zoom={1.6} className="tall" onReady={(map, lib) => {
          mapRef.current = map; libRef.current = lib;
          map.addSource("mid-line", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({ id: "mid-line-l", type: "line", source: "mid-line", paint: { "line-color": "#8a4f9e", "line-width": 2, "line-dasharray": [2, 2] } });
        }} />
      </div>
    </div>
  );
}
