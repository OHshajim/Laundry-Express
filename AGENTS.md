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
