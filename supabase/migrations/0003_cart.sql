-- Webazo · carrito: extras y detalle del carrito en leads
create table if not exists public.extras (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price_usd numeric(10,2) not null check (price_usd >= 0),
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger extras_touch before update on public.extras
  for each row execute function public.touch_updated_at();

alter table public.extras enable row level security;
create policy extras_public_read on public.extras for select using (active or public.is_admin());
create policy extras_admin_insert on public.extras for insert with check (public.is_admin());
create policy extras_admin_update on public.extras for update using (public.is_admin()) with check (public.is_admin());
create policy extras_admin_delete on public.extras for delete using (public.is_admin());

alter table public.leads
  add column if not exists cart jsonb,
  add column if not exists monthly_usd numeric(10,2);

-- Extras de ejemplo (inactivos: revisá precios y activalos desde /admin/packs)
insert into public.extras (slug, name, description, price_usd, sort_order, active) values
('logo', 'Logo profesional', 'Diseño de logo con 2 propuestas', 40, 1, false),
('textos', 'Redacción de textos', 'Escribimos todos los textos de tu web', 25, 2, false),
('fotos', 'Edición de fotos', 'Hasta 20 fotos de productos o del local', 30, 3, false),
('catalogo', 'Carga de catálogo', 'Cargamos hasta 50 productos o servicios', 35, 4, false),
('mail', 'Mail profesional', 'Casilla con tu dominio (vos@tunegocio.com.ar)', 15, 5, false),
('meta-ads', 'Configuración de Meta Ads', 'Píxel, públicos y tu primera campaña', 50, 6, false)
on conflict (slug) do nothing;

-- Permisos de la Data API (los proyectos nuevos de Supabase no los otorgan solos)
grant select on public.packs, public.settings, public.testimonials, public.faqs, public.extras to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;
grant execute on function public.is_admin() to anon, authenticated, service_role;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated, service_role;
alter default privileges in schema public grant usage, select on sequences to authenticated, service_role;

-- v8: el popup aplica el cupón con un clic (sin pedir teléfono)
alter table public.coupon_claims alter column phone drop not null;

-- v10: etiqueta personalizable por pack
alter table public.packs add column if not exists badge text;
update public.packs set badge = 'El más completo' where featured and badge is null;
