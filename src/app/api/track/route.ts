import { NextResponse } from 'next/server';
import { z } from 'zod';
import { env, hasServiceRole } from '@/lib/env';
import { createServiceClient } from '@/lib/supabase/service';
import { sendCapiEvent } from '@/lib/meta-capi';
import { rateLimit } from '@/lib/rate-limit';
import { getIp, readCookie } from '@/lib/request';

const schema = z.object({
  eventId: z.string().max(80),
  label: z.string().max(80),
  path: z.string().max(500),
  attribution: z
    .object({
      utm_source: z.string().max(200).optional(),
      utm_medium: z.string().max(200).optional(),
      utm_campaign: z.string().max(200).optional(),
      utm_content: z.string().max(200).optional(),
    })
    .partial()
    .passthrough()
    .optional(),
});

export async function POST(req: Request) {
  const ip = getIp(req);
  if (!rateLimit(`track:${ip ?? 'anon'}`, 30, 60 * 1000)) return new NextResponse(null, { status: 204 });

  let body: unknown;
  try {
    body = JSON.parse(await req.text());
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return new NextResponse(null, { status: 204 });
  const d = parsed.data;
  const a = d.attribution ?? {};

  await Promise.allSettled([
    hasServiceRole
      ? createServiceClient().from('clicks').insert({
          kind: 'whatsapp',
          label: d.label,
          path: d.path,
          utm_source: a.utm_source ?? null,
          utm_medium: a.utm_medium ?? null,
          utm_campaign: a.utm_campaign ?? null,
          utm_content: a.utm_content ?? null,
          event_id: d.eventId,
        })
      : Promise.resolve(),
    sendCapiEvent({
      eventName: 'Contact',
      eventId: d.eventId,
      eventSourceUrl: env.siteUrl + d.path,
      ip,
      userAgent: req.headers.get('user-agent'),
      fbc: readCookie(req, '_fbc'),
      fbp: readCookie(req, '_fbp'),
      customData: { content_name: d.label },
    }),
  ]);

  return new NextResponse(null, { status: 204 });
}
