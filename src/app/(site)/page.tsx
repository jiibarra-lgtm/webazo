import { Banner, FloatingWhatsApp, Footer, Header } from '@/components/SiteChrome';
import { DemoPhone } from '@/components/Demos';
import { FaqSection, FinalCta, Packs, Pains, RubrosGrid, Steps, Testimonials, faqJsonLd } from '@/components/Sections';
import Contact from '@/components/Contact';
import CouponBar from '@/components/CouponBar';
import CouponPopup from '@/components/CouponPopup';
import WhatsAppLink from '@/components/WhatsAppLink';
import { WhatsAppIcon } from '@/components/Icons';
import { getPageData } from '@/lib/data';
import { env, contact } from '@/lib/env';

export const revalidate = 300;

export default async function Home() {
  const { packs, faqs, testimonials, monthly, banner, popup } = await getPageData();

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Webazo',
    description: 'Páginas web y sistemas para negocios: turnos online, catálogos, pedidos y cotizadores.',
    url: env.siteUrl,
    email: contact.email,
    telephone: '+54 9 11 6025-4550',
    areaServed: ['Ciudad Autónoma de Buenos Aires', 'Gran Buenos Aires'],
    sameAs: [`https://www.instagram.com/${contact.instagram}`],
    makesOffer: packs.map((p) => ({ '@type': 'Offer', name: `Pack ${p.name}`, price: p.price_usd, priceCurrency: 'USD' })),
  };

  return (
    <>
      <Banner banner={banner} />
      <CouponBar />
      <Header />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap">
            <div>
              <h1 id="hero-title"><span>No hagas una web.</span><span className="second">Hacé un webazo.</span></h1>
              <p className="lead">Páginas web y sistemas para negocios de CABA y GBA. Online en 72 hs, con dominio propio.</p>
              <div className="actions">
                <WhatsAppLink message="Hola! Quiero mi webazo" label="hero" className="btn btn-orange"><WhatsAppIcon />Pedí tu webazo</WhatsAppLink>
                <a className="btn btn-ghost" href="#packs">Ver packs y precios</a>
              </div>
              <ul className="facts">
                <li>Dominio a tu nombre</li>
                <li>Se ve perfecta en el celu</li>
                <li>Aparecés en Google</li>
              </ul>
            </div>
            <DemoPhone kind="turnos" caption="Probalo: así sacan turno tus clientes, sin escribirte." />
          </div>
        </section>

        <Pains
          title="Si no te encuentran, eligen al de al lado."
          lead="Instagram suma, pero tu web es tu local en internet: es tuya, aparece en Google y atiende cuando vos no podés."
          items={[
            { title: 'No aparecés en Google', text: 'Cuando alguien busca tu rubro en tu zona, encuentra a tu competencia.' },
            { title: 'Hacés todo a mano por WhatsApp', text: 'Precios, horarios y turnos que se podrían resolver solos mientras trabajás.' },
            { title: 'Tu web no anda en el celu', text: 'Casi todos tus clientes te van a ver desde el teléfono. Si se ve mal, se van.' },
          ]}
        />
        <Packs packs={packs} monthly={monthly} />
        <RubrosGrid />
        <Steps />
        <Testimonials items={testimonials} />
        <FaqSection faqs={faqs} />
        <Contact packs={packs} />
        <FinalCta />
      </main>
      <Footer />
      <CouponPopup config={popup} />
      <FloatingWhatsApp />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }} />
    </>
  );
}
