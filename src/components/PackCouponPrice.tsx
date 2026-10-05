'use client';
import { useEffect, useRef, useState } from 'react';
import { COUPON_EVENT, couponApplies, couponBonus, couponLabel, discounted, readCoupon } from '@/lib/coupon-client';
import type { ActiveCoupon, CurrencyConfig } from '@/lib/types';
import { money } from '@/lib/money';

/** Con cupón activo: el precio con descuento pasa a ser el principal y el original queda tachado. */
export default function PackCouponPrice({ slug, price, currency }: { slug: string; price: number; currency: CurrencyConfig }) {
  const [c, setC] = useState<ActiveCoupon | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setC(readCoupon());
    sync();
    window.addEventListener(COUPON_EVENT, sync);
    return () => window.removeEventListener(COUPON_EVENT, sync);
  }, []);

  const applies = !!(c && couponApplies(c, slug));
  useEffect(() => {
    ref.current?.closest('.price')?.classList.toggle('has-coupon', applies);
  }, [applies]);

  if (!c || !applies) return <div ref={ref} hidden />;
  const { discount, final } = discounted(price, c);
  return (
    <div ref={ref} className="coupon-price">
      <span className="cp-label">Tu precio con {c.code}</span>
      <b>{money(final, currency)}</b>
      <small>Ahorrás {money(discount, currency)} · {couponLabel(c, currency)}</small>
      {couponBonus(c) && <small className="cp-bonus">🎁 {couponBonus(c).replace(/^\+\s*/, '')}</small>}
    </div>
  );
}
