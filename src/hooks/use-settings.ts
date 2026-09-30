"use client";

import * as React from "react";
import { fmt12h } from "@/lib/utils";

export interface SlotSettings {
  slot1Start: string;
  slot1End: string;
  slot2Start: string;
  slot2End: string;
  operatingHours: string;
}

const DEFAULT: SlotSettings = {
  slot1Start: "08:00",
  slot1End: "12:00",
  slot2Start: "13:00",
  slot2End: "18:00",
  operatingHours: "8:00 AM – 6:00 PM",
};

let cache: SlotSettings | null = null;
let fetchPromise: Promise<SlotSettings> | null = null;

async function fetchSettings(): Promise<SlotSettings> {
  if (cache) return cache;
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetch("/api/content?type=settings", { next: { revalidate: 60 } })
    .then((r) => r.json())
    .then((d) => {
      const s = d?.settings || {};
      cache = {
        slot1Start: s.slot1_start || DEFAULT.slot1Start,
        slot1End: s.slot1_end || DEFAULT.slot1End,
        slot2Start: s.slot2_start || DEFAULT.slot2Start,
        slot2End: s.slot2_end || DEFAULT.slot2End,
        operatingHours: s.operating_hours || `${fmt12h(s.slot1_start || DEFAULT.slot1Start)} – ${fmt12h(s.slot2_end || DEFAULT.slot2End)}`,
      };
      return cache;
    })
    .catch(() => DEFAULT)
    .finally(() => { fetchPromise = null; });
  return fetchPromise;
}

/** Returns live admin slot settings. Falls back to defaults on error. */
export function useSettings(): SlotSettings {
  const [settings, setSettings] = React.useState<SlotSettings>(cache || DEFAULT);

  React.useEffect(() => {
    if (cache) { setSettings(cache); return; }
    fetchSettings().then(setSettings);
  }, []);

  return settings;
}

/** Format slot 1 label (morning window) from live settings */
export function useSlot1Label(s: SlotSettings) {
  return `${fmt12h(s.slot1Start)} – ${fmt12h(s.slot1End)}`;
}

/** Format slot 2 label (afternoon window) from live settings */
export function useSlot2Label(s: SlotSettings) {
  return `${fmt12h(s.slot2Start)} – ${fmt12h(s.slot2End)}`;
}
