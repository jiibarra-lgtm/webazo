import { NextResponse } from 'next/server';
import { checkCoupon } from '@/lib/coupons';
import { rateLimit } from '@/lib/rate-limit';
import { getIp } from '@/lib/request';

export async function POST(req: Request) {
  const ip = getIp(req);
  if (!rateLimit(`coupon:${ip ?? 'anon'}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: 'Demasiados intentos. Probá en unos minutos.' }, { status: 429 });
  }
  let body: { code?: string; pack?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* vacío */
  }
  const result = await checkCoupon(String(body.code ?? ''), body.pack || null);
  return NextResponse.json(result, { status: result.ok ? 200 : 404 });
}
