'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';
import { LEAD_STATUSES, type LeadStatus } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';

const str = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === 'string' && v.trim() ? v.trim() : null;
};
const num = (fd: FormData, k: string) => {
  const v = str(fd, k);
  if (v == null) return null;
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};
const bool = (fd: FormData, k: string) => fd.get(k) === 'on';

function revalidateSite() {
  revalidatePath('/', 'layout');
}

// ── Leads ─────────────────────────────────────────────
export async function updateLead(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  const status = str(fd, 'status') as LeadStatus | null;
  if (!id) return;
  const patch: Record<string, unknown> = { notes: str(fd, 'notes'), value_usd: num(fd, 'value_usd') };
  if (status && (LEAD_STATUSES as readonly string[]).includes(status)) patch.status = status;
  await supabase.from('leads').update(patch).eq('id', id);
  revalidatePath('/admin', 'layout');
}

export async function setLeadStatus(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  const status = str(fd, 'status');
  if (!id || !status || !(LEAD_STATUSES as readonly string[]).includes(status)) return;
  await supabase.from('leads').update({ status }).eq('id', id);
  revalidatePath('/admin', 'layout');
}

export async function deleteLead(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  if (id) await supabase.from('leads').delete().eq('id', id);
  revalidatePath('/admin', 'layout');
  redirect('/admin/leads');
}

// ── Packs ─────────────────────────────────────────────
function packFromForm(fd: FormData) {
  return {
    name: str(fd, 'name') ?? 'Sin nombre',
    tagline: str(fd, 'tagline'),
    price_usd: num(fd, 'price_usd') ?? 0,
    price_before_usd: num(fd, 'price_before_usd'),
    price_note: str(fd, 'price_note'),
    features: (str(fd, 'features') ?? '').split('\n').map((l) => l.trim()).filter(Boolean),
    cta_label: str(fd, 'cta_label'),
    sort_order: num(fd, 'sort_order') ?? 0,
    featured: bool(fd, 'featured'),
    active: bool(fd, 'active'),
  };
}

export async function savePack(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  if (id) {
    await supabase.from('packs').update(packFromForm(fd)).eq('id', id);
  } else {
    const name = str(fd, 'name') ?? 'pack';
    const slug = (str(fd, 'slug') ?? name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await supabase.from('packs').insert({ ...packFromForm(fd), slug });
  }
  revalidateSite();
}

export async function deletePack(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  if (id) await supabase.from('packs').delete().eq('id', id);
  revalidateSite();
}

export async function saveSettings(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('settings').upsert([
    { key: 'monthly', value: { price_usd: num(fd, 'monthly_price') ?? 0, title: str(fd, 'monthly_title') ?? 'Mantenimiento mensual', description: str(fd, 'monthly_description') ?? '' } },
    { key: 'launch_banner', value: { enabled: bool(fd, 'banner_enabled'), text: str(fd, 'banner_text') ?? '' } },
  ]);
  revalidateSite();
}

// ── Testimonios ───────────────────────────────────────
export async function saveTestimonial(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  const row = {
    author: str(fd, 'author') ?? 'Cliente',
    business: str(fd, 'business'),
    rubro: str(fd, 'rubro'),
    quote: str(fd, 'quote') ?? '',
    sort_order: num(fd, 'sort_order') ?? 0,
    active: bool(fd, 'active'),
  };
  if (id) await supabase.from('testimonials').update(row).eq('id', id);
  else await supabase.from('testimonials').insert(row);
  revalidateSite();
}

export async function deleteTestimonial(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  if (id) await supabase.from('testimonials').delete().eq('id', id);
  revalidateSite();
}

// ── Preguntas ─────────────────────────────────────────
export async function saveFaq(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  const row = {
    question: str(fd, 'question') ?? '',
    answer: str(fd, 'answer') ?? '',
    sort_order: num(fd, 'sort_order') ?? 0,
    active: bool(fd, 'active'),
  };
  if (id) await supabase.from('faqs').update(row).eq('id', id);
  else await supabase.from('faqs').insert(row);
  revalidateSite();
}

export async function deleteFaq(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  if (id) await supabase.from('faqs').delete().eq('id', id);
  revalidateSite();
}

// ── Cupones ───────────────────────────────────────
export async function saveCouponAction(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  const expires = str(fd, 'expires_at');
  const row = {
    code: (str(fd, 'code') ?? '').toUpperCase().replace(/\s+/g, ''),
    description: str(fd, 'description'),
    type: str(fd, 'type') === 'fixed' ? 'fixed' : 'percent',
    value: num(fd, 'value') ?? 0,
    packs: fd.getAll('packs').map(String).filter(Boolean),
    expires_at: expires ? new Date(`${expires}T23:59:59-03:00`).toISOString() : null,
    max_uses: num(fd, 'max_uses'),
    active: bool(fd, 'active'),
  };
  if (!row.code || row.value <= 0) return;
  if (id) await supabase.from('coupons').update(row).eq('id', id);
  else await supabase.from('coupons').insert(row);
  revalidatePath('/admin/cupones');
}

export async function deleteCouponAction(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  if (id) await supabase.from('coupons').delete().eq('id', id);
  revalidatePath('/admin/cupones');
}

export async function savePopup(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('settings').upsert({
    key: 'popup',
    value: {
      enabled: bool(fd, 'enabled'),
      delay_seconds: num(fd, 'delay_seconds') ?? 2,
      frequency: ['always', 'session', 'day', 'week'].includes(str(fd, 'frequency') ?? '') ? str(fd, 'frequency') : 'session',
      coupon_code: (str(fd, 'coupon_code') ?? '').toUpperCase(),
      eyebrow: str(fd, 'eyebrow') ?? '',
      title: str(fd, 'title') ?? '',
      offer: str(fd, 'offer') ?? '',
      text: str(fd, 'text') ?? '',
      cta: str(fd, 'cta') ?? 'Quiero mi descuento',
    },
  });
  revalidateSite();
}

// ── Moneda ────────────────────────────────────────
export async function saveCurrency(fd: FormData) {
  const { supabase } = await requireAdmin();
  const mode = str(fd, 'mode');
  const source = str(fd, 'source');
  await supabase.from('settings').upsert({
    key: 'currency',
    value: {
      mode: mode === 'ARS' || mode === 'BOTH' ? mode : 'USD',
      rate: num(fd, 'rate') ?? 1200,
      source: source === 'oficial' || source === 'blue' ? source : 'manual',
      updated_at: new Date().toISOString(),
    },
  });
  revalidateSite();
}

/** Trae la cotización del día desde dolarapi.com (venta). */
export async function refreshRate(fd: FormData) {
  const { supabase } = await requireAdmin();
  const source = str(fd, 'source') === 'blue' ? 'blue' : 'oficial';
  try {
    const res = await fetch(`https://dolarapi.com/v1/dolares/${source}`, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
    const data = (await res.json()) as { venta?: number };
    if (!data.venta) return;
    const { data: row } = await supabase.from('settings').select('value').eq('key', 'currency').maybeSingle();
    const current = (row?.value ?? {}) as Record<string, unknown>;
    await supabase.from('settings').upsert({
      key: 'currency',
      value: { mode: 'USD', ...current, rate: data.venta, source, updated_at: new Date().toISOString() },
    });
    revalidateSite();
  } catch {
    /* si falla la API, queda la cotización anterior */
  }
}

// ── Atajos (activar / desactivar) ─────────────────
export async function toggleCoupon(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  if (!id) return;
  await supabase.from('coupons').update({ active: fd.get('active') === 'true' }).eq('id', id);
  revalidatePath('/admin', 'layout');
}

export async function togglePopup(fd: FormData) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('settings').select('value').eq('key', 'popup').maybeSingle();
  const current = (data?.value ?? {}) as Record<string, unknown>;
  await supabase.from('settings').upsert({ key: 'popup', value: { ...current, enabled: fd.get('enabled') === 'true' } });
  revalidateSite();
}

export async function toggleBanner(fd: FormData) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('settings').select('value').eq('key', 'launch_banner').maybeSingle();
  const current = (data?.value ?? {}) as Record<string, unknown>;
  await supabase.from('settings').upsert({ key: 'launch_banner', value: { ...current, enabled: fd.get('enabled') === 'true' } });
  revalidateSite();
}

export async function togglePack(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  if (!id) return;
  await supabase.from('packs').update({ active: fd.get('active') === 'true' }).eq('id', id);
  revalidateSite();
}

// ── Extras del carrito ────────────────────────────
export async function saveExtra(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  const row = {
    name: str(fd, 'name') ?? 'Extra',
    description: str(fd, 'description'),
    price_usd: num(fd, 'price_usd') ?? 0,
    sort_order: num(fd, 'sort_order') ?? 0,
    active: bool(fd, 'active'),
  };
  if (id) await supabase.from('extras').update(row).eq('id', id);
  else {
    const slug = row.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await supabase.from('extras').insert({ ...row, slug: `${slug}-${Date.now().toString(36).slice(-4)}` });
  }
  revalidateSite();
}

export async function deleteExtra(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  if (id) await supabase.from('extras').delete().eq('id', id);
  revalidateSite();
}

export async function toggleExtraAction(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, 'id');
  if (!id) return;
  await supabase.from('extras').update({ active: fd.get('active') === 'true' }).eq('id', id);
  revalidateSite();
}

// ── Sesión ────────────────────────────────────────────
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
