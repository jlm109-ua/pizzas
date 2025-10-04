-- Create pizzas table
create table if not exists public.pizzas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null,
  ingredients text[] not null,
  nhoa_rating integer not null check (nhoa_rating >= 0 and nhoa_rating <= 10),
  jimy_rating integer not null check (jimy_rating >= 0 and jimy_rating <= 10),
  date_made date not null default current_date,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster queries
create index if not exists pizzas_date_made_idx on public.pizzas(date_made desc);
create index if not exists pizzas_avg_rating_idx on public.pizzas((nhoa_rating + jimy_rating) / 2.0 desc);

-- Enable public access (no auth required for this simple app)
alter table public.pizzas enable row level security;

-- Allow anyone to read pizzas
create policy "Anyone can view pizzas"
  on public.pizzas for select
  using (true);

-- Allow anyone to insert pizzas
create policy "Anyone can insert pizzas"
  on public.pizzas for insert
  with check (true);

-- Allow anyone to update pizzas
create policy "Anyone can update pizzas"
  on public.pizzas for update
  using (true);

-- Allow anyone to delete pizzas
create policy "Anyone can delete pizzas"
  on public.pizzas for delete
  using (true);
