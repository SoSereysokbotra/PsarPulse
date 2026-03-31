"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  X,
  Sparkles,
  Brain,
  AlertTriangle,
  FileBarChart,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Lightbulb,
  ShoppingCart,
  Home,
  Car,
  Bolt,
  UserCheck,
  MoreHorizontal,
  Megaphone,
  MessageSquare,
  Send,
  Tag,
  Repeat,
  RefreshCw,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  CloudSun,
  Clock,
} from "lucide-react";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";

// ─── Nav ──────────────────────────────────────────────────────────────────────

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
];

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = "overview" | "recurring" | "insights" | "forecast" | "history";
type CatColor = "emerald" | "indigo" | "violet" | "amber" | "red" | "slate";
type AnomalyFlag = "high" | "medium" | null;

interface ChatMsg {
  role: "assistant" | "user";
  text: string;
}
interface PushAlert {
  title: string;
  message: string;
  time: string;
  icon: React.ElementType;
}
interface RecurringItem {
  name: string;
  khmer: string;
  amount: string;
  frequency: string;
  nextDue: string;
  color: CatColor;
}
interface Category {
  name: string;
  khmer: string;
  amount: string;
  pct: number;
  color: CatColor;
  icon: React.ElementType;
}
interface ExpenseRecord {
  time: string;
  category: string;
  note: string;
  amount: number;
  categoryColor: CatColor;
  recurring: boolean;
  anomaly: AnomalyFlag;
  anomalyNote: string | null;
}
interface ForecastItem {
  category: string;
  predicted: string;
  change: string;
  up: boolean | null;
  reason: string;
}

// ─── Color Map ────────────────────────────────────────────────────────────────
// FIXED: Enhanced dark mode variants for the slate (others) category
const catColorMap: Record<
  CatColor,
  {
    iconBg: string;
    iconText: string;
    badge: string;
    bar: string;
    recurBg: string;
    recurBorder: string;
  }
> = {
  emerald: {
    iconBg: "bg-[rgba(62,207,142,0.12)]",
    iconText: "text-[#3ecf8e]",
    badge:
      "bg-[rgba(62,207,142,0.1)] text-[#3ecf8e] border border-[rgba(62,207,142,0.25)]",
    bar: "#3ecf8e",
    recurBg: "bg-[rgba(62,207,142,0.05)]",
    recurBorder: "border-[rgba(62,207,142,0.2)]",
  },
  indigo: {
    iconBg: "bg-[rgba(99,102,241,0.1)]",
    iconText: "text-[#6366f1]",
    badge:
      "bg-[rgba(99,102,241,0.1)] text-[#6366f1] border border-[rgba(99,102,241,0.2)]",
    bar: "#6366f1",
    recurBg: "bg-[rgba(99,102,241,0.05)]",
    recurBorder: "border-[rgba(99,102,241,0.15)]",
  },
  violet: {
    iconBg: "bg-[rgba(139,92,246,0.1)]",
    iconText: "text-[#8b5cf6]",
    badge:
      "bg-[rgba(139,92,246,0.1)] text-[#8b5cf6] border border-[rgba(139,92,246,0.2)]",
    bar: "#8b5cf6",
    recurBg: "bg-[rgba(139,92,246,0.05)]",
    recurBorder: "border-[rgba(139,92,246,0.15)]",
  },
  amber: {
    iconBg: "bg-[rgba(245,158,11,0.1)]",
    iconText: "text-[#f59e0b]",
    badge:
      "bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border border-[rgba(245,158,11,0.2)]",
    bar: "#f59e0b",
    recurBg: "bg-[rgba(245,158,11,0.05)]",
    recurBorder: "border-[rgba(245,158,11,0.15)]",
  },
  red: {
    iconBg: "bg-[rgba(239,68,68,0.1)]",
    iconText: "text-[#ef4444]",
    badge:
      "bg-[rgba(239,68,68,0.1)] text-[#ef4444] border border-[rgba(239,68,68,0.2)]",
    bar: "#ef4444",
    recurBg: "bg-[rgba(239,68,68,0.05)]",
    recurBorder: "border-[rgba(239,68,68,0.15)]",
  },
  slate: {
    iconBg: "bg-[#f0f2f5] dark:bg-white/10",
    iconText: "text-[#6b7280] dark:text-[#9ca3af]",
    badge:
      "bg-[#f0f2f5] dark:bg-white/5 text-[#6b7280] dark:text-[#9ca3af] border border-[#e8eaed] dark:border-white/10",
    bar: "#9ca3af",
    recurBg: "bg-[#f7f8fa] dark:bg-[#161B22]",
    recurBorder: "border-[#e8eaed] dark:border-white/10",
  },
};

// ─── Static Data ──────────────────────────────────────────────────────────────

const pushAlerts: PushAlert[] = [
  {
    title: "Ingredient Costs Up 30%",
    icon: TrendingUp,
    message:
      "Pork & vegetables spending jumped 30% vs last week. Likely linked to market price surge — review supplier pricing.",
    time: "2 hours ago",
  },
  {
    title: "Unusual Spending Detected",
    icon: AlertTriangle,
    message:
      "Transport costs logged twice today ($0.02 total) — AI flagged this as a possible duplicate entry. Please review.",
    time: "45 min ago",
  },
  {
    title: "Budget Tip: Rainy Evening",
    icon: CloudSun,
    message:
      "Rainy evening predicted — Hot Latte demand rising. Consider increasing ingredient budget by 15% for tomorrow.",
    time: "30 min ago",
  },
];

const recurringItems: RecurringItem[] = [
  {
    name: "Monthly Stall Rent",
    khmer: "ថ្លៃជួល",
    amount: "$80.00",
    frequency: "Monthly",
    nextDue: "Nov 1",
    color: "indigo",
  },
  {
    name: "Weekly Electricity",
    khmer: "អគ្គិសនី",
    amount: "$15.00",
    frequency: "Weekly",
    nextDue: "Oct 29",
    color: "amber",
  },
  {
    name: "Assistant Pay",
    khmer: "ម្ចាស់ពលកម្ម",
    amount: "$10.00",
    frequency: "Weekly",
    nextDue: "Oct 30",
    color: "red",
  },
  {
    name: "Market Fees",
    khmer: "ថ្លៃទីផ្សារ",
    amount: "$5.00",
    frequency: "Monthly",
    nextDue: "Nov 1",
    color: "violet",
  },
];

const aiInsights = [
  {
    icon: AlertTriangle,
    tag: "Warning",
    tagColor: "#ef4444",
    title: "Rent is 60% of expenses",
    detail:
      "Above the healthy 40% threshold for market stalls. Consider renegotiating or finding lower-cost alternatives.",
    action: "View alternatives",
  },
  {
    icon: Lightbulb,
    tag: "Tip",
    tagColor: "#f59e0b",
    title: "Ingredient costs reducible by ~18%",
    detail:
      "Vendors near Orussey Market charge 18% less for similar pork cuts on Tuesday mornings.",
    action: "See market tips",
  },
  {
    icon: CheckCircle2,
    tag: "Positive",
    tagColor: "#3ecf8e",
    title: "Transport costs optimized",
    detail:
      "Your TukTuk usage is 32% below average for similar stalls. Keep minimizing transport!",
    action: "Keep it up",
  },
];

const categories: Category[] = [
  {
    name: "Ingredients",
    khmer: "គ្រឿងផ្សំ",
    amount: "$25.00",
    pct: 19,
    color: "emerald",
    icon: ShoppingCart,
  },
  {
    name: "Rent",
    khmer: "ថ្លៃជួល",
    amount: "$80.00",
    pct: 60,
    color: "indigo",
    icon: Home,
  },
  {
    name: "Transport",
    khmer: "ការដឹកជញ្ជូន",
    amount: "$3.50",
    pct: 3,
    color: "violet",
    icon: Car,
  },
  {
    name: "Electricity",
    khmer: "អគ្គិសនី",
    amount: "$15.00",
    pct: 11,
    color: "amber",
    icon: Bolt,
  },
  {
    name: "Labor",
    khmer: "ម្ចាស់ពលកម្ម",
    amount: "$10.00",
    pct: 7,
    color: "red",
    icon: UserCheck,
  },
  {
    name: "Others",
    khmer: "ផ្សេងៗ",
    amount: "$0.00",
    pct: 0,
    color: "slate",
    icon: MoreHorizontal,
  },
];

const forecastItems: ForecastItem[] = [
  {
    category: "Ingredients",
    predicted: "$28.00",
    change: "+12%",
    up: true,
    reason: "Weekend market prices higher",
  },
  {
    category: "Rent",
    predicted: "$80.00",
    change: "0%",
    up: null,
    reason: "Fixed monthly cost",
  },
  {
    category: "Transport",
    predicted: "$5.00",
    change: "+43%",
    up: true,
    reason: "2 extra market trips predicted",
  },
  {
    category: "Electricity",
    predicted: "$17.00",
    change: "+13%",
    up: true,
    reason: "Extended evening hours",
  },
  {
    category: "Labor",
    predicted: "$10.00",
    change: "0%",
    up: null,
    reason: "Regular schedule maintained",
  },
];

const expenseHistory: ExpenseRecord[] = [
  {
    time: "2:15 PM",
    category: "Ingredients",
    note: "Pork and Vegetables",
    amount: 25.0,
    categoryColor: "emerald",
    recurring: false,
    anomaly: "medium",
    anomalyNote: "30% above weekly average",
  },
  {
    time: "10:00 AM",
    category: "Transport",
    note: "TukTuk to market",
    amount: 3.5,
    categoryColor: "violet",
    recurring: false,
    anomaly: "high",
    anomalyNote: "Possible duplicate — logged twice today",
  },
  {
    time: "Yesterday",
    category: "Electricity",
    note: "Weekly stall power",
    amount: 15.0,
    categoryColor: "amber",
    recurring: true,
    anomaly: null,
    anomalyNote: null,
  },
  {
    time: "Yesterday",
    category: "Labor",
    note: "Assistant pay",
    amount: 10.0,
    categoryColor: "red",
    recurring: false,
    anomaly: null,
    anomalyNote: null,
  },
  {
    time: "2 days ago",
    category: "Rent",
    note: "Monthly stall rent",
    amount: 80.0,
    categoryColor: "indigo",
    recurring: true,
    anomaly: null,
    anomalyNote: null,
  },
];

const geminiTips = [
  {
    tip: "Buy ingredients Tuesday 6–8 AM at Orussey Market",
    saving: "Save ~$4.50/week",
    emoji: "🌅",
  },
  {
    tip: "Batch electricity usage — turn off fans after 9 PM",
    saving: "Save ~$2/week",
    emoji: "⚡",
  },
  {
    tip: "Share TukTuk with Stall B41 for shared market runs",
    saving: "Save ~$1.50/trip",
    emoji: "🛺",
  },
];

const TABS: { id: TabId; label: string; khmer: string }[] = [
  { id: "overview", label: "Overview", khmer: "ទិដ្ឋភាពទូទៅ" },
  { id: "recurring", label: "Recurring Detection", khmer: "ចំណាយដដែល" },
  { id: "insights", label: "AI Insights", khmer: "ការវិភាគ AI" },
  { id: "forecast", label: "Forecast", khmer: "ការព្យាករណ៍" },
  { id: "history", label: "Expense History", khmer: "ប្រវត្តិចំណាយ" },
];

const initChat: ChatMsg[] = [
  {
    role: "assistant",
    text: "សួស្តី! I'm your AI Expense Assistant. Ask me anything about your spending patterns or how to cut costs!",
  },
  {
    role: "assistant",
    text: "Try: 'Where am I spending too much?' or 'How can I reduce costs this week?'",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PremiumExpensesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>(initChat);
  const [dismissed, setDismissed] = useState<number[]>([]);

  // Real API states
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Ingredients");
  const [expenseNote, setExpenseNote] = useState("");
  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState(false);
  const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formCategories, setFormCategories] = useState([
    { value: "Ingredients", label: "Ingredients (គ្រឿងផ្សំ)", isCustom: false },
    { value: "Rent", label: "Rent (ថ្លៃជួល)", isCustom: false },
    { value: "Transport", label: "Transport (ការធ្វើដំណើរ)", isCustom: false },
    { value: "Electricity", label: "Electricity (អគ្គិសនី)", isCustom: false },
    { value: "Labor", label: "Labor (កម្លាំងពលកម្ម)", isCustom: false },
    { value: "Others", label: "Others (ផ្សេងៗ)", isCustom: false },
  ]);

  React.useEffect(() => {
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
    fetchExpenses();
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
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setExpenses((prev) => [json.data, ...prev]);
        setExpenseAmount("");
        setExpenseNote("");
        setIsQuickLogModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCustomCategory = () => {
    if (!customCategoryName.trim()) return;
    setFormCategories((prev) => [
      ...prev.slice(0, prev.length - 1),
      { value: customCategoryName, label: customCategoryName, isCustom: true },
      prev[prev.length - 1],
    ]);
    setExpenseCategory(customCategoryName);
    setCustomCategoryName("");
    setShowCustomCategoryModal(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this expense?")) return;
    try {
      const res = await fetch(`/api/vendor/expenses/${id}`, { method: "DELETE" });
      if (res.ok) setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const visibleAlerts = pushAlerts.filter((_, i) => !dismissed.includes(i));

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

  React.useEffect(() => {
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

<<<<<<< HEAD
  const handleDeleteExpense = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this expense?")) return;
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

=======
>>>>>>> d6e65e075a62926dbf0ddbb974c993ff98cc12fd
  const filteredHistory = expenses.filter(
    (e) =>
      (e.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.category || "").toLowerCase().includes(searchQuery.toLowerCase()),
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
  // ── Dynamic Computations ──
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
      // Use expenseDate if available, fallback to createdAt
      const d = new Date(e.expenseDate || e.createdAt);
      
      if (d >= startOfDay) today += amt;
      if (d >= startOfWeek) week += amt;
      if (d >= startOfMonth) month += amt;
      
      const catName = e.category || "Others";
      catMap[catName] = (catMap[catName] || 0) + amt;
    });

    const topCatEntry = Object.entries(catMap).sort(([, a], [, b]) => b - a)[0];
    return {
      today,
      week,
      month,
      topCat: topCatEntry ? topCatEntry[0] : "None",
      catMap
    };
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
          <button 
            onClick={handleExportPDF}
            className="hidden sm:flex items-center gap-1.5 bg-[#0d1117] dark:bg-white hover:opacity-90 text-white dark:text-[#111827] font-semibold px-3.5 py-2 rounded-[10px] text-sm transition-colors border-0 cursor-pointer"
          >
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button 
            onClick={handleExportExcel}
            className="hidden sm:flex items-center gap-1.5 bg-white dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 hover:bg-[#f0f2f5] dark:hover:bg-white/5 text-[#111827] dark:text-white font-semibold px-3.5 py-2 rounded-[10px] text-sm transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#3ecf8e] text-white font-bold px-3.5 py-2 rounded-[10px] text-sm hover:opacity-90 transition-opacity cursor-pointer border-0"
          >
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
          header, 
          nav, 
          aside, 
          .fixed, 
          button,
          .no-print { 
            display: none !important; 
          }
          main, .flex-1 {
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            height: auto !important;
          }
          .overflow-y-auto {
            overflow: visible !important;
            height: auto !important;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
          .dark {
            --tw-bg-opacity: 1 !important;
            background-color: white !important;
          }
          .dark * {
            color: black !important;
            border-color: #ddd !important;
          }
        }
      `}} />
      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-5 transition-colors">
        {/* ── Page header ── */}
        <div className="pt-1 pb-1">
          <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">
            My Expenses
          </h2>
          <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
            Track and manage your spending ·{" "}
            <span className="text-[#9ca3af] dark:text-[#4d5562]">
              តាមដាន និងគ្រប់គ្រងចំណាយ
            </span>
          </p>
        </div>



        {/* ── Summary Cards (VendorSummaryCard) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <VendorSummaryCard
            variant="dark"
            title="Today's Expenses"
            khmerTitle="ចំណាយថ្ងៃនេះ"
            value={`$${stats.today.toFixed(2)}`}
            subtext={`${expenses.filter(e => new Date(e.createdAt) >= startOfDay).length} transactions`}
          />
          <VendorSummaryCard
            title="Top Category"
            khmerTitle="ប្រភេទទូទៅ"
            value={stats.topCat}
            subtext="🏷️ Highest Spending"
          />
          <VendorSummaryCard
            variant="green"
            title="Weekly Expenses"
            khmerTitle="ចំណាយប្រចាំសប្តាហ៍"
            value={`$${stats.week.toFixed(2)}`}
            subtext="this week"
          />
          <VendorSummaryCard
            title="Monthly Total"
            khmerTitle="សរុបប្រចាំខែ"
<<<<<<< HEAD
            value={`$${stats.month.toFixed(2)}`}
=======
            value={`$${expenses.reduce((s, e) => s + parseFloat(e.amount || "0"), 0).toFixed(2)}`}
>>>>>>> d6e65e075a62926dbf0ddbb974c993ff98cc12fd
            subtext="this month"
          />
          <VendorSummaryCard
            title="AI Savings"
            khmerTitle="ការសន្សំ"
            value={aiLoading ? "..." : `$${aiSavings.potentialSavings.toFixed(2)}`}
            icon={Brain}
            subtext="potential/week"
          />
        </div>

        {/* ── Tabs ── */}
        {/* FIXED: Dark mode border and text colors for tabs */}
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
              <span className="text-[10px] text-[#9ca3af] dark:text-[#6b7280]">
                {tab.khmer}
              </span>
            </button>
          ))}
        </div>

        {/* ══ OVERVIEW ══ */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* AI Intelligence Banner */}
            <div className="bg-[#0d1117] border border-white/[0.06] rounded-[14px] px-[26px] py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[rgba(62,207,142,0.12)] rounded-[11px]">
                  <Brain className="w-5 h-5 text-[#3ecf8e]" />
                </div>
                <div>
                  <div className="text-[16px] font-bold text-[#e6edf3]">
                    AI Expense Intelligence Active
                  </div>
                  <div className="text-[12px] text-[#7d8590] mt-0.5">
                    Anomaly detection · Recurring patterns · Cost optimization ·
                    Gemini insights
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[rgba(62,207,142,0.1)] border border-[rgba(62,207,142,0.2)] px-4 py-2 rounded-[10px] text-[#3ecf8e] shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[13px] font-semibold">
                  Premium Active
                </span>
              </div>
            </div>

            {/* Smart Alerts */}
            {visibleAlerts.length > 0 && (
              <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] overflow-hidden shadow-sm transition-colors">
                <div className="px-6 py-4 border-b border-[#f0f2f5] dark:border-white/5 flex items-center justify-between transition-colors">
                  <div className="font-semibold text-[15px] text-[#111827] dark:text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#f59e0b]" /> Smart
                    Alerts
                  </div>
                  <span className="text-[11px] font-bold text-[#9ca3af] dark:text-[#7d8590] uppercase tracking-wider">
                    {visibleAlerts.length} Action
                    {visibleAlerts.length > 1 ? "s" : ""} required
                  </span>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  {visibleAlerts.map((alert, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/5 rounded-[12px] transition-colors"
                    >
                      <div className="p-2 bg-white dark:bg-[#0d1117] rounded-[10px] shadow-sm shrink-0 border dark:border-white/5">
                        <alert.icon className="w-4 h-4 text-[#f59e0b]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="font-bold text-[13.5px] text-[#111827] dark:text-white">
                            {alert.title}
                          </p>
                          <span className="text-[11px] text-[#9ca3af] dark:text-[#7d8590]">
                            {alert.time}
                          </span>
                        </div>
                        <p className="text-[12.5px] text-[#6b7280] dark:text-[#7d8590] leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                      <button
                        onClick={() => setDismissed([...dismissed, i])}
                        className="text-[#9ca3af] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white hover:bg-[#e8eaed] dark:hover:bg-white/10 p-1.5 rounded-[8px] transition-colors border-0 cursor-pointer bg-transparent"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Category Breakdown */}
              <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] shadow-sm transition-colors">
                <div className="px-6 py-5 border-b border-[#f0f2f5] dark:border-white/5 transition-colors">
                  <h3 className="font-bold text-[16px] text-[#111827] dark:text-white">
                    Spending by Category
                  </h3>
                  <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">
                    ការចំណាយតាមប្រភេទ
                  </p>
                </div>
                <div className="p-[22px] flex flex-col gap-[22px]">
                  {dynamicCategories.map((cat, i) => {
                    const c = catColorMap[cat.color];
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <div
                          className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${c.iconBg} ${c.iconText}`}
                        >
                          <cat.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] font-semibold text-[#111827] dark:text-white">
                                {cat.name}
                              </span>
                              <span className="text-[10px] text-[#9ca3af] dark:text-[#7d8590]">
                                {cat.khmer}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[12.5px] font-bold text-[#111827] dark:text-white">
                                {cat.amount}
                              </span>
                              <span className="text-[11px] text-[#9ca3af] dark:text-[#7d8590]">
                                {cat.pct}%
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-[6px] bg-[#f0f2f5] dark:bg-white/5 rounded-full overflow-hidden transition-colors">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${cat.pct}%`,
                                background: c.bar,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gemini Optimization Panel */}
              <div className="bg-[#0d1117] border border-white/[0.06] rounded-[14px] px-[26px] py-[22px] transition-colors">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-[rgba(139,92,246,0.15)] rounded-[9px]">
                    <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#e6edf3]">
                      Gemini Cost Optimization
                    </div>
                    <div className="text-[11px] text-[#7d8590] mt-0.5">
                      គន្លឹះកាត់បន្ថយថ្លៃដើម · Powered by Gemini AI
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {geminiTips.map((tip, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-white/[0.04] border border-white/[0.07] rounded-[11px] hover:bg-white/[0.07] transition-colors cursor-pointer"
                    >
                      <span className="text-2xl shrink-0">{tip.emoji}</span>
                      <div>
                        <p className="text-[13px] font-semibold text-[#e6edf3] leading-snug">
                          {tip.tip}
                        </p>
                        <p className="text-[12px] font-bold text-[#3ecf8e] mt-1.5">
                          {tip.saving}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-white/[0.04] border border-white/[0.07] rounded-[10px]">
                  <p className="text-[12px] text-[#7d8590]">
                    <strong className="text-[#e6edf3]">
                      Estimated Monthly Savings:
                    </strong>{" "}
                    Implementing these could save you{" "}
                    <span className="text-[#3ecf8e] font-bold">~$32.00</span>{" "}
                    per month.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ RECURRING DETECTION ══ */}
        {activeTab === "recurring" && (
          <div className="space-y-5">
            <div className="bg-gradient-to-r from-[rgba(139,92,246,0.06)] to-[rgba(62,207,142,0.06)] dark:from-[rgba(139,92,246,0.1)] dark:to-[rgba(62,207,142,0.1)] p-5 rounded-[14px] border border-[rgba(139,92,246,0.15)] dark:border-[rgba(139,92,246,0.2)] flex items-start gap-3 transition-colors">
              <RefreshCw className="w-5 h-5 text-[#8b5cf6] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-[15px] text-[#111827] dark:text-white">
                  AI Recurring Expense Detection
                </h3>
                <p className="text-[13px] text-[#6b7280] dark:text-[#7d8590] mt-1 leading-relaxed">
                  The system noticed you log these expenses regularly. We've
                  auto-categorized them as recurring so you can track your fixed
                  costs easier.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recurringItems.map((item, i) => {
                const c = catColorMap[item.color];
                return (
                  <div
                    key={i}
                    className={`p-5 rounded-[14px] border ${c.recurBorder} ${c.recurBg} transition-colors`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-[15px] text-[#111827] dark:text-white">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">
                          {item.khmer}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${c.badge}`}
                      >
                        {item.frequency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
                      <div>
                        <p className="text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-wider mb-0.5">
                          Estimated Cost
                        </p>
                        <p className="text-[16px] font-extrabold text-[#111827] dark:text-white">
                          {item.amount}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-wider mb-0.5">
                          Next Expected
                        </p>
                        <p className="text-[13.5px] font-semibold text-[#111827] dark:text-white">
                          {item.nextDue}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ AI INSIGHTS ══ */}
        {activeTab === "insights" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {aiInsights.map((ins, i) => {
              const Icon = ins.icon;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] p-[22px] shadow-sm flex flex-col transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-[11px] flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${ins.tagColor}15`,
                        color: ins.tagColor,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className="px-2.5 py-1 text-[10px] font-bold rounded-full border"
                      style={{
                        backgroundColor: `${ins.tagColor}10`,
                        color: ins.tagColor,
                        borderColor: `${ins.tagColor}25`,
                      }}
                    >
                      {ins.tag}
                    </span>
                  </div>
                  <h4 className="font-bold text-[15px] text-[#111827] dark:text-white leading-snug mb-2">
                    {ins.title}
                  </h4>
                  <p className="text-[13px] text-[#6b7280] dark:text-[#7d8590] leading-relaxed flex-1">
                    {ins.detail}
                  </p>
                  <button className="mt-4 text-[12px] font-semibold px-3 py-1.5 rounded-[8px] bg-[#f0f2f5] dark:bg-[#161B22] text-[#6b7280] dark:text-[#7d8590] hover:bg-[#e8eaed] dark:hover:bg-white/5 border border-transparent dark:border-white/5 cursor-pointer transition-colors w-fit">
                    {ins.action} →
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ FORECAST ══ */}
        {activeTab === "forecast" && (
          <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] overflow-hidden shadow-sm transition-colors">
            <div className="px-[26px] py-[18px] border-b border-[#f0f2f5] dark:border-white/5 flex items-center justify-between transition-colors">
              <div>
                <div className="text-[14px] font-semibold text-[#111827] dark:text-white">
                  AI Expense Forecast — Next 7 Days
                </div>
                <div className="text-[11px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">
                  ការព្យាករណ៍ចំណាយ · Predicted total:{" "}
                  <strong className="text-[#3ecf8e]">$175.00</strong> · 89%
                  confident
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[rgba(62,207,142,0.1)] text-[#3ecf8e] text-[10px] font-bold rounded-full border border-[rgba(62,207,142,0.2)]">
                <Brain className="w-2.5 h-2.5" /> AI
              </span>
            </div>
            <div className="p-[22px]">
              {/* Bar chart */}
              <div className="flex items-end gap-2 h-28 mb-4">
                {weeklyChartData.map((h, i) => {
                  const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i];
                  const isToday = i === (now.getDay() + 6) % 7;
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1.5"
                    >
                      <div
                        className="w-full relative rounded-t-[6px] transition-colors"
                        style={{
                          height: "96px",
                          background: isToday ? "rgba(62,207,142,0.15)" : "",
                        }}
                      >
                        <div
                          className={`absolute bottom-0 w-full rounded-t-[6px] ${isToday ? "bg-[#3ecf8e]" : "bg-[#d1d5db] dark:bg-white/10"}`}
                          style={{ height: `${(h / maxWeekly) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[#9ca3af] dark:text-[#7d8590]">
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 mt-6">
                {forecastItems.map((fi, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-[#f7f8fa] dark:bg-[#161B22] rounded-[10px] border border-[#f0f2f5] dark:border-white/5 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-[13.5px] font-semibold text-[#111827] dark:text-white">
                        {fi.category}
                      </p>
                      <p className="text-[11.5px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">
                        {fi.reason}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-bold text-[#111827] dark:text-white">
                        {fi.predicted}
                      </p>
                      <span
                        className={`text-[11px] font-bold flex items-center justify-end gap-0.5 ${fi.up === true ? "text-[#ef4444]" : fi.up === false ? "text-[#3ecf8e]" : "text-[#9ca3af] dark:text-[#7d8590]"}`}
                      >
                        {fi.up === true && <TrendingUp className="w-3 h-3" />}
                        {fi.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ HISTORY ══ */}
        {activeTab === "history" && (
          <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] overflow-hidden shadow-sm transition-colors">
            <div className="px-[20px] py-[16px] border-b border-[#f0f2f5] dark:border-white/5 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-2.5 px-3 py-2 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[10px] transition-colors group focus-within:border-[#3ecf8e] w-64">
                <Search className="w-4 h-4 text-[#9ca3af] dark:text-[#7d8590] group-focus-within:text-[#3ecf8e] transition-colors" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-[13px] text-[#111827] dark:text-white w-full placeholder:text-[#9ca3af]"
                />
              </div>
              <button className="p-2 border border-[#e8eaed] dark:border-white/10 rounded-[10px] text-[#6b7280] dark:text-[#7d8590] hover:bg-[#f0f2f5] dark:hover:bg-white/5 transition-colors bg-white dark:bg-[#161B22] cursor-pointer">
                <Filter className="w-4 h-4" />
              </button>
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
<<<<<<< HEAD
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-[20px] py-12 text-center text-[#9ca3af]">Loading…</td>
                    </tr>
                  ) : filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-[20px] py-12 text-center text-[#9ca3af]">No expenses found.</td>
                    </tr>
                  ) : (
                    filteredHistory.map((exp, i) => {
                      const c = Object.keys(catColorMap).includes(exp.categoryColor) ? catColorMap[exp.categoryColor as CatColor] : catColorMap["slate"];
                      return (
                        <tr
                          key={exp.id || i}
                          className="group transition-colors hover:bg-[#f7f8fa] dark:hover:bg-white/5 cursor-pointer"
                        >
                          <td className="px-[20px] py-[14px]">
                            <div className="flex flex-col gap-1.5 text-[13px] text-[#6b7280] dark:text-[#7d8590]">
                              <span className="font-medium text-[#111827] dark:text-white flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {new Date(exp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <span className="text-[11px]">{new Date(exp.createdAt).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="px-[20px] py-[14px]">
                            <span
                              className={`inline-flex px-2.5 py-[3px] rounded-full text-[11.5px] font-semibold border ${Object.keys(catColorMap).includes(exp.category) ? catColorMap[exp.category as CatColor]?.badge : catColorMap["slate"].badge}`}
                            >
                              {exp.category || "Uncategorized"}
                            </span>
                          </td>
                          <td className="px-[20px] py-[14px] text-[13px] font-medium text-[#111827] dark:text-white">
                            {exp.description || "None"}
                          </td>
                          <td className="px-[20px] py-[14px]">
                            <button onClick={(e) => handleDeleteExpense(exp.id, e)} className="p-1.5 text-[#9ca3af] hover:text-[#ef4444] rounded-lg hover:bg-[#fef2f2] dark:hover:bg-red-500/10 transition-colors border-0 bg-transparent cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="px-[20px] py-[14px] text-right">
                            <span className="text-[14px] font-bold text-[#ef4444]">
                              -${parseFloat(exp.amount || "0").toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
=======
                  {filteredHistory.map((exp, i) => {
                    const c = catColorMap[exp.categoryColor?.toLowerCase() as CatColor] || catColorMap["slate"];
                    return (
                      <tr
                        key={exp.id || i}
                        className="group transition-colors hover:bg-[#f7f8fa] dark:hover:bg-white/5 cursor-pointer"
                      >
                        <td className="px-[20px] py-[14px]">
                          <div className="flex items-center gap-1.5 text-[13px] text-[#6b7280] dark:text-[#7d8590]">
                            {exp.date ? new Date(exp.date).toLocaleDateString() : "Just now"}
                          </div>
                        </td>
                        <td className="px-[20px] py-[14px]">
                          <span
                            className={`inline-flex px-2.5 py-[3px] rounded-full text-[11.5px] font-semibold ${c.badge}`}
                          >
                            {exp.category}
                          </span>
                        </td>
                        <td className="px-[20px] py-[14px] text-[13px] font-medium text-[#111827] dark:text-white">
                          {exp.description || "-"}
                        </td>
                        <td className="px-[20px] py-[14px]">
                          <span className="text-[12px] text-[#d1d5db] dark:text-[#4d5562]">
                            —
                          </span>
                        </td>
                        <td className="px-[20px] py-[14px] text-right flex items-center justify-end gap-3">
                          <span className="text-[14px] font-bold text-[#111827] dark:text-white">
                            ${parseFloat(exp.amount || 0).toFixed(2)}
                          </span>
                          <button
                           onClick={(e) => handleDelete(exp.id, e)}
                           className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                           title="Delete Expense"
                          >
                           <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
>>>>>>> d6e65e075a62926dbf0ddbb974c993ff98cc12fd
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

<<<<<<< HEAD
      {isQuickLogModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0d1117]/60 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setIsQuickLogModalOpen(false)}></div>
          <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsQuickLogModalOpen(false)}
              className="absolute top-5 right-5 text-[#9ca3af] hover:text-[#111827] hover:bg-[#f0f2f5] dark:hover:bg-white/10 p-1.5 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex items-center gap-2">
              <div className="p-2 bg-[rgba(62,207,142,0.1)] text-[#3ecf8e] rounded-lg">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-[22px] text-[#111827] dark:text-white">Log New Expense</h2>
                <p className="text-sm text-[#6b7280] dark:text-[#7d8590] mt-1">កត់ត្រាចំណាយថ្មី</p>
              </div>
            </div>
            <form onSubmit={handleQuickLog} className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CircleDollarSign className="h-6 w-6 text-[#9ca3af] group-focus-within:text-[#ef4444] transition-colors" />
                  </div>
                  <input type="number" step="0.01" placeholder="0.00" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} required className="block w-full pl-12 pr-4 py-4 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-xl text-[#111827] dark:text-white text-xl font-bold placeholder-[#9ca3af] dark:placeholder-[#7d8590] focus:bg-white dark:focus:bg-[#0d1117] focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] outline-none transition-all min-h-[60px]" />
                  <div className="absolute top-[-10px] left-4 bg-white dark:bg-[#0d1117] px-1 text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590]">Amount <span className="text-[#ef4444]">*</span></div>
                </div>
                <div className="relative group">
                  <select value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} className="block w-full px-4 py-4 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-xl text-[#111827] dark:text-white text-[15px] font-medium focus:bg-white dark:focus:bg-[#0d1117] focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] outline-none transition-all min-h-[60px] cursor-pointer">
                    {categoriesList.map((cat, idx) => (
                      <option key={idx} value={cat.name}>{cat.name} ({cat.khmer})</option>
                    ))}
                  </select>
                  <div className="absolute top-[-10px] left-4 bg-white dark:bg-[#0d1117] px-1 text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590] flex items-center gap-2">
                    Category
                    <button type="button" onClick={() => setShowCustomCategoryModal(true)} className="text-[#3ecf8e] text-[10px] hover:underline border-0 bg-transparent cursor-pointer">+ Custom</button>
                  </div>
                </div>
                <div className="relative mt-2">
                  <input type="text" placeholder="What was this for? (Optional)" value={expenseNote} onChange={(e) => setExpenseNote(e.target.value)} className="block w-full px-4 py-4 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-xl text-[#111827] dark:text-white text-[15px] placeholder-[#9ca3af] dark:placeholder-[#7d8590] focus:bg-white dark:focus:bg-[#0d1117] focus:border-[#3ecf8e] outline-none transition-all min-h-[60px]" />
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setIsQuickLogModalOpen(false)} className="flex-1 bg-[#f0f2f5] dark:bg-white/5 hover:bg-[#e8eaed] dark:hover:bg-white/10 text-[#374151] dark:text-white font-bold text-[16px] py-4 rounded-xl transition-all min-h-[56px] border-0 cursor-pointer">Cancel</button>
                  <button type="submit" disabled={!expenseAmount} className="flex-[2] bg-gradient-to-r from-[#8b5cf6] to-[#3ecf8e] hover:opacity-90 text-white font-bold text-[16px] py-4 rounded-xl transition-all flex items-center justify-center gap-2 min-h-[56px] border-0 cursor-pointer disabled:opacity-60"><Plus className="w-5 h-5" /> <span>Save Expense</span></button>
                </div>
              </div>
=======
      {/* ── MODALS ── */}
      {isQuickLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#161B22] p-8 rounded-[24px] shadow-xl w-full max-w-md border border-slate-200 dark:border-white/10 relative">
            <button
              onClick={() => setIsQuickLogModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-500 transition-colors border-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-extrabold text-[22px] text-slate-900 dark:text-white mb-6">Add New Expense</h3>
            <form onSubmit={handleQuickLog} className="space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-[#7d8590] mb-2">Category ប្រភេទ</label>
                <div className="flex gap-2">
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm outline-none focus:border-psar-primary transition-colors appearance-none font-medium"
                  >
                    {formCategories.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCustomCategoryModal(true)}
                    className="bg-psar-primary/10 text-psar-primary hover:bg-psar-primary hover:text-white border-0 px-4 rounded-xl transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                    title="Add Custom Category"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-[#7d8590] mb-2">Amount ($) ចំនួនទឹកប្រាក់</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm outline-none focus:border-psar-primary transition-colors font-medium placeholder:text-slate-400"
                  placeholder="e.g. 15.00"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-[#7d8590] mb-2">Note ភាគីយោង (Optional)</label>
                <input
                  type="text"
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm outline-none focus:border-psar-primary transition-colors font-medium placeholder:text-slate-400"
                  placeholder="What was this for?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-psar-primary hover:bg-psar-primary/90 text-white font-bold text-[15px] py-4 rounded-xl shadow-[0_4px_20px_rgba(62,207,142,0.25)] transition-all cursor-pointer border-0 mt-2"
              >
                Log Expense
              </button>
>>>>>>> d6e65e075a62926dbf0ddbb974c993ff98cc12fd
            </form>
          </div>
        </div>
      )}

<<<<<<< HEAD
      {/* CUSTOM CATEGORY MODAL */}
      {showCustomCategoryModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0d1117]/60 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setShowCustomCategoryModal(false)}></div>
          <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowCustomCategoryModal(false)} className="absolute top-4 right-4 text-[#9ca3af] hover:text-[#e6edf3] p-1.5 rounded-lg hover:bg-white/10 transition-colors border-0 bg-transparent cursor-pointer"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-2 mb-5">
              <div className="p-2 bg-[rgba(62,207,142,0.1)] text-[#3ecf8e] rounded-lg"><Tag className="w-5 h-5" /></div>
              <div>
                <h3 className="font-bold text-[18px] text-[#111827] dark:text-white">Add Custom Category</h3>
                <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590]">Create a personalized expense tag.</p>
              </div>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="e.g., Shop Decor" value={customCategoryName} onChange={(e) => setCustomCategoryName(e.target.value)} className="w-full px-4 py-3 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-xl text-[14px] focus:border-[#3ecf8e] outline-none transition-all text-[#111827] dark:text-white" autoFocus />
              <button onClick={handleCreateCustomCategory} className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#3ecf8e] hover:opacity-90 text-white font-bold py-3 rounded-xl transition-colors border-0 cursor-pointer">Create Category</button>
=======
      {showCustomCategoryModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#161B22] p-8 rounded-[24px] shadow-xl w-full max-w-sm border border-slate-200 dark:border-white/10">
            <h3 className="font-extrabold text-[20px] text-slate-900 dark:text-white mb-2">New Custom Category</h3>
            <p className="text-sm text-slate-500 mb-6">Create a specific tracking category</p>
            <input
              autoFocus
              value={customCategoryName}
              onChange={(e) => setCustomCategoryName(e.target.value)}
              placeholder="e.g. Meta Ads, Cleaning..."
              className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm outline-none focus:border-psar-primary transition-colors font-medium mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowCustomCategoryModal(false); setCustomCategoryName(""); }}
                className="flex-1 py-3.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white font-bold rounded-xl transition-colors border-0 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomCategory}
                className="flex-1 py-3.5 bg-psar-primary hover:bg-psar-primary/90 text-white font-bold rounded-xl transition-colors border-0 cursor-pointer"
              >
                Create
              </button>
>>>>>>> d6e65e075a62926dbf0ddbb974c993ff98cc12fd
            </div>
          </div>
        </div>
      )}

      {/* ══ AI Chatbot FAB ══ */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] rounded-full shadow-[0_8px_32px_rgba(139,92,246,0.4)] flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer border-0"
        >
          <MessageSquare size={22} />
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] bg-white dark:bg-[#0d1117] rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.2)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.5)] border border-[#e8eaed] dark:border-white/10 flex flex-col overflow-hidden transition-colors">
          <div className="px-5 py-4 bg-[#0d1117] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] rounded-full flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-[13.5px] text-[#e6edf3]">
                  Expense Assistant
                </p>
                <p className="text-[11px] text-[#4d5562]">
                  Online · Analyzing costs
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
          <div
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#f7f8fa] dark:bg-[#161B22] transition-colors"
            style={{ minHeight: "260px" }}
          >
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-[14px] text-[13px] leading-relaxed transition-colors ${
                    msg.role === "user"
                      ? "bg-[#0d1117] dark:bg-gradient-to-r dark:from-[#8b5cf6] dark:to-[#3ecf8e] text-[#e6edf3] dark:text-white rounded-br-[4px]"
                      : "bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 text-[#374151] dark:text-[#e6edf3] rounded-bl-[4px] shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[#e8eaed] dark:border-white/10 bg-white dark:bg-[#0d1117] transition-colors">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about your expenses..."
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 px-4 py-2.5 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[10px] text-[13px] outline-none text-[#111827] dark:text-white focus:border-[#3ecf8e] dark:focus:border-[#3ecf8e] transition-colors placeholder-[#9ca3af] dark:placeholder-[#7d8590]"
              />
              <button
                onClick={handleSend}
                className="p-2.5 bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] text-white rounded-[10px] border-0 cursor-pointer hover:opacity-90"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </VendorDashboardLayout>
  );
}
