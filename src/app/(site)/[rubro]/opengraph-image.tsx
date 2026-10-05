import { ogImage, OG_SIZE } from '@/lib/og';
import { RUBROS, getRubro } from '@/lib/rubros';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Página web para tu negocio · Webazo';

export function generateStaticParams() {
  return RUBROS.map((r) => ({ rubro: r.slug }));
}

export default async function Image({ params }: { params: Promise<{ rubro: string }> }) {
  const { rubro } = await params;
  const r = getRubro(rubro);
  return ogImage(r ? `Para ${r.name.toLowerCase()}` : 'Webazo', r?.title ?? 'Páginas web para negocios');
}
