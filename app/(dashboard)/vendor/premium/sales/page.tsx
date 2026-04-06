"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Package,
  Plus,
  Search,
  MoreVertical,
  X,
  Clock,
  Filter,
  TrendingUp,
  TrendingDown,
  FileBarChart,
  Sparkles,
  FileText,
  FileSpreadsheet,
  Brain,
  MessageSquare,
  Zap,
  CheckCircle2,
  Send,
} from "lucide-react";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import AIHub from "@/components/vendor/premium/AIHub";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { offlineFetch } from "@/lib/pwa/offline-fetch";

// ─── Local Types ───────────────────────────────────────────────────
export type Period = "Day" | "Week" | "Month";
export type Method = "Cash" | "ABA/KHQR" | "Other";
export type ToastT = {
  id: number;
  msg: string;
  type: "success" | "error";
};

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
    active: true,
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

// Data fetch uses dynamic state

const smartAlerts = [
  {
    type: "opportunity",
    message:
      "Rain starting! Demand for Hot Lattes is spiking. Suggest moving cups to the front.",
    time: "10 min ago",
  },
  {
    type: "warning",
    message:
      "Sales dropped 15% in the last hour compared to historical average.",
    time: "1 hour ago",
  },
];

const weatherData = {
  condition: "Rainy Evening",
  temp: "28°C",
  icon: "Rain",
  impact: "busy",
  suggestions: [
    {
      product: "Mango Sticky Rice",
      change: "+20%",
      reason: "Comfort food demand rises in rain",
    },
  ],
};
// ═══════════════════════════════════════════════════════════════════
export default function PremiumSalesPage() {
  const { language } = useLanguage();
  const isKhmer = language === "km";
  const [salesRaw, setSalesRaw] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickAmount, setQuickAmount] = useState("");
  const [quickItem, setQuickItem] = useState("");
  const [quickCategory, setQuickCategory] = useState("");
  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [period, setPeriod] = useState<Period>("Day");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSmartActive, setIsSmartActive] = useState(false);
  const [smartPrompt, setSmartPrompt] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [quickMethod, setQuickMethod] = useState<Method>("Cash");
  const [toasts, setToasts] = useState<ToastT[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const showToast = useCallback((msg: string, type: ToastT["type"] = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await offlineFetch("/api/vendor/sales");
      const json = await res.json();
      if (json.success) setSalesRaw(json.data);
    } catch (err) {
      console.error("Sales fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSmartParse = async () => {
    if (!smartPrompt || isParsing) return;
    setIsParsing(true);
    try {
      const res = await offlineFetch("/api/vendor/ai/smart-add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: smartPrompt }),
      });
      const json = await res.json();
      if (json.success) {
        setQuickAmount(json.data.amount.toString());
        setQuickItem(json.data.items);
        setQuickCategory(json.data.category);
        if (json.data.method) {
          setQuickMethod(json.data.method as Method);
        }
        setIsSmartActive(false); // Move to review step
      }
    } catch (err) {
      console.error("Smart parse error:", err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleExportPDF = () => {
    const printContent = `
      <html>
        <head>
          <title>PsarPulse Premium Sales Report</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #111827; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #29B28D; pb: 20px; mb: 30px; }
            .title { font-size: 24px; font-weight: 800; color: #111827; }
            .meta { font-size: 12px; color: #6b7280; }
            table { w-full; border-collapse: collapse; mt: 30px; }
            th { text-align: left; padding: 12px; font-size: 11px; text-transform: uppercase; color: #9ca3af; border-bottom: 1px solid #e8eaed; }
            td { padding: 12px; font-size: 13px; border-bottom: 1px solid #f0f2f5; }
            .amount { font-weight: 700; color: #29B28D; }
            .footer { mt: 50px; pt: 20px; border-top: 1px solid #e8eaed; font-size: 10px; color: #9ca3af; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">Sales Performance Report</div>
              <div class="meta">PsarPulse Premium · Generated ${new Date().toLocaleString()}</div>
            </div>
            <div style="text-align: right">
              <div style="font-weight: 800; font-size: 18px; color: #29B28D">Premium Tier</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Items Sold</th>
                <th>Method</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${filteredSales.map(s => `
                <tr>
                  <td>${new Date(s.createdAt).toLocaleDateString()}</td>
                  <td>${s.items || "N/A"}</td>
                  <td>${s.method || "Cash"}</td>
                  <td class="amount">$${parseFloat(s.amount).toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="footer">
            Confidential Business Report · Generated by PsarPulse AI Intelligence
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const filteredSales = useMemo(() => {
    const now = new Date();
    const isWithinPeriod = (dateStr: string) => {
      const d = new Date(dateStr);
      if (period === "Day") return d.toDateString() === now.toDateString();
      if (period === "Week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return d >= weekAgo;
      }
      if (period === "Month") {
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return d >= monthAgo;
      }
      return true;
    };

    return salesRaw.filter(
      (s) =>
        ((s.items || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.id || "").toString().toLowerCase().includes(searchQuery.toLowerCase())) &&
        isWithinPeriod(s.createdAt)
    );
  }, [salesRaw, searchQuery, period]);

  const stats = useMemo(() => {
    const now = new Date();
    const isWithinPeriod = (dateStr: string) => {
      const d = new Date(dateStr);
      if (period === "Day") return d.toDateString() === now.toDateString();
      if (period === "Week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return d >= weekAgo;
      }
      if (period === "Month") {
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return d >= monthAgo;
      }
      return true;
    };

    const periodSales = salesRaw.filter((s) => isWithinPeriod(s.createdAt));
    const totalRevenue = periodSales.reduce(
      (s, t) => s + parseFloat(t.amount || "0"),
      0
    );
    const count = periodSales.length;
    const avgSale = count > 0 ? totalRevenue / count : 0;
    return { totalRevenue, avgSale, count };
  }, [salesRaw, period]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isChatLoading) return;
    const userMsg = { role: "user", content: chatMessage };
    setMessages((p) => [...p, userMsg]);
    setChatMessage("");
    setIsChatLoading(true);

    try {
      const res = await offlineFetch("/api/vendor/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, context: "sales" }),
      });
      const json = await res.json();
      if (json.success) {
        setMessages((p) => [...p, { role: "assistant", content: json.response }]);
      } else {
        setMessages((p) => [
          ...p,
          { role: "assistant", content: "Sorry, I encountered an error." },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleQuickLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAmount || saving) return;
    setSaving(true);
    try {
      const res = await offlineFetch("/api/vendor/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(quickAmount),
          items: quickItem || "Quick Sale",
          category: quickCategory || "Other",
          method: quickMethod,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setQuickAmount("");
        setQuickItem("");
        setSmartPrompt("");
        setQuickMethod("Cash");
        setIsQuickLogModalOpen(false);
        showToast("Sale logged successfully");
        fetchData();
      } else {
        showToast(json.message || "Error logging sale", "error");
      }
    } catch (err) {
      console.error("Quick log error:", err);
      showToast("Server error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this sale record?")) return;
    try {
      // optimistic ui not used here for reliability, but could be added
      const res = await offlineFetch(`/api/vendor/sales?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showToast("Sale deleted successfully");
        setSalesRaw((prev) => prev.filter((t) => t.id !== id));
      } else {
        showToast(json.message || "Error deleting sale", "error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Server error occurred", "error");
    }
  };

  return (
    <VendorDashboardLayout
      settingsHref="/vendor/premium/settings"
      plan="premium"
      navLinks={PREMIUM_NAV}
      currentPath="/vendor/premium/sales"
      title={isKhmer ? "ការលក់" : "Sales"}
      planBadge={{ label: isKhmer ? "PREMIUM" : "PREMIUM", icon: Sparkles }}
      rightActions={
        <>
          <div className="hidden sm:flex items-center bg-[#f0f2f5] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[10px] p-[3px] transition-colors">
            {(["Day", "Week", "Month"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-[7px] rounded-[8px] text-[13px] font-semibold border-0 cursor-pointer transition-all ${
                  period === p
                    ? "bg-white dark:bg-[#0d1117] text-[#111827] dark:text-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                    : "bg-transparent text-[#6b7280] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button 
            onClick={handleExportPDF}
            className="hidden sm:flex items-center gap-2 bg-[#0d1117] dark:bg-white hover:opacity-90 text-white dark:text-[#0d1117] font-medium px-4 py-[9px] rounded-[10px] transition-colors text-[13px] cursor-pointer border-0"
          >
            <FileText className="w-4 h-4" /> {isKhmer ? "ទាញយកជា PDF" : "Export PDF"}
          </button>
          <button
            onClick={() => {
              setIsSmartActive(true);
              setIsQuickLogModalOpen(true);
            }}
            className="flex items-center gap-[7px] bg-gradient-to-r from-[#8b5cf6] to-[#29B28D] text-white border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer shadow-[0_2px_14px_rgba(139,92,246,0.3)] hover:opacity-90 transition-opacity"
          >
            <Sparkles size={14} /> {isKhmer ? "បន្ថែមដោយឆ្លាតវៃ" : "Smart Add"}
          </button>
        </>
      }
    >
      {/* ── Toasts ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[12px] shadow-[2xl] text-[13.5px] font-semibold min-w-[280px] border transition-all animate-in slide-in-from-bottom-5 ${t.type === "error" ? "bg-white dark:bg-[#0d1117] text-[#ef4444] border-[#ef4444]/20" : "bg-white dark:bg-[#0d1117] text-[#111827] dark:text-white border-[#e8eaed] dark:border-white/10"}`}>
            {t.type === "success" ? <CheckCircle2 size={16} className="text-[#29B28D]" /> : <X size={16} className="text-[#ef4444]" />}
            <span className="flex-1">{t.msg}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">
        <div className="pt-1 pb-2">
          <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">
            {isKhmer ? "ការលក់របស់ខ្ញុំ" : "My Sales"}
          </h2>
          <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
            {isKhmer ? "ការតាមដានប្រវត្តិលក់គ្មានដែនកំណត់" : "Unlimited sales history tracking"} ·{" "}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <VendorSummaryCard
            variant="dark"
            title={isKhmer ? "ចំណូលថ្ងៃនេះ" : `${period}'s Revenue`}
            khmerTitle="ចំណូលថ្ងៃនេះ"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={CircleDollarSign}
            isPositive={true}
            trend="+12.5%"
          />
          <VendorSummaryCard
            title={isKhmer ? "ប្រតិបត្តិការ" : "Transactions"}
            khmerTitle="ប្រតិបត្តិការ"
            value={stats.count}
            icon={Receipt}
            subtext={isKhmer ? "សរុបប្រវត្តិលក់" : "sales history total"}
          />
          <VendorSummaryCard
            title={isKhmer ? "តម្លៃលក់មធ្យម" : "Avg. Sale Value"}
            khmerTitle="តម្លៃលក់មធ្យម"
            value={`$${stats.avgSale.toFixed(2)}`}
            icon={TrendingUp}
            subtext={isKhmer ? "ក្នុងមួយប្រតិបត្តិការ" : "per transaction"}
            highlight
          />
        </div>

        <AIHub />

        <div className="bg-white dark:bg-[#0d1117] rounded-[14px] border border-[#e8eaed] dark:border-white/10 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col transition-colors">
          <div className="p-5 md:p-6 border-b border-[#f0f2f5] dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-[17px] text-[#111827] dark:text-white">
                {isKhmer ? "ប្រវត្តិប្រតិបត្តិការពេញលេញ" : "Full Transaction History"}
              </h3>
              <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">
                {isKhmer ? "គ្រប់គ្រងរាល់ការលក់របស់អ្នក" : "Manage all your sales records"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-2 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[10px] transition-colors group focus-within:border-[#29B28D] w-64">
                <Search className="w-4 h-4 text-[#9ca3af] dark:text-[#7d8590] group-focus-within:text-[#29B28D] transition-colors" />
                <input
                  type="text"
                  placeholder={isKhmer ? "ស្វែងរកប្រតិបត្តិការ..." : "Search transactions..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-[13px] text-[#111827] dark:text-white w-full placeholder:text-[#9ca3af]"
                />
              </div>
              <button className="p-2 border border-[#e8eaed] dark:border-white/10 rounded-[10px] text-[#6b7280] dark:text-[#7d8590] hover:bg-[#f0f2f5] dark:hover:bg-white/5 transition-colors min-h-[40px] bg-white dark:bg-[#161B22] cursor-pointer">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7f8fa] dark:bg-[#161B22] border-b border-[#f0f2f5] dark:border-white/5 text-[11px] text-[#9ca3af] dark:text-[#7d8590] uppercase tracking-wider font-bold transition-colors">
                  <th className="px-6 py-4">{isKhmer ? "កាលបរិច្ឆេទ និងម៉ោង" : "Date & Time"}</th>
                  <th className="px-6 py-4">{isKhmer ? "ទំនិញដែលបានលក់" : "Items Sold"}</th>
                  <th className="px-6 py-4">{isKhmer ? "ចំនួនសរុប" : "Total Amount"}</th>
                  <th className="px-6 py-4">{isKhmer ? "ស្ថានភាព" : "Status"}</th>
                  <th className="px-6 py-4 text-center">{isKhmer ? "សកម្មភាព" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5] dark:divide-white/5">
                 {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#9ca3af]">
                      {isKhmer ? "កំពុងទាញយកប្រវត្តិលក់របស់អ្នក..." : "Loading your sales history..."}
                    </td>
                  </tr>
                ) : filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#9ca3af]">
                      {isKhmer ? "រកមិនឃើញប្រតិបត្តិការសម្រាប់រយៈពេលនេះទេ។" : "No transactions found for this period."}
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((txn) => (
                    <tr
                      key={txn.id}
                      className="hover:bg-[#f7f8fa] dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-[#111827] dark:text-white">
                            {new Date(txn.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[12px] text-[#6b7280] dark:text-[#7d8590] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(txn.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13.5px] font-medium text-[#374151] dark:text-[#e6edf3]">
                          {txn.items ? (isKhmer ? (txn as any).khmerItems || txn.items : txn.items) : (isKhmer ? "មុខទំនិញលក់" : "Sale Item")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[15px] font-bold text-[#29B28D]">
                          ${parseFloat(txn.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[rgba(41,178,141,0.1)] text-[#29B28D] text-[11px] font-bold rounded-full border border-[rgba(41,178,141,0.2)]">
                          <CheckCircle2 size={12} /> {isKhmer ? "រួចរាល់" : "Complete"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleDelete(txn.id)}
                          className="p-2 text-[#9ca3af] dark:text-[#7d8590] hover:text-[#ef4444] dark:hover:text-[#f87171] rounded-[8px] hover:bg-[rgba(239,68,68,0.08)] dark:hover:bg-[rgba(239,68,68,0.15)] transition-colors opacity-0 group-hover:opacity-100 min-h-[40px] min-w-[40px] border-0 cursor-pointer bg-transparent"
                        >
                          <X className="w-5 h-5 mx-auto" />
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
      {isQuickLogModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0d1117]/60 backdrop-blur-sm p-4">
          <div
            className="absolute inset-0"
            onClick={() => {
              setIsQuickLogModalOpen(false);
              setIsSmartActive(false);
            }}
          />
          <div className="bg-white dark:bg-[#0d1117] rounded-[24px] w-full max-w-lg p-6 md:p-8 shadow-2xl relative z-10 border border-[#e8eaed] dark:border-white/10 overflow-hidden transition-colors">
            <button
              onClick={() => {
                setIsQuickLogModalOpen(false);
                setIsSmartActive(false);
              }}
              className="absolute top-5 right-5 text-[#9ca3af] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white p-1.5 rounded-[8px] transition-colors border-0 cursor-pointer bg-transparent"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-[22px] text-[#111827] dark:text-white mb-2">
              {isSmartActive 
                ? (isKhmer ? "បន្ថែមឆ្លាតវៃដោយ AI" : "AI Smart Add") 
                : (isKhmer ? "បញ្ជាក់ការលក់ថ្មី" : "Confirm New Sale")}
            </h2>
            <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mb-6">
              {isSmartActive 
                ? (isKhmer ? "រៀបរាប់ការលក់របស់អ្នកដោយធម្មជាតិ ហើយ Gemini នឹងវិភាគវាឱ្យអ្នក។" : "Describe your sale naturally and Gemini will parse it.") 
                : (isKhmer ? "ផ្ទៀងផ្ទាត់ព័ត៌មានមុននឹងកត់ត្រាចូលក្នុងប្រវត្តិ។" : "Verify the parsed details before logging to history.")}
            </p>
            {isSmartActive ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-[#111827] dark:text-white mb-2 uppercase tracking-wider">
                    {isKhmer ? "ការពិពណ៌នារហ័ស" : "Quick Description"}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={isKhmer ? 'ឧ. "លក់កាហ្វេ ៣ កែវ សរុប ១២ ដុល្លារ ប្រាក់សុទ្ធ"' : 'e.g., "Sold three coffees for $12 total, cash"'}
                    value={smartPrompt}
                    onChange={(e) => setSmartPrompt(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[12px] text-[#111827] dark:text-white outline-none focus:border-[#29B28D] transition-all resize-none font-medium"
                  />
                </div>
                <button
                  onClick={handleSmartParse}
                  disabled={!smartPrompt || isParsing}
                  className={`w-full font-bold py-4 rounded-[12px] flex items-center justify-center gap-2 border-0 cursor-pointer transition-all ${
                    !smartPrompt || isParsing 
                      ? "bg-gray-100 dark:bg-white/5 text-gray-400" 
                      : "bg-[#8b5cf6] text-white shadow-lg hover:shadow-[#8b5cf6]/30"
                  }`}
                >
                  {isParsing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Sparkles size={16} /> {isKhmer ? "វិភាគជាមួយ Gemini AI" : "Parse with Gemini AI"}
                    </>
                  )}
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuickLog} className="space-y-4">
                <div className="p-4 bg-[#29B28D]/5 border border-[#29B28D]/20 rounded-xl mb-4 text-[13px] text-[#29B28D] flex items-center gap-2 font-medium">
                  <CheckCircle2 size={14} /> {isKhmer ? "បានវិភាគដោយជោគជ័យ" : "AI Parsed Successfully"}
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#111827] dark:text-white mb-2 uppercase tracking-wider">
                    {isKhmer ? "ការពិពណ៌នាទំនិញ" : "Items Description"}
                  </label>
                  <input
                    type="text"
                    placeholder={isKhmer ? 'ឧ. "កាហ្វេត្រជាក់ ៣, នំបុ័ង ២"' : 'e.g., "3 Iced Coffees, 2 Bakery"'}
                    value={quickItem}
                    onChange={(e) => setQuickItem(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[12px] text-[#111827] dark:text-white outline-none focus:border-[#29B28D] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#111827] dark:text-white mb-2 uppercase tracking-wider">
                    {isKhmer ? "ចំនួនទឹកប្រាក់សរុប ($)" : "Total Amount ($)"}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={quickAmount}
                    onChange={(e) => setQuickAmount(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[12px] text-[#111827] dark:text-white outline-none focus:border-[#29B28D] transition-all font-bold text-lg"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#111827] dark:text-white mb-2 uppercase tracking-wider">
                    {isKhmer ? "វិធីសាស្ត្របង់ប្រាក់" : "Payment Method"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Cash", "ABA/KHQR", "Other"] as Method[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setQuickMethod(m)}
                        className={`py-3 rounded-[10px] text-[12px] font-bold transition-all border-0 cursor-pointer ${
                          quickMethod === m
                            ? "bg-[#29B28D] text-[#0d1117] shadow-lg"
                            : "bg-[#f7f8fa] dark:bg-[#161B22] text-[#6b7280] dark:text-[#7d8590] hover:bg-gray-100"
                        }`}
                      >
                        {m === "Cash" ? (isKhmer ? "ប្រាក់សុទ្ធ" : "Cash") : m === "ABA/KHQR" ? (isKhmer ? "ABA/KHQR" : "ABA/KHQR") : (isKhmer ? "ផ្សេងៗ" : "Other")}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSmartActive(true)}
                    disabled={saving}
                    className="w-full py-4 text-[#6b7280] font-bold rounded-[12px] border border-[#e8eaed] dark:border-white/10 bg-transparent cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {isKhmer ? "កែសម្រួល" : "Edit Draft"}
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !quickAmount}
                    className="w-full bg-[#29B28D] text-[#0d1117] font-bold py-4 rounded-[12px] shadow-md hover:shadow-emerald-500/30 transition-all border-0 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-[#0d1117]/30 border-t-[#0d1117] rounded-full animate-spin"></div>
                    ) : (
                      isKhmer ? "បញ្ជាក់ និងកត់ត្រា" : "Confirm & Log"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Chat FAB */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#8b5cf6] to-[#29B28D] rounded-full shadow-[0_8px_32px_rgba(139,92,246,0.4)] flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer border-0"
        >
          <MessageSquare size={22} />
        </button>
      )}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] bg-white dark:bg-[#0d1117] rounded-[20px] shadow-2xl border border-[#e8eaed] dark:border-white/10 flex flex-col overflow-hidden transition-colors">
          <div className="px-5 py-4 bg-[#0d1117] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#8b5cf6] to-[#29B28D] rounded-full flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              <p className="font-bold text-[13.5px] text-[#e6edf3]">
                {isKhmer ? "ជំនួយការផ្នែកលក់ Gemini" : "Gemini Sales Assistant"}
              </p>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-[#7d8590] hover:text-[#e6edf3] bg-transparent border-0 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-[#f7f8fa] dark:bg-[#161B22] min-h-[300px] flex flex-col gap-3">
            <div className="bg-white dark:bg-[#0d1117] p-3 rounded-[12px] text-[13px] text-[#374151] dark:text-[#e6edf3] shadow-sm">
              {isKhmer 
                ? "ខ្ញុំអាចជួយអ្នកវិភាគរាល់ការលក់របស់អ្នក ឬព្យាករណ៍ពីនិន្នាការនាពេលអនាគត។ តើអ្នកចង់ដឹងអ្វីខ្លះ?" 
                : "I can help you analyze your unlimited sales logs or predict future trends. What would you like to know?"}
            </div>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-[12px] text-[13px] shadow-sm max-w-[85%] ${
                  m.role === "user"
                    ? "bg-[#29B28D] text-[#0d1117] self-end rounded-br-none"
                    : "bg-white dark:bg-[#0d1117] text-[#374151] dark:text-[#e6edf3] self-start rounded-bl-none"
                }`}
              >
                {m.content}
              </div>
            ))}
            {isChatLoading && (
              <div className="bg-white dark:bg-[#0d1117] p-3 rounded-[12px] text-[13px] text-[#374151] dark:text-[#e6edf3] shadow-sm self-start rounded-bl-none italic">
                {isKhmer ? "Gemini កំពុងគិត..." : "Gemini is thinking..."}
              </div>
            )}
          </div>
          <div className="p-3 bg-white dark:bg-[#0d1117] border-t border-[#e8eaed] dark:border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={isKhmer ? "សួរជំនួយការរបស់អ្នក..." : "Ask your assistant..."}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[10px] text-[13px] outline-none text-[#111827] dark:text-white focus:border-[#29B28D] transition-colors"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isChatLoading}
                className="p-2.5 bg-gradient-to-br from-[#8b5cf6] to-[#29B28D] text-white rounded-[10px] border-0 cursor-pointer disabled:opacity-50"
              >
                {isChatLoading ? (
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send size={15} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </VendorDashboardLayout>
  );
}
