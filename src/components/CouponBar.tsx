'use client';
import { useEffect, useState } from 'react';
import { COUPON_EVENT, clearCoupon, couponLabel, readCoupon } from '@/lib/coupon-client';
import type { ActiveCoupon } from '@/lib/types';

/** Barra fija que recuerda el cupón activo en todas las páginas. */
export default function CouponBar() {
  const [c, setC] = useState<ActiveCoupon | null>(null);
  useEffect(() => {
    const sync = () => setC(readCoupon());
    sync();
    window.addEventListener(COUPON_EVENT, sync);
    return () => window.removeEventListener(COUPON_EVENT, sync);
  }, []);
  if (!c) return null;
  return (
    <div className="coupon-bar" role="status">
      <span>Tenés <strong>{c.code}</strong> activo: {couponLabel(c)} en tu webazo{c.expires_at ? `, vence el ${new Date(c.expires_at).toLocaleDateString('es-AR')}` : ''}.</span>
      <a href="#packs">Ver precios</a>
      <button type="button" onClick={clearCoupon} aria-label="Quitar cupón">Quitar</button>
    </div>
  );
}
