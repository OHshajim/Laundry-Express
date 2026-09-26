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
    // CONFIRM WITH CLIENT: $32.50/bag matches flyer but differs from earlier contract draft ($10–15/bag) — verify before launch.
    baseBagPrice: 32.50, // $32.50 per 13-gallon bag (about 2 loads)
    oneBagDeliveryFee: 10.0, // $10 pickup & delivery
    freeDeliveryThresholdBags: 2, // >= 2 bags = FREE pickup & delivery
    baseKgPrice: 2.75,
    minKgOrder: 5.0,
    freeKgDeliveryThresholdSubtotal: 40.0,
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

export const DEFAULT_DETERGENTS = [
  {
    id: "det-tide-pods",
    name: "Tide Ultra Oxi Pods",
    description: "Deep clean stain fighting with fresh floral scent",
    price_adjustment: 0.0,
    is_active: true,
  },
  {
    id: "det-eco-plant",
    name: "Seventh Generation Eco-Clean",
    description: "100% plant-based, hypoallergenic & gentle on fabrics",
    price_adjustment: 0.0,
    is_active: true,
  },
  {
    id: "det-fragrance-free",
    name: "All Free & Clear",
    description: "Dermatologist recommended, 0% dyes and 0% perfumes",
    price_adjustment: 0.0,
    is_active: true,
  },
  {
    id: "det-gain-fresh",
    name: "Gain Original Refresh",
    description: "Long-lasting fragrance burst with fabric softening",
    price_adjustment: 0.0,
    is_active: true,
  },
] as const;

export const DEFAULT_PACKAGES = [
  {
    id: "pkg-saver-5",
    name: "5-Bag Saver Bundle",
    capacity: 5,
    unit: "bag",
    price: 65.0,
    original_price: 75.0,
    savings: "$10.00",
  },
  {
    id: "pkg-family-10",
    name: "10-Bag Family Pass",
    capacity: 10,
    unit: "bag",
    price: 125.0,
    original_price: 150.0,
    savings: "$25.00",
  },
  {
    id: "pkg-bulk-25kg",
    name: "25-KG Bulk Pass",
    capacity: 25,
    unit: "kg",
    price: 60.0,
    original_price: 68.75,
    savings: "$8.75",
  },
] as const;

export const GUARANTEE_POLICIES = [
  {
    id: "zero-lost",
    title: "Zero Lost-Garment Guarantee",
    summary: "Dual photo proof and digital barcode tagging protect every article of clothing.",
    badge: "100% Bag Custody Tracking",
  },
  {
    id: "free-rewash",
    title: "100% Satisfaction or Free Re-Wash",
    summary: "If any load is not impeccably clean, fresh, and folded, we re-wash it complimentary.",
    badge: "Free Re-Wash Promise",
  },
  {
    id: "happiness",
    title: "Happiness Guarantee",
    summary: "Dedicated McHenry County live support ready to ensure complete laundry delight.",
    badge: "Prompt Resolution",
  },
] as const;

export const SITE_NAVIGATION_LINKS = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Plans & Bags" },
  { href: "/dashboard", label: "Customer Dashboard" },
  { href: "/contact", label: "Contact Us" },
  { href: "/order", label: "Book Pickup" },
  { href: "/admin", label: "Admin Operations" },
] as const;
