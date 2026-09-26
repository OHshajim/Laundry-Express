# AGENTS.md — Laundry Express

## 1. Project Overview & Requirements
Modern full-stack web application for **Laundry Express** (baseline: [laundry-express-go.lovable.app](https://laundry-express-go.lovable.app/)).

### Core Features:
- **Authentication & Roles:** Customer portal (orders, history, profile) and Admin dashboard (`/admin`).
- **Slot Booking:** Time slots restricted to `8:00 AM – 12:00 PM` and `1:00 PM – 6:00 PM` with date controls.
- **Pricing Engine:** Bag measurement. **1 Bag = $10.00** delivery fee; **$\ge$ 2 Bags = FREE ($0.00)** delivery fee.
- **Detergent Selection:** Dynamic customer wash selection controlled in real-time from the Admin panel.
- **Presence Verification:** Customer specifies Home or Away. If away, must confirm laundry bag is placed outside the door.
- **Upfront Stripe Checkout:** Integrated card, Apple Pay, and Google Pay checkout with webhook status sync.
- **Photo Proof System:** Admin/Driver uploads photo when picking up and when dropping off; both images are immediately visible to both customer and admin.
- **Admin Control Panel:** Order pipeline management, detergent catalog control, and customer directory.
- **Enterprise Security & Reliability Rules:**
  - **Server-Side Price Calculation:** `total_amount` must be computed exclusively on the server from raw inputs (`bag_count`, `pricing_mode`, `detergent_id`, etc.) querying `pricing_configs` before generating Stripe PaymentIntents. Never trust client-submitted prices.
  - **Stripe Webhook Signature Verification:** Validate `Stripe-Signature` against `STRIPE_WEBHOOK_SECRET` via `stripe.webhooks.constructEvent()` on every incoming webhook event.
  - **Admin MFA / 2FA:** Mandatory TOTP-based 2FA for all `admin` accounts before granting access to `/admin/*` operations.
  - **Proof Image Validation & Privacy:** Strict MIME validation (`jpeg`, `png`, `webp`), 5MB file cap, private bucket storage with signed URLs, and 90-day automated retention/purge policy.
  - **Rate Limiting:** Protect `/api/auth/*` (max 5 req/min) and `/api/orders/create` (max 10 req/min) against brute force and bot abuse.
  - **Database Disaster Recovery:** Supabase automated daily backups + PITR enabled with documented restoration playbook.
- **Modular Code & Architectural Rules:**
  - **Strict 100–250 Line Rule:** Every file (page, component, hook, utility, action) must strictly stay between 100 and 250 lines maximum. Decompose large files into reusable sub-components.
  - **Single Iconography Standard:** Exclusively `lucide-react` across the entire application. Do not mix other icon packs or raw SVGs.
  - **Brand & Mascot Alignment:** Visual theme seamlessly integrates the "Bubble Hero" mascot (superhero cape, boots, bubbly foam white, electric blue, and coral red accents).
  - **SEO & LLM-Friendly:** Next.js Metadata API, semantic HTML5, Schema.org JSON-LD structured data (`LocalBusiness`, `Service`, `Offer`, `FAQPage`, `AggregateRating`), and `llms.txt`.
- **Warranty:** 30 days complimentary post-launch bug fixes & maintenance after hosting.

---

## 2. Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide Icons (`lucide-react` exclusively), shadcn/ui.
- **Backend / Database:** Next.js API/Server Actions, PostgreSQL via Supabase (Auth + MFA + DB + Storage buckets for proof images).
- **Payments & Security:** Stripe (`@stripe/stripe-js`, `stripe` SDK, webhook signature validation), Upstash Redis rate limiting.
- **Deployment:** Vercel with custom domain & SSL.

---

## 3. Session Log System (State Restoration for AI Models)
> **Instructions for AI Models:**  
> When performing tasks in this workspace, record session steps in reverse-chronological order (newest first) or append sequentially to maintain context across restarts and tool executions. Keep entries short and structured.

### Entry Schema:
```markdown
### [Timestamp] | Step: <Step Name / ID>
- **Prompt:** <Exact or condensed user prompt>
- **Output:** <Concise summary of actions taken, files created/edited, commands executed>
- **Why:** <Brief reasoning/intent for state restoration>
```

---

## 4. Session History Log

### [2026-09-26 12:50] | Step: Hero Mascot Image Integration, Sticky Transparent-to-Pink Nav & Borderless Text-Glow Links
- **Prompt:** @[src/components/shared/hero-mascot.tsx] update that and use hero.jpg in nav and make when the nav in top the bg will transparent when scroll doen bg will pink and remove the border form navlinks glow only the text
- **Output:**
  1. Updated `HeroMascot` (`src/components/shared/hero-mascot.tsx`, 117 lines) integrating `hero.jpg` Bubble Hero mascot with gentle bobbing/wobble keyframe animation, halo blur, and 24h turnaround & photo proof badges.
  2. Updated `SiteHeader` (`src/components/shared/site-header.tsx`, 201 lines) to feature `hero.jpg` circular mascot emblem in the brand logo.
  3. Added scroll listener to `SiteHeader`: transparent background at page top (`scrollY <= 20`), smoothly transitioning into solid Bubble Pink (`#EC4899`) with shadow and backdrop-blur when scrolled down (`scrollY > 20`).
  4. Removed all border boxes and background pills from nav links; configured pure text glow on hover and active states (pink glow at page top, bright white text glow on pink background when scrolled).
  5. Decoupled transaction mock feed into `src/lib/mock-transactions-data.ts` (114 lines) and adjusted `TransactionsManager` (230 lines) and `GoogleMap` (105 lines) to strictly respect the 100–250 lines rule across all 78 files in `src/`.
  6. Verified 0 TypeScript errors and clean production build with `npm run build`.
- **Why:** Satisfy user directive for high-converting brand mascot integration, dynamic transparent-to-pink navigation scroll transition, and minimalist borderless text-glow navlinks.

### [2026-09-26 12:05] | Step: Core Content Upgrade — Tagline, Sub-tagline, Hero Headline, $32.50/Bag Pricing & 7 Service Cities
- **Prompt:** Tagline: "Pick Up • Wash • Fold • Deliver", Sub-tagline: "More Time For What Matters", Hero headline: "Laundry Piling Up?", Pricing: $32.50 per 13-gallon bag (about 2 loads), $10 pickup & delivery, FREE pickup & delivery on 2+ bags, Service Area: Lake in the Hills, Algonquin, Crystal Lake, Huntley, Cary, Elgin, Schaumburg, Radius: 30-mile radius. Upgrade the contents according to this.
- **Output:**
  1. Updated global constants in `src/lib/constants.ts` (162 lines): tagline to `"Pick Up • Wash • Fold • Deliver"`, subTagline to `"More Time For What Matters"`, heroHeadline to `"Laundry Piling Up?"`, base bag price to `$32.50`, service radius to `"30-mile radius"`, and added all 7 service cities (`Lake in the Hills`, `Algonquin`, `Crystal Lake`, `Huntley`, `Cary`, `Elgin`, `Schaumburg`).
  2. Overhauled `HeroSection` (`src/components/shared/hero-section.tsx`, 153 lines) with prominent `"Laundry Piling Up?"` headline, `"Pick Up • Wash • Fold • Deliver"` gradient badge, `"More Time For What Matters"` sub-headline, and service area / pricing callouts.
  3. Synchronized header brand tagline in `SiteHeader` (`src/components/shared/site-header.tsx`, 181 lines).
  4. Updated `PricingSection` (`src/components/shared/pricing-section.tsx`, 151 lines), `PlanBagCard` (`src/components/pricing/plan-bag-card.tsx`, 131 lines), `PlanComparison` (`src/components/pricing/plan-comparison.tsx`, 130 lines), and pricing page (`src/app/pricing/page.tsx`, 104 lines) with $32.50/bag (about 2 loads) rate and delivery rules ($10 for 1 bag, FREE for 2+ bags).
  5. Updated interactive booking flow in `StepPricingMode` (`src/components/booking/step-pricing-mode.tsx`, 117 lines) and `StepBagCounter` (`src/components/booking/step-bag-counter.tsx`, 142 lines).
  6. Updated `HowItWorksData` (`src/lib/how-it-works-data.ts`, 223 lines) service price descriptors.
  7. Updated bundle packages in `PlanPackagesGrid` (`src/components/pricing/plan-packages-grid.tsx`, 115 lines) and `PackagesManager` (`src/components/admin/packages-manager.tsx`, 232 lines) to align with $32.50 base bag price (5-Bag Saver $145 vs $162.50, 10-Bag Family Pass $280 vs $325).
  8. Synchronized footer in `SiteFooter` (`src/components/shared/site-footer.tsx`, 131 lines), `HomeCtaBanner` (`src/components/home/home-cta-banner.tsx`, 109 lines), and `FaqSection` (`src/components/shared/faq-section.tsx`, 114 lines) with live phone link `815-575-9536` and 7 service area cities.
  9. Updated contact showcase in `ContactView` (`src/components/contact/contact-view.tsx`, 116 lines) and `LocationCard` (`src/components/contact/location-card.tsx`, 161 lines).
  10. Updated admin pricing defaults in `PricingManager` (`src/components/admin/pricing-manager.tsx`, 202 lines) and mock orders in `mock-admin-data.ts` (224 lines).
  11. Updated SEO microdata & schemas in `jsonld-schemas.ts` (128 lines), `page.tsx` (105 lines), `layout.tsx` (111 lines), and `public/llms.txt`.
  12. Verified 100% compliance with strict 100–250 lines rule across all 67 files in `src/` and verified clean Next.js production build (`npm run build`).
- **Why:** Satisfy user directive to synchronize brand messaging, headline, bag pricing, delivery tiers, and exact 7-city service area coverage across every customer touchpoint and backend system.

### [2026-09-26 11:45] | Step: Unified Animated HowItWorksSection (Process + Services) with Framer Motion & LocationCard Simplification
- **Prompt:** Combine the existing ProcessSection (4-step "How It Works") and ServicesSection (4 service cards) into a single new component called HowItWorksSection, replacing both into one interactive, animated, scroll-driven experience with Framer Motion, large friendly icons, 3-5 word labels, traveling delivery route beacon, inline service tabs (Bag, By KG, Bedding, Express), reduced-motion fallback, and simplify Hours of Operation in LocationCard.
- **Output:**
  1. Simplified Hours of Operation display in `LocationCard` (`src/components/contact/location-card.tsx`, 161 lines) to direct single-line format: "All Week: 8:00 AM – 6:00 PM" with morning/afternoon slot note, matching the user's manual edits.
  2. Built modular service configuration data in `src/lib/how-it-works-data.ts` (223 lines) containing tailored 4-step narratives for Bag Wash & Fold, Weighed KG, Bedding & Delicates, and 24h Express.
  3. Built `HowItWorksStep` (`src/components/home/how-it-works-step.tsx`, 159 lines) with playful Bubble Hero spring transitions, large friendly icons (`CalendarClock`, `DoorOpen`, `Camera`, `Sparkles`), short 3-5 word primary labels, active glowing Punch Pink styling, and `prefers-reduced-motion` support.
  4. Built `HowItWorksSection` (`src/components/home/how-it-works-section.tsx`, 159 lines) featuring horizontal timeline with animated Framer Motion progress line, traveling delivery truck beacon, auto-play progression loop (every 3.4s with hover pause), inline service tabs filter (`[Bag] [By KG] [Bedding] [Express]`), and bottom conversion CTA strip ("Book Your Pickup Today").
  5. Updated `src/app/page.tsx` (105 lines) replacing both `ServicesSection` and `ProcessSection` with `<HowItWorksSection />` while preserving section anchor IDs (`#services`, `#process`, `#how-it-works`).
  6. Verified 100% compliance with strict 100–250 lines rule across all 67 files in `src/` and verified clean Next.js production build (`npm run build`).
- **Why:** Satisfy user directive to create an intuitive, zero-technical-background animated visual experience that immediately explains the pickup-to-delivery process and services to children and elderly customers alike without dense text.


### [2026-09-26 11:25] | Step: Punch Pink Detailings, Thin Scrollbar, Pure Black Shell, Hero Cloth Lifecycle Journey & McHenry Co. Contact Showcase
- **Prompt:** Use punch-pink in detailings and scroller bar and make the scroll thin; instead of using navy blue in footer or side bar use black and highlight navs with glowing punch-pink; remove the top nav and make the main nav static when scrolling down; use a linear effect in the hero section with scroll animation and add animation like cloth picked, wash, fold, and delivered; remove Long Beach details and show single official facility: United States, IL · McHenry Co. · Lake in the Hills (42.1903, -88.383743), directions link, phone 815-575-9536 tap to call, email customerservice@laundryexpressservices.com, hours 8am-6pm daily, Call Now button 815-575-9536 in attractive punch pink.
- **Output:**
  1. Configured custom thin (5px) Punch Pink (`#E91E63`) scrollbar and glow utilities in `src/app/globals.css` (220 lines).
  2. Changed `SiteFooter` (`src/components/shared/site-footer.tsx`, 131 lines) and `AdminSidebar` (`src/components/admin/admin-sidebar.tsx`, 226 lines) backgrounds from navy blue to pure black (`bg-black`), highlighted with glowing Punch Pink badges and interactive accents.
  3. Made `SiteHeader` (`src/components/shared/site-header.tsx`, 181 lines) static (`relative z-30`) so it scrolls naturally with page content; removed `PromoBanner` top announcement bar across all customer pages.
  4. Built interactive 4-stage `ClothJourneyAnimation` (`src/components/home/cloth-journey-animation.tsx`, 205 lines) demonstrating: Cloth Picked 🛍️ $\rightarrow$ Gentle Wash 🫧 $\rightarrow$ Crisp Fold 👕 $\rightarrow$ Porch Delivered 🚚 with glowing Punch Pink stepper, auto-progression loop, and photo proof verification metrics.
  5. Updated `HeroSection` (`src/components/shared/hero-section.tsx`, 147 lines) with linear ambient lighting effect, smooth bouncing scroll cue, and embedded `ClothJourneyAnimation`.
  6. Redesigned `LocationCard` (`src/components/contact/location-card.tsx`, 183 lines) in attractive Punch Pink: removed Long Beach, displaying Lake in the Hills McHenry Co. address, tap-to-call phone `815-575-9536`, email `customerservice@laundryexpressservices.com`, daily hours `8:00 AM – 6:00 PM`, and full-width Punch Pink Call Now button.
  7. Updated `ContactView` (`src/components/contact/contact-view.tsx`, 126 lines), `GoggleMap` (`src/components/shared/google-map.tsx`, 117 lines), and `src/app/contact/page.tsx` (106 lines) centered on Lake in the Hills (42.1903, -88.383743) with Punch Pink directions actions.
  8. Verified 100% compliance with strict 100–250 lines rule across all 66 files in `src/` and verified clean Next.js production build (`npm run build`).
- **Why:** Satisfy user directive for high-converting Punch Pink aesthetic, pure black shell, natural static header scrolling, animated cloth lifecycle journey, and unified McHenry County contact showcase.


### [2026-09-26 10:55] | Step: Zero Horizontal Scroll Responsive Cards, Clickable Review Photos & Floating Bubble Animations
- **Prompt:** Remove "Live Dispatch Sync McHenry & Long Beach Hubs" and Details button from order table (click row to open inspection dialog); make review photos clickable with preview modal; convert every table across the website into cards in mobile/tablet views to eliminate horizontal scrolling; add SEO-friendly animations, uniform typography hierarchy, and reusable floating bubble component for hero and other sections; ensure full responsiveness across mobile, tablet, and desktop.
- **Output:**
  1. Removed "Live Dispatch Sync • McHenry & Long Beach Hubs" from `src/components/admin/admin-sidebar.tsx`.
  2. Overhauled `OrderTableRow` (`src/components/admin/order-table-row.tsx`, 224 lines): removed "Details" button, made entire `<tr>` clickable to open inspection modal, and added `e.stopPropagation()` to all operation buttons (`Weigh`, `Accept Order`, `Pickup`, `Report Damage`, `Deliver`, `Proofs`).
  3. Created `OrderCard` (`src/components/admin/order-card.tsx`, 198 lines) and integrated into `OrderPipeline` (`src/components/admin/order-pipeline.tsx`, 232 lines) rendering desktop table (`hidden lg:block`) and mobile/tablet card view (`lg:hidden`) to eliminate horizontal scroll.
  4. Created `CustomerCard` (`src/components/admin/customer-card.tsx`, 105 lines) and updated `CustomersManager` (`src/components/admin/customers-manager.tsx`, 216 lines) with responsive cards (`lg:hidden`).
  5. Updated `CustomerDetailModal` (`src/components/admin/customer-detail-modal.tsx`, 249 lines) and `CouponsManager` (`src/components/admin/coupons-manager.tsx`, 234 lines) with responsive card views for mobile screens.
  6. Updated `ReviewModerator` (`src/components/admin/review-moderator.tsx`, 236 lines) with clickable review photo thumbnails and a modal dialog for enlarged photo audits.
  7. Built `FloatingBubbles` (`src/components/shared/floating-bubbles.tsx`, 174 lines) with GPU-accelerated CSS keyframe animations in `src/app/globals.css` (205 lines), integrated into `HeroSection`, `PricingSection`, and `HomeCtaBanner`.
  8. Verified 100% compliance with the strict 100–250 lines rule across all 65 files in `src/` and verified clean Next.js production build (`npm run build`).
- **Why:** Satisfy user directive for zero horizontal scrolling on mobile/tablet devices, row-click order inspection, clickable review photos, and brand-aligned floating bubble animations.

### [2026-09-26 04:00] | Step: Admin Customers Suite, Previous Orders Inspection, UI Decluttering & Light Layout
- **Prompt:** Remove "Laundry Express Operations Center • Daily Slots: 8am–12pm & 1pm–6pm Enterprise Admin Portal • © 2026 Laundry Express Services" from admin dashboard, make the website light and useful content only, show previous total orders and user preview when admin clicks an order, and add Customers tab in admin dashboard to inspect all customer accounts with details, history, orders, reviews, and payments in a dialog.
- **Output:**
  1. Removed footer clutter from `src/app/admin/layout.tsx` (removed exact text requested: "Laundry Express Operations Center • Daily Slots...", "Enterprise Admin Portal...").
  2. Built `CustomersManager` (`src/components/admin/customers-manager.tsx`, 201 lines) with search filter, account metrics (Total accounts, Repeat retention rate, Lifetime revenue), and customer directory table.
  3. Built `CustomerDetailModal` (`src/components/admin/customer-detail-modal.tsx`, 235 lines) displaying customer contact, lifetime stats, sub-tabs for Orders History, Stripe Payments History, and Reviews submitted.
  4. Updated `OrderDetailModal` (`src/components/admin/order-detail-modal.tsx`, 248 lines) with Previous Total Orders counter and Customer Lifetime Value preview card.
  5. Updated `AdminSidebar` (`src/components/admin/admin-sidebar.tsx`, 234 lines) with dedicated "Customers Directory" navigation item (`Users` icon).
  6. Created modular data provider `src/lib/mock-admin-data.ts` (224 lines) decoupling mock data from `src/app/admin/page.tsx` (156 lines).
  7. Streamlined `src/app/page.tsx` (105 lines) and `src/components/shared/promo-banner.tsx` (102 lines) by removing cluttered laundry comparison tables and repetitive text blocks to make the site light, modern, airy, and focused on useful content.
  8. Verified 100% compliance with 100–250 lines rule across all 59 files in `src/` and verified clean Next.js production build (`npm run build`).
- **Why:** Satisfy user directive for clean layout, admin customer directory, full account audit dialogs, and previous order metrics.

### [2026-09-26 03:50] | Step: Primary Button Color Transition to Punch Pink #E91E63
- **Prompt:** use this color for primary buttion #E91E63
- **Output:** Updated primary button variant styles in `Button` (`src/components/ui/button.tsx`) to Punch Pink `#E91E63` with `#d81557` hover, `#c2185b` active, focus-visible ring `#E91E63`, and pink shadow tints (`shadow-pink-500/20` and `shadow-pink-500/25`). Synchronized all primary call-to-action buttons across the site (Header Book Pickup, Hero Schedule Pickup, Pricing Plan Selectors, Process Section CTA, Mobile Bottom Nav floating Action, and Stripe Checkout Pay & Confirm in Order Summary). Verified 100% compliance with 100–250 lines rule across all files in `src/` and verified clean Next.js production build (`npm run build`).
- **Why:** Satisfy user directive to establish Punch Pink `#E91E63` as the high-converting, vibrant primary button color across the entire application.

### [2026-09-26 03:43] | Step: Admin Comprehensive Order Details Inspection Modal
- **Prompt:** When admin click a order he need to every details.
- **Output:** Created `OrderDetailModal` (`src/components/admin/order-detail-modal.tsx`, 242 lines) displaying complete order records: (1) Customer profile & presence verification (Name, Email mailto, Phone tel with tap-to-call, Doorstep Address, Away with bag outside door confirmation vs Home hand-to-hand, and special delivery notes); (2) Laundry specifications & Stripe upfront billing (Service plan By Bag / By KG / Package, bag count / final scale weight, custom detergent formula, delivery fee FREE ($0.00) vs standard, and Stripe verified status); (3) Scheduled pickup date & slot (8am-12pm or 1pm-6pm); (4) Photo proof gallery with pickup & drop-off inspection thumbnails; (5) Pre-existing cloth damage report alert with inspector notes and customer alert notification status; (6) Direct order state progression actions. Updated `OrderTableRow` (`src/components/admin/order-table-row.tsx`) to trigger inspection modal on order number click or explicit "Details" button. Updated `OrderPipeline` (`src/components/admin/order-pipeline.tsx`) and enriched `INITIAL_ORDERS` mock dataset in `src/app/admin/page.tsx`. Verified 100% compliance with 100–250 lines rule across all 60 files in `src/` and verified clean Next.js production build (`npm run build`).
- **Why:** Empower admin operations lead with instant full-spectrum visibility into every customer order, presence status, payment status, and fabric inspection evidence.

### [2026-09-26 03:26] | Step: Admin Sidebar Architecture, Progressive Order Buttons, Pre-wash Damage Inspection, Free Delivery for KG & Favicon
- **Prompt:** Remove "Live Ops Mode • Authenticated Session: Operations Lead MFA Secured Return to Customer Site" banner from admin dashboard, replace horizontal tabs with an executive Admin Sidebar, add option for free delivery for KG, replace generic order status dropdown with progressive action buttons (Confirmed -> Accept Order with email to customer -> Pickup Photo Proof -> Wash with pre-existing garment damage reporting & customer notification -> Deliver with required drop-off image proof), allow admin to change review status and delete reviews, and change favicon to custom brand icon.
- **Output:** Removed banner from `src/app/admin/layout.tsx`. Built `AdminSidebar` (`src/components/admin/admin-sidebar.tsx`) with vertical navigation for Orders Pipeline, Rates & Free Delivery, Packages, Detergent Catalog, Promo Coupons, and Review Moderation; deleted `admin-header.tsx`. Updated `PricingManager` (`src/components/admin/pricing-manager.tsx`) with `freeThresholdKg` ($\ge$ X KG = FREE delivery) and `minKgOrder`. Updated `OrderTableRow` (`src/components/admin/order-table-row.tsx`) and `OrderPipeline` (`src/components/admin/order-pipeline.tsx`) with progressive action buttons ("Accept Order" with customer email dispatch, "Pickup (Photo Proof)", "Report Damage" for pre-existing fabric flaw capture with customer notification, and "Deliver (Drop-off Photo Required)"). Updated `ReviewModerator` (`src/components/admin/review-moderator.tsx`) with status switcher (`approved`, `pending`, `rejected`) and permanent review deletion (`Trash2`). Created custom Bubble Hero SVG favicon at `src/app/icon.svg` and `public/icon.svg` and linked in `src/app/layout.tsx`. Verified 100% compliance with 100–250 lines rule across all 59 files in `src/` and verified clean Next.js production build (`npm run build`).
- **Why:** Satisfy client requirement for executive sidebar layout, structured multi-step fulfillment with photo damage protection, KG free delivery controls, review administration, and custom vector favicon.

### [2026-09-26 03:10] | Step: Contact Layout Showcase, Button Anti-Breaking Architecture, Brand Palette Tokens & Custom Scrollbar
- **Prompt:** Design contact page like user image (remove contact form), add custom scrollbar, fix button breaking with icons and text visibility loss on hover, make content responsive, use minimal icons, and apply exact Bubble Hero color tokens (Bubble Sky Blue #B9E1F5, Deep Hero Blue #1E88C7, Cape Red #D63A3A, Hero Amber #F5A623, Ink Navy #141B2E, Foam White #FFFFFF, Punch Pink #E91E63).
- **Output:** Installed `@vis.gl/react-google-maps` and built `GoggleMap` (`src/components/shared/google-map.tsx`). Redesigned contact page into a sleek 2-column showcase (`ContactView` + `LocationCard` + `GoggleMap`) matching user screenshot (Address, Phone with tap-to-call, Email, Operating hours table, and full-width Call Now button); deleted `contact-form.tsx`. Overhauled `Button` component (`src/components/ui/button.tsx`) with `whitespace-nowrap`, `shrink-0`, and explicit hover contrast colors across all variants to guarantee zero icon wrapping and zero hover text visibility drop. Added custom sleek scrollbar and exact hex tokens in `src/app/globals.css` and `src/lib/constants.ts`. Linked STRIX DEVS to `https://strixdevs.com`. Cleaned decorative icon clutter across hero, services, experience, footer, and admin dashboard. Verified 100% compliance with 100–250 lines rule across all 59 files in `src/` and verified clean Next.js production build (`npm run build`).
- **Why:** Satisfy exact UI screenshot, solve button wrapping/contrast bugs, implement client color palette, and maintain enterprise code modularity.

### [2026-09-26 02:30] | Step: Live Location, Contact Information, Facebook Channel & Animated 30-Mile Radius Hero Highlight
- **Prompt:** Add phone number 815-575-9536, email customerservice@laundryexpressservices.com, Facebook profile link, location United States, IL · McHenry Co. · Lake in the Hills (42.1903, -88.383743) Northwest Suburbs of Illinois, and highlight that by a simple animation on the landing page: (Lake in the Hills-30-mile radius).
- **Output:** Updated `APP_CONFIG` in `src/lib/constants.ts` with phone `815-575-9536`, email `customerservice@laundryexpressservices.com`, Facebook URL, and McHenry Co. Lake in the Hills coordinates (42.1903, -88.383743). Built an animated pulsing radar location highlight badge `📍 Lake in the Hills (30-Mile Radius)` in `src/components/shared/hero-section.tsx`. Updated `LocationCard` (`src/components/contact/location-card.tsx`), `SiteFooter` (`src/components/shared/site-footer.tsx`), `SiteHeader`, and `ContactPage` with direct telephone click-to-call, email mailto, Google Maps directions link, and Facebook profile button. Updated Schema.org `DryCleaningOrLaundryService` JSON-LD and `public/llms.txt`. Verified 100% compliance with 100-250 lines rule and zero-error production build.
- **Why:** Ensure real-world customer contact credibility, local SEO discovery for McHenry County, Illinois, and clear service radius visibility.

### [2026-09-26 02:20] | Step: Navigation Overhaul, Contact Page, Mandatory Customer Login Gate, Upfront Stripe Payment & Admin Catalog Suite
- **Prompt:** From Nav remove [How It Works], [Customer Reviews], and [FAQ], add Contact page where user can see location and contact form; mandatory login first before customer can order; upfront Stripe payment before confirming order; admin features to edit packages, offers/detergents, and edit/delete coupons.
- **Output:** Removed section anchors from `SiteHeader`, updated navigation to Home (`/`), Plans & Bags (`/pricing`), and Contact Us (`/contact`). Built dedicated `ContactPage` (`src/app/contact/page.tsx`) with `LocationCard` (operating windows, service radius, support hotline) and interactive `ContactForm`. Added `CustomerAuthGate` (`src/components/auth/customer-auth-gate.tsx`) requiring sign-in or instant demo login before accessing `OrderFlow`. Added upfront Stripe checkout in `OrderSummaryCard` (card inputs, Apple/Google pay) with payment confirmation. Added Admin catalog suite: `CouponsManager` (create, edit, delete, toggle active), `PackagesManager` (create, edit rates, toggle active), and `DetergentsManager` (create, edit surcharge, toggle stock). Enforced strict 100-250 lines rule (100% compliance across all `src` files), single icon standard (`lucide-react`), and verified full Next.js production build (`npm run build`).
- **Why:** Satisfy client requirements for multi-page routing, upfront payment conversion, authenticated customer flow, and admin catalog management.

### [2026-09-26 01:54] | Step: Full Project Build, Reusable Components & Admin Suite
- **Prompt:** Build the project.
- **Output:** Bootstrapped Next.js 16 App Router with TypeScript and Tailwind CSS; installed `lucide-react`, `@supabase/supabase-js`, `@supabase/ssr`, `stripe`, `@stripe/stripe-js`, `clsx`, `tailwind-merge`. Created `src/lib/constants.ts`, `src/lib/utils.ts`, `src/types/index.ts`, `src/lib/stripe/pricing-calc.ts`, `src/lib/seo/jsonld-schemas.ts`, `public/llms.txt`, and PostgreSQL migration `supabase/migrations/001_initial_schema.sql`. Built atomic UI components (`Button`, `Badge`, `Card`, `Dialog`), shared brand components (`SiteHeader`, `SiteFooter`, `MascotBadge`, `PromoBanner`, `HeroSection`, `PricingSection`, `PackagesSection`, `FaqSection`), interactive multi-step `BookingWizard` with Bag vs KG vs Package pricing, customer reviews with 3-photo uploads, and `/admin` operations suite (Order Pipeline, Weight Scale intake, Photo Proofs, Pricing/Offers manager, Review Moderation, and Master Audit Trail). Verified production build and live server running on `http://localhost:3000`.
- **Why:** Deliver complete, senior-level implementation strictly adhering to 100-250 line modularity, single icon standard, brand mascot alignment, and business requirements.

### [2026-09-26 01:05] | Step: Architecture Modularization, Single Iconography & Brand/SEO/LLM Alignment
- **Prompt:** Add file structure with maximum 100 to 250 lines per file, build pages/components with reusable components, use only one library for icons (`lucide-react`), make SEO and LLM friendly, and make design professional matching the superhero bubble mascot/icon.
- **Output:** Updated `IMPLEMENTATION_PLAN.md` with Sections 4, 5, and 6 detailing directory tree with line caps, `lucide-react` icon catalog mapping, color tokens matching the superhero bubble mascot, Schema.org JSON-LD microdata, and `llms.txt` spec. Updated `AGENTS.md`.
- **Why:** Ensure high maintainability, code modularity, consistent iconography, brand alignment, and search discoverability across both traditional search engines and AI agents.

### [2026-09-26 00:58] | Step: Enterprise Security & Reliability Hardening
- **Prompt:** Add explicit server-side pricing rule in Phase 3, Stripe webhook signature verification, Admin 2FA/MFA, order proof size/MIME validation with 90-day privacy retention policy, auth and order rate limiting, and Supabase automated daily backup/disaster recovery plan.
- **Output:** Updated `IMPLEMENTATION_PLAN.md` (Phases 1, 3, 4, 6 and Table 6 specs) and `AGENTS.md` (Section 1 and Session History).
- **Why:** Prevent client price tampering, fake webhook events, credential stuffing, unvalidated uploads, privacy liabilities, and data loss.

### [2026-09-25 21:14] | Step: Agent Guidelines & Session Log Setup
- **Prompt:** Create AGENTS.md with simple requirements, tech stack, and session log system for state restoration across AI models.
- **Output:** Created `D:\projects\laundry-express\AGENTS.md` containing concise project requirements, tech stack, and state restoration schema.
- **Why:** Provide a standardized instruction set and memory mechanism for incoming AI agents across sessions.

### [2026-09-25 20:30] | Step: Payment Provider Migration (PayPal to Stripe)
- **Prompt:** Switch payment gateway from PayPal to Stripe.
- **Output:** Updated `IMPLEMENTATION_PLAN.md`, regenerated `Laundry_Express_Project_Agreement_STRIX_DEVS.docx` using `create_docx.py`, updated database schema to `stripe_payment_intent_id`.
- **Why:** Client preferred Stripe for seamless in-app card/Apple Pay/Google Pay experience and reliable webhook events.

### [2026-09-25 20:12] | Step: Implementation Plan Generation
- **Prompt:** Create a comprehensive implementation plan for building the website.
- **Output:** Generated `C:\Users\ajsha\.gemini\antigravity\brain\0b39e395-6b4a-44d8-b395-0ba25d86322b\laundry_express_implementation_plan.md` and copied to `D:\projects\laundry-express\IMPLEMENTATION_PLAN.md`.
- **Why:** Establish architecture, database schema, and phase-by-phase development roadmap.

### [2026-09-25 20:10] | Step: Project Directory & Agreement Setup
- **Prompt:** Create project folder in D: drive.
- **Output:** Created directory `D:\projects\laundry-express` and placed `Laundry_Express_Project_Agreement_STRIX_DEVS.docx`.
- **Why:** Setup dedicated workspace for project files and documentation.

### [2026-09-24 01:34] | Step: Agreement Document Generation
- **Prompt:** Create formal contract agreement in DOCX format with 30-day post-launch maintenance based on STRIX DEVS invoice SD-LE-002 ($700 total, $200 paid, $500 balance).
- **Output:** Created Python generator `create_docx.py` using `python-docx` and built `Laundry_Express_Project_Agreement_STRIX_DEVS.docx`.
- **Why:** Produce client-ready legal/commercial deliverable with exact business terms and signatures.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
