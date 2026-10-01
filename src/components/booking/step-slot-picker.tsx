"use client";

import * as React from "react";
import { Calendar as CalendarIcon, Clock, CheckCircle, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlot {
  id: "8am-12pm" | "1pm-6pm";
  label: string;
  time: string;
  startHour: number;
  endHour: number;
}

interface StepSlotPickerProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedSlot: "8am-12pm" | "1pm-6pm";
  onSelectSlot: (slot: "8am-12pm" | "1pm-6pm") => void;
  dropoffDate?: string;
  onSelectDropoffDate?: (date: string) => void;
  slot1Start: string;
  slot1End: string;
  slot2Start: string;
  slot2End: string;
}

function parseHour(t: string): number {
  const [h] = t.split(":").map(Number);
  return h;
}

function fmt12(t?: string): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return m === 0 ? `${h12}:00 ${ampm}` : `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function StepSlotPicker({
  selectedDate,
  onSelectDate,
  selectedSlot,
  onSelectSlot,
  dropoffDate = "",
  onSelectDropoffDate,
  slot1Start,
  slot1End,
  slot2Start,
  slot2End,
}: StepSlotPickerProps) {
  const todayStr = React.useMemo(() => new Date().toISOString().split("T")[0], []);
  const nowHour = new Date().getHours();
  const isToday = selectedDate === todayStr;

  const slots: TimeSlot[] = [
    {
      id: "8am-12pm",
      label: "Morning Pickup Window",
      time: `${fmt12(slot1Start)} – ${fmt12(slot1End)}`,
      startHour: parseHour(slot1Start),
      endHour: parseHour(slot1End),
    },
    {
      id: "1pm-6pm",
      label: "Afternoon Pickup Window",
      time: `${fmt12(slot2Start)} – ${fmt12(slot2End)}`,
      startHour: parseHour(slot2Start),
      endHour: parseHour(slot2End),
    },
  ];

  const isSlotDisabled = (slot: TimeSlot) => isToday && nowHour >= slot.endHour;

  const availableDates = React.useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const isoDate = d.toISOString().split("T")[0];
      const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" });
      const monthDay = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return { isoDate, dayName, monthDay };
    }), []);

  React.useEffect(() => {
    if (isToday) {
      const morning = slots[0];
      const afternoon = slots[1];
      if (isSlotDisabled(morning) && isSlotDisabled(afternoon)) {
        const tomorrow = availableDates[1]?.isoDate;
        if (tomorrow && selectedDate === todayStr) {
          onSelectDate(tomorrow);
        }
      } else if (isSlotDisabled(morning) && !isSlotDisabled(afternoon) && selectedSlot === "8am-12pm") {
        onSelectSlot("1pm-6pm");
      }
    }
  }, [selectedDate, isToday]);

  return (
    <div className="space-y-6 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200">
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
            <h5 className="font-bold text-sm text-slate-900">Select Pickup Date</h5>
          </div>
          <input
            type="date"
            min={todayStr}
            value={selectedDate}
            onChange={(e) => onSelectDate(e.target.value)}
            className="w-full sm:w-auto text-xs px-3 py-1.5 rounded-xl border border-slate-300 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-2 min-[420px]:grid-cols-4 sm:grid-cols-7 gap-2">
          {availableDates.map((item) => {
            const isSelected = selectedDate === item.isoDate;
            return (
              <button
                key={item.isoDate}
                type="button"
                onClick={() => onSelectDate(item.isoDate)}
                className={cn(
                  "p-2 rounded-xl border text-center transition-all cursor-pointer min-w-0",
                  isSelected
                    ? "border-primary bg-primary text-white shadow-xs font-bold"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                )}
              >
                <span className="block text-xs truncate">{item.dayName}</span>
                <span className={cn("block text-[11px] mt-0.5 truncate", isSelected ? "text-pink-100" : "text-slate-500")}>
                  {item.monthDay}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h5 className="font-bold text-sm text-slate-900">Select Pickup Time Window</h5>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            const disabled = isSlotDisabled(slot);
            return (
              <button
                key={slot.id}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onSelectSlot(slot.id)}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all flex items-start justify-between",
                  disabled
                    ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                    : isSelected
                    ? "border-primary bg-pink-50/50 ring-2 ring-primary/20 shadow-xs cursor-pointer"
                    : "border-slate-200 bg-white hover:border-slate-300 cursor-pointer"
                )}
              >
                <div>
                  <span className="font-extrabold text-sm text-slate-900 block">{slot.time}</span>
                  <span className="text-xs text-slate-500 mt-0.5 block">{slot.label}</span>
                  {disabled && <span className="text-[11px] text-rose-500 font-semibold block mt-1">Passed — slot unavailable</span>}
                </div>
                {!disabled && isSelected ? (
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 ml-2" />
                ) : (
                  <div className="h-5 w-5 rounded-full border border-slate-300 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">Drop-off Date (Optional)</span>
              <span className="text-[11px] text-slate-500">Leave blank — we deliver within 24 hours.</span>
            </div>
          </div>
          <input
            type="date"
            min={selectedDate || todayStr}
            value={dropoffDate}
            onChange={(e) => onSelectDropoffDate?.(e.target.value)}
            className="w-full sm:w-auto text-xs px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
          />
        </div>
      </div>
    </div>
  );
}
