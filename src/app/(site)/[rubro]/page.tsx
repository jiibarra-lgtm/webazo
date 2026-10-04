import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Banner, FloatingWhatsApp, Footer, Header } from '@/components/SiteChrome';
import { DemoPhone } from '@/components/Demos';
import { FaqSection, FeatureList, FinalCta, Packs, Pains, Steps, Testimonials } from '@/components/Sections';
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
  return {
    title: r.seoTitle,
    description: r.seoDescription,
    alternates: { canonical: `/${r.slug}` },
    openGraph: { title: r.seoTitle, description: r.seoDescription, url: `/${r.slug}` },
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

  return (
    <>
      <Banner banner={banner} />
      <CouponBar />
      <Header waMessage={r.whatsappMessage} />
      <main>
        <section className="hero rubro" aria-labelledby="hero-title">
          <div className="wrap">
            <div>
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
        <Pains title="¿Te pasa esto?" items={r.pains} />
        <FeatureList title="Lo que incluye tu webazo" items={r.features} />
        <Packs packs={packs} monthly={monthly} recommended={r.recommendedPack} rubroName={r.name} currency={currency} />
        <Steps />
        <Testimonials items={rubroTestimonials} />
        <FaqSection faqs={faqs} />
        <Contact packs={packs} defaultRubro={r.name} waMessage={r.whatsappMessage} currency={currency} />
        <FinalCta message={r.whatsappMessage} />
      </main>
      <Footer />
      <CouponPopup config={popup} currency={currency} />
      <CartDrawer packs={packs} extras={extras} monthly={monthly} currency={currency} />
      <FloatingWhatsApp message={r.whatsappMessage} />
    </>
  );
}
