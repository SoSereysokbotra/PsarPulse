"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Plus, Loader2, Check } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function PlansPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/superadmin/plans").then(r => r.json()).then(d => {
      if (d.success) setPlans(d.data);
      setLoading(false);
    });
  }, []);

  const planColors: Record<string, string> = {
    free: "bg-slate-100 text-slate-700",
    pro: "bg-emerald-100 text-emerald-700",
    premium: "bg-indigo-100 text-indigo-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Plans & Pricing</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Manage subscription tiers and their limits.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin text-slate-400 w-6 h-6" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`rounded-xl border p-6 shadow-sm ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${planColors[plan.name] || "bg-gray-100 text-gray-700"}`}>
                  {plan.name}
                </span>
                <CreditCard className="w-4 h-4 text-slate-400" />
              </div>

              <p className={`text-3xl font-extrabold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                ${plan.monthlyPrice ?? "0"}
                <span className="text-sm font-normal text-slate-500">/mo</span>
              </p>

              {plan.yearlyPrice && (
                <p className="text-xs text-slate-500 mb-4">${plan.yearlyPrice}/yr (save 20%)</p>
              )}

              <div className={`border-t pt-4 space-y-2 ${isDark ? "border-white/10" : "border-slate-100"}`}>
                {[
                  { label: "Max Products", val: plan.maxProducts ?? "Unlimited" },
                  { label: "Max Customers", val: plan.maxCustomers ?? "Unlimited" },
                  { label: "Team Members", val: plan.maxUsers ?? "1" },
                  { label: "Active Vendors", val: plan.activeVendors ?? "—" },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className={`font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>{val}</span>
                  </div>
                ))}
              </div>

              <p className={`text-xs mt-4 ${isDark ? "text-slate-500" : "text-slate-400"}`}>{plan.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
