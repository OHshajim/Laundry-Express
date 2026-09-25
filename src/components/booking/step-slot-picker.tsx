import { Calendar as CalendarIcon, Clock, CheckCircle } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StepSlotPickerProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedSlot: "8am-12pm" | "1pm-6pm";
  onSelectSlot: (slot: "8am-12pm" | "1pm-6pm") => void;
}

export function StepSlotPicker({
  selectedDate,
  onSelectDate,
  selectedSlot,
  onSelectSlot,
}: StepSlotPickerProps) {
  // Generate next 6 available operational dates starting from today
  const availableDates = Array.from({ length: 6 }, (_, index) => {
    const d = new Date();
    d.setDate(d.getDate() + index);
    const isoDate = d.toISOString().split("T")[0];
    const dayName = index === 0 ? "Today" : index === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" });
    const monthDay = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { isoDate, dayName, monthDay };
  });

  const slots = [
    {
      id: "8am-12pm" as const,
      label: "Morning Pickup Window",
      time: APP_CONFIG.operatingHours.slot1.short,
      note: "Driver arrives between 8:00 AM and 12:00 PM",
    },
    {
      id: "1pm-6pm" as const,
      label: "Afternoon Pickup Window",
      time: APP_CONFIG.operatingHours.slot2.short,
      note: "Driver arrives between 1:00 PM and 6:00 PM",
    },
  ];

  return (
    <div className="space-y-5 p-5 rounded-2xl bg-white border border-slate-200">
      {/* Date Picker Horizontal List */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CalendarIcon className="h-4 w-4 text-sky-600" />
          <h5 className="font-bold text-sm text-slate-900">1. Select Pickup Date</h5>
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
                  "p-2.5 rounded-xl border text-center transition-all duration-150",
                  isSelected
                    ? "border-sky-600 bg-sky-600 text-white shadow-sm"
                    : "border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100"
                )}
              >
                <span className="block text-xs font-semibold">{item.dayName}</span>
                <span
                  className={cn(
                    "block text-[11px] mt-0.5",
                    isSelected ? "text-sky-100" : "text-slate-500"
                  )}
                >
                  {item.monthDay}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Operating Slot Selection (Strict 8am-12pm & 1pm-6pm) */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-sky-600" />
          <h5 className="font-bold text-sm text-slate-900">2. Select Operating Time Slot</h5>
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
                  "p-4 rounded-xl border-2 text-left transition-all duration-150 flex items-start justify-between",
                  isSelected
                    ? "border-sky-600 bg-sky-50/60 ring-2 ring-sky-500/20 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40"
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">{slot.time}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      Standard
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{slot.note}</p>
                </div>

                {isSelected ? (
                  <CheckCircle className="h-5 w-5 text-sky-600 shrink-0 ml-2" />
                ) : (
                  <div className="h-5 w-5 rounded-full border border-slate-300 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
