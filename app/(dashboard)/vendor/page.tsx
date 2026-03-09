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
  CloudRain,
  Menu,
  X,
  Bell,
  Sparkles,
  FileBarChart,
} from "lucide-react";

export default function VendorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const summaryData = {
    sales: "$124.50",
    expenses: "$45.00",
    profit: "$79.50",
    customers: "42",
    avgCustomer: "$2.96",
  };

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
          <Link href="/dashboard" className="flex items-center gap-3">
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
            active
          />
          <NavItem icon={CircleDollarSign} title="Sales" khmerTitle="ការលក់" />
          <NavItem icon={Receipt} title="Expenses" khmerTitle="ចំណាយ" />
          <NavItem icon={Users} title="Customers" khmerTitle="អតិថិជន" />
          <NavItem icon={Package} title="Inventory" khmerTitle="ស្តុក" />
          <NavItem icon={FileBarChart} title="Reports" khmerTitle="របាយការណ៍" />
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
              <h1 className="text-[22px] font-bold text-slate-900">Overview</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-[#29B28D]/10 flex items-center justify-center text-[#29B28D] font-bold border border-[#29B28D] text-sm shadow-sm">
              SM
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">
          {/* AI Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 md:p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-l-4 border-[#29B28D]">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl shrink-0">
                <CloudRain className="w-6 h-6 text-[#29B28D]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-[#29B28D]" />
                  <h3 className="font-semibold text-[15px]">
                    AI Business Insight
                  </h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                  Expected rainy evening. Historically, this increases demand
                  for hot soup by 30%. Suggest preparing extra ingredients and
                  updating your Facebook page.
                </p>
              </div>
            </div>
            <button className="w-full md:w-auto px-5 py-3 bg-[#29B28D] hover:bg-[#239979] text-white font-medium rounded-xl transition-colors text-sm shadow-sm min-h-[48px]">
              Create Post
            </button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <SummaryCard
              title="Total Sales"
              khmerTitle="ការលក់សរុប"
              value={summaryData.sales}
              icon={CircleDollarSign}
              trend="+12%"
              isPositive={true}
            />
            <SummaryCard
              title="Total Expenses"
              khmerTitle="ចំណាយសរុប"
              value={summaryData.expenses}
              icon={Receipt}
              trend="-5%"
              isPositive={true}
            />
            <SummaryCard
              title="Net Profit"
              khmerTitle="ប្រាក់ចំណេញ"
              value={summaryData.profit}
              icon={TrendingUp}
              trend="+18%"
              isPositive={true}
              highlight
            />
            <SummaryCard
              title="Customers"
              khmerTitle="អតិថិជនសរុប"
              value={summaryData.customers}
              icon={Users}
              subtext={`Avg: ${summaryData.avgCustomer}`}
            />
          </div>

          {/* Charts & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-[17px] text-slate-900">
                    Revenue Trend
                  </h3>
                </div>
                <select className="bg-slate-50 border border-slate-200 text-sm font-medium rounded-xl px-3.5 py-2.5 outline-none focus:border-[#29B28D] focus:ring-1 focus:ring-[#29B28D]">
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
              </div>
              <div className="h-56 flex items-end justify-between gap-2 pt-4">
                {[40, 70, 45, 90, 65, 120, 85].map((height, i) => (
                  <div
                    key={i}
                    className="w-full bg-[#29B28D]/10 rounded-t-lg relative group"
                  >
                    <div
                      className="absolute bottom-0 w-full bg-[#29B28D] rounded-t-lg transition-all duration-500 group-hover:bg-[#239979]"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-4 font-medium uppercase tracking-wider">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="mb-5">
                <h3 className="font-semibold text-[17px] text-slate-900">
                  Quick Actions
                </h3>
              </div>

              <div className="flex-1 flex flex-col gap-4 justify-center">
                <button className="w-full flex items-center justify-center gap-2.5 bg-[#29B28D] text-white font-medium text-[15px] py-3.5 px-4 rounded-xl shadow-sm hover:bg-[#239979] active:-translate-y-0 transition-all min-h-[52px]">
                  <Plus className="w-5 h-5" />
                  <span>Log Sale (ការលក់)</span>
                </button>

                <button className="w-full flex items-center justify-center gap-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[15px] py-3.5 px-4 rounded-xl hover:bg-slate-100 transition-colors min-h-[52px]">
                  <Receipt className="w-5 h-5 text-slate-400" />
                  <span>Log Expense (ចំណាយ)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

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
  return (
    <Link
      href="#"
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

function SummaryCard({
  title,
  khmerTitle,
  value,
  icon: Icon,
  trend,
  isPositive,
  subtext,
  highlight = false,
}: any) {
  return (
    <div
      className={`p-5 rounded-2xl border ${highlight ? "bg-[#29B28D] text-white border-transparent shadow-md" : "bg-white border-slate-200 shadow-sm"}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4
            className={`text-sm font-semibold ${highlight ? "text-white/90" : "text-slate-500"}`}
          >
            {title}
          </h4>
          <p
            className={`text-[11px] font-khmer mt-0.5 ${highlight ? "text-white/70" : "text-slate-400"}`}
          >
            {khmerTitle}
          </p>
        </div>
        <div
          className={`p-2 rounded-xl ${highlight ? "bg-white/20" : "bg-slate-50 text-[#29B28D] border border-slate-100"}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-[28px] font-bold tracking-tight leading-none">
          {value}
        </h2>
        {trend && (
          <span
            className={`text-sm font-semibold mb-0.5 ${highlight ? "text-white" : isPositive ? "text-[#29B28D]" : "text-red-500"}`}
          >
            {trend}
          </span>
        )}
        {subtext && (
          <span
            className={`text-sm font-medium mb-0.5 ${highlight ? "text-white/80" : "text-slate-400"}`}
          >
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
