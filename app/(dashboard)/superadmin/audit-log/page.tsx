"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AuditLogPage() {
  const { resolvedTheme } = useTheme();
  const { language, t } = useLanguage();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/audit-log")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setLogs(d.data);
        setLoading(false);
      });
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action?.toLowerCase().includes(search.toLowerCase()) ||
      l.entityType?.toLowerCase().includes(search.toLowerCase()),
  );

  const actionColors: Record<string, string> = {
    deactivate: "bg-red-100 text-red-700",
    reactivate: "bg-emerald-100 text-emerald-700",
    approve: "bg-blue-100 text-blue-700",
    reject: "bg-orange-100 text-orange-700",
  };

  const actionLabel = (action: string) => {
    if (action === "deactivate")
      return t("superadmin.auditLog.actions.deactivate");
    if (action === "reactivate")
      return t("superadmin.auditLog.actions.reactivate");
    if (action === "approve") return t("superadmin.auditLog.actions.approve");
    if (action === "reject") return t("superadmin.auditLog.actions.reject");
    return action;
  };

  return (
    <div className={`space-y-6 ${isKhmer ? "font-battambang" : ""}`}>
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {t("superadmin.auditLog.title")}
        </h1>
        <p
          className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {t("superadmin.auditLog.subtitle")}
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={t("superadmin.auditLog.filterPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm ${isDark ? "bg-[#161b22] border-white/10 text-white" : "bg-white border-slate-200"} focus:ring-2 focus:ring-violet-500/20 outline-none`}
        />
      </div>

      <div
        className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-slate-400 w-5 h-5" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={isDark ? "bg-white/5" : "bg-slate-50"}>
                  {[
                    t("superadmin.auditLog.table.timestamp"),
                    t("superadmin.auditLog.table.action"),
                    t("superadmin.auditLog.table.entity"),
                    t("superadmin.auditLog.table.entityId"),
                    t("superadmin.auditLog.table.ip"),
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-slate-400"
                    >
                      {t("superadmin.auditLog.empty")}
                    </td>
                  </tr>
                ) : (
                  filtered.map((log) => (
                    <tr
                      key={log.id}
                      className={`border-t ${isDark ? "border-white/5" : "border-slate-100"}`}
                    >
                      <td className="px-6 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${actionColors[log.action] || "bg-slate-100 text-slate-600"}`}
                        >
                          {actionLabel(log.action)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-500">
                        {log.entityType}
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-400 font-mono">
                        {log.entityId?.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-400">
                        {log.ipAddress || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
