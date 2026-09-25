# 🚀 Laundry Express — Comprehensive Implementation Plan

**Project:** Laundry Express Web Application & Operations Platform  
**Document Ref:** PLAN-LE-002  
**Service Provider:** STRIX DEVS (*Modern Software Solutions*)  
**Client / Brand:** Laundry Express   
**Target Directory:** `D:\projects\laundry-express`  

---

## 1. System Architecture & Recommended Tech Stack

To ensure rapid delivery, high performance, real-time image uploads, and clean admin controls, the recommended architecture is:

* **Frontend:** Next.js (App Router) / React with Tailwind CSS & Lucide Icons (matching the existing Lovable UI styling).
* **Backend / API:** Next.js Server Actions / API Routes + Node.js runtime.
* **Database & Auth:** PostgreSQL via **Supabase** (or Prisma ORM with PostgreSQL / Supabase Auth).
  * *Why Supabase:* Built-in secure authentication, real-time database, and **Supabase Storage** for pickup/drop-off proof photo uploads with instant CDN URLs.
* **Payments:** Stripe (Stripe Checkout / Stripe Elements via `@stripe/stripe-js` & `stripe`).
* **Hosting & Deployment:** Vercel / Netlify with custom domain connection and SSL.

---

## 2. Database Schema Design (Enterprise-Grade & Optimized)

This production-grade PostgreSQL / Supabase schema is architected around **strict 2-role RBAC** (`customer` and `admin`), atomic **payment ledgering**, an **approval-gated 3-photo review system**, **dynamic bag/kg & package pricing**, and **full tamper-resistant audit logging**.

### 2.1 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ PAYMENTS : "makes"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ USER_PACKAGES : "owns"
    USERS ||--o{ ACTIVITY_LOGS : "triggers"

    PACKAGES ||--o{ USER_PACKAGES : "purchased_as"
    PACKAGES ||--o{ ORDERS : "applied_to"
    PROMOTIONS ||--o{ ORDERS : "redeemed_in"
    DETERGENTS ||--o{ ORDERS : "selected_in"

    ORDERS ||--o{ ORDER_PROOFS : "contains"
    ORDERS ||--|| PAYMENTS : "billed_under"
    ORDERS ||--o| REVIEWS : "generates"

    REVIEWS ||--o{ REVIEW_PHOTOS : "has_max_3"

    USERS {
        uuid id PK
        string email UK
        string full_name
        string phone
        string address
        string role "customer | admin"
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    PRICING_CONFIGS {
        uuid id PK
        string pricing_type "per_bag | per_kg"
        decimal unit_price "e.g. $15.00/bag or $3.50/kg"
        decimal min_order_quantity "e.g. 1 bag or 5 kg"
        decimal free_delivery_threshold "e.g. 2 bags or $40"
        decimal standard_delivery_fee "e.g. $10.00"
        int max_orders_per_slot "default 15 to prevent van overbooking"
        boolean is_active
        uuid updated_by FK
        datetime updated_at
    }

    PACKAGES {
        uuid id PK
        string title "e.g. Saver 5-Bag Pack, 25KG Student Bundle"
        string slug UK
        string description
        string package_type "bag_bundle | weight_tier | subscription"
        int included_bags "e.g. 5"
        decimal included_kg "e.g. 25.00"
        decimal price "discounted bundle price"
        int validity_days "e.g. 30, 60, 90"
        boolean is_featured
        boolean is_active
        datetime created_at
    }

    USER_PACKAGES {
        uuid id PK
        uuid user_id FK
        uuid package_id FK
        int remaining_bags
        decimal remaining_kg
        datetime expires_at
        boolean is_active
        datetime created_at
    }

    PROMOTIONS {
        uuid id PK
        string code UK "e.g. FRESH20, SUMMERFREE"
        string title
        string discount_type "percentage | fixed_amount | free_delivery"
        decimal discount_value
        decimal min_order_amount
        decimal max_discount_amount
        int usage_limit_total
        int usage_limit_per_user
        int used_count
        datetime start_date
        datetime end_date
        string banner_image_url
        boolean is_banner_active
        boolean is_active
    }

    DETERGENTS {
        uuid id PK
        string name "Tide Pods, Eco-Friendly, Fragrance-Free"
        string description
        boolean is_active
        decimal price_adjustment "default 0.00"
        datetime created_at
    }

    ORDERS {
        uuid id PK
        string order_number UK "e.g. LX-2026-0001"
        uuid user_id FK
        string pricing_mode "per_bag | per_kg | package"
        uuid package_id FK "nullable"
        uuid detergent_id FK
        int bag_count "default 0"
        decimal estimated_weight_kg "nullable"
        decimal final_weight_kg "nullable"
        date pickup_date
        string pickup_slot "8am-12pm | 1pm-6pm"
        date delivery_date "nullable"
        string delivery_slot "nullable"
        decimal subtotal
        decimal discount_amount
        uuid promotion_id FK "nullable"
        decimal delivery_fee
        decimal tax_amount
        decimal total_amount
        boolean is_out_of_home
        boolean bag_outside_door_confirmed
        string customer_notes
        string admin_notes
        string order_status "pending | confirmed | picked_up | in_wash | out_for_delivery | completed | cancelled"
        string stripe_customer_id "saved for off-session weigh-in billing"
        string stripe_payment_method_id "saved card token for secondary capture"
        datetime created_at
        datetime updated_at
    }

    PAYMENTS {
        uuid id PK
        string payment_number UK "e.g. PAY-2026-0001"
        uuid order_id FK
        uuid user_id FK
        string provider "stripe | cash_on_delivery | package_credit"
        string provider_payment_id "Stripe PaymentIntent / Session ID"
        decimal amount
        string currency "USD"
        string payment_method_type "card | apple_pay | google_pay | cash"
        string status "pending | processing | succeeded | failed | refunded"
        string receipt_url
        string failure_reason
        decimal refunded_amount
        jsonb metadata "gateway response & fee breakdown"
        datetime paid_at
        datetime created_at
        datetime updated_at
    }

    ORDER_PROOFS {
        uuid id PK
        uuid order_id FK
        string proof_type "pickup | dropoff"
        string image_url
        string notes
        uuid uploaded_by FK
        datetime created_at
    }

    REVIEWS {
        uuid id PK
        uuid order_id UK FK "1 review per completed order"
        uuid user_id FK
        int rating "1 to 5"
        string comment
        string status "pending | approved | rejected"
        uuid moderated_by FK "admin user id"
        string moderation_note
        datetime moderated_at
        datetime created_at
        datetime updated_at
    }

    REVIEW_PHOTOS {
        uuid id PK
        uuid review_id FK
        string photo_url
        int display_order "1, 2, or 3 (max 3 per review)"
        datetime created_at
    }

    ACTIVITY_LOGS {
        uuid id PK
        uuid user_id FK "nullable for system operations"
        string user_role "customer | admin | system"
        string action "e.g. auth.login, order.created, payment.succeeded, review.approved"
        string entity_type "order | payment | review | user | pricing | package | promotion"
        uuid entity_id "nullable"
        string description "Human-readable event summary"
        jsonb metadata "diffs, IP address, user agent, snapshots"
        string ip_address
        string user_agent
        datetime created_at
    }
```

---

### 2.2 Table Specifications & Data Integrity Rules

#### 1. `users` (Strict 2-Role System)
* **Columns:**
  * `id` (UUID, PK, references `auth.users.id` ON DELETE CASCADE)
  * `email` (TEXT, UNIQUE, NOT NULL)
  * `full_name` (TEXT, NOT NULL)
  * `phone` (TEXT)
  * `address` (TEXT)
  * `role` (TEXT, NOT NULL, DEFAULT `'customer'`, `CHECK (role IN ('customer', 'admin'))`)
  * `is_active` (BOOLEAN, DEFAULT TRUE)
  * `created_at` (TIMESTAMPTZ, DEFAULT `now()`), `updated_at` (TIMESTAMPTZ, DEFAULT `now()`)
* **Security:** Role escalations restricted: only an existing `admin` can mutate `role`.

#### 2. `pricing_configs` & `packages` (Dynamic Bag, Per-KG & Bundles)
* **`pricing_configs`:** Allows Admin to change bag prices and per-kg rates in real-time without code deployments.
  * `pricing_type`: `'per_bag' | 'per_kg'` (UNIQUE active per type).
  * `unit_price`: Numeric rate (e.g., $15.00/bag or $2.75/kg).
  * `min_order_quantity`: Enforces minimum bags or minimum billable KG (e.g. 5 kg min).
  * `free_delivery_threshold`: Threshold for free shipping (e.g., 2 bags or $35.00).
  * `standard_delivery_fee`: Base delivery charge when below threshold (e.g., $10.00).
* **`packages`:** Fixed or subscription-based offerings (e.g., "5 Bags Saver Plan", "Monthly 30KG Family Tier"):
  * `included_bags` (INT) or `included_kg` (NUMERIC) credited to customer upon purchase.
* **`user_packages`:** Ledger of user credits deducted on each package order.

#### 3. `promotions` (Offers, Discount Codes & Hero Banners)
* Supports promo codes (`discount_type IN ('percentage', 'fixed_amount', 'free_delivery')`).
* Admin can publish dynamic promotional announcement banners (`banner_image_url`, `is_banner_active`, `start_date`, `end_date`).
* Tracks `usage_limit_total` and `usage_limit_per_user` to prevent coupon abuse.

#### 4. `orders` (Multi-Model Billing & Status Pipeline)
* **`order_number`:** Sequential, business-friendly order code (e.g., `LX-2026-0042`).
* **`pricing_mode`:** Enforces mode: `'per_bag'`, `'per_kg'`, or `'package'`.
* **Per-KG Weight Flow:**
  * Customer submits with `estimated_weight_kg`.
  * After pickup and laundry intake, Admin enters verified `final_weight_kg`.
* **State Machine:**
  * `pending` ➔ `confirmed` ➔ `picked_up` ➔ `in_wash` ➔ `out_for_delivery` ➔ `completed` (or `cancelled`).
* **Integrity Constraints:**
  * Review creation is locked until `order_status = 'completed'`.

#### 5. `payments` (Immutable Payment Ledger)
* Every financial transaction is recorded with provider reference (Stripe `PaymentIntent` / `CheckoutSession`), payment method, full fee breakdown in `metadata` (JSONB), and refund tracking.
* **Status Enum:** `'pending'`, `'processing'`, `'succeeded'`, `'failed'`, `'refunded'`, `'partially_refunded'`.
* Automatically synchronized via Stripe Webhooks with replay-attack protection (idempotency key verification).

#### 6. `order_proofs` (Proof-of-Service Validation & Data Privacy Policy)
* **File Validation Rules:**
  * Strict MIME verification: only `image/jpeg`, `image/png`, `image/webp` permitted.
  * Size limitation: Strict maximum **5MB per photo** enforced at both client file picker and Supabase Storage upload policies.
* **Sensitive Data & Retention Policy:**
  * Pickup and drop-off photos contain customer residence imagery, doorways, and private property.
  * **Access Restriction:** Signed temporary URLs or authenticated-only access (restricted strictly to the customer who owns the order and authenticated administrators). Public read is disabled.
  * **Retention & Deletion Policy:** Automated cron job (or Supabase pg_cron) archives/purges image blobs 90 days after `order_status = 'completed'`, retaining metadata logs while minimizing long-term liability and storage overhead.

#### 7. `reviews` & `review_photos` (Admin Moderation & Max 3 Photos)
* **1 Review per Completed Order:** `UNIQUE(order_id)` constraint prevents duplicate submissions.
* **Database Check:** Review can only be created if `orders.order_status = 'completed'` and `orders.user_id = auth.uid()`.
* **Moderation Pipeline:**
  * Default `status = 'pending'`.
  * Invisible to public until an Admin reviews and sets `status = 'approved'`.
  * Admins can reject with an internal/external `moderation_note`.
* **`review_photos` Table:**
  * Linked to review via `review_id`.
  * Storage constraint: DB trigger & API validation strictly enforces **maximum 3 photos per review** (`display_order BETWEEN 1 AND 3`).
  * Uploaded to secure Supabase storage bucket `review-photos` with image MIME validation and size limits (max 5MB/photo).

#### 8. `activity_logs` (Universal Audit Trail & History Tracking)
* **Double-Sided Visibility:**
  * **Admin View:** Complete platform audit log (user registrations, logins, orders, price updates, package creation, promo creation, refund issuances, review approvals).
  * **Customer View:** Filtered view where `user_id = auth.uid()` displaying their timeline (orders created, payments confirmed, laundry washed, reviews posted).
* **Columns:**
  * `action`: Namespaced event string (e.g. `'order.status_changed'`, `'pricing.updated'`, `'review.approved'`).
  * `entity_type` & `entity_id`: Direct relational reference to the target record.
  * `metadata`: JSONB containing before/after diffs, client IP address, and browser User-Agent.

---

### 2.3 Row Level Security (RLS) & Security Policies

| Table | Customer Policy | Admin Policy | Public / Anonymous |
| :--- | :--- | :--- | :--- |
| **`users`** | Read & update own profile (`id = auth.uid()`) | Full CRUD across all user records | None |
| **`pricing_configs`** | Read-only for active pricing | Full CRUD (modify unit prices, bag fees) | Read active pricing |
| **`packages`** | Read active packages | Full CRUD (create, update, archive) | Read active packages |
| **`promotions`** | Read active codes & banners | Full CRUD (create offers, toggle banners) | Read active banners |
| **`orders`** | Read own orders; Insert new order with `user_id = auth.uid()` | Full CRUD (modify status, adjust weights, notes) | None |
| **`payments`** | Read-only own payments (`user_id = auth.uid()`) | Full Read & Refund dispatch | Webhook service role only |
| **`order_proofs`** | Read-only proofs for own orders | Full CRUD (upload pickup & drop-off photos) | None |
| **`reviews`** | Create & read own reviews (only for completed orders) | Full CRUD (approve, reject, delete) | Read approved reviews only (`status = 'approved'`) |
| **`review_photos`** | Insert up to 3 photos on own pending review | Full CRUD | Read photos of approved reviews |
| **`activity_logs`** | Read-only own logs (`user_id = auth.uid()`) | Read all platform logs + filter by user/entity | None (Insert via service role / triggers) |

---

## 3. Step-by-Step Implementation Roadmap

### Phase 1: Foundation, RBAC Auth, Security & Enterprise Database (Days 1–2)
1. **Next.js & Supabase Architecture:**
   * Next.js 14+ (App Router) + TypeScript + Tailwind CSS + shadcn/ui.
   * Supabase Client & Server helper integration with SSR cookie handling.
2. **Schema Migration & RLS Deployment:**
   * Execute migration scripts for all 10 core tables (`users`, `pricing_configs`, `packages`, `user_packages`, `promotions`, `detergents`, `orders`, `payments`, `order_proofs`, `reviews`, `review_photos`, `activity_logs`).
   * Apply strict PostgreSQL triggers:
     * Enforce max 3 photos per review.
     * Enforce review submission only on `order_status = 'completed'`.
     * Audit log automation trigger on order status and pricing updates.
3. **Authentication, Admin MFA & Rate Limiting:**
   * Customer onboarding (Magic link / Password auth).
   * **Admin Multi-Factor Authentication (MFA / 2FA):** Mandatory TOTP-based 2FA (via Supabase Auth MFA / authenticator apps like Google Authenticator) for all users with `role = 'admin'` before accessing `/admin/*` routes.
   * **API Rate Limiting & Abuse Prevention:** Upstash Redis / Vercel Edge rate limiting middleware applied to:
     * `/api/auth/*` (Login/Signup): Max 5 requests/minute per IP to prevent credential stuffing & brute-force attacks.
     * `/api/orders/create` & promo validation: Max 10 requests/minute per user/IP to prevent bot spam and promo code enumeration.
   * Middleware route protection:
     * `/admin/*` protected by verified `role = 'admin'` server check AND validated MFA session token.
     * `/dashboard/*` protected for authenticated customers.

---

### Phase 2: Dynamic Pricing Engine, Packages & Offers (Days 3–4)
1. **Admin Pricing Control Center:**
   * Real-time controls to set per-bag price, per-kg price, delivery fee thresholds, and rush surcharges.
   * Package creator: Define package title, type (bag bundle or KG tier), price, and validity duration.
2. **Promotions & Offers Hub:**
   * Coupon code manager (percentage, dollar discount, free delivery) with redemption limits and expiry.
   * Banner promotional manager: Upload promotional hero banners with active/inactive toggles.
3. **Interactive Booking Engine with Multi-Mode Pricing:**
   * Toggle between **By the Bag**, **By Weight (Per KG)**, and **Pre-paid Packages**.
   * Live pricing preview: client UI calculates bags, weight estimates, delivery fee rules ($10 for 1 bag, $0 for 2+ bags or over threshold), and promo discounts for user display.
   * Out-of-Home verification checkbox and slot picker (`8:00 AM – 12:00 PM` or `1:00 PM – 6:00 PM`).

---

### Phase 3: Stripe Payments, Server-Side Pricing & Webhook Security (Days 5–6)
1. **Mandatory Server-Side Price Calculation (Zero-Trust Client Pricing):**
   * **Strict Rule:** The client never dictates or submits `total_amount` or `delivery_fee` to create a Stripe payment.
   * Client sends only raw inputs: `bag_count`, `pricing_mode`, `detergent_id`, `package_id`, and optional `promo_code`.
   * The server independently queries `pricing_configs`, `detergents`, and `promotions` from the database, validates active status and usage limits, computes `total_amount` in cents server-side, and creates the Stripe `PaymentIntent` / `CheckoutSession`.
   * Prevents client-side manipulation of prices, fees, or promo discounts.
2. **Stripe Checkout & PaymentIntent Integration:**
   * Seamless embedded checkout supporting Credit/Debit Cards, Apple Pay, and Google Pay.
   * Support for upfront bag payments, per-kg deposit with secondary weigh-in adjustment, and package upfront purchase.
3. **Cryptographic Webhook Signature Verification & Ledger Sync:**
   * **Stripe-Signature Header Validation:** Every incoming webhook request body is verified against the endpoint's `STRIPE_WEBHOOK_SECRET` using `stripe.webhooks.constructEvent(rawBody, signature, secret)`. Requests with invalid or missing signatures are rejected immediately with HTTP 400.
   * **Idempotency Protection:** Checks if event ID or `provider_payment_id` already exists in `payments` to guarantee replay attack prevention.
   * Writes immutable record into `payments` table upon `payment_intent.succeeded`.
   * Automatically generates `activity_logs` entry for both customer and admin audit streams.

---

### Phase 4: Proof-of-Service & Review Moderation (Days 7–8)
1. **Visual Proof-of-Service (Validation & Privacy):**
   * Camera/photo upload for pickup & drop-off proof directly from admin/mobile interface.
   * File validation: Max 5MB, strict MIME check (`image/jpeg`, `image/png`, `image/webp`).
   * Privacy & retention: Stored in private Supabase `proof-images` bucket with signed temporary URLs. Automated 90-day retention/purge policy after order completion.
   * Synced in real-time to both customer order tracker and admin dashboard.
2. **Post-Order Review & Rating System:**
   * Gated review form appears in customer portal once `order_status = 'completed'`.
   * 1 to 5 star rating, detailed feedback text, and multi-file uploader (strictly limited to **maximum 3 photos** with live previews and client-side compression).
   * Stored in `reviews` and `review_photos` as `status = 'pending'`.
3. **Admin Review Moderation Panel:**
   * Pending review queue with photo preview modal.
   * 1-click **Approve** (publishes to public testimonial carousel) or **Reject** with optional note.
   * Action logged in `activity_logs`.

---

### Phase 5: Activity Logs, Admin Back-Office & Customer Portal (Days 9–10)
1. **Customer Activity History:**
   * Dedicated `/dashboard/activity` view showing customer's chronological event feed (Account created, Order placed, Payment confirmed, Pickup proof uploaded, Order completed, Review approved).
2. **Admin Command Center & Master Activity Audit:**
   * High-level analytics: Revenue, order volume, active packages, popular detergents.
   * Master Activity Log with search and filters by user, action category, and date range.
   * Weight adjustment dialog for per-kg orders with automatic customer notification.
   * Customer CRM: Search users, view lifetime value (LTV), order frequency, and active package balances.

---

### Phase 6: Hardening, Disaster Recovery, Deployment & 30-Day Support (Days 11–12)
1. **Database Backup & Disaster Recovery (DR) Plan:**
   * **Automated Daily Backups:** Configure Supabase automated daily backups with Point-in-Time Recovery (PITR) enabled.
   * **Disaster Recovery Playbook:** Documented restoration procedure for database schemas, ledger records, and Supabase Storage bucket snapshots to ensure near-zero data loss on financial and order data.
2. **Testing & QA Verification:**
   * Stripe end-to-end payment flows, webhooks signature tampering tests, refunds, and dispute recovery testing.
   * Rate limiting verification on auth endpoints and order creation routes.
   * Server-side pricing tamper tests (tampered payload verification).
   * Review submission gate check (ensuring only completed orders can submit, with maximum 3 photos).
   * Activity log integrity audit (ensuring both customer isolation and admin global view).
   * Mobile-responsive performance testing (iOS Safari, Android Chrome).
3. **Production Hosting & Deployment:**
   * Deploy frontend and API to production hosting (Vercel / Supabase).
   * Connect custom domain with automated SSL.
   * Configure production Stripe API keys, webhook signing secrets, and Supabase Storage bucket CORS / security headers.
4. **Commence 30-Day Free Maintenance:**
   * Client handover walkthrough and administrative orientation.
   * 30 calendar days of complimentary priority bug fixes, live uptime monitoring, and query performance tuning.

---

## 4. Modular File Structure & Clean Architecture (100–250 Line Rule)

To prevent code bloat, technical debt, and ensure supreme maintainability, all files across the project are governed by the **Strict 100–250 Line Rule**:
* **Single Responsibility Principle:** Every file (component, hook, action, or service) must serve one dedicated purpose.
* **Line Count Cap:** Target 100–180 lines; hard ceiling of **250 lines max per file**. Any file approaching 220+ lines must be decomposed into sub-components, custom hooks, or utility helpers.
* **Component Reusability:** Every page is composed strictly of reusable UI primitives (`/components/ui`), shared feature molecules (`/components/shared`), and domain organisms (`/components/booking`, `/components/admin`, etc.).

### 4.1 Project Directory Tree

```
laundry-express/
├── .env.example                       # Documented environment variables
├── .eslintrc.json                     # Code quality and line complexity rules
├── next.config.mjs                    # Next.js configuration (images, security headers)
├── package.json                       # Dependencies (Next.js, Tailwind, Lucide, Supabase, Stripe)
├── postcss.config.mjs                 # PostCSS setup
├── tailwind.config.ts                 # Custom brand theme matching superhero mascot
├── tsconfig.json                      # Strict TypeScript settings
├── public/                            # Static assets
│   ├── brand/                         # Mascot and badge logo assets
│   │   ├── mascot-superhero.webp      # Bubble superhero mascot with cape
│   │   ├── logo-badge.webp            # Vibrant badge logo
│   │   ├── favicon.ico
│   │   └── og-image.jpg               # OpenGraph 1200x630 social preview
│   ├── llms.txt                       # Machine/LLM-readable site manifest & services
│   └── robots.txt                     # Crawler directives (also via robots.ts)
├── src/
│   ├── app/                           # Next.js App Router (Pages & API routes)
│   │   ├── layout.tsx                 # Root layout (< 150 lines: fonts, providers, metadata)
│   │   ├── page.tsx                   # Landing page (< 180 lines: compositions of hero, features, reviews)
│   │   ├── sitemap.ts                 # Dynamic XML sitemap generator (< 80 lines)
│   │   ├── robots.ts                  # Dynamic robots.txt generator (< 40 lines)
│   │   ├── (auth)/                    # Customer & Admin Auth flows
│   │   │   ├── login/page.tsx         # Login page (< 120 lines)
│   │   │   ├── signup/page.tsx        # Customer signup (< 140 lines)
│   │   │   └── admin-mfa/page.tsx     # Admin TOTP 2FA challenge (< 130 lines)
│   │   ├── (customer)/dashboard/      # Authenticated Customer Portal
│   │   │   ├── layout.tsx             # Customer dashboard layout with sidebar (< 110 lines)
│   │   │   ├── page.tsx               # Active orders & quick reorder (< 160 lines)
│   │   │   ├── orders/[id]/page.tsx   # Order tracker + proofs + review dialog (< 180 lines)
│   │   │   ├── packages/page.tsx      # Active package balance & purchase (< 150 lines)
│   │   │   └── activity/page.tsx      # Customer personal activity timeline (< 130 lines)
│   │   ├── admin/                     # Protected Admin Operations Panel
│   │   │   ├── layout.tsx             # Admin shell with secure navigation & MFA status (< 140 lines)
│   │   │   ├── page.tsx               # Live pipeline & revenue metrics (< 170 lines)
│   │   │   ├── orders/page.tsx        # Filterable order board & proof upload modal (< 190 lines)
│   │   │   ├── pricing/page.tsx       # Real-time bag/kg price & package editor (< 180 lines)
│   │   │   ├── reviews/page.tsx       # Review moderation queue with photo preview (< 170 lines)
│   │   │   ├── promotions/page.tsx    # Coupon code & hero banner manager (< 160 lines)
│   │   │   ├── detergents/page.tsx    # Detergent catalog CRUD (< 140 lines)
│   │   │   └── audit-logs/page.tsx    # Universal audit trail viewer (< 170 lines)
│   │   └── api/                       # API Route Handlers (Rate-limited & validated)
│   │       ├── auth/route.ts          # Auth helper (< 110 lines)
│   │       ├── orders/create/route.ts # Server-side price calculation & order draft (< 190 lines)
│   │       ├── checkout/route.ts      # Stripe PaymentIntent / Session generator (< 180 lines)
│   │       ├── webhooks/stripe/route.ts# Cryptographic signature verification & ledger sync (< 200 lines)
│   │       └── reviews/route.ts       # Review submission (< 150 lines)
│   │
│   ├── components/                    # Modular Reusable Component Hierarchy
│   │   ├── ui/                        # Reusable Atomic Design Primitives (shadcn/ui customized)
│   │   │   ├── button.tsx             # Standard buttons with mascot glow & active states (< 90 lines)
│   │   │   ├── badge.tsx              # Status badges (pending, completed, paid) (< 70 lines)
│   │   │   ├── card.tsx               # Glassmorphic and bordered container cards (< 80 lines)
│   │   │   ├── dialog.tsx             # Modals (proofs preview, photo picker) (< 120 lines)
│   │   │   ├── input.tsx              # Form inputs with floating labels (< 75 lines)
│   │   │   ├── select.tsx             # Custom select dropdowns (< 95 lines)
│   │   │   ├── tabs.tsx               # Tabbed interfaces for order stages (< 90 lines)
│   │   │   └── toast.tsx              # Toast alert notifications (< 100 lines)
│   │   ├── shared/                    # Reusable Global Components
│   │   │   ├── site-header.tsx        # Header with mascot emblem & auth toggle (< 160 lines)
│   │   │   ├── site-footer.tsx        # SEO-rich semantic footer with opening hours (< 150 lines)
│   │   │   ├── mascot-badge.tsx       # Mascot illustration & animated bubble speech (< 120 lines)
│   │   │   ├── promo-banner.tsx       # Global dismissible top promotional bar (< 110 lines)
│   │   │   ├── empty-state.tsx        # Friendly empty state graphic & call to action (< 85 lines)
│   │   │   └── page-container.tsx     # Standard responsive container with padding (< 60 lines)
│   │   ├── booking/                   # Interactive Customer Booking Step Components
│   │   │   ├── booking-stepper.tsx    # Wizard progress navigator (< 110 lines)
│   │   │   ├── step-pricing-mode.tsx  # Bag vs. Per-KG vs. Package selector (< 170 lines)
│   │   │   ├── step-bag-counter.tsx   # Quantity stepper ($10 for 1 bag, Free for 2+) (< 140 lines)
│   │   │   ├── step-weight-calc.tsx   # Per-kg estimator & scale guide (< 130 lines)
│   │   │   ├── step-slot-picker.tsx   # 8am-12pm & 1pm-6pm operational slot selector (< 150 lines)
│   │   │   ├── step-detergent.tsx     # Dynamic detergent cards (< 130 lines)
│   │   │   ├── step-out-of-home.tsx   # Doorstep presence radio & bag confirmation (< 120 lines)
│   │   │   ├── order-summary-card.tsx # Live calculation card with promo code input (< 180 lines)
│   │   │   └── stripe-payment-box.tsx # Embedded Stripe Elements payment card (< 190 lines)
│   │   ├── proofs/                    # Visual Proof-of-Service Components
│   │   │   ├── proof-uploader.tsx     # Camera snapshot / image picker with 5MB & MIME validation (< 170 lines)
│   │   │   ├── proof-gallery.tsx      # Dual pickup & drop-off comparison card (< 140 lines)
│   │   │   └── proof-modal.tsx        # Fullscreen signed image viewer with zoom (< 130 lines)
│   │   ├── reviews/                   # Post-Order Review Components
│   │   │   ├── review-form.tsx        # Rating stars + text + 3-photo uploader (< 190 lines)
│   │   │   ├── review-card.tsx        # Testimonial card with approved photo carousel (< 130 lines)
│   │   │   ├── star-rating.tsx        # Interactive 1-5 star selector (< 80 lines)
│   │   │   └── photo-multi-upload.tsx # Drag & drop uploader strictly capped at 3 photos (< 170 lines)
│   │   ├── admin/                     # Administrative Management Components
│   │   │   ├── order-table.tsx        # Filterable data grid with status chips (< 200 lines)
│   │   │   ├── order-detail-modal.tsx # Order inspector with customer notes & proofs (< 220 lines)
│   │   │   ├── weight-intake-dialog.tsx# Final KG intake scale input & price reconciler (< 140 lines)
│   │   │   ├── pricing-editor-card.tsx# Live bag and kg rate modifier (< 160 lines)
│   │   │   ├── package-modal.tsx      # Create/edit package bundle modal (< 180 lines)
│   │   │   ├── promo-code-table.tsx   # Coupon discount rules & limits manager (< 170 lines)
│   │   │   └── review-moderator-card.tsx # Approve / Reject cards with inline photos (< 160 lines)
│   │   └── activity/                  # Activity Timeline Components
│   │       ├── timeline-feed.tsx      # Chronological event list (< 160 lines)
│   │       └── timeline-item.tsx      # Individual action card with badge & timestamp (< 110 lines)
│   │
│   ├── lib/                           # Core Utilities, Services & Configurations
│   │   ├── supabase/                  # Supabase clients
│   │   │   ├── client.ts              # Browser client with auth state listener (< 60 lines)
│   │   │   ├── server.ts              # Server client with secure cookie handling (< 70 lines)
│   │   │   └── middleware.ts          # Auth session refresh & role guard middleware (< 110 lines)
│   │   ├── stripe/                    # Stripe integrations
│   │   │   ├── client.ts              # Stripe SDK initialization (< 40 lines)
│   │   │   └── pricing-calc.ts        # Server-side pricing engine & discount calculator (< 180 lines)
│   │   ├── security/                  # Rate limiting & verification
│   │   │   ├── rate-limiter.ts        # Upstash Redis token-bucket limiter (< 100 lines)
│   │   │   └── file-validator.ts      # MIME & 5MB file verification utility (< 90 lines)
│   │   ├── seo/                       # SEO & Structured Data (JSON-LD) Generators
│   │   │   ├── meta-builder.ts        # Dynamic OpenGraph, title & description builder (< 120 lines)
│   │   │   └── jsonld-schemas.ts      # LocalBusiness, Service, Review & FAQ schemas (< 190 lines)
│   │   ├── utils.ts                   # Class merge (cn), currency formatters, date formatters (< 90 lines)
│   │   └── constants.ts               # Slots (8am-12pm, 1pm-6pm), statuses, brand colors (< 80 lines)
│   │
│   ├── types/                         # Strict TypeScript Type Definitions
│   │   ├── database.ts                # Auto-generated Supabase database schema types (< 240 lines)
│   │   ├── order.ts                   # Order, bag calculation, and slot interfaces (< 130 lines)
│   │   ├── pricing.ts                 # Pricing modes, packages, and promo interfaces (< 120 lines)
│   │   ├── review.ts                  # Review, rating, and photo interfaces (< 80 lines)
│   │   └── activity.ts                # Activity log and audit interfaces (< 70 lines)
│   │
│   └── hooks/                         # Reusable Custom React Hooks
│       ├── use-booking.ts             # Booking wizard state machine (< 180 lines)
│       ├── use-user.ts                # Current user profile & role session hook (< 90 lines)
│       ├── use-pricing.ts             # Client-side price estimation hook (< 120 lines)
│       └── use-photo-upload.ts        # Pre-upload photo compression & thumbnail hook (< 150 lines)
```

---

### 4.2 Strict Single Iconography Standard: `lucide-react` Exclusively

To ensure uniform aesthetic consistency, zero icon mismatch, and optimal tree-shaking, the application enforces **ONE and only ONE icon library: `lucide-react`**.
* **Zero Exceptions:** No importing from `react-icons`, `@heroicons/react`, `font-awesome`, or pasting random raw inline SVGs.
* **Uniform Styling Standard:**
  * Default icon stroke width: `strokeWidth={1.85}` for a sleek, contemporary feel.
  * Standard sizes: `h-4 w-4` (inline chips/buttons), `h-5 w-5` (navigation/actions), `h-6 w-6` (cards/features), `h-8 w-8` (hero badges/empty states).
* **Icon Mapping to Mascot & Brand Concepts:**
  * **Laundry & Cleanliness:** `Sparkles`, `Waves`, `Shirt`, `Wind`, `Sun`, `Droplets`
  * **Bags, Weight & Measurement:** `ShoppingBag`, `Scale`, `Package`, `Boxes`
  * **Speed & Super Delivery:** `Zap`, `Clock`, `Truck`, `Calendar`, `MapPin`
  * **Proof & Security:** `Camera`, `ShieldCheck`, `Lock`, `KeyRound`, `Eye`
  * **Customer Care & Ratings:** `Star`, `Heart`, `ThumbsUp`, `MessageSquareHeart`, `CheckCircle2`
  * **Admin & Finance:** `CreditCard`, `Receipt`, `DollarSign`, `Activity`, `FileText`, `SlidersHorizontal`

---

## 5. Visual Design System & Mascot/Brand Alignment

The visual design is grounded directly in the energetic personality of the **"Bubble Hero" Mascot & Badge Logo**:

### 5.1 Color Palette & Token Hierarchy
* **Primary — Electric Laundry Blue (`#0284C7` / `#0369A1`):** Represents speed, crystal-clear water, and professional hygiene.
* **Accent — Hero Cape Coral Red (`#EF4444` / `#F43F5E`):** Carries the vibrant cape accent from the mascot for primary call-to-actions, urgent order alerts, and badges.
* **Highlight — Amber Gold (`#F59E0B`):** Reflects the superhero boots and gloves for 5-star ratings, premium packages, and VIP badges.
* **Surface — Crisp Foam White (`#F8FAFC` / `#FFFFFF`):** High-contrast, clean laundry cleanliness with subtle blue-tinted shadows (`rgba(2, 132, 199, 0.08)`).
* **Dark Contrast — Midnight Navy (`#0F172A` / `#1E293B`):** Deep grounding tone for sharp typography, high accessibility, and premium admin dashboard modes.

### 5.2 Micro-Interactions & Aesthetic Accents
* **Floating Bubble Motion:** Subtle CSS keyframe float on the mascot badge in the hero header.
* **Glossy Glassmorphism:** Order tracking cards and pricing tiles use `backdrop-blur-md bg-white/80 border border-sky-100 shadow-sm`.
* **Playful Superhero Badges:** Pill-shaped badges with cheerful micro-copy (e.g., *"⚡ 2+ Bags = Free Superhero Delivery!"*).
* **Typography:** `Plus Jakarta Sans` or `Outfit` for bold, friendly headings paired with `Inter` for hyper-readable data tables and order tracking text.

---

## 6. SEO & LLM-Friendliness Architecture

### 6.1 SEO Architecture (Search Engine Optimization)
1. **Semantic HTML5 Foundation:**
   * Single `<h1>` per page with strictly structured heading hierarchies (`<h2>` sections, `<h3>` sub-features).
   * Valid HTML5 semantic containers (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`).
   * Explicit `alt` attributes and optimized aspect ratios on every image (mascot, detergents, proof previews).
2. **Metadata API & Social Cards:**
   * Dynamically generated `<title>` and `<meta name="description">` on all marketing and customer pages via Next.js `generateMetadata`.
   * OpenGraph & Twitter Card images (1200x630px) featuring the mascot and clear value proposition (*"Professional Laundry Delivery from $10 — Pickup to Doorstep in 24 Hours"*).
3. **Automated XML Sitemap & Robots Directive:**
   * `src/app/sitemap.ts`: Dynamic generator indexing all public routes, package landing pages, and service areas.
   * `src/app/robots.ts`: Instructs search bots while disallowing private admin routes (`/admin/*`) and customer dashboards (`/dashboard/*`).
4. **Core Web Vitals Optimization:**
   * Zero cumulative layout shift (CLS) via `next/font` local font swapping.
   * Instant Largest Contentful Paint (LCP) with priority-loaded hero assets.

### 6.2 LLM & AI Agent Readability (Structured Microdata)
Modern search discovery (ChatGPT Search, Perplexity AI, Google Gemini / AI Overviews) relies on structured machine-readable knowledge:

1. **Schema.org JSON-LD Microdata (`src/lib/seo/jsonld-schemas.ts`):**
   * **`DryCleaningOrLaundryService` / `LocalBusiness`:**
     * Complete operational hours: `[{"opens": "08:00", "closes": "12:00"}, {"opens": "13:00", "closes": "18:00"}]`.
     * Exact service catalog with geocoded delivery radius.
     * Price range (`$`), telephone, accepted payment methods (`Credit Card, Apple Pay, Google Pay`).
   * **`Offer` & `PriceSpecification`:**
     * Plainly declares pricing logic: 1 bag = $10.00 delivery fee; $\ge 2$ bags = $0.00 (Free delivery).
     * Per-KG pricing rates and package bundle savings.
   * **`AggregateRating` & `Review`:**
     * Aggregates only admin-approved customer reviews with 1–5 star ratings and verification timestamps.
   * **`FAQPage` Schema:**
     * Structured Q&A addressing customer questions (e.g., *"What if I am away from home?"*, *"How does bag vs. per-kg pricing work?"*, *"How do I verify pickup proof?"*).
2. **`public/llms.txt` Standard:**
   * A clear markdown document served at `/llms.txt` summarizing the service description, operational slots, delivery fee thresholds, customer safety guarantees, and contact endpoints for AI agents.

