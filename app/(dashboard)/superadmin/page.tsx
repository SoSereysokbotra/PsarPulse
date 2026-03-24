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
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import Link from "next/link";

function KpiCard({ title, value, sub, icon, color, href, isDark }: any) {
  return (
    <Link
      href={href || "#"}
      className={`block rounded-xl border p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden ${isDark ? "bg-[#161b22] border-white/10 hover:border-violet-500/30" : "bg-white border-slate-200 hover:border-violet-300"}`}
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "bg-violet-600/5" : "bg-violet-50/60"}`}
      />
      <div className="relative">
        <div className="flex justify-between items-start mb-3">
          <p
            className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {title}
          </p>
          <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        </div>
        <p
          className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {value}
        </p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
    </Link>
  );
}

export default function SuperadminPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [admins, setAdmins] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/superadmin/admins")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setAdmins(d.data);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
        >
          Superadmin Control Panel
        </h1>
        <p
          className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          Full platform control — RBAC, security, settings, and global audit
          access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Admin Accounts"
          value={admins.length}
          sub="Platform administrators"
          icon={<ShieldCheck className="w-5 h-5 text-violet-600" />}
          color="bg-violet-50 ring-1 ring-violet-100"
          href="/superadmin/permissions"
          isDark={isDark}
        />
        <KpiCard
          title="Active Plans"
          value="3"
          sub="Free · Pro · Premium"
          icon={<CreditCard className="w-5 h-5 text-indigo-600" />}
          color="bg-indigo-50 ring-1 ring-indigo-100"
          href="/superadmin/plans"
          isDark={isDark}
        />
        <KpiCard
          title="Platform Settings"
          value="–"
          sub="Currency, tax, locale"
          icon={<Settings className="w-5 h-5 text-emerald-600" />}
          color="bg-emerald-50 ring-1 ring-emerald-100"
          href="/superadmin/settings"
          isDark={isDark}
        />
        <KpiCard
          title="Audit Events"
          value="–"
          sub="Last 24 hours"
          icon={<ScrollText className="w-5 h-5 text-amber-600" />}
          color="bg-amber-50 ring-1 ring-amber-100"
          href="/superadmin/audit-log"
          isDark={isDark}
        />
      </div>

      {/* Admin list */}
      <div
        className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}
      >
        <div
          className={`px-6 py-4 border-b flex justify-between items-center ${isDark ? "border-white/5" : "border-slate-100"}`}
        >
          <h2
            className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Admin Accounts
          </h2>
          <Link
            href="/superadmin/permissions"
            className="text-xs text-violet-500 hover:text-violet-400 font-medium"
          >
            Manage RBAC →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? "bg-white/5" : "bg-slate-50"}>
                {["Name", "Email", "Role", "Permissions"].map((h) => (
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
              {admins.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-slate-400 text-sm"
                  >
                    No admins found
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className={`border-t ${isDark ? "border-white/5 hover:bg-white/3" : "border-slate-100 hover:bg-slate-50"}`}
                  >
                    <td
                      className={`px-6 py-4 font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}
                    >
                      {admin.userFullName || "–"}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {admin.userEmail || "–"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${admin.role === "super_admin" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`}
                      >
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {[
                        admin.canManageVendors && "Vendors",
                        admin.canManageUsers && "Users",
                        admin.canManagePlans && "Plans",
                      ]
                        .filter(Boolean)
                        .join(" · ") || "None"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            label: "Invitation Center",
            href: "/superadmin/invitations",
            desc: "Invite Admins and VIP vendors",
          },
          {
            label: "RBAC Control",
            href: "/superadmin/permissions",
            desc: "Assign role flags to admins",
          },
          {
            label: "Plans & Pricing",
            href: "/superadmin/plans",
            desc: "Manage subscription tiers",
          },
          {
            label: "Platform Settings",
            href: "/superadmin/settings",
            desc: "Currency, tax, locale",
          },
          {
            label: "Security Config",
            href: "/superadmin/security",
            desc: "MFA, sessions, token revoke",
          },
          {
            label: "Full Audit Log",
            href: "/superadmin/audit-log",
            desc: "All platform events",
          },
          {
            label: "Admin Dashboard",
            href: "/admin",
            desc: "Switch to admin view",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl border p-4 hover:shadow-md transition-all group ${isDark ? "bg-[#161b22] border-white/10 hover:border-violet-500/30" : "bg-white border-slate-200 hover:border-violet-300"}`}
          >
            <p
              className={`font-semibold text-sm mb-1 group-hover:text-violet-500 transition-colors ${isDark ? "text-white" : "text-slate-800"}`}
            >
              {item.label}
            </p>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
