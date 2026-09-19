"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MLMap, GeoJSONSource } from "maplibre-gl";
import { distanceKm, fmt, ringAreaKm2, circleAreaKm2, circleCircumferenceKm, destination, fmtDist, toKm, kmTo, type LatLng, type UnitKey, EARTH_R_KM } from "@/lib/geo";
import { downloadText, geojsonToKml } from "@/lib/formats";
import { readUrlParams, syncUrl, Field, Stat, ErrorBox } from "@/components/ui";
import { DynamicMap } from "./shared";
import LocationSearch from "@/components/LocationSearch";

const AREA_UNITS: [string, number][] = [
  ["m²", 1e6], ["km²", 1], ["hectares", 100], ["acres", 247.105], ["mi²", 0.386102], ["ft²", 10763910],
];

export default function AreaTool({ params }: { params?: Record<string, unknown> }) {
  const mode = (params?.mode as string) === "circle" ? "circle" : "polygon";
  const showPaste = !!params?.showPaste;
  const perimeter = (params?.mode as string) === "perimeter";
  if (mode === "circle") return <CircleAreaTool />;
  return <PolygonAreaTool showPaste={showPaste} perimeterFocus={perimeter} />;
}

function PolygonAreaTool({ showPaste, perimeterFocus = false }: { showPaste: boolean; perimeterFocus?: boolean }) {
  const [verts, setVerts] = useState<LatLng[]>([]);
  const [closed, setClosed] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [pasteErr, setPasteErr] = useState<string | null>(null);
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const stats = useMemo(() => {
    if (verts.length < 3) return null;
    const ring: [number, number][] = verts.map((v) => [v.lng, v.lat]);
    const areaKm2 = ringAreaKm2(ring);
    let perim = 0;
    for (let i = 0; i < verts.length; i++) perim += distanceKm(verts[i], verts[(i + 1) % verts.length]);
    return { areaKm2, perimKm: closed ? perim : perim };
  }, [verts, closed]);

  const draw = () => {
    const map = mapRef.current;
    if (!map) return;
    const src = map.getSource("area") as GeoJSONSource | undefined;
    if (!src) return;
    const feats: GeoJSON.Feature[] = [];
    if (verts.length >= 2) {
      const coords = verts.map((v) => [v.lng, v.lat] as [number, number]);
      if (closed) coords.push(coords[0]);
      feats.push({ type: "Feature", properties: { kind: "line" }, geometry: { type: "LineString", coordinates: coords } });
      if (closed && verts.length >= 3) {
        feats.push({ type: "Feature", properties: { kind: "fill" }, geometry: { type: "Polygon", coordinates: [[...coords, coords[0]]] } });
      }
    }
    src.setData({ type: "FeatureCollection", features: feats });
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    const lib = libRef.current;
    if (lib) verts.forEach((v) => {
      const el = document.createElement("div");
      el.style.cssText = "width:12px;height:12px;border-radius:50%;background:#fff;border:3px solid #1d6e63;box-shadow:0 1px 3px rgba(0,0,0,.4)";
      markersRef.current.push(new lib.Marker({ element: el }).setLngLat([v.lng, v.lat]).addTo(map));
    });
  };

  useEffect(() => { draw(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [verts, closed]);

  const applyPaste = () => {
    setPasteErr(null);
    const pts: LatLng[] = [];
    for (const line of pasteText.split(/\n/)) {
      const m = line.trim().match(/^\s*(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)\s*$/);
      if (m) {
        const lat = parseFloat(m[1]), lng = parseFloat(m[2]);
        if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) pts.push({ lat, lng });
      }
    }
    if (pts.length < 3) { setPasteErr("Need at least 3 valid “lat, lng” lines."); return; }
    setVerts(pts); setClosed(true);
    const map = mapRef.current;
    if (map) {
      const lngs = pts.map((p) => p.lng), lats = pts.map((p) => p.lat);
      map.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], { padding: 60, maxZoom: 15 });
    }
  };

  const exportFc = () => ({
    type: "FeatureCollection" as const,
    features: verts.length >= 3 ? [{
      type: "Feature" as const,
      properties: { area_km2: stats?.areaKm2 },
      geometry: { type: "Polygon" as const, coordinates: [[...verts.map((v) => [v.lng, v.lat]), [verts[0].lng, verts[0].lat]]] },
    }] : [],
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[380px,1fr]">
      <div className="card order-2 space-y-4 p-4 lg:order-1">
        <p className="text-sm text-mute">Click the map to add vertices. Close the shape when done — or paste coordinates below.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary btn-sm" disabled={verts.length < 3 || closed} onClick={() => setClosed(true)}>Close shape</button>
          <button type="button" className="btn btn-ghost btn-sm" disabled={!verts.length} onClick={() => { if (closed) setClosed(false); else setVerts((v) => v.slice(0, -1)); }}>{closed ? "Edit" : "Undo"}</button>
          <button type="button" className="btn btn-ghost btn-sm" disabled={!verts.length} onClick={() => { setVerts([]); setClosed(false); }}>Reset</button>
        </div>
        {showPaste && (
          <div>
            <Field label="Paste vertices (lat, lng — one per line)">
              <textarea className="textarea" rows={4} value={pasteText} onChange={(e) => setPasteText(e.target.value)} placeholder={"40.7128, -74.0060\n40.7200, -73.9900\n40.7050, -73.9950"} />
            </Field>
            <div className="mt-2 flex items-center gap-2">
              <button type="button" className="btn btn-ghost btn-sm" onClick={applyPaste}>Draw pasted polygon</button>
            </div>
            {pasteErr && <div className="mt-2"><ErrorBox>{pasteErr}</ErrorBox></div>}
          </div>
        )}
        {stats && closed && (
          <div className="space-y-2 border-t border-line pt-3">
            {perimeterFocus && (
              <div className="rounded-lg bg-brand-soft px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-wide text-mute">Perimeter</div>
                <div className="font-display text-2xl font-bold text-brand-strong">{fmtDist(stats.perimKm, "km")} <span className="text-base font-semibold">· {fmtDist(stats.perimKm, "mi")}</span></div>
              </div>
            )}
            <table className="tbl">
              <tbody>
                {AREA_UNITS.map(([label, f]) => (
                  <tr key={label}>
                    <td className="text-mute">{label}</td>
                    <td className="text-right font-semibold">{(stats.areaKm2 * f).toLocaleString("en-US", { maximumFractionDigits: stats.areaKm2 * f >= 1000 ? 0 : 2 })}</td>
                  </tr>
                ))}
                <tr><td className="text-mute">Perimeter</td><td className="text-right font-semibold">{fmtDist(stats.perimKm, "km")} · {fmtDist(stats.perimKm, "mi")}</td></tr>
              </tbody>
            </table>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => downloadText("mapforge-polygon.geojson", JSON.stringify(exportFc(), null, 2), "application/geo+json")}>Export GeoJSON</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => downloadText("mapforge-polygon.kml", geojsonToKml(exportFc(), "Measured polygon"), "application/vnd.google-earth.kml+xml")}>KML</button>
            </div>
          </div>
        )}
        {!closed && verts.length > 0 && <p className="text-sm text-mute">{verts.length} vertex{verts.length > 1 ? "es" : ""} placed.</p>}
      </div>
      <div className="order-1 lg:order-2">
        <DynamicMap center={{ lat: 40.71, lng: -74.0 }} zoom={12} className="tall" onReady={(map, lib) => {
          mapRef.current = map; libRef.current = lib;
          map.addSource("area", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({ id: "area-fill", type: "fill", source: "area", filter: ["==", ["get", "kind"], "fill"], paint: { "fill-color": "#1d6e63", "fill-opacity": 0.18 } });
          map.addLayer({ id: "area-line", type: "line", source: "area", filter: ["==", ["get", "kind"], "line"], paint: { "line-color": "#1d6e63", "line-width": 2 } });
          map.on("click", (e: any) => {
            setVerts((v) => [...v, { lat: e.lngLat.lat, lng: e.lngLat.lng }]);
          });
        }} />
      </div>
    </div>
  );
}

function CircleAreaTool() {
  const [unit, setUnit] = useState<UnitKey>("km");
  const [radius, setRadius] = useState(5);
  const [center, setCenter] = useState<LatLng>(() => {
    const p = readUrlParams();
    const lat = parseFloat(p.get("lat") ?? ""), lng = parseFloat(p.get("lng") ?? "");
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : { lat: 40.7549, lng: -73.984 };
  });
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const radiusKm = toKm(radius, unit);
  const flat = circleAreaKm2(radiusKm);
  const cap = 2 * Math.PI * EARTH_R_KM ** 2 * (1 - Math.cos(radiusKm / EARTH_R_KM));

  useEffect(() => { syncUrl({ lat: center.lat.toFixed(5), lng: center.lng.toFixed(5) }); }, [center]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const coords: [number, number][] = [];
    for (let i = 0; i <= 128; i++) { const p = destination(center, (i / 128) * 360, radiusKm); coords.push([p.lng, p.lat]); }
    const src = map.getSource("carea") as GeoJSONSource | undefined;
    src?.setData({ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [coords] } });
    if (!markerRef.current && libRef.current) {
      markerRef.current = new libRef.current.Marker({ draggable: true, color: "#d95d32" }).setLngLat([center.lng, center.lat]).addTo(map);
      markerRef.current.on("dragend", () => {
        const ll = markerRef.current.getLngLat();
        setCenter({ lat: ll.lat, lng: ll.lng });
      });
    } else markerRef.current?.setLngLat([center.lng, center.lat]);
  }, [center, radiusKm]);

  return (
    <div className="grid gap-4 lg:grid-cols-[380px,1fr]">
      <div className="card order-2 space-y-4 p-4 lg:order-1">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Radius">
            <input type="number" min={0.01} step="any" className="input" value={radius} onChange={(e) => setRadius(Math.max(0.01, parseFloat(e.target.value) || 0.01))} />
          </Field>
          <Field label="Unit">
            <select className="select" value={unit} onChange={(e) => {
              const next = e.target.value as UnitKey;
              setRadius(Number(kmTo(toKm(radius, unit), next).toFixed(4)));
              setUnit(next);
            }}>
              <option value="km">Kilometers</option><option value="mi">Miles</option><option value="m">Meters</option><option value="nmi">Nautical miles</option><option value="ft">Feet</option>
            </select>
          </Field>
        </div>
        <Field label="Center">
          <LocationSearch placeholder="Search center…" onSelect={(h) => { setCenter({ lat: h.lat, lng: h.lng }); mapRef.current?.flyTo({ center: [h.lng, h.lat], zoom: 11, essential: true }); }} />
        </Field>
        <div className="grid grid-cols-2 gap-2 border-t border-line pt-3">
          <Stat label="Area (πr²)" value={`${(flat * 100).toLocaleString("en-US", { maximumFractionDigits: 0 })} ha`} sub={`${flat.toLocaleString("en-US", { maximumFractionDigits: 2 })} km² · ${(flat * 247.105).toLocaleString("en-US", { maximumFractionDigits: 0 })} acres`} />
          <Stat label="Circumference" value={fmtDist(circleCircumferenceKm(radiusKm), unit)} sub={`radius = ${fmt(radius)} ${unit}`} />
        </div>
        {radiusKm > 50 && <p className="text-xs text-mute">At this scale, the spherical-cap area ({fmt(cap)} km²) is slightly smaller than the flat πr² value — curvature matters.</p>}
      </div>
      <div className="order-1 lg:order-2">
        <DynamicMap center={center} zoom={10} className="tall" onReady={(map, lib) => {
          mapRef.current = map; libRef.current = lib;
          map.addSource("carea", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({ id: "carea-f", type: "fill", source: "carea", paint: { "fill-color": "#d95d32", "fill-opacity": 0.15 } });
          map.addLayer({ id: "carea-l", type: "line", source: "carea", paint: { "line-color": "#d95d32", "line-width": 2 } });
        }} />
      </div>
    </div>
  );
}
