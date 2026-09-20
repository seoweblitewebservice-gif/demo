// Central tool registry — metadata for every tool page.
export type CategoryId =
  | "location" | "distance" | "radius" | "routing" | "coordinates"
  | "files" | "creation" | "earth" | "sun" | "lines" | "population" | "network";

export interface CategoryDef {
  id: CategoryId; label: string; short: string; tone: string;
}

export const CATEGORIES: CategoryDef[] = [
  { id: "location", label: "Location", short: "Find out where you are — county, city, state, ZIP, country and addresses.", tone: "#1d6e63" },
  { id: "distance", label: "Distance & Bearing", short: "Measure distances, bearings and midpoints between any two places on Earth.", tone: "#b45309" },
  { id: "routing", label: "Routing & Travel Time", short: "Real road routes, travel times, multi-stop planning and drive-time areas.", tone: "#9d174d" },
  { id: "radius", label: "Radius & Area", short: "Draw radii, rings and polygons; measure areas in any unit.", tone: "#4d7c0f" },
  { id: "coordinates", label: "Coordinates", short: "Find, convert and validate GPS coordinates in every common format.", tone: "#0e7490" },
  { id: "files", label: "Map Files", short: "View, validate and convert KML, GeoJSON, GPX and CSV — right in the browser.", tone: "#6d28d9" },
  { id: "creation", label: "Map Creation", short: "Drop pins, label places and export your own custom maps.", tone: "#c2410c" },
  { id: "earth", label: "Earth Science", short: "Elevation, horizon distance, antipodes and other planetary calculators.", tone: "#155e75" },
  { id: "sun", label: "Sun & Moon", short: "Sunrise, sunset, day length and lunar phases for any place and date.", tone: "#a16207" },
  { id: "lines", label: "Geographic Lines", short: "Explore the Equator, meridians, tropics and polar circles on a live map.", tone: "#334155" },
  { id: "population", label: "Places & Population", short: "Find cities and ZIP codes inside a radius and estimate population.", tone: "#7c2d12" },
  { id: "network", label: "IP & Network", short: "Look up public IP addresses, geolocation, ISP, ASN and network details.", tone: "#475569" },
];

export interface ToolDef {
  slug: string;
  name: string;
  short: string;
  intro: string;
  category: CategoryId;
  scope: "Worldwide" | "US focused" | "Major cities" | "Major airports";
  component: string;
  props?: Record<string, unknown>;
  keywords: string[];
  popular?: boolean;
  faq: [string, string][];
  howTo: string[];
  related: string[];
  method?: string;
}

export const TOOLS: ToolDef[] = [
  {
    slug: "find-my-location",
    name: "Find My Location",
    short: "See your current position on the map with live coordinates and the nearest address — processed by your browser.",
    intro: "Click one button to drop a pin exactly where you are. Your browser shares your GPS position with this page only; nothing is uploaded or stored.",
    category: "location", scope: "Worldwide", component: "geocoder", props: { mode: "locate" },
    keywords: ["gps", "where am i", "current position", "my location"],
    popular: true,
    faq: [
      ["Is my location stored or sent to a server?", "No. Position comes from your browser GPS/Wi-Fi. Only a public reverse geocoder is called; nothing is saved."],
      ["Why is my position inaccurate?", "GPS is ~5–15 m outdoors; indoors may fall back to Wi-Fi or IP."],
      ["What if I deny permission?", "Search or click the map instead — every feature still works."],
    ],
    howTo: ["Press Use my location and allow access.", "Read coordinates and address.", "Copy or share the link."],
    related: ["what-county-am-i-in", "latitude-longitude-finder", "what-zip-code-am-i-in", "zip-codes-within-radius"],
  },
  {
    slug: "what-county-am-i-in",
    name: "What County Am I In?",
    short: "Instantly find which county your current location or any map point belongs to.",
    intro: "Reverse-geocodes your position against OpenStreetMap boundary data and reports the administrative county.",
    category: "location", scope: "Worldwide", component: "geocoder", props: { mode: "locate", focus: "county" },
    keywords: ["county", "county finder"],
    popular: true,
    faq: [
      ["Outside the US?", "Yes — equivalent administrative units when available."],
      ["Any point?", "Yes — click the map or paste coordinates."],
    ],
    howTo: ["Use my location or click the map.", "Read the County field."],
    related: ["what-city-am-i-in", "what-state-am-i-in", "find-my-location"],
  },
  {
    slug: "what-city-am-i-in",
    name: "What City Am I In?",
    short: "Find the city, town or municipality for your position or any map point.",
    intro: "Identifies the city or town using OpenStreetMap administrative data.",
    category: "location", scope: "Worldwide", component: "geocoder", props: { mode: "locate", focus: "city" },
    keywords: ["city", "town", "municipality"],
    faq: [["Unincorporated areas?", "County or district is shown when no city exists."]],
    howTo: ["Use my location or click the map.", "Read the City field."],
    related: ["what-county-am-i-in", "what-zip-code-am-i-in", "find-my-location"],
  },
  {
    slug: "what-state-am-i-in",
    name: "What State Am I In?",
    short: "Find the US state or first-level region worldwide for any point.",
    intro: "Resolves any point to its state or equivalent first-level region.",
    category: "location", scope: "Worldwide", component: "geocoder", props: { mode: "locate", focus: "state" },
    keywords: ["state", "province", "region"],
    faq: [["Outside the US?", "Yes — provinces and state-equivalents worldwide."]],
    howTo: ["Use my location or click the map.", "Read the State/Region field."],
    related: ["what-country-am-i-in", "what-county-am-i-in"],
  },
  {
    slug: "what-country-am-i-in",
    name: "What Country Am I In?",
    short: "Resolve any point to its sovereign country with ISO code.",
    intro: "Uses OpenStreetMap boundary data to identify the country.",
    category: "location", scope: "Worldwide", component: "geocoder", props: { mode: "locate", focus: "country" },
    keywords: ["country", "iso code"],
    faq: [["Disputed territories?", "OSM reflects de facto control for most boundaries."]],
    howTo: ["Use my location or click the map.", "Read the Country field."],
    related: ["what-state-am-i-in", "find-my-location"],
  },
  {
    slug: "what-zip-code-am-i-in",
    name: "What ZIP Code Am I In?",
    short: "Find the postal code for your location. Strong US coverage; postcodes worldwide.",
    intro: "Reads the postcode from OpenStreetMap address data for your point.",
    category: "location", scope: "US focused", component: "geocoder", props: { mode: "locate", focus: "postcode" },
    keywords: ["zip", "zip code", "postcode"],
    faq: [
      ["Missing ZIP?", "Some rural areas lack postcode tags in OSM."],
      ["Non-US?", "Yes where OSM has postcode data."],
    ],
    howTo: ["Use my location or click the map.", "Read the Postcode field."],
    related: ["zip-codes-within-radius", "what-city-am-i-in", "find-my-location"],
  },
  {
    slug: "zip-codes-within-radius",
    name: "ZIP Codes Within Radius",
    short: "Find every ZIP or postal code inside a radius — map, sorted list, CSV export. Free, no sign-up.",
    intro: "Set a centre, choose a radius in miles or kilometres, and list postal codes inside the circle with distance, bearing and CSV export. Powered by OpenStreetMap via Nominatim.",
    category: "population", scope: "Worldwide", component: "zipradius",
    keywords: ["zip codes within radius", "zip codes near me", "postal codes in radius", "delivery zone zip codes"],
    popular: true,
    faq: [
      ["Outside the US?", "Yes — OSM postcode data worldwide; densest in cities."],
      ["Some ZIPs missing?", "Depends on OSM coverage. Try a larger radius."],
      ["Census ZCTA?", "No — postcodes found in the radius, not formal ZCTA polygons."],
      ["Export?", "Yes — CSV with zip, place, distance, bearing, coordinates."],
      ["Stored?", "No. URL holds centre/radius; lookups are not stored by MapBench."],
    ],
    howTo: [
      "Set the centre via search or map click.",
      "Choose Miles or Kilometers and a radius (presets 5–50).",
      "Press Find ZIP / postal codes.",
      "Review the map and table; download CSV if needed.",
    ],
    related: ["what-zip-code-am-i-in", "map-radius", "cities-within-radius", "population-within-radius"],
    method: "Nominatim postalcode query in the radius bounding box, filtered by geodesic distance.",
  },
  {
    slug: "map-radius",
    name: "Map Radius Tool",
    short: "Draw a geodesic radius circle — presets, area, perimeter, diameter, multi-circle, export.",
    intro: "True geodesic circles with unit toggle, presets, stats and GeoJSON/KML/GPX export.",
    category: "radius", scope: "Worldwide", component: "radius",
    keywords: ["radius map", "draw circle on map", "coverage circle"],
    popular: true,
    faq: [
      ["Accurate at high latitudes?", "Yes — WGS84 geodesic, not flat Mercator."],
      ["Multiple circles?", "Yes on multi-radius mode."],
    ],
    howTo: ["Set the centre.", "Pick a preset or type a radius.", "Read area, perimeter, diameter.", "Export if needed."],
    related: ["zip-codes-within-radius", "drive-time-map", "map-area-calculator"],
  },
  {
    slug: "drive-time-map",
    name: "Drive Time Map",
    short: "How far you can drive, bike or walk in set minutes — real road isochrones.",
    intro: "Reachable areas along real roads via Valhalla — Drive, Bike, Walk, multi time contours.",
    category: "routing", scope: "Worldwide", component: "drivetime",
    keywords: ["drive time map", "isochrone", "travel time map"],
    popular: true,
    faq: [
      ["Live traffic?", "No — free-flow estimates."],
      ["Modes?", "Drive, bike, walk."],
    ],
    howTo: ["Set start point.", "Choose mode and times.", "Generate reachable area."],
    related: ["map-radius", "service-area-map"],
  },
  {
    slug: "distance-between-two-places",
    name: "Distance Between Two Places",
    short: "Great-circle distance, bearing and midpoint between any two places.",
    intro: "Straight-line distance with initial bearing and unit conversion.",
    category: "distance", scope: "Worldwide", component: "distance",
    keywords: ["distance between two places", "how far", "great circle"],
    popular: true,
    faq: [["Driving distance?", "No — straight-line. Use driving distance tool for roads."]],
    howTo: ["Set From and To.", "Read distance and bearing."],
    related: ["bearing-calculator", "halfway-between-two-places"],
  },
  {
    slug: "map-area-calculator",
    name: "Map Area Calculator",
    short: "Draw a polygon and get area in m², km², acres, hectares and more.",
    intro: "Click vertices, close the shape, read geodesic area and perimeter.",
    category: "radius", scope: "Worldwide", component: "area",
    keywords: ["area calculator", "measure area on map"],
    popular: true,
    faq: [["Curvature?", "Yes — geodesic area on the ellipsoid."]],
    howTo: ["Click to add vertices.", "Close the shape.", "Read the area table."],
    related: ["map-radius", "perimeter-calculator"],
  },
  {
    slug: "latitude-longitude-finder",
    name: "Latitude & Longitude Finder",
    short: "Coordinates of any place — decimal, DMS, UTM, MGRS, Plus Code.",
    intro: "Search, click or drag. All formats update live with one-click copy.",
    category: "coordinates", scope: "Worldwide", component: "latlong",
    keywords: ["latitude longitude", "gps coordinates"],
    popular: true,
    faq: [["Datum?", "WGS84 — same as GPS."]],
    howTo: ["Search or click the map.", "Copy the format you need."],
    related: ["reverse-geocoder", "find-my-location"],
  },
  {
    slug: "cities-within-radius",
    name: "Cities Within Radius",
    short: "Major world cities within a radius, sorted by distance — CSV export.",
    intro: "Lists curated major cities inside your radius with distance, bearing and population.",
    category: "population", scope: "Major cities", component: "cities", props: { mode: "cities" },
    keywords: ["cities in radius", "cities near me"],
    faq: [["Which cities?", "200+ major cities and capitals."]],
    howTo: ["Set centre and radius.", "Read the list.", "Export CSV."],
    related: ["zip-codes-within-radius", "population-within-radius", "map-radius"],
  },
  {
    slug: "population-within-radius",
    name: "Population Within Radius",
    short: "Estimate population in a radius from major-city data — transparent estimate.",
    intro: "Sums major-city populations inside the radius and shows contributors.",
    category: "population", scope: "Major cities", component: "cities", props: { mode: "population" },
    keywords: ["population in radius", "catchment population"],
    faq: [["Census count?", "No — labelled estimate from major cities only."]],
    howTo: ["Set centre and radius.", "Read total and cities."],
    related: ["cities-within-radius", "zip-codes-within-radius"],
  },
  {
    slug: "elevation-finder",
    name: "Elevation Finder",
    short: "Elevation above sea level for any point on Earth.",
    intro: "Click or search to read elevation from open terrain data.",
    category: "earth", scope: "Worldwide", component: "elevation",
    keywords: ["elevation", "altitude"],
    faq: [["Accuracy?", "Planning-grade DEM, not survey-grade."]],
    howTo: ["Search or click.", "Read elevation in m and ft."],
    related: ["elevation-profile", "horizon-distance-calculator"],
  },
  {
    slug: "bearing-calculator",
    name: "Bearing Calculator",
    short: "Compass bearing between two points — initial, final, cardinal.",
    intro: "Great-circle initial and reverse bearings between two points.",
    category: "distance", scope: "Worldwide", component: "bearing",
    keywords: ["bearing", "compass direction"],
    faq: [["True or magnetic?", "True north from the great-circle path."]],
    howTo: ["Set start and end.", "Read bearing and distance."],
    related: ["distance-between-two-places"],
  },
  {
    slug: "reverse-geocoder",
    name: "Reverse Geocoder",
    short: "Turn coordinates into a structured address.",
    intro: "Paste coordinates or click the map for road, city, region, postcode, country.",
    category: "location", scope: "Worldwide", component: "geocoder", props: { mode: "reverse" },
    keywords: ["reverse geocoding", "coordinates to address"],
    popular: true,
    faq: [["Service?", "OpenStreetMap Nominatim."]],
    howTo: ["Enter coordinates or click map.", "Copy fields."],
    related: ["latitude-longitude-finder", "find-my-location"],
  },
  {
    slug: "ip-address-lookup",
    name: "IP Address Lookup",
    short: "Approximate location, ISP and network details for a public IP.",
    intro: "Enter an IP or detect yours for network geolocation details.",
    category: "network", scope: "Worldwide", component: "iplookup",
    keywords: ["ip lookup", "ip geolocation"],
    faq: [["Exact location?", "No — network exit, not street address."]],
    howTo: ["Enter IP or detect yours.", "Read city, region, country, org."],
    related: ["find-my-location"],
  },
];

export const toolBySlug = new Map(TOOLS.map((t) => [t.slug, t]));
export const popularTools = TOOLS.filter((t) => t.popular);
export const toolsByCategory = (id: CategoryId) => TOOLS.filter((t) => t.category === id);

export const STATIC_LINKS = [
  { href: "/", name: "Home", keywords: ["home"] },
  { href: "/tools", name: "All Tools", keywords: ["directory", "all tools"] },
  { href: "/about", name: "About", keywords: ["about"] },
  { href: "/methodology", name: "Methodology", keywords: ["methodology"] },
  { href: "/data-sources", name: "Data Sources", keywords: ["data", "sources"] },
  { href: "/privacy", name: "Privacy", keywords: ["privacy"] },
  { href: "/contact", name: "Contact", keywords: ["contact"] },
];
