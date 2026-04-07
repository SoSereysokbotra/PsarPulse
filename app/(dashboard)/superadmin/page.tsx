"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  CreditCard,
  ScrollText,
  ArrowUpRight,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Link from "next/link";

// Renamed and styled to match your Admin StatCard
function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  colorClass,
  href,
  isDark,
}: any) {
  return (
    <Link
      href={href || "#"}
      className={`block rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden ${isDark ? "bg-[#161b22] border-white/10 hover:border-violet-500/50" : "bg-white border-slate-200 hover:border-violet-300"}`}
    >
      <div
        className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ${colorClass.split(" ")[0]}`}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl ${colorClass}`}>
            <Icon className="w-6 h-6" />
          </div>
          <ArrowUpRight
            className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "text-violet-400" : "text-violet-500"}`}
          />
        </div>
        <div>
          <h3
            className={`text-3xl font-bold tracking-tight mb-1 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {value}
          </h3>
          <p
            className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {title}
          </p>
          {sub && (
            <p
              className={`text-xs mt-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}
            >
              {sub}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function SuperadminPage() {
  const { resolvedTheme } = useTheme();
  const { language, t } = useLanguage();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";
  const [admins, setAdmins] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/superadmin/admins").then((r) => r.json()),
      fetch("/api/superadmin/plans").then((r) => r.json()),
      fetch("/api/admin/audit-log").then((r) => r.json()),
    ])
      .then(([adminsData, plansData, auditLogsData]) => {
        if (adminsData.success) setAdmins(adminsData.data);
        if (plansData.success) setPlans(plansData.data);
        if (auditLogsData.success) setAuditLogs(auditLogsData.data);
      })
      .catch((err) => {
        console.error("Failed to fetch superadmin overview data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ${isKhmer ? "font-battambang" : ""}`}
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1
            className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {t("superadmin.overview.title")}
          </h1>
          <p
            className={`text-sm mt-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {t("superadmin.overview.subtitle")}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title={t("superadmin.overview.cards.adminAccounts")}
          value={admins.length || "-"}
          sub={t("superadmin.overview.cards.adminAccountsSub")}
          icon={ShieldCheck}
          colorClass="bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
          href="#"
          isDark={isDark}
        />
        <StatCard
          title={t("superadmin.overview.cards.activePlans")}
          value={plans.length.toString()}
          sub={t("superadmin.overview.cards.activePlansSub")}
          icon={CreditCard}
          colorClass="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
          href="/superadmin/plans"
          isDark={isDark}
        />
        <StatCard
          title={t("superadmin.overview.cards.platformSettings")}
          value={t("superadmin.overview.cards.global")}
          sub={t("superadmin.overview.cards.platformSettingsSub")}
          icon={Settings}
          colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
          href="/superadmin/settings"
          isDark={isDark}
        />
        <StatCard
          title={t("superadmin.overview.cards.auditEvents")}
          value={
            auditLogs.length > 99 ? "99+" : auditLogs.length.toString() || "-"
          }
          sub={t("superadmin.overview.cards.auditEventsSub")}
          icon={ScrollText}
          colorClass="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
          href="/superadmin/audit-log"
          isDark={isDark}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Admin Table Section */}
        <div
          className={`lg:col-span-2 rounded-2xl border shadow-sm overflow-hidden flex flex-col ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}
        >
          <div
            className={`px-6 py-5 border-b flex justify-between items-center ${isDark ? "border-white/5" : "border-slate-100"}`}
          >
            <div>
              <h2
                className={`font-semibold text-lg ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {t("superadmin.overview.systemAdministrators")}
              </h2>
              <p
                className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                {t("superadmin.overview.manageAccess")}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead
                className={
                  isDark
                    ? "bg-white/5 text-slate-400"
                    : "bg-slate-50 text-slate-500"
                }
              >
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">
                    {t("superadmin.overview.table.administrator")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">
                    {t("superadmin.overview.table.role")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">
                    {t("superadmin.overview.table.accessScope")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">
                    {t("superadmin.overview.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-100"}`}
              >
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      {t("superadmin.overview.loadingAdministrators")}
                    </td>
                  </tr>
                ) : admins.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      {t("superadmin.overview.noAdmins")}
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className={`group transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50"}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
                            {admin.userFullName?.charAt(0) || "A"}
                          </div>
                          <div>
                            <p
                              className={`font-medium ${isDark ? "text-slate-200" : "text-slate-900"}`}
                            >
                              {admin.userFullName ||
                                t("superadmin.overview.unknownUser")}
                            </p>
                            <p
                              className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
                            >
                              {admin.userEmail ||
                                t("superadmin.overview.noEmail")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            admin.role === "super_admin"
                              ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                          }`}
                        >
                          {admin.role === "super_admin"
                            ? t("superadmin.overview.roles.superAdmin")
                            : t("superadmin.overview.roles.admin")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {[
                            admin.canManageVendors &&
                              t("superadmin.overview.scopes.vendors"),
                            admin.canManageUsers &&
                              t("superadmin.overview.scopes.users"),
                            admin.canManagePlans &&
                              t("superadmin.overview.scopes.plans"),
                          ]
                            .filter(Boolean)
                            .map((scope) => (
                              <span
                                key={scope}
                                className={`px-2 py-0.5 rounded text-[10px] font-medium border ${isDark ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600 bg-white"}`}
                              >
                                {scope}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className={`p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all ${isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-200 text-slate-600"}`}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div
          className={`rounded-2xl border shadow-sm p-6 ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}
        >
          <h3
            className={`font-semibold text-lg mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {t("superadmin.overview.quickActions")}
          </h3>
          <div className="space-y-3">
            {[
              {
                label: t("superadmin.sidebar.plansPricing"),
                href: "/superadmin/plans",
                desc: t("superadmin.overview.quickActionDesc.plans"),
                icon: CreditCard,
              },
              {
                label: t("superadmin.overview.cards.platformSettings"),
                href: "/superadmin/settings",
                desc: t("superadmin.overview.quickActionDesc.settings"),
                icon: Settings,
              },
              {
                label: t("superadmin.overview.switchToAdmin"),
                href: "/admin",
                desc: t("superadmin.overview.quickActionDesc.switchToAdmin"),
                icon: Users,
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-start gap-4 p-3 rounded-xl border transition-all group ${isDark ? "border-white/5 hover:bg-white/5 hover:border-violet-500/30" : "border-slate-100 hover:bg-slate-50 hover:border-violet-200"}`}
              >
                <div
                  className={`p-2 rounded-lg mt-0.5 ${isDark ? "bg-slate-800 text-slate-400 group-hover:text-violet-400 group-hover:bg-violet-500/10" : "bg-slate-100 text-slate-500 group-hover:text-violet-600 group-hover:bg-violet-50"}`}
                >
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <p
                    className={`font-semibold text-sm transition-colors ${isDark ? "text-slate-200 group-hover:text-white" : "text-slate-800 group-hover:text-slate-900"}`}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${isDark ? "text-slate-500" : "text-slate-500"}`}
                  >
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
