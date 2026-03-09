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
  Menu,
  X,
  Bell,
  Sparkles,
  FileBarChart,
  TrendingUp,
  TrendingDown,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  AlertTriangle,
  Tag,
} from "lucide-react";

// ─── MOCK DATA ────────────────────────────────────────
const plData = {
  revenue: "$1,245.00",
  expenses: "$486.50",
  netProfit: "$758.50",
  revenueTrend: "+18%",
  expenseTrend: "-5%",
  profitTrend: "+24%",
  // daily bars: [revenue, expense] pairs for 7 days
  daily: [
    { day: "Mon", rev: 140, exp: 60 },
    { day: "Tue", rev: 190, exp: 75 },
    { day: "Wed", rev: 120, exp: 50 },
    { day: "Thu", rev: 210, exp: 90 },
    { day: "Fri", rev: 175, exp: 65 },
    { day: "Sat", rev: 250, exp: 85 },
    { day: "Sun", rev: 160, exp: 62 },
  ],
};

const salesData = {
  totalSales: 164,
  avgOrderValue: "$7.60",
  topItems: [
    { name: "Iced Coffee", khmer: "កាហ្វេទឹកកក", qty: 52, revenue: "$78.00", pct: 100 },
    { name: "Noodle Soup", khmer: "គុយទាវ", qty: 38, revenue: "$114.00", pct: 73 },
    { name: "Hot Latte", khmer: "ឡាតេក្តៅ", qty: 30, revenue: "$60.00", pct: 58 },
    { name: "Green Tea", khmer: "តែបៃតង", qty: 24, revenue: "$36.00", pct: 46 },
    { name: "Mango Sticky Rice", khmer: "បាយដំណើបស្វាយ", qty: 20, revenue: "$50.00", pct: 38 },
  ],
  // trend: simple % heights for a sparkline-like bar chart across 7 periods
  trend: [35, 55, 42, 80, 68, 95, 70],
  comparison: { current: "$1,245", previous: "$1,054", change: "+18.1%" },
};

const expenseData = {
  categories: [
    { name: "Ingredients", khmer: "គ្រឿងផ្សំ", amount: "$210.00", pct: 43, color: "#29B28D" },
    { name: "Rent", khmer: "ថ្លៃជួល", amount: "$120.00", pct: 25, color: "#6366f1" },
    { name: "Labor", khmer: "កម្លាំងពលកម្ម", amount: "$80.00", pct: 16, color: "#f59e0b" },
    { name: "Transport", khmer: "ការធ្វើដំណើរ", amount: "$42.00", pct: 9, color: "#ef4444" },
    { name: "Electricity", khmer: "អគ្គិសនី", amount: "$22.50", pct: 5, color: "#8b5cf6" },
    { name: "Others", khmer: "ផ្សេងៗ", amount: "$12.00", pct: 2, color: "#94a3b8" },
  ],
};

const customerData = {
  totalCustomers: 315,
  avgSpend: "$3.95",
  peakHour: "5:00 PM",
  weekdayAvg: 38,
  weekendAvg: 55,
  // hourly traffic: value represents relative customer volume
  hourlyTraffic: [
    { hour: "8AM", val: 15 },
    { hour: "9AM", val: 25 },
    { hour: "10AM", val: 30 },
    { hour: "11AM", val: 45 },
    { hour: "12PM", val: 70 },
    { hour: "1PM", val: 55 },
    { hour: "2PM", val: 35 },
    { hour: "3PM", val: 40 },
    { hour: "4PM", val: 60 },
    { hour: "5PM", val: 85 },
    { hour: "6PM", val: 75 },
    { hour: "7PM", val: 50 },
  ],
  dailyTrend: [42, 38, 45, 40, 48, 56, 52],
};

const inventoryData = {
  lowStockItems: [
    { name: "Hot Latte", khmer: "ឡាតេក្តៅ", stock: 8, threshold: 10, status: "low" as const },
    { name: "Mango Sticky Rice", khmer: "បាយដំណើបស្វាយ", stock: 0, threshold: 5, status: "out" as const },
  ],
  topMovers: [
    { name: "Iced Coffee", sold: 52, restocked: 60 },
    { name: "Noodle Soup", sold: 38, restocked: 40 },
    { name: "Green Tea", sold: 24, restocked: 30 },
  ],
  totalValue: "$345.50",
  totalItems: 24,
};

// ─── MAIN PAGE ────────────────────────────────────────
export default function ReportsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState("This Week");

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-[#29B28D] selection:text-white">
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
          <NavItem icon={LayoutDashboard} title="Dashboard" khmerTitle="ផ្ទាំងគ្រប់គ្រង" />
          <NavItem icon={CircleDollarSign} title="Sales" khmerTitle="ការលក់" />
          <NavItem icon={Receipt} title="Expenses" khmerTitle="ចំណាយ" />
          <NavItem icon={Users} title="Customers" khmerTitle="អតិថិជន" />
          <NavItem icon={Package} title="Inventory" khmerTitle="ស្តុក" />
          <NavItem icon={FileBarChart} title="Reports" khmerTitle="របាយការណ៍" active />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <NavItem icon={Settings} title="Settings" khmerTitle="ការកំណត់" />
          <div className="mt-3 p-3.5 bg-slate-900 rounded-xl text-white">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-[#29B28D]" />
              <span className="font-semibold text-sm">Premium Plan</span>
            </div>
            <p className="text-xs text-slate-400">AI Assistant Active</p>
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
              <h1 className="text-[22px] font-bold text-slate-900">Reports</h1>
              <p className="text-[12px] font-khmer text-slate-500">របាយការណ៍</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-sm font-medium rounded-xl px-3.5 py-2.5 outline-none focus:border-[#29B28D] focus:ring-1 focus:ring-[#29B28D] min-h-[44px]"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>

            {/* Export Button */}
            <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2.5 rounded-xl transition-colors text-sm min-h-[44px]">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-[#29B28D]/10 flex items-center justify-center text-[#29B28D] font-bold border border-[#29B28D] text-sm shadow-sm">
              SM
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">

          {/* ═══════ 1. PROFIT & LOSS ═══════ */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-[#29B28D] rounded-full"></div>
              <h2 className="font-bold text-[19px] text-slate-900">Profit & Loss</h2>
              <span className="text-[12px] font-khmer text-slate-400 ml-1">ចំណេញ និង ខាត</span>
            </div>

            {/* P&L Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
              <PLCard
                title="Total Revenue" khmer="ចំណូលសរុប"
                value={plData.revenue} trend={plData.revenueTrend} isPositive={true}
                icon={<TrendingUp className="w-5 h-5" />}
                accentColor="bg-[#29B28D]"
              />
              <PLCard
                title="Total Expenses" khmer="ចំណាយសរុប"
                value={plData.expenses} trend={plData.expenseTrend} isPositive={true}
                icon={<TrendingDown className="w-5 h-5" />}
                accentColor="bg-slate-900"
              />
              <PLCard
                title="Net Profit" khmer="ប្រាក់ចំណេញសុទ្ធ"
                value={plData.netProfit} trend={plData.profitTrend} isPositive={true}
                icon={<CircleDollarSign className="w-5 h-5" />}
                accentColor="bg-[#29B28D]"
                highlight
              />
            </div>

            {/* P&L Bar Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[15px] text-slate-900 mb-5">Revenue vs Expenses</h3>
              <div className="h-52 flex items-end gap-3">
                {plData.daily.map((d, i) => {
                  const maxVal = 260;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end gap-0.5 justify-center h-44">
                        {/* Revenue bar */}
                        <div className="w-[45%] bg-[#29B28D]/15 rounded-t-md relative group">
                          <div
                            className="absolute bottom-0 w-full bg-[#29B28D] rounded-t-md transition-all duration-500 group-hover:bg-[#239979]"
                            style={{ height: `${(d.rev / maxVal) * 100}%` }}
                          ></div>
                        </div>
                        {/* Expense bar */}
                        <div className="w-[45%] bg-red-100 rounded-t-md relative group">
                          <div
                            className="absolute bottom-0 w-full bg-red-400 rounded-t-md transition-all duration-500 group-hover:bg-red-500"
                            style={{ height: `${(d.exp / maxVal) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{d.day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
                  <div className="w-3 h-3 rounded-sm bg-[#29B28D]"></div> Revenue
                </div>
                <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
                  <div className="w-3 h-3 rounded-sm bg-red-400"></div> Expenses
                </div>
              </div>
            </div>
          </section>

          {/* ═══════ 2. SALES REPORT ═══════ */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-[#29B28D] rounded-full"></div>
              <h2 className="font-bold text-[19px] text-slate-900">Sales Report</h2>
              <span className="text-[12px] font-khmer text-slate-400 ml-1">របាយការណ៍ការលក់</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Selling Items */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h3 className="font-semibold text-[15px] text-slate-900">Top Selling Items</h3>
                  <p className="text-[12px] font-khmer text-slate-400 mt-0.5">ទំនិញលក់ដាច់ជាងគេ</p>
                </div>
                <div className="p-5 space-y-4">
                  {salesData.topItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-[12px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <span className="text-[14px] font-semibold text-slate-900">{item.name}</span>
                            <span className="text-[11px] font-khmer text-slate-400 ml-2">{item.khmer}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[14px] font-bold text-[#29B28D]">{item.revenue}</span>
                            <span className="text-[12px] text-slate-400 ml-2">({item.qty} sold)</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#29B28D] rounded-full transition-all duration-700"
                            style={{ width: `${item.pct}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sales Summary + Trend */}
              <div className="flex flex-col gap-6">
                {/* Period Comparison */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex-1">
                  <h3 className="font-semibold text-[15px] text-slate-900 mb-4">Period Comparison</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-slate-500 font-medium">Current</span>
                      <span className="text-[17px] font-bold text-slate-900">{salesData.comparison.current}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-slate-500 font-medium">Previous</span>
                      <span className="text-[17px] font-bold text-slate-400">{salesData.comparison.previous}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[13px] text-slate-500 font-medium">Change</span>
                      <span className="flex items-center gap-1 text-[15px] font-bold text-[#29B28D]">
                        <ArrowUpRight className="w-4 h-4" />
                        {salesData.comparison.change}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sales Trend Mini Chart */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex-1">
                  <h3 className="font-semibold text-[15px] text-slate-900 mb-4">Sales Trend</h3>
                  <div className="h-24 flex items-end gap-1.5">
                    {salesData.trend.map((h, i) => (
                      <div key={i} className="flex-1 bg-[#29B28D]/10 rounded-t-md relative group">
                        <div
                          className="absolute bottom-0 w-full bg-[#29B28D] rounded-t-md transition-all duration-500 group-hover:bg-[#239979]"
                          style={{ height: `${h}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[13px] text-slate-500 font-medium">
                    <span>Total: {salesData.totalSales} sales</span>
                    <span>·</span>
                    <span>Avg: {salesData.avgOrderValue}/order</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════ 3. EXPENSE BREAKDOWN ═══════ */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-[#29B28D] rounded-full"></div>
              <h2 className="font-bold text-[19px] text-slate-900">Expense Breakdown</h2>
              <span className="text-[12px] font-khmer text-slate-400 ml-1">ការបែងចែកចំណាយ</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Donut-style visual */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-[15px] text-slate-900 mb-5">By Category</h3>
                {/* CSS Donut */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-44 h-44">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      {(() => {
                        let offset = 0;
                        return expenseData.categories.map((cat, i) => {
                          const dash = cat.pct;
                          const gap = 100 - dash;
                          const el = (
                            <circle
                              key={i}
                              cx="18" cy="18" r="15.9155"
                              fill="none"
                              stroke={cat.color}
                              strokeWidth="3.5"
                              strokeDasharray={`${dash} ${gap}`}
                              strokeDashoffset={-offset}
                              className="transition-all duration-700"
                            />
                          );
                          offset += dash;
                          return el;
                        });
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[22px] font-bold text-slate-900">$486</span>
                      <span className="text-[11px] text-slate-400 font-medium">Total</span>
                    </div>
                  </div>
                </div>
                {/* Legend */}
                <div className="grid grid-cols-2 gap-2.5">
                  {expenseData.categories.map((cat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></div>
                      <span className="text-[12px] text-slate-600 font-medium truncate">{cat.name}</span>
                      <span className="text-[12px] text-slate-400 font-semibold ml-auto">{cat.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Bars */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-[15px] text-slate-900 mb-5">Category Details</h3>
                <div className="space-y-4">
                  {expenseData.categories.map((cat, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-semibold text-slate-900">{cat.name}</span>
                          <span className="text-[11px] font-khmer text-slate-400">{cat.khmer}</span>
                        </div>
                        <span className="text-[14px] font-bold text-slate-700">{cat.amount}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══════ 4. CUSTOMER ANALYTICS ═══════ */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-[#29B28D] rounded-full"></div>
              <h2 className="font-bold text-[19px] text-slate-900">Customer Analytics</h2>
              <span className="text-[12px] font-khmer text-slate-400 ml-1">ការវិភាគអតិថិជន</span>
            </div>

            {/* Customer Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              <MiniCard title="Total Customers" khmer="អតិថិជនសរុប" value={String(customerData.totalCustomers)} />
              <MiniCard title="Avg. Spend" khmer="ការចំណាយមធ្យម" value={customerData.avgSpend} />
              <MiniCard title="Peak Hour" khmer="ម៉ោងមមាញឹក" value={customerData.peakHour} accent />
              <MiniCard title="Weekend Avg" khmer="ចុងសប្តាហ៍មធ្យម" value={String(customerData.weekendAvg)} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hourly Traffic Chart */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-[15px] text-slate-900 mb-1">Hourly Traffic</h3>
                <p className="text-[12px] text-slate-400 font-medium mb-5">Customer volume by hour of day</p>
                <div className="h-40 flex items-end gap-1">
                  {customerData.hourlyTraffic.map((h, i) => {
                    const isPeak = h.val >= 70;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className={`w-full ${isPeak ? "bg-orange-100" : "bg-slate-100"} rounded-t-md relative group`} style={{ height: "120px" }}>
                          <div
                            className={`absolute bottom-0 w-full rounded-t-md transition-all duration-500 ${isPeak ? "bg-orange-400 group-hover:bg-orange-500" : "bg-[#29B28D] group-hover:bg-[#239979]"}`}
                            style={{ height: `${(h.val / 90) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[9px] text-slate-400 font-medium">{h.hour}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-5 mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#29B28D]"></div> Regular
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                    <Flame className="w-3 h-3 text-orange-400" /> Peak Hours
                  </div>
                </div>
              </div>

              {/* Daily Trend */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-[15px] text-slate-900 mb-1">Daily Customer Trend</h3>
                <p className="text-[12px] text-slate-400 font-medium mb-5">Customers per day this week</p>
                <div className="h-40 flex items-end gap-2">
                  {customerData.dailyTrend.map((val, i) => {
                    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                    const isWeekend = i >= 5;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[11px] font-bold text-slate-500">{val}</span>
                        <div className={`w-full ${isWeekend ? "bg-[#29B28D]/15" : "bg-slate-100"} rounded-t-lg relative group`} style={{ height: "110px" }}>
                          <div
                            className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${isWeekend ? "bg-[#29B28D] group-hover:bg-[#239979]" : "bg-slate-400 group-hover:bg-slate-500"}`}
                            style={{ height: `${(val / 60) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">{days[i]}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-5 mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                    <div className="w-2.5 h-2.5 rounded-sm bg-slate-400"></div> Weekday
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#29B28D]"></div> Weekend
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════ 5. INVENTORY REPORT ═══════ */}
          <section className="pb-4">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-6 bg-[#29B28D] rounded-full"></div>
              <h2 className="font-bold text-[19px] text-slate-900">Inventory Report</h2>
              <span className="text-[12px] font-khmer text-slate-400 ml-1">របាយការណ៍ស្តុក</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Low Stock Alerts */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-[15px] text-slate-900">Low Stock Alerts</h3>
                    <p className="text-[12px] font-khmer text-slate-400 mt-0.5">ស្តុកជិតអស់</p>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  {inventoryData.lowStockItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                      <div>
                        <p className="text-[14px] font-semibold text-slate-900">{item.name}</p>
                        <p className="text-[11px] font-khmer text-slate-400">{item.khmer}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[16px] font-bold text-slate-900">{item.stock}</span>
                        {item.status === "out" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold">
                            Low Stock
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {inventoryData.lowStockItems.length === 0 && (
                    <p className="text-center text-slate-400 py-6 text-sm">All items are well stocked! ✓</p>
                  )}
                </div>
              </div>

              {/* Stock Movement */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                  <Package className="w-5 h-5 text-slate-400" />
                  <div>
                    <h3 className="font-semibold text-[15px] text-slate-900">Stock Movement</h3>
                    <p className="text-[12px] font-khmer text-slate-400 mt-0.5">ចលនាស្តុក</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[12px] text-slate-500 uppercase tracking-wider font-semibold">
                        <th className="px-6 py-3">Product</th>
                        <th className="px-6 py-3 text-center">Sold</th>
                        <th className="px-6 py-3 text-center">Restocked</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inventoryData.topMovers.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-[14px] font-semibold text-slate-900">{item.name}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-[14px] font-bold text-red-500 flex items-center justify-center gap-1">
                              <ArrowDownRight className="w-3.5 h-3.5" /> {item.sold}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-[14px] font-bold text-[#29B28D] flex items-center justify-center gap-1">
                              <ArrowUpRight className="w-3.5 h-3.5" /> {item.restocked}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[13px]">
                  <span className="text-slate-500 font-medium">Total Products: <strong className="text-slate-900">{inventoryData.totalItems}</strong></span>
                  <span className="text-slate-500 font-medium">Est. Value: <strong className="text-[#29B28D]">{inventoryData.totalValue}</strong></span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────

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
    Dashboard: "/vendor",
    Sales: "/vendor/sales",
    Expenses: "/vendor/expenses",
    Customers: "/vendor/customer",
    Inventory: "/vendor/inventory",
    Reports: "/vendor/reports",
    Settings: "/vendor/settings",
  };

  return (
    <Link
      href={hrefMap[title] || "#"}
      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors min-h-[48px] ${
        active
          ? "bg-[#29B28D]/10 text-[#29B28D]"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`w-4 h-4 ${active ? "text-[#29B28D]" : "text-slate-400"}`}
        />
        <span
          className={`text-[15px] ${active ? "font-semibold" : "font-medium"}`}
        >
          {title}
        </span>
      </div>
      <span className="text-[11px] font-khmer opacity-60">{khmerTitle}</span>
    </Link>
  );
}

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
    <div className={`p-5 rounded-2xl border ${highlight ? "bg-[#29B28D] text-white border-transparent shadow-md" : "bg-white border-slate-200 shadow-sm"}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className={`text-sm font-semibold ${highlight ? "text-white/90" : "text-slate-500"}`}>{title}</h4>
          <p className={`text-[11px] font-khmer mt-0.5 ${highlight ? "text-white/70" : "text-slate-400"}`}>{khmer}</p>
        </div>
        <div className={`p-2 rounded-xl ${highlight ? "bg-white/20" : `${accentColor}/10 border border-slate-100`}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-[26px] font-bold tracking-tight leading-none">{value}</h2>
        <span className={`text-sm font-semibold mb-0.5 ${highlight ? "text-white" : isPositive ? "text-[#29B28D]" : "text-red-500"}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function MiniCard({
  title,
  khmer,
  value,
  accent = false,
}: {
  title: string;
  khmer: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`p-4 rounded-2xl border ${accent ? "bg-[#29B28D]/10 border-[#29B28D]/20" : "bg-white border-slate-200 shadow-sm"}`}>
      <p className="text-[12px] font-semibold text-slate-500 mb-0.5">{title}</p>
      <p className="text-[10px] font-khmer text-slate-400">{khmer}</p>
      <h3 className={`text-[22px] font-bold mt-2 ${accent ? "text-[#29B28D]" : "text-slate-900"}`}>{value}</h3>
    </div>
  );
}
