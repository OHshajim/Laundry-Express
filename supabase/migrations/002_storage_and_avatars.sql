-- ==============================================================================
-- LAUNDRY EXPRESS: SUPABASE IMAGE HOSTING SERVICE SETUP
-- Document Ref: PLAN-LE-STORAGE-001
-- Buckets: avatars (public), order-proofs (public), review-photos (public), catalog-items (public)
-- ==============================================================================

-- 1. Ensure avatar_url column exists in public.users
ALTER TABLE IF EXISTS public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Insert / Update Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    (
        'avatars', 
        'avatars', 
        true, 
        5242880, -- 5 MB
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    ),
    (
        'order-proofs', 
        'order-proofs', 
        true, 
        10485760, -- 10 MB
        ARRAY['image/jpeg', 'image/png', 'image/webp']
    ),
    (
        'review-photos', 
        'review-photos', 
        true, 
        10485760, -- 10 MB
        ARRAY['image/jpeg', 'image/png', 'image/webp']
    ),
    (
        'catalog-items', 
        'catalog-items', 
        true, 
        10485760, -- 10 MB
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    )
ON CONFLICT (id) DO UPDATE SET 
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. Storage Security Policies for Public Access & Uploads (Idempotent)
DROP POLICY IF EXISTS "Public avatars are viewable by everyone" ON storage.objects;
CREATE POLICY "Public avatars are viewable by everyone" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Anyone can upload avatars" ON storage.objects;
CREATE POLICY "Anyone can upload avatars" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Anyone can update their avatar" ON storage.objects;
CREATE POLICY "Anyone can update their avatar" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Anyone can delete their avatar" ON storage.objects;
CREATE POLICY "Anyone can delete their avatar" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Public order-proofs are viewable by everyone" ON storage.objects;
CREATE POLICY "Public order-proofs are viewable by everyone" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'order-proofs');

DROP POLICY IF EXISTS "Anyone can upload order-proofs" ON storage.objects;
CREATE POLICY "Anyone can upload order-proofs" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'order-proofs');

DROP POLICY IF EXISTS "Public review-photos are viewable by everyone" ON storage.objects;
CREATE POLICY "Public review-photos are viewable by everyone" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'review-photos');

DROP POLICY IF EXISTS "Anyone can upload review-photos" ON storage.objects;
CREATE POLICY "Anyone can upload review-photos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'review-photos');

DROP POLICY IF EXISTS "Public catalog-items are viewable by everyone" ON storage.objects;
CREATE POLICY "Public catalog-items are viewable by everyone" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'catalog-items');

DROP POLICY IF EXISTS "Anyone can upload catalog-items" ON storage.objects;
CREATE POLICY "Anyone can upload catalog-items" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'catalog-items');
