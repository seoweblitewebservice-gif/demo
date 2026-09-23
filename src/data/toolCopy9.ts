import type { ToolCopy } from "./toolCopy";

/** Long-form copy for secondary + Tier-A tools. */
export const COPY9: Record<string, ToolCopy> = {
  "lot-size-calculator": {
    h2: "Lot size on a map is a planning figure",
    paras: [
      "Buyers, gardeners, and small developers often need a quick sense of how large a parcel is before they walk the boundary with a surveyor. Drawing the corners on a map and reading acres or square metres answers that first question in seconds.",
      "Map-based area is only as good as the outline you draw and the imagery underneath. Fences, easements, and recorded plats can differ from what a satellite tile suggests. Treat the number as a check against the listing — not as a substitute for a professional survey when money or permits are involved.",
      "If you already have a polygon in GeoJSON, the area calculator and file viewers help you verify the same figure from a file instead of clicking vertex by vertex.",
    ],
  },
  "qibla-direction-finder": {
    h2: "Qibla is a bearing to a fixed point",
    paras: [
      "Muslims face the Kaaba in Makkah for prayer. On a globe that direction is the initial great-circle bearing from your coordinates to the Kaaba — not a flat compass line drawn on a paper map that ignores Earth’s curvature.",
      "True bearing and magnetic compass headings differ by local declination. If you use a magnetic needle, combine this result with a declination value for your city. Phone compass apps vary in quality; a map bearing remains a useful cross-check.",
      "Search for the Kaaba or enter approximately 21.4225°N, 39.8262°E as the destination, with your location as the start. The initial bearing is the Qibla along the short arc.",
    ],
  },
  "shadow-length-calculator": {
    h2: "Shadows follow the sun’s elevation",
    paras: [
      "When the sun is high, shadows shrink; near sunrise and sunset they stretch. For a vertical object on flat ground, length is roughly height divided by the tangent of solar elevation.",
      "Photographers use this to anticipate whether a building or tree will throw shade across a subject. Site planners use it for rough massing studies. Terrain slope and nearby walls still win over pure trigonometry outdoors.",
      "Pair solar position with sunrise and golden-hour tools when the time of day matters as much as the angle.",
    ],
  },
  "travel-time-estimator": {
    h2: "ETA without live traffic",
    paras: [
      "A travel-time estimate answers ‘about how long will this drive take in ordinary conditions?’ It follows the road network and typical speeds, not the congestion of this exact minute.",
      "Use it to compare corridors, plan departures with a buffer, or size a service radius in time rather than kilometres. For ‘how far can I go in 30 minutes’ shapes, switch to the drive-time map.",
    ],
  },
  "acreage-map-calculator": {
    h2: "Acres from a drawn boundary",
    paras: [
      "Field acreage searches are common before lease talks, seed orders, or conservation paperwork. Drawing the fence line on the map yields acres and hectares without specialised GIS software.",
      "Curved river banks and irregular woodlots need enough vertices to follow the edge. When the shape is saved as a file, re-open it later in the GeoJSON viewer to confirm nothing shifted.",
    ],
  },
  "antipode-finder": {
    h2: "The farthest point on Earth",
    paras: [
      "Your antipode sits opposite you through the planet’s centre. Latitude flips sign; longitude shifts by 180°. Most land antipodes fall in ocean, which is why the result often looks like open water.",
      "Teachers use antipodes to make globe geometry concrete. Travellers use them as a curiosity — the map pin is the honest answer, not a guarantee of a city on the far side.",
    ],
  },
  "horizon-distance": {
    h2: "Geometry of the visible horizon",
    paras: [
      "From eye height above a smooth sphere, the geometric horizon sits at a distance that grows with the square root of height. A beach walker sees a few kilometres; a cliff or tower extends that range.",
      "Real views hit hills, haze, and buildings first. Use the figure for radio line-of-sight sketches and teaching — not as a promise of what your camera will resolve on a humid day.",
    ],
  },
  "plus-code-finder": {
    h2: "Addresses where streets are thin",
    paras: [
      "Plus Codes (Open Location Codes) label small areas with short codes so deliveries and emergency services can find places without formal street names.",
      "They are open and different from proprietary word-based systems. Encode a pin when you share a meeting spot; decode a code when someone sends you one.",
    ],
  },
  "utm-converter": {
    h2: "UTM for local metric grids",
    paras: [
      "Universal Transverse Mercator divides the world into zones with eastings and northings in metres — convenient for local engineering maps and many printed topo sheets.",
      "Always keep the zone number with the easting/northing pair. Without the zone, the same numbers appear in many places on Earth.",
    ],
  },
  "mgrs-converter": {
    h2: "MGRS for grid navigation",
    paras: [
      "The Military Grid Reference System builds on UTM with lettered grid squares and digit precision. Longer strings mean smaller squares.",
      "Land navigators and many emergency maps still speak MGRS. Convert to lat/long when you move data into consumer web maps.",
    ],
  },
  "moon-phase-calculator": {
    h2: "Phase is global; rise times are local",
    paras: [
      "Everyone on Earth sees the same lunar phase on a given UTC day — the fraction of the moon’s face lit by the sun. Whether that moon is above your horizon is a separate local calculation.",
      "Use phase for planning full-moon hikes or new-moon stargazing; use moonrise and moonset for the clock times at your coordinates.",
    ],
  },
  "nearby-places-finder": {
    h2: "Nearby depends on the map database",
    paras: [
      "OpenStreetMap coverage is rich in some cities and sparse in others. A ‘nearby’ list is only as complete as the volunteers and imports behind that region.",
      "Treat results as leads to verify on the ground — especially for hours, access, and whether a POI still exists.",
    ],
  },
  "what-is-my-public-ip": {
    h2: "Public IP is the network exit",
    paras: [
      "Your public IP is the address servers see on the wider internet. On home Wi‑Fi it is usually your router’s WAN address; on a VPN it is the VPN exit.",
      "Geolocation for that IP is approximate and can be hundreds of kilometres off. It is not a street-level GPS fix — use Find My Location when you need the device position.",
    ],
  },
};
