// Long-form on-page content for Creation, Earth, Sun/Moon, Lines and Population tools (~170 words each).
export const COPY5: Record<string, { h2: string; paras: string[] }> = {
  "pin-drop-map": {
    h2: "Make a shareable pin map in seconds",
    paras: [
      "Click the map to drop a pin, name it, pick its colour, repeat — and you have a shareable custom map. Pins drag to reposition, labels render on the map, and the entire composition lives in the URL, so the share link reopens exactly as you left it with no account and no server storage. Export paths cover every downstream need: a PNG snapshot of the current view including basemap, GeoJSON and KML for GIS, and CSV for spreadsheets.",
      "It is the right instrument for meet-up suggestions, itinerary highlights, garage-sale crawls, filming locations, classroom exercises and event logistics — any moment when 'here are five dots with names' communicates faster than prose. For large datasets the CSV-to-map tool imports hundreds to tens of thousands of points with clustering, and for styled presentation maps the custom marker variant tunes colours and framing. Everything is free and private; the only network traffic is map tiles.",
    ],
  },
  "custom-marker-map": {
    h2: "A pin map tuned for presentation",
    paras: [
      "Same engine as the pin drop map, framed for output: choose a colour per marker, keep labels legible, position the viewport deliberately, then export a crisp PNG that matches your screen's pixel ratio — retina-sharp for slides, proposals, invitations and worksheets. The workflow stays URL-native, so a client link reproduces the map without anyone installing anything, and GeoJSON/KML/CSV exports keep the same data usable beyond the image.",
      "The colour palette is deliberately small and high-contrast so categories stay readable when printed; clicking a marker's swatch cycles it. Because the export captures the rendered basemap, the PNG is ready to paste as-is, while the GeoJSON preserves editability for later. When the story needs areas instead of points — catchments, territories, response zones — the radius and drive-time tools draw the polygons; when it needs hundreds of points, CSV-to-map clusters them. Free, browser-based, no watermark on anything you create.",
    ],
  },
  "elevation-finder": {
    h2: "Reading terrain height anywhere on Earth",
    paras: [
      "Click the map or paste coordinates and this tool reports the ground elevation at that exact point, in metres and feet, sampled from the Copernicus GLO-90 global digital elevation model via the free Open-Meteo elevation API. No account, no key, real satellite-derived terrain data at roughly 90-metre resolution. Sample several points to compare a site's high and low corners, check a pass before a trip, or settle the 'how high is my town' question with a number instead of a guess.",
      "Two honesty notes stay attached to every result: the value is terrain height above sea level, not building altitude, and DEM vertical accuracy is typically a few metres — better on open flat ground, noisier under steep slopes and forest canopy. For survey-grade work, national geodetic benchmarks remain authoritative. The point is shareable via URL, and the tool chains naturally into the elevation profile for a line, the line-of-sight calculator for visibility, and the horizon calculator for how far that height lets you see.",
    ],
  },
  "elevation-profile": {
    h2: "The cross-section between two points",
    paras: [
      "Pick two points and this tool samples the Copernicus GLO-90 elevation model sixty times along the great-circle line between them, then plots the full cross-section: total ascent, total descent, minimum and maximum elevation and line length. It is quick-and-dirty route reconnaissance — see the climb before you commit to the ride, check a pipeline corridor's relief, or understand why the direct hiking line is the hard one.",
      "Sixty samples balance detail against the API's 100-coordinate limit: on a 10 km line each sample spans about 170 m, which resolves hills honestly while smoothing micro-terrain. The profile follows the straight surface line, not roads — road profiles differ where roads switchback — and the page says so. The same samples power the line-of-sight calculator, which adds Earth curvature and refraction to answer visibility questions. Elevation data is terrain-only: buildings and forests are invisible to the DEM, and results are labelled accordingly.",
    ],
  },
  "line-of-sight-calculator": {
    h2: "Can you see from A to B? Terrain says.",
    paras: [
      "Set an observer point with eye height and a target point with target height, and this tool samples terrain along the line, applies Earth-curvature drop with standard atmospheric refraction (k = 0.13), and rules whether the view is clear. If terrain blocks it, you learn roughly where along the line the obstruction bites, shown on the elevation profile. It is the right pre-check for radio links, antenna placement, viewpoint promises and 'will the new building block my sunset' debates.",
      "The verdict is explicitly a terrain line of sight: the 90-metre Copernicus DEM sees hills and valleys but not trees, walls or spires, so forested corridors need field truth. Heights are additive inputs — a 10 m mast on a hill counts hill plus mast — and the refraction model is the conventional one used in telecom planning. Every input and result is shareable via URL. Sibling tools extend the same data: horizon distance for a single observer, elevation profile for the raw cross-section.",
    ],
  },
  "horizon-distance-calculator": {
    h2: "How far can you see from a given height?",
    paras: [
      "Enter an eye height and the tool returns the distance to the horizon, computed from the geometric formula d ≈ √(2Rh) with Earth's radius and the standard refraction correction that bends light slightly over the curve — about 3.86 × √(height in metres) kilometres. A beach stance (1.7 m) sees roughly 4.7 km; a 100 m cliff, about 38 km. Add a second height and you get the classic ship-to-ship figure: the sum of both horizons, the maximum range at which two observers can see each other over open water.",
      "The page explains the physics briefly — curvature sets the geometric horizon, refraction extends it about 8% in standard conditions, and weather can stretch or shrink that — so the number arrives with its caveats rather than false precision. Elevation at the observer is your input; pull it from the elevation finder for real sites. Combine with the line-of-sight calculator when specific terrain between the points matters, or the antipode tool when the question flips from 'how far can I see' to 'what is directly under my feet, one Earth-diameter down'.",
    ],
  },
  "antipode-finder": {
    h2: "Dig straight down: where do you emerge?",
    paras: [
      "Every point on Earth has exactly one antipode — the point diametrically opposite, found by flipping latitude's sign and rotating longitude by 180°. Click the map or search a place and this tool shows both pins, the antipode's coordinates, and reverse-geocodes what is actually there: for most of humanity, open ocean, because water covers 71% of the planet and land-to-antipodal-land pairs are rare (Spain and New Zealand are the classic exception).",
      "The math is exact and instant, running locally; the interesting part is the geography it reveals about how unevenly land is distributed. The result is copyable, shareable via URL, and one click away from a full address lookup of the opposite side. Teachers use it to make hemispheres concrete; travellers use it to find their 'opposite' for the photo meme. It pairs naturally with the great-circle calculator — the antipode is the unique point at the maximum possible surface distance, about 20,015 km away.",
    ],
  },
  "sunrise-sunset-calculator": {
    h2: "Solar times for any place and date",
    paras: [
      "Pick a location and a date and the tool computes sunrise, sunset, solar noon and total day length using the NOAA solar position algorithm — the standard reference quality for civil use, accurate to about a minute for dates near the present. Times display in UTC plus your device's local clock, with a plain explanation that a coordinate has no political timezone of its own: solar time and wall-clock time diverge strongly in places like western China or Spain.",
      "Polar behaviour is handled honestly: inside the polar circles the page reports midnight sun or polar night instead of fabricating times, and the 90.833° zenith convention (official sunrise includes atmospheric refraction) is documented rather than hidden. Photographers plan golden hour, farmers plan irrigation windows, travellers plan sunsets, and teachers demonstrate why seasons differ — all with the same free, local computation. The day-length calculator extends the result into seasonal context; the moon tool continues into the night sky.",
    ],
  },
  "day-length-calculator": {
    h2: "How many hours of daylight, exactly?",
    paras: [
      "Day length is latitude and date, nothing else: the tilt of Earth's axis decides how long your hemisphere's daily arc keeps the Sun above the horizon. This tool computes it for any place and date with the NOAA algorithm, reports the duration in hours and minutes alongside sunrise, sunset and solar noon, and makes the seasonal story legible — approach a solstice and the number stretches or shrinks toward its annual extreme, which at high latitudes becomes the drama of midnight sun and polar night.",
      "The result matters more than people expect: solar-panel yield estimates, crop and garden planning, photography scheduling, depression-aware winter planning, and trip timing ('how much light will the hike actually get?'). Elevation barely moves the number and the page says so; refraction conventions are stated, not smuggled. Pair it with the sunrise-sunset calculator for clock times, the moon-phase tool for the night counterpart, and the geographic-lines pages to see the latitudes — tropics and polar circles — that govern the whole system.",
    ],
  },
  "moon-phase-tool": {
    h2: "The Moon's phase for any date",
    paras: [
      "Pick any date and this tool reports the Moon's phase name, its age in days within the 29.53-day synodic cycle, the illuminated fraction, and the calendar dates of the next new and full moons. The computation is the classical one — elapsed time since a reference new moon, folded by the synodic period — accurate to a few hours for dates within a century, which is far finer than any planning need: photography nights, tide-adjacent beach trips, gardening folklore, religious calendars and stargazing logistics.",
      "A key fact is stated plainly: phase is global geometry — the same everywhere on Earth at a given moment — while the Moon's apparent orientation flips between hemispheres. The page sketches the cycle's four anchor moments and what each means for evening visibility, turning the emoji into understanding. Everything runs locally with no service calls. For the daylight side of the sky the sunrise and day-length calculators complete the picture, and the antipode tool flips the observer instead of the clock.",
    ],
  },
  "equator": {
    h2: "The Equator: 0° latitude, explored live",
    paras: [
      "The Equator is the only parallel that is a great circle — 40,075 km long, equidistant from the poles, and the reference line from which all latitude is measured. On this page it is drawn as a live highlight across an interactive world map: trace it through thirteen countries and three oceans, click any point on it to read exact coordinates, and watch the line hold perfectly straight in any projection that respects parallels.",
      "The accompanying facts correct the folklore: the Equator is hot on average but not the hottest belt (subtropical deserts win on dry air and clear sky), and the 'water swirls differently' demo is theatre, not physics — Coriolis never decides a sink. What is real: the fastest sunrises and sunsets on Earth, the weakest horizontal Coriolis component, and a slight bulge in Earth's shape that makes equatorial summits the farthest points from the planet's centre. Sister pages trace the tropics and polar circles that complete the latitude system.",
    ],
  },
  "prime-meridian": {
    h2: "0° longitude and the origin of world time",
    paras: [
      "The Prime Meridian is the agreed zero of longitude and the anchor of global time zones, running pole to pole through the Airy Transit Circle at Greenwich. The map highlights its full trace through eight countries — United Kingdom, France, Spain, Algeria, Mali, Burkina Faso, Togo and Ghana — plus Antarctica, and clicking any point reads exact coordinates off the live line.",
      "Two facts make the page worth a visit even for the well-read. First, the 1884 international conference chose Greenwich for practical, not geometric, reasons — most shipping charts already used it. Second, your GPS will not read exactly 0° at the historic brass line: the WGS84 zero meridian sits about 102 metres east, a tidy demonstration that datums are conventions, not truths. Compare with the International Date Line page, where the same meridian logic meets the calendar, and with the Equator for the latitude half of the grid.",
    ],
  },
  "international-date-line": {
    h2: "Where tomorrow becomes yesterday",
    paras: [
      "Roughly following 180° longitude, the International Date Line is the seam where the calendar day turns: cross it westbound and gain a day, eastbound and lose one. The map draws the line's real shape — not a straight meridian but a series of deliberate zig-zags that keep island nations on a single calendar date, most famously Kiribati's 1995 bend that shifted the line thousands of kilometres so one country could share one working week.",
      "The page explains why the line is customary rather than treaty law: it is the emergent result of national timezone choices, which is exactly why it wiggles. At the poles all meridians converge and the question dissolves into whichever station clock you consult — a nice edge case for teachers. Clicking the highlighted line reads live coordinates at any point. It completes the meridian story begun on the Prime Meridian page, and pairs with the antipode tool, since 180° is where antipodes swap hemispheres of the day.",
    ],
  },
  "tropic-of-cancer": {
    h2: "The northern limit of the overhead Sun",
    paras: [
      "The Tropic of Cancer, at about 23.44° N, marks the northernmost latitude where the Sun can stand directly overhead — which it does at the June solstice. Its position is not arbitrary but equal to Earth's current axial tilt, and the map traces it across sixteen countries from Mexico through the Sahara, Arabia, India and southern China. Clicking the highlighted parallel reads exact coordinates anywhere along it.",
      "Two subtleties reward attention. The tilt oscillates over a 41,000-year cycle, so the tropic is slowly drifting — currently poleward by roughly 15 metres a year — a fact that makes 'fixed' geography quietly dynamic. And the name is astronomical archaeology: two millennia ago the June solstice Sun sat against the constellation Cancer; precession has since moved the backdrop while the label stayed. Compare the southern twin, the Tropic of Capricorn, and see both framed by the Equator and polar circle pages.",
    ],
  },
  "tropic-of-capricorn": {
    h2: "The southern limit of the overhead Sun",
    paras: [
      "Mirror of the northern tropic, the Tropic of Capricorn at about 23.44° S is where the December solstice Sun stands directly overhead — the southern boundary of the tropics and the line this page draws live across South America, southern Africa, Madagascar and Australia. Click anywhere on the highlight to read precise coordinates, and use the related latitude pages to see the whole system the line belongs to.",
      "The name, like its northern twin's, is a fossil of precession: the December solstice Sun now appears against Sagittarius, but Capricorn kept the label it earned two thousand years ago. Geographically the line threads some of Earth's great dry belts — the Atacoma's edge, the Kalahari, the Australian outback — because the descending air of the Hadley cell parks its aridity around the tropics. Its position equals the axial tilt and drifts slowly with it; the methodology of the tilt is summarised on the sister tropic page.",
    ],
  },
  "arctic-circle": {
    h2: "The latitude of midnight sun",
    paras: [
      "North of 66.56° N — 90° minus the axial tilt — there is at least one day each year when the Sun never sets and one when it never rises. The map traces that boundary across Scandinavia, Russia, Alaska, Canada and Greenland; clicking it reads exact coordinates, and the day-length calculator lets you push any latitude past the threshold and watch daylight snap to 24 or 0 hours.",
      "The circle is not a wall of cold but a boundary of light; roughly two million people live inside it, in towns from Tromsø to Norilsk, and the page keeps the human geography alongside the astronomy. Like the tropics, the circle drifts slowly as the tilt oscillates, and like every line on the platform it is drawn from the same WGS84 grid your GPS uses. Finish the system with the Antarctic Circle, or test solstice behaviour live with the sunrise and day-length tools at any latitude you choose.",
    ],
  },
  "antarctic-circle": {
    h2: "The southern gate of the polar day",
    paras: [
      "At 66.56° S the Antarctic Circle closes the latitude system: south of it, the Sun stays above the horizon for at least one December day and below it for at least one June day. The live map traces the line across the Southern Ocean and the Antarctic margin, and clicking any point reads exact coordinates. Nearly everything inside is one continent and its ice — the inverse of the Arctic, which is an ocean ringed by continents.",
      "That inversion explains the asymmetry of the poles: an isolated, ice-loaded continent behind a ring of fierce currents and winds makes the south profoundly colder, and the circle's human footprint shrinks to research stations rather than towns. The page links the day-length calculator so you can feel the threshold — pick a latitude just north, then just south, and watch the annual light regime change character. With the Arctic Circle, the tropics and the Equator, it completes the five lines that organise Earth's light.",
    ],
  },
  "cities-within-radius": {
    h2: "Every major city inside your circle",
    paras: [
      "Set a centre and a radius and this tool lists every city from its curated dataset of 200+ major world cities and capitals that falls inside, sorted by distance with bearing, population and a map marker per city. Results export as CSV for reports and slides. It is the quick lens for 'what metros can I reach from here', market scans, trivia ('how many capitals within 1,000 km of Vienna?') and sanity-checking regional intuitions against real geometry.",
      "Distances are haversine great-circle measures from your centre to each city's coordinates, and the dataset is deliberately curated — major centres with approximate municipal populations of about-2020 vintage — which the page states plainly. For exhaustive point-of-interest lists the Nearby Places Finder queries live OpenStreetMap instead; for population totals the sibling tool sums this same list transparently. The radius draws as a true spherical circle, so the visual and the list always agree, at any latitude.",
    ],
  },
  "population-within-radius": {
    h2: "A transparent population estimate, not a black box",
    paras: [
      "Set a centre and radius, and this tool sums the populations of every major city in its curated dataset that falls inside the circle — then shows you the entire contributing list, distance by distance, so the number is inspectable rather than asserted. That transparency is the product: most 'population radius' widgets hide their assumptions, while this one publishes them, including the honest caveat that rural and small-town settlement is undercounted, making the total a lower bound for most regions.",
      "The dataset carries an explicit about-2020 vintage and municipal-level definitions, labelled on every result. For authoritative US figures the Census Bureau's APIs and TIGER boundaries are the right instruments, and the data-sources page links the path; for market back-of-envelope work, event sizing and classroom demos, an instant, explainable estimate beats a polished black box. Export the breakdown as CSV, pair it with the drive-time map to swap geometry for reachability, or with the service-area tool to frame the same question in minutes.",
    ],
  },
};
