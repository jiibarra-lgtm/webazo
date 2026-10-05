'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CART_EVENT, CART_OPEN_EVENT, cartCount, clearCart, openCart, readCart, setMonthly, setPack, toggleExtra } from '@/lib/cart';
import { COUPON_EVENT, couponApplies, couponLabel, discounted, readCoupon, saveCoupon } from '@/lib/coupon-client';
import { getAttribution, getCookie, newEventId } from '@/lib/tracking';
import { money } from '@/lib/money';
import { whatsappUrl } from '@/lib/whatsapp';
import { RUBRO_NAMES } from '@/lib/rubros';
import type { ActiveCoupon, CartState, CurrencyConfig, Extra, Monthly, Pack } from '@/lib/types';

function useCart() {
  const [cart, setCart] = useState<CartState>({ pack: null, extras: [], monthly: true });
  useEffect(() => {
    const sync = () => setCart(readCart());
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(CART_EVENT, sync); window.removeEventListener('storage', sync); };
  }, []);
  return cart;
}

/** Botón de cada pack. */
export function AddToCartButton({ slug, label, className }: { slug: string; label: string; className?: string }) {
  const cart = useCart();
  const inCart = cart.pack === slug;
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        setPack(slug);
        openCart();
        window.fbq?.('track', 'AddToCart', { content_name: slug });
        window.gtag?.('event', 'add_to_cart', { item_id: slug });
      }}
    >
      {inCart ? 'En tu carrito: ver propuesta' : label}
    </button>
  );
}

/** Ícono del header con contador. */
export function CartButton() {
  const cart = useCart();
  const n = cartCount(cart);
  return (
    <button type="button" className="cart-btn" onClick={openCart} aria-label={`Abrir carrito${n ? `, ${n} ítems` : ''}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.5L21 8H6.2" /><circle cx="10" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" />
      </svg>
      {n > 0 && <span className="cart-count">{n}</span>}
    </button>
  );
}

type DrawerProps = { packs: Pack[]; extras: Extra[]; monthly: Monthly; currency: CurrencyConfig };

/** Panel lateral del carrito con totales, cupón y envío por WhatsApp. */
export function CartDrawer({ packs, extras, monthly, currency }: DrawerProps) {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const [coupon, setCoupon] = useState<ActiveCoupon | null>(null);
  const [code, setCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const syncCoupon = () => { const c = readCoupon(); setCoupon(c); if (c) setCode(c.code); };
    syncCoupon();
    window.addEventListener(CART_OPEN_EVENT, onOpen);
    window.addEventListener(COUPON_EVENT, syncCoupon);
    return () => { window.removeEventListener(CART_OPEN_EVENT, onOpen); window.removeEventListener(COUPON_EVENT, syncCoupon); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('.cart-close')?.focus();
    window.fbq?.('track', 'InitiateCheckout');
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  const pack = packs.find((p) => p.slug === cart.pack) ?? null;
  const chosenExtras = extras.filter((e) => cart.extras.includes(e.slug));
  const subtotal = (pack?.price_usd ?? 0) + chosenExtras.reduce((s, e) => s + e.price_usd, 0);
  const applies = !!(coupon && (pack ? couponApplies(coupon, pack.slug) : !coupon.packs.length));
  const calc = useMemo(() => (coupon && applies && subtotal > 0 ? discounted(subtotal, coupon) : null), [coupon, applies, subtotal]);
  const total = calc ? calc.final : subtotal;
  const monthlyUsd = cart.monthly ? monthly.price_usd : 0;

  async function applyCode() {
    if (!code.trim()) return;
    setChecking(true);
    setCouponMsg(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, pack: pack?.slug }),
      });
      const data = await res.json();
      if (data.ok) {
        saveCoupon(data.coupon);
        setCouponMsg({ ok: true, text: `Cupón aplicado: ${couponLabel(data.coupon, currency)}` });
      } else setCouponMsg({ ok: false, text: data.error || 'Código inválido.' });
    } catch { setCouponMsg({ ok: false, text: 'No pudimos validar el código.' }); }
    setChecking(false);
  }

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pack) { setError('Elegí un pack para armar tu propuesta.'); return; }
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') || '');
    const business = String(fd.get('business') || '');
    const rubro = String(fd.get('rubro') || '');
    const eventId = newEventId('lead');
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone: String(fd.get('phone') || ''), business, rubro,
          pack: pack.slug, extras: cart.extras, monthly: cart.monthly,
          coupon: coupon && applies ? coupon.code : '',
          message: 'Propuesta armada en el carrito',
          website: String(fd.get('website') || ''),
          eventId, attribution: getAttribution(), fbp: getCookie('_fbp'), fbc: getCookie('_fbc'), pageUrl: location.href,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.fieldErrors ? Object.values(data.fieldErrors as Record<string, string>)[0] : data.error || 'No pudimos enviar tu propuesta.');
        setSending(false);
        return;
      }
      // Totales confirmados por el servidor (si no vinieron, usamos los del carrito)
      const t = data.totals ?? { price: subtotal, discount: calc?.discount ?? null, final: total, monthly: monthlyUsd, coupon: coupon && applies ? coupon.code : null };
      const lines = [
        `Hola! Armé esta propuesta en Webazo:`,
        ``,
        `• Pack ${pack.name}: ${money(pack.price_usd, currency)}`,
        ...chosenExtras.map((x) => `• ${x.name}: ${money(x.price_usd, currency)}`),
        ``,
        `Subtotal: ${money(t.price, currency)}`,
        ...(t.discount ? [`Cupón ${t.coupon}: − ${money(t.discount, currency)}`] : []),
        `*Total: ${money(t.final, currency)}*`,
        ...(t.monthly ? [`+ Mantenimiento: ${money(t.monthly, currency)}/mes`] : []),
        ``,
        `Nombre: ${name}`,
        ...(business ? [`Negocio: ${business}${rubro ? ` (${rubro})` : ''}`] : rubro ? [`Rubro: ${rubro}`] : []),
      ];
      window.fbq?.('track', 'Lead', { value: t.final, currency: currency.mode === 'ARS' ? 'ARS' : 'USD', content_name: pack.slug }, { eventID: eventId });
      window.gtag?.('event', 'generate_lead', { value: t.final, pack: pack.slug, source: 'carrito' });
      clearCart();
      window.location.href = whatsappUrl(lines.join('\n'));
    } catch {
      setError('Sin conexión. Probá de nuevo.');
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="cart-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <aside className="cart" role="dialog" aria-modal="true" aria-labelledby="cart-title" ref={panelRef}>
        <header className="cart-head">
          <h2 id="cart-title">Tu propuesta</h2>
          <button type="button" className="cart-close" onClick={() => setOpen(false)} aria-label="Cerrar carrito">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>

        <div className="cart-body">
          <section aria-labelledby="cart-pack">
            <h3 id="cart-pack">Pack</h3>
            <div className="cart-packs" role="radiogroup" aria-label="Elegí tu pack">
              {packs.map((p) => (
                <label key={p.slug} className={`cart-pack ${cart.pack === p.slug ? 'on' : ''}`}>
                  <input type="radio" name="cart-pack" checked={cart.pack === p.slug} onChange={() => setPack(p.slug)} />
                  <span className="cp-name">{p.name}{(p.badge || p.featured) && <em>{p.badge || 'Más completo'}</em>}</span>
                  <span className="cp-price">{money(p.price_usd, currency)}</span>
                </label>
              ))}
            </div>
          </section>

          {extras.length > 0 && (
            <section aria-labelledby="cart-extras">
              <h3 id="cart-extras">Sumale extras</h3>
              <div className="cart-extras">
                {extras.map((x) => (
                  <label key={x.slug} className={`cart-extra ${cart.extras.includes(x.slug) ? 'on' : ''}`}>
                    <input type="checkbox" checked={cart.extras.includes(x.slug)} onChange={() => toggleExtra(x.slug)} />
                    <span className="ce-text"><strong>{x.name}</strong>{x.description && <small>{x.description}</small>}</span>
                    <span className="ce-price">+ {money(x.price_usd, currency)}</span>
                  </label>
                ))}
              </div>
            </section>
          )}

          <label className={`cart-extra monthly ${cart.monthly ? 'on' : ''}`}>
            <input type="checkbox" checked={cart.monthly} onChange={(e) => setMonthly(e.target.checked)} />
            <span className="ce-text"><strong>{monthly.title}</strong><small>{monthly.description}</small></span>
            <span className="ce-price">{money(monthly.price_usd, currency)}/mes</span>
          </label>

          <div className="cart-coupon">
            <label htmlFor="cart-code">Cupón de descuento</label>
            <div className="coupon-field">
              <input id="cart-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Ej: BIENVENIDA10" autoComplete="off" />
              <button type="button" onClick={applyCode} disabled={checking}>{checking ? '…' : 'Aplicar'}</button>
            </div>
            {couponMsg && <span className={couponMsg.ok ? 'coupon-ok' : 'err'} role="status">{couponMsg.text}</span>}
            {coupon && !applies && pack && <span className="err">El cupón {coupon.code} no aplica al pack {pack.name}.</span>}
          </div>

          <div className="cart-totals" aria-live="polite">
            <div><span>Subtotal</span><span>{money(subtotal, currency)}</span></div>
            {calc && <div className="disc"><span>Cupón {coupon?.code} ({couponLabel(coupon!, currency)})</span><span>− {money(calc.discount, currency)}</span></div>}
            <div className="total"><span>Total</span><span>{money(total, currency)}</span></div>
            {cart.monthly && <div className="per-month"><span>Después</span><span>{money(monthly.price_usd, currency)}/mes</span></div>}
            {calc && <p className="save">Ahorrás {money(calc.discount, currency)} con tu cupón</p>}
          </div>

          <form className="cart-form" onSubmit={send}>
            <h3>¿A quién le mandamos la propuesta?</h3>
            <div className="pop-row">
              <label className="sr-only" htmlFor="c-name">Tu nombre</label>
              <input id="c-name" name="name" placeholder="Tu nombre" autoComplete="given-name" required />
              <label className="sr-only" htmlFor="c-phone">Tu WhatsApp</label>
              <input id="c-phone" name="phone" type="tel" inputMode="tel" placeholder="Tu WhatsApp" autoComplete="tel" required />
            </div>
            <label className="sr-only" htmlFor="c-business">Nombre de tu negocio</label>
            <input id="c-business" name="business" placeholder="Nombre de tu negocio (opcional)" autoComplete="organization" />
            <label className="sr-only" htmlFor="c-rubro">Rubro</label>
            <select id="c-rubro" name="rubro" defaultValue="">
              <option value="">Rubro (opcional)</option>
              {RUBRO_NAMES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="hp" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="btn btn-orange" disabled={sending || !pack}>
              {sending ? 'Preparando tu propuesta…' : pack ? `Enviar propuesta por WhatsApp · ${money(total, currency)}` : 'Elegí un pack'}
            </button>
            <p className="pop-fine">Te abrimos WhatsApp con la propuesta lista. Sin compromiso.</p>
          </form>
        </div>
      </aside>
    </div>
  );
}
