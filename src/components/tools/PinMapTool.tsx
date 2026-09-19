"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MLMap, GeoJSONSource } from "maplibre-gl";
import { downloadDataUrl, downloadText, geojsonToKml, toCsv } from "@/lib/formats";
import { readUrlParams, syncUrl, Field } from "@/components/ui";
import { DynamicMap, PALETTE } from "./shared";

interface Pin { id: number; lat: number; lng: number; label: string; color: string }

function parsePinsFromUrl(): Pin[] {
  const raw = readUrlParams().get("pins");
  if (!raw) return [];
  try {
    return raw.split("~").map((chunk, i) => {
      const [lat, lng, color, ...rest] = chunk.split("|");
      return { id: i + 1, lat: parseFloat(lat), lng: parseFloat(lng), color: color || PALETTE[0], label: decodeURIComponent(rest.join("|") || "") };
    }).filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  } catch { return []; }
}

export default function PinMapTool() {
  const [pins, setPins] = useState<Pin[]>(parsePinsFromUrl);
  const nextId = useRef(pins.length + 1);
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<any>(null);

  useEffect(() => {
    syncUrl({ pins: pins.length ? pins.map((p) => `${p.lat.toFixed(5)}|${p.lng.toFixed(5)}|${p.color}|${encodeURIComponent(p.label)}`).join("~") : null });
  }, [pins]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const src = map.getSource("pins") as GeoJSONSource | undefined;
    src?.setData({
      type: "FeatureCollection",
      features: pins.map((p) => ({ type: "Feature" as const, properties: { label: p.label, color: p.color }, geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] } })),
    });
  }, [pins]);

  const exportFc = () => ({
    type: "FeatureCollection" as const,
    features: pins.map((p) => ({ type: "Feature" as const, properties: { name: p.label, color: p.color }, geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] } })),
  });

  const exportPng = () => {
    const map = mapRef.current;
    if (!map) return;
    downloadDataUrl("mapforge-map.png", map.getCanvas().toDataURL("image/png"));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[360px,1fr]">
      <div className="card order-2 space-y-3 p-4 lg:order-1">
        <p className="text-sm text-mute">Click the map to drop a pin. Drag pins to move them. Everything lives in the URL — share freely.</p>
        <ul className="max-h-72 space-y-2 overflow-y-auto">
          {pins.map((p, i) => (
            <li key={p.id} className="flex items-center gap-2 rounded-lg border border-line p-2">
              <button
                type="button" aria-label="Change colour"
                className="h-6 w-6 shrink-0 rounded-full border-2 border-white shadow"
                style={{ background: p.color }}
                onClick={() => setPins((ps) => ps.map((x) => x.id === p.id ? { ...x, color: PALETTE[(PALETTE.indexOf(x.color) + 1 + PALETTE.length) % PALETTE.length] } : x))}
              />
              <input
                className="input min-w-0 flex-1 !py-1.5 text-sm"
                value={p.label}
                placeholder={`Pin ${i + 1}`}
                aria-label={`Label for pin ${i + 1}`}
                onChange={(e) => setPins((ps) => ps.map((x) => x.id === p.id ? { ...x, label: e.target.value } : x))}
              />
              <button type="button" className="btn btn-ghost btn-sm" aria-label="Remove pin" onClick={() => setPins((ps) => ps.filter((x) => x.id !== p.id))}>✕</button>
            </li>
          ))}
        </ul>
        {pins.length === 0 && <div className="rounded-lg bg-well px-3 py-4 text-center text-sm text-mute">No pins yet — click the map to add the first one.</div>}
        <div className="space-y-2 border-t border-line pt-3">
          <div className="label">Export</div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary btn-sm" onClick={exportPng} disabled={!pins.length}>PNG image</button>
            <button type="button" className="btn btn-ghost btn-sm" disabled={!pins.length} onClick={() => downloadText("mapforge-pins.geojson", JSON.stringify(exportFc(), null, 2), "application/geo+json")}>GeoJSON</button>
            <button type="button" className="btn btn-ghost btn-sm" disabled={!pins.length} onClick={() => downloadText("mapforge-pins.kml", geojsonToKml(exportFc(), "Pin map"), "application/vnd.google-earth.kml+xml")}>KML</button>
            <button type="button" className="btn btn-ghost btn-sm" disabled={!pins.length} onClick={() => downloadText("mapforge-pins.csv", toCsv(["name", "lat", "lng", "color"], pins.map((p) => [p.label, p.lat.toFixed(6), p.lng.toFixed(6), p.color])), "text/csv")}>CSV</button>
            {pins.length > 0 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPins([])}>Clear all</button>}
          </div>
          <p className="text-xs text-mute">PNG captures the current map view including pins and basemap.</p>
        </div>
      </div>
      <div className="order-1 lg:order-2">
        <DynamicMap center={{ lat: 40.7128, lng: -74.006 }} zoom={pins.length ? 11 : 3} className="tall" onReady={(map, lib) => {
          mapRef.current = map; libRef.current = lib;
          map.addSource("pins", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({
            id: "pin-dots", type: "circle", source: "pins",
            paint: { "circle-color": ["get", "color"], "circle-radius": 9, "circle-stroke-color": "#fff", "circle-stroke-width": 2.5 },
          });
          map.addLayer({
            id: "pin-labels", type: "symbol", source: "pins",
            layout: { "text-field": ["get", "label"], "text-size": 12, "text-offset": [0, 1.6], "text-font": ["Noto Sans Regular"], "text-optional": true },
            paint: { "text-color": "#1c2126", "text-halo-color": "#ffffff", "text-halo-width": 1.6 },
          });
          map.on("click", (e: any) => {
            setPins((ps) => [...ps, { id: nextId.current++, lat: e.lngLat.lat, lng: e.lngLat.lng, label: "", color: PALETTE[ps.length % PALETTE.length] }]);
          });
        }} />
      </div>
    </div>
  );
}
