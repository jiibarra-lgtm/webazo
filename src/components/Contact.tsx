import LeadForm from './LeadForm';
import WhatsAppLink from './WhatsAppLink';
import { WhatsAppIcon } from './Icons';
import type { Pack } from '@/lib/types';

export default function Contact({ packs, defaultRubro, waMessage = 'Hola! Quiero mi webazo' }: { packs: Pack[]; defaultRubro?: string; waMessage?: string }) {
  return (
    <section id="contacto" className="section contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="side">
          <h2 id="contact-title">Hablemos de tu negocio</h2>
          <p>Dejanos tus datos y te escribimos por WhatsApp con una propuesta. Sin compromiso.</p>
          <div className="alt">
            <span>¿Preferís escribir vos?</span>
            <WhatsAppLink message={waMessage} label="contacto_alt" className="btn btn-dark"><WhatsAppIcon />Abrir WhatsApp</WhatsAppLink>
          </div>
        </div>
        <LeadForm packs={packs.map((p) => ({ slug: p.slug, name: p.name, price: p.price_usd }))} defaultRubro={defaultRubro} />
      </div>
    </section>
  );
}
