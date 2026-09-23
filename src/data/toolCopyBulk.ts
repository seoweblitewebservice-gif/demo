import type { ToolCopy } from "./toolCopy";

/** Shared-depth copy for bulk-added tools — useful, not keyword stuffing. */
export const COPY_BULK: Record<string, ToolCopy> = {
  "shipping-distance-calculator": {
    h2: "Shipping distance is a planning floor",
    paras: [
      "Freight quotes start from how far two ports or hubs sit apart. Great-circle distance is the shortest path on the globe — real ships and planes take longer routes around weather, canals and air corridors.",
      "Use the number to compare corridors, not to promise transit days. Pair it with schedules from carriers when money is on the line.",
    ],
  },
  "delivery-radius-checker": {
    h2: "A delivery radius is a promise you can draw",
    paras: [
      "Customers ask ‘do you deliver to me?’ A clear circle from the depot answers the easy cases. Road time still matters in cities with rivers and one-way grids — compare a radius with a drive-time map before you print the policy.",
      "When the list of postcodes matters more than the circle, export from ZIP-within-radius and merge with your order system.",
    ],
  },
  "maidenhead-grid-locator": {
    h2: "Grid squares for radio, not street addresses",
    paras: [
      "Amateur radio operators exchange Maidenhead locators so both ends know roughly where the other station sits. Longer codes are finer squares.",
      "Convert GPS to a locator before a contest, or decode a heard grid to point antennas the right way.",
    ],
  },
  "geohash-encoder": {
    h2: "Geohashes turn points into sortable strings",
    paras: [
      "Databases and caches often store a geohash instead of two floats so nearby points share prefixes. Longer strings mean smaller cells.",
      "They are not Plus Codes and not MGRS — pick the system your stack already uses.",
    ],
  },
  "buffer-zone-map": {
    h2: "Buffers are distance, not permission",
    paras: [
      "A buffer ring shows everything within a set distance of a site — setbacks, notification zones, or rough catchments. It does not replace legal surveys or environmental permits.",
      "When the rule is ‘within a 30-minute drive’, switch to isochrones instead of a flat circle.",
    ],
  },
  "store-locator-radius": {
    h2: "Catchment rings for retail math",
    paras: [
      "Before you sign a lease, draw rings at 5, 10 and 15 minutes of distance or drive time and see what population and competitors sit inside. Distance rings are fast; drive-time rings are more honest in congested metros.",
    ],
  },
  "competitor-distance-map": {
    h2: "Spacing is strategy",
    paras: [
      "How far you sit from a rival is a simple number with big implications for pricing and cannibalisation. Crow-flies distance is the start; drive time is what shoppers feel.",
    ],
  },
  "optimal-meeting-point": {
    h2: "The middle of the map is not always fair",
    paras: [
      "A geographic midpoint treats the Earth fairly in distance. Traffic, transit and schedules may still make one person travel longer in time. Check both the midpoint and the drive times before you book a room.",
    ],
  },
  "closest-facility-finder": {
    h2: "Nearest on the board",
    paras: [
      "When several depots or clinics can serve a call, the distance matrix shows which candidate is closest in a straight line. Validate the winner with road routing when minutes matter.",
    ],
  },
  "ev-range-radius": {
    h2: "Range rings are optimistic sketches",
    paras: [
      "Drawing your rated range as a circle helps plan a day trip. Hills, heat and highway speed shrink real range. Treat the ring as a ceiling, not a guarantee.",
    ],
  },
  "walk-score-radius": {
    h2: "Walk reach without the marketing score",
    paras: [
      "A walking-distance ring shows how far a flat walk could stretch. Real sidewalks, hills and crossings change the shape. Pair with walking-time estimates for evening plans.",
    ],
  },
  "csv-latlng-validator": {
    h2: "Fix the sheet before you map it",
    paras: [
      "Bad rows — swapped lat/lng, missing signs, text in number columns — break maps and geocoders. Plotting a sample catches errors before a full batch run.",
    ],
  },
  "heatmap-from-points": {
    h2: "Density you can see",
    paras: [
      "A cloud of pins is hard to read; dense regions jump out when points stack on the map. For formal kernel density, take the same CSV into GIS software.",
    ],
  },
  "timezone-map-finder": {
    h2: "Timezones follow politics as much as longitude",
    paras: [
      "Clicking the map returns the IANA zone used for civil time at that point. Borders and daylight-saving rules change; the lookup follows current timezone data, not a pure solar offset.",
    ],
  },
  "bounding-box-calculator": {
    h2: "Boxes for APIs and downloads",
    paras: [
      "Many map APIs ask for a bounding box: minimum and maximum latitude and longitude. Drawing your study area and reading the extent saves hand-editing four numbers.",
    ],
  },
  "qr-location-helper": {
    h2: "Coordinates as a QR payload",
    paras: [
      "A meetup QR only works if the text inside is unambiguous. Copy stable decimal degrees or a Plus Code into any QR generator so phones open the right pin.",
    ],
  },
  "historical-map-context": {
    h2: "Anchor old maps with modern pins",
    paras: [
      "Historical sheets rarely share a modern projection. Finding a still-standing church or bridge in today’s coordinates gives you a control point before you georeference the scan in QGIS.",
    ],
  },
  "peak-elevation-profile": {
    h2: "Height at the click",
    paras: [
      "Summit elevations on tourist signs can round generously. Clicking the high point on a terrain-aware elevation tool gives a planning figure from global DEM data — not a surveyed benchmark.",
    ],
  },
  "school-district-context": {
    h2: "Start local, confirm official",
    paras: [
      "County and address context help you navigate district websites. Assignment rules change with redistricting — only the district’s official locator is authoritative for enrollment.",
    ],
  },
  "gpx-route-stats": {
    h2: "Distance from the track you actually recorded",
    paras: [
      "A GPX holds the breadcrumbs of a ride or run. Opening it on a map confirms the path and length before you log training or share a route.",
    ],
  },
};
