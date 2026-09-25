"use client";

import * as React from "react";
import { Sparkles, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export interface DetergentConfig {
  id: string;
  name: string;
  brand: string;
  type: string;
  description: string;
  extra_cost: number;
  in_stock: boolean;
  is_active: boolean;
}

const INITIAL_DETERGENTS: DetergentConfig[] = [
  { id: "det-tide-pods", name: "Tide Original Power Pods", brand: "Tide", type: "Deep Stain Defense", description: "3-in-1 detergent, stain remover, and color protector.", extra_cost: 0.0, in_stock: true, is_active: true },
  { id: "det-eco-plant", name: "Seventh Generation Eco-Plant", brand: "Seventh Generation", type: "Plant-Based Biodegradable", description: "100% bio-based enzymes, zero artificial fragrances or dyes.", extra_cost: 0.0, in_stock: true, is_active: true },
  { id: "det-fragrance-free", name: "All Free & Clear Hypoallergenic", brand: "All", type: "Sensitive Skin & Baby Safe", description: "Dermatologist recommended for sensitive skin and allergies.", extra_cost: 0.0, in_stock: true, is_active: true },
];

/**
 * DetergentsManager Component
 * Admin catalog control for customer wash formulas.
 */
export function DetergentsManager() {
  const [detergents, setDetergents] = React.useState<DetergentConfig[]>(INITIAL_DETERGENTS);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const [editName, setEditName] = React.useState("");
  const [editType, setEditType] = React.useState("");
  const [editCost, setEditCost] = React.useState<number>(0);

  const [newName, setNewName] = React.useState("");
  const [newBrand, setNewBrand] = React.useState("");
  const [newType, setNewType] = React.useState("");
  const [newDesc, setNewDesc] = React.useState("");
  const [newCost, setNewCost] = React.useState<number>(0);

  const handleAddDetergent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newDet: DetergentConfig = {
      id: `det-${Date.now()}`,
      name: newName.trim(),
      brand: newBrand.trim() || "Premium",
      type: newType.trim() || "Specialty Wash",
      description: newDesc.trim() || "High-performance laundry detergent.",
      extra_cost: newCost,
      in_stock: true,
      is_active: true,
    };

    setDetergents((prev) => [...prev, newDet]);
    setNewName("");
    setNewBrand("");
    setNewType("");
    setNewDesc("");
    setNewCost(0);
  };

  const startEdit = (det: DetergentConfig) => {
    setEditingId(det.id);
    setEditName(det.name);
    setEditType(det.type);
    setEditCost(det.extra_cost);
  };

  const saveEdit = (id: string) => {
    setDetergents((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, name: editName.trim(), type: editType.trim(), extra_cost: editCost } : d
      )
    );
    setEditingId(null);
  };

  const toggleStock = (id: string) => {
    setDetergents((prev) =>
      prev.map((d) => (d.id === id ? { ...d, in_stock: !d.in_stock } : d))
    );
  };

  const handleDelete = (id: string) => {
    setDetergents((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-sky-600" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Detergent Catalog &amp; Formulations</h4>
            <p className="text-xs text-slate-500">Configure detergents available for customer selection during checkout.</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-500">{detergents.length} Formulas Active</span>
      </div>

      <form onSubmit={handleAddDetergent} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
        <span className="font-bold text-slate-800 block uppercase">Add New Detergent Option</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            required
            placeholder="Detergent Name (e.g. Lavender Organic)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
          />
          <input
            type="text"
            placeholder="Type (e.g. Aromatherapy Wash)"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
          />
          <input
            type="text"
            placeholder="Brand name"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
          />
          <input
            type="number"
            step="0.5"
            placeholder="Add-on Surcharge ($0 for Free)"
            value={newCost}
            onChange={(e) => setNewCost(parseFloat(e.target.value) || 0)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Detergent
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {detergents.map((det) => {
          const isEditing = editingId === det.id;
          return (
            <div key={det.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={det.in_stock ? "success" : "danger"}>
                    {det.in_stock ? "In Stock" : "Out of Stock"}
                  </Badge>
                  <span className="font-bold text-slate-700">
                    {det.extra_cost > 0 ? `+${formatCurrency(det.extra_cost)}` : "FREE Wash"}
                  </span>
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-2 py-1 border border-sky-400 rounded font-bold"
                    />
                    <input
                      type="text"
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      className="w-full px-2 py-1 border border-sky-400 rounded"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={editCost}
                      onChange={(e) => setEditCost(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-sky-400 rounded font-bold"
                    />
                  </div>
                ) : (
                  <>
                    <h5 className="font-bold text-slate-900 text-sm">{det.name}</h5>
                    <p className="text-sky-700 font-semibold text-[11px]">{det.type}</p>
                    <p className="text-slate-500 text-[11px] mt-1">{det.description}</p>
                  </>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleStock(det.id)}
                  className="text-[11px] font-semibold text-slate-600 hover:text-sky-600 cursor-pointer"
                >
                  {det.in_stock ? "Mark Sold Out" : "Mark In Stock"}
                </button>

                <div className="space-x-1">
                  {isEditing ? (
                    <>
                      <Button variant="primary" size="sm" onClick={() => saveEdit(det.id)}>
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => startEdit(det)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(det.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
