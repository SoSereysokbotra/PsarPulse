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
  Search,
  MoreVertical,
  Menu,
  X,
  Bell,
  Clock,
  Filter,
  TrendingUp,
  FileBarChart,
  Crown,
  Sparkles,
  FileText,
  FileSpreadsheet,
  CloudSun,
  Brain,
  MessageSquare,
  AlertTriangle,
  TrendingDown,
  Zap,
  CheckCircle2,
  Target,
  ArrowUpRight,
  Send,
  ShoppingCart,
  Megaphone,
} from "lucide-react";

export default function PremiumSalesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quickAmount, setQuickAmount] = useState("");
  const [quickItem, setQuickItem] = useState("");
  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const transactions = [
    {
      id: 1,
      time: "1:45 PM",
      amount: "$12.50",
      item: "2x Iced Coffee, 1x Bread",
      status: "Logged",
      aiTagged: true,
      tag: "Peak Hour",
    },
    {
      id: 2,
      time: "1:15 PM",
      amount: "$4.00",
      item: "1x Hot Latte",
      status: "Logged",
      aiTagged: true,
      tag: "Weather Driven",
    },
    {
      id: 3,
      time: "12:30 PM",
      amount: "$15.00",
      item: "3x Noodle Soup",
      status: "Logged",
      aiTagged: false,
      tag: "",
    },
    {
      id: 4,
      time: "11:00 AM",
      amount: "$8.50",
      item: "AI Auto-Logged Sale",
      status: "Logged",
      aiTagged: true,
      tag: "Smart Log",
    },
  ];

  const smartAlerts = [
    {
      type: "opportunity",
      message:
        "Rain starting! Demand for Hot Lattes is spiking. Suggest moving cups to the front.",
      time: "10 min ago",
    },
    {
      type: "warning",
      message:
        "Sales dropped 15% in the last hour compared to historical average.",
      time: "1 hour ago",
    },
  ];

  const breakEvenData = {
    customersNeeded: 0,
    customersServed: 124,
    dailyTarget: "$180.00",
    currentRevenue: "$524.50",
    status: "exceeded",
  };

  const weatherData = {
    condition: "Rainy Evening",
    temp: "28°C",
    icon: "🌧️",
    impact: "busy",
    suggestions: [
      {
        product: "Mango Sticky Rice",
        change: "+20%",
        reason: "Comfort food demand rises in rain",
      },
    ],
  };

  const restockSuggestions = [
    {
      item: "Iced Coffee",
      khmer: "កាហ្វេទឹកកក",
      suggestedQty: 60,
      reason: "Consistent morning demand predicted",
      confidence: 92,
    },
    {
      item: "Mango Sticky Rice",
      khmer: "បាយដំណើបស្វាយ",
      suggestedQty: 25,
      reason: "Rainy evening → trend detected",
      confidence: 87,
    },
  ];

  const smartSuggestions = [
    {
      product: "Hot Chocolate",
      reason: "Trending in rainy season",
      potential: "$45/day",
      trend: "up",
    },
  ];

  const handleQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logged:", quickAmount, quickItem);
    setQuickAmount("");
    setQuickItem("");
    setIsQuickLogModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-purple-500 selection:text-white">
      {/* --- SIDEBAR --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <Link href="/vendor" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#29B28D] flex items-center justify-center font-bold text-white shadow-sm">
              P
            </div>
            <span className="font-bold text-[19px] tracking-tight">
              PsarPulse KH
            </span>
          </Link>
          <button
            className="lg:hidden text-slate-400"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          <NavItem
            icon={LayoutDashboard}
            title="Dashboard"
            khmerTitle="ផ្ទាំងគ្រប់គ្រង"
          />
          <NavItem
            icon={CircleDollarSign}
            title="Sales"
            khmerTitle="ការលក់"
            active
          />
          <NavItem icon={Receipt} title="Expenses" khmerTitle="ចំណាយ" />
          <NavItem icon={Users} title="Customers" khmerTitle="អតិថិជន" />
          <NavItem icon={Package} title="Inventory" khmerTitle="ស្តុក" />
          <NavItem icon={FileBarChart} title="Reports" khmerTitle="របាយការណ៍" />
          <NavItem icon={Megaphone} title="Marketing" khmerTitle="ទីផ្សារ" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <NavItem icon={Settings} title="Settings" khmerTitle="ការកំណត់" />
          <div className="mt-3 p-3.5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl text-white">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-sm">Premium Plan</span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              $7/month · AI Assistant Active
            </p>
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
            <button
              className="lg:hidden text-slate-500 hover:text-slate-900"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-bold text-slate-900">
                  AI Sales Tracker
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-600 text-[11px] font-bold rounded-full">
                  <Sparkles className="w-3 h-3" /> PREMIUM
                </span>
              </div>
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

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7 max-w-7xl mx-auto w-full">
          {/* Smart Push Notifications Header Section */}
          <div className="flex flex-col gap-3">
            {smartAlerts.map((alert, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-xl shadow-sm border ${
                  alert.type === "warning"
                    ? "bg-orange-50 border-orange-200"
                    : alert.type === "opportunity"
                      ? "bg-gradient-to-r from-purple-50 to-fuchsia-50 border-purple-200"
                      : "bg-red-50 border-red-200"
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    alert.type === "warning"
                      ? "bg-orange-100"
                      : "bg-white shadow-sm"
                  }`}
                >
                  {alert.type === "warning" ? (
                    <TrendingDown className="w-5 h-5 text-orange-600" />
                  ) : (
                    <Zap className="w-5 h-5 text-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-[14px] font-bold ${alert.type === "warning" ? "text-orange-900" : "text-purple-900"}`}
                    >
                      {alert.type === "opportunity"
                        ? "AI Smart Alert"
                        : "Automated Warning"}
                    </p>
                    <span className="text-[11px] text-slate-400 tracking-wide">
                      {alert.time}
                    </span>
                  </div>
                  <p
                    className={`text-[13px] font-medium mt-0.5 ${alert.type === "warning" ? "text-orange-800" : "text-purple-800"}`}
                  >
                    {alert.message}
                  </p>
                </div>
                <button className="text-[12px] font-bold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-white/50 transition-colors">
                  Dismiss
                </button>
              </div>
            ))}
          </div>

          {/* ── Premium Metric Cards: 4 cards (Revenue, Transactions, Avg Sale, AI Forecast) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white rounded-2xl p-5 shadow-md flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <CircleDollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-purple-100">Today&apos;s Revenue</p>
                <h3 className="text-[24px] font-bold">{breakEvenData.currentRevenue}</h3>
                <p className="text-[11px] text-purple-200 mt-0.5 font-khmer">ចំណូលថ្ងៃនេះ</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-500 rounded-xl border border-purple-100">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-600">Transactions</p>
                <h3 className="text-[24px] font-bold text-slate-900">{breakEvenData.customersServed}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-khmer">ប្រតិបត្តិការ</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-500 rounded-xl border border-purple-100">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-600">Avg. Sale Value</p>
                <h3 className="text-[24px] font-bold text-slate-900">$4.23</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-khmer">តម្លៃលក់មធ្យម</p>
              </div>
            </div>
            <div className="bg-white border border-purple-200 shadow-sm rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-600 rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-600">AI Next-Week</p>
                <h3 className="text-[24px] font-bold text-purple-600">$3,120</h3>
                <p className="text-[11px] text-purple-400 mt-0.5">Forecasted revenue</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Quick Log & Transactions array */}
            <div className="lg:col-span-2 space-y-6">
              {/* QUICK LOGGING - WITH AI ENHANCEMENTS */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
                <div>
                  <h2 className="font-bold text-[19px] flex items-center gap-2 flex-wrap">
                    Unlimited Quick Logging{" "}
                    <Crown className="w-5 h-5 text-purple-500" />
                  </h2>
                  <p className="text-sm font-khmer text-slate-500 mt-0.5">
                    កត់ត្រាការលក់ឥតកំណត់
                  </p>
                </div>
                <button
                  onClick={() => setIsQuickLogModalOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white font-bold text-[16px] px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto min-h-[50px] transform hover:scale-[1.02]"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Smart Add</span>
                </button>
              </div>

              {/* UNLIMITED TRANSACTION HISTORY TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-[17px] text-slate-900">
                      Smart Transaction History
                    </h3>
                    <p className="text-sm font-khmer text-slate-500 mt-0.5">
                      ប្រវត្តិប្រតិបត្តិការឆ្លាតវៃ
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search unlimited logs..."
                        className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 min-h-[40px]"
                      />
                    </div>
                    <button className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors min-h-[40px]">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[13px] text-slate-500 uppercase tracking-wider font-semibold">
                        <th className="px-6 py-4">Time</th>
                        <th className="px-6 py-4">Item Breakdown</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Smart Tag</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.map((txn) => (
                        <tr
                          key={txn.id}
                          className="hover:bg-purple-50/30 transition-colors group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-[15px] font-medium text-slate-900">
                              <Clock className="w-4 h-4 text-slate-400" />
                              {txn.time}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[14px] font-medium text-slate-700">
                              {txn.item}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-[16px] font-bold text-slate-900">
                              {txn.amount}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {txn.aiTagged && txn.tag ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 text-[11px] font-bold rounded-md border border-purple-100">
                                <Brain className="w-3 h-3" /> {txn.tag}
                              </span>
                            ) : (
                              <span className="text-[13px] text-slate-400">
                                -
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button className="p-2 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors opacity-0 group-hover:opacity-100 min-h-[40px] min-w-[40px]">
                              <MoreVertical className="w-5 h-5 mx-auto" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                  <button className="text-[14px] font-semibold text-purple-600 hover:text-purple-700 hover:underline">
                    Load More Logs
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: AI Insights & Predictors */}
            <div className="space-y-6">

              {/* AI Sales Forecaster — Premium exclusive: next-week revenue prediction */}
              <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100 rounded-2xl shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] text-purple-900">AI Sales Forecaster</h3>
                    <p className="text-[11px] font-khmer text-purple-500 mt-0.5">ការព្យាករណ៍ការលក់ AI</p>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 bg-white text-purple-600 text-[10px] font-bold rounded-full shadow-sm">
                    <Brain className="w-3 h-3" /> Gemini
                  </span>
                </div>

                <p className="text-[13px] text-purple-800 mb-4 font-medium">
                  Next-week revenue prediction based on trends &amp; weather:
                </p>

                {/* Mini bar chart: solid = this week, faded = next-week forecast */}
                <div className="flex items-end gap-1.5 mb-3" style={{ height: "64px" }}>
                  {[65, 80, 72, 95, 88, 110, 102].map((h, i) => {
                    const days = ["M", "T", "W", "T", "F", "S", "S"];
                    const isForecast = i >= 4;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <div
                          className={`w-full rounded-t-sm ${isForecast ? "opacity-50" : ""}`}
                          style={{
                            height: `${(h / 110) * 56}px`,
                            background: isForecast
                              ? "linear-gradient(to top, #c084fc, #e879f9)"
                              : "linear-gradient(to top, #7c3aed, #a855f7)",
                          }}
                        />
                        <span className="text-[9px] font-bold text-purple-400">{days[i]}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <div className="w-2.5 h-2.5 rounded-sm bg-purple-700" /> Actual
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <div className="w-2.5 h-2.5 rounded-sm bg-fuchsia-300" /> Forecast
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 border border-purple-100">
                  <p className="text-[12px] text-purple-700 font-semibold flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Predicted: <span className="text-purple-900 font-bold">$3,120 next week</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Rain expected Fri–Sat. Hot beverages may outsell iced drinks by 35%.
                  </p>
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
                      <h3 className="font-bold text-[16px] text-slate-900">
                        Weather Intelligence
                      </h3>
                      <p className="text-[11px] font-khmer text-slate-400 mt-0.5">
                        ព័ត៌មានអាកាសធាតុ
                      </p>
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
                      <p className="text-[16px] font-bold text-slate-900">
                        {weatherData.condition}
                      </p>
                      <p className="text-[13px] text-slate-500">
                        {weatherData.temp} · Expected to be{" "}
                        <strong className="text-purple-600">
                          {weatherData.impact}
                        </strong>
                      </p>
                    </div>
                  </div>

                  {/* Impact Suggestions */}
                  <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Predicted Impact on Products
                  </h4>
                  <div className="space-y-3">
                    {weatherData.suggestions.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <div>
                          <p className="text-[14px] font-semibold text-slate-900">
                            {s.product}
                          </p>
                          <p className="text-[12px] text-slate-500">
                            {s.reason}
                          </p>
                        </div>
                        <span
                          className={`text-[15px] font-bold ${s.change.startsWith("+") ? "text-[#29B28D]" : "text-red-500"}`}
                        >
                          {s.change}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* QUICK LOGGING MODAL FOR PREMIUM */}
      {isQuickLogModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div
            className="absolute inset-0"
            onClick={() => setIsQuickLogModalOpen(false)}
          ></div>

          <div className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-purple-500 to-fuchsia-500"></div>

            <button
              onClick={() => setIsQuickLogModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-600 rounded-xl shadow-sm border border-purple-200">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-[22px] text-slate-900">
                  Smart Log Sale
                </h2>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  Powered by Gemini{" "}
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                </p>
              </div>
            </div>

            <div className="bg-purple-50 p-3 rounded-xl mb-5 flex items-start gap-2 border border-purple-100">
              <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <p className="text-[12px] text-purple-800">
                Type naturally, e.g., "Sold 2 iced coffee for 4 dollars". AI
                will auto-categorize and deduct inventory correctly.
              </p>
            </div>

            <form onSubmit={handleQuickLog} className="flex flex-col gap-5">
              <div className="relative group">
                <input
                  type="text"
                  placeholder='e.g., "3 Noodle soups and 1 iced coffee"'
                  value={quickItem}
                  onChange={(e) => setQuickItem(e.target.value)}
                  className="block w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-[15px] placeholder-slate-400 focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all min-h-[60px]"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount (AI will auto-fill if empty)"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(e.target.value)}
                  className="block w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-[16px] font-bold placeholder-slate-400 focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all min-h-[60px]"
                />
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => setIsQuickLogModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[16px] py-4 rounded-xl transition-all min-h-[56px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white font-bold text-[16px] py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[56px] transform hover:scale-[1.02]"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Log via AI</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Chatbot FAB + Chat Panel for Sales */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-2xl shadow-purple-400/50 flex items-center justify-center text-white hover:scale-110 transition-transform"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          <div className="px-5 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-[14px]">Gemini Sales Assistant</p>
                <p className="text-[11px] text-purple-200">
                  Online • Ready to predict
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 min-h-[300px]">
            <div className="flex justify-start">
              <div className="max-w-[85%] px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm shadow-sm text-[13px] leading-relaxed relative">
                <Sparkles className="w-3 h-3 text-purple-400 absolute -top-1 -left-1" />
                Hi there! I notice sales for Iced Coffee dropped 10% today. I
                cross-checked with the weather API—it’s raining. Do you want me
                to pause your automated restock order for ice tomorrow?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[85%] px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl rounded-tr-sm shadow-sm text-[13px] leading-relaxed">
                Yes, pause it and increase Hot Chocolate cups instead.
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[85%] px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm shadow-sm text-[13px] leading-relaxed relative">
                Done! Inventory logic updated. I've re-routed $15 from ice
                budget to hot cups. Forecast says we'll clear that stock by 8 PM
                tomorrow.
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Message your business assistant..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-400"
              />
              <button className="p-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:opacity-90 transition-opacity shadow-sm">
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
function NavItem({
  icon: Icon,
  title,
  khmerTitle,
  active = false,
}: {
  icon: any;
  title: string;
  khmerTitle: string;
  active?: boolean;
}) {
  const hrefMap: Record<string, string> = {
    Dashboard: "/vendor/premium",
    Sales: "/vendor/premium/sales",
    Expenses: "/vendor/premium/expenses",
    Customers: "/vendor/premium/customer",
    Inventory: "/vendor/premium/inventory",
    Reports: "/vendor/premium/reports",
    Marketing: "/vendor/premium/marketing",
    Settings: "/vendor/settings",
  };

  return (
    <Link
      href={hrefMap[title] || "#"}
      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors min-h-[48px] ${
        active
          ? "bg-purple-50 text-purple-600 font-semibold"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`w-4 h-4 ${active ? "text-purple-500" : "text-slate-400"}`}
        />
        <span className="text-[15px]">{title}</span>
      </div>
      <span className="text-[11px] font-khmer opacity-60">{khmerTitle}</span>
    </Link>
  );
}
