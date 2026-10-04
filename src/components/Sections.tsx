import { CheckIcon, WhatsAppIcon } from './Icons';
import WhatsAppLink from './WhatsAppLink';
import PackCouponPrice from './PackCouponPrice';
import { RUBROS } from '@/lib/rubros';
import type { Faq, Monthly, Pack, Testimonial } from '@/lib/types';

const fmt = (n: number) => n.toLocaleString('es-AR', { maximumFractionDigits: 0 });

export function Pains({ title, lead, items }: { title: string; lead?: string; items: { title: string; text: string }[] }) {
  return (
    <section className="section mist" aria-labelledby="pains-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="pains-title">{title}</h2>
          {lead && <p>{lead}</p>}
        </div>
        <ul className="pains">
          {items.map((p) => (
            <li key={p.title}><h3>{p.title}</h3><p>{p.text}</p></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Packs({ packs, monthly, recommended, rubroName }: { packs: Pack[]; monthly: Monthly; recommended?: string; rubroName?: string }) {
  return (
    <section id="packs" className="section" aria-labelledby="packs-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="packs-title">Elegí tu webazo</h2>
          <p>Precio cerrado, sin sorpresas. Todos incluyen dominio .com.ar a tu nombre, certificado de seguridad y diseño adaptado al celu.</p>
        </div>
        <div className="packs-grid">
          {packs.map((p) => {
            const isRec = recommended === p.slug;
            const cls = ['pack', p.featured ? 'featured' : '', isRec && !p.featured ? 'recommended' : ''].join(' ').trim();
            const msg = rubroName ? `Hola! Me interesa el pack ${p.name} (${rubroName})` : `Hola! Me interesa el pack ${p.name}`;
            return (
              <article key={p.id} className={cls}>
                <div className="pack-name">
                  <h3>{p.name}</h3>
                  {isRec ? <span className="badge">Recomendado para vos</span> : p.featured ? <span className="badge">El más completo</span> : null}
                </div>
                {p.tagline && <p className="for">{p.tagline}</p>}
                <div className="price">
                  <span className="from">desde</span>
                  <div className="row">
                    <span className="amount"><small>USD</small> {fmt(p.price_usd)}</span>
                    {p.price_before_usd && p.price_before_usd > p.price_usd && <s>USD {fmt(p.price_before_usd)}</s>}
                  </div>
                  {p.price_note && <span className="note">{p.price_note}</span>}
                  <PackCouponPrice slug={p.slug} price={p.price_usd} />
                </div>
                <ul className="includes">
                  {p.features.map((f) => <li key={f}><CheckIcon />{f}</li>)}
                </ul>
                <WhatsAppLink message={msg} label={`pack_${p.slug}`} className={`btn ${p.featured ? 'btn-orange' : 'btn-dark'}`}>
                  {p.cta_label || `Quiero el ${p.name}`}
                </WhatsAppLink>
              </article>
            );
          })}
        </div>
        <div className="monthly">
          <div>
            <h3>{monthly.title}</h3>
            <p>{monthly.description}</p>
          </div>
          <span className="amount">USD {fmt(monthly.price_usd)}/mes</span>
        </div>
        <p className="small-note">Precios en dólares de referencia, pagables en pesos al valor del día.</p>
      </div>
    </section>
  );
}

export function RubrosGrid() {
  const featured = RUBROS.filter((r) => r.featured);
  return (
    <section id="rubros" className="section dark" aria-labelledby="rubros-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="rubros-title">Hecho para tu rubro</h2>
          <p>No hacemos webs genéricas: cada negocio necesita algo distinto. Elegí el tuyo y mirá cómo quedaría.</p>
        </div>
        <div className="ex-grid">
          {featured.map((r) => (
            <a key={r.slug} className="ex" href={`/${r.slug}`}>
              <h3>{r.name}</h3>
              <p>{r.lead}</p>
              <ul>{r.features.slice(0, 3).map((f) => <li key={f}>{f}</li>)}</ul>
              <span className="more">Ver cómo funciona</span>
            </a>
          ))}
        </div>
        <h3 className="chips-title">Todos los rubros</h3>
        <ul className="rubro-chips">
          {RUBROS.map((r) => <li key={r.slug}><a href={`/${r.slug}`}>{r.name}</a></li>)}
        </ul>
        <p className="ex-note">¿No ves el tuyo? Escribinos: hacemos webs para cualquier negocio.</p>
      </div>
    </section>
  );
}

export function FeatureList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="section dark" aria-labelledby="features-title">
      <div className="wrap">
        <div className="section-head"><h2 id="features-title">{title}</h2></div>
        <ul className="feature-list">{items.map((f) => <li key={f}><CheckIcon />{f}</li>)}</ul>
      </div>
    </section>
  );
}

export function Steps() {
  return (
    <section className="section" aria-labelledby="steps-title">
      <div className="wrap">
        <div className="section-head"><h2 id="steps-title">Así de simple</h2></div>
        <ol className="steps">
          <li><h3>Nos escribís</h3><p>Por WhatsApp o con el formulario nos contás qué hace tu negocio y qué necesitás.</p></li>
          <li><h3>Armamos tu webazo</h3><p>Diseño, textos y dominio propio. Vos solo aprobás.</p></li>
          <li><h3>En 72 hs estás online</h3><p>Te la entregamos funcionando y te enseñamos a usarla.</p></li>
        </ol>
      </div>
    </section>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <section className="section mist" aria-labelledby="quotes-title">
      <div className="wrap">
        <div className="section-head"><h2 id="quotes-title">Lo que dicen nuestros clientes</h2></div>
        <div className="quotes">
          {items.map((t) => (
            <figure key={t.id} className="quote">
              <blockquote>“{t.quote}”</blockquote>
              <figcaption><strong>{t.author}</strong>{[t.business, t.rubro].filter(Boolean).join(', ')}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  return (
    <section id="preguntas" className="section mist" aria-labelledby="faq-title">
      <div className="wrap">
        <div className="section-head"><h2 id="faq-title">Preguntas frecuentes</h2></div>
        <div className="faq-list">
          {faqs.map((f) => (
            <details key={f.id}><summary>{f.question}</summary><p>{f.answer}</p></details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta({ message = 'Hola! Quiero mi webazo' }: { message?: string }) {
  return (
    <section className="section final" aria-labelledby="final-title">
      <div className="wrap">
        <h2 id="final-title">Tu negocio online en 72 hs.</h2>
        <p>Escribinos, contanos de tu negocio y te decimos qué pack te conviene.</p>
        <WhatsAppLink message={message} label="cta_final" className="btn btn-dark">
          <WhatsAppIcon />Pedí tu webazo por WhatsApp
        </WhatsAppLink>
      </div>
    </section>
  );
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };
}
