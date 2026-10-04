export const env = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || 'https://webazo.com.ar').replace(/\/$/, ''),
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '5491160254550',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  capiToken: process.env.META_CAPI_TOKEN || '',
  capiTestCode: process.env.META_TEST_EVENT_CODE || '',
  gaId: process.env.NEXT_PUBLIC_GA_ID || '',
  resendKey: process.env.RESEND_API_KEY || '',
  notifyEmail: process.env.LEAD_NOTIFY_EMAIL || 'webazo.ar@gmail.com',
  fromEmail: process.env.LEAD_FROM_EMAIL || 'Webazo <avisos@webazo.com.ar>',
  ipSalt: process.env.IP_HASH_SALT || 'webazo',
};

export const hasSupabase = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const hasServiceRole = hasSupabase && Boolean(env.supabaseServiceKey);

export const contact = {
  whatsappDisplay: '11 6025-4550',
  instagram: 'webazo_',
  email: 'webazo.ar@gmail.com',
};
