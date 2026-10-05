import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { RUBROS } from '@/lib/rubros';
import { GUIDES } from '@/lib/guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${env.siteUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...RUBROS.map((r) => ({ url: `${env.siteUrl}/${r.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: `${env.siteUrl}/guias`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    ...GUIDES.map((g) => ({ url: `${env.siteUrl}/guias/${g.slug}`, lastModified: new Date(g.updated), changeFrequency: 'monthly' as const, priority: 0.6 })),
    { url: `${env.siteUrl}/privacidad`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${env.siteUrl}/terminos`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
