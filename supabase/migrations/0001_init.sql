-- ═══════════════════════════════════════════════════════════════
-- Webazo · esquema inicial
-- Ejecutar en Supabase → SQL Editor (o con `supabase db push`)
-- ═══════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- ── Administradores ────────────────────────────────────────────
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ── updated_at automático ──────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Packs (precios editables desde el panel) ───────────────────
create table if not exists public.packs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  price_usd numeric(10,2) not null,
  price_before_usd numeric(10,2),
  price_note text,
  features text[] not null default '{}',
  featured boolean not null default false,
  cta_label text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger packs_touch before update on public.packs
  for each row execute function public.touch_updated_at();

-- ── Ajustes generales (clave/valor) ────────────────────────────
create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();

-- ── Testimonios ────────────────────────────────────────────────
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  business text,
  rubro text,
  quote text not null,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── Preguntas frecuentes ───────────────────────────────────────
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── Leads (CRM) ────────────────────────────────────────────────
do $$ begin
  create type public.lead_status as enum ('nuevo','contactado','presupuesto','ganado','perdido');
exception when duplicate_object then null; end $$;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  business text,
  rubro text,
  pack text,
  message text,
  status public.lead_status not null default 'nuevo',
  value_usd numeric(10,2),
  notes text,
  -- atribución
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  fbclid text,
  landing_path text,
  referrer text,
  -- técnico
  event_id text,
  user_agent text,
  ip_hash text
);
create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_campaign_idx on public.leads (utm_campaign);
create trigger leads_touch before update on public.leads
  for each row execute function public.touch_updated_at();

-- ── Clics a WhatsApp (para medir campañas) ─────────────────────
create table if not exists public.clicks (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind text not null default 'whatsapp',
  label text,
  path text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  event_id text
);
create index if not exists clicks_created_idx on public.clicks (created_at desc);

-- ═══════════════════════════════════════════════════════════════
-- Row Level Security
-- Los INSERT de leads y clics los hace el servidor con la service
-- role key (bypassa RLS). El público solo lee contenido activo.
-- ═══════════════════════════════════════════════════════════════
alter table public.admins       enable row level security;
alter table public.packs        enable row level security;
alter table public.settings     enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs         enable row level security;
alter table public.leads        enable row level security;
alter table public.clicks       enable row level security;

-- admins: cada uno ve su propia fila
create policy admins_self on public.admins for select using (user_id = (select auth.uid()));

-- contenido público
create policy packs_public_read on public.packs for select using (active or public.is_admin());
create policy packs_admin_insert on public.packs for insert with check (public.is_admin());
create policy packs_admin_update on public.packs for update using (public.is_admin()) with check (public.is_admin());
create policy packs_admin_delete on public.packs for delete using (public.is_admin());

create policy settings_public_read on public.settings for select using (true);
create policy settings_admin_insert on public.settings for insert with check (public.is_admin());
create policy settings_admin_update on public.settings for update using (public.is_admin()) with check (public.is_admin());
create policy settings_admin_delete on public.settings for delete using (public.is_admin());

create policy testimonials_public_read on public.testimonials for select using (active or public.is_admin());
create policy testimonials_admin_insert on public.testimonials for insert with check (public.is_admin());
create policy testimonials_admin_update on public.testimonials for update using (public.is_admin()) with check (public.is_admin());
create policy testimonials_admin_delete on public.testimonials for delete using (public.is_admin());

create policy faqs_public_read on public.faqs for select using (active or public.is_admin());
create policy faqs_admin_insert on public.faqs for insert with check (public.is_admin());
create policy faqs_admin_update on public.faqs for update using (public.is_admin()) with check (public.is_admin());
create policy faqs_admin_delete on public.faqs for delete using (public.is_admin());

-- datos privados: solo admins
create policy leads_admin_all  on public.leads  for all using (public.is_admin()) with check (public.is_admin());
create policy clicks_admin_all on public.clicks for all using (public.is_admin()) with check (public.is_admin());
