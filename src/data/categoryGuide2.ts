// Second editorial layer per category — composed into every tool page to
// reach full guide depth (2,000+ words). Original content.
import type { CategoryId } from "@/lib/registry";

export const GUIDE2: Record<CategoryId, { title: string; paras: string[]; pros: string[]; qa: [string, string][] }> = {
  location: {
    title: "A field guide to trustworthy place answers",
    paras: [
      "The difference between a playful lookup and a dependable one is verification habit. Professionals never accept a single source for a place fact: they triangulate. Click-placed pins beat typed addresses for ambiguity; the administrative layer beats the postal layer for legal questions; and a visible map beat both for catching the absurd. When a tool shows county, city, state, postcode and country side by side, cross-read them — an internally inconsistent row (a county that doesn't contain that city) is the signal to slow down and inspect the point itself.",
      "Equally important is knowing the failure signatures. Geocoders fail politely (no result) or dangerously (a confident wrong town with a common name). Reverse geocoders near borders can flip between neighbours as you drag a pin by metres — that flicker is information, telling you the point sits on a contested edge. Indoor GPS drift shows up as a pin that 'feels' a block off; nudge it. None of these are reasons to distrust the stack; they are reasons to keep the human in the loop, which is exactly what an interactive map is for.",
    ],
    pros: [
      "Log coordinates at six decimals internally, but display five — the sixth is beyond consumer GPS and implies false rigour.",
      "When automating checks, flag any reverse-geocode whose county/state pair is internally inconsistent for human review.",
      "For border-adjacent properties, capture the pin's accuracy radius alongside the answer; it is part of the truth.",
      "Prefer administrative boundaries for anything legal or tax-related; postal geography is optimised for mail, not law.",
    ],
    qa: [
      ["What's the right tool chain for cleaning an address list?", "Geocode each row, reverse-geocode the result, and compare components; rows where input and canonical disagree are your error queue — the Address Validator automates one row of this."],
      ["How do I cite a boundary answer?", "Cite the dataset and its licence (OpenStreetMap ODbL, or Census TIGER for US districts) plus the date queried; boundaries change after redistricting and mapper edits."],
    ],
  },
  distance: {
    title: "Distance literacy: choosing the right yardstick",
    paras: [
      "Most distance errors are category errors: quoting straight-line where a road is meant, or a road where a schedule is meant. A useful discipline is to name the yardstick aloud in every sentence that uses a number — 'as the crow flies', 'by road', 'at free-flow speeds'. The three form a ladder of realism, each rung adding assumptions: the sphere's geometry, the network's topology, then human speed limits. Crow-flies is reproducible forever from coordinates alone; road distance depends on the mapping vintage; travel time depends on the traffic model. Knowing which rung your decision stands on tells you how much it can move.",
      "The ladder also teaches when disagreement is a bug and when it is truth. If your road distance is shorter than your straight-line distance, something is wrong — topology cannot beat geometry. If two straight-line tools disagree by more than half a percent, one is using flat math or a wrong radius. And if bearings from A→B and B→A don't differ by roughly 180° (convergence aside from exact antipodal oddness), a tool is faking the back-bearing. These consistency checks cost seconds and catch most published nonsense.",
    ],
    pros: [
      "State the yardstick in every sentence that carries a number; ambiguity is the enemy, not imprecision.",
      "Use nautical miles and bearings together for anything marine; statute miles and compass points for prose.",
      "For multi-point studies, export the matrix as CSV and let the spreadsheet hold the single source of truth.",
      "Check tool sanity with known pairs (Equator quarter ≈ 10,018 km; London–Paris ≈ 344 km) before trusting exotic ones.",
    ],
    qa: [
      ["Why do flight distances differ from great-circle?", "Airlines fly airways and wind-optimised tracks; the great circle is the baseline, not the invoice."],
      ["Is haversine fine for property-scale distances?", "More than fine — at kilometres the sphere/ellipsoid gap is centimetres; your pin placement error dominates."],
    ],
  },
  routing: {
    title: "Reading routes like a dispatcher",
    paras: [
      "A route result is a claim about a network, and networks have personalities. Motorway cities produce long fast fingers in their isochrones; river cities show comb shapes; border towns pinch. Learning to read those shapes turns a pretty polygon into diagnostic information: a missing finger is a missing interchange, a hole is a barrier, a lopsided blob is a one-way system. The same literacy applies to stop ordering — an optimized route that criss-crosses itself is either a data error or a constraint you forgot to state, because distance-minimising engines don't voluntarily draw bows on their own paths.",
      "Time estimates deserve the same reading discipline. Free-flow times are the network's physics; your city adds sociology on top. Dispatchers handle this with explicit buffers by area and hour, and you can too: keep the engine's number as the reproducible baseline, store your buffer as policy, and present the sum. When someone asks 'how long will it take', the honest answer has two numbers and a reason — which is precisely what a good tool's labels should invite you to give.",
    ],
    pros: [
      "Snap endpoints to visible roads before calculating; stable inputs, stable results, explainable diffs.",
      "Keep the engine's free-flow figure and your congestion buffer as separate fields; policies change, physics doesn't.",
      "Export isochrones with their mode and contours in properties; a polygon without its parameters is unverifiable.",
      "After auto-optimising stops, scan the drawn path for self-intersection — the cheapest QA in logistics.",
    ],
    qa: [
      ["Why do walking and driving distances cross sometimes?", "Pedestrian cut-throughs (steps, paths) can make walking shorter than driving in old towns; it's the network telling the truth."],
      ["Can isochrones handle multiple starts?", "Union the polygons per start; the overlap is where either base can reach in time — a standard coverage move."],
    ],
  },
  radius: {
    title: "Thinking in circles without being fooled by them",
    paras: [
      "Circles are the simplest spatial idea and the easiest to misuse. On a sphere they are honest caps; on flat screens they tempt distortion, so a good tool constructs them vertex by vertex and shows area computed on the same sphere. The deeper trap is semantic: a circle says 'distance as the crow flies', which is rarely how people, pizzas or plumbers travel. Before drawing, ask what moves along what network — if the answer involves roads, your circle is a sketch and an isochrone is the portrait.",
      "Multiple circles and rings upgrade circles from illustration to analysis. Overlapping catchments compare service reach; concentric rings price distance bands; a circle minus a circle approximates a drive-time donut for marketing. The exports matter as much as the pixels: storing radius and unit inside each feature's properties turns a pretty map into a dataset a GIS can re-derive, audit and re-style. Measure twice, export once, and let the sphere do the arithmetic.",
    ],
    pros: [
      "State the question first: geometric reach (circle) or temporal reach (isochrone) — then pick the instrument.",
      "Calibrate your eye with known areas (a hectare ≈ 1.4 football pitches) before judging unfamiliar polygons.",
      "Export radii with their parameters embedded; future audits should not require archaeology.",
      "For population claims inside circles, prefer transparent city sums with the list shown over black-box rasters.",
    ],
    qa: [
      ["Why does my circle's area differ from πr² at huge radii?", "Curvature: the spherical cap is smaller than the flat formula; good tools show both and say why."],
      ["Can I subtract a lake from my polygon area?", "Measure the hole separately and subtract — spherical excess is additive, so the arithmetic stays honest."],
    ],
  },
  coordinates: {
    title: "Coordinate hygiene for people who reuse data",
    paras: [
      "Coordinates are the one geographic asset that can be perfectly lossless — if you keep discipline. One datum (WGS84), one notation in storage (decimal degrees), one precision policy (five or six decimals), and conversions only at the display edge. Every deviation from that recipe taxes you later: mixed DMS strings in a column, NAD27 relics in an old shapefile, seven-decimal theatre in a CSV. The converters exist to absorb that variety at the border so your interior stays clean.",
      "The second discipline is visual verification. A coordinate pair is two numbers; a pin on a map is a fact. Swapped axes, wrong hemispheres, degree/minute confusion — every classic error is instantly visible as a pin in the wrong ocean or the wrong hemisphere, and instantly invisible in a table. Professionals therefore make the map check a ritual: paste, look, then trust. At five decimals you are resolving metres; at that scale the eye, not the arithmetic, is the quality gate.",
    ],
    pros: [
      "Store decimal degrees, WGS84, signed; convert to DMS/UTM/MGRS only for the reader who needs them.",
      "Validate ranges on ingest (|lat| ≤ 90, |lng| ≤ 180) and reject, don't clip, out-of-range rows.",
      "Make the map-pin sanity check mandatory for any coordinate you didn't generate yourself.",
      "When receiving UTM or MGRS strings, record the original alongside the conversion — provenance prevents arguments.",
    ],
    qa: [
      ["Do Plus Codes work offline?", "Yes — encoding/decoding is pure math; no database, which is why they suit field work and disaster response."],
      ["Why do old surveys disagree with my GPS?", "Usually a datum shift (NAD27 etc.): the same ground, different reference frame, tens of metres apart."],
    ],
  },
  files: {
    title: "A professional workflow for geographic files",
    paras: [
      "Treat every incoming geographic file as untrusted until inspected: open it locally, read the validation report, check feature counts by geometry type, and eyeball the bounding box before doing anything else. A bounding box spanning the planet usually means one corrupt vertex; a box in the wrong hemisphere means swapped axes; an empty box means the parser and the file disagree about what a coordinate is. Thirty seconds of inspection prevents most downstream embarrassments, and doing it in-browser keeps confidential data confidential.",
      "Conversions then become deliberate acts with known losses. To GPX you take points and lines, leaving polygons as boundary tracks and dropping rich properties; to KML you gain presentation and lose nothing you needed computationally; to GeoJSON you keep the data and shed the styling. Name the loss on the way out, keep the original on disk, and your pipeline stays auditable — which is the entire difference between a hobby workflow and a professional one.",
    ],
    pros: [
      "Inspect before converting: counts, bounding box, and three random property rows, every time.",
      "Keep originals forever; conversions are lossy at the edges and cheap to re-run.",
      "For CSV imports, confirm the detected lat/lng columns against a known point before mapping all rows.",
      "Rename exports with date + source + format; filenames are the metadata you'll actually read later.",
    ],
    qa: [
      ["My KML shows nothing — why?", "Common culprits: it's really a KMZ (unzip first), or it contains only GroundOverlays/styles, which viewers of geometry rightly ignore."],
      ["GPX elevation looks spiky — is the tool wrong?", "The math is faithful; consumer GPS elevation noise is real. Smooth for display, keep raw for the record."],
    ],
  },
  creation: {
    title: "Design principles for maps people actually read",
    paras: [
      "A custom map succeeds when a viewer can state its message in one sentence without help. That demands hierarchy: a tight viewport, a handful of labelled points or a few coloured areas, and a legend or title that says the point in words. Every additional pin beyond the message is noise; every colour beyond category is decoration. The tools here are deliberately simple because restraint is the feature — the craft lives in what you choose to leave off the map.",
      "Equally important is durability. A map that lives only as a screenshot dies young; one exported as image plus data (GeoJSON/CSV) plus share-URL survives edits, corrections and re-uses. When the dataset outgrows hand-placed pins, switch instruments — clustering and category colouring in the CSV tools — instead of cramming. Knowing which instrument fits which scale is the quiet professionalism behind every map that looks effortless.",
    ],
    pros: [
      "One map, one message; if you need two messages, make two maps.",
      "Colour = category, label = identity, viewport = argument. Nothing else earns ink.",
      "Export image + data + link together; each serves a different future reader.",
      "Beyond ~50 points, move to CSV-to-map with clustering rather than hand-pinning.",
    ],
    qa: [
      ["PNG or SVG for print?", "PNG from the live map for basemap realism; the blank-map library's SVG for crisp vector outlines and worksheets."],
      ["How do I credit the basemap?", "OpenStreetMap's ODbL asks for '© OpenStreetMap contributors' on reused imagery — the footer string covers it."],
    ],
  },
  earth: {
    title: "Using terrain intelligence without overclaiming it",
    paras: [
      "Digital elevation models transformed what amateurs can ask of terrain, and they also created a new overconfidence: a number with decimals feels surveyed. Hold the model's nature in mind — a ~90 m grid of bare-earth heights, vertical error of a few metres, blind to buildings and canopies — and every output slots into its proper weight. Elevation at a point: planning-grade. A profile: the shape of the truth with noisy amplitude. Line-of-sight: terrain's answer, pending trees and towers. Horizon: curvature plus standard refraction over open ground. Each is genuinely useful; none is the last word.",
      "The longer-clock tools carry the same lesson at larger scale. A Köppen letter compresses thirty years of weather into climate's shorthand; a hardiness zone compresses winter extremes into a gardener's number; recent seismicity sketches a fault's mood. Used as orientation — choosing crops, siting panels, understanding a region's tectonic character — they are superb. Used as guarantees, they fail. The discipline is to print the recipe with the result, which is what honest tools do by default.",
    ],
    pros: [
      "Attach the model and vintage to every terrain number you republish (e.g. 'Copernicus GLO-90 via Open-Meteo').",
      "For visibility work, add land cover from local knowledge after the terrain verdict, not before.",
      "Average multiple years for climate-adjacent numbers; single-year values are weather wearing climate's coat.",
      "When a decision is expensive, upgrade terrain from DEM to survey — the tool's job is to tell you when that matters.",
    ],
    qa: [
      ["Why do two elevation services differ?", "Different DEMs (SRTM vs Copernicus), resolutions and vintages; differences of a few metres are normal and honest."],
      ["Can I trust quakes as a fault map?", "As activity, yes; as geometry, use mapped Quaternary faults (USGS Qfaults in the US) alongside."],
    ],
  },
  sun: {
    title: "Planning life around an honest sky",
    paras: [
      "Solar arithmetic is the rare everyday science that is both exact and accessible: given a date and coordinates, sunrise, sunset, day length and the photographer's altitude windows follow from first principles to about a minute. The skill is not in the math but in the labels. State the zenith convention (official sunrise includes refraction), state the timezone handling (UTC plus the location's political clock), and the result becomes reproducible by anyone, anywhere — which is the entire point of publishing a number.",
      "The Moon and the calendar complete a planner's sky. Phase is global geometry with local orientation; day length is latitude's signature; timezone overlap grids turn a distributed team's pain into a visible rectangle of shared daylight-hours. Used together, these tools replace folklore ('it gets dark early in winter') with a curve, a window and an invite that works for every participant — quiet infrastructure for photography, agriculture, logistics and ordinary punctuality.",
    ],
    pros: [
      "Publish solar times with their convention (90.833° zenith) and both clocks (UTC + local zone).",
      "For shoots, plan by sun altitude windows, then convert to local time — never the reverse.",
      "Use the annual daylight curve, not single days, to set expectations for a new latitude.",
      "For global meetings, choose the overlap window from the grid and rotate the pain quarterly.",
    ],
    qa: [
      ["Why does my smartwatch sunrise differ by minutes?", "Rounded coordinates, different zenith, or terrain-aware adjustments; the plain-horizon official definition is the comparable baseline."],
      ["Does elevation change sunrise?", "Slightly — higher observers see over the horizon earlier; the geometric tools here let you add that height explicitly."],
    ],
  },
  lines: {
    title: "The grid as a story about agreement",
    paras: [
      "Every line on the global grid is either astronomy or agreement. The Equator, tropics and polar circles fall out of the planet's tilt — discoverable, drifting slowly, indifferent to opinion. Meridians are pure convention: Greenwich won an 1884 vote, the date line zig-zags around national convenience, and satellite geodesy later moved the 'true' zero a hundred metres east of the brass line without asking anyone. Holding both kinds in mind makes the grid intelligible: nature drew the horizontals, politics drew the verticals, and precision now measures both.",
      "That story is also a masterclass in datum humility. Coordinates are angles against an agreed model; change the agreement and the 'same' point shifts. The Greenwich offset, the antipode's ocean, the tropic's slow drift — each is a small, memorable proof that geography is measured within frames we chose. Teaching with the live lines (click them, read them, compare tools against them) turns an abstract graticule into a place you have stood, cursor-first, which is where real spatial literacy begins.",
    ],
    pros: [
      "Use the five lines as calibration constants for other tools (Equator circumference ≈ 40,075 km).",
      "When explaining meridians, lead with the Greenwich/GPS offset story — it makes datums memorable."],
    qa: [
      ["Do the tropics' latitudes change?", "Yes, with the axial tilt's slow oscillation — currently drifting a few tens of metres per year."],
      ["Why 180° for the date line?", "It's the Prime Meridian's antipodal meridian; the zig-zags are national choices layered on that geometry."],
    ],
  },
  population: {
    title: "Using estimates without fooling yourself",
    paras: [
      "Population numbers carry unusual rhetorical weight, which raises the duty of care. The honest spectrum runs from census-exact (legal, funding) to transparent estimate (screening, comparison), and the malpractice lies in the middle: polished numbers with hidden assumptions. A good estimate prints its vintage, its definitions (municipal vs metro vs urban area), and its ingredients — the actual city list behind a radius sum — so a reader can recompute or reject it. That transparency is not a consolation prize; for quick comparative work it is often more trustworthy than a black box with more digits.",
      "Comparisons gain stability when expressed as ratios. Absolute densities and cost indices age and wobble; the relationship between two cities — ten times denser, half as pricey — survives snapshot error. Lead with the ratio, footnote the absolutes, and keep the map in view: spatial context turns '4.7 million' from a statistic into a place, which is where good decisions actually live.",
    ],
    pros: [
      "Print vintage + definition with every population figure you reuse; unstated definitions are how errors spread.",
      "Lead comparisons with ratios; they are the stable part of snapshot data.",
      "Treat curated radius sums as lower bounds outside dense metro cores, and say so when presenting.",
      "Escalate to census geometry when the decision involves money or law; estimates screen, censuses decide.",
    ],
    qa: [
      ["Why not just use census APIs everywhere?", "They're authoritative but US-scoped and slower to explore; global screening needs lighter, labelled estimates first."],
      ["How rough is a cost index?", "It compresses housing, food, services and rents into one rent-inclusive number — directionally excellent, lease-signing insufficient."],
    ],
  },
};
