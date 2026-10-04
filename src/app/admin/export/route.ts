import { NextResponse } from 'next/server';
import { hasSupabase } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import { LEAD_STATUSES } from '@/lib/types';

const COLS = ['created_at', 'name', 'phone', 'email', 'business', 'rubro', 'pack', 'message', 'status', 'price_usd', 'coupon_code', 'discount_usd', 'final_usd', 'value_usd', 'notes', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'landing_path'] as const;

const cell = (v: unknown) => {
  if (v === null || v === undefined) return '';
  const s = String(v).replace(/"/g, '""');
  return /[",\n;]/.test(s) || /^[=+\-@]/.test(s) ? `"${/^[=+\-@]/.test(s) ? "'" : ''}${s}"` : s;
};

export async function GET(req: Request) {
  if (!hasSupabase) return new NextResponse('No configurado', { status: 503 });
  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) return new NextResponse('No autorizado', { status: 401 });

  const status = new URL(req.url).searchParams.get('status');
  let q = supabase.from('leads').select(COLS.join(',')).order('created_at', { ascending: false });
  if (status && (LEAD_STATUSES as readonly string[]).includes(status)) q = q.eq('status', status);
  const { data, error } = await q;
  if (error) return new NextResponse('Error', { status: 500 });

  const rows = (data ?? []) as unknown as Record<string, unknown>[];
  const csv = '\uFEFF' + [COLS.join(','), ...rows.map((r) => COLS.map((c) => cell(r[c])).join(','))].join('\n');
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-webazo-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
