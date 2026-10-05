import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Webazo · Páginas web para negocios',
    short_name: 'Webazo',
    description: 'Páginas web para negocios de CABA y GBA. Online en 72 hs.',
    start_url: '/',
    display: 'standalone',
    background_color: '#111111',
    theme_color: '#FF5A1F',
    lang: 'es-AR',
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
