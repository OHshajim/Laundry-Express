export const APP_CONFIG = {
  name: "Laundry Express",
  tagline: "Pick Up • Wash • Fold • Deliver",
  subTagline: "More Time For What Matters",
  heroHeadline: "Laundry Piling Up?",
  description:
    "Professional doorstep laundry service. $32.50 per 13-gallon bag (about 2 loads). $10 pickup & delivery; 2+ Bags = FREE delivery! Operational daily 8am-12pm & 1pm-6pm.",
  url: "https://laundryexpress.com",
  supportPhone: "815-575-9536",
  supportEmail: "customerservice@laundryexpressservices.com",
  facebookUrl: "https://www.facebook.com/profile.php?id=61594071297569",
  address: "United States, IL · McHenry Co. · Lake in the Hills",
  location: {
    // Address replaced with service-area radius per privacy review — confirm with client whether a specific address should ever be public.
    city: "Lake in the Hills",
    county: "McHenry Co.",
    state: "IL",
    country: "United States",
    region: "Northwest Suburbs of Illinois",
    lat: 42.1903,
    lng: -88.383743,
    serviceRadius: "30-mile radius",
    serviceCities: [
      "Lake in the Hills",
      "Algonquin",
      "Crystal Lake",
      "Huntley",
      "Cary",
      "Elgin",
      "Schaumburg",
    ] as const,
    displayAddress: "Lake in the Hills & 30-Mile Service Territory (McHenry Co., IL)",
    mapsUrl: "https://maps.google.com/?q=Lake+in+the+Hills,+IL",
  },
  operatingHours: {
    slot1: {
      id: "8am-12pm",
      label: "Morning Pickup (8:00 AM – 12:00 PM)",
      short: "8:00 AM – 12:00 PM",
      opens: "08:00",
      closes: "12:00",
    },
    slot2: {
      id: "1pm-6pm",
      label: "Afternoon Pickup (1:00 PM – 6:00 PM)",
      short: "1:00 PM – 6:00 PM",
      opens: "13:00",
      closes: "18:00",
    },
  },
  pricing: {
    baseBagPrice: 32.50, // $32.50 per 13-gallon bag
    oneBagDeliveryFee: 10.0, // $10 pickup & delivery
    freeDeliveryThresholdBags: 2, // >= 2 bags = FREE pickup & delivery
    basePoundPrice: 1.99, // Rate per lb
    minPoundOrder: 10.0, // Minimum lbs per order
    maxPoundOrder: 100.0, // Maximum lbs per order
    freePoundDeliveryThreshold: 30.0, // >= 30 lbs = FREE pickup & delivery
    maxOrdersPerSlotDefault: 15,
  },
  brandColors: {
    primary: "#EC4899", // Bubble Pink — main brand color
    primaryDark: "#BE185D", // Deep Rose — hover/pressed states
    primaryLight: "#F472B6",
    primaryPale: "#FCE7F3",
    primaryGhost: "rgba(236, 72, 153, 0.12)",
    secondary: "#38BDF8", // Bubble Sky Blue — cool accent
    accentAlert: "#D63A3A", // Cape Red — urgency states only
    deep: "#141B2E", // Ink Navy — body text & headings
    foamWhite: "#FFFFFF",
    heroAmber: "#F5A623",
  },
} as const;

export const SERVICE_CITIES = [
  "Lake in the Hills",
  "Algonquin",
  "Crystal Lake",
  "Huntley",
  "Cary",
  "Elgin",
  "Schaumburg",
] as const;

export const ORDER_STATUSES = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800 border-amber-300" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800 border-blue-300" },
  driver_assigned: { label: "Driver Assigned", color: "bg-cyan-100 text-cyan-800 border-cyan-300" },
  picked_up: { label: "Picked Up", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  in_wash: { label: "In Wash", color: "bg-sky-100 text-sky-800 border-sky-300" },
  drying_folding: { label: "Drying/Folding", color: "bg-teal-100 text-teal-800 border-teal-300" },
  out_for_delivery: { label: "Out for Delivery", color: "bg-purple-100 text-purple-800 border-purple-300" },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  cancelled: { label: "Cancelled", color: "bg-rose-100 text-rose-800 border-rose-300" },
} as const;

export type OrderStatusKey = keyof typeof ORDER_STATUSES;



export const SITE_NAVIGATION_LINKS = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Plans & Bags" },
  { href: "/order", label: "Book Pickup" },
  { href: "/dashboard", label: "Dashboard" },
] as const;
