"use client";

import { useSettings, useSlot1Label, useSlot2Label } from "@/hooks/use-settings";

export function SlotChip() {
  const settings = useSettings();
  const slot1 = useSlot1Label(settings);
  const slot2 = useSlot2Label(settings);
  return (
    <span className="text-slate-600">
      Daily {slot1} &amp; {slot2}
    </span>
  );
}
