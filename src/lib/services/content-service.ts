import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  display_order: number;
}

export interface TermItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
}

export interface BusinessSettings {
  operating_hours: string;
  delivery_zones: string[];
  min_order_bag: number;
  min_order_kg: number;
  free_delivery_bags: number;
  standard_delivery_fee: number;
}

const DEFAULT_FAQS: FaqItem[] = [
  { id: "faq-1", question: "How does the $10 or FREE delivery rule work?", answer: "When you book 1 standard 13-gallon laundry bag, a $10.00 delivery fee applies. When you book 2 or more bags, delivery is 100% FREE!", display_order: 1 },
  { id: "faq-2", question: "What size is the 13-gallon bag?", answer: "A 13-gallon bag is standard tall kitchen size and comfortably holds about 2 full loads of laundry (roughly 12-15 lbs).", display_order: 2 },
  { id: "faq-3", question: "What are your daily pickup windows?", answer: "We offer two daily windows: Morning (8:00 AM – 12:00 PM) and Afternoon (1:00 PM – 6:00 PM), 7 days a week.", display_order: 3 },
  { id: "faq-4", question: "Do I need to be home for pickup and delivery?", answer: "No! You can choose contactless doorstep pickup. Just leave your bags securely outside your door or porch.", display_order: 4 },
];

const DEFAULT_TERMS: TermItem[] = [
  { id: "term-1", title: "Fabric Protection & Care Guarantee", subtitle: "Zero-Shrinkage & Color Separation", description: "All fabrics are sorted by color and temperature according to your preference. If an item is damaged under our care, we reimburse up to 10x the wash charge." },
  { id: "term-2", title: "24-Hour Delivery Promise", subtitle: "Rapid Doorstep Turnaround", description: "Leave your drop-off date blank and we return your crisply folded garments within 24 hours of facility check-in." },
];

let cachedFaqs: FaqItem[] = [...DEFAULT_FAQS];
let cachedTerms: TermItem[] = [...DEFAULT_TERMS];
let cachedSettings: BusinessSettings = {
  operating_hours: "8:00 AM – 8:00 PM Daily",
  delivery_zones: ["Lake in the Hills", "Algonquin", "Crystal Lake", "Huntley", "Cary", "Elgin", "Schaumburg"],
  min_order_bag: 1,
  min_order_kg: 5,
  free_delivery_bags: 2,
  standard_delivery_fee: 10,
};

export class ContentService {
  static async getFaqs(): Promise<FaqItem[]> {
    try {
      const supabase = createAdminSupabaseClient();
      const { data, error } = await supabase.from("faqs").select("*").order("display_order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          question: d.title || d.question,
          answer: d.description || d.answer,
          display_order: d.display_order ?? 1,
        }));
      }
    } catch {}
    return cachedFaqs;
  }

  static async saveFaq(faq: Partial<FaqItem>): Promise<FaqItem> {
    const id = faq.id || `faq-${Date.now()}`;
    const full: FaqItem = {
      id,
      question: faq.question || "New Question?",
      answer: faq.answer || "Answer details.",
      display_order: faq.display_order ?? (cachedFaqs.length + 1),
    };
    const idx = cachedFaqs.findIndex((f) => f.id === id);
    if (idx >= 0) cachedFaqs[idx] = full;
    else cachedFaqs.push(full);

    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("faqs").upsert({ id, title: full.question, description: full.answer, display_order: full.display_order });
    } catch {}
    return full;
  }

  static async deleteFaq(id: string): Promise<boolean> {
    cachedFaqs = cachedFaqs.filter((f) => f.id !== id);
    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("faqs").delete().eq("id", id);
    } catch {}
    return true;
  }

  static async getTerms(): Promise<TermItem[]> {
    try {
      const supabase = createAdminSupabaseClient();
      const { data, error } = await supabase.from("terms").select("*");
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          title: d.title,
          subtitle: d.subtitle,
          description: d.description,
        }));
      }
    } catch {}
    return cachedTerms;
  }

  static async saveTerm(term: Partial<TermItem>): Promise<TermItem> {
    const id = term.id || `term-${Date.now()}`;
    const full: TermItem = {
      id,
      title: term.title || "Policy Title",
      subtitle: term.subtitle || "Service Guarantee",
      description: term.description || "Policy terms.",
    };
    const idx = cachedTerms.findIndex((t) => t.id === id);
    if (idx >= 0) cachedTerms[idx] = full;
    else cachedTerms.push(full);

    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("terms").upsert(full);
    } catch {}
    return full;
  }

  static async getSettings(): Promise<BusinessSettings> {
    try {
      const supabase = createAdminSupabaseClient();
      const { data } = await supabase.from("system_settings").select("*").eq("key", "business_operations").maybeSingle();
      if (data && data.value) {
        cachedSettings = { ...cachedSettings, ...data.value };
      }
    } catch {}
    return cachedSettings;
  }

  static async updateSettings(updates: Partial<BusinessSettings>): Promise<BusinessSettings> {
    cachedSettings = { ...cachedSettings, ...updates };
    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("system_settings").upsert({ key: "business_operations", value: cachedSettings, updated_at: new Date().toISOString() });
    } catch {}
    return cachedSettings;
  }
}
