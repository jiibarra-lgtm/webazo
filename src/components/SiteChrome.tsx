import { Logo, WhatsAppIcon } from './Icons';
import WhatsAppLink from './WhatsAppLink';
import { CartButton } from './Cart';
import { contact } from '@/lib/env';
import type { LaunchBanner } from '@/lib/types';

export function Banner({ banner }: { banner: LaunchBanner }) {
  if (!banner.enabled || !banner.text) return null;
  return <div className="banner">{banner.text}</div>;
}

export function Header({ waMessage = 'Hola! Quiero mi webazo', base = '' }: { waMessage?: string; base?: string }) {
  return (
    <header className="header">
      <div className="wrap">
        <Logo href="/" />
        <nav className="nav" aria-label="Principal">
          <a href={`${base}#packs`}>Packs</a>
          <a href="/#rubros">Rubros</a>
          <a href={`${base}#preguntas`}>Preguntas</a>
          <CartButton />
          <WhatsAppLink message={waMessage} label="header" className="btn btn-orange">Escribinos</WhatsAppLink>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div>
          <Logo />
          <p className="tag">Webs y sistemas para negocios. CABA y GBA.</p>
        </div>
        <ul aria-label="Contacto">
          <li><WhatsAppLink message="Hola! Quiero mi webazo" label="footer">WhatsApp: {contact.whatsappDisplay}</WhatsAppLink></li>
          <li><a href={`https://www.instagram.com/${contact.instagram}`} target="_blank" rel="noopener">Instagram: @{contact.instagram}</a></li>
          <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
        </ul>
        <div className="legal">
          <span>© {new Date().getFullYear()} Webazo. Todos los derechos reservados.</span>
          <span><a href="/privacidad">Privacidad</a> · <a href="/terminos">Términos</a></span>
        </div>
      </div>
    </footer>
  );
}

export function FloatingWhatsApp({ message = 'Hola! Quiero mi webazo' }: { message?: string }) {
  return (
    <WhatsAppLink message={message} label="flotante" className="wa-float" ariaLabel="Escribinos por WhatsApp">
      <WhatsAppIcon />
    </WhatsAppLink>
  );
}
