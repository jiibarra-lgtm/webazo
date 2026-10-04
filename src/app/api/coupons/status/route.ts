import { NextResponse } from 'next/server';
import { hasServiceRole } from '@/lib/env';
import { normalizeCode } from '@/lib/coupons';
import { createServiceClient } from '@/lib/supabase/service';

/** Cupos restantes reales de un cupón (para mostrar escasez honesta). */
export async function GET(req: Request) {
  const code = normalizeCode(new URL(req.url).searchParams.get('code') ?? '');
  if (!code || !hasServiceRole) return NextResponse.json({ remaining: null });
  const { data } = await createServiceClient().from('coupons').select('max_uses, uses, active, expires_at').eq('code', code).maybeSingle();
  if (!data || !data.active || data.max_uses == null) return NextResponse.json({ remaining: null });
  return NextResponse.json(
    { remaining: Math.max(0, data.max_uses - data.uses) },
    { headers: { 'Cache-Control': 'public, s-maxage=60' } },
  );
}
