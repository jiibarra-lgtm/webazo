'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getAttribution, getCookie, newEventId, setCookie } from '@/lib/tracking';
import { couponLabel, readCoupon, saveCoupon } from '@/lib/coupon-client';
import type { ActiveCoupon, PopupConfig } from '@/lib/types';
import { Logo } from './Icons';

const SEEN_COOKIE = 'wz_popup_seen';

export default function CouponPopup({ config }: { config: PopupConfig }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'done'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<ActiveCoupon | null>(null);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const shown = useRef(false);

  const show = useCallback(() => {
    if (shown.current) return;
    shown.current = true;
    setOpen(true);
    setCookie(SEEN_COOKIE, '1', 7);
  }, []);

  useEffect(() => {
    if (!config.enabled || pathname.startsWith('/admin') || pathname.startsWith('/gracias')) return;
    if (getCookie(SEEN_COOKIE) || readCoupon()) return;

    const timer = window.setTimeout(show, Math.max(3, config.delay_seconds) * 1000);
    // Intención de salida (escritorio): el mouse se va por arriba
    const onLeave = (e: MouseEvent) => { if (e.clientY <= 0) show(); };
    // Celular: al pasar el 60% de la página
    const onScroll = () => {
      const h = document.documentElement;
      if ((h.scrollTop + window.innerHeight) / h.scrollHeight > 0.6) show();
    };
    document.addEventListener('mouseout', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('mouseout', onLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, [config.enabled, config.delay_seconds, pathname, show]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    dialogRef.current?.querySelector<HTMLElement>('input, button')?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, step]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const eventId = newEventId('claim');
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/coupons/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(fd.get('name') || ''),
          phone: String(fd.get('phone') || ''),
          website: String(fd.get('website') || ''),
          eventId,
          pageUrl: location.href,
          attribution: getAttribution(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.coupon) {
        setError(data.error || 'No pudimos generar tu código. Probá de nuevo.');
        setLoading(false);
        return;
      }
      window.fbq?.('track', 'CompleteRegistration', { content_name: 'cupon' }, { eventID: eventId });
      window.gtag?.('event', 'cupon_reclamado', { code: data.coupon.code });
      saveCoupon(data.coupon);
      setCoupon(data.coupon);
      setStep('done');
    } catch {
      setError('Sin conexión. Probá de nuevo.');
    }
    setLoading(false);
  }

  async function copy() {
    if (!coupon) return;
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* sin portapapeles */ }
  }

  if (!open) return null;

  return (
    <div className="pop-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="pop" role="dialog" aria-modal="true" aria-labelledby="pop-title" ref={dialogRef}>
        <button type="button" className="pop-close" aria-label="Cerrar" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        <div className="pop-body">
          <Logo />
          {step === 'form' ? (
            <>
              <span className="pop-eyebrow">{config.eyebrow}</span>
              <h2 id="pop-title">{config.title}</h2>
              <p className="pop-offer">{config.offer}</p>
              <p className="pop-text">{config.text}</p>
              <form onSubmit={onSubmit} className="pop-form">
                <label className="sr-only" htmlFor="pop-name">Nombre</label>
                <input id="pop-name" name="name" placeholder="Tu nombre" autoComplete="given-name" />
                <label className="sr-only" htmlFor="pop-phone">WhatsApp</label>
                <input id="pop-phone" name="phone" type="tel" inputMode="tel" placeholder="Tu WhatsApp" autoComplete="tel" required />
                <div className="hp" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
                {error && <p className="pop-error" role="alert">{error}</p>}
                <button type="submit" className="btn btn-dark" disabled={loading}>{loading ? 'Generando…' : config.cta}</button>
              </form>
              <button type="button" className="pop-skip" onClick={() => setOpen(false)}>Seguir mirando</button>
            </>
          ) : coupon && (
            <>
              <span className="pop-eyebrow">¡Listo!</span>
              <h2 id="pop-title">Tu código de {couponLabel(coupon)}</h2>
              <button type="button" className="pop-code" onClick={copy} aria-label={`Copiar código ${coupon.code}`}>
                <span>{coupon.code}</span>
                <small>{copied ? 'Copiado' : 'Tocá para copiar'}</small>
              </button>
              <p className="pop-text">Ya lo dejamos aplicado: vas a ver los precios con descuento en los packs.{coupon.expires_at ? ` Vence el ${new Date(coupon.expires_at).toLocaleDateString('es-AR')}.` : ''}</p>
              <a className="btn btn-dark" href="#packs" onClick={() => setOpen(false)}>Ver packs con descuento</a>
            </>
          )}
        </div>

        <div className="pop-art" aria-hidden="true">
          <span className="pop-art-offer">{coupon ? couponLabel(coupon) : config.offer}</span>
          <span className="pop-art-sub">en tu primer webazo</span>
        </div>
      </div>
    </div>
  );
}
