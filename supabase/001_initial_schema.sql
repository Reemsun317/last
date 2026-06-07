create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type business_status as enum ('pending', 'approved', 'rejected');
create type stock_status as enum ('in_stock', 'low_stock', 'out_of_stock');
create type app_role as enum ('buyer', 'vendor', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null default 'buyer',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  category text not null,
  market text,
  street text,
  city text not null,
  state text not null,
  phone text not null,
  whatsapp text not null,
  email text,
  latitude numeric(10, 7) not null,
  longitude numeric(10, 7) not null,
  status business_status not null default 'pending',
  verified boolean not null default false,
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text,
  category text not null,
  price numeric(12, 2) not null check (price >= 0),
  currency text not null default 'NGN',
  image_url text,
  stock_status stock_status not null default 'in_stock',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_metrics (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references public.businesses(id) on delete cascade,
  views integer not null default 0,
  whatsapp_clicks integer not null default 0,
  call_clicks integer not null default 0,
  direction_clicks integer not null default 0,
  updated_at timestamptz not null default now()
);

create index businesses_status_idx on public.businesses(status);
create index businesses_owner_idx on public.businesses(owner_id);
create index businesses_location_idx on public.businesses(state, city, market);
create index businesses_coordinates_idx on public.businesses(latitude, longitude);
create index businesses_search_idx on public.businesses using gin (
  (coalesce(name, '') || ' ' || coalesce(category, '') || ' ' || coalesce(market, '') || ' ' || coalesce(street, '') || ' ' || coalesce(city, '') || ' ' || coalesce(state, '')) gin_trgm_ops
);
create index products_business_idx on public.products(business_id);
create index products_category_idx on public.products(category);
create index products_search_idx on public.products using gin (
  (coalesce(name, '') || ' ' || coalesce(category, '') || ' ' || coalesce(description, '')) gin_trgm_ops
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create trigger businesses_set_updated_at before update on public.businesses
for each row execute function public.set_updated_at();

create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();

create or replace function public.create_business_metric()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.business_metrics (business_id) values (new.id)
  on conflict (business_id) do nothing;
  return new;
end;
$$;

create trigger businesses_create_metric after insert on public.businesses
for each row execute function public.create_business_metric();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.increment_business_metric(
  business_id_input uuid,
  metric_name text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if metric_name not in ('views', 'whatsapp_clicks', 'call_clicks', 'direction_clicks') then
    raise exception 'Invalid metric name';
  end if;

  insert into public.business_metrics (business_id)
  values (business_id_input)
  on conflict (business_id) do nothing;

  execute format(
    'update public.business_metrics set %I = %I + 1, updated_at = now() where business_id = $1',
    metric_name,
    metric_name
  ) using business_id_input;
end;
$$;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.businesses enable row level security;
alter table public.products enable row level security;
alter table public.business_metrics enable row level security;

create policy "profiles are readable by owner or admin"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

create policy "profiles are editable by owner"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "roles are readable by owner or admin"
on public.user_roles for select
using (user_id = auth.uid() or public.is_admin());

create policy "admins manage roles"
on public.user_roles for all
using (public.is_admin())
with check (public.is_admin());

create policy "approved businesses are public"
on public.businesses for select
using (status = 'approved' or owner_id = auth.uid() or public.is_admin());

create policy "authenticated vendors create businesses"
on public.businesses for insert
with check (auth.uid() is not null and (owner_id = auth.uid() or owner_id is null));

create policy "owners update pending or rejected businesses"
on public.businesses for update
using (owner_id = auth.uid() or public.is_admin())
with check (owner_id = auth.uid() or public.is_admin());

create policy "admins delete businesses"
on public.businesses for delete
using (public.is_admin());

create policy "products are public for approved businesses"
on public.products for select
using (
  exists (
    select 1 from public.businesses
    where businesses.id = products.business_id
      and (businesses.status = 'approved' or businesses.owner_id = auth.uid() or public.is_admin())
  )
);

create policy "business owners create products"
on public.products for insert
with check (
  exists (
    select 1 from public.businesses
    where businesses.id = products.business_id
      and businesses.owner_id = auth.uid()
  )
);

create policy "business owners update products"
on public.products for update
using (
  exists (
    select 1 from public.businesses
    where businesses.id = products.business_id
      and (businesses.owner_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1 from public.businesses
    where businesses.id = products.business_id
      and (businesses.owner_id = auth.uid() or public.is_admin())
  )
);

create policy "business owners delete products"
on public.products for delete
using (
  exists (
    select 1 from public.businesses
    where businesses.id = products.business_id
      and (businesses.owner_id = auth.uid() or public.is_admin())
  )
);

create policy "metrics visible to owners and admins"
on public.business_metrics for select
using (
  public.is_admin()
  or exists (
    select 1 from public.businesses
    where businesses.id = business_metrics.business_id
      and businesses.owner_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('business-images', 'business-images', true, 5242880, array['image/png', 'image/jpeg', 'image/webp']),
  ('product-images', 'product-images', true, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

create policy "public reads business images"
on storage.objects for select
using (bucket_id = 'business-images');

create policy "authenticated users upload business images"
on storage.objects for insert
with check (bucket_id = 'business-images' and auth.uid() is not null);

create policy "owners update business images"
on storage.objects for update
using (bucket_id = 'business-images' and owner = auth.uid())
with check (bucket_id = 'business-images' and owner = auth.uid());

create policy "public reads product images"
on storage.objects for select
using (bucket_id = 'product-images');

create policy "authenticated users upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images' and auth.uid() is not null);

create policy "owners update product images"
on storage.objects for update
using (bucket_id = 'product-images' and owner = auth.uid())
with check (bucket_id = 'product-images' and owner = auth.uid());
