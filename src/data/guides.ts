// Editorial guides — genuinely useful reference content, no filler.

export type GuideBlock =
  | { t: "h2"; text: string }
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "note"; text: string }
  | { t: "toolbox"; slugs: string[] };

export interface Guide {
  slug: string;
  title: string;
  description: string;
  date: string;
  readMins: number;
  blocks: GuideBlock[];
}

export const GUIDES: Guide[] = [
  {
    slug: "understanding-gps-coordinates",
    title: "Understanding GPS Coordinates: Formats, Datums and Precision",
    description: "A practical guide to latitude/longitude: what decimal degrees and DMS really mean, why datums matter, and how many decimal places you actually need.",
    date: "2025-11-04",
    readMins: 7,
    blocks: [
      { t: "p", text: "Every point on Earth can be described with two angles: latitude (north–south of the Equator) and longitude (east–west of the Prime Meridian). That sounds simple, but coordinates show up in several notations, and mixing them up is the most common source of 'my marker is in the ocean' bugs." },
      { t: "h2", text: "Decimal degrees vs. DMS" },
      { t: "p", text: "Decimal degrees (DD) write the angle as a single number: 40.7128, −74.0060. Degrees-minutes-seconds (DMS) splits each degree into 60 minutes and each minute into 60 seconds: 40°42'46\"N, 74°00'22\"W. Both describe exactly the same point. Software almost always wants DD; charts, legal descriptions and older GPS units often speak DMS." },
      { t: "ul", items: [
        "Negative latitude = south of the Equator; negative longitude = west of Greenwich.",
        "DMS hemisphere letters (N/S/E/W) carry the sign — never use both a minus and a letter.",
        "Beware of 'degrees and decimal minutes' (40°42.768'), a third format common in aviation and marine GPS.",
      ] },
      { t: "h2", text: "How precise is precise?" },
      { t: "p", text: "One degree of latitude is about 111 km everywhere. That gives a useful rule of thumb for decimal places:" },
      { t: "ul", items: [
        "3 decimals ≈ 111 m — fine for a neighbourhood",
        "4 decimals ≈ 11 m — a building",
        "5 decimals ≈ 1.1 m — survey-grade for everyday purposes",
        "6 decimals ≈ 0.11 m — beyond what consumer GPS can measure",
      ] },
      { t: "note", text: "Longitudes shrink with latitude: at 60°N a degree of longitude is only ~55 km. Precision in metres therefore depends on where you are, not just on how many decimals you keep." },
      { t: "h2", text: "Datums: WGS84 is not the only one" },
      { t: "p", text: "A datum defines the exact shape model of the Earth the coordinates refer to. GPS speaks WGS84, and so do web maps, GeoJSON, and this site. Older North American data may be NAD27 or NAD83 — the same physical point can differ by tens of metres between datums. If coordinates from an old survey disagree with your GPS by a consistent offset, a datum mismatch is the usual suspect." },
      { t: "h2", text: "Practical checklist" },
      { t: "ul", items: [
        "Always store coordinates in decimal degrees with 6 decimals in databases.",
        "Validate ranges: latitude −90…90, longitude −180…180.",
        "Watch for swapped lat/lng — GeoJSON uses [lng, lat] order, most APIs use (lat, lng).",
        "When copying from Google Maps, the right-click coordinates are already decimal degrees in lat,lng order.",
      ] },
      { t: "toolbox", slugs: ["latitude-longitude-finder", "coordinate-converter", "gps-coordinate-lookup", "dms-to-decimal"] },
    ],
  },
  {
    slug: "kml-vs-geojson-vs-gpx",
    title: "KML vs. GeoJSON vs. GPX: Choosing the Right Map File Format",
    description: "The practical differences between the three most common geographic file formats — when to use each, what they lose in conversion, and how to move between them.",
    date: "2025-10-12",
    readMins: 6,
    blocks: [
      { t: "p", text: "Three formats dominate consumer geographic data: KML from the Google Earth era, GeoJSON from the web-mapping world, and GPX from GPS devices. All three can carry points, lines and polygons — but they differ in what metadata survives, how they parse, and where they're welcomed." },
      { t: "h2", text: "GeoJSON — the developer's default" },
      { t: "ul", items: [
        "Plain JSON: trivial to parse, diff and version-control.",
        "Native to MapLibre, Leaflet, Mapbox, deck.gl and most web GIS.",
        "Properties are free-form key/value — great for data-driven styling.",
        "No official coordinate reference system field: it's WGS84 by convention.",
      ] },
      { t: "h2", text: "KML — the Google ecosystem format" },
      { t: "ul", items: [
        "XML-based; the native format of Google Earth and My Maps exports.",
        "Supports styling, folders, ground overlays and time spans.",
        "KMZ is simply a zipped KML (often with images).",
        "Parsing is heavier and quirks like ExtendedData take care.",
      ] },
      { t: "h2", text: "GPX — built for tracks" },
      { t: "ul", items: [
        "The universal exchange format of GPS devices: Strava, Garmin, Komoot, drones.",
        "Three structures: waypoints (wpt), tracks (trk) and routes (rte).",
        "Per-point elevation and timestamps are first-class.",
        "No polygons — GPX is not the format for areas.",
      ] },
      { t: "h2", text: "What conversion loses" },
      { t: "p", text: "GeoJSON → GPX keeps points as waypoints and lines as tracks, but polygons degrade to boundary tracks and arbitrary properties are dropped. KML → GeoJSON keeps geometry and ExtendedData but usually drops visual styling. GPX → GeoJSON is essentially lossless for geometry, and preserves elevation as a third coordinate. When in doubt, keep an original copy of the source file." },
      { t: "note", text: "Rule of thumb: analysis and web maps → GeoJSON; GPS devices and sport apps → GPX; Google Earth workflows and styled presentation maps → KML." },
      { t: "toolbox", slugs: ["geojson-viewer", "kml-viewer", "gpx-viewer", "csv-to-map"] },
    ],
  },
  {
    slug: "how-distance-calculation-works",
    title: "How Distance Calculation Works: Haversine, Geodesics and When It Matters",
    description: "Why flat-Earth math fails past a few kilometres, what the haversine formula does, and how big the difference to a full ellipsoidal geodesic really is.",
    date: "2025-09-20",
    readMins: 6,
    blocks: [
      { t: "p", text: "The shortest path between two points on the Earth's surface is not a straight line on a flat map — it's an arc of a great circle. Any tool that measures real distances has to respect the planet's curvature." },
      { t: "h2", text: "The haversine formula" },
      { t: "p", text: "Haversine treats the Earth as a sphere with the mean radius 6371.0088 km and computes the central angle between two points from their latitudes and the longitude difference. It's numerically stable even for tiny distances and is the workhorse of virtually every quick distance tool on the web — including ours." },
      { t: "h2", text: "The ellipsoidal truth" },
      { t: "p", text: "The Earth isn't a sphere: it's flattened at the poles by about 21 km. Geodesics on the WGS84 ellipsoid (computed by Vincenty's or Karney's algorithms) are the reference answer. The sphere-vs-ellipsoid error is bounded by the flattening — at most about 0.3%, and usually far less on typical routes. For a 1000 km trip that's under 3 km; for a city commute it's centimetres." },
      { t: "h2", text: "When the difference matters" },
      { t: "ul", items: [
        "Surveying, legal boundaries and engineering: use an ellipsoidal library (e.g. GeographicLib) and the correct CRS.",
        "Navigation and aviation: great-circle math is exactly what they use, plus winds and airspace.",
        "Web tools, logistics estimates, data analysis: haversine on WGS84 is well within the noise of the question.",
      ] },
      { t: "note", text: "One thing never to do for global distances: Pythagoras on raw lat/lng. A flat approximation is only acceptable within a few kilometres of a single point, and even then longitude must be scaled by cos(latitude)." },
      { t: "p", text: "Areas deserve the same care. Our polygon tool uses the spherical-excess method, which integrates around the boundary on the sphere — robust from garden plots up to country-sized shapes." },
      { t: "toolbox", slugs: ["distance-between-two-places", "great-circle-calculator", "map-area-calculator", "crow-flies-distance"] },
    ],
  },
];

export const guideBySlug = new Map(GUIDES.map((g) => [g.slug, g]));
