"use client";

import * as React from "react";
import { Send, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * ContactForm Component
 *
 * Glassmorphic customer inquiry form with interactive focus glow and instant status feedback:
 * - Full Name, Email, Phone, Subject selection, and Message
 * - Simulated submission with loading spinner and success state
 * - Complies strictly with the 100-250 lines architectural rule
 */
export function ContactForm() {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "Pickup & Delivery Inquiry",
    message: "",
  });
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1400));
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-6 gap-5 bg-white/95 backdrop-blur-md rounded-3xl border border-pink-200 shadow-xl animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Message Sent Successfully!
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
            Thank you for reaching out to Laundry Express. Our dispatch team will get back to you within 24 hours.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setStatus("idle");
            setForm({
              name: "",
              email: "",
              phone: "",
              subject: "Pickup & Delivery Inquiry",
              message: "",
            });
          }}
          variant="outline"
          className="rounded-full px-6 text-xs font-bold border-pink-200 text-primary hover:bg-pink-50"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-pink-200/90 shadow-[0_0_35px_rgba(236,72,153,0.12)] p-6 sm:p-8 space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-primary-dark text-xs font-black">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Send A Direct Message</span>
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Let&apos;s Talk <span className="gradient-text">Laundry</span>
        </h3>
        <p className="text-xs text-slate-500 font-normal">
          Have a custom request or questions about your area? Send our team a note below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Alex Johnson"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="alex@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Row 2: Phone & Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="(815) 555-0199"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Subject *
            </label>
            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option>Pickup &amp; Delivery Inquiry</option>
              <option>Pricing &amp; 2+ Bag Free Delivery</option>
              <option>Bedding / Delicates Wash Question</option>
              <option>Commercial / Airbnb Bulk Laundry</option>
              <option>Other Feedback</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Message *
          </label>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Tell us how we can help with your laundry..."
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary-dark text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all active:scale-[0.99] cursor-pointer"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Sending Your Message...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
