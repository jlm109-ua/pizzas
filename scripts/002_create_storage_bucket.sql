-- Create storage bucket for pizza images
insert into storage.buckets (id, name, public)
values ('pizza-images', 'pizza-images', true)
on conflict (id) do nothing;

-- Allow public access to view images
create policy "Public Access"
  on storage.objects for select
  using (bucket_id = 'pizza-images');

-- Allow anyone to upload images
create policy "Anyone can upload images"
  on storage.objects for insert
  with check (bucket_id = 'pizza-images');

-- Allow anyone to update images
create policy "Anyone can update images"
  on storage.objects for update
  using (bucket_id = 'pizza-images');

-- Allow anyone to delete images
create policy "Anyone can delete images"
  on storage.objects for delete
  using (bucket_id = 'pizza-images');
