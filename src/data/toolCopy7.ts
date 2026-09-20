import type { ToolCopy } from "./toolCopy";

/** Unique on-page copy for tools that were missing TOOL_COPY entries. */
export const COPY7: Record<string, ToolCopy> = {
  "zip-codes-within-radius": {
    h2: "What ZIP codes within a radius actually means",
    paras: [
      "A radius search for postal codes answers a practical planning question: which mailing areas fall inside a circle of a given size around a store, clinic, warehouse, or home. The circle is geodesic — measured on the Earth’s surface — so a 25-mile radius in Alaska covers a true ground distance, not a distorted flat-map oval.",
      "Results depend on how densely OpenStreetMap (and local postal datasets) have tagged postcodes. Dense urban regions usually return many codes; sparse rural regions may return fewer even when people live there. Exporting the table to CSV lets you sort by distance, merge with your CRM, or hand the list to a marketing team without retyping coordinates.",
      "Use this tool when you need coverage lists, not road drive-time. If travel time matters more than straight-line distance, switch to the drive-time map and compare both views before you commit to a service boundary.",
    ],
  },
  "horizon-distance": {
    h2: "How far is the horizon from your height",
    paras: [
      "Horizon distance is a geometric estimate: for an eye height above a smooth sphere, the line of sight meets the surface at a calculable range. A person standing at the shore sees roughly five kilometres; a lighthouse deck or hilltop extends that range because height grows under a square root, not linearly.",
      "Real landscapes add hills, buildings, and atmospheric refraction. Standard calculators include a mild refraction factor so the number matches what navigators and radio planners expect outdoors. Treat the result as a planning figure for sightlines and antenna height, not a legal survey of what you can photograph on a hazy day.",
      "Pair elevation finder with this tool when you care about both how high you are and how far the geometric horizon sits. For blocked views, local terrain still wins over pure geometry.",
    ],
  },
  "magnetic-declination": {
    h2: "True north versus magnetic north",
    paras: [
      "Magnetic declination is the angle between true geographic north and the direction a magnetic compass needle points. It changes with place and slowly with year as Earth’s magnetic field drifts. Hikers, boaters, and anyone converting map bearings to compass headings need this offset to avoid systematic error.",
      "A positive (east) declination means the compass points east of true north; you subtract it when going from compass to true bearing, or add it the other way — local training materials often print a memory aid for the region. Models such as the World Magnetic Model supply values by location and epoch; consumer tools report that modelled angle, not a field measurement from your phone’s imperfect magnetometer.",
      "Always note the year of the model. Declination can shift by fractions of a degree per year; a decade-old paper chart may already be off enough to matter on a long wilderness leg.",
    ],
  },
  "plus-code-finder": {
    h2: "Open Location Codes (Plus Codes) explained",
    paras: [
      "Plus Codes are a compact way to encode a latitude and longitude into a short string that works without street addresses. They are especially useful where formal addressing is incomplete — rural areas, new developments, or informal settlements — and they can be shared in messages without special apps beyond a map that understands the code.",
      "Encoding and decoding are deterministic: the same coordinates always produce the same full code, and shortening works relative to a reference area. Full global codes are longer; local shortened forms assume you already know the city or region. This tool converts both directions so you can paste a code from a delivery note or generate one from a map click.",
      "Plus Codes are not a replacement for legal cadastral addresses. They locate a place on the WGS84 globe; property boundaries and postal routing still use official systems in most countries.",
    ],
  },
  "blank-map": {
    h2: "When a blank printable map is the right tool",
    paras: [
      "Blank maps strip labels and thematic clutter so students, teachers, and designers can mark regions themselves. Outline geometry from public-domain sources keeps the shapes honest enough for classroom quizzes, territory sketches, and presentation backgrounds without watermarking.",
      "Choose the region and export SVG when you need sharp print at any size, or PNG when a slide or document expects a raster image. Labeled or coloured variants on the maps section of the site help when you want a head start; the blank variant is for handwriting, annotation, or your own GIS styling later.",
      "These outlines are educational and reference-grade, not cadastral surveys. For legal boundaries or engineering work, use official survey data and licensed GIS products.",
    ],
  },
  "map-png-export": {
    h2: "Exporting a map view as PNG",
    paras: [
      "A PNG export captures the visible map frame — basemap plus whatever pins, circles, or paths you have drawn — into a single image for reports, slides, and tickets. Unlike a phone screenshot, a dedicated export aims for a consistent size and fewer UI chrome elements so the figure is usable in documents.",
      "Resolution is high enough for typical presentation decks; for large posters, vector formats (SVG from blank maps, or GeoJSON for data) scale more cleanly. Always keep the underlying coordinates or exported GeoJSON if you may need to edit the same map later.",
      "Respect basemap attribution when you publish the image publicly. OpenStreetMap-derived tiles carry ODbL obligations; public-domain blank outlines are more permissive for commercial reuse.",
    ],
  },
  "equator-finder": {
    h2: "Finding the equator and your distance from it",
    paras: [
      "The equator is the great circle of zero latitude. Distance from any point to the equator is simply the north–south arc length implied by your latitude — about 111 kilometres per degree on average. The tool draws the line and reports that separation so students and travellers can see the relationship on a real map.",
      "Climate zones, day-length patterns, and many textbook diagrams organise themselves around this line. Standing on the equator does not feel special underfoot, but the geometry of seasons and the sun’s path changes character as you move away from it toward the tropics and beyond.",
      "Combine this view with the tropics finder and sunrise tools when teaching how latitude structures Earth systems, not just political maps.",
    ],
  },
  "tropics-finder": {
    h2: "Tropic of Cancer and Tropic of Capricorn",
    paras: [
      "The tropics mark the latitudes where the sun can appear directly overhead at solar noon around the solstices — currently near 23.4° north and south. Between them lies the tropical zone in the astronomical sense; outside them the sun never reaches the zenith.",
      "These parallels drift slowly over geological time as Earth’s axial tilt changes, but for human planning and education they are effectively fixed lines on modern maps. Showing them next to your location clarifies whether you sit inside or outside the band where vertical sun is possible.",
      "Use the tropics finder with day-length and sunrise tools to connect geometry to lived experience: longer seasonal contrast appears as you leave the tropics toward higher latitudes.",
    ],
  },
  "prime-meridian-finder": {
    h2: "The prime meridian and longitude zero",
    paras: [
      "The modern prime meridian is the internationally agreed line of zero longitude used by GPS and most digital maps, historically tied to Greenwich and refined by satellite geodesy. Distance east or west from that line is your longitude arc; the tool draws the meridian and reports how far a place sits from it.",
      "Longitude determines time zones in principle, though political borders bend the practical map of hours. Understanding zero longitude helps when reading older charts, converting local times, or teaching why “degrees west” and “degrees east” meet at a single reference.",
      "Note that historical national meridians (Paris, Ferro, and others) differ slightly from the WGS84 meridian used by GPS — another reason digital tools state their datum.",
    ],
  },
  "moon-phase-calculator": {
    h2: "Moon phases for planning and curiosity",
    paras: [
      "Moon phase describes how much of the lunar disk is illuminated as seen from Earth, cycling from new to full and back in about 29.5 days. Photographers, night hikers, educators, and cultural calendars all use phase and illumination percentage as a simple shared language.",
      "Phase itself does not depend on your city — the same fraction is visible worldwide (weather aside) — but the clock time of moonrise and moonset does. Pair this calculator with moonrise and moonset times when you need both “how bright” and “when it is up.”",
      "Results are computational astronomy for general use, not observatory-grade ephemerides. For professional surveying or spacecraft work, use specialised almanacs.",
    ],
  },
  "moonrise-moonset": {
    h2: "When the moon rises and sets at your place",
    paras: [
      "Moonrise and moonset are the moments the lunar limb crosses the horizon for a given location and date. Unlike sunrise, these times shift later each day by roughly an hour on average, so last night’s schedule is a poor guide for tonight without a fresh calculation.",
      "Near the poles, or depending on phase and geometry, the moon can stay above or below the horizon for extended periods. Mid-latitude users usually see a clear rise and set each day; the tool reports transit as well when you want the highest point in the sky.",
      "Times are local to the selected place when timezone data is available. Always confirm outdoor plans against weather — a calculated moonrise behind solid cloud is still dark on the ground.",
    ],
  },
  "timezone-converter": {
    h2: "Converting times between places honestly",
    paras: [
      "A timezone converter maps a clock time in one region to the equivalent civil time in another, including daylight-saving rules encoded in the IANA timezone database. That is harder than subtracting a fixed offset because many places change clocks seasonally and some regions have unusual historical rules.",
      "Pick two cities or IANA names, enter a local time, and read the converted result. For meetings, always state the timezone name (for example Europe/Berlin) rather than only “GMT+1,” which can be ambiguous across seasons.",
      "Network latency and “send the invite in both zones” still beat any calculator when stakes are high. Use the tool to draft the numbers, then confirm both parties see the same calendar slot.",
    ],
  },
  "ip-address-lookup": {
    h2: "What an IP lookup can and cannot tell you",
    paras: [
      "Public IP geolocation estimates the rough network location of an address — often city or region level — from registry and routing data. It is useful for approximate localization, fraud checks, and understanding where a connection exits to the public internet.",
      "It is not a street address and not a substitute for device GPS. Mobile carriers, CGNAT, and VPNs routinely place the apparent city far from the human user. When precision matters, use Find My Location with permission rather than IP alone.",
      "Treat organisation and ISP fields as hints about the network operator. They help explain a result; they do not prove who sat at the keyboard.",
    ],
  },
  "what-is-my-public-ip": {
    h2: "Seeing the public IP your browser uses",
    paras: [
      "Your public IP is the address the wider internet sees when your browser makes a request. On home networks it is often the router’s WAN address; on mobile data it may belong to a carrier pool shared by many subscribers.",
      "This page detects that address and runs a standard lookup for approximate city, region, and organisation. If you use a VPN, the IP and location will reflect the VPN exit, which is exactly how the internet routes your traffic while the tunnel is up.",
      "For private LAN addresses (192.168.x.x and similar), look at your device or router settings — those never appear as the public IP on a website.",
    ],
  },
  "multi-radius-map": {
    h2: "Several radius rings on one centre",
    paras: [
      "Multi-radius maps draw concentric geodesic circles so you can compare nested zones — for example 5, 15, and 30 miles around a depot. Planners use rings for delivery tiers, emergency response bands, and simple market-area sketches when travel time data is not required.",
      "Each ring remains a true ground-distance circle at the chosen radius. Export options help you carry the geometry into other tools; for road-aware service areas, generate isochrones on the drive-time map and compare shapes side by side.",
      "Label rings clearly in presentations so viewers do not mistake equal distance for equal drive time — in cities those two ideas diverge quickly.",
    ],
  },
};
