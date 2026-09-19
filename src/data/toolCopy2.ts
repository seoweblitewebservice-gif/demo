// Long-form on-page content for Distance & Bearing tools (~170 words each).
export const COPY2: Record<string, { h2: string; paras: string[] }> = {
  "distance-between-two-places": {
    h2: "How the distance between two places is calculated",
    paras: [
      "Search any two places on Earth — cities, addresses, airports or raw coordinates — and this tool returns the straight-line distance between them in miles, kilometres, meters, feet or nautical miles, together with the initial bearing and its compass point. The calculation is a great-circle measurement on the WGS84 sphere using the haversine formula: the same geometry behind flight planning, and accurate to within about 0.3% of a full ellipsoidal geodesic. A dashed line on the map shows exactly what is being measured, and swapping A and B takes one click.",
      "Use it for quick reality checks — how far is the airport, how big is this country, how far apart are two offices — and as the entry point to deeper tools: the bearing calculator for direction, the halfway tool for meet-ups, the driving calculator for road distance and time. Because straight-line distance is the physical lower bound, it is the right number for radio range, wildlife movement, flight baselines and service-radius thinking. Coordinates are accepted in decimal or DMS, results convert across all units live, and the URL stores both points so any calculation is shareable and reproducible.",
    ],
  },
  "distance-between-cities": {
    h2: "Measuring city-to-city distances correctly",
    paras: [
      "How far apart are two cities? Type both names and this tool geocodes each to its mapped centre — typically the historic core or civic centre — then measures the great-circle distance between those points with the haversine formula on the WGS84 sphere. You get the distance in every common unit, the initial compass bearing, and both cities pinned on one map so the scale of the journey is instantly visible. It is the fastest way to compare candidate destinations, sanity-check a itinerary, or answer the classic quiz-night question with a defensible number.",
      "Two honest caveats keep the number trustworthy. First, centre-to-centre straight-line distance is deliberately not driving distance: roads bend around coastlines, mountains and borders, so a road trip is usually 20–60% longer — the driving distance calculator shows that counterpart figure. Second, a city is an area, not a point, so airport-to-airport or suburb-to-suburb figures will differ slightly; for door-to-door precision paste exact addresses or coordinates instead. Within those well-labelled limits, the tool is ideal for education, logistics estimates, sales territory planning and travel curiosity — free, instant and shareable.",
    ],
  },
  "distance-between-coordinates": {
    h2: "Precise distance from raw coordinate pairs",
    paras: [
      "Built for people who already have coordinates, this tool skips place names entirely: paste two pairs in decimal degrees, space-separated values, or DMS with hemisphere letters, and the geodesic distance appears immediately in a full unit table — kilometres, miles, meters, feet and nautical miles. Inputs are validated against the WGS84 ranges before any math happens, so a swapped or impossible pair produces a clear error instead of a nonsense number. The map draws both points and the great-circle line between them for a visual check.",
      "The measurement itself is spherical trigonometry — the haversine formula on the mean Earth radius — which stays correct across hemispheres, oceans and the poles, where flat-map 'Pythagoras' approximations silently fail by tens of percent. That makes the page a dependable checker for GIS homework, dataset QA, geocaching planning, drone range estimation and spreadsheet spot-checks. Every value is copyable, the pair persists in the URL for sharing, and all computation runs locally in your browser — no account, no upload, no waiting.",
    ],
  },
  "crow-flies-distance": {
    h2: "What 'as the crow flies' really means",
    paras: [
      "'As the crow flies' is the everyday name for great-circle distance: the shortest possible path between two points along the Earth's curved surface, ignoring roads, fences and terrain. Enter two places or coordinates and this tool computes that path with the haversine formula, reporting it in miles, kilometres, meters, feet or nautical miles plus the initial compass direction. The map's dashed line shows the true shortest path — and on long east-west routes it visibly reminds you why flat maps lie: the straight line on a globe projects as a curve.",
      "Straight-line distance is the right metric whenever nothing on the ground constrains movement: radio and cellular coverage, drone and aircraft range, bird and seed dispersal, light and sound propagation, insurance radius clauses, and quick geographic comparisons. When roads do matter, the driving distance tool provides the on-road counterpart so you can see the detour penalty side by side. Both endpoints accept names, addresses or raw coordinates, results convert live between units, and the shareable URL reproduces your exact pair — free, private and instant in the browser.",
    ],
  },
  "nautical-distance-calculator": {
    h2: "Measuring distances the maritime way",
    paras: [
      "Mariners measure distance in nautical miles because one nautical mile equals one minute of latitude — the unit is baked into the coordinate grid itself. This tool speaks that language natively: enter a departure and destination (port names, headlands, buoys or raw coordinates) and read the great-circle distance in nautical miles by default, with statute miles and kilometres alongside. Set a speed in knots and it adds a straight-run passage estimate in hours, the classic 'distance over speed' mental model every skipper uses at the chart table.",
      "The underlying measurement is the same WGS84 great-circle math as the other distance tools, simply presented in marine units — 1 NM = 1.852 km exactly, 1 knot = 1 NM per hour. Bearings are true north, as charts use. Two honest limits are labelled on the page: the estimate assumes a constant-speed straight run, whereas real passages follow traffic separation schemes, currents and weather routing; and great-circle tracks at high latitude differ from the rhumb lines printed on Mercator charts. For planning baselines, log checks and training, it is exactly the quick, correct arithmetic you need.",
    ],
  },
  "great-circle-calculator": {
    h2: "The geometry behind every flight plan",
    paras: [
      "A great circle is any circle whose centre is the Earth's centre, and its arcs are the shortest surface paths between points — the reason long-haul flights curve toward the poles on a flat map. This calculator exposes the full geometry: distance along the arc, the initial bearing you would steer at departure, and how direction evolves along the route. Enter two places or coordinates and the results panel separates initial from final bearing, making visible the subtle turn a true shortest-path flight performs, something a single 'direction' number hides.",
      "The math is spherical trigonometry on the WGS84 mean sphere: haversine for distance, the standard atan2 azimuth formula for bearings — the same equations aviation distance tables are built from, accurate to about 0.3% of ellipsoidal geodesics. Pilots, dispatchers, students and sim enthusiasts use the page to check route legs, understand why JFK–HKG arcs over Alaska, or verify homework. Pair it with the nautical calculator for knots and passage time, or the map radius tool to visualise range rings from the same departure point.",
    ],
  },
  "earth-distance-calculator": {
    h2: "A general-purpose distance tool for the whole planet",
    paras: [
      "When you are not sure which distance tool to reach for, this is the default: any two points on Earth, entered as places, addresses or coordinates, with the result shown simultaneously in every unit the platform supports — kilometres, miles, meters, feet and nautical miles — plus bearing and the geographic midpoint. One entry, one screen, every answer, with the two points and the measured great-circle line drawn on the map for immediate visual verification.",
      "The engine is the haversine great-circle formula on the WGS84 mean sphere (radius 6371.0088 km), the standard choice for interactive geography and accurate to within roughly 0.3% of survey-grade ellipsoidal geodesics — the methodology page documents the difference and when it matters. The midpoint readout is a genuine spherical midpoint, correct across hemispheres and the date line, which makes it handy for splitting journeys. Distances are straight-line by design; the routing tools add road reality when you need it. Free, accountless, computed locally, and shareable via the URL.",
    ],
  },
  "distance-between-zip-codes": {
    h2: "How ZIP-to-ZIP distance is measured",
    paras: [
      "Enter two US ZIP codes and this tool geocodes each to its mapped centroid — the point near the area's population or post-office centre — then measures the great-circle distance between them, in miles first and every other unit one click away. Adding the city name ('94107 San Francisco') resolves special or newly created ZIPs more reliably. The same flow accepts postcodes from other countries wherever OpenStreetMap geocoding covers them, so cross-border checks often work too.",
      "ZIP-to-ZIP distance is the quick metric behind delivery surcharges, service availability checks, sales territory sizing and 'how far is my new job' questions. Two honest caveats keep it trustworthy: a ZIP is an area, so the centroid is a representative point rather than a street address, and the figure is straight-line — road distance, which couriers actually drive, runs longer and is available in the driving calculator. Within those labelled limits the lookup is fast, free and private: your ZIPs are geocoded on the fly and never stored.",
    ],
  },
  "bearing-calculator": {
    h2: "Understanding bearing between two points",
    paras: [
      "Bearing is the clockwise angle from true north to the line between two points: 0° north, 90° east, 180° south, 270° west. Enter an origin and destination — names, addresses or coordinates — and this tool returns the initial great-circle bearing in degrees, the back bearing for the return direction, and both expressed as 16-point compass points for humans. The map draws the line so the number always has a visual anchor, and the shareable URL preserves your pair.",
      "The calculation uses the standard spherical azimuth formula, exact on the WGS84 sphere and independent of any flat-map distortion. Note that bearings here are true-north based: a magnetic compass must add your local declination, which varies by place and year — the methodology page points to NOAA and BGS geomagnetic models for that correction. Practical uses run from aiming a directional antenna or solar panel, to describing a hiking leg, to checking a sailing course baseline. Pair it with the compass calculator for degree-to-direction translation, or the distance tools for the length of the same line.",
    ],
  },
  "compass-calculator": {
    h2: "Degrees, directions and the 16-point compass rose",
    paras: [
      "This page is both a translator and a calculator. Type any bearing in degrees and instantly see its compass point on the 16-point rose — N, NNE, NE, ENE and so on, each spanning 22.5° — or enter two places and let the tool compute the direction from one to the other and translate it for you. It settles everyday arguments ('is that north-north-east or northeast?'), helps read meteorological and aviation prose, and gives students a live rose to play with instead of a static diagram.",
      "Behind the simple interface sits the same spherical azimuth math as the bearing calculator, so directions between places follow the true great-circle line rather than a distorted map edge. The reference facts are on the page too: the classic rose has 32 points, the 16-point version covers nearly all practical needs, and cardinal shortcuts (0° N, 90° E, 180° S, 270° W) are worth memorising. Bearings are relative to true north; magnetic navigation adds local declination. Everything runs locally in your browser, instantly and for free.",
    ],
  },
  "halfway-between-two-places": {
    h2: "Finding the true midpoint between two places",
    paras: [
      "Meeting a friend halfway, choosing an overnight stop, or splitting a relocation? This tool computes the geographic midpoint of two places on the sphere — the point exactly half the great-circle distance from each. That is not the same as averaging latitudes and longitudes, which skews badly over long distances and breaks entirely across the date line; the spherical midpoint follows the actual surface path, so the answer is geometrically honest even for Sydney–Santiago pairs.",
      "After computing the midpoint the tool reverse-geocodes it, telling you the nearest named place — which is often the real decision you need ('so we meet near…'). If the midpoint falls in open ocean or wilderness, the page says so plainly and still gives you coordinates to pivot from. The result is pinnable on the map, copyable in decimal or DMS, and shareable via URL. Combine it with the driving calculator to compare each party's road time, or the cities-within-radius tool to find the nearest sizeable town when the exact midpoint is impractical.",
    ],
  },
  "distance-matrix-calculator": {
    h2: "Every pairwise distance at once",
    paras: [
      "Add up to eight places and this tool builds the full symmetric distance matrix: every pairwise great-circle distance in a clean table, computed instantly in your browser. It is the right instrument when a single distance is not the question — comparing candidate warehouse sites against several markets, clustering field samples, checking which branches are closest to which customers, or building an origin–destination table for a class exercise. The CSV export drops the same numbers straight into spreadsheets and notebooks.",
      "Distances use the haversine great-circle formula on the WGS84 sphere, so the matrix is exact straight-line geometry, not road routing; for a handful of stops with real driving legs, the multi-stop planner complements it. The eight-place cap keeps the table legible and the computation trivial (28 unique pairs), and the interface validates each entry before it joins the matrix. Every cell is derived locally, nothing is uploaded, and the whole workflow — enter, read, export — takes under a minute.",
    ],
  },
};
