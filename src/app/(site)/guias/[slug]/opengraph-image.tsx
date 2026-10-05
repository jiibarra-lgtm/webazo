import { ogImage, OG_SIZE } from '@/lib/og';
import { GUIDES, getGuide } from '@/lib/guides';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Guía de Webazo';

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return ogImage('Guía para tu negocio', getGuide(slug)?.title ?? 'Guías Webazo');
}
