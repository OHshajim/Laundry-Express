"use client";

import { Home, UserX, AlertCircle, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface PresenceOptionsProps {
  isOutOfHome: boolean;
  onIsOutOfHomeChange: (v: boolean) => void;
  isAwayForDropoff: boolean;
  onIsAwayForDropoffChange: (v: boolean) => void;
  bagConfirmed: boolean;
  onBagConfirmedChange: (v: boolean) => void;
  isDoorstepInvalid?: boolean;
}

export function PresenceOptions({
  isOutOfHome,
  onIsOutOfHomeChange,
  isAwayForDropoff,
  onIsAwayForDropoffChange,
  bagConfirmed,
  onBagConfirmedChange,
  isDoorstepInvalid = false,
}: PresenceOptionsProps) {
  return (
    <div className="space-y-5">
      {/* Pickup Presence */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Will you be home during <span className="text-primary">pickup</span>?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { away: false, title: "Yes, I will be Home", sub: "Driver rings bell upon arrival", Icon: Home, activeCls: "border-primary bg-pink-50/50 ring-2 ring-primary/20", iconCls: "bg-pink-100 text-primary" },
            { away: true, title: "No, I will be Away", sub: "Contactless doorstep pickup", Icon: UserX, activeCls: "border-amber-400 bg-amber-50/50 ring-2 ring-amber-400/20", iconCls: "bg-amber-100 text-amber-700" },
          ].map(({ away, title, sub, Icon, activeCls, iconCls }) => (
            <button
              key={String(away)}
              type="button"
              onClick={() => onIsOutOfHomeChange(away)}
              className={cn("p-3.5 rounded-xl border-2 text-left flex items-center gap-3 transition-colors cursor-pointer", isOutOfHome === away ? activeCls : "border-slate-200 bg-white hover:border-slate-300")}
            >
              <div className={cn("p-2 rounded-lg shrink-0", iconCls)}><Icon className="h-4 w-4" /></div>
              <div><span className="font-bold text-xs text-slate-900 block">{title}</span><span className="text-[11px] text-slate-500">{sub}</span></div>
            </button>
          ))}
        </div>

        {isOutOfHome && (
          <label className={cn(
            "flex items-start gap-2.5 cursor-pointer p-3.5 rounded-xl border text-xs text-amber-900 transition-colors animate-in fade-in",
            isDoorstepInvalid ? "bg-rose-50 border-rose-300 text-rose-900" : "bg-amber-50 border-amber-200"
          )}>
            <input
              type="checkbox"
              required
              checked={bagConfirmed}
              onChange={(e) => onBagConfirmedChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-primary focus:ring-primary border-slate-300"
            />
            <div>
              <span className="font-bold flex items-center gap-1 mb-0.5">
                <AlertCircle className={cn("h-3.5 w-3.5 shrink-0", isDoorstepInvalid ? "text-rose-600" : "text-amber-600")} /> Required Doorstep Confirmation:
              </span>
              I confirm that my laundry bag(s) are placed securely outside my front door / porch for pickup.
              {isDoorstepInvalid && (
                <p className="text-[11px] text-rose-600 mt-1 font-bold">Please check the confirmation box to proceed with contactless pickup.</p>
              )}
            </div>
          </label>
        )}
      </div>

      {/* Dropoff Presence */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Will you be home during <span className="text-emerald-600">drop-off</span>?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { away: false, title: "Yes, I will be Home", sub: "Driver hands off clean laundry directly", Icon: Home, activeCls: "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20", iconCls: "bg-emerald-100 text-emerald-700" },
            { away: true, title: "No, Leave at Door", sub: "Contactless doorstep drop-off", Icon: Truck, activeCls: "border-slate-600 bg-slate-100/70 ring-2 ring-slate-400/20", iconCls: "bg-slate-200 text-slate-700" },
          ].map(({ away, title, sub, Icon, activeCls, iconCls }) => (
            <button
              key={String(away)}
              type="button"
              onClick={() => onIsAwayForDropoffChange(away)}
              className={cn("p-3.5 rounded-xl border-2 text-left flex items-center gap-3 transition-colors cursor-pointer", isAwayForDropoff === away ? activeCls : "border-slate-200 bg-white hover:border-slate-300")}
            >
              <div className={cn("p-2 rounded-lg shrink-0", iconCls)}><Icon className="h-4 w-4" /></div>
              <div><span className="font-bold text-xs text-slate-900 block">{title}</span><span className="text-[11px] text-slate-500">{sub}</span></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
