import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, TOOLS } from "@/lib/registry";
import { isLocale, type Locale } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
export default async function LocalizedTools({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return <div className="doc"><div className="mb-4 flex justify-end"><LanguageSwitcher locale={locale}/></div><h1 className="font-display text-3xl font-bold">MapBench Tools</h1><p className="mt-3 max-w-3xl text-mute">Browse geographic calculators, map utilities, coordinate converters, routing tools and file tools.</p>{CATEGORIES.map(c=><section key={c.id} className="mt-8"><h2 className="sect-h">{c.label}</h2><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{TOOLS.filter(t=>t.category===c.id).map(t=><Link key={t.slug} href={`/${locale}/tools/${t.slug}`} className="card p-4"><div className="font-bold">{t.name}</div><p className="mt-1 text-xs text-mute">{t.short}</p></Link>)}</div></section>)}</div>}
