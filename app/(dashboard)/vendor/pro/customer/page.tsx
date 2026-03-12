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
  Crown,
  FileText,
  FileSpreadsheet,
  Package,
  FileBarChart,
  Search,
  Filter,
  UserCheck,
  Star,
} from "lucide-react";

export default function ProCustomerPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [customerCount, setCustomerCount] = useState("");
  const [isCRMModalOpen, setIsCRMModalOpen] = useState(false);

  // Pro-level CRM form states
  const [crmName, setCrmName] = useState("");
  const [crmPhone, setCrmPhone] = useState("");
  const [crmNotes, setCrmNotes] = useState("");

  const summaryData = {
    todayCustomers: "42",
    avgSpending: "$2.96",
    weeklyCustomers: "315",
    retentionRate: "68%",
  };

  // Mock CRM Customer Database for Pro Tier
  const crmDatabase = [
    {
      id: 101,
      name: "Sokha Heng",
      phone: "012 *** 345",
      visits: 12,
      lastVisit: "Today, 2:30 PM",
      status: "Loyal",
    },
    {
      id: 102,
      name: "Bopha Chan",
      phone: "098 *** 765",
      visits: 5,
      lastVisit: "Yesterday",
      status: "Regular",
    },
    {
      id: 103,
      name: "Anonymous",
      phone: "-",
      visits: 1,
      lastVisit: "Yesterday",
      status: "New",
    },
  ];

  // Mock recent customer logs (Foot Traffic)
  const recentLogs = [
    { id: 1, time: "2:30 PM", count: 2, isPeak: false, loggedBy: "CRM" },
    { id: 2, time: "1:45 PM", count: 5, isPeak: true, loggedBy: "Manual" },
    { id: 3, time: "12:15 PM", count: 12, isPeak: true, loggedBy: "Manual" },
    { id: 4, time: "10:30 AM", count: 3, isPeak: false, loggedBy: "Manual" },
  ];

  const handleQuickAdd = (amount: number) => {
    console.log(`Added ${amount} customers`);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Manually logged ${customerCount} customers`);
    setCustomerCount("");
  };

  const handleCRMSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Saved CRM profile: ${crmName}`);
    setCrmName("");
    setCrmPhone("");
    setCrmNotes("");
    setIsCRMModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
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
          <Link href="/vendor/pro" className="flex items-center gap-3">
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
          <NavItem icon={Package} title="Inventory" khmerTitle="ស្តុក" />
          <NavItem icon={FileBarChart} title="Reports" khmerTitle="របាយការណ៍" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <NavItem icon={Settings} title="Settings" khmerTitle="ការកំណត់" />
          <div className="mt-3 p-3.5 bg-indigo-50 rounded-xl border border-indigo-200">
            <div className="flex items-center gap-1.5 mb-1">
              <Crown className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold text-sm text-indigo-700">
                Pro Plan
              </span>
            </div>
            <p className="text-xs text-indigo-400 mb-2">
              $3/month · CRM Access
            </p>
            <Link
              href="/vendor/pricing"
              className="block w-full text-center text-[12px] font-bold text-indigo-500 hover:text-indigo-600 bg-indigo-100 hover:bg-indigo-200/70 py-1.5 rounded-lg transition-colors"
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
                  Customer & CRM
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[11px] font-bold rounded-full">
                  <Crown className="w-3 h-3" /> PRO
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-3.5 py-2 rounded-xl transition-colors text-sm min-h-[40px]">
              <FileText className="w-4 h-4" /> Export Data
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 text-sm shadow-sm">
              SM
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">
          {/* ── Page header ── */}
          <div className="pt-1 pb-2">
            <h2 className="text-[32px] font-extrabold text-[#111827] leading-tight">
              My Customers
            </h2>
            <p className="text-[14px] text-[#6b7280] mt-1">
              Track and log your daily foot traffic ·{" "}
              <span className="text-[#9ca3af]">តាមដាន និងកត់ត្រាអតិថិជន</span>
            </p>
          </div>

          {/* CRM Modal */}
          {isCRMModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
              <div
                className="absolute inset-0"
                onClick={() => setIsCRMModalOpen(false)}
              ></div>
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => setIsCRMModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[19px] text-slate-900">
                      Add Customer Profile
                    </h3>
                    <p className="text-[12px] text-slate-500">
                      Save details for loyalty tracking.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleCRMSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-bold text-slate-500 mb-1.5 ml-1">
                      Name (ឈ្មោះ)
                    </label>
                    <input
                      type="text"
                      placeholder="Customer Name"
                      value={crmName}
                      onChange={(e) => setCrmName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-500 mb-1.5 ml-1">
                      Phone Number (ទូរស័ព្ទ)
                    </label>
                    <input
                      type="tel"
                      placeholder="012 345 678"
                      value={crmPhone}
                      onChange={(e) => setCrmPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-500 mb-1.5 ml-1">
                      Notes / Preferences
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Prefers less sugar"
                      value={crmNotes}
                      onChange={(e) => setCrmNotes(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl transition-colors mt-2"
                  >
                    Save Customer Info
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Pro Metric Cards — 4 cards including Retention */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <SummaryCard
              title="Today's Traffic"
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
              title="Weekly Traffic"
              khmerTitle="អតិថិជនប្រចាំសប្តាហ៍"
              value={summaryData.weeklyCustomers}
              icon={TrendingUp}
              trend="+12%"
              isPositive={true}
            />
            {/* Pro Feature: Retention Rate Metric */}
            <SummaryCard
              title="Retention Rate"
              khmerTitle="អត្រារក្សាអតិថិជន"
              value={summaryData.retentionRate}
              icon={Star}
              trend="Top 15% Area"
              isPositive={true}
            />
          </div>

          {/* Action Area for Fast Logging & CRM */}
          <div className="bg-white rounded-[20px] shadow-sm border border-slate-200/60 p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10 w-full lg:w-1/3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">
                  Track Customers
                </h2>
                <p className="text-sm font-khmer text-slate-500 mt-0.5">
                  កត់ត្រាអតិថិជនថ្មី
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3 lg:gap-4 relative z-10 w-full lg:w-2/3 justify-end">
              {/* Pro Feature: Add to CRM Button */}
              <button
                onClick={() => setIsCRMModalOpen(true)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 font-bold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 focus:z-10 h-[46px]"
              >
                <UserCheck className="w-4 h-4" />
                <span>Save Profile (CRM)</span>
              </button>

              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200/60">
                <button
                  onClick={() => handleQuickAdd(1)}
                  className="flex-1 sm:w-16 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white text-indigo-600 font-bold text-[15px] shadow-sm border border-slate-200/50 hover:bg-slate-50 transition-all"
                >
                  <span>+1</span>
                </button>
                <button
                  onClick={() => handleQuickAdd(5)}
                  className="flex-1 sm:w-16 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-slate-500 font-bold text-[15px] hover:bg-white hover:text-indigo-600 hover:shadow-sm border border-transparent transition-all"
                >
                  <span>+5</span>
                </button>
              </div>

              <form
                onSubmit={handleManualSubmit}
                className="flex sm:w-48 group h-auto min-h-[46px]"
              >
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Users className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    placeholder="Custom"
                    value={customerCount}
                    onChange={(e) => setCustomerCount(e.target.value)}
                    className="block w-full h-full pl-9 pr-3 py-2.5 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-slate-800 text-[15px] font-semibold placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:z-10 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-4 rounded-r-xl transition-all flex items-center justify-center border border-indigo-500 focus:z-10"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pro Feature: CRM Database View */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[17px] text-slate-900">
                    CRM Profiles
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-0.5">
                    Known customer database
                  </p>
                </div>
                <Search className="w-4 h-4 text-slate-400" />
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">Visits</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {crmDatabase.map((customer) => (
                      <tr
                        key={customer.id}
                        className="hover:bg-indigo-50/30 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="text-[14px] font-bold text-slate-900">
                            {customer.name}
                          </div>
                          <div className="text-[12px] text-slate-500">
                            {customer.phone}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="font-bold text-slate-700">
                            {customer.visits}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                              customer.status === "Loyal"
                                ? "bg-amber-100 text-amber-700"
                                : customer.status === "Regular"
                                  ? "bg-indigo-100 text-indigo-700"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {customer.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
                <button className="text-[13px] font-semibold text-indigo-600 hover:underline">
                  View All CRM Data
                </button>
              </div>
            </div>

            {/* Foot Traffic Log */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[17px] text-slate-900">
                    Foot Traffic Logs
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-0.5">
                    Today&apos;s raw store visits
                  </p>
                </div>
                <Filter className="w-4 h-4 text-slate-400" />
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                      <th className="px-5 py-3">Time</th>
                      <th className="px-5 py-3">Count</th>
                      <th className="px-5 py-3">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-5 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-[13px] font-medium text-slate-600">
                            <Clock className="w-3.5 h-3.5" />
                            {log.time}
                          </div>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className="text-[15px] font-bold text-slate-900">
                            +{log.count}
                          </span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          {log.isPeak ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-[11px] font-bold">
                              <Flame className="w-3 h-3" /> Peak
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-bold">
                              {log.loggedBy}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
                <button className="text-[13px] font-semibold text-[#29B28D] hover:underline">
                  View All Log History
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
  const hrefMap: Record<string, string> = {
    Dashboard: "/vendor/pro",
    Sales: "/vendor/pro/sales",
    Expenses: "/vendor/pro/expenses",
    Customers: "/vendor/pro/customer",
    Inventory: "/vendor/inventory",
    Reports: "/vendor/reports",
    Settings: "/vendor/settings",
  };

  return (
    <Link
      href={hrefMap[title] || "#"}
      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors min-h-[48px] ${
        active
          ? "bg-indigo-50 text-indigo-600"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`w-4 h-4 ${active ? "text-indigo-500" : "text-slate-400"}`}
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
      className={`p-5 rounded-2xl border ${highlight ? "bg-indigo-500 text-white border-transparent shadow-md" : "bg-white border-slate-200 shadow-sm"}`}
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
          className={`p-2 rounded-xl ${highlight ? "bg-white/20" : "bg-indigo-50 text-indigo-500 border border-indigo-100"}`}
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
            className={`text-sm font-semibold mb-0.5 ${highlight ? "text-white" : isPositive ? "text-indigo-500" : "text-red-500"}`}
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
