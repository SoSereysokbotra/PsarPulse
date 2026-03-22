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

  const handleLog = (amount: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    setLogHistory((prev) => [
      {
        id: Date.now(),
        time: timeStr,
        count: amount,
        status: amount >= 10 ? "Peak Traffic" : "Regular",
      },
      ...prev,
    ]);
  };

  const filtered = logHistory.filter(
    (l) =>
      l.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className={`min-h-screen flex font-sans selection:bg-[#29B28D] selection:text-white transition-colors duration-200 ${
        isDark ? "bg-dark-bg text-[#e6edf3]" : "bg-slate-100 text-slate-900"
      }`}
    >
      <VendorSidebar
        plan="free"
        navLinks={[
          {
            icon: LayoutDashboard,
            title: "Dashboard",
            khmerTitle: "ផ្ទាំងគ្រប់គ្រង",
            href: "/vendor",
          },
          {
            icon: CircleDollarSign,
            title: "Sales",
            khmerTitle: "ការលក់",
            href: "/vendor/sales",
          },
          {
            icon: Receipt,
            title: "Expenses",
            khmerTitle: "ចំណាយ",
            href: "/vendor/expenses",
          },
          {
            icon: Users,
            title: "Customers",
            khmerTitle: "អតិថិជន",
            href: "/vendor/customer",
          },
        ]}
        currentPath="/vendor/customer"
        collapsed={isCollapsed}
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col w-full min-w-0 h-screen overflow-hidden">
        <VendorTopbar
          title={"Customers"}
          isSidebarCollapsed={isCollapsed}
          setIsSidebarCollapsed={setIsCollapsed}
          setIsMobileSidebarOpen={setIsMobileOpen}
          rightActions={
            <>
              <button className="hidden sm:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                <Zap className="w-3.5 h-3.5 text-[#29B28D]" />
                Quick sale
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
                {"My Customers"}
              </h1>
              <p
                className={`text-sm mt-0.5 ${isDark ? "text-[#7d8590]" : "text-slate-500"}`}
              >
                Tracker and Log your daily foot traffic
              </p>
            </div>
            <div className="relative">
              <Search
                className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-[#7d8590]" : "text-slate-400"}`}
              />
              <input
                type="text"
                placeholder="Search Class..."
                className={`pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#29B28D] focus:ring-1 focus:ring-[#29B28D] w-56 ${
                  isDark
                    ? "bg-[#0d1117] border border-white/5 text-white"
                    : "bg-white border border-slate-200 text-slate-900"
                }`}
              />
            </div>
          </div>

          {/* 5 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <VendorSummaryCard
              variant="dark"
              title="Today Customer"
              khmerTitle="អតិថិជនថ្ងៃនេះ"
              value={summaryData.todayCount}
              subtext={`${summaryData.todayLogs} logs`}
            />
            <VendorSummaryCard
              title="Avg.Spend"
              khmerTitle="កាន់ឈ្នួលការចាយ"
              value={summaryData.avgSpend}
              subtext="per customer"
              variant={isDark ? "dark" : "light"}
            />
            <VendorSummaryCard
              variant="green"
              title="Weekly Customer"
              khmerTitle="អតិថិជនច្រើនជាងក្នុងរូប"
              value={summaryData.weeklyCount}
              subtext={summaryData.weeklyChange}
            />
            <VendorSummaryCard
              title="Avg.LTV"
              khmerTitle="ភ្លេចអតិថិជន"
              value={summaryData.avgLTV}
              subtext="Per Customer"
              variant={isDark ? "dark" : "light"}
            />
          </div>

          {/* Log Customers Bar */}
          <div className="bg-slate-900 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white text-[15px]">Log Customers</p>
              <p className="text-[11px] font-khmer text-slate-400 mt-0.5">
                កត់ត្រាអតិថិជន
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[1, 5, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => handleLog(n)}
                  className="px-4 py-2 bg-[#29B28D] hover:bg-[#239979] text-white text-sm font-bold rounded-xl transition-colors min-h-11"
                >
                  +{n}
                </button>
              ))}
              <div className="flex items-center bg-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setCustomCount((c) => Math.max(1, c - 1))}
                  className="px-3 py-2 text-white hover:bg-white/10 transition-colors min-h-11"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-bold text-sm w-6 text-center">
                  {customCount}
                </span>
                <button
                  onClick={() => setCustomCount((c) => c + 1)}
                  className="px-3 py-2 text-white hover:bg-white/10 transition-colors min-h-11"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors min-h-11">
                Custom...
              </button>
              <button className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors min-h-11">
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleLog(customCount)}
                className="px-5 py-2 bg-[#29B28D] hover:bg-[#239979] text-white font-bold rounded-xl transition-colors text-sm flex items-center gap-1.5 min-h-11"
              >
                <Plus className="w-4 h-4" />
                Log {customCount}
              </button>
            </div>
          </div>

          {/* Log History Table */}
          <div
            className={`border rounded-2xl shadow-sm overflow-hidden ${
              isDark
                ? "bg-dark-surface border-white/5"
                : "bg-white border-slate-200"
            }`}
          >
            <div
              className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? "border-white/5" : "border-slate-100"
              }`}
            >
              <h3
                className={`font-bold text-[17px] ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Expense History
              </h3>
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t("common.search") || "Search Class..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#29B28D] min-h-11 ${
                    isDark
                      ? "bg-[#0d1117] border-white/5 text-white focus:border-[#29B28D]"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"
                  }`}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className={`border-b text-xs uppercase tracking-wider font-semibold ${
                      isDark
                        ? "bg-white/5 border-white/5 text-[#7d8590]"
                        : "bg-slate-50/50 border-slate-100 text-slate-500"
                    }`}
                  >
                    <th className="px-6 py-4">Time Logged</th>
                    <th className="px-6 py-4">Count</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-100"}`}
                >
                  {filtered.map((log) => (
                    <tr
                      key={log.id}
                      className={`transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50/50"}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`flex items-center gap-2 text-[15px] ${isDark ? "text-white" : "text-slate-600"}`}
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
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                            Peak Traffic
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              isDark
                                ? "bg-white/5 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            Regular
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-slate-300 hover:text-slate-600 text-xl tracking-widest transition-colors">
                          ···
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 text-center">
              <button className="text-[#29B28D] text-sm font-semibold hover:underline">
                View Full History
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
