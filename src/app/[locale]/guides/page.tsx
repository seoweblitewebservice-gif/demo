import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_GUIDES } from "@/data/allGuides";
import { isLocale } from "@/lib/i18n";
import { LOCALE_NAMES } from "@/lib/i18n";
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return isLocale(locale)?{title:`MapBench Guides · ${LOCALE_NAMES[locale]}`,robots:{index:false,follow:true}}:{}};
export default async function LocalizedGuides({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return <div className="doc mx-auto max-w-4xl"><h1 className="font-display text-3xl font-bold">MapBench Guides</h1><p className="mt-3 text-mute">Geographic explainers, methods and practical map workflows.</p><div className="mt-8 grid gap-4 sm:grid-cols-2">{ALL_GUIDES.map(g=><Link key={g.slug} href={`/${locale}/guides/${g.slug}`} className="card p-5"><div className="font-display font-bold">{g.title}</div><p className="mt-1 text-sm text-mute">{g.description}</p></Link>)}</div></div>}
