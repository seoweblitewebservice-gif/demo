"use client";
import { useEffect, useRef, useState } from "react";
import type { Map as MLMap } from "maplibre-gl";
import { fmtCoords, isValidLat, isValidLng, normLng, parseCoordPair, type LatLng } from "@/lib/geo";
import { encodePlusCode, formatDms, formatUtm, latLngToMgrs, latLngToUtm, parseDms } from "@/lib/coords";
import { readUrlParams, syncUrl, CopyBtn, ErrorBox, Field } from "@/components/ui";
import { DynamicMap, pinElement } from "./shared";
import LocationSearch from "@/components/LocationSearch";

export default function LatLongTool({ params }: { params?: Record<string, unknown> }) {
  const gpsFocus = !!params?.gpsFocus;
  const [point, setPoint] = useState<LatLng>(() => {
    const p = readUrlParams();
    const lat = parseFloat(p.get("lat") ?? ""), lng = parseFloat(p.get("lng") ?? "");
    return isValidLat(lat) && isValidLng(lng) ? { lat, lng } : { lat: 48.8584, lng: 2.2945 };
  });
  const [raw, setRaw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => { syncUrl({ lat: point.lat.toFixed(6), lng: point.lng.toFixed(6) }); }, [point]);

  useEffect(() => {
    const lib = libRef.current;
    if (!lib || !mapRef.current) return;
    if (!markerRef.current) {
      markerRef.current = new lib.Marker({ element: pinElement("#1d6e63"), draggable: true }).setLngLat([point.lng, point.lat]).addTo(mapRef.current);
      markerRef.current.on("drag", () => {
        const ll = markerRef.current.getLngLat();
        setPoint({ lat: ll.lat, lng: ll.lng });
      });
    } else markerRef.current.setLngLat([point.lng, point.lat]);
  }, [point]);

  const locateRaw = () => {
    setErr(null);
    const pair = parseCoordPair(raw);
    if (pair) { setPoint(pair); mapRef.current?.flyTo({ center: [pair.lng, pair.lat], zoom: 13, essential: true }); return; }
    // try "dms dms" style
    const parts = raw.split(/[,;]\s*|\s{2,}/);
    if (parts.length >= 2) {
      const la = parseDms(parts[0]), lo = parseDms(parts.slice(1).join(" "));
      if (la !== null && lo !== null && isValidLat(la) && isValidLng(lo)) {
        setPoint({ lat: la, lng: lo });
        mapRef.current?.flyTo({ center: [lo, la], zoom: 13, essential: true });
        return;
      }
    }
    setErr("Couldn't read that coordinate. Try “40.7128, -74.006” or “40°26'46\"N 79°58'36\"W”.");
  };

  const utm = latLngToUtm(point);
  const mgrs = latLngToMgrs(point, 5);

  return (
    <div className="grid gap-4 lg:grid-cols-[400px,1fr]">
      <div className="card order-2 space-y-4 p-4 lg:order-1">
        {gpsFocus ? (
          <div>
            <Field label="Paste GPS coordinates" hint="Decimal, DMS with hemisphere letters, and mixed separators all work.">
              <input className="input" value={raw} onChange={(e) => setRaw(e.target.value)} placeholder={'40°26\'46"N, 79°58\'36"W'} onKeyDown={(e) => e.key === "Enter" && locateRaw()} />
            </Field>
            <button type="button" className="btn btn-primary mt-2 w-full" onClick={locateRaw}>Locate</button>
            {err && <div className="mt-2"><ErrorBox>{err}</ErrorBox></div>}
          </div>
        ) : (
          <Field label="Jump to a place">
            <LocationSearch placeholder="Search and zoom…" onSelect={(h) => { setPoint({ lat: h.lat, lng: h.lng }); mapRef.current?.flyTo({ center: [h.lng, h.lat], zoom: 13, essential: true }); }} />
          </Field>
        )}
        <p className="text-xs text-mute">Click or drag on the map to move the point. Every format below updates live.</p>
        <div className="space-y-2 border-t border-line pt-3">
          <FormatRow label="Decimal degrees" value={fmtCoords(point)} />
          <FormatRow label="DMS" value={`${formatDms(point.lat, "lat")},  ${formatDms(point.lng, "lng")}`} />
          <FormatRow label="UTM (WGS84)" value={utm ? formatUtm(utm) : "Outside UTM range"} />
          <FormatRow label="MGRS" value={mgrs ?? "—"} />
          <FormatRow label="Plus Code" value={encodePlusCode(point.lat, point.lng)} />
        </div>
        <p className="text-xs text-mute">Precision: at 6 decimal places one unit ≈ 0.11 m. Coordinates use the WGS84 datum.</p>
      </div>
      <div className="order-1 lg:order-2">
        <DynamicMap center={point} zoom={12} className="tall" onReady={(map, lib) => {
          mapRef.current = map; libRef.current = lib;
          markerRef.current = new lib.Marker({ element: pinElement("#1d6e63"), draggable: true }).setLngLat([point.lng, point.lat]).addTo(map);
          markerRef.current.on("drag", () => {
            const ll = markerRef.current.getLngLat();
            setPoint({ lat: ll.lat, lng: ll.lng });
          });
          map.on("click", (e: any) => setPoint({ lat: e.lngLat.lat, lng: e.lngLat.lng }));
        }} />
      </div>
    </div>
  );
}

function FormatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-line bg-well px-3 py-2">
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-wide text-mute">{label}</div>
        <div className="truncate font-mono text-sm font-semibold">{value}</div>
      </div>
      <CopyBtn text={value} label="" />
    </div>
  );
}
