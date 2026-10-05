import { NextResponse } from 'next/server';
import { z } from 'zod';
import { env, hasServiceRole } from '@/lib/env';
import { createServiceClient } from '@/lib/supabase/service';
import { sendCapiEvent } from '@/lib/meta-capi';
import { rateLimit } from '@/lib/rate-limit';
import { getIp, hashIp } from '@/lib/request';
import { toWaPhone } from '@/lib/whatsapp';
import { applyDiscount, checkCoupon } from '@/lib/coupons';
import { DEFAULT_MONTHLY, DEFAULT_PACKS } from '@/lib/defaults';

const optional = (max: number) => z.string().trim().max(max).optional().transform((v) => (v ? v : null));

const schema = z.object({
  name: z.string().trim().min(2, 'Poné tu nombre').max(80),
  phone: z.string().trim().refine((v) => v.replace(/\D/g, '').length >= 8, 'Revisá el número').refine((v) => v.replace(/\D/g, '').length <= 15, 'Revisá el número'),
  email: z.string().trim().max(120).optional().refine((v) => !v || z.string().email().safeParse(v).success, 'Mail inválido').transform((v) => (v ? v : null)),
  business: optional(120),
  rubro: optional(60),
  pack: optional(40),
  message: optional(1000),
  coupon: z.string().max(40).optional(),
  extras: z.array(z.string().max(60)).max(20).optional(),
  monthly: z.boolean().optional(),
  website: z.string().optional(),
  eventId: z.string().max(80).optional(),
  fbp: z.string().max(200).nullable().optional(),
  fbc: z.string().max(300).nullable().optional(),
  pageUrl: z.string().max(500).optional(),
  attribution: z
    .object({
      utm_source: z.string().max(200).optional(),
      utm_medium: z.string().max(200).optional(),
      utm_campaign: z.string().max(200).optional(),
      utm_content: z.string().max(200).optional(),
      utm_term: z.string().max(200).optional(),
      fbclid: z.string().max(300).optional(),
      landing_path: z.string().max(300).optional(),
      referrer: z.string().max(300).optional(),
    })
    .partial()
    .optional(),
});

export async function POST(req: Request) {
  const ip = getIp(req);
  if (!rateLimit(`lead:${ip ?? 'anon'}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Demasiados intentos. Escribinos por WhatsApp.' }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((i) => {
      const k = String(i.path[0]);
      if (!fieldErrors[k]) fieldErrors[k] = i.message;
    });
    return NextResponse.json({ error: 'Revisá los datos marcados.', fieldErrors }, { status: 422 });
  }

  const d = parsed.data;
  // Honeypot: un bot lo completó. Respondemos OK para no darle pistas.
  if (d.website) return NextResponse.json({ ok: true });

  const a = d.attribution ?? {};
  const userAgent = req.headers.get('user-agent');
  const eventId = d.eventId || `lead_${crypto.randomUUID()}`;

  // Precio, extras y cupón: siempre se recalculan en el servidor
  let packName: string | null = null;
  let packPrice: number | null = null;
  let extrasRows: { slug: string; name: string; price_usd: number }[] = [];
  let monthlyPrice = 0;
  if (hasServiceRole) {
    const svc = createServiceClient();
    const [pk, ex, mo] = await Promise.all([
      d.pack ? svc.from('packs').select('name, price_usd').eq('slug', d.pack).maybeSingle() : Promise.resolve({ data: null }),
      d.extras?.length ? svc.from('extras').select('slug, name, price_usd').in('slug', d.extras).eq('active', true) : Promise.resolve({ data: [] }),
      d.monthly ? svc.from('settings').select('value').eq('key', 'monthly').maybeSingle() : Promise.resolve({ data: null }),
    ]);
    if (pk.data) { packName = pk.data.name; packPrice = Number(pk.data.price_usd); }
    extrasRows = ((ex.data ?? []) as { slug: string; name: string; price_usd: number }[]).map((e) => ({ ...e, price_usd: Number(e.price_usd) }));
    if (d.monthly) monthlyPrice = Number((mo.data?.value as { price_usd?: number } | undefined)?.price_usd ?? DEFAULT_MONTHLY.price_usd);
  } else if (d.pack) {
    const p = DEFAULT_PACKS.find((x) => x.slug === d.pack);
    packName = p?.name ?? null;
    packPrice = p?.price_usd ?? null;
    if (d.monthly) monthlyPrice = DEFAULT_MONTHLY.price_usd;
  }
  const extrasTotal = extrasRows.reduce((sum, e) => sum + e.price_usd, 0);
  const price: number | null = packPrice != null || extrasTotal > 0 ? (packPrice ?? 0) + extrasTotal : null;

  let couponCode: string | null = null;
  let freeMonths = 0;
  let discount: number | null = null;
  let final: number | null = price;
  if (d.coupon) {
    const check = await checkCoupon(d.coupon, d.pack);
    if (check.ok) {
      couponCode = check.coupon.code;
      freeMonths = d.monthly ? Number(check.coupon.free_months ?? 0) : 0;
      if (price != null) {
        const r = applyDiscount(price, check.coupon);
        discount = r.discount;
        final = r.final;
      }
    }
  }
  const cart = d.extras !== undefined || d.monthly !== undefined
    ? { pack: d.pack ? { slug: d.pack, name: packName, price_usd: packPrice } : null, extras: extrasRows, monthly_usd: monthlyPrice || null }
    : null;

  if (hasServiceRole) {
    const { error } = await createServiceClient().from('leads').insert({
      name: d.name,
      phone: d.phone,
      email: d.email,
      business: d.business,
      rubro: d.rubro,
      pack: d.pack,
      message: d.message,
      utm_source: a.utm_source ?? null,
      utm_medium: a.utm_medium ?? null,
      utm_campaign: a.utm_campaign ?? null,
      utm_content: a.utm_content ?? null,
      utm_term: a.utm_term ?? null,
      fbclid: a.fbclid ?? null,
      landing_path: a.landing_path ?? null,
      referrer: a.referrer ?? null,
      coupon_code: couponCode,
      price_usd: price,
      discount_usd: discount,
      final_usd: final,
      cart,
      monthly_usd: monthlyPrice || null,
      event_id: eventId,
      user_agent: userAgent?.slice(0, 300) ?? null,
      ip_hash: hashIp(ip),
    });
    if (error) {
      console.error('[leads] insert', error);
      return NextResponse.json({ error: 'No pudimos guardar tu consulta. Escribinos por WhatsApp.' }, { status: 500 });
    }
    if (couponCode) {
      const svc = createServiceClient();
      await svc.rpc('increment_coupon_use', { p_code: couponCode });
      await svc.from('coupon_claims').update({ converted: true }).eq('coupon_code', couponCode).eq('phone', d.phone);
    }
  } else {
    console.warn('[leads] Supabase no configurado. Lead recibido:', d.name, d.phone);
  }

  await Promise.allSettled([
    sendCapiEvent({
      eventName: 'Lead',
      eventId,
      eventSourceUrl: d.pageUrl,
      ip,
      userAgent,
      fbc: d.fbc,
      fbp: d.fbp,
      email: d.email,
      phone: d.phone,
      firstName: d.name,
      customData: { content_name: d.pack || 'sin_pack', content_category: d.rubro || undefined, value: final ?? undefined, currency: final != null ? 'USD' : undefined },
    }),
    notifyByEmail(d, a),
  ]);

  return NextResponse.json({ ok: true, totals: { price, discount, final, monthly: monthlyPrice || null, coupon: couponCode, free_months: freeMonths } });
}

const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function notifyByEmail(d: z.infer<typeof schema>, a: NonNullable<z.infer<typeof schema>['attribution']>) {
  if (!env.resendKey) return;
  const wa = `https://wa.me/${toWaPhone(d.phone)}`;
  const plain: [string, string | null | undefined][] = [
    ['Nombre', d.name], ['Mail', d.email], ['Negocio', d.business], ['Rubro', d.rubro], ['Pack', d.pack],
    ['Mensaje', d.message], ['Campaña', a.utm_campaign], ['Anuncio', a.utm_content], ['Fuente', a.utm_source],
  ];
  const row = (k: string, v: string) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td><strong>${v}</strong></td></tr>`;
  const rows =
    row('WhatsApp', `<a href="${esc(wa)}">${esc(d.phone)}</a>`) +
    plain.filter(([, v]) => v).map(([k, v]) => row(k, esc(String(v)))).join('');
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.fromEmail,
        to: [env.notifyEmail],
        subject: `Nuevo lead: ${d.name}${d.pack ? ` · ${d.pack}` : ''}`,
        html: `<h2>Nuevo lead en Webazo</h2><table>${rows}</table><p><a href="${env.siteUrl}/admin/leads">Ver en el panel</a></p>`,
      }),
      signal: AbortSignal.timeout(4000),
    });
  } catch (err) {
    console.error('[leads] mail', err);
  }
}
