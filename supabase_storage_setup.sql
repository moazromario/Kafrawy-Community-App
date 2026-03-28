-- Create 'stories' bucket
insert into storage.buckets (id, name, public) values ('stories', 'stories', true);

-- Create 'posts' bucket
insert into storage.buckets (id, name, public) values ('posts', 'posts', true);

-- Set up RLS for stories bucket
create policy "Public Access Stories" on storage.objects for select using (bucket_id = 'stories');
create policy "Authenticated users can upload stories" on storage.objects for insert with check (bucket_id = 'stories' and auth.role() = 'authenticated');
create policy "Users can update their own stories" on storage.objects for update using (bucket_id = 'stories' and auth.uid() = owner);
create policy "Users can delete their own stories" on storage.objects for delete using (bucket_id = 'stories' and auth.uid() = owner);

-- Set up RLS for posts bucket
create policy "Public Access Posts" on storage.objects for select using (bucket_id = 'posts');
create policy "Authenticated users can upload posts" on storage.objects for insert with check (bucket_id = 'posts' and auth.role() = 'authenticated');
create policy "Users can update their own posts" on storage.objects for update using (bucket_id = 'posts' and auth.uid() = owner);
create policy "Users can delete their own posts" on storage.objects for delete using (bucket_id = 'posts' and auth.uid() = owner);
