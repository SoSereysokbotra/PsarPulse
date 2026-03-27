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

const TABS = [
  { id: "analysis", label: "Customers Analysis", khmer: "វិភាគអតិថិជន" },
  {
    id: "forecast",
    label: "Forecast Analytics Widget",
    khmer: "ការព្យាករណ៍វិភាគទិន្នន័យ",
  },
  { id: "log", label: "Customers Log", khmer: "កំណត់ហេតុអតិថិជន" },
  { id: "crm", label: "Customer CRM", khmer: "ទំនាក់ទំនងអតិថិជន" },
];

export default function CustomersPage() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("log");
  const [customCount, setCustomCount] = useState(1);

  const [logHistory, setLogHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // CRM States
  const [crmDatabase, setCrmDatabase] = useState<any[]>([
    { id: 101, name: "Sokha Heng", phone: "012 *** 345", visits: 12, lastVisit: "Today, 2:30 PM", status: "Loyal" },
    { id: 102, name: "Bopha Sao", phone: "098 *** 123", visits: 3, lastVisit: "Yesterday", status: "New" },
  ]);
  const [crmName, setCrmName] = useState("");
  const [crmPhone, setCrmPhone] = useState("");
  const [crmNotes, setCrmNotes] = useState("");
  const [crmSubmitting, setCrmSubmitting] = useState(false);
  const [crmSuccess, setCrmSuccess] = useState(false);

  React.useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/vendor/customers");
        const json = await res.json();
        if (json.success) setLogHistory(json.data);
      } catch (error) {
        console.error("Failed to fetch customer logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

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
    try {
      const res = await fetch("/api/vendor/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: amount }),
      });
      if (res.ok) {
        const json = await res.json();
        setLogHistory((prev) => [json.data, ...prev]);
        setCustomCount(1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCRMSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crmName.trim() || crmSubmitting) return;
    setCrmSubmitting(true);
    try {
      const res = await fetch("/api/vendor/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: crmName, phone: crmPhone, notes: crmNotes }),
      });
      if (res.ok) {
        const json = await res.json();
        setCrmDatabase((prev) => [
          {
            id: json.data?.id || Date.now(),
            name: crmName,
            phone: crmPhone || "N/A",
            visits: 1,
            lastVisit: "Just now",
            status: "New",
          },
          ...prev,
        ]);
        setCrmName("");
        setCrmPhone("");
        setCrmNotes("");
        setCrmSuccess(true);
        setTimeout(() => setCrmSuccess(false), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCrmSubmitting(false);
    }
  };

  const filtered = logHistory.filter(
    (l) => {
      const timeStr = l.time || (l.createdAt ? new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "");
      const statusStr = l.status || (l.count >= 10 ? "Peak Traffic" : "Regular");
      return timeStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
             statusStr.toLowerCase().includes(searchTerm.toLowerCase());
    }
  );

  return (
    <div
      className={`min-h-screen flex font-sans selection:bg-[#29B28D] selection:text-white transition-colors duration-200 ${
        isDark ? "bg-dark-bg text-[#e6edf3]" : "bg-slate-100 text-slate-900"
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
            active: true,
          },
          {
            icon: Users,
            title: "Customers",
            khmerTitle: "អតិថិជន",
            href: "/vendor/premium/customer",
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
      <main className="flex-1 flex flex-col w-full min-w-0 h-screen overflow-hidden">
        <VendorTopbar
          title={"Customers"}
          isSidebarCollapsed={isCollapsed}
          setIsSidebarCollapsed={setIsCollapsed}
          setIsMobileSidebarOpen={setIsMobileOpen}
          rightActions={
            <>
              {/* FIXED: Adaptive Quick Sale button */}
              <button
                className={`hidden sm:flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
                  isDark
                    ? "bg-white text-slate-900 hover:bg-slate-100"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
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
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0d1117] transition-all w-56 focus-within:border-[#29B28D] focus-within:ring-1 focus-within:ring-[#29B28D] group">
              <Search className="w-4 h-4 text-slate-400 dark:text-[#7d8590] transition-colors group-focus-within:text-[#29B28D]" />
              <input type="text" placeholder="Search Class..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 dark:text-white" />
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
                className={`pb-3 flex flex-col items-start transition-colors ${
                  activeTab === tab.id
                    ? isDark
                      ? "border-b-2 border-white text-white"
                      : "border-b-2 border-slate-900 text-slate-900"
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

          {/* FIXED: 5 Summary Cards (Dynamic dark/light mapping) */}
          {activeTab !== "crm" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <VendorSummaryCard
                variant={isDark ? "dark" : "light"}
                title="Today Customer"
                khmerTitle="អតិថិជនថ្ងៃនេះ"
                value={summaryData.todayCount}
                subtext={`${summaryData.todayLogs} logs`}
              />
              <VendorSummaryCard
                variant={isDark ? "dark" : "light"}
                title="Avg.Spend"
                khmerTitle="ការចំណាយមធ្យម"
                value={summaryData.avgSpend}
                subtext="per customer"
              />
              <VendorSummaryCard
                variant="green"
                title="Weekly Customer"
                khmerTitle="អតិថិជនប្រចាំសប្តាហ៍"
                value={summaryData.weeklyCount}
                subtext={summaryData.weeklyChange}
              />
              <VendorSummaryCard
                variant={isDark ? "dark" : "light"}
                title="Peak Time"
                khmerTitle="ម៉ោងមមាញឹក"
                value={summaryData.peakTime}
                subtext={summaryData.weeklyCustomers}
              />
              <VendorSummaryCard
                variant={isDark ? "dark" : "light"}
                title="Avg.LTV"
                khmerTitle="តម្លៃអតិថិជន"
                value={summaryData.avgLTV}
                subtext="Per Customer"
              />
            </div>
          )}

          {activeTab !== "crm" && (
            <>
              {/* FIXED: Log Customers Bar */}
          <div
            className={`rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border transition-colors ${
              isDark
                ? "bg-[#0d1117] border-white/5"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div>
              <p
                className={`font-bold text-[15px] ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Log Customers
              </p>
              <p
                className={`text-[11px] font-khmer mt-0.5 ${isDark ? "text-[#7d8590]" : "text-slate-500"}`}
              >
                កត់ត្រាអតិថិជន
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[1, 5, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => handleLog(n)}
                  className="px-4 py-2 bg-[#29B28D] hover:bg-[#239979] text-white text-sm font-bold rounded-xl transition-colors min-h-11 shadow-sm"
                >
                  +{n}
                </button>
              ))}
              <div
                className={`flex items-center rounded-xl overflow-hidden border transition-colors ${
                  isDark
                    ? "bg-[#161B22] border-white/5"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <button
                  onClick={() => setCustomCount((c) => Math.max(1, c - 1))}
                  className={`px-3 py-2 transition-colors min-h-11 ${
                    isDark
                      ? "text-white hover:bg-white/5"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span
                  className={`font-bold text-sm w-6 text-center ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {customCount}
                </span>
                <button
                  onClick={() => setCustomCount((c) => c + 1)}
                  className={`px-3 py-2 transition-colors min-h-11 ${
                    isDark
                      ? "text-white hover:bg-white/5"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors min-h-11 border ${
                  isDark
                    ? "bg-[#161B22] border-white/5 text-white hover:bg-white/5"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Custom...
              </button>
              <button
                onClick={() => handleLog(customCount)}
                className="px-5 py-2 bg-[#29B28D] hover:bg-[#239979] text-white font-bold rounded-xl transition-colors text-sm flex items-center gap-1.5 min-h-11 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Log {customCount}
              </button>
            </div>
          </div>

          {/* Log History Table */}
          <div
            className={`border rounded-2xl shadow-sm overflow-hidden transition-colors ${
              isDark
                ? "bg-[#0d1117] border-white/5"
                : "bg-white border-slate-200"
            }`}
          >
            <div
              className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                isDark ? "border-white/5" : "border-slate-100"
              }`}
            >
              <h3
                className={`font-bold text-[17px] ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {/* FIXED: Replaced "Expense History" typo */}
                Customers Log History
              </h3>
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t("common.search") || "Search Log..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#29B28D] min-h-11 transition-colors ${
                    isDark
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
                    className={`border-b text-xs uppercase tracking-wider font-semibold transition-colors ${
                      isDark
                        ? "bg-[#161B22] border-white/5 text-[#7d8590]"
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
                  className={`divide-y transition-colors ${isDark ? "divide-white/5" : "divide-slate-100"}`}
                >
                  {filtered.map((log) => {
                    const timeDisp = log.time || (log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "");
                    const statusDisp = log.status || (log.count >= 10 ? "Peak Traffic" : "Regular");
                    return (
                    <tr
                      key={log.id}
                      className={`transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50/50"}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`flex items-center gap-2 text-[15px] ${isDark ? "text-white" : "text-slate-600"}`}
                        >
                          <Clock className="w-4 h-4 text-slate-400" />
                          {timeDisp}
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
                        {statusDisp === "Peak Traffic" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200">
                            Peak Traffic
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              isDark
                                ? "bg-white/5 text-white border-white/10"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            Regular
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl tracking-widest transition-colors">
                          ···
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* FIXED: Adaptive bottom border color */}
            <div
              className={`px-6 py-4 border-t text-center transition-colors ${
                isDark ? "border-white/5" : "border-slate-100"
              }`}
            >
              <button className="text-[#29B28D] text-sm font-semibold hover:underline">
                View Full History
              </button>
            </div>
          </div>
          </>
          )}

          {activeTab === "crm" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CRM Form */}
              <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5">
                  <h3 className="font-semibold text-[17px] text-slate-900 dark:text-white">Add New Customer</h3>
                </div>
                <div className="p-6 flex-1">
                  <form onSubmit={handleCRMSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[12px] font-bold text-slate-500 dark:text-[#7d8590] mb-1.5 ml-1">Name</label>
                      <input type="text" value={crmName} onChange={(e) => setCrmName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-white/5 rounded-xl text-[15px] text-slate-900 dark:text-white focus:outline-none focus:border-[#29B28D]" required />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-slate-500 dark:text-[#7d8590] mb-1.5 ml-1">Phone Number</label>
                      <input type="tel" value={crmPhone} onChange={(e) => setCrmPhone(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-white/5 rounded-xl text-[15px] text-slate-900 dark:text-white focus:outline-none focus:border-[#29B28D]" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-slate-500 dark:text-[#7d8590] mb-1.5 ml-1">Notes / Preferences</label>
                      <input type="text" value={crmNotes} onChange={(e) => setCrmNotes(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-white/5 rounded-xl text-[15px] text-slate-900 dark:text-white focus:outline-none focus:border-[#29B28D]" />
                    </div>
                    <button type="submit" disabled={crmSubmitting || !crmName.trim()} className="w-full bg-[#29B28D] text-white font-bold py-3.5 rounded-xl mt-2 disabled:opacity-60">{crmSubmitting ? "Saving..." : crmSuccess ? "Saved!" : "Save Customer Info"}</button>
                  </form>
                </div>
              </div>

              {/* CRM Database Table */}
              <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5">
                  <h3 className="font-semibold text-[17px] text-slate-900 dark:text-white">CRM Profiles</h3>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#161B22] border-b text-[11px] uppercase tracking-wider font-semibold border-slate-100 dark:border-white/5 text-slate-500 dark:text-[#7d8590]">
                        <th className="px-5 py-3">Customer</th>
                        <th className="px-5 py-3">Visits</th>
                        <th className="px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {crmDatabase.map((customer) => (
                        <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                          <td className="px-5 py-3">
                            <div className="text-[14px] font-bold text-slate-900 dark:text-white">{customer.name}</div>
                            <div className="text-[12px] text-slate-500 dark:text-[#7d8590]">{customer.phone}</div>
                          </td>
                          <td className="px-5 py-3 font-bold text-slate-700 dark:text-[#c9d1d9]">{customer.visits}</td>
                          <td className="px-5 py-3">
                            <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white">{customer.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
