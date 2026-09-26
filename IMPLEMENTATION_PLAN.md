# 🚀 Laundry Express — Master Implementation Plan & Architecture Specification

**Project:** Laundry Express Web Application & Operations Platform  
**Document Ref:** PLAN-LE-005 (Synchronized with [AGENTS.md](file:///d:/projects/laundry-express/AGENTS.md))  
**Workspace:** `D:\projects\laundry-express`  
**Execution Directives:**
- **Top Priority (Rule 16):** Use Reusable Components as the First Priority (`src/components/shared/`, unified UI tokens)
- **Unified Visual Standard:** Admin Dashboard and User Dashboard share an identical, clean, light aesthetic with shared components
- **File Length Standard:** Every single file in `src/` must remain strictly between 100 and 250 lines
- **Iconography Standard:** Exclusively `lucide-react`
- **Color System:** Zero hardcoded hex codes; 100% tokenized CSS variables

---

## 1. Compliance Matrix: 16 Core Architectural Rules

| Rule # | Requirement | Implementation Strategy |
| :---: | :--- | :--- |
| **16** | **Use reusable component is the first priority \*\*\*** | Centralized reusable UI library (`src/components/shared/` and `src/components/ui/`) shared between Customer Portal, Admin Operations, and Booking Wizard. |
| **1** | **Responsive in every screen** | Mobile-first CSS grids, fluid container widths (`px-4 sm:px-6 lg:px-8`), flex-wrap controls, zero horizontal scrollbar on mobile. |
| **2** | **Text not breaking or overlapping** | Explicit line-heights, flex wrapping, truncation with tooltip guards, zero text collisions on compact viewports. |
| **3** | **Less icons used, avoid icon repetition** | Minimal, purposeful `lucide-react` iconography; icons serve exclusively as functional anchors. |
| **4** | **Less use of repeated text and context** | Concise, high-signal copywriting; eliminate redundant headers, filler helper text, and duplicate context. |
| **5** | **SEO and LLM implemented professionally** | Semantic HTML5 tags, JSON-LD schemas (`DryCleaningOrLaundryService`, `LocalBusiness`), OpenGraph metadata, and clean `/llms.txt`. |
| **6** | **Production ready code, professional tone** | Enterprise TypeScript, strict type safety, zero vulgarity, zero debug logs or chatty comments. |
| **7** | **Do not over-engineer the solution** | Pragmatic React state management, modular hooks, direct REST API handlers with rate-limiting. |
| **8** | **Scalable and maintainable** | Decoupled architecture where each component has a single, well-defined responsibility. |
| **9** | **Secure** | Input sanitization, password validation, in-memory rate limiting (3–10 req/min), Supabase Row Level Security (RLS). |
| **10** | **Performant** | Next.js Turbopack pre-rendering, lazy asset loading, zero layout shift (CLS), sub-200ms page transitions. |
| **11** | **Easy to understand** | Explicit interface types, intuitive component naming, and clean folder structures. |
| **12** | **Easy to modify** | Configuration constants isolated in `src/lib/constants.ts` and dynamic database-driven catalogs. |
| **13** | **Test and debug after a change** | Automated line-count audit script and `npm run build` after every milestone. |
| **14** | **Less static data, remove junks** | Dynamic database/API models, prune mock fallbacks, eliminate dead code and temporary files. |
| **15** | **Delete unused libraries and functions** | Zero dependency bloat; only use installed libraries (`@supabase/ssr`, `stripe`, `lucide-react`). |

---

## 2. Reusable Component Strategy (Rule 16 — First Priority)

To eliminate code duplication and harmonize the user and admin experiences:

```
src/components/shared/
├── unified-stat-card.tsx       (Shared KPI metric card for User & Admin dashboards)
├── status-badge.tsx            (Shared Order status pill: pending, picked_up, in_wash, completed)
├── unified-table.tsx           (Shared responsive data table shell with pagination)
├── photo-audit-grid.tsx        (Shared 3-photo laundry viewer for reviews & proofs)
├── address-form-fields.tsx     (Shared structured address inputs: Street, Apt, City, State, ZIP)
├── otp-verification-input.tsx  (Shared 6-digit OTP code verification input)
└── invoice-receipt.tsx         (Shared printable/downloadable invoice for Order Confirmation, User, Admin)
```

---

## 3. Functional Requirements & Verification Plan (Items 1 to 6)

### Module 1: Authentication & Password Lifecycle
* **Requirements:** Login, signup, Google OAuth sign-in, logout, password forgot, password reset.
* **Architecture:**
  - `src/components/auth/login-view.tsx` & `src/components/auth/customer-auth-gate.tsx`: Credentials login + Google OAuth.
  - `src/components/auth/forgot-password-view.tsx`: Password recovery email trigger.
  - `src/components/auth/reset-password-view.tsx`: Token-validated password reset.
  - Dashboard Settings Integration: Password change requiring email/SMS OTP verification.
* **API Endpoints:**
  - `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/google`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`.

---

### Module 2: Home Page
* **Requirements:** Hero section, order lifecycle, work process, reviews, FAQ, CTA banner.
* **Architecture:**
  - `src/components/shared/hero-section.tsx`: Headline, mascot badge, dynamic pricing banner ($32.50/bag), quick book CTA.
  - `src/components/home/order-tracking-summary.tsx`: Order lifecycle visualizer.
  - `src/components/home/how-it-works-section.tsx`: 4-step progressive work process.
  - `src/components/reviews/reviews-section.tsx`: Moderated customer reviews with ratings and photo badges.
  - `src/components/shared/faq-section.tsx`: Accordion answering turnaround, presence, lost garments.
  - `src/components/home/home-cta-banner.tsx`: High-conversion booking redirect.

---

### Module 3: Plan Page (`/pricing`)
* **Requirements:**
  1. *By Bag:* Standard 13-gallon capacity bags ($32.50/bag, free delivery on 2+ bags).
  2. *By the KG:* Precision scale weighed intake ($2.75/KG, min 5 KG, free delivery over $40).
  3. *Packages made by Admin:* Dynamic package bundles (e.g. 5-Bag Saver, 10-Bag Family Pass).
* **Architecture:**
  - `src/components/pricing/plan-bag-card.tsx`
  - `src/components/pricing/plan-kg-card.tsx`
  - `src/components/pricing/plan-packages-grid.tsx`
  - Direct deep-link parameter passing into `/order` (`?mode=per_bag&bags=2`).

---

### Module 4: Step-by-Step Order Creation Wizard (`/order`)
* **Step Flow:**
  - **a. Select Plan:** Bag vs KG vs Pre-Paid Package with live bag/kg counters.
  - **b. Select Pickup Date & Window:**
    - Interactive calendar picker.
    - Time slots: `8:00 AM – 12:00 PM` or `1:00 PM – 6:00 PM` (standard 24-hour delivery).
    - Drop-off date (optional): "Leave blank and we deliver back within 24 hours".
  - **c. Pickup & Delivery Address:**
    - Discrete fields: Street number & name, Apt / Unit (optional), City, State, ZIP code.
  - **d. Detergent & Temperature Selection:**
    - Detergent options (Tide Pods, Free & Clear, OxiClean, Gain Flings).
    - Temperature selection (Cold Wash, Warm Wash, Hot Wash).
    - Live calculation of total price, estimated total weight, and free delivery qualification.
  - **e. Special Request & Presence Doorstep Confirmation:**
    - Special instructions textarea (optional).
    - Presence toggle: "Yes, I will be Home" (driver rings bell) vs "No, I will be Away" (contactless doorstep pickup).
    - Mandatory Doorstep Checkbox: *"I confirm that my laundry bag(s) are placed securely outside my front door / porch for pickup."*
  - **f. Review & Select Payment Method:**
    - Comprehensive summary breakdown with 1-click edit jumps.
    - Stripe credit/debit card, Apple Pay, Google Pay upfront processing.
  - **g. Order Confirmation & Invoice Generation:**
    - Confirmation page with live order status badge.
    - Reusable printable/downloadable invoice (`src/components/shared/invoice-receipt.tsx`):
      Order ID, Order Date, Pickup Date & Slot, Delivery Date, Payment Method, Total Amount, Order Details breakdown.

---

### Module 5: Customer User Dashboard (`/dashboard`)
* **Views & Features:**
  - **a. Overview:** KPI stats (lifetime orders, bags washed, active order status pill).
  - **b. Order Tracking Page (`/dashboard/orders`):**
    - Live status pipeline: `Pending` → `Driver Assigned` → `Picked Up` → `In Wash` → `Out for Delivery` → `Completed`.
    - Order history with full order details modal & driver photo proofs.
  - **c. Payment History (`/dashboard/transactions`):**
    - Complete transaction ledger with Stripe reference, receipt view, and invoice download.
  - **d. Reviews (`/dashboard/ratings`):**
    - Accessible exclusively for completed orders.
    - 1 to 5 star rating, commentary, and up to 3 laundry photo uploads.
  - **e. Settings (`/dashboard/settings`):**
    1. *User Profile:* Full name, email, phone number, profile photo.
    2. *Address Management:* Add, edit, delete saved delivery addresses with default selection.
    3. *Password Reset:* Password update verified via OTP sent to email and phone number.
    4. *Notifications:* Push and email notification toggles.

---

### Module 6: Admin Dashboard (`/admin`)
* **Unified Theme:** Identical light background, clean cards, and shared UI tokens with user dashboard.
* **Sections:**
  - **a. Overview:** Operational KPI cards (Daily Revenue, Bags Picked Up Today, Pending Pickups, Active Drivers).
  - **b. Orders Manager:** Pipeline status advancement, driver pickup/drop-off photo proof review.
  - **c. Customers Directory:** Customer account inspection (order history, lifetime spend, verified phone, address).
  - **d. Plans & Package Management:** Add, edit, delete package bundles (Title, Description, Key Points, Price).
  - **e. Pricing Management:** Add, edit, delete price per KG (min and max) and price per bag (min and max).
  - **f. Detergent & Temperature Catalog:**
    - Detergents: Name, type (`liquid`, `powder`), brand, price, description, image.
    - Temperature: Name, type (`cold`, `warm`, `hot`), description.
  - **g. Coupon & Offer Manager:** Create, edit, toggle active status, or delete promo codes.
  - **h. Customer Review Moderation:** Audit feedback status, inspect 3-photo laundry uploads, approve or delete spam.
  - **i. Transaction History:** View complete payment logs for all customers with fees and Stripe charge ID.
  - **k. FAQs & Terms / Guarantees Manager:**
    - FAQ: Title, category, markdown description (bold, italic, size).
    - Terms & Guarantees: Title, subtitle, markdown description.
  - **m. Admin Settings:** Business operating hours, delivery territory radius, minimum order values.

---

## 4. Implementation Phasing & Milestones

1. **Phase 1: Reusable Core Components (Rule 16)**
   - Build `src/components/shared/address-form-fields.tsx` (structured discrete address).
   - Build `src/components/shared/invoice-receipt.tsx` (printable invoice for order flow & dashboards).
   - Build `src/components/shared/otp-verification-input.tsx` (6-digit OTP code widget).
2. **Phase 2: Order Wizard Upgrades**
   - Connect structured address inputs, optional drop-off date, and invoice display to `booking-wizard.tsx`.
3. **Phase 3: User Dashboard Settings & 3-Photo Reviews**
   - Implement `src/app/dashboard/settings/page.tsx` and `src/components/dashboard/dashboard-settings.tsx`.
   - Implement 3-photo review submission modal for completed orders.
4. **Phase 4: Admin Dashboard Light Theme Harmonization & Catalog Managers**
   - Convert Admin sidebar and layouts to clean light UI.
   - Build FAQ & Terms markdown manager, Catalog manager, and Admin settings manager.
5. **Phase 5: Quality Assurance & Build Verification**
   - Line count verification: 100–250 lines across all files in `src/`.
   - Clean `npm run build` execution with zero TypeScript or styling errors.
