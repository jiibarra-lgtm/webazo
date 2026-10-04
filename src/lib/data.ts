import { hasSupabase } from './env';
import { createPublicClient } from './supabase/public';
import { DEFAULT_BANNER, DEFAULT_FAQS, DEFAULT_MONTHLY, DEFAULT_PACKS, DEFAULT_POPUP, DEFAULT_CURRENCY } from './defaults';
import type { CurrencyConfig, Extra, Faq, LaunchBanner, Monthly, Pack, PopupConfig, Testimonial } from './types';

async function safe<T>(fn: () => Promise<T | null>, fallback: T): Promise<T> {
  if (!hasSupabase) return fallback;
  try {
    const result = await fn();
    return result ?? fallback;
  } catch {
    return fallback;
  }
}

export function getPacks(): Promise<Pack[]> {
  return safe(async () => {
    const { data, error } = await createPublicClient()
      .from('packs').select('*').eq('active', true).order('sort_order');
    if (error || !data?.length) return null;
    return data.map((p) => ({ ...p, price_usd: Number(p.price_usd), price_before_usd: p.price_before_usd == null ? null : Number(p.price_before_usd) })) as Pack[];
  }, DEFAULT_PACKS);
}

export function getExtras(): Promise<Extra[]> {
  return safe(async () => {
    const { data, error } = await createPublicClient()
      .from('extras').select('*').eq('active', true).order('sort_order');
    if (error) return null;
    return (data ?? []).map((e) => ({ ...e, price_usd: Number(e.price_usd) })) as Extra[];
  }, []);
}

export function getFaqs(): Promise<Faq[]> {
  return safe(async () => {
    const { data, error } = await createPublicClient()
      .from('faqs').select('*').eq('active', true).order('sort_order');
    if (error || !data?.length) return null;
    return data as Faq[];
  }, DEFAULT_FAQS);
}

export function getTestimonials(): Promise<Testimonial[]> {
  return safe(async () => {
    const { data, error } = await createPublicClient()
      .from('testimonials').select('*').eq('active', true).order('sort_order');
    if (error) return null;
    return (data ?? []) as Testimonial[];
  }, []);
}

async function getSetting<T>(key: string, fallback: T): Promise<T> {
  return safe(async () => {
    const { data, error } = await createPublicClient().from('settings').select('value').eq('key', key).maybeSingle();
    if (error || !data) return null;
    return { ...fallback, ...(data.value as object) } as T;
  }, fallback);
}

export const getMonthly = () => getSetting<Monthly>('monthly', DEFAULT_MONTHLY);
export const getBanner = () => getSetting<LaunchBanner>('launch_banner', DEFAULT_BANNER);
export const getPopup = () => getSetting<PopupConfig>('popup', DEFAULT_POPUP);
export const getCurrency = () => getSetting<CurrencyConfig>('currency', DEFAULT_CURRENCY);

export async function getPageData() {
  const [packs, faqs, testimonials, monthly, banner, popup, currency, extras] = await Promise.all([
    getPacks(), getFaqs(), getTestimonials(), getMonthly(), getBanner(), getPopup(), getCurrency(), getExtras(),
  ]);
  return { packs, faqs, testimonials, monthly, banner, popup, currency, extras };
}
