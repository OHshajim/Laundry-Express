"use client";

import * as React from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface SavedAddress {
  id: string;
  label: string;
  street: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export function SettingsAddresses() {
  const [addresses, setAddresses] = React.useState<SavedAddress[]>([]);
  const [coverageAreas, setCoverageAreas] = React.useState<string[]>([
    "Lake in the Hills (60156)", "Algonquin (60102)", "Crystal Lake (60014)", "Huntley (60142)", "Carpentersville (60110)", "Dundee (60118)", "Elgin (60120)"
  ]);
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [label, setLabel] = React.useState("Home");
  const [street, setStreet] = React.useState("");
  const [apt, setApt] = React.useState("");
  const [selectedArea, setSelectedArea] = React.useState("");
  const [city, setCity] = React.useState("Lake in the Hills");
  const [state, setState] = React.useState("IL");
  const [zip, setZip] = React.useState("60156");
  const [isDefault, setIsDefault] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/user/addresses").then((r) => r.json()).then((data) => {
      if (Array.isArray(data.addresses)) {
        setAddresses(data.addresses.map((a: any) => ({
          id: a.id, label: a.label || "Home", street: a.street_address, apt: a.apt_unit,
          city: a.city, state: a.state || "IL", zip: a.zip_code, isDefault: a.is_default || false,
        })));
      }
    }).catch(() => {});

    fetch("/api/content?type=settings").then((r) => r.json()).then((data) => {
      if (Array.isArray(data.settings?.delivery_zones) && data.settings.delivery_zones.length > 0) {
        setCoverageAreas(data.settings.delivery_zones);
      }
    }).catch(() => {});
  }, []);

  const handleAreaSelect = (areaStr: string) => {
    setSelectedArea(areaStr);
    const match = areaStr.match(/^(.+?)(?:\s*\(([0-9]{5})\))?$/);
    if (match) {
      setCity(match[1].trim());
      if (match[2]) setZip(match[2].trim());
    }
  };

  const resetForm = () => {
    setLabel("Home"); setStreet(""); setApt(""); setSelectedArea("");
    setCity("Lake in the Hills"); setState("IL"); setZip("60156");
    setIsDefault(false); setIsAdding(false); setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !city.trim() || !zip.trim()) return;

    const newAddr: SavedAddress = {
      id: editingId || `addr-${Date.now()}`,
      label, street: street.trim(), apt: apt.trim() || undefined,
      city: city.trim(), state: state.trim(), zip: zip.trim(), isDefault,
    };

    setAddresses((prev) => (editingId ? prev.map((a) => (a.id === editingId ? newAddr : a)) : [newAddr, ...prev]));

    try {
      await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newAddr.id, label: newAddr.label, street_address: newAddr.street,
          apt_unit: newAddr.apt, city: newAddr.city, state: newAddr.state,
          zip_code: newAddr.zip, is_default: newAddr.isDefault,
        }),
      });
    } catch {}
    resetForm();
  };

  const handleStartEdit = (addr: SavedAddress) => {
    setEditingId(addr.id); setLabel(addr.label); setStreet(addr.street);
    setApt(addr.apt || ""); setCity(addr.city); setState(addr.state);
    setZip(addr.zip); setSelectedArea(`${addr.city} (${addr.zip})`);
    setIsDefault(addr.isDefault); setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    try { await fetch(`/api/user/addresses?id=${encodeURIComponent(id)}`, { method: "DELETE" }); } catch {}
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900">Saved Delivery Addresses</h3>
          <p className="text-xs text-slate-500">Pick from our verified service coverage areas and add your doorstep details.</p>
        </div>
        {!isAdding && (
          <Button size="sm" variant="hero" onClick={() => setIsAdding(true)} className="cursor-pointer text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" /><span>Add New Address</span>
          </Button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">1. Select Covered Service Area *</label>
            <select
              value={selectedArea}
              onChange={(e) => handleAreaSelect(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
              required
            >
              <option value="">-- Choose Active Service Municipality --</option>
              {coverageAreas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Address Label</label>
              <input type="text" required placeholder="e.g. Home, Office" value={label} onChange={(e) => setLabel(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Street Address *</label>
              <input type="text" required placeholder="e.g. 742 Evergreen Terrace" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Apt, Suite, Unit (optional)</label>
              <input type="text" placeholder="e.g. Apt 4B" value={apt} onChange={(e) => setApt(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">City</label>
                <input type="text" readOnly value={city} className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-slate-100 font-medium" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">State</label>
                <input type="text" readOnly value={state} className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-slate-100 font-medium" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">ZIP</label>
                <input type="text" readOnly value={zip} className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-slate-100 font-medium" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="rounded text-primary" />
              <span className="font-semibold text-slate-700">Set as default pickup location</span>
            </label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={resetForm} className="cursor-pointer">Cancel</Button>
              <Button type="submit" variant="hero" size="sm" className="cursor-pointer">Save Address</Button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {addresses.length === 0 && !isAdding && (
          <div className="p-6 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-xs">
            No saved addresses yet. Click &quot;Add New Address&quot; above to add your primary pickup doorstep.
          </div>
        )}
        {addresses.map((a) => (
          <div key={a.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-xs">{a.label}</span>
                {a.isDefault && <Badge variant="secondary">Default</Badge>}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{a.street}{a.apt ? `, ${a.apt}` : ""}, {a.city}, {a.state} {a.zip}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => handleStartEdit(a)} className="h-7 w-7 p-0 cursor-pointer">
                <Edit2 className="h-3.5 w-3.5 text-slate-500" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(a.id)} className="h-7 w-7 p-0 cursor-pointer text-rose-600">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
