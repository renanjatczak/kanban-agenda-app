-- Events table
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  task_id     uuid references public.tasks(id) on delete set null,
  title       text not null,
  description text,
  start_time  timestamptz not null,
  end_time    timestamptz not null,
  color       text,
  type        text not null default 'personal',
  status      text not null default 'confirmed',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint events_type_check    check (type   in ('meeting', 'focus', 'reminder', 'personal')),
  constraint events_status_check  check (status in ('confirmed', 'cancelled')),
  constraint events_time_check    check (end_time > start_time)
);

-- Enable RLS
alter table public.events enable row level security;

-- Policies
create policy "events: select own"
  on public.events for select
  using (auth.uid() = user_id);

create policy "events: insert own"
  on public.events for insert
  with check (auth.uid() = user_id);

create policy "events: update own"
  on public.events for update
  using (auth.uid() = user_id);

create policy "events: delete own"
  on public.events for delete
  using (auth.uid() = user_id);

-- Reuse trigger function from tasks migration
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();
