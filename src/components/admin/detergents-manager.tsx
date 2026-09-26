"use client";

import * as React from "react";
import { Sparkles, Plus, Trash2, Edit2, Check, X, ThermometerSnowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export interface DetergentConfig {
  id: string;
  name: string;
  brand: string;
  type: "liquid" | "powder";
  description: string;
  price: number;
  in_stock: boolean;
}

export interface TemperatureConfig {
  id: string;
  name: string;
  type: "cold" | "warm" | "hot";
  price: number;
  description: string;
}

const INITIAL_DETERGENTS: DetergentConfig[] = [
  { id: "det-1", name: "Tide Original Power Pods", brand: "Tide", type: "liquid", description: "3-in-1 detergent, stain remover, and color protector.", price: 0.0, in_stock: true },
  { id: "det-2", name: "Seventh Generation Eco-Plant", brand: "Seventh Generation", type: "liquid", description: "100% bio-based enzymes, zero artificial fragrances.", price: 0.0, in_stock: true },
  { id: "det-3", name: "All Free & Clear Powder", brand: "All", type: "powder", description: "Hypoallergenic powder formula recommended by dermatologists.", price: 0.0, in_stock: true },
];

const INITIAL_TEMPERATURES: TemperatureConfig[] = [
  { id: "temp-cold", name: "Eco Cold Cycle", type: "cold", price: 0.0, description: "Gentle on delicates, preserves vibrant fabric dyes." },
  { id: "temp-warm", name: "Balanced Warm Cycle", type: "warm", price: 0.0, description: "Everyday optimal temperature for linens and daily wear." },
  { id: "temp-hot", name: "Sanitizing Hot Cycle", type: "hot", price: 0.0, description: "Maximum sanitation cycle for towels, bedding, and workout gear." },
];

/**
 * DetergentsManager Component
 * Implements AGENTS.md 6.f:
 * Detergent Catalog & Temperature Catalog (add, edit, delete, NO images).
 */
export function DetergentsManager() {
  const [activeCatalog, setActiveCatalog] = React.useState<"detergents" | "temperatures">("detergents");
  const [detergents, setDetergents] = React.useState<DetergentConfig[]>(INITIAL_DETERGENTS);
  const [temperatures, setTemperatures] = React.useState<TemperatureConfig[]>(INITIAL_TEMPERATURES);

  // Form states
  const [name, setName] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [detType, setDetType] = React.useState<"liquid" | "powder">("liquid");
  const [tempType, setTempType] = React.useState<"cold" | "warm" | "hot">("cold");
  const [price, setPrice] = React.useState<number>(0);
  const [description, setDescription] = React.useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (activeCatalog === "detergents") {
      const newD: DetergentConfig = {
        id: `det-${Date.now()}`,
        name: name.trim(),
        brand: brand.trim() || "Standard",
        type: detType,
        price,
        description: description.trim() || "High efficiency laundry wash formulation.",
        in_stock: true,
      };
      setDetergents((prev) => [...prev, newD]);
    } else {
      const newT: TemperatureConfig = {
        id: `temp-${Date.now()}`,
        name: name.trim(),
        type: tempType,
        price,
        description: description.trim() || "Water temperature wash cycle.",
      };
      setTemperatures((prev) => [...prev, newT]);
    }

    setName("");
    setBrand("");
    setDescription("");
    setPrice(0);
  };

  const handleDelete = (id: string) => {
    if (activeCatalog === "detergents") {
      setDetergents((prev) => prev.filter((d) => d.id !== id));
    } else {
      setTemperatures((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900">Detergent &amp; Temperature Catalog</h3>
          <p className="text-xs text-slate-500">Manage available wash formulas and temperature options (Zero image overhead).</p>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-slate-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveCatalog("detergents")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeCatalog === "detergents" ? "bg-white text-primary shadow-xs" : "text-slate-600"
            }`}
          >
            Detergents ({detergents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCatalog("temperatures")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeCatalog === "temperatures" ? "bg-white text-primary shadow-xs" : "text-slate-600"
            }`}
          >
            Temperatures ({temperatures.length})
          </button>
        </div>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
        <span className="font-bold text-slate-800 block uppercase">
          Add New {activeCatalog === "detergents" ? "Detergent Formula" : "Wash Temperature"}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            required
            placeholder="Name (e.g. Tide Pods)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
          />

          {activeCatalog === "detergents" ? (
            <>
              <input
                type="text"
                placeholder="Brand (e.g. Tide)"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
              <select
                value={detType}
                onChange={(e) => setDetType(e.target.value as "liquid" | "powder")}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold"
              >
                <option value="liquid">Liquid</option>
                <option value="powder">Powder</option>
              </select>
            </>
          ) : (
            <select
              value={tempType}
              onChange={(e) => setTempType(e.target.value as "cold" | "warm" | "hot")}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold"
            >
              <option value="cold">Cold</option>
              <option value="warm">Warm</option>
              <option value="hot">Hot</option>
            </select>
          )}

          <input
            type="number"
            step="0.5"
            placeholder="Price Surcharge ($0 for Free)"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
          />

          <div className="sm:col-span-2 md:col-span-4">
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="hero" size="sm" className="cursor-pointer">
            <Plus className="h-4 w-4 mr-1" /> Add to Catalog
          </Button>
        </div>
      </form>

      {/* Catalog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {activeCatalog === "detergents"
          ? detergents.map((d) => (
              <div key={d.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold">
                      {d.type}
                    </Badge>
                    <span className="font-bold text-slate-700">{d.price > 0 ? `+${formatCurrency(d.price)}` : "FREE"}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{d.name}</h4>
                  <span className="text-[11px] text-primary font-semibold block">{d.brand}</span>
                  <p className="text-slate-500 text-[11px] mt-1">{d.description}</p>
                </div>
                <div className="flex justify-end pt-2 border-t border-slate-200/80">
                  <Button variant="danger" size="sm" onClick={() => handleDelete(d.id)} className="h-7 px-2 cursor-pointer">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          : temperatures.map((t) => (
              <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold">
                      {t.type}
                    </Badge>
                    <span className="font-bold text-slate-700">{t.price > 0 ? `+${formatCurrency(t.price)}` : "FREE"}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-slate-500 text-[11px] mt-1">{t.description}</p>
                </div>
                <div className="flex justify-end pt-2 border-t border-slate-200/80">
                  <Button variant="danger" size="sm" onClick={() => handleDelete(t.id)} className="h-7 px-2 cursor-pointer">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
