-- ==============================================================================
-- LAUNDRY EXPRESS: SECURE DATABASE OTP REGISTRY
-- Migration 003: Dynamic email OTP persistence and verification
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.auth_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    otp_hash TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('change_password', 'reset_password')),
    attempts INT NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_otps_lookup ON public.auth_otps (email, purpose);

-- Enable Row Level Security
ALTER TABLE public.auth_otps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role access for auth_otps" ON public.auth_otps;
CREATE POLICY "Service role access for auth_otps" ON public.auth_otps
    FOR ALL USING (true) WITH CHECK (true);
