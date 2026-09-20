// Long-form educational essays, one per category. Original editorial content
// that composes into each tool page's deep guide section.
import type { CategoryId } from "@/lib/registry";

export const CATEGORY_ESSAYS: Record<CategoryId, { title: string; paras: string[] }> = {
  location: {
    title: "Understanding location lookups: how a map knows where you are",
    paras: [
      "Every location question — what county, what city, which ZIP, which country — is answered in two stages. First, a position: your device fuses GPS satellites, Wi-Fi fingerprints and cell-tower timing into a latitude/longitude with an accuracy that ranges from a few metres outdoors to a city block indoors. Second, a translation: that raw pair of angles is matched against boundary and address data to produce human labels. The labels are only as good as the underlying map, which is why these tools draw on OpenStreetMap's community-maintained boundaries — administrative relations that follow legal lines rather than postal habits.",
      "It is worth knowing where each answer level comes from, because they disagree in interesting ways. Your mailing city follows postal routes; your legal city follows municipal boundaries; your county follows a third geometry; and your timezone follows a fourth, political one. A point near a border can honestly belong to different answers depending on the question. Good tools keep those layers separate and show them side by side, which is exactly the layout used here: place, county, state, postcode and country each in their own field, each copyable on its own.",
      "Privacy deserves the same care as accuracy. Browser geolocation shares your position with the open page only, and reverse geocoding sends that coordinate to a public service that answers and forgets. Nothing needs to be stored for any of this to work — a design principle you can verify in your browser's network tab, where the only outgoing request carries exactly one coordinate pair.",
    ],
  },
  distance: {
    title: "The geometry of distance: why the crow flies in arcs",
    paras: [
      "Distance on a planet is not distance on paper. The shortest path between two points on Earth is an arc of a great circle — a circle whose centre is the planet's centre — and every serious distance tool computes that arc, not a straight line on a flat map. The standard formula, haversine, turns two latitudes and a longitude difference into a central angle and multiplies by Earth's mean radius. On the WGS84 sphere it agrees with survey-grade ellipsoidal geodesics to about three parts in a thousand, which is far tighter than the uncertainty in most real questions, like where exactly 'the city centre' is.",
      "Bearings complete the picture. The initial bearing is the compass angle you would steer at departure; on a great circle it drifts continuously as the route crosses meridians, so the final bearing at arrival is generally different. That drift is why intercontinental flights arc toward the poles on flat charts — they are not detouring, they are taking the shortest path, and the map is what bends. Tools that report a single 'direction' for a long route are hiding this geometry; the honest display shows initial bearing, final bearing and the compass point for humans.",
      "Finally, keep the family of distances distinct in your head: straight-line (the physical lower bound, right for radio and wildlife), road distance (what you drive, always equal or longer), and travel time (road distance reshaped by speed limits and network structure). Comparing the first two tells you how much geography taxes your route — a number that is itself interesting, whether you are planning a commute or pricing a delivery zone.",
    ],
  },
  routing: {
    title: "How routing engines turn streets into answers",
    paras: [
      "A routing engine ingests the road and path network as a graph — intersections as nodes, street segments as edges, each with speed, access rules and geometry — then searches it for the cheapest path under a costing model. Driving, walking and cycling are genuinely different networks: pedestrians slip through footways and cut-throughs cars cannot use, cyclists avoid motorways and steep grades, cars ignore steps entirely. That is why the same two points produce three different routes and three different times, and why comparing them is often the most informative thing you can do with a trip.",
      "Isochrones invert the question from 'how long to get there' to 'everywhere reachable in this time'. A proper isochrone is not a circle: it grows along fast corridors, pinches at bridges and rivers, and holes around barriers. When the shape looks jagged, that is the network telling the truth. These polygons make honest service-area and catchment maps — the circle version always over-promises across the river and under-promises along the motorway.",
      "One caveat belongs on every routing result: free public engines report free-flow times derived from speed limits and road classes, not live congestion. Treat a 25-minute result as the physics of the network; your city's rush hour adds the sociology. Multi-stop optimisation adds a second layer of honesty: reordering stops to minimise distance is the travelling-salesman problem, and engine heuristics solve it beautifully at driver scale — the difference between a sensible morning and a wasteful one is frequently twenty percent of the kilometres.",
    ],
  },
  radius: {
    title: "Circles, polygons and the honest measurement of area",
    paras: [
      "A radius circle on a globe is a spherical cap: the set of points at a fixed surface distance from a centre. Drawn naively on a flat map it distorts badly toward the poles, so correct tools place each boundary vertex by destination-point trigonometry — stepping out the radius at 128 bearings — which keeps a 50 km circle genuinely 50 km wide at any latitude. The same care applies to area: the right method integrates around the boundary on the sphere (spherical excess), remaining accurate from garden plots to province-sized shapes, where flat shoelace formulas on raw lat/long silently produce nonsense.",
      "Units carry culture as well as math. American land talks in acres, agriculture worldwide in hectares, plans in square metres, headlines in square miles. The conversions are exact by definition — a hectare is 10,000 m², an acre 4,046.86 m² — but intuition is not, which is why seeing the circle on a map matters: a five-kilometre radius feels modest in a spreadsheet and looks enormous over a city centre. The map is the unit your brain trusts.",
      "Rings and multiple circles extend the single circle into analysis: concentric distance bands price deliveries and plan evacuations; stacked catchments compare stores, depots or services. And when reach is temporal rather than geometric — 'fifteen minutes by car' — the honest instrument is the isochrone, because roads make time anisotropic. Knowing which circle you need, geometric or temporal, is half the craft of spatial reasoning.",
    ],
  },
  coordinates: {
    title: "The many languages of a single point",
    paras: [
      "One physical spot on Earth can be written a dozen ways: decimal degrees for software, degrees-minutes-seconds for charts and handhelds, UTM eastings and northings for field work, MGRS lettered squares for military prose, Plus Codes for places without addresses. None is more 'true' — they are notations over the same WGS84 datum, the reference frame GPS itself speaks. Conversion between them is exact math, which is why it can run entirely in your browser with no service and no error creeping in.",
      "The traps are human, not mathematical. Swapping latitude and longitude is the classic — GeoJSON stores [lng, lat] while most APIs expect (lat, lng), and an offshore point is usually that typo. Hemisphere letters and minus signs must never coexist. And precision has a physical meaning: each added decimal degree is roughly a tenfold shrink, so five decimals is about a metre, six is beyond what consumer GPS can claim. Choosing rounding deliberately is choosing honesty.",
      "Datums are the deep end: coordinates are angles against a model of Earth's shape, and older local datums (NAD27 and friends) shift the same physical point by tens of metres relative to WGS84. A consistent, unexplained offset between an old survey and your GPS is usually that story. For everyday web mapping the datum is WGS84 end to end, and keeping everything in it — as these tools do — makes round trips exact.",
    ],
  },
  files: {
    title: "KML, GeoJSON, GPX: the three dialects of geographic data",
    paras: [
      "Three formats carry most consumer geographic data, and each reflects its ancestry. KML is XML from the Google Earth era: folders, styling, descriptions and ExtendedData, beloved by saved-place collections. GeoJSON is plain JSON from the web-mapping world: trivial to parse, diff and version, native to every modern map library, properties free-form. GPX is the GPS device format: waypoints, tracks and routes, with per-point elevation and timestamps as first-class citizens. Conversions between them are mostly faithful for geometry and lossy for everything else — polygons degrade to boundary tracks in GPX, styling evaporates into GeoJSON, and a wise workflow always keeps the original file.",
      "Because these files are often personal — tracks, client sites, survey points — the right place to open them is your own browser. Parsing with built-in readers (FileReader, DOMParser, JSON.parse) means nothing is uploaded, ever, and validation errors can be precise: trailing commas, unquoted keys and KMZ-inside-ZIP confusion are all detectable and explainable locally. A trustworthy viewer tells you exactly what it understood: feature counts by geometry type, property tables, bounding boxes.",
      "GPX deserves special respect for its elevation story. Gain and loss are sums of positive and negative differences between consecutive trackpoints, and raw GPS elevation is noisy, so honest tools show the profile and the caveats together. Duration appears only when timestamps exist; when they don't, the right behaviour is to say so rather than invent a clock. Data hygiene, like privacy, is a feature you can feel.",
    ],
  },
  creation: {
    title: "Making maps that communicate",
    paras: [
      "A custom map is an argument: these places matter, in this order, with these names. The craft is restraint — a handful of labelled, colour-coded pins reads instantly, while thirty unstyled dots read as noise. Colour should carry category, labels should carry identity, and the viewport should be framed so the subject fills the frame. Export quality closes the loop: a PNG at screen pixel ratio drops straight into slides and worksheets, while GeoJSON, KML and CSV keep the same data editable for the next person.",
      "Sharing deserves the same thought. The most durable share format for a small custom map is the URL itself: pins, colours and labels encoded as parameters reopen exactly as left, on any device, with no account and no server storage. It is also the most honest privacy model — the map exists only where you sent the link.",
      "When the dataset grows beyond a few dozen points, the instrument changes: clustering keeps tens of thousands of rows fluid, category columns replace hand-picked colours, and imports replace clicks. Knowing when to move from pin-dropping to data-mapping is the difference between a charming figure and a maintainable one.",
    ],
  },
  earth: {
    title: "Reading the third dimension: terrain, visibility and deep time",
    paras: [
      "Everything on a flat map is a rumour about height. Digital elevation models — satellite-derived grids like Copernicus GLO-90 at roughly 90 metres — turn the rumour into numbers: ground height at any coordinate, cross-sections along any line, ascent and descent totals for any route sketch. The models see terrain, not trees or buildings, and vertical accuracy of a few metres is typical; knowing that is the difference between using them wisely and over-trusting them.",
      "Visibility questions add physics. Over open ground the horizon sits at about 3.86 × √(height in metres) kilometres once standard atmospheric refraction is included; between two observers the ranges add. Between specific points, terrain enters through the same DEM: sample the line, add Earth-curvature drop with the conventional refraction coefficient, and the verdict — clear or blocked, and where — follows by comparison. It is telecom planning's classic calculation, now comfortably runnable in a browser.",
      "The deep-time companions — antipodes, climate zones, hardiness bands, seismicity — reframe your point on longer clocks. The antipode is pure geometry with a geographic punchline (usually ocean). Köppen classes and hardiness zones compress thirty years of temperature and precipitation into letters that gardeners and planners trust. Recent earthquakes are the live signature of faults. Each is an estimate with a stated recipe; together they make a portrait of place that no street map can offer.",
    ],
  },
  sun: {
    title: "The clockwork sky: sun, moon and the politics of time",
    paras: [
      "Solar times are computable to about a minute from first principles: Earth's orbit and tilt give the sun's declination each day, your latitude sets the hour angle at which the sun crosses any chosen altitude, and the equation of time reconciles the sundial with the clock. Official sunrise uses a zenith of 90.833° — the sun's disc centre slightly below the horizon — because atmosphere refracts light over the rim. Inside the polar circles the formulas return their honest extremes: midnight sun and polar night, no fabricated times.",
      "Time zones are the political overlay. A coordinate has no clock of its own; the IANA tz database encodes humanity's answers, down to daylight-saving quirks, and modern browsers resolve them natively. The divergence between solar and wall-clock time — vast in places like western China or summer-evening Spain — is a policy choice you can see in the numbers, and comparing several zones at once turns that fact into a practical meeting window.",
      "The Moon completes the picture with simpler geometry: phase is the Sun–Earth–Moon angle, global at any instant, cycling every 29.53 days. Photographers care about the sun's altitude bands (golden hour is the warm window around ±a few degrees), gardeners about day length, planners about both. Every one of these quantities is local math — no service required — which makes the sky the most privacy-friendly dataset of all.",
    ],
  },
  lines: {
    title: "Five lines that organise the planet",
    paras: [
      "The Equator, the two tropics and the two polar circles are not drawn on the land; they are drawn on the sky. The tropics sit one axial tilt (about 23.44°) from the Equator — the latitudes where the sun stands directly overhead at solstice — and the polar circles sit one tilt from the poles, where solstice sun grazes the horizon for a full day. Because the tilt oscillates over 41,000-year cycles, every one of these lines drifts slowly, a few tens of metres a year: geography with a pulse.",
      "Meridians are conventions with consequences. The Prime Meridian at Greenwich is an 1884 agreement, and the GPS era exposed its seam: the WGS84 zero meridian runs about 100 metres east of the historic brass line, because satellite geodesy measures a different 'zero' than a telescope in a London courtyard. Its counterpart, the International Date Line, is even more human — a zig-zag of national choices rather than a treaty, bent so island nations can share a working week.",
      "Tracing these lines on a live map turns abstraction into place: thirteen countries under the Equator, eight under the Prime Meridian, the Date Line's great Kiribati bend. And clicking them reads coordinates back to you, which is the whole point of an interactive atlas — the grid stops being a diagram and becomes somewhere.",
    ],
  },
  network: {
    title: "Understanding IP addresses, geolocation and network details",
    paras: [
      "An IP address identifies a network connection on the Internet, not a precise physical person or address. Public IP lookup services can associate an address with a country, region, city, autonomous-system number, ISP or organization using routing and geolocation databases. These fields are estimates and can be affected by VPNs, mobile networks, carrier-grade NAT, proxies and corporate gateways.",
      "IP geolocation is different from browser GPS. A browser can request device location with permission and may achieve much finer accuracy, while an IP database usually identifies the approximate area associated with the network. For that reason, IP results should be treated as network context rather than proof of where a person is physically standing.",
      "Network metadata also changes over time. ISPs reassign addresses, organizations change providers and geolocation databases update their records. When accuracy matters, compare multiple signals and check the date and source of the data instead of treating an IP lookup as a permanent address record.",
    ],
  },
  population: {
    title: "People on maps: estimates, vintages and honest numbers",
    paras: [
      "Population tools live on a spectrum from census-exact to clearly-labelled estimate, and the honest move is to say where each number sits. Authoritative counts come from census bureaus and their boundary files — the right source for legal and funding work. Quick comparative work, by contrast, often only needs a transparent estimate: a curated set of major cities with approximate municipal populations and a stated vintage, summed inside your radius with the contributing list published so the total is inspectable rather than asserted.",
      "Density and cost indices carry the same duty. Metro population over built-up area gives people-per-km² figures whose ratios between cities are trustworthy even when absolutes are rough; cost-of-living indices compress housing, groceries and services into one rent-inclusive number anchored to a familiar baseline. Every snapshot ages — vintages should be printed next to the figures, not buried in a footnote.",
      "Used well, these estimates sharpen questions rather than answer them finally: 'which of these three sites reaches more people?', 'what would this salary feel like there?', 'how differently do these two cities live?'. The map makes the comparison spatial, the table makes it concrete, and the CSV export hands it to the next step of your analysis.",
    ],
  },
};
