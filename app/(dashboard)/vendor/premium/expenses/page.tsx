"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, CircleDollarSign, Receipt, Users, Package,
  Settings, TrendingUp, TrendingDown, Menu, X, Bell, Sparkles,
  CheckCircle2, FileText, FileSpreadsheet, Brain, AlertTriangle,
  FileBarChart, Plus, Edit2, Trash2, Search, Filter, Lightbulb,
  ShoppingCart, Home, Car, Bolt, UserCheck, MoreHorizontal,
  Target, CloudSun, Megaphone, MessageSquare, Send, RefreshCw,
  Tag, Repeat, ZapOff, LucideIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AlertColor   = "purple" | "orange" | "red";
type InsightColor = "orange" | "purple" | "emerald";
type CatColor     = "emerald" | "indigo" | "violet" | "amber" | "red" | "slate";
type ChangeType   = "up" | "down" | "neutral";
type Urgency      = "high" | "medium" | "low";
type AnomalyFlag  = "high" | "medium" | null;

interface PushAlert {
  title: string; message: string; time: string;
  icon: LucideIcon; color: AlertColor;
}
interface RecurringItem {
  name: string; khmer: string; amount: string;
  frequency: string; nextDue: string; color: CatColor;
}
interface Category {
  name: string; khmer: string; amount: string;
  pct: number; barWidth: string; color: CatColor; icon: LucideIcon;
}
interface ExpenseRecord {
  time: string; category: string; note: string;
  amount: number; categoryColor: CatColor;
  recurring: boolean; anomaly: AnomalyFlag; anomalyNote: string | null;
}
interface ForecastItem {
  category: string; predicted: string; change: string;
  changeType: ChangeType; reason: string;
}
interface ChatMsg { role: "assistant" | "user"; text: string; }

// ─── Color Maps ───────────────────────────────────────────────────────────────

const alertColorMap: Record<AlertColor, {
  bg: string; border: string; iconBg: string; iconText: string; titleText: string;
}> = {
  purple: { bg: "bg-gray-50",   border: "border-gray-200",   iconBg: "bg-gray-100",   iconText: "text-gray-600",   titleText: "text-gray-700"   },
  orange: { bg: "bg-gray-50",   border: "border-gray-200",   iconBg: "bg-gray-100",   iconText: "text-gray-600",   titleText: "text-gray-700"   },
  red:    { bg: "bg-red-50",    border: "border-red-200",    iconBg: "bg-red-100",    iconText: "text-red-600",    titleText: "text-red-700"    },
};

const insightColorMap: Record<InsightColor, {
  bg: string; border: string; iconBg: string; iconText: string; btnText: string; btnHover: string;
}> = {
  orange:  { bg: "bg-gray-50",    border: "border-gray-200",    iconBg: "bg-gray-100",    iconText: "text-gray-700",    btnText: "text-gray-700",    btnHover: "hover:bg-gray-100"    },
  purple:  { bg: "bg-gray-50",    border: "border-gray-200",    iconBg: "bg-gray-100",    iconText: "text-gray-700",    btnText: "text-gray-700",    btnHover: "hover:bg-gray-100"    },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", iconBg: "bg-emerald-100", iconText: "text-emerald-600", btnText: "text-emerald-600", btnHover: "hover:bg-emerald-100" },
};

const catColorMap: Record<CatColor, {
  iconBg: string; iconText: string; badge: string; bar: string; recurBg: string;
}> = {
  emerald: { iconBg: "bg-emerald-100", iconText: "text-emerald-600", badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", bar: "bg-emerald-500", recurBg: "bg-emerald-50 border-emerald-200" },
  indigo:  { iconBg: "bg-gray-100",    iconText: "text-gray-700",    badge: "bg-gray-100 text-gray-700 border border-gray-200",        bar: "bg-gray-600",    recurBg: "bg-gray-50 border-gray-200"     },
  violet:  { iconBg: "bg-gray-100",    iconText: "text-gray-600",    badge: "bg-gray-50 text-gray-600 border border-gray-200",         bar: "bg-gray-400",    recurBg: "bg-gray-50 border-gray-200"     },
  amber:   { iconBg: "bg-gray-100",    iconText: "text-gray-600",    badge: "bg-gray-100 text-gray-700 border border-gray-200",       bar: "bg-gray-500",    recurBg: "bg-gray-50 border-gray-200"    },
  red:     { iconBg: "bg-red-100",     iconText: "text-red-600",     badge: "bg-red-50 text-red-700 border border-red-200",           bar: "bg-red-500",     recurBg: "bg-red-50 border-red-200"       },
  slate:   { iconBg: "bg-slate-100",   iconText: "text-slate-500",   badge: "bg-slate-100 text-slate-600 border border-slate-200",    bar: "bg-slate-300",   recurBg: "bg-slate-50 border-slate-200"   },
};

const urgencyColorMap: Record<Urgency, { bg: string; text: string }> = {
  high:   { bg: "bg-red-100",    text: "text-red-600"    },
  medium: { bg: "bg-gray-100",   text: "text-gray-600"   },
  low:    { bg: "bg-emerald-100",text: "text-emerald-600"},
};

// Tailwind-safe bar heights
const trendHeights = ["h-5", "h-7", "h-4", "h-9", "h-6", "h-28", "h-5"] as const;
const trendLabels  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]  as const;

// ─── Static Data ──────────────────────────────────────────────────────────────

const pushAlerts: PushAlert[] = [
  {
    title: "⚠️ Ingredient costs up 30% this week",
    message: "Pork & vegetables spending jumped 30% vs last week. Likely linked to market price surge — review supplier pricing.",
    time: "2 hours ago", icon: TrendingUp, color: "orange",
  },
  {
    title: "🔴 Unusual Spending Detected",
    message: "Transport costs logged twice today ($7.00 total) — AI flagged this as a possible duplicate entry. Please review.",
    time: "45 min ago", icon: AlertTriangle, color: "red",
  },
  {
    title: "🌧️ Budget Tip",
    message: "Rainy evening predicted — Hot Latte demand rising. Consider increasing ingredient budget by 15% for tomorrow.",
    time: "30 min ago", icon: CloudSun, color: "purple",
  },
];

// SRS: Auto-detected recurring expense patterns
const recurringItems: RecurringItem[] = [
  { name: "Monthly Stall Rent",  khmer: "ថ្លៃជួល",      amount: "$80.00", frequency: "Monthly",  nextDue: "Nov 1",  color: "indigo"  },
  { name: "Weekly Electricity",  khmer: "អគ្គិសនី",     amount: "$15.00", frequency: "Weekly",   nextDue: "Oct 29", color: "amber"   },
  { name: "Assistant Pay",       khmer: "ម្ចាស់ពលកម្ម", amount: "$10.00", frequency: "Weekly",   nextDue: "Oct 30", color: "red"     },
  { name: "Market Fees",         khmer: "ថ្លៃទីផ្សារ",  amount: "$5.00",  frequency: "Monthly",  nextDue: "Nov 1",  color: "violet"  },
];

const aiInsights = [
  { color: "orange" as InsightColor, icon: AlertTriangle, title: "Rent is 60% of expenses",           detail: "Above the healthy 40% threshold for market stalls. Consider renegotiating or finding lower-cost alternatives.",   action: "View alternatives" },
  { color: "purple" as InsightColor, icon: Lightbulb,     title: "Ingredient costs reducible by ~18%", detail: "Vendors near Orussey Market charge 18% less for similar pork cuts on Tuesday mornings.",                            action: "See market tips"   },
  { color: "emerald"as InsightColor, icon: CheckCircle2,  title: "Transport costs optimized",          detail: "Your TukTuk usage is 32% below average for similar stalls. Keep minimizing transport!",                            action: "Keep it up"        },
];

const categories: Category[] = [
  { name: "Ingredients", khmer: "គ្រឿងផ្សំ",   amount: "$25.00", pct: 19, barWidth: "w-[19%]", color: "emerald", icon: ShoppingCart   },
  { name: "Rent",        khmer: "ថ្លៃជួល",      amount: "$80.00", pct: 60, barWidth: "w-3/5", color: "indigo",  icon: Home           },
  { name: "Transport",   khmer: "ការដឹកជញ្ជូន", amount: "$3.50",  pct: 3,  barWidth: "w-[3%]",  color: "violet",  icon: Car            },
  { name: "Electricity", khmer: "អគ្គិសនី",     amount: "$15.00", pct: 11, barWidth: "w-[11%]", color: "amber",   icon: Bolt           },
  { name: "Labor",       khmer: "ម្ចាស់ពលកម្ម", amount: "$10.00", pct: 7,  barWidth: "w-[7%]",  color: "red",     icon: UserCheck      },
  { name: "Others",      khmer: "ផ្សេងៗ",        amount: "$0.00",  pct: 0,  barWidth: "w-0",     color: "slate",   icon: MoreHorizontal },
];

const forecastItems: ForecastItem[] = [
  { category: "Ingredients", predicted: "$28.00", change: "+12%", changeType: "up",      reason: "Weekend market prices higher"   },
  { category: "Rent",        predicted: "$80.00", change: "0%",   changeType: "neutral", reason: "Fixed monthly cost"             },
  { category: "Transport",   predicted: "$5.00",  change: "+43%", changeType: "up",      reason: "2 extra market trips predicted" },
  { category: "Electricity", predicted: "$17.00", change: "+13%", changeType: "up",      reason: "Extended evening hours"         },
  { category: "Labor",       predicted: "$10.00", change: "0%",   changeType: "neutral", reason: "Regular schedule maintained"    },
];

// SRS: expense history with AI anomaly flags
const expenseHistory: ExpenseRecord[] = [
  { time: "2:15 PM",    category: "Ingredients", note: "Pork and Vegetables", amount: 25.00, categoryColor: "emerald", recurring: false, anomaly: "medium", anomalyNote: "30% above weekly average"  },
  { time: "10:00 AM",   category: "Transport",   note: "TukTuk to market",    amount: 3.50,  categoryColor: "violet",  recurring: false, anomaly: "high",   anomalyNote: "Possible duplicate — logged twice today" },
  { time: "Yesterday",  category: "Electricity", note: "Weekly stall power",  amount: 15.00, categoryColor: "amber",   recurring: true,  anomaly: null,     anomalyNote: null },
  { time: "Yesterday",  category: "Labor",       note: "Assistant pay",       amount: 10.00, categoryColor: "red",     recurring: false, anomaly: null,     anomalyNote: null },
  { time: "2 days ago", category: "Rent",        note: "Monthly stall rent",  amount: 80.00, categoryColor: "indigo",  recurring: true,  anomaly: null,     anomalyNote: null },
];

// SRS: Gemini cost optimization tips
const geminiTips = [
  { tip: "Buy ingredients Tuesday 6–8 AM at Orussey Market",   saving: "Save ~$4.50/week",  emoji: "🌅" },
  { tip: "Batch electricity usage — turn off fans after 9 PM", saving: "Save ~$2/week",     emoji: "⚡" },
  { tip: "Share TukTuk with Stall B41 for shared market runs", saving: "Save ~$1.50/trip",  emoji: "🛺" },
];

const initChat: ChatMsg[] = [
  { role: "assistant", text: "សួស្តី! I'm your AI Expense Assistant. Ask me anything about your spending patterns or how to cut costs!" },
  { role: "assistant", text: "Try: 'Where am I spending too much?' or 'How can I reduce costs this week?'" },
];

// ─── NavItem ─────────────────────────────────────────────────────────────────

function NavItem({ icon: Icon, title, khmerTitle, active = false, href = "#" }: {
  icon: LucideIcon; title: string; khmerTitle: string; active?: boolean; href?: string;
}) {
  return (
    <Link href={href} className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors no-underline min-h-12 ${active ? "bg-emerald-500/20 text-emerald-400" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${active ? "text-emerald-400" : "text-gray-500"}`} />
        <span className={`text-[15px] ${active ? "font-semibold" : "font-medium"}`}>{title}</span>
      </div>
      <span className="text-[11px] font-khmer text-gray-300">{khmerTitle}</span>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PremiumExpensesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery]     = useState("");
  const [dismissed, setDismissed]         = useState<number[]>([]);
  const [isChatOpen, setIsChatOpen]       = useState(false);
  const [chatMessage, setChatMessage]     = useState("");
  const [chatMessages, setChatMessages]   = useState<ChatMsg[]>(initChat);

  const visibleAlerts = pushAlerts.filter((_, i) => !dismissed.includes(i));

  const handleSend = () => {
    if (!chatMessage.trim()) return;
    setChatMessages((prev) => [...prev, { role: "user", text: chatMessage }]);
    setChatMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-950 border-r border-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-800">
          <Link href="/vendor" className="flex items-center gap-3 no-underline">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-white shadow-sm">P</div>
            <span className="font-bold text-[19px] tracking-tight text-white">PsarPulse KH</span>
          </Link>
          <button className="lg:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          <NavItem icon={LayoutDashboard}  title="Dashboard"  khmerTitle="ផ្ទាំងគ្រប់គ្រង" href="/vendor/premium"       />
          <NavItem icon={CircleDollarSign} title="Sales"      khmerTitle="ការលក់"           href="/vendor/premium/sales" />
          <NavItem icon={Receipt}          title="Expenses"   khmerTitle="ចំណាយ"            href="/vendor/expenses"  active />
          <NavItem icon={Users}            title="Customers"  khmerTitle="អតិថិជន"          href="/vendor/customer"      />
          <NavItem icon={Package}          title="Inventory"  khmerTitle="ស្តុក"            href="/vendor/inventory"     />
          <NavItem icon={FileBarChart}     title="Reports"    khmerTitle="របាយការណ៍"        href="/vendor/reports"       />
          <NavItem icon={Megaphone}        title="Marketing"  khmerTitle="ទីផ្សារ"          href="/vendor/marketing"     />
        </nav>
        <div className="p-4 border-t border-gray-800">
          <NavItem icon={Settings} title="Settings" khmerTitle="ការកំណត់" href="/vendor/settings" />
          <div className="mt-3 p-3.5 bg-gray-800 rounded-xl text-white border border-gray-700">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-sm">Premium Plan</span>
            </div>
            <p className="text-xs text-slate-400 mb-2">$7/month · AI Assistant Active</p>
            <Link href="/vendor/pricing" className="block w-full text-center text-xs font-bold text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 py-1.5 rounded-lg transition-colors no-underline">
              Manage Plan
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col w-full min-w-0">

        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-500" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-slate-900">Expenses</h1>
              <span className="text-slate-400">·</span>
              <span className="text-sm font-khmer text-slate-600">ការគ្រប់គ្រងចំណាយ</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-full">
                <Sparkles className="w-3 h-3" /> PREMIUM
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-3.5 py-2 rounded-xl text-sm transition-colors">
              <FileText className="w-4 h-4" /> Export PDF
            </button>
            <button className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-3.5 py-2 rounded-xl text-sm transition-colors">
              <FileSpreadsheet className="w-4 h-4" /> Export Excel
            </button>
            <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-xl text-sm shadow-sm transition-colors">
              <Plus className="w-4 h-4" /> Add Expense
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-900 relative">
              <Bell className="w-5 h-5" />
              {visibleAlerts.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold border border-gray-200 text-sm">SM</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">

          {/* ① Smart Push Notifications — SRS: "Ingredient costs up 30% this week" */}
          {visibleAlerts.length > 0 && (
            <div className="space-y-3">
              {visibleAlerts.map((alert, i) => {
                const Icon = alert.icon;
                const c    = alertColorMap[alert.color];
                const orig = pushAlerts.indexOf(alert);
                return (
                  <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border shadow-sm ${c.bg} ${c.border}`}>
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${c.iconBg}`}>
                      <Icon className={`w-4 h-4 ${c.iconText}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-bold ${c.titleText}`}>{alert.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{alert.message}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{alert.time}</p>
                    </div>
                    <button onClick={() => setDismissed((d) => [...d, orig])}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white transition-colors shrink-0">
                      Dismiss
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* AI Banner */}
          <div className="bg-gray-900 rounded-2xl p-5 shadow-lg text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl"><Brain className="w-6 h-6 text-emerald-400" /></div>
              <div>
                <h3 className="font-bold text-[17px]">AI Expense Intelligence Active</h3>
                <p className="text-gray-400 text-sm mt-0.5">Anomaly detection · Recurring patterns · Cost optimization · Gemini insights</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 rounded-xl text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-semibold">Premium Active</span>
            </div>
          </div>

          {/* ② 5 Metric Cards — SRS: 4 cards + AI Savings Potential (premium-exclusive 5th) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-sm">
              <p className="text-sm font-semibold text-slate-400">Today's Expenses</p>
              <p className="text-[10px] font-khmer text-slate-600 mt-0.5 mb-3">ចំណាយថ្ងៃនេះ</p>
              <p className="text-[28px] font-bold">$133.50</p>
              <p className="text-[11px] text-slate-400 mt-1">5 transactions</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Top Category</p>
              <p className="text-[10px] font-khmer text-slate-600 mt-0.5 mb-3">ប្រភេទទូទៅ</p>
              <p className="text-xl font-bold text-slate-900">Ingredients</p>
              <p className="text-[11px] text-slate-400 mt-1">🏷️ គ្រឿងផ្សំ</p>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-500 text-white shadow-sm">
              <p className="text-sm font-semibold text-white/80">Weekly Expenses</p>
              <p className="text-[10px] font-khmer text-white/60 mt-0.5 mb-3">ចំណាយប្រចាំសប្តាហ៍</p>
              <p className="text-[28px] font-bold">$180.50</p>
              <p className="text-[11px] text-white/70 mt-1">+5% vs last week</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Monthly Total</p>
              <p className="text-[10px] font-khmer text-slate-600 mt-0.5 mb-3">សរុបប្រចាំខែ</p>
              <p className="text-[28px] font-bold text-slate-900">$650.00</p>
              <p className="text-[11px] text-slate-400 mt-1">this month</p>
            </div>
            {/* SRS: AI Savings Potential — premium-exclusive 5th card */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-1 mb-1">
                <Brain className="w-3.5 h-3.5 text-emerald-500" />
                <p className="text-[11px] font-bold text-gray-700">AI Savings</p>
              </div>
              <p className="text-[10px] font-khmer text-gray-500 mb-3">ការសន្សំ</p>
              <p className="text-[28px] font-bold text-emerald-600">$8.00</p>
              <p className="text-[11px] text-gray-500 mt-1">potential/week</p>
            </div>
          </div>

          {/* ③ Recurring Expense Detection — SRS: Auto-detect recurring patterns */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-xl"><Repeat className="w-5 h-5 text-gray-600" /></div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Recurring Expense Detection</h3>
                  <p className="text-[11px] font-khmer text-slate-500 mt-0.5">ការរកឃើញចំណាយដដែល · Auto-detected by AI</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
                <Brain className="w-3 h-3" /> AI
              </span>
            </div>
            <div className="p-5">
              <p className="text-[13px] text-slate-500 bg-gray-50 p-3 rounded-xl border border-gray-200 mb-4">
                <RefreshCw className="w-4 h-4 text-gray-500 align-middle mr-1.5" />
                AI detected <strong className="text-gray-800">4 recurring expenses</strong> from your history. Total committed: <strong className="text-slate-700">$110.00/month</strong>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {recurringItems.map((item, i) => {
                  const c = catColorMap[item.color];
                  return (
                    <div key={i} className={`p-4 rounded-xl border ${c.recurBg}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.iconBg} ${c.iconText}`}>
                          {item.frequency}
                        </span>
                        <Repeat className={`w-3.5 h-3.5 ${c.iconText}`} />
                      </div>
                      <p className="text-[13px] font-bold text-slate-900 leading-tight">{item.name}</p>
                      <p className="text-[10px] font-khmer text-slate-600 mt-0.5">{item.khmer}</p>
                      <p className={`text-xl font-bold mt-2 ${c.iconText}`}>{item.amount}</p>
                      <p className="text-[11px] text-slate-400 mt-1">Next: {item.nextDue}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ④ Gemini Cost Optimization Panel — SRS: Gemini spending tips gradient panel */}
          <div className="bg-gray-900 rounded-2xl p-6 text-white border border-gray-700">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-emerald-500/20 rounded-xl"><Sparkles className="w-5 h-5 text-emerald-400" /></div>
              <div>
                <h3 className="font-bold text-base">Gemini Cost Optimization</h3>
                <p className="text-gray-300 text-xs mt-0.5 font-khmer">គន្លឹះកាត់បន្ថយថ្លៃដើម · Powered by Gemini AI</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {geminiTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-gray-800 rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors">
                  <span className="text-2xl shrink-0">{tip.emoji}</span>
                  <div>
                    <p className="text-[13px] font-semibold leading-snug">{tip.tip}</p>
                    <p className="text-xs font-bold text-emerald-300 mt-1.5">{tip.saving}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-800 rounded-xl border border-gray-700">
              <p className="text-xs text-gray-300">
                <strong>Total potential savings:</strong> ~$8.00/week · $32/month · $384/year — if all 3 tips are applied consistently.
              </p>
            </div>
          </div>

          {/* AI Insights + Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-gray-500" />
                <h3 className="font-bold text-base text-slate-900">AI Expense Insights</h3>
                <span className="text-[11px] font-khmer text-slate-500">ការវិភាគចំណាយ</span>
              </div>
              <div className="space-y-3">
                {aiInsights.map((insight, i) => {
                  const Icon = insight.icon;
                  const c    = insightColorMap[insight.color];
                  return (
                    <div key={i} className={`p-4 rounded-xl border ${c.bg} ${c.border} flex items-start gap-3`}>
                      <div className={`p-2 rounded-lg shrink-0 ${c.iconBg}`}>
                        <Icon className={`w-4 h-4 ${c.iconText}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-[13px] font-bold ${c.iconText}`}>{insight.title}</p>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{insight.detail}</p>
                        <button className={`mt-1.5 text-[11px] font-semibold px-2 py-1 rounded-md transition-colors ${c.btnText} ${c.btnHover}`}>
                          {insight.action} →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Breakdown by Category</h3>
                  <p className="text-[11px] font-khmer text-slate-500 mt-0.5">ចំណាយតាមប្រភេទ</p>
                </div>
                <button className="text-xs font-semibold text-gray-600 flex items-center gap-1 hover:text-gray-900">
                  <Filter className="w-3.5 h-3.5" /> Filter
                </button>
              </div>
              <div className="space-y-3">
                {categories.map((cat, i) => {
                  const Icon = cat.icon;
                  const c    = catColorMap[cat.color];
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg shrink-0 ${c.iconBg}`}>
                        <Icon className={`w-3.5 h-3.5 ${c.iconText}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-semibold text-slate-700">{cat.name}</span>
                            <span className="text-[10px] font-khmer text-slate-500">{cat.khmer}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700">{cat.amount}</span>
                            <span className="text-[11px] text-slate-400">{cat.pct}%</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${c.bar} ${cat.barWidth}`} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Expense Forecast */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-base text-slate-900">AI Expense Forecast — Next 7 Days</h3>
                <p className="text-[11px] font-khmer text-slate-500 mt-0.5">ការព្យាករណ៍ចំណាយ · Predicted total: <strong className="text-emerald-600">$175.00</strong> · 89% confident</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
                <Brain className="w-3 h-3" /> AI
              </span>
            </div>
            <div className="flex items-end gap-3 h-28 mb-4">
              {trendHeights.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className={`w-full rounded-t-lg transition-all ${i === 5 ? "bg-emerald-500" : "bg-slate-100 hover:bg-slate-200"} ${h}`} />
                  <span className="text-[10px] text-slate-400 font-medium">{trendLabels[i]}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {forecastItems.map((item, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500">{item.category}</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{item.predicted}</p>
                  <span className={`text-[11px] font-semibold ${item.changeType === "neutral" ? "text-slate-400" : item.changeType === "up" ? "text-gray-700" : "text-emerald-500"}`}>
                    {item.change}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ⑤ Expense History — SRS: searchable table + AI anomaly flag icons */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Expense History</h3>
                <p className="text-xs text-slate-400 mt-0.5">5 records · 🔍 AI anomaly flags shown inline</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" placeholder="Search expenses..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 text-[13px] border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-gray-400 outline-none w-48" />
                </div>
                <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Time</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Note</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">AI Flag</th>
                  <th className="text-right px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="text-right px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenseHistory.map((exp, i) => {
                  const c = catColorMap[exp.categoryColor];
                  return (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
                          {exp.time}
                          {exp.recurring && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full font-semibold">Recurring</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${c.badge}`}>{exp.category}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700 font-medium">{exp.note}</td>
                      {/* SRS: AI anomaly flag column */}
                      <td className="px-4 py-4">
                        {exp.anomaly === "high" ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Anomaly
                            </span>
                            {exp.anomalyNote && <span className="text-[10px] text-red-500 hidden lg:block">{exp.anomalyNote}</span>}
                          </div>
                        ) : exp.anomaly === "medium" ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold px-2 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-lg flex items-center gap-1">
                              <Tag className="w-3 h-3" /> Unusual
                            </span>
                            {exp.anomalyNote && <span className="text-[10px] text-gray-500 hidden lg:block">{exp.anomalyNote}</span>}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-red-500">-${exp.amount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-slate-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50/50">
                  <td colSpan={4} className="px-6 py-3 text-xs text-slate-400">5 of 5 records · 2 AI flags</td>
                  <td className="px-6 py-3 text-right text-sm font-bold text-red-500">Total: $133.50</td>
                  <td />
                </tr>
              </tfoot>
            </table>
            <div className="px-6 py-3 border-t border-slate-100">
              <p className="text-[11px] text-slate-400">🔍 AI flags unusual spending automatically · 🔄 Deleted records undoable within 5 seconds</p>
            </div>
          </div>

        </div>
      </main>

      {/* ⑥ AI Chatbot FAB — SRS: Floating Gemini assistant */}
      {!isChatOpen && (
        <button onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gray-900 rounded-full shadow-xl shadow-gray-400/30 flex items-center justify-center text-white hover:scale-110 transition-transform">
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 max-h-130 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="px-5 py-4 bg-gray-900 text-white flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">AI Expense Assistant</p>
                <p className="text-[11px] text-gray-400">Powered by Gemini</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white/70 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 min-h-70">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-4/5 px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${msg.role === "user" ? "bg-gray-800 text-white rounded-br-md" : "bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Ask about your expenses..." value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-gray-400 outline-none transition-all min-h-11" />
              <button onClick={handleSend} className="p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors min-h-11">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}