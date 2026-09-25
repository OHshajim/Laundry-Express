export const APP_CONFIG = {
  name: "Laundry Express",
  tagline: "Superhero Fast Laundry Pickup & Delivery",
  description:
    "Professional doorstep laundry service. 1 Bag = $10.00 delivery fee; 2+ Bags = FREE delivery! Operational daily 8am-12pm & 1pm-6pm.",
  url: "https://laundryexpress.com",
  supportPhone: "+1 (800) 555-WASH",
  supportEmail: "support@laundryexpress.com",
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
    baseBagPrice: 15.0,
    oneBagDeliveryFee: 10.0,
    freeDeliveryThresholdBags: 2, // >= 2 bags is $0.00
    baseKgPrice: 2.75,
    minKgOrder: 5.0,
    maxOrdersPerSlotDefault: 15,
  },
  brandColors: {
    skyBlue: "#0284c7",
    capeRed: "#ef4444",
    amberGold: "#f59e0b",
    foamWhite: "#f8fafc",
    slateNavy: "#0f172a",
  },
} as const;

export const ORDER_STATUSES = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800 border-amber-300" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800 border-blue-300" },
  picked_up: { label: "Picked Up", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  in_wash: { label: "In Wash", color: "bg-sky-100 text-sky-800 border-sky-300" },
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
    price_adjustment: 1.5,
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
    price_adjustment: 0.5,
    is_active: true,
  },
] as const;
