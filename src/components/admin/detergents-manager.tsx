"use client";

import * as React from "react";
import { Sparkles, Plus, Trash2, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export interface DetergentConfig {
  id: string;
  name: string;
  brand: string;
  type: "liquid" | "powder" | "pods";
  description: string;
  price: number;
  in_stock: boolean;
}

export function DetergentsManager() {
  const [detergents, setDetergents] = React.useState<DetergentConfig[]>([]);
  const [name, setName] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [detType, setDetType] = React.useState<"liquid" | "powder" | "pods">("liquid");
  const [price, setPrice] = React.useState<string>("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.detergents) && data.detergents.length > 0) {
          setDetergents(data.detergents);
        }
      })
      .catch(() => {});
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const numPrice = parseFloat(price) || 0;
    const newD: DetergentConfig = {
      id: `det-${Date.now()}`,
      name: name.trim(),
      brand: brand.trim() || "Standard",
      type: detType,
      price: numPrice,
      description: description.trim() || "Laundry wash formulation.",
      in_stock: true,
    };

    setDetergents((prev) => [...prev, newD]);
    setName("");
    setBrand("");
    setDescription("");
    setPrice("");

    try {
      await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newD),
      });
    } catch {}
  };

  const handleToggleStock = async (id: string) => {
    const existing = detergents.find((d) => d.id === id);
    if (!existing) return;
    const updated = { ...existing, in_stock: !existing.in_stock };
    setDetergents((prev) => prev.map((d) => (d.id === id ? updated : d)));
    try {
      await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch {}
  };

  const handleDelete = async (id: string) => {
    setDetergents((prev) => prev.filter((d) => d.id !== id));
    try {
      await fetch(`/api/catalog?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {}
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-base font-black text-slate-900">Detergent Catalog Manager</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage live laundry detergent options. All loads are automatically washed with cold water for optimal fabric preservation and eco-safety.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {detergents.length} Formulas Active
        </span>
      </div>

      {/* Add Detergent Form */}
      <form onSubmit={handleAdd} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
        <span className="font-black text-slate-800 uppercase tracking-wider block">Add New Detergent Option</span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detergent Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Tide Pods Clean Breeze"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
            <input
              type="text"
              placeholder="e.g. Tide, Persil, Free & Clear"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detergent Format</label>
            <select
              value={detType}
              onChange={(e) => setDetType(e.target.value as "liquid" | "powder" | "pods")}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="liquid">Liquid Detergent</option>
              <option value="pods">Convenient Pods</option>
              <option value="powder">Heavy Powder</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Extra Fee ($)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              placeholder="0.00 (Free)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Formula Notes / Fragrance Description</label>
          <input
            type="text"
            placeholder="e.g. Hypoallergenic formula, gentle on sensitive skin"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex justify-end pt-1">
          <Button type="submit" variant="hero" size="sm" className="cursor-pointer">
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Save Formula to Database</span>
          </Button>
        </div>
      </form>

      {/* Detergents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {detergents.map((d) => (
          <div key={d.id} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between gap-3 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 text-sm">{d.name}</span>
                <Badge variant={d.in_stock ? "success" : "secondary"} className="text-[10px]">
                  {d.in_stock ? "In Stock" : "Unavailable"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">{d.brand} • <span className="capitalize">{d.type}</span></p>
              <p className="text-xs text-slate-600 line-clamp-2">{d.description}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="font-black text-slate-900">
                {d.price > 0 ? `+${formatCurrency(d.price)}` : "Included Free"}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleToggleStock(d.id)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                    d.in_stock ? "text-slate-600 hover:bg-slate-100" : "text-emerald-700 bg-emerald-50"
                  }`}
                >
                  {d.in_stock ? "Mark Out" : "Enable"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(d.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  title="Delete detergent"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetergentsManager;
