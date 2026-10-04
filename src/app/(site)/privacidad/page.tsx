import type { Metadata } from 'next';
import { Footer, Header } from '@/components/SiteChrome';
import { contact } from '@/lib/env';

export const metadata: Metadata = { title: 'Política de privacidad | Webazo', alternates: { canonical: '/privacidad' } };

export default function Privacidad() {
  return (
    <>
      <Header base="/" />
      <main className="simple">
        <div className="wrap prose">
          <h1>Política de privacidad</h1>
          <p className="lead">Última actualización: {new Date().getFullYear()}.</p>
          <h2>Qué datos recolectamos</h2>
          <p>Cuando completás el formulario guardamos tu nombre, teléfono, y opcionalmente mail, nombre de tu negocio, rubro y el mensaje que nos dejes. También registramos de qué anuncio o sitio llegaste (parámetros UTM) para medir nuestras campañas.</p>
          <h2>Para qué los usamos</h2>
          <p>Solo para contactarte por tu consulta y enviarte una propuesta. No vendemos ni cedemos tus datos a terceros.</p>
          <h2>Cookies y medición</h2>
          <p>Usamos herramientas de Meta (Píxel y API de Conversiones) y Google Analytics para medir visitas y el rendimiento de nuestros anuncios. Los datos de contacto que se comparten con Meta se envían cifrados (hash).</p>
          <h2>Tus derechos</h2>
          <p>Podés pedir acceso, corrección o eliminación de tus datos escribiendo a <a href={`mailto:${contact.email}`}>{contact.email}</a>, conforme a la Ley 25.326 de Protección de Datos Personales. La Agencia de Acceso a la Información Pública es el órgano de control de esta ley.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
