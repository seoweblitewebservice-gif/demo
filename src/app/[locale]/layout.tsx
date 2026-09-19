import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, LOCALES, LOCALE_NAMES, type Locale } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchPalette from "@/components/SearchPalette";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface Props { params: Promise<{ locale: string }> }

export function generateStaticParams() { return LOCALES.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const base = "https://www.mapbench.site";
  return {
    title: { default: `MapBench — ${LOCALE_NAMES[locale]} map tools`, template: `%s · MapBench` },
    alternates: { languages: Object.fromEntries(["en", ...LOCALES].map((l) => [l, l === "en" ? base : `${base}/${l}`])) },
  };
}

export default async function LocaleLayout({ children, params }: Props & { children: ReactNode }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        <Header locale={locale} />
        <main id="main" className="container-sf py-6 sm:py-8">{children}</main>
        <Footer />
        <SearchPalette />
      </body>
    </html>
  );
}
