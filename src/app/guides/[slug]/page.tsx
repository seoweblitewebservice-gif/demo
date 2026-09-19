import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { type GuideBlock } from "@/data/guides";
import { ALL_GUIDES, allGuideBySlug } from "@/data/allGuides";
import { toolBySlug, CATEGORIES } from "@/lib/registry";
import { TOOL_COPY } from "@/data/toolCopy";
import { CATEGORY_ESSAYS } from "@/data/categoryEssays";
import { GUIDE2 } from "@/data/categoryGuide2";
import { LIMITS } from "@/data/categoryGuide4";
import { GUIDE3 } from "@/data/categoryGuide3";
import { CATEGORY_TIPS, CATEGORY_GLOSSARY } from "@/data/categoryExtras";

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return ALL_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = allGuideBySlug.get(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: { title: g.title, description: g.description, type: "article" },
  };
}

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

function Block({ b }: { b: GuideBlock }) {
  switch (b.t) {
    case "h2": return <h2>{b.text}</h2>;
    case "p": return <p>{b.text}</p>;
    case "ul": return <ul>{b.items.map((i) => <li key={i}>{i}</li>)}</ul>;
    case "note":
      return <aside className="my-4 rounded-xl border border-brand/30 bg-brand-soft px-4 py-3 text-sm leading-relaxed text-brand-strong"><strong>Note: </strong>{b.text}</aside>;
    case "toolbox": {
      const tools = b.slugs.map((s) => toolBySlug.get(s)).filter(Boolean);
      return (
        <div className="my-5 rounded-xl border border-line bg-card p-4 font-sans">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-mute">Tools used in this post</div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {tools.map((t) => (
              <a key={t!.slug} href={`/tools/${t!.slug}`} className="group rounded-lg border border-line px-3 py-2 hover:border-brand">
                <span className="block text-sm font-extrabold group-hover:text-brand-strong">→ {t!.name}</span>
                <span className="mt-0.5 line-clamp-1 block text-xs text-mute">{t!.short}</span>
              </a>
            ))}
          </div>
        </div>
      );
    }
  }
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const g = allGuideBySlug.get(slug);
  if (!g) notFound();
  const others = ALL_GUIDES.filter((x) => x.slug !== slug);

  // ---- Long-form depth engine: compose original editorial sections until the
  // ---- post lands inside the 2,000–2,500 word window.
  const bodyWords = g.blocks.reduce((acc, b) => {
    if (b.t === "p" || b.t === "h2" || b.t === "note") return acc + words(b.text);
    if (b.t === "ul") return acc + b.items.reduce((a, i) => a + words(i), 0);
    return acc;
  }, 0);

  const toolboxSlugs = g.blocks.filter((b) => b.t === "toolbox").flatMap((b) => (b as { slugs: string[] }).slugs);
  const firstTool = toolBySlug.get(toolboxSlugs[0] ?? "");
  const cat = CATEGORIES.find((c) => c.id === (firstTool?.category ?? "location")) ?? CATEGORIES[0];

  const sections: { w: number; node: ReactNode }[] = [];

  if (toolboxSlugs.length) {
    const deep = toolboxSlugs.map((s) => toolBySlug.get(s)).filter((t) => t && TOOL_COPY[t.slug]);
    const text = deep.map((t) => `${t!.name} ${t!.short} ${TOOL_COPY[t!.slug].paras.join(" ")}`).join(" ");
    sections.push({
      w: words(text),
      node: (
        <section aria-label="The toolkit, in depth">
          <h2>The toolkit behind this post, in depth</h2>
          {deep.map((t) => (
            <div key={t!.slug} className="mt-4">
              <h3><Link href={`/tools/${t!.slug}`} className="toollink">{t!.name}</Link></h3>
              {TOOL_COPY[t!.slug].paras.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          ))}
        </section>
      ),
    });
  }

  const essay = CATEGORY_ESSAYS[cat.id];
  sections.push({
    w: words(essay.title) + essay.paras.reduce((a, p) => a + words(p), 0),
    node: (
      <section aria-label="Wider context">
        <h2>{essay.title}</h2>
        {essay.paras.map((p, i) => <p key={i}>{p}</p>)}
      </section>
    ),
  });

  const g2 = GUIDE2[cat.id];
  sections.push({
    w: words(g2.title) + g2.paras.reduce((a, p) => a + words(p), 0) + g2.pros.reduce((a, p) => a + words(p), 0),
    node: (
      <section aria-label="Professional practice">
        <h2>{g2.title}</h2>
        {g2.paras.map((p, i) => <p key={i}>{p}</p>)}
        <ul>{g2.pros.map((p) => <li key={p}>{p}</li>)}</ul>
      </section>
    ),
  });

  const lim = LIMITS[cat.id];
  sections.push({
    w: lim.paras.reduce((a, p) => a + words(p), 0) + lim.escalate.reduce((a, p) => a + words(p), 0),
    node: (
      <section aria-label="Honest limits">
        <h2>Honest limits &amp; when to escalate</h2>
        {lim.paras.map((p, i) => <p key={i}>{p}</p>)}
        <ul>{lim.escalate.map((e) => <li key={e}>{e}</li>)}</ul>
      </section>
    ),
  });

  const g3 = GUIDE3[cat.id];
  sections.push({
    w: g3.master.reduce((a, [t, b]) => a + words(t) + words(b), 0) + words(g3.regional),
    node: (
      <section aria-label="Masterclass">
        <h2>Step-by-step masterclass</h2>
        <ol>{g3.master.map(([t, b]) => <li key={t}><strong>{t} — </strong>{b}</li>)}</ol>
        <p>{g3.regional}</p>
      </section>
    ),
  });

  const tips = CATEGORY_TIPS[cat.id];
  sections.push({
    w: tips.reduce((a, p) => a + words(p), 0),
    node: (
      <section aria-label="Tips and common mistakes">
        <h2>Tips &amp; common mistakes</h2>
        {tips.map((p, i) => <p key={i}>{p}</p>)}
      </section>
    ),
  });

  const gloss = CATEGORY_GLOSSARY[cat.id];
  sections.push({
    w: gloss.reduce((a, [t, d]) => a + words(t) + words(d), 0) + g3.qa.reduce((a, [q, an]) => a + words(q) + words(an), 0),
    node: (
      <section aria-label="Glossary and quick answers">
        <h2>Quick glossary</h2>
        <ul>{gloss.map(([t, d]) => <li key={t}><strong>{t}:</strong> {d}</li>)}</ul>
        <h2>Two more questions, answered</h2>
        {g3.qa.map(([q, an]) => (
          <div key={q}><h3>{q}</h3><p>{an}</p></div>
        ))}
      </section>
    ),
  });

  let acc = bodyWords;
  const chosen: ReactNode[] = [];
  for (const s of sections) {
    if (acc >= 2000 && acc + s.w > 2500) continue;
    chosen.push(s.node);
    acc += s.w;
    if (acc >= 2000 && acc > 2300) break;
  }

  return (
    <article className="doc mx-auto max-w-3xl">
      <nav aria-label="Breadcrumb" className="mb-4 font-sans text-xs text-mute">
        <Link href="/" className="hover:text-brand-strong">Home</Link> / <Link href="/guides" className="hover:text-brand-strong">Blog</Link> / <span className="font-semibold text-ink">{g.title}</span>
      </nav>
      <p className="font-sans text-xs font-bold uppercase tracking-wide text-mute">{new Date(g.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · {g.readMins} min read · MapForge editorial</p>
      <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{g.title}</h1>
      <div className="mt-6">
        {g.blocks.map((b, i) => <Block key={i} b={b} />)}
      </div>
      <div className="mt-8 space-y-8 border-t border-line pt-8">
        {chosen}
      </div>
      <div className="mt-10 border-t border-line pt-6 font-sans">
        <h2 className="font-display text-lg font-bold">Keep reading</h2>
        <ul className="mt-3 space-y-2">
          {others.slice(0, 4).map((o) => (
            <li key={o.slug}><Link href={`/guides/${o.slug}`} className="text-sm font-bold text-brand-strong hover:underline">→ {o.title}</Link></li>
          ))}
        </ul>
      </div>
    </article>
  );
}
