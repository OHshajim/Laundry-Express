"use client";

import * as React from "react";
import { Sparkles, Plus, Trash2, ThermometerSnowflake } from "lucide-react";
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

export interface TemperatureConfig {
  id: string;
  name: string;
  type: "cold" | "warm" | "hot";
  price: number;
  description: string;
}

const INITIAL_DETERGENTS: DetergentConfig[] = [
  { id: "det-1", name: "Tide Original Power Pods", brand: "Tide", type: "pods", description: "3-in-1 detergent, stain remover, and color protector.", price: 0.0, in_stock: true },
  { id: "det-2", name: "Seventh Generation Eco-Plant", brand: "Seventh Generation", type: "liquid", description: "100% bio-based enzymes, zero artificial fragrances.", price: 0.0, in_stock: true },
  { id: "det-3", name: "All Free & Clear Powder", brand: "All", type: "powder", description: "Hypoallergenic powder formula recommended by dermatologists.", price: 0.0, in_stock: true },
];

const INITIAL_TEMPERATURES: TemperatureConfig[] = [
  { id: "temp-cold", name: "Eco Cold Cycle", type: "cold", price: 0.0, description: "Gentle on delicates, preserves vibrant fabric dyes." },
  { id: "temp-warm", name: "Balanced Warm Cycle", type: "warm", price: 0.0, description: "Everyday optimal temperature for linens and daily wear." },
  { id: "temp-hot", name: "Sanitizing Hot Cycle", type: "hot", price: 0.0, description: "Maximum sanitation cycle for towels, bedding, and workout gear." },
];

export function DetergentsManager() {
  const [activeCatalog, setActiveCatalog] = React.useState<"detergents" | "temperatures">("detergents");
  const [detergents, setDetergents] = React.useState<DetergentConfig[]>(INITIAL_DETERGENTS);
  const [temperatures, setTemperatures] = React.useState<TemperatureConfig[]>(INITIAL_TEMPERATURES);

  const [name, setName] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [detType, setDetType] = React.useState<"liquid" | "powder" | "pods">("liquid");
  const [tempType, setTempType] = React.useState<"cold" | "warm" | "hot">("cold");
  const [price, setPrice] = React.useState<number>(0);
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        if (data.detergents && data.detergents.length > 0) setDetergents(data.detergents);
        if (data.temperatures && data.temperatures.length > 0) setTemperatures(data.temperatures);
      })
      .catch(() => {});
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (activeCatalog === "detergents") {
      const newD: DetergentConfig = {
        id: `det-${Date.now()}`,
        name: name.trim(),
        brand: brand.trim() || "Standard",
        type: detType,
        price,
        description: description.trim() || "Laundry wash formulation.",
        in_stock: true,
      };
      setDetergents((prev) => [...prev, newD]);
      try {
        await fetch("/api/catalog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newD) });
      } catch {}
    } else {
      const newT: TemperatureConfig = {
        id: `temp-${Date.now()}`,
        name: name.trim(),
        type: tempType,
        price,
        description: description.trim() || "Water temperature wash cycle.",
      };
      setTemperatures((prev) => [...prev, newT]);
      try {
        await fetch("/api/catalog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newT, catalogType: "temperature" }) });
      } catch {}
    }

    setName("");
    setBrand("");
    setDescription("");
    setPrice(0);
  };

  const handleDelete = async (id: string) => {
    if (activeCatalog === "detergents") {
      setDetergents((prev) => prev.filter((d) => d.id !== id));
      try { await fetch(`/api/catalog?id=${encodeURIComponent(id)}`, { method: "DELETE" }); } catch {}
    } else {
      setTemperatures((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900">Detergent &amp; Temperature Catalog</h3>
          <p className="text-xs text-slate-500">Live database options for wash detergents and temperatures.</p>
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

      <form onSubmit={handleAdd} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
        <span className="font-bold text-slate-800 uppercase block">
          Add New {activeCatalog === "detergents" ? "Detergent Formula" : "Temperature Option"}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            required
            placeholder="Option Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
          />
          {activeCatalog === "detergents" && (
            <input
              type="text"
              placeholder="Brand (e.g. Tide)"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
            />
          )}
          {activeCatalog === "detergents" ? (
            <select
              value={detType}
              onChange={(e) => setDetType(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="liquid">Liquid</option>
              <option value="powder">Powder</option>
              <option value="pods">Pods</option>
            </select>
          ) : (
            <select
              value={tempType}
              onChange={(e) => setTempType(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="cold">Cold</option>
              <option value="warm">Warm</option>
              <option value="hot">Hot</option>
            </select>
          )}
          <input
            type="number"
            min={0}
            step="0.5"
            placeholder="Extra Price ($)"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
          />
        </div>

        <input
          type="text"
          placeholder="Description / Key Benefits"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
        />

        <div className="flex justify-end pt-1">
          <Button type="submit" variant="hero" size="sm" className="cursor-pointer">
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Save to Database</span>
          </Button>
        </div>
      </form>

      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        {activeCatalog === "detergents" ? (
          detergents.map((d) => (
            <div key={d.id} className="p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{d.name}</span>
                  <Badge variant="secondary">{d.brand}</Badge>
                  <span className="text-[11px] text-slate-400 capitalize">• {d.type}</span>
                </div>
                <p className="text-slate-500 mt-0.5">{d.description}</p>
                <span className="text-[11px] font-bold text-sky-700 mt-1 block">
                  {d.price > 0 ? `+${formatCurrency(d.price)}` : "Free / Included"}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleDelete(d.id)} className="cursor-pointer text-rose-600 hover:bg-rose-50 h-8">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))
        ) : (
          temperatures.map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{t.name}</span>
                  <Badge variant="secondary" className="capitalize">{t.type}</Badge>
                </div>
                <p className="text-slate-500 mt-0.5">{t.description}</p>
                <span className="text-[11px] font-bold text-sky-700 mt-1 block">
                  {t.price > 0 ? `+${formatCurrency(t.price)}` : "Free / Standard"}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleDelete(t.id)} className="cursor-pointer text-rose-600 hover:bg-rose-50 h-8">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
