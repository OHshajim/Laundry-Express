"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { SaveSettingsForm, useSettingsSave, postSettings } from "./save-settings-form";
import type { BusinessSettings } from "@/lib/services/content-service";

export function ScheduleSettingsForm({ initialSettings }: { initialSettings: BusinessSettings | null }) {
  const [operatingHours, setOperatingHours] = React.useState(initialSettings?.operating_hours || "");
  const [slot1Start, setSlot1Start] = React.useState(initialSettings?.slot1_start || "");
  const [slot1End, setSlot1End] = React.useState(initialSettings?.slot1_end || "");
  const [slot2Start, setSlot2Start] = React.useState(initialSettings?.slot2_start || "");
  const [slot2End, setSlot2End] = React.useState(initialSettings?.slot2_end || "");
  const [maxOrdersPerSlot, setMaxOrdersPerSlot] = React.useState(initialSettings?.max_orders_per_slot ?? "");
  const { isSaving, error, saved, save } = useSettingsSave();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void save(() => postSettings({
      operating_hours: operatingHours,
      slot1_start: slot1Start, slot1_end: slot1End,
      slot2_start: slot2Start, slot2_end: slot2End,
      max_orders_per_slot: Number(maxOrdersPerSlot),
    }));
  };

  return (
    <SaveSettingsForm title="Business Hours" description="Set operating days and pickup time windows."
      isLoading={false} isSaving={isSaving} error={error} saved={saved} onSubmit={handleSubmit}>
      <section className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
        <h4 className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
          <Clock className="h-4 w-4 text-primary" /> Operational Schedule &amp; Pickup Windows
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 text-xs">
          <label className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 font-bold text-slate-700">
            Operating Days
            <input required type="text" value={operatingHours} onChange={(event) => setOperatingHours(event.target.value)}
              className="mt-2 w-full min-w-0 px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium" />
          </label>
          <TimeWindow title="Morning Pickup Window" start={slot1Start} end={slot1End} onStart={setSlot1Start} onEnd={setSlot1End} />
          <TimeWindow title="Afternoon Pickup Window" start={slot2Start} end={slot2End} onStart={setSlot2Start} onEnd={setSlot2End} />
          <label className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 font-bold text-slate-700">
            Orders per pickup window
            <input required type="number" min="1" step="1" value={maxOrdersPerSlot}
              onChange={(event) => setMaxOrdersPerSlot(event.target.value)}
              className="mt-2 w-full min-w-0 px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium" />
          </label>
        </div>
      </section>
    </SaveSettingsForm>
  );
}

function TimeWindow({ title, start, end, onStart, onEnd }: {
  title: string;
  start: string;
  end: string;
  onStart: (value: string) => void;
  onEnd: (value: string) => void;
}) {
  return (
    <fieldset className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 font-bold text-slate-700">
      <legend className="px-1">{title}</legend>
      <div className="space-y-3">
        <TimePicker label="Start time" value={start} onChange={onStart} />
        <TimePicker label="End time" value={end} onChange={onEnd} />
      </div>
    </fieldset>
  );
}

function TimePicker({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [hour = "08", minute = "00"] = value.split(":");
  const hour24 = Number(hour);
  const isPm = hour24 >= 12;
  const displayHour = hour24 % 12 || 12;

  const updateTime = (nextHour: number, nextMinute: number, pm: boolean) => {
    const normalizedHour = (nextHour % 12) + (pm ? 12 : 0);
    onChange(`${String(normalizedHour).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`);
  };

  const selectClass = "w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm font-semibold text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <div className="space-y-1.5">
      <span className="block text-[11px] font-medium text-slate-500">{label}</span>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
      <select aria-label={`${label} hour`} className={selectClass} value={displayHour}
        onChange={(event) => updateTime(Number(event.target.value), Number(minute), isPm)}>
        {Array.from({ length: 12 }, (_, index) => index + 1).map((hourOption) => (
          <option key={hourOption} value={hourOption}>{hourOption}</option>
        ))}
      </select>
      <select aria-label={`${label} minute`} className={selectClass} value={minute}
        onChange={(event) => updateTime(displayHour, Number(event.target.value), isPm)}>
        {Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0")).map((minuteOption) => (
          <option key={minuteOption} value={minuteOption}>{minuteOption}</option>
        ))}
      </select>
      <select aria-label={`${label} AM or PM`} className={selectClass} value={isPm ? "PM" : "AM"}
        onChange={(event) => updateTime(displayHour, Number(minute), event.target.value === "PM")}>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
      </div>
    </div>
  );
}
