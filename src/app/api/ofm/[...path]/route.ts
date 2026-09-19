// Same-origin proxy for OpenFreeMap tiles/styles/glyphs/sprites.
// Guarantees maps render even in environments that block third-party
// tile requests: the browser only talks to our own origin.

const UPSTREAM = "https://tiles.openfreemap.org";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  const p = (path ?? []).join("/");
  if (!p || p.includes("..")) {
    return new Response("Bad path", { status: 400 });
  }
  if (!/^(planet|natural_earth|sprites|fonts|styles)\//.test(p)) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const up = await fetch(`${UPSTREAM}/${p}`, { cache: "no-store" });
    if (!up.ok) return new Response("Upstream error", { status: up.status === 404 ? 404 : 502 });
    const body = await up.arrayBuffer();
    const ct = up.headers.get("content-type") ?? "application/octet-stream";
    const isTile = p.startsWith("planet/") || p.startsWith("fonts/");
    return new Response(body, {
      headers: {
        "Content-Type": ct,
        "Cache-Control": isTile ? "public, max-age=86400" : "public, max-age=604800",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new Response("Upstream unreachable", { status: 502 });
  }
}
