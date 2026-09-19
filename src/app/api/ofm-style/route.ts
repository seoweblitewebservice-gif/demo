// Serves the OpenFreeMap "positron" vector style with every URL rewritten to
// our same-origin proxy (/api/ofm/…), so tile, sprite and glyph requests never
// leave the origin — immune to third-party request blocking.

export async function GET(_req: Request) {
  try {
    const up = await fetch("https://tiles.openfreemap.org/styles/positron", { cache: "no-store" });
    if (!up.ok) return new Response("Upstream style unavailable", { status: 502 });
    const text = await up.text();
    // Rewrite to same-origin RELATIVE paths so the browser resolves them
    // against the page origin (MapLibre resolves style URLs against the
    // style's own URL) — never embed the server's internal origin.
    const rewritten = text.split("https://tiles.openfreemap.org").join("/api/ofm");
    return new Response(rewritten, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Upstream unreachable", { status: 502 });
  }
}
