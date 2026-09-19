import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS } from "@/lib/registry";

export const metadata: Metadata = {
  title: "About MapBench",
  description: "MapBench is a free, browser-first platform of geographic tools: distance and area calculators, routing, coordinate converters, map file viewers and map makers.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">About MapBench</h1>
      <div className="prose-sf mt-6">
        <p>
          MapBench exists for one simple reason: geographic questions are everyday questions. <em>How far apart are these two towns?
          What county am I standing in? How big is this field? What's inside my delivery radius?</em> Answering them shouldn't
          require a GIS license, a subscription, or handing your data to an unknown server.
        </p>
        <p>
          So we built a platform of <strong>{TOOLS.length} free tools</strong> that run directly in your browser. Distances use proper
          spherical geometry, not flat-map shortcuts. Routing follows the real road network. File viewers parse your KML, GPX,
          GeoJSON and CSV locally — your files never leave your device.
        </p>
        <h2>What we optimise for</h2>
        <ul>
          <li><strong>Correctness</strong> — geodesic math, honest data labels, visible methodology.</li>
          <li><strong>Privacy</strong> — no accounts, no stored locations, client-side file processing.</li>
          <li><strong>Speed</strong> — every tool is its own lightweight page that loads only what it needs.</li>
          <li><strong>Open data</strong> — OpenStreetMap, Natural Earth, US Census, Open-Meteo and free routing engines.</li>
        </ul>
        <h2>Honesty by design</h2>
        <p>
          Where a number is an estimate, we say so. Population figures carry their vintage year. Routing times are labelled
          free-flow rather than pretending to be live traffic. The full details live on the
          {" "}<Link href="/methodology" className="font-semibold text-brand-strong hover:underline">methodology</Link> and{" "}
          <Link href="/data-sources" className="font-semibold text-brand-strong hover:underline">data sources</Link> pages.
        </p>
        <h2>The name</h2>
        <p>
          A forge is where raw material becomes useful tools. MapBench takes the world's open geographic data and shapes it
          into small, sharp instruments you can pick up and use immediately.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/tools" className="btn btn-primary">Explore the tools</Link>
        <Link href="/privacy" className="btn btn-ghost">Privacy policy</Link>
      </div>
    </div>
  );
}
