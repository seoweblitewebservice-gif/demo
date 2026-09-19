import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, LOCALES, LOCALE_NAMES } from "@/lib/i18n";
interface Props { params: Promise<{ locale: string }>; children: ReactNode }
export function generateStaticParams(){return LOCALES.map(locale=>({locale}));}
export default async function LocaleLayout({children,params}:Props){const {locale}=await params;if(!isLocale(locale))notFound();return <div lang={locale} dir={locale==="ar"?"rtl":"ltr"} data-locale={locale} data-locale-name={LOCALE_NAMES[locale]}>{children}</div>;}
