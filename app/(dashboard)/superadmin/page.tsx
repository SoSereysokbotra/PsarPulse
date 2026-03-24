"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  CreditCard,
  ScrollText,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Settings,
  MoreHorizontal,
  Lock,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
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
  const isDark = resolvedTheme === "dark";
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/superadmin/admins")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setAdmins(d.data);
      })
      .catch(() => {
        // Fallback dummy data for visualization
        setAdmins([
          {
            id: 1,
            userFullName: "John Doe",
            userEmail: "john@psarpulse.com",
            role: "super_admin",
            canManageVendors: true,
            canManageUsers: true,
            canManagePlans: true,
          },
          {
            id: 2,
            userFullName: "Jane Smith",
            userEmail: "jane@psarpulse.com",
            role: "admin",
            canManageVendors: true,
            canManageUsers: false,
            canManagePlans: false,
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1
            className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Platform Overview
          </h1>
          <p
            className={`text-sm mt-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Monitor global metrics, manage administrators, and configure system
            settings.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Admin Accounts"
          value={admins.length || "-"}
          sub="Active platform administrators"
          icon={ShieldCheck}
          colorClass="bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
          href="/superadmin/permissions"
          isDark={isDark}
        />
        <StatCard
          title="Active Plans"
          value="3"
          sub="Free · Pro · Premium"
          icon={CreditCard}
          colorClass="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
          href="/superadmin/plans"
          isDark={isDark}
        />
        <StatCard
          title="Platform Settings"
          value="Global"
          sub="Currency, tax, & locale configs"
          icon={Settings}
          colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
          href="/superadmin/settings"
          isDark={isDark}
        />
        <StatCard
          title="Audit Events"
          value="12.4k"
          sub="System events in the last 24h"
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
                System Administrators
              </h2>
              <p
                className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                Manage access and roles
              </p>
            </div>
            <Link
              href="/superadmin/permissions"
              className="text-sm px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              Manage Roles
            </Link>
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
                    Administrator
                  </th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">
                    Access Scope
                  </th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">
                    Actions
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
                      Loading administrators...
                    </td>
                  </tr>
                ) : admins.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      No admin accounts found.
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
                              {admin.userFullName || "Unknown User"}
                            </p>
                            <p
                              className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
                            >
                              {admin.userEmail || "No email"}
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
                            ? "Super Admin"
                            : "Admin"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {[
                            admin.canManageVendors && "Vendors",
                            admin.canManageUsers && "Users",
                            admin.canManagePlans && "Plans",
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
            Quick Actions
          </h3>
          <div className="space-y-3">
            {[
              {
                label: "Security Config",
                href: "/superadmin/security",
                desc: "MFA & Session control",
                icon: Lock,
              },
              {
                label: "Plans & Pricing",
                href: "/superadmin/plans",
                desc: "Manage subscription tiers",
                icon: CreditCard,
              },
              {
                label: "Platform Settings",
                href: "/superadmin/settings",
                desc: "Currency, tax, locale",
                icon: Settings,
              },
              {
                label: "Switch to Admin",
                href: "/admin",
                desc: "View as standard admin",
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
