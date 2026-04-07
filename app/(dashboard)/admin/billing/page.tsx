"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, TrendingUp, Users, Loader2 } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AdminBillingPage() {
  const { resolvedTheme } = useTheme();
  const { language } = useLanguage();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";
  const [plans, setPlans] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/billing")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setPlans(d.data.plans);
          setTransactions(d.data.recentTransactions);
        }
        setLoading(false);
      });
  }, []);

  const planColors: Record<string, { bg: string; text: string; bar: string }> =
    {
      free: { bg: "bg-slate-100", text: "text-slate-700", bar: "bg-slate-400" },
      pro: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        bar: "bg-emerald-500",
      },
      premium: {
        bg: "bg-indigo-100",
        text: "text-indigo-700",
        bar: "bg-indigo-500",
      },
    };

  const totalVendors = plans.reduce(
    (sum, p) => sum + (p.activeVendors || 0),
    0,
  );
  const totalRevenue = plans.reduce(
    (sum, p) =>
      sum + (p.activeVendors || 0) * parseFloat(p.monthlyPrice || "0"),
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {isKhmer ? "ទិដ្ឋភាពទូទៅការបង់ប្រាក់" : "Billing Overview"}
        </h1>
        <p
          className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {isKhmer
            ? "ការបែងចែកគម្រោងជាវ និងចំណូលប្រចាំខែប៉ាន់ស្មាន។"
            : "Subscription plan distribution and estimated monthly revenue."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          className={`rounded-xl border p-5 ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-slate-500">
              {isKhmer ? "អាជីវករបង់ប្រាក់សរុប" : "Total Paid Vendors"}
            </span>
          </div>
          <p
            className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {totalVendors}
          </p>
        </div>
        <div
          className={`rounded-xl border p-5 ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <span className="text-sm text-slate-500">
              {isKhmer ? "ចំណូលប្រចាំខែប៉ាន់ស្មាន" : "Est. Monthly Revenue"}
            </span>
          </div>
          <p
            className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            ${totalRevenue.toFixed(0)}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-slate-400 w-5 h-5" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2
              className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-800"}`}
            >
              {isKhmer ? "ការបែងចែកគម្រោង" : "Plan Distribution"}
            </h2>
            {plans.map((plan) => {
              const colors = planColors[plan.name] || planColors.free;
              const pct =
                totalVendors > 0
                  ? Math.round((plan.activeVendors / totalVendors) * 100)
                  : 0;
              return (
                <div
                  key={plan.id}
                  className={`rounded-xl border p-5 ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${colors.bg} ${colors.text}`}
                    >
                      {plan.name}
                    </span>
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}
                      >
                        ${plan.monthlyPrice ?? "0"}
                        {isKhmer ? "/ខែ ក្នុងមួយអាជីវករ" : "/mo per vendor"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {plan.activeVendors}{" "}
                        {isKhmer
                          ? "អាជីវករសកម្ម"
                          : `active vendor${plan.activeVendors !== 1 ? "s" : ""}`}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`h-2 rounded-full ${isDark ? "bg-white/10" : "bg-slate-100"}`}
                  >
                    <div
                      className={`h-2 rounded-full transition-all ${colors.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    {isKhmer
                      ? `${pct}% នៃអាជីវករទាំងអស់`
                      : `${pct}% of all vendors`}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <h2
              className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-800"}`}
            >
              {isKhmer ? "ប្រតិបត្តិការថ្មីៗ" : "Recent Transactions"}
            </h2>
            <div
              className={`rounded-xl border overflow-hidden ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}
            >
              <table className="w-full text-sm text-left">
                <thead
                  className={
                    isDark
                      ? "bg-white/5 text-slate-400"
                      : "bg-slate-50 text-slate-500"
                  }
                >
                  <tr>
                    <th className="px-4 py-3 font-semibold">
                      {isKhmer ? "អាជីវករ" : "Vendor"}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {isKhmer ? "គម្រោង" : "Plan"}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {isKhmer ? "ចំនួនទឹកប្រាក់" : "Amount"}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {isKhmer ? "កាលបរិច្ឆេទ" : "Date"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {transactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-slate-500"
                      >
                        {isKhmer
                          ? "មិនមានប្រតិបត្តិការថ្មីៗ"
                          : "No recent transactions"}
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className={
                          isDark
                            ? "hover:bg-white/5 text-slate-300"
                            : "hover:bg-slate-50 text-slate-700"
                        }
                      >
                        <td className="px-4 py-3 font-medium">
                          {tx.businessName ||
                            (isKhmer ? "អាជីវករមិនស្គាល់" : "Unknown Vendor")}
                        </td>
                        <td className="px-4 py-3 capitalize">{tx.planName}</td>
                        <td className="px-4 py-3 font-bold">${tx.amount}</td>
                        <td className="px-4 py-3 text-xs text-slate-400">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
