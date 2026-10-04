'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ATTR_COOKIE, getAttribution, getCookie, setCookie } from '@/lib/tracking';

const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const;

function Capture() {
  const params = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    const incoming: Record<string, string> = {};
    KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) incoming[k] = v.slice(0, 200);
    });

    const current = getAttribution();
    // Última visita con parámetros gana (last non-direct touch). Sin parámetros, se conserva lo anterior.
    if (Object.keys(incoming).length > 0 || !current.landing_path) {
      const next = Object.keys(incoming).length > 0
        ? { ...incoming, landing_path: pathname, referrer: document.referrer.slice(0, 300) || undefined }
        : { ...current, landing_path: pathname, referrer: document.referrer.slice(0, 300) || undefined };
      setCookie(ATTR_COOKIE, JSON.stringify(next), 90);
    }

    // Cookie _fbc para la API de Conversiones (si el Píxel no la creó todavía)
    const fbclid = params.get('fbclid');
    if (fbclid && !getCookie('_fbc')) {
      setCookie('_fbc', `fb.1.${Date.now()}.${fbclid}`, 90);
    }
  }, [params, pathname]);

  return null;
}

export default function AttributionCapture() {
  return (
    <Suspense fallback={null}>
      <Capture />
    </Suspense>
  );
}
