-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query)

create extension if not exists "pgcrypto";

create table if not exists public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  difficulty text not null check (difficulty in ('beginner','intermediate','advanced')),
  num_questions int not null,
  status text not null default 'in_progress' check (status in ('in_progress','completed')),
  overall_score numeric,
  technical_avg numeric,
  communication_avg numeric,
  summary jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.interview_questions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.interview_sessions(id) on delete cascade,
  position int not null,
  question text not null,
  topic text,
  ideal_points jsonb not null default '[]'::jsonb,
  answer text,
  rubric jsonb,
  technical_score numeric,
  communication_score numeric,
  score int,
  feedback jsonb,
  suggested_answer text,
  evaluated_at timestamptz,
  unique (session_id, position)
);

create index if not exists idx_sessions_user on public.interview_sessions(user_id, created_at desc);
create index if not exists idx_questions_session on public.interview_questions(session_id, position);

-- Row Level Security: users can only read their own data.
-- The FastAPI backend uses the service-role key (bypasses RLS) and always filters by user_id.
alter table public.interview_sessions enable row level security;
alter table public.interview_questions enable row level security;

drop policy if exists "own sessions" on public.interview_sessions;
create policy "own sessions" on public.interview_sessions
  for select using (auth.uid() = user_id);

drop policy if exists "own questions" on public.interview_questions;
create policy "own questions" on public.interview_questions
  for select using (
    exists (select 1 from public.interview_sessions s
            where s.id = session_id and s.user_id = auth.uid())
  );
