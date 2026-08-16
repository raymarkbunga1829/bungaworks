create table if not exists stack_runs (
  id text primary key,
  user_id text not null,
  score integer not null,
  lines integer not null,
  level integer not null,
  created_at timestamptz not null default now()
);

create index if not exists stack_runs_score_idx on stack_runs (score desc);
create index if not exists stack_runs_user_idx on stack_runs (user_id);
