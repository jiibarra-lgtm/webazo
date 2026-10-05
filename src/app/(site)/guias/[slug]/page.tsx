import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer, FloatingWhatsApp, Header } from '@/components/SiteChrome';
import { Breadcrumbs } from '@/components/Sections';
import { GUIDES, getGuide } from '@/lib/guides';
import { getRubro } from '@/lib/rubros';
import { JsonLd, articleLd, breadcrumbLd } from '@/lib/seo';

export const dynamicParams = false;
export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: `${g.title} | Webazo`,
    description: g.description,
    alternates: { canonical: `/guias/${g.slug}` },
    openGraph: { type: 'article', locale: 'es_AR', siteName: 'Webazo', title: g.title, description: g.description, url: `/guias/${g.slug}`, publishedTime: g.date, modifiedTime: g.updated },
    twitter: { card: 'summary_large_image', title: g.title, description: g.description },
  };
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const path = `/guias/${g.slug}`;
  const related = g.related.map(getRubro).filter(Boolean);

  return (
    <>
      <Header base="/" />
      <main className="simple">
        <article className="wrap prose guide">
          <Breadcrumbs items={[{ name: 'Inicio', href: '/' }, { name: 'Guías', href: '/guias' }, { name: g.title }]} />
          <h1>{g.title}</h1>
          <p className="lead">{g.description}</p>
          <p className="guide-meta">Actualizada el {new Date(g.updated).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })} · {g.readMin} min de lectura</p>
          {g.body.map((b, i) => {
            if (b.t === 'h2') return <h2 key={i}>{b.text}</h2>;
            if (b.t === 'p') return <p key={i}>{b.text}</p>;
            if (b.t === 'ul') return <ul key={i}>{b.items.map((x) => <li key={x}>{x}</li>)}</ul>;
            return <p key={i}><a className="btn btn-orange" href={b.href}>{b.text}</a></p>;
          })}
          {related.length > 0 && (
            <aside className="guide-related" aria-label="Páginas web por rubro">
              <h2>Mirá cómo quedaría la web de tu rubro</h2>
              <ul>{related.map((r) => <li key={r!.slug}><a href={`/${r!.slug}`}>{r!.title}</a></li>)}</ul>
            </aside>
          )}
        </article>
      </main>
      <Footer />
      <FloatingWhatsApp />
      <JsonLd data={[
        articleLd({ title: g.title, description: g.description, path, date: g.date, updated: g.updated }),
        breadcrumbLd([{ name: 'Inicio', path: '/' }, { name: 'Guías', path: '/guias' }, { name: g.title, path }]),
      ]} />
    </>
  );
}
