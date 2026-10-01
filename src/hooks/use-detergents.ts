"use client";

import * as React from "react";
import type { DetergentItem } from "@/lib/services/catalog-service";

interface CatalogResponse {
  success: boolean;
  detergents?: DetergentItem[];
  error?: string;
}

export function useDetergents() {
  const [detergents, setDetergents] = React.useState<DetergentItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json() as CatalogResponse;
        if (!response.ok || !data.success) throw new Error(data.error || "Unable to load detergent options.");
        return data;
      })
      .then((data) => {
        if (!cancelled) setDetergents(data.detergents ?? []);
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Unable to load detergent options.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { detergents, isLoading, error };
}
