import type { ToolDef } from "@/lib/registry";

/** Batch geocoding tools — B2B / spreadsheet workflows. */
export const BATCH_TOOLS: ToolDef[] = [
  {
    slug: "batch-geocoder",
    name: "Batch Geocoder",
    short: "Geocode many addresses or reverse-geocode coordinates — table + CSV export.",
    intro:
      "Paste up to 50 addresses (or lat/lng pairs), run a rate-limited batch, and download results as CSV for CRM, maps, and logistics.",
    category: "location",
    scope: "Worldwide",
    component: "batchgeocode",
    keywords: [
      "batch geocoder",
      "bulk geocode",
      "geocode csv",
      "address to lat long bulk",
      "reverse geocode batch",
      "spreadsheet geocode",
    ],
    popular: true,
    faq: [
      [
        "How many rows?",
        "Up to 50 per run. That limit protects free OpenStreetMap-based services so they stay available for everyone.",
      ],
      [
        "Why is it slow?",
        "Requests are spaced about one second apart to respect rate limits. Keep the tab open until the progress bar finishes.",
      ],
      [
        "Is data uploaded to MapBench servers?",
        "No. Your browser calls public geocoding APIs directly. We do not store your address list.",
      ],
      [
        "Good enough for postal certification?",
        "No. This is open-data matching for planning and enrichment. Use certified postal tools for discounted bulk mail.",
      ],
      [
        "Forward vs reverse?",
        "Forward turns addresses into coordinates. Reverse turns lat/lng pairs into a readable address label.",
      ],
    ],
    howTo: [
      "Choose Address → coordinates or Coordinates → address.",
      "Paste one entry per line (max 50).",
      "Click Geocode and wait for the table to fill.",
      "Download CSV when you need the results in a spreadsheet.",
    ],
    related: [
      "address-to-coordinates",
      "coordinates-to-address",
      "address-validator",
      "csv-to-map",
      "reverse-geocoder",
    ],
    method:
      "Forward: Photon (Komoot) OpenStreetMap search, first hit per line. Reverse: Nominatim reverse API. Sequential requests with ~1s delay.",
  },
];
