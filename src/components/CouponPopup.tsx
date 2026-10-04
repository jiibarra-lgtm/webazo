'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getAttribution, getCookie, newEventId, setCookie, trackContact } from '@/lib/tracking';
import { couponLabel, readCoupon, saveCoupon } from '@/lib/coupon-client';
import { RUBRO_NAMES } from '@/lib/rubros';
import { whatsappUrl } from '@/lib/whatsapp';
import type { ActiveCoupon, PopupConfig } from '@/lib/types';
import { Logo } from './Icons';

const SEEN_COOKIE = 'wz_popup_seen';
const CLOSED_COOKIE = 'wz_popup_closed';
type Step = 'ask' | 'form' | 'done';

export default function CouponPopup({ config }: { config: PopupConfig }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [step, setStep] = useState<Step>('ask');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<ActiveCoupon | null>(null);
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [business, setBusiness] = useState('');
  const [rubro, setRubro] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const shown = useRef(false);

  const disabled = !config.enabled || pathname.startsWith('/admin') || pathname.startsWith('/gracias');

  const show = useCallback(() => {
    if (shown.current) return;
    shown.current = true;
    setOpen(true);
    setTeaser(false);
    setCookie(SEEN_COOKIE, '1', 7);
    window.fbq?.('trackCustom', 'PopupVisto');
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // Si no reclamó, queda la pestañita para volver a abrirlo
    if (!readCoupon()) {
      setTeaser(true);
      setCookie(CLOSED_COOKIE, '1', 7);
    }
  }, []);

  // Disparadores: tiempo, intención de salida (compu) y scroll (celu)
  useEffect(() => {
    if (disabled || readCoupon()) return;
    if (getCookie(SEEN_COOKIE)) {
      if (getCookie(CLOSED_COOKIE)) setTeaser(true);
      return;
    }
    const timer = window.setTimeout(show, Math.max(3, config.delay_seconds) * 1000);
    const onLeave = (e: MouseEvent) => { if (e.clientY <= 0 && !e.relatedTarget) show(); };
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
  }, [disabled, config.delay_seconds, show]);

  // Cupos reales restantes (solo si el cupón tiene límite)
  useEffect(() => {
    if (!open || remaining !== null) return;
    fetch(`/api/coupons/status?code=${encodeURIComponent(config.coupon_code)}`)
      .then((r) => r.json())
      .then((d) => setRemaining(typeof d.remaining === 'number' ? d.remaining : null))
      .catch(() => {});
  }, [open, remaining, config.coupon_code]);

  // Teclado y foco
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 50);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      clearTimeout(t);
    };
  }, [open, step, close]);

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
          business,
          rubro,
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
      window.gtag?.('event', 'cupon_reclamado', { code: data.coupon.code, rubro });
      saveCoupon(data.coupon);
      setCoupon(data.coupon);
      setStep('done');
      setTeaser(false);
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

  if (disabled) return null;

  const offer = coupon ? couponLabel(coupon) : config.offer;
  const bizName = business.trim() || 'Tu negocio';
  const waMsg = `Hola! Me llevé el cupón ${coupon?.code ?? config.coupon_code} (${offer}). Quiero la web para ${business.trim() || 'mi negocio'}${rubro ? ` (${rubro})` : ''}.`;
  const stepIndex = step === 'ask' ? 0 : step === 'form' ? 1 : 2;

  return (
    <>
      {teaser && !open && (
        <button type="button" className="pop-teaser" onClick={() => { shown.current = false; show(); }} aria-label={`Abrir descuento de ${config.offer}`}>
          <span aria-hidden="true">🎁</span> {config.offer}
        </button>
      )}

      {open && (
        <div className="pop-backdrop" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="pop" role="dialog" aria-modal="true" aria-labelledby="pop-title" ref={dialogRef}>
            <button type="button" className="pop-close" aria-label="Cerrar" onClick={close}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>

            <div className="pop-body">
              <div className="pop-top">
                <Logo />
                <ol className="pop-steps" aria-label={`Paso ${stepIndex + 1} de 3`}>
                  {[0, 1, 2].map((i) => <li key={i} className={i <= stepIndex ? 'on' : ''} />)}
                </ol>
              </div>

              {step === 'ask' && (
                <>
                  <span className="pop-eyebrow">{config.eyebrow}</span>
                  <h2 id="pop-title">{config.title}</h2>
                  <p className="pop-text">{config.text}</p>
                  {remaining !== null && remaining > 0 && (
                    <p className="pop-scarcity"><span className="dot" aria-hidden="true" />Quedan {remaining} {remaining === 1 ? 'cupón' : 'cupones'}</p>
                  )}
                  <div className="pop-choices">
                    <button type="button" className="btn btn-orange" data-autofocus onClick={() => setStep('form')}>{config.cta}</button>
                    <button type="button" className="pop-no" onClick={close}>No, ya tengo todos los clientes que necesito</button>
                  </div>
                </>
              )}

              {step === 'form' && (
                <>
                  <span className="pop-eyebrow">Último paso</span>
                  <h2 id="pop-title">¿A dónde te mandamos el código?</h2>
                  <form onSubmit={onSubmit} className="pop-form">
                    <label className="sr-only" htmlFor="pop-business">Nombre de tu negocio</label>
                    <input id="pop-business" data-autofocus value={business} onChange={(e) => setBusiness(e.target.value.slice(0, 60))} placeholder="Nombre de tu negocio" autoComplete="organization" />
                    <label className="sr-only" htmlFor="pop-rubro">Rubro</label>
                    <select id="pop-rubro" value={rubro} onChange={(e) => setRubro(e.target.value)}>
                      <option value="">¿De qué rubro es?</option>
                      {RUBRO_NAMES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <div className="pop-row">
                      <label className="sr-only" htmlFor="pop-name">Tu nombre</label>
                      <input id="pop-name" name="name" placeholder="Tu nombre" autoComplete="given-name" />
                      <label className="sr-only" htmlFor="pop-phone">Tu WhatsApp</label>
                      <input id="pop-phone" name="phone" type="tel" inputMode="tel" placeholder="Tu WhatsApp" autoComplete="tel" required />
                    </div>
                    <div className="hp" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
                    {error && <p className="pop-error" role="alert">{error}</p>}
                    <button type="submit" className="btn btn-dark" disabled={loading}>{loading ? 'Generando tu código…' : `Quiero mi ${config.offer}`}</button>
                    <p className="pop-fine">Sin spam. Solo te escribimos por tu consulta.</p>
                  </form>
                </>
              )}

              {step === 'done' && coupon && (
                <>
                  <span className="pop-eyebrow">¡Listo{business.trim() ? `, ${business.trim()}` : ''}!</span>
                  <h2 id="pop-title">Tu código de {couponLabel(coupon)}</h2>
                  <button type="button" className="pop-code" onClick={copy} data-autofocus aria-label={`Copiar código ${coupon.code}`}>
                    <span>{coupon.code}</span>
                    <small>{copied ? '¡Copiado!' : 'Tocá para copiar'}</small>
                  </button>
                  <p className="pop-text">Ya quedó aplicado: los packs te muestran el precio con descuento.{coupon.expires_at ? ` Vence el ${new Date(coupon.expires_at).toLocaleDateString('es-AR')}.` : ''}</p>
                  <a className="btn btn-orange" href={whatsappUrl(waMsg)} target="_blank" rel="noopener" onClick={() => trackContact('popup_whatsapp')}>Mandámelo por WhatsApp</a>
                  <a className="pop-no" href="#packs" onClick={() => setOpen(false)}>Ver packs con descuento</a>
                </>
              )}
            </div>

            <div className="pop-art" aria-hidden="true">
              {step === 'ask' ? (
                <div className="pop-art-offer-wrap">
                  <span className="pop-art-offer">{offer}</span>
                  <span className="pop-art-sub">en tu primer webazo</span>
                </div>
              ) : (
                <div className="pop-preview">
                  <span className="pop-preview-label">Así se vería tu web</span>
                  <div className="pop-phone">
                    <div className="pop-screen">
                      <span className="pp-biz">{bizName}</span>
                      {rubro && <span className="pp-chip">{rubro}</span>}
                      <span className="pp-hero">Bienvenidos a {bizName}</span>
                      <span className="pp-line" /><span className="pp-line short" />
                      <span className="pp-btn">Pedí tu turno</span>
                      <span className="pp-card" /><span className="pp-card" />
                    </div>
                  </div>
                  {step === 'done' && <span className="pop-preview-badge">{offer} aplicado</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
