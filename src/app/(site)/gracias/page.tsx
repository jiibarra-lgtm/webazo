import type { Metadata } from 'next';
import { Footer, Header } from '@/components/SiteChrome';
import WhatsAppLink from '@/components/WhatsAppLink';
import { WhatsAppIcon } from '@/components/Icons';

export const metadata: Metadata = { title: '¡Gracias! | Webazo', robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ n?: string; pack?: string }> };

export default async function Gracias({ searchParams }: Props) {
  const { n, pack } = await searchParams;
  const name = n ? n.slice(0, 40) : '';
  const msg = `Hola! Soy ${name || 'yo'}, recién dejé mis datos en la web${pack ? ` por el pack ${pack}` : ''}`;
  return (
    <>
      <Header base="/" />
      <main className="simple">
        <div className="wrap">
          <h1>{name ? `¡Gracias, ${name}!` : '¡Gracias!'}</h1>
          <p className="lead">Recibimos tu consulta. Te escribimos por WhatsApp en el día hábil con una propuesta para tu negocio.</p>
          <p className="lead">Si querés ganar tiempo, escribinos ahora y arrancamos.</p>
          <div className="actions">
            <WhatsAppLink message={msg} label="gracias" className="btn btn-orange"><WhatsAppIcon />Escribir ahora</WhatsAppLink>
            <a className="btn btn-dark" href="/">Volver al inicio</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
