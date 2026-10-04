import type { Metadata, Viewport } from 'next';
import './globals.css';
import { env } from '@/lib/env';
import Analytics from '@/components/Analytics';
import AttributionCapture from '@/components/AttributionCapture';

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: 'Webazo | Páginas web para negocios en CABA y GBA',
    template: '%s',
  },
  description:
    'Páginas web y sistemas para negocios: turnos online, catálogos, pedidos y cotizadores. Online en 72 hs, con dominio propio. CABA y GBA.',
  applicationName: 'Webazo',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'Webazo',
    title: 'Webazo | No hagas una web. Hacé un webazo.',
    description: 'Webs y sistemas para negocios. Online en 72 hs, con dominio propio.',
  },
  icons: { icon: '/favicon.svg' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#FF5A1F', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap"
        />
      </head>
      <body>
        {children}
        <AttributionCapture />
        <Analytics />
      </body>
    </html>
  );
}
