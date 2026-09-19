"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, TOOLS } from "@/lib/registry";

export function Logo() {
  return (
    <span className="flex items-baseline font-display text-lg font-bold tracking-tight">
      <svg width="18" height="18" viewBox="0 0 32 32" fill="none" aria-hidden className="mr-1.5 self-center">
        <path d="M16 3c-5 0-9 4-9 8.9 0 6.5 7.4 14.4 8.4 15.5a.8.8 0 0 0 1.2 0c1-1.1 8.4-9 8.4-15.5C25 7 21 3 16 3Z" fill="var(--sf-brand)" />
        <circle cx="16" cy="12" r="3.4" fill="var(--sf-card)" />
      </svg>
      map<span className="text-brand">forge</span>
    </span>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.classList.contains("dark")); }, []);
  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        try { localStorage.setItem("sf-theme", next ? "dark" : "light"); } catch { /* ignore */ }
      }}
    >
      {dark ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
      )}
    </button>
  );
}

const MAPS_MENU: { title: string; links: [string, string][]; more?: [string, string] }[] = [
  {
    title: "US States",
    links: [
      ["/maps?map=us", "United States"],
      ["/maps?map=s-California", "California"],
      ["/maps?map=s-Texas", "Texas"],
      ["/maps?map=s-Florida", "Florida"],
      ["/maps?map=s-New-York", "New York"],
    ],
    more: ["/maps#us-states", "All 51 state maps →"],
  },
  {
    title: "Continents",
    links: [
      ["/maps?map=world", "World"],
      ["/maps?map=cont-europe", "Europe"],
      ["/maps?map=cont-asia", "Asia"],
      ["/maps?map=cont-africa", "Africa"],
      ["/maps?map=cont-north-america", "North America"],
      ["/maps?map=cont-south-america", "South America"],
      ["/maps?map=cont-oceania", "Oceania"],
    ],
  },
  {
    title: "Countries",
    links: [
      ["/maps?map=c-India", "India"],
      ["/maps?map=c-United-Kingdom", "United Kingdom"],
      ["/maps?map=c-Germany", "Germany"],
      ["/maps?map=c-Japan", "Japan"],
      ["/maps?map=c-Australia", "Australia"],
      ["/maps?map=c-Brazil", "Brazil"],
      ["/maps?map=c-Russia", "Russia"],
      ["/maps?map=c-France", "France"],
    ],
    more: ["/maps#countries-list", "All 170+ country maps →"],
  },
  {
    title: "Region tools",
    links: [
      ["/tools/what-county-am-i-in", "What County Am I In?"],
      ["/tools/cities-within-radius", "Cities Within Radius"],
      ["/tools/population-within-radius", "Population Within Radius"],
      ["/tools/map-area-calculator", "Map Area Calculator"],
      ["/tools/service-area-map", "Service Area Map"],
      ["/tools/multiple-radius-tool", "Multiple Radius Tool"],
    ],
    more: ["/tools", "All tools →"],
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mapsOpen, setMapsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const mapsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => { setOpen(false); setToolsOpen(false); setMapsOpen(false); }, [pathname]);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!toolsRef.current?.contains(e.target as Node)) setToolsOpen(false);
      if (!mapsRef.current?.contains(e.target as Node)) setMapsOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="container-sf flex h-12 items-center gap-4">
        <Link href="/" aria-label="MapBench home"><Logo /></Link>
        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main">
          {/* Tools dropdown */}
          <div className="relative" ref={toolsRef}>
            <button
              type="button"
              className={`rounded px-2.5 py-1.5 text-[13px] font-bold ${toolsOpen ? "text-brand-strong" : "text-ink hover:text-brand-strong"}`}
              aria-expanded={toolsOpen}
              onClick={() => { setToolsOpen((v) => !v); setMapsOpen(false); }}
            >
              Tools <span aria-hidden className="text-[10px]">▾</span>
            </button>
            {toolsOpen && (
              <div className="absolute right-0 top-full mt-1 max-h-[76vh] w-[min(52rem,92vw)] overflow-y-auto rounded-lg border border-line bg-card p-6 shadow-xl">
                <div className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-3">
                  {CATEGORIES.map((c) => (
                    <div key={c.id}>
                      <div className="mb-1.5 border-b border-line pb-1 text-[11px] font-extrabold uppercase tracking-wider text-mute">{c.label}</div>
                      <ul className="space-y-1">
                        {TOOLS.filter((t) => t.category === c.id).map((t) => (
                          <li key={t.slug}>
                            <Link href={`/tools/${t.slug}`} className="block text-[13px] font-semibold text-ink hover:text-brand-strong hover:underline">
                              {t.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-5 border-t border-line pt-3 text-right">
                  <Link href="/tools" className="text-[13px] font-extrabold text-brand-strong hover:underline">Browse the full directory →</Link>
                </div>
              </div>
            )}
          </div>

          {/* Maps dropdown */}
          <div className="relative" ref={mapsRef}>
            <button
              type="button"
              className={`rounded px-2.5 py-1.5 text-[13px] font-bold ${mapsOpen ? "text-brand-strong" : "text-ink hover:text-brand-strong"}`}
              aria-expanded={mapsOpen}
              onClick={() => { setMapsOpen((v) => !v); setToolsOpen(false); }}
            >
              Maps <span aria-hidden className="text-[10px]">▾</span>
            </button>
            {mapsOpen && (
              <div className="absolute right-0 top-full mt-1 w-[min(56rem,92vw)] rounded-lg border border-line bg-card p-6 shadow-xl">
                <div className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4">
                  {MAPS_MENU.map((col) => (
                    <div key={col.title}>
                      <div className="mb-1.5 border-b border-line pb-1 text-[11px] font-extrabold uppercase tracking-wider text-mute">{col.title}</div>
                      <ul className="space-y-1.5">
                        {col.links.map(([href, label]) => (
                          <li key={href}>
                            <Link href={href} className="block text-[13px] font-semibold text-ink hover:text-brand-strong hover:underline">{label}</Link>
                          </li>
                        ))}
                        {col.more && (
                          <li className="pt-1">
                            <Link href={col.more[0]} className="block text-[13px] font-extrabold text-brand-strong hover:underline">{col.more[1]}</Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/guides" className="rounded px-2.5 py-1.5 text-[13px] font-bold hover:text-brand-strong">Blog</Link>
          <Link href="/about" className="rounded px-2.5 py-1.5 text-[13px] font-bold hover:text-brand-strong">About</Link>
          <button
            type="button"
            className="ml-2 rounded border border-line px-2.5 py-1 text-[12px] font-bold text-mute hover:border-brand hover:text-brand-strong"
            onClick={() => window.dispatchEvent(new CustomEvent("sf-open-search"))}
          >
            Search <kbd className="ml-1 text-[10px]">⌘K</kbd>
          </button>
          <ThemeToggle />
        </nav>
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button type="button" className="btn btn-ghost btn-sm" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open
                ? <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                : <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav className="max-h-[80vh] overflow-y-auto border-t border-line bg-canvas md:hidden" aria-label="Mobile">
          <div className="container-sf space-y-4 py-4">
            <div className="flex gap-4 text-sm font-extrabold">
              <Link href="/tools" className="text-brand-strong">All tools</Link>
              <Link href="/maps" className="text-brand-strong">Blank maps</Link>
              <Link href="/guides" className="text-brand-strong">Blog</Link>
              <Link href="/about" className="text-brand-strong">About</Link>
            </div>
            <button type="button" className="btn btn-ghost btn-sm w-full" onClick={() => window.dispatchEvent(new CustomEvent("sf-open-search"))}>Search tools…</button>
            {MAPS_MENU.slice(0, 3).map((col) => (
              <div key={col.title}>
                <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wider text-mute">{col.title}</div>
                <ul className="space-y-1.5">
                  {col.links.map(([href, label]) => (
                    <li key={href}><Link href={href} className="text-sm font-semibold hover:text-brand-strong">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
            {CATEGORIES.map((c) => (
              <details key={c.id} className="border-t border-line pt-3">
                <summary className="cursor-pointer text-[13px] font-extrabold uppercase tracking-wide text-mute">{c.label}</summary>
                <ul className="mt-2 space-y-1.5 pb-2">
                  {TOOLS.filter((t) => t.category === c.id).map((t) => (
                    <li key={t.slug}><Link href={`/tools/${t.slug}`} className="text-sm font-semibold hover:text-brand-strong">{t.name}</Link></li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export { default as Footer } from "./Footer";
