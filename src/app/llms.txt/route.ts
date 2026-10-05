import { env } from '@/lib/env';
import { RUBROS } from '@/lib/rubros';
import { GUIDES } from '@/lib/guides';

// Resumen del sitio para buscadores con IA (estándar propuesto llms.txt).
export function GET() {
  const body = [
    '# Webazo',
    '',
    '> Diseño de páginas web para negocios de CABA y Gran Buenos Aires: turnos online, catálogos, pedidos por WhatsApp y SEO local. Dominio propio a nombre del cliente y entrega en 72 hs.',
    '',
    '## Servicios',
    `- [Packs y precios](${env.siteUrl}/#packs): Arranque, Negocio y Golazo, más mantenimiento mensual.`,
    '',
    '## Páginas web por rubro',
    ...RUBROS.map((r) => `- [${r.title}](${env.siteUrl}/${r.slug}): ${r.seoDescription}`),
    '',
    '## Guías',
    ...GUIDES.map((g) => `- [${g.title}](${env.siteUrl}/guias/${g.slug}): ${g.description}`),
    '',
    '## Contacto',
    '- WhatsApp: +54 9 11 6025-4550',
    '- Email: webazo.ar@gmail.com',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
