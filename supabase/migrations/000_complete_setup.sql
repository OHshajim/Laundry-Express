-- ==============================================================================
-- LAUNDRY EXPRESS: COMPLETE ONE-CLICK SUPABASE SETUP SCRIPT
-- Execute this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/njgulelpnlergcvzhjms/sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    password_hash TEXT,
    phone TEXT,
    address TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure password_hash column exists on existing tables
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- RLS Policies for public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read users" ON public.users;
CREATE POLICY "Public can read users" ON public.users 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert users" ON public.users;
CREATE POLICY "Public can insert users" ON public.users 
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update users" ON public.users;
CREATE POLICY "Public can update users" ON public.users 
    FOR UPDATE USING (true);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    plan_type TEXT NOT NULL DEFAULT 'by_bag',
    bag_count INT DEFAULT 1,
    weight_kg NUMERIC(8,2) DEFAULT 0.00,
    detergent_id TEXT NOT NULL DEFAULT 'det-tide-pods',
    wash_temperature TEXT NOT NULL DEFAULT 'cold',
    pickup_date DATE NOT NULL,
    pickup_window TEXT NOT NULL,
    dropoff_date DATE,
    delivery_window TEXT,
    delivery_status TEXT DEFAULT 'pending',
    street_address TEXT NOT NULL,
    apt_unit TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    will_be_home BOOLEAN DEFAULT TRUE,
    doorstep_confirmed BOOLEAN DEFAULT FALSE,
    special_instructions TEXT,
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    detergent_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL DEFAULT 'card',
    payment_status TEXT NOT NULL DEFAULT 'paid',
    order_status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public orders read" ON public.orders;
CREATE POLICY "Public orders read" ON public.orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public orders insert" ON public.orders;
CREATE POLICY "Public orders insert" ON public.orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public orders update" ON public.orders;
CREATE POLICY "Public orders update" ON public.orders FOR UPDATE USING (true);

-- 4. REVIEWS & REVIEW PHOTOS TABLE (Up to 3 Photos)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.review_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public reviews read" ON public.reviews;
CREATE POLICY "Public reviews read" ON public.reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public reviews insert" ON public.reviews;
CREATE POLICY "Public reviews insert" ON public.reviews FOR INSERT WITH CHECK (true);

ALTER TABLE public.review_photos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public review photos read" ON public.review_photos;
CREATE POLICY "Public review photos read" ON public.review_photos FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public review photos insert" ON public.review_photos;
CREATE POLICY "Public review photos insert" ON public.review_photos FOR INSERT WITH CHECK (true);

-- 5. STORAGE BUCKETS SETUP (Max 5MB Per File, Auto-Compressed)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    (
        'avatars', 
        'avatars', 
        true, 
        5242880, -- 5 MB ceiling
        ARRAY['image/jpeg', 'image/png', 'image/webp']
    ),
    (
        'review-photos', 
        'review-photos', 
        true, 
        5242880, -- 5 MB ceiling
        ARRAY['image/jpeg', 'image/png', 'image/webp']
    ),
    (
        'order-proofs', 
        'order-proofs', 
        true, 
        5242880, -- 5 MB ceiling
        ARRAY['image/jpeg', 'image/png', 'image/webp']
    )
ON CONFLICT (id) DO UPDATE SET 
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 6. STORAGE ACCESS POLICIES
DROP POLICY IF EXISTS "Avatars are publicly readable" ON storage.objects;
CREATE POLICY "Avatars are publicly readable" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Avatars can be uploaded" ON storage.objects;
CREATE POLICY "Avatars can be uploaded" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Avatars can be updated" ON storage.objects;
CREATE POLICY "Avatars can be updated" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Review photos are publicly readable" ON storage.objects;
CREATE POLICY "Review photos are publicly readable" ON storage.objects FOR SELECT USING (bucket_id = 'review-photos');

DROP POLICY IF EXISTS "Review photos can be uploaded" ON storage.objects;
CREATE POLICY "Review photos can be uploaded" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'review-photos');

DROP POLICY IF EXISTS "Order proofs are publicly readable" ON storage.objects;
CREATE POLICY "Order proofs are publicly readable" ON storage.objects FOR SELECT USING (bucket_id = 'order-proofs');

DROP POLICY IF EXISTS "Order proofs can be uploaded" ON storage.objects;
CREATE POLICY "Order proofs can be uploaded" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'order-proofs');

-- 7. SEED INITIAL ADMIN ACCOUNT
INSERT INTO public.users (email, full_name, role, phone, address)
VALUES 
    ('admin@laundryexpress.com', 'Operations Administrator', 'admin', '815-575-9536', 'Operations Center, Lake in the Hills, IL 60156'),
    ('customer@laundryexpress.com', 'Sarah Jenkins', 'customer', '815-575-9536', '742 Evergreen Terrace, Lake in the Hills, IL 60156')
ON CONFLICT (email) DO NOTHING;
