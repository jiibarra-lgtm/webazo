import type { Faq, LaunchBanner, Monthly, Pack, PopupConfig } from './types';

// Contenido de respaldo: la web funciona aunque Supabase no esté configurado.
export const DEFAULT_PACKS: Pack[] = [
  {
    id: 'arranque', slug: 'arranque', name: 'Arranque',
    tagline: 'Para estar en internet ya, con lo justo y necesario.',
    price_usd: 80, price_before_usd: 150, price_note: 'Precio de lanzamiento',
    features: ['Página de una sección con tus servicios', 'Botón de WhatsApp, mapa y horarios', 'Alta en Google Maps', 'Online en 72 hs'],
    featured: false, cta_label: 'Quiero el Arranque', sort_order: 1, active: true,
  },
  {
    id: 'negocio', slug: 'negocio', name: 'Negocio',
    tagline: 'Para comercios que quieren verse serios y vender más.',
    price_usd: 180, price_before_usd: 350, price_note: 'Precio de lanzamiento',
    features: ['Hasta 5 secciones', 'Catálogo de productos o servicios', 'Formulario de contacto', 'SEO para aparecer en Google', 'Estadísticas de visitas'],
    featured: false, cta_label: 'Quiero el Negocio', sort_order: 2, active: true,
  },
  {
    id: 'golazo', slug: 'golazo', name: 'Golazo',
    tagline: 'Un sistema a medida que trabaja por vos.',
    price_usd: 400, price_before_usd: 700, price_note: 'Precio de lanzamiento',
    features: ['Todo lo del pack Negocio', 'Turnos online, pedidos o cotizador', 'Panel para administrar todo vos', 'Hecho a la medida de tu negocio'],
    featured: true, cta_label: 'Quiero el Golazo', sort_order: 3, active: true,
  },
];

export const DEFAULT_MONTHLY: Monthly = {
  price_usd: 10,
  title: 'Mantenimiento mensual',
  description: 'Hosting, dominio, cambios cuando los necesites y soporte. Te olvidás de todo y tu web siempre está andando.',
};

export const DEFAULT_BANNER: LaunchBanner = { enabled: true, text: 'Precios de lanzamiento por tiempo limitado' };

export const DEFAULT_FAQS: Faq[] = [
  { id: '1', question: '¿Cuánto tarda?', answer: 'Con el pack Arranque, en 72 hs estás online. Los sistemas a medida llevan un poco más y te pasamos la fecha antes de arrancar.', sort_order: 1, active: true },
  { id: '2', question: '¿El dominio es mío?', answer: 'Sí. Lo registramos a tu nombre: la web y el dominio son tuyos.', sort_order: 2, active: true },
  { id: '3', question: '¿Qué necesito para arrancar?', answer: 'Tu logo, algunas fotos y qué hace tu negocio. Si no tenés algo, te ayudamos a armarlo.', sort_order: 3, active: true },
  { id: '4', question: '¿Puedo hacer cambios después?', answer: 'Sí. Con el mantenimiento mensual te hacemos los cambios que necesites, sin que tengas que tocar nada.', sort_order: 4, active: true },
  { id: '5', question: '¿Cómo se paga?', answer: '50% para arrancar y 50% cuando te entregamos la web. Por transferencia o Mercado Pago.', sort_order: 5, active: true },
];

export const DEFAULT_POPUP: PopupConfig = {
  enabled: true,
  delay_seconds: 12,
  coupon_code: 'BIENVENIDA10',
  eyebrow: 'Solo para nuevos clientes',
  title: 'Tu primer webazo con descuento',
  offer: '10% OFF',
  text: 'Dejanos tu WhatsApp y te mandamos el código para usar en cualquier pack.',
  cta: 'Quiero mi descuento',
};
