"use client";

import * as React from "react";
import { CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SaveSettingsForm({
  title,
  description,
  isLoading,
  isSaving,
  error,
  saved,
  onSubmit,
  children,
}: {
  title: string;
  description: string;
  isLoading: boolean;
  isSaving: boolean;
  error: string;
  saved: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} className="min-w-0 bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <Button type="submit" variant="hero" size="sm" disabled={isSaving || isLoading} className="cursor-pointer text-xs shrink-0">
          <Save className="h-4 w-4 mr-1.5 shrink-0" />
          <span>{isSaving ? "Saving..." : saved ? "Saved" : `Save ${title}`}</span>
        </Button>
      </header>
      {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {saved && (
        <p role="status" className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          Saved successfully.
        </p>
      )}
      {children}
    </form>
  );
}

export function useSettingsSave() {
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  const save = async (operation: () => Promise<void>) => {
    setError("");
    setSaved(false);
    setIsSaving(true);
    try {
      await operation();
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Unable to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, error, saved, save };
}

export async function postSettings(item: Record<string, unknown>) {
  const response = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ section: "settings", item }),
  });
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.error || "Unable to save business settings.");
}
