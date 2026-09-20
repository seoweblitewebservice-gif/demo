// Real-user-style FAQ pool per category, appended to every tool page's
// visible FAQ (and its FAQPage schema) so each page answers the questions
// people actually type.
import type { CategoryId } from "@/lib/registry";

export const USER_FAQS: Record<CategoryId, [string, string][]> = {
  location: [
    ["Is this free, and do I need an account?", "Completely free, no account, no email. The tool runs in your browser; the only request is one lookup per click, and nothing you do is stored."],
    ["Does it work on my phone?", "Yes — the map, GPS button and results are built mobile-first. On small screens the results stack under the map and every control is tap-sized."],
    ["Why is my result slightly different from another site?", "Different sites use different boundary datasets or snap points differently. We use OpenStreetMap administrative boundaries (or the US Census where labelled); near borders, zoom in and place the pin exactly."],
  ],
  distance: [
    ["Is the distance shown driving or straight-line?", "Straight-line (great-circle) unless the page says 'driving'. Every tool labels its yardstick; the driving calculators are linked right there when you need road distance."],
    ["Can I trust this for fuel or flight planning?", "Use it as the geometric baseline — it's accurate to about 0.3% of geodetic truth. For budgets add your real consumption; for schedules use the routing or flight tools, which say so themselves."],
    ["Does it work offline?", "The math runs entirely in your browser, so once the page is loaded, calculations work without a connection; only the map tiles and place search need network."],
  ],
  routing: [
    ["Are the travel times live traffic?", "No — they're free-flow estimates from speed limits and road classes, and every result is labelled that way. Add 20–40% in peak urban congestion."],
    ["Why did my route fail with an error?", "Usually a point isn't on a drivable road (river, island, private path). Nudge the pin to the nearest street and recalculate; the error message says exactly this."],
    ["Can I use the route in my navigation app?", "Yes — export GPX from the multi-stop planner and load it into OsmAnd, Organic Maps, Garmin or similar apps."],
  ],
  radius: [
    ["Is the circle accurate near the poles?", "Yes — boundaries are placed vertex-by-vertex on the sphere, so circles stay true at any latitude, unlike flat-map drawings."],
    ["Can I save or share my circle?", "The centre and radius live in the URL — copy the address bar. Exports (GeoJSON/KML/GPX) carry the full geometry for GIS use."],
    ["What's the difference between this and a drive-time map?", "A radius is geometric distance as the crow flies; a drive-time map shows reachable area by road in minutes. The two answer different questions and link to each other."],
  ],
  coordinates: [
    ["Which format should I copy for Google Maps?", "Decimal degrees ('40.7128, -74.0060') paste directly into Google Maps search; DMS works too. Copy buttons give both."],
    ["Is my pasted coordinate stored anywhere?", "No. Conversions are pure math in your browser; nothing is uploaded, logged or kept after you close the tab."],
    ["Why does my point land in the ocean?", "Almost always a swapped lat/lng pair or a missing minus sign. The map preview exists precisely to catch that in two seconds."],
  ],
  files: [
    ["Are my files uploaded to a server?", "Never. Parsing happens with your browser's own readers (FileReader/DOMParser). Check the network tab — you'll see only map tiles."],
    ["What's the maximum file size?", "Files up to ~25 MB parse smoothly; larger files still work but may render slowly on modest devices. There is no upload limit because there is no upload."],
    ["Will conversion lose any data?", "Geometry survives all conversions; styling and some properties are format-private (KML colours, GPX polygons). The page names each loss, and your original stays untouched."],
  ],
  creation: [
    ["Who owns the map I create?", "You do. Your pins and labels live only in the share URL. Basemap imagery carries the OpenStreetMap ODbL attribution when reused."],
    ["How many pins can I add?", "Hand-placed pins stay practical to a few dozen (the URL shares them). For hundreds or more, use CSV to Map with clustering."],
    ["Does the PNG export include the basemap?", "Yes — it captures the rendered map with tiles and pins at your screen's resolution, ready for slides or print."],
  ],
  earth: [
    ["How accurate is the elevation data?", "Copernicus GLO-90 at ~90 m resolution, typically a few metres vertically. Planning-grade, not survey-grade — the page says so."],
    ["Does line-of-sight include trees and buildings?", "No — the model sees bare terrain. Forests and structures are local knowledge you add after the terrain verdict."],
    ["Can I use these numbers in a report?", "Yes, with the model cited (e.g. 'Copernicus GLO-90 via Open-Meteo'). For expensive decisions, escalate to licensed surveys — the page lists when."],
  ],
  sun: [
    ["Why are times shown in UTC?", "A coordinate has no political timezone. You get UTC plus your device's local conversion, and the timezone tool resolves the location's own clock."],
    ["Do these times include daylight saving?", "Solar times don't involve DST at all; when you convert to a location's wall clock via the timezone tools, DST is handled by the tz database automatically."],
    ["What if the sun never sets there?", "Inside the polar circles the tool reports midnight sun or polar night honestly instead of inventing sunrise times."],
  ],
  lines: [
    ["Are these lines exact?", "The parallels follow the current axial tilt (≈23.44°) and drift slowly; positions are exact for the stated epoch and honest about the drift."],
    ["Can I click the line and read coordinates?", "Yes — click anywhere on the highlighted line and the panel shows exact lat/lng for that point, copyable."],
    ["Why does the date line zig-zag?", "It follows national timezone choices, not pure geometry — the map draws the real, bent line and the page explains each bend."],
  ],
  population: [
    ["Is this census data?", "No — a curated ≈2020–2023 snapshot of major cities, clearly labelled as an estimate with its ingredients published. For legal or funding work, use census sources; the page links the path."],
    ["Why is my rural radius population low?", "The dataset captures major cities; rural settlement is intentionally out of scope, and the total is labelled a lower bound."],
    ["Can I export the breakdown?", "Yes — CSV with each contributing city, distance, bearing and population, so any total is recomputable."],
  ],
  network: [
    ["Is the city from an IP lookup accurate?", "It is an estimate of the network exit, not a precise street location. VPNs, mobile carriers and shared IPs often place the city far from the actual user."],
    ["Is my IP stored?", "No. Lookups are performed for the current request and are not stored as a personal history."],
    ["Can I use this for legal identification?", "No. IP geolocation is network context only. Legal or identity claims require proper offline verification."],
  ],
};
