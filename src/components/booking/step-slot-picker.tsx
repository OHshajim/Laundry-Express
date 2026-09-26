"use client";

import * as React from "react";
import { Calendar as CalendarIcon, Clock, CheckCircle, Truck } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StepSlotPickerProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedSlot: "8am-12pm" | "1pm-6pm";
  onSelectSlot: (slot: "8am-12pm" | "1pm-6pm") => void;
  dropoffDate?: string;
  onSelectDropoffDate?: (date: string) => void;
}

/**
 * StepSlotPicker Component
 * Implements AGENTS.md 4.b:
 * - Pickup Date calendar picker & quick chips
 * - Time slots: 8am-12pm and 1pm-6pm (24-hour turnaround)
 * - Optional Drop-off Date (Leave blank and we deliver back within 24 hours)
 */
export function StepSlotPicker({
  selectedDate,
  onSelectDate,
  selectedSlot,
  onSelectSlot,
  dropoffDate = "",
  onSelectDropoffDate,
}: StepSlotPickerProps) {
  const todayStr = React.useMemo(() => new Date().toISOString().split("T")[0], []);

  const availableDates = React.useMemo(() => {
    return Array.from({ length: 6 }, (_, index) => {
      const d = new Date();
      d.setDate(d.getDate() + index);
      const isoDate = d.toISOString().split("T")[0];
      const dayName =
        index === 0 ? "Today" : index === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" });
      const monthDay = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return { isoDate, dayName, monthDay };
    });
  }, []);

  const slots = [
    {
      id: "8am-12pm" as const,
      label: "Morning Pickup Window",
      time: "8:00 AM – 12:00 PM",
      note: "Driver rings bell or contactless pickup",
    },
    {
      id: "1pm-6pm" as const,
      label: "Afternoon Pickup Window",
      time: "1:00 PM – 6:00 PM",
      note: "Driver rings bell or contactless pickup",
    },
  ];

  return (
    <div className="space-y-6 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200">
      {/* 1. Pickup Date Calendar & Quick Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <h5 className="font-bold text-sm text-slate-900">1. Select Pickup Date (Calendar)</h5>
          </div>
          <input
            type="date"
            min={todayStr}
            value={selectedDate}
            onChange={(e) => onSelectDate(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {availableDates.map((item) => {
            const isSelected = selectedDate === item.isoDate;
            return (
              <button
                key={item.isoDate}
                type="button"
                onClick={() => onSelectDate(item.isoDate)}
                className={cn(
                  "p-2.5 rounded-xl border text-center transition-all cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary text-white shadow-xs font-bold"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                )}
              >
                <span className="block text-xs">{item.dayName}</span>
                <span className={cn("block text-[11px] mt-0.5", isSelected ? "text-pink-100" : "text-slate-500")}>
                  {item.monthDay}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Pickup Window (8am-12pm & 1pm-6pm) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h5 className="font-bold text-sm text-slate-900">2. Select Pickup Time Window</h5>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onSelectSlot(slot.id)}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all flex items-start justify-between cursor-pointer",
                  isSelected
                    ? "border-primary bg-pink-50/50 ring-2 ring-primary/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <div>
                  <span className="font-extrabold text-sm text-slate-900 block">{slot.time}</span>
                  <span className="text-xs text-slate-500 mt-0.5 block">{slot.note}</span>
                </div>
                {isSelected ? (
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 ml-2" />
                ) : (
                  <div className="h-5 w-5 rounded-full border border-slate-300 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Drop-off Date (Optional, 24-hr turnaround) */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-emerald-600" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Drop-off Date (Optional)
              </span>
              <span className="text-[11px] text-slate-500">
                Leave blank and we deliver back within 24 hours.
              </span>
            </div>
          </div>

          <input
            type="date"
            min={selectedDate || todayStr}
            value={dropoffDate}
            onChange={(e) => onSelectDropoffDate?.(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
          />
        </div>
      </div>
    </div>
  );
}
