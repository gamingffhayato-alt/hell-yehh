-- ═══════════════════════════════════════════════════════════════════════
-- Intern X · profiles table (with academic details)
-- ═══════════════════════════════════════════════════════════════════════

-- ── 1) NEW COLUMNS — run this block if the table already exists ─────────
alter table public.profiles add column if not exists class_year       text;
alter table public.profiles add column if not exists course           text;
alter table public.profiles add column if not exists stream           text;
alter table public.profiles add column if not exists institution      text;
alter table public.profiles add column if not exists full_name        text;
-- Sign-up wizard (step 1 profiling + industry partner details)
alter table public.profiles add column if not exists marketing_source text;
alter table public.profiles add column if not exists company_name     text;
alter table public.profiles add column if not exists job_title        text;

-- ── 2) FRESH SETUP — full table definition (for reference / new projects)
create table if not exists public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  email            text,
  full_name        text,
  class_year       text,
  course           text,
  stream           text,
  institution      text,
  marketing_source text,
  company_name     text,
  job_title        text,
  role             text check (role in ('student', 'industry', 'academician', 'institution')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can only read/modify their own row
create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);
