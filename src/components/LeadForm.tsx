'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAttribution, getCookie, newEventId } from '@/lib/tracking';
import { RUBRO_NAMES } from '@/lib/rubros';
import { COUPON_EVENT, couponApplies, couponLabel, discounted, readCoupon, saveCoupon } from '@/lib/coupon-client';
import type { ActiveCoupon, CurrencyConfig } from '@/lib/types';
import { money } from '@/lib/money';
import { DEFAULT_CURRENCY } from '@/lib/defaults';

type Props = { packs: { slug: string; name: string; price: number }[]; defaultRubro?: string; defaultPack?: string; currency?: CurrencyConfig };


export default function LeadForm({ packs, defaultRubro = '', defaultPack = '', currency = DEFAULT_CURRENCY }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pack, setPack] = useState(defaultPack);
  const [coupon, setCoupon] = useState<ActiveCoupon | null>(null);
  const [code, setCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const sync = () => {
      const c = readCoupon();
      setCoupon(c);
      if (c) setCode(c.code);
    };
    sync();
    window.addEventListener(COUPON_EVENT, sync);
    return () => window.removeEventListener(COUPON_EVENT, sync);
  }, []);

  async function applyCode() {
    if (!code.trim()) return;
    setChecking(true);
    setCouponMsg(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, pack: pack || undefined }),
      });
      const data = await res.json();
      if (data.ok) {
        saveCoupon(data.coupon);
        setCoupon(data.coupon);
        setCouponMsg({ ok: true, text: `Cupón aplicado: ${couponLabel(data.coupon, currency)}` });
      } else {
        setCouponMsg({ ok: false, text: data.error || 'Código inválido.' });
      }
    } catch {
      setCouponMsg({ ok: false, text: 'No pudimos validar el código.' });
    }
    setChecking(false);
  }

  const selected = packs.find((p) => p.slug === pack);
  const applies = !!(coupon && selected && couponApplies(coupon, selected.slug));
  const calc = selected && coupon && applies ? discounted(selected.price, coupon) : null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const fd = new FormData(e.currentTarget);
    const eventId = newEventId('lead');

    const payload = {
      name: String(fd.get('name') || ''),
      phone: String(fd.get('phone') || ''),
      email: String(fd.get('email') || ''),
      business: String(fd.get('business') || ''),
      rubro: String(fd.get('rubro') || ''),
      pack: String(fd.get('pack') || ''),
      message: String(fd.get('message') || ''),
      coupon: coupon && applies ? coupon.code : (code.trim() || ''),
      website: String(fd.get('website') || ''), // honeypot
      eventId,
      attribution: getAttribution(),
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc'),
      pageUrl: location.href,
    };

    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        setError(data.error || 'No pudimos enviar tu consulta. Probá de nuevo o escribinos por WhatsApp.');
        setLoading(false);
        return;
      }
      window.fbq?.('track', 'Lead', { content_name: payload.pack || 'sin_pack' }, { eventID: eventId });
      window.gtag?.('event', 'generate_lead', { pack: payload.pack, rubro: payload.rubro });
      const q = new URLSearchParams({ n: payload.name.split(' ')[0] });
      if (payload.pack) q.set('pack', payload.pack);
      router.push(`/gracias?${q.toString()}`);
    } catch {
      setError('Sin conexión. Revisá tu internet o escribinos por WhatsApp.');
      setLoading(false);
    }
  }

  const err = (k: string) => fieldErrors[k] && <span className="err" id={`${k}-err`}>{fieldErrors[k]}</span>;

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="name">Nombre</label>
        <input id="name" name="name" autoComplete="name" required aria-invalid={!!fieldErrors.name} aria-describedby={fieldErrors.name ? 'name-err' : undefined} />
        {err('name')}
      </div>
      <div className="field">
        <label htmlFor="phone">WhatsApp</label>
        <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="11 2345-6789" required aria-invalid={!!fieldErrors.phone} aria-describedby={fieldErrors.phone ? 'phone-err' : undefined} />
        {err('phone')}
      </div>
      <div className="field">
        <label htmlFor="business">Nombre del negocio <span className="opt">(opcional)</span></label>
        <input id="business" name="business" autoComplete="organization" />
      </div>
      <div className="field">
        <label htmlFor="email">Mail <span className="opt">(opcional)</span></label>
        <input id="email" name="email" type="email" autoComplete="email" aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? 'email-err' : undefined} />
        {err('email')}
      </div>
      <div className="field">
        <label htmlFor="rubro">Rubro</label>
        <select id="rubro" name="rubro" defaultValue={defaultRubro}>
          <option value="">Elegí tu rubro</option>
          {RUBRO_NAMES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="pack">Pack que te interesa</label>
        <select id="pack" name="pack" value={pack} onChange={(e) => setPack(e.target.value)}>
          <option value="">Todavía no sé</option>
          {packs.map((p) => <option key={p.slug} value={p.slug}>{p.name} ({money(p.price, currency)})</option>)}
        </select>
      </div>
      <div className="field full">
        <label htmlFor="coupon">Cupón de descuento <span className="opt">(opcional)</span></label>
        <div className="coupon-field">
          <input id="coupon" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Ej: BIENVENIDA10" autoComplete="off" />
          <button type="button" onClick={applyCode} disabled={checking}>{checking ? '…' : 'Aplicar'}</button>
        </div>
        {couponMsg && <span className={couponMsg.ok ? 'coupon-ok' : 'err'} role="status">{couponMsg.text}</span>}
        {!couponMsg && coupon && <span className="coupon-ok">Cupón {coupon.code} activo: {couponLabel(coupon, currency)}</span>}
      </div>
      {selected && (
        <div className="summary" aria-live="polite">
          <div><span>Pack {selected.name}</span><span>{money(selected.price, currency)}</span></div>
          {calc && <div className="disc"><span>Descuento {coupon?.code}</span><span>− {money(calc.discount, currency)}</span></div>}
          {coupon && !applies && <div><span className="muted">El cupón {coupon.code} no aplica a este pack</span><span /></div>}
          <div className="total"><span>Total</span><span>{money(calc ? calc.final : selected.price, currency)}</span></div>
        </div>
      )}
      <div className="field full">
        <label htmlFor="message">Contanos de tu negocio <span className="opt">(opcional)</span></label>
        <textarea id="message" name="message" maxLength={1000} placeholder="Qué hacés, si ya tenés web o redes, qué te gustaría resolver…" />
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">No completar</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="full">
        <button type="submit" className="btn btn-orange" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Enviando…' : 'Quiero que me contacten'}
        </button>
      </div>
      <p className="legal full">Te contactamos por WhatsApp en el día hábil. Al enviar aceptás nuestra <a href="/privacidad">política de privacidad</a>.</p>
    </form>
  );
}
