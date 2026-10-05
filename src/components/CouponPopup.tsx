'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getAttribution, getCookie, newEventId, setCookie, trackContact } from '@/lib/tracking';
import { couponApplies, couponBonus, couponLabel, discounted, readCoupon, saveCoupon } from '@/lib/coupon-client';
import { openCart, setPack } from '@/lib/cart';
import { money } from '@/lib/money';
import { DEFAULT_CURRENCY } from '@/lib/defaults';
import { whatsappUrl } from '@/lib/whatsapp';
import type { ActiveCoupon, CurrencyConfig, PopupConfig } from '@/lib/types';
import { Logo } from './Icons';

const SEEN_COOKIE = 'wz_popup_seen';
const CLOSED_COOKIE = 'wz_popup_closed';
type PackLite = { slug: string; name: string; price: number; featured?: boolean };

const CONFETTI_COLORS = ['#FF5A1F', '#111111', '#FFC93C', '#1F9D55', '#FFFFFF'];

export default function CouponPopup({ config, currency = DEFAULT_CURRENCY, packs = [] }: { config: PopupConfig; currency?: CurrencyConfig; packs?: PackLite[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [step, setStep] = useState<'ask' | 'done'>('ask');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<ActiveCoupon | null>(null);
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const shown = useRef(false);

  const disabled = !config.enabled || pathname.startsWith('/admin') || pathname.startsWith('/gracias');

  const show = useCallback(() => {
    if (shown.current) return;
    shown.current = true;
    setOpen(true);
    setTeaser(false);
    if (config.frequency === 'session') { try { sessionStorage.setItem(SEEN_COOKIE, '1'); } catch { /* privado */ } }
    else if (config.frequency === 'day') setCookie(SEEN_COOKIE, '1', 1);
    else if (config.frequency === 'week') setCookie(SEEN_COOKIE, '1', 7);
    window.fbq?.('trackCustom', 'PopupVisto');
  }, [config.frequency]);

  const close = useCallback(() => {
    setOpen(false);
    if (!readCoupon()) { setTeaser(true); setCookie(CLOSED_COOKIE, '1', 1); }
  }, []);

  const alreadySeen = useCallback(() => {
    switch (config.frequency) {
      case 'always': return false;
      case 'session': try { return sessionStorage.getItem(SEEN_COOKIE) === '1'; } catch { return false; }
      default: return getCookie(SEEN_COOKIE) === '1';
    }
  }, [config.frequency]);

  // Disparadores
  useEffect(() => {
    if (disabled) return;
    const force = new URLSearchParams(window.location.search).get('popup') === '1';
    if (force) { const t = window.setTimeout(show, 400); return () => window.clearTimeout(t); }
    if (readCoupon()) return;
    // Google penaliza popups que tapan el contenido en celular a quien llega desde la búsqueda.
    const fromSearch = /google\.|bing\.|yahoo\.|duckduckgo\./i.test(document.referrer);
    const isMobile = window.matchMedia('(max-width: 720px)').matches;
    if (fromSearch && isMobile) { setTeaser(true); return; }
    if (alreadySeen()) { if (getCookie(CLOSED_COOKIE)) setTeaser(true); return; }
    const timer = window.setTimeout(show, Math.max(0, config.delay_seconds) * 1000);
    const onLeave = (e: MouseEvent) => { if (e.clientY <= 0 && !e.relatedTarget) show(); };
    const onScroll = () => { const h = document.documentElement; if ((h.scrollTop + window.innerHeight) / h.scrollHeight > 0.6) show(); };
    document.addEventListener('mouseout', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.clearTimeout(timer); document.removeEventListener('mouseout', onLeave); window.removeEventListener('scroll', onScroll); };
  }, [disabled, config.delay_seconds, show, alreadySeen]);

  // Cupos reales restantes
  useEffect(() => {
    if (!open || remaining !== null) return;
    fetch(`/api/coupons/status?code=${encodeURIComponent(config.coupon_code)}`)
      .then((r) => r.json()).then((d) => setRemaining(typeof d.remaining === 'number' ? d.remaining : null)).catch(() => {});
  }, [open, remaining, config.coupon_code]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 50);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; clearTimeout(t); };
  }, [open, step, close]);

  /** Un clic: aplica el cupón al instante. */
  async function claim() {
    const eventId = newEventId('claim');
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/coupons/claim', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, pageUrl: location.href, attribution: getAttribution() }),
      });
      const data = await res.json();
      if (!res.ok || !data.coupon) { setError(data.error || 'No pudimos aplicar el descuento. Probá de nuevo.'); setLoading(false); return; }
      window.fbq?.('track', 'CompleteRegistration', { content_name: 'cupon' }, { eventID: eventId });
      window.gtag?.('event', 'cupon_reclamado', { code: data.coupon.code });
      saveCoupon(data.coupon);
      setCoupon(data.coupon);
      setStep('done');
      setTeaser(false);
      try { navigator.vibrate?.(60); } catch { /* sin vibración */ }
    } catch { setError('Sin conexión. Probá de nuevo.'); }
    setLoading(false);
  }

  function choose(slug: string) {
    setPack(slug);
    setOpen(false);
    openCart();
    window.fbq?.('track', 'AddToCart', { content_name: slug });
  }

  async function copy() {
    if (!coupon) return;
    try { await navigator.clipboard.writeText(coupon.code); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* sin portapapeles */ }
  }

  if (disabled) return null;

  const offer = coupon ? couponLabel(coupon, currency) : config.offer;
  const featured = packs.find((p) => p.featured) ?? packs[packs.length - 1];
  const bonusTxt = coupon ? couponBonus(coupon) : config.bonus ?? '';
  const waMsg = `Hola! Me llevé el cupón ${coupon?.code ?? config.coupon_code} (${offer}${bonusTxt ? ` ${bonusTxt}` : ''}). Quiero mi webazo.`;

  return (
    <>
      {teaser && !open && (
        <button type="button" className="pop-teaser" onClick={() => { shown.current = false; show(); }} aria-label={`Abrir descuento de ${config.offer}`}>
          <span aria-hidden="true">🎁</span> {config.offer}
        </button>
      )}

      {open && (
        <div className="pop-backdrop" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className={`pop ${step === 'done' ? 'is-done' : ''}`} role="dialog" aria-modal="true" aria-labelledby="pop-title" ref={dialogRef}>
            {step === 'done' && (
              <div className="confetti" aria-hidden="true">
                {Array.from({ length: 36 }).map((_, i) => (
                  <i key={i} style={{ left: `${(i * 37) % 100}%`, background: CONFETTI_COLORS[i % CONFETTI_COLORS.length], animationDelay: `${(i % 9) * 0.06}s`, transform: `rotate(${i * 23}deg)` }} />
                ))}
              </div>
            )}
            <button type="button" className="pop-close" aria-label="Cerrar" onClick={close}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>

            <div className="pop-body">
              <div className="pop-top"><Logo /></div>

              {step === 'ask' ? (
                <>
                  <span className="pop-eyebrow">{config.eyebrow}</span>
                  <h2 id="pop-title">{config.title}</h2>
                  <p className="pop-text">{config.text}</p>
                  {config.bonus && <p className="pop-bonus">🎁 {config.bonus.replace(/^\+\s*/, 'Además: ')}</p>}
                  {remaining !== null && remaining > 0 && (
                    <p className="pop-scarcity"><span className="dot" aria-hidden="true" />Quedan {remaining} {remaining === 1 ? 'cupón' : 'cupones'}</p>
                  )}
                  {error && <p className="pop-error" role="alert">{error}</p>}
                  <div className="pop-choices">
                    <button type="button" className="btn btn-orange pop-cta" data-autofocus onClick={claim} disabled={loading}>
                      {loading ? 'Aplicando tu descuento…' : config.cta}
                    </button>
                    <button type="button" className="pop-no" onClick={close}>No, ya tengo todos los clientes que necesito</button>
                  </div>
                </>
              ) : coupon && (
                <>
                  <span className="pop-eyebrow">¡Descuento desbloqueado!</span>
                  <h2 id="pop-title">Listo, tenés {couponLabel(coupon, currency)} en tu webazo</h2>
                  {couponBonus(coupon) && <p className="pop-bonus">🎁 {couponBonus(coupon).replace(/^\+\s*/, 'Y además: ')}</p>}
                  <button type="button" className="pop-code small" onClick={copy} aria-label={`Copiar código ${coupon.code}`}>
                    <span>{coupon.code}</span><small>{copied ? '¡Copiado!' : 'Ya aplicado · tocá para copiar'}</small>
                  </button>
                  {packs.length > 0 && (
                    <div className="pop-prices" role="list" aria-label="Tus precios con descuento">
                      {packs.map((p) => {
                        const ok = couponApplies(coupon, p.slug);
                        const { final, discount } = ok ? discounted(p.price, coupon) : { final: p.price, discount: 0 };
                        return (
                          <button type="button" key={p.slug} role="listitem" className={`pop-price ${p.featured ? 'feat' : ''}`} onClick={() => choose(p.slug)} data-autofocus={p.slug === featured?.slug ? true : undefined}>
                            <span className="pp-name">{p.name}{p.featured && <em>Más elegido</em>}</span>
                            <span className="pp-amounts">
                              {discount > 0 && <s>{money(p.price, currency)}</s>}
                              <b>{money(final, currency)}</b>
                            </span>
                            <span className="pp-pick">Elegir</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <a className="pop-no" href={whatsappUrl(waMsg)} target="_blank" rel="noopener" onClick={() => trackContact('popup_whatsapp')}>Prefiero que me asesoren por WhatsApp</a>
                </>
              )}
            </div>

            <div className="pop-art" aria-hidden="true">
              <div className="pop-art-offer-wrap">
                {step === 'done' && <span className="pop-stamp">Aplicado</span>}
                <span className="pop-art-offer">{offer}</span>
                <span className="pop-art-sub">{step === 'done' ? 'ya está en tus precios' : 'en tu primer webazo'}</span>
                {(coupon ? couponBonus(coupon) : config.bonus) && <span className="pop-art-bonus">{coupon ? couponBonus(coupon) : config.bonus}</span>}
                <span hidden></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
