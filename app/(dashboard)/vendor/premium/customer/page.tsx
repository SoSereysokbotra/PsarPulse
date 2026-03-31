"use client";

import React, { useState, useEffect } from "react";
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
  Phone,
  Mail,
  Calendar,
  Trash2,
  Edit,
  MoreVertical,
  Check,
  AlertCircle,
  Crown,
  History,
  TrendingDown,
  Info,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorTopbar from "@/components/vendor/VendorTopbar";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { ConfirmModal } from "@/components/ConfirmModal";

const TABS = [
  { id: "analysis", label: "Customers Analysis", khmer: "វិភាគអតិថិជន" },
  {
    id: "forecast",
    label: "Forecast Analytics Widget",
    khmer: "ការព្យាករណ៍វិភាគទិន្នន័យ",
  },
  { id: "log", label: "Customers Log", khmer: "កំណត់ហេតុអតិថិជន" },
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
  const [logs, setLogs] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayCount: 0,
    todayLogs: 0,
    avgSpend: "$0.00",
    weeklyCount: 0,
    weeklyChange: "+0% then last week",
    weeklyCustomers: "0 Customers",
    peakTime: "N/A",
    avgLTV: "$0.00",
    topCustomers: [] as any[],
  });

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Forecast State
  const [forecastData, setForecastData] = useState<any>(null);
  const [forecastLoading, setForecastLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    totalSpent: "0",
    points: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/vendor/customers/stats");
      const json = await res.json();
      if (json.success) setStats(json.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vendor/traffic");
      const json = await res.json();
      if (json.success) setLogs(json.data);
    } catch (error) {
      console.error("Failed to fetch traffic logs", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vendor/customers");
      const json = await res.json();
      if (json.success) setCustomers(json.data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async () => {
    setForecastLoading(true);
    try {
      const res = await fetch("/api/vendor/customers/forecast");
      const json = await res.json();
      if (json.success) setForecastData(json.data);
    } catch (error) {
      console.error("Failed to fetch forecast", error);
    } finally {
      setForecastLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    if (activeTab === "log") fetchLogs();
    if (activeTab === "analysis") fetchCustomers();
    if (activeTab === "forecast") fetchForecast();
  }, [activeTab]);

  const handleLog = async (amount: number) => {
    try {
      const res = await fetch("/api/vendor/traffic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: amount }),
      });
      if (res.ok) {
        const json = await res.json();
        setLogs(prev => [json.data, ...prev]);
        setCustomCount(1);
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCustomer = async () => {
    const isEdit = !!editingCustomer;
    const url = "/api/vendor/customers";
    const method = isEdit ? "PATCH" : "POST";
    const body = isEdit ? { ...formData, id: editingCustomer.id } : formData;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setEditingCustomer(null);
        setFormData({ name: "", phone: "", email: "", totalSpent: "0", points: 0 });
        fetchCustomers();
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to save customer", error);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/vendor/customers?id=${deletingId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setDeletingId(null);
        fetchCustomers();
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to delete customer", error);
    }
  };

  const filteredLogs = logs.filter((l) => 
    l.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(l.createdAt).toLocaleTimeString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone && c.phone.includes(searchTerm)) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
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

      <main className="flex-1 flex flex-col w-full min-w-0 h-screen overflow-hidden">
        <VendorTopbar
          title={"Customers"}
          isSidebarCollapsed={isCollapsed}
          setIsSidebarCollapsed={setIsCollapsed}
          setIsMobileSidebarOpen={setIsMobileOpen}
          rightActions={
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
          }
        />

        <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className={`text-[26px] font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                My Customers
              </h1>
              <p className={`text-sm mt-0.5 ${isDark ? "text-[#7d8590]" : "text-slate-500"}`}>
                Tracker and Log your daily foot traffic
              </p>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0d1117] transition-all w-56 focus-within:border-[#29B28D] focus-within:ring-1 focus-within:ring-[#29B28D] group">
              <Search className="w-4 h-4 text-slate-400 dark:text-[#7d8590] transition-colors group-focus-within:text-[#29B28D]" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 dark:text-white" 
              />
            </div>
          </div>

          <div className={`flex gap-6 border-b transition-colors ${isDark ? "border-white/5" : "border-slate-200"}`}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 flex flex-col items-start transition-colors ${
                  activeTab === tab.id
                    ? isDark ? "border-b-2 border-white text-white" : "border-b-2 border-slate-900 text-slate-900"
                    : isDark ? "border-b-2 border-transparent text-[#7d8590] hover:text-white" : "border-b-2 border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <span className="font-semibold text-sm">{tab.label}</span>
                <span className={`text-[10px] mt-0.5 ${isKhmer ? "font-suwannaphum" : ""}`}>
                  {tab.khmer}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <VendorSummaryCard
              variant={isDark ? "dark" : "light"}
              title="Today Customer"
              khmerTitle="អតិថិជនថ្ងៃនេះ"
              value={stats.todayCount}
              subtext={`${stats.todayLogs} logs`}
            />
            <VendorSummaryCard
              variant={isDark ? "dark" : "light"}
              title="Avg.Spend"
              khmerTitle="ការចំណាយមធ្យម"
              value={stats.avgSpend}
              subtext="per customer"
            />
            <VendorSummaryCard
              variant="green"
              title="Weekly Customer"
              khmerTitle="អតិថិជនប្រចាំសប្តាហ៍"
              value={stats.weeklyCount}
              subtext={stats.weeklyChange}
            />
            <VendorSummaryCard
              variant={isDark ? "dark" : "light"}
              title="Peak Time"
              khmerTitle="ម៉ោងមមាញឹក"
              value={stats.peakTime}
              subtext={stats.weeklyCustomers}
            />
            <VendorSummaryCard
              variant={isDark ? "dark" : "light"}
              title="Avg.LTV"
              khmerTitle="តម្លៃអតិថិជន"
              value={stats.avgLTV}
              subtext="Per Customer"
            />
          </div>

          {activeTab === "log" && (
            <>
              <div className={`rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border transition-colors ${
                isDark ? "bg-[#0d1117] border-white/5" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div>
                  <p className={`font-bold text-[15px] ${isDark ? "text-white" : "text-slate-900"}`}>Log Customers</p>
                  <p className={`text-[11px] font-khmer mt-0.5 ${isDark ? "text-[#7d8590]" : "text-slate-500"}`}>កត់ត្រាអតិថិជន</p>
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
                  <div className={`flex items-center rounded-xl overflow-hidden border transition-colors ${
                    isDark ? "bg-[#161B22] border-white/5" : "bg-slate-50 border-slate-200"
                  }`}>
                    <button
                      onClick={() => setCustomCount((c) => Math.max(1, c - 1))}
                      className={`px-3 py-2 transition-colors min-h-11 ${
                        isDark ? "text-white hover:bg-white/5" : "text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className={`font-bold text-sm w-6 text-center ${isDark ? "text-white" : "text-slate-900"}`}>
                      {customCount}
                    </span>
                    <button
                      onClick={() => setCustomCount((c) => c + 1)}
                      className={`px-3 py-2 transition-colors min-h-11 ${
                        isDark ? "text-white hover:bg-white/5" : "text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={() => handleLog(customCount)} className="px-5 py-2 bg-[#29B28D] hover:bg-[#239979] text-white font-bold rounded-xl transition-colors text-sm flex items-center gap-1.5 min-h-11 shadow-sm">
                    <Plus className="w-4 h-4" /> Log {customCount}
                  </button>
                </div>
              </div>

              <div className={`border rounded-2xl shadow-sm overflow-hidden transition-colors ${
                isDark ? "bg-[#0d1117] border-white/5" : "bg-white border-slate-200"
              }`}>
                <div className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  isDark ? "border-white/5" : "border-slate-100"
                }`}>
                  <h3 className={`font-bold text-[17px] ${isDark ? "text-white" : "text-slate-900"}`}>
                    Customers Log History
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-xs uppercase tracking-wider font-semibold transition-colors ${
                        isDark ? "bg-[#161B22] border-white/5 text-[#7d8590]" : "bg-slate-50/50 border-slate-100 text-slate-500"
                      }`}>
                        <th className="px-6 py-4">Time Logged</th>
                        <th className="px-6 py-4">Count</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y transition-colors ${isDark ? "divide-white/5" : "divide-slate-100"}`}>
                      {loading ? (
                        <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">Loading…</td></tr>
                      ) : filteredLogs.length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No logs found.</td></tr>
                      ) : (
                        filteredLogs.map((log) => (
                          <tr key={log.id} className={`transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50/50"}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`flex items-center gap-2 text-[15px] ${isDark ? "text-white" : "text-slate-600"}`}>
                                <Clock className="w-4 h-4 text-slate-400" />
                                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[15px] font-bold ${isDark ? "text-white" : "text-slate-900"}`}>+{log.count || 1}</span>
                                <Users className="w-3.5 h-3.5 text-slate-400" />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                log.status === "Peak Traffic" 
                                  ? "bg-orange-100 text-orange-700 border-orange-200"
                                  : isDark ? "bg-white/5 text-white border-white/10" : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl tracking-widest transition-colors">···</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "analysis" && (
            <div className="space-y-6">
              {/* Top Spenders Visual */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(() => {
                  const topWithSpend = (stats.topCustomers || []).filter(
                    (c: any) => parseFloat(c.totalSpent || "0") > 0
                  );
                  if (topWithSpend.length > 0) {
                    return topWithSpend.map((top: any, idx: number) => (
                      <div 
                        key={top.id}
                        className={`relative p-6 rounded-3xl border transition-all hover:scale-[1.02] cursor-pointer ${
                          isDark ? "bg-[#0d1117] border-white/5" : "bg-white border-slate-200 shadow-sm"
                        }`}
                        onClick={() => {
                          setEditingCustomer(top);
                          setFormData({
                            name: top.name,
                            phone: top.phone || "",
                            email: top.email || "",
                            totalSpent: top.totalSpent,
                            points: top.points
                          });
                          setIsAddModalOpen(true);
                        }}
                      >
                        <div className="absolute top-4 right-4">
                          {idx === 0 && <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />}
                          {idx === 1 && <Sparkles className="w-5 h-5 text-slate-400" />}
                          {idx === 2 && <TrendingUp className="w-5 h-5 text-[#29B28D]" />}
                        </div>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            idx === 0 ? "bg-yellow-500/10 text-yellow-600" : "bg-[#29B28D]/10 text-[#29B28D]"
                          }`}>
                            {top.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{top.name}</p>
                            <p className="text-xs text-slate-400 font-medium">#{idx + 1} Top Spender</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-white/5">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Spent</p>
                            <p className="text-lg font-bold text-[#29B28D]">${parseFloat(top.totalSpent).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Points</p>
                            <p className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{top.points}</p>
                          </div>
                        </div>
                      </div>
                    ));
                  }
                  // No customers with spending data — show helpful empty state
                  return (
                    <div className="md:col-span-3">
                      <div className={`p-8 rounded-3xl border-2 border-dashed flex flex-col items-center text-center gap-3 ${
                        isDark ? "border-white/10" : "border-slate-200"
                      }`}>
                        <Crown className="w-10 h-10 text-yellow-500/40" />
                        <div>
                          <p className={`font-bold text-base mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>No top spenders yet</p>
                          <p className="text-sm text-slate-400 max-w-sm">
                            Add customers with their spending data — or edit existing customers to set how much they&apos;ve spent.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingCustomer(null);
                            setFormData({ name: "", phone: "", email: "", totalSpent: "0", points: 0 });
                            setIsAddModalOpen(true);
                          }}
                          className="mt-1 px-5 py-2 bg-[#29B28D] hover:bg-[#239979] text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add Customer with Spending
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>


              {/* Customer Directory */}
              <div className={`border rounded-2xl shadow-sm overflow-hidden transition-colors ${
                isDark ? "bg-[#0d1117] border-white/5" : "bg-white border-slate-200"
              }`}>
                <div className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  isDark ? "border-white/5" : "border-slate-100"
                }`}>
                  <h3 className={`font-bold text-[17px] ${isDark ? "text-white" : "text-slate-900"}`}>
                    Customer Directory
                  </h3>
                  <button 
                    onClick={() => {
                      setEditingCustomer(null);
                      setFormData({ name: "", phone: "", email: "", totalSpent: "0", points: 0 });
                      setIsAddModalOpen(true);
                    }}
                    className="bg-[#29B28D] hover:bg-[#239979] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add New Customer
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-xs uppercase tracking-wider font-semibold transition-colors ${
                        isDark ? "bg-[#161B22] border-white/5 text-[#7d8590]" : "bg-slate-50/50 border-slate-100 text-slate-500"
                      }`}>
                        <th className="px-6 py-4">Customer Name</th>
                        <th className="px-6 py-4">Contact Info</th>
                        <th className="px-6 py-4">Total Spent</th>
                        <th className="px-6 py-4">Points</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y transition-colors ${isDark ? "divide-white/5" : "divide-slate-100"}`}>
                      {loading ? (
                        <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading…</td></tr>
                      ) : filteredCustomers.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No customers found.</td></tr>
                      ) : (
                        filteredCustomers.map((customer) => (
                          <tr key={customer.id} className={`transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50/50"}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#29B28D]/10 flex items-center justify-center text-[#29B28D] font-bold text-xs">
                                  {customer.name.charAt(0).toUpperCase()}
                                </div>
                                <span className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{customer.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                  <Phone className="w-3 h-3" /> {customer.phone || "N/A"}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                  <Mail className="w-3 h-3" /> {customer.email || "N/A"}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-bold text-[#29B28D]">${parseFloat(customer.totalSpent).toFixed(2)}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                                {customer.points} PTS
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => {
                                    setEditingCustomer(customer);
                                    setFormData({
                                      name: customer.name,
                                      phone: customer.phone || "",
                                      email: customer.email || "",
                                      totalSpent: customer.totalSpent,
                                      points: customer.points
                                    });
                                    setIsAddModalOpen(true);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-[#29B28D] transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    setDeletingId(customer.id);
                                    setIsDeleteModalOpen(true);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
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

          {activeTab === "forecast" && (
            <div className="space-y-6">
              <div className={`p-6 rounded-3xl border transition-colors ${
                isDark ? "bg-[#0d1117] border-white/5" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className={`font-bold text-lg ${isDark ? "text-white" : "text-slate-900"}`}>24-Hour Traffic Forecast</h3>
                    <p className="text-xs text-slate-400 font-medium">Predictive visitor patterns based on historical logs</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Historical Average</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#29B28D]"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Forecast</span>
                    </div>
                  </div>
                </div>

                <div className="h-[300px] w-full">
                  {forecastLoading ? (
                    <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm animate-pulse">Computing forecast...</div>
                  ) : forecastData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecastData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#29B28D" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#29B28D" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#ffffff08" : "#f1f5f9"} />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                          interval={2}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? '#0d1117' : '#ffffff',
                            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                          }}
                          itemStyle={{ color: '#29B28D' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="historical" 
                          stroke="#cbd5e1" 
                          strokeWidth={2}
                          fill="transparent" 
                          strokeDasharray="5 5"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="forecast" 
                          stroke="#29B28D" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorForecast)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 gap-2">
                       <Clock className="w-8 h-8 opacity-20" />
                       <p className="text-sm">Log more traffic data to enable visual forecasting</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-3xl border relative overflow-hidden group ${
                  isDark ? "bg-[#0d1117] border-white/5" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all">
                    <Sparkles className={`w-24 h-24 ${isDark ? "text-white" : "text-[#29B28D]"}`} />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-[#29B28D]/10 text-[#29B28D]">
                      <Zap className="w-4 h-4" />
                    </div>
                    <h4 className={`font-bold text-[15px] ${isDark ? "text-white" : "text-slate-900"}`}>AI Smart Insight</h4>
                  </div>
                  
                  <p className={`text-sm leading-relaxed mb-4 ${isDark ? "text-[#7d8590]" : "text-slate-600"}`}>
                    {forecastLoading ? "Analyzing patterns..." : forecastData?.aiInsight || "No insights available yet."}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-wider">
                      Premium AI
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Powered by Gemini 1.5 Flash</span>
                  </div>
                </div>

                <div className={`p-6 rounded-3xl border flex flex-col justify-between ${
                  isDark ? "bg-[#0d1117] border-white/5" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${isDark ? "bg-white/5 text-white" : "bg-slate-100 text-slate-600"}`}>
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <h4 className={`font-bold text-[15px] ${isDark ? "text-white" : "text-slate-900"}`}>Trend Analysis</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Predicted Staffing Need</span>
                        <span className="text-xs font-bold text-[#29B28D]">Moderate</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Inventory Readiness</span>
                        <span className="text-xs font-bold text-orange-500">Check Drinks</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Marketing Opportuntity</span>
                        <span className="text-xs font-bold text-blue-500">Afternoon Promo</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={fetchForecast}
                    className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Refresh Forecast
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-3xl shadow-2xl p-7 transition-colors ${isDark ? "bg-[#0d1117] border border-white/5" : "bg-white"}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {editingCustomer ? "Edit Customer" : "New Customer"}
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#29B28D] transition-all ${
                    isDark ? "bg-[#161B22] border-white/5 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200"
                  }`}
                  placeholder="e.g. John Doe"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Phone</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#29B28D] transition-all ${
                      isDark ? "bg-[#161B22] border-white/5 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200"
                    }`}
                    placeholder="012 345 678"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#29B28D] transition-all ${
                      isDark ? "bg-[#161B22] border-white/5 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200"
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                    Total Spent ($)
                    {!editingCustomer && <span className="ml-1 text-[#29B28D] normal-case font-normal">— optional</span>}
                  </label>
                  <input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.totalSpent}
                    onChange={(e) => setFormData({...formData, totalSpent: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#29B28D] transition-all ${
                      isDark ? "bg-[#161B22] border-white/5 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                    Loyalty Points
                    {!editingCustomer && <span className="ml-1 text-[#29B28D] normal-case font-normal">— optional</span>}
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={formData.points}
                    onChange={(e) => setFormData({...formData, points: parseInt(e.target.value) || 0})}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#29B28D] transition-all ${
                      isDark ? "bg-[#161B22] border-white/5 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200"
                    }`}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${
                  isDark ? "bg-white/5 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveCustomer}
                disabled={!formData.name}
                className="flex-1 py-3.5 rounded-xl bg-[#29B28D] text-white font-bold text-sm hover:bg-[#239979] transition-all shadow-lg shadow-[#29B28D]/20 disabled:opacity-50"
              >
                {editingCustomer ? "Update Profile" : "Create Customer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCustomer}
        title="Delete Customer Profile?"
        description="This action cannot be undone. All spending history and loyalty points for this customer will be permanently removed."
        confirmText="Yes, Delete Profile"
      />
    </div>
  );
}
