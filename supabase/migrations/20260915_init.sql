-- COLLEXA: Full-Stack Supabase Database Schema & Google OAuth Lifecycle Migration
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role_target text default 'Senior Full-Stack Engineer',
  notifications_enabled boolean default true,
  media_consent_recording boolean default false,
  welcome_email_sent_at timestamptz default null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. User Roadmap Progress
create table if not exists public.user_roadmap_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  roadmap_slug text not null,
  completed_stages int[] default '{}',
  proof_of_work jsonb default '{}'::jsonb,
  updated_at timestamptz default now(),
  constraint user_roadmap_unique unique (user_id, roadmap_slug)
);

-- 3. Interview Sessions
create table if not exists public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  track text not null,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')) not null,
  questions_count int not null,
  status text check (status in ('in_progress', 'completed')) default 'in_progress',
  eye_contact_score numeric,
  posture_score numeric,
  avg_pace_wpm numeric,
  filler_word_count int,
  save_recording boolean default false,
  overall_score numeric,
  technical_score numeric,
  communication_score numeric,
  presence_score numeric,
  feedback_summary text,
  strengths text[] default '{}',
  areas_for_improvement text[] default '{}',
  next_actions text[] default '{}',
  created_at timestamptz default now()
);

-- 4. Interview Answers
create table if not exists public.interview_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.interview_sessions on delete cascade not null,
  question_text text not null,
  transcript text,
  user_audio_url text,
  feedback_notes text,
  score numeric,
  answered_at timestamptz default now()
);

-- 5. Counseling Threads & Messages
create table if not exists public.counseling_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text default 'New Career Discussion',
  created_at timestamptz default now()
);

create table if not exists public.counseling_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references public.counseling_threads on delete cascade not null,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamptz default now()
);

-- 6. Earned Certificates
create table if not exists public.earned_certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  provider_name text not null,
  cert_title text not null,
  credential_url text,
  date_claimed timestamptz default now(),
  constraint unique_user_cert unique (user_id, provider_name, cert_title)
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.user_roadmap_progress enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.interview_answers enable row level security;
alter table public.counseling_threads enable row level security;
alter table public.counseling_messages enable row level security;
alter table public.earned_certificates enable row level security;

-- RLS Policies
create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users manage own roadmap progress" on public.user_roadmap_progress for all using (auth.uid() = user_id);
create policy "Users manage own interview sessions" on public.interview_sessions for all using (auth.uid() = user_id);
create policy "Users manage own interview answers" on public.interview_answers for all using (
  exists (select 1 from public.interview_sessions where id = interview_answers.session_id and user_id = auth.uid())
);
create policy "Users manage own counseling threads" on public.counseling_threads for all using (auth.uid() = user_id);
create policy "Users manage own counseling messages" on public.counseling_messages for all using (
  exists (select 1 from public.counseling_threads where id = counseling_messages.thread_id and user_id = auth.uid())
);
create policy "Users manage own certificates" on public.earned_certificates for all using (auth.uid() = user_id);

-- 7. Private Storage Bucket for Interview Recordings (14-day Auto-Purge Lifecycle)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'interview-recordings',
  'interview-recordings',
  false,
  52428800, -- 50MB max per recording
  array['video/webm', 'video/mp4', 'audio/webm', 'audio/mp4']
) on conflict (id) do nothing;

create policy "Users manage own interview recordings" on storage.objects
  for all using (
    bucket_id = 'interview-recordings' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Google OAuth Auto Profile Creation Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Learner'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
