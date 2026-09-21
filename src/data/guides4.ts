import type { Guide } from "./guides";

/**
 * New editorial guides — written for real search questions people type,
 * linked to live MapBench tools, practical and specific (not filler).
 */
export const GUIDES4: Guide[] = [
  {
    slug: "find-my-location-gps-vs-ip-vs-vpn",
    title: "Find My Location: GPS vs IP Address vs VPN — What's Actually Accurate?",
    description:
      "Why your phone, your public IP, and a VPN can all report different places — and which one to trust when you need real coordinates.",
    date: "2026-09-21",
    readMins: 8,
    blocks: [
      {
        t: "p",
        text: "You open a ‘find my location’ tool, grant permission, and get a pin. Then you turn on a VPN and the pin jumps to another city. Or you refuse GPS and the same page still names a town — just the wrong one. None of that is the tool ‘breaking.’ Three different systems are answering three different questions, and people mix them up constantly.",
      },
      {
        t: "h2",
        text: "GPS (and network-assisted location) — where the device thinks it is",
      },
      {
        t: "p",
        text: "When a site asks for your location through the browser, your device may use GPS satellites, Wi‑Fi access points, cell towers, or a blend. Outdoors with a clear sky, modern phones often land within about 5–15 metres. Indoors, under thick roofs, or in dense cities with multipath reflections, the fix can drift to tens or hundreds of metres. The important part: this answer is about the handset or laptop, not about the network path your packets take to the website.",
      },
      {
        t: "ul",
        items: [
          "Best for: ‘Where am I standing right now?’",
          "Needs: user permission in the browser",
          "Fails when: permission is denied, sensors are weak, or you’re indoors",
          "Does not care whether a VPN is on — GPS is local to the device",
        ],
      },
      {
        t: "h2",
        text: "Public IP geolocation — where the internet thinks your traffic exits",
      },
      {
        t: "p",
        text: "Every request to a website comes from a public IP address. Databases map those addresses to approximate cities or regions based on how internet providers register and route blocks of numbers. That estimate is often good enough for language defaults or rough analytics. It is not a street address, and it is not proof of where a person is sitting. Carrier-grade NAT, corporate gateways, and mobile pools routinely put dozens of people behind one public IP far from their real neighbourhood.",
      },
      {
        t: "note",
        text: "If GPS is off and you only use IP, a ‘find my location’ result is really ‘find my network exit.’ Treat city-level as optimistic and street-level as fiction.",
      },
      {
        t: "h2",
        text: "What a VPN changes (and what it doesn’t)",
      },
      {
        t: "p",
        text: "A VPN encrypts your traffic and sends it out through a server in another city or country. Websites then see that server’s public IP, so IP-based location follows the VPN exit. Device GPS, if you still allow it, can still report your real coordinates — which is why one tool can show ‘VPN city’ on the IP card and ‘real street’ on the map pin at the same time. That is not a contradiction; it is two sensors.",
      },
      {
        t: "ul",
        items: [
          "VPN on + GPS allowed → map pin can be correct; IP city is the VPN exit",
          "VPN on + GPS denied → everything leans on IP and will look like the VPN city",
          "VPN off + GPS denied → IP of your home or mobile carrier, still not survey-grade",
        ],
      },
      {
        t: "h2",
        text: "How to get a trustworthy answer on MapBench",
      },
      {
        t: "p",
        text: "Use Find My Location with location permission when you care about the physical place. Glance at the IP / public IP tools when you care about what the network advertises. If the pin lands in the ocean or on a wrong continent after a VPN test, that is expected for IP fallback — switch permission back on or turn the VPN off for the GPS path. For addresses from coordinates you already have, reverse geocoding is a separate step and still depends on map coverage.",
      },
      {
        t: "toolbox",
        slugs: [
          "find-my-location",
          "ip-address-lookup",
          "what-is-my-public-ip",
          "reverse-geocoder",
          "what-city-am-i-in",
          "what-country-am-i-in",
        ],
      },
    ],
  },
  {
    slug: "drive-time-map-vs-radius-circle",
    title: "Drive Time Map vs Radius Circle: Which One Should You Use?",
    description:
      "A radius is equal distance in every direction. A drive-time map follows roads and speed. Here’s when each shape answers the real question.",
    date: "2026-09-21",
    readMins: 7,
    blocks: [
      {
        t: "p",
        text: "People often draw a circle around a shop and call it a ‘service area.’ On a flat map that looks tidy. On the ground it is frequently wrong. A river with one bridge, a highway with no exit, or a mountain road can make a ten-mile radius include places that take forty minutes and exclude places that take twelve. The question is rarely ‘what is ten miles away?’ It is ‘what can I reach in twenty minutes?’ Those are different geometries.",
      },
      {
        t: "h2",
        text: "What a radius circle actually measures",
      },
      {
        t: "p",
        text: "A map radius tool draws a geodesic circle: every point on the edge is the same ground distance from the centre, measured on the Earth’s surface, not on the road network. That is the right tool for radio coverage sketches, straight-line exclusion zones, ‘within 5 miles as the crow flies,’ and any rule that is literally written in distance, not time.",
      },
      {
        t: "ul",
        items: [
          "Strength: simple, comparable, independent of traffic data",
          "Weakness: ignores one-way streets, water, and speed limits",
          "Good for: buffer zones, crow-flies policies, quick visual scale",
        ],
      },
      {
        t: "h2",
        text: "What a drive-time (isochrone) map measures",
      },
      {
        t: "p",
        text: "A drive-time map asks a routing engine how far you can go along the road network in a fixed number of minutes. The result is a polygon that bulges along freeways and pinches at bottlenecks. Bike and walk modes produce different shapes again. Free tools usually use free-flow or typical speeds, not live congestion — so peak-hour reality can still shrink the area. Even so, the shape is far closer to ‘who can get here for lunch’ than a perfect circle.",
      },
      {
        t: "note",
        text: "If your contract or flyer says ‘within 10 miles,’ use a radius. If it says ‘within 15 minutes,’ use drive time. Mixing the words is how marketing and operations end up arguing past each other.",
      },
      {
        t: "h2",
        text: "A practical way to choose",
      },
      {
        t: "ul",
        items: [
          "Delivery promise in minutes → drive-time / isochrone",
          "Regulatory buffer in kilometres or miles → radius",
          "Comparing two candidate sites → run both and look at the difference",
          "Walking from a station → walking-time or walk isochrone, not a car radius",
        ],
      },
      {
        t: "p",
        text: "On MapBench, try the same centre point on the map radius tool and the drive-time map. The mismatch is the lesson: equal distance is not equal access. For multi-stop days, a route planner answers yet another question — order and total length — which neither a single circle nor a single isochrone fully replaces.",
      },
      {
        t: "toolbox",
        slugs: [
          "drive-time-map",
          "map-radius",
          "isochrone-map",
          "multi-radius-map",
          "walking-time-calculator",
          "service-area-map",
        ],
      },
    ],
  },
  {
    slug: "how-to-find-latitude-longitude-of-any-place",
    title: "How to Find the Latitude and Longitude of Any Place",
    description:
      "Search an address, click a map, or use GPS — then read decimal degrees the way software expects, without swapping lat and lng.",
    date: "2026-09-20",
    readMins: 7,
    blocks: [
      {
        t: "p",
        text: "Latitude and longitude are the two numbers that pin a place to the globe. You need them when a form asks for coordinates, when you drop a point into GIS software, or when you want to share a location that has no reliable street address. The process is simple; the mistakes are repetitive: swapped order, too few decimals, or DMS pasted into a box that only accepts decimal degrees.",
      },
      {
        t: "h2",
        text: "Three reliable ways to get coordinates",
      },
      {
        t: "ul",
        items: [
          "Search: type the place name or address into a latitude/longitude finder and read the result",
          "Click: open the map, click the exact building or path, copy the numbers from the pin",
          "GPS: use ‘my location’ when you are physically there and the phone has a fix",
        ],
      },
      {
        t: "p",
        text: "Search is only as good as the gazetteer. Famous landmarks resolve cleanly; informal local names may not. Clicking the map is often more honest for ‘this corner of the car park.’ GPS is best when you are on site, not when you are planning from the sofa.",
      },
      {
        t: "h2",
        text: "Decimal degrees, and how many places to keep",
      },
      {
        t: "p",
        text: "Most web tools and APIs want decimal degrees: 40.7128, −74.0060. Negative latitude is south; negative longitude is west. Five decimal places is about 1.1 metres of latitude — enough for everyday mapping. Six is finer than consumer GPS usually justifies. Writing seven or eight digits does not make a phone more accurate; it only pretends.",
      },
      {
        t: "note",
        text: "GeoJSON and some libraries store coordinates as [longitude, latitude]. Many humans and forms use latitude first. Always check the field labels before you paste.",
      },
      {
        t: "h2",
        text: "When you only have DMS or a different grid",
      },
      {
        t: "p",
        text: "Paper charts and older instruments often show degrees, minutes, and seconds. Convert them to decimal degrees before feeding web tools. UTM and MGRS are grid systems used in surveying and military maps; convert those when your source data is not lat/lng at all. Keep the original string in a note so you can audit later.",
      },
      {
        t: "h2",
        text: "Going the other way: coordinates to an address",
      },
      {
        t: "p",
        text: "Reverse geocoding turns a point into the nearest labelled address or administrative names. Coverage is dense in well-mapped cities and thin in remote areas. A point in the water or on a large campus may return only a coarse region. That is a data limitation, not a failure of arithmetic.",
      },
      {
        t: "toolbox",
        slugs: [
          "latitude-longitude-finder",
          "address-to-coordinates",
          "coordinates-to-address",
          "decimal-to-dms",
          "dms-to-decimal",
          "coordinate-converter",
          "utm-converter",
          "mgrs-converter",
        ],
      },
    ],
  },
  {
    slug: "what-county-am-i-in-how-it-works",
    title: "What County Am I In? How County Lookup Actually Works",
    description:
      "County lines are legal boundaries, not vibes. How map tools resolve a point to a county — and why borders, unincorporated areas, and bad GPS fix create surprises.",
    date: "2026-09-20",
    readMins: 6,
    blocks: [
      {
        t: "p",
        text: "‘What county am I in?’ sounds like a trivia question until you need it for a form, a school district argument, a sales territory, or emergency context. Counties (and equivalent units elsewhere) are polygons maintained by governments and reflected, imperfectly, in open map data. A tool that answers the question is doing point-in-polygon work against that data — not guessing from the nearest big city name.",
      },
      {
        t: "h2",
        text: "The usual pipeline",
      },
      {
        t: "p",
        text: "You provide a point: GPS, a map click, or an address that was geocoded first. The software tests which county polygon contains that point. If the point sits exactly on a boundary line, different datasets can disagree by a hair. If GPS was inaccurate by a few hundred metres near a border, you can get the neighbouring county even though you are ‘pretty sure’ you know where you stand.",
      },
      {
        t: "ul",
        items: [
          "US: counties and county-equivalents (including some independent cities)",
          "Elsewhere: the comparable first- or second-level administrative unit may use another name",
          "Unincorporated land still belongs to a county; ‘no city’ does not mean ‘no county’",
        ],
      },
      {
        t: "h2",
        text: "City vs county vs ZIP — stop merging them",
      },
      {
        t: "p",
        text: "A mailing city on a postal label can differ from the incorporated municipality, which can differ again from the county. ZIP codes are routes and delivery areas, not governmental hierarchy. Tools that keep those fields separate are doing you a favour. If one website says ‘City X’ and another says ‘County Y,’ both can be right for different layers.",
      },
      {
        t: "note",
        text: "Near a state line, verify the pin on the map before you submit anything official. A slightly wrong coordinate is more dangerous than a blank field.",
      },
      {
        t: "h2",
        text: "When the answer looks wrong",
      },
      {
        t: "ul",
        items: [
          "Move the pin deliberately across the border and watch the label change",
          "Try address search if GPS was taken indoors",
          "Remember that disputed or newly adjusted boundaries may lag in open data",
        ],
      },
      {
        t: "p",
        text: "MapBench’s county, city, state, ZIP, and country tools are meant to be used as a set. Cross-check the layer you need instead of assuming one label answers every bureaucratic question.",
      },
      {
        t: "toolbox",
        slugs: [
          "what-county-am-i-in",
          "what-city-am-i-in",
          "what-state-am-i-in",
          "what-zip-code-am-i-in",
          "what-country-am-i-in",
          "find-my-location",
        ],
      },
    ],
  },
  {
    slug: "free-printable-blank-maps-for-school-and-work",
    title: "Free Printable Blank Maps: How to Choose Outline, Labeled, or City Variants",
    description:
      "Classroom worksheets, sales territories, and presentation slides need different map styles. How to pick blank vs labeled vs coloured — and SVG vs PNG.",
    date: "2026-09-19",
    readMins: 6,
    blocks: [
      {
        t: "p",
        text: "A blank map is not an empty failure state. It is a deliberate teaching and design surface: countries or states without labels so students fill them in, or so a designer adds their own categories. The moment you download a busy political map with every capital already printed, you have inherited someone else’s priorities. Outline maps put the priorities back on you.",
      },
      {
        t: "h2",
        text: "Match the variant to the job",
      },
      {
        t: "ul",
        items: [
          "Blank outline — quizzes, colouring, ‘label the regions yourself’",
          "Labeled — quick reference while studying or presenting",
          "Coloured regions — slides where categories need visual separation",
          "With cities — urban context without building a dataset from scratch",
        ],
      },
      {
        t: "h2",
        text: "SVG or PNG?",
      },
      {
        t: "p",
        text: "SVG stays sharp at any print size and remains editable in many design tools. PNG is a fixed raster — fine for a slide deck or a quick handout, awkward if you later need a poster-sized enlarge. If you are not sure, keep the SVG and export PNG only for the channel that demands it.",
      },
      {
        t: "note",
        text: "Public-domain boundary data is ideal for worksheets and commercial slides, but it is still not a cadastral survey. Do not treat classroom outlines as legal property lines.",
      },
      {
        t: "h2",
        text: "Going beyond a static outline",
      },
      {
        t: "p",
        text: "When you need area numbers, draw on a live map with an area calculator. When you need custom pins for a field trip or a store list, use a pin or CSV-to-map workflow and export. Blank maps solve the ‘clean base layer’ problem; measurement and annotation tools solve the ‘my data on a map’ problem.",
      },
      {
        t: "toolbox",
        slugs: ["blank-map", "map-png-export", "map-area-calculator", "csv-to-map"],
      },
    ],
  },
  {
    slug: "straight-line-distance-vs-road-distance",
    title: "Straight-Line Distance vs Road Distance: Why Your Trip Is Longer Than the Map Says",
    description:
      "Great-circle distance is the shortest path on the globe. Roads almost never follow it. How to read both numbers without fooling yourself.",
    date: "2026-09-19",
    readMins: 7,
    blocks: [
      {
        t: "p",
        text: "Two cities 800 km apart ‘as the crow flies’ can easily be 1,000 km by highway. The crow is not stuck with interchanges, border crossings, or a lake in the way. Straight-line (great-circle) distance is still useful: it is the physical lower bound, a fair way to compare separation, and the number many scientific and aviation contexts care about. It is a bad promise for arrival time in a car.",
      },
      {
        t: "h2",
        text: "Great-circle, in plain language",
      },
      {
        t: "p",
        text: "On a sphere, the shortest surface path between two points is an arc of a great circle. Flat maps stretch that arc into a curve that looks wrong until you remember the projection is lying for your convenience. Tools that report crow-flies distance are computing that arc (or a very close spherical approximation), not counting lane-miles.",
      },
      {
        t: "h2",
        text: "Road distance and driving time",
      },
      {
        t: "p",
        text: "Road distance follows the network: the sum of segments a router chooses. Driving time folds in speed limits and, in better engines, typical traffic. Multi-stop days add sequencing: the order you visit points can change total kilometres more than any single ‘optimisation tip’ on a blog. If you only compare straight-line legs, you will under-budget fuel and hours.",
      },
      {
        t: "ul",
        items: [
          "Planning a flight-style mental model → crow-flies / great-circle",
          "Planning a road trip or delivery day → driving distance and time",
          "Meeting someone in the middle → halfway tools still use geography; roads may not meet there",
        ],
      },
      {
        t: "note",
        text: "Odometer readings include detours, wrong turns, and parking loops. They should be higher than a clean router estimate, which should be higher than crow-flies. If your odometer is lower than crow-flies, something was mis-measured.",
      },
      {
        t: "h2",
        text: "Fuel and cost are not proportional to crow-flies",
      },
      {
        t: "p",
        text: "Fuel cost calculators that only see straight-line distance will smile optimistically. Use road distance when money is involved. Elevation and congestion still sit outside many free models — treat the result as a plan, not an invoice.",
      },
      {
        t: "toolbox",
        slugs: [
          "crow-flies-distance",
          "distance-between-two-places",
          "driving-distance-calculator",
          "drive-time-map",
          "halfway-between-two-places",
          "fuel-cost-calculator",
          "multi-stop-route-planner",
        ],
      },
    ],
  },
  {
    slug: "what-are-plus-codes-open-location-code",
    title: "What Are Plus Codes? Open Location Codes Without a Street Address",
    description:
      "Plus Codes turn coordinates into short codes you can share by text. Where they help, where they don’t, and how to encode or decode them.",
    date: "2026-09-18",
    readMins: 6,
    blocks: [
      {
        t: "p",
        text: "Street addresses fail in the countryside, in new developments, and in cities where informal paths never got official names. Plus Codes (Open Location Codes) were designed as a workaround: a short string that encodes a grid cell on the Earth’s surface so anyone with a compatible map can find the same place. They are not a replacement for legal title or postal systems; they are a practical locator.",
      },
      {
        t: "h2",
        text: "How a Plus Code behaves",
      },
      {
        t: "p",
        text: "A full global code stands alone. A shortened code is cheaper to say aloud but needs a surrounding city or region to disambiguate. Longer codes mean smaller cells — higher precision. Encoding is deterministic: the same coordinates yield the same code. That makes them useful in SMS, paper notes, and field teams that do not share a single proprietary map account.",
      },
      {
        t: "ul",
        items: [
          "Good for: deliveries to unnamed plots, meeting points, asset tags",
          "Not for: proving ownership, replacing tax-parcel IDs, or ignoring local addressing laws",
          "Precision follows code length — do not demand door-level meaning from a short code",
        ],
      },
      {
        t: "h2",
        text: "Plus Codes vs latitude/longitude",
      },
      {
        t: "p",
        text: "Coordinates are the underlying truth on WGS84. Plus Codes are a compact language for those coordinates. If a system accepts decimal degrees, you can always convert. If a person refuses to read negative numbers and decimal points over the phone, a code can be easier. Keep both when accuracy matters.",
      },
      {
        t: "note",
        text: "Always confirm the pin on a map after typing a code. One wrong character moves the cell. The failure mode is silent until someone drives to the wrong field.",
      },
      {
        t: "toolbox",
        slugs: [
          "plus-code-finder",
          "latitude-longitude-finder",
          "address-to-coordinates",
          "coordinates-to-address",
          "find-my-location",
        ],
      },
    ],
  },
  {
    slug: "how-accurate-is-browser-geolocation",
    title: "How Accurate Is Browser Geolocation? A Practical Field Guide",
    description:
      "Browser location is not one technology. Accuracy bands, permission prompts, indoor failure modes, and how to sanity-check a pin before you trust it.",
    date: "2026-09-18",
    readMins: 7,
    blocks: [
      {
        t: "p",
        text: "‘Allow this site to use your location’ hides a stack of sensors and network lookups. The number that comes back can be excellent or nearly useless depending on the device, the sky, and whether the operating system is allowed to use precise mode. Treating every blue dot as survey truth is how people file the wrong county on a form.",
      },
      {
        t: "h2",
        text: "Rough accuracy bands you will actually see",
      },
      {
        t: "ul",
        items: [
          "Outdoor GPS, clear sky: often ~5–15 m, sometimes better on recent phones",
          "Urban canyons and dense trees: tens of metres, occasional jumps",
          "Indoor Wi‑Fi assisted: highly variable; whole-building error is common",
          "IP-only fallback: city or region scale — not a street pin you should defend",
        ],
      },
      {
        t: "h2",
        text: "Permission, precision, and operating systems",
      },
      {
        t: "p",
        text: "Browsers can only use what the OS grants. Some mobile systems distinguish approximate and precise location. Desktop browsers without GPS lean on network signals. A denied prompt is not a bug in the map tool; it is the user (or policy) choosing privacy over a pin. Re-requesting permission after a deny often requires opening site settings manually.",
      },
      {
        t: "h2",
        text: "How to sanity-check a result",
      },
      {
        t: "p",
        text: "Look at the map, not only the text fields. If the pin is in a river and you are in a café, nudge it or walk outside for a fresh fix. Compare city and country labels with what you already know. When stakes are high — legal filings, emergency instructions, property disputes — browser geolocation is a starting clue, not a finished survey. Licensed measurement and official records still win.",
      },
      {
        t: "note",
        text: "Accuracy circles reported by some APIs are estimates, not guarantees. A small circle can still be centred on the wrong place if the underlying fix is biased.",
      },
      {
        t: "h2",
        text: "Using MapBench tools without over-trusting them",
      },
      {
        t: "p",
        text: "Find My Location is built for a fast, permission-based pin and readable coordinates. Pair it with county/city tools when administrative labels matter, and with coordinate converters when another system demands DMS or a grid reference. For public IP pages, remember you are inspecting the network identity, which may diverge from the person holding the phone.",
      },
      {
        t: "toolbox",
        slugs: [
          "find-my-location",
          "what-city-am-i-in",
          "what-county-am-i-in",
          "latitude-longitude-finder",
          "ip-address-lookup",
          "elevation-finder",
        ],
      },
    ],
  },
];
