import { Suspense } from "react";
import type { Metadata } from "next";
import ToolsDirectory from "@/components/ToolsDirectory";

export const metadata: Metadata = {
  title: "All Free Map & Geographic Tools",
  description: "The complete MapBench directory: distance and bearing calculators, radius and area tools, routing, coordinate converters, KML/GPX/GeoJSON viewers, map makers and more.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">All tools</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">
        Every tool is free, works worldwide unless marked otherwise, and runs in your browser. Search by keyword or filter by category.
      </p>
      <div className="mt-6">
        <Suspense fallback={<div className="card p-10 text-center text-sm text-mute">Loading directory…</div>}>
          <ToolsDirectory />
        </Suspense>
      </div>
    </div>
  );
}
