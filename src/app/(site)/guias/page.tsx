import type { Metadata } from 'next';
import { Footer, Header } from '@/components/SiteChrome';
import { Breadcrumbs, GuidesSection } from '@/components/Sections';
import { GUIDES } from '@/lib/guides';
import { JsonLd, breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Guías sobre páginas web para negocios | Webazo',
  description: 'Cuánto cuesta una página web, cómo aparecer en Google Maps, web o Instagram y qué tiene que tener la web de tu negocio.',
  alternates: { canonical: '/guias' },
};

export default function GuiasPage() {
  return (
    <>
      <Header base="/" />
      <main>
        <section className="simple" style={{ paddingBottom: 0 }}>
          <div className="wrap">
            <Breadcrumbs items={[{ name: 'Inicio', href: '/' }, { name: 'Guías' }]} />
            <h1>Guías para tu negocio</h1>
            <p className="lead">Todo lo que conviene saber antes de tener tu página web, explicado sin vueltas.</p>
          </div>
        </section>
        <GuidesSection guides={GUIDES} title="Todas las guías" />
      </main>
      <Footer />
      <JsonLd data={breadcrumbLd([{ name: 'Inicio', path: '/' }, { name: 'Guías', path: '/guias' }])} />
    </>
  );
}
