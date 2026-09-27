-- ==============================================================================
-- 004_DYNAMIC_DATA_SCHEMA.SQL
-- Creates and harmonizes tables for dynamic packages, pricing, catalog,
-- coupons, reviews, FAQs, terms, settings, and addresses.
-- ==============================================================================

-- 1. PACKAGES (Plans managed by admin)
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    unit_type TEXT NOT NULL DEFAULT 'bag' CHECK (unit_type IN ('bag', 'kg')),
    capacity NUMERIC(8,2) NOT NULL DEFAULT 1.00,
    original_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    discounted_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    key_points TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PRICING CONFIGS (Live per bag and per kg rates)
CREATE TABLE IF NOT EXISTS public.pricing_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pricing_type TEXT UNIQUE NOT NULL CHECK (pricing_type IN ('per_bag', 'per_kg')),
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 32.50,
    min_order_quantity NUMERIC(10,2) NOT NULL DEFAULT 1.00,
    max_order_quantity NUMERIC(10,2) NOT NULL DEFAULT 50.00,
    free_delivery_threshold NUMERIC(10,2) NOT NULL DEFAULT 2.00,
    standard_delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 10.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. DETERGENTS & TEMPERATURES CATALOG
CREATE TABLE IF NOT EXISTS public.detergents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'liquid' CHECK (type IN ('liquid', 'powder', 'pods')),
    brand TEXT NOT NULL DEFAULT 'Tide',
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wash_temperatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('cold', 'warm', 'hot')),
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. PROMOTIONS / COUPONS
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_delivery')),
    discount_value NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    min_order_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. FAQS & TERMS
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. USER ADDRESSES
CREATE TABLE IF NOT EXISTS public.user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Home',
    street_address TEXT NOT NULL,
    apt_unit TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detergents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wash_temperatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- Permissive public policies for reading active records
CREATE POLICY "Public packages read" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Public pricing read" ON public.pricing_configs FOR SELECT USING (true);
CREATE POLICY "Public detergents read" ON public.detergents FOR SELECT USING (true);
CREATE POLICY "Public wash temps read" ON public.wash_temperatures FOR SELECT USING (true);
CREATE POLICY "Public promotions read" ON public.promotions FOR SELECT USING (true);
CREATE POLICY "Public faqs read" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Public terms read" ON public.terms FOR SELECT USING (true);
CREATE POLICY "Public settings read" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Public addresses read" ON public.user_addresses FOR SELECT USING (true);
