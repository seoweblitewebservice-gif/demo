// Long-form on-page content for Routing and Radius/Area tools (~170 words each).
export const COPY3: Record<string, { h2: string; paras: string[] }> = {
  "driving-distance-calculator": {
    h2: "Real road distance and travel time, not guesses",
    paras: [
      "Straight-line tools tell you the planet's answer; this one tells you the road's answer. Enter a start and destination and the tool routes along the actual OpenStreetMap road network using the open Valhalla routing engine, returning true driving distance and an estimated travel time derived from road classes and speed limits — with a fallback to the OSRM engine if the primary server is busy. The route draws on the map so you can see exactly which corridors were chosen before you trust the number.",
      "One transparency note is part of the result: durations are free-flow estimates, not live traffic, so rush-hour city legs need a buffer — the label says so every time. Islands, closed borders or points off the network produce a clear, explained error instead of a fabricated route. This is the tool for logistics quotes, commute comparisons, trip planning and reimbursement documentation; when you need more stops, the multi-stop planner extends the same engine to full itineraries, and the straight-line calculator shows the theoretical minimum for comparison.",
    ],
  },
  "walking-route-planner": {
    h2: "Routes that follow the pedestrian network",
    paras: [
      "Walking is not driving minus speed: pedestrians use footways, paths, crossings and shortcuts that cars cannot, and ignore motorways entirely. This planner uses Valhalla's pedestrian costing model, so the drawn route follows sidewalks and trails where they are mapped, and the time estimate comes from a realistic walking model (about 5 km/h, adjusted for surface and slope) rather than a naive division by an arbitrary speed. The result shows distance and duration for any two points you search or click.",
      "It is the right tool for commute planning, estimating errand times, sizing a dog walk, or checking whether a hotel is genuinely 'walkable' to the conference venue — a claim straight-line distance routinely exaggerates. Coverage follows OpenStreetMap's pedestrian mapping, excellent in cities and improving in trails country; where a path is unmapped the engine sensibly sticks to walkable roads. For multi-leg walks the multi-stop planner handles waypoints, and the elevation profile tool adds the hills the routing engine only approximates. Free, keyless and private.",
    ],
  },
  "cycling-route-planner": {
    h2: "Bike-aware routing for commutes and tours",
    paras: [
      "Cyclists navigate a third network: cycleways and quiet streets are preferred, high-speed roads without access are avoided, and steep grades are penalised. This planner applies Valhalla's bicycle costing model, so the route it draws is one a rider would actually choose, and the time estimate reflects cycling speeds rather than car or foot assumptions. Enter start and destination by search or map click; distance and duration appear with the full path on the map for inspection.",
      "Use it to plan a commute, estimate a touring leg between towns, or compare how much calmer the bike route is than the driving one — running both tools side by side makes the difference vivid. Grade penalties mean hilly cities produce sensibly indirect tracks, while flat grids get direct ones. Trail coverage depends on OpenStreetMap mapping, which is strong where cycling culture is strong. For elevation truth on a chosen line, the elevation profile tool samples the Copernicus DEM; for multi-stage rides, the multi-stop planner chains legs with per-segment times.",
    ],
  },
  "multi-stop-route-planner": {
    h2: "Planning routes through many stops",
    paras: [
      "Real journeys have waypoints. Add up to twelve stops — by search or by clicking the map — and this planner returns one continuous route with per-leg distance and time plus grand totals, on your choice of driving, walking or cycling networks via the Valhalla engine. Stops can be reordered manually, reversed with one click, or optimised automatically: the optimizer asks the routing engine to solve the visiting order that minimises total distance while keeping your first stop fixed as the origin — the travelling-salesman solution couriers and sales drivers need.",
      "The finished route exports as GPX, ready to load into OsmAnd, Organic Maps, Garmin and other navigation apps, which turns the page into a genuine dispatch-lite workflow: build, optimise, export, drive. Times remain free-flow estimates and the interface labels them as such; unreachable combinations (island hops, closed borders) produce explained errors rather than imaginary routes. Whether it is a weekend road trip, a service call list or a school-run reorganisation, the planner keeps every number inspectable leg by leg, and every link shareable.",
    ],
  },
  "best-route-order": {
    h2: "Let the engine solve your stop order",
    paras: [
      "Given a list of stops, the shortest route usually does not visit them in the order you typed. This tool sends your stops to the routing engine's optimisation endpoint, which reorders the intermediate stops to minimise total travel distance while keeping your first stop as the fixed start — exactly the constraint real drivers have (depot, home, office). The reordered itinerary comes back drawn on the map with the new total distance, so the saving is visible, not just claimed.",
      "The underlying solver is a travelling-salesman heuristic on the actual road network, so results respect one-way streets and bridges rather than straight-line fantasy. For a dozen stops it is effectively optimal; the page says plainly that very large stop counts belong to dedicated logistics software. Typical wins are dramatic: ten errands typed 'logically' often contain 20–30% wasted kilometres. Pair the result with the GPX export from the multi-stop planner for navigation, or the distance matrix for a manual what-if comparison of candidate orderings.",
    ],
  },
  "delivery-route-planner": {
    h2: "A route planner built for drops and service calls",
    paras: [
      "Couriers, tradespeople and field teams share one workflow: a depot, a list of drops, and a clock. This planner frames the routing engine for exactly that: enter the depot as stop one, add each delivery by search or map click, then optimise the visiting order to minimise total driving distance. Per-leg and total figures stay on screen so a dispatcher can sanity-check the plan, and the finished route exports as GPX that loads into ordinary navigation apps on any phone — no proprietary account or device lock-in.",
      "Because ordering runs on the real road network, the plan respects one-way systems and river crossings that straight-line optimisers get wrong. Time windows are deliberately out of scope and labelled as such: work backward from the free-flow totals with your own local buffer. For coverage questions ('can we serve this suburb at all?') the drive-time map shows reachable areas instead of ordered stops, and for territory design the service-area tool exports polygons for proposals. Everything is free, browser-based and private.",
    ],
  },
  "route-distance-calculator": {
    h2: "Comparing car, foot and bike on the same pair",
    paras: [
      "One origin, one destination, three answers. This tool runs the same two places through the driving, walking and cycling routing models and presents distance and time side by side, making the trade-offs between modes immediately visible. Driving is fastest but park-bound; walking is shortest in dense grids thanks to pedestrian cut-throughs; cycling often beats both on mid-range urban trips — and now you can see it with real network routing rather than intuition.",
      "Each mode follows its own legal network through the Valhalla engine, so differences are genuine network effects, not rounding noise. Times are free-flow estimates and are labelled that way; add your local congestion buffer for car legs. The comparison is perfect for commute decisions, school-run planning, carbon conversations and feasibility checks ('is it realistically bikeable?'). When one mode wins your heart, the dedicated planners for driving, walking and cycling add stops, optimisation and GPX export for the full workflow.",
    ],
  },
  "travel-time-calculator": {
    h2: "How long will it take, really?",
    paras: [
      "Sometimes the distance is not the question — the clock is. Enter two places and a travel mode and this tool returns the estimated duration plus the distance behind it, computed by routing along the actual road or path network with Valhalla (OSRM fallback for driving). It is the fastest way to answer 'can I make the 3 pm meeting from here', 'is the airport feasible before check-in closes', or 'how long is the Saturday ride', without opening a full navigation app.",
      "The honesty rules are visible on the page: durations are free-flow network estimates, so peak congestion, weather and parking add real-world margins — a 20–40% buffer is a sensible rule in congested cities, and the tool says so. Ferries and toll roads behave as the open routing graph models them; where no legal route exists you get a clear explanation, not a number. Combine with the drive-time map when the question inverts from 'how long to get there' to 'how far can I get in this time'.",
    ],
  },
  "drive-time-map": {
    h2: "Isochrones: see everywhere you can reach in time",
    paras: [
      "A radius circle pretends you move equally in all directions; reality has motorways, rivers and one-way grids. This tool draws isochrones — genuine reachable-area polygons computed by the Valhalla routing engine on the road network — for the travel mode and time contours you choose, from 5 to 60 minutes. The polygons stretch along fast corridors and stop at barriers, telling the truth about accessibility that circles cannot. Choose drive, walk or cycle and up to four contours per run.",
      "That makes the page a decision instrument: house hunters see the real 30-minute commute envelope, restaurants visualise delivery reach, clinics map patient access, and planners compare before/after scenarios for a new bridge or line. Polygons export as GeoJSON for reports and GIS work, and the shareable URL preserves centre, mode and contours. The shapes' jaggedness and holes are data honesty, not bugs — networks are irregular. When you need geometric rather than temporal reach, the map radius tool provides the complementary circle.",
    ],
  },
  "service-area-map": {
    h2: "Turning response time into a mappable territory",
    paras: [
      "Businesses promise response times, not radii. This tool frames the isochrone engine for commercial use: set your base location, choose a target response time and travel mode, and get the exact area you can genuinely serve within that promise — a polygon that follows roads, stretches down highways and stops at rivers. Export it as GeoJSON to drop into proposals, territory designs or CRM overlays, or share the live map link with a client instead of a hand-wrawn circle.",
      "Because the polygon is network-derived, it defends scrutiny in a way buffer circles cannot: a 15-minute promise drawn as a circle silently over-promises across the river and under-promises along the motorway. Pair it with the population-within-radius tool to size the market inside the true service area, and the pin map to annotate depots and key accounts for the final figure. Times are free-flow estimates and are labelled as such — add your operational buffer before publishing a promise.",
    ],
  },
  "map-radius": {
    h2: "Drawing a true radius circle on the map",
    paras: [
      "Click, search or GPS a centre, set a radius in miles, kilometres or nautical miles, and this tool draws the circle — then lets you drag its edge handle to resize or drag the centre pin to move it, with every change live in the URL for sharing. Unlike flat-map circles that distort toward the poles, the boundary is computed as a true spherical cap: 128 vertices each placed by destination-point trigonometry, so a 50 km circle is genuinely 50 km in every direction at any latitude.",
      "The readout includes area and circumference in your chosen units, and the circle exports as GeoJSON, KML or GPX for use in GIS, reports or navigation apps. Classic uses are delivery zones, school catchments, radio coverage thinking, real-estate 'within X miles' searches and drone-range checks. One honest limit is labelled: a radius is geometric, not temporal — for 'how far can I drive in 15 minutes' the drive-time map is the right instrument, and the two tools link to each other. Free, private, no account needed.",
    ],
  },
  "multiple-radius-tool": {
    h2: "Several circles, one map, honest comparisons",
    paras: [
      "Catchments rarely come alone. This variant stacks multiple radius circles on a single map — different centres, different sizes, each with its own palette colour so overlaps stay readable. Every circle is independently draggable by centre pin and edge handle, radius inputs live in a compact list, and the whole composition exports as one GeoJSON collection with each circle's radius stored in its feature properties. It is the natural instrument for comparing store catchments, competitor reach, depot coverage or emergency-service overlap.",
      "Each boundary is a true spherical cap computed vertex by vertex, so comparisons remain geometrically honest at any latitude — the distortion that makes naive flat-map circles mislead is simply absent. Area readouts per circle let you quote sizes in square miles or kilometres directly. When your question is temporal ('15 minutes by car') rather than geometric, the drive-time map draws network-real polygons instead; when it is a single circle, the standard map radius tool is the leaner page. Everything runs browser-side and shares via URL.",
    ],
  },
  "distance-ring-generator": {
    h2: "Concentric distance bands around any point",
    paras: [
      "Distance rings answer 'what sits at each band?' Set a centre, an interval and a ring count — say every 5 km out to 30 km — and the tool draws labelled concentric boundaries, each one a true spherical cap at exactly that distance. The interval and outer radius accept any unit, and the finished ring set exports as GeoJSON for overlays in GIS or design tools. Delivery pricing zones, evacuation planning bands, noise contours around infrastructure and market ring analysis are the classic uses.",
      "Because every ring is computed point-by-point on the sphere, band widths stay honest toward the poles where projected circles compress. The generator caps at twelve rings per set to keep maps legible and files light. Rings are geometric distances; if your bands should mean minutes rather than kilometres, the drive-time map produces the network-real equivalent. Combine rings with the cities-within-radius tool to list what actually falls inside each band, turning a pretty diagram into an analytical one.",
    ],
  },
  "map-area-calculator": {
    h2: "Measuring land area straight off the map",
    paras: [
      "Click the corners of a field, plot, lake or district and this tool closes the polygon and reports its true spherical area — square metres, hectares, acres, square kilometres and square miles — plus the perimeter. The math uses the spherical-excess method on the WGS84 sphere, which stays accurate from garden plots to county-sized shapes, where flat 'shoelace on lat/long' formulas silently produce nonsense. Undo removes a vertex, closing is one click, and the finished polygon exports as GeoJSON or KML for records and GIS.",
      "Farmers checking paddock sizes, buyers verifying listing claims, teachers demonstrating hectares, drone pilots sizing survey jobs — the workflow is the same: click, close, read, export. At this resolution the tool measures the boundary you draw; for legal survey grades, licensed surveyors and local datum transformations remain authoritative, and the page says so. When the shape is a circle the circle-area calculator is faster, and when you already have vertex coordinates the polygon calculator accepts pasted lists directly.",
    ],
  },
  "polygon-area-calculator": {
    h2: "Area and perimeter from drawing or raw vertices",
    paras: [
      "This tool measures any polygon two ways: draw it by clicking the map, or paste a list of 'lat, lng' vertices copied from a dataset, GPS log or GIS export. Either path produces the same rigorous result — spherical-excess area on the WGS84 sphere plus perimeter length — presented in every common unit and exportable as GeoJSON or KML. Pasting makes it a verification instrument: check what a shapefile claims, audit a colleague's boundary, or sanity-check a geofence before it ships.",
      "The validator is honest about classic failure modes: fewer than three vertices, swapped coordinate order, or a ring that accidentally wraps the globe all produce clear messages instead of absurd numbers. Because the math integrates on the sphere, results hold for high-latitude shapes where projected-area tools drift. Holes are handled pragmatically — measure the outer ring, subtract the hole as a second measurement — and labelled as such. For pure circle geometry the circle-area tool is the one-click companion.",
    ],
  },
  "circle-area-calculator": {
    h2: "Circle area with a live map reality check",
    paras: [
      "Enter a radius or diameter in any unit and get area and circumference in all of them — hectares, acres, square kilometres, square miles, metres and feet — computed with πr² and, for large circles, cross-checked against the spherical-cap formula that respects Earth's curvature. The live map draws the circle at your centre, which is the feature that saves people: a '5 km radius' feels small in a spreadsheet and looks enormous over a city centre; seeing it ends the argument before it starts.",
      "The curvature cross-check matters at scale: beyond roughly 50 km radius the flat formula overestimates measurably, and the page shows both numbers with a plain explanation instead of hiding the divergence. Drag the centre marker or search a place to reposition; the URL keeps your setup shareable. Typical uses range from irrigation planning and radio-coverage back-of-envelope work to event catchment thinking. When the boundary should be drawable rather than circular, the map area calculator takes over with free-form polygons.",
    ],
  },
};
