"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TOOLS, STATIC_LINKS, CATEGORIES } from "@/lib/registry";

export default function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQ("");
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => { setOpen(true); setQ(""); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("sf-open-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("sf-open-search", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
  }, [open]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const toolHits = TOOLS.filter((t) => {
      if (!needle) return !!t.popular;
      const hay = `${t.name} ${t.short} ${t.keywords.join(" ")} ${t.category}`.toLowerCase();
      return needle.split(/\s+/).every((w) => hay.includes(w));
    }).slice(0, 9);
    const pageHits = needle
      ? STATIC_LINKS.filter((s) => `${s.name} ${s.keywords.join(" ")}`.toLowerCase().includes(needle))
      : [];
    return [
      ...toolHits.map((t) => ({ href: `/tools/${t.slug}`, name: t.name, sub: CATEGORIES.find((c) => c.id === t.category)?.label ?? "", scope: t.scope })),
      ...pageHits.map((s) => ({ href: s.href, name: s.name, sub: "Page", scope: "" })),
    ];
  }, [q]);

  useEffect(() => { setActive(0); }, [results.length, q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 p-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search tools" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="card w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 border-b border-line px-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" className="text-mute" /><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-mute" /></svg>
          <input
            ref={inputRef}
            className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-mute"
            placeholder="Search tools — try “radius”, “GPX”, “sunrise”…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              else if (e.key === "Enter" && results[active]) { router.push(results[active].href); setOpen(false); }
            }}
          />
          <kbd className="rounded border border-line bg-well px-1.5 py-0.5 text-[10px] font-bold text-mute">ESC</kbd>
        </div>
        <ul className="max-h-[46vh] overflow-y-auto p-1.5" role="listbox">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-mute">No tools match “{q}”. Try a broader term like “distance” or “map”.</li>
          )}
          {results.map((r, i) => (
            <li key={r.href} role="option" aria-selected={i === active}>
              <button
                type="button"
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${i === active ? "bg-brand-soft" : "hover:bg-well"}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => { router.push(r.href); setOpen(false); }}
              >
                <span className="flex-1 truncate text-sm font-semibold">{r.name}</span>
                {r.scope ? <span className="chip">{r.scope}</span> : null}
                <span className="text-[11px] uppercase tracking-wide text-mute">{r.sub}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-line px-4 py-2 text-[11px] text-mute">
          ↑↓ to navigate · Enter to open · {TOOLS.length} tools indexed
        </div>
      </div>
    </div>
  );
}
