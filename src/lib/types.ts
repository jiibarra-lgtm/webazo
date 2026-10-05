export type Pack = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  price_usd: number;
  price_before_usd: number | null;
  price_note: string | null;
  features: string[];
  featured: boolean;
  cta_label: string | null;
  badge?: string | null;
  sort_order: number;
  active: boolean;
};

export type Faq = { id: string; question: string; answer: string; sort_order: number; active: boolean };

export type Testimonial = {
  id: string;
  author: string;
  business: string | null;
  rubro: string | null;
  quote: string;
  sort_order: number;
  active: boolean;
};

export type Monthly = { price_usd: number; title: string; description: string };
export type LaunchBanner = { enabled: boolean; text: string };

export const LEAD_STATUSES = ['nuevo', 'contactado', 'presupuesto', 'ganado', 'perdido'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  phone: string;
  email: string | null;
  business: string | null;
  rubro: string | null;
  pack: string | null;
  message: string | null;
  status: LeadStatus;
  value_usd: number | null;
  notes: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  fbclid: string | null;
  landing_path: string | null;
  referrer: string | null;
  coupon_code: string | null;
  price_usd: number | null;
  discount_usd: number | null;
  final_usd: number | null;
  monthly_usd: number | null;
  cart: { pack: { slug: string; name: string | null; price_usd: number | null } | null; extras: { slug: string; name: string; price_usd: number }[]; monthly_usd: number | null } | null;
};

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  landing_path?: string;
  referrer?: string;
};

export type Coupon = {
  id: string;
  code: string;
  description: string | null;
  type: 'percent' | 'fixed';
  value: number;
  packs: string[];
  expires_at: string | null;
  max_uses: number | null;
  uses: number;
  active: boolean;
};

export type PopupFrequency = 'always' | 'session' | 'day' | 'week';

export type PopupConfig = {
  enabled: boolean;
  delay_seconds: number;
  frequency: PopupFrequency;
  coupon_code: string;
  eyebrow: string;
  title: string;
  offer: string;
  text: string;
  cta: string;
};

/** Cupón aplicado en el navegador (cookie wz_coupon). */
export type ActiveCoupon = {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  packs: string[];
  expires_at: string | null;
};

export type CurrencyMode = 'USD' | 'ARS' | 'BOTH';
export type CurrencyConfig = {
  mode: CurrencyMode;      // USD, ARS o ambos
  rate: number;            // pesos por dólar
  source: 'manual' | 'oficial' | 'blue';
  updated_at: string | null;
};

export type Extra = { id: string; slug: string; name: string; description: string | null; price_usd: number; sort_order: number; active: boolean };

export type CartState = { pack: string | null; extras: string[]; monthly: boolean };

export type CartLine = { slug: string; name: string; price_usd: number; kind: 'pack' | 'extra' };
