-- Muhammad Asim — Portfolio: media storage bucket + policies
-- Idempotent. Apply via: node scripts/setup-storage.mjs
-- or Supabase dashboard → SQL Editor (paste & run).
--
-- The `media` bucket holds admin-uploaded images (project covers, thumbnails,
-- before/after pairs). Anyone may read; only an authenticated admin may write.

insert into storage.buckets (id, name, public)
    values ('media', 'media', true)
    on conflict (id) do update set public = true;

drop policy if exists "media public read" on storage.objects;

create policy "media public read" on storage.objects
    for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists "media admin insert" on storage.objects;

create policy "media admin insert" on storage.objects
    for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "media admin update" on storage.objects;

create policy "media admin update" on storage.objects
    for update to authenticated using (bucket_id = 'media') with check (bucket_id = 'media');

drop policy if exists "media admin delete" on storage.objects;

create policy "media admin delete" on storage.objects
    for delete to authenticated using (bucket_id = 'media');
