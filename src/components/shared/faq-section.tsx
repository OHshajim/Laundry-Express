"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How does the $10.00 delivery fee and FREE delivery work?",
    a: "If you schedule 1 bag, the delivery fee is $10.00. If you schedule 2 or more bags (or spend $40+ on KG orders), your delivery fee is automatically reduced to $0.00 (100% FREE).",
  },
  {
    q: "What time slots can I select for pickup and delivery?",
    a: "We operate two daily windows: Morning (8:00 AM – 12:00 PM) and Afternoon (1:00 PM – 6:00 PM). You select your preferred window during booking.",
  },
  {
    q: "What if I am not home when the driver arrives?",
    a: "Simply select 'Away / Out of Home' when placing your order and check the confirmation box ensuring your bags are outside your door or porch. Our superhero driver performs a contactless pickup and takes a photo proof.",
  },
  {
    q: "How do I know my clothes were collected and returned safely?",
    a: "Every single order includes our dual Photo Proof Guarantee. The driver snaps a photo upon pickup and another upon doorstep return. Both are instantly viewable in your order tracker.",
  },
  {
    q: "Can I order by weight (Per KG) instead of bags?",
    a: "Yes! Choose 'By Weight (Per KG)' during booking. Our base rate is $2.75/KG with a 5KG minimum. You provide an estimated weight upfront, and our driver verifies the final weight with a calibrated scale.",
  },
  {
    q: "How does the customer review system work?",
    a: "Once your order is marked 'Completed', you can leave a 1–5 star rating, write feedback, and upload up to 3 photos of your clean laundry. Reviews are verified and moderated by our team.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-slate-50/60 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-sky-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Everything you need to know about our superhero laundry service.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-sky-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180 text-sky-600"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
