-- EduBridge · profiles table
-- Run once in the Supabase dashboard → SQL Editor.
-- Stores the role chosen at signup / on the "Complete Setup" screen.

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  role       text check (role in ('student', 'industry', 'academician', 'institution')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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
