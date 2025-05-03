create table if not exists chat_interactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  user_message text not null,
  ai_response text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Adicionar políticas de segurança
alter table chat_interactions enable row level security;

create policy "Usuários podem ver suas próprias interações"
  on chat_interactions for select
  using (auth.uid() = user_id);

create policy "Usuários podem criar suas próprias interações"
  on chat_interactions for insert
  with check (auth.uid() = user_id); 