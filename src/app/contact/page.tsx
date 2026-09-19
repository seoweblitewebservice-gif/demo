import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact MapForge",
  description: "Contact MapForge about geographic tools, map data, bugs, accessibility or privacy questions.",
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <div className="doc mx-auto max-w-3xl">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-mute">
        <Link href="/" className="hover:text-brand-strong">Home</Link> / Contact
      </nav>
      <h1 className="font-display text-3xl font-bold tracking-tight">Contact MapForge</h1>
      <p className="mt-3">
        Found a broken tool, inaccurate result, accessibility problem, map-data issue, or privacy concern?
        We want to know so the site can be corrected rather than leaving users to work around an error.
      </p>

      <section className="mt-8">
        <h2 className="sect-h">Report a technical problem</h2>
        <p className="mt-3">
          Include the exact tool URL, what you entered, what result you expected, and what happened instead.
          Screenshots or a small sample coordinate/file are useful when they do not contain private information.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="sect-h">Open-source project</h2>
        <p className="mt-3">
          MapForge is developed in a public GitHub repository. Technical issues and reproducible bugs can be
          reported there:
        </p>
        <p className="mt-3">
          <a
            href="https://github.com/seoweblitewebservice-gif/demo/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-strong hover:underline"
          >
            MapForge GitHub issue tracker →
          </a>
        </p>
      </section>

      <section className="mt-8">
        <h2 className="sect-h">Privacy questions</h2>
        <p className="mt-3">
          Before sending location or file information, read the <Link href="/privacy" className="font-bold text-brand-strong hover:underline">Privacy Policy</Link>.
          Please do not include passwords, private addresses, personal identifiers, or confidential files in a bug report.
        </p>
      </section>
    </div>
  );
}
