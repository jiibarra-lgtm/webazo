import 'server-only';
import { createHash } from 'crypto';
import { env } from './env';
import { toWaPhone } from './whatsapp';

const sha256 = (v: string) => createHash('sha256').update(v.trim().toLowerCase()).digest('hex');

type CapiInput = {
  eventName: 'Lead' | 'Contact' | 'ViewContent' | 'CompleteRegistration';
  eventId: string;
  eventSourceUrl?: string;
  ip?: string | null;
  userAgent?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  customData?: Record<string, unknown>;
};

/**
 * Envía un evento a la API de Conversiones de Meta (server-side).
 * Se deduplica con el evento del Píxel usando el mismo eventId.
 * Nunca rompe el flujo: si falla, solo lo registra.
 */
export async function sendCapiEvent(input: CapiInput) {
  if (!env.pixelId || !env.capiToken) return;

  const user_data: Record<string, unknown> = {
    client_ip_address: input.ip || undefined,
    client_user_agent: input.userAgent || undefined,
    fbc: input.fbc || undefined,
    fbp: input.fbp || undefined,
    country: [sha256('ar')],
  };
  if (input.email) user_data.em = [sha256(input.email)];
  if (input.phone) user_data.ph = [sha256(toWaPhone(input.phone))];
  if (input.firstName) user_data.fn = [sha256(input.firstName.split(' ')[0])];

  const body: Record<string, unknown> = {
    data: [{
      event_name: input.eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: input.eventId,
      action_source: 'website',
      event_source_url: input.eventSourceUrl,
      user_data,
      custom_data: input.customData,
    }],
  };
  if (env.capiTestCode) body.test_event_code = env.capiTestCode;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${env.pixelId}/events?access_token=${env.capiToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!res.ok) console.error('[CAPI]', res.status, await res.text());
  } catch (err) {
    console.error('[CAPI] error', err);
  }
}
