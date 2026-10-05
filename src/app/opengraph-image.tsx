import { ogImage, OG_SIZE } from '@/lib/og';

export const alt = 'Webazo: páginas web para negocios en CABA y GBA';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage('Páginas web para negocios · CABA y GBA', 'No hagas una web. Hacé un webazo.');
}
