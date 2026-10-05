import type { Metadata, Viewport } from 'next';
import './globals.css';
import { env } from '@/lib/env';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '@/lib/seo';
import Analytics from '@/components/Analytics';
import AttributionCapture from '@/components/AttributionCapture';

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: DEFAULT_TITLE, template: '%s' },
  description: DEFAULT_DESCRIPTION,
  applicationName: 'Webazo',
  authors: [{ name: 'Webazo', url: env.siteUrl }],
  creator: 'Webazo',
  publisher: 'Webazo',
  category: 'business',
  alternates: { canonical: '/' },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'Webazo',
    url: '/',
    title: 'Páginas web para negocios en CABA y GBA | Webazo',
    description: 'No hagas una web. Hacé un webazo. Turnos online, catálogos y pedidos por WhatsApp. Online en 72 hs.',
  },
  twitter: { card: 'summary_large_image', title: 'Páginas web para negocios | Webazo', description: DEFAULT_DESCRIPTION },
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
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
