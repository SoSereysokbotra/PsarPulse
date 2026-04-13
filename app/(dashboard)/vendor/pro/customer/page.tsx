"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Settings,
  Plus,
  TrendingUp,
  Menu,
  X,
  Bell,
  UserPlus,
  Clock,
  Flame,
  Crown,
  FileText,
  FileSpreadsheet,
  Package,
  FileBarChart,
  Search,
  Filter,
  Star,
  UserCheck,
  Minus,
  Zap,
} from "lucide-react";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { offlineFetch } from "@/lib/pwa/offline-fetch";

const PRO_NAV = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    khmerTitle: "ផ្ទាំងគ្រប់គ្រង",
    href: "/vendor/pro",
  },
  {
    icon: CircleDollarSign,
    title: "Sales",
    khmerTitle: "ការលក់",
    href: "/vendor/pro/sales",
  },
  {
    icon: Receipt,
    title: "Expenses",
    khmerTitle: "ចំណាយ",
    href: "/vendor/pro/expenses",
  },
  {
    icon: Users,
    title: "Customers",
    khmerTitle: "អតិថិជន",
    href: "/vendor/pro/customer",
    active: true,
  },
  {
    icon: Package,
    title: "Inventory",
    khmerTitle: "ស្តុក",
    href: "/vendor/pro/inventory",
  },
  {
    icon: FileBarChart,
    title: "Reports",
    khmerTitle: "របាយការណ៍",
    href: "/vendor/pro/reports",
  },
];

export default function ProCustomerPage() {
  const { resolvedTheme } = useTheme();
  const { t, language } = useLanguage();
  const isDark = resolvedTheme === "dark";
  const isKhmer = language === "km";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [customCount, setCustomCount] = useState(1);
  const [qExpAmount, setQExpAmount] = useState("");
  const [isCRMModalOpen, setIsCRMModalOpen] = useState(false);

  // Pro-level CRM form states
  const [crmName, setCrmName] = useState("");
  const [crmPhone, setCrmPhone] = useState("");
  const [crmNotes, setCrmNotes] = useState("");

  const [logs, setLogs] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await offlineFetch("/api/vendor/customers");
        const json = await res.json();
        
        if (json.success && json.data) {
          setCustomers(Array.isArray(json.data.customers) ? json.data.customers : []);
          setLogs(Array.isArray(json.data.trafficLogs) ? json.data.trafficLogs : []);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const safeLogs = Array.isArray(logs) ? logs : [];
  const totalSpentValue = customers.reduce((sum, c: any) => sum + parseFloat(c.totalSpent || 0), 0);

  // Date constants
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Traffic segmented by time
  const todayLogs = safeLogs.filter(log => new Date(log.createdAt) >= todayStart);
  const thisWeekLogs = safeLogs.filter(log => {
    const d = new Date(log.createdAt);
    return d >= sevenDaysAgo;
  });
  const lastWeekLogs = safeLogs.filter(log => {
    const d = new Date(log.createdAt);
    return d >= fourteenDaysAgo && d < sevenDaysAgo;
  });

  const todayCount = todayLogs.reduce((sum, log) => sum + (parseInt(log.count) || 1), 0);
  const thisWeekCount = thisWeekLogs.reduce((sum, log) => sum + (parseInt(log.count) || 1), 0);
  const lastWeekCount = lastWeekLogs.reduce((sum, log) => sum + (parseInt(log.count) || 1), 0);

  // Peak Time Calculation
  const peakTimeStats = safeLogs.reduce((acc: any, log: any) => {
    const hour = new Date(log.createdAt).getHours();
    acc[hour] = (acc[hour] || 0) + (parseInt(log.count) || 1);
    return acc;
  }, {});

  let peakHour = 0;
  let maxTraffic = -1;
  Object.entries(peakTimeStats).forEach(([hour, count]: [string, any]) => {
    if (count > maxTraffic) {
      maxTraffic = count;
      peakHour = parseInt(hour);
    }
  });

  const ampm = peakHour >= 12 ? 'PM' : 'AM';
  const displayPeakHour = peakHour % 12 || 12;
  const peakTimeStr = maxTraffic > 0 ? `${displayPeakHour}:00 ${ampm}` : "N/A";

  // Weekly Change Calculation
  let weeklyChangeStr = "+0%";
  if (lastWeekCount > 0) {
    const change = ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
    weeklyChangeStr = `${change >= 0 ? "+" : ""}${change.toFixed(0)}%`;
  }

  const summaryData = {
    todayCount: String(todayCount),
    todayLogs: String(todayLogs.length),
    avgSpend: safeLogs.length > 0 ? `$${(totalSpentValue / (safeLogs.length || 1)).toFixed(2)}` : "$0.00",
    weeklyCount: String(thisWeekCount),
    weeklyChange: weeklyChangeStr,
    peakTime: peakTimeStr,
    weeklyCustomers: String(thisWeekCount),
    avgLTV: customers.length > 0 ? `$${(totalSpentValue / customers.length).toFixed(2)}` : "$0.00",
  };



  const handleLog = async (amount: number) => {
    const status = amount >= 10 ? "Peak Traffic" : "Regular";
    try {
      const res = await offlineFetch("/api/vendor/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: amount, status }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogQuickExpense = async (amt?: number) => {
    if (typeof amt !== "number" && (!qExpAmount || isNaN(Number(qExpAmount)))) return;
    try {
      const res = await offlineFetch("/api/vendor/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: typeof amt === "number" ? amt : parseFloat(qExpAmount),
          category: "Others",
          description: "Quick log from pro dashboard",
          expenseDate: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setQExpAmount("");
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [crmSubmitting, setCrmSubmitting] = useState(false);
  const [crmSuccess, setCrmSuccess] = useState(false);

  const handleCRMSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crmName.trim() || crmSubmitting) return;
    setCrmSubmitting(true);
    try {
      const res = await offlineFetch("/api/vendor/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: crmName, phone: crmPhone, notes: crmNotes }),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setCustomers((prev) => [result.data, ...prev]);
        }
        setCrmSuccess(true);
        setTimeout(() => {
          setCrmSuccess(false);
          setCrmName("");
          setCrmPhone("");
          setCrmNotes("");
          setIsCRMModalOpen(false);
        }, 900);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCrmSubmitting(false);
    }
  };

  return (
    <VendorDashboardLayout
      settingsHref="/vendor/pro/settings"
      plan="pro"
      navLinks={PRO_NAV}
      currentPath="/vendor/pro/customer"
      title={t("dashboard.customerSection.title")}
      planBadge={{ label: "PRO", icon: Crown }}
      rightActions={
        <>
          <button className="hidden sm:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            <Zap className="w-3.5 h-3.5 text-[#29B28D]" />
            {t("dashboard.actions.quickSale")}
          </button>
          <button className="hidden sm:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            <FileText className="w-3.5 h-3.5" />
            {t("dashboard.actions.exportPdf")}
          </button>
          <button className="hidden sm:flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 dark:bg-[#0d1117] text-slate-700 dark:text-[#c9d1d9] text-sm font-medium px-4 py-2 rounded-xl transition-colors">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            {t("dashboard.actions.exportExcel")}
          </button>
        </>
      }
    >
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">
        {/* ── Page header ── */}
        <div className="pt-1 pb-2">
          <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">
            {t("dashboard.customerSection.title")}
          </h2>
          <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
            {isKhmer ? "តាមដាន និងកត់ត្រាអតិថិជន" : t("dashboard.customerSection.subtitle")}
          </p>
        </div>

        {/* CRM Modal */}
        {isCRMModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div
              className="absolute inset-0"
              onClick={() => setIsCRMModalOpen(false)}
            ></div>
            <div className="bg-white dark:bg-dark-surface rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsCRMModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:text-[#c9d1d9] p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-psar-primary/10 text-psar-primary rounded-lg">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[19px] text-slate-900 dark:text-white">
                    {t("dashboard.customerSection.crmTitle")}
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-[#7d8590]">
                    {t("dashboard.customerSection.crmSubtitle")}
                  </p>
                </div>
              </div>

              <form onSubmit={handleCRMSubmit} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-500 dark:text-[#7d8590] mb-1.5 ml-1">
                    {t("dashboard.customerSection.crmName")}
                  </label>
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={crmName}
                    onChange={(e) => setCrmName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 rounded-xl text-[15px] focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-500 dark:text-[#7d8590] mb-1.5 ml-1">
                    {t("dashboard.customerSection.crmPhone")}
                  </label>
                  <input
                    type="tel"
                    placeholder="012 345 678"
                    value={crmPhone}
                    onChange={(e) => setCrmPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 rounded-xl text-[15px] focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-500 dark:text-[#7d8590] mb-1.5 ml-1">
                    {t("dashboard.customerSection.crmNotes")}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Prefers less sugar"
                    value={crmNotes}
                    onChange={(e) => setCrmNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 rounded-xl text-[15px] focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={crmSubmitting || !crmName.trim()}
                  className="w-full bg-psar-primary hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition-colors mt-2 disabled:opacity-60"
                >
                  {crmSubmitting ? t("dashboard.customerSection.crmSaving") : crmSuccess ? `${t("dashboard.customerSection.crmSaved")}` : t("dashboard.customerSection.crmSave")}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 5 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <VendorSummaryCard
            variant="dark"
            title={t("dashboard.metrics.todayCustomer")}
            khmerTitle="អតិថិជនថ្ងៃនេះ"
            value={summaryData.todayCount}
            subtext={`${summaryData.todayLogs} logs`}
          />
          <VendorSummaryCard
            title={t("dashboard.metrics.avgSpend")}
            khmerTitle="កាន់ឈ្នួលការចាយ"
            value={summaryData.avgSpend}
            subtext="per customer"
            variant={isDark ? "dark" : "light"}
          />
          <VendorSummaryCard
            variant="green"
            title={t("dashboard.metrics.weeklyCustomer")}
            khmerTitle="អតិថិជនច្រើនជាងក្នុងរូប"
            value={summaryData.weeklyCount}
            subtext={summaryData.weeklyChange}
          />
          <VendorSummaryCard
            title={t("dashboard.metrics.peakTime")}
            khmerTitle="ណែនាំការប្រា"
            value={summaryData.peakTime}
            subtext={summaryData.weeklyCustomers}
            variant={isDark ? "dark" : "light"}
          />
          <VendorSummaryCard
            title={t("dashboard.metrics.avgLtv")}
            khmerTitle="ភ្លេចអតិថិជន"
            value={summaryData.avgLTV}
            subtext="Per Customer"
            variant={isDark ? "dark" : "light"}
          />
        </div>

        {/* Log Customers Bar */}
        <div className="bg-slate-900 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white text-[15px]">{t("dashboard.actions.logTraffic")}</p>
            <p className="text-[11px] font-khmer text-slate-400 mt-0.5">
              {t("dashboard.actions.logTrafficSub")}
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
            <button
              onClick={() => handleLog(customCount)}
              className="px-5 py-2 bg-[#29B28D] hover:bg-[#239979] text-white font-bold rounded-xl transition-colors text-sm flex items-center gap-1.5 min-h-11"
            >
              <Plus className="w-4 h-4" />
              {t("dashboard.actions.log")} {customCount}
            </button>
          </div>
        </div>

  

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pro Feature: CRM Database View */}
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:bg-dark-surface dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[17px] text-slate-900 dark:text-white">
                  {t("dashboard.customerSection.crmDatabase")}
                </h3>
                <p className="text-[13px] text-slate-500 dark:text-[#7d8590] mt-0.5">
                  {t("dashboard.customerSection.crmDatabaseSub")}
                </p>
              </div>
              <button 
                onClick={() => setIsCRMModalOpen(true)}
                className="flex items-center gap-2 bg-psar-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-[0_2px_14px_rgba(41,178,141,0.28)] hover:bg-[#249e7d] transition-all cursor-pointer border-0"
              >
                <Plus className="w-4 h-4" /> {isKhmer ? "បន្ថែមអតិថិជន" : "Add Customer"}
              </button>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0d1117]/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 text-[11px] text-slate-500 dark:text-[#7d8590] uppercase tracking-wider font-semibold">
                    <th className="px-5 py-3">{t("dashboard.customerSection.crmCustomer")}</th>
                    <th className="px-5 py-3">{t("dashboard.table.spent") || "Spent"}</th>
                    <th className="px-5 py-3">{t("dashboard.table.joined") || "Joined"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {customers.map((customer: any) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-psar-primary/10 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="text-[14px] font-bold text-slate-900 dark:text-white">
                          {customer.name}
                        </div>
                        <div className="text-[12px] text-slate-500 dark:text-[#7d8590]">
                          {customer.phone}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-bold text-[#29B28D] text-[15px]">
                          ${parseFloat(customer.totalSpent || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-[#9aa4b2]">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0d1117] text-center">
              <button className="text-[13px] font-semibold text-psar-primary hover:underline">
                {t("dashboard.customerSection.crmViewAll")}
              </button>
            </div>
          </div>

          {/* Foot Traffic Log */}
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:bg-dark-surface dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[17px] text-slate-900 dark:text-white">
                  {t("dashboard.traffic.title")}
                </h3>
                <p className="text-[13px] text-slate-500 dark:text-[#7d8590] mt-0.5">
                  {t("dashboard.traffic.subtitle")}
                </p>
              </div>
              <Filter className="w-4 h-4 text-slate-400" />
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0d1117]/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 text-[11px] text-slate-500 dark:text-[#7d8590] uppercase tracking-wider font-semibold">
                    <th className="px-5 py-3">{t("dashboard.traffic.time")}</th>
                    <th className="px-5 py-3">{t("dashboard.traffic.count")}</th>
                    <th className="px-5 py-3">{t("dashboard.traffic.type")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {safeLogs.map((logEntry: any) => (
                    <tr
                      key={logEntry.id}
                      className="hover:bg-slate-50 dark:hover:bg-white/5 dark:bg-[#0d1117]/50 dark:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-[13px] font-medium text-slate-600 dark:text-[#9aa4b2]">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(logEntry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-[15px] font-bold text-slate-900 dark:text-white">
                          +{logEntry.count || 1}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {parseInt(logEntry.count) >= 5 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-[11px] font-bold">
                            <Flame className="w-3 h-3" /> Peak
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:text-[#9aa4b2] text-[11px] font-bold">
                            Manual
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0d1117] text-center">
              <button className="text-[13px] font-semibold text-[#29B28D] hover:underline">
                {t("dashboard.traffic.viewHistory")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </VendorDashboardLayout>
  );
}
