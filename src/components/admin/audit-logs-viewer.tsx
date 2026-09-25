"use client";

import * as React from "react";
import { Activity, User, Shield, CreditCard, Sparkles, Filter } from "lucide-react";
import type { ActivityLog } from "@/types";
import { formatDate } from "@/lib/utils";

interface AuditLogsViewerProps {
  logs: ActivityLog[];
}

export function AuditLogsViewer({ logs }: AuditLogsViewerProps) {
  const [filterAction, setFilterAction] = React.useState<string>("all");

  const filteredLogs = React.useMemo(() => {
    if (filterAction === "all") return logs;
    return logs.filter((l) => l.action.toLowerCase().includes(filterAction));
  }, [logs, filterAction]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Master Platform Audit Trail</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable, dual-sided activity history logging user events, admin price changes, and payments.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">All Events ({logs.length})</option>
            <option value="order">Orders</option>
            <option value="payment">Payments</option>
            <option value="pricing">Price Adjustments</option>
            <option value="review">Reviews</option>
          </select>
        </div>
      </div>

      {/* Log Feed */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs divide-y divide-slate-100 text-xs">
        {filteredLogs.map((log) => {
          const isSystem = log.user_role === "system";
          const isAdmin = log.user_role === "admin";

          return (
            <div key={log.id} className="p-4 hover:bg-slate-50/70 transition-colors flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isAdmin
                      ? "bg-rose-100 text-rose-700"
                      : isSystem
                      ? "bg-slate-100 text-slate-700"
                      : "bg-sky-100 text-sky-700"
                  }`}
                >
                  {isAdmin ? <Shield className="h-4 w-4" /> : isSystem ? <Activity className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.description}</span>
                    <span
                      className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold uppercase ${
                        isAdmin
                          ? "bg-rose-100 text-rose-800"
                          : isSystem
                          ? "bg-slate-100 text-slate-800"
                          : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {log.user_role}
                    </span>
                  </div>
                  <p className="text-slate-500 font-mono text-[11px]">
                    Action: {log.action} • Entity: {log.entity_type} {log.entity_id ? `(#${log.entity_id})` : ""}
                  </p>
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <p className="text-[11px] text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded-md inline-block mt-1">
                      {JSON.stringify(log.metadata)}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0 text-[11px] text-slate-400">
                <span>{formatDate(log.created_at)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
