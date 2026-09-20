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
      ["Is my location stored or sent to a server?", "No. Your position comes from your browser's GPS/Wi-Fi positioning. We only call a public reverse geocoder to translate coordinates into an address, and nothing is saved."],
      ["Why is my position inaccurate?", "Accuracy depends on your device. GPS gives ~5–15 m outdoors; indoors the browser usually falls back to Wi-Fi or IP positioning."],
      ["What if I deny location permission?", "The tool stays blank. You can search for any place or click the map instead."],
    ],
    howTo: ["Press Use my location and allow access when asked.", "Read your coordinates and approximate address.", "Copy or share the link to keep the result."],
    related: ["what-county-am-i-in", "latitude-longitude-finder", "what-zip-code-am-i-in", "zip-codes-within-radius"],
  },
  {
    slug: "what-county-am-i-in",
    name: "What County Am I In?",
    short: "Instantly find which county your current location (or any point on the map) belongs to.",
    intro: "County boundaries don't follow street logic. This tool reverse-geocodes your position against OpenStreetMap boundary data and tells you the administrative county.",
    category: "location", scope: "Worldwide", component: "geocoder", props: { mode: "locate", focus: "county" },
    keywords: ["county", "county finder", "administrative boundary"],
    popular: true,
    faq: [
      ["Does this work outside the United States?", "Yes. Outside the US the equivalent unit is reported when available."],
      ["Can I check any point?", "Yes — click anywhere on the map or paste coordinates."],
    ],
    howTo: ["Press Use my location, or click any point on the map.", "Read the County field in the results card."],
    related: ["what-city-am-i-in", "what-state-am-i-in", "find-my-location"],
  },
  {
    slug: "what-city-am-i-in",
    name: "What City Am I In?",
    short: "Find the city, town or municipality for your current position or any point on the map.",
    intro: "Drop a pin and tells you the incorporated city or town using OpenStreetMap administrative data.",
    category: "location", scope: "Worldwide", component: "geocoder", props: { mode: "locate", focus: "city" },
    keywords: ["city", "town", "municipality", "where am i"],
    faq: [
      ["What happens in unincorporated areas?", "The county or district is shown when no city is available."],
    ],
    howTo: ["Press Use my location or click the map.", "Read the City field."],
    related: ["what-county-am-i-in", "find-my-location", "what-zip-code-am-i-in"],
  },
  {
    slug: "what-state-am-i-in",
    name: "What State Am I In?",
    short: "Find the US state or first-level region worldwide for any map point.",
    intro: "Resolves your position to its state or equivalent first-level region anywhere in the world.",
    category: "location", scope: "Worldwide", component: "geocoder", props: { mode: "locate", focus: "state" },
    keywords: ["state", "province", "region"],
    faq: [["Does it work outside the US?", "Yes — provinces and state-equivalents worldwide."]],
    howTo: ["Press Use my location or click the map.", "Read the State/Region field."],
    related: ["what-country-am-i-in", "what-county-am-i-in"],
  },
  {
    slug: "what-country-am-i-in",
    name: "What Country Am I In?",
    short: "Resolve any point to its sovereign country with ISO code.",
    intro: "Resolves any point to its country using OpenStreetMap boundary data.",
    category: "location", scope: "Worldwide", component: "geocoder", props: { mode: "locate", focus: "country" },
    keywords: ["country", "which country", "iso code"],
    faq: [["What about disputed territories?", "OpenStreetMap reflects de facto control for most boundaries."]],
    howTo: ["Press Use my location or click the map.", "Read the Country field."],
    related: ["what-state-am-i-in", "find-my-location"],
  },
  {
    slug: "what-zip-code-am-i-in",
    name: "What ZIP Code Am I In?",
    short: "Find the postal code for your current location. Best coverage in the US, postcodes worldwide.",
    intro: "Reverse-geocodes your position and reads the postcode from OpenStreetMap address data.",
    category: "location", scope: "US focused", component: "geocoder", props: { mode: "locate", focus: "postcode" },
    keywords: ["zip", "zip code", "postcode", "postal code"],
    faq: [
      ["Why is my ZIP missing?", "Some rural areas lack postcode tags in OpenStreetMap."],
      ["Non-US postcodes?", "Yes, wherever OSM has postcode data."],
    ],
    howTo: ["Press Use my location or click the map.", "Read the Postcode field."],
    related: ["zip-codes-within-radius", "what-city-am-i-in", "find-my-location"],
  },
  {
    slug: "zip-codes-within-radius",
    name: "ZIP Codes Within Radius",
    short: "Find every ZIP code or postal code inside a radius of any point — map, sorted list, and CSV export. Free, no sign-up.",
    intro: "Set a centre (search, GPS, or map click), choose a radius in miles or kilometres, and get postal codes that fall inside the circle. Results show place name, distance, bearing, and export as CSV. Powered by OpenStreetMap postcode data via Nominatim.",
    category: "population",
    scope: "Worldwide",
    component: "zipradius",
    keywords: [
      "zip codes within radius",
      "zip codes near me",
      "postal codes in radius",
      "find zip codes in area",
      "zip code radius search",
      "delivery zone zip codes",
    ],
    popular: true,
    faq: [
      ["Does this work outside the United States?", "Yes. The tool searches OpenStreetMap postcode data worldwide. US ZIP codes are well covered in cities; coverage elsewhere depends on OSM mapping."],
      ["Why are some ZIPs missing?", "Results depend on OpenStreetMap postcode tags. Rural zones may be sparse. Try a larger radius or denser centre."],
      ["Is this Census ZCTA boundaries?", "No. This lists postcodes found inside your radius, not formal ZCTA polygons."],
      ["Can I export the list?", "Yes — Download CSV includes zip, place, state, country, distance, bearing, and coordinates."],
      ["Is my search stored?", "No. Centre and radius stay in the URL for sharing; lookups go to Nominatim and are not stored by MapBench."],
    ],
    howTo: [
      "Set the centre: search an address or city, click the map, or paste coordinates.",
      "Choose Miles or Kilometers and set the radius (presets: 5, 10, 15, 25, 50).",
      "Press Find ZIP / postal codes.",
      "Review the map pins and sorted table; download CSV if needed.",
    ],
    related: ["what-zip-code-am-i-in", "map-radius", "cities-within-radius", "population-within-radius"],
    method: "Bounding-box query to OpenStreetMap Nominatim (postalcode=1), filtered to geodesic distance from the centre. Coverage follows OSM postcode completeness.",
  },
  {
    slug: "map-radius",
    name: "Map Radius Tool",
    short: "Draw a geodesic radius circle on the map — presets, area, perimeter, diameter, multi-circle and export.",
    intro: "Set a centre and radius to draw a true geodesic circle. Switch miles/kilometres, use presets, measure area and perimeter, add multiple circles, and export GeoJSON, KML or GPX.",
    category: "radius", scope: "Worldwide", component: "radius",
    keywords: ["radius map", "draw circle on map", "radius tool", "coverage circle"],
    popular: true,
    faq: [
      ["Is the circle accurate at high latitudes?", "Yes — geodesic calculation on the WGS84 ellipsoid, not a flat Mercator circle."],
      ["Can I add multiple circles?", "Yes on the multi-radius variant; use + Add circle."],
    ],
    howTo: ["Search or click to set the centre.", "Pick a preset or type a radius.", "Read area, perimeter and diameter.", "Export if needed."],
    related: ["zip-codes-within-radius", "drive-time-map", "map-area-calculator", "cities-within-radius"],
  },
  {
    slug: "drive-time-map",
    name: "Drive Time Map",
    short: "See how far you can drive, bike or walk in a set number of minutes — real road isochrones.",
    intro: "Pick a start point and time contours. The map shows reachable areas along real roads using the Valhalla routing engine — not a simple circle.",
    category: "routing", scope: "Worldwide", component: "drivetime",
    keywords: ["drive time map", "isochrone", "how far can I drive", "travel time map"],
    popular: true,
    faq: [
      ["Is this live traffic?", "No — free-flow estimates from road class and speed limits."],
      ["Which modes?", "Drive, bike and walk."],
    ],
    howTo: ["Set a starting point.", "Choose mode and time contours.", "Generate the reachable area."],
    related: ["map-radius", "driving-distance-calculator", "service-area-map"],
  },
  {
    slug: "distance-between-two-places",
    name: "Distance Between Two Places",
    short: "Great-circle distance, bearing and midpoint between any two places on Earth.",
    intro: "Search two places or click the map to measure straight-line distance with initial bearing and optional unit conversion.",
    category: "distance", scope: "Worldwide", component: "distance",
    keywords: ["distance between two places", "how far", "great circle distance"],
    popular: true,
    faq: [["Is this driving distance?", "No — straight-line (great-circle). Use the driving distance tool for road distance."]],
    howTo: ["Set From and To.", "Read distance and bearing.", "Switch units as needed."],
    related: ["crow-flies-distance", "bearing-calculator", "halfway-between-two-places"],
  },
  {
    slug: "map-area-calculator",
    name: "Map Area Calculator",
    short: "Draw a polygon on the map and get area in m², km², acres, hectares and more.",
    intro: "Click to place vertices, close the shape, and read geodesic area and perimeter in multiple units.",
    category: "radius", scope: "Worldwide", component: "area",
    keywords: ["area calculator", "measure area on map", "polygon area"],
    popular: true,
    faq: [["Is curvature accounted for?", "Yes — geodesic area on the ellipsoid."]],
    howTo: ["Click the map to add vertices.", "Close the shape.", "Read the area table and export if needed."],
    related: ["map-radius", "perimeter-calculator"],
  },
  {
    slug: "latitude-longitude-finder",
    name: "Latitude & Longitude Finder",
    short: "Find coordinates of any place — decimal, DMS, UTM, MGRS and Plus Code.",
    intro: "Search, click the map, or drag the pin. Every common coordinate format updates live with one-click copy.",
    category: "coordinates", scope: "Worldwide", component: "latlong",
    keywords: ["latitude longitude", "gps coordinates", "find coordinates"],
    popular: true,
    faq: [["Which datum?", "WGS84 — the same system used by GPS."]],
    howTo: ["Search a place or click the map.", "Copy the format you need."],
    related: ["coordinate-converter", "reverse-geocoder", "find-my-location"],
  },
  {
    slug: "cities-within-radius",
    name: "Cities Within Radius",
    short: "List major world cities within any radius of a point, sorted by distance — with CSV export.",
    intro: "Set a centre and radius to list major cities from our curated dataset with distance, bearing and population.",
    category: "population", scope: "Major cities", component: "cities", props: { mode: "cities" },
    keywords: ["cities in radius", "cities near me"],
    faq: [["Which cities?", "A curated set of 200+ major cities and capitals."]],
    howTo: ["Set the centre and radius.", "Read the sorted list.", "Export CSV."],
    related: ["zip-codes-within-radius", "population-within-radius", "map-radius"],
  },
  {
    slug: "population-within-radius",
    name: "Population Within Radius",
    short: "Estimate population inside a radius from major-city data — transparent and labelled as an estimate.",
    intro: "Sums populations of major cities inside your radius and shows which cities contributed.",
    category: "population", scope: "Major cities", component: "cities", props: { mode: "population" },
    keywords: ["population in radius", "catchment population"],
    faq: [["Is this a census count?", "No — a sum of curated major-city populations, labelled as an estimate."]],
    howTo: ["Set centre and radius.", "Read the total and contributing cities."],
    related: ["cities-within-radius", "zip-codes-within-radius", "map-radius"],
  },
  {
    slug: "elevation-finder",
    name: "Elevation Finder",
    short: "Get elevation above sea level for any point on Earth.",
    intro: "Click the map or search a place to read elevation from open terrain data.",
    category: "earth", scope: "Worldwide", component: "elevation",
    keywords: ["elevation", "altitude", "height above sea level"],
    faq: [["How accurate?", "Depends on the DEM resolution — planning-grade, not survey-grade."]],
    howTo: ["Search or click a point.", "Read elevation in metres and feet."],
    related: ["elevation-profile", "horizon-distance-calculator"],
  },
  {
    slug: "bearing-calculator",
    name: "Bearing Calculator",
    short: "Compass bearing between two points — initial, final and cardinal direction.",
    intro: "Set two points to get initial bearing, reverse bearing and compass point.",
    category: "distance", scope: "Worldwide", component: "bearing",
    keywords: ["bearing", "compass direction", "heading"],
    faq: [["True or magnetic?", "True north bearings from the great-circle path."]],
    howTo: ["Set start and end points.", "Read bearing and distance."],
    related: ["distance-between-two-places", "compass-calculator"],
  },
  {
    slug: "reverse-geocoder",
    name: "Reverse Geocoder",
    short: "Turn latitude and longitude into a structured address.",
    intro: "Paste coordinates or click the map to get road, city, region, postcode and country.",
    category: "location", scope: "Worldwide", component: "geocoder", props: { mode: "reverse" },
    keywords: ["reverse geocoding", "coordinates to address"],
    popular: true,
    faq: [["Which service?", "OpenStreetMap Nominatim."]],
    howTo: ["Enter coordinates or click the map.", "Copy the fields you need."],
    related: ["latitude-longitude-finder", "find-my-location"],
  },
  {
    slug: "ip-address-lookup",
    name: "IP Address Lookup",
    short: "Look up approximate location, ISP and network details for a public IP.",
    intro: "Enter an IP or use your public IP to see network geolocation and organisation details.",
    category: "network", scope: "Worldwide", component: "iplookup",
    keywords: ["ip lookup", "ip geolocation", "what is my ip"],
    faq: [["Is IP location exact?", "No — it reflects the network exit, not a street address."]],
    howTo: ["Enter an IP or detect yours.", "Read city, region, country and org."],
    related: ["what-is-my-public-ip", "find-my-location"],
  },
];

export const toolBySlug = new Map(TOOLS.map((t) => [t.slug, t]));
export const popularTools = TOOLS.filter((t) => t.popular);
export const toolsByCategory = (id: CategoryId) => TOOLS.filter((t) => t.category === id);

export const STATIC_LINKS = [
  { href: "/about", name: "About", keywords: ["about"] },
  { href: "/methodology", name: "Methodology", keywords: ["methodology", "accuracy"] },
  { href: "/data-sources", name: "Data Sources", keywords: ["data", "attribution", "sources"] },
  { href: "/privacy", name: "Privacy", keywords: ["privacy"] },
  { href: "/contact", name: "Contact", keywords: ["contact"] },
];
