-- ==============================================================================
-- LAUNDRY EXPRESS: PRODUCTION DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- Document Ref: PLAN-LE-002
-- Features: 2-Role RBAC, Immutable Ledger, Moderated 3-Photo Reviews, Dynamic Pricing
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PRICING CONFIGS (Real-time admin price changes & slot capacity)
CREATE TABLE IF NOT EXISTS public.pricing_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pricing_type TEXT UNIQUE NOT NULL CHECK (pricing_type IN ('per_bag', 'per_kg')),
    unit_price NUMERIC(10,2) NOT NULL,
    min_order_quantity NUMERIC(10,2) DEFAULT 1.00,
    free_delivery_threshold NUMERIC(10,2) DEFAULT 2.00, -- e.g. 2 bags = free
    standard_delivery_fee NUMERIC(10,2) DEFAULT 10.00,
    max_orders_per_slot INT DEFAULT 15,
    is_active BOOLEAN DEFAULT TRUE,
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PACKAGES (Prepaid bundles & subscriptions)
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    package_type TEXT NOT NULL CHECK (package_type IN ('bag_bundle', 'weight_tier', 'subscription')),
    included_bags INT DEFAULT 0,
    included_kg NUMERIC(8,2) DEFAULT 0.00,
    price NUMERIC(10,2) NOT NULL,
    validity_days INT DEFAULT 60,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. USER PACKAGES (User balance ledger)
CREATE TABLE IF NOT EXISTS public.user_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES public.packages(id),
    remaining_bags INT DEFAULT 0,
    remaining_kg NUMERIC(8,2) DEFAULT 0.00,
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. PROMOTIONS & OFFERS (Coupon codes & hero banners)
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_delivery')),
    discount_value NUMERIC(10,2) NOT NULL,
    min_order_amount NUMERIC(10,2) DEFAULT 0.00,
    max_discount_amount NUMERIC(10,2),
    usage_limit_total INT,
    usage_limit_per_user INT DEFAULT 1,
    used_count INT DEFAULT 0,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    banner_image_url TEXT,
    is_banner_active BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. DETERGENTS
CREATE TABLE IF NOT EXISTS public.detergents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price_adjustment NUMERIC(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id),
    pricing_mode TEXT NOT NULL CHECK (pricing_mode IN ('per_bag', 'per_kg', 'package')),
    package_id UUID REFERENCES public.packages(id),
    detergent_id UUID NOT NULL REFERENCES public.detergents(id),
    bag_count INT DEFAULT 0,
    estimated_weight_kg NUMERIC(8,2),
    final_weight_kg NUMERIC(8,2),
    pickup_date DATE NOT NULL,
    pickup_slot TEXT NOT NULL CHECK (pickup_slot IN ('8am-12pm', '1pm-6pm')),
    delivery_date DATE,
    delivery_slot TEXT,
    subtotal NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0.00,
    promotion_id UUID REFERENCES public.promotions(id),
    delivery_fee NUMERIC(10,2) DEFAULT 0.00,
    tax_amount NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    is_out_of_home BOOLEAN DEFAULT FALSE,
    bag_outside_door_confirmed BOOLEAN DEFAULT FALSE,
    customer_notes TEXT,
    admin_notes TEXT,
    order_status TEXT NOT NULL DEFAULT 'pending' CHECK (
        order_status IN ('pending', 'confirmed', 'picked_up', 'in_wash', 'out_for_delivery', 'completed', 'cancelled')
    ),
    stripe_customer_id TEXT,
    stripe_payment_method_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT chk_pricing_mode_integrity CHECK (
        (pricing_mode = 'per_bag' AND bag_count >= 1) OR
        (pricing_mode = 'per_kg' AND (estimated_weight_kg > 0 OR final_weight_kg > 0)) OR
        (pricing_mode = 'package' AND package_id IS NOT NULL)
    )
);

-- 8. PAYMENTS (Immutable Financial Ledger)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_number TEXT UNIQUE NOT NULL,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id),
    provider TEXT NOT NULL DEFAULT 'stripe',
    provider_payment_id TEXT,
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method_type TEXT DEFAULT 'card',
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded', 'partially_refunded')),
    receipt_url TEXT,
    failure_reason TEXT,
    refunded_amount NUMERIC(10,2) DEFAULT 0.00,
    metadata JSONB DEFAULT '{}'::jsonb,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. ORDER PROOFS (Pickup & Drop-off imagery)
CREATE TABLE IF NOT EXISTS public.order_proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    proof_type TEXT NOT NULL CHECK (proof_type IN ('pickup', 'dropoff')),
    image_url TEXT NOT NULL,
    notes TEXT,
    uploaded_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. REVIEWS & RATINGS (Approval-gated)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID UNIQUE NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    moderated_by UUID REFERENCES public.users(id),
    moderation_note TEXT,
    moderated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. REVIEW PHOTOS (Strictly max 3 per review)
CREATE TABLE IF NOT EXISTS public.review_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    display_order INT NOT NULL CHECK (display_order BETWEEN 1 AND 3),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(review_id, display_order)
);

-- 12. ACTIVITY LOGS (Double-sided Audit Trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_role TEXT NOT NULL CHECK (user_role IN ('customer', 'admin', 'system')),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('order', 'payment', 'review', 'user', 'pricing', 'package', 'promotion')),
    entity_id UUID,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TRIGGER: Verify review eligibility (Only completed orders owned by user)
CREATE OR REPLACE FUNCTION public.verify_review_eligibility() RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.orders
        WHERE id = NEW.order_id
          AND user_id = NEW.user_id
          AND order_status = 'completed'
    ) THEN
        RAISE EXCEPTION 'Reviews are strictly permitted only for completed orders owned by the user.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_verify_review_eligibility ON public.reviews;
CREATE TRIGGER trg_verify_review_eligibility
    BEFORE INSERT ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.verify_review_eligibility();

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- SEED DATA
INSERT INTO public.pricing_configs (pricing_type, unit_price, min_order_quantity, free_delivery_threshold, standard_delivery_fee, max_orders_per_slot)
VALUES 
    ('per_bag', 15.00, 1.00, 2.00, 10.00, 15),
    ('per_kg', 2.75, 5.00, 40.00, 10.00, 15)
ON CONFLICT (pricing_type) DO NOTHING;

INSERT INTO public.packages (title, slug, description, package_type, included_bags, price, validity_days, is_featured)
VALUES 
    ('Superhero 5-Bag Bundle', '5-bag-bundle', 'Save $15 with 5 pre-paid bags. Never worry about delivery fees.', 'bag_bundle', 5, 65.00, 60, true),
    ('Monthly Family 25KG Plan', 'monthly-25kg', 'Ideal for busy families. Up to 25KG of wash & fold each month.', 'weight_tier', 0, 55.00, 30, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.promotions (code, title, discount_type, discount_value, min_order_amount, usage_limit_per_user, start_date, end_date, is_active)
VALUES 
    ('HEROFRESH', 'Welcome Superhero Discount', 'percentage', 15.00, 20.00, 1, now(), now() + interval '1 year', true),
    ('FREESHIP', 'Free Delivery Bonus', 'free_delivery', 10.00, 0.00, 1, now(), now() + interval '1 year', true)
ON CONFLICT (code) DO NOTHING;
