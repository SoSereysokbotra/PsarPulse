"use client";

import React, { useState } from "react";
import {
  LayoutDashboard, CircleDollarSign, Receipt, Users, Package,
  Plus, Search, MoreVertical, X, Clock, Filter, TrendingUp, TrendingDown,
  FileBarChart, Sparkles, FileText, FileSpreadsheet, CloudSun, Brain,
  MessageSquare, Zap, CheckCircle2, ArrowUpRight, Send, Megaphone,
} from "lucide-react";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { Period } from "../../expenses/page";

// ─── Navigation ────────────────────────────────────────────────────
const PREMIUM_NAV = [
  { icon: LayoutDashboard,  title: "Dashboard",  khmerTitle: "ផ្ទាំងគ្រប់គ្រង",  href: "/vendor/premium"           },
  { icon: CircleDollarSign, title: "Sales",       khmerTitle: "ការលក់",            href: "/vendor/premium/sales",    active: true },
  { icon: Receipt,          title: "Expenses",    khmerTitle: "ចំណាយ",            href: "/vendor/premium/expenses"  },
  { icon: Users,            title: "Customers",   khmerTitle: "អតិថិជន",          href: "/vendor/premium/customer"  },
  { icon: Package,          title: "Inventory",   khmerTitle: "ស្តុក",             href: "/vendor/premium/inventory" },
  { icon: FileBarChart,     title: "Reports",     khmerTitle: "របាយការណ៍",        href: "/vendor/premium/reports"   },
];

// ─── Data ──────────────────────────────────────────────────────────
const transactions = [
  { id: 1, time: "1:45 PM", amount: "$12.50", item: "2x Iced Coffee, 1x Bread",   status: "Logged", aiTagged: true,  tag: "Peak Hour"     },
  { id: 2, time: "1:15 PM", amount: "$4.00",  item: "1x Hot Latte",               status: "Logged", aiTagged: true,  tag: "Weather Driven" },
  { id: 3, time: "12:30 PM",amount: "$15.00", item: "3x Noodle Soup",             status: "Logged", aiTagged: false, tag: ""              },
  { id: 4, time: "11:00 AM",amount: "$8.50",  item: "AI Auto-Logged Sale",        status: "Logged", aiTagged: true,  tag: "Smart Log"     },
];

const smartAlerts = [
  { type: "opportunity", message: "Rain starting! Demand for Hot Lattes is spiking. Suggest moving cups to the front.", time: "10 min ago" },
  { type: "warning",     message: "Sales dropped 15% in the last hour compared to historical average.",                 time: "1 hour ago" },
];

const weatherData = {
  condition: "Rainy Evening", temp: "28°C", icon: "🌧️", impact: "busy",
  suggestions: [{ product: "Mango Sticky Rice", change: "+20%", reason: "Comfort food demand rises in rain" }],
};

// ═══════════════════════════════════════════════════════════════════
export default function PremiumSalesPage() {
  const [quickAmount,         setQuickAmount]         = useState("");
  const [quickItem,           setQuickItem]           = useState("");
  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState(false);
  const [isChatOpen,          setIsChatOpen]          = useState(false);
  const [chatMessage,         setChatMessage]         = useState("");
  const [period,              setPeriod]              = useState<Period>("Day");

  const totalRevenue = transactions.reduce((s, t) => s + parseFloat(t.amount.replace("$", "")), 0);
  const avgSale      = totalRevenue / (transactions.length || 1);

  const handleQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    setQuickAmount(""); setQuickItem(""); setIsQuickLogModalOpen(false);
  };

  return (
    <VendorDashboardLayout
      plan="premium"
      navLinks={PREMIUM_NAV}
      currentPath="/vendor/premium/sales"
      title="Sales"
      planBadge={{ label: "PREMIUM", icon: Sparkles }}
      rightActions={
        <>
          {/* Period Toggle (reused from pro/sales) */}
          <div className="hidden sm:flex items-center bg-[#f0f2f5] border border-[#e8eaed] rounded-[10px] p-[3px]">
            {(["Day", "Week", "Month"] as Period[]).map(p => (
              <button
                key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-[7px] rounded-[8px] text-[13px] font-semibold border-0 cursor-pointer transition-all ${
                  period === p
                    ? "bg-white text-[#111827] shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                    : "bg-transparent text-[#6b7280] hover:text-[#111827]"
                }`}
              >{p}</button>
            ))}
          </div>
          {/* Export buttons (reused from pro/sales) */}
          <button className="hidden sm:flex items-center gap-2 bg-[#0d1117] hover:opacity-90 text-white font-medium px-4 py-[9px] rounded-[10px] transition-colors text-[13px] cursor-pointer border-0">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button className="hidden sm:flex items-center gap-2 bg-white border border-[#e8eaed] hover:bg-[#f0f2f5] text-[#111827] font-medium px-4 py-[9px] rounded-[10px] transition-colors text-[13px] cursor-pointer">
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
          {/* Smart Add Sale button */}
          <button
            onClick={() => setIsQuickLogModalOpen(true)}
            className="flex items-center gap-[7px] bg-gradient-to-r from-[#8b5cf6] to-[#3ecf8e] text-white border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer shadow-[0_2px_14px_rgba(139,92,246,0.3)] hover:opacity-90 transition-opacity"
          >
            <Sparkles size={14} /> Smart Add
          </button>
        </>
      }
    >
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">

        {/* ── Page Header ── */}
        <div className="pt-1 pb-2">
          <h2 className="text-[32px] font-extrabold text-[#111827] leading-tight">My Sales</h2>
          <p className="text-[14px] text-[#6b7280] mt-1">
            AI-powered sales tracking ·{" "}
            <span className="text-[#9ca3af]">តាមដាន និងគ្រប់គ្រងការលក់</span>
          </p>
        </div>

        {/* ── Smart Push Notifications (premium exclusive) ── */}
        <div className="flex flex-col gap-3">
          {smartAlerts.map((alert, i) => (
            <div key={i} className={`flex items-center gap-4 p-4 rounded-[14px] border ${
              alert.type === "warning"
                ? "bg-[rgba(245,158,11,0.06)] border-[rgba(245,158,11,0.2)]"
                : "bg-[rgba(139,92,246,0.05)] border-[rgba(139,92,246,0.18)]"
            }`}>
              <div className={`p-2 rounded-[10px] ${alert.type === "warning" ? "bg-[rgba(245,158,11,0.12)]" : "bg-[rgba(139,92,246,0.1)]"}`}>
                {alert.type === "warning"
                  ? <TrendingDown className="w-5 h-5 text-[#f59e0b]" />
                  : <Zap className="w-5 h-5 text-[#8b5cf6]" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-[14px] font-bold ${alert.type === "warning" ? "text-[#92400e]" : "text-[#5b21b6]"}`}>
                    {alert.type === "opportunity" ? "AI Smart Alert" : "Automated Warning"}
                  </p>
                  <span className="text-[11px] text-[#9ca3af]">{alert.time}</span>
                </div>
                <p className={`text-[13px] font-medium mt-0.5 ${alert.type === "warning" ? "text-[#b45309]" : "text-[#7c3aed]"}`}>
                  {alert.message}
                </p>
              </div>
              <button className="text-[12px] font-bold text-[#9ca3af] hover:text-[#111827] px-3 py-1.5 rounded-[8px] hover:bg-[#f0f2f5] transition-colors border-0 cursor-pointer">
                Dismiss
              </button>
            </div>
          ))}
        </div>

        {/* ── Summary Cards (reused from pro/sales via VendorSummaryCard) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <VendorSummaryCard
            variant="dark"
            title={`${period}'s Revenue`}
            khmerTitle="ចំណូលប្រចាំ"
            value={`$${totalRevenue.toFixed(2)}`}
            icon={CircleDollarSign}
          />
          <VendorSummaryCard
            title="Transactions"
            khmerTitle="ប្រតិបត្តិការ"
            value={transactions.length}
            icon={Receipt}
            subtext="sales today"
          />
          <VendorSummaryCard
            title="Avg. Sale Value"
            khmerTitle="តម្លៃលក់មធ្យម"
            value={`$${avgSale.toFixed(2)}`}
            icon={TrendingUp}
            subtext="per txn"
          />
          {/* Premium exclusive — AI Next-Week Forecast */}
          <VendorSummaryCard
            title="AI Next-Week"
            khmerTitle="ការព្យាករណ៍ AI"
            value="$3,120"
            icon={Sparkles}
            trend="Forecasted revenue"
            isPositive={true}
            highlight
          />
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Quick Log Banner + Transaction Table */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick Log Banner (reused pattern from pro/sales) */}
            <div className="bg-white rounded-[14px] border border-[#e8eaed] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[rgba(139,92,246,0.05)] to-[rgba(62,207,142,0.05)] rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
              <div>
                <h2 className="font-bold text-[19px] text-[#111827] flex items-center gap-2">
                  Unlimited Quick Logging <Sparkles className="w-5 h-5 text-[#8b5cf6]" />
                </h2>
                <p className="text-[13px] text-[#6b7280] mt-0.5">កត់ត្រាការលក់ឥតកំណត់</p>
              </div>
              <button
                onClick={() => setIsQuickLogModalOpen(true)}
                className="bg-gradient-to-r from-[#8b5cf6] to-[#3ecf8e] hover:opacity-90 text-white font-bold text-[15px] px-6 py-3.5 rounded-[12px] shadow-md transition-all flex items-center gap-2 w-full sm:w-auto min-h-[50px] border-0 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" /> Smart Add
              </button>
            </div>

            {/* Transaction Table (reused from pro/sales with premium AI tag column) */}
            <div className="bg-white rounded-[14px] border border-[#e8eaed] shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
              <div className="p-5 md:p-6 border-b border-[#f0f2f5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-[17px] text-[#111827]">Smart Transaction History</h3>
                  <p className="text-[12px] text-[#6b7280] mt-0.5">ប្រវត្តិប្រតិបត្តិការឆ្លាតវៃ</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search unlimited logs..."
                      className="pl-9 pr-4 py-2 bg-[#f7f8fa] border border-[#e8eaed] rounded-[10px] text-[13px] outline-none focus:border-[#3ecf8e] min-h-[40px]" />
                  </div>
                  <button className="p-2 border border-[#e8eaed] rounded-[10px] text-[#6b7280] hover:bg-[#f0f2f5] transition-colors min-h-[40px] bg-white cursor-pointer">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f7f8fa] border-b border-[#f0f2f5] text-[11px] text-[#9ca3af] uppercase tracking-wider font-bold">
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">Item Breakdown</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Smart Tag</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f2f5]">
                    {transactions.map(txn => (
                      <tr key={txn.id} className="hover:bg-[#f7f8fa] transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-[14px] font-medium text-[#111827]">
                            <Clock className="w-4 h-4 text-[#9ca3af]" />{txn.time}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[13.5px] font-medium text-[#374151]">{txn.item}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-[15px] font-bold text-[#3ecf8e]">{txn.amount}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {txn.aiTagged && txn.tag ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[rgba(139,92,246,0.08)] text-[#8b5cf6] text-[11px] font-bold rounded-[6px] border border-[rgba(139,92,246,0.2)]">
                              <Brain className="w-3 h-3" /> {txn.tag}
                            </span>
                          ) : <span className="text-[12px] text-[#d1d5db]">—</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button className="p-2 text-[#9ca3af] hover:text-[#8b5cf6] rounded-[8px] hover:bg-[rgba(139,92,246,0.08)] transition-colors opacity-0 group-hover:opacity-100 min-h-[40px] min-w-[40px] border-0 cursor-pointer bg-transparent">
                            <MoreVertical className="w-5 h-5 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-[#f0f2f5] bg-[#f7f8fa] text-center">
                <button className="text-[13.5px] font-semibold text-[#3ecf8e] hover:underline border-0 bg-transparent cursor-pointer">
                  Load More Logs
                </button>
              </div>
            </div>
          </div>

          {/* Right: AI Panels (premium exclusive) */}
          <div className="space-y-6">

            {/* AI Sales Forecaster */}
            <div className="bg-gradient-to-br from-[rgba(139,92,246,0.06)] to-[rgba(62,207,142,0.06)] border border-[rgba(139,92,246,0.15)] rounded-[14px] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-[10px] shadow-sm">
                  <Sparkles className="w-5 h-5 text-[#8b5cf6]" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] text-[#5b21b6]">AI Sales Forecaster</h3>
                  <p className="text-[11px] text-[#8b5cf6] mt-0.5">ការព្យាករណ៍ការលក់ AI</p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 bg-white text-[#8b5cf6] text-[10px] font-bold rounded-full shadow-sm">
                  <Brain className="w-3 h-3" /> Gemini
                </span>
              </div>

              <p className="text-[13px] text-[#7c3aed] mb-4 font-medium">Next-week revenue prediction based on trends &amp; weather:</p>

              {/* Mini forecast bar chart */}
              <div className="flex items-end gap-1.5 mb-3" style={{ height: "64px" }}>
                {[65, 80, 72, 95, 88, 110, 102].map((h, i) => {
                  const days = ["M", "T", "W", "T", "F", "S", "S"];
                  const isForecast = i >= 4;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div className={`w-full rounded-t-sm ${isForecast ? "opacity-50" : ""}`}
                        style={{ height: `${(h / 110) * 56}px`, background: isForecast ? "linear-gradient(to top,#c084fc,#e879f9)" : "linear-gradient(to top,#7c3aed,#a855f7)" }} />
                      <span className="text-[9px] font-bold text-[#a78bfa]">{days[i]}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-[11px] text-[#6b7280]"><div className="w-2.5 h-2.5 rounded-sm bg-[#7c3aed]" /> Actual</div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#6b7280]"><div className="w-2.5 h-2.5 rounded-sm bg-[#f0abfc]" /> Forecast</div>
              </div>
              <div className="bg-white rounded-[10px] p-3 border border-[rgba(139,92,246,0.15)]">
                <p className="text-[12px] text-[#7c3aed] font-semibold flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Predicted: <span className="text-[#5b21b6] font-bold">$3,120 next week</span>
                </p>
                <p className="text-[11px] text-[#6b7280] mt-1">Rain expected Fri–Sat. Hot beverages may outsell iced drinks by 35%.</p>
              </div>
            </div>

            {/* Weather Intelligence (premium exclusive) */}
            <div className="bg-white border border-[#e8eaed] rounded-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#f0f2f5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[rgba(59,130,246,0.08)] rounded-[10px]">
                    <CloudSun className="w-5 h-5 text-[#3b82f6]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] text-[#111827]">Weather Intelligence</h3>
                    <p className="text-[11px] text-[#9ca3af] mt-0.5">ព័ត៌មានអាកាសធាតុ</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[rgba(59,130,246,0.08)] text-[#3b82f6] text-[10px] font-bold rounded-full">
                  <Brain className="w-3 h-3" /> AI
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 p-4 bg-[rgba(59,130,246,0.04)] rounded-[12px] border border-[rgba(59,130,246,0.12)] mb-5">
                  <span className="text-4xl">{weatherData.icon}</span>
                  <div>
                    <p className="text-[15px] font-bold text-[#111827]">{weatherData.condition}</p>
                    <p className="text-[13px] text-[#6b7280]">{weatherData.temp} · Expected to be <strong className="text-[#8b5cf6]">{weatherData.impact}</strong></p>
                  </div>
                </div>
                <h4 className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-3">Predicted Impact on Products</h4>
                <div className="space-y-3">
                  {weatherData.suggestions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-[10px] bg-[#f7f8fa] border border-[#f0f2f5]">
                      <div>
                        <p className="text-[13.5px] font-semibold text-[#111827]">{s.product}</p>
                        <p className="text-[12px] text-[#6b7280]">{s.reason}</p>
                      </div>
                      <span className={`text-[15px] font-bold ${s.change.startsWith("+") ? "text-[#3ecf8e]" : "text-[#ef4444]"}`}>{s.change}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Smart Add Modal (reused + enhanced from pro/sales) ══ */}
      {isQuickLogModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0d1117]/60 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setIsQuickLogModalOpen(false)} />
          <div className="bg-white rounded-[24px] w-full max-w-lg p-6 md:p-8 shadow-2xl relative z-10 border border-[#e8eaed] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#3ecf8e]" />
            <button onClick={() => setIsQuickLogModalOpen(false)}
              className="absolute top-5 right-5 text-[#9ca3af] hover:text-[#111827] hover:bg-[#f0f2f5] p-1.5 rounded-[8px] transition-colors border-0 cursor-pointer bg-transparent">
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[rgba(139,92,246,0.12)] to-[rgba(62,207,142,0.12)] rounded-[12px] border border-[rgba(139,92,246,0.2)]">
                <Brain className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <div>
                <h2 className="font-bold text-[22px] text-[#111827]">Smart Log Sale</h2>
                <p className="text-[13px] text-[#6b7280] flex items-center gap-1">
                  Powered by Gemini <Sparkles className="w-3.5 h-3.5 text-[#8b5cf6]" />
                </p>
              </div>
            </div>

            {/* AI hint banner */}
            <div className="bg-[rgba(139,92,246,0.06)] p-3 rounded-[12px] mb-5 flex items-start gap-2 border border-[rgba(139,92,246,0.15)]">
              <Sparkles className="w-4 h-4 text-[#8b5cf6] shrink-0 mt-0.5" />
              <p className="text-[12px] text-[#7c3aed]">
                Type naturally, e.g., "Sold 2 iced coffee for 4 dollars". AI will auto-categorize and deduct inventory correctly.
              </p>
            </div>

            <form onSubmit={handleQuickLog} className="flex flex-col gap-5">
              <div className="relative group">
                <input type="text" placeholder='e.g., "3 Noodle soups and 1 iced coffee"'
                  value={quickItem} onChange={e => setQuickItem(e.target.value)}
                  className="block w-full px-4 py-4 bg-[#f7f8fa] border border-[#e8eaed] rounded-[12px] text-[#111827] text-[15px] placeholder-[#9ca3af] focus:bg-white focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none transition-all min-h-[60px]" />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-[#9ca3af] font-bold">$</span>
                </div>
                <input type="number" step="0.01" placeholder="Amount (AI will auto-fill if empty)"
                  value={quickAmount} onChange={e => setQuickAmount(e.target.value)}
                  className="block w-full pl-10 pr-4 py-4 bg-[#f7f8fa] border border-[#e8eaed] rounded-[12px] text-[#111827] text-[16px] font-bold placeholder-[#9ca3af] focus:bg-white focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none transition-all min-h-[60px]" />
              </div>

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setIsQuickLogModalOpen(false)}
                  className="flex-1 bg-[#f0f2f5] hover:bg-[#e8eaed] text-[#374151] font-bold text-[15px] py-4 rounded-[12px] transition-all min-h-[56px] border-0 cursor-pointer">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-[2] bg-gradient-to-r from-[#8b5cf6] to-[#3ecf8e] hover:opacity-90 text-white font-bold text-[15px] py-4 rounded-[12px] shadow-md transition-all flex items-center justify-center gap-2 min-h-[56px] border-0 cursor-pointer">
                  <Sparkles className="w-5 h-5" /> Log via AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ Gemini AI Chat FAB ══ */}
      {!isChatOpen && (
        <button onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] rounded-full shadow-[0_8px_32px_rgba(139,92,246,0.4)] flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer border-0">
          <MessageSquare size={22} />
        </button>
      )}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] bg-white rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.2)] border border-[#e8eaed] flex flex-col overflow-hidden">
          <div className="px-5 py-4 bg-[#0d1117] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] rounded-full flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-[13.5px] text-[#e6edf3]">Gemini Sales Assistant</p>
                <p className="text-[11px] text-[#4d5562]">Online · Ready to predict</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-[#7d8590] hover:text-[#e6edf3] bg-transparent border-0 cursor-pointer p-1"><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#f7f8fa]" style={{ minHeight: "260px" }}>
            <div className="flex justify-start">
              <div className="max-w-[85%] px-4 py-3 bg-white border border-[#e8eaed] text-[#374151] rounded-[14px] rounded-bl-[4px] shadow-sm text-[13px] leading-relaxed">
                Hi! I notice sales for Iced Coffee dropped 10% today — it's raining. Do you want me to pause the automated restock order for ice tomorrow?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[85%] px-4 py-3 bg-[#0d1117] text-[#e6edf3] rounded-[14px] rounded-br-[4px] text-[13px] leading-relaxed">
                Yes, pause it and increase Hot Chocolate cups instead.
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[85%] px-4 py-3 bg-white border border-[#e8eaed] text-[#374151] rounded-[14px] rounded-bl-[4px] shadow-sm text-[13px] leading-relaxed">
                Done! Inventory logic updated. Re-routed $15 from ice budget to hot cups. Forecast says we'll clear that stock by 8 PM tomorrow.
              </div>
            </div>
          </div>
          <div className="p-3 border-t border-[#e8eaed] bg-white">
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Message your business assistant..."
                value={chatMessage} onChange={e => setChatMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#f7f8fa] border border-[#e8eaed] rounded-[10px] text-[13px] outline-none text-[#111827] focus:border-[#3ecf8e]" />
              <button className="p-2.5 bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] text-white rounded-[10px] border-0 cursor-pointer hover:opacity-90">
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </VendorDashboardLayout>
  );
}
