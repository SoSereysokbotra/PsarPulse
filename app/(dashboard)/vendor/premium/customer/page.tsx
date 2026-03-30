"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Package,
  Settings,
  TrendingUp,
  Menu,
  X,
  Bell,
  Sparkles,
  Search,
  Clock,
  Plus,
  Minus,
  FileBarChart,
  Zap,
  FileText,
  CreditCard,
  FileSpreadsheet,
} from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorTopbar from "@/components/vendor/VendorTopbar";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";

export default function CustomersPage() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

  const TABS = [
    { id: "analysis", label: t("dashboard.tabs.analysis") || "Customers Analysis", khmer: "វិភាគអតិថិជន" },
    {
      id: "forecast",
      label: t("dashboard.tabs.forecast") || "Forecast Analytics Widget",
      khmer: "ការព្យាករណ៍វិភាគទិន្នន័យ",
    },
    { id: "log", label: t("dashboard.tabs.log") || "Customers Log", khmer: "កំណត់ហេតុអតិថិជន" },
  ];

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("analysis");
  const [customCount, setCustomCount] = useState(1);
  const [logHistory, setLogHistory] = useState([
    { id: 1, time: "2:15 PM", count: 2, status: "Regular" },
    { id: 2, time: "10:00 AM", count: 2, status: "Peak Traffic" },
    { id: 3, time: "11:00 AM", count: 12, status: "Peak Traffic" },
  ]);

  const summaryData = {
    todayCount: 48,
    todayLogs: 4,
    avgSpend: "$5.45",
    weeklyCount: 315,
    weeklyChange: "+27% then last week",
    weeklyCustomers: "15 Customer",
    peakTime: "12:10 PM",
    avgLTV: "$102.02",
  };

  const handleLog = async (amount: number) => {
    const status = amount >= 10 ? "Peak Traffic" : "Regular";
    try {
      const res = await fetch("/api/vendor/traffic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: amount, status }),
      });
      if (res.ok) {
        const json = await res.json();
        setLogHistory((prev) => [
          {
            id: json.data.id,
            time: new Date(json.data.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            count: json.data.count,
            status: json.data.status,
          },
          ...prev,
        ]);
      }
    } catch (e) {
      console.error("Traffic logging error:", e);
    }
  };

  const filtered = logHistory.filter(
    (l) =>
      l.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className={`min-h-screen flex font-sans selection:bg-[#29B28D] selection:text-white transition-colors duration-200 ${isDark ? "bg-dark-bg text-[#e6edf3]" : "bg-slate-100 text-slate-900"
        }`}
    >
      <VendorSidebar
        settingsHref="/vendor/premium/settings"
        plan="premium"
        navLinks={[
          {
            icon: LayoutDashboard,
            title: "Dashboard",
            khmerTitle: "ផ្ទាំងគ្រប់គ្រង",
            href: "/vendor/premium",
          },
          {
            icon: CircleDollarSign,
            title: "Sales",
            khmerTitle: "ការលក់",
            href: "/vendor/premium/sales",
          },
          {
            icon: Receipt,
            title: "Expenses",
            khmerTitle: "ចំណាយ",
            href: "/vendor/premium/expenses",
          },
          {
            icon: Users,
            title: "Customers",
            khmerTitle: "អតិថិជន",
            href: "/vendor/premium/customer",
            active: true,
          },
          {
            icon: Package,
            title: "Inventory",
            khmerTitle: "ស្តុក",
            href: "/vendor/premium/inventory",
          },
          {
            icon: FileBarChart,
            title: "Reports",
            khmerTitle: "របាយការណ៍",
            href: "/vendor/premium/reports",
          },
        ]}
        currentPath="/vendor/premium/customer"
        collapsed={isCollapsed}
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col w-full min-w-0 h-screen overflow-hidden transition-colors">
        <VendorTopbar
          title={t("dashboard.customers")}
          isSidebarCollapsed={isCollapsed}
          setIsSidebarCollapsed={setIsCollapsed}
          setIsMobileSidebarOpen={setIsMobileOpen}
          rightActions={
            <>
              <button
                className={`hidden sm:flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer border-0 ${isDark
                    ? "bg-white text-slate-900 hover:bg-slate-100"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#29B28D]" />
                {t("dashboard.actions.quickSale")}
              </button>
            </>
          }
        />

        {/* Page content */}
        <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px] space-y-6">
          {/* Page title + search */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1
                className={`text-[26px] font-bold ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {t("dashboard.titles.myCustomers")}
              </h1>
              <p
                className={`text-sm mt-0.5 ${isDark ? "text-[#7d8590]" : "text-slate-500"}`}
              >
                {t("dashboard.titles.customersSubtitle")}
              </p>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0d1117] transition-all w-64 focus-within:border-[#29B28D] focus-within:ring-1 focus-within:ring-[#29B28D] group shadow-sm">
              <Search className="w-4 h-4 text-slate-400 dark:text-[#7d8590] transition-colors group-focus-within:text-[#29B28D]" />
              <input 
                type="text" 
                placeholder={t("dashboard.common.search")} 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 dark:text-white" 
              />
            </div>
          </div>

          {/* Tabs */}
          <div
            className={`flex gap-6 border-b transition-colors ${isDark ? "border-white/5" : "border-slate-200"}`}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 flex flex-col items-start transition-colors border-x-0 border-t-0 bg-transparent cursor-pointer ${activeTab === tab.id
                    ? isDark
                      ? "border-b-2 border-white text-white"
                      : "border-b-2 border-slate-900 text-slate-900 font-bold"
                    : isDark
                      ? "border-b-2 border-transparent text-[#7d8590] hover:text-white"
                      : "border-b-2 border-transparent text-slate-500 hover:text-slate-900"
                  }`}
              >
                <span className="font-semibold text-sm">{tab.label}</span>
                <span
                  className={`text-[10px] mt-0.5 ${isKhmer ? "font-suwannaphum" : ""}`}
                >
                  {tab.khmer}
                </span>
              </button>
            ))}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <VendorSummaryCard
              variant={isDark ? "dark" : "light"}
              title={t("dashboard.metrics.todayCustomer")}
              khmerTitle="អតិថិជនថ្ងៃនេះ"
              value={summaryData.todayCount}
              subtext={`${summaryData.todayLogs} logs`}
            />
            <VendorSummaryCard
              variant={isDark ? "dark" : "light"}
              title={t("dashboard.metrics.avgSpend")}
              khmerTitle="ការចំណាយមធ្យម"
              value={summaryData.avgSpend}
              subtext="per customer"
            />
            <VendorSummaryCard
              variant="green"
              title={t("dashboard.metrics.weeklyCustomer")}
              khmerTitle="អតិថិជនប្រចាំសប្តាហ៍"
              value={summaryData.weeklyCount}
              subtext={summaryData.weeklyChange}
            />
            <VendorSummaryCard
              variant={isDark ? "dark" : "light"}
              title={t("dashboard.metrics.peakTime")}
              khmerTitle="ម៉ោងមមាញឹក"
              value={summaryData.peakTime}
              subtext={summaryData.weeklyCustomers}
            />
            <VendorSummaryCard
              variant={isDark ? "dark" : "light"}
              title={t("dashboard.metrics.avgLtv")}
              khmerTitle="តម្លៃអតិថិជន"
              value={summaryData.avgLTV}
              subtext="Per Customer"
            />
          </div>

          {/* Log Customers Bar */}
          <div
            className={`rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border transition-colors ${isDark
                ? "bg-[#0d1117] border-white/5"
                : "bg-white border-slate-200 shadow-sm"
              }`}
          >
            <div>
              <p
                className={`font-bold text-[15px] ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {t("dashboard.actions.logTraffic")}
              </p>
              <p
                className={`text-[11px] font-khmer mt-0.5 ${isDark ? "text-[#7d8590]" : "text-slate-500"}`}
              >
                {t("dashboard.actions.logTrafficSub")}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[1, 5, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => handleLog(n)}
                  className="px-4 py-2 bg-[#29B28D] hover:bg-[#239979] text-white text-sm font-bold rounded-xl transition-all min-h-11 shadow-sm border-0 cursor-pointer hover:scale-[1.02]"
                >
                  +{n}
                </button>
              ))}
              <div
                className={`flex items-center rounded-xl overflow-hidden border transition-colors ${isDark
                    ? "bg-[#161B22] border-white/5"
                    : "bg-slate-50 border-slate-200"
                  }`}
              >
                <button
                  onClick={() => setCustomCount((c) => Math.max(1, c - 1))}
                  className={`px-3 py-2 transition-colors min-h-11 border-0 bg-transparent cursor-pointer ${isDark
                      ? "text-white hover:bg-white/5"
                      : "text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span
                  className={`font-bold text-sm w-8 text-center ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {customCount}
                </span>
                <button
                  onClick={() => setCustomCount((c) => c + 1)}
                  className={`px-3 py-2 transition-colors min-h-11 border-0 bg-transparent cursor-pointer ${isDark
                      ? "text-white hover:bg-white/5"
                      : "text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all min-h-11 border cursor-pointer ${isDark
                    ? "bg-[#161B22] border-white/5 text-white hover:bg-white/5"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
              >
                {isKhmer ? "កំណត់..." : "Custom..."}
              </button>
              <button
                onClick={() => handleLog(customCount)}
                className="px-5 py-2 bg-[#29B28D] hover:bg-[#239979] text-white font-bold rounded-xl transition-all text-sm flex items-center gap-1.5 min-h-11 shadow-sm border-0 cursor-pointer hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                {isKhmer ? `កត់ត្រា ${customCount}` : `Log ${customCount}`}
              </button>
            </div>
          </div>

          {/* Log History Table */}
          <div
            className={`border rounded-2xl shadow-sm overflow-hidden transition-colors ${isDark
                ? "bg-[#0d1117] border-white/5"
                : "bg-white border-slate-200"
              }`}
          >
            <div
              className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${isDark ? "border-white/5" : "border-slate-100"
                }`}
            >
              <h3
                className={`font-bold text-[17px] ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {t("dashboard.titles.history")}
              </h3>
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t("dashboard.placeholders.searchTxn")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#29B28D] min-h-11 transition-colors outline-none ${isDark
                      ? "bg-[#161B22] border-white/5 text-white focus:border-[#29B28D]"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"
                    }`}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className={`border-b text-xs uppercase tracking-wider font-bold transition-colors ${isDark
                        ? "bg-[#161B22] border-white/5 text-[#7d8590]"
                        : "bg-slate-50/50 border-slate-100 text-slate-500"
                      }`}
                  >
                    <th className="px-6 py-4">{t("dashboard.table.time")}</th>
                    <th className="px-6 py-4">{t("dashboard.metrics.todayCount") || "Count"}</th>
                    <th className="px-6 py-4">{t("dashboard.customerSection.crmStatus") || "Status"}</th>
                    <th className="px-6 py-4 text-right">{t("dashboard.table.actions")}</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y transition-colors ${isDark ? "divide-white/5" : "divide-slate-100"}`}
                >
                  {filtered.map((log) => (
                    <tr
                      key={log.id}
                      className={`transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50/50"}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`flex items-center gap-2 text-[15px] font-medium ${isDark ? "text-white" : "text-slate-600"}`}
                        >
                          <Clock className="w-4 h-4 text-slate-400" />
                          {log.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[15px] font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                          >
                            +{log.count}
                          </span>
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.status === "Peak Traffic" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200 shadow-sm">
                            Peak Traffic
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${isDark
                                ? "bg-white/5 text-white border-white/10"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                          >
                            Regular
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl tracking-widest transition-colors border-0 bg-transparent cursor-pointer px-2">
                          ···
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className={`px-6 py-4 border-t text-center transition-colors ${isDark ? "border-white/5" : "border-slate-100"
                }`}
            >
              <button className="text-[#29B28D] text-sm font-bold hover:underline border-0 bg-transparent cursor-pointer">
                {t("dashboard.actions.viewAll")}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
