"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const PERMISSION_KEYS = [
  { key: "canManageVendors", label: "Manage Vendors" },
  { key: "canManageUsers", label: "Manage Users" },
  { key: "canManagePlans", label: "Manage Plans" },
  { key: "canManageBilling", label: "Manage Billing" },
  { key: "canViewAnalytics", label: "View Analytics" },
];

export default function PermissionsPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [admins, setAdmins] = useState<any[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/superadmin/admins").then(r => r.json()).then(d => {
      if (d.success) setAdmins(d.data);
    });
  }, []);

  const toggle = async (adminId: string, key: string, currentValue: boolean) => {
    setUpdating(`${adminId}-${key}`);
    try {
      const res = await fetch(`/api/superadmin/admins/${adminId}/permissions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: !currentValue }),
      });
      const data = await res.json();
      if (data.success) {
        setAdmins(prev => prev.map(a => a.id === adminId ? { ...a, [key]: !currentValue } : a));
      }
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>RBAC Permissions</h1>
        <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Toggle feature access for each administrator.</p>
      </div>

      <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? "bg-white/5" : "bg-slate-50"}>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Admin</th>
                {PERMISSION_KEYS.map(p => (
                  <th key={p.key} className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>{p.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className={`border-t ${isDark ? "border-white/5" : "border-slate-100"}`}>
                  <td className="px-6 py-4">
                    <p className={`font-medium ${isDark ? "text-white" : "text-slate-800"}`}>{admin.userFullName || "—"}</p>
                    <p className="text-xs text-slate-500">{admin.userEmail}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${admin.role === "super_admin" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`}>
                      {admin.role}
                    </span>
                  </td>
                  {PERMISSION_KEYS.map(p => {
                    const val = admin[p.key] as boolean;
                    const key = `${admin.id}-${p.key}`;
                    const isUpdating = updating === key;
                    return (
                      <td key={p.key} className="px-4 py-4 text-center">
                        <button
                          onClick={() => toggle(admin.id, p.key, val)}
                          disabled={isUpdating || admin.role === "super_admin"}
                          className={`transition-opacity ${admin.role === "super_admin" ? "opacity-30 cursor-not-allowed" : "hover:opacity-80"}`}
                        >
                          {isUpdating
                            ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-400" />
                            : val
                            ? <ToggleRight className="w-6 h-6 text-emerald-500 mx-auto" />
                            : <ToggleLeft className="w-6 h-6 text-slate-300 mx-auto" />
                          }
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={`px-6 py-3 border-t text-xs ${isDark ? "border-white/5 text-slate-500" : "border-slate-100 text-slate-400"}`}>
          Super Admins have all permissions by default and cannot be restricted here.
        </div>
      </div>
    </div>
  );
}
