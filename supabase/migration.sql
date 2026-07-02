-- Run this in your Supabase SQL Editor (https://app.supabase.com → SQL Editor)

-- 1. Profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  lounge text,
  journey text,
  first_name text,
  age_range text,
  guidance_voice text default 'female',
  guidance_mode text default 'audio-visual',
  has_completed_onboarding boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Row Level Security
alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 3. Auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
