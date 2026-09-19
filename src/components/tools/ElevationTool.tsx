"use client";
import { useEffect, useRef, useState } from "react";
import type { Map as MLMap, GeoJSONSource } from "maplibre-gl";
import { destination, distanceKm, fmt, type LatLng } from "@/lib/geo";
import { readUrlParams, syncUrl, ErrorBox, Field, Spinner, Stat, Seg } from "@/components/ui";
import { DynamicMap, pinElement } from "./shared";
import LocationSearch from "@/components/LocationSearch";

async function fetchElevations(points: LatLng[]): Promise<{ ok: true; elevations: number[] } | { ok: false; message: string }> {
  try {
    const lats = points.map((p) => p.lat.toFixed(5)).join(",");
    const lngs = points.map((p) => p.lng.toFixed(5)).join(",");
    const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lngs}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (!Array.isArray(data.elevation)) throw new Error();
    return { ok: true, elevations: data.elevation };
  } catch {
    return { ok: false, message: "The elevation service (Open-Meteo) is temporarily unavailable. Please try again shortly." };
  }
}

function ProfileChart({ pts, blocks }: { pts: { d: number; e: number }[]; blocks?: boolean[] }) {
  const w = 600, h = 140, pad = 8;
  const eles = pts.map((p) => p.e);
  const min = Math.min(...eles), max = Math.max(...eles);
  const span = Math.max(1, max - min);
  const maxD = pts[pts.length - 1]?.d || 1;
  const x = (d: number) => pad + (d / maxD) * (w - pad * 2);
  const y = (e: number) => h - pad - ((e - min) / span) * (h - pad * 2);
  const path = pts.map((p, i) => `${i ? "L" : "M"}${x(p.d).toFixed(1)},${y(p.e).toFixed(1)}`).join("");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Elevation profile chart">
      <path d={`${path} L${x(maxD)},${h - pad} L${x(0)},${h - pad} Z`} fill="var(--sf-brand)" opacity=".15" />
      <path d={path} fill="none" stroke="var(--sf-brand)" strokeWidth="2" />
      {blocks && pts.map((p, i) => blocks[i] ? <circle key={i} cx={x(p.d)} cy={y(p.e)} r="2.4" fill="var(--sf-ember)" /> : null)}
    </svg>
  );
}

export default function ElevationTool({ params }: { params?: Record<string, unknown> }) {
  const mode = (params?.mode as string) ?? "point";
  const [points, setPoints] = useState<LatLng[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elevations, setElevations] = useState<number[] | null>(null);
  const [eyeH, setEyeH] = useState(1.7);
  const [targetH, setTargetH] = useState(10);
  const [losVerdict, setLosVerdict] = useState<null | { visible: boolean; blockedAtKm: number | null }>(null);
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const need = mode === "point" ? 1 : 2;

  useEffect(() => {
    const map = mapRef.current, lib = libRef.current;
    if (!map || !lib) return;
    markersRef.current.forEach((m) => m.remove()); markersRef.current = [];
    points.forEach((p, i) => markersRef.current.push(new lib.Marker({ element: pinElement(i === 0 ? "#1d6e63" : "#d95d32", need === 2 ? (i === 0 ? "A" : "B") : undefined) }).setLngLat([p.lng, p.lat]).addTo(map)));
    const src = map.getSource("elev-line") as GeoJSONSource | undefined;
    src?.setData(points.length === 2 ? { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: points.map((p) => [p.lng, p.lat]) } } as any : { type: "FeatureCollection", features: [] } as any);
  }, [points, need]);

  const run = async () => {
    setError(null); setElevations(null); setLosVerdict(null);
    if (points.length < need) { setError(mode === "point" ? "Click the map or search a place first." : "Set both points on the map first."); return; }
    setBusy(true);
    if (mode === "point") {
      const r = await fetchElevations(points);
      setBusy(false);
      if (!r.ok) { setError(r.message); return; }
      setElevations(r.elevations);
      return;
    }
    // sample profile
    const D = distanceKm(points[0], points[1]);
    const bearing = (() => {
      // initial bearing via geo lib
      return undefined;
    })();
    const samples: LatLng[] = [];
    const N = 60;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      samples.push(interpolateGreatCircle(points[0], points[1], t));
    }
    const r = await fetchElevations(samples);
    setBusy(false);
    if (!r.ok) { setError(r.message); return; }
    setElevations(r.elevations);
    if (mode === "los") {
      const obsE = r.elevations[0] + eyeH;
      const tgtE = r.elevations[N] + targetH;
      const R = 6371 / (1 - 0.13); // effective radius with standard refraction
      let blockedAt: number | null = null;
      for (let i = 1; i < N; i++) {
        const d = D * (i / N);
        const lineE = obsE + (tgtE - obsE) * (i / N);
        const bulge = ((d * (D - d)) / (2 * R)) * 1000; // km→m
        if (r.elevations[i] + bulge > lineE) { blockedAt = d; break; }
      }
      setLosVerdict({ visible: blockedAt === null, blockedAtKm: blockedAt });
    }
  };

  const profile = elevations && points.length === 2
    ? (() => {
      const D = distanceKm(points[0], points[1]);
      return elevations.map((e, i) => ({ d: D * (i / (elevations.length - 1)), e }));
    })()
    : null;

  const gainLoss = profile ? profile.slice(1).reduce((acc, p, i) => {
    const d = p.e - profile[i].e;
    if (d > 0) acc.gain += d; else acc.loss += -d;
    return acc;
  }, { gain: 0, loss: 0 }) : null;

  return (
    <div className="grid gap-4 lg:grid-cols-[400px,1fr]">
      <div className="card order-2 space-y-4 p-4 lg:order-1">
        {mode === "point" ? (
          <Field label="Location">
            <LocationSearch placeholder="Search a place…" onSelect={(h) => { setPoints([{ lat: h.lat, lng: h.lng }]); mapRef.current?.flyTo({ center: [h.lng, h.lat], zoom: 12, essential: true }); }} />
          </Field>
        ) : (
          <p className="text-sm text-mute">Click the map to set {mode === "los" ? "the observer point, then the target point" : "the two endpoints of the profile"}.</p>
        )}
        {mode === "los" && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Observer eye height (m)">
              <input type="number" min={0} step="0.1" className="input" value={eyeH} onChange={(e) => setEyeH(Math.max(0, parseFloat(e.target.value) || 0))} />
            </Field>
            <Field label="Target height (m)">
              <input type="number" min={0} step="0.5" className="input" value={targetH} onChange={(e) => setTargetH(Math.max(0, parseFloat(e.target.value) || 0))} />
            </Field>
          </div>
        )}
        <button type="button" className="btn btn-primary w-full" onClick={run} disabled={busy}>
          {busy ? <Spinner label="Sampling terrain…" /> : mode === "point" ? "Get elevation" : mode === "los" ? "Check line of sight" : "Draw profile"}
        </button>
        {points.length < need && !error && <p className="text-xs text-mute">{need - points.length} more point{need - points.length > 1 ? "s" : ""} needed.</p>}
        {points.length >= need && <button type="button" className="btn btn-ghost btn-sm w-full" onClick={() => { setPoints([]); setElevations(null); setLosVerdict(null); }}>Reset points</button>}
        {error && <ErrorBox>{error}</ErrorBox>}

        {elevations && mode === "point" && (
          <Stat label="Terrain elevation (Copernicus GLO-90)" value={`${Math.round(elevations[0])} m`} sub={`${fmt(elevations[0] * 3.28084, 0)} ft above sea level`} />
        )}
        {profile && gainLoss && mode !== "point" && (
          <div className="space-y-2 border-t border-line pt-3">
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Ascent" value={`+${Math.round(gainLoss.gain)} m`} />
              <Stat label="Descent" value={`−${Math.round(gainLoss.loss)} m`} />
              <Stat label="Min / Max" value={`${Math.round(Math.min(...profile.map((p) => p.e)))} / ${Math.round(Math.max(...profile.map((p) => p.e)))} m`} />
              <Stat label="Length" value={`${fmt(distanceKm(points[0], points[1]))} km`} />
            </div>
            {losVerdict && (
              <div className={`rounded-lg px-4 py-3 text-sm font-semibold ${losVerdict.visible ? "bg-brand-soft text-brand-strong" : "border border-ember/40 bg-[var(--sf-warn-bg)]"}`}>
                {losVerdict.visible
                  ? "✓ Line of sight is clear — terrain does not block the view (refraction included)."
                  : `✗ Blocked by terrain about ${fmt(losVerdict.blockedAtKm ?? 0, 1)} km from the observer.`}
              </div>
            )}
            <ProfileChart pts={profile} />
          </div>
        )}
      </div>
      <div className="order-1 lg:order-2">
        <DynamicMap center={{ lat: 30, lng: 10 }} zoom={1.8} className="tall" onReady={(map, lib) => {
          mapRef.current = map; libRef.current = lib;
          map.addSource("elev-line", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({ id: "elev-line-l", type: "line", source: "elev-line", paint: { "line-color": "#d95d32", "line-width": 3 } });
          map.on("click", (e: any) => {
            setPoints((ps) => {
              if (ps.length >= 2) return [{ lat: e.lngLat.lat, lng: e.lngLat.lng }];
              return [...ps, { lat: e.lngLat.lat, lng: e.lngLat.lng }];
            });
            setElevations(null); setLosVerdict(null);
          });
        }} />
      </div>
    </div>
  );
}

/** Simple linear-in-3D spherical interpolation — fine for profile sampling. */
function interpolateGreatCircle(a: LatLng, b: LatLng, t: number): LatLng {
  const toR = (x: number) => (x * Math.PI) / 180, toD = (x: number) => (x * 180) / Math.PI;
  const φ1 = toR(a.lat), λ1 = toR(a.lng), φ2 = toR(b.lat), λ2 = toR(b.lng);
  const d = 2 * Math.asin(Math.sqrt(Math.sin((φ1 - φ2) / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ1 - λ2) / 2) ** 2));
  if (d < 1e-9) return a;
  const Acoef = Math.sin((1 - t) * d) / Math.sin(d), B = Math.sin(t * d) / Math.sin(d);
  const x = Acoef * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
  const y = Acoef * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
  const z = Acoef * Math.sin(φ1) + B * Math.sin(φ2);
  return { lat: toD(Math.atan2(z, Math.sqrt(x * x + y * y))), lng: toD(Math.atan2(y, x)) };
}
