-- Roles enum + table (required pattern, separate from any profile table)
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function to check roles without recursion
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Only admins can see / manage roles
create policy "Admins can view roles"
  on public.user_roles
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert roles"
  on public.user_roles
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete roles"
  on public.user_roles
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Leads table
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source_page text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Anonymous + authenticated visitors may insert (signup form)
create policy "Anyone can submit a lead"
  on public.leads
  for insert
  to anon, authenticated
  with check (
    email is not null
    and char_length(email) <= 255
    and email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

-- Only admins can read leads
create policy "Admins can view leads"
  on public.leads
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete leads
create policy "Admins can delete leads"
  on public.leads
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create index leads_created_at_idx on public.leads (created_at desc);