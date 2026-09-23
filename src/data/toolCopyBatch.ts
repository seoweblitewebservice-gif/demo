import type { ToolCopy } from "./toolCopy";

export const COPY_BATCH: Record<string, ToolCopy> = {
  "batch-geocoder": {
    h2: "When a batch geocoder beats one-by-one search",
    paras: [
      "Operations teams, researchers, and marketers often start with a spreadsheet column of addresses — store lists, survey sites, customer records. Looking each one up by hand is slow and error-prone. A batch geocoder walks the list, returns coordinates (or addresses), and leaves you with a CSV you can join back to the original sheet.",
      "MapBench runs the work in your browser against open geocoders. That means no account, no API key on your side, and no copy of the list on our servers. The trade-off is politeness: we cap each run and space requests so free community services are not overwhelmed.",
      "Matches are only as good as the input and the map database. Ambiguous names, missing city or country, and brand-new streets can fail or land on the wrong pin. Spot-check a sample on the map before you push thousands of rows into production routing or print.",
      "For a single address, the Address to Coordinates tool is faster. For plotting an already-geocoded CSV, use CSV to Map. Use this batch tool when the bottleneck is turning text into coordinates at moderate volume.",
    ],
  },
};
