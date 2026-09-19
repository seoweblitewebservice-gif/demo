"use client";
import { useEffect, useRef, useState } from "react";
import { photonSearch, type GeocodeHit } from "@/lib/geocode";
import { useDebounced } from "./ui";

/** Photon-backed autocomplete place search. */
export default function LocationSearch({
  onSelect, placeholder = "Search a place or address…", initialValue = "", autoFocus = false, id,
}: {
  onSelect: (hit: GeocodeHit) => void;
  placeholder?: string;
  initialValue?: string;
  autoFocus?: boolean;
  id?: string;
}) {
  const [text, setText] = useState(initialValue);
  const [hits, setHits] = useState<GeocodeHit[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(-1);
  const debounced = useDebounced(text, 320);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    if (debounced.trim().length < 2) { setHits([]); return; }
    setBusy(true);
    photonSearch(debounced, 6).then((r) => {
      if (cancelled) return;
      setBusy(false);
      if (r.ok) { setHits(r.results); setActive(r.results.length ? 0 : -1); }
      else setHits([]);
    });
    return () => { cancelled = true; };
  }, [debounced]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!boxRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (h: GeocodeHit) => {
    setText(h.label);
    setOpen(false);
    onSelect(h);
  };

  return (
    <div ref={boxRef} className="relative">
      <input
        id={id}
        className="input pr-8"
        value={text}
        placeholder={placeholder}
        autoFocus={autoFocus}
        role="combobox"
        aria-expanded={open && hits.length > 0}
        aria-autocomplete="list"
        autoComplete="off"
        onChange={(e) => { setText(e.target.value); setOpen(true); }}
        onFocus={() => hits.length && setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, hits.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
          else if (e.key === "Enter" && active >= 0 && hits[active]) { e.preventDefault(); pick(hits[active]); }
          else if (e.key === "Escape") setOpen(false);
        }}
      />
      {busy && (
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mute" aria-hidden>
          <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 12a10 10 0 1 1-3-7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
        </span>
      )}
      {open && hits.length > 0 && (
        <ul role="listbox" className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-lg border border-line bg-card shadow-xl">
          {hits.map((h, i) => (
            <li key={`${h.lat}-${h.lng}-${i}`} role="option" aria-selected={i === active}>
              <button
                type="button"
                className={`flex w-full items-baseline gap-2 px-3 py-2 text-left text-sm ${i === active ? "bg-brand-soft" : "hover:bg-well"}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(h)}
              >
                <span className="flex-1 truncate font-medium">{h.label}</span>
                {h.kind ? <span className="shrink-0 text-[10px] uppercase tracking-wide text-mute">{h.kind}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
