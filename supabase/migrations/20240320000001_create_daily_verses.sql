create table if not exists daily_verses (
  id uuid default gen_random_uuid() primary key,
  verse text not null,
  reference text not null,
  explanation text not null,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Adicionar políticas de segurança
alter table daily_verses enable row level security;

create policy "Todos podem ver os versículos diários"
  on daily_verses for select
  using (true);

create policy "Apenas administradores podem inserir versículos"
  on daily_verses for insert
  with check (auth.uid() in (
    select user_id from admins
  )); 