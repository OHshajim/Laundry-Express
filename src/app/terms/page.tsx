import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Sparkles, HeartHandshake, AlertCircle, ArrowLeft, Phone } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/lib/constants";
import { ContentService } from "@/lib/services/content-service";

export const metadata: Metadata = {
  title: "Terms of Service & Guarantees — Laundry Express",
  description:
    "Review our Zero Lost-Garment Guarantee, 100% Satisfaction Free Re-Wash Policy, and Happiness Guarantee. Transparent doorstep laundry terms.",
};

export default async function TermsPage() {
  const terms = await ContentService.getTerms();

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
        </div>

        {/* Dynamic Guarantee Cards */}
        {terms.length > 0 ? (
          <div className="space-y-8" id="guarantee-policy">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {terms.slice(0, 3).map((g) => (
                <div
                  key={g.id}
                  className="p-6 rounded-3xl bg-pink-50/40 border border-pink-100 shadow-xs space-y-3"
                >
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary-dark bg-white px-2.5 py-1 rounded-full border border-pink-200">
                    {g.subtitle || "Guarantee"}
                  </span>
                  <h3 className="text-base font-black text-slate-900">{g.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{g.description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6 pt-4 text-slate-800">
              {terms.map((item, idx) => (
                <section key={item.id} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-black text-slate-900">{idx + 1}. {item.title}</h2>
                  </div>
                  {item.subtitle && <p className="text-xs font-bold text-primary">{item.subtitle}</p>}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">{item.description}</p>
                </section>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <ShieldCheck className="h-10 w-10 text-primary mx-auto opacity-60" />
            <h3 className="text-base font-bold text-slate-900">Standard Service Commitments</h3>
            <p className="text-xs text-slate-600 max-w-lg mx-auto">
              Our complete terms and satisfaction guarantees are maintained by our operations team. If you have questions about care instructions, contact customer support anytime.
            </p>
          </div>
        )}



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
