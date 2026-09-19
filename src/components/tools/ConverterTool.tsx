"use client";
import { useMemo, useRef, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";
import { fmtCoords, isValidLat, isValidLng, parseCoordPair, type LatLng } from "@/lib/geo";
import { decodePlusCode, encodePlusCode, formatDms, formatUtm, latLngToMgrs, latLngToUtm, parseDms, parseMgrs, utmToLatLng } from "@/lib/coords";
import { CopyBtn, ErrorBox } from "@/components/ui";
import { DynamicMap, pinElement } from "./shared";

type Parsed = { point: LatLng; source: string } | { error: string };

function parseAnything(input: string): Parsed {
  const s = input.trim();
  if (!s) return { error: "Enter a coordinate in any supported format." };

  // 1. lat/lng decimal or DMS pair
  const pair = parseCoordPair(s);
  if (pair) return { point: pair, source: "decimal / DMS pair" };

  // 2. Plus code
  if (/^[0-9A-Z]{4,}\+?[0-9A-Z]*$/i.test(s.replace(/\s/g, ""))) {
    const p = decodePlusCode(s);
    if (p) return { point: p, source: "Plus Code" };
  }

  // 3. MGRS
  const mgrs = parseMgrs(s);
  if (mgrs) return { point: mgrs, source: "MGRS" };

  // 4. UTM: "32N 500000 4600000" or "32 N 500000 4600000"
  const um = s.match(/^(\d{1,2})\s*([NSns])?\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/);
  if (um) {
    const zone = parseInt(um[1], 10);
    const hemi = um[2] ? (um[2].toUpperCase() as "N" | "S") : parseFloat(um[4]) < 0 ? "S" : "N";
    const p = utmToLatLng({ zone, hemi, easting: parseFloat(um[3]), northing: parseFloat(um[4]) });
    if (p && isValidLat(p.lat) && isValidLng(p.lng)) return { point: p, source: "UTM" };
  }

  // 5. single DMS value → treat as lat with lng 0 (rare)
  const single = parseDms(s);
  if (single !== null && isValidLat(single)) return { point: { lat: single, lng: 0 }, source: "single DMS (assumed latitude)" };

  return { error: "No supported coordinate format was recognised. Examples: “40.7128, -74.006”, “40°26'46\"N 79°58'36\"W”, “18T 583960 4507530”, “33UUP 05300 21500”, “87GVCWC8+3V”." };
}

export default function ConverterTool({ params }: { params?: Record<string, unknown> }) {
  const focus = (params?.focus as string) ?? "all";
  const [input, setInput] = useState("48.858370, 2.294481");
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const parsed = useMemo(() => parseAnything(input), [input]);
  const point = parsed && "point" in parsed ? parsed.point : null;

  const outputs = useMemo(() => {
    if (!point) return null;
    const utm = latLngToUtm(point);
    return {
      decimal: fmtCoords(point),
      dms: `${formatDms(point.lat, "lat")},  ${formatDms(point.lng, "lng")}`,
      utm: utm ? formatUtm(utm) : "outside UTM range",
      mgrs: latLngToMgrs(point, 5) ?? "outside MGRS range",
      plus: encodePlusCode(point.lat, point.lng),
    };
  }, [point]);

  const moveMap = (p: LatLng) => {
    const map = mapRef.current, lib = libRef.current;
    if (!map || !lib) return;
    if (!markerRef.current) markerRef.current = new lib.Marker({ element: pinElement("#d95d32") }).setLngLat([p.lng, p.lat]).addTo(map);
    else markerRef.current.setLngLat([p.lng, p.lat]);
    map.flyTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 11), essential: true });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[420px,1fr]">
      <div className="card order-2 space-y-4 p-4 lg:order-1">
        <div>
          <span className="label">Paste any coordinate format</span>
          <textarea
            className="textarea font-mono" rows={2}
            value={input} onChange={(e) => setInput(e.target.value)}
            placeholder='40.7128, -74.006 · 40°26&apos;46"N 79°58&apos;36"W · 18T 583960 4507530 · 33UUP 05300 21500 · 87GVCWC8+3V'
          />
        </div>
        {parsed && "error" in parsed && <ErrorBox>{parsed.error}</ErrorBox>}
        {point && outputs && (
          <>
            <div className="text-xs text-mute">Recognised as <strong className="text-ink">{parsed && "source" in parsed ? parsed.source : ""}</strong> — all formats below update instantly.</div>
            <div className="space-y-2">
              <Row label="Decimal degrees" value={outputs.decimal} highlight={focus === "all" || focus === "decimal"} />
              <Row label="Degrees / minutes / seconds" value={outputs.dms} highlight={focus === "dms" || focus === "decimal"} />
              <Row label="UTM (WGS84)" value={outputs.utm} highlight={focus === "utm"} />
              <Row label="MGRS" value={outputs.mgrs} highlight={focus === "mgrs"} />
              <Row label="Plus Code (Open Location Code)" value={outputs.plus} highlight={focus === "pluscode"} />
            </div>
            <button type="button" className="btn btn-primary w-full" onClick={() => moveMap(point)}>Show on map</button>
          </>
        )}
      </div>
      <div className="order-1 lg:order-2">
        <DynamicMap center={point ?? { lat: 25, lng: 10 }} zoom={point ? 11 : 1.6} className="tall" onReady={(map, lib) => {
          mapRef.current = map; libRef.current = lib;
          if (point) {
            markerRef.current = new lib.Marker({ element: pinElement("#d95d32") }).setLngLat([point.lng, point.lat]).addTo(map);
          }
          map.on("click", (e: any) => setInput(`${e.lngLat.lat.toFixed(6)}, ${e.lngLat.lng.toFixed(6)}`));
        }} />
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 ${highlight ? "border-brand bg-brand-soft" : "border-line bg-well"}`}>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-wide text-mute">{label}</div>
        <div className="truncate font-mono text-sm font-semibold">{value}</div>
      </div>
      <CopyBtn text={value} label="" />
    </div>
  );
}
