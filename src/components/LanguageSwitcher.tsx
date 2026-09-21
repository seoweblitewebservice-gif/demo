"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LOCALES, LOCALE_NAMES, isLocale, type Locale } from "@/lib/i18n";

const EN_LABEL = "English";

/** Build path for a target language, preserving tool/page when possible. */
function pathForLocale(pathname: string, target: "en" | Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  const first = parts[0];
  const rest = first && isLocale(first) ? parts.slice(1) : parts;

  if (target === "en") {
    return rest.length ? `/${rest.join("/")}` : "/";
  }

  // Locale routes: home, tools index, guides index, tool pages
  if (rest.length === 0) return `/${target}`;
  if (rest[0] === "tools" || rest[0] === "guides") {
    return `/${target}/${rest.join("/")}`;
  }
  // Other EN-only pages → locale home
  return `/${target}`;
}

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const first = pathname.split("/").filter(Boolean)[0];
  const current: "en" | Locale = first && isLocale(first) ? first : "en";
  const currentLabel = current === "en" ? "EN" : current.toUpperCase();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const select = (target: "en" | Locale) => {
    setOpen(false);
    if (target === current) return;
    router.push(pathForLocale(pathname, target));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="btn btn-ghost btn-sm gap-1.5"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M3 12h18M12 3c2.5 2.8 3.8 6 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-6-3.8-9s1.3-6.2 3.8-9z" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span className="text-[12px] font-extrabold tracking-wide">{currentLabel}</span>
        <span aria-hidden className="text-[9px] opacity-70">▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Languages"
          className="absolute right-0 top-full z-50 mt-1 max-h-[70vh] w-52 overflow-y-auto rounded-lg border border-line bg-card py-1 shadow-xl"
        >
          <button
            type="button"
            role="option"
            aria-selected={current === "en"}
            className={`flex w-full items-center justify-between px-3 py-2 text-left text-[13px] font-semibold hover:bg-brand-soft ${
              current === "en" ? "text-brand-strong" : "text-ink"
            }`}
            onClick={() => select("en")}
          >
            <span>{EN_LABEL}</span>
            {current === "en" && <span className="text-[11px]">✓</span>}
          </button>
          <div className="my-1 border-t border-line" />
          {LOCALES.map((locale) => (
            <button
              key={locale}
              type="button"
              role="option"
              aria-selected={current === locale}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-[13px] font-semibold hover:bg-brand-soft ${
                current === locale ? "text-brand-strong" : "text-ink"
              }`}
              onClick={() => select(locale)}
            >
              <span>
                <span className="mr-2 inline-block w-7 text-[11px] font-extrabold uppercase text-mute">
                  {locale}
                </span>
                {LOCALE_NAMES[locale]}
              </span>
              {current === locale && <span className="text-[11px]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
