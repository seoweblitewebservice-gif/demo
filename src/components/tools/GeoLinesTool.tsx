"use client";
import { useEffect, useRef, useState } from "react";
import type { Map as MLMap, GeoJSONSource } from "maplibre-gl";
import { fmtCoords, type LatLng } from "@/lib/geo";
import { CopyBtn } from "@/components/ui";
import { DynamicMap } from "./shared";

interface LineDef {
  kind: "lat" | "lng";
  value: number;
  label: string;
  center: LatLng;
  zoom: number;
  fact: string;
}

const LINES: Record<string, LineDef> = {
  equator: { kind: "lat", value: 0, label: "Equator — 0° latitude", center: { lat: 0, lng: 20 }, zoom: 2.2, fact: "40,075 km around — the only latitude that is a great circle." },
  "prime-meridian": { kind: "lng", value: 0, label: "Prime Meridian — 0° longitude", center: { lat: 25, lng: 0 }, zoom: 2, fact: "Runs through Greenwich, London — origin of the world's time zones." },
  "date-line": { kind: "lng", value: 180, label: "International Date Line — ≈180° longitude", center: { lat: 10, lng: 180 }, zoom: 2, fact: "Cross it westbound, gain a day; eastbound, lose one." },
  "tropic-cancer": { kind: "lat", value: 23.437, label: "Tropic of Cancer — 23.44° N", center: { lat: 23.437, lng: 30 }, zoom: 2.2, fact: "Northern limit of the overhead Sun — reached at the June solstice." },
  "tropic-capricorn": { kind: "lat", value: -23.437, label: "Tropic of Capricorn — 23.44° S", center: { lat: -23.437, lng: -10 }, zoom: 2.2, fact: "Southern limit of the overhead Sun — reached at the December solstice." },
  arctic: { kind: "lat", value: 66.563, label: "Arctic Circle — 66.56° N", center: { lat: 66.563, lng: 40 }, zoom: 2.4, fact: "Inside it: at least one 24-hour day and one 24-hour night per year." },
  antarctic: { kind: "lat", value: -66.563, label: "Antarctic Circle — 66.56° S", center: { lat: -66.563, lng: 40 }, zoom: 2.4, fact: "The southern polar boundary — almost entirely ocean and ice." },
};

export default function GeoLinesTool({ params }: { params?: Record<string, unknown> }) {
  const def = LINES[(params?.line as string) ?? "equator"] ?? LINES.equator;
  const [clicked, setClicked] = useState<LatLng | null>(null);
  const mapRef = useRef<MLMap | null>(null);

  const lineFeature = (): GeoJSON.Feature => {
    const coords: [number, number][] = [];
    if (def.kind === "lat") {
      for (let lng = -180; lng <= 180; lng += 2) coords.push([lng, def.value]);
    } else {
      for (let lat = -85; lat <= 85; lat += 2) coords.push([def.value, lat]);
    }
    return { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } };
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    (map.getSource("geoline") as GeoJSONSource | undefined)?.setData(lineFeature());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.line]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip chip-brand">{def.label}</span>
        <span className="chip">{def.fact}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr,300px]">
        <DynamicMap
          center={def.center} zoom={def.zoom} className="tall"
          onReady={(map) => {
            mapRef.current = map;
            map.addSource("geoline", { type: "geojson", data: lineFeature() });
            map.addLayer({ id: "geoline-glow", type: "line", source: "geoline", paint: { "line-color": "#d95d32", "line-width": 7, "line-opacity": 0.25 } });
            map.addLayer({ id: "geoline", type: "line", source: "geoline", paint: { "line-color": "#d95d32", "line-width": 2.5 } });
            map.on("click", (e: any) => setClicked({ lat: e.lngLat.lat, lng: e.lngLat.lng }));
          }}
        />
        <div className="card space-y-3 p-4">
          <h3 className="font-display text-base font-bold">Read coordinates</h3>
          <p className="text-sm text-mute">Click anywhere — especially on the highlighted line — to read exact coordinates for that point.</p>
          {clicked && (
            <div className="space-y-2 rounded-lg border border-line bg-well px-3 py-2.5">
              <div className="font-mono text-sm font-semibold">{fmtCoords(clicked)}</div>
              {def.kind === "lat" && <div className="text-xs text-mute">Latitude here: {clicked.lat.toFixed(4)}° (line is at {def.value.toFixed(3)}°)</div>}
              {def.kind === "lng" && <div className="text-xs text-mute">Longitude here: {clicked.lng.toFixed(4)}° (line is at {def.value === 180 ? "±180" : def.value.toFixed(3)}°)</div>}
              <CopyBtn text={fmtCoords(clicked)} label="Copy coordinates" />
            </div>
          )}
          <p className="text-xs text-mute">The highlight follows the true parallel/meridian; zoom in to verify against the graticule labels.</p>
        </div>
      </div>
    </div>
  );
}
