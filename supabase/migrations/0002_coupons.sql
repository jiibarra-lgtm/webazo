-- Webazo · cupones, reclamos de cupón y campos de descuento en leads

do $$ begin
  create type public.coupon_type as enum ('percent','fixed');
exception when duplicate_object then null; end $$;

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null check (code = upper(code)),
  description text,
  type public.coupon_type not null default 'percent',
  value numeric(10,2) not null check (value > 0),
  packs text[] not null default '{}',          -- vacío = todos los packs
  expires_at timestamptz,
  max_uses int,
  uses int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger coupons_touch before update on public.coupons
  for each row execute function public.touch_updated_at();

create table if not exists public.coupon_claims (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  coupon_code text not null,
  name text,
  phone text not null,
  email text,
  utm_source text,
  utm_campaign text,
  utm_content text,
  landing_path text,
  converted boolean not null default false
);
create index if not exists coupon_claims_created_idx on public.coupon_claims (created_at desc);

alter table public.leads
  add column if not exists coupon_code text,
  add column if not exists price_usd numeric(10,2),
  add column if not exists discount_usd numeric(10,2),
  add column if not exists final_usd numeric(10,2);

create or replace function public.increment_coupon_use(p_code text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.coupons set uses = uses + 1 where code = upper(p_code);
$$;
revoke all on function public.increment_coupon_use(text) from public, anon, authenticated;
grant execute on function public.increment_coupon_use(text) to service_role;

alter table public.coupons enable row level security;
alter table public.coupon_claims enable row level security;

create policy coupons_admin_all on public.coupons for all using (public.is_admin()) with check (public.is_admin());
create policy coupon_claims_admin_all on public.coupon_claims for all using (public.is_admin()) with check (public.is_admin());

insert into public.coupons (code, description, type, value, expires_at, active)
values ('BIENVENIDA10', 'Cupón de bienvenida del popup', 'percent', 10, null, true)
on conflict (code) do nothing;

insert into public.settings (key, value) values
('popup', '{"enabled": true, "delay_seconds": 12, "coupon_code": "BIENVENIDA10", "eyebrow": "Solo para nuevos clientes", "title": "Tu primer webazo con descuento", "offer": "10% OFF", "text": "Dejanos tu WhatsApp y te mandamos el código para usar en cualquier pack.", "cta": "Quiero mi descuento"}')
on conflict (key) do nothing;
