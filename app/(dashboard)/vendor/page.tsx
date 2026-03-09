"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Settings,
  Plus,
  TrendingUp,
  Menu,
  X,
  Bell,
  ArrowUpRight,
  Lock,
  CheckCircle2,
} from "lucide-react";

export default function VendorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDayLocked, setIsDayLocked] = useState(false);

  const summaryData = {
    sales: "$124.50",
    expenses: "$45.00",
    profit: "$79.50",
    customers: "42",
    avgCustomer: "$2.96",
  };

  // Free plan: 500 logs/month cap
  const usageData = {
    used: 127,
    limit: 500,
  };

  // Weekly revenue data
  const weeklyData = [40, 70, 45, 90, 65, 120, 85];
  const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Monthly revenue data (4 weeks)
  const monthlyData = [320, 480, 410, 540];
  const monthlyLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];

  // Expenses by category
  const expenseChartData = [
    { label: "គ្រឿងផ្សំ", value: 43, color: "#29B28D" },
    { label: "ថ្លៃជួល", value: 25, color: "#6366f1" },
    { label: "ពលកម្ម", value: 16, color: "#f59e0b" },
    { label: "ដឹកជញ្ជូន", value: 9, color: "#ef4444" },
    { label: "អគ្គិសនី", value: 5, color: "#8b5cf6" },
    { label: "ផ្សេងៗ", value: 2, color: "#94a3b8" },
  ];

  const usagePct = Math.min((usageData.used / usageData.limit) * 100, 100);

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
          <NavItem
            icon={LayoutDashboard}
            title="Dashboard"
            khmerTitle="ផ្ទាំងគ្រប់គ្រង"
            active
          />
          <NavItem icon={CircleDollarSign} title="Sales" khmerTitle="ការលក់" />
          <NavItem icon={Receipt} title="Expenses" khmerTitle="ចំណាយ" />
          <NavItem icon={Users} title="Customers" khmerTitle="អតិថិជន" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <NavItem icon={Settings} title="Settings" khmerTitle="ការកំណត់" />
          <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-slate-700">Free Plan</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ឥតគិតថ្លៃ</span>
            </div>
            <Link
              href="/vendor/pricing"
              className="block w-full text-center text-[13px] font-bold text-[#29B28D] hover:text-[#239979] bg-[#29B28D]/10 hover:bg-[#29B28D]/15 py-2 rounded-lg transition-colors"
            >
              Upgrade Plan ↗
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
              <h1 className="text-[22px] font-bold text-slate-900">Overview</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#29B28D]/10 flex items-center justify-center text-[#29B28D] font-bold border border-[#29B28D] text-sm shadow-sm">
              SM
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">
          {/* Usage Limit Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-[15px] text-slate-900">
                  Monthly Sales Logs
                </h3>
                <p className="text-[12px] font-khmer text-slate-400 mt-0.5">កំណត់ត្រាលក់ប្រចាំខែ</p>
              </div>
              <span className="text-[14px] font-bold text-slate-700">
                {usageData.used} / {usageData.limit}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${usagePct > 80 ? "bg-orange-400" : "bg-[#29B28D]"}`}
                style={{ width: `${usagePct}%` }}
              ></div>
            </div>
            <p className="text-[12px] text-slate-400 mt-2 font-medium">
              {usageData.limit - usageData.used} logs remaining · Resets monthly ·{" "}
              <Link href="/vendor/settings" className="text-[#29B28D] hover:underline">
                Upgrade for unlimited
              </Link>
            </p>
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

          {/* 3 Simple Charts: Weekly, Monthly, Expenses */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Revenue Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[15px] text-slate-900 mb-1">
                Weekly Revenue
              </h3>
              <p className="text-[12px] font-khmer text-slate-400 mb-5">ចំណូលប្រចាំសប្តាហ៍</p>
              <div className="h-40 flex items-end gap-1.5">
                {weeklyData.map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div className="w-full bg-[#29B28D]/10 rounded-t-lg relative group" style={{ height: "120px" }}>
                      <div
                        className="absolute bottom-0 w-full bg-[#29B28D] rounded-t-lg transition-all duration-500 group-hover:bg-[#239979]"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {weeklyLabels[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Revenue Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[15px] text-slate-900 mb-1">
                Monthly Revenue
              </h3>
              <p className="text-[12px] font-khmer text-slate-400 mb-5">ចំណូលប្រចាំខែ</p>
              <div className="h-40 flex items-end gap-2">
                {monthlyData.map((val, i) => {
                  const maxVal = 600;
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span className="text-[11px] font-bold text-slate-500">${val}</span>
                      <div className="w-full bg-[#29B28D]/10 rounded-t-lg relative group" style={{ height: "100px" }}>
                        <div
                          className="absolute bottom-0 w-full bg-[#29B28D] rounded-t-lg transition-all duration-500 group-hover:bg-[#239979]"
                          style={{ height: `${(val / maxVal) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {monthlyLabels[i]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expenses Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[15px] text-slate-900 mb-1">
                Expenses
              </h3>
              <p className="text-[12px] font-khmer text-slate-400 mb-5">ការចំណាយ</p>
              <div className="space-y-3">
                {expenseChartData.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-khmer font-medium text-slate-600">
                        {item.label}
                      </span>
                      <span className="text-[12px] font-bold text-slate-500">
                        {item.value}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${item.value}%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="mb-5">
                <h3 className="font-semibold text-[17px] text-slate-900">
                  Quick Actions
                </h3>
                <p className="text-[12px] font-khmer text-slate-400 mt-0.5">សកម្មភាពរហ័ស</p>
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

            {/* End-of-Day Summary */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[17px] text-slate-900">
                    End-of-Day Summary
                  </h3>
                  <p className="text-[12px] font-khmer text-slate-400 mt-0.5">សង្ខេបចុងថ្ងៃ</p>
                </div>
                {isDayLocked && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#29B28D]/10 text-[#29B28D] text-[12px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Day Locked
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
                  <div className="p-4 bg-[#29B28D]/10 rounded-xl text-center border border-[#29B28D]/20">
                    <p className="text-[12px] font-semibold text-[#29B28D] mb-1">Net Profit</p>
                    <p className="text-[12px] font-khmer text-[#29B28D]/70 mb-2">ប្រាក់ចំណេញ</p>
                    <p className="text-[22px] font-bold text-[#29B28D]">{summaryData.profit}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[13px] text-slate-400 mb-5">
                  <span>Auto-calculated: Sales ({summaryData.sales}) − Expenses ({summaryData.expenses}) = <strong className="text-slate-700">{summaryData.profit}</strong></span>
                </div>

                {!isDayLocked ? (
                  <button
                    onClick={() => setIsDayLocked(true)}
                    className="w-full flex items-center justify-center gap-2.5 bg-[#29B28D] hover:bg-[#239979] text-white font-bold text-[16px] py-4 rounded-xl shadow-sm transition-all min-h-[56px]"
                  >
                    <Lock className="w-5 h-5" />
                    <span>Confirm & Lock Day (បញ្ជាក់ និងចាក់សោ)</span>
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-center gap-2.5 bg-slate-100 text-slate-500 font-bold text-[16px] py-4 rounded-xl min-h-[56px]">
                    <CheckCircle2 className="w-5 h-5 text-[#29B28D]" />
                    <span>Day Locked — Records Finalized</span>
                  </div>
                )}
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
  const hrefMap: Record<string, string> = {
    Dashboard: "/vendor",
    Sales: "/vendor/sales",
    Expenses: "/vendor/expenses",
    Customers: "/vendor/customer",
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
