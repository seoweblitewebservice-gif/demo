// Third editorial layer: step-by-step masterclass, regional notes, extra
// glossary & QA per category — composed into every tool page. Original content.
import type { CategoryId } from "@/lib/registry";

export const GUIDE3: Record<CategoryId, {
  master: [string, string][]; regional: string; gloss: [string, string][]; qa: [string, string][];
}> = {
  location: {
    master: [
      ["Place the point deliberately", "Click the exact rooftop or intersection on a zoomed map instead of trusting a typed query; ambiguity is the largest error source in location answers, and a placed pin removes it entirely."],
      ["Read all layers at once", "County, city, state, postcode and country should form a coherent row; internal inconsistency (a county that doesn't contain that city) is the cue to zoom in and re-place the point."],
      ["Check the accuracy context", "Indoor GPS can drift hundreds of metres; if the answer matters and the point sits near a boundary, drag the pin to the verified spot before copying anything."],
      ["Copy the exact field you need", "Forms want one layer each — legal city, mailing postcode, sovereign country with ISO code. Copying the whole address into a county field is how dirty data spreads."],
      ["Share the state, not a screenshot", "The URL carries your coordinates; a colleague reopening it sees the identical point and can re-verify every layer independently — reproducible beats pretty."],
    ],
    regional: "Coverage notes: administrative answers are strongest wherever OpenStreetMap's community is active — effectively all inhabited countries — while US-specific layers (congressional and school districts) come from the Census Bureau and stop at the border. Postal coverage is dense in the US, much of Europe, Canada and Australia, thinner elsewhere; the tools say 'no data' rather than guess, and that silence is itself useful information.",
    gloss: [
      ["ISO country code", "The two-letter sovereign identifier (US, DE, JP) used by shipping and software."],
      ["Exclave / enclave", "Territory separated from or surrounded by other administrations — where naive lookups fail and boundary data earns its keep."],
    ],
    qa: [
      ["Can I batch hundreds of points?", "Interactively, one at a time by design (privacy + rate limits); for bulk work run your own Nominatim/Photon instance and mirror this workflow in a script."],
      ["What if the map and my phone disagree?", "Your phone's blue dot has an accuracy circle; place the pin where the circle's centre should be and treat the phone as a hint, not a verdict."],
    ],
  },
  distance: {
    master: [
      ["Name the yardstick first", "Decide straight-line, road or schedule distance before typing anything; the three form a ladder of realism and mixing them silently is the classic distance error."],
      ["Enter endpoints at the right grain", "City-to-city for comparisons, addresses for logistics, coordinates for datasets — the grain sets the honest precision of the answer you'll quote."],
      ["Read bearing with the distance", "A distance without direction is half a fact; the compass point turns the number into something a human can point at."],
      ["Cross-check with a known pair", "London–Paris ≈ 344 km, a quarter meridian ≈ 10,018 km; two seconds of calibration catches broken tools and broken inputs alike."],
      ["Export the pair, not just the number", "Share the URL or copy both endpoints; a distance without reproducible endpoints is unverifiable folklore."],
    ],
    regional: "Great-circle math is universal, but the meaning of 'between two places' varies by mapping culture: US users expect miles and ZIP-to-ZIP convenience, European users think in kilometres and postcodes, marine users in nautical miles — the unit table exists precisely so one calculation serves every convention without rounding arguments.",
    gloss: [
      ["Back bearing", "The bearing from B to A, computed properly rather than assumed ±180°."],
      ["Convergence", "Why initial and final bearings differ along a great circle."],
    ],
    qa: [
      ["Which unit is 'most accurate'?", "None — they're exact conversions of one measurement; pick the unit your reader thinks in."],
      ["Do mountains change great-circle distance?", "No — it's the surface path on the reference sphere; terrain adds effort, not arc length."],
    ],
  },
  routing: {
    master: [
      ["Pin endpoints on roads", "Drag each pin to a visible street before calculating; snapping surprises are the top cause of 'weird' routes, and road-pinned inputs make results stable and explainable."],
      ["Pick the mode that matches reality", "Driving, walking and cycling follow different legal networks; comparing all three is often more informative than any single answer."],
      ["Read the shape, not just the total", "Isochrone fingers follow fast corridors and holes mark barriers; a route that criss-crosses itself after optimisation is a cue to re-check your stop list."],
      ["Separate physics from policy", "Keep the engine's free-flow figure and your congestion buffer as distinct numbers; present the sum with its parts and your estimate becomes defensible."],
      ["Export for the next step", "GPX for navigation apps, GeoJSON for reports; embed mode and contours in properties so the file is auditable without archaeology."],
    ],
    regional: "Routing quality follows OpenStreetMap's coverage: excellent across Europe, North America and most of East Asia, good in South America's cities, patchier in remote regions — and access rules (one-ways, pedestrian zones) reflect local mapper knowledge, which is why the engine sometimes knows a shortcut your satnav doesn't.",
    gloss: [
      ["Snap", "The engine's move of your pin to the nearest routable way."],
      ["Contour", "One time band in an isochrone set (e.g. the 30-minute ring)."],
    ],
    qa: [
      ["Why did walking beat driving?", "Pedestrian cut-throughs — steps, paths, arcades — are real network edges cars can't use; trust the shorter walk when the map shows why."],
      ["Can I trust ferry legs?", "Where mapped ferry routes exist the engine uses them; always double-check seasonal schedules outside the data."],
    ],
  },
  radius: {
    master: [
      ["Ask geometric or temporal", "Before drawing anything, decide whether the question is 'within X km' (circle) or 'within X minutes' (isochrone); the wrong instrument answers the wrong question confidently."],
      ["Calibrate with known areas", "Measure a block or pitch you know; a hectare ≈ 1.4 FIFA pitches, and one calibration makes every later polygon legible at a glance."],
      ["Drag to verify", "Resize by the edge handle and watch area update live; the feedback loop between number and map is where intuition gets built."],
      ["Store parameters with geometry", "Exports here embed radius and unit in feature properties; an audited analysis should never require guessing what a circle meant."],
      ["Compose for analysis", "Rings for price bands, overlaps for catchment competition, circle-minus-circle for donuts — circles become analytical once they're combinable datasets."],
    ],
    regional: "Unit culture matters in radius work: US planning thinks in miles and acres, agriculture worldwide in hectares, marine contexts in nautical miles — converting exactly (1 ha = 2.471 acres) is trivial, but choosing the unit your audience trusts is the professional move.",
    gloss: [
      ["Donut analysis", "Subtracting an inner circle from an outer to study a distance band."],
      ["Anisotropy", "Direction-dependent reach — the reason circles lie about travel time."],
    ],
    qa: [
      ["Circle area vs πr² at large radii?", "Curvature makes the spherical cap smaller; good tools print both and explain the gap."],
      ["How many circles is too many?", "When colours stop being distinguishable — typically past four or five; split the map instead."],
    ],
  },
  coordinates: {
    master: [
      ["Standardise storage first", "Decimal degrees, WGS84, five or six decimals in every column you own; convert at the display edge and the interior stays clean forever."],
      ["Validate on ingest", "Reject out-of-range values (|lat| > 90) instead of clipping; a rejected row is a fixable row, a clipped one is silent corruption."],
      ["Make the pin check a ritual", "Paste, look at the map, then trust — swapped axes and wrong hemispheres are instantly visible on a globe and invisible in a table."],
      ["Match precision to source", "Consumer GPS earns ~5 decimals; quoting more implies a survey you didn't run. Rounding deliberately is honesty."],
      ["Preserve provenance", "When converting UTM/MGRS strings, keep the original beside the decimal pair; provenance prevents every later argument about what was meant."],
    ],
    regional: "Notation culture splits by profession more than by country — mariners and aviators favour DMS and nautical frames, soldiers MGRS, developers decimals, hikers UTM — which is why a converter that shows all dialects simultaneously is more useful than any single 'correct' format.",
    gloss: [
      ["Null Island", "0,0 — where swapped/zeroed coordinates wash up; the classic bug's nickname."],
      ["Hemisphere letter", "The N/S/E/W suffix carrying sign in DMS and MGRS notations."],
    ],
    qa: [
      ["Is MGRS usable at the poles?", "Polar work switches to UPS; this tool covers the UTM domain where virtually all field grids live."],
      ["Why do some APIs want [lng, lat]?", "GeoJSON follows the axis order of the OGC standard; remembering which world you're in prevents the ocean bug."],
    ],
  },
  files: {
    master: [
      ["Inspect before trusting", "Open locally, read the validation line, check feature counts and the bounding box; a planet-spanning box means one corrupt vertex, a wrong-hemisphere box means swapped axes."],
      ["Sample properties by eye", "Three random rows of properties catch encoding and column-shift bugs no schema check will flag."],
      ["Choose the conversion by its loss", "GPX keeps time/elevation, KML keeps presentation, GeoJSON keeps data; name the loss on the way out and keep the original regardless."],
      ["Confirm CSV columns against a known point", "Auto-detection is good, not magical; verify the detected lat/lng pair on the map before rendering all 40,000 rows."],
      ["Export with meaningful names", "Date + source + format in the filename; filenames are the metadata future-you will actually read."],
    ],
    regional: "Format culture follows tooling: Google-era workflows still circulate KML, GPS and sport apps speak GPX, and the analytical web has standardised on GeoJSON — so a privacy-first converter that handles all three locally is effectively a universal adapter for a decade of saved places.",
    gloss: [
      ["ExtendedData", "KML's key/value extension block; preserved into GeoJSON properties here."],
      ["trkseg", "A GPX track segment; multi-segment tracks map to MultiLineString."],
    ],
    qa: [
      ["Why no KMZ directly?", "KMZ is ZIP-in-disguise; unzipping exposes the KML and keeps the whole pipeline transparent and local."],
      ["Do exports keep my styling?", "Geometry and properties travel; exact visual styling is format-private by design — that's the named loss."],
    ],
  },
  creation: {
    master: [
      ["Write the one-sentence message first", "If you can't state the map's point in one sentence, no styling will save it; the sentence chooses the symbols."],
      ["Limit ink to the message", "A handful of labelled pins or a few coloured areas; every extra colour beyond category is decoration, every extra pin beyond the message is noise."],
      ["Frame tightly", "Crop the viewport to the subject; empty ocean is not context, it's dilution."],
      ["Export the trio", "PNG for the slide, GeoJSON/CSV for the record, share-URL for the living version — three readers, three futures."],
      ["Switch instruments at scale", "Past ~50 points, move from hand-pinning to CSV clustering; the right tool at the right scale is the whole craft."],
    ],
    regional: "Conventions differ by audience: classrooms expect printable PNGs, analysts expect CSV/GeoJSON, journalists expect a clean embeddable image with attribution — exporting all three from one composition is what makes a small map professionally portable across those cultures.",
    gloss: [
      ["Legend discipline", "Every colour on the map appears in the legend, and vice versa — no orphans."],
      ["Attribution string", "'© OpenStreetMap contributors' — the ODbL ask for reused basemap imagery."],
    ],
    qa: [
      ["Can I brand the export?", "Add your title as a pin label or overlay in the slide; keep the basemap credit visible per ODbL."],
      ["Best colour count?", "Two or three high-contrast hues for categories; more stops reading and starts decoding."],
    ],
  },
  earth: {
    master: [
      ["State the model with the number", "'Copernicus GLO-90, ~90 m, ±few metres vertical' turns an elevation claim from vibes into a citable fact."],
      ["Add heights explicitly", "Eye height, mast height, deck level — visibility answers are unreproducible without them, and the tools here keep them as named inputs."],
      ["Layer land cover after terrain", "The DEM sees bare earth; woods and walls are local knowledge you add after the curvature verdict, not before."],
      ["Average years, not days", "Climate letters and hardiness zones want 30-year character; single-year values are weather wearing climate's coat."],
      ["Escalate when it's expensive", "DEM for screening, licensed survey for decisions with money attached — knowing the upgrade point is the professionalism."],
    ],
    regional: "Terrain data is genuinely global (satellites don't respect borders), but its texture varies: flat plains resolve beautifully, steep forested relief noisier; seismicity tools are worldwide via USGS, while mapped fault and flood layers are US-first — the scope chips on each tool state exactly where each answer stands.",
    gloss: [
      ["Peak sun hours", "kWh/m²/day expressed as hours of 1,000 W/m² — PV's linearising unit."],
      ["HUC", "Hydrologic Unit Code — nested US basin numbering, 2 to 12 digits."],
    ],
    qa: [
      ["Why does my profile differ from my GPS track?", "The profile samples terrain truth; your track carries device noise and bridges. Compare shape, not amplitude."],
      ["Is Köppen stable under climate change?", "The classes shift over decades — compute with recent normals and date the result, as this tool does."],
    ],
  },
  sun: {
    master: [
      ["Fix the convention before sharing", "State the zenith (official 90.833°) and both clocks (UTC + local zone); a sunrise without its conventions is an argument waiting to happen."],
      ["Plan photography by altitude", "Golden hour is the −4°→+6° band; its clock time migrates seasonally, so schedule from the window, then convert."],
      ["Use the annual curve for expectations", "One date misleads; the year-long daylight curve is a latitude's signature and the right object to compare cities by."],
      ["Let the grid choose the meeting", "For distributed teams, read the overlap rectangle from the 24-hour grid and rotate the pain quarterly — fairness made visible."],
      ["Treat polar answers as answers", "Midnight sun and polar night are correct outputs, not errors; the calculator says so plainly instead of fabricating times."],
    ],
    regional: "Solar geometry is universal; clocks are not. Spain runs solar-late, western China dramatically so, and DST rules differ by polity — which is why every solar result here carries UTC beside local time, letting any reader re-anchor the fact in their own political frame.",
    gloss: [
      ["Hour angle", "The sun's angular distance from solar noon; the engine behind rise/set times."],
      ["Blue hour", "The −4°→−6° band after golden hour; twilight's cool companion."],
    ],
    qa: [
      ["Can I get times for past dates?", "The NOAA algorithm runs for any date near the present era; pick the date and the curve follows."],
      ["Does the Moon affect golden hour?", "Not the sun's light — but a full moon near blue hour is the photographer's bonus; check the phase tool alongside."],
    ],
  },
  lines: {
    master: [
      ["Calibrate other tools with the lines", "Equator circumference ≈ 40,075 km and one degree ≈ 111 km are the yardsticks that make every later distance legible."],
      ["Click, read, compare", "Trace a highlighted parallel and watch one coordinate hold while the other sweeps; the grid becomes a place you've stood."],
      ["Lead with the datum stories", "Greenwich vs the GPS zero (~100 m), the date line's national zig-zags — conventions measured precisely, memorable forever."],
      ["Pair lines with the daylight tools", "The polar circles are exactly where the day-length calculator snaps to 0 or 24 hours; teaching them together makes both click."],
      ["Date your tilt facts", "The tropics drift with the 41,000-year tilt cycle; print 'current ≈ 23.44°' and the fact ages gracefully."],
    ],
    regional: "The lines cross very different human geographies — the Equator threads thirteen countries, the Prime Meridian eight, the date line mostly ocean and deliberate bends — and naming those crossings turns an astronomy lesson into a travel itinerary, which is how the concepts stick.",
    gloss: [
      ["Solstice", "The moment the overhead sun touches a tropic; the year's daylight extreme."],
      ["Graticule", "The latitude/longitude lattice itself, as drawn on a map."],
    ],
    qa: [
      ["Why isn't the Equator a straight line on my map?", "It is — in equirectangular; curved appearances are projection theatre, not geography."],
      ["Do time zones follow the date line?", "Roughly; the line is where zones collectively reset the calendar, bends included."],
    ],
  },
  population: {
    master: [
      ["Print the vintage and definition", "≈2020 municipal, metro vs urban area — the label travels with the number or the number shouldn't travel."],
      ["Inspect the ingredients", "A radius sum with its city list shown is an argument; without it, a spell. Read the list before reusing the total."],
      ["Lead with ratios", "Ten times denser, half as pricey — relationships survive snapshot error; absolutes wobble."],
      ["Keep the map in view", "4.7 million is a statistic; the same number pinned beside its ring is a place, and decisions live in places."],
      ["Escalate at the money line", "Estimates screen, censuses decide; when grants or legal lines depend on it, move to census geometry and say so."],
    ],
    regional: "Definitions vary by culture as much as by data: US 'city' populations are legally small (city limits), European figures often mean urban continuum, and Asian megacities blur municipal and metro lines. Always print the definition with the number.",
    gloss: [
      ["Lower-bound sum", "A radius total from a curated list that under-counts unlisted places; useful for screening, not for absolute population guarantees."],
      ["Snapshot", "A dataset frozen at a vintage; correct for its date, approximate for yours."],
    ],
    qa: [
      ["Why not live census feeds everywhere?", "Authoritative feeds are US-scoped and rate-limited; global screening needs labelled estimates first, escalation second."],
      ["Can I export the breakdown?", "Yes — CSV with distance, bearing and population per city, so the sum is recomputable anywhere."],
    ],
  },
  network: {
    master: [
      ["Treat the result as network context", "An IP lookup names an attachment point on the Internet, not a street address. State that distinction before acting on a city or region field."],
      ["Cross-check when the decision matters", "Compare against a second geolocation database and against the ASN organisation footprint; single-source city pins are weak evidence."],
      ["Prefer ASN and organisation fields", "They age better than city guesses and are usually more useful for abuse, infrastructure and fraud triage."],
      ["Record time and source", "Geolocation datasets change; a lookup without vintage is hard to audit later."],
      ["Never present an IP pin as GPS", "Language and map styling both matter — keep IP results visually distinct from device location."],
    ],
    regional: "IP geolocation coverage is densest in North America and Europe and thinner in parts of Africa, South Asia and rural networks. Mobile carriers and CGNAT pools often resolve to a single city for large regions, so the reported city can be hundreds of kilometres from the subscriber.",
    gloss: [
      ["ASN", "Autonomous System Number — the routing domain that announces the address space."],
      ["CGNAT", "Carrier-grade NAT, where many subscribers share one public IP."],
    ],
    qa: [
      ["Why does a VPN change the city?", "The lookup sees the exit node, not the client behind the tunnel."],
      ["Can I trust the ISP name?", "Organisation and ISP fields are generally more stable than city; still verify for high-stakes cases."],
    ],
  },
};
