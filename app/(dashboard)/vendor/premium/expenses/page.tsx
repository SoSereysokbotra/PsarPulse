"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Package,
  Plus,
  TrendingUp,
  Search,
  Filter,
  FileText,
  FileSpreadsheet,
  Brain,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Clock,
  Trash2,
  CheckCircle2,
  X,
  MessageSquare,
  Send,
  ShoppingCart,
  Home,
  Car,
  Bolt,
  UserCheck,
  Megaphone,
  MoreHorizontal,
  Tag,
  Receipt as ReceiptIcon,
  FileBarChart,
} from "lucide-react";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { offlineFetch } from "@/lib/pwa/offline-fetch";

// ─── Constants & Types ────────────────────────────────────────────────────────

type TabId = "overview" | "recurring" | "insights" | "forecast" | "history";
type CatColor = "emerald" | "indigo" | "violet" | "amber" | "red" | "slate";

interface ChatMsg {
  role: "user" | "assistant";
  text: string;
}

const PREMIUM_NAV = [
  { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/vendor/premium" },
  { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/vendor/premium/sales" },
  { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/vendor/premium/expenses", active: true },
  { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/vendor/premium/customer" },
  { icon: Package, title: "Inventory", khmerTitle: "ស្តុក", href: "/vendor/premium/inventory" },
  { icon: FileBarChart, title: "Reports", khmerTitle: "របាយការណ៍", href: "/vendor/premium/reports" },
];

const catColorMap: Record<string, { badge: string; iconBg: string; iconText: string; bar: string; recurBg: string; recurBorder: string }> = {
  emerald: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-500",
    bar: "#10b981",
    recurBg: "bg-emerald-50/50",
    recurBorder: "border-emerald-100",
  },
  indigo: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
    iconBg: "bg-indigo-50",
    iconText: "text-indigo-500",
    bar: "#6366f1",
    recurBg: "bg-indigo-50/50",
    recurBorder: "border-indigo-100",
  },
  violet: {
    badge: "bg-violet-50 text-violet-700 border-violet-100",
    iconBg: "bg-violet-50",
    iconText: "text-violet-500",
    bar: "#8b5cf6",
    recurBg: "bg-violet-50/50",
    recurBorder: "border-violet-100",
  },
  amber: {
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    iconBg: "bg-amber-50",
    iconText: "text-amber-500",
    bar: "#f59e0b",
    recurBg: "bg-amber-50/50",
    recurBorder: "border-amber-100",
  },
  red: {
    badge: "bg-red-50 text-red-700 border-red-100",
    iconBg: "bg-red-50",
    iconText: "text-red-500",
    bar: "#ef4444",
    recurBg: "bg-red-50/50",
    recurBorder: "border-red-100",
  },
  slate: {
    badge: "bg-slate-50 text-slate-700 border-slate-100",
    iconBg: "bg-slate-50",
    iconText: "text-slate-500",
    bar: "#64748b",
    recurBg: "bg-slate-50/50",
    recurBorder: "border-slate-100",
  },
  "Stock Purchase": {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-500",
    bar: "#10b981",
    recurBg: "bg-emerald-50/50",
    recurBorder: "border-emerald-100",
  },
  Rent: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
    iconBg: "bg-indigo-50",
    iconText: "text-indigo-500",
    bar: "#6366f1",
    recurBg: "bg-indigo-50/50",
    recurBorder: "border-indigo-100",
  },
  Transport: {
    badge: "bg-violet-50 text-violet-700 border-violet-100",
    iconBg: "bg-violet-50",
    iconText: "text-violet-500",
    bar: "#8b5cf6",
    recurBg: "bg-violet-50/50",
    recurBorder: "border-violet-100",
  }
};

const pushAlerts = [
  {
    title: "Unusual Stock Purchase Cost",
    message: "Your spending on 'Stock Purchase' is 24% higher than last Tuesday. Check duplicate logs?",
    time: "2h ago",
    icon: AlertTriangle,
  },
  {
    title: "Electricity Bill Due",
    message: "Historical data suggests your stall utility bill is due in 3 days (~$45.00).",
    time: "5h ago",
    icon: Clock,
  },
];

const recurringItems = [
  { name: "Monthly Rent", khmer: "ថ្លៃជួលប្រចាំខែ", frequency: "Monthly", amount: "$80.00", nextDue: "Apr 01", color: "indigo" as CatColor },
  { name: "Helper Salary", khmer: "ប្រាក់ខែបុគ្គលិក", frequency: "Weekly", amount: "$35.00", nextDue: "Saturday", color: "red" as CatColor },
];

const aiInsights = [
  {
    tag: "OPTIMIZATION",
    tagColor: "#8b5cf6",
    icon: Brain,
    title: "Supplier Consolidation",
    detail: "You are buying from 4 different wholesale suppliers. Consolidating to 1 could save you 8% through bulk discounts.",
    action: "Compare Prices",
  },
  {
    tag: "ANOMALY",
    tagColor: "#f59e0b",
    icon: AlertTriangle,
    title: "TukTuk Cost Spike",
    detail: "Transport costs have risen for 3 consecutive days. Shared market runs with neighbors could cut this by 40%.",
    action: "View Partners",
  },
  {
    tag: "SAVINGS",
    tagColor: "#10b981",
    icon: TrendingUp,
    title: "Utility Efficiency",
    detail: "Peak electricity usage detected at 9:00 PM. Turning off signage 30 mins earlier saves ~$4/month.",
    action: "Set Timer",
  },
];

const forecastItems = [
  { category: "Stock Purchase", reason: "Khmer New Year approaching", predicted: "$120.00", change: "+15%", up: true },
  { category: "Utilities", reason: "Stable usage pattern", predicted: "$42.02", change: "-2%", up: false },
  { category: "Marketing", reason: "End of month promotion", predicted: "$15.00", change: "Same", up: null },
];

const geminiTips = [
  { tip: "Buy stock Tuesday 6–8 AM at Orussey Market", saving: "Save ~$4.50/week", emoji: "" },
  { tip: "Batch electricity usage — turn off fans after 9 PM", saving: "Save ~$2/week", emoji: "" },
  { tip: "Share TukTuk with Stall B41 for shared market runs", saving: "Save ~$1.50/trip", emoji: "" },
];

const TABS: { id: TabId; label: string; khmer: string }[] = [
  { id: "overview", label: "Overview", khmer: "ទិដ្ឋភាពទូទៅ" },
  { id: "forecast", label: "Forecast", khmer: "ការព្យាករណ៍" },
  { id: "history", label: "Expense History", khmer: "ប្រវត្តិចំណាយ" },
];

const initChat: ChatMsg[] = [
  { role: "assistant", text: "សួស្តី! I'm your AI Expense Assistant. Ask me anything about your spending patterns or how to cut costs!" },
  { role: "assistant", text: "Try: 'Where am I spending too much?' or 'How can I reduce costs this week?'" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PremiumExpensesPage() {
  const { language } = useLanguage();
  const isKhmer = language === "km";
  // States
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>(initChat);
  const [isChatSending, setIsChatSending] = useState(false);
  const [dismissed, setDismissed] = useState<number[]>([]);

  // Live AI data states
  const [liveInsights, setLiveInsights] = useState(aiInsights);
  const [liveForecastItems, setLiveForecastItems] = useState(forecastItems);
  const [liveForecastTotal, setLiveForecastTotal] = useState("$175.00");
  const [liveForecastConfidence, setLiveForecastConfidence] = useState("89%");
  const [liveForecastChart, setLiveForecastChart] = useState([45, 52, 38, 65, 48, 55, 42]);
  const [liveRecurringItems, setLiveRecurringItems] = useState<any[]>([]);

  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState(false);
  const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");
  
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Stock Purchase");
  const [expenseVendor, setExpenseVendor] = useState("");
  const [expenseNote, setExpenseNote] = useState("");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [aiSavings, setAiSavings] = useState({ potentialSavings: 0, period: "Weekly" });
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"Day" | "Week" | "Month">("Week");

  const [categoriesList, setCategoriesList] = useState([
    { name: "Stock Purchase", khmer: "ទិញស្តុក", color: "emerald" as CatColor, icon: ShoppingCart },
    { name: "Rent", khmer: "ថ្លៃជួល", color: "indigo" as CatColor, icon: Home },
    { name: "Transport", khmer: "ការធ្វើដំណើរ", color: "violet" as CatColor, icon: Car },
    { name: "Electricity", khmer: "អគ្គិសនី", color: "amber" as CatColor, icon: Bolt },
    { name: "Labor", khmer: "កម្លាំងពលកម្ម", color: "red" as CatColor, icon: UserCheck },
    { name: "Marketing", khmer: "ទីផ្សារ", color: "slate" as CatColor, icon: Megaphone },
    { name: "Others", khmer: "ផ្សេងៗ", color: "slate" as CatColor, icon: MoreHorizontal },
  ]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await offlineFetch("/api/vendor/expenses");
        const json = await res.json();
        if (json.success) setExpenses(json.data);
      } catch (error) {
        console.error("Failed to fetch expenses", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAiSavings = async () => {
      try {
        const res = await offlineFetch("/api/vendor/ai/savings");
        const json = await res.json();
        if (json.success) setAiSavings(json.data);
      } catch (error) {
        console.error("Failed to fetch AI savings", error);
      } finally {
        setAiLoading(false);
      }
    };

    const fetchForecast = async () => {
      try {
        const res = await offlineFetch("/api/vendor/ai/forecast");
        const json = await res.json();
        if (json.success && json.data) {
          const salesArr = json.data.sales || [];
          const total = salesArr.reduce((s: number, v: number) => s + v, 0);
          setLiveForecastTotal(`$${total.toFixed(2)}`);
          setLiveForecastConfidence(`${Math.round((json.data.confidence || 0.89) * 100)}%`);
          if (salesArr.length === 7) setLiveForecastChart(salesArr);
        }
      } catch (err) {
        console.error("Failed to fetch forecast", err);
      }
    };

    const fetchInsights = async () => {
      try {
        const res = await offlineFetch("/api/vendor/ai/insights");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setLiveInsights(json.data.map((d: any) => ({
            tag: (d.tag || "INSIGHT").toUpperCase(),
            tagColor: d.color || "#8b5cf6",
            icon: d.icon === "trending-up" ? TrendingUp : d.icon === "package" ? ShoppingCart : Brain,
            title: d.title,
            detail: d.detail,
            action: "View Details",
          })));
        }
      } catch (err) {
        console.error("Failed to fetch AI insights", err);
      }
    };

    const fetchRecurring = async () => {
      try {
        const res = await offlineFetch("/api/vendor/ai/recurring");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setLiveRecurringItems(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch recurring", err);
      }
    };

    fetchExpenses();
    fetchAiSavings();
    fetchForecast();
    fetchInsights();
    fetchRecurring();
  }, []);

  const handleQuickLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount || isSaving) return;
    setIsSaving(true);
    try {
      const res = await offlineFetch("/api/vendor/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(expenseAmount),
          category: expenseCategory,
          description: expenseNote,
          expenseDate: new Date(),
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setExpenses(prev => [json.data, ...prev]);
        setExpenseAmount("");
        setExpenseVendor("");
        setExpenseNote("");
        setIsQuickLogModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExpense = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id || isDeleting === id) return;
    if (!window.confirm("Delete this expense?")) return;
    setIsDeleting(id);
    try {
      const res = await offlineFetch(`/api/vendor/expenses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setExpenses(prev => prev.filter(exp => exp.id !== id));
      }
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCreateCustomCategory = () => {
    if (!customCategoryName.trim()) return;

    setCategoriesList(prev => [
      ...prev.slice(0, prev.length - 1),
      { name: customCategoryName, khmer: "ផ្ទាល់ខ្លួន", color: "slate" as CatColor, icon: Tag },
      prev[prev.length - 1]
    ]);

    setExpenseCategory(customCategoryName);
    setCustomCategoryName("");
    setShowCustomCategoryModal(false);
  };

  const handleSend = async () => {
    if (!chatMsg.trim() || isChatSending) return;
    const userMsg = chatMsg;
    setChatMessages((p) => [...p, { role: "user", text: userMsg }]);
    setChatMsg("");
    setIsChatSending(true);
    
    try {
      const res = await offlineFetch("/api/vendor/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, context: "expenses" })
      });
      const json = await res.json();
      if (json.success) {
        setChatMessages(p => [...p, { role: "assistant", text: json.response }]);
      }
    } catch (error) {
      setChatMessages(p => [...p, { role: "assistant", text: "I'm having trouble connecting to Gemini. Please try again later!" }]);
    } finally {
      setIsChatSending(false);
    }
  };

  const handleExportPDF = () => console.log("Exporting PDF...");
  const handleExportExcel = () => console.log("Exporting Excel...");

  const visibleAlerts = pushAlerts.filter((_, i) => !dismissed.includes(i));
  const filteredHistory = expenses.filter(
    (e) =>
      (e.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.category || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const now = new Date();
  const summaryData = React.useMemo(() => {
    const now = new Date();
    const periodData = expenses.filter(e => {
      const d = new Date(e.expenseDate || e.createdAt);
      if (selectedPeriod === "Day") return d.toDateString() === now.toDateString();
      if (selectedPeriod === "Week") return now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000;
      if (selectedPeriod === "Month") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      return true;
    });

    const total = periodData.reduce((sum, e) => sum + parseFloat(e.amount || "0"), 0);
    
    // Top Category
    const cats: Record<string, number> = {};
    expenses.forEach(e => { cats[e.category] = (cats[e.category] || 0) + parseFloat(e.amount || "0"); });
    const topCat = Object.entries(cats).sort((a,b) => b[1] - a[1])[0]?.[0] || "-";

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthTotal = expenses.filter(e => new Date(e.expenseDate || e.createdAt) >= monthStart)
      .reduce((s, e) => s + parseFloat(e.amount || "0"), 0);

    // Category Breakdown Calculation
    const breakdown = categoriesList.map(cat => {
      const amount = expenses.filter(e => e.category === cat.name)
        .reduce((s, e) => s + parseFloat(e.amount || "0"), 0);
      return { 
        ...cat, 
        amount, 
        percentage: total > 0 ? (amount / total) * 100 : 0 
      };
    }).sort((a, b) => b.amount - a.amount);

    return { total, topCat, monthTotal, breakdown, count: periodData.length };
  }, [expenses, selectedPeriod, categoriesList]);

  const weeklyChartData = liveForecastChart;
  const maxWeekly = Math.max(...liveForecastChart, 1);

  return (
    <VendorDashboardLayout
      settingsHref="/vendor/premium/settings"
      plan="premium"
      navLinks={PREMIUM_NAV}
      currentPath="/vendor/premium/expenses"
      title={isKhmer ? "ចំណាយ" : "Expenses"}
      planBadge={{ label: isKhmer ? "PREMIUM" : "PREMIUM", icon: Sparkles }}
      rightActions={
        <>
          <button onClick={handleExportPDF} className="hidden sm:flex items-center gap-1.5 bg-[#0d1117] dark:bg-white hover:opacity-90 text-white dark:text-[#111827] font-semibold px-3.5 py-2 rounded-[10px] text-sm transition-colors border-0 cursor-pointer">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button onClick={handleExportExcel} className="hidden sm:flex items-center gap-1.5 bg-white dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 hover:bg-[#f0f2f5] dark:hover:bg-white/5 text-[#111827] dark:text-white font-semibold px-3.5 py-2 rounded-[10px] text-sm transition-colors cursor-pointer">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button onClick={() => setIsChatOpen(true)} className="flex items-center gap-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#29B28D] text-white font-bold px-3.5 py-2 rounded-[10px] text-sm hover:opacity-90 transition-opacity cursor-pointer border-0">
            <Brain className="w-4 h-4" /> Gemini AI
          </button>
          <button onClick={() => setIsQuickLogModalOpen(true)} className="flex items-center gap-1.5 bg-[#29B28D] hover:bg-[#4dd49a] text-white font-bold px-4 py-2 rounded-[10px] text-sm shadow-[0_2px_14px_rgba(41,178,141,0.28)] transition-colors cursor-pointer border-0">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </>
      }
    >
      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-5 transition-colors">
        <div className="pt-1 pb-1">
          <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">
            {isKhmer ? "ចំណាយរបស់ខ្ញុំ" : "My Expenses"}
          </h2>
          <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
            {isKhmer ? "តាមដាន និងគ្រប់គ្រងការចំណាយរបស់អ្នក" : "Track and manage your spending"} ·{" "}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <VendorSummaryCard 
            variant="dark" 
            title={isKhmer ? `ការចំណាយក្នុង ${selectedPeriod}` : `${selectedPeriod}'s Spending`} 
            khmerTitle="ចំណាយសរុប" 
            value={`$${summaryData.total.toFixed(2)}`} 
            subtext={`${summaryData.count} ${isKhmer ? "ប្រតិបត្តិការ" : "transaction"}${summaryData.count !== 1 && !isKhmer ? "s" : ""}`} 
          />
          <VendorSummaryCard
            title={isKhmer ? "ប្រភេទចំណាយច្រើនបំផុត" : "Top Category"}
            khmerTitle="ប្រភេទទូទៅ"
            value={summaryData.topCat}
            subtext={isKhmer ? "ផ្អែកលើប្រវត្តិ" : "base on history"}
          />
          <VendorSummaryCard
            variant="green"
            title={isKhmer ? "សរុបប្រចាំខែ" : "Monthly Total"}
            khmerTitle="សរុបប្រចាំខែ"
            value={`$${summaryData.monthTotal.toFixed(2)}`}
            subtext={isKhmer ? "ខែនេះ" : "this month"}
          />
          <VendorSummaryCard
            title={isKhmer ? "ការព្យាករណ៍ដោយ AI" : "AI Prediction"}
            khmerTitle="ការព្យាករណ៍"
            value={liveForecastTotal}
            subtext={isKhmer ? "៧ ថ្ងៃបន្ទាប់" : "next 7 days"}
          />
          <VendorSummaryCard
            title={isKhmer ? "ការសន្សំដោយ AI" : "AI Savings"}
            khmerTitle="ការសន្សំ"
            value={`$${aiSavings.potentialSavings.toFixed(2)}`}
            icon={Brain}
            subtext={isKhmer ? `លទ្ធភាពសន្សំ/${aiSavings.period === "Weekly" ? "ម្នាក់សប្តាហ៍" : aiSavings.period}` : `potential/${aiSavings.period}`}
          />
        </div>

        <div className="flex items-center justify-between border-b border-[#e8eaed] dark:border-white/10 transition-colors pr-2">
          <div className="flex items-end gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-[13.5px] font-medium border-b-2 -mb-px flex flex-col items-start gap-0.5 bg-transparent border-x-0 border-t-0 cursor-pointer transition-colors whitespace-nowrap ${activeTab === tab.id
                    ? "border-b-[#111827] dark:border-b-white text-[#111827] dark:text-white font-semibold"
                    : "border-b-transparent text-[#6b7280] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white"
                  }`}
              >
                <span>{isKhmer ? tab.khmer : tab.label}</span>
              </button>
            ))}
          </div>

          {(activeTab === "overview" || activeTab === "history") && (
            <div className="flex items-center bg-[#f7f8fa] dark:bg-[#161B22] p-1 rounded-[10px] border border-[#e8eaed] dark:border-white/10 mb-2">
              {(["Day", "Week", "Month"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-[7px] border-0 cursor-pointer transition-all ${
                    selectedPeriod === p
                      ? "bg-white dark:bg-[#0d1117] text-[#111827] dark:text-white shadow-sm"
                      : "text-[#6b7280] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white bg-transparent"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-5">
            <div className="bg-[#0d1117] border border-white/[0.06] rounded-[14px] px-[26px] py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[rgba(41,178,141,0.12)] rounded-[11px]"><Brain className="w-5 h-5 text-[#29B28D]" /></div>
                <div>
                  <div className="text-[16px] font-bold text-[#e6edf3]">AI Expense Intelligence Active</div>
                  <div className="text-[12px] text-[#7d8590] mt-0.5">Anomaly detection · Recurring patterns · Cost optimization · Gemini insights</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[rgba(41,178,141,0.1)] border border-[rgba(41,178,141,0.2)] px-4 py-2 rounded-[10px] text-[#29B28D] shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[13px] font-semibold">Premium Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-5">
              <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] shadow-sm transition-colors">
                <div className="px-6 py-5 border-b border-[#f0f2f5] dark:border-white/5 transition-colors">
                  <h3 className="font-bold text-[16px] text-[#111827] dark:text-white">
                    {isKhmer ? "ការចំណាយតាមប្រភេទ" : "Spending by Category"}
                  </h3>
                </div>
                <div className="p-[22px] flex flex-col gap-[22px]">
                  {summaryData.breakdown.filter(b => b.amount > 0).slice(0, 5).map((cat, i) => {
                    const c = catColorMap[cat.name] || catColorMap["slate"];
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${c.iconBg} ${c.iconText}`}><cat.icon className="w-4 h-4" /></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] font-semibold text-[#111827] dark:text-white">
                                {isKhmer ? cat.khmer : cat.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[12.5px] font-bold text-[#111827] dark:text-white">${cat.amount.toFixed(2)}</span>
                              <span className="text-[11px] text-[#9ca3af] dark:text-[#7d8590]">{cat.percentage.toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className="w-full h-[6px] bg-[#f0f2f5] dark:bg-white/5 rounded-full overflow-hidden transition-colors">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cat.percentage}%`, background: c.bar }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {summaryData.breakdown.filter(b => b.amount > 0).length === 0 && (
                    <div className="py-10 text-center text-[#9ca3af] text-[13px]">No spending recorded yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "forecast" && (
          <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] overflow-hidden shadow-sm transition-colors">
             <div className="px-[26px] py-[18px] border-b border-[#f0f2f5] dark:border-white/5 flex items-center justify-between transition-colors">
              <div>
                <div className="text-[14px] font-semibold text-[#111827] dark:text-white">
                  {isKhmer ? "ការព្យាករណ៍ចំណាយ AI — ៧ ថ្ងៃបន្ទាប់" : "AI Expense Forecast — Next 7 Days"}
                </div>
                <div className="text-[11px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">
                  {isKhmer ? "ការព្យាករណ៍ចំណាយ" : "Expense forecast"} · {isKhmer ? "សរុបដែលបានរំពឹងទុក" : "Predicted total"}: <strong className="text-[#29B28D]">{liveForecastTotal}</strong> · {isKhmer ? "ភាពជឿជាក់" : "confidence"} {liveForecastConfidence}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[rgba(41,178,141,0.1)] text-[#29B28D] text-[10px] font-bold rounded-full border border-[rgba(41,178,141,0.2)]"><Brain className="w-2.5 h-2.5" /> AI</span>
            </div>
            <div className="p-[22px]">
              <div className="flex items-end gap-2 h-28 mb-4">
                {weeklyChartData.map((h, i) => {
                  const dayLabels = isKhmer 
                    ? ["ចន្ទ", "អង្គារ", "ពុធ", "ព្រហ", "សុក្រ", "សៅរ៍", "អាទិត្យ"]
                    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                  const day = dayLabels[i];
                  const isToday = i === (now.getDay() + 6) % 7;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full relative rounded-t-[6px] transition-colors" style={{ height: "96px", background: isToday ? "rgba(41,178,141,0.15)" : "" }}>
                        <div className={`absolute bottom-0 w-full rounded-t-[6px] ${isToday ? "bg-[#29B28D]" : "bg-[#d1d5db] dark:bg-white/10"}`} style={{ height: `${(h / maxWeekly) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-[#9ca3af] dark:text-[#7d8590]">{day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2 mt-6">
                {liveForecastItems.map((fi, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#f7f8fa] dark:bg-[#161B22] rounded-[10px] border border-[#f0f2f5] dark:border-white/5 transition-colors">
                    <div className="flex-1">
                      <p className="text-[13.5px] font-semibold text-[#111827] dark:text-white">
                        {isKhmer 
                          ? categoriesList.find(c => c.name === fi.category)?.khmer || fi.category 
                          : fi.category}
                      </p>
                      <p className="text-[11.5px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">
                        {isKhmer ? "និន្នាការតាមរដូវកាល ឬប្រវត្តិ" : fi.reason}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-bold text-[#111827] dark:text-white">{fi.predicted}</p>
                      <span className={`text-[11px] font-bold flex items-center justify-end gap-0.5 ${fi.up === true ? "text-[#ef4444]" : fi.up === false ? "text-[#29B28D]" : "text-[#9ca3af] dark:text-[#7d8590]"}`}>
                        {fi.up === true && <TrendingUp className="w-3 h-3" />} {isKhmer ? (fi.up === true ? "កើន" : fi.up === false ? "ថយ" : "ដដែល") : fi.change} {fi.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] overflow-hidden shadow-sm transition-colors">
            <div className="px-[20px] py-[16px] border-b border-[#f0f2f5] dark:border-white/5 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-2.5 px-3 py-2 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[10px] transition-colors group focus-within:border-[#29B28D] w-64">
                <Search className="w-4 h-4 text-[#9ca3af] dark:text-[#7d8590] group-focus-within:text-[#29B28D] transition-colors" />
                <input
                  type="text"
                  placeholder={isKhmer ? "ស្វែងរកចំណាយ..." : "Search expenses..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-[13px] text-[#111827] dark:text-white w-full placeholder:text-[#9ca3af]"
                />
              </div>
              <button className="p-2 border border-[#e8eaed] dark:border-white/10 rounded-[10px] text-[#6b7280] dark:text-[#7d8590] hover:bg-[#f0f2f5] dark:hover:bg-white/5 transition-colors bg-white dark:bg-[#161B22] cursor-pointer"><Filter className="w-4 h-4" /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f7f8fa] dark:bg-[#161B22] border-b border-[#f0f2f5] dark:border-white/5 text-[11px] text-[#9ca3af] dark:text-[#7d8590] uppercase tracking-wider font-bold transition-colors">
                    <th className="px-[20px] py-[14px]">{isKhmer ? "កាលបរិច្ឆេទ / ម៉ោង" : "Date / Time"}</th>
                    <th className="px-[20px] py-[14px]">{isKhmer ? "ប្រភេទ" : "Category"}</th>
                    <th className="px-[20px] py-[14px]">{isKhmer ? "សម្គាល់" : "Note"}</th>
                    <th className="px-[20px] py-[14px]">{isKhmer ? "សកម្មភាព" : "Action"}</th>
                    <th className="px-[20px] py-[14px] text-right">{isKhmer ? "ចំនួនទឹកប្រាក់" : "Amount"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f5] dark:divide-white/5 transition-colors">
                  {loading ? (
                    <tr><td colSpan={5} className="px-[20px] py-12 text-center text-[#9ca3af]">{isKhmer ? "កំពុងទាញយក..." : "Loading..."}</td></tr>
                  ) : filteredHistory.length === 0 ? (
                    <tr><td colSpan={5} className="px-[20px] py-12 text-center text-[#9ca3af]">{isKhmer ? "មិនឃើញមានការចំណាយទេ។" : "No expenses found."}</td></tr>
                  ) : (
                    filteredHistory.map((exp, i) => {
                      const c = catColorMap[exp.category] || catColorMap["slate"];
                      return (
                        <tr key={exp.id || i} className="group transition-colors hover:bg-[#f7f8fa] dark:hover:bg-white/5 cursor-pointer">
                          <td className="px-[20px] py-[14px]">
                            <div className="flex flex-col gap-1.5 text-[13px] text-[#6b7280] dark:text-[#7d8590]">
                              <span className="font-medium text-[#111827] dark:text-white flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {new Date(exp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <span className="text-[11px]">{new Date(exp.createdAt).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="px-[20px] py-[14px]">
                            <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[11.5px] font-semibold border ${c.badge}`}>
                              {isKhmer 
                                ? categoriesList.find(cat => cat.name === exp.category)?.khmer || exp.category 
                                : exp.category || "Uncategorized"}
                            </span>
                          </td>
                          <td className="px-[20px] py-[14px] text-[13px] font-medium text-[#111827] dark:text-white">{exp.description || "None"}</td>
                          <td className="px-[20px] py-[14px]">
                            <button onClick={(e) => handleDeleteExpense(exp.id, e)} className="p-1.5 text-[#9ca3af] hover:text-[#ef4444] rounded-lg hover:bg-[#fef2f2] dark:hover:bg-red-500/10 transition-colors border-0 bg-transparent cursor-pointer disabled:opacity-50">
                              {isDeleting === exp.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="px-[20px] py-[14px] text-right"><span className="text-[14px] font-bold text-[#ef4444]">-${parseFloat(exp.amount || "0").toFixed(2)}</span></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isQuickLogModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0d1117]/60 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setIsQuickLogModalOpen(false)}></div>
          <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setIsQuickLogModalOpen(false)} className="absolute top-5 right-5 text-[#9ca3af] hover:text-[#111827] hover:bg-[#f0f2f5] dark:hover:bg-white/10 p-1.5 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"><X className="w-5 h-5" /></button>
            <div className="mb-6 flex items-center gap-2">
              <div className="p-2 bg-[rgba(41,178,141,0.1)] text-[#29B28D] rounded-lg"><ReceiptIcon className="w-6 h-6" /></div>
              <div>
                <h2 className="font-bold text-[22px] text-[#111827] dark:text-white">
                  {isKhmer ? "កត់ត្រាចំណាយថ្មី" : "Log New Expense"}
                </h2>
              </div>
            </div>
            <form onSubmit={handleQuickLog} className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><CircleDollarSign className="h-6 w-6 text-[#9ca3af] group-focus-within:text-[#ef4444] transition-colors" /></div>
                  <input type="number" step="0.01" placeholder="0.00" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} required className="block w-full pl-12 pr-4 py-4 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-xl text-[#111827] dark:text-white text-xl font-bold placeholder-[#9ca3af] dark:placeholder-[#7d8590] focus:bg-white dark:focus:bg-[#0d1117] focus:border-[#ef4444] outline-none transition-all min-h-[60px]" />
                  <div className="absolute top-[-10px] left-4 bg-white dark:bg-[#0d1117] px-1 text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590]">
                    {isKhmer ? "ចំនួនទឹកប្រាក់" : "Amount"} <span className="text-[#ef4444]">*</span>
                  </div>
                </div>
                <div className="relative group">
                  <select value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} className="block w-full px-4 py-4 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-xl text-[#111827] dark:text-white text-[15px] font-medium focus:bg-white dark:focus:bg-[#0d1117] focus:border-[#29B28D] outline-none transition-all min-h-[60px] cursor-pointer">
                    {categoriesList.map((cat, idx) => (
                      <option key={idx} value={cat.name}>{isKhmer ? cat.khmer : cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute top-[-10px] left-4 bg-white dark:bg-[#0d1117] px-1 text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590] flex items-center gap-2">
                    {isKhmer ? "ប្រភេទ" : "Category"} 
                    <button type="button" onClick={() => setShowCustomCategoryModal(true)} className="text-[#29B28D] text-[10px] hover:underline border-0 bg-transparent cursor-pointer">
                      + {isKhmer ? "ផ្ទាល់ខ្លួន" : "Custom"}
                    </button>
                  </div>
                </div>
                <div className="relative mt-2">
                  <input type="text" placeholder={isKhmer ? "តើចំណាយនេះសម្រាប់អ្វី? (មិនបាច់ក៏បាន)" : "What was this for? (Optional)"} value={expenseNote} onChange={(e) => setExpenseNote(e.target.value)} className="block w-full px-4 py-4 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-xl text-[#111827] dark:text-white text-[15px] placeholder-[#9ca3af] dark:placeholder-[#7d8590] focus:bg-white dark:focus:bg-[#0d1117] focus:border-[#29B28D] outline-none transition-all min-h-[60px]" />
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setIsQuickLogModalOpen(false)} className="flex-1 bg-[#f0f2f5] dark:bg-white/5 hover:bg-[#e8eaed] dark:hover:bg-white/10 text-[#374151] dark:text-white font-bold text-[16px] py-4 rounded-xl transition-all min-h-[56px] border-0 cursor-pointer">
                    {isKhmer ? "បោះបង់" : "Cancel"}
                  </button>
                  <button type="submit" disabled={!expenseAmount || isSaving} className="flex-[2] bg-gradient-to-r from-[#8b5cf6] to-[#29B28D] hover:opacity-90 text-white font-bold text-[16px] py-4 rounded-xl transition-all flex items-center justify-center gap-2 min-h-[56px] border-0 cursor-pointer disabled:opacity-60">
                    {isSaving ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-5 h-5" /> <span>{isKhmer ? "រក្សាទុកចំណាយ" : "Save Expense"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCustomCategoryModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0d1117]/60 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setShowCustomCategoryModal(false)}></div>
          <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowCustomCategoryModal(false)} className="absolute top-4 right-4 text-[#9ca3af] hover:text-[#e6edf3] p-1.5 rounded-lg hover:bg-white/10 transition-colors border-0 bg-transparent cursor-pointer"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-2 mb-5">
              <div className="p-2 bg-[rgba(41,178,141,0.1)] text-[#29B28D] rounded-lg"><Tag className="w-5 h-5" /></div>
              <div>
                <h3 className="font-bold text-[18px] text-[#111827] dark:text-white">
                  {isKhmer ? "បន្ថែមប្រភេទផ្ទាល់ខ្លួន" : "Add Custom Category"}
                </h3>
                <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590]">
                  {isKhmer ? "បង្កើតស្លាកចំណាយដោយខ្លួនឯង។" : "Create a personalized expense tag."}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder={isKhmer ? 'ឧ. ការតុបតែងហាង' : 'e.g., Shop Decor'} value={customCategoryName} onChange={(e) => setCustomCategoryName(e.target.value)} className="w-full px-4 py-3 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-xl text-[14px] focus:border-[#29B28D] outline-none transition-all text-[#111827] dark:text-white" autoFocus />
              <button onClick={handleCreateCustomCategory} className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#29B28D] hover:opacity-90 text-white font-bold py-3 rounded-xl transition-colors border-0 cursor-pointer">
                {isKhmer ? "បង្កើតប្រភេទ" : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Gemini AI Chat FAB ══ */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#8b5cf6] to-[#29B28D] rounded-full shadow-[0_8px_32px_rgba(139,92,246,0.4)] flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer border-0"
        >
          <MessageSquare className="w-[22px] h-[22px]" />
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] bg-white dark:bg-[#0d1117] rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.2)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.5)] border border-[#e8eaed] dark:border-white/10 flex flex-col overflow-hidden transition-colors">
          <div className="px-5 py-4 bg-[#0d1117] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#8b5cf6] to-[#29B28D] rounded-full flex items-center justify-center">
                <Brain className="w-[18px] h-[18px] text-white" />
              </div>
              <div>
                <p className="font-bold text-[13.5px] text-[#e6edf3]">
                  {isKhmer ? "ជំនួយការចំណាយ Gemini" : "Gemini Expense Advisor"}
                </p>
                <p className="text-[11px] text-[#4d5562]">
                  {isKhmer ? "អនឡាញ · កំពុងវិភាគការចំណាយរបស់អ្នក" : "Online · Analyzing your spending"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-[#7d8590] hover:text-[#e6edf3] bg-transparent border-0 cursor-pointer p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#f7f8fa] dark:bg-[#161B22] transition-colors" style={{ minHeight: "260px" }}>
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-[14px] text-[13px] leading-relaxed transition-colors ${
                    msg.role === "user"
                      ? "bg-[#0d1117] dark:bg-gradient-to-r dark:from-[#8b5cf6] dark:to-[#29B28D] text-[#e6edf3] dark:text-white rounded-br-[4px]"
                      : "bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 text-[#374151] dark:text-[#e6edf3] rounded-bl-[4px] shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatSending && (
              <div className="flex justify-start">
                <div className="px-4 py-3 bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 text-[#6b7280] dark:text-[#7d8590] rounded-[14px] rounded-bl-[4px] text-[13px] italic shadow-sm">
                  Analyzing your expenses...
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-[#e8eaed] dark:border-white/10 bg-white dark:bg-[#0d1117] transition-colors">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about your expenses..."
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 px-4 py-2.5 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[10px] text-[13px] outline-none text-[#111827] dark:text-white focus:border-[#29B28D] dark:focus:border-[#29B28D] transition-colors placeholder-[#9ca3af] dark:placeholder-[#7d8590]"
              />
              <button
                onClick={handleSend}
                disabled={isChatSending}
                className="p-2.5 bg-gradient-to-br from-[#8b5cf6] to-[#29B28D] text-white rounded-[10px] border-0 cursor-pointer hover:opacity-90 disabled:opacity-50"
              >
                {isChatSending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-[15px] h-[15px]" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </VendorDashboardLayout>
  );
}
