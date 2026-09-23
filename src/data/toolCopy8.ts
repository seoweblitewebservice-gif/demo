import type { ToolCopy } from "./toolCopy";

/** Long-form on-page copy for newly registered tools. */
export const COPY8: Record<string, ToolCopy> = {
  "distance-matrix-calculator": {
    h2: "When a distance matrix beats one-off measurements",
    paras: [
      "A single ‘distance between A and B’ answer is enough for a weekend trip. Planning a sales circuit, a study sample, or a logistics sketch needs every pair at once. A distance matrix fills that table: each row and column is a place, each cell is how far apart those two points are on the globe.",
      "MapBench computes great-circle distances in the browser. That keeps the tool free of per-element API fees and works offline after load. If you later need road kilometres, run critical pairs through the driving distance calculator — road networks almost always exceed the crow-flies lower bound.",
      "Export CSV when you want to sort, colour-code, or join the numbers in a spreadsheet. Keep place labels clear so a colleague can read the matrix without opening the map.",
    ],
  },
  "flight-distance-calculator": {
    h2: "Air distance is not a boarding pass",
    paras: [
      "Flight distance tools answer how far two airports or cities are along the short arc on the Earth. Airlines still add wind, airways, and holding patterns, so scheduled block time is usually longer than a pure distance-over-speed estimate.",
      "Use the number to compare layover cities, understand ferry-flight scale, or explain why a ‘nearby’ hub is still a multi-hour hop. Pair it with nearest-airport when you only know a city name and need a practical origin.",
    ],
  },
  "meeting-time-planner": {
    h2: "Overlap beats guesswork across time zones",
    paras: [
      "Remote teams waste meetings when someone joins at 11 p.m. by accident. A meeting planner converts one candidate moment into everyone’s local clock using real timezone boundaries, not fixed UTC offsets that ignore daylight saving.",
      "Start from the person with the hardest constraints, then widen. If no humane overlap exists, the honest output is ‘split the session’ — better than a matrix of exhausted attendees.",
    ],
  },
  "golden-hour-calculator": {
    h2: "Golden hour is geometry, not a fixed clock time",
    paras: [
      "The warm light photographers chase is a band of solar elevation near the horizon. That band slides with season and latitude: winter at high latitudes can stretch the window; equatorial equinox days keep it short.",
      "Always check the map for ridgelines and buildings. A calculated golden hour still fails if a hill eats the sun ten minutes early. Combine this tool with horizon distance when shooting from height.",
    ],
  },
  "area-code-finder": {
    h2: "Area codes are network geography",
    paras: [
      "US area codes grew with telephone routing needs, then overlays and splits scrambled the old ‘one code, one city’ mental model. Looking up codes by state remains useful for support forms, SMS campaigns, and verifying that a number region matches a claimed address.",
      "Do not treat an area code as proof of present location — number portability moved many lines across old boundaries.",
    ],
  },
  "census-geography-finder": {
    h2: "Census geography is a reporting lattice",
    paras: [
      "Tracts, block groups, and related units exist so statistics can be published without naming individuals. Pinning a map point into that lattice helps join survey data, grant maps, or academic samples to a place.",
      "For legal annexation or funding rules, confirm on official Census Bureau tools. Open map layers can lag boundary changes.",
    ],
  },
  "flood-zone-check": {
    h2: "Flood context is not a policy",
    paras: [
      "Homebuyers and renters often meet flood zones for the first time in a disclosure packet. A map check is a sensible early warning; it is not a determination letter and not insurance advice.",
      "Elevation, local drainage, and recent development all change real risk. Use official FEMA products and a licensed professional when money is on the line.",
    ],
  },
  "solar-position-calculator": {
    h2: "Altitude and azimuth locate the sun",
    paras: [
      "Solar altitude is the elevation angle above the horizon; azimuth is the compass direction. Together they tell you whether a window, panel, or lens will see the sun at a given minute.",
      "Engineers still need weather and albedo data for energy yield. This calculator handles the clean geometric half of the problem for any coordinates you supply.",
    ],
  },
  "climate-zone-finder": {
    h2: "Köppen zones summarise climate patterns",
    paras: [
      "Köppen-style labels group places by temperature and precipitation rhythms — useful for ecology, travel expectations, and rough building context. They are not a daily forecast.",
      "Urban heat islands and coastal breezes can make a neighbourhood feel unlike its regional class. Use the zone as a starting frame, then refine with local normals.",
    ],
  },
  "plant-hardiness-zone": {
    h2: "Hardiness zones guide winter survival",
    paras: [
      "USDA-style zones estimate how cold winters typically get, which helps choose perennials and trees. Summer heat, soil, and watering still decide whether a plant thrives.",
      "City centres are often milder than rural stations a few miles away. When in doubt, favour plants rated for a colder zone than the map suggests.",
    ],
  },
  "pin-map-maker": {
    h2: "A pin map is the simplest story on a map",
    paras: [
      "Sometimes you do not need analysis — only a clear set of markers for a handout, a field day, or a store list. Pin maps keep that workflow inside the browser without an account.",
      "When the list grows into a spreadsheet, graduate to CSV-to-map. When you need distance between every pair, open the distance matrix tool.",
    ],
  },
  "address-validator": {
    h2: "Validation against open data",
    paras: [
      "Before you import a thousand rows, test how a geocoder interprets messy addresses. OpenStreetMap-based validation catches missing cities and ambiguous street names early.",
      "Postal certification products remain the standard for discounted bulk mail. Use this tool for practical cleanup and coordinate attachment.",
    ],
  },
  "map-unit-converter": {
    h2: "Units are where land deals stumble",
    paras: [
      "Acres, hectares, square metres, miles, and kilometres all appear in the same project when teams cross borders. Converting units does not measure the parcel — it only translates a number you already trust.",
      "Measure on the map first with the area or distance tools, then convert for the audience that expects the other unit system.",
    ],
  },
};
