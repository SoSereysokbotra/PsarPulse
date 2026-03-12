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
  TrendingDown,
  Menu,
  X,
  Bell,
  Sparkles,
  Search,
  Camera,
  Tag,
  Clock,
  MoreVertical,
  Filter,
  FileBarChart,
  Crown,
  FileText,
  FileSpreadsheet,
} from "lucide-react";

export default function ProExpensePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Ingredients");
  const [expenseVendor, setExpenseVendor] = useState("");
  const [expenseNote, setExpenseNote] = useState("");
  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState(false);
  const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");

  // Categories mixing default and custom for Pro Plan
  const [categories, setCategories] = useState([
    { value: "Ingredients", label: "Ingredients (គ្រឿងផ្សំ)", isCustom: false },
    { value: "Rent", label: "Rent (ថ្លៃជួល)", isCustom: false },
    { value: "Transport", label: "Transport (ការធ្វើដំណើរ)", isCustom: false },
    { value: "Electricity", label: "Electricity (អគ្គិសនី)", isCustom: false },
    { value: "Labor", label: "Labor (កម្លាំងពលកម្ម)", isCustom: false },
    { value: "Marketing", label: "Marketing (ទីផ្សារ)", isCustom: true },
    { value: "Others", label: "Others (ផ្សេងៗ)", isCustom: false },
  ]);

  const summaryData = {
    todayTotal: "$45.00",
    topCategory: "Ingredients",
    weeklyTotal: "$180.50",
    monthlyTotal: "$650.00",
  };

  const recentExpenses = [
    {
      id: 1,
      time: "2:15 PM",
      category: "Ingredients",
      note: "Pork and Vegetables",
      amount: "$25.00",
      hasReceipt: false,
      isCustom: false,
    },
    {
      id: 2,
      time: "10:00 AM",
      category: "Transport",
      note: "TukTuk to market",
      amount: "$3.50",
      hasReceipt: false,
      isCustom: false,
    },
    {
      id: 5,
      time: "Yesterday",
      category: "Marketing",
      note: "Facebook Ads",
      amount: "$10.00",
      hasReceipt: true,
      isCustom: true,
    },
    {
      id: 3,
      time: "Yesterday",
      category: "Electricity",
      note: "Weekly stall power",
      amount: "$15.00",
      hasReceipt: true,
      isCustom: false,
    },
    {
      id: 4,
      time: "Yesterday",
      category: "Labor",
      note: "Assistant pay",
      amount: "$10.00",
      hasReceipt: false,
      isCustom: false,
    },
  ];

  const handleQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Logged Expense: ${expenseAmount} under ${expenseCategory}`);
    setExpenseAmount("");
    setExpenseVendor("");
    setExpenseNote("");
    setIsQuickLogModalOpen(false);
  };

  const handleCreateCustomCategory = () => {
    if (!customCategoryName.trim()) return;
    setCategories(prev => [
      ...prev.slice(0, prev.length - 1), // insert before "Others"
      { value: customCategoryName, label: customCategoryName, isCustom: true },
      prev[prev.length - 1]
    ]);
    setExpenseCategory(customCategoryName);
    setCustomCategoryName("");
    setShowCustomCategoryModal(false);
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
          <Link href="/vendor" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#29B28D] flex items-center justify-center font-bold text-white shadow-sm">
              P
            </div>
            <span className="font-bold text-[19px] tracking-tight">
              PsarPulse KH
            </span>
          </Link>
          <button className="lg:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          <NavItem icon={LayoutDashboard} title="Dashboard" khmerTitle="ផ្ទាំងគ្រប់គ្រង" />
          <NavItem icon={CircleDollarSign} title="Sales" khmerTitle="ការលក់" />
          <NavItem icon={Receipt} title="Expenses" khmerTitle="ចំណាយ" active />
          <NavItem icon={Users} title="Customers" khmerTitle="អតិថិជន" />
          <NavItem icon={Package} title="Inventory" khmerTitle="ស្តុក" />
          <NavItem icon={FileBarChart} title="Reports" khmerTitle="របាយការណ៍" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <NavItem icon={Settings} title="Settings" khmerTitle="ការកំណត់" />
          <div className="mt-3 p-3.5 bg-indigo-50 rounded-xl border border-indigo-200">
            <div className="flex items-center gap-1.5 mb-1">
              <Crown className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold text-sm text-indigo-700">Pro Plan</span>
            </div>
            <p className="text-xs text-indigo-400 mb-2">$3/month · Custom Categories</p>
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
            <button className="lg:hidden text-slate-500 hover:text-slate-900" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-bold text-slate-900">Expense Tracking</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[11px] font-bold rounded-full">
                  <Crown className="w-3 h-3" /> PRO
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
            </button>
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 text-sm shadow-sm">
              SM
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7 max-w-5xl">

          {/* QUICK LOGGING SECTION */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-bold text-[19px]">Log New Expense</h2>
              <p className="text-sm font-khmer text-slate-500 mt-0.5">កត់ត្រាចំណាយថ្មី</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowCustomCategoryModal(true)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-[14px] px-4 py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none min-h-[50px] border border-indigo-200"
              >
                <Plus className="w-4 h-4" />
                <span>Custom Category</span>
              </button>
              <button
                onClick={() => setIsQuickLogModalOpen(true)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[16px] px-6 py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none min-h-[50px]"
              >
                <Plus className="w-5 h-5" />
                <span>Add Expense</span>
              </button>
            </div>
          </div>

          {/* QUICK LOGGING MODAL */}
          {isQuickLogModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
              <div className="absolute inset-0" onClick={() => setIsQuickLogModalOpen(false)}></div>
              <div className="bg-white rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => setIsQuickLogModalOpen(false)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-6 flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[22px] text-slate-900">Log New Expense</h2>
                    <p className="text-sm font-khmer text-slate-500 mt-1">កត់ត្រាចំណាយថ្មី</p>
                  </div>
                </div>

                <form onSubmit={handleQuickLog} className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <CircleDollarSign className="h-6 w-6 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={expenseAmount}
                          onChange={(e) => setExpenseAmount(e.target.value)}
                          required
                          className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xl font-bold placeholder-slate-400 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all min-h-[60px]"
                        />
                        <div className="absolute top-[-10px] left-4 bg-white px-1 text-[11px] font-bold text-slate-500">
                          Amount <span className="text-red-500">*</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="relative group h-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Tag className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <select
                          value={expenseCategory}
                          onChange={(e) => setExpenseCategory(e.target.value)}
                          className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-[15px] font-medium focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all h-full min-h-[60px] appearance-none"
                        >
                          {categories.map((cat, idx) => (
                            <option key={idx} value={cat.value}>
                              {cat.label} {cat.isCustom ? "(Custom)" : ""}
                            </option>
                          ))}
                        </select>
                        <div className="absolute top-[-10px] left-4 bg-white px-1 text-[11px] font-bold text-slate-500 flex items-center justify-between w-[calc(100%-32px)]">
                          <span>Category</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsQuickLogModalOpen(false);
                              setShowCustomCategoryModal(true);
                            }}
                            className="text-indigo-500 hover:text-indigo-700 flex items-center"
                          >
                            <Plus className="w-3 h-3" /> New
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 items-stretch mt-2">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        placeholder="Supplier or Vendor Name"
                        value={expenseVendor}
                        onChange={(e) => setExpenseVendor(e.target.value)}
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-[15px] placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all min-h-[60px]"
                      />
                      <div className="absolute top-[-10px] left-4 bg-white px-1 text-[11px] font-bold text-slate-500">
                        Vendor (អ្នកផ្គត់ផ្គង់)
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="What was this for? (Optional)"
                        value={expenseNote}
                        onChange={(e) => setExpenseNote(e.target.value)}
                        className="block w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-[15px] placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all min-h-[60px]"
                      />
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        className="flex-1 flex flex-col items-center justify-center gap-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold py-3 rounded-xl transition-all min-h-[56px]"
                        title="Upload Receipt"
                      >
                        <Camera className="w-5 h-5" />
                        <span className="text-[12px]">Add Receipt</span>
                      </button>

                      <button
                        type="submit"
                        className="flex-[2] bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[16px] py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 min-h-[56px]"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Save Expense</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* CUSTOM CATEGORY MODAL */}
          {showCustomCategoryModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
              <div className="absolute inset-0" onClick={() => setShowCustomCategoryModal(false)}></div>
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
                <button onClick={() => setShowCustomCategoryModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[19px] text-slate-900">Add Custom Category</h3>
                    <p className="text-[12px] text-slate-500">Create your own expense category tag.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="e.g., Marketing Ads"
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all min-h-[48px]"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={handleCreateCustomCategory}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-colors min-h-[48px]"
                  >
                    Create Category
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <SummaryCard title="Today's Expenses" khmerTitle="ចំណាយថ្ងៃនេះ" value={summaryData.todayTotal} icon={Receipt} trend="4 Transactions" isPositive={false} highlight />
            <SummaryCard title="Top Category" khmerTitle="ប្រភេទចំណាយច្រើនជាងគេ" value={summaryData.topCategory} icon={Tag} />
            <SummaryCard title="Weekly Expenses" khmerTitle="ចំណាយប្រចាំសប្តាហ៍" value={summaryData.weeklyTotal} icon={TrendingDown} trend="+5% vs last week" isPositive={false} />
            <SummaryCard title="Monthly Total" khmerTitle="សរុបប្រចាំខែ" value={summaryData.monthlyTotal} icon={CircleDollarSign} />
          </div>

          {/* Expense History Log */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[17px] text-slate-900">Expense History</h3>
                <p className="text-sm font-khmer text-slate-500 mt-0.5">ប្រវត្តិការចំណាយ</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 min-h-[40px]"
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
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Note / Receipt</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-[15px] font-medium text-slate-900">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {exp.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[13px] font-bold border ${exp.isCustom ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}>
                            {exp.category}
                          </span>
                          {exp.isCustom && (
                            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider bg-white px-1.5 py-0.5 rounded border border-indigo-100 shadow-sm">
                              Custom
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] text-slate-600">{exp.note}</span>
                          {exp.hasReceipt && (
                            <span title="Receipt attached" className="flex items-center">
                              <Camera className="w-4 h-4 text-indigo-500" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[16px] font-bold text-red-500">-{exp.amount}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors opacity-0 group-hover:opacity-100 min-h-[40px] min-w-[40px]">
                          <MoreVertical className="w-5 h-5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
              <button className="text-[14px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline min-h-[40px] px-4">
                View All Pro Expenses
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, title, khmerTitle, active = false }: { icon: any; title: string; khmerTitle: string; active?: boolean }) {
  const hrefMap: Record<string, string> = {
    Dashboard: "/vendor/pro",
    Sales: "/vendor/pro/sales",
    Expenses: "/vendor/pro/expenses",
    Customers: "/vendor/customer",
    Inventory: "/vendor/inventory",
    Reports: "/vendor/reports",
    Settings: "/vendor/settings",
  };

  return (
    <Link
      href={hrefMap[title] || "#"}
      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors min-h-[48px] ${
        active ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${active ? "text-indigo-500" : "text-slate-400"}`} />
        <span className={`text-[15px] ${active ? "font-semibold" : "font-medium"}`}>{title}</span>
      </div>
      <span className="text-[11px] font-khmer opacity-60">{khmerTitle}</span>
    </Link>
  );
}

function SummaryCard({ title, khmerTitle, value, icon: Icon, trend, isPositive, subtext, highlight = false }: any) {
  return (
    <div className={`p-5 rounded-2xl border ${highlight ? "bg-slate-900 text-white border-transparent shadow-md" : "bg-white border-slate-200 shadow-sm"}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className={`text-sm font-semibold ${highlight ? "text-white/90" : "text-slate-500"}`}>{title}</h4>
          <p className={`text-[11px] font-khmer mt-0.5 ${highlight ? "text-white/70" : "text-slate-400"}`}>{khmerTitle}</p>
        </div>
        <div className={`p-2 rounded-xl ${highlight ? "bg-white/10" : "bg-slate-50 text-slate-500 border border-slate-100"}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-[28px] font-bold tracking-tight leading-none">{value}</h2>
        {trend && (
          <span className={`text-sm font-semibold mb-0.5 ${highlight ? "text-white/80" : isPositive === false ? "text-red-500" : "text-indigo-500"}`}>
            {trend}
          </span>
        )}
        {subtext && (
          <span className={`text-sm font-medium mb-0.5 ${highlight ? "text-white/80" : "text-slate-400"}`}>{subtext}</span>
        )}
      </div>
    </div>
  );
}
