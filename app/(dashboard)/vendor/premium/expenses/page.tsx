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
  ArrowUpRight,
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
} from "lucide-react";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { useLanguage } from "@/components/providers/LanguageProvider";

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
  khmerTitle: string;
  message: string;
  khmerMessage: string;
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
  khmerNote: string;
  amount: number;
  categoryColor: CatColor;
  recurring: boolean;
  anomaly: AnomalyFlag;
  anomalyNote: string | null;
  khmerAnomalyNote: string | null;
}
interface ForecastItem {
  category: string;
  predicted: string;
  change: string;
  up: boolean | null;
  reason: string;
  khmerReason: string;
}

// ─── Color Map ────────────────────────────────────────────────────────────────
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
    khmerTitle: "ថ្លៃគ្រឿងផ្សំកើនឡើង ៣០%",
    icon: TrendingUp,
    message: "Pork & vegetables spending jumped 30% vs last week. Likely linked to market price surge — review supplier pricing.",
    khmerMessage: "ការចំណាយលើសាច់ជ្រូក និងបន្លែបានកើនឡើង ៣០% ធៀបនឹងសប្តាហ៍មុន។ ប្រហែលជាមានទំនាក់ទំនងនឹងការឡើងថ្លៃទីផ្សារ - សូមពិនិត្យមើលតម្លៃអ្នកផ្គត់ផ្គង់។",
    time: "2 hours ago",
  },
  {
    title: "Unusual Spending Detected",
    khmerTitle: "រកឃើញការចំណាយមិនប្រក្រតី",
    icon: AlertTriangle,
    message: "Transport costs logged twice today ($0.02 total) — AI flagged this as a possible duplicate entry. Please review.",
    khmerMessage: "ថ្លៃដឹកជញ្ជូនបានកត់ត្រាពីរដងនៅថ្ងៃនេះ - AI បានសម្គាល់ថានេះអាចជាការបញ្ចូលស្ទួន។ សូមពិនិត្យឡើងវិញ។",
    time: "45 min ago",
  },
  {
    title: "Budget Tip: Rainy Evening",
    khmerTitle: "គន្លឹះថវិកា៖ ល្ងាចមានភ្លៀង",
    icon: CloudSun,
    message: "Rainy evening predicted — Hot Latte demand rising. Consider increasing ingredient budget by 15% for tomorrow.",
    khmerMessage: "ព្យាករណ៍ថាមានភ្លៀងនៅពេលល្ងាច - តម្រូវការឡាតេក្តៅកំពុងកើនឡើង។ ពិចារណាបង្កើនថវិកាគ្រឿងផ្សំ ១៥% សម្រាប់ថ្ងៃស្អែក។",
    time: "30 min ago",
  },
];

const recurringItems: RecurringItem[] = [
  {
    name: "Monthly Stall Rent",
    khmer: "ថ្លៃជួលតូបប្រចាំខែ",
    amount: "$80.00",
    frequency: "Monthly",
    nextDue: "Nov 1",
    color: "indigo",
  },
  {
    name: "Weekly Electricity",
    khmer: "ថ្លៃអគ្គិសនីប្រចាំសប្តាហ៍",
    amount: "$15.00",
    frequency: "Weekly",
    nextDue: "Oct 29",
    color: "amber",
  },
  {
    name: "Assistant Pay",
    khmer: "ថ្លៃឈ្នួលជំនួយការ",
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
    khmerTag: "ការព្រមាន",
    tagColor: "#ef4444",
    title: "Rent is 60% of expenses",
    khmerTitle: "ថ្លៃជួលមាន ៦០% នៃចំណាយសរុប",
    detail: "Above the healthy 40% threshold for market stalls. Consider renegotiating or finding lower-cost alternatives.",
    khmerDetail: "លើសពីកម្រិតសុខភាព ៤០% សម្រាប់តូបលក់ក្នុងផ្សារ។ ពិចារណាចរចាឡើងវិញ ឬស្វែងរកជម្រើសផ្សេងដែលមានតម្លៃទាបជាង។",
    action: "View alternatives",
  },
  {
    icon: Lightbulb,
    tag: "Tip",
    khmerTag: "គន្លឹះ",
    tagColor: "#f59e0b",
    title: "Ingredient costs reducible by ~18%",
    khmerTitle: "ថ្លៃគ្រឿងផ្សំអាចកាត់បន្ថយបានប្រហែល ១៨%",
    detail: "Vendors near Orussey Market charge 18% less for similar pork cuts on Tuesday mornings.",
    khmerDetail: "អាជីវករដែលនៅជិតផ្សារអូរឫស្សី លក់សាច់ជ្រូកធូរថ្លៃជាង ១៨% នៅព្រឹកថ្ងៃអង្គារ។",
    action: "See market tips",
  },
  {
    icon: CheckCircle2,
    tag: "Positive",
    khmerTag: "វិជ្ជមាន",
    tagColor: "#3ecf8e",
    title: "Transport costs optimized",
    khmerTitle: "ថ្លៃដឹកជញ្ជូនត្រូវបានធ្វើឱ្យប្រសើរឡើង",
    detail: "Your TukTuk usage is 32% below average for similar stalls. Keep minimizing transport!",
    khmerDetail: "ការប្រើប្រាស់ទុករ៉ឺម៉ករបស់អ្នកគឺទាបជាងមធ្យមភាគ ៣២% បើធៀបនឹងតូបស្រដៀងគ្នា។ បន្តកាត់បន្ថយការដឹកជញ្ជូន!",
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
    khmerReason: "តម្លៃទីផ្សារចុងសប្តាហ៍នឹងឡើងខ្ពស់ជាងមុន",
  },
  {
    category: "Rent",
    predicted: "$80.00",
    change: "0%",
    up: null,
    reason: "Fixed monthly cost",
    khmerReason: "ថ្លៃជួលថេរប្រចាំខែ",
  },
  {
    category: "Transport",
    predicted: "$5.00",
    change: "+43%",
    up: true,
    reason: "2 extra market trips predicted",
    khmerReason: "ព្យាករណ៍ថាមានការធ្វើដំណើរទៅផ្សារបន្ថែម ២ ដង",
  },
  {
    category: "Electricity",
    predicted: "$17.00",
    change: "+13%",
    up: true,
    reason: "Extended evening hours",
    khmerReason: "បន្ថែមម៉ោងលក់នៅពេលល្ងាច",
  },
  {
    category: "Labor",
    predicted: "$10.00",
    change: "0%",
    up: null,
    reason: "Regular schedule maintained",
    khmerReason: "កាលវិភាគការងារនៅដដែល",
  },
];

const expenseHistory: ExpenseRecord[] = [
  {
    time: "2:15 PM",
    category: "Ingredients",
    note: "Pork and Vegetables",
    khmerNote: "សាច់ជ្រូក និងបន្លែ",
    amount: 25.0,
    categoryColor: "emerald",
    recurring: false,
    anomaly: "medium",
    anomalyNote: "30% above weekly average",
    khmerAnomalyNote: "ខ្ពស់ជាងមធ្យមភាគប្រចាំសប្តាហ៍ ៣០%",
  },
  {
    time: "10:00 AM",
    category: "Transport",
    note: "TukTuk to market",
    khmerNote: "មធ្យោបាយដឹកជញ្ជូនទៅផ្សារ",
    amount: 3.5,
    categoryColor: "violet",
    recurring: false,
    anomaly: "high",
    anomalyNote: "Possible duplicate — logged twice today",
    khmerAnomalyNote: "ប្រហែលជាការបញ្ចូលស្ទួន - កត់ត្រា ២ ដងនៅថ្ងៃនេះ",
  },
  // ... more items
];

const geminiTips = [
  {
    tip: "Buy ingredients Tuesday 6–8 AM at Orussey Market",
    khmerTip: "ទិញគ្រឿងផ្សំនៅព្រឹកថ្ងៃអង្គារ ម៉ោង ៦-៨ នៅផ្សារអូរឫស្សី",
    saving: "Save ~$4.50/week",
    emoji: "🌅",
  },
  {
    tip: "Batch electricity usage — turn off fans after 9 PM",
    khmerTip: "កាត់បន្ថយការប្រើអគ្គិសនី - បិទកង្ហារក្រោយម៉ោង ៩ យប់",
    saving: "Save ~$2/week",
    emoji: "⚡",
  },
  {
    tip: "Share TukTuk with Stall B41 for shared market runs",
    khmerTip: "ធ្វើដំណើររួមគ្នាជាមួយតូបលក់ B41 ដើម្បីចែករំលែកថ្លៃដឹកជញ្ជូន",
    saving: "Save ~$1.50/trip",
    emoji: "🛺",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PremiumExpensesPage() {
  const { t, language } = useLanguage();
  const isKhmer = language === 'km';
  
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [dismissed, setDismissed] = useState<number[]>([]);

  // Init chat inside component to use translations
  React.useEffect(() => {
    setChatMessages([
      {
        role: "assistant",
        text: isKhmer 
          ? "សួស្តី! ខ្ញុំជាជំនួយការចំណាយ AI របស់អ្នក។ សួរខ្ញុំនូវអ្វីដែលទាក់ទងនឹងការចំណាយរបស់អ្នក!" 
          : "សួស្តី! I'm your AI Expense Assistant. Ask me anything about your spending patterns or how to cut costs!",
      },
      {
        role: "assistant",
        text: isKhmer 
          ? "សាកសួរ៖ 'តើខ្ញុំចំណាយច្រើនពេកនៅកន្លែងណា?' ឬ 'តើខ្ញុំអាចកាត់បន្ថយចំណាយក្នុងសប្តាហ៍នេះដោយរបៀបណា?'" 
          : "Try: 'Where am I spending too much?' or 'How can I reduce costs this week?'",
      },
    ]);
  }, [isKhmer]);

  const visibleAlerts = pushAlerts.filter((_, i) => !dismissed.includes(i));

  const handleSend = () => {
    if (!chatMsg.trim()) return;
    setChatMessages((p) => [...p, { role: "user", text: chatMsg }]);
    setChatMsg("");
    setTimeout(
      () =>
        setChatMessages((p) => [
          ...p,
          {
            role: "assistant",
            text: isKhmer 
              ? "យោងតាមទិន្នន័យរបស់អ្នក ថ្លៃជួល ៦០% គឺជាកង្វល់ធំបំផុត។ ខ្ញុំសូមណែនាំឱ្យចរចាជាមួយម្ចាស់តូបសម្រាប់ការបញ្ចុះតម្លៃ ១០% ។ ចង់ឱ្យខ្ញុំព្រាងចំណាំសម្រាប់ការចរចាដែរឬទេ?"
              : "Based on your data, Rent at 60% is your biggest concern. I'd suggest approaching your landlord about a 10% reduction — similar stalls in the same market pay $72/month on average. Want me to draft a negotiation note?",
          },
        ]),
      900,
    );
  };

  const filteredHistory = expenseHistory.filter(
    (e) =>
      e.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const TABS: { id: TabId; label: string; khmer: string }[] = [
    { id: "overview", label: t("dashboard.tabs.overview") || "Overview", khmer: "ទិដ្ឋភាពទូទៅ" },
    { id: "recurring", label: t("dashboard.tabs.recurring") || "Recurring Detection", khmer: "ចំណាយដដែល" },
    { id: "insights", label: t("dashboard.tabs.insights") || "AI Insights", khmer: "ការវិភាគ AI" },
    { id: "forecast", label: t("dashboard.tabs.forecast") || "Forecast", khmer: "ការព្យាករណ៍" },
    { id: "history", label: t("dashboard.tabs.history") || "Expense History", khmer: "ប្រវត្តិចំណាយ" },
  ];

  return (
    <VendorDashboardLayout
      settingsHref="/vendor/premium/settings"
      plan="premium"
      navLinks={PREMIUM_NAV}
      currentPath="/vendor/premium/expenses"
      title={t("dashboard.expenses")}
      planBadge={{ label: "PREMIUM", icon: Sparkles }}
      rightActions={
        <>
          <button className="hidden sm:flex items-center gap-1.5 bg-[#0d1117] dark:bg-white hover:opacity-90 text-white dark:text-[#111827] font-bold px-3.5 py-2 rounded-[10px] text-sm transition-colors border-0 cursor-pointer">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button className="hidden sm:flex items-center gap-1.5 bg-white dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-[#111827] dark:text-white font-bold px-3.5 py-2 rounded-[10px] text-sm transition-colors cursor-pointer shadow-sm">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button
            onClick={() => setIsChatOpen((o) => !o)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#3ecf8e] text-white font-extrabold px-3.5 py-2 rounded-[10px] text-sm hover:opacity-90 transition-all cursor-pointer border-0 shadow-sm"
          >
            <Brain className="w-4 h-4" /> Gemini AI
          </button>
          <button className="flex items-center gap-1.5 bg-[#3ecf8e] hover:bg-[#4dd49a] text-[#0d1117] font-extrabold px-4 py-2 rounded-[10px] text-sm shadow-[0_4px_14px_rgba(62,207,142,0.28)] transition-all cursor-pointer border-0">
            <Plus className="w-4 h-4" /> {t("dashboard.actions.addExpense")}
          </button>
        </>
      }
    >
      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-6 transition-colors">
        {/* ── Page header ── */}
        <div className="pt-1 pb-1">
          <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">
            {t("dashboard.titles.myExpenses")}
          </h2>
          <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
            {t("dashboard.titles.expensesSubtitle")} ·{" "}
            <span className="text-[#9ca3af] dark:text-[#4d5562] font-khmer">
              តាមដាន និងគ្រប់គ្រងចំណាយ
            </span>
          </p>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <VendorSummaryCard
            variant="dark"
            title={t("dashboard.metrics.todayExpenses")}
            khmerTitle="ចំណាយថ្ងៃនេះ"
            value="$133.50"
            subtext="5 transactions"
          />
          <VendorSummaryCard
            title={t("dashboard.metrics.topCategory")}
            khmerTitle="ប្រភេទទូទៅ"
            value={isKhmer ? "គ្រឿងផ្សំ" : "Ingredients"}
            subtext="🏷️ គ្រឿងផ្សំ"
          />
          <VendorSummaryCard
            variant="green"
            title={t("dashboard.metrics.weeklyExpenses")}
            khmerTitle="ចំណាយប្រចាំសប្តាហ៍"
            value="$180.50"
            subtext="+5% vs last week"
          />
          <VendorSummaryCard
            title={t("dashboard.metrics.monthlyTotal")}
            khmerTitle="សរុបប្រចាំខែ"
            value="$650.00"
            subtext="this month"
          />
          <VendorSummaryCard
            title={t("dashboard.metrics.aiSavings") || "AI Savings"}
            khmerTitle="ការសន្សំ"
            value="$8.00"
            icon={Brain}
            subtext="potential/week"
          />
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-end gap-0 border-b border-[#e8eaed] dark:border-white/10 transition-colors">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-[13.5px] font-bold border-b-2 -mb-px flex flex-col items-start gap-0.5 bg-transparent border-x-0 border-t-0 cursor-pointer transition-all whitespace-nowrap ${activeTab === tab.id
                  ? "border-b-[#111827] dark:border-b-white text-[#111827] dark:text-white"
                  : "border-b-transparent text-[#6b7280] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white"
                }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] ${activeTab === tab.id ? "text-psar-primary" : "text-[#9ca3af] dark:text-[#6b7280]"}`}>
                {tab.khmer}
              </span>
            </button>
          ))}
        </div>

        {/* ══ OVERVIEW ══ */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* AI Intelligence Banner */}
            <div className="bg-[#0d1117] border border-white/[0.06] rounded-[14px] px-[26px] py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-[#161B22] shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[rgba(62,207,142,0.12)] rounded-[11px] border border-[rgba(62,207,142,0.2)]">
                  <Brain className="w-6 h-6 text-[#3ecf8e]" />
                </div>
                <div>
                  <div className="text-[17px] font-extrabold text-[#e6edf3]">
                    {isKhmer ? "ប្រព័ន្ធវៃឆ្លាត AI កំពុងដំណើរការ" : "AI Expense Intelligence Active"}
                  </div>
                  <div className="text-[12px] text-[#7d8590] mt-0.5 leading-relaxed">
                    {isKhmer 
                      ? "ការរកឃើញភាពមិនប្រក្រតី · គំរូចំណាយដដែលៗ · ការបង្កើនប្រសិទ្ធភាពចំណាយ · ការយល់ដឹងពី Gemini"
                      : "Anomaly detection · Recurring patterns · Cost optimization · Gemini insights"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[rgba(62,207,142,0.1)] border border-[rgba(62,207,142,0.2)] px-4 py-2 rounded-[10px] text-[#3ecf8e] shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[13px] font-extrabold uppercase tracking-tight">
                  Premium Active
                </span>
              </div>
            </div>

            {/* Smart Alerts */}
            {visibleAlerts.length > 0 && (
              <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] overflow-hidden shadow-sm transition-colors">
                <div className="px-6 py-4 border-b border-[#f0f2f5] dark:border-white/5 flex items-center justify-between">
                  <div className="font-bold text-[15px] text-[#111827] dark:text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#f59e0b]" /> {isKhmer ? "ការជូនដំណឹងឆ្លាតវៃ" : "Smart Alerts"}
                  </div>
                  <span className="text-[11px] font-extrabold text-[#9ca3af] dark:text-[#7d8590] uppercase tracking-widest">
                    {visibleAlerts.length} {t("dashboard.actions.actionRequired") || "Action Required"}
                  </span>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  {visibleAlerts.map((alert, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-[#161B22] border border-slate-100 dark:border-white/5 rounded-[12px] transition-all hover:bg-white dark:hover:bg-[#0d1117] hover:shadow-sm"
                    >
                      <div className="p-2.5 bg-white dark:bg-[#0d1117] rounded-[10px] shadow-sm shrink-0 border dark:border-white/5">
                        <alert.icon className="w-4 h-4 text-[#f59e0b]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-extrabold text-[14px] text-[#111827] dark:text-white">
                            {isKhmer ? alert.khmerTitle : alert.title}
                          </p>
                          <span className="text-[11px] font-medium text-[#9ca3af] dark:text-[#7d8590]">
                            {alert.time}
                          </span>
                        </div>
                        <p className="text-[13px] font-medium text-[#6b7280] dark:text-[#7d8590] leading-relaxed">
                          {isKhmer ? alert.khmerMessage : alert.message}
                        </p>
                      </div>
                      <button
                        onClick={() => setDismissed([...dismissed, i])}
                        className="text-[#9ca3af] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 p-2 rounded-[8px] transition-colors border-0 cursor-pointer bg-transparent"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] shadow-sm transition-colors">
                <div className="px-6 py-5 border-b border-slate-50 dark:border-white/5">
                  <h3 className="font-bold text-[17px] text-[#111827] dark:text-white">
                    {t("dashboard.titles.categoryBreakdown")}
                  </h3>
                  <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590] mt-0.5 font-khmer">
                    ការចំណាយតាមប្រភេទ
                  </p>
                </div>
                <div className="p-6 flex flex-col gap-5">
                  {categories.map((cat, i) => {
                    const c = catColorMap[cat.color];
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 border dark:border-white/5 ${c.iconBg} ${c.iconText}`}
                        >
                          <cat.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-bold text-[#111827] dark:text-white">
                                {isKhmer ? cat.khmer : cat.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-extrabold text-[#111827] dark:text-white">
                                {cat.amount}
                              </span>
                              <span className="text-[11px] font-bold text-[#9ca3af] dark:text-[#7d8590]">
                                {cat.pct}%
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden transition-colors shadow-inner">
                            <div
                              className="h-full rounded-full transition-all duration-1000 ease-out"
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
              <div className="bg-[#0d1117] border border-white/[0.06] rounded-[14px] p-6 transition-all hover:bg-[#161B22] shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-[rgba(139,92,246,0.15)] rounded-[10px] border border-[rgba(139,92,246,0.2)]">
                    <Sparkles className="w-5 h-5 text-[#8b5cf6]" />
                  </div>
                  <div>
                    <div className="text-[16px] font-extrabold text-[#e6edf3]">
                      {isKhmer ? "ការធ្វើប្រសិទ្ធភាពចំណាយ Gemini" : "Gemini Cost Optimization"}
                    </div>
                    <div className="text-[11px] text-[#7d8590] mt-0.5 font-khmer">
                      គន្លឹះកាត់បន្ថយថ្លៃដើម · Powered by Gemini AI
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {geminiTips.map((tip, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 bg-white/[0.04] border border-white/[0.07] rounded-[12px] hover:bg-white/[0.08] transition-all cursor-pointer group"
                    >
                      <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform">{tip.emoji}</span>
                      <div>
                        <p className="text-[13.5px] font-bold text-[#e6edf3] leading-snug">
                          {isKhmer ? tip.khmerTip : tip.tip}
                        </p>
                        <p className="text-[12px] font-extrabold text-[#3ecf8e] mt-2 flex items-center gap-1">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          {isKhmer ? tip.saving.replace("Save", "សន្សំបានប្រហែល") : tip.saving}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-4 bg-slate-900 border border-white/5 rounded-[12px] shadow-sm">
                  <p className="text-[12.5px] text-[#7d8590] leading-relaxed">
                    <strong className="text-[#e6edf3] font-extrabold">
                      {isKhmer ? "ការសន្សំប្រចាំខែប៉ាន់ស្មាន៖" : "Estimated Monthly Savings:"}
                    </strong>{" "}
                    {isKhmer ? "ការអនុវត្តទាំងនេះអាចជួយអ្នកសន្សំបាន" : "Implementing these could save you"}{" "}
                    <span className="text-[#3ecf8e] font-extrabold">~$32.00</span>{" "}
                    {isKhmer ? "ក្នុងមួយខែ។" : "per month."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ RECURRING DETECTION ══ */}
        {activeTab === "recurring" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[rgba(139,92,246,0.06)] to-[rgba(62,207,142,0.06)] dark:from-[rgba(139,92,246,0.1)] dark:to-[rgba(62,207,142,0.1)] p-6 rounded-[14px] border border-[rgba(139,92,246,0.15)] flex items-start gap-4 shadow-sm transition-all">
              <RefreshCw className="w-6 h-6 text-[#8b5cf6] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-extrabold text-[17px] text-[#111827] dark:text-white">
                  {isKhmer ? "ការរកឃើញចំណាយដដែលៗដោយ AI" : "AI Recurring Expense Detection"}
                </h3>
                <p className="text-[13.5px] font-medium text-[#6b7280] dark:text-[#7d8590] mt-1.5 leading-relaxed max-w-3xl">
                  {isKhmer 
                    ? "ប្រព័ន្ធបានកត់សម្គាល់ឃើញថាអ្នកកត់ត្រាការចំណាយទាំងនេះជាទៀងទាត់។ យើងបានបែងចែកពួកវាជាចំណាយដដែលៗដោយស្វ័យប្រវត្តិ ដើម្បីឱ្យអ្នកអាចតាមដានចំណាយថេររបស់អ្នកបានកាន់តែងាយស្រួល។"
                    : "The system noticed you log these expenses regularly. We've auto-categorized them as recurring so you can track your fixed costs easier."}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recurringItems.map((item, i) => {
                const c = catColorMap[item.color];
                return (
                  <div
                    key={i}
                    className={`p-6 rounded-[16px] border ${c.recurBorder} ${c.recurBg} transition-all hover:shadow-md cursor-pointer`}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h4 className="font-extrabold text-[16px] text-[#111827] dark:text-white">
                          {isKhmer ? item.khmer : item.name}
                        </h4>
                        <p className="text-[12px] font-medium text-[#6b7280] dark:text-[#7d8590] mt-0.5">
                          {item.name}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1.5 text-[11px] font-extrabold rounded-full shadow-sm ${c.badge}`}
                      >
                        {isKhmer && item.frequency === 'Monthly' ? 'ប្រចាំខែ' : isKhmer && item.frequency === 'Weekly' ? 'ប្រចាំសប្តាហ៍' : item.frequency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-5 border-t border-black/5 dark:border-white/5">
                      <div>
                        <p className="text-[11px] font-extrabold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-widest mb-1">
                          {isKhmer ? "ថ្លៃប៉ាន់ស្មាន" : "Estimated Cost"}
                        </p>
                        <p className="text-[18px] font-black text-[#111827] dark:text-white">
                          {item.amount}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-extrabold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-widest mb-1">
                          {isKhmer ? "លើកក្រោយ" : "Next Expected"}
                        </p>
                        <p className="text-[14px] font-extrabold text-[#111827] dark:text-white">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiInsights.map((ins, i) => {
              const Icon = ins.icon;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[16px] p-6 shadow-sm flex flex-col transition-all hover:shadow-md hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 border border-current shadow-sm"
                      style={{
                        backgroundColor: `${ins.tagColor}15`,
                        color: ins.tagColor,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className="px-3 py-1 text-[11px] font-extrabold rounded-full border shadow-sm"
                      style={{
                        backgroundColor: `${ins.tagColor}10`,
                        color: ins.tagColor,
                        borderColor: `${ins.tagColor}25`,
                      }}
                    >
                      {isKhmer ? ins.khmerTag : ins.tag}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-[16px] text-[#111827] dark:text-white leading-snug mb-3">
                    {isKhmer ? ins.khmerTitle : ins.title}
                  </h4>
                  <p className="text-[13.5px] font-medium text-[#6b7280] dark:text-[#7d8590] leading-relaxed flex-1">
                    {isKhmer ? ins.khmerDetail : ins.detail}
                  </p>
                  <button className="mt-5 text-[12px] font-bold px-4 py-2 rounded-[10px] bg-slate-50 dark:bg-[#161B22] text-[#6b7280] dark:text-[#7d8590] hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 cursor-pointer transition-all w-fit shadow-sm">
                    {isKhmer ? (ins.action === 'View alternatives' ? 'មើលជម្រើសផ្សេងៗ' : ins.action === 'See market tips' ? 'មើលគន្លឹះទីផ្សារ' : 'បន្តធ្វើបែបនេះ') : ins.action} →
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ FORECAST ══ */}
        {activeTab === "forecast" && (
          <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] overflow-hidden shadow-sm transition-colors">
            <div className="px-6 py-5 border-b border-[#f0f2f5] dark:border-white/5 flex items-center justify-between transition-colors">
              <div>
                <div className="text-[16px] font-extrabold text-[#111827] dark:text-white">
                  {isKhmer ? "ការព្យាករណ៍ចំណាយ AI — ៧ ថ្ងៃខាងមុខ" : "AI Expense Forecast — Next 7 Days"}
                </div>
                <div className="text-[11.5px] font-medium text-[#6b7280] dark:text-[#7d8590] mt-0.5">
                  {isKhmer ? "ការព្យាករណ៍ចំណាយ" : "Expense Forecasting"} · {isKhmer ? "សរុបដែលបានព្យាករណ៍" : "Predicted total"}:{" "}
                  <strong className="text-[#3ecf8e]">$175.00</strong> · 89% {isKhmer ? "ជាក់លាក់" : "confident"}
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-[#3ecf8e] text-[11px] font-bold rounded-full border border-[rgba(62,207,142,0.2)] shadow-sm">
                <Brain className="w-3.5 h-3.5" /> AI
              </span>
            </div>
            <div className="p-6">
              {/* Bar chart */}
              <div className="flex items-end gap-2.5 h-32 mb-8">
                {[20, 28, 16, 36, 24, 112, 20].map((h, i) => {
                  const isSat = i === 5;
                  const dayNames = isKhmer 
                    ? ["ចន្ទ", "អង្គារ", "ពុធ", "ព្រហ", "សុក្រ", "សៅរ៍", "អាទិត្យ"]
                    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-full relative rounded-t-[8px] transition-all duration-700"
                        style={{
                          height: "112px",
                          background: isSat ? "rgba(62,207,142,0.1)" : "",
                        }}
                      >
                        <div
                          className={`absolute bottom-0 w-full rounded-t-[8px] transition-all duration-1000 ease-out shadow-sm ${isSat ? "bg-[#3ecf8e]" : "bg-slate-200 dark:bg-white/10"}`}
                          style={{ height: `${(h / 112) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#9ca3af] dark:text-[#7d8590]">
                        {dayNames[i]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 mt-6">
                <h4 className="text-[11px] font-extrabold text-[#9ca3af] uppercase tracking-widest mb-2 px-1">
                  {isKhmer ? "ការព្យាករណ៍តាមប្រភេទ" : "Category Wise Prediction"}
                </h4>
                {forecastItems.map((fi, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#161B22] rounded-[14px] border border-slate-100 dark:border-white/5 transition-all hover:bg-white dark:hover:bg-[#0d1117] hover:shadow-sm"
                  >
                    <div className="flex-1">
                      <p className="text-[14px] font-bold text-[#111827] dark:text-white">
                        {isKhmer && fi.category === 'Ingredients' ? 'គ្រឿងផ្សំ' : isKhmer && fi.category === 'Rent' ? 'ថ្លៃជួល' : isKhmer && fi.category === 'Transport' ? 'ការដឹកជញ្ជូន' : isKhmer && fi.category === 'Electricity' ? 'អគ្គិសនី' : isKhmer && fi.category === 'Labor' ? 'ម្ចាស់ពលកម្ម' : fi.category}
                      </p>
                      <p className="text-[12px] font-medium text-[#6b7280] dark:text-[#7d8590] mt-0.5">
                        {isKhmer ? fi.khmerReason : fi.reason}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[15px] font-extrabold text-[#111827] dark:text-white">
                        {fi.predicted}
                      </p>
                      <span
                        className={`text-[11px] font-extrabold flex items-center justify-end gap-1 ${fi.up === true ? "text-[#ef4444]" : fi.up === false ? "text-[#3ecf8e]" : "text-[#9ca3af] dark:text-[#7d8590]"}`}
                      >
                        {fi.up === true && <TrendingUp className="w-3.5 h-3.5" />}
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
            <div className="px-5 py-4 border-b border-[#f0f2f5] dark:border-white/5 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-white/10 rounded-[12px] transition-all group focus-within:border-[#3ecf8e] w-72 shadow-sm">
                <Search className="w-4 h-4 text-[#9ca3af] dark:text-[#7d8590] group-focus-within:text-[#3ecf8e] transition-colors" />
                <input
                  type="text"
                  placeholder={t("dashboard.placeholders.searchExpenses") || "Search expenses..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-[13px] font-medium text-[#111827] dark:text-white w-full placeholder:text-[#9ca3af]"
                />
              </div>
              <button className="p-2.5 border border-[#e8eaed] dark:border-white/10 rounded-[10px] text-[#6b7280] dark:text-[#7d8590] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors bg-white dark:bg-[#161B22] cursor-pointer shadow-sm">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#161B22] border-b border-[#f0f2f5] dark:border-white/5 text-[11px] text-[#9ca3af] dark:text-[#7d8590] uppercase tracking-widest font-extrabold transition-colors">
                    <th className="px-6 py-4">{isKhmer ? "កាលបរិច្ឆេទ / ម៉ោង" : "Date / Time"}</th>
                    <th className="px-6 py-4">{t("dashboard.table.category")}</th>
                    <th className="px-6 py-4">{isKhmer ? "ចំណាំ" : "Note"}</th>
                    <th className="px-6 py-4">{isKhmer ? "ការសម្គាល់ AI" : "AI Flags"}</th>
                    <th className="px-6 py-4 text-right">{t("dashboard.table.amount")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f5] dark:divide-white/5 transition-colors">
                  {filteredHistory.map((exp, i) => {
                    const c = catColorMap[exp.categoryColor];
                    return (
                      <tr
                        key={i}
                        className="group transition-colors hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-[13px] font-medium text-[#6b7280] dark:text-[#7d8590]">
                            {exp.time}
                            {exp.recurring && (
                              <span className="text-[9px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full font-extrabold border border-indigo-100 dark:border-indigo-500/20 uppercase">
                                {isKhmer ? "ថេរ" : "Recurring"}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-[11.5px] font-bold shadow-sm border ${c.badge}`}
                          >
                            {isKhmer && exp.category === 'Ingredients' ? 'គ្រឿងផ្សំ' : isKhmer && exp.category === 'Rent' ? 'ថ្លៃជួល' : isKhmer && exp.category === 'Transport' ? 'ការដឹកជញ្ជូន' : isKhmer && exp.category === 'Electricity' ? 'អគ្គិសនី' : isKhmer && exp.category === 'Labor' ? 'ម្ចាស់ពលកម្ម' : exp.category}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-[13.5px] font-bold text-[#111827] dark:text-white">
                          {isKhmer ? exp.khmerNote : exp.note}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          {exp.anomaly === "high" ? (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded-[6px] uppercase shadow-sm">
                                <AlertTriangle className="w-3.5 h-3.5" /> {isKhmer ? "ទង់ក្រហម" : "Flagged"}
                              </span>
                              <span
                                className="text-[11px] font-medium text-red-500 dark:text-red-400 max-w-[140px] truncate"
                                title={isKhmer ? exp.khmerAnomalyNote || "" : exp.anomalyNote || ""}
                              >
                                {isKhmer ? exp.khmerAnomalyNote : exp.anomalyNote}
                              </span>
                            </div>
                          ) : exp.anomaly === "medium" ? (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 rounded-[6px] uppercase shadow-sm">
                                <AlertTriangle className="w-3.5 h-3.5" /> {isKhmer ? "មិនធម្មតា" : "Unusual"}
                              </span>
                              <span
                                className="text-[11px] font-medium text-orange-500 dark:text-orange-400 max-w-[140px] truncate"
                                title={isKhmer ? exp.khmerAnomalyNote || "" : exp.anomalyNote || ""}
                              >
                                {isKhmer ? exp.khmerAnomalyNote : exp.anomalyNote}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[12px] text-[#d1d5db] dark:text-[#4d5562]">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-right whitespace-nowrap">
                          <span className="text-[15px] font-extrabold text-[#111827] dark:text-white">
                            ${exp.amount.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

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
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-h-[550px] bg-white dark:bg-[#0d1117] rounded-[24px] shadow-2xl border border-[#e8eaed] dark:border-white/10 flex flex-col overflow-hidden transition-all slide-up">
          <div className="px-6 py-5 bg-[#0d1117] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] rounded-full flex items-center justify-center shadow-lg">
                <Brain size={20} className="text-white" />
              </div>
              <div>
                <p className="font-extrabold text-[14px] text-[#e6edf3]">
                  {isKhmer ? "ជំនួយការចំណាយ AI" : "Expense Assistant"}
                </p>
                <p className="text-[11px] font-bold text-[#4d5562] uppercase tracking-tight">
                  {isKhmer ? "កំពុងអនឡាញ · កំពុងវិភាគចំណាយ" : "Online · Analyzing costs"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-[#7d8590] hover:text-[#e6edf3] bg-transparent border-0 cursor-pointer p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div
            className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-slate-50 dark:bg-[#161B22] transition-colors"
            style={{ minHeight: "300px" }}
          >
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-[16px] text-[13.5px] font-medium leading-relaxed shadow-sm transition-all ${msg.role === "user"
                      ? "bg-slate-900 dark:bg-gradient-to-r dark:from-[#8b5cf6] dark:to-[#3ecf8e] text-white rounded-br-[4px]"
                      : "bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 text-[#374151] dark:text-[#e6edf3] rounded-bl-[4px]"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-[#e8eaed] dark:border-white/10 bg-white dark:bg-[#0d1117] transition-colors">
            <div className="flex items-center gap-2.5">
              <input
                type="text"
                placeholder={isKhmer ? "សួរអំពីការចំណាយរបស់អ្នក..." : "Ask about your expenses..."}
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-white/10 rounded-[12px] text-[13.5px] font-medium outline-none text-[#111827] dark:text-white focus:border-[#3ecf8e] shadow-sm transition-all"
              />
              <button
                onClick={handleSend}
                className="p-3 bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] text-white rounded-[12px] border-0 cursor-pointer hover:opacity-90 shadow-md transition-transform hover:scale-105"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </VendorDashboardLayout>
  );
}
