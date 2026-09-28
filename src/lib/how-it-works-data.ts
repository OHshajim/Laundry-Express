import * as React from "react";
import {
  CalendarClock,
  DoorOpen,
  Camera,
  Sparkles,
  Shirt,
  Scale,
  Package,
} from "lucide-react";
import type { StepData } from "@/components/home/how-it-works-step";

export type ServiceKey = "bag" | "pound" | "package";

export interface ServiceConfig {
  id: ServiceKey;
  label: string;
  badge: string;
  price: string;
  icon: React.ElementType;
  steps: StepData[];
}

export const SERVICES_DATA: Record<ServiceKey, ServiceConfig> = {
  bag: {
    id: "bag",
    label: "By the Bag (13 Gal)",
    badge: "Most Popular Wash & Fold",
    price: "$32.50 / bag (about 2 loads)",
    icon: Shirt,
    steps: [
      {
        id: 1,
        numberStr: "01",
        shortLabel: "Schedule Pickup",
        badge: "Morning or Afternoon",
        icon: CalendarClock,
        actionText: "Select your 13-gallon bag count",
        detail: "Pick convenient morning (8am–12pm) or afternoon (1pm–6pm) window.",
        helperNote: "2+ Bags = 100% Free Delivery",
      },
      {
        id: 2,
        numberStr: "02",
        shortLabel: "Doorstep Hand-Off",
        badge: "Contactless Ready",
        icon: DoorOpen,
        actionText: "Leave outside or hand to driver",
        detail: "Select Home or Away protocol with driver doorstep bell notification.",
        helperNote: "Secure photo timestamp confirmation",
      },
      {
        id: 3,
        numberStr: "03",
        shortLabel: "Cold Gentle Wash",
        badge: "Premium Detergent",
        icon: Camera,
        actionText: "Washed, fluffed & neatly folded",
        detail: "Sorted by darks/lights and washed with Tide Pods cold water care.",
        helperNote: "Zero color bleeding or shrinkage",
      },
      {
        id: 4,
        numberStr: "04",
        shortLabel: "Delivered in 24h",
        badge: "On-Time Guarantee",
        icon: Sparkles,
        actionText: "Returned fresh to your door",
        detail: "Packed in weather-safe protective packaging within 24 hours.",
        helperNote: "100% on-time arrival promise",
      },
    ],
  },
  pound: {
    id: "pound",
    label: "By-the-Pound (lb)",
    badge: "$1.99 / lb Bulk",
    price: "$1.99 / lb",
    icon: Scale,
    steps: [
      {
        id: 1,
        numberStr: "01",
        shortLabel: "Schedule Pickup",
        badge: "Flexible Slots",
        icon: CalendarClock,
        actionText: "Book by estimated volume",
        detail: "Select pickup day and slot. Ideal for bulk, family, or Airbnb laundry.",
        helperNote: "10 lbs minimum per pickup",
      },
      {
        id: 2,
        numberStr: "02",
        shortLabel: "Doorstep Hand-Off",
        badge: "Porch or In-Person",
        icon: DoorOpen,
        actionText: "Driver collects weighed laundry",
        detail: "Hand over laundry hampers or request contactless porch pickup.",
        helperNote: "Digital tracking initiated",
      },
      {
        id: 3,
        numberStr: "03",
        shortLabel: "Facility Scale Intake",
        badge: "Verified Weight",
        icon: Camera,
        actionText: "Calibrated digital scale verification",
        detail: "Driver logs certified weight photo into your portal before wash.",
        helperNote: "Pay only verified net weight",
      },
      {
        id: 4,
        numberStr: "04",
        shortLabel: "Delivered in 24h",
        badge: "24h Turnaround",
        icon: Sparkles,
        actionText: "Freshly folded & returned",
        detail: "Delivered back to your door folded crisp within 24 hours.",
        helperNote: "Free delivery over 30 lbs",
      },
    ],
  },
  package: {
    id: "package",
    label: "Saver Packages",
    badge: "Save Up to 20%",
    price: "Pre-paid Bundle Credits",
    icon: Package,
    steps: [
      {
        id: 1,
        numberStr: "01",
        shortLabel: "Redeem Credits",
        badge: "One-Click Booking",
        icon: CalendarClock,
        actionText: "Select bundle credit pickup",
        detail: "Choose date & time. Pre-paid balance automatically deducts 1 bag.",
        helperNote: "Zero checkout delay",
      },
      {
        id: 2,
        numberStr: "02",
        shortLabel: "Doorstep Hand-Off",
        badge: "VIP Priority",
        icon: DoorOpen,
        actionText: "Priority driver dispatch",
        detail: "Package subscribers receive priority dispatch and route tracking.",
        helperNote: "Contactless doorstep pickup",
      },
      {
        id: 3,
        numberStr: "03",
        shortLabel: "Gentle Cold Care",
        badge: "Eco-Friendly",
        icon: Camera,
        actionText: "Inspected & washed crisp",
        detail: "Garments separated and washed in gentle cold water with fabric softener.",
        helperNote: "Premium garment care",
      },
      {
        id: 4,
        numberStr: "04",
        shortLabel: "24h Return Delivery",
        badge: "Free Delivery Included",
        icon: Sparkles,
        actionText: "Delivered right to your doorstep",
        detail: "Neatly stacked and returned within 24 hours.",
        helperNote: "Always includes free delivery",
      },
    ],
  },
};

export default SERVICES_DATA;
