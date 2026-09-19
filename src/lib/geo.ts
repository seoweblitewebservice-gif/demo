// Geodesic math on the WGS84 sphere (mean radius 6371.0088 km).
// Haversine distances are accurate to ~0.3% vs. ellipsoidal geodesics — plenty
// for interactive tools; methodology is documented at /methodology.

export const EARTH_R_KM = 6371.0088;

export interface LatLng { lat: number; lng: number }

export const toRad = (d: number) => (d * Math.PI) / 180;
export const toDeg = (r: number) => (r * 180) / Math.PI;

export function isValidLat(n: number) { return Number.isFinite(n) && n >= -90 && n <= 90; }
export function isValidLng(n: number) { return Number.isFinite(n) && n >= -180 && n <= 180; }

export function normLng(lng: number) {
  let l = ((lng + 180) % 360) - 180;
  if (l === -180) l = 180;
  return l;
}

/** Great-circle distance in km (haversine). */
export function distanceKm(a: LatLng, b: LatLng): number {
  const φ1 = toRad(a.lat), φ2 = toRad(b.lat);
  const dφ = toRad(b.lat - a.lat), dλ = toRad(b.lng - a.lng);
  const h = Math.sin(dφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2;
  return 2 * EARTH_R_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Destination point given start, initial bearing (deg) and distance (km). */
export function destination(origin: LatLng, bearingDeg: number, distKm: number): LatLng {
  const δ = distKm / EARTH_R_KM;
  const θ = toRad(bearingDeg);
  const φ1 = toRad(origin.lat), λ1 = toRad(origin.lng);
  const φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));
  const λ2 = λ1 + Math.atan2(Math.sin(θ) * Math.sin(δ) * Math.cos(φ1), Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2));
  return { lat: toDeg(φ2), lng: normLng(toDeg(λ2)) };
}

/** Initial great-circle bearing from a to b, degrees clockwise from true north. */
export function bearingBetween(a: LatLng, b: LatLng): number {
  const φ1 = toRad(a.lat), φ2 = toRad(b.lat), dλ = toRad(b.lng - a.lng);
  const y = Math.sin(dλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(dλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Great-circle midpoint. */
export function midpoint(a: LatLng, b: LatLng): LatLng {
  const φ1 = toRad(a.lat), λ1 = toRad(a.lng);
  const φ2 = toRad(b.lat), dλ = toRad(b.lng - a.lng);
  const Bx = Math.cos(φ2) * Math.cos(dλ), By = Math.cos(φ2) * Math.sin(dλ);
  const φ3 = Math.atan2(Math.sin(φ1) + Math.sin(φ2), Math.sqrt((Math.cos(φ1) + Bx) ** 2 + By ** 2));
  const λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);
  return { lat: toDeg(φ3), lng: normLng(toDeg(λ3)) };
}

/** Spherical polygon area in km² for a ring of [lng, lat] positions. */
export function ringAreaKm2(ring: [number, number][]): number {
  if (ring.length < 3) return 0;
  let total = 0;
  for (let i = 0; i < ring.length; i++) {
    const [λ1, φ1] = ring[i].map(toRad);
    const [λ2, φ2] = ring[(i + 1) % ring.length].map(toRad);
    total += (λ2 - λ1) * (2 + Math.sin(φ1) + Math.sin(φ2));
  }
  return Math.abs((total * EARTH_R_KM * EARTH_R_KM) / 2);
}

export function circleAreaKm2(radiusKm: number) { return Math.PI * radiusKm * radiusKm; }
export function circleCircumferenceKm(radiusKm: number) { return 2 * Math.PI * radiusKm; }

// ---------- Units ----------
export type UnitKey = "km" | "mi" | "m" | "ft" | "nmi";
export const UNITS: Record<UnitKey, { label: string; perKm: number }> = {
  km: { label: "Kilometers", perKm: 1 },
  mi: { label: "Miles", perKm: 0.6213711922 },
  m: { label: "Meters", perKm: 1000 },
  ft: { label: "Feet", perKm: 3280.8399 },
  nmi: { label: "Nautical miles", perKm: 0.5399568035 },
};
export const kmTo = (km: number, u: UnitKey) => km * UNITS[u].perKm;
export const toKm = (v: number, u: UnitKey) => v / UNITS[u].perKm;

export function fmt(n: number, digits?: number) {
  if (!Number.isFinite(n)) return "—";
  const d = digits ?? (Math.abs(n) >= 100 ? 1 : Math.abs(n) >= 10 ? 2 : 3);
  return n.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: 0 });
}
export function fmtDist(km: number, u: UnitKey) {
  const v = kmTo(km, u);
  return `${fmt(v, u === "m" || u === "ft" ? 0 : undefined)} ${u}`;
}

export function fmtCoords(p: LatLng, digits = 5) {
  return `${p.lat.toFixed(digits)}, ${p.lng.toFixed(digits)}`;
}

// ---------- Parsing ----------
/** Parse "40.7128, -74.006" | "40.7128 -74.006" | "40.7128° N 74.006° W" etc. */
export function parseCoordPair(input: string): LatLng | null {
  const s = input.trim();
  if (!s) return null;
  const hemis = s.match(/([\d.\s°'-]+)\s*([NS])[\s,]+([\d.\s°'-]+)\s*([EW])/i);
  if (hemis) {
    const lat = dmsFragmentToDec(hemis[1]) * (hemis[2].toUpperCase() === "S" ? -1 : 1);
    const lng = dmsFragmentToDec(hemis[3]) * (hemis[4].toUpperCase() === "W" ? -1 : 1);
    if (isValidLat(lat) && isValidLng(lng)) return { lat, lng };
    return null;
  }
  const m = s.replace(/°/g, " ").match(/^(-?\d+(?:\.\d+)?)[\s,;]+(-?\d+(?:\.\d+)?)$/);
  if (m) {
    const lat = parseFloat(m[1]), lng = parseFloat(m[2]);
    if (isValidLat(lat) && isValidLng(lng)) return { lat, lng };
  }
  return null;
}

export function dmsFragmentToDec(s: string): number {
  const parts = s.trim().split(/[°'"dms\s]+/).filter(Boolean).map(parseFloat).filter(Number.isFinite);
  if (!parts.length) return NaN;
  const [d, mi = 0, sec = 0] = parts;
  return Math.abs(d) + mi / 60 + sec / 3600;
}

// ---------- Compass ----------
const COMPASS_16 = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
export function compassPoint(deg: number, points: 8 | 16 = 16) {
  const d = ((deg % 360) + 360) % 360;
  if (points === 8) return COMPASS_16[Math.round(d / 45) % 8 * 2];
  return COMPASS_16[Math.round(d / 22.5) % 16];
}

export function bboxOf(points: LatLng[]): [[number, number], [number, number]] {
  let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90;
  for (const p of points) {
    minLng = Math.min(minLng, p.lng); maxLng = Math.max(maxLng, p.lng);
    minLat = Math.min(minLat, p.lat); maxLat = Math.max(maxLat, p.lat);
  }
  return [[minLng, minLat], [maxLng, maxLat]];
}
