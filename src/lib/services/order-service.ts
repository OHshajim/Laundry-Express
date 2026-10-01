import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { PricingPlanService } from "@/lib/services/pricing-plan-service";
import type { Order, OrderStatus } from "@/types";

const ORDERS_MEMORY_STORE = new Map<string, Order>();

function mapOrderRecord(item: Record<string, any>): Order {
  const rawMode = item.plan_type || item.pricing_mode || "per_bag";
  const pricingMode = rawMode === "per_kg" || rawMode === "per_lb" ? "per_lb" : rawMode;
  const fullAddress = item.pickup_address || (item.street_address ? `${item.street_address}${item.apt_unit ? `, Apt ${item.apt_unit}` : ""}, ${item.city || ""}, ${item.state || ""} ${item.zip_code || ""}`.trim() : "");
  const rawProofs = item.proofs || item.order_proofs || [];
  const mappedProofs = rawProofs.map((p: any) => ({
    id: p.id || `prf-${Date.now()}`,
    order_id: p.order_id || item.id,
    proof_type: p.proof_type === "pickup_doorstep" ? "pickup" : p.proof_type === "delivery_doorstep" ? "dropoff" : p.proof_type === "processing_wash" ? "damage" : p.proof_type || "pickup",
    image_url: p.photo_url || p.image_url,
    notes: p.notes,
    uploaded_by: p.uploaded_by || "driver",
    created_at: p.created_at || new Date().toISOString(),
  }));
  const memProofs = ORDERS_MEMORY_STORE.get(item.id)?.proofs || ORDERS_MEMORY_STORE.get(item.order_number)?.proofs || [];
  return {
    ...item,
    user_id: item.user_id || "guest-customer",
    customer_name: item.customer_name || item.user_name || item.name || "Customer",
    customer_email: item.customer_email || item.email || "",
    customer_phone: item.customer_phone || item.phone || "",
    pricing_mode: pricingMode,
    bag_count: item.bag_count ?? 1,
    estimated_weight_lbs: Number(item.weight_lbs ?? item.weight_kg ?? item.estimated_weight_lbs ?? 0),
    pickup_slot: item.pickup_window || item.pickup_slot || "8am-12pm",
    delivery_slot: item.delivery_window || item.delivery_slot || "8am-12pm",
    pickup_address: fullAddress,
    customer_notes: item.customer_notes || item.special_instructions || item.notes || "",
    is_out_of_home: item.is_out_of_home !== undefined ? !!item.is_out_of_home : item.will_be_home === false,
    has_preexisting_damage: item.has_preexisting_damage || !!item.damage_photo_url || !!item.damage_notes,
    damage_notes: item.damage_notes || "",
    damage_photo_url: item.damage_photo_url || "",
    proofs: mappedProofs.length > 0 ? mappedProofs : memProofs,
    subtotal: Number(item.subtotal ?? 0),
    delivery_fee: Number(item.delivery_fee ?? 0),
    discount_amount: Number(item.discount_amount ?? 0),
    total_amount: Number(item.total_amount ?? 0),
    payment_status: item.payment_status || "pending",
    order_status: (item.order_status || item.delivery_status || "pending") as OrderStatus,
    stripe_payment_intent: item.stripe_payment_intent || item.stripe_payment_intent_id || undefined,
  } as Order;
}

export class OrderService {
  static async getOrders(userId?: string, userEmail?: string): Promise<Order[]> {
    try {
      const supabase = createAdminSupabaseClient();
      let query = supabase.from("orders").select("*, proofs:order_proofs(*)").order("created_at", { ascending: false });
      const filters = [];
      if (userId) filters.push(`user_id.eq.${userId}`);
      if (userEmail) filters.push(`customer_email.eq.${userEmail}`);
      if (filters.length > 0) query = query.or(filters.join(","));
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data.map(mapOrderRecord);
    } catch {}

    const all = Array.from(ORDERS_MEMORY_STORE.values());
    if (userId || userEmail) {
      return all.filter((o) => (userId && o.user_id === userId) || (userEmail && o.customer_email?.toLowerCase() === userEmail.toLowerCase()));
    }
    return all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async getOrderByNumber(orderIdentifier: string): Promise<Order | null> {
    for (const o of ORDERS_MEMORY_STORE.values()) {
      if (o.order_number === orderIdentifier || o.id === orderIdentifier) return o;
    }
    try {
      const supabase = createAdminSupabaseClient();
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderIdentifier);
      const query = supabase.from("orders").select("*, proofs:order_proofs(*)");
      const { data, error } = isUuid ? await query.eq("id", orderIdentifier).maybeSingle() : await query.eq("order_number", orderIdentifier).maybeSingle();
      if (!error && data) return mapOrderRecord(data);
    } catch {}
    return null;
  }

  static async createOrder(orderPayload: Partial<Order>): Promise<Order> {
    if (!orderPayload.detergent_id) throw new Error("A detergent selection is required.");
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `LX-${new Date().getFullYear()}-${randomSeq}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: orderPayload.id || `ord-${Date.now()}-${randomSeq}`,
      order_number: orderNumber,
      user_id: orderPayload.user_id || "guest-customer",
      customer_name: orderPayload.customer_name?.trim() || "Customer",
      customer_email: orderPayload.customer_email?.trim() || "",
      customer_phone: orderPayload.customer_phone?.trim() || "",
      pricing_mode: orderPayload.pricing_mode || "per_bag",
      bag_count: orderPayload.bag_count || 1,
      estimated_weight_lbs: Number(orderPayload.estimated_weight_lbs ?? 0),
      detergent_id: orderPayload.detergent_id,
      detergent_name: orderPayload.detergent_name || "",
      pickup_date: orderPayload.pickup_date || now.split("T")[0],
      pickup_slot: orderPayload.pickup_slot || "8am-12pm",
      delivery_date: orderPayload.delivery_date || now.split("T")[0],
      delivery_slot: orderPayload.delivery_slot || "8am-12pm",
      street_address: orderPayload.street_address || "",
      apt_unit: orderPayload.apt_unit || "",
      city: orderPayload.city || "",
      state: orderPayload.state || "",
      zip_code: orderPayload.zip_code || "",
      pickup_address: (orderPayload.street_address ? `${orderPayload.street_address}${orderPayload.apt_unit ? `, Apt ${orderPayload.apt_unit}` : ""}, ${orderPayload.city || ""}, ${orderPayload.state || ""} ${orderPayload.zip_code || ""}` : "") || orderPayload.pickup_address || "",
      customer_notes: (orderPayload as any).customer_notes || (orderPayload as any).special_instructions || (orderPayload as any).notes || "",
      is_out_of_home: !!orderPayload.is_out_of_home,
      bag_outside_door_confirmed: !!orderPayload.bag_outside_door_confirmed,
      subtotal: Number(orderPayload.subtotal ?? 0),
      delivery_fee: Number(orderPayload.delivery_fee ?? 0),
      tax_amount: Number(orderPayload.tax_amount ?? 0),
      discount_amount: Number(orderPayload.discount_amount ?? 0),
      total_amount: Number(orderPayload.total_amount ?? 0),
      order_status: "pending",
      payment_method: orderPayload.payment_method || "card",
      payment_status: "pending", // Always pending until confirmed via verified webhook
      created_at: now,
      updated_at: now,
    };

    ORDERS_MEMORY_STORE.set(newOrder.id, newOrder);
    ORDERS_MEMORY_STORE.set(newOrder.order_number, newOrder);

    try {
      const supabase = createAdminSupabaseClient();
      const { error } = await supabase.from("orders").insert({
        order_number: newOrder.order_number,
        user_id: newOrder.user_id && newOrder.user_id !== "guest-customer" ? newOrder.user_id : null,
        customer_name: newOrder.customer_name,
        customer_email: newOrder.customer_email,
        customer_phone: newOrder.customer_phone,
        plan_type: newOrder.pricing_mode,
        bag_count: newOrder.bag_count,
        weight_kg: newOrder.estimated_weight_lbs,
        detergent_id: newOrder.detergent_id,
        detergent_name: newOrder.detergent_name,
        pickup_date: newOrder.pickup_date,
        pickup_window: newOrder.pickup_slot,
        dropoff_date: newOrder.delivery_date,
        street_address: newOrder.street_address,
        apt_unit: newOrder.apt_unit,
        city: newOrder.city,
        state: newOrder.state,
        zip_code: newOrder.zip_code,
        will_be_home: !newOrder.is_out_of_home,
        doorstep_confirmed: newOrder.bag_outside_door_confirmed,
        subtotal: newOrder.subtotal,
        delivery_fee: newOrder.delivery_fee,
        discount_amount: newOrder.discount_amount,
        total_amount: newOrder.total_amount,
        payment_method: newOrder.payment_method,
        payment_status: "pending",
        order_status: "pending",
      });
      if (error) throw new Error(`Unable to save order before checkout: ${error.message}`);
    } catch (error: unknown) {
      ORDERS_MEMORY_STORE.delete(newOrder.id);
      ORDERS_MEMORY_STORE.delete(newOrder.order_number);
      throw error;
    }

    return newOrder;
  }

  static async markOrderPaid(
    orderIdentifier: string,
    details?: {
      stripe_payment_intent_id?: string;
      customer_name?: string;
      customer_email?: string;
      payment_method?: string;
    }
  ): Promise<Order | null> {
    const existing = await this.getOrderByNumber(orderIdentifier);
    if (!existing) return null;

    const now = new Date().toISOString();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(existing.id);
    const supabase = createAdminSupabaseClient();
    const updateData: Record<string, string> = {
      payment_status: "paid",
      order_status: "confirmed",
      updated_at: now,
    };
    if (details?.stripe_payment_intent_id) updateData.stripe_payment_intent_id = details.stripe_payment_intent_id;
    if (details?.customer_name) updateData.customer_name = details.customer_name;
    if (details?.customer_email) updateData.customer_email = details.customer_email;
    if (details?.payment_method) updateData.payment_method = details.payment_method;
    const query = supabase.from("orders").update(updateData);
    const { data, error } = isUuid
      ? await query.eq("id", existing.id).select("id").maybeSingle()
      : await query.eq("order_number", existing.order_number).select("id").maybeSingle();
    if (error || !data) throw new Error(`Unable to confirm paid order: ${error?.message || "Order not found."}`);

    existing.payment_status = "paid";
    existing.order_status = "confirmed";
    existing.updated_at = now;
    if (details?.stripe_payment_intent_id) existing.stripe_payment_intent = details.stripe_payment_intent_id;
    if (details?.customer_name) existing.customer_name = details.customer_name;
    if (details?.customer_email) existing.customer_email = details.customer_email;
    if (details?.payment_method) existing.payment_method = details.payment_method;
    ORDERS_MEMORY_STORE.set(existing.id, existing);
    if (existing.order_number) ORDERS_MEMORY_STORE.set(existing.order_number, existing);

    return existing;
  }

  static async markInvoiceEmailSent(orderId: string): Promise<void> {
    const supabase = createAdminSupabaseClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
    const query = supabase
      .from("orders")
      .update({ invoice_email_sent_at: new Date().toISOString() })
      .is("invoice_email_sent_at", null);
    const { error } = isUuid
      ? await query.eq("id", orderId)
      : await query.eq("order_number", orderId);
    if (error) throw new Error(`Unable to record invoice delivery: ${error.message}`);
    const order = ORDERS_MEMORY_STORE.get(orderId) ||
      Array.from(ORDERS_MEMORY_STORE.values()).find((item) => item.order_number === orderId);
    if (order) {
      order.invoice_email_sent_at = new Date().toISOString();
      ORDERS_MEMORY_STORE.set(order.id, order);
      ORDERS_MEMORY_STORE.set(order.order_number, order);
    }
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const existing = ORDERS_MEMORY_STORE.get(orderId);
    if (existing) {
      existing.order_status = status;
      existing.updated_at = new Date().toISOString();
    }
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
      const supabase = createAdminSupabaseClient();
      const query = supabase.from("orders").update({ order_status: status, updated_at: new Date().toISOString() });
      const { error } = isUuid ? await query.eq("id", orderId) : await query.eq("order_number", orderId);
      return !error;
    } catch {
      return true;
    }
  }

  static async updateFinalWeight(orderId: string, weightLbs: number): Promise<boolean> {
    const existing = ORDERS_MEMORY_STORE.get(orderId) || await this.getOrderByNumber(orderId);
    const pricing = await PricingPlanService.getPricing();
    if (!pricing) throw new Error("Pricing is not configured.");
    const unitRate = existing?.estimated_weight_lbs && existing?.subtotal
      ? Math.round((existing.subtotal / existing.estimated_weight_lbs) * 100) / 100
      : pricing.pound_price;
    const subtotal = Math.round(weightLbs * unitRate * 100) / 100;
    const deliveryFee = weightLbs >= pricing.free_delivery_lbs ? 0 : pricing.standard_delivery_fee;
    const total = subtotal + deliveryFee;

    if (existing) {
      existing.final_weight_lbs = weightLbs;
      existing.subtotal = subtotal;
      existing.delivery_fee = deliveryFee;
      existing.total_amount = total;
      existing.updated_at = new Date().toISOString();
    }

    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
      const supabase = createAdminSupabaseClient();
      const payload = { weight_kg: weightLbs, subtotal, delivery_fee: deliveryFee, total_amount: total, updated_at: new Date().toISOString() };
      const query = supabase.from("orders").update(payload);
      if (isUuid) await query.eq("id", orderId);
      else await query.eq("order_number", orderId);
    } catch {}
    return true;
  }

  static async uploadProof(orderId: string, proofType: "pickup" | "dropoff" | "damage", imageUrl: string, notes?: string): Promise<boolean> {
    const existing = ORDERS_MEMORY_STORE.get(orderId) || Array.from(ORDERS_MEMORY_STORE.values()).find((o) => o.id === orderId || o.order_number === orderId);
    const newProof = {
      id: `prf-${Date.now()}`,
      order_id: existing?.id || orderId,
      proof_type: proofType,
      image_url: imageUrl,
      notes,
      uploaded_by: "operations-admin",
      created_at: new Date().toISOString(),
    };
    if (existing) {
      if (proofType === "damage") {
        existing.has_preexisting_damage = true;
        existing.damage_notes = notes || existing.damage_notes;
        existing.damage_photo_url = imageUrl;
      }
      existing.proofs = [...(existing.proofs || []), newProof];
      ORDERS_MEMORY_STORE.set(existing.id, existing);
      if (existing.order_number) ORDERS_MEMORY_STORE.set(existing.order_number, existing);
    }
    try {
      const supabase = createAdminSupabaseClient();
      let targetUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId) ? orderId : null;
      if (!targetUuid) {
        const { data: found } = await supabase.from("orders").select("id").eq("order_number", orderId).maybeSingle();
        if (found?.id) targetUuid = found.id;
      }
      if (targetUuid) {
        const pt = proofType === "pickup" ? "pickup_doorstep" : proofType === "dropoff" ? "delivery_doorstep" : "processing_wash";
        await supabase.from("order_proofs").insert({ order_id: targetUuid, proof_type: pt, photo_url: imageUrl, notes });
      }
    } catch {}
    return true;
  }
}
