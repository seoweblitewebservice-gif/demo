"use client";
import { useEffect, useRef, useState } from "react";
import type { Map as MLMap, GeoJSONSource } from "maplibre-gl";
import { bearingBetween, compassPoint, destination, distanceKm, fmt, toKm, kmTo, type LatLng, type UnitKey } from "@/lib/geo";
import { downloadText, toCsv } from "@/lib/formats";
import { readUrlParams, syncUrl, Field, Stat, Spinner, ErrorBox } from "@/components/ui";
import { DynamicMap, pinElement, PlaceField, type PlaceValue } from "./shared";

const PRESETS = [5, 10, 15, 25, 50];

type ZipHit = {
  zip: string;
  name: string;
  state?: string;
  country?: string;
  lat: number;
  lng: number;
  distKm: number;
  bearing: number;
};

export default function ZipRadiusTool() {
  const [unit, setUnit] = useState<UnitKey>("mi");
  const [radius, setRadius] = useState(10);
  const [center, setCenter] = useState<PlaceValue | null>(() => {
    const p = readUrlParams();
    const lat = parseFloat(p.get("lat") ?? ""), lng = parseFloat(p.get("lng") ?? "");
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hits, setHits] = useState<ZipHit[]>([]);
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const radiusKm = toKm(radius, unit);

  useEffect(() => {
    syncUrl({
      lat: center?.lat.toFixed(5) ?? null,
      lng: center?.lng.toFixed(5) ?? null,
      r: String(radius),
      u: unit,
    });
  }, [center, radius, unit]);

  const search = async () => {
    if (!center) {
      setError("Set a centre point first — search a place, use GPS, or click the map.");
      return;
    }
    setBusy(true);
    setError(null);
    setHits([]);
    try {
      // Bounding box around the circle (approx degrees)
      const degLat = radiusKm / 111;
      const degLng = radiusKm / (111 * Math.cos((center.lat * Math.PI) / 180) || 1);
      const minLon = center.lng - degLng;
      const maxLon = center.lng + degLng;
      const minLat = center.lat - degLat;
      const maxLat = center.lat + degLat;
      const viewbox = `${minLon},${maxLat},${maxLon},${minLat}`;

      const url =
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=80&postalcode=1` +
        `&viewbox=${encodeURIComponent(viewbox)}&bounded=1` +
        `&email=contact@mapbench.site`;

      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
      const rows: any[] = await res.json();

      const seen = new Set<string>();
      const list: ZipHit[] = [];
      for (const r of rows) {
        const zip =
          r.address?.postcode ||
          r.display_name?.match(/\b(\d{5})(?:-\d{4})?\b/)?.[1] ||
          "";
        if (!zip || seen.has(zip)) continue;
        const lat = parseFloat(r.lat);
        const lng = parseFloat(r.lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
        const dist = distanceKm(center, { lat, lng });
        if (dist > radiusKm) continue;
        seen.add(zip);
        list.push({
          zip,
          name: r.address?.city || r.address?.town || r.address?.village || r.address?.county || r.display_name?.split(",")[0] || "—",
          state: r.address?.state,
          country: r.address?.country_code?.toUpperCase(),
          lat,
          lng,
          distKm: dist,
          bearing: bearingBetween(center, { lat, lng }),
        });
      }
      list.sort((a, b) => a.distKm - b.distKm);
      setHits(list);
      if (!list.length) {
        setError("No postal codes found in this radius. Try a larger radius or a denser urban centre. Coverage follows OpenStreetMap postcode data.");
      }
    } catch (e: any) {
      setError(e?.message || "Could not look up postal codes. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const map = mapRef.current, lib = libRef.current;
    if (!map || !lib) return;
    if (center) {
      if (!markerRef.current) markerRef.current = new lib.Marker({ element: pinElement("#d95d32") }).setLngLat([center.lng, center.lat]).addTo(map);
      else markerRef.current.setLngLat([center.lng, center.lat]);
    }
    const coords: [number, number][] = [];
    if (center) for (let i = 0; i <= 128; i++) {
      const p = destination(center, (i / 128) * 360, radiusKm);
      coords.push([p.lng, p.lat]);
    }
    (map.getSource("zr-ring") as GeoJSONSource | undefined)?.setData(
      center ? { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [coords] } } : { type: "FeatureCollection", features: [] },
    );
    (map.getSource("zr-zips") as GeoJSONSource | undefined)?.setData({
      type: "FeatureCollection",
      features: hits.map((h) => ({
        type: "Feature",
        properties: { zip: h.zip, name: h.name },
        geometry: { type: "Point", coordinates: [h.lng, h.lat] },
      })),
    });
    if (center) {
      map.flyTo({
        center: [center.lng, center.lat],
        zoom: Math.max(6, Math.min(12, 10 - Math.log2(Math.max(radiusKm, 1) / 10))),
        essential: true,
      });
    }
  }, [center, radiusKm, hits]);

  const exportCsv = () => {
    downloadText(
      "mapbench-zips-in-radius.csv",
      toCsv(
        ["zip", "place", "state", "country", "distance_km", "bearing_deg", "lat", "lng"],
        hits.map((h) => [h.zip, h.name, h.state || "", h.country || "", h.distKm.toFixed(2), h.bearing.toFixed(1), h.lat, h.lng]),
      ),
      "text/csv",
    );
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[400px,1fr]">
      <div className="card order-2 space-y-4 p-4 lg:order-1">
        <PlaceField
          label="Centre point"
          value={center}
          onChange={setCenter}
          placeholder="City, address, or ZIP…"
        />
        <p className="text-xs text-mute">Click the map to set the centre, or search above.</p>

        <div className="flex items-center gap-2">
          <button type="button" className={`btn btn-sm flex-1 ${unit === "mi" ? "btn-primary" : "btn-ghost"}`} onClick={() => setUnit("mi")}>Miles</button>
          <button type="button" className={`btn btn-sm flex-1 ${unit === "km" ? "btn-primary" : "btn-ghost"}`} onClick={() => setUnit("km")}>Kilometers</button>
        </div>

        <Field label={`Radius (${unit})`}>
          <input
            type="number"
            min={1}
            step="any"
            className="input"
            value={radius}
            onChange={(e) => setRadius(Math.max(1, parseFloat(e.target.value) || 1))}
          />
        </Field>

        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className={`btn btn-sm ${Math.abs(radius - p) < 0.05 ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setRadius(p)}
            >{p}</button>
          ))}
        </div>

        <button type="button" className="btn btn-primary w-full" onClick={search} disabled={busy || !center}>
          {busy ? <Spinner label="Finding postal codes…" /> : "Find ZIP / postal codes"}
        </button>

        {error && <ErrorBox>{error}</ErrorBox>}

        {hits.length > 0 && (
          <div className="space-y-3 border-t border-line pt-3">
            <Stat label="Postal codes in radius" value={hits.length} sub={`within ${radius} ${unit} of centre`} />
            <div className="flex items-center justify-between">
              <span className="label !mb-0">Results</span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={exportCsv}>Download CSV</button>
            </div>
            <div className="max-h-80 overflow-y-auto rounded-lg border border-line">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>ZIP / Postcode</th>
                    <th className="text-right">Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {hits.map((h) => (
                    <tr key={h.zip + h.lat}>
                      <td>
                        <div className="font-semibold">{h.zip}</div>
                        <div className="text-xs text-mute">
                          {h.name}{h.state ? `, ${h.state}` : ""}{h.country ? ` · ${h.country}` : ""} · {compassPoint(h.bearing)}
                        </div>
                      </td>
                      <td className="text-right whitespace-nowrap">{fmt(h.distKm, 1)} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="order-1 lg:order-2">
        <DynamicMap
          center={center ?? { lat: 39.5, lng: -98.3 }}
          zoom={center ? 8 : 3.5}
          className="tall"
          onReady={(map, lib) => {
            mapRef.current = map;
            libRef.current = lib;
            map.addSource("zr-ring", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
            map.addSource("zr-zips", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
            map.addLayer({ id: "zr-ring-f", type: "fill", source: "zr-ring", paint: { "fill-color": "#d95d32", "fill-opacity": 0.08 } });
            map.addLayer({ id: "zr-ring-l", type: "line", source: "zr-ring", paint: { "line-color": "#d95d32", "line-width": 2 } });
            map.addLayer({
              id: "zr-dots",
              type: "circle",
              source: "zr-zips",
              paint: {
                "circle-color": "#1d6e63",
                "circle-radius": 6,
                "circle-stroke-color": "#fff",
                "circle-stroke-width": 1.5,
              },
            });
            map.addLayer({
              id: "zr-labels",
              type: "symbol",
              source: "zr-zips",
              layout: {
                "text-field": ["get", "zip"],
                "text-size": 11,
                "text-offset": [0, 1.2],
                "text-font": ["Noto Sans Regular"],
              },
              paint: { "text-color": "#1c2126", "text-halo-color": "#fff", "text-halo-width": 1.5 },
            });
            map.on("click", (e: any) => setCenter({ lat: e.lngLat.lat, lng: e.lngLat.lng }));
          }}
        />
      </div>
    </div>
  );
}
