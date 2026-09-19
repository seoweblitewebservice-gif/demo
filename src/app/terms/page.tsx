import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms under which MapBench's free geographic tools are provided, including acceptable use of the underlying open data services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-bold tracking-tight">Terms of Use</h1>
      <p className="mt-2 text-sm text-mute">Last updated: September 2026</p>
      <div className="prose-sf mt-6">
        <h2>1. The service</h2>
        <p>MapBench provides free, browser-based geographic tools ("the service") without charge and without accounts. The service is provided "as is", without warranty of any kind, express or implied, including fitness for a particular purpose.</p>
        <h2>2. Not for critical decisions</h2>
        <p>Results are computed from open datasets of varying age and precision. Do not rely on the service for navigation, aviation, maritime safety, legal boundary determination, emergency response or any use where an error could cause harm or liability. Consult authoritative sources and licensed survey data for those purposes.</p>
        <h2>3. Fair use of upstream services</h2>
        <p>The tools rely on community-run services (OpenStreetMap Nominatim, Photon, Overpass, FOSSGIS routing, Open-Meteo). You agree not to use the service for automated bulk queries, scraping or any workload that would violate those providers' usage policies. For heavy workloads, run your own instances.</p>
        <h2>4. Your content</h2>
        <p>Files and coordinates you process remain yours; we take no rights in them, and — as described in the privacy policy — they are processed locally in your browser. Shared URLs contain only the parameters you place in them.</p>
        <h2>5. Outputs</h2>
        <p>You may use maps, exports and screenshots you create with the tools for any lawful purpose. Underlying basemap and boundary data retain their own licences (mainly OpenStreetMap's ODbL and public-domain Natural Earth/Census data) — see the <a href="/data-sources" className="font-semibold text-brand-strong hover:underline">data sources</a> page.</p>
        <h2>6. Changes</h2>
        <p>We may update tools, data and these terms over time. Material changes to data handling will be reflected in the privacy policy with a new date.</p>
      </div>
    </div>
  );
}
