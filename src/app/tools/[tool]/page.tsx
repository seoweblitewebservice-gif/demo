import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, toolBySlug, TOOLS } from "@/lib/registry";
import { USER_FAQS } from "@/data/userFaqs";
import ToolClient from "./ToolClient";

interface Props {
  params: Promise<{ tool: string }>;
}

export function generateStaticParams() {
  return TOOLS.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = toolBySlug.get(slug);
  if (!tool) return {};
  const description = tool.intro || tool.short;
  const url = `https://www.mapbench.site/tools/${tool.slug}`;
  return {
    title: `${tool.name} — Free Online Tool`,
    description,
    keywords: tool.keywords,
    alternates: { canonical: `/tools/${tool.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      title: `${tool.name} — Free Online Tool | MapBench`,
      description,
      url,
      siteName: "MapBench",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} · MapBench`,
      description,
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { tool: slug } = await params;
  const tool = toolBySlug.get(slug);
  if (!tool) notFound();
  const category = CATEGORIES.find((c) => c.id === tool.category);
  const absoluteUrl = `https://www.mapbench.site/tools/${tool.slug}`;
  const faqEntities = [...tool.faq, ...(USER_FAQS[tool.category] ?? [])];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${absoluteUrl}#tool`,
      name: tool.name,
      description: tool.short,
      url: absoluteUrl,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (web browser)",
      isAccessibleForFree: true,
      browserRequirements: "Requires JavaScript and HTML5",
      inLanguage: "en",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
      featureList: tool.howTo,
      keywords: tool.keywords.join(", "),
      provider: {
        "@type": "Organization",
        name: "MapBench",
        url: "https://www.mapbench.site",
        logo: { "@type": "ImageObject", url: "https://www.mapbench.site/icon.svg" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `How to use ${tool.name}`,
      description: tool.short,
      inLanguage: "en",
      step: tool.howTo.map((text, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: `Step ${i + 1}`,
        text,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.mapbench.site/" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://www.mapbench.site/tools" },
        ...(category
          ? [{ "@type": "ListItem", position: 3, name: category.label, item: `https://www.mapbench.site/tools?cat=${category.id}` }]
          : []),
        { "@type": "ListItem", position: category ? 4 : 3, name: tool.name, item: absoluteUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqEntities.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": absoluteUrl,
      url: absoluteUrl,
      name: tool.name,
      description: tool.short,
      isPartOf: { "@type": "WebSite", name: "MapBench", url: "https://www.mapbench.site" },
      about: { "@id": `${absoluteUrl}#tool` },
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolClient slug={tool.slug} />
    </>
  );
}
