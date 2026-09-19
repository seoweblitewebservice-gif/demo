import type { Metadata } from "next";
import Link from "next/link";
import { ALL_GUIDES } from "@/data/allGuides";

export const metadata: Metadata = {
  title: "The MapForge Blog — Guides & Field Notes",
  description: "Human-written guides on coordinates, GPS files, road trips, isochrones, golden hour, hardiness zones and city comparisons — every post linked to the free tools it uses.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">The MapForge Blog</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">
        Guides and field notes written to be actually useful — real workflows, honest caveats, and internal links
        to every tool a post relies on. No filler, no thin content.
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
