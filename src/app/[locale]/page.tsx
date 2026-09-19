import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, TOOLS } from "@/lib/registry";
import { ALL_GUIDES } from "@/data/allGuides";
import { isLocale, LOCALES, LOCALE_NAMES, type Locale } from "@/lib/i18n";

interface Props { params: Promise<{ locale: string }> }
const BASE="https://www.mapbench.site";
export function generateStaticParams(){ return LOCALES.map(locale=>({locale})); }
export async function generateMetadata({params}:Props):Promise<Metadata>{ const {locale}=await params; if(!isLocale(locale))return{}; return { title:`Free Map Tools in ${LOCALE_NAMES[locale]} · MapBench`, description:`MapBench geographic tools and maps in ${LOCALE_NAMES[locale]}.`, alternates:{canonical:`/${locale}`,languages:Object.fromEntries(["en",...LOCALES].map(l=>[l,l==="en"?BASE:`${BASE}/${l}`]))} }; }
export default async function LocalizedHome({params}:Props){ const {locale}=await params; if(!isLocale(locale))notFound(); return <div className="doc">
  <section className="border-b border-line py-10 text-center sm:py-14"><h1 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">MapBench — {LOCALE_NAMES[locale]}</h1><p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-mute">Free geographic tools for distance, area, radius, routing, coordinates, elevation, GPS files and blank maps.</p><Link href={`/${locale}/tools`} className="btn btn-primary mt-6 inline-flex">Explore tools</Link></section>
  <section className="mx-auto max-w-3xl py-10"><h2 className="sect-h">Map tools</h2><p className="mt-3">Browse the full MapBench tool directory. Interactive calculations run in your browser and results can be shared by URL.</p>{CATEGORIES.map(cat=><div key={cat.id} className="mt-8"><h3 className="font-sans text-[11px] font-extrabold uppercase tracking-[0.14em] text-mute">{cat.label}</h3><div className="mt-3 grid gap-2 sm:grid-cols-2">{TOOLS.filter(t=>t.category===cat.id).slice(0,12).map(t=><Link key={t.slug} href={`/${locale}/tools/${t.slug}`} className="card p-3"><div className="font-bold">{t.name}</div><div className="mt-1 text-xs text-mute">{t.short}</div></Link>)}</div></div>)}</section>
  <section className="border-t border-line py-10"><div className="mx-auto max-w-3xl"><h2 className="sect-h">International language support</h2><p className="mt-3">MapBench provides language-specific URLs so visitors can choose their preferred language. Use the language switcher to move between versions without changing the tool or result.</p></div></section>
</div>; }
