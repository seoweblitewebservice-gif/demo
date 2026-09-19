"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

// ---------- Small primitives shared across tools ----------

export function Spinner({ label = "Working…" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-mute" role="status">
      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".25" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {label}
    </span>
  );
}

export function ErrorBox({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="rounded-lg border border-ember/40 bg-[var(--sf-warn-bg)] px-3.5 py-3 text-sm leading-relaxed">
      {children}
    </div>
  );
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-well px-3.5 py-3">
      <div className="text-[11px] font-bold uppercase tracking-wide text-mute">{label}</div>
      <div className="mt-0.5 font-display text-lg font-semibold break-words">{value}</div>
      {sub ? <div className="mt-0.5 text-xs text-mute">{sub}</div> : null}
    </div>
  );
}

export function CopyBtn({ text, label = "Copy", small = true }: { text: string; label?: string; small?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={`btn btn-ghost ${small ? "btn-sm" : ""}`}
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); } catch {
          const ta = document.createElement("textarea");
          ta.value = text; document.body.appendChild(ta); ta.select();
          document.execCommand("copy"); ta.remove();
        }
        setDone(true); setTimeout(() => setDone(false), 1400);
      }}
      aria-label={label}
    >
      {done ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden><rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      )}
      {done ? "Copied" : label}
    </button>
  );
}

export function Seg<T extends string>({ options, value, onChange, ariaLabel }: {
  options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; ariaLabel?: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="inline-flex flex-wrap gap-1 rounded-lg border border-line bg-well p-1">
      {options.map((o) => (
        <button
          key={o.value} role="tab" type="button"
          aria-selected={value === o.value}
          className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${value === o.value ? "bg-brand text-white dark:text-[#08211d]" : "text-mute hover:text-ink"}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-mute">{hint}</span> : null}
    </label>
  );
}

// ---------- Hooks ----------

export function useDebounced<T>(value: T, ms = 350): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

/** Merge params into the current URL query without reloading (shareable state). */
export function syncUrl(params: Record<string, string | number | boolean | undefined | null>) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") url.searchParams.delete(k);
    else url.searchParams.set(k, String(v));
  }
  window.history.replaceState(null, "", url.toString());
}

export function readUrlParams(): URLSearchParams {
  return typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);
}

export function fmtDateTime(d: Date) {
  return d.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC";
}

// ---------- File dropzone ----------

export function FileDropzone({ onFile, accept, children, maxSizeMb = 25 }: {
  onFile: (f: File) => void; accept: string; children: ReactNode; maxSizeMb?: number;
}) {
  const [over, setOver] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handle = (f: File | undefined | null) => {
    setErr(null);
    if (!f) return;
    if (f.size > maxSizeMb * 1024 * 1024) {
      setErr(`That file is larger than ${maxSizeMb} MB. Please use a smaller file.`);
      return;
    }
    onFile(f);
  };
  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload file"
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${over ? "border-brand bg-brand-soft" : "border-line bg-well hover:border-brand/60"}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files?.[0]); }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 16V4m0 0 4 4m-4-4L8 8" stroke="var(--sf-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="var(--sf-mute)" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div className="text-sm font-semibold">Drag &amp; drop your file here</div>
        <div className="text-xs text-mute">or click to browse — processed entirely in your browser</div>
        <input
          ref={inputRef} type="file" accept={accept} className="sr-only"
          onChange={(e) => { handle(e.target.files?.[0]); e.target.value = ""; }}
        />
      </div>
      {children}
      {err ? <div className="mt-2"><ErrorBox>{err}</ErrorBox></div> : null}
    </div>
  );
}
