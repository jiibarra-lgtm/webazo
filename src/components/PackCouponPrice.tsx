'use client';
import { useEffect, useState } from 'react';
import { COUPON_EVENT, couponApplies, discounted, readCoupon } from '@/lib/coupon-client';
import type { ActiveCoupon } from '@/lib/types';

const fmt = (n: number) => n.toLocaleString('es-AR', { maximumFractionDigits: 2 });

/** Si hay un cupón activo, muestra el precio final y cuánto ahorra. */
export default function PackCouponPrice({ slug, price }: { slug: string; price: number }) {
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
      <span>Con <strong>{c.code}</strong>: <b>USD {fmt(final)}</b></span>
      <small>Ahorrás USD {fmt(discount)}</small>
    </div>
  );
}
