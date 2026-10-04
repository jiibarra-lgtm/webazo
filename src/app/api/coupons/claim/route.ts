import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hasServiceRole } from '@/lib/env';
import { checkCoupon } from '@/lib/coupons';
import { createServiceClient } from '@/lib/supabase/service';
import { sendCapiEvent } from '@/lib/meta-capi';
import { rateLimit } from '@/lib/rate-limit';
import { getIp, readCookie } from '@/lib/request';
import { DEFAULT_POPUP } from '@/lib/defaults';
import type { PopupConfig } from '@/lib/types';

const schema = z.object({
  name: z.string().trim().max(80).optional(),
  phone: z.string().trim().refine((v) => { const n = v.replace(/\D/g, '').length; return n >= 8 && n <= 15; }, 'Revisá el número'),
  email: z.string().trim().max(120).optional().refine((v) => !v || z.string().email().safeParse(v).success, 'Mail inválido'),
  website: z.string().optional(),
  eventId: z.string().max(80).optional(),
  pageUrl: z.string().max(500).optional(),
  attribution: z.record(z.string(), z.string().max(300)).optional(),
});

export async function POST(req: Request) {
  const ip = getIp(req);
  if (!rateLimit(`claim:${ip ?? 'anon'}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Demasiados intentos. Probá en unos minutos.' }, { status: 429 });
  }
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Revisá los datos.' }, { status: 422 });
  }
  const d = parsed.data;

  // Cupón configurado en el popup
  let popup: PopupConfig = DEFAULT_POPUP;
  if (hasServiceRole) {
    const { data } = await createServiceClient().from('settings').select('value').eq('key', 'popup').maybeSingle();
    if (data?.value) popup = { ...DEFAULT_POPUP, ...(data.value as object) };
  }
  const check = await checkCoupon(popup.coupon_code);
  if (!check.ok) return NextResponse.json({ error: 'La promo terminó. Escribinos por WhatsApp y vemos qué podemos hacer.' }, { status: 410 });
  if (d.website) return NextResponse.json({ ok: true, coupon: check.coupon }); // honeypot

  const a = d.attribution ?? {};
  if (hasServiceRole) {
    await createServiceClient().from('coupon_claims').insert({
      coupon_code: check.coupon.code,
      name: d.name || null,
      phone: d.phone,
      email: d.email || null,
      utm_source: a.utm_source ?? null,
      utm_campaign: a.utm_campaign ?? null,
      utm_content: a.utm_content ?? null,
      landing_path: a.landing_path ?? null,
    });
  }

  await sendCapiEvent({
    eventName: 'CompleteRegistration',
    eventId: d.eventId || `claim_${crypto.randomUUID()}`,
    eventSourceUrl: d.pageUrl,
    ip,
    userAgent: req.headers.get('user-agent'),
    fbc: readCookie(req, '_fbc'),
    fbp: readCookie(req, '_fbp'),
    email: d.email || null,
    phone: d.phone,
    firstName: d.name || null,
    customData: { content_name: `cupon_${check.coupon.code}` },
  });

  return NextResponse.json({ ok: true, coupon: check.coupon });
}
