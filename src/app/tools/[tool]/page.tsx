import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolBySlug, TOOLS, CATEGORIES } from "@/lib/registry";
import { USER_FAQS } from "@/data/userFaqs";
import ToolClient from "@/components/ToolClient";

interface Props { params: Promise<{ tool: string }> }

export function generateStaticParams() {
  return TOOLS.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = toolBySlug.get(slug);
  if (!tool) return {};
  const url = `/tools/${tool.slug}`;
  const absoluteUrl = `https://www.mapbench.site${url}`;
  return {
    title: tool.name,
    description: tool.short,
    keywords: tool.keywords,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { type: "website", title: `${tool.name} — Free Online Tool`, description: tool.short, url, siteName: "MapBench" },
    twitter: { card: "summary", title: `${tool.name} · MapBench`, description: tool.short },
  };
}

export default async function ToolPage({ params }: Props) {
  const { tool: slug } = await params;
  const tool = toolBySlug.get(slug);
  if (!tool) notFound();
  const category = CATEGORIES.find((c) => c.id === tool.category);
  const url = `/tools/${tool.slug}`;
  const absoluteUrl = `https://www.mapbench.site${url}`;

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
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: tool.howTo,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "MapBench",
      url: "https://www.mapbench.site",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.mapbench.site/" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://www.mapbench.site/tools" },
        ...(category ? [{ "@type": "ListItem", position: 3, name: category.label, item: `https://www.mapbench.site/tools?cat=${category.id}` }] : []),
        { "@type": "ListItem", position: category ? 4 : 3, name: tool.name },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [...tool.faq, ...(USER_FAQS[tool.category] ?? [])].map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolClient slug={tool.slug} />
    </>
  );
}
