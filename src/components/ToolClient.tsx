"use client";
import { Suspense, useMemo } from "react";
import Link from "next/link";
import { toolBySlug, CATEGORIES, type ToolDef } from "@/lib/registry";
import { USER_FAQS } from "@/data/userFaqs";
import ToolContent from "./ToolContent";
import { toolComponents } from "./tools";
import { Spinner } from "./ui";

export default function ToolClient({ slug }: { slug: string }) {
  const tool = toolBySlug.get(slug);
  if (!tool) return null;
  const category = CATEGORIES.find((c) => c.id === tool.category);
  const Component = toolComponents[tool.component];
  const related = tool.related.map((s) => toolBySlug.get(s)).filter((t): t is ToolDef => !!t && t.slug !== slug).slice(0, 6);
  const faqs: [string, string][] = [...tool.faq, ...(USER_FAQS[tool.category] ?? [])];

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-3 text-xs text-mute">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-brand-strong">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/tools" className="hover:text-brand-strong">Tools</Link></li>
          {category && (<><li aria-hidden>/</li><li><Link href={`/tools?cat=${category.id}`} className="hover:text-brand-strong">{category.label}</Link></li></>)}
          <li aria-hidden>/</li>
          <li aria-current="page" className="font-semibold text-ink">{tool.name}</li>
        </ol>
      </nav>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{tool.name}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">{tool.intro}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <span className="chip chip-brand">Free</span>
          <span className="chip">{tool.scope}</span>
          <ShareControls />
        </div>
      </div>

      {Component && (
        <Suspense fallback={<div className="card flex h-80 items-center justify-center"><Spinner label="Loading tool…" /></div>}>
          <Component params={tool.props} />
        </Suspense>
      )}

      {/* Reserved ad slot — never overlays controls or results */}
      <div className="mt-6 flex h-16 items-center justify-center rounded-xl border border-dashed border-line text-[10px] font-bold uppercase tracking-widest text-mute/70" aria-label="Advertisement placeholder">
        Advertisement
      </div>

      <div className="mt-10">
        <ToolContent tool={tool} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-8">
          <section aria-labelledby="howto">
            <h2 id="howto" className="font-display text-xl font-bold">How to use</h2>
            <ol className="mt-3 space-y-2.5">
              {tool.howTo.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-mute">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11px] font-bold text-brand-strong">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          {tool.method && (
            <section aria-labelledby="method">
              <h2 id="method" className="font-display text-xl font-bold">Methodology & accuracy</h2>
              <p className="mt-2 text-sm leading-relaxed text-mute">{tool.method} Read more on the <Link href="/methodology" className="font-semibold text-brand-strong hover:underline">methodology page</Link>.</p>
            </section>
          )}

          <section aria-labelledby="faq">
            <h2 id="faq" className="font-display text-xl font-bold">Frequently asked questions</h2>
            <div className="mt-3 space-y-2">
              {faqs.map(([q, a]) => (
                <details key={q} className="card group px-4 py-3">
                  <summary className="cursor-pointer list-none text-sm font-semibold marker:hidden">
                    <span className="mr-2 text-brand-strong" aria-hidden>+</span>{q}
                  </summary>
                  <p className="mt-2 border-t border-line pt-2 text-sm leading-relaxed text-mute">{a}</p>
                </details>
              ))}
            </div>
          </section>

          <section aria-labelledby="related">
            <h2 id="related" className="font-display text-xl font-bold">Related tools</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} href={`/tools/${r.slug}`} className="card group p-4 transition-colors hover:border-brand">
                  <div className="text-sm font-bold group-hover:text-brand-strong">{r.name}</div>
                  <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-mute">{r.short}</div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="card p-4">
            <div className="label">Data & privacy</div>
            <ul className="mt-1 space-y-2 text-xs leading-relaxed text-mute">
              <li>✓ Coordinates &amp; files processed in your browser</li>
              <li>✓ Map tiles © OpenStreetMap via OpenFreeMap</li>
              <li>✓ No account, no tracking of your locations</li>
              <li>✓ See <Link href="/data-sources" className="font-semibold text-brand-strong hover:underline">data sources</Link> &amp; <Link href="/privacy" className="font-semibold text-brand-strong hover:underline">privacy</Link></li>
            </ul>
          </div>
          <div className="card p-4">
            <div className="label">Category</div>
            {category && (
              <>
                <div className="mt-1 flex items-center gap-2 text-sm font-bold"><span className="h-2.5 w-2.5 rounded-full" style={{ background: category.tone }} />{category.label}</div>
                <p className="mt-2 text-xs leading-relaxed text-mute">{category.short}</p>
                <Link href={`/tools?cat=${category.id}`} className="mt-2 inline-block text-xs font-bold text-brand-strong hover:underline">Browse all {category.label} tools →</Link>
              </>
            )}
          </div>
          <div className="card p-4">
            <div className="label">Share this tool</div>
            <p className="mt-1 text-xs leading-relaxed text-mute">Every result state is stored in the URL — copy the address bar to share your exact map setup.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ShareControls() {
  return (
    <>
      <button
        type="button" className="btn btn-ghost btn-sm"
        onClick={async (e) => {
          const btn = e.currentTarget;
          try { await navigator.clipboard.writeText(window.location.href); btn.textContent = "Link copied ✓"; }
          catch { btn.textContent = "Copy the address bar"; }
          setTimeout(() => { btn.textContent = "Copy link"; }, 1600);
        }}
      >
        Copy link
      </button>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => { window.location.href = window.location.pathname; }}>
        Reset
      </button>
    </>
  );
}
