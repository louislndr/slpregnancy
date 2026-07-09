-- Admin tables migration — run once in Supabase SQL Editor
-- Safe to re-run: all statements use IF NOT EXISTS / DO NOTHING

-- Protocols
create table if not exists public.protocols (
  id text primary key,
  title text not null,
  description text,
  duration integer default 10,
  content_type text default 'FULL SESSION',
  journeys text[] default '{}',
  emotional_states text[] default '{}',
  needs text[] default '{}',
  positions text[] default '{sitting}',
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

-- Protocol Parts (steps within a session)
create table if not exists public.protocol_parts (
  id text primary key,
  protocol_id text references public.protocols(id) on delete cascade,
  label text not null,
  duration text,
  position integer default 0,
  created_at timestamptz default now()
);

-- Programs
create table if not exists public.programs (
  id text primary key,
  title text not null,
  subtitle text,
  description text,
  journey text,
  lounge text,
  is_premium boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Flow Nodes (sessions in a program curriculum)
create table if not exists public.flow_nodes (
  id text primary key,
  program_id text references public.programs(id) on delete cascade,
  protocol_id text references public.protocols(id) on delete set null,
  label text,
  type text default 'session',
  position_x float default 0,
  position_y float default 0
);

-- Flow Edges (connections between nodes)
create table if not exists public.flow_edges (
  id text primary key,
  program_id text references public.programs(id) on delete cascade,
  source_node text,
  target_node text,
  label text
);

-- RLS: enable on all tables
alter table public.protocols enable row level security;
alter table public.protocol_parts enable row level security;
alter table public.programs enable row level security;
alter table public.flow_nodes enable row level security;
alter table public.flow_edges enable row level security;

-- RLS: authenticated users can read everything (app reads)
do $$ begin
  if not exists (select 1 from pg_policies where tablename='protocols' and policyname='Authenticated users can read protocols') then
    create policy "Authenticated users can read protocols" on public.protocols for select to authenticated using (true);
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='protocol_parts' and policyname='Authenticated users can read protocol_parts') then
    create policy "Authenticated users can read protocol_parts" on public.protocol_parts for select to authenticated using (true);
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='programs' and policyname='Authenticated users can read programs') then
    create policy "Authenticated users can read programs" on public.programs for select to authenticated using (true);
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='flow_nodes' and policyname='Authenticated users can read flow_nodes') then
    create policy "Authenticated users can read flow_nodes" on public.flow_nodes for select to authenticated using (true);
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='flow_edges' and policyname='Authenticated users can read flow_edges') then
    create policy "Authenticated users can read flow_edges" on public.flow_edges for select to authenticated using (true);
  end if;
end $$;
