import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Sparkles, HeartHandshake, AlertCircle, ArrowLeft, Phone, Mail } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { APP_CONFIG, GUARANTEE_POLICIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service & Guarantees — Laundry Express",
  description:
    "Review our Zero Lost-Garment Guarantee, 100% Satisfaction Free Re-Wash Policy, and Happiness Guarantee. Transparent doorstep laundry terms.",
};

/**
 * Terms & Guarantee Policy Page (/terms)
 *
 * Defines each guarantee in clear customer-friendly language:
 * 1. Zero Lost-Garment Guarantee
 * 2. 100% Satisfaction or Free Re-Wash
 * 3. Happiness Guarantee & Doorstep Protocol
 *
 * [PLACEHOLDER — replace with client-approved legal language before launch]
 */
export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-clip">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Breadcrumb & Intro */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-primary-dark text-xs font-black">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Official Customer Guarantees</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Terms of Service &amp; Guarantee Policies
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            At Laundry Express, we treat your clothing like our own. Every order is backed by our verified dual photo proof guarantee and dedicated customer care team in McHenry County, IL.
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Notice:</strong> [PLACEHOLDER — replace with client-approved legal language before launch]. The policies outlined below represent our operational standards and customer protection commitments.
            </p>
          </div>
        </div>

        {/* Guarantee Cards Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="guarantee-policy">
          {GUARANTEE_POLICIES.map((g) => (
            <div
              key={g.id}
              className="p-6 rounded-3xl bg-pink-50/40 border border-pink-100 shadow-xs space-y-3"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-primary-dark bg-white px-2.5 py-1 rounded-full border border-pink-200">
                {g.badge}
              </span>
              <h3 className="text-base font-black text-slate-900">{g.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{g.summary}</p>
            </div>
          ))}
        </div>

        {/* Detailed Guarantee Breakdown */}
        <div className="space-y-10 pt-4 text-slate-800">
          {/* Policy 1: Zero Lost-Garment */}
          <section id="zero-lost" className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-black text-slate-900">1. Zero Lost-Garment Guarantee</h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>What&apos;s Covered:</strong> From the moment our superhero driver takes custody of your laundry bags at your doorstep, each bag is sealed with a unique barcode ID. Digital intake photo proof is recorded and synced immediately.
              </p>
              <p>
                <strong>Exclusions:</strong> Items left outside hours prior to the booked pickup window without confirmation, or items with pre-existing damage reported during pre-wash inspection.
              </p>
              <p>
                <strong>Claim Process:</strong> In the rare event an item is misplaced, report it via the customer portal or call 815-575-9536 within 48 hours of drop-off.
              </p>
              <p>
                <strong>Liability Limits:</strong> [PLACEHOLDER — reimbursement up to $250.00 per verified lost garment, subject to client legal review].
              </p>
            </div>
          </section>

          {/* Policy 2: 100% Satisfaction or Free Re-Wash */}
          <section id="free-rewash" className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-black text-slate-900">2. 100% Satisfaction or Free Re-Wash</h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>What&apos;s Covered:</strong> If your clothes are not fresh, clean, or properly folded to our standard, let us know within 24 hours of delivery. We will pick up and re-wash the load free of charge.
              </p>
              <p>
                <strong>Exclusions:</strong> Permanent or pre-existing staining, dye transfer from garments not separated per label care instructions, and delicate silks marked dry-clean only.
              </p>
              <p>
                <strong>Claim Process:</strong> Submit a re-wash request via your order timeline in the Customer Dashboard with a quick photo of the item.
              </p>
            </div>
          </section>

          {/* Policy 3: Happiness Guarantee & Doorstep Protocols */}
          <section id="happiness" className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <HeartHandshake className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-black text-slate-900">3. Happiness Guarantee &amp; Doorstep Protocols</h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>Doorstep Protocol:</strong> If Home, the driver rings the bell. If Away, the driver collects bags placed outside your door or porch and records photo proof. Clean clothes are returned folded in protective sealed bags.
              </p>
              <p>
                <strong>Service Windows:</strong> Morning slot: 8:00 AM – 12:00 PM; Afternoon slot: 1:00 PM – 6:00 PM. Serving a 30-mile radius from Lake in the Hills, IL.
              </p>
              <p>
                <strong>Billing &amp; Payments:</strong> Upfront Stripe checkout. Bag orders are billed at $32.50 per 13-gallon bag with $10 delivery on 1 bag, and FREE delivery on 2+ bags.
              </p>
            </div>
          </section>
        </div>

        {/* Contact Support Strip */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-pink-500 to-rose-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-black">Questions About Our Terms or Guarantees?</h3>
            <p className="text-xs sm:text-sm text-pink-100 max-w-xl">
              Our Lake in the Hills customer care team is available daily from 8:00 AM to 6:00 PM.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a href={`tel:${APP_CONFIG.supportPhone}`}>
              <Button variant="outline" className="bg-white text-slate-900 border-white hover:bg-pink-50">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                {APP_CONFIG.supportPhone}
              </Button>
            </a>
            <Link href="/order">
              <Button className="bg-slate-900 hover:bg-black text-white">
                Book a Pickup
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
