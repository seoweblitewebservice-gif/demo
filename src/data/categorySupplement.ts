// Targeted supplementary paragraphs for categories whose pages measured under
// 2,000 words. Original editorial content, composed last on each page.
import type { CategoryId } from "@/lib/registry";

export const SUPPLEMENT: Partial<Record<CategoryId, { title: string; para: string; bullets: string[] }>> = {
  coordinates: {
    title: "Coordinates in the wild: where notation meets consequence",
    para: "It is worth closing with two stories that explain why all this notation discipline matters. In the first, a search-and-rescue volunteer copies a grid reference from a radio call into a decimal-only field, drops a digit pair, and the rescue tasking points a valley away — the error invisible in the table, instantly obvious on a map. In the second, a research team merges three decades of ecological plots and discovers one legacy file was NAD27: every point shifted by the same quiet thirty metres, enough to move a forest edge. Both failures were preventable with the same two habits this toolset makes default — convert at the edge, verify with the pin — and neither required expertise, only ritual. Coordinates reward exactly that attitude: they are the one geographic asset that can be perfectly lossless, provided the humans touching them keep their agreements about datum, notation and precision.",
    bullets: [
      "Radio/voice workflows: read MGRS or DMS back in grouped digits; transcription errors cluster at the group boundary.",
      "Merged historical datasets: assume a datum split until proven otherwise; plot both frames and look for a rigid offset.",
      "Public forms: accept every notation, store one; the converter's 'recognised as' label is your audit trail.",
    ],
  },
  creation: {
    title: "From screenshot to artifact: making maps that survive contact with reuse",
    para: "The final skill in map-making is longevity. A map that exists only as a pasted image dies the day its data changes; a map that exists as image plus dataset plus link lives through corrections, re-styles and re-uses. That is why the export trio matters more than any styling choice: the PNG persuades today's audience, the GeoJSON/CSV preserves the argument's evidence, and the share-URL keeps a living version one click from anyone who asks 'what if we moved that pin?'. Organisations that internalise this split stop losing maps the way they stop losing spreadsheets — the artifact has a source, and the source has a link. Combined with the restraint rules (one message, colour-as-category, tight framing), it turns a free browser tool into a small but genuinely professional cartographic pipeline.",
    bullets: [
      "Name exports by message, not date: 'delivery-radius-proposal' outlives 'map-final-v3'.",
      "Keep the share-URL beside the PNG in any document; readers trust editable evidence.",
      "When a map needs a second message, make a second map — and cross-link them.",
    ],
  },
  population: {
    title: "Reading people-numbers like an analyst",
    para: "Analysts develop a reflex for population figures: before the number, the definition; before the definition, the question. 'City' can mean legal limits, continuous built-up area or metropolitan economy, and the same name carries all three in different documents — which is why serious comparisons state the frame in the first sentence and prefer ratios thereafter. The second reflex is ingredient inspection: any sum should show its addends, because a radius total that hides its city list is rhetoric, not analysis. These habits make even rough snapshots professionally usable: as screens, shortlists and sanity checks, always printed with their vintage, and always paired with the escalation path — census geographies and statistical-office indices — for the moment a decision attaches real money or legal weight to the figure. The same reflexes scale downward to everyday questions. Choosing between two job offers, a warehouse site or a conference hub all reduce to comparable frames and visible ingredients, and the map keeps the exercise spatial rather than abstract. Even the errors are instructive: when a radius sum looks too low for a region, the published city list shows exactly why — the dataset's gaps become legible instead of hidden, and the user learns something real about how population actually distributes. That legibility is the core promise: numbers you can argue with, point by point, are numbers you can trust enough to act on — and knowing precisely when to stop acting on them is the analyst's final skill.",
    bullets: [
      "First sentence rule: frame (metro/municipal/urban) before figure, every time.",
      "Sums show addends; export the breakdown CSV with any total you publish.",
      "Two snapshots compared must share a vintage, or the difference is partly calendar.",
    ],
  },
  lines: {
    title: "Teaching with the lines: five minutes that fix a mental map",
    para: "The geographic lines earn their keep as teaching instruments, because each one corrects a specific intuition. The Equator kills the flat-map habit that all parallels are equal — only it is a great circle. The tropics replace 'hot band' folklore with a single mechanism, the axial tilt, and immediately explain why deserts park at 20–30°. The polar circles turn day length from trivia into a curve you can watch snap to 0 and 24 hours. The Prime Meridian and the date line finish the lesson by showing the human half of the grid: votes, zig-zags and a brass line that GPS politely ignores by a hundred metres. Ten minutes of clicking along these highlights does more for spatial literacy than a semester of unlabeled diagrams, because the learner is not reading the grid — they are standing on it, cursor-first, watching one coordinate hold while the other sweeps the planet.",
    bullets: [
      "Pair each line with its live counterpart tool: circles with day length, meridians with timezones.",
      "Ask learners to predict a city's daylight curve from its latitude, then check — prediction error is the lesson.",
      "Date every tilt-derived fact ('currently ≈ 23.44°') and the drift becomes a feature, not a footnote.",
    ],
  },
  files: {
    title: "The quiet discipline of geographic data hygiene",
    para: "Teams that handle geographic files well share habits that have nothing to do with software: originals are sacred, conversions are named acts with stated losses, filenames carry provenance, and every incoming file gets thirty seconds of inspection — counts, bounding box, three random rows — before it touches anything downstream. These habits convert the classic failure modes (a KMZ mistaken for KML, a swapped CSV column rendering the wrong ocean, GPZ elevation spikes blamed on the tool) from disasters into logged non-events. The local-first design reinforces them: because nothing uploads, inspection costs nothing and confidentiality survives by architecture rather than promise. In that sense a browser workbench is not a lesser GIS; it is the hygiene layer every serious pipeline needs at the door, catching the messy world before it reaches the clean interior.",
    bullets: [
      "Adopt a house rule: no file enters analysis without a printed validation line.",
      "Filename schema 'YYYY-MM-DD_source_format' — provenance you'll actually read later.",
      "Keep a 'losses' note with every conversion; audits become trivial when losses are named.",
    ],
  },
  earth: {
    title: "Terrain literacy: the habits that keep elevation honest",
    para: "Using terrain data well is mostly a set of small disciplines: print the model with the number, keep the heights as named inputs, average years instead of days, and treat every verdict as the bare-earth baseline that land cover and structures may override. Practitioners also keep a feel for the model's texture — flat terrain resolves beautifully, steep forested relief noisier — and for the difference between shape and amplitude in profiles, where consumer GPS tracks and DEM samples tell complementary truths. Held together, these habits make the free stack genuinely useful for siting, scouting, teaching and curiosity, while the escalation points stay clearly marked: licensed surveys for construction, regulatory determinations for flood and seismic decisions, certified studies where financing depends on production numbers. The tools do their part by printing every recipe; the user's part is simply to read them. Finally, terrain literacy changes how questions are asked, not just answered. 'Is this site flood-prone?' becomes 'what does the elevation profile say, what does the regulatory map say, and where do they disagree?' 'Can I see the coast from here?' becomes a stated eye height, a curvature verdict and a note about the forest in between. Structured questioning like this is cheap here — every input named, every recipe printed, every limit labelled — so the habit costs seconds per query. Over a season of site visits, garden plans, antenna mounts and photo walks, those seconds compound into a genuinely different relationship with the ground: not a backdrop, but a dataset you can read, cite and, when it matters, hand to a professional with the right questions already written down.",
    bullets: [
      "Cite the model: 'Copernicus GLO-90 via Open-Meteo' belongs in every republished figure.",
      "Store eye/mast heights with visibility results; unstated heights are unreproducible results.",
      "Profile comparisons: match shape first, amplitude second, and say which device logged what.",
    ],
  },
  sun: {
    title: "Living by the sky: putting solar literacy to work",
    para: "Solar literacy pays off in unglamorous, compounding ways: the photographer who plans by altitude windows instead of clock time stops losing light to season; the gardener who reads the daylight curve sets expectations by latitude, not by folklore; the distributed team that chooses its meeting slot from the overlap grid rotates pain instead of accumulating resentment; the traveller who checks polar behaviour avoids booking 'midnight sun' in a week the geometry never promised. None of this requires expertise — the arithmetic is exact and local — only the habit of carrying conventions along: which zenith, which clocks, which date. The sky keeps perfect books; the skill is quoting it with its units attached, and knowing the two doors (almanacs for science, terrain-aware tools for mountains) where everyday formulas hand over to specialists. There is also a quieter benefit to keeping this literacy in-house: because every computation runs locally, the tools become a classroom. Change a latitude and the daylight curve responds instantly; change a date and the golden-hour window migrates; add a second city and the overlap grid redraws. That immediacy turns parameters into intuitions in a way static tables never manage, which is why these pages invite play — drag the inputs, watch the geometry answer, and let the conventions (zenith, clocks, vintage) become habits rather than footnotes. A reader who has watched the polar circle snap day length to twenty-four hours understands something a definition alone cannot teach, and that understanding is the durable output of the whole exercise.",
    bullets: [
      "Add solar windows to trip notes as altitude ranges; convert to local time only at the end.",
      "For teams, publish the overlap grid quarterly — DST changes move the rectangle more than anyone expects.",
      "Garden planning: pair hardiness zone with the daylight curve; crops respond to both clocks.",
    ],
  },
};
