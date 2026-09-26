"use client";

import * as React from "react";
import { Bell, Mail, Smartphone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * SettingsNotifications Component
 * Implements AGENTS.md 5.e.4:
 * Manage customer notifications (push, email).
 */
export function SettingsNotifications() {
  const [pushStatus, setPushStatus] = React.useState(true);
  const [pushEnRoute, setPushEnRoute] = React.useState(true);
  const [pushPhotoProof, setPushPhotoProof] = React.useState(true);

  const [emailReceipts, setEmailReceipts] = React.useState(true);
  const [emailReminders, setEmailReminders] = React.useState(true);
  const [emailPromos, setEmailPromos] = React.useState(false);

  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-black text-slate-900">Notification Preferences</h3>
        <p className="text-xs text-slate-500">
          Control how and when you receive real-time wash lifecycle updates.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Notification preferences successfully saved!</span>
        </div>
      )}

      {/* Push Notifications Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Smartphone className="h-4 w-4 text-primary" />
          <span>Mobile &amp; Web Push Notifications</span>
        </div>

        <div className="space-y-2 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">Driver En-Route Alerts</span>
              <span className="text-[11px] text-slate-500">Get notified when your superhero driver is 10 minutes away.</span>
            </div>
            <input
              type="checkbox"
              checked={pushEnRoute}
              onChange={(e) => setPushEnRoute(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">Drop-off Photo Proof</span>
              <span className="text-[11px] text-slate-500">Instant notification with doorstep photo when laundry is returned.</span>
            </div>
            <input
              type="checkbox"
              checked={pushPhotoProof}
              onChange={(e) => setPushPhotoProof(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">Wash Cycle Status</span>
              <span className="text-[11px] text-slate-500">Updates as your order moves from Sorting → Eco Wash → Crisp Folding.</span>
            </div>
            <input
              type="checkbox"
              checked={pushStatus}
              onChange={(e) => setPushStatus(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary"
            />
          </label>
        </div>
      </div>

      {/* Email Notifications Section */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Mail className="h-4 w-4 text-primary" />
          <span>Email Communications</span>
        </div>

        <div className="space-y-2 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">Official Receipts &amp; Invoices</span>
              <span className="text-[11px] text-slate-500">Itemized billing and payment receipts sent to your inbox.</span>
            </div>
            <input
              type="checkbox"
              checked={emailReceipts}
              onChange={(e) => setEmailReceipts(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">Pickup Reminders</span>
              <span className="text-[11px] text-slate-500">Reminder sent 2 hours before your scheduled pickup window.</span>
            </div>
            <input
              type="checkbox"
              checked={emailReminders}
              onChange={(e) => setEmailReminders(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 block">Offers &amp; Coupon Codes</span>
              <span className="text-[11px] text-slate-500">Periodic promo codes and seasonal laundry bundle discounts.</span>
            </div>
            <input
              type="checkbox"
              checked={emailPromos}
              onChange={(e) => setEmailPromos(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" variant="hero" size="sm" className="cursor-pointer text-xs">
          Save Notification Preferences
        </Button>
      </div>
    </form>
  );
}
