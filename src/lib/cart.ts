'use client';
import type { CartState } from './types';

const KEY = 'wz_cart';
export const CART_EVENT = 'wz:cart';
export const CART_OPEN_EVENT = 'wz:cart-open';
const EMPTY: CartState = { pack: null, extras: [], monthly: true };

export function readCart(): CartState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const c = JSON.parse(raw) as Partial<CartState>;
    return { pack: c.pack ?? null, extras: Array.isArray(c.extras) ? c.extras : [], monthly: c.monthly ?? true };
  } catch {
    return { ...EMPTY };
  }
}

function write(c: CartState) {
  try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* modo privado */ }
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export const openCart = () => window.dispatchEvent(new CustomEvent(CART_OPEN_EVENT));

export function setPack(slug: string | null) { write({ ...readCart(), pack: slug }); }
export function toggleExtra(slug: string) {
  const c = readCart();
  write({ ...c, extras: c.extras.includes(slug) ? c.extras.filter((x) => x !== slug) : [...c.extras, slug] });
}
export function setMonthly(on: boolean) { write({ ...readCart(), monthly: on }); }
export function clearCart() { write({ ...EMPTY }); }
export const cartCount = (c: CartState) => (c.pack ? 1 : 0) + c.extras.length;
