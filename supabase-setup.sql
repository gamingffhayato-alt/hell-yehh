-- EduBridge · profiles table
-- Run once in the Supabase dashboard → SQL Editor.
-- Stores onboarding details collected on the /details page.

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  full_name  text,
  role       text check (role in ('student', 'industry', 'academician', 'institution')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- If the table was created before full_name existed, add it with:
--   alter table public.profiles add column if not exists full_name text;

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
