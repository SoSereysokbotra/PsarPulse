"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, CircleDollarSign, Receipt, Users, Package,
  Settings, TrendingUp, TrendingDown, Menu, X, Bell, Sparkles,
  CheckCircle2, FileText, FileSpreadsheet, Brain, AlertTriangle,
  FileBarChart, Plus, Clock, Flame, Target, CloudSun, Zap,
  Activity, CalendarDays, Star, MessageSquare, Send, Users2,
  Megaphone, ShoppingCart, Phone, StickyNote, LucideIcon,
  Search, History, User, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AlertColor    = "purple" | "orange" | "red" | "green" | "emerald";
type BehaviorColor = "amber" | "emerald" | "blue" | "purple";
type TrafficStatus = "Regular" | "Peak Traffic";
type SegmentType   = "vip" | "at-risk" | "new" | "dormant";
type TabId         = "analysis" | "forecast" | "log";

interface PushAlert {
  title: string; message: string; time: string;
  icon: LucideIcon; color: AlertColor;
}
interface CustomerSegment {
  type: SegmentType;
  label: string;
  khmer: string;
  count: number;
  description: string;
  action: string;
}
interface CRMProfile {
  name: string; khmer: string; phone: string;
  visits: number; lastVisit: string; totalSpend: string;
  ltv: string; loyaltyScore: number; loyaltyLabel: string;
  loyaltyBarWidth: string;
  segment: SegmentType; note: string;
}
interface PeakHour {
  hour: string; predicted: number; actual: number | null;
  barClass: string; isPredicted: boolean;
}
interface CustomerLog {
  time: string; count: number; status: TrafficStatus;
}
interface ChatMsg { role: "assistant" | "user"; text: string; }

// ─── Color Maps ───────────────────────────────────────────────────────────────

const alertColorMap: Record<AlertColor, {
  bg: string; border: string; iconBg: string; iconText: string; titleText: string;
}> = {
  purple:  { bg: "bg-gray-50",    border: "border-gray-200",    iconBg: "bg-gray-100",    iconText: "text-gray-600",    titleText: "text-gray-700"    },
  orange:  { bg: "bg-gray-50",    border: "border-gray-200",    iconBg: "bg-gray-100",    iconText: "text-gray-600",    titleText: "text-gray-700"    },
  red:     { bg: "bg-red-50",     border: "border-red-200",     iconBg: "bg-red-100",     iconText: "text-red-600",     titleText: "text-red-700"     },
  green:   { bg: "bg-emerald-50", border: "border-emerald-200", iconBg: "bg-emerald-100", iconText: "text-emerald-600", titleText: "text-emerald-700" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", iconBg: "bg-emerald-100", iconText: "text-emerald-600", titleText: "text-emerald-700" },
};

const segmentColorMap: Record<SegmentType, {
  bg: string; border: string; iconBg: string; iconText: string;
  badge: string; countText: string;
}> = {
  "vip":     { bg: "bg-gray-900",   border: "border-gray-700",    iconBg: "bg-gray-700",    iconText: "text-white",       badge: "bg-gray-800 text-white",          countText: "text-white"       },
  "at-risk": { bg: "bg-red-50",     border: "border-red-200",     iconBg: "bg-red-100",     iconText: "text-red-600",     badge: "bg-red-100 text-red-700",         countText: "text-red-600"     },
  "new":     { bg: "bg-emerald-50", border: "border-emerald-200", iconBg: "bg-emerald-100", iconText: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700", countText: "text-emerald-600" },
  "dormant": { bg: "bg-slate-50",   border: "border-slate-200",   iconBg: "bg-slate-100",   iconText: "text-slate-500",   badge: "bg-slate-100 text-slate-600",     countText: "text-slate-500"   },
};

const loyaltyColorMap: Record<string, { badge: string; bar: string }> = {
  Platinum: { badge: "text-violet-700 bg-violet-50 border-violet-200", bar: "bg-violet-500" },
  Gold:     { badge: "text-amber-700 bg-amber-50 border-amber-200",    bar: "bg-amber-400"  },
  Silver:   { badge: "text-blue-600 bg-blue-50 border-blue-200",       bar: "bg-blue-400"   },
  Bronze:   { badge: "text-orange-600 bg-orange-50 border-orange-200", bar: "bg-orange-400" },
};

// Tailwind-safe bar heights
const weeklyBarHeights = ["h-14", "h-18", "h-12", "h-20", "h-16", "h-28", "h-24"] as const;
const trendLabels      = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

// ─── Static Data ──────────────────────────────────────────────────────────────

const pushAlerts: PushAlert[] = [
  { title: "VIP Customer Alert",          message: "Sophea (VIP) hasn't visited in 5 days — she usually comes every 2 days. Consider sending a special offer.",                                        time: "1 hour ago",    icon: Star,          color: "purple"  },
  { title: "At-Risk Customers",           message: "3 customers who visited regularly last month haven't returned in 2+ weeks. They may be at risk of churning.",                                      time: "This morning",  icon: AlertTriangle, color: "orange"  },
  { title: "Sales Drop Alert",            message: "Customer count is 15% below your usual Saturday average by this time. Consider a promotional push.",                                               time: "Just now",      icon: TrendingDown,  color: "red"     },
  { title: "Best Seller This Week",       message: "Iced Coffee Combo is your top item — 87 orders this week, making up 34% of total sales. Stock up on ingredients before the weekend rush.",        time: "Updated today", icon: ShoppingCart,  color: "green"   },
  { title: "Revenue Up 30% vs Last Week", message: "You earned 30% more than the same period last week. Strong weekend foot traffic and repeat VIP visits drove the increase. Keep it up.",            time: "This week",     icon: TrendingUp,    color: "emerald" },
];

const customerSegments: CustomerSegment[] = [
  { type: "vip",     label: "VIP",     khmer: "អតិថិជន VIP", count: 12, description: "3+ visits/week · avg $8+ spend · loyal for 3+ months", action: "Send Reward"   },
  { type: "at-risk", label: "At-Risk", khmer: "ហានិភ័យ",      count: 8,  description: "Were regulars but haven't visited in 10+ days",        action: "Re-engage now" },
  { type: "new",     label: "New",     khmer: "អតិថិជនថ្មី",  count: 6,  description: "First visit in last 7 days — needs nurturing",          action: "Welcome Offer" },
  { type: "dormant", label: "Dormant", khmer: "អសកម្ម",        count: 20, description: "No visit in 30+ days — may have churned",              action: "Win Back"      },
];

const crmProfiles: CRMProfile[] = [
  { name: "So So",  khmer: "សូ សូ",  phone: "123456789", visits: 42, lastVisit: "5 days ago",  totalSpend: "$210", ltv: "$620", loyaltyScore: 94, loyaltyLabel: "Platinum", loyaltyBarWidth: "w-[94%]", segment: "vip",     note: "Loves Iced Coffee combo"   },
  { name: "Sa Sa",  khmer: "សា សា",  phone: "12345678",  visits: 28, lastVisit: "2 days ago",  totalSpend: "$145", ltv: "$390", loyaltyScore: 81, loyaltyLabel: "Gold",     loyaltyBarWidth: "w-[81%]", segment: "vip",     note: "Weekday lunch regular"     },
  { name: "KaKa",   khmer: "កា កា",  phone: "123456789", visits: 8,  lastVisit: "3 days ago",  totalSpend: "$38",  ltv: "$96",  loyaltyScore: 52, loyaltyLabel: "Silver",   loyaltyBarWidth: "w-[52%]", segment: "new",     note: "Tourist, buys Mango Rice"  },
  { name: "NaNa",   khmer: "នា នា",  phone: "123456789", visits: 19, lastVisit: "12 days ago", totalSpend: "$88",  ltv: "$210", loyaltyScore: 38, loyaltyLabel: "Bronze",   loyaltyBarWidth: "w-[38%]", segment: "at-risk", note: "Used to come every Monday" },
  { name: "NeNe",   khmer: "នេ នេ",  phone: "123456789", visits: 3,  lastVisit: "45 days ago", totalSpend: "$12",  ltv: "$25",  loyaltyScore: 12, loyaltyLabel: "Bronze",   loyaltyBarWidth: "w-[12%]", segment: "dormant", note: "Only bought water bottles" },
];

const peakHours: PeakHour[] = [
  { hour: "8 AM",  predicted: 3,  actual: 3,    barClass: "w-[15%] bg-emerald-500",                                     isPredicted: false },
  { hour: "10 AM", predicted: 5,  actual: 5,    barClass: "w-1/4 bg-emerald-500",                                        isPredicted: false },
  { hour: "12 AM", predicted: 15, actual: 12,   barClass: "w-3/5 bg-emerald-500",                                        isPredicted: false },
  { hour: "2 PM",  predicted: 8,  actual: 7,    barClass: "w-[35%] bg-emerald-500",                                     isPredicted: false },
  { hour: "4 PM",  predicted: 12, actual: null, barClass: "w-3/5 bg-blue-100 border-2 border-dashed border-blue-300",   isPredicted: true  },
  { hour: "6 PM",  predicted: 18, actual: null, barClass: "w-9/10 bg-blue-100 border-2 border-dashed border-blue-300",  isPredicted: true  },
  { hour: "8 PM",  predicted: 14, actual: null, barClass: "w-[70%] bg-blue-100 border-2 border-dashed border-blue-300", isPredicted: true  },
];

const recentLogs: CustomerLog[] = [
  { time: "2:15 PM",  count: 2,  status: "Regular"      },
  { time: "10:00 AM", count: 2,  status: "Peak Traffic" },
  { time: "11:00 AM", count: 12, status: "Peak Traffic" },
];

const initChat: ChatMsg[] = [
  { role: "assistant", text: "សួស្តី! I'm your AI Customer Assistant. Ask me about your VIP customers, retention, or foot traffic patterns!" },
  { role: "assistant", text: "Try: 'Who are my VIP customers?' or 'How do I re-engage at-risk customers?'" },
];

const tabs: { id: TabId; label: string; khmer: string }[] = [
  { id: "analysis", label: "Customers Analysis",        khmer: "ការវិភាគអតិថិជន"          },
  { id: "forecast", label: "Forecast Analytics Widget", khmer: "ការព្យាករណ៍វិភាគទិន្នន័យ" },
  { id: "log",      label: "Customers Log",             khmer: "កំណត់ហេតុអតិថិជន"          },
];

// ─── NavItem ─────────────────────────────────────────────────────────────────

function NavItem({ icon: Icon, title, khmerTitle, active = false, href = "#", collapsed = false }: {
  icon: LucideIcon; title: string; khmerTitle: string; active?: boolean; href?: string; collapsed?: boolean;
}) {
  return (
    <Link href={href} className={`flex items-center px-3 py-2.5 rounded-xl transition-colors no-underline min-h-11 ${collapsed ? "justify-center" : "justify-between"} ${active ? "bg-emerald-500/20 text-emerald-400" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
      title={collapsed ? title : undefined}>
      <div className={`flex items-center ${collapsed ? "" : "gap-2.5"}`}>
        <Icon className={`w-4 h-4 shrink-0 ${active ? "text-emerald-400" : "text-gray-500"}`} />
        {!collapsed && <span className={`text-sm ${active ? "font-semibold" : "font-medium"}`}>{title}</span>}
      </div>
      {!collapsed && <span className="text-[10px] font-khmer text-gray-400">{khmerTitle}</span>}
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PremiumCustomersPage() {
  const [isSidebarOpen, setIsSidebarOpen]           = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab]         = useState<TabId>("analysis");
  const [logCount, setLogCount]           = useState(1);
  const [customCount, setCustomCount]     = useState(1);
  const [isChatOpen, setIsChatOpen]       = useState(false);
  const [isNotifOpen, setIsNotifOpen]     = useState(false);
  const [chatMessage, setChatMessage]     = useState("");
  const [chatMessages, setChatMessages]   = useState<ChatMsg[]>(initChat);
  const [dismissed, setDismissed]         = useState<number[]>([]);
  const [searchQuery, setSearchQuery]     = useState("");

  const visibleAlerts = pushAlerts.filter((_, i) => !dismissed.includes(i));

  const handleSend = () => {
    if (!chatMessage.trim()) return;
    setChatMessages((prev) => [...prev, { role: "user", text: chatMessage }]);
    setChatMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900">

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 bg-gray-950 border-r border-gray-800 transform transition-all duration-300 ease-in-out flex flex-col ${isSidebarCollapsed ? "w-16" : "w-52"} ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>

        {/* Logo */}
        <div className={`py-5 flex items-center border-b border-gray-800 ${isSidebarCollapsed ? "justify-center px-3" : "justify-between px-5"}`}>
          {isSidebarCollapsed ? (
            <Link href="/vendor" className="no-underline">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white text-sm">P</div>
            </Link>
          ) : (
            <Link href="/vendor" className="flex items-center gap-2.5 no-underline">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white text-sm">P</div>
              <span className="font-bold text-sm tracking-tight text-white">PsarPulse KH</span>
            </Link>
          )}
          <button className="lg:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5 [&::-webkit-scrollbar]:hidden">
          <NavItem icon={LayoutDashboard}  title="Dashboard"  khmerTitle="ផ្ទាំងគ្រប់គ្រង" href="/vendor/premium"       collapsed={isSidebarCollapsed} />
          <NavItem icon={CircleDollarSign} title="Sales"      khmerTitle="ការលក់"           href="/vendor/premium/sales" collapsed={isSidebarCollapsed} />
          <NavItem icon={Receipt}          title="Expenses"   khmerTitle="ចំណាយ"            href="/vendor/expenses"      collapsed={isSidebarCollapsed} />
          <NavItem icon={Users}            title="Customers"  khmerTitle="អតិថិជន"          href="/vendor/customer"  active collapsed={isSidebarCollapsed} />
          <NavItem icon={Package}          title="Inventory"  khmerTitle="ស្តុក"            href="/vendor/inventory"     collapsed={isSidebarCollapsed} />
          <NavItem icon={FileBarChart}     title="Reports"    khmerTitle="របាយការណ៍"        href="/vendor/reports"       collapsed={isSidebarCollapsed} />
        </nav>

        {/* Bottom: Premium badge + User */}
        <div className="p-2 border-t border-gray-800 space-y-1">
          {isSidebarCollapsed ? (
            <Link href="/vendor/pricing" className="no-underline flex items-center justify-center w-full p-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors" title="Premium Plan">
              <Sparkles className="w-4 h-4 text-white" />
            </Link>
          ) : (
            <Link href="/vendor/pricing" className="no-underline flex items-center gap-2 w-full px-3 py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors">
              <Sparkles className="w-4 h-4 text-white shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white leading-none">Premium Plan</p>
                <p className="text-[10px] text-emerald-100 mt-0.5">AI Assistant Active</p>
              </div>
            </Link>
          )}
          <NavItem icon={User} title="User" khmerTitle="អ្នកប្រើ" href="/vendor/profile" collapsed={isSidebarCollapsed} />
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col w-full min-w-0 bg-slate-100">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile: open sidebar overlay */}
            <button className="lg:hidden text-slate-500" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            {/* Desktop: collapse/expand sidebar */}
            <button
              className="hidden lg:flex items-center justify-center p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarCollapsed((c) => !c)}
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed
                ? <PanelLeftOpen className="w-5 h-5" />
                : <PanelLeftClose className="w-5 h-5" />
              }
            </button>
            <span className="font-semibold text-sm text-slate-700">Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-3.5 py-2 rounded-xl text-sm transition-colors">
              <Zap className="w-3.5 h-3.5" /> Quick sale
            </button>
            <button className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium px-3.5 py-2 rounded-xl text-sm transition-colors">
              <FileText className="w-3.5 h-3.5" /> Export PDF
            </button>
            <button className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-3.5 py-2 rounded-xl text-sm transition-colors">
              <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
            </button>
            {/* Bell + notification dropdown */}
            <div className="relative">
              <button onClick={() => setIsNotifOpen((o) => !o)} className="p-2 text-slate-400 hover:text-slate-900 relative">
                <Bell className="w-5 h-5" />
                {visibleAlerts.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                )}
              </button>
              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-slate-900">Notifications</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{visibleAlerts.length} unread</p>
                      </div>
                      <button onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="max-h-120 overflow-y-auto divide-y divide-slate-100">
                      {visibleAlerts.length === 0 ? (
                        <div className="px-5 py-10 text-center">
                          <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                          <p className="text-sm text-slate-400">No new notifications</p>
                        </div>
                      ) : (
                        visibleAlerts.map((alert, i) => {
                          const Icon = alert.icon;
                          const c    = alertColorMap[alert.color];
                          const orig = pushAlerts.indexOf(alert);
                          return (
                            <div key={i} className={`flex items-start gap-3 px-5 py-4 ${c.bg}`}>
                              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${c.iconBg}`}>
                                <Icon className={`w-4 h-4 ${c.iconText}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-[13px] font-bold ${c.titleText}`}>{alert.title}</p>
                                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{alert.message}</p>
                                <p className="text-[11px] text-slate-400 mt-1">{alert.time}</p>
                              </div>
                              <button onClick={() => setDismissed((d) => [...d, orig])}
                                className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 px-2 py-1 rounded-lg hover:bg-white/60 transition-colors shrink-0 mt-0.5">
                                Dismiss
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                    {visibleAlerts.length > 0 && (
                      <div className="px-5 py-3 border-t border-slate-100">
                        <button onClick={() => { setDismissed(pushAlerts.map((_, i) => i)); setIsNotifOpen(false); }}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                          Dismiss all
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Sticky sub-header: title + search + tabs */}
        <div className="bg-slate-100 sticky top-14 z-20 px-6 md:px-8 pt-6 pb-0">
          {/* Page title + search */}
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <h1 className="text-[28px] font-bold text-slate-900 leading-tight">My Customers</h1>
              <p className="text-sm text-slate-500 mt-0.5">Tracker and Log your daily foot traffic</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:bg-white focus:border-gray-400 outline-none w-52 text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-end gap-0 border-b border-slate-200 bg-slate-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px flex flex-col items-start gap-0.5 ${
                  activeTab === tab.id
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-khmer text-slate-400">{tab.khmer}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Page content — only this scrolls */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">

          {/* ── Tab: Customers Analysis ─────────────────────────────────────── */}
          {activeTab === "analysis" && (
            <div className="space-y-5">

              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-sm">
                  <p className="text-xs font-semibold text-slate-400">Today Customer</p>
                  <p className="text-[10px] font-khmer text-slate-500 mt-0.5">អតិថិជនថ្ងៃនេះ</p>
                  <p className="text-4xl font-bold mt-2">48</p>
                  <p className="text-[11px] text-slate-400 mt-1">4 logs</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500">Avg.Spend</p>
                  <p className="text-[10px] font-khmer text-slate-500 mt-0.5">ការចំណាយជាមធ្យម</p>
                  <p className="text-[26px] font-bold text-slate-900 mt-2">$5.45</p>
                  <p className="text-[11px] text-slate-400 mt-1">per customer</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500 text-white shadow-sm">
                  <p className="text-xs font-semibold text-white/80">Weekly Customer</p>
                  <p className="text-[10px] font-khmer text-white/60 mt-0.5">អតិថិជនប្រចាំសប្តាហ៍</p>
                  <p className="text-4xl font-bold mt-2">315</p>
                  <p className="text-[11px] text-white/70 mt-1">+27% then last week</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500">Peak Time</p>
                  <p className="text-[10px] font-khmer text-slate-500 mt-0.5">វេលាមមានម្ចាស់</p>
                  <p className="text-xl font-bold text-slate-900 mt-2">12:10 PM</p>
                  <p className="text-[11px] text-slate-500 mt-1">15 Customer</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500">Avg.LTV</p>
                  <p className="text-[10px] font-khmer text-slate-500 mt-0.5">តម្លៃអតិថិជន</p>
                  <p className="text-[26px] font-bold text-slate-900 mt-2">$102.02</p>
                  <p className="text-[11px] text-slate-400 mt-1">Per Customer</p>
                </div>
              </div>

              {/* Log Customers */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base">Log Customers</h3>
                  <p className="text-slate-300 text-sm font-khmer">កត់ត្រាអតិថិជន</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {([1, 5, 10] as const).map((n) => (
                    <button key={n} onClick={() => setLogCount(n)}
                      className={`w-11 h-11 rounded-xl font-bold text-sm transition-all ${logCount === n ? "bg-emerald-500 text-white scale-105" : "bg-white/10 hover:bg-white/20"}`}>
                      +{n}
                    </button>
                  ))}
                  <div className="flex items-center bg-white/10 rounded-xl overflow-hidden">
                    <button onClick={() => setCustomCount((c) => Math.max(1, c - 1))} className="px-2.5 py-2.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-sm">−</button>
                    <span className="px-2 text-sm font-bold min-w-8 text-center">{customCount}</span>
                    <button onClick={() => setCustomCount((c) => c + 1)} className="px-2.5 py-2.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-sm">+</button>
                  </div>
                  <button className="px-3 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors">Custom...</button>
                  <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
                    <Plus className="w-4 h-4" /> Log {logCount}
                  </button>
                </div>
              </div>

              {/* AI Customer Segments */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">AI Customer Segment</h3>
                    <p className="text-[11px] font-khmer text-slate-500 mt-0.5">ការចាត់ក្រុមអតិថិជន · Auto Classified by Gemini AI</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
                    <Brain className="w-3 h-3" /> AI
                  </span>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {customerSegments.map((seg, i) => {
                    const c = segmentColorMap[seg.type];
                    const icons: Record<SegmentType, LucideIcon> = {
                      vip: Star, "at-risk": AlertTriangle, new: Users2, dormant: Clock,
                    };
                    const SegIcon = icons[seg.type];
                    return (
                      <div key={i} className={`p-5 rounded-xl border ${c.bg} ${c.border}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2 rounded-lg ${c.iconBg}`}>
                            <SegIcon className={`w-4 h-4 ${c.iconText}`} />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge}`}>
                            {seg.label}
                          </span>
                        </div>
                        <p className={`text-[32px] font-bold ${c.countText}`}>{seg.count}</p>
                        <p className={`text-sm font-semibold mt-0.5 ${seg.type === "vip" ? "text-white" : "text-slate-700"}`}>{seg.label} Customers</p>
                        <p className={`text-[11px] font-khmer mt-0.5 ${seg.type === "vip" ? "text-gray-300" : "text-slate-500"}`}>{seg.khmer}</p>
                        <p className={`text-[11px] mt-2 leading-relaxed ${seg.type === "vip" ? "text-gray-400" : "text-slate-500"}`}>{seg.description}</p>
                        <button className={`mt-3 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors w-full ${c.iconBg} ${c.iconText} hover:opacity-80`}>
                          {seg.action} →
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ── Tab: Forecast Analytics Widget ──────────────────────────────── */}
          {activeTab === "forecast" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* Peak Hour Forecast */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-gray-100 rounded-xl"><Activity className="w-5 h-5 text-gray-600" /></div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Peak Hour Forecast</h3>
                    <p className="text-[11px] font-khmer text-slate-500 mt-0.5">ការព្យាករណ៍ម៉ោងមមានម្ចាស់</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {peakHours.map((h, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500 w-14 shrink-0">{h.hour}</span>
                      <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                        <div className={`h-full rounded-lg ${h.barClass}`} />
                        {h.isPredicted && (
                          <span className="absolute inset-0 flex items-center pl-3 text-[10px] font-semibold text-blue-600">
                            Prediction : {h.predicted}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-700 w-8 text-right shrink-0">
                        {h.actual !== null ? h.actual : `-${h.predicted}`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5"><div className="w-4 h-2 rounded-sm bg-emerald-500" />Actual</div>
                  <div className="flex items-center gap-1.5"><div className="w-4 h-2 rounded-sm bg-blue-100 border border-dashed border-blue-300" />AI Prediction</div>
                </div>
              </div>

              {/* Weekly Customer Trend */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Weekly Customer Trend</h3>
                    <p className="text-[11px] font-khmer text-slate-500 mt-0.5">ចំនួនអតិថិជនប្រចាំសប្តាហ៍</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-500">+ 12%</span>
                </div>
                <div className="flex items-end gap-2 h-36 mb-3">
                  {weeklyBarHeights.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className={`w-full rounded-t-lg transition-all ${i === 5 || i === 6 ? "bg-emerald-500" : "bg-slate-200 hover:bg-slate-300"} ${h}`} />
                    </div>
                  ))}
                </div>
                <div className="flex items-end justify-between gap-1 mb-4">
                  {trendLabels.map((label, i) => (
                    <span key={i} className="flex-1 text-center text-[9px] text-slate-400 font-medium truncate">{label}</span>
                  ))}
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-emerald-700">AI Insight:</strong> Weekend (Sat+Sun) accounts for 52% of weekly customers. Consider extending hours Friday evening to capture early weekend traffic.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ── Tab: Customers Log ──────────────────────────────────────────── */}
          {activeTab === "log" && (
            <div className="space-y-5">

              {/* CRM Profiles */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">CRM Profiles</h3>
                    <p className="text-xs text-slate-500 mt-0.5">5 Profiles · AI Loyalty Score · Purchase patterns</p>
                  </div>
                  <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors">
                    <Plus className="w-4 h-4" /> Add Customer
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone</th>
                        <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Visited</th>
                        <th className="text-right px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Spend</th>
                        <th className="text-right px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">LTV</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">AI Loyalty Score</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Segment</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {crmProfiles.map((p, i) => {
                        const seg      = segmentColorMap[p.segment];
                        const loyEntry = loyaltyColorMap[p.loyaltyLabel] ?? { badge: "text-slate-500 bg-slate-100 border-slate-200", bar: "bg-slate-300" };
                        return (
                          <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                              <p className="text-[11px] font-khmer text-slate-600">{p.khmer}</p>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-[13px] text-slate-500">{p.phone}</span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className="text-sm font-bold text-slate-900">{p.visits}</span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <span className="text-sm font-semibold text-slate-700">{p.totalSpend}</span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <span className="text-sm font-bold text-emerald-600">{p.ltv}</span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${loyEntry.bar} ${p.loyaltyBarWidth}`} />
                                </div>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${loyEntry.badge}`}>
                                  {p.loyaltyLabel}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${seg.badge}`}>
                                {p.segment === "at-risk" ? "At-Risk" : p.segment.charAt(0).toUpperCase() + p.segment.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <p className="text-xs text-slate-500 max-w-32 truncate">{p.note}</p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Customer Logs */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Recent Customer Logs</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Today's recorded foot traffic</p>
                  </div>
                  <span className="text-sm font-bold text-slate-700">Total: <span className="text-emerald-500">22</span></span>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Time Logged</th>
                      <th className="text-left px-16 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Count</th>
                      <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map((log, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">{log.time}</span>
                        </td>
                        <td className="px-16 py-4">
                          <span className="text-base font-bold text-slate-900">+{log.count}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            log.status === "Peak Traffic"
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {log.status === "Peak Traffic" && <Flame className="w-3 h-3" />}
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-6 py-4 border-t border-slate-100 text-center">
                  <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 mx-auto transition-colors">
                    <History className="w-4 h-4" /> View Full History
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* ── AI Chatbot FAB ── */}
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
                <p className="font-bold text-sm">AI Customer Assistant</p>
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
              <input type="text" placeholder="Ask about your customers..." value={chatMessage}
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