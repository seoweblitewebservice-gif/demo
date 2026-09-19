// Routing provider abstraction: FOSSGIS Valhalla (all profiles + isochrones +
// optimized multi-stop) with OSRM demo server fallback for driving.

import type { LatLng } from "./geo";

export type TravelMode = "driving" | "walking" | "cycling";
const COSTING: Record<TravelMode, string> = { driving: "auto", walking: "pedestrian", cycling: "bicycle" };

export interface RouteLeg { distanceKm: number; durationS: number }
export interface RouteResult {
  ok: true;
  shape: LatLng[];
  distanceKm: number;
  durationS: number;
  legs: RouteLeg[];
  provider: "valhalla" | "osrm";
}
export type RouteError = { ok: false; message: string };

export function decodePolyline(str: string, precision = 6): LatLng[] {
  const factor = 10 ** precision;
  const coords: LatLng[] = [];
  let index = 0, lat = 0, lng = 0;
  while (index < str.length) {
    let result = 0, shift = 0, byte: number;
    do { byte = str.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20 && index < str.length);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    result = 0; shift = 0;
    do { byte = str.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20 && index < str.length);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    coords.push({ lat: lat / factor, lng: lng / factor });
  }
  return coords;
}

async function valhallaRoute(points: LatLng[], mode: TravelMode): Promise<RouteResult | RouteError> {
  const json = JSON.stringify({
    locations: points.map((p) => ({ lat: p.lat, lon: p.lng })),
    costing: COSTING[mode],
    directions_options: { units: "kilometers" },
  });
  const res = await fetch(`https://valhalla1.openstreetmap.de/route?json=${encodeURIComponent(json)}`, { method: "GET" });
  if (!res.ok) {
    if (res.status === 400) {
      const body = await res.json().catch(() => null);
      const hint = body?.error || "";
      return { ok: false, message: hint.includes("No suitable routes") || hint.includes("no route")
        ? "No route was found between these points for this travel mode. They may be separated by water or unreachable roads."
        : "The routing engine rejected this request. Check that all stops are reachable by road." };
    }
    throw new Error(`HTTP ${res.status}`);
  }
  const data = await res.json();
  const trip = data.trip;
  if (!trip || trip.status !== 0) return { ok: false, message: "No route was found between these points." };
  const shape = decodePolyline(trip.legs.map((l: any) => l.shape).join(""), 6);
  const legs: RouteLeg[] = trip.legs.map((l: any) => ({ distanceKm: l.summary.length, durationS: l.summary.time }));
  return { ok: true, shape, distanceKm: trip.summary.length, durationS: trip.summary.time, legs, provider: "valhalla" };
}

async function osrmRoute(points: LatLng[]): Promise<RouteResult | RouteError> {
  const coords = points.map((p) => `${p.lng},${p.lat}`).join(";");
  const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.length) return { ok: false, message: "No driving route was found between these points." };
  const r = data.routes[0];
  const shape: LatLng[] = r.geometry.coordinates.map((c: number[]) => ({ lat: c[1], lng: c[0] }));
  return {
    ok: true, shape, distanceKm: r.distance / 1000, durationS: r.duration,
    legs: r.legs.map((l: any) => ({ distanceKm: l.distance / 1000, durationS: l.duration })),
    provider: "osrm",
  };
}

export async function route(points: LatLng[], mode: TravelMode): Promise<RouteResult | RouteError> {
  if (points.length < 2) return { ok: false, message: "Add at least two stops to calculate a route." };
  try {
    return await valhallaRoute(points, mode);
  } catch (e) {
    if (mode === "driving") {
      try { return await osrmRoute(points); } catch { /* fall through */ }
    }
    return { ok: false, message: "The routing service is temporarily unavailable. Please try again in a moment." };
  }
}

/** Valhalla optimized (TSP) ordering — keeps first point as start. */
export async function optimizedOrder(points: LatLng[], mode: TravelMode): Promise<{ ok: true; ordered: LatLng[]; result: RouteResult } | RouteError> {
  try {
    const json = JSON.stringify({
      locations: points.map((p) => ({ lat: p.lat, lon: p.lng })),
      costing: COSTING[mode],
      source: "first",
    });
    const res = await fetch(`https://valhalla1.openstreetmap.de/optimized?json=${encodeURIComponent(json)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const trip = data.trip;
    if (!trip || trip.status !== 0) return { ok: false, message: "No optimized route was found." };
    const order = trip.locations.map((l: any) => points[l.original_index]);
    const shape = decodePolyline(trip.legs.map((l: any) => l.shape).join(""), 6);
    return {
      ok: true, ordered: order,
      result: {
        ok: true, shape, distanceKm: trip.summary.length, durationS: trip.summary.time,
        legs: trip.legs.map((l: any) => ({ distanceKm: l.summary.length, durationS: l.summary.time })),
        provider: "valhalla",
      },
    };
  } catch {
    return { ok: false, message: "The route optimization service is temporarily unavailable. Please try again." };
  }
}

export interface IsochroneResult { ok: true; geojson: GeoJSON.FeatureCollection; provider: "valhalla" }

/** Real reachable-area polygons from the Valhalla isochrone service. */
export async function isochrone(center: LatLng, mode: TravelMode, minutes: number[]): Promise<IsochroneResult | RouteError> {
  const contours = minutes.map((m) => ({ time: m }));
  const json = JSON.stringify({
    locations: [{ lat: center.lat, lon: center.lng }],
    costing: COSTING[mode],
    contours,
    polygons: true,
    denoise: 0.5,
    generalize: 0.5,
  });
  try {
    const res = await fetch(`https://valhalla1.openstreetmap.de/isochrone?json=${encodeURIComponent(json)}`);
    if (!res.ok) {
      if (res.status === 400) return { ok: false, message: "The isochrone request was rejected — the location may not be reachable by road. Try a nearby street." };
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    if (!data.features?.length) return { ok: false, message: "No reachable area was returned for this location and time." };
    return { ok: true, geojson: data, provider: "valhalla" };
  } catch {
    return { ok: false, message: "The isochrone service is temporarily unavailable. Please try again in a moment." };
  }
}

export function fmtDuration(seconds: number): string {
  if (!Number.isFinite(seconds)) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h === 0) return `${m} min`;
  return `${h} h ${String(m).padStart(2, "0")} min`;
}
