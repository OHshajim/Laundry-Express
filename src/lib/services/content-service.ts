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
  slot1_start?: string;
  slot1_end?: string;
  slot2_start?: string;
  slot2_end?: string;
  min_order_bag: number;
  min_order_lbs: number;
  free_delivery_bags: number;
  free_delivery_lbs: number;
  standard_delivery_fee: number;
}

const isUuid = (val?: string): boolean =>
  Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val));

export class ContentService {
  static async getFaqs(): Promise<FaqItem[]> {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase.from("faqs_and_terms").select("*")
      .eq("category", "faq").eq("is_active", true).order("sort_order", { ascending: true });
    if (error) throw new Error(`Unable to load FAQs: ${error.message}`);
    return (data ?? []).map((item) => ({
      id: item.id,
      question: item.title,
      answer: item.description,
      display_order: item.sort_order ?? 0,
    }));
  }

  static async saveFaq(faq: Partial<FaqItem>): Promise<FaqItem> {
    const question = faq.question?.trim() ?? "";
    const answer = faq.answer?.trim() ?? "";
    if (!question || !answer) throw new Error("A question and answer are required.");
    const dbPayload = {
      category: "faq",
      title: question,
      description: answer,
      sort_order: faq.display_order ?? 0,
      is_active: true,
    };
    const supabase = createAdminSupabaseClient();
    const query = isUuid(faq.id)
      ? supabase.from("faqs_and_terms").update(dbPayload).eq("id", faq.id)
      : supabase.from("faqs_and_terms").insert(dbPayload);
    const { data, error } = await query.select().single();
    if (error || !data) throw new Error(`Unable to save FAQ: ${error?.message || "No FAQ returned."}`);
    return { id: data.id, question: data.title, answer: data.description, display_order: data.sort_order ?? 0 };
  }

  static async deleteFaq(id: string): Promise<boolean> {
    const supabase = createAdminSupabaseClient();
    const query = supabase.from("faqs_and_terms").delete().eq("category", "faq");
    const { error } = isUuid(id) ? await query.eq("id", id) : await query.eq("title", id);
    if (error) throw new Error(`Unable to delete FAQ: ${error.message}`);
    return true;
  }

  static async deleteTerm(id: string): Promise<boolean> {
    const supabase = createAdminSupabaseClient();
    const query = supabase.from("faqs_and_terms").delete().in("category", ["term", "guarantee"]);
    const { error } = isUuid(id) ? await query.eq("id", id) : await query.eq("title", id);
    if (error) throw new Error(`Unable to delete terms: ${error.message}`);
    return true;
  }

  static async getTerms(): Promise<TermItem[]> {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase.from("faqs_and_terms").select("*")
      .in("category", ["term", "guarantee"]).eq("is_active", true).order("sort_order", { ascending: true });
    if (error) throw new Error(`Unable to load terms: ${error.message}`);
    return (data ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle || "",
      description: item.description,
    }));
  }

  static async saveTerm(term: Partial<TermItem>): Promise<TermItem> {
    const title = term.title?.trim() ?? "";
    const subtitle = term.subtitle?.trim() ?? "";
    const description = term.description?.trim() ?? "";
    if (!title || !description) throw new Error("A title and description are required.");
    const dbPayload = {
      category: "term",
      title,
      subtitle,
      description,
      is_active: true,
    };
    const supabase = createAdminSupabaseClient();
    const query = isUuid(term.id)
      ? supabase.from("faqs_and_terms").update(dbPayload).eq("id", term.id)
      : supabase.from("faqs_and_terms").insert(dbPayload);
    const { data, error } = await query.select().single();
    if (error || !data) throw new Error(`Unable to save terms: ${error?.message || "No terms returned."}`);
    return { id: data.id, title: data.title, subtitle: data.subtitle || "", description: data.description };
  }

  static async getSettings(): Promise<BusinessSettings | null> {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "business_operations")
      .maybeSingle();
    if (error) throw new Error(`Unable to load business settings: ${error.message}`);
    return (data?.value as BusinessSettings | undefined) ?? null;
  }

  static async updateSettings(updates: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const current = await this.getSettings();
    const settings = { ...current, ...updates } as BusinessSettings;
    const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    const numericValues = [
      settings.min_order_bag,
      settings.min_order_lbs,
      settings.free_delivery_bags,
      settings.free_delivery_lbs,
      settings.standard_delivery_fee,
    ];
    if (!settings.operating_hours?.trim() ||
      !Array.isArray(settings.delivery_zones) ||
      !settings.delivery_zones.length ||
      settings.delivery_zones.some((zone) => typeof zone !== "string" || !zone.trim()) ||
      ![settings.slot1_start, settings.slot1_end, settings.slot2_start, settings.slot2_end].every((time) => typeof time === "string" && timePattern.test(time)) ||
      numericValues.some((value) => !Number.isFinite(value) || value < 0) ||
      settings.min_order_bag <= 0 ||
      settings.min_order_lbs <= 0) {
      throw new Error("Complete business hours, pickup windows, delivery zones, and valid order thresholds before saving.");
    }
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("system_settings")
      .upsert({
        key: "business_operations",
        value: settings,
        description: "Operating hours, delivery zones, and thresholds",
        updated_at: new Date().toISOString(),
      })
      .select("value")
      .single();
    if (error || !data) {
      throw new Error(`Unable to save business settings: ${error?.message || "No settings returned."}`);
    }
    return data.value as BusinessSettings;
  }
}
