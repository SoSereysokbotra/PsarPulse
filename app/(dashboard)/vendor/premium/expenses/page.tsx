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

const catColorMap: Record<CatColor, { badge: string; iconBg: string; iconText: string; bar: string; recurBg: string; recurBorder: string }> = {
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
};

const pushAlerts = [
  {
    title: "Unusual Ingredient Cost",
    message: "Your spending on 'Ingredients' is 24% higher than last Tuesday. Check duplicate logs?",
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
    detail: "You are buying from 4 different beverage vendors. Consolidating to 1 could save you 8% through bulk discounts.",
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
  { category: "Ingredients", reason: "Khmer New Year approaching", predicted: "$120.00", change: "+15%", up: true },
  { category: "Utilities", reason: "Stable usage pattern", predicted: "$42.02", change: "-2%", up: false },
  { category: "Marketing", reason: "End of month promotion", predicted: "$15.00", change: "Same", up: null },
];

const geminiTips = [
  { tip: "Buy ingredients Tuesday 6–8 AM at Orussey Market", saving: "Save ~$4.50/week", emoji: "🌅" },
  { tip: "Batch electricity usage — turn off fans after 9 PM", saving: "Save ~$2/week", emoji: "⚡" },
  { tip: "Share TukTuk with Stall B41 for shared market runs", saving: "Save ~$1.50/trip", emoji: "🛺" },
];

const TABS: { id: TabId; label: string; khmer: string }[] = [
  { id: "overview", label: "Overview", khmer: "ទិដ្ឋភាពទូទៅ" },
  { id: "recurring", label: "Recurring Detection", khmer: "ចំណាយដដែល" },
  { id: "insights", label: "AI Insights", khmer: "ការវិភាគ AI" },
  { id: "forecast", label: "Forecast", khmer: "ការព្យាករណ៍" },
  { id: "history", label: "Expense History", khmer: "ប្រវត្តិចំណាយ" },
];

const initChat: ChatMsg[] = [
  { role: "assistant", text: "សួស្តី! I'm your AI Expense Assistant. Ask me anything about your spending patterns or how to cut costs!" },
  { role: "assistant", text: "Try: 'Where am I spending too much?' or 'How can I reduce costs this week?'" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PremiumExpensesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>(initChat);
  const [dismissed, setDismissed] = useState<number[]>([]);

  // States
  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState(false);
  const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");
  
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Ingredients");
  const [expenseVendor, setExpenseVendor] = useState("");
  const [expenseNote, setExpenseNote] = useState("");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [aiSavings, setAiSavings] = useState({ potentialSavings: 0, period: "Weekly" });
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);

  const [categoriesList, setCategoriesList] = useState([
    { name: "Ingredients", khmer: "គ្រឿងផ្សំ", color: "emerald" as CatColor, icon: ShoppingCart },
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
        const res = await fetch("/api/vendor/expenses");
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
        const res = await fetch("/api/vendor/ai/savings");
        const json = await res.json();
        if (json.success) setAiSavings(json.data);
      } catch (error) {
        console.error("Failed to fetch AI savings", error);
      } finally {
        setAiLoading(false);
      }
    };

    fetchExpenses();
    fetchAiSavings();
  }, []);

  const handleQuickLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount) return;
    try {
      const res = await fetch("/api/vendor/expenses", {
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
    }
  };

  const handleDeleteExpense = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this expense?")) return;
    try {
      const res = await fetch(`/api/vendor/expenses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setExpenses(prev => prev.filter(exp => exp.id !== id));
      }
    } catch (error) {
      console.error("Delete failed", error);
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
    if (!chatMsg.trim()) return;
    const userMsg = chatMsg;
    setChatMessages((p) => [...p, { role: "user", text: userMsg }]);
    setChatMsg("");
    
    try {
      const res = await fetch("/api/vendor/ai/chat", {
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
    }
  };

  const visibleAlerts = pushAlerts.filter((_, i) => !dismissed.includes(i));
  const filteredHistory = expenses.filter(
    (e) =>
      (e.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportExcel = () => {
    if (expenses.length === 0) return;
    const headers = ["Date", "Category", "Description", "Amount"];
    const csvRows = [headers.join(",")];
    expenses.forEach(exp => {
      const row = [
        new Date(exp.createdAt).toLocaleDateString(),
        `"${exp.category || 'Uncategorized'}"`,
        `"${(exp.description || 'None').replace(/"/g, '""')}"`,
        exp.amount
      ];
      csvRows.push(row.join(","));
    });
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `expenses_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = React.useMemo(() => {
    let today = 0, week = 0, month = 0;
    const catMap: Record<string, number> = {};
    expenses.forEach(e => {
      const amt = parseFloat(e.amount || "0");
      const d = new Date(e.expenseDate || e.createdAt);
      if (d >= startOfDay) today += amt;
      if (d >= startOfWeek) week += amt;
      if (d >= startOfMonth) month += amt;
      const catName = e.category || "Others";
      catMap[catName] = (catMap[catName] || 0) + amt;
    });
    const topCatEntry = Object.entries(catMap).sort(([, a], [, b]) => b - a)[0];
    return { today, week, month, topCat: topCatEntry ? topCatEntry[0] : "None", catMap };
  }, [expenses, startOfDay, startOfWeek, startOfMonth]);

  const dynamicCategories = React.useMemo(() => {
    const total = stats.week || 1;
    return categoriesList.map(c => ({
      ...c,
      amount: `$${(stats.catMap[c.name] || 0).toFixed(2)}`,
      pct: Math.round(((stats.catMap[c.name] || 0) / total) * 100)
    }));
  }, [stats, categoriesList]);

  const weeklyChartData = React.useMemo(() => {
    const buckets = [0,0,0,0,0,0,0];
    expenses.forEach(e => {
      const d = new Date(e.createdAt);
      if (d >= startOfWeek) {
        const dow = (d.getDay() + 6) % 7;
        buckets[dow] += parseFloat(e.amount || "0");
      }
    });
    return buckets;
  }, [expenses]);
  
  const maxWeekly = Math.max(...weeklyChartData, 1);

  return (
    <VendorDashboardLayout
      settingsHref="/vendor/premium/settings"
      plan="premium"
      navLinks={PREMIUM_NAV}
      currentPath="/vendor/premium/expenses"
      title="Expenses"
      planBadge={{ label: "PREMIUM", icon: Sparkles }}
      rightActions={
        <>
          <button onClick={handleExportPDF} className="hidden sm:flex items-center gap-1.5 bg-[#0d1117] dark:bg-white hover:opacity-90 text-white dark:text-[#111827] font-semibold px-3.5 py-2 rounded-[10px] text-sm transition-colors border-0 cursor-pointer">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button onClick={handleExportExcel} className="hidden sm:flex items-center gap-1.5 bg-white dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 hover:bg-[#f0f2f5] dark:hover:bg-white/5 text-[#111827] dark:text-white font-semibold px-3.5 py-2 rounded-[10px] text-sm transition-colors cursor-pointer">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button onClick={() => setIsChatOpen(true)} className="flex items-center gap-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#3ecf8e] text-white font-bold px-3.5 py-2 rounded-[10px] text-sm hover:opacity-90 transition-opacity cursor-pointer border-0">
            <Brain className="w-4 h-4" /> Gemini AI
          </button>
          <button onClick={() => setIsQuickLogModalOpen(true)} className="flex items-center gap-1.5 bg-[#3ecf8e] hover:bg-[#4dd49a] text-[#0d1117] font-bold px-4 py-2 rounded-[10px] text-sm shadow-[0_2px_14px_rgba(62,207,142,0.28)] transition-colors cursor-pointer border-0">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </>
      }
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          header, nav, aside, .fixed, button, .no-print { display: none !important; }
          main, .flex-1 { width: 100% !important; padding: 0 !important; margin: 0 !important; overflow: visible !important; height: auto !important; }
          .overflow-y-auto { overflow: visible !important; height: auto !important; }
          body { background-color: white !important; color: black !important; }
          .dark { background-color: white !important; }
          .dark * { color: black !important; border-color: #ddd !important; }
        }
      `}} />
      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-5 transition-colors">
        <div className="pt-1 pb-1">
          <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">My Expenses</h2>
          <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
            Track and manage your spending · <span className="text-[#9ca3af] dark:text-[#4d5562]">តាមដាន និងគ្រប់គ្រងចំណាយ</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <VendorSummaryCard variant="dark" title="Today's Expenses" khmerTitle="ចំណាយថ្ងៃនេះ" value={`$${stats.today.toFixed(2)}`} subtext={`${expenses.filter(e => new Date(e.createdAt) >= startOfDay).length} transactions`} />
          <VendorSummaryCard title="Top Category" khmerTitle="ប្រភេទទូទៅ" value={stats.topCat} subtext="🏷️ Highest Spending" />
          <VendorSummaryCard variant="green" title="Weekly Expenses" khmerTitle="ចំណាយប្រចាំសប្តាហ៍" value={`$${stats.week.toFixed(2)}`} subtext="this week" />
          <VendorSummaryCard title="Monthly Total" khmerTitle="សរុបប្រចាំខែ" value={`$${stats.month.toFixed(2)}`} subtext="this month" />
          <VendorSummaryCard title="AI Savings" khmerTitle="ការសន្សំ" value={aiLoading ? "..." : `$${aiSavings.potentialSavings.toFixed(2)}`} icon={Brain} subtext="potential/week" />
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
              <span>{tab.label}</span>
              <span className="text-[10px] text-[#9ca3af] dark:text-[#6b7280]">{tab.khmer}</span>
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-5">
            <div className="bg-[#0d1117] border border-white/[0.06] rounded-[14px] px-[26px] py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[rgba(62,207,142,0.12)] rounded-[11px]"><Brain className="w-5 h-5 text-[#3ecf8e]" /></div>
                <div>
                  <div className="text-[16px] font-bold text-[#e6edf3]">AI Expense Intelligence Active</div>
                  <div className="text-[12px] text-[#7d8590] mt-0.5">Anomaly detection · Recurring patterns · Cost optimization · Gemini insights</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[rgba(62,207,142,0.1)] border border-[rgba(62,207,142,0.2)] px-4 py-2 rounded-[10px] text-[#3ecf8e] shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[13px] font-semibold">Premium Active</span>
              </div>
            </div>

            {visibleAlerts.length > 0 && (
              <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] overflow-hidden shadow-sm transition-colors">
                <div className="px-6 py-4 border-b border-[#f0f2f5] dark:border-white/5 flex items-center justify-between transition-colors">
                  <div className="font-semibold text-[15px] text-[#111827] dark:text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#f59e0b]" /> Smart Alerts
                  </div>
                  <span className="text-[11px] font-bold text-[#9ca3af] dark:text-[#7d8590] uppercase tracking-wider">{visibleAlerts.length} Action{visibleAlerts.length > 1 ? "s" : ""} required</span>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  {visibleAlerts.map((alert, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/5 rounded-[12px] transition-colors">
                      <div className="p-2 bg-white dark:bg-[#0d1117] rounded-[10px] shadow-sm shrink-0 border dark:border-white/5"><alert.icon className="w-4 h-4 text-[#f59e0b]" /></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="font-bold text-[13.5px] text-[#111827] dark:text-white">{alert.title}</p>
                          <span className="text-[11px] text-[#9ca3af] dark:text-[#7d8590]">{alert.time}</span>
                        </div>
                        <p className="text-[12.5px] text-[#6b7280] dark:text-[#7d8590] leading-relaxed">{alert.message}</p>
                      </div>
                      <button onClick={() => setDismissed([...dismissed, i])} className="text-[#9ca3af] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white hover:bg-[#e8eaed] dark:hover:bg-white/10 p-1.5 rounded-[8px] transition-colors border-0 cursor-pointer bg-transparent">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] shadow-sm transition-colors">
                <div className="px-6 py-5 border-b border-[#f0f2f5] dark:border-white/5 transition-colors">
                  <h3 className="font-bold text-[16px] text-[#111827] dark:text-white">Spending by Category</h3>
                  <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">ការចំណាយតាមប្រភេទ</p>
                </div>
                <div className="p-[22px] flex flex-col gap-[22px]">
                  {dynamicCategories.map((cat, i) => {
                    const c = catColorMap[cat.color];
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${c.iconBg} ${c.iconText}`}><cat.icon className="w-4 h-4" /></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] font-semibold text-[#111827] dark:text-white">{cat.name}</span>
                              <span className="text-[10px] text-[#9ca3af] dark:text-[#7d8590]">{cat.khmer}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[12.5px] font-bold text-[#111827] dark:text-white">{cat.amount}</span>
                              <span className="text-[11px] text-[#9ca3af] dark:text-[#7d8590]">{cat.pct}%</span>
                            </div>
                          </div>
                          <div className="w-full h-[6px] bg-[#f0f2f5] dark:bg-white/5 rounded-full overflow-hidden transition-colors">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cat.pct}%`, background: c.bar }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#0d1117] border border-white/[0.06] rounded-[14px] px-[26px] py-[22px] transition-colors">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-[rgba(139,92,246,0.15)] rounded-[9px]"><Sparkles className="w-4 h-4 text-[#8b5cf6]" /></div>
                  <div>
                    <div className="text-[14px] font-bold text-[#e6edf3]">Gemini Cost Optimization</div>
                    <div className="text-[11px] text-[#7d8590] mt-0.5">គន្លឹះកាត់បន្ថយថ្លៃដើម · Powered by Gemini AI</div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {geminiTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-white/[0.04] border border-white/[0.07] rounded-[11px] hover:bg-white/[0.07] transition-colors cursor-pointer">
                      <span className="text-2xl shrink-0">{tip.emoji}</span>
                      <div>
                        <p className="text-[13px] font-semibold text-[#e6edf3] leading-snug">{tip.tip}</p>
                        <p className="text-[12px] font-bold text-[#3ecf8e] mt-1.5">{tip.saving}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-white/[0.04] border border-white/[0.07] rounded-[10px]">
                  <p className="text-[12px] text-[#7d8590]">
                    <strong className="text-[#e6edf3]">Estimated Monthly Savings:</strong> Implementing these could save you <span className="text-[#3ecf8e] font-bold">~$32.00</span> per month.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "recurring" && (
          <div className="space-y-5">
            <div className="bg-gradient-to-r from-[rgba(139,92,246,0.06)] to-[rgba(62,207,142,0.06)] dark:from-[rgba(139,92,246,0.1)] dark:to-[rgba(62,207,142,0.1)] p-5 rounded-[14px] border border-[rgba(139,92,246,0.15)] dark:border-[rgba(139,92,246,0.2)] flex items-start gap-3 transition-colors">
              <RefreshCw className="w-5 h-5 text-[#8b5cf6] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-[15px] text-[#111827] dark:text-white">AI Recurring Expense Detection</h3>
                <p className="text-[13px] text-[#6b7280] dark:text-[#7d8590] mt-1 leading-relaxed">The system noticed you log these expenses regularly. We've auto-categorized them as recurring so you can track your fixed costs easier.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recurringItems.map((item, i) => {
                const c = catColorMap[item.color];
                return (
                  <div key={i} className={`p-5 rounded-[14px] border ${c.recurBorder} ${c.recurBg} transition-colors`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-[15px] text-[#111827] dark:text-white">{item.name}</h4>
                        <p className="text-[11px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">{item.khmer}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${c.badge}`}>{item.frequency}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
                      <div>
                        <p className="text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-wider mb-0.5">Estimated Cost</p>
                        <p className="text-[16px] font-extrabold text-[#111827] dark:text-white">{item.amount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-wider mb-0.5">Next Expected</p>
                        <p className="text-[13.5px] font-semibold text-[#111827] dark:text-white">{item.nextDue}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "insights" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {aiInsights.map((ins, i) => {
              const Icon = ins.icon;
              return (
                <div key={i} className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] p-[22px] shadow-sm flex flex-col transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-[11px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${ins.tagColor}15`, color: ins.tagColor }}><Icon className="w-5 h-5" /></div>
                    <span className="px-2.5 py-1 text-[10px] font-bold rounded-full border" style={{ backgroundColor: `${ins.tagColor}10`, color: ins.tagColor, borderColor: `${ins.tagColor}25` }}>{ins.tag}</span>
                  </div>
                  <h4 className="font-bold text-[15px] text-[#111827] dark:text-white leading-snug mb-2">{ins.title}</h4>
                  <p className="text-[13px] text-[#6b7280] dark:text-[#7d8590] leading-relaxed flex-1">{ins.detail}</p>
                  <button className="mt-4 text-[12px] font-semibold px-3 py-1.5 rounded-[8px] bg-[#f0f2f5] dark:bg-[#161B22] text-[#6b7280] dark:text-[#7d8590] hover:bg-[#e8eaed] dark:hover:bg-white/5 border border-transparent dark:border-white/5 cursor-pointer transition-colors w-fit">{ins.action} →</button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "forecast" && (
          <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] overflow-hidden shadow-sm transition-colors">
            <div className="px-[26px] py-[18px] border-b border-[#f0f2f5] dark:border-white/5 flex items-center justify-between transition-colors">
              <div>
                <div className="text-[14px] font-semibold text-[#111827] dark:text-white">AI Expense Forecast — Next 7 Days</div>
                <div className="text-[11px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">ការព្យាករណ៍ចំណាយ · Predicted total: <strong className="text-[#3ecf8e]">$175.00</strong> · 89% confident</div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[rgba(62,207,142,0.1)] text-[#3ecf8e] text-[10px] font-bold rounded-full border border-[rgba(62,207,142,0.2)]"><Brain className="w-2.5 h-2.5" /> AI</span>
            </div>
            <div className="p-[22px]">
              <div className="flex items-end gap-2 h-28 mb-4">
                {weeklyChartData.map((h, i) => {
                  const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i];
                  const isToday = i === (now.getDay() + 6) % 7;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full relative rounded-t-[6px] transition-colors" style={{ height: "96px", background: isToday ? "rgba(62,207,142,0.15)" : "" }}>
                        <div className={`absolute bottom-0 w-full rounded-t-[6px] ${isToday ? "bg-[#3ecf8e]" : "bg-[#d1d5db] dark:bg-white/10"}`} style={{ height: `${(h / maxWeekly) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-[#9ca3af] dark:text-[#7d8590]">{day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2 mt-6">
                {forecastItems.map((fi, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#f7f8fa] dark:bg-[#161B22] rounded-[10px] border border-[#f0f2f5] dark:border-white/5 transition-colors">
                    <div className="flex-1">
                      <p className="text-[13.5px] font-semibold text-[#111827] dark:text-white">{fi.category}</p>
                      <p className="text-[11.5px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">{fi.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-bold text-[#111827] dark:text-white">{fi.predicted}</p>
                      <span className={`text-[11px] font-bold flex items-center justify-end gap-0.5 ${fi.up === true ? "text-[#ef4444]" : fi.up === false ? "text-[#3ecf8e]" : "text-[#9ca3af] dark:text-[#7d8590]"}`}>
                        {fi.up === true && <TrendingUp className="w-3 h-3" />} {fi.change}
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
              <div className="flex items-center gap-2.5 px-3 py-2 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[10px] transition-colors group focus-within:border-[#3ecf8e] w-64">
                <Search className="w-4 h-4 text-[#9ca3af] dark:text-[#7d8590] group-focus-within:text-[#3ecf8e] transition-colors" />
                <input type="text" placeholder="Search expenses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-[13px] text-[#111827] dark:text-white w-full placeholder:text-[#9ca3af]" />
              </div>
              <button className="p-2 border border-[#e8eaed] dark:border-white/10 rounded-[10px] text-[#6b7280] dark:text-[#7d8590] hover:bg-[#f0f2f5] dark:hover:bg-white/5 transition-colors bg-white dark:bg-[#161B22] cursor-pointer"><Filter className="w-4 h-4" /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f7f8fa] dark:bg-[#161B22] border-b border-[#f0f2f5] dark:border-white/5 text-[11px] text-[#9ca3af] dark:text-[#7d8590] uppercase tracking-wider font-bold transition-colors">
                    <th className="px-[20px] py-[14px]">Date / Time</th>
                    <th className="px-[20px] py-[14px]">Category</th>
                    <th className="px-[20px] py-[14px]">Note</th>
                    <th className="px-[20px] py-[14px]">Action</th>
                    <th className="px-[20px] py-[14px] text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f5] dark:divide-white/5 transition-colors">
                  {loading ? (
                    <tr><td colSpan={5} className="px-[20px] py-12 text-center text-[#9ca3af]">Loading…</td></tr>
                  ) : filteredHistory.length === 0 ? (
                    <tr><td colSpan={5} className="px-[20px] py-12 text-center text-[#9ca3af]">No expenses found.</td></tr>
                  ) : (
                    filteredHistory.map((exp, i) => (
                      <tr key={exp.id || i} className="group transition-colors hover:bg-[#f7f8fa] dark:hover:bg-white/5 cursor-pointer">
                        <td className="px-[20px] py-[14px]">
                          <div className="flex flex-col gap-1.5 text-[13px] text-[#6b7280] dark:text-[#7d8590]">
                            <span className="font-medium text-[#111827] dark:text-white flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {new Date(exp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="text-[11px]">{new Date(exp.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-[20px] py-[14px]">
                          <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[11.5px] font-semibold border ${Object.keys(catColorMap).includes(exp.category) ? (catColorMap as any)[exp.category]?.badge : catColorMap["slate"].badge}`}>
                            {exp.category || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-[20px] py-[14px] text-[13px] font-medium text-[#111827] dark:text-white">{exp.description || "None"}</td>
                        <td className="px-[20px] py-[14px]">
                          <button onClick={(e) => handleDeleteExpense(exp.id, e)} className="p-1.5 text-[#9ca3af] hover:text-[#ef4444] rounded-lg hover:bg-[#fef2f2] dark:hover:bg-red-500/10 transition-colors border-0 bg-transparent cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                        </td>
                        <td className="px-[20px] py-[14px] text-right"><span className="text-[14px] font-bold text-[#ef4444]">-${parseFloat(exp.amount || "0").toFixed(2)}</span></td>
                      </tr>
                    ))
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
              <div className="p-2 bg-[rgba(62,207,142,0.1)] text-[#3ecf8e] rounded-lg"><ReceiptIcon className="w-6 h-6" /></div>
              <div><h2 className="font-bold text-[22px] text-[#111827] dark:text-white">Log New Expense</h2><p className="text-sm text-[#6b7280] dark:text-[#7d8590] mt-1">កត់ត្រាចំណាយថ្មី</p></div>
            </div>
            <form onSubmit={handleQuickLog} className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><CircleDollarSign className="h-6 w-6 text-[#9ca3af] group-focus-within:text-[#ef4444] transition-colors" /></div>
                  <input type="number" step="0.01" placeholder="0.00" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} required className="block w-full pl-12 pr-4 py-4 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-xl text-[#111827] dark:text-white text-xl font-bold placeholder-[#9ca3af] dark:placeholder-[#7d8590] focus:bg-white dark:focus:bg-[#0d1117] focus:border-[#ef4444] outline-none transition-all min-h-[60px]" />
                  <div className="absolute top-[-10px] left-4 bg-white dark:bg-[#0d1117] px-1 text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590]">Amount <span className="text-[#ef4444]">*</span></div>
                </div>
                <div className="relative group">
                  <select value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} className="block w-full px-4 py-4 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-xl text-[#111827] dark:text-white text-[15px] font-medium focus:bg-white dark:focus:bg-[#0d1117] focus:border-[#3ecf8e] outline-none transition-all min-h-[60px] cursor-pointer">
                    {categoriesList.map((cat, idx) => (
                      <option key={idx} value={cat.name}>{cat.name} ({cat.khmer})</option>
                    ))}
                  </select>
                  <div className="absolute top-[-10px] left-4 bg-white dark:bg-[#0d1117] px-1 text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590] flex items-center gap-2">Category <button type="button" onClick={() => setShowCustomCategoryModal(true)} className="text-[#3ecf8e] text-[10px] hover:underline border-0 bg-transparent cursor-pointer">+ Custom</button></div>
                </div>
                <div className="relative mt-2"><input type="text" placeholder="What was this for? (Optional)" value={expenseNote} onChange={(e) => setExpenseNote(e.target.value)} className="block w-full px-4 py-4 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-xl text-[#111827] dark:text-white text-[15px] placeholder-[#9ca3af] dark:placeholder-[#7d8590] focus:bg-white dark:focus:bg-[#0d1117] focus:border-[#3ecf8e] outline-none transition-all min-h-[60px]" /></div>
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setIsQuickLogModalOpen(false)} className="flex-1 bg-[#f0f2f5] dark:bg-white/5 hover:bg-[#e8eaed] dark:hover:bg-white/10 text-[#374151] dark:text-white font-bold text-[16px] py-4 rounded-xl transition-all min-h-[56px] border-0 cursor-pointer">Cancel</button>
                  <button type="submit" disabled={!expenseAmount} className="flex-[2] bg-gradient-to-r from-[#8b5cf6] to-[#3ecf8e] hover:opacity-90 text-white font-bold text-[16px] py-4 rounded-xl transition-all flex items-center justify-center gap-2 min-h-[56px] border-0 cursor-pointer disabled:opacity-60"><Plus className="w-5 h-5" /> <span>Save Expense</span></button>
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
              <div className="p-2 bg-[rgba(62,207,142,0.1)] text-[#3ecf8e] rounded-lg"><Tag className="w-5 h-5" /></div>
              <div><h3 className="font-bold text-[18px] text-[#111827] dark:text-white">Add Custom Category</h3><p className="text-[12px] text-[#6b7280] dark:text-[#7d8590]">Create a personalized expense tag.</p></div>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="e.g., Shop Decor" value={customCategoryName} onChange={(e) => setCustomCategoryName(e.target.value)} className="w-full px-4 py-3 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-xl text-[14px] focus:border-[#3ecf8e] outline-none transition-all text-[#111827] dark:text-white" autoFocus />
              <button onClick={handleCreateCustomCategory} className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#3ecf8e] hover:opacity-90 text-white font-bold py-3 rounded-xl transition-colors border-0 cursor-pointer">Create Category</button>
            </div>
          </div>
        </div>
      )}

      {!isChatOpen && (
        <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] rounded-full shadow-[0_8px_32px_rgba(139,92,246,0.4)] flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer border-0">
          <MessageSquare size={22} />
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] bg-white dark:bg-[#0d1117] rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.2)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.5)] border border-[#e8eaed] dark:border-white/10 flex flex-col overflow-hidden transition-colors">
          <div className="px-5 py-4 bg-[#0d1117] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] rounded-full flex items-center justify-center"><Brain size={18} className="text-white" /></div>
              <div><p className="font-bold text-[13.5px] text-[#e6edf3]">Expense Assistant</p><p className="text-[11px] text-[#4d5562]">Online · Analyzing costs</p></div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-[#7d8590] hover:text-[#e6edf3] bg-transparent border-0 cursor-pointer p-1"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#f7f8fa] dark:bg-[#161B22] transition-colors" style={{ minHeight: "260px" }}>
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-[14px] text-[13px] leading-relaxed transition-colors ${msg.role === "user" ? "bg-[#0d1117] dark:bg-gradient-to-r dark:from-[#8b5cf6] dark:to-[#3ecf8e] text-[#e6edf3] dark:text-white rounded-br-[4px]" : "bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 text-[#374151] dark:text-[#e6edf3] rounded-bl-[4px] shadow-sm"}`}>{msg.text}</div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[#e8eaed] dark:border-white/10 bg-white dark:bg-[#0d1117] transition-colors">
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Ask about your expenses..." value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} className="flex-1 px-4 py-2.5 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[10px] text-[13px] outline-none text-[#111827] dark:text-white focus:border-[#3ecf8e] transition-colors placeholder-[#9ca3af] dark:placeholder-[#7d8590]" />
              <button onClick={handleSend} className="p-2.5 bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] text-white rounded-[10px] border-0 cursor-pointer hover:opacity-90"><Send size={15} /></button>
            </div>
          </div>
        </div>
      )}
    </VendorDashboardLayout>
  );
}
