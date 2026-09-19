"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_NAMES, LOCALE_LABELS, localizedPath, type Locale } from "@/lib/i18n";

export default function LanguageSwitcher({ locale }: { locale?: Locale }) {
  const pathname = usePathname();
  const current = locale ?? null;
  const basePath = current ? (pathname.replace(new RegExp(`^/${current}(?=/|$)`), "") || "/") : pathname;
  return (
    <details className="relative">
      <summary className="cursor-pointer list-none rounded border border-line px-2.5 py-1 text-[12px] font-bold text-mute hover:border-brand hover:text-brand-strong">
        {current ? LOCALE_NAMES[current] : "Language"} ▾
      </summary>
      <div className="absolute right-0 top-full z-50 mt-1 grid max-h-[70vh] w-72 grid-cols-2 gap-1 overflow-y-auto rounded-lg border border-line bg-card p-2 shadow-xl">
        {LOCALES.map((l) => (
          <Link key={l} href={localizedPath(l, basePath)} hrefLang={l} className={`rounded px-2.5 py-2 text-xs font-semibold hover:bg-well ${l === current ? "text-brand-strong" : "text-ink"}`}>
            {LOCALE_NAMES[l]}
          </Link>
        ))}
      </div>
    </details>
  );
}
