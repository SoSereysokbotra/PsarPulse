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
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AlertColor    = "purple" | "orange" | "red" | "green" | "emerald";
type BehaviorColor = "amber" | "emerald" | "blue" | "purple";
type TrafficStatus = "Regular" | "Peak Traffic";
type SegmentType   = "vip" | "at-risk" | "new" | "dormant";

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
interface BehaviorInsight {
  label: string; value: string; icon: LucideIcon;
  color: BehaviorColor; detail: string;
}
interface RetentionStage {
  stage: string; count: number; pct: number; barWidth: string; barColor: string;
}
interface CustomerLog {
  time: string; count: number; status: TrafficStatus;
}
interface ChatMsg { role: "assistant" | "user"; text: string; }

// ─── Color Maps ───────────────────────────────────────────────────────────────

const alertColorMap: Record<AlertColor, {
  bg: string; border: string; iconBg: string; iconText: string; titleText: string;
}> = {
  purple:  { bg: "bg-gray-50",     border: "border-gray-200",   iconBg: "bg-gray-100",     iconText: "text-gray-600",   titleText: "text-gray-700"   },
  orange:  { bg: "bg-gray-50",     border: "border-gray-200",   iconBg: "bg-gray-100",     iconText: "text-gray-600",   titleText: "text-gray-700"   },
  red:     { bg: "bg-red-50",      border: "border-red-200",    iconBg: "bg-red-100",      iconText: "text-red-600",    titleText: "text-red-700"    },
  green:   { bg: "bg-emerald-50",  border: "border-emerald-200",iconBg: "bg-emerald-100",  iconText: "text-emerald-600",titleText: "text-emerald-700"},
  emerald: { bg: "bg-emerald-50",  border: "border-emerald-200",iconBg: "bg-emerald-100",  iconText: "text-emerald-600",titleText: "text-emerald-700"},
};

const behaviorColorMap: Record<BehaviorColor, {
  bg: string; border: string; iconText: string; valText: string;
}> = {
  amber:   { bg: "bg-gray-50",    border: "border-gray-100",    iconText: "text-gray-500",    valText: "text-gray-700"    },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-100", iconText: "text-emerald-500", valText: "text-emerald-600" },
  blue:    { bg: "bg-gray-50",    border: "border-gray-100",    iconText: "text-gray-500",    valText: "text-gray-700"    },
  purple:  { bg: "bg-gray-50",    border: "border-gray-100",    iconText: "text-gray-500",    valText: "text-gray-700"    },
};

const segmentColorMap: Record<SegmentType, {
  bg: string; border: string; iconBg: string; iconText: string;
  badge: string; countText: string;
}> = {
  "vip":      { bg: "bg-gray-900",   border: "border-gray-700",    iconBg: "bg-gray-700",    iconText: "text-white",       badge: "bg-gray-800 text-white",         countText: "text-white"       },
  "at-risk":  { bg: "bg-red-50",     border: "border-red-200",     iconBg: "bg-red-100",     iconText: "text-red-600",     badge: "bg-red-100 text-red-700",        countText: "text-red-600"     },
  "new":      { bg: "bg-emerald-50", border: "border-emerald-200", iconBg: "bg-emerald-100", iconText: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700",countText: "text-emerald-600" },
  "dormant":  { bg: "bg-slate-50",   border: "border-slate-200",   iconBg: "bg-slate-100",   iconText: "text-slate-500",   badge: "bg-slate-100 text-slate-600",    countText: "text-slate-500"   },
};

const loyaltyColorMap: Record<string, { badge: string; bar: string }> = {
  Platinum: { badge: "text-violet-700 bg-violet-50 border-violet-200",  bar: "bg-violet-500"  },
  Gold:     { badge: "text-amber-700 bg-amber-50 border-amber-200",     bar: "bg-amber-400"   },
  Silver:   { badge: "text-blue-600 bg-blue-50 border-blue-200",        bar: "bg-blue-400"    },
  Bronze:   { badge: "text-orange-600 bg-orange-50 border-orange-200",  bar: "bg-orange-400"  },
};

// Tailwind-safe bar heights
const weeklyBarHeights = ["h-14", "h-18", "h-12", "h-20", "h-16", "h-28", "h-24"] as const;
const trendLabels      = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]        as const;

// ─── Static Data ──────────────────────────────────────────────────────────────

// SRS: "VIP customer hasn't visited in 5 days" style notifications
const pushAlerts: PushAlert[] = [
  {
    title: "VIP Customer Alert",
    message: "Sophea (VIP) hasn't visited in 5 days — she usually comes every 2 days. Consider sending a special offer.",
    time: "1 hour ago", icon: Star, color: "purple",
  },
  {
    title: "At-Risk Customers",
    message: "3 customers who visited regularly last month haven't returned in 2+ weeks. They may be at risk of churning.",
    time: "This morning", icon: AlertTriangle, color: "orange",
  },
  {
    title: "Sales Drop Alert",
    message: "Customer count is 15% below your usual Saturday average by this time. Consider a promotional push.",
    time: "Just now", icon: TrendingDown, color: "red",
  },
  {
    title: "Best Seller This Week",
    message: "Iced Coffee Combo is your top item — 87 orders this week, making up 34% of total sales. Stock up on ingredients before the weekend rush.",
    time: "Updated today", icon: ShoppingCart, color: "green",
  },
  {
    title: "Revenue Up 30% vs Last Week",
    message: "You earned 30% more than the same period last week. Strong weekend foot traffic and repeat VIP visits drove the increase. Keep it up.",
    time: "This week", icon: TrendingUp, color: "emerald",
  },
];

// SRS: AI Customer Segments — VIP / At-Risk / New / Dormant
const customerSegments: CustomerSegment[] = [
  {
    type: "vip",
    label: "VIP",
    khmer: "អតិថិជន VIP",
    count: 12,
    description: "3+ visits/week · avg $8+ spend · loyal for 3+ months",
    action: "Send reward",
  },
  {
    type: "at-risk",
    label: "At-Risk",
    khmer: "ហានិភ័យ",
    count: 8,
    description: "Were regulars but haven't visited in 10+ days",
    action: "Re-engage now",
  },
  {
    type: "new",
    label: "New",
    khmer: "អតិថិជនថ្មី",
    count: 6,
    description: "First visit in last 7 days — needs nurturing",
    action: "Welcome offer",
  },
  {
    type: "dormant",
    label: "Dormant",
    khmer: "អសកម្ម",
    count: 15,
    description: "No visit in 30+ days — may have churned",
    action: "Win back",
  },
];

// SRS: CRM table enhanced with AI Loyalty Score column
const crmProfiles: CRMProfile[] = [
  { name: "Sophea Chan",  khmer: "សុភា ចាន់",  phone: "012 345 678", visits: 42, lastVisit: "5 days ago",  totalSpend: "$210", ltv: "$620", loyaltyScore: 94, loyaltyLabel: "Platinum", loyaltyBarWidth: "w-[94%]", segment: "vip",     note: "Loves Iced Coffee combo"  },
  { name: "Dara Meas",    khmer: "ដារ៉ា មាស",   phone: "011 234 567", visits: 28, lastVisit: "2 days ago",  totalSpend: "$145", ltv: "$390", loyaltyScore: 81, loyaltyLabel: "Gold",     loyaltyBarWidth: "w-[81%]", segment: "vip",     note: "Weekday lunch regular"    },
  { name: "Bopha Keo",    khmer: "បុប្ផា គែ",   phone: "096 789 012", visits: 8,  lastVisit: "3 days ago",  totalSpend: "$38",  ltv: "$95",  loyaltyScore: 52, loyaltyLabel: "Silver",   loyaltyBarWidth: "w-[52%]", segment: "new",     note: "Tourist, buys Mango Rice" },
  { name: "Rith Pov",     khmer: "រិទ្ធ ពូ",    phone: "078 567 890", visits: 19, lastVisit: "12 days ago", totalSpend: "$88",  ltv: "$210", loyaltyScore: 38, loyaltyLabel: "Bronze",   loyaltyBarWidth: "w-[38%]", segment: "at-risk", note: "Used to come every Monday"},
  { name: "Maly Noun",    khmer: "មាលី នួន",   phone: "089 123 456", visits: 3,  lastVisit: "45 days ago", totalSpend: "$12",  ltv: "$25",  loyaltyScore: 12, loyaltyLabel: "Bronze",   loyaltyBarWidth: "w-[12%]", segment: "dormant", note: "Only bought water bottles"},
];

const peakHours: PeakHour[] = [
  { hour: "8 AM",  predicted: 3,  actual: 3,    barClass: "w-[15%] bg-emerald-500", isPredicted: false },
  { hour: "10 AM", predicted: 5,  actual: 5,    barClass: "w-1/4 bg-emerald-500", isPredicted: false },
  { hour: "12 PM", predicted: 15, actual: 12,   barClass: "w-3/5 bg-emerald-500", isPredicted: false },
  { hour: "2 PM",  predicted: 8,  actual: 7,    barClass: "w-[35%] bg-emerald-500", isPredicted: false },
  { hour: "4 PM",  predicted: 12, actual: null, barClass: "w-3/5 bg-gray-200 border-2 border-dashed border-gray-400", isPredicted: true  },
  { hour: "6 PM",  predicted: 18, actual: null, barClass: "w-9/10 bg-gray-200 border-2 border-dashed border-gray-400", isPredicted: true  },
  { hour: "8 PM",  predicted: 14, actual: null, barClass: "w-[70%] bg-gray-200 border-2 border-dashed border-gray-400", isPredicted: true  },
];

const behaviorInsights: BehaviorInsight[] = [
  { label: "Regulars (3+ visits/week)", value: "38%",      icon: Star,         color: "amber",   detail: "83 repeat customers this week"   },
  { label: "New customers today",       value: "6",        icon: Users2,       color: "emerald", detail: "27% of today's foot traffic"     },
  { label: "Avg visit duration",        value: "12 min",   icon: Clock,        color: "blue",    detail: "Up 3 min vs last week"           },
  { label: "Peak days",                 value: "Sat & Sun",icon: CalendarDays, color: "purple",  detail: "Weekend = 52% of weekly traffic" },
];

const retentionFunnel: RetentionStage[] = [
  { stage: "Walk-bys",             count: 340, pct: 100, barWidth: "w-full",   barColor: "bg-slate-700"    },
  { stage: "Stopped",              count: 180, pct: 53,  barWidth: "w-[53%]",  barColor: "bg-blue-500"     },
  { stage: "Purchased",            count: 124, pct: 36,  barWidth: "w-[36%]",  barColor: "bg-emerald-500"  },
  { stage: "Returned (3+ visits)", count: 83,  pct: 24,  barWidth: "w-[24%]",  barColor: "bg-violet-500"   },
];

const recentLogs: CustomerLog[] = [
  { time: "2:30 PM",  count: 2,  status: "Regular"      },
  { time: "1:45 PM",  count: 5,  status: "Peak Traffic" },
  { time: "12:15 PM", count: 12, status: "Peak Traffic" },
  { time: "11:00 AM", count: 3,  status: "Regular"      },
];

const initChat: ChatMsg[] = [
  { role: "assistant", text: "សួស្តី! I'm your AI Customer Assistant. Ask me about your VIP customers, retention, or foot traffic patterns!" },
  { role: "assistant", text: "Try: 'Who are my VIP customers?' or 'How do I re-engage at-risk customers?'" },
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

export default function PremiumCustomersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logCount, setLogCount]           = useState(1);
  const [isChatOpen, setIsChatOpen]       = useState(false);
  const [isNotifOpen, setIsNotifOpen]     = useState(false);
  const [chatMessage, setChatMessage]     = useState("");
  const [chatMessages, setChatMessages]   = useState<ChatMsg[]>(initChat);
  const [dismissed, setDismissed]         = useState<number[]>([]);

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
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5 [&::-webkit-scrollbar]:hidden">
          <NavItem icon={LayoutDashboard}  title="Dashboard"  khmerTitle="ផ្ទាំងគ្រប់គ្រង" href="/vendor/premium"       />
          <NavItem icon={CircleDollarSign} title="Sales"      khmerTitle="ការលក់"           href="/vendor/premium/sales" />
          <NavItem icon={Receipt}          title="Expenses"   khmerTitle="ចំណាយ"            href="/vendor/expenses"      />
          <NavItem icon={Users}            title="Customers"  khmerTitle="អតិថិជន"          href="/vendor/customer"  active />
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
            <Link href="/vendor/pricing" className="block w-full text-center text-xs font-bold text-gray-300 hover:text-white bg-white/10 hover:bg-white/15 py-1.5 rounded-lg transition-colors no-underline">
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
              <h1 className="text-[22px] font-bold text-slate-900">Customers</h1>
              <span className="text-slate-400">·</span>
              <span className="text-sm font-khmer text-slate-600">ការគ្រប់គ្រងអតិថិជន</span>
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
            <div className="relative">
              <button onClick={() => setIsNotifOpen((o) => !o)} className="p-2 text-slate-400 hover:text-slate-900 relative">
                <Bell className="w-5 h-5" />
                {visibleAlerts.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
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
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold border border-gray-200 text-sm">SM</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">

          {/* AI Banner */}
          <div className="bg-gray-900 rounded-2xl p-5 shadow-lg text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl"><Brain className="w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-[17px]">AI Customer Intelligence Active</h3>
                <p className="text-gray-400 text-sm mt-0.5">AI Segments · Loyalty Scores · LTV tracking · Retention insights</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 rounded-xl text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-semibold">Premium Active</span>
            </div>
          </div>

          {/* ② 5 Metric Cards — SRS: 4 cards + Lifetime Value (LTV) premium-exclusive 5th */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-400">Today's Customers</p>
                <Users className="w-4 h-4 text-slate-500" />
              </div>
              <p className="text-[10px] font-khmer text-slate-600 mb-3">អតិថិជនថ្ងៃនេះ</p>
              <p className="text-4xl font-bold">22</p>
              <p className="text-[11px] text-slate-400 mt-1">4 logs</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-500">Avg. Spend</p>
                <CircleDollarSign className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-[10px] font-khmer text-slate-600 mb-3">ការចំណាយជាមធ្យម</p>
              <p className="text-[28px] font-bold text-slate-900">$5.66</p>
              <p className="text-[11px] text-slate-400 mt-1">per customer</p>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-500 text-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-white/80">Weekly</p>
                <TrendingUp className="w-4 h-4 text-white/60" />
              </div>
              <p className="text-[10px] font-khmer text-white/60 mb-3">អតិថិជនប្រចាំសប្តាហ៍</p>
              <p className="text-4xl font-bold">315</p>
              <p className="text-[11px] text-white/70 mt-1">+12% vs last week</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-500">Peak Time</p>
                <Flame className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-[10px] font-khmer text-slate-600 mb-3">វេលាមមានម្ចាស់</p>
              <p className="text-2xl font-bold text-slate-900">12:15 PM</p>
              <p className="text-[11px] text-gray-500 font-semibold mt-1">12 customers</p>
            </div>
            {/* SRS: Lifetime Value (LTV) — premium-exclusive 5th card */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-1 mb-1">
                <Brain className="w-3.5 h-3.5 text-gray-500" />
                <p className="text-[11px] font-bold text-gray-700">Avg LTV</p>
              </div>
              <p className="text-[10px] font-khmer text-gray-500 mb-3">តម្លៃអតិថិជន</p>
              <p className="text-[28px] font-bold text-gray-900">$268</p>
              <p className="text-[11px] text-gray-500 mt-1">per customer</p>
            </div>
          </div>

          {/* Log Customers */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base">Log Customers</h3>
              <p className="text-slate-300 text-sm font-khmer">កត់ត្រាអតិថិជន · Fast entry</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {([1, 5, 10] as const).map((n) => (
                <button key={n} onClick={() => setLogCount(n)}
                  className={`w-12 h-12 rounded-xl font-bold text-[15px] transition-all ${logCount === n ? "bg-emerald-500 text-white scale-105" : "bg-white/10 hover:bg-white/20"}`}>
                  +{n}
                </button>
              ))}
              <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-2">
                <button onClick={() => setLogCount((c) => Math.max(1, c - 1))} className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white">−</button>
                <span className="w-8 text-center font-bold text-[15px]">{logCount}</span>
                <button onClick={() => setLogCount((c) => c + 1)} className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white">+</button>
              </div>
              <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-[15px] min-h-11">
                <Plus className="w-4 h-4" /> Log {logCount}
              </button>
            </div>
          </div>

          {/* ③ AI Customer Segments — SRS: VIP / At-Risk / New / Dormant cards */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-xl"><Users2 className="w-5 h-5 text-gray-600" /></div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">AI Customer Segments</h3>
                  <p className="text-[11px] font-khmer text-slate-500 mt-0.5">ការចាត់ក្រុមអតិថិជន · Auto-classified by AI</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
                <Brain className="w-3 h-3" /> AI
              </span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      <p className="text-[13px] font-semibold text-slate-700 mt-0.5">{seg.label} Customers</p>
                      <p className="text-[11px] font-khmer text-slate-500">{seg.khmer}</p>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{seg.description}</p>
                      <button className={`mt-3 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors w-full ${c.iconBg} ${c.iconText} hover:opacity-80`}>
                        {seg.action} →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ④ Gemini Insight Panel — SRS: Gemini Insight panel for customer trends */}
          <div className="bg-gray-900 rounded-2xl p-6 text-white border border-gray-700">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-emerald-500/20 rounded-xl"><Sparkles className="w-5 h-5 text-emerald-400" /></div>
              <div>
                <h3 className="font-bold text-base">Gemini Customer Insights</h3>
                <p className="text-gray-300 text-xs mt-0.5 font-khmer">ការវិភាគអតិថិជន · Powered by Gemini AI</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                <Star className="w-5 h-5 text-gray-300 mb-2" />
                <p className="text-[13px] font-bold">Top VIP: Sophea Chan</p>
                <p className="text-xs text-gray-400 mt-1">42 visits · $620 LTV · hasn't visited in 5 days. Send a personal message to bring her back.</p>
                <button className="mt-2 text-[11px] font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
                  Send offer →
                </button>
              </div>
              <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                <AlertTriangle className="w-5 h-5 text-gray-400 mb-2" />
                <p className="text-[13px] font-bold">8 At-Risk Customers</p>
                <p className="text-xs text-gray-400 mt-1">All were weekday regulars. Historically, a discount offer re-engages 60% of at-risk customers within 3 days.</p>
                <button className="mt-2 text-[11px] font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
                  Create campaign →
                </button>
              </div>
              <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                <TrendingUp className="w-5 h-5 text-emerald-300 mb-2" />
                <p className="text-[13px] font-bold">Weekend Opportunity</p>
                <p className="text-xs text-gray-400 mt-1">Saturday & Sunday drive 52% of weekly customers. AI suggests a weekend combo deal could increase avg spend by $1.20.</p>
                <button className="mt-2 text-[11px] font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
                  View suggestion →
                </button>
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-gray-300">
                <strong>Gemini Weekly Summary:</strong> Your customer base grew 12% this week. VIP retention is strong at 92%, but 8 at-risk customers need immediate attention. Peak engagement window is Sat 12–2 PM.
              </p>
            </div>
          </div>

          {/* Peak Hour + Weekly Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-xl"><Activity className="w-5 h-5 text-gray-600" /></div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Peak Hour Forecast</h3>
                    <p className="text-[11px] font-khmer text-slate-500 mt-0.5">ការព្យាករណ៍ម៉ោងមមានម្ចាស់</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
                  <Brain className="w-3 h-3" /> AI
                </span>
              </div>
              <div className="p-5 space-y-3">
                {peakHours.map((h, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 w-14 shrink-0">{h.hour}</span>
                    <div className="flex-1 h-7 bg-slate-100 rounded-lg overflow-hidden relative">
                      <div className={`h-full rounded-lg ${h.barClass}`} />
                      {h.isPredicted && (
                        <span className="absolute inset-0 flex items-center pl-3 text-[10px] font-bold text-gray-500">
                          Predicted: {h.predicted}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-8 text-right shrink-0">
                      {h.actual !== null ? h.actual : `~${h.predicted}`}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5"><div className="w-4 h-2 rounded-sm bg-emerald-500" />Actual</div>
                  <div className="flex items-center gap-1.5"><div className="w-4 h-2 rounded-sm bg-gray-200 border border-dashed border-gray-400" />AI Predicted</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Weekly Customer Trend</h3>
                  <p className="text-[11px] font-khmer text-slate-500 mt-0.5">ចំនួនអតិថិជនប្រចាំសប្តាហ៍</p>
                </div>
                <span className="text-sm font-bold text-emerald-500">+12% ↑</span>
              </div>
              <div className="flex items-end gap-3 h-36 mb-4">
                {weeklyBarHeights.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className={`w-full rounded-t-lg transition-all ${i === 5 || i === 6 ? "bg-emerald-500" : "bg-slate-100 hover:bg-slate-200"} ${h}`} />
                    <span className="text-[10px] text-slate-400 font-medium">{trendLabels[i]}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-slate-600">
                  <strong className="text-gray-900">AI Insight:</strong> Weekend (Sat+Sun) accounts for 52% of weekly customers. Consider extending hours Friday evening to capture early weekend traffic.
                </p>
              </div>
            </div>
          </div>

          {/* Behavior Insights + Retention Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-gray-100 rounded-xl"><Brain className="w-5 h-5 text-gray-600" /></div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Customer Behavior Insights</h3>
                  <p className="text-[11px] font-khmer text-slate-500 mt-0.5">ការយល់ដឹងអំពីអតិថិជន</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {behaviorInsights.map((b, i) => {
                  const Icon = b.icon;
                  const c    = behaviorColorMap[b.color];
                  return (
                    <div key={i} className={`p-4 rounded-xl border ${c.bg} ${c.border}`}>
                      <Icon className={`w-4 h-4 mb-2 ${c.iconText}`} />
                      <p className="text-xs font-semibold text-slate-500">{b.label}</p>
                      <p className={`text-[22px] font-bold mt-1 ${c.valText}`}>{b.value}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{b.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-gray-100 rounded-xl"><Target className="w-5 h-5 text-gray-600" /></div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Customer Retention Funnel</h3>
                  <p className="text-[11px] font-khmer text-slate-500 mt-0.5">ទំនាក់ទំនងអតិថិជន</p>
                </div>
              </div>
              <div className="space-y-3">
                {retentionFunnel.map((stage, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-semibold text-slate-700">{stage.stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{stage.count}</span>
                        <span className="text-[11px] text-slate-400">{stage.pct}%</span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${stage.barColor} ${stage.barWidth}`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-slate-600">
                  <strong className="text-gray-900">AI Tip:</strong> 36% conversion rate is strong! Focus on turning "Stopped" visitors into buyers — consider a visible menu board at eye level.
                </p>
              </div>
            </div>
          </div>

          {/* ⑤ CRM Table — SRS: enhanced with AI Loyalty Score column + purchase patterns */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">CRM Profiles</h3>
                <p className="text-xs text-slate-400 mt-0.5">5 profiles · AI Loyalty Score · Purchase patterns</p>
              </div>
              <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-medium px-3.5 py-2 rounded-xl text-sm transition-colors">
                <Plus className="w-4 h-4" /> Add Customer
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone</th>
                    <th className="text-right px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Visits</th>
                    <th className="text-right px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Spend</th>
                    <th className="text-right px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">LTV</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">AI Loyalty Score</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Segment</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {crmProfiles.map((p, i) => {
                    const seg = segmentColorMap[p.segment];
                    const loyEntry = loyaltyColorMap[p.loyaltyLabel] ?? { badge: "text-slate-500 bg-slate-100 border-slate-200", bar: "bg-slate-300" };
                    return (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                          <p className="text-[11px] font-khmer text-slate-500">{p.khmer}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Last: {p.lastVisit}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 text-[13px] text-slate-500">
                            <Phone className="w-3 h-3" /> {p.phone}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm font-bold text-slate-900">{p.visits}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-[13px] font-semibold text-slate-700">{p.totalSpend}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-[13px] font-bold text-emerald-600">{p.ltv}</span>
                        </td>
                        {/* SRS: AI Loyalty Score column */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-16">
                              <div className={`h-full rounded-full ${loyEntry.bar} ${p.loyaltyBarWidth}`} />
                            </div>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${loyEntry.badge}`}>
                              {p.loyaltyLabel}
                            </span>
                            <span className="text-[11px] font-bold text-slate-600">{p.loyaltyScore}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${seg.badge}`}>
                            {p.segment === "at-risk" ? "At-Risk" : p.segment.charAt(0).toUpperCase() + p.segment.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-start gap-1">
                            <StickyNote className="w-3 h-3 text-slate-300 mt-0.5 shrink-0" />
                            <p className="text-xs text-slate-500">{p.note}</p>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-slate-100">
              <p className="text-[11px] text-slate-400">⭐ Platinum · 🥇 Gold · 🥈 Silver · 🥉 Bronze · AI Loyalty Scores updated daily</p>
            </div>
          </div>

          {/* Recent Logs */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Recent Customer Logs</h3>
                <p className="text-xs text-slate-400 mt-0.5">Today's recorded foot traffic</p>
              </div>
              <span className="text-sm font-bold text-slate-700">Total: <span className="text-emerald-500">22</span></span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Time Logged</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Count</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
                        <Clock className="w-3.5 h-3.5" /> {log.time}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-base font-bold text-slate-900">+{log.count}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${log.status === "Peak Traffic" ? "bg-gray-900 text-white border border-gray-700" : "bg-slate-100 text-slate-600"}`}>
                        {log.status === "Peak Traffic" && <Flame className="w-3 h-3" />}
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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