import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How MapForge handles your data: browser-first processing, no account requirements, and exactly which external services your requests touch.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-mute">Last updated: November 2025</p>
      <div className="prose-sf mt-6">
        <h2>The short version</h2>
        <ul>
          <li>No account is ever required.</li>
          <li>Files you open (KML, GPX, GeoJSON, CSV) are parsed <strong>entirely in your browser</strong> and never uploaded to our servers.</li>
          <li>Coordinates you enter stay in your browser, except where a tool needs an external answer (below) — and then only the coordinates themselves are sent.</li>
          <li>We do not sell, share or profile. If ads are displayed, they are clearly marked slots and do not receive your tool inputs.</li>
        </ul>
        <h2>External services your browser talks to</h2>
        <p>Some tools need live data. When you use them, your browser contacts these public services directly:</p>
        <ul>
          <li><strong>Map tiles</strong> — OpenFreeMap (data © OpenStreetMap contributors).</li>
          <li><strong>Place search</strong> — Photon (komoot), based on OpenStreetMap.</li>
          <li><strong>Reverse geocoding</strong> — Nominatim (OpenStreetMap). Sent: one coordinate pair per request.</li>
          <li><strong>Routing & isochrones</strong> — FOSSGIS Valhalla (with OSRM fallback for driving). Sent: your stops' coordinates.</li>
          <li><strong>Elevation</strong> — Open-Meteo. Sent: sampled coordinates.</li>
          <li><strong>Nearby places</strong> — Overpass API (OpenStreetMap). Sent: centre point and radius.</li>
        </ul>
        <p>These requests come from your browser, not from our servers, and are subject to each provider's own privacy policy and fair-use terms.</p>
        <h2>Geolocation</h2>
        <p>"Use my location" uses your browser's Geolocation API. Your position is shared by the browser with this page only; we do not store or forward it beyond the reverse-geocoding request needed to show an address. Denying permission never breaks a tool.</p>
        <h2>Local storage</h2>
        <p>We store one preference — your light/dark theme choice — in <code>localStorage</code>. Tool states (map position, radii, pins) live in the URL so they can be shared; nothing is written server-side.</p>
        <h2>Analytics & advertising</h2>
        <p>If aggregate analytics are enabled in the future, they will be privacy-preserving and documented here first. Reserved ad slots never overlay maps, results or download buttons, and ad providers never receive your coordinates or files.</p>
        <p>If Google AdSense is enabled, Google and its advertising partners may use cookies, web beacons, IP addresses and similar identifiers to serve and measure ads. See <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">How Google uses information from sites or apps that use its services</a> for Google's current explanation of this processing.</p>
        <h2>Questions</h2>
        <p>If anything here is unclear, the source code of this site is the definitive answer — every behaviour described above is verifiable in the browser's network tab.</p>
      </div>
    </div>
  );
}
