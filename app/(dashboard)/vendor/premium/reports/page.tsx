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
  FileBarChart,
  Sparkles,
  Brain,
  AlertTriangle,
  Target,
  Zap,
  Activity,
  MessageSquare,
  Send,
  FileText,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  CloudRain,
  ShoppingCart,
  RefreshCw,
  Download,
  X,
  MousePointerClick,
  Flame,
} from "lucide-react";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";

// ─── Types ─────────────────────────────────────────────────────────
type TabId = "pl" | "sales" | "weather" | "forecast" | "insights";
interface ChatMsg {
  role: "assistant" | "user";
  text: string;
}

// ─── Navigation ────────────────────────────────────────────────────
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
    active: true,
  },
];

// ─── Tabs ──────────────────────────────────────────────────────────
const TABS: { id: TabId; label: string; khmer: string }[] = [
  { id: "pl", label: "Profit & Loss", khmer: "ចំណេញ និង ខាត" },
  { id: "sales", label: "Sales Report", khmer: "របាយការណ៍ការលក់" },
  { id: "weather", label: "Weather Intel", khmer: "អាកាសធាតុ" },
  { id: "forecast", label: "AI Forecast", khmer: "ការព្យាករណ៍" },
  { id: "insights", label: "AI Insights", khmer: "ការវិភាគ AI" },
];

// ─── Mock Data ─────────────────────────────────────────────────────
const plDaily = [
  { day: "Mon", rev: 240, exp: 90 },
  { day: "Tue", rev: 310, exp: 110 },
  { day: "Wed", rev: 280, exp: 85 },
  { day: "Thu", rev: 420, exp: 130 },
  { day: "Fri", rev: 390, exp: 120 },
  { day: "Sat", rev: 510, exp: 150 },
  { day: "Sun", rev: 300, exp: 105 },
];

const topItems = [
  {
    name: "Iced Coffee",
    khmer: "កាហ្វេទឹកកក",
    qty: 112,
    revenue: "$168.00",
    pct: 100,
  },
  {
    name: "Noodle Soup",
    khmer: "គុយទាវ",
    qty: 85,
    revenue: "$255.00",
    pct: 75,
  },
  {
    name: "Hot Latte",
    khmer: "ឡាតេក្តៅ",
    qty: 64,
    revenue: "$128.00",
    pct: 57,
  },
  {
    name: "Mango Sticky Rice",
    khmer: "បាយដំណើបស្វាយ",
    qty: 45,
    revenue: "$112.50",
    pct: 40,
  },
  {
    name: "Matcha Frappe",
    khmer: "ម៉ាឆា",
    qty: 36,
    revenue: "$108.00",
    pct: 32,
  },
];

const weatherInsights = [
  {
    product: "Hot Latte",
    action: "Increase stock +40%",
    reason: "Hot drinks +52% on rainy evenings",
    up: true,
  },
  {
    product: "Mango Sticky Rice",
    action: "Increase stock +20%",
    reason: "Comfort food demand spikes",
    up: true,
  },
  {
    product: "Matcha Frappe",
    action: "Reduce stock -30%",
    reason: "Cold drinks drop 35% when rainy",
    up: false,
  },
  {
    product: "Iced Coffee",
    action: "Reduce stock -15%",
    reason: "Slight drop in iced beverages",
    up: false,
  },
];

const forecastRows = [
  {
    product: "Iced Coffee",
    khmer: "កាហ្វេទឹកកក",
    today: 112,
    predicted: 128,
    change: "+14%",
    up: true,
    confidence: 91,
  },
  {
    product: "Noodle Soup",
    khmer: "គុយទាវ",
    today: 85,
    predicted: 70,
    change: "-18%",
    up: false,
    confidence: 87,
  },
  {
    product: "Hot Latte",
    khmer: "ឡាតេក្តៅ",
    today: 64,
    predicted: 95,
    change: "+48%",
    up: true,
    confidence: 94,
  },
  {
    product: "Mango Sticky Rice",
    khmer: "បាយដំណើបស្វាយ",
    today: 45,
    predicted: 55,
    change: "+22%",
    up: true,
    confidence: 82,
  },
  {
    product: "Matcha Frappe",
    khmer: "ម៉ាឆា",
    today: 36,
    predicted: 28,
    change: "-22%",
    up: false,
    confidence: 79,
  },
];

const aiInsightsList = [
  {
    icon: TrendingUp,
    tag: "Positive",
    tagColor: "#3ecf8e",
    title: "Revenue up 22% vs last week",
    detail:
      "Saturday peak hit $510 — your best day. Rainy weather correlated with +18% hot drink sales.",
  },
  {
    icon: AlertTriangle,
    tag: "Action",
    tagColor: "#f59e0b",
    title: "Ingredient costs jumped 30%",
    detail:
      "Orussey Market on Tuesday 6AM is 18% cheaper. Switch supplier this week to save ~$4.50/week.",
  },
  {
    icon: Brain,
    tag: "Forecast",
    tagColor: "#3b82f6",
    title: "Predicted busiest day: Saturday",
    detail:
      "Based on 8 weeks of data, Saturday 12–2PM consistently generates 35% of weekly revenue.",
  },
  {
    icon: Target,
    tag: "Milestone",
    tagColor: "#8b5cf6",
    title: "Break-even achieved at 11:30 AM",
    detail:
      "You covered all fixed costs by 11:30 AM today. Every sale after that is pure profit.",
  },
  {
    icon: Zap,
    tag: "Urgent",
    tagColor: "#ef4444",
    title: "Smart restock: Buy more Hot Latte",
    detail:
      "Rainy evening forecast + Friday demand = 94% confidence Hot Latte will sell out by 7PM tonight.",
  },
];

const initChat: ChatMsg[] = [
  {
    role: "assistant",
    text: "សួស្តី! I'm your Gemini Business Assistant. Ask me anything about your reports, forecasts, or how to boost revenue!",
  },
  {
    role: "assistant",
    text: "Try: 'What will be my busiest day this week?' or 'How can I increase profit margin?'",
  },
];

// ═══════════════════════════════════════════════════════════════════
export default function PremiumReportsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("pl");
  const [period, setPeriod] = useState("This Week");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>(initChat);

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
            text: "Based on your data, Saturday 12–2PM is your peak window with 35% of weekly revenue. I recommend stocking up Hot Latte ingredients tonight — 94% chance of sellout given tonight's rainy forecast.",
          },
        ]),
      900,
    );
  };

  return (
    <VendorDashboardLayout
      plan="premium"
      navLinks={PREMIUM_NAV}
      currentPath="/vendor/premium/reports"
      title="Reports"
      planBadge={{ label: "PREMIUM", icon: Sparkles }}
      rightActions={
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="hidden sm:block bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 text-[#111827] dark:text-white text-[13px] font-medium rounded-[10px] px-3 py-2 outline-none focus:border-[#3ecf8e] cursor-pointer transition-colors"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Last 3 Months</option>
          </select>
          <button className="hidden sm:flex items-center gap-1.5 bg-[#0d1117] dark:bg-white text-white dark:text-[#0d1117] border-0 rounded-[10px] px-3.5 py-[9px] font-semibold text-[13px] cursor-pointer hover:bg-[#1a2332] dark:hover:bg-[#f0f2f5] transition-colors">
            <FileText size={14} /> PDF
          </button>
          <button className="hidden sm:flex items-center gap-1.5 bg-white dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 text-[#111827] dark:text-white rounded-[10px] px-3.5 py-[9px] font-semibold text-[13px] cursor-pointer hover:bg-[#f0f2f5] dark:hover:bg-white/5 transition-colors">
            <FileSpreadsheet size={14} /> Excel
          </button>
          <button
            onClick={() => setIsChatOpen((o) => !o)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#3ecf8e] text-white border-0 rounded-[10px] px-3.5 py-[9px] font-bold text-[13px] cursor-pointer hover:opacity-90"
          >
            <Brain size={14} /> Gemini AI
          </button>
        </div>
      }
    >
      {/* ══ SCROLLABLE CONTENT ══════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7 transition-colors">
        {/* ── Page Header ── */}
        <div className="pt-1 pb-2">
          <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">
            My Reports
          </h2>
          <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
            AI-powered business intelligence ·{" "}
            <span className="text-[#9ca3af] dark:text-[#4d5562]">
              ការវិភាគអាជីវកម្ម AI
            </span>
          </p>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-end gap-0 border-b border-[#e8eaed] dark:border-white/10 -mt-3 transition-colors">
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

        {/* ═══ 1. PROFIT & LOSS ═══ */}
        {activeTab === "pl" && (
          <section>
            {/* Section header */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-[#3ecf8e] rounded-full" />
              <h2 className="font-bold text-[19px] text-[#111827] dark:text-white">
                Profit &amp; Loss
              </h2>
              <span className="text-[12px] text-[#9ca3af] dark:text-[#7d8590] ml-1">
                ចំណេញ និង ខាត
              </span>
            </div>

            {/* Break-even tracker — premium exclusive */}
            <div className="bg-[#0d1117] rounded-[14px] border border-white/[0.06] px-[26px] py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[rgba(62,207,142,0.15)] border-2 border-[#3ecf8e] flex items-center justify-center shrink-0">
                  <Target size={20} className="text-[#3ecf8e]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#7d8590] uppercase tracking-[0.06em] mb-0.5">
                    Live Break-Even Tracker
                  </div>
                  <div className="text-[18px] font-extrabold text-[#e6edf3]">
                    ✅ Break-even achieved at 11:30 AM!
                  </div>
                  <div className="text-[12px] text-[#7d8590] mt-0.5">
                    Fixed costs $130 ÷ avg $4.50/sale = 29 customers · You have
                    42 today (+13 surplus)
                  </div>
                </div>
              </div>
              <div className="sm:w-[200px] shrink-0">
                <div className="flex justify-between text-[11px] text-[#7d8590] mb-1.5">
                  <span>Progress</span>
                  <span className="text-[#3ecf8e] font-bold">100%</span>
                </div>
                <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-[#3ecf8e] rounded-full w-full" />
                </div>
                <div className="text-[10px] text-[#4d5562] mt-1.5">
                  Every sale now = pure profit 💰
                </div>
              </div>
            </div>

            {/* PLCard metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              <PLCard
                title="Total Revenue"
                khmer="ចំណូលសរុប"
                value="$2,450.00"
                trend="+22%"
                isPositive={true}
                icon={<TrendingUp className="w-5 h-5" />}
                accentColor="bg-[#3ecf8e]"
              />
              <PLCard
                title="Total Expenses"
                khmer="ចំណាយសរុប"
                value="$890.50"
                trend="-2%"
                isPositive={true}
                icon={<TrendingDown className="w-5 h-5" />}
                accentColor="bg-slate-500"
              />
              <PLCard
                title="Net Profit"
                khmer="ប្រាក់ចំណេញសុទ្ធ"
                value="$1,559.50"
                trend="+28%"
                isPositive={true}
                icon={<CircleDollarSign className="w-5 h-5" />}
                accentColor="bg-[#3ecf8e]"
                highlight
              />
              <PLCard
                title="Profit Margin"
                khmer="អត្រាប្រាក់ចំណេញ"
                value="63.6%"
                trend="Excellent"
                isPositive={true}
                icon={<MousePointerClick className="w-5 h-5" />}
                accentColor="bg-fuchsia-500"
              />
            </div>

            {/* Bar chart — Revenue vs Expenses */}
            <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] px-[26px] py-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors">
              <div className="text-[14px] font-semibold text-[#111827] dark:text-white mb-0.5">
                Revenue vs Expenses
              </div>
              <div className="text-[11px] text-[#6b7280] dark:text-[#7d8590] mb-5">
                ចំណូល vs ចំណាយ · {period}
              </div>
              <div className="h-52 flex items-end gap-3">
                {plDaily.map((d, i) => {
                  const max = 550;
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div className="w-full flex items-end gap-0.5 h-44">
                        <div className="w-[48%] relative bg-[rgba(62,207,142,0.08)] rounded-t-[6px] h-full">
                          <div
                            className="absolute bottom-0 w-full bg-[#3ecf8e] rounded-t-[6px] transition-all"
                            style={{ height: `${(d.rev / max) * 100}%` }}
                          />
                        </div>
                        <div className="w-[48%] relative bg-[#f0f2f5] dark:bg-[#161B22] rounded-t-[6px] h-full transition-colors">
                          <div
                            className="absolute bottom-0 w-full bg-[#9ca3af] dark:bg-[#4d5562] rounded-t-[6px] transition-all"
                            style={{ height: `${(d.exp / max) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-[10px] text-[#6b7280] dark:text-[#7d8590]">
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[#f0f2f5] dark:border-white/5 transition-colors">
                <div className="flex items-center gap-2 text-[12.5px] text-[#6b7280] dark:text-[#7d8590]">
                  <div className="w-3 h-3 rounded-sm bg-[#3ecf8e]" />
                  Revenue
                </div>
                <div className="flex items-center gap-2 text-[12.5px] text-[#6b7280] dark:text-[#7d8590]">
                  <div className="w-3 h-3 rounded-sm bg-[#9ca3af] dark:bg-[#4d5562]" />
                  Expenses
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══ 2. SALES REPORT ═══ */}
        {activeTab === "sales" && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-[#3ecf8e] rounded-full" />
              <h2 className="font-bold text-[19px] text-[#111827] dark:text-white">
                Sales Report
              </h2>
              <span className="text-[12px] text-[#9ca3af] dark:text-[#7d8590] ml-1">
                របាយការណ៍ការលក់
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Top Selling Items */}
              <div className="lg:col-span-2 bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors">
                <div className="px-[26px] py-[18px] border-b border-[#f0f2f5] dark:border-white/5 transition-colors">
                  <div className="text-[14px] font-semibold text-[#111827] dark:text-white">
                    Top Selling Items
                  </div>
                  <div className="text-[11px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">
                    ទំនិញលក់ដាច់ជាងគេ · {period}
                  </div>
                </div>
                <div className="p-[22px] flex flex-col gap-4">
                  {topItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <span className="w-6 h-6 rounded-full bg-[#f0f2f5] dark:bg-white/10 text-[#6b7280] dark:text-[#7d8590] text-[12px] font-bold flex items-center justify-center shrink-0 transition-colors">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <span className="text-[13.5px] font-semibold text-[#111827] dark:text-white">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-[#9ca3af] dark:text-[#7d8590] ml-2">
                              {item.khmer}
                            </span>
                          </div>
                          <div>
                            <span className="text-[13.5px] font-bold text-[#3ecf8e]">
                              {item.revenue}
                            </span>
                            <span className="text-[12px] text-[#9ca3af] dark:text-[#7d8590] ml-1.5">
                              ({item.qty} sold)
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-[#f0f2f5] dark:bg-white/5 rounded-full overflow-hidden transition-colors">
                          <div
                            className="h-full bg-[#3ecf8e] rounded-full transition-all"
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {/* Period comparison — dark card */}
                <div className="bg-[#0d1117] border border-white/[0.06] rounded-[14px] px-[26px] py-6 transition-colors">
                  <div className="text-[10.5px] font-bold text-[#7d8590] uppercase tracking-[0.07em] mb-0.5">
                    Total Sales
                  </div>
                  <div className="text-[10px] text-[#4d5562] mb-4">
                    ការលក់សរុប
                  </div>
                  <div className="text-[30px] font-bold text-[#3ecf8e]">
                    $2,450
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-[12.5px] font-bold text-[#3ecf8e]">
                    <ArrowUpRight size={14} />
                    +22.1% vs last week
                  </div>
                </div>

                {/* Sales Trend mini chart */}
                <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] px-[26px] py-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex-1 transition-colors">
                  <div className="text-[13.5px] font-semibold text-[#111827] dark:text-white mb-4">
                    Sales Trend
                  </div>
                  <div className="h-24 flex items-end gap-1.5">
                    {[45, 60, 50, 85, 75, 100, 65].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-[rgba(62,207,142,0.1)] rounded-t-[5px] relative"
                      >
                        <div
                          className="absolute bottom-0 w-full bg-[#3ecf8e] rounded-t-[5px] transition-all"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══ 3. WEATHER INTEL ═══ */}
        {activeTab === "weather" && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-[#3b82f6] rounded-full" />
              <h2 className="font-bold text-[19px] text-[#111827] dark:text-white">
                Weather Impact
              </h2>
              <span className="text-[12px] text-[#9ca3af] dark:text-[#7d8590] ml-1">
                ឥទ្ធិពលអាកាសធាតុ
              </span>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-500/20 rounded-[14px] p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
              <div className="flex items-center gap-4">
                <CloudRain
                  size={40}
                  className="text-blue-500 dark:text-blue-400"
                />
                <div>
                  <div className="text-[18px] font-bold text-blue-900 dark:text-blue-300">
                    Rainy Evening Forecast
                  </div>
                  <div className="text-[13px] text-blue-700 dark:text-blue-200/80 mt-1">
                    Expected 4PM–8PM. Based on past data, hot drinks will
                    increase by ~52%.
                  </div>
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-[10px] text-[13px] transition-colors border-0 cursor-pointer">
                Adjust Inventory
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weatherInsights.map((wi, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[12px] p-5 flex items-start gap-4 transition-colors"
                >
                  <div
                    className={`p-2.5 rounded-[10px] shrink-0 ${wi.up ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"}`}
                  >
                    {wi.up ? (
                      <TrendingUp size={20} />
                    ) : (
                      <TrendingDown size={20} />
                    )}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#111827] dark:text-white">
                      {wi.product}
                    </div>
                    <div
                      className={`text-[12px] font-semibold mt-1 mb-1.5 ${wi.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {wi.action}
                    </div>
                    <div className="text-[12px] text-[#6b7280] dark:text-[#7d8590]">
                      {wi.reason}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══ 4. FORECAST ═══ */}
        {activeTab === "forecast" && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-[#8b5cf6] rounded-full" />
              <h2 className="font-bold text-[19px] text-[#111827] dark:text-white">
                AI Demand Forecast
              </h2>
              <span className="text-[12px] text-[#9ca3af] dark:text-[#7d8590] ml-1">
                ការព្យាករណ៍តម្រូវការ
              </span>
            </div>

            <div className="bg-[#0d1117] border border-white/[0.06] rounded-[14px] p-6 mb-6 flex items-start gap-4 transition-colors">
              <Brain size={24} className="text-[#8b5cf6] shrink-0" />
              <div>
                <div className="text-[15px] font-bold text-[#e6edf3]">
                  Gemini Predictive Model
                </div>
                <div className="text-[13px] text-[#7d8590] mt-1">
                  Predictions are based on historical sales, weather forecasts,
                  day of the week, and local events. Average model confidence
                  for tomorrow is{" "}
                  <strong className="text-[#8b5cf6]">86%</strong>.
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] overflow-hidden shadow-sm transition-colors">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f7f8fa] dark:bg-[#161B22] border-b border-[#f0f2f5] dark:border-white/5 text-[11px] text-[#9ca3af] dark:text-[#7d8590] uppercase tracking-wider font-bold transition-colors">
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4 text-center">Today Sold</th>
                      <th className="px-6 py-4 text-center">
                        Predicted Tomorrow
                      </th>
                      <th className="px-6 py-4 text-center">Trend</th>
                      <th className="px-6 py-4 text-right">AI Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f2f5] dark:divide-white/5">
                    {forecastRows.map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-[#f7f8fa] dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="text-[13.5px] font-semibold text-[#111827] dark:text-white">
                            {row.product}
                          </div>
                          <div className="text-[11px] text-[#9ca3af] dark:text-[#7d8590] mt-0.5">
                            {row.khmer}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-[13.5px] font-medium text-[#6b7280] dark:text-[#7d8590]">
                          {row.today}
                        </td>
                        <td className="px-6 py-4 text-center text-[14px] font-bold text-[#111827] dark:text-white">
                          {row.predicted}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 text-[12px] font-bold ${row.up ? "text-[#3ecf8e]" : "text-[#ef4444]"}`}
                          >
                            {row.up ? (
                              <ArrowUpRight size={14} />
                            ) : (
                              <ArrowDownRight size={14} />
                            )}
                            {row.change}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f0f2f5] dark:bg-white/10 text-[#6b7280] dark:text-[#e6edf3] text-[11px] font-bold rounded-full">
                            {row.confidence}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ═══ 5. AI INSIGHTS ═══ */}
        {activeTab === "insights" && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-gradient-to-b from-[#8b5cf6] to-[#3ecf8e] rounded-full" />
              <h2 className="font-bold text-[19px] text-[#111827] dark:text-white">
                Business Insights
              </h2>
              <span className="text-[12px] text-[#9ca3af] dark:text-[#7d8590] ml-1">
                គន្លឹះអាជីវកម្ម
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {aiInsightsList.map((ins, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] p-[22px] shadow-sm flex flex-col transition-colors hover:shadow-md hover:border-[rgba(62,207,142,0.3)] dark:hover:border-[rgba(62,207,142,0.3)] group cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-[11px] flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${ins.tagColor}15`,
                        color: ins.tagColor,
                      }}
                    >
                      <ins.icon className="w-5 h-5" />
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
                  <h4 className="font-bold text-[15px] text-[#111827] dark:text-white leading-snug mb-2 group-hover:text-[#3ecf8e] transition-colors">
                    {ins.title}
                  </h4>
                  <p className="text-[13px] text-[#6b7280] dark:text-[#7d8590] leading-relaxed flex-1">
                    {ins.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ══ Gemini AI Chat FAB ══ */}
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
                  Gemini Report Analyst
                </p>
                <p className="text-[11px] text-[#4d5562]">
                  Online · Ready to analyze
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
                placeholder="Ask about your reports..."
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

// ─── Reusable Sub-Components ───────────────────────────────────────

function PLCard({
  title,
  khmer,
  value,
  trend,
  isPositive,
  icon,
  accentColor,
  highlight = false,
}: {
  title: string;
  khmer: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
  accentColor: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-2xl border transition-colors ${
        highlight
          ? "bg-[#3ecf8e] text-white border-transparent shadow-md"
          : "bg-white dark:bg-[#0d1117] border-[#e8eaed] dark:border-white/10 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4
            className={`text-sm font-semibold ${highlight ? "text-white/90" : "text-[#6b7280] dark:text-[#7d8590]"}`}
          >
            {title}
          </h4>
          <p
            className={`text-[11px] mt-0.5 ${highlight ? "text-white/70" : "text-[#9ca3af] dark:text-[#6b7280]"}`}
          >
            {khmer}
          </p>
        </div>
        <div
          className={`p-2 rounded-xl ${highlight ? "bg-white/20" : "bg-[#f0f2f5] dark:bg-white/5 text-[#6b7280] dark:text-[#7d8590]"}`}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div
          className={`text-2xl font-bold ${highlight ? "text-white" : "text-[#111827] dark:text-white"}`}
        >
          {value}
        </div>
        <div
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            highlight
              ? "bg-white/20 text-white"
              : isPositive
                ? "bg-[rgba(62,207,142,0.1)] dark:bg-[rgba(62,207,142,0.15)] text-[#3ecf8e] dark:text-[#4dd49a]"
                : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
          }`}
        >
          {trend}
        </div>
      </div>
    </div>
  );
}
