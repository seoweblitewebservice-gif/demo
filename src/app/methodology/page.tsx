import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology — How MapBench Calculates",
  description: "The formulas and algorithms behind MapBench: haversine distances, spherical-excess areas, NOAA solar times, UTM/MGRS conversions and elevation line-of-sight checks.",
  alternates: { canonical: "/methodology" },
};

const METHODS = [
  ["Distance (haversine)", "Great-circle distance on the WGS84 mean sphere (R = 6371.0088 km). Error vs. the ellipsoidal geodesic ≤ ~0.3%.", "distance-between-two-places"],
  ["Bearing", "Initial great-circle bearing via atan2(sin Δλ·cos φ₂, cos φ₁·sin φ₂ − sin φ₁·cos φ₂·cos Δλ), clockwise from true north. Back-bearing computed independently, not ±180°.", "bearing-calculator"],
  ["Midpoint", "Spherical midpoint of the great-circle arc — correct across hemispheres and the date line, unlike naive coordinate averaging.", "halfway-between-two-places"],
  ["Polygon area", "Spherical-excess integration over the boundary (equivalent to the standard geodesic area approximation). Accurate to well under 1% for real-world plots; handles high latitudes.", "map-area-calculator"],
  ["Radius circles", "128-vertex boundaries, each vertex placed by spherical destination-point projection, so circles stay true at any latitude.", "map-radius"],
  ["Routing & travel time", "FOSSGIS Valhalla on OpenStreetMap roads (auto/pedestrian/bicycle costing), OSRM fallback for driving. Durations are free-flow estimates — never presented as live traffic.", "driving-distance-calculator"],
  ["Isochrones", "Valhalla's routing-engine isochrone polygons: genuinely network-derived reachable areas, not buffers.", "drive-time-map"],
  ["Stop optimisation", "Valhalla's optimize endpoint (TSP heuristic) with the first stop fixed as origin.", "best-route-order"],
  ["Coordinates", "Full WGS84 UTM series expansions including the Norway/Svalbard zone exceptions; standard MGRS band/grid letters; Open Location Code (Plus Code) encode/decode.", "coordinate-converter"],
  ["Sun & moon", "NOAA solar position algorithm (±1 min for modern decades) with the standard 90.833° sunrise zenith for refraction; lunar phase from synodic-month age.", "sunrise-sunset-calculator"],
  ["Elevation", "Open-Meteo elevation API on the Copernicus GLO-90 DEM (~90 m). Profiles use 60 great-circle samples; line-of-sight adds Earth bulge x(D−x)/(2R′) with refraction k = 0.13.", "line-of-sight-calculator"],
  ["Population in radius", "Sum of curated major-city populations (≈2020 vintage, municipal figures). Published as a transparent estimate with the contributing city list, never as a census count.", "population-within-radius"],
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl font-bold tracking-tight">Methodology</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">
        Every number MapBench shows you has a documented recipe. This page lists them — and their honest limits.
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="tbl min-w-[640px]">
          <thead><tr><th>Calculation</th><th>Method & accuracy</th><th>Tool</th></tr></thead>
          <tbody>
            {METHODS.map(([name, desc, slug]) => (
              <tr key={name}>
                <td className="whitespace-nowrap font-semibold">{name}</td>
                <td className="text-mute">{desc}</td>
                <td><Link href={`/tools/${slug}`} className="whitespace-nowrap font-bold text-brand-strong hover:underline">Open →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="prose-sf mt-8">
        <h2>Known limitations</h2>
        <ul>
          <li>The haversine sphere differs from the WGS84 ellipsoid by up to ~0.3%. Survey-grade work needs ellipsoidal geodesics and a defined CRS.</li>
          <li>Free routing servers return free-flow travel times; congestion is not modelled.</li>
          <li>The 90 m elevation DEM cannot see buildings or tree cover — line-of-sight results are terrain-only.</li>
          <li>Curated population datasets lag behind real growth; vintages are always labelled.</li>
        </ul>
        <p>
          If you find a case where a result disagrees with a trusted reference by more than the stated tolerance, that's a bug we want to hear about — reproduction steps (coordinates in, values out) make it fixable.
        </p>
      </div>
    </div>
  );
}
