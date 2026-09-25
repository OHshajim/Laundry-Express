"use client";

import * as React from "react";
import { Send, CheckCircle2, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const INITIAL_FORM: ContactFormData = {
  fullName: "",
  email: "",
  phone: "",
  subject: "General Question",
  message: "",
};

/**
 * ContactForm Component
 *
 * Interactive contact inquiry form allowing customers to send messages to
 * operations, dispatch, and commercial bulk laundry specialists.
 */
export function ContactForm() {
  const [formData, setFormData] = React.useState<ContactFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please fill in your name, email, and message.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    // Simulate server action submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData(INITIAL_FORM);
    }, 900);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Message Received!</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Thank you for reaching out. A Laundry Express support hero will review your inquiry and reply within 2 hours during operational windows.
        </p>
        <Button
          variant="outline"
          onClick={() => setSubmitted(false)}
          className="mt-4"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"
    >
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <MessageSquare className="h-5 w-5 text-sky-600" />
        <div>
          <h3 className="text-lg font-bold text-slate-900">Send Us a Direct Message</h3>
          <p className="text-xs text-slate-500">We respond promptly 7 days a week.</p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">
            Your Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="Sarah Jenkins"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            placeholder="sarah@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:border-sky-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            placeholder="(555) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">
            Inquiry Topic
          </label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium bg-white focus:border-sky-500 focus:outline-none"
          >
            <option value="General Question">General Question</option>
            <option value="Order Status / Schedule">Order Status / Schedule</option>
            <option value="Commercial & Airbnb Bulk">Commercial &amp; Airbnb Bulk</option>
            <option value="Pricing & Packages">Pricing &amp; Packages</option>
            <option value="Feedback / Suggestion">Feedback / Suggestion</option>
          </select>
        </div>
      </div>

      <div className="text-xs">
        <label className="block font-bold text-slate-700 uppercase mb-1">
          Your Message *
        </label>
        <textarea
          required
          rows={4}
          placeholder="How can our laundry superheroes help you today?"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:border-sky-500 focus:outline-none"
        />
      </div>

      <Button
        type="submit"
        variant="hero"
        size="lg"
        disabled={isSubmitting}
        className="w-full shadow-md shadow-sky-500/20"
      >
        <Send className="h-4 w-4 mr-2" />
        <span>{isSubmitting ? "Sending Your Message..." : "Submit Inquiry"}</span>
      </Button>
    </form>
  );
}
