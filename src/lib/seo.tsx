import { env, contact } from './env';
import type { Faq, Pack } from './types';

export const SITE_NAME = 'Webazo';
export const DEFAULT_TITLE = 'Diseño de páginas web para negocios en CABA y GBA | Webazo';
export const DEFAULT_DESCRIPTION =
  'Diseñamos páginas web para negocios de CABA y GBA: turnos online, catálogos, pedidos por WhatsApp y SEO local. Dominio propio y online en 72 hs.';

const ORG_ID = `${env.siteUrl}/#organization`;
const SITE_ID = `${env.siteUrl}/#website`;

/** Negocio: Organization + ProfessionalService (sin reseñas inventadas). */
export function organizationLd(packs: Pack[]) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: SITE_NAME,
    url: env.siteUrl,
    logo: `${env.siteUrl}/icon`,
    image: `${env.siteUrl}/opengraph-image`,
    slogan: 'No hagas una web. Hacé un webazo.',
    description: DEFAULT_DESCRIPTION,
    email: contact.email,
    telephone: '+54 9 11 6025-4550',
    priceRange: '$$',
    address: { '@type': 'PostalAddress', addressLocality: 'Ciudad Autónoma de Buenos Aires', addressRegion: 'CABA', addressCountry: 'AR' },
    areaServed: [
      { '@type': 'City', name: 'Ciudad Autónoma de Buenos Aires' },
      { '@type': 'AdministrativeArea', name: 'Gran Buenos Aires' },
    ],
    knowsAbout: ['Diseño web', 'Desarrollo web', 'SEO local', 'Turnos online', 'Catálogos online', 'Tiendas online'],
    contactPoint: { '@type': 'ContactPoint', contactType: 'sales', telephone: '+54 9 11 6025-4550', availableLanguage: ['es'], areaServed: 'AR' },
    sameAs: [`https://www.instagram.com/${contact.instagram}`],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Packs de páginas web',
      itemListElement: packs.map((p) => ({
        '@type': 'Offer',
        name: `Pack ${p.name}`,
        description: p.tagline ?? undefined,
        price: p.price_usd,
        priceCurrency: 'USD',
        itemOffered: { '@type': 'Service', name: `Página web: pack ${p.name}`, serviceType: 'Diseño web' },
      })),
    },
  };
}

export function websiteLd() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': SITE_ID, url: env.siteUrl, name: SITE_NAME, inLanguage: 'es-AR', publisher: { '@id': ORG_ID } };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${env.siteUrl}${it.path}` })),
  };
}

export function serviceLd(opts: { name: string; description: string; path: string; audience: string; price?: number }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    serviceType: 'Diseño de páginas web',
    url: `${env.siteUrl}${opts.path}`,
    provider: { '@id': ORG_ID },
    areaServed: ['Ciudad Autónoma de Buenos Aires', 'Gran Buenos Aires'],
    audience: { '@type': 'BusinessAudience', audienceType: opts.audience },
    ...(opts.price ? { offers: { '@type': 'Offer', price: opts.price, priceCurrency: 'USD', url: `${env.siteUrl}${opts.path}#packs` } } : {}),
  };
}

export function faqLd(faqs: Pick<Faq, 'question' | 'answer'>[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };
}

export function articleLd(opts: { title: string; description: string; path: string; date: string; updated: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    mainEntityOfPage: `${env.siteUrl}${opts.path}`,
    datePublished: opts.date,
    dateModified: opts.updated,
    inLanguage: 'es-AR',
    author: { '@type': 'Organization', name: SITE_NAME, url: env.siteUrl },
    publisher: { '@id': ORG_ID },
  };
}

/** Inserta uno o varios JSON-LD de forma segura. */
export function JsonLd({ data }: { data: object | object[] }) {
  const arr = Array.isArray(data) ? data : [data];
  return (
    <>
      {arr.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }} />
      ))}
    </>
  );
}
