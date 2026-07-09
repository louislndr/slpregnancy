-- Run this in your Supabase SQL Editor after migration.sql

-- 1. Storage buckets (run separately if needed)
-- insert into storage.buckets (id, name, public) values ('audio', 'audio', true) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('visuals', 'visuals', true) on conflict do nothing;

-- 2. Protocols table (replaces static data/protocols.ts)
create table if not exists public.protocols (
  id text primary key,
  title text not null,
  description text,
  duration integer default 10,
  content_type text default 'FULL SESSION',
  journeys text[] default '{}',
  emotional_states text[] default '{}',
  needs text[] default '{}',
  positions text[] default '{}',
  has_visual boolean default false,
  intention text,
  self_care_tip text,
  is_support_now boolean default false,
  support_now_key text,
  for_lounge text,
  audio_url text,
  visual_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Protocol parts (steps within a session)
create table if not exists public.protocol_parts (
  id uuid primary key default gen_random_uuid(),
  protocol_id text references public.protocols(id) on delete cascade,
  label text not null,
  duration text,
  position integer not null default 0,
  created_at timestamptz default now()
);

-- 4. Programs
create table if not exists public.programs (
  id text primary key,
  title text not null,
  subtitle text,
  description text,
  cover_url text,
  journey text,
  lounge text,
  is_premium boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Flow nodes (curriculum map nodes)
create table if not exists public.flow_nodes (
  id text primary key,
  program_id text references public.programs(id) on delete cascade,
  type text default 'session',
  protocol_id text references public.protocols(id) on delete set null,
  label text,
  position_x float default 0,
  position_y float default 0,
  data jsonb default '{}',
  created_at timestamptz default now()
);

-- 6. Flow edges (curriculum map connections)
create table if not exists public.flow_edges (
  id text primary key,
  program_id text references public.programs(id) on delete cascade,
  source_node text not null,
  target_node text not null,
  label text,
  created_at timestamptz default now()
);

-- 7. RLS for mobile app read access
alter table public.protocols enable row level security;
alter table public.protocol_parts enable row level security;
alter table public.programs enable row level security;
alter table public.flow_nodes enable row level security;
alter table public.flow_edges enable row level security;

create policy "Authenticated users can read protocols"
  on public.protocols for select to authenticated using (true);

create policy "Authenticated users can read protocol_parts"
  on public.protocol_parts for select to authenticated using (true);

create policy "Authenticated users can read programs"
  on public.programs for select to authenticated using (true);

create policy "Authenticated users can read flow_nodes"
  on public.flow_nodes for select to authenticated using (true);

create policy "Authenticated users can read flow_edges"
  on public.flow_edges for select to authenticated using (true);

-- Check-in flow suggestions table
create table if not exists public.checkin_suggestions (
  emotional_state text not null,
  protocol_id     text not null references public.protocols(id) on delete cascade,
  sort_order      integer not null default 0,
  primary key (emotional_state, protocol_id)
);

alter table public.checkin_suggestions enable row level security;

create policy "Authenticated users can read checkin_suggestions"
  on public.checkin_suggestions for select to authenticated using (true);

-- Check-in pathway rules (replaces checkin_suggestions)
create table if not exists public.checkin_rules (
  feeling     text not null,
  need        text not null default 'all',
  protocol_id text not null references public.protocols(id) on delete cascade,
  sort_order  integer not null default 0,
  primary key (feeling, need, protocol_id)
);

alter table public.checkin_rules enable row level security;

create policy "Authenticated users can read checkin_rules"
  on public.checkin_rules for select to authenticated using (true);

-- Community posts
create table if not exists public.community_posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  content      text not null default '',
  type         text not null default 'announcement',
  is_published boolean not null default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.community_posts enable row level security;

create policy "Authenticated users can read published community posts"
  on public.community_posts for select to authenticated using (is_published = true);

-- User feedback
create table if not exists public.user_feedback (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete set null,
  message    text not null,
  type       text not null default 'general',
  rating     integer check (rating between 1 and 5),
  is_read    boolean not null default false,
  created_at timestamptz default now()
);

alter table public.user_feedback enable row level security;

create policy "Users can insert their own feedback"
  on public.user_feedback for insert to authenticated
  with check (auth.uid() = user_id);
