'use client';
import type { Attribution } from './types';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export const ATTR_COOKIE = 'wz_attr';

export function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.split('; ').find((c) => c.startsWith(name + '='));
  return m ? decodeURIComponent(m.slice(name.length + 1)) : null;
}

export function setCookie(name: string, value: string, days: number) {
  const exp = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${exp}; path=/; SameSite=Lax`;
}

export function getAttribution(): Attribution {
  try {
    const raw = getCookie(ATTR_COOKIE);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

export function newEventId(prefix = 'ev') {
  const rnd = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
  return `${prefix}_${rnd}`;
}

/** Clic en WhatsApp: Píxel (navegador) + API de Conversiones (servidor), deduplicados por eventId. */
export function trackContact(label: string) {
  const eventId = newEventId('contact');
  window.fbq?.('track', 'Contact', { content_name: label }, { eventID: eventId });
  window.gtag?.('event', 'contacto_whatsapp', { label });

  const payload = JSON.stringify({
    eventId,
    label,
    path: location.pathname + location.search,
    attribution: getAttribution(),
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
    } else {
      fetch('/api/track', { method: 'POST', body: payload, keepalive: true, headers: { 'Content-Type': 'application/json' } });
    }
  } catch {
    /* no bloquea la navegación */
  }
}
