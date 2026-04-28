create extension if not exists pgcrypto;

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('image', 'video')),
  src text not null,
  alt text not null default '',
  title text not null default '',
  category text,
  featured boolean not null default false,
  visible boolean not null default true,
  display_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  alt text not null default '',
  orientation text not null check (orientation in ('landscape', 'portrait')),
  featured boolean not null default false,
  visible boolean not null default true,
  display_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.hero_formulas (
  id text primary key,
  label text not null,
  class_name text not null,
  dark_class_name text,
  light_class_name text,
  animation_y jsonb not null default '[0,0,0]'::jsonb,
  animation_rotate jsonb,
  duration numeric not null default 8,
  display_order integer not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  visible boolean not null default true,
  display_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.batch_details (
  id uuid primary key default gen_random_uuid(),
  class_name text not null,
  days text not null default '',
  time text not null default '',
  starts text not null default '',
  visible boolean not null default true,
  display_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
alter table public.media_items enable row level security;
alter table public.hero_slides enable row level security;
alter table public.hero_formulas enable row level security;
alter table public.faq_items enable row level security;
alter table public.batch_details enable row level security;

drop policy if exists "public read site_settings" on public.site_settings;
drop policy if exists "public read media_items" on public.media_items;
drop policy if exists "public read hero_slides" on public.hero_slides;
drop policy if exists "public read hero_formulas" on public.hero_formulas;
drop policy if exists "public read faq_items" on public.faq_items;
drop policy if exists "public read batch_details" on public.batch_details;

create policy "public read site_settings" on public.site_settings for select using (true);
create policy "public read media_items" on public.media_items for select using (true);
create policy "public read hero_slides" on public.hero_slides for select using (true);
create policy "public read hero_formulas" on public.hero_formulas for select using (true);
create policy "public read faq_items" on public.faq_items for select using (true);
create policy "public read batch_details" on public.batch_details for select using (true);

drop policy if exists "authenticated write site_settings" on public.site_settings;
drop policy if exists "authenticated write media_items" on public.media_items;
drop policy if exists "authenticated write hero_slides" on public.hero_slides;
drop policy if exists "authenticated write hero_formulas" on public.hero_formulas;
drop policy if exists "authenticated write faq_items" on public.faq_items;
drop policy if exists "authenticated write batch_details" on public.batch_details;

create policy "authenticated write site_settings" on public.site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write media_items" on public.media_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write hero_slides" on public.hero_slides for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write hero_formulas" on public.hero_formulas for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write faq_items" on public.faq_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write batch_details" on public.batch_details for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  bio text,
  interests text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "public read profiles" on public.profiles;
drop policy if exists "authenticated update own profile" on public.profiles;

create policy "public read profiles" on public.profiles for select using (true);
create policy "authenticated update own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

insert into public.profiles (id, name)
select id, '' from auth.users
on conflict (id) do nothing;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "public read avatars" on storage.objects;
drop policy if exists "authenticated upload avatars" on storage.objects;

create policy "public read avatars" on storage.objects for select using (bucket_id = 'avatars');
create policy "authenticated upload avatars" on storage.objects for all using (bucket_id = 'avatars' and auth.role() = 'authenticated') with check (bucket_id = 'avatars' and auth.role() = 'authenticated');
