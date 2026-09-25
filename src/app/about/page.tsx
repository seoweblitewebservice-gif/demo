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
          What county am I standing in? How big is this field? What&apos;s inside my delivery radius?</em> Answering them shouldn&apos;t
          require a GIS license, a subscription, or handing your data to an unknown server.
        </p>
        <p>
          We built a platform of <strong>{TOOLS.length} free tools</strong> that run directly in your browser. Distances use proper
          spherical geometry rather than flat-map shortcuts. Routing follows real road networks. File viewers parse KML, GPX,
          GeoJSON and CSV locally whenever the tool supports local processing, so sensitive files do not need to be uploaded just to inspect them.
        </p>
        <h2>What we optimise for</h2>
        <ul>
          <li><strong>Correctness</strong> — geodesic math, honest data labels, visible methodology.</li>
          <li><strong>Privacy</strong> — no account is required for the public tools, and file-processing behaviour is explained where relevant.</li>
          <li><strong>Speed</strong> — each tool has its own focused page and loads only the functionality it needs.</li>
          <li><strong>Open data</strong> — we rely on sources such as OpenStreetMap, Natural Earth, the US Census Bureau and other documented providers.</li>
        </ul>
        <h2>Honesty by design</h2>
        <p>
          Where a number is an estimate, we say so. Population figures carry their vintage year. Routing times are labelled
          free-flow when live traffic is not available. The full details live on the
          {" "}<Link href="/methodology" className="font-semibold text-brand-strong hover:underline">methodology</Link> and{" "}
          <Link href="/data-sources" className="font-semibold text-brand-strong hover:underline">data sources</Link> pages.
        </p>
        <h2>Why the name MapBench?</h2>
        <p>
          A workbench is where useful tools are kept within reach. MapBench brings practical mapping, measurement and geographic
          utilities together in one place so you can answer a question, inspect data or make a map without setting up specialist GIS software.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/tools" className="btn btn-primary">Explore the tools</Link>
        <Link href="/privacy" className="btn btn-ghost">Privacy policy</Link>
      </div>
    </div>
  );
}
