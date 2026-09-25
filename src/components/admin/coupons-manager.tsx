"use client";

import * as React from "react";
import { Tag, Plus, Trash2, Edit2, Check, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CouponItem {
  id: string;
  code: string;
  discount: string;
  discount_amount: number;
  discount_type: "percentage" | "fixed_amount" | "free_delivery";
  active: boolean;
}

const INITIAL_COUPONS: CouponItem[] = [
  {
    id: "cpn-1",
    code: "HEROFRESH",
    discount: "15% OFF Subtotal",
    discount_amount: 15,
    discount_type: "percentage",
    active: true,
  },
  {
    id: "cpn-2",
    code: "FREESHIP",
    discount: "Free 1-Bag Delivery ($10 OFF)",
    discount_amount: 10,
    discount_type: "free_delivery",
    active: true,
  },
  {
    id: "cpn-3",
    code: "WELCOME5",
    discount: "$5.00 Flat Discount",
    discount_amount: 5,
    discount_type: "fixed_amount",
    active: false,
  },
];

/**
 * CouponsManager Component
 *
 * Dedicated admin control panel to create, edit, toggle, and DELETE promo coupons.
 */
export function CouponsManager() {
  const [coupons, setCoupons] = React.useState<CouponItem[]>(INITIAL_COUPONS);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editCode, setEditCode] = React.useState("");
  const [editDiscount, setEditDiscount] = React.useState("");

  // New coupon state
  const [newCode, setNewCode] = React.useState("");
  const [newDiscount, setNewDiscount] = React.useState("");
  const [newType, setNewType] = React.useState<"percentage" | "fixed_amount" | "free_delivery">("percentage");

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const newItem: CouponItem = {
      id: `cpn-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      discount: newDiscount.trim() || "10% OFF",
      discount_amount: 10,
      discount_type: newType,
      active: true,
    };

    setCoupons((prev) => [newItem, ...prev]);
    setNewCode("");
    setNewDiscount("");
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const startEdit = (coupon: CouponItem) => {
    setEditingId(coupon.id);
    setEditCode(coupon.code);
    setEditDiscount(coupon.discount);
  };

  const saveEdit = (id: string) => {
    if (!editCode.trim()) return;
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, code: editCode.trim().toUpperCase(), discount: editDiscount.trim() }
          : c
      )
    );
    setEditingId(null);
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-rose-500" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Coupon &amp; Offer Manager</h4>
            <p className="text-xs text-slate-500">Create, edit, toggle active status, or delete coupon codes.</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {coupons.length} Coupons Configured
        </span>
      </div>

      {/* Add New Coupon Form */}
      <form onSubmit={handleAddCoupon} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
        <span className="font-bold text-slate-800 block uppercase">Create New Promo Coupon</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            placeholder="COUPON CODE (e.g. FLASH25)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono uppercase font-bold"
          />
          <input
            type="text"
            required
            placeholder="Discount label (e.g. 25% OFF)"
            value={newDiscount}
            onChange={(e) => setNewDiscount(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
          >
            <option value="percentage">Percentage Discount</option>
            <option value="fixed_amount">Fixed Dollar Amount</option>
            <option value="free_delivery">Free Delivery Waived</option>
          </select>
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Coupon Code
          </Button>
        </div>
      </form>

      {/* Coupons Table List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-3">Coupon Code</th>
              <th className="p-3">Discount Details</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {coupons.map((c) => {
              const isEditing = editingId === c.id;
              return (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editCode}
                        onChange={(e) => setEditCode(e.target.value)}
                        className="px-2 py-1 border border-sky-400 rounded uppercase font-bold"
                      />
                    ) : (
                      <span>{c.code}</span>
                    )}
                  </td>
                  <td className="p-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editDiscount}
                        onChange={(e) => setEditDiscount(e.target.value)}
                        className="px-2 py-1 border border-sky-400 rounded"
                      />
                    ) : (
                      <span>{c.discount}</span>
                    )}
                  </td>
                  <td className="p-3 text-slate-500 capitalize">{c.discount_type.replace("_", " ")}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(c.id)}
                      className="cursor-pointer"
                    >
                      <Badge variant={c.active ? "success" : "secondary"}>
                        {c.active ? "Active" : "Disabled"}
                      </Badge>
                    </button>
                  </td>
                  <td className="p-3 text-right space-x-2 whitespace-nowrap">
                    {isEditing ? (
                      <>
                        <Button variant="primary" size="sm" onClick={() => saveEdit(c.id)}>
                          <Check className="h-3.5 w-3.5 mr-1" /> Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(c)}
                          title="Edit coupon details"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteCoupon(c.id)}
                          title="Delete coupon permanently"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
