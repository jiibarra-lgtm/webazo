import { Banner, FloatingWhatsApp, Footer, Header } from '@/components/SiteChrome';
import { DemoPhone } from '@/components/Demos';
import { FaqSection, FinalCta, GuidesSection, Packs, Pains, RubrosGrid, Steps, Testimonials } from '@/components/Sections';
import Contact from '@/components/Contact';
import CouponBar from '@/components/CouponBar';
import CouponPopup from '@/components/CouponPopup';
import { CartDrawer } from '@/components/Cart';
import WhatsAppLink from '@/components/WhatsAppLink';
import { WhatsAppIcon } from '@/components/Icons';
import { getPageData } from '@/lib/data';
import { JsonLd, faqLd, organizationLd, websiteLd } from '@/lib/seo';
import { GUIDES } from '@/lib/guides';

export const revalidate = 300;

export default async function Home() {
  const { packs, faqs, testimonials, monthly, banner, popup, currency, extras } = await getPageData();

  return (
    <>
      <Banner banner={banner} />
      <CouponBar />
      <Header />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap">
            <div>
              <h1 id="hero-title"><span className="kicker">Diseño de páginas web para negocios en CABA y GBA</span><span>No hagas una web.</span><span className="second">Hacé un webazo.</span></h1>
              <p className="lead">Páginas web con turnos online, catálogos y pedidos por WhatsApp. Online en 72 hs, con dominio propio y listas para aparecer en Google.</p>
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
        <Packs packs={packs} monthly={monthly} currency={currency} />
        <RubrosGrid />
        <Steps />
        <Testimonials items={testimonials} />
        <FaqSection faqs={faqs} />
        <GuidesSection guides={GUIDES} />
        <Contact packs={packs} currency={currency} />
        <FinalCta />
      </main>
      <Footer />
      <CouponPopup config={popup} currency={currency} packs={packs.map((p) => ({ slug: p.slug, name: p.name, price: p.price_usd, featured: p.featured }))} />
      <CartDrawer packs={packs} extras={extras} monthly={monthly} currency={currency} />
      <FloatingWhatsApp />
      <JsonLd data={[organizationLd(packs), websiteLd(), faqLd(faqs)]} />
    </>
  );
}
