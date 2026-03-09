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
  UserPlus,
  Clock,
  Flame,
} from "lucide-react";

export default function CustomerPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [customerCount, setCustomerCount] = useState("");

  const summaryData = {
    todayCustomers: "42",
    avgSpending: "$2.96",
    weeklyCustomers: "315",
  };

  // Mock recent customer logs
  const recentLogs = [
    { id: 1, time: "2:30 PM", count: 2, isPeak: false },
    { id: 2, time: "1:45 PM", count: 5, isPeak: true },
    { id: 3, time: "12:15 PM", count: 12, isPeak: true },
    { id: 4, time: "10:30 AM", count: 3, isPeak: false },
  ];

  const handleQuickAdd = (amount: number) => {
    console.log(`Added ${amount} customers`);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Manually logged ${customerCount} customers`);
    setCustomerCount("");
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
          <NavItem icon={CircleDollarSign} title="Sales" khmerTitle="ការលក់" />
          <NavItem icon={Receipt} title="Expenses" khmerTitle="ចំណាយ" />
          <NavItem icon={Users} title="Customers" khmerTitle="អតិថិជន" active />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <NavItem icon={Settings} title="Settings" khmerTitle="ការកំណត់" />
          <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-slate-700">Free Plan</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ឥតគិតថ្លៃ</span>
            </div>
            <Link
              href="/vendor/settings"
              className="block w-full text-center text-[13px] font-bold text-[#29B28D] hover:text-[#239979] bg-[#29B28D]/10 hover:bg-[#29B28D]/15 py-2 rounded-lg transition-colors"
            >
              Upgrade to Pro ↗
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
              <h1 className="text-[22px] font-bold text-slate-900">
                Customer Tracking
              </h1>
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
          {/* Action Area for Fast Logging */}
          <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-[#29B28D]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#29B28D]/10 flex items-center justify-center text-[#29B28D] flex-shrink-0">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">
                  Log New Customers
                </h2>
                <p className="text-sm font-khmer text-slate-500 mt-0.5">
                  កត់ត្រាអតិថិជនថ្មី
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3 lg:gap-4 relative z-10 w-full lg:w-auto">
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200/60">
                <button
                  onClick={() => handleQuickAdd(1)}
                  className="flex-1 sm:w-20 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-white text-[#29B28D] font-bold text-[15px] shadow-sm border border-slate-200/50 hover:bg-slate-50 transition-all"
                >
                  <span>+1</span>
                </button>
                <button
                  onClick={() => handleQuickAdd(5)}
                  className="flex-1 sm:w-20 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-slate-500 font-bold text-[15px] hover:bg-white hover:text-[#29B28D] hover:shadow-sm border border-transparent transition-all"
                >
                  <span>+5</span>
                </button>
              </div>

              <form
                onSubmit={handleManualSubmit}
                className="flex sm:w-56 group h-auto min-h-[46px]"
              >
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Users className="h-4 w-4 text-slate-400 group-focus-within:text-[#29B28D] transition-colors" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    placeholder="Custom..."
                    value={customerCount}
                    onChange={(e) => setCustomerCount(e.target.value)}
                    className="block w-full h-full pl-9 pr-3 py-2.5 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-slate-800 text-[15px] font-semibold placeholder-slate-400 focus:bg-white focus:border-[#29B28D] focus:ring-1 focus:ring-[#29B28D] focus:z-10 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#29B28D] hover:bg-[#239979] text-white font-bold px-5 rounded-r-xl transition-all flex items-center justify-center border border-[#29B28D] hover:border-[#239979] focus:z-10"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Metric Cards — 3 cards (no locked Peak Hour) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <SummaryCard
              title="Today's Customers"
              khmerTitle="អតិថិជនថ្ងៃនេះ"
              value={summaryData.todayCustomers}
              icon={Users}
              trend="+4"
              isPositive={true}
              highlight
            />
            <SummaryCard
              title="Avg. Spend/Customer"
              khmerTitle="ការចំណាយមធ្យម"
              value={summaryData.avgSpending}
              icon={CircleDollarSign}
              trend="+$0.40"
              isPositive={true}
            />
            <SummaryCard
              title="Weekly Customers"
              khmerTitle="អតិថិជនប្រចាំសប្តាហ៍"
              value={summaryData.weeklyCustomers}
              icon={TrendingUp}
              trend="+12%"
              isPositive={true}
            />
          </div>

          {/* Customer History Log */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[17px] text-slate-900">
                  Recent Customer Logs
                </h3>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  Today&apos;s recorded foot traffic
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4">Time Logged</th>
                    <th className="px-6 py-4">Customer Count</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5 text-[15px] font-medium text-slate-900">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {log.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-[17px] font-bold text-slate-900">
                            +{log.count}
                          </span>
                          <Users className="w-4 h-4 text-slate-400" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.isPeak ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                            <Flame className="w-3 h-3" />
                            Peak Traffic
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                            Regular
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
              <button className="text-[14px] font-semibold text-[#29B28D] hover:underline">
                View Full History
              </button>
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
