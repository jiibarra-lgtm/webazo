import 'server-only';
import { hasServiceRole } from './env';
import { createServiceClient } from './supabase/service';
import type { ActiveCoupon, Coupon } from './types';

export type CouponCheck =
  | { ok: true; coupon: ActiveCoupon }
  | { ok: false; error: string };

export const normalizeCode = (code: string) => code.trim().toUpperCase().replace(/\s+/g, '').slice(0, 40);

/** Valida un cupón contra la base. Si se pasa un pack, verifica que aplique. */
export async function checkCoupon(rawCode: string, packSlug?: string | null): Promise<CouponCheck> {
  const code = normalizeCode(rawCode);
  if (!code) return { ok: false, error: 'Ingresá un código.' };
  if (!hasServiceRole) return { ok: false, error: 'Cupones no disponibles por el momento.' };

  const { data } = await createServiceClient().from('coupons').select('*').eq('code', code).maybeSingle();
  const c = data as Coupon | null;
  if (!c || !c.active) return { ok: false, error: 'Ese código no existe o ya no está activo.' };
  if (c.expires_at && new Date(c.expires_at).getTime() < Date.now()) return { ok: false, error: 'Ese código ya venció.' };
  if (c.max_uses != null && c.uses >= c.max_uses) return { ok: false, error: 'Ese código ya alcanzó su límite de usos.' };
  if (packSlug && c.packs.length && !c.packs.includes(packSlug)) {
    return { ok: false, error: 'Ese código no aplica a este pack.' };
  }
  return {
    ok: true,
    coupon: { code: c.code, type: c.type, value: Number(c.value), packs: c.packs, expires_at: c.expires_at, free_months: Number(c.free_months ?? 0) },
  };
}

export function applyDiscount(price: number, c: ActiveCoupon) {
  const raw = c.type === 'percent' ? (price * c.value) / 100 : c.value;
  const discount = Math.min(price, Math.round(raw * 100) / 100);
  return { discount, final: Math.round((price - discount) * 100) / 100 };
}
