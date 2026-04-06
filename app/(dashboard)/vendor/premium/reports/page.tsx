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
import { useLanguage } from "@/components/providers/LanguageProvider";
import dynamic from "next/dynamic";
import { offlineFetch } from "@/lib/pwa/offline-fetch";

const LineGraph = dynamic(() => import("@/components/vendor/premium/LineGraph"), { ssr: false });
const SalesAnalysis = dynamic(() => import("@/components/vendor/premium/SalesAnalysis"), { ssr: false });
const WeatherIntelligence = dynamic(() => import("@/components/vendor/premium/WeatherIntelligence"), { ssr: false });
const AIHub = dynamic(() => import("@/components/vendor/premium/AIHub"), { ssr: false });

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
  { id: "insights", label: "AI Insights", khmer: "ការវិភាគ AI" },
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
  const { language } = useLanguage();
  const isKhmer = language === "km";

  const initChat: ChatMsg[] = [
    {
      role: "assistant",
      text: isKhmer 
        ? "សួស្តី! ខ្ញុំគឺជាជំនួយការអាជីវកម្ម Gemini របស់អ្នក។ សួរអ្វីក៏បានអំពីរបាយការណ៍ ការព្យាករណ៍ ឬវិធីបង្កើនចំណូល!"
        : "Hello! I'm your Gemini Business Assistant. Ask me anything about your reports, forecasts, or how to boost revenue!",
    },
    {
      role: "assistant",
      text: isKhmer
        ? "សាកល្បង៖ 'តើថ្ងៃណាដែលមមាញឹកបំផុតក្នុងសប្តាហ៍នេះ?' ឬ 'តើខ្ញុំអាចបង្កើនប្រាក់ចំណេញដោយរបៀបណា?'"
        : "Try: 'What will be my busiest day this week?' or 'How can I increase profit margin?'",
    },
  ];

  const [activeTab, setActiveTab] = useState<TabId>("pl");
  const [period, setPeriod] = useState(isKhmer ? "សប្តាហ៍នេះ" : "This Week");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>(initChat);

  const [sales, setSales] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  React.useEffect(() => {
    offlineFetch("/api/vendor/sales").then(r => r.json()).then(d => { if(d.success) setSales(d.data); });
    offlineFetch("/api/vendor/expenses").then(r => r.json()).then(d => { if(d.success) setExpenses(d.data); });
  }, []);

  const totalRevenue = React.useMemo(() => sales.reduce((s, x) => s + parseFloat(x.amount || 0), 0), [sales]);
  const totalExpensesSum = React.useMemo(() => expenses.reduce((s, x) => s + parseFloat(x.amount || 0), 0), [expenses]);
  const netProfit = totalRevenue - totalExpensesSum;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) + "%" : "0%";
  const profitTrend = netProfit > 0 ? "Excellent" : "Needs Action";
  const revenueTrend = sales.length > 0 ? "+Live" : "No Data";
  const expenseTrend = expenses.length > 0 ? "-Live" : "No Data";

  const dynamicTopItems = React.useMemo(() => {
    const map = new Map<string, any>();
    let fallbackItemsFound = false;
    sales.forEach(s => {
      let items: any[] = [];
      try {
        const parsed = Array.isArray(s.items) ? s.items : JSON.parse(s.items || "[]");
        items = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        items = [];
      }
      if (items.length > 0) fallbackItemsFound = true;
      items.forEach((it: any) => {
        const name = it.name || "Item";
        const qty = parseInt(it.quantity || it.qty || 1);
        const price = parseFloat(it.price || 0);
        if (!map.has(name)) map.set(name, { name, khmer: "", qty: 0, revenue: 0 });
        const cur = map.get(name);
        cur.qty += qty;
        cur.revenue += (qty * price);
      });
    });
    const sorted = Array.from(map.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    const max = sorted[0]?.revenue || 1;
    return sorted.map(t => ({ ...t, pct: (t.revenue / max) * 100, revenueStr: `$${t.revenue.toFixed(2)}` }));
  }, [sales]);

  const dynamicTrend = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toDateString();
    }).reverse();
    return last7Days.map(date => {
      return sales
        .filter(s => new Date(s.createdAt).toDateString() === date)
        .reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
    });
  }, [sales]);
  const maxTrend = Math.max(...dynamicTrend, 1);

  const handleSend = async () => {
    if (!chatMsg.trim()) return;
    const currentMsg = chatMsg;
    setChatMessages((p) => [...p, { role: "user", text: currentMsg }]);
    setChatMsg("");
    
    try {
      const res = await offlineFetch("/api/vendor/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentMsg, context: "reports" }),
      });
      const data = await res.json();
      if (data.success && data.response) {
        setChatMessages((p) => [...p, { role: "assistant", text: data.response }]);
      } else {
        setChatMessages((p) => [...p, { role: "assistant", text: isKhmer ? "សុំទោស ខ្ញុំមិនអាចដំណើរការបានទេនៅពេលនេះ។" : "Sorry, I couldn't process that right now." }]);
      }
    } catch (err) {
      setChatMessages((p) => [...p, { role: "assistant", text: isKhmer ? "កំហុសបណ្តាញក្នុងការទាញយកចម្លើយពី AI។" : "Network error fetching AI response." }]);
    }
  };

  return (
    <VendorDashboardLayout
      settingsHref="/vendor/premium/settings"
      plan="premium"
      navLinks={PREMIUM_NAV}
      currentPath="/vendor/premium/reports"
      title={isKhmer ? "របាយការណ៍" : "Reports"}
      planBadge={{ label: isKhmer ? "PREMIUM" : "PREMIUM", icon: Sparkles }}
      rightActions={
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="hidden sm:block bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 text-[#111827] dark:text-white text-[13px] font-medium rounded-[10px] px-3 py-2 outline-none focus:border-[#29B28D] cursor-pointer transition-colors"
          >
            <option value="Today">{isKhmer ? "ថ្ងៃនេះ" : "Today"}</option>
            <option value="This Week">{isKhmer ? "សប្តាហ៍នេះ" : "This Week"}</option>
            <option value="This Month">{isKhmer ? "ខែនេះ" : "This Month"}</option>
            <option value="Last 3 Months">{isKhmer ? "៣ ខែចុងក្រោយ" : "Last 3 Months"}</option>
          </select>
          <button className="hidden sm:flex items-center gap-1.5 bg-[#0d1117] dark:bg-white text-white dark:text-[#0d1117] border-0 rounded-[10px] px-3.5 py-[9px] font-semibold text-[13px] cursor-pointer hover:bg-[#1a2332] dark:hover:bg-[#f0f2f5] transition-colors">
            <FileText size={14} /> PDF
          </button>
          <button className="hidden sm:flex items-center gap-1.5 bg-white dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 text-[#111827] dark:text-white rounded-[10px] px-3.5 py-[9px] font-semibold text-[13px] cursor-pointer hover:bg-[#f0f2f5] dark:hover:bg-white/5 transition-colors">
            <FileSpreadsheet size={14} /> Excel
          </button>
          <button
            onClick={() => setIsChatOpen((o) => !o)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#29B28D] text-white border-0 rounded-[10px] px-3.5 py-[9px] font-bold text-[13px] cursor-pointer hover:opacity-90"
          >
            <Brain size={14} /> {isKhmer ? "Gemini AI" : "Gemini AI"}
          </button>
        </div>
      }
    >
      {/* ══ SCROLLABLE CONTENT ══════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7 transition-colors">
        {/* ── Page Header ── */}
        <div className="pt-1 pb-2">
          <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">
            {isKhmer ? "របាយការណ៍របស់ខ្ញុំ" : "My Reports"}
          </h2>
          <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
            {isKhmer ? "បញ្ញាសិប្បនិម្មិតសម្រាប់វិភាគអាជីវកម្ម" : "AI-powered business intelligence"}
          </p>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-end gap-0 border-b border-[#e8eaed] dark:border-white/10 -mt-3 overflow-x-auto overflow-y-hidden [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-colors">
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

        {/* ═══ 1. PROFIT & LOSS ═══ */}
        {activeTab === "pl" && (
          <section>
            {/* Section header */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-[#29B28D] rounded-full" />
              <h2 className="font-bold text-[19px] text-[#111827] dark:text-white">
                {isKhmer ? "ចំណេញ និង ខាត" : "Profit & Loss"}
              </h2>
            </div>



            {/* PLCard metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              <PLCard
                title={isKhmer ? "ចំណូលសរុប" : "Total Revenue"}
                khmer="ចំណូលសរុប"
                value={`$${totalRevenue.toFixed(2)}`}
                trend={revenueTrend}
                isPositive={totalRevenue > 0}
                icon={<TrendingUp className="w-5 h-5" />}
                accentColor="bg-[#29B28D]"
              />
              <PLCard
                title={isKhmer ? "ចំណាយសរុប" : "Total Expenses"}
                khmer="ចំណាយសរុប"
                value={`$${totalExpensesSum.toFixed(2)}`}
                trend={expenseTrend}
                isPositive={false}
                icon={<TrendingDown className="w-5 h-5" />}
                accentColor="bg-slate-500"
              />
              <PLCard
                title={isKhmer ? "ប្រាក់ចំណេញសុទ្ធ" : "Net Profit"}
                khmer="ប្រាក់ចំណេញសុទ្ធ"
                value={`$${netProfit.toFixed(2)}`}
                trend={netProfit > 0 ? "+Live" : "-Live"}
                isPositive={netProfit > 0}
                icon={<CircleDollarSign className="w-5 h-5" />}
                accentColor="bg-[#29B28D]"
                highlight
              />
              <PLCard
                title={isKhmer ? "អត្រាប្រាក់ចំណេញ" : "Profit Margin"}
                khmer="អត្រាប្រាក់ចំណេញ"
                value={profitMargin}
                trend={profitTrend}
                isPositive={netProfit > 0}
                icon={<MousePointerClick className="w-5 h-5" />}
                accentColor="bg-fuchsia-500"
              />
            </div>

            {/* Real LineGraph replaces the mock bar chart */}
            <div className="mt-4">
              <LineGraph />
            </div>
          </section>
        )}

        {/* ═══ 2. SALES REPORT ═══ */}
        {activeTab === "sales" && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-[#29B28D] rounded-full" />
              <h2 className="font-bold text-[19px] text-[#111827] dark:text-white">
                {isKhmer ? "របាយការណ៍ការលក់" : "Sales Report"}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Top Selling Items */}
              <div className="lg:col-span-2 bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors">
                <div className="px-[26px] py-[18px] border-b border-[#f0f2f5] dark:border-white/5 transition-colors">
                  <div className="text-[14px] font-semibold text-[#111827] dark:text-white">
                    {isKhmer ? "ទំនិញលក់ដាច់បំផុត" : "Top Selling Items"}
                  </div>
                  <div className="text-[11px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">
                    {isKhmer ? "ទំនិញលក់ដាច់ជាងគេ" : "Top Selling Items"} · {period}
                  </div>
                </div>
                <div className="p-[22px] flex flex-col gap-4">
                  {dynamicTopItems.length > 0 ? (
                    dynamicTopItems.map((item, i) => (
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
                            </div>
                            <div>
                              <span className="text-[13.5px] font-bold text-[#29B28D]">
                                {isKhmer ? "លក់ដាច់" : "sold"}
                              </span>
                              <span className="text-[12px] text-[#9ca3af] dark:text-[#7d8590] ml-1.5">
                                ({item.qty} {isKhmer ? "ដង" : "times"})
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-1.5 bg-[#f0f2f5] dark:bg-white/5 rounded-full overflow-hidden transition-colors">
                            <div
                              className="h-full bg-[#29B28D] rounded-full transition-all"
                              style={{ width: `${item.pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[13px] text-[#9ca3af] dark:text-[#7d8590] italic">
                      {isKhmer ? "មិនទាន់មានទិន្នន័យការលក់នៅឡើយទេ។" : "No sales data available. Make a sale to see your top items here!"}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {/* Period comparison — dark card */}
                <div className="bg-[#0d1117] border border-white/[0.06] rounded-[14px] px-[26px] py-6 transition-colors">
                  <div className="text-[10.5px] font-bold text-[#7d8590] uppercase tracking-[0.07em] mb-0.5">
                    {isKhmer ? "ការលក់សរុប" : "Total Sales"}
                  </div>
                  <div className="text-[10px] text-[#4d5562] mb-4">
                    {isKhmer ? "ការលក់សរុប" : "Total Sales"}
                  </div>
                  <div className="text-[30px] font-bold text-[#29B28D]">
                    ${totalRevenue.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-[12.5px] font-bold text-[#29B28D]">
                    <span className="text-white/60 font-normal">{isKhmer ? "បានធ្វើបច្ចុប្បន្នភាពផ្ទាល់" : "Updated Live"}</span>
                  </div>
                </div>

                {/* Sales Trend mini chart */}
                 <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] px-[26px] py-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex-1 transition-colors">
                  <div className="text-[13.5px] font-semibold text-[#111827] dark:text-white mb-4">
                    {isKhmer ? "និន្នាការលក់ (៧ ថ្ងៃ)" : "Sales Trend (7 Days)"}
                  </div>
                  <div className="h-24 flex items-end gap-1.5">
                    {dynamicTrend.length > 0 ? (
                      dynamicTrend.map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-[rgba(41,178,141,0.1)] rounded-t-[5px] relative"
                        >
                          <div
                            className="absolute bottom-0 w-full bg-[#29B28D] rounded-t-[5px] transition-all"
                            style={{ height: `${(h / maxTrend) * 100}%` }}
                            title={`$${h.toFixed(2)}`}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-[11px] text-gray-500 w-full text-center py-4">{isKhmer ? "គ្មានការលក់ថ្មីៗទេ" : "No recent sales"}</div>
                    )}
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
                {isKhmer ? "ឥទ្ធិពលអាកាសធាតុ" : "Weather Impact"}
              </h2>
            </div>

            <WeatherIntelligence />
          </section>
        )}

        {/* ═══ 4. FORECAST ═══ */}
        {activeTab === "forecast" && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-[#8b5cf6] rounded-full" />
              <h2 className="font-bold text-[19px] text-[#111827] dark:text-white">
                {isKhmer ? "ការព្យាករណ៍តម្រូវការ AI" : "AI Demand Forecast"}
              </h2>
            </div>

            <div className="mt-2">
              <AIHub />
            </div>
          </section>
        )}

        {/* ═══ 5. AI INSIGHTS ═══ */}
        {activeTab === "insights" && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-gradient-to-b from-[#8b5cf6] to-[#29B28D] rounded-full" />
              <h2 className="font-bold text-[19px] text-[#111827] dark:text-white">
                {isKhmer ? "ការយល់ដឹងអំពីអាជីវកម្ម" : "Business Insights"}
              </h2>
            </div>

            <div className="mt-2">
              <SalesAnalysis />
            </div>
          </section>
        )}
      </div>

      {/* ══ Gemini AI Chat FAB ══ */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#8b5cf6] to-[#29B28D] rounded-full shadow-[0_8px_32px_rgba(139,92,246,0.4)] flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer border-0"
        >
          <MessageSquare size={22} />
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] bg-white dark:bg-[#0d1117] rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.2)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.5)] border border-[#e8eaed] dark:border-white/10 flex flex-col overflow-hidden transition-colors">
          <div className="px-5 py-4 bg-[#0d1117] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#8b5cf6] to-[#29B28D] rounded-full flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-[13.5px] text-[#e6edf3]">
                  {isKhmer ? "Gemini អ្នកវិភាគរបាយការណ៍" : "Gemini Report Analyst"}
                </p>
                <p className="text-[11px] text-[#4d5562]">
                  {isKhmer ? "មានវត្តមាន · ត្រៀមខ្លួនវិភាគ" : "Online · Ready to analyze"}
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
                  className={`max-w-[80%] px-4 py-3 rounded-[14px] text-[13px] leading-relaxed transition-colors ${msg.role === "user"
                      ? "bg-[#0d1117] dark:bg-gradient-to-r dark:from-[#8b5cf6] dark:to-[#29B28D] text-[#e6edf3] dark:text-white rounded-br-[4px]"
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
                placeholder={isKhmer ? "សួរអំពីរបាយការណ៍របស់អ្នក..." : "Ask about your reports..."}
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 px-4 py-2.5 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[10px] text-[13px] outline-none text-[#111827] dark:text-white focus:border-[#29B28D] dark:focus:border-[#29B28D] transition-colors placeholder-[#9ca3af] dark:placeholder-[#7d8590]"
              />
              <button
                onClick={handleSend}
                className="p-2.5 bg-gradient-to-br from-[#8b5cf6] to-[#29B28D] text-white rounded-[10px] border-0 cursor-pointer hover:opacity-90"
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
  const { language } = useLanguage();
  const isKhmer = language === "km";
  return (
    <div
      className={`p-5 rounded-2xl border transition-colors ${highlight
          ? "bg-psar-primary text-white border-transparent shadow-md"
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
            {isKhmer ? khmer : title}
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
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${highlight
              ? "bg-white/20 text-white"
              : isPositive
                ? "bg-[rgba(41,178,141,0.1)] dark:bg-[rgba(41,178,141,0.15)] text-[#29B28D] dark:text-[#4dd49a]"
                : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
            }`}
        >
          {trend}
        </div>
      </div>
    </div>
  );
}
