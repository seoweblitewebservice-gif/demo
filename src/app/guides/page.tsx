import type { Metadata } from "next";
import Link from "next/link";
import { ALL_GUIDES } from "@/data/allGuides";

export const metadata: Metadata = {
  title: "MapBench Blog — Mapping Guides & Field Notes",
  description: "Practical MapBench guides on coordinates, GPS files, road trips, isochrones, golden hour, hardiness zones and city comparisons, with links to the tools used in each workflow.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">MapBench Blog</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">
        Practical guides and field notes for mapping, coordinates, GPS files and location-based workflows. Each article explains the method, useful caveats and the MapBench tools involved.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {ALL_GUIDES.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="card group flex flex-col p-5 transition-colors hover:border-brand">
            <div className="text-xs font-bold uppercase tracking-wide text-mute">{new Date(g.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} · {g.readMins} min read</div>
            <h2 className="mt-2 font-display text-lg font-bold leading-snug group-hover:text-brand-strong">{g.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mute">{g.description}</p>
            <span className="mt-auto pt-4 text-sm font-bold text-brand-strong">Read →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
