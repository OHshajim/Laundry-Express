"use client";

import * as React from "react";
import { HelpCircle, FileText, Plus, Trash2, Edit2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FaqOrTermItem {
  id: string;
  category: "faq" | "terms";
  title: string;
  subtitle?: string;
  description: string;
}

const INITIAL_ITEMS: FaqOrTermItem[] = [
  {
    id: "faq-1",
    category: "faq",
    title: "How does the doorstep pickup window work?",
    description: "Choose between **8am–12pm** or **1pm–6pm**. If you are home, our driver rings your bell. If away, leave your bags outside and confirm contactless pickup.",
  },
  {
    id: "faq-2",
    category: "faq",
    title: "How is free delivery calculated?",
    description: "Orders with **2 or more bags** receive **$0.00 FREE delivery**. Single bag orders have a standard $10.00 delivery fee.",
  },
  {
    id: "term-1",
    category: "terms",
    title: "24-Hour Turnaround Guarantee",
    subtitle: "Prompt next-day doorstep return",
    description: "We guarantee delivery back to your doorstep within **24 hours** from pickup. In the rare event of a weather delay, you receive an automatic **$15 account credit**.",
  },
  {
    id: "term-2",
    category: "terms",
    title: "Fabric Care & Damage Protection",
    subtitle: "Full replacement value warranty",
    description: "All laundry is inspected with *high-definition driver scale and sorting cameras*. Pre-existing garment flaws are logged before wash.",
  },
];

export function FaqsTermsManager() {
  const [items, setItems] = React.useState<FaqOrTermItem[]>(INITIAL_ITEMS);
  const [activeTab, setActiveTab] = React.useState<"faq" | "terms">("faq");
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setDescription("");
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    if (editingId) {
      setItems((prev) =>
        prev.map((it) => (it.id === editingId ? { ...it, title: title.trim(), subtitle: subtitle.trim(), description: description.trim() } : it))
      );
    } else {
      const newItem: FaqOrTermItem = {
        id: `${activeTab}-${Date.now()}`,
        category: activeTab,
        title: title.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
      };
      setItems((prev) => [...prev, newItem]);
    }

    resetForm();
  };

  const handleEdit = (it: FaqOrTermItem) => {
    setEditingId(it.id);
    setTitle(it.title);
    setSubtitle(it.subtitle || "");
    setDescription(it.description);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const filteredItems = items.filter((it) => it.category === activeTab);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900">FAQs &amp; Terms Guarantees Manager</h3>
          <p className="text-xs text-slate-500">Configure customer questions and service terms with markdown formatting.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setActiveTab("faq"); resetForm(); }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "faq" ? "bg-white text-primary shadow-xs" : "text-slate-600"
              }`}
            >
              FAQs
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("terms"); resetForm(); }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "terms" ? "bg-white text-primary shadow-xs" : "text-slate-600"
              }`}
            >
              Terms &amp; Guarantees
            </button>
          </div>

          {!isAdding && (
            <Button variant="hero" size="sm" onClick={() => setIsAdding(true)} className="cursor-pointer text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Add {activeTab === "faq" ? "FAQ" : "Term"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Add / Edit Form */}
      {isAdding && (
        <form onSubmit={handleSave} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <span className="font-bold text-slate-800 block uppercase">
            {editingId ? "Edit Item" : `Add New ${activeTab === "faq" ? "FAQ" : "Term & Guarantee"}`}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. 24-Hour Turnaround Guarantee"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Subtitle for (Terms)</label>
              <input
                type="text"
                placeholder="e.g. Prompt doorstep return"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 mb-1 font-semibold">
                Description (Supports Markdown: **bold**, *italic*, bullet points) *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Write detailed explanation or terms conditions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={resetForm} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" variant="hero" size="sm" className="cursor-pointer">
              Save Item
            </Button>
          </div>
        </form>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {filteredItems.map((it) => (
          <div key={it.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{it.title}</span>
                {it.subtitle && (
                  <span className="text-[11px] text-primary font-semibold">({it.subtitle})</span>
                )}
              </div>
              <p className="text-slate-600 leading-relaxed font-sans">{it.description}</p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button variant="outline" size="sm" onClick={() => handleEdit(it)} className="h-7 px-2 cursor-pointer">
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(it.id)} className="h-7 px-2 cursor-pointer">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
