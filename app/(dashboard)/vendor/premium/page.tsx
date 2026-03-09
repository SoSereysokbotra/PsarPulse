"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Package,
  Settings,
  Plus,
  TrendingUp,
  Menu,
  X,
  Bell,
  Crown,
  Lock,
  CheckCircle2,
  ArrowUpRight,
  Download,
  FileText,
  FileSpreadsheet,
  MapPin,
  Sparkles,
  AlertTriangle,
  Edit2,
  PlusCircle,
  Map,
  CloudSun,
  Brain,
  MessageSquare,
  Megaphone,
  BellRing,
  Calculator,
  ShoppingCart,
  Send,
  Copy,
  Facebook,
  TrendingDown,
  Target,
  Zap,
  ToggleRight,
  ToggleLeft,
  Tag,
  FileBarChart,
} from "lucide-react";

export default function PremiumDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDayLocked, setIsDayLocked] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const summaryData = {
    sales: "$524.50",
    expenses: "$145.00",
    profit: "$379.50",
    customers: "124",
    profitMargin: "72.3%",
    bestSelling: "Iced Coffee",
  };

  // Premium: Unlimited
  const usageData = { used: 3482, limit: Infinity };

  // AI Forecaster data
  const restockSuggestions = [
    { item: "Iced Coffee", khmer: "កាហ្វេទឹកកក", suggestedQty: 60, reason: "High weekend demand predicted", confidence: 92 },
    { item: "Mango Sticky Rice", khmer: "បាយដំណើបស្វាយ", suggestedQty: 25, reason: "Rainy evening → comfort food trend", confidence: 87 },
    { item: "Noodle Soup", khmer: "គុយទាវ", suggestedQty: 40, reason: "Consistent weekday demand", confidence: 85 },
  ];

  // Break-even data
  const breakEvenData = {
    customersNeeded: 18,
    customersServed: 124,
    dailyTarget: "$180.00",
    currentRevenue: "$524.50",
    status: "exceeded",
  };

  // Weather intelligence
  const weatherData = {
    condition: "Rainy Evening",
    temp: "28°C",
    icon: "🌧️",
    impact: "busy",
    suggestions: [
      { product: "Mango Sticky Rice", change: "+20%", reason: "Comfort food demand rises in rain" },
      { product: "Hot Latte", change: "+35%", reason: "Hot beverages spike on rainy days" },
      { product: "Iced Coffee", change: "-10%", reason: "Cold drinks decrease slightly" },
    ],
  };

  // Smart product suggestions
  const smartSuggestions = [
    { product: "Hot Chocolate", reason: "Trending in rainy season across similar stalls", potential: "$45/day", trend: "up" },
    { product: "Banana Pancake", reason: "Tourist demand increasing near your location", potential: "$32/day", trend: "up" },
  ];

  // Marketing hub
  const generatedPost = {
    text: "🔥 សួស្តីអ្នកទាំងអស់គ្នា! ថ្ងៃនេះមានម៉ឺនុយពិសេស — កាហ្វេទឹកកកត្រជាក់ៗ និងបាយដំណើបស្វាយឆ្ងាញ់ៗ! មកទស្សនាតូបយើងខ្ញុំនៅ Night Market, Stall B42 🏪✨ #PsarPulse #NightMarket",
    platform: "Facebook",
  };

  // Notification alerts
  const smartAlerts = [
    { type: "warning", message: "Sales dropped 15% compared to usual Thursday average", time: "2 hours ago" },
    { type: "opportunity", message: "Nearby event detected: +40% foot traffic expected tonight", time: "30 min ago" },
    { type: "restock", message: "Hot Latte stock critically low — 3 units left", time: "Just now" },
  ];

  // Chat messages
  const chatMessages = [
    { role: "assistant", text: "សួស្តី! I'm your AI assistant. How can I help you today?" },
    { role: "assistant", text: "I can help with sales analysis, inventory advice, marketing tips, and more. Just ask!" },
  ];

  // Charts data
  const weeklyData = [55, 82, 48, 95, 72, 130, 92];
  const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-purple-500 selection:text-white">
      {/* --- SIDEBAR --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <Link href="/vendor" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#29B28D] flex items-center justify-center font-bold text-white shadow-sm">P</div>
            <span className="font-bold text-[19px] tracking-tight">PsarPulse KH</span>
          </Link>
          <button className="lg:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          <NavItem icon={LayoutDashboard} title="Dashboard" khmerTitle="ផ្ទាំងគ្រប់គ្រង" active />
          <NavItem icon={CircleDollarSign} title="Sales" khmerTitle="ការលក់" />
          <NavItem icon={Receipt} title="Expenses" khmerTitle="ចំណាយ" />
          <NavItem icon={Users} title="Customers" khmerTitle="អតិថិជន" />
          <NavItem icon={Package} title="Inventory" khmerTitle="ស្តុក" />
          <NavItem icon={FileBarChart} title="Reports" khmerTitle="របាយការណ៍" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <NavItem icon={Settings} title="Settings" khmerTitle="ការកំណត់" />
          <div className="mt-3 p-3.5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl text-white">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-sm">Premium Plan</span>
            </div>
            <p className="text-xs text-slate-400 mb-2">$7/month · AI Assistant Active</p>
            <Link
              href="/vendor/pricing"
              className="block w-full text-center text-[12px] font-bold text-purple-300 hover:text-purple-200 bg-white/10 hover:bg-white/15 py-1.5 rounded-lg transition-colors"
            >
              Manage Plan
            </Link>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col w-full min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-500 hover:text-slate-900" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-bold text-slate-900">Premium Dashboard</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-600 text-[11px] font-bold rounded-full">
                  <Sparkles className="w-3 h-3" /> PREMIUM
                </span>
              </div>
              <p className="text-[12px] font-khmer text-slate-500">ផ្ទាំងគ្រប់គ្រង Premium</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-3.5 py-2 rounded-xl transition-colors text-sm min-h-[40px]">
              <FileText className="w-4 h-4" /> Export PDF
            </button>
            <button className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-3.5 py-2 rounded-xl transition-colors text-sm min-h-[40px]">
              <FileSpreadsheet className="w-4 h-4" /> Export Excel
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-100 to-fuchsia-100 flex items-center justify-center text-purple-600 font-bold border border-purple-200 text-sm shadow-sm">
              SM
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">

          {/* Smart Push Notifications */}
          {smartAlerts.length > 0 && (
            <div className="space-y-3">
              {smartAlerts.map((alert, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl border shadow-sm transition-all hover:shadow-md ${
                    alert.type === "warning"
                      ? "bg-orange-50 border-orange-200"
                      : alert.type === "opportunity"
                      ? "bg-purple-50 border-purple-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    alert.type === "warning" ? "bg-orange-100" : alert.type === "opportunity" ? "bg-purple-100" : "bg-red-100"
                  }`}>
                    {alert.type === "warning" ? <TrendingDown className="w-4 h-4 text-orange-600" /> :
                     alert.type === "opportunity" ? <Zap className="w-4 h-4 text-purple-600" /> :
                     <AlertTriangle className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-slate-700">{alert.message}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{alert.time}</p>
                  </div>
                  <button className="text-[12px] font-semibold text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white transition-colors">
                    Dismiss
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Unlimited badge */}
          <div className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-700 rounded-2xl p-5 shadow-lg text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[17px]">AI Business Assistant Active</h3>
                <p className="text-purple-200 text-sm mt-0.5">{usageData.used.toLocaleString()} logs · Gemini AI insights enabled · Weather intelligence on</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-semibold">Premium Active</span>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <SummaryCard title="Total Sales" khmerTitle="ការលក់សរុប" value={summaryData.sales} icon={CircleDollarSign} trend="+24%" isPositive={true} />
            <SummaryCard title="Net Profit" khmerTitle="ប្រាក់ចំណេញ" value={summaryData.profit} icon={TrendingUp} trend="+32%" isPositive={true} highlight />
            <SummaryCard title="Profit Margin" khmerTitle="អត្រាចំណេញ" value={summaryData.profitMargin} icon={ArrowUpRight} trend="+5.1%" isPositive={true} />
            <SummaryCard title="Customers" khmerTitle="អតិថិជន" value={summaryData.customers} icon={Users} trend="+18%" isPositive={true} />
          </div>

          {/* AI Forecaster + Weather Intelligence Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* AI Sales Forecaster / Smart Restock */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-fuchsia-100 rounded-xl">
                    <ShoppingCart className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] text-slate-900">Smart Restock Forecaster</h3>
                    <p className="text-[11px] font-khmer text-slate-400 mt-0.5">ការព្យាករណ៍បំពេញស្តុក</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-full">
                  <Brain className="w-3 h-3" /> AI
                </span>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-[13px] text-slate-500 bg-purple-50 p-3 rounded-lg border border-purple-100">
                  <Sparkles className="w-4 h-4 text-purple-500 inline mr-1.5 -mt-0.5" />
                  Based on your past 30 days of sales data, here&apos;s what to buy at the morning market:
                </p>
                {restockSuggestions.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14px] font-semibold text-slate-900">{item.item}</span>
                        <span className="text-[11px] font-khmer text-slate-400">{item.khmer}</span>
                      </div>
                      <p className="text-[12px] text-slate-500">{item.reason}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-[18px] font-bold text-purple-600">{item.suggestedQty}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{item.confidence}% confident</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather Correlation Intelligence */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <CloudSun className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] text-slate-900">Weather Intelligence</h3>
                    <p className="text-[11px] font-khmer text-slate-400 mt-0.5">ព័ត៌មានអាកាសធាតុ</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">
                  <Brain className="w-3 h-3" /> AI
                </span>
              </div>
              <div className="p-5">
                {/* Current Weather */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 mb-5">
                  <span className="text-4xl">{weatherData.icon}</span>
                  <div>
                    <p className="text-[16px] font-bold text-slate-900">{weatherData.condition}</p>
                    <p className="text-[13px] text-slate-500">{weatherData.temp} · Expected to be <strong className="text-purple-600">{weatherData.impact}</strong></p>
                  </div>
                </div>

                {/* Impact Suggestions */}
                <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-3">Predicted Impact on Products</h4>
                <div className="space-y-3">
                  {weatherData.suggestions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <p className="text-[14px] font-semibold text-slate-900">{s.product}</p>
                        <p className="text-[12px] text-slate-500">{s.reason}</p>
                      </div>
                      <span className={`text-[15px] font-bold ${s.change.startsWith("+") ? "text-[#29B28D]" : "text-red-500"}`}>
                        {s.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Break-Even Calculator */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-[16px] text-slate-900">Break-Even Tracker</h3>
                <p className="text-[11px] font-khmer text-slate-400 mt-0.5">ការតាមដានចំណុចសមតុល្យ</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-full ml-auto">
                <Brain className="w-3 h-3" /> AI
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl text-center">
                <p className="text-[12px] font-semibold text-slate-500 mb-1">Daily Target</p>
                <p className="text-[22px] font-bold text-slate-900">{breakEvenData.dailyTarget}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl text-center">
                <p className="text-[12px] font-semibold text-slate-500 mb-1">Current Revenue</p>
                <p className="text-[22px] font-bold text-[#29B28D]">{breakEvenData.currentRevenue}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl text-center">
                <p className="text-[12px] font-semibold text-slate-500 mb-1">Customers Served</p>
                <p className="text-[22px] font-bold text-slate-900">{breakEvenData.customersServed}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                <p className="text-[12px] font-semibold text-emerald-600 mb-1">Status</p>
                <div className="flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <p className="text-[18px] font-bold text-emerald-600">Exceeded!</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-slate-500">Progress to break-even</span>
                <span className="text-[12px] font-bold text-emerald-500">291% ✓</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700" style={{ width: "100%" }}></div>
              </div>
            </div>
          </div>

          {/* Smart Product Suggestions + Automated Marketing Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Smart Product Suggestions */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-[16px] text-slate-900">Smart Product Suggestions</h3>
                  <p className="text-[11px] font-khmer text-slate-400 mt-0.5">ការណែនាំផលិតផលឆ្លាត</p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-[13px] text-slate-500 bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <Sparkles className="w-4 h-4 text-amber-500 inline mr-1.5 -mt-0.5" />
                  Hidden trends detected based on weather, location, and market data:
                </p>
                {smartSuggestions.map((s, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[15px] font-bold text-slate-900">{s.product}</h4>
                      <span className="text-[13px] font-bold text-[#29B28D] flex items-center gap-1">
                        <ArrowUpRight className="w-3.5 h-3.5" /> {s.potential}
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-500">{s.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Automated Marketing Hub */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Megaphone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-[16px] text-slate-900">Marketing Hub</h3>
                  <p className="text-[11px] font-khmer text-slate-400 mt-0.5">មជ្ឈមណ្ឌលទីផ្សារ</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">f</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-700">Facebook Post</p>
                    <p className="text-[11px] text-slate-400">Auto-generated in Khmer</p>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-full">
                    <Brain className="w-3 h-3" /> AI Generated
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4">
                  <p className="text-[14px] text-slate-700 leading-relaxed font-khmer">{generatedPost.text}</p>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors text-sm min-h-[44px]">
                    <Copy className="w-4 h-4" /> Copy Text
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm min-h-[44px]">
                    <Send className="w-4 h-4" /> Post to Facebook
                  </button>
                </div>

                <button className="w-full mt-3 flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-600 font-semibold py-2.5 rounded-xl transition-colors text-sm">
                  <Sparkles className="w-4 h-4" /> Regenerate Caption
                </button>
              </div>
            </div>
          </div>

          {/* End-of-Day Summary with AI Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[17px] text-slate-900">End-of-Day Summary</h3>
                <p className="text-[12px] font-khmer text-slate-400 mt-0.5">សង្ខេបចុងថ្ងៃ</p>
              </div>
              {isDayLocked && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 text-[12px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Day Locked
                </span>
              )}
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <p className="text-[12px] font-semibold text-slate-500 mb-1">Total Sales</p>
                  <p className="text-[12px] font-khmer text-slate-400 mb-2">ការលក់សរុប</p>
                  <p className="text-[22px] font-bold text-slate-900">{summaryData.sales}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <p className="text-[12px] font-semibold text-slate-500 mb-1">Total Expenses</p>
                  <p className="text-[12px] font-khmer text-slate-400 mb-2">ចំណាយសរុប</p>
                  <p className="text-[22px] font-bold text-red-500">{summaryData.expenses}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center border border-purple-100">
                  <p className="text-[12px] font-semibold text-purple-600 mb-1">Net Profit</p>
                  <p className="text-[12px] font-khmer text-purple-400 mb-2">ប្រាក់ចំណេញ</p>
                  <p className="text-[22px] font-bold text-purple-600">{summaryData.profit}</p>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-gradient-to-r from-purple-50 via-fuchsia-50 to-indigo-50 rounded-xl p-5 mb-6 border border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h4 className="font-bold text-[14px] text-purple-700">AI Daily Summary</h4>
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-100 px-2 py-0.5 rounded-full">PREMIUM</span>
                </div>
                <p className="text-[14px] text-slate-700 leading-relaxed">
                  🚀 <strong>Outstanding day!</strong> Revenue soared 24% above average at $524.50 with a 72.3% margin.
                  Break-even was reached by 11 AM with only 18 customers. The rainy evening drove a 35% spike in Hot Latte sales.
                  Consider adding Hot Chocolate to your menu — similar stalls report $45/day from this item during rainy season.
                  Tomorrow&apos;s forecast: Partly cloudy, expect standard traffic patterns. Suggested morning market buy: 60 Iced Coffee, 25 Mango Sticky Rice.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[13px] text-slate-400 mb-5">
                <span>Auto-calculated: Sales ({summaryData.sales}) − Expenses ({summaryData.expenses}) = <strong className="text-slate-700">{summaryData.profit}</strong></span>
              </div>

              {!isDayLocked ? (
                <button
                  onClick={() => setIsDayLocked(true)}
                  className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white font-bold text-[16px] py-4 rounded-xl shadow-lg shadow-purple-200 transition-all min-h-[56px]"
                >
                  <Lock className="w-5 h-5" />
                  <span>Confirm & Lock Day (បញ្ជាក់ និងចាក់សោ)</span>
                </button>
              ) : (
                <div className="w-full flex items-center justify-center gap-2.5 bg-slate-100 text-slate-500 font-bold text-[16px] py-4 rounded-xl min-h-[56px]">
                  <CheckCircle2 className="w-5 h-5 text-purple-500" />
                  <span>Day Locked — Records Finalized</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* AI Chatbot FAB + Chat Panel */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full shadow-xl shadow-purple-300 flex items-center justify-center text-white hover:scale-110 transition-transform"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-[14px]">AI Assistant</p>
                <p className="text-[11px] text-purple-200">Powered by Gemini</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white/70 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 min-h-[280px]">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-purple-500 text-white rounded-br-md"
                    : "bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:bg-white focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all min-h-[44px]"
              />
              <button className="p-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-xl hover:opacity-90 transition-opacity min-h-[44px]">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Reusable Components ---
function NavItem({ icon: Icon, title, khmerTitle, active = false }: { icon: any; title: string; khmerTitle: string; active?: boolean }) {
  const hrefMap: Record<string, string> = {
    Dashboard: "/vendor/premium",
    Sales: "/vendor/sales",
    Expenses: "/vendor/expenses",
    Customers: "/vendor/customer",
    Inventory: "/vendor/inventory",
    Reports: "/vendor/reports",
    Settings: "/vendor/settings",
  };
  return (
    <Link href={hrefMap[title] || "#"} className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors min-h-[48px] ${active ? "bg-purple-50 text-purple-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${active ? "text-purple-500" : "text-slate-400"}`} />
        <span className={`text-[15px] ${active ? "font-semibold" : "font-medium"}`}>{title}</span>
      </div>
      <span className="text-[11px] font-khmer opacity-60">{khmerTitle}</span>
    </Link>
  );
}

function SummaryCard({ title, khmerTitle, value, icon: Icon, trend, isPositive, subtext, highlight = false }: any) {
  return (
    <div className={`p-5 rounded-2xl border ${highlight ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white border-transparent shadow-lg shadow-purple-200" : "bg-white border-slate-200 shadow-sm"}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className={`text-sm font-semibold ${highlight ? "text-white/90" : "text-slate-500"}`}>{title}</h4>
          <p className={`text-[11px] font-khmer mt-0.5 ${highlight ? "text-white/70" : "text-slate-400"}`}>{khmerTitle}</p>
        </div>
        <div className={`p-2 rounded-xl ${highlight ? "bg-white/20" : "bg-purple-50 text-purple-500 border border-purple-100"}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-[28px] font-bold tracking-tight leading-none">{value}</h2>
        {trend && <span className={`text-sm font-semibold mb-0.5 ${highlight ? "text-white" : isPositive ? "text-purple-500" : "text-red-500"}`}>{trend}</span>}
        {subtext && <span className={`text-sm font-medium mb-0.5 ${highlight ? "text-white/80" : "text-slate-400"}`}>{subtext}</span>}
      </div>
    </div>
  );
}
