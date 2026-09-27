-- ==============================================================================
-- LAUNDRY EXPRESS: COMPLETE PRODUCTION DATABASE SCHEMA
-- Single, consolidated, production-grade PostgreSQL setup for Supabase.
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
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

-- Ensure password_hash and avatar_url exist on existing databases
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 3. AUTH OTPS TABLE (Email OTP verification for password change & recovery)
CREATE TABLE IF NOT EXISTS public.auth_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    otp_hash TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('change_password', 'reset_password')),
    attempts INT DEFAULT 0,
    expires_at TIMESTAMPTZ NOT NULL,
    consumed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_otps_email_purpose ON public.auth_otps(email, purpose);

-- 4. PRICING CONFIGS (By Bag & By KG pricing managed by Admin)
CREATE TABLE IF NOT EXISTS public.pricing_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pricing_type TEXT UNIQUE NOT NULL CHECK (pricing_type IN ('per_bag', 'per_kg')),
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    min_order_quantity NUMERIC(10,2) NOT NULL DEFAULT 1.00,
    free_delivery_threshold NUMERIC(10,2) DEFAULT 0.00,
    standard_delivery_fee NUMERIC(10,2) DEFAULT 0.00,
    max_orders_per_slot INT DEFAULT 15,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. PLANS TABLE (Packages created and managed by Admin)
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    package_type TEXT NOT NULL DEFAULT 'bag_bundle' CHECK (package_type IN ('bag_bundle', 'weight_tier', 'subscription')),
    included_bags INT DEFAULT 0,
    included_kg NUMERIC(10,2) DEFAULT 0,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    validity_days INT DEFAULT 30,
    key_points JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. CATALOG ITEMS (Detergents & Temperatures managed by Admin)
CREATE TABLE IF NOT EXISTS public.catalog_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('detergent', 'temperature')),
    name TEXT NOT NULL,
    brand TEXT,
    item_type TEXT NOT NULL, -- e.g. liquid, powder, pods / cold, warm, hot
    price NUMERIC(10,2) DEFAULT 0.00,
    description TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_catalog_items_category ON public.catalog_items(category);

-- 7. COUPONS & OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    title TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_delivery')),
    discount_value NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    min_order_amount NUMERIC(10,2) DEFAULT 0.00,
    max_uses INT,
    used_count INT DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. ORDERS TABLE (Full lifecycle from creation to delivery)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    plan_type TEXT NOT NULL DEFAULT 'per_bag' CHECK (plan_type IN ('per_bag', 'per_kg', 'package')),
    bag_count INT DEFAULT 0,
    weight_kg NUMERIC(10,2) DEFAULT 0,
    detergent_id UUID,
    detergent_name TEXT,
    wash_temperature TEXT,
    pickup_date DATE NOT NULL,
    pickup_time_slot TEXT NOT NULL,
    dropoff_date DATE,
    pickup_address JSONB NOT NULL,
    is_home_for_pickup BOOLEAN DEFAULT TRUE,
    doorstep_confirmation BOOLEAN DEFAULT FALSE,
    special_instructions TEXT,
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(10,2) DEFAULT 0.00,
    delivery_fee NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    order_status TEXT NOT NULL DEFAULT 'received' CHECK (order_status IN ('received', 'driver_assigned', 'picked_up', 'in_washing', 'out_for_delivery', 'delivered', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT NOT NULL DEFAULT 'credit_card',
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);

-- 9. ORDER PROOFS TABLE (Driver pickup & delivery photos)
CREATE TABLE IF NOT EXISTS public.order_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    proof_type TEXT NOT NULL CHECK (proof_type IN ('pickup_doorstep', 'processing_wash', 'delivery_doorstep')),
    photo_url TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. REVIEWS TABLE (Customer reviews with 3 photos & moderation)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_avatar TEXT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    photos JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

-- 11. FAQS AND TERMS & GUARANTEES TABLE
CREATE TABLE IF NOT EXISTS public.faqs_and_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('faq', 'term', 'guarantee')),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. SYSTEM SETTINGS TABLE (Business hours, delivery zones, minimum values)
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. USER SAVED ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.user_addresses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    label TEXT DEFAULT 'Home',
    street_address TEXT NOT NULL,
    apt_unit TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs_and_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- Permissive public policies for API client access
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN SELECT unnest(ARRAY['users', 'auth_otps', 'pricing_configs', 'plans', 'catalog_items', 'coupons', 'orders', 'order_proofs', 'reviews', 'faqs_and_terms', 'system_settings', 'user_addresses'])
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public read %s" ON public.%I', t, t);
        EXECUTE format('CREATE POLICY "Public read %s" ON public.%I FOR SELECT USING (true)', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Public insert %s" ON public.%I', t, t);
        EXECUTE format('CREATE POLICY "Public insert %s" ON public.%I FOR INSERT WITH CHECK (true)', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Public update %s" ON public.%I', t, t);
        EXECUTE format('CREATE POLICY "Public update %s" ON public.%I FOR UPDATE USING (true)', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Public delete %s" ON public.%I', t, t);
        EXECUTE format('CREATE POLICY "Public delete %s" ON public.%I FOR DELETE USING (true)', t, t);
    END LOOP;
END $$;

-- 14. SUPABASE STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('avatars', 'avatars', true),
    ('order-proofs', 'order-proofs', true),
    ('review-photos', 'review-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage object policies for CDN reads and uploads
DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars', 'order-proofs', 'review-photos'));

DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('avatars', 'order-proofs', 'review-photos'));

DROP POLICY IF EXISTS "Public Storage Delete" ON storage.objects;
CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE USING (bucket_id IN ('avatars', 'order-proofs', 'review-photos'));
