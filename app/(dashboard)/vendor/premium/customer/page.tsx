"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Package,
  Plus,
  Minus,
  FileBarChart,
  Zap,
  Search,
  Clock,
  Trash2,
  Edit,
  AlertCircle,
  Sparkles,
  Phone,
  User,
  Heart,
  TrendingUp,
  X,
  PlusCircle,
  Filter,
} from "lucide-react";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { offlineFetch } from "@/lib/pwa/offline-fetch";

const TABS = [
  { id: "log", label: "Traffic Log", khmer: "កំណត់ហេតុអតិថិជន" },
  { id: "crm", label: "Customer CRM", khmer: "ទំនាក់ទំនងអតិថិជន" },
  { id: "analysis", label: "Analytics", khmer: "វិភាគអតិថិជន" },
];

const PREMIUM_NAV = [
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
];

export default function CustomersPage() {
  const { language } = useLanguage();
  const isKhmer = language === "km";
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("log");
  const [customCount, setCustomCount] = useState(1);
  const [loading, setLoading] = useState(true);

  // Data States
  const [logHistory, setLogHistory] = useState<any[]>([]);
  const [crmDatabase, setCrmDatabase] = useState<any[]>([]);

  // CRM Form States
  const [crmName, setCrmName] = useState("");
  const [crmPhone, setCrmPhone] = useState("");
  const [crmNotes, setCrmNotes] = useState("");
  const [crmSubmitting, setCrmSubmitting] = useState(false);
  const [crmSuccess, setCrmSuccess] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isLogLogging, setIsLogLogging] = useState(false);
  const [isLogDeleting, setIsLogDeleting] = useState<string | null>(null);
  const [logDeleteModal, setLogDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({ isOpen: false, id: null });
  const [todaySales, setTodaySales] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [custRes, salesRes] = await Promise.all([
          offlineFetch("/api/vendor/customers"),
          offlineFetch("/api/vendor/sales"),
        ]);
        const custJson = await custRes.json();
        const salesJson = await salesRes.json();
        if (custJson.success) {
          setLogHistory(custJson.data.trafficLogs || []);
          setCrmDatabase(custJson.data.customers || []);
        }
        if (salesJson.success) {
          const now = new Date();
          const todayAmt = salesJson.data
            .filter(
              (s: any) =>
                new Date(s.createdAt).toDateString() === now.toDateString(),
            )
            .reduce(
              (sum: number, s: any) => sum + parseFloat(s.amount || "0"),
              0,
            );
          setTodaySales(todayAmt);
        }
      } catch (error) {
        console.error("Failed to fetch customer data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLog = async (amount: number) => {
    if (isLogLogging) return;
    setIsLogLogging(true);
    try {
      const res = await offlineFetch("/api/vendor/customers", {
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
    } finally {
      setIsLogLogging(false);
    }
  };

  const handleDeleteLog = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLogDeleting === id) return;
    setLogDeleteModal({ isOpen: true, id });
  };

  const confirmDeleteLog = async () => {
    if (!logDeleteModal.id) return;
    const id = logDeleteModal.id;
    setLogDeleteModal({ isOpen: false, id: null });
    setIsLogDeleting(id);
    try {
      const res = await offlineFetch(
        `/api/vendor/customers?id=${id}&type=traffic`,
        { method: "DELETE" },
      );
      if (res.ok) {
        setLogHistory((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLogDeleting(null);
    }
  };

  const handleCRMSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crmName.trim() || crmSubmitting) return;
    setCrmSubmitting(true);
    try {
      const res = await offlineFetch("/api/vendor/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: crmName,
          phone: crmPhone,
          notes: crmNotes,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setCrmDatabase((prev) => [json.data, ...prev]);
        setCrmName("");
        setCrmPhone("");
        setCrmNotes("");
        setCrmSuccess(true);
        setIsAddModalOpen(false);
        setTimeout(() => setCrmSuccess(false), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCrmSubmitting(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    try {
      const res = await offlineFetch(
        `/api/vendor/customers/${selectedCustomer.id}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        setCrmDatabase((prev) =>
          prev.filter((c) => c.id !== selectedCustomer.id),
        );
        setIsDeleteModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredLogs = logHistory.filter((l) => {
    const timeStr = l.createdAt
      ? new Date(l.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
    const statusStr = l.count >= 10 ? "Peak Traffic" : "Regular";
    return (
      timeStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      statusStr.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredCRM = crmDatabase.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm)),
  );

  const summaryData = React.useMemo(() => {
    const now = new Date();
    const todayLogs = logHistory.filter(
      (l) => new Date(l.createdAt).toDateString() === now.toDateString(),
    );
    const todayCount = todayLogs.reduce((s, l) => s + (l.count || 0), 0);

    // Peak Hour logic
    const hours: Record<number, number> = {};
    logHistory.forEach((l) => {
      const h = new Date(l.createdAt).getHours();
      hours[h] = (hours[h] || 0) + (l.count || 0);
    });
    const peakHArr = Object.entries(hours).sort((a, b) => b[1] - a[1]);
    const peakH = peakHArr[0]?.[0];
    const peakTime =
      peakH !== undefined
        ? `${Number(peakH) % 12 || 12}:00 ${Number(peakH) >= 12 ? "PM" : "AM"}`
        : "-";

    const weeklyCount = logHistory
      .filter(
        (l) =>
          now.getTime() - new Date(l.createdAt).getTime() <=
          7 * 24 * 60 * 60 * 1000,
      )
      .reduce((s, l) => s + (l.count || 0), 0);

    return {
      todayCount,
      todayLogs: todayLogs.length,
      avgSpend:
        todayCount > 0 ? `$${(todaySales / todayCount).toFixed(2)}` : "$0.00",
      weeklyCount,
      peakTime,
      avgLTV: "$102.02",
    };
  }, [logHistory, todaySales]);

  return (
    <VendorDashboardLayout
      settingsHref="/vendor/premium/settings"
      plan="premium"
      navLinks={PREMIUM_NAV}
      currentPath="/vendor/premium/customer"
      title={isKhmer ? "គ្រប់គ្រងអតិថិជន" : "Customer Management"}
      planBadge={{ label: isKhmer ? "PREMIUM" : "PREMIUM", icon: Sparkles }}
      rightActions={
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#29B28D] hover:bg-[#239979] text-[#0d1117] font-bold px-4 py-2 rounded-[10px] text-sm shadow-[0_2px_14px_rgba(41,178,141,0.28)] transition-colors cursor-pointer border-0"
        >
          <PlusCircle className="w-4 h-4" />{" "}
          {isKhmer ? "បន្ថែមប្រវត្តិ" : "Add Profile"}
        </button>
      }
    >
      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-6 transition-colors">
        <div className="pt-1 pb-1">
          <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">
            {isKhmer ? "អតិថិជនរបស់ខ្ញុំ" : "My Customers"}
          </h2>
          <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
            {isKhmer
              ? "តាមដានចរាចរណ៍ និងគ្រប់គ្រងភាពស្មោះត្រង់"
              : "Track traffic and manage loyalty"}{" "}
            ·{" "}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <VendorSummaryCard
            variant="dark"
            title={isKhmer ? "អតិថិជនថ្ងៃនេះ" : "Today Traffic"}
            khmerTitle="អតិថិជនថ្ងៃនេះ"
            value={summaryData.todayCount}
            subtext={
              isKhmer
                ? `${summaryData.todayLogs} កំណត់ត្រា`
                : `${summaryData.todayLogs} log entries`
            }
          />
          <VendorSummaryCard
            title={isKhmer ? "ការចំណាយមធ្យម" : "Avg. Spend"}
            khmerTitle="ការចំណាយមធ្យម"
            value={summaryData.avgSpend}
            subtext={isKhmer ? "ក្នុងមួយដង" : "per visit"}
          />
          <VendorSummaryCard
            variant="green"
            title={isKhmer ? "ចំនួនសរុបប្រចាំសប្តាហ៍" : "Weekly Reach"}
            khmerTitle="អតិថិជនសរុប"
            value={summaryData.weeklyCount}
            subtext={isKhmer ? "+១២% ធៀបនឹងសប្តាហ៍មុន" : "+12% from last week"}
          />
          <VendorSummaryCard
            title={isKhmer ? "ម៉ោងមមាញឹក" : "Peak Hours"}
            khmerTitle="ម៉ោងមមាញឹក"
            value={summaryData.peakTime}
            subtext={isKhmer ? "ម៉ោងពេលថ្ងៃត្រង់" : "Lunch time spike"}
          />
          <VendorSummaryCard
            title={isKhmer ? "តម្លៃជីវិតអតិថិជន" : "Customer LTV"}
            khmerTitle="តម្លៃអតិថិជន"
            value={summaryData.avgLTV}
            icon={Sparkles}
            subtext={isKhmer ? "តម្លៃសរុប" : "Lifetime value"}
          />
        </div>

        <div className="flex items-end gap-0 border-b border-[#e8eaed] dark:border-white/10 transition-colors">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-[13.5px] font-medium border-b-2 -mb-px flex flex-col items-start gap-0.5 bg-transparent border-x-0 border-t-0 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-[#111827] dark:border-b-white text-[#111827] dark:text-white font-semibold"
                  : "border-b-transparent text-[#6b7280] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white"
              }`}
            >
              <span>{isKhmer ? tab.khmer : tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "log" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors">
              <div>
                <p className="font-bold text-[16px] text-slate-900 dark:text-white">
                  {isKhmer ? "កត់ត្រាចំនួនអតិថិជនរហ័ស" : "Quick Log Traffic"}
                </p>
                <p className="text-[12px] text-slate-500 dark:text-[#7d8590] mt-1">
                  {isKhmer
                    ? "កត់ត្រាចំនួនអតិថិជនដែលមកភ្លាមៗ"
                    : "Immediately record incoming groups"}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {[1, 5, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => handleLog(n)}
                    className="w-14 h-14 bg-[#29B28D] hover:bg-[#239979] text-white text-lg font-bold rounded-xl transition-all shadow-lg shadow-[#29B28D]/20 border-0 cursor-pointer"
                  >
                    +{n}
                  </button>
                ))}
                <div className="flex items-center bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-2 h-14 transition-colors">
                  <button
                    onClick={() => setCustomCount(Math.max(1, customCount - 1))}
                    className="p-2 text-slate-500 hover:text-[#29B28D] transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-10 text-center font-bold text-lg dark:text-white">
                    {customCount}
                  </span>
                  <button
                    onClick={() => setCustomCount(customCount + 1)}
                    className="p-2 text-slate-500 hover:text-[#29B28D] transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => handleLog(customCount)}
                  className="h-14 px-6 bg-[#111827] dark:bg-white text-white dark:text-[#111827] font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity border-0 cursor-pointer shadow-xl"
                >
                  <User className="w-5 h-5" /> {isKhmer ? "កត់ត្រា" : "Log"}{" "}
                  {customCount}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl shadow-sm overflow-hidden transition-colors">
              <div className="p-6 border-b border-[#f0f2f5] dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
                <h3 className="font-bold text-[17px] text-slate-900 dark:text-white">
                  {isKhmer ? "ប្រវត្តិចរាចរណ៍អតិថិជន" : "Traffic History"}
                </h3>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={isKhmer ? "ស្វែងរក..." : "Search logs..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#29B28D] dark:text-white"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 text-[11px] uppercase font-bold text-slate-500 dark:text-[#7d8590] tracking-wider transition-colors">
                      <th className="px-6 py-4">
                        {isKhmer ? "ម៉ោងបញ្ជូល" : "Time Entry"}
                      </th>
                      <th className="px-6 py-4">
                        {isKhmer ? "ចំនួនអតិថិជន" : "Group Size"}
                      </th>
                      <th className="px-6 py-4">
                        {isKhmer ? "ស្ថានភាពចរាចរណ៍" : "Traffic Status"}
                      </th>
                      <th className="px-6 py-4 text-right">
                        {isKhmer ? "សកម្មភាព" : "Action"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 transition-colors">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-12 text-center text-slate-400"
                        >
                          {isKhmer
                            ? "កំពុងទាញយក..."
                            : "Loading traffic logs..."}
                        </td>
                      </tr>
                    ) : filteredLogs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-12 text-center text-slate-400"
                        >
                          {isKhmer ? "មិនឃើញមានកំណត់ត្រាទេ។" : "No logs found."}
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-[14px] font-medium dark:text-white">
                              <Clock className="w-4 h-4 text-slate-400" />{" "}
                              {new Date(log.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-[15px] dark:text-white">
                            +{log.count} {isKhmer ? "នាក់" : "Persons"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold border ${log.count >= 10 ? "bg-orange-50 border-orange-100 text-orange-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"}`}
                            >
                              {log.count >= 10
                                ? isKhmer
                                  ? "មមាញឹកខ្លាំង"
                                  : "Peak Traffic"
                                : isKhmer
                                  ? "ធម្មតា"
                                  : "Regular"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => handleDeleteLog(log.id, e)}
                              disabled={isLogDeleting === log.id}
                              className="text-slate-400 hover:text-red-500 p-1 transition-colors bg-transparent border-0 cursor-pointer disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

        {activeTab === "crm" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl shadow-sm p-6 space-y-5 h-fit transition-colors">
              <div>
                <h3 className="font-bold text-[18px] text-slate-900 dark:text-white">
                  {isKhmer ? "ចុះឈ្មោះអតិថិជន" : "Register Customer"}
                </h3>
                <p className="text-[12px] text-slate-500 dark:text-[#7d8590] mt-1">
                  {isKhmer
                    ? "រក្សាទុកព័ត៌មានសម្រាប់ភាពស្មោះត្រង់ និងការបញ្ចុះតម្លៃ"
                    : "Save details for loyalty & discounts"}
                </p>
              </div>
              <form onSubmit={handleCRMSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700 dark:text-[#9aa4b2] ml-1">
                    {isKhmer ? "ឈ្មោះពេញ" : "Full Name"}
                  </label>
                  <input
                    required
                    placeholder={isKhmer ? "ឧ. ចាន់ ណារ៉េត" : "e.g. John Doe"}
                    value={crmName}
                    onChange={(e) => setCrmName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-psar-primary transition-colors text-sm dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700 dark:text-[#9aa4b2] ml-1">
                    {isKhmer ? "លេខទូរស័ព្ទ" : "Phone Number"}
                  </label>
                  <input
                    placeholder="012 345 678"
                    value={crmPhone}
                    onChange={(e) => setCrmPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-psar-primary transition-colors text-sm dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700 dark:text-[#9aa4b2] ml-1">
                    {isKhmer ? "ចំណូលចិត្ត / សម្គាល់" : "Preferences / Tags"}
                  </label>
                  <textarea
                    placeholder={
                      isKhmer
                        ? "ចូលចិត្តហិរ, អតិថិជនប្រចាំថ្ងៃអាទិត្យ..."
                        : "Likes spicy, regular Sunday buyer..."
                    }
                    value={crmNotes}
                    onChange={(e) => setCrmNotes(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-psar-primary transition-colors text-sm h-24 resize-none dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={crmSubmitting || !crmName.trim()}
                  className="w-full bg-[#29B28D] text-[#0d1117] font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#29B28D]/20 flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50"
                >
                  {crmSubmitting
                    ? isKhmer
                      ? "កំពុងដំណើរការ..."
                      : "Processing..."
                    : crmSuccess
                      ? isKhmer
                        ? "រក្សាទុកអតិថិជនបានជោគជ័យ"
                        : "Customer Saved"
                      : isKhmer
                        ? "បង្កើតព័ត៌មានអតិថិជន"
                        : "Create Profile"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl shadow-sm overflow-hidden transition-colors">
              <div className="p-6 border-b border-[#f0f2f5] dark:border-white/5 flex items-center justify-between transition-colors">
                <h3 className="font-bold text-[17px] text-slate-900 dark:text-white">
                  {isKhmer ? "មូលដ្ឋានទិន្នន័យអតិថិជន" : "Customer Database"}
                </h3>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={isKhmer ? "ស្វែងរក..." : "Search profiles..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#29B28D] dark:text-white"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 text-[11px] uppercase font-bold text-slate-500 dark:text-[#7d8590] transition-colors">
                      <th className="px-6 py-4">
                        {isKhmer ? "ព័ត៌មានអតិថិជន" : "Customer Details"}
                      </th>
                      <th className="px-6 py-4">
                        {isKhmer ? "ភាពស្មោះត្រង់" : "Loyalty Status"}
                      </th>
                      <th className="px-6 py-4">
                        {isKhmer ? "កំណើនថ្មីៗ" : "Recent Growth"}
                      </th>
                      <th className="px-6 py-4 text-right">
                        {isKhmer ? "សកម្មភាព" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 transition-colors">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-12 text-center text-slate-400"
                        >
                          {isKhmer ? "កំពុងទាញយក..." : "Loading profiles..."}
                        </td>
                      </tr>
                    ) : filteredCRM.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-12 text-center text-slate-400"
                        >
                          {isKhmer
                            ? "មិនទាន់មានអតិថិជនចុះឈ្មោះនៅឡើយទេ។"
                            : "No customers registered yet."}
                        </td>
                      </tr>
                    ) : (
                      filteredCRM.map((customer) => (
                        <tr
                          key={customer.id}
                          className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#29B28D]/10 flex items-center justify-center border border-[#29B28D]/20">
                                <User className="w-5 h-5 text-[#29B28D]" />
                              </div>
                              <div>
                                <p className="font-bold text-[14px] text-slate-900 dark:text-white">
                                  {customer.name}
                                </p>
                                <p className="text-[12px] text-slate-500 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />{" "}
                                  {customer.phone ||
                                    (isKhmer ? "គ្មានលេខទូរស័ព្ទ" : "No phone")}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-extrabold shadow-sm">
                              <Heart className="w-3 h-3" />{" "}
                              {isKhmer ? "អតិថិជនប្រចាំ" : "Regular"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[13px]">
                              <TrendingUp className="w-3.5 h-3.5" /> +5%
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-slate-400 hover:text-[#29B28D] transition-colors bg-transparent border-0 cursor-pointer">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-transparent border-0 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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

        {activeTab === "analysis" && (
          <CustomerAnalytics
            logHistory={logHistory}
            crmDatabase={crmDatabase}
            todaySales={todaySales}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCustomer}
        title={isKhmer ? "លុបព័ត៌មានអតិថិជន?" : "Delete Customer Profile?"}
        description={
          isKhmer
            ? "សកម្មភាពនេះមិនអាចផ្លាស់ប្តូរវិញបានទេ។ រាល់ប្រវត្តិចំណាយ និងពិន្ទុភាពស្មោះត្រង់នឹងត្រូវបានលុបជាអចិន្ត្រៃយ៍។"
            : "This action cannot be undone. All spending history and loyalty points will be permanently removed."
        }
        confirmText={isKhmer ? "បាទ, លុបព័ត៌មាន" : "Yes, Delete Profile"}
      />
      <ConfirmModal
        isOpen={logDeleteModal.isOpen}
        onClose={() => setLogDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDeleteLog}
        title={isKhmer ? "លុបកំណត់ហេតុចរាចរណ៍" : "Delete Traffic Log"}
        description={
          isKhmer
            ? "តើអ្នកពិតជាចង់លុបកំណត់ហេតុចរាចរណ៍នេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។"
            : "Are you sure you want to delete this traffic log? This action cannot be undone."
        }
      />

      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
        >
          <div className="w-full max-w-lg rounded-[20px] bg-white dark:bg-[#0d1117] shadow-[0_32px_80px_rgba(0,0,0,0.22)] border border-[#e8eaed] dark:border-white/10 overflow-hidden">
            <div className="px-6 py-5 border-b border-[#f0f2f5] dark:border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-[#111827] dark:text-white">
                  {isKhmer ? "បន្ថែមប្រវត្តិអតិថិជន" : "Add Customer Profile"}
                </h3>
                <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590] mt-1">
                  {isKhmer
                    ? "បង្កើតប្រវត្តិថ្មីសម្រាប់ CRM"
                    : "Create a new profile for your CRM"}
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full bg-[#f0f2f5] dark:bg-white/5 text-[#6b7280] dark:text-[#7d8590] border-0 cursor-pointer hover:text-[#111827] dark:hover:text-white"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCRMSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700 dark:text-[#9aa4b2] ml-1">
                  {isKhmer ? "ឈ្មោះពេញ" : "Full Name"}
                </label>
                <input
                  required
                  placeholder={isKhmer ? "ឧ. ចាន់ ណារ៉េត" : "e.g. John Doe"}
                  value={crmName}
                  onChange={(e) => setCrmName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-psar-primary transition-colors text-sm dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700 dark:text-[#9aa4b2] ml-1">
                  {isKhmer ? "លេខទូរស័ព្ទ" : "Phone Number"}
                </label>
                <input
                  placeholder="012 345 678"
                  value={crmPhone}
                  onChange={(e) => setCrmPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-psar-primary transition-colors text-sm dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700 dark:text-[#9aa4b2] ml-1">
                  {isKhmer ? "ចំណូលចិត្ត / សម្គាល់" : "Preferences / Tags"}
                </label>
                <textarea
                  placeholder={
                    isKhmer
                      ? "ចូលចិត្តហិរ, អតិថិជនប្រចាំថ្ងៃអាទិត្យ..."
                      : "Likes spicy, regular Sunday buyer..."
                  }
                  value={crmNotes}
                  onChange={(e) => setCrmNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-psar-primary transition-colors text-sm h-24 resize-none dark:text-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3.5 rounded-xl bg-[#f0f2f5] dark:bg-white/5 text-[#6b7280] dark:text-[#e6edf3] font-bold text-[14px] border-0 cursor-pointer hover:bg-[#e8eaed] dark:hover:bg-white/10 transition-colors"
                >
                  {isKhmer ? "បិទ" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={crmSubmitting || !crmName.trim()}
                  className="flex-1 py-3.5 rounded-xl bg-[#29B28D] text-[#0d1117] font-bold text-[14px] border-0 cursor-pointer hover:bg-[#239979] transition-colors disabled:opacity-50"
                >
                  {crmSubmitting
                    ? isKhmer
                      ? "កំពុងរក្សាទុក..."
                      : "Saving..."
                    : isKhmer
                      ? "បង្កើតប្រវត្តិ"
                      : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </VendorDashboardLayout>
  );
}

// ─── Customer Analytics Sub-Component ──────────────────────────────────────
function CustomerAnalytics({
  logHistory,
  crmDatabase,
  todaySales,
}: {
  logHistory: any[];
  crmDatabase: any[];
  todaySales: number;
}) {
  const { language } = useLanguage();
  const isKhmer = language === "km";
  const [aiInsights, setAiInsights] = React.useState<any[]>([]);
  const [projectedHourly, setProjectedHourly] = React.useState<number[]>([]);
  const [projectedDaily, setProjectedDaily] = React.useState<any[]>([]);
  const [insightsLoading, setInsightsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await offlineFetch("/api/vendor/ai/insights");
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.insights) {
            setAiInsights(json.data.insights);
            setProjectedHourly(json.data.projectedHourly || []);
            setProjectedDaily(json.data.projectedDaily || []);
          } else if (Array.isArray(json.data)) {
            setAiInsights(json.data); // Fallback for error/old structure
          }
        }
      } catch (err) {
        console.error("Failed to fetch AI insights:", err);
      } finally {
        setInsightsLoading(false);
      }
    }
    fetchInsights();
  }, []);

  // Use ML projections if available, otherwise fallback to history
  const hourlyData = React.useMemo(() => {
    if (projectedHourly.length === 24) return projectedHourly;
    const hours = Array(24).fill(0);
    logHistory.forEach((l) => {
      const h = new Date(l.createdAt).getHours();
      hours[h] += l.count || 0;
    });
    return hours;
  }, [logHistory, projectedHourly]);
  const maxHourly = Math.max(...hourlyData, 1);

  // Use ML projections if available, otherwise fallback to history
  const dailyVisits = React.useMemo(() => {
    if (projectedDaily.length === 7) return projectedDaily;
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const buckets = Array(7).fill(0);
    logHistory.forEach((l) => {
      const d = new Date(l.createdAt);
      const dow = (d.getDay() + 6) % 7;
      buckets[dow] += l.count || 0;
    });
    return days.map((label, i) => ({ label, count: buckets[i] }));
  }, [logHistory, projectedDaily]);
  const maxDaily = Math.max(...dailyVisits.map((d) => d.count), 1);

  // Retention Rate (% of CRM customers that appear in logs — simple heuristic)
  const retentionRate =
    crmDatabase.length > 0
      ? Math.min(
          100,
          Math.round((logHistory.length / (crmDatabase.length * 3)) * 100),
        )
      : 0;

  const totalVisitors = logHistory.reduce((s, l) => s + (l.count || 0), 0);
  const avgPerVisit =
    totalVisitors > 0
      ? (
          todaySales /
          Math.max(
            1,
            logHistory
              .filter(
                (l) =>
                  new Date(l.createdAt).toDateString() ===
                  new Date().toDateString(),
              )
              .reduce((s, l) => s + (l.count || 0), 0),
          )
        ).toFixed(2)
      : "0.00";
  const hasAnalyticsData =
    logHistory.length > 0 || crmDatabase.length > 0 || todaySales > 0;

  return (
    <div className="space-y-6">
      {!hasAnalyticsData && (
        <div className="rounded-2xl border border-dashed border-[#d7dbe3] dark:border-white/10 bg-white dark:bg-[#0d1117] px-5 py-4 text-center transition-colors">
          <p className="text-[14px] font-semibold text-[#111827] dark:text-white">
            {isKhmer
              ? "មិនទាន់មានទិន្នន័យអតិថិជននៅឡើយទេ"
              : "No customer analytics yet"}
          </p>
          <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590] mt-1">
            {isKhmer
              ? "កត់ត្រាចរាចរណ៍ បន្ថែមអតិថិជន ឬបង្កើតការលក់ ដើម្បីបំពេញក្រាហ្វ និងស្ថិតិ។"
              : "Log traffic, add customer profiles, or create sales to populate the charts and metrics."}
          </p>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl p-5 text-center transition-colors">
          <div className="text-[28px] font-black text-[#111827] dark:text-white">
            {totalVisitors}
          </div>
          <div className="text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-wider mt-1">
            {isKhmer ? "អតិថិជនសរុប" : "Total Visitors"}
          </div>
        </div>
        <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl p-5 text-center transition-colors">
          <div className="text-[28px] font-black text-[#29B28D]">
            {retentionRate}%
          </div>
          <div className="text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-wider mt-1">
            {isKhmer ? "អត្រារក្សាអតិថិជន" : "Retention Rate"}
          </div>
        </div>
        <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl p-5 text-center transition-colors">
          <div className="text-[28px] font-black text-[#8b5cf6]">
            {crmDatabase.length}
          </div>
          <div className="text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-wider mt-1">
            {isKhmer ? "ព័ត៌មានដែលបានចុះឈ្មោះ" : "Registered Profiles"}
          </div>
        </div>
        <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl p-5 text-center transition-colors">
          <div className="text-[28px] font-black text-[#f59e0b]">
            ${avgPerVisit}
          </div>
          <div className="text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-wider mt-1">
            {isKhmer ? "មធ្យមការចំណាយថ្ងៃនេះ" : "Avg. Spend Today"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours Heatmap */}
        <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl p-6 transition-colors">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
            <h3 className="font-bold text-[16px] text-[#111827] dark:text-white flex items-center">
              {isKhmer
                ? "ផែនទីកំដៅម៉ោងមមាញឹកដែលបានព្យាករណ៍"
                : "Predicted Peak Hour Heatmap"}
              <span className="text-[10px] text-[#8b5cf6] leading-none font-bold tracking-wider border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-2 py-1 rounded-full ml-2">
                MODEL
              </span>
            </h3>
          </div>
          <div className="grid grid-cols-12 gap-1">
            {hourlyData.slice(6, 22).map((count, i) => {
              const hour = i + 6;
              const intensity = count / maxHourly;
              return (
                <div key={hour} className="flex flex-col items-center gap-1">
                  <div
                    className="w-full aspect-square rounded-lg transition-all"
                    style={{
                      backgroundColor:
                        intensity > 0.7
                          ? "rgba(139, 92, 246, 0.8)"
                          : intensity > 0.4
                            ? "rgba(41, 178, 141, 0.6)"
                            : intensity > 0.1
                              ? "rgba(41, 178, 141, 0.25)"
                              : "rgba(148, 163, 184, 0.1)",
                    }}
                    title={`${hour}:00 — ${count} visitors`}
                  />
                  <span className="text-[8px] text-[#9ca3af] dark:text-[#7d8590]">
                    {hour % 12 || 12}
                    {hour >= 12 ? "p" : "a"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 mt-4 text-[10px] text-[#9ca3af]">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-[rgba(148,163,184,0.1)] border border-slate-200 dark:border-white/10" />{" "}
              {isKhmer ? "តិច" : "Low"}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-[rgba(41, 178, 141, 0.25)]" />{" "}
              {isKhmer ? "មធ្យម" : "Medium"}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-[rgba(41, 178, 141, 0.6)]" />{" "}
              {isKhmer ? "ខ្ពស់" : "High"}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-[rgba(139,92,246,0.8)]" />{" "}
              {isKhmer ? "មមាញឹកខ្លាំង" : "Peak"}
            </div>
          </div>
        </div>

        {/* Visit Frequency Distribution */}
        <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl p-6 transition-colors">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-[#29B28D]" />
            <h3 className="font-bold text-[16px] text-[#111827] dark:text-white flex items-center">
              {isKhmer ? "ការព្យាករណ៍ចរាចរណ៍ ៧ ថ្ងៃ" : "7-Day Traffic Forecast"}
              <span className="text-[10px] text-[#29B28D] leading-none font-bold tracking-wider border border-[#29B28D]/30 bg-[#29B28D]/10 px-2 py-1 rounded-full ml-2">
                MODEL
              </span>
            </h3>
          </div>
          <div className="flex items-end gap-2 h-32">
            {dailyVisits.map((d, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1.5"
              >
                <span className="text-[10px] font-bold text-[#6b7280] dark:text-[#7d8590]">
                  {d.count}
                </span>
                <div
                  className="w-full relative rounded-t-md"
                  style={{ height: "100px" }}
                >
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-[#29B28D] to-[#29B28D]/60 transition-all"
                    style={{
                      height: `${(d.count / maxDaily) * 100}%`,
                      minHeight: d.count > 0 ? "4px" : "0px",
                    }}
                  />
                </div>
                <span className="text-[10px] text-[#9ca3af] dark:text-[#7d8590]">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-[#0d1117] rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-br from-[#8b5cf6] to-[#29B28D] rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[16px] text-white">
              {isKhmer ? "ការវិភាគអតិថិជន AI" : "AI Customer Insights"}
            </h3>
            <p className="text-[11px] text-[#7d8590]">
              Powered by Gemini ·{" "}
              {isKhmer ? "ការវិភាគអតិថិជន AI" : "AI Customer Insights"}
            </p>
          </div>
        </div>
        {insightsLoading ? (
          <div className="flex items-center gap-3 p-4">
            <div className="w-5 h-5 border-2 border-white/20 border-t-[#29B28D] rounded-full animate-spin" />
            <span className="text-[13px] text-[#7d8590]">
              {isKhmer
                ? "កំពុងវិភាគទិន្នន័យអតិថិជនរបស់អ្នក..."
                : "Analyzing your customer data..."}
            </span>
          </div>
        ) : aiInsights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-4 bg-white/[0.04] border border-white/[0.07] rounded-xl hover:bg-white/[0.07] transition-colors"
              >
                <span
                  className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full border mb-3"
                  style={{
                    color: insight.color || "#29B28D",
                    backgroundColor: `${insight.color || "#29B28D"}15`,
                    borderColor: `${insight.color || "#29B28D"}30`,
                  }}
                >
                  {insight.tag}
                </span>
                <h4 className="font-bold text-[14px] text-white mb-1">
                  {insight.title}
                </h4>
                <p className="text-[12px] text-[#7d8590] leading-relaxed">
                  {insight.detail}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[#7d8590] text-[13px]">
              {isKhmer
                ? "កត់ត្រាទិន្នន័យចរាចរណ៍បន្ថែមទៀត ដើម្បីទទួលបានការវិភាគអតិថិជនដោយ AI។"
                : "Log more traffic data to unlock AI-powered customer insights."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
