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
  TrendingUp,
  Menu,
  X,
  Bell,
  Sparkles,
  Search,
  Clock,
  Plus,
  Minus,
  FileBarChart,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  FileText,
  FileSpreadsheet,
} from "lucide-react";

const TABS = [
  { id: "analysis", label: "Customers Analysis", khmer: "វិភាគអតិថិជន" },
  { id: "forecast", label: "Forecast Analytics Widget", khmer: "ការព្យាករណ៍វិភាគទិន្នន័យ" },
  { id: "log", label: "Customers Log", khmer: "កំណត់ហេតុអតិថិជន" },
];

export default function CustomersPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("analysis");
  const [customCount, setCustomCount] = useState(1);
  const [logHistory, setLogHistory] = useState([
    { id: 1, time: "2:15 PM", count: 2, status: "Regular" },
    { id: 2, time: "10:00 AM", count: 2, status: "Peak Traffic" },
    { id: 3, time: "11:00 AM", count: 12, status: "Peak Traffic" },
  ]);

  const summaryData = {
    todayCount: 48,
    todayLogs: 4,
    avgSpend: "$5.45",
    weeklyCount: 315,
    weeklyChange: "+27% then last week",
    weeklyCustomers: "15 Customer",
    peakTime: "12:10 PM",
    avgLTV: "$102.02",
  };

  const handleLog = (amount: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setLogHistory((prev) => [
      { id: Date.now(), time: timeStr, count: amount, status: amount >= 10 ? "Peak Traffic" : "Regular" },
      ...prev,
    ]);
  };

  const filtered = logHistory.filter(
    (l) =>
      l.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navItems = [
    { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", active: false },
    { icon: CircleDollarSign, title: "Sales", khmerTitle: "កាហ្វែ", active: false },
    { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", active: false },
    { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", active: true },
    { icon: Package, title: "Inventory", khmerTitle: "ស្តុក", active: false },
    { icon: FileBarChart, title: "Reports", khmerTitle: "រាយការណ៍", active: false },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900 selection:bg-[#29B28D] selection:text-white">
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#0f1117] transform transition-all duration-300 ease-in-out flex flex-col
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-18" : "lg:w-56"}
          w-56`}
      >
        {/* Logo row */}
        <div className={`h-16 flex items-center border-b border-white/10 shrink-0 ${isCollapsed ? "justify-center px-3" : "px-4 gap-3"}`}>
          <div className="w-8 h-8 rounded-lg bg-[#29B28D] flex items-center justify-center font-bold text-white text-sm shrink-0">P</div>
          {!isCollapsed && <span className="font-bold text-white text-[17px] tracking-tight whitespace-nowrap flex-1">PsarPulse KH</span>}
          <button className="lg:hidden text-white/40 hover:text-white ml-auto" onClick={() => setIsMobileOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {navItems.map((item) => (
            <NavItem key={item.title} icon={item.icon} title={item.title} khmerTitle={item.khmerTitle} active={item.active} collapsed={isCollapsed} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-4 space-y-0.5 border-t border-white/10 pt-3">
          <NavItem icon={Settings} title="Settings" khmerTitle="ការកំណត់" collapsed={isCollapsed} />
          {!isCollapsed ? (
            <div className="mt-3 mx-1 p-3 bg-[#29B28D] rounded-xl text-white">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-semibold text-sm">Premium Plan</span>
              </div>
              <p className="text-xs text-white/70">AI Assistant Active</p>
            </div>
          ) : (
            <div className="mt-2 flex justify-center">
              <div className="p-2 bg-[#29B28D] rounded-xl">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
          {/* User row */}
          {!isCollapsed && (
            <div className="flex items-center gap-3 px-2 pt-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold shrink-0">U</div>
              <span className="text-white/70 text-sm">User</span>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col w-full min-w-0">

        {/* Top header bar */}
        <header className="bg-white border-b border-slate-200 h-16 px-5 flex items-center gap-3 sticky top-0 z-30">
          {/* Mobile hamburger */}
          <button className="lg:hidden text-slate-500 hover:text-slate-900" onClick={() => setIsMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>

          {/* Collapse toggle + breadcrumb */}
          <button
            onClick={() => setIsCollapsed((c) => !c)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          <span className="text-slate-500 text-sm font-medium">Customers</span>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              <Zap className="w-3.5 h-3.5 text-[#29B28D]" />
              Quick sale
            </button>
            <button className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              <FileText className="w-3.5 h-3.5" />
              Export PDF
            </button>
            <button className="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export Excel
            </button>
            <button className="relative p-2 text-slate-400 hover:text-slate-700 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">

          {/* Page title + search */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-[26px] font-bold text-slate-900">My Customers</h1>
              <p className="text-slate-500 text-sm mt-0.5">Tracker and Log your daily foot traffic</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Class..."
                className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#29B28D] focus:ring-1 focus:ring-[#29B28D] w-56"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-slate-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 flex flex-col items-start transition-colors ${activeTab === tab.id ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
              >
                <span className="font-semibold text-sm">{tab.label}</span>
                <span className="text-[10px] font-khmer mt-0.5">{tab.khmer}</span>
              </button>
            ))}
          </div>

          {/* 5 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Today Customer */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col justify-between min-h-30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 leading-tight">Today Customer</p>
                  <p className="text-[10px] font-khmer text-slate-500 mt-0.5">អតិថិជនថ្ងៃនេះ</p>
                </div>
              </div>
              <div>
                <div className="text-[38px] font-bold leading-none mt-3">{summaryData.todayCount}</div>
                <p className="text-xs text-slate-400 mt-1">{summaryData.todayLogs} logs</p>
              </div>
            </div>

            {/* Avg.Spend */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between min-h-30">
              <div>
                <p className="text-xs font-semibold text-slate-500">Avg.Spend</p>
                <p className="text-[10px] font-khmer text-slate-400 mt-0.5">កាន់ឈ្នួលការចាយ</p>
              </div>
              <div>
                <div className="text-[32px] font-bold leading-none mt-3 text-slate-900">{summaryData.avgSpend}</div>
                <p className="text-xs text-slate-400 mt-1">per customer</p>
              </div>
            </div>

            {/* Weekly Customer */}
            <div className="bg-[#29B28D] text-white rounded-2xl p-5 flex flex-col justify-between min-h-30">
              <div>
                <p className="text-xs font-semibold text-white/80">Weekly Customer</p>
                <p className="text-[10px] font-khmer text-white/60 mt-0.5">អតិថិជនច្រើនជាងក្នុងរូប</p>
              </div>
              <div>
                <div className="text-[38px] font-bold leading-none mt-3">{summaryData.weeklyCount}</div>
                <p className="text-xs text-white/70 mt-1">{summaryData.weeklyChange}</p>
              </div>
            </div>

            {/* Peak Time */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between min-h-30">
              <div>
                <p className="text-xs font-semibold text-slate-500">Peak Time</p>
                <p className="text-[10px] font-khmer text-slate-400 mt-0.5">ណែនាំការប្រា</p>
              </div>
              <div>
                <div className="text-[26px] font-bold leading-none mt-3 text-slate-900">{summaryData.peakTime}</div>
                <p className="text-xs text-slate-400 mt-1">{summaryData.weeklyCustomers}</p>
              </div>
            </div>

            {/* Avg.LTV */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between min-h-30">
              <div>
                <p className="text-xs font-semibold text-slate-500">Avg.LTV</p>
                <p className="text-[10px] font-khmer text-slate-400 mt-0.5">ភ្លេចអតិថិជន</p>
              </div>
              <div>
                <div className="text-[28px] font-bold leading-none mt-3 text-slate-900">{summaryData.avgLTV}</div>
                <p className="text-xs text-slate-400 mt-1">Per Customer</p>
              </div>
            </div>
          </div>

          {/* Log Customers Bar */}
          <div className="bg-slate-900 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white text-[15px]">Log Customers</p>
              <p className="text-[11px] font-khmer text-slate-400 mt-0.5">កត់ត្រាអតិថិជន</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[1, 5, 10].map((n) => (
                <button key={n} onClick={() => handleLog(n)} className="px-4 py-2 bg-[#29B28D] hover:bg-[#239979] text-white text-sm font-bold rounded-xl transition-colors min-h-11">
                  +{n}
                </button>
              ))}
              <div className="flex items-center bg-white/10 rounded-xl overflow-hidden">
                <button onClick={() => setCustomCount((c) => Math.max(1, c - 1))} className="px-3 py-2 text-white hover:bg-white/10 transition-colors min-h-11">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-bold text-sm w-6 text-center">{customCount}</span>
                <button onClick={() => setCustomCount((c) => c + 1)} className="px-3 py-2 text-white hover:bg-white/10 transition-colors min-h-11">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors min-h-11">
                Custom...
              </button>
              <button className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors min-h-11">
                <Plus className="w-4 h-4" />
              </button>
              <button onClick={() => handleLog(customCount)} className="px-5 py-2 bg-[#29B28D] hover:bg-[#239979] text-white font-bold rounded-xl transition-colors text-sm flex items-center gap-1.5 min-h-11">
                <Plus className="w-4 h-4" />
                Log {customCount}
              </button>
            </div>
          </div>

          {/* Log History Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-[17px] text-slate-900">Expense History</h3>
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#29B28D] focus:ring-1 focus:ring-[#29B28D] min-h-11"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4">Time Logged</th>
                    <th className="px-6 py-4">Count</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-slate-600 text-[15px]">
                          <Clock className="w-4 h-4 text-slate-400" />{log.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[15px] font-bold text-slate-900">+{log.count}</span>
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.status === "Peak Traffic" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">Peak Traffic</span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">Regular</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-slate-300 hover:text-slate-600 text-xl tracking-widest transition-colors">···</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 text-center">
              <button className="text-[#29B28D] text-sm font-semibold hover:underline">View Full History</button>
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
  collapsed = false,
}: {
  icon: any;
  title: string;
  khmerTitle?: string;
  active?: boolean;
  collapsed?: boolean;
}) {
  return (
    <Link
      href="#"
      title={collapsed ? title : undefined}
      className={`flex items-center rounded-lg transition-colors min-h-11 px-2.5
        ${collapsed ? "justify-center" : "justify-between"}
        ${active
          ? "bg-white/10 text-white"
          : "text-white/50 hover:bg-white/5 hover:text-white/80"
        }`}
    >
      <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
        <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#29B28D]" : ""}`} />
        {!collapsed && (
          <span className={`text-[14px] ${active ? "font-semibold text-white" : "font-medium"}`}>
            {title}
          </span>
        )}
      </div>
      {!collapsed && khmerTitle && (
        <span className="text-[10px] font-khmer opacity-50">{khmerTitle}</span>
      )}
    </Link>
  );
}