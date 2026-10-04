'use client';
import { useEffect, useState } from 'react';
import { COUPON_EVENT, couponApplies, discounted, readCoupon } from '@/lib/coupon-client';
import type { ActiveCoupon, CurrencyConfig } from '@/lib/types';
import { money } from '@/lib/money';


/** Si hay un cupón activo, muestra el precio final y cuánto ahorra. */
export default function PackCouponPrice({ slug, price, currency }: { slug: string; price: number; currency: CurrencyConfig }) {
  const [c, setC] = useState<ActiveCoupon | null>(null);
  useEffect(() => {
    const sync = () => setC(readCoupon());
    sync();
    window.addEventListener(COUPON_EVENT, sync);
    return () => window.removeEventListener(COUPON_EVENT, sync);
  }, []);
  if (!c || !couponApplies(c, slug)) return null;
  const { discount, final } = discounted(price, c);
  return (
    <div className="coupon-price">
      <span>Con <strong>{c.code}</strong>: <b>{money(final, currency)}</b></span>
      <small>Ahorrás {money(discount, currency)}</small>
    </div>
  );
}
