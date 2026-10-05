import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Banner, FloatingWhatsApp, Footer, Header } from '@/components/SiteChrome';
import { DemoPhone } from '@/components/Demos';
import { Breadcrumbs, FaqSection, FeatureList, FinalCta, GuidesSection, Packs, Pains, RubroIntro, Steps, Testimonials } from '@/components/Sections';
import { JsonLd, breadcrumbLd, faqLd, serviceLd } from '@/lib/seo';
import { RUBRO_SEO } from '@/lib/rubro-seo';
import { GUIDES } from '@/lib/guides';
import Contact from '@/components/Contact';
import CouponBar from '@/components/CouponBar';
import CouponPopup from '@/components/CouponPopup';
import { CartDrawer } from '@/components/Cart';
import WhatsAppLink from '@/components/WhatsAppLink';
import { WhatsAppIcon } from '@/components/Icons';
import { RUBROS, getRubro } from '@/lib/rubros';
import { getPageData } from '@/lib/data';

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return RUBROS.map((r) => ({ rubro: r.slug }));
}

type Params = { params: Promise<{ rubro: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { rubro } = await params;
  const r = getRubro(rubro);
  if (!r) return {};
  const kw = RUBRO_SEO[r.slug]?.keyword;
  const title = kw ? `${kw.charAt(0).toUpperCase()}${kw.slice(1)} en CABA y GBA | Webazo` : r.seoTitle;
  return {
    title,
    description: r.seoDescription,
    alternates: { canonical: `/${r.slug}` },
    openGraph: { type: 'website', locale: 'es_AR', siteName: 'Webazo', title, description: r.seoDescription, url: `/${r.slug}` },
    twitter: { card: 'summary_large_image', title, description: r.seoDescription },
  };
}

const CAPTIONS = {
  turnos: 'Probalo: así sacan turno tus clientes.',
  servicios: 'Probalo: así te consultan tus clientes.',
  catalogo: 'Probalo: así te hacen el pedido tus clientes.',
} as const;

export default async function RubroPage({ params }: Params) {
  const { rubro } = await params;
  const r = getRubro(rubro);
  if (!r) notFound();
  const { packs, faqs, testimonials, monthly, banner, popup, currency, extras } = await getPageData();
  const rubroTestimonials = testimonials.filter((t) => !t.rubro || t.rubro === r.name);
  const seo = RUBRO_SEO[r.slug];
  const allFaqs = [...(seo?.faqs ?? []).map((f, i) => ({ id: `r${i}`, question: f.question, answer: f.answer, sort_order: i, active: true })), ...faqs];
  const recPack = packs.find((p) => p.slug === r.recommendedPack);
  const relatedGuides = GUIDES.filter((g) => g.related.includes(r.slug)).concat(GUIDES).filter((g, i, a) => a.findIndex((x) => x.slug === g.slug) === i).slice(0, 3);

  return (
    <>
      <Banner banner={banner} />
      <CouponBar />
      <Header waMessage={r.whatsappMessage} />
      <main>
        <section className="hero rubro" aria-labelledby="hero-title">
          <div className="wrap">
            <div>
              <Breadcrumbs items={[{ name: 'Inicio', href: '/' }, { name: 'Rubros', href: '/#rubros' }, { name: r.name }]} />
              <h1 id="hero-title">{r.title}</h1>
              <p className="lead">{r.lead}</p>
              <div className="actions">
                <WhatsAppLink message={r.whatsappMessage} label={`hero_${r.slug}`} className="btn btn-orange"><WhatsAppIcon />Quiero el mío</WhatsAppLink>
                <a className="btn btn-ghost" href="#packs">Ver precios</a>
              </div>
              <ul className="facts">
                <li>Online en 72 hs</li>
                <li>Dominio a tu nombre</li>
                <li>Sin conocimientos técnicos</li>
              </ul>
            </div>
            <DemoPhone kind={r.demo} caption={CAPTIONS[r.demo]} data={r.demoData} />
          </div>
        </section>
        {seo && <RubroIntro heading={`${seo.keyword.charAt(0).toUpperCase()}${seo.keyword.slice(1)}: cómo te ayuda`} paragraphs={seo.intro} />}
        <Pains title="¿Te pasa esto?" items={r.pains} />
        <FeatureList title="Lo que incluye tu webazo" items={r.features} />
        <Packs packs={packs} monthly={monthly} recommended={r.recommendedPack} rubroName={r.name} currency={currency} />
        <Steps />
        <Testimonials items={rubroTestimonials} />
        <FaqSection faqs={allFaqs} />
        <GuidesSection guides={relatedGuides} title="Guías que te pueden servir" />
        <Contact packs={packs} defaultRubro={r.name} waMessage={r.whatsappMessage} currency={currency} />
        <FinalCta message={r.whatsappMessage} />
      </main>
      <Footer />
      <CouponPopup config={popup} currency={currency} packs={packs.map((p) => ({ slug: p.slug, name: p.name, price: p.price_usd, featured: p.featured }))} />
      <CartDrawer packs={packs} extras={extras} monthly={monthly} currency={currency} />
      <FloatingWhatsApp message={r.whatsappMessage} />
      <JsonLd data={[
        breadcrumbLd([{ name: 'Inicio', path: '/' }, { name: r.name, path: `/${r.slug}` }]),
        serviceLd({ name: seo ? seo.keyword.charAt(0).toUpperCase() + seo.keyword.slice(1) : r.title, description: r.seoDescription, path: `/${r.slug}`, audience: r.name, price: recPack?.price_usd }),
        faqLd(allFaqs),
      ]} />
    </>
  );
}
