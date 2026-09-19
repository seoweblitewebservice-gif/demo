// ~200-word original copy for the newer tools (batch B).
export const COPY6B: Record<string, { h2: string; paras: string[] }> = {
  "daylight-hours-calculator": {
    h2: "A whole year of daylight, in one curve",
    paras: [
      "Single-day daylight figures hide the story; the story is the curve. Pick any place on Earth and this tool computes day length for the entire year with the same NOAA-grade solar math as the sunrise calculator, then draws it as one continuous chart — flat and calm near the equator, gently seasonal at mid-latitudes, dramatic to the point of snapping at the polar circles. The longest and shortest days come labelled with their dates, so 'how dark will December be in Tromsø?' stops being folklore and becomes a readable shape.",
      "The curve is latitude's signature, which makes the chart a teaching instrument as much as a planning one: compare two cities and you are comparing their light climates, with consequences for mood, gardening, solar yield and photography. Daylight here means geometric sun-above-horizon time — clouds belong to the climate tools, and the page says so. Use it to set expectations before a move or a trip, to time a planting schedule, or to understand why your new city's evenings feel 'wrong' in June. One search, one curve, a year of light made legible.",
    ],
  },
  "solar-panel-potential": {
    h2: "What would the sun actually deliver here?",
    paras: [
      "Solar quotes begin with one number: how much radiation a site receives, on average, over a year. This tool fetches twelve months of ERA5 satellite radiation for your exact coordinates, averages it into peak-sun-hours (kWh per square metre per day), and turns that into a labelled production estimate for your system size — an 80% performance ratio covering the real-world losses of inverters, temperature and wiring — plus its value at whatever electricity price you enter.",
      "The assumptions are printed, not buried: flat, south-facing (in the northern hemisphere) panels, climate-level radiation, no local shading. That last one is the honest boundary — a chimney, a walnut tree or a neighbouring tower can cut real output in ways no satellite average can see, and the page names certified shade studies as the escalation when money is committed. Within those bounds the estimate is exactly the right screening instrument: compare two roofs, sanity-check a quote, or size expectations for a cabin. It sits in the sun family beside sunrise, golden hour and daylight tools — the same sky, finally put to work.",
    ],
  },
  "golden-hour-calculator": {
    h2: "The photographer's light, on schedule",
    paras: [
      "Golden hour is not a clock time; it is an altitude band — the sun between roughly −4° and +6°, when light goes warm, soft and raking, shadows stretch, and ordinary streets turn cinematic. This tool computes both windows for any place and date using the same solar engine as the sunrise calculator: morning, as the sun climbs through the band, and evening, as it sinks out of it, reported in UTC with the conversion left honestly to the location's own clock.",
      "Because the windows derive from geometry, they migrate with the seasons exactly as your camera hopes they would: near the solstices the shallow sun path can stretch the band well beyond its equinox length, a fact the tool simply shows rather than explains away. Pair it with the moon-phase tool for the blue-hour bonus of a full moon, with the timezone tool to convert for the crew call sheet, and with the horizon calculator when the shoot sits above open ground. It is the smallest tool in the sun family and the one photographers open most — proof that a well-defined altitude band beats a folklore 'hour' every time.",
    ],
  },
  "area-unit-converter": {
    h2: "Acres, hectares and the dialects of land",
    paras: [
      "Land paperwork is multilingual: American deeds speak acres, European agriculture thinks in hectares, plans carry square metres, headlines prefer square miles, and real estate listings will cheerfully mix all four. This converter takes a value in any of six units — square metres, square kilometres, square miles, acres, hectares, square feet — and shows all of them at once with copy buttons, so a number crosses dialects without ever crossing a rounding error.",
      "The equivalences are exact by definition (a hectare is 10,000 m², an acre 4,046.86 m²), and the page keeps the intuition anchors that make the figures stick: a hectare runs about 1.4 football pitches, an American football field about 0.53 hectares. It pairs with the measurement tools the way a dictionary pairs with a workshop: the map-area and circle tools produce the number, this page translates it for the reader. Like every converter on the platform it runs entirely in your browser — no account, no upload — which makes it the kind of quiet, bookmarkable utility that earns its place by being right instantly, every time.",
    ],
  },
  "perimeter-calculator": {
    h2: "How long is the line around it?",
    paras: [
      "Area gets the glory, but perimeter pays for things: fencing, edging, pipe, track, patrol, painting. This tool focuses the polygon engine on exactly that question — click the boundary's corners, close the shape, and read the true surface perimeter in kilometres and miles up front, with area alongside for context. Segments are great-circle lengths on the WGS84 sphere, so even long, high-latitude boundaries stay honest where flat-map sums would drift.",
      "The workflow respects how boundaries actually look: undo while placing, edit after closing, add vertices along curves to capture them (and watch the length grow, correctly — the coastline paradox in miniature), then export the ring as GeoJSON or KML with everything else in the family. Farmers price fence lines, runners measure loops, planners quote boundary works, and teachers demonstrate why 'the same field' can have two honest perimeters at two drawing resolutions. It is the lean sibling of the area calculator: same drawing surface, different question, and the same privacy model — your shape lives in the shareable URL and nowhere else.",
    ],
  },
  "nearest-mountain": {
    h2: "The summits within your horizon",
    paras: [
      "Every landscape has a skyline, and the skyline has names. This tool queries OpenStreetMap's mapped peaks within your chosen radius of any point, ranked by distance with a compass bearing and the tagged elevation where mappers recorded one — enough to plan a weekend objective, identify the shapes above the valley, or settle which summit owns the view. Results pin on the map, so the list becomes a panorama you can point at.",
      "Two honest caveats keep it trustworthy: peaks appear where they are mapped, so famous ranges return richly and unrecorded hills stay silent, and elevations show only when tagged — for terrain truth at any coordinate, the Elevation Finder reads the Copernicus DEM instead. Used together, the two tools answer both versions of the question: what is that, and how high is here? The page hands off naturally to the line-of-sight calculator when the follow-up is 'can I see it from my deck?', completing a small mountain-literacy kit built entirely on open data, free, accountless, and shareable by URL like everything else on the platform.",
    ],
  },
  "nearest-lake-river": {
    h2: "Where's the water around here?",
    paras: [
      "Lakes and rivers are the geography people organise their weekends — and historically their cities — around. This tool queries OpenStreetMap for mapped water bodies and rivers within your radius of any point, ranks them by distance with bearings, and pins each on the map so shape and scale are visible at a glance: a long reservoir reads differently from a round pond, and a meandering river announces itself before you drive to it.",
      "Coverage follows the mappers: well-mapped regions return everything from canals to sea lochs, sparser ones the major features only, and the radius slider lets you widen the net until the weekend options appear. The tool is geography, not advice — water quality, access rights and swimming rules belong to local authorities, and the page says so. It composes nicely with the beach finder for coastal water, the watershed finder for the drainage logic underneath, and the distance calculator for the drive-time question that inevitably follows. Free, private, live from the open map, and quietly useful far more often than you'd guess before bookmarking it.",
    ],
  },
  "watershed-finder": {
    h2: "Which basin does your rain belong to?",
    paras: [
      "Every point on land sits inside a nested hierarchy of drainage basins, and the United States names them with Hydrologic Unit Codes — two-digit regions down to twelve-digit local watersheds. This tool resolves any US point against the USGS/NRCS Watershed Boundary Dataset via The National Map's public service and reports the units your rain flows through, turning an address into its hydrological identity.",
      "The question matters more often than it sounds: watershed logic governs water quality rules, fishing regulations, flood behaviour, conservation funding and the very names of local organisations ('creek keeper' groups organise by basin, not by county). The page keeps its scope honest — the WBD is a US dataset, and outside it the tool explains rather than guesses — and its sources transparent, printing the service it queries. It pairs with the flood-zone checker for the regulatory layer and the lake/river finder for the visible water, completing the hydrology corner of the platform: the same drop of rain, seen as geometry, as law, and as landscape.",
    ],
  },
  "climate-zone-finder": {
    h2: "Your location's climate, in one honest letter code",
    paras: [
      "The Köppen system remains the world's shared shorthand for climate — Af rainforest, Csa Mediterranean, Dfb snowy continental — because its letters compress exactly the right facts: how cold the winter gets, whether rain has a season, whether summers burn. This tool computes your point's classification the rigorous way: thirty years of monthly temperature and precipitation normals from the ERA5 reanalysis, run through the standard threshold tree, with the resulting code, a plain-language label, and the monthly normal table that produced it.",
      "The page prints its method because the method is the honesty: main groups follow the textbook thresholds, rare subtypes are merged and labelled as such, and the 1991–2020 window is the conventional 'climate normal' rather than this year's weather. Use it to understand a move ('why do my plants sulk here?'), to sanity-check a garden centre's advice, to compare two cities beyond their postcards, or to teach the system with live examples. It sits beside the hardiness finder and the daylight chart — three lenses on the same climate — and like everything here it is free, accountless, and reproducible from the URL.",
    ],
  },
  "hardiness-zone-finder": {
    h2: "The number your seed packets mean",
    paras: [
      "Plant hardiness zones track one brutally practical statistic: the average annual extreme minimum temperature, banded into the zones printed on every seed rack in the English-speaking gardening world. This tool computes yours from first principles — 24 winters of daily minima from the ERA5 reanalysis at your exact coordinates, averaged the way the concept intends, then mapped onto USDA band widths of roughly 5.6 °C per zone — and shows both the zone and the underlying extreme so you can judge the margin yourself.",
      "The page keeps the microclimate truth front and centre: walls, slopes, urban heat and cold-air pools shift a real garden half a zone or more, so the result is guidance beside the USDA map, not a replacement for it. Still, as a screening number it is superb — compare two houses' gardens, understand why a neighbour's fig survives and yours sulks, or plan a move's planting palette before the boxes are packed. It pairs with the Köppen finder for the wider climate picture and the daylight chart for the other half of a plant's calendar, completing a genuinely useful horticultural corner of the platform.",
    ],
  },
  "flood-zone-checker": {
    h2: "A first look at FEMA's flood map for your point",
    paras: [
      "Flood zones are the quiet clause in property decisions: insurance premiums, mortgage requirements, and the fine print of a deed all hinge on whether a point sits inside a mapped Special Flood Hazard Area. This tool queries FEMA's public National Flood Hazard Layer service for any US point and reports the mapped zone — AE, VE, X and their subtypes where present — or tells you plainly when the point falls outside mapped hazard areas or coverage.",
      "The framing is exact and repeated on the page: this is orientation, not a regulatory determination. Lenders and insurers use official FIRM products, and the tool says so rather than pretending a free lookup can sign papers. What it can do is transform anxiety into a question with a shape: is the house in the shaded zone? does the street drain toward it? which side of the line does the garden sit on? It pairs with the watershed finder for the drainage logic and the elevation finder for the ground truth, completing the water-awareness kit — open public data, honest labels, and zero storage of the address you check.",
    ],
  },
  "earthquake-fault-finder": {
    h2: "Is the ground near you quietly talking?",
    paras: [
      "Active faults announce themselves through earthquakes, and earthquakes are one of the best-instrumented phenomena on Earth. This tool pulls the last 30 days of M2.5+ events within 300 km of any point from the USGS real-time catalogue, sorted by distance with magnitude, place and date — a live pulse of your region's tectonic mood. A quiet list is reassuring; a busy one is a geography lesson; either way the answer is current, cited and reproducible from the URL.",
      "The page keeps its epistemology honest: recent seismicity is the globally available signal of fault activity, while mapped Quaternary fault traces (the USGS Qfaults database in the United States) are the geometric layer, and a quiet month is not a hazard assessment — building codes and geological surveys carry that weight. Within those bounds the tool is superb for what it is: curiosity ('why did the shelf rattle?'), travel planning, teaching plate boundaries with live examples, and the satisfying realisation that most of the planet is, right now, seismically sleepy. Free, live, and part of the earth-science family that reads the ground the way the sun tools read the sky.",
    ],
  },
  "city-comparison": {
    h2: "Two cities, side by side, honestly",
    paras: [
      "Choosing between two cities — a job, a semester, a winter escape — collapses surprisingly fast into a handful of comparable facts: how many people live there, how tightly they're packed, what a month costs, and how far apart the two options sit. This tool lines those numbers up for any pair from its curated set of major world cities, with the metro population, urban density and rent-inclusive cost index (New York = 100) in one table, plus the great-circle distance between them for good measure.",
      "The dataset is a labelled snapshot (≈2023 vintage) and the page says so, because the professional move with city numbers is to trust relationships more than absolutes: indices wobble, but 'roughly twice as dense, a third cheaper' is stable and actionable. Use it to shortlist, to sanity-check a recruiter's pitch, or to win the group-chat argument about where the winter should happen — then hand off to the cost-of-living calculator for the salary math and the daylight chart for the light climate, completing the relocation stack. Free, instant, and honest about the difference between a snapshot and a census.",
    ],
  },
  "cost-of-living-calculator": {
    h2: "What would your salary feel like there?",
    paras: [
      "A salary is a number in one city and a lifestyle in another, and the exchange rate between the two is the cost-of-living ratio. Enter your current city, your target city and what you earn; this tool converts purchasing power using rent-inclusive indices anchored to New York = 100, and shows the equivalent salary, the index ratio, the percentage gap and which of the two cities is cheaper — the whole negotiation in four numbers.",
      "The page keeps its promise precise: indices compress housing, groceries, services and rent into one rent-inclusive figure, so the output is directionally excellent and lease-signing insufficient — a screening instrument, printed as such. Currency is deliberately neutral; the ratio is the point, not the unit. That makes it perfect for the real questions: is the abroad offer actually an increase? what number should the transfer conversation start from? which of two remote bases stretches a fixed income further? Pair it with the city comparison for the wider picture and the timezone planner for the call schedule, and the relocation decision has its quantitative spine — free, instant, accountless.",
    ],
  },
  "population-density-comparison": {
    h2: "How tightly do two cities live?",
    paras: [
      "Density is the number that explains a city's texture before you've walked a block: whether the bakery is downstairs or a drive away, whether transit runs every four minutes or every forty, whether the night air hums or hushes. This tool compares two major cities' people-per-square-kilometre with instant proportional bars, the multiplicative ratio, and a plain-language read of the gap — Mumbai's ~32,000/km² against Los Angeles' ~3,200/km² is a clean order of magnitude, and seeing the bars makes the statistic physical.",
      "The dataset uses approximate built-up metro areas consistently across cities, and the page prints that definition because ratios are the trustworthy part of snapshot data while absolutes wobble. Lead with 'ten times denser' and you are on solid ground; cite the raw figure and you should cite its definition too. Use it to calibrate expectations before a move, to choose between two offers with different urban characters, or to teach why two cities with similar populations feel like different species. It completes the comparison trio with city comparison and cost of living — three lenses, one honest dataset.",
    ],
  },
  "how-far-can-i-see": {
    h2: "Your personal horizon, computed",
    paras: [
      "Stand on a beach and the sea ends at a line; that line has a distance, and it belongs to you personally — your eye height above the ground. This tool computes it: enter your height (or look up the ground elevation first with the Elevation Finder and add your eye level), and it returns the distance to your horizon with standard atmospheric refraction included, plus the classic companion figure — how far two observers at your respective heights could spot each other across open water.",
      "The framing keeps its physics honest: this is the curvature horizon over open ground, so mountains in between are the line-of-sight calculator's department, and refraction's ~8% gift assumes standard air, which weather occasionally overrules. Within those bounds the number is quietly wonderful: a beach stance sees about five kilometres, a lighthouse deck forty, an airliner's cruise seat hundreds — altitude buys horizon faster than intuition expects. It is the playful door into the earth-science family, sitting beside elevation, line-of-sight and the antipode tool: four answers to 'what does the planet do to my view?', each computed locally, free, and shareable by URL.",
    ],
  },
  "nearest-mcdonalds-starbucks": {
    h2: "The internet's favourite geography question, answered",
    paras: [
      "Somewhere between road-trip survival and pure meme energy lives the question of where the nearest McDonald's or Starbucks sits relative to any point on Earth — and open map data answers it with genuine precision. This tool queries OpenStreetMap's brand-tagged features (the same structured wikidata tags routing and research tools rely on) within your radius, ranks outlets by distance with a compass bearing, and pins them on the map, settling arguments about whether the coffee or the burger is closer.",
      "The honest fine print is part of the fun: only mapped outlets count, so coverage tracks mapper activity rather than corporate databases, and a brand-new store may lag the open map by weeks. Practical uses exist too — unfamiliar cities, layover logistics, caffeine triage on a long drive — which is exactly how playful tools earn their bookmark. It belongs to the nearest-finder family (hospitals, beaches, peaks, borders) that together turn the open map into an answer engine for 'what's around here?', and like the rest it runs free, accountless and private: your location never leaves the browser except as one anonymous query.",
    ],
  },
  "furthest-point-on-earth": {
    h2: "The single place maximally far from you",
    paras: [
      "For every point on Earth there exists exactly one point at maximum distance: your antipode, the end of the straight line through the planet's centre, always about 20,015 km away — half the meridian circumference, whoever and wherever you are. This tool frames the fact the viral way: show me the furthest place on Earth from here. Click or search your location and it flips your coordinates (latitude changes sign, longitude shifts 180°), pins both ends of the diameter, and reverse-geocodes what actually sits at the far end.",
      "The punchline is geographic honesty: because oceans cover 71% of the surface, most people's furthest point is open water, and the tool says so plainly instead of dressing the ocean up as a destination — while the rare land-to-land pairs (Spain and New Zealand famously) delight exactly as much as they should. It is the antipode finder wearing its party outfit, and it chains into the great-circle calculator for the distance story and the country lookup for the far end's flag. Free, instant, computed locally, and shareable by URL — the perfect link to send someone at the start of an argument about how far away 'far' can be.",
    ],
  },
};
