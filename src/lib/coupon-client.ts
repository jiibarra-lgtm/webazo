'use client';
import { getCookie, setCookie } from './tracking';
import type { ActiveCoupon, CurrencyConfig } from './types';
import { money } from './money';

export const COUPON_COOKIE = 'wz_coupon';
export const COUPON_EVENT = 'wz:coupon';

export function readCoupon(): ActiveCoupon | null {
  try {
    const raw = getCookie(COUPON_COOKIE);
    if (!raw) return null;
    const c = JSON.parse(raw) as ActiveCoupon;
    if (c.expires_at && new Date(c.expires_at).getTime() < Date.now()) return null;
    return c;
  } catch {
    return null;
  }
}

export function saveCoupon(c: ActiveCoupon) {
  setCookie(COUPON_COOKIE, JSON.stringify(c), 30);
  window.dispatchEvent(new CustomEvent(COUPON_EVENT));
}

export function clearCoupon() {
  setCookie(COUPON_COOKIE, '', -1);
  window.dispatchEvent(new CustomEvent(COUPON_EVENT));
}

export function couponLabel(c: ActiveCoupon, currency?: CurrencyConfig) {
  if (c.type === 'percent') return `${c.value}% OFF`;
  return `${currency ? money(c.value, currency) : `USD ${c.value}`} OFF`;
}

/** Texto del regalo extra del cupón (meses de mantenimiento gratis). */
export function couponBonus(c: ActiveCoupon | null | undefined) {
  const n = Number(c?.free_months ?? 0);
  if (!n) return '';
  return n === 1 ? '+ 1 mes de mantenimiento gratis' : `+ ${n} meses de mantenimiento gratis`;
}

export function couponApplies(c: ActiveCoupon, packSlug: string) {
  return !c.packs.length || c.packs.includes(packSlug);
}

export function discounted(price: number, c: ActiveCoupon) {
  const raw = c.type === 'percent' ? (price * c.value) / 100 : c.value;
  const discount = Math.min(price, Math.round(raw * 100) / 100);
  return { discount, final: Math.round((price - discount) * 100) / 100 };
}
