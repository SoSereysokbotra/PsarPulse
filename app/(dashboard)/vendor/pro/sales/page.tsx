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
  Search,
  MoreVertical,
  Menu,
  X,
  Bell,
  Clock,
  Filter,
  TrendingUp,
  Package,
  FileBarChart,
  Crown,
  FileText,
  CheckCircle2,
} from "lucide-react";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { Period } from "../../expenses/page";

const PRO_NAV = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    khmerTitle: "ផ្ទាំងគ្រប់គ្រង",
    href: "/vendor/pro",
  },
  {
    icon: CircleDollarSign,
    title: "Sales",
    khmerTitle: "ការលក់",
    href: "/vendor/pro/sales",
    active: true,
  },
  {
    icon: Receipt,
    title: "Expenses",
    khmerTitle: "ចំណាយ",
    href: "/vendor/pro/expenses",
  },
  {
    icon: Users,
    title: "Customers",
    khmerTitle: "អតិថិជន",
    href: "/vendor/pro/customer",
  },
  {
    icon: Package,
    title: "Inventory",
    khmerTitle: "ស្តុក",
    href: "/vendor/pro/inventory",
  },
  {
    icon: FileBarChart,
    title: "Reports",
    khmerTitle: "របាយការណ៍",
    href: "/vendor/pro/reports",
  },
];

export default function ProSalesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quickAmount, setQuickAmount] = useState("");
  const [quickItem, setQuickItem] = useState("");
  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("Day");

  // Pro features: unlimited tracking
  // Mock data for today's transactions
  const transactions = [
    {
      id: 1,
      time: "1:45 PM",
      amount: "$12.50",
      item: "2x Iced Coffee, 1x Bread",
      status: "Logged",
    },
    {
      id: 2,
      time: "1:15 PM",
      amount: "$4.00",
      item: "1x Hot Latte",
      status: "Logged",
    },
    {
      id: 3,
      time: "12:30 PM",
      amount: "$15.00",
      item: "3x Noodle Soup",
      status: "Logged",
    },
    {
      id: 4,
      time: "11:00 AM",
      amount: "$8.50",
      item: "Quick Sale",
      status: "Logged",
    },
  ];

  const handleQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logged:", quickAmount, quickItem);
    setQuickAmount("");
    setQuickItem("");
    setIsQuickLogModalOpen(false);
  };

  const activeTxns = transactions;
  const totalRevenue = transactions.reduce(
    (sum, t) => sum + parseFloat(t.amount.replace("$", "")),
    0,
  );
  const avgSale = totalRevenue / (activeTxns.length || 1);

  function openAdd(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <VendorDashboardLayout
      plan="pro"
      navLinks={PRO_NAV}
      currentPath="/vendor/pro/sales"
      title="Sales Management"
      planBadge={{ label: "PRO", icon: Crown }}
      rightActions={
        <>
          {/* 1. Period Toggle (Day / Week / Month) */}
          <div className="hidden sm:flex items-center bg-[#f0f2f5] border border-[#e8eaed] dark:border-white/5 rounded-[10px] p-[3px]">
            {(["Day", "Week", "Month"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-[7px] rounded-[8px] text-[13px] font-semibold border-0 cursor-pointer transition-all ${
                  period === p
                    ? "bg-white dark:bg-dark-surface text-[#111827] dark:text-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                    : "bg-transparent text-[#6b7280] dark:text-[#7d8590] hover:text-[#111827] dark:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* 2. Export PDF Button (Slightly tweaked to match the new heights and radius) */}
          <button className="hidden sm:flex items-center gap-2 bg-psar-dark hover:opacity-90 text-white font-medium px-4 py-[9px] rounded-[10px] transition-colors text-[13px] cursor-pointer border-0">
            <FileText className="w-4 h-4" /> Export PDF
          </button>

          {/* 3. Add Sale Button */}
          <button
            onClick={openAdd}
            className="flex items-center gap-[7px] bg-[#3ecf8e] text-[#0d1117] border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer shadow-[0_2px_14px_rgba(62,207,142,0.28)] hover:bg-[#4dd49a] transition-colors"
          >
            <Plus size={14} /> Add Sale
          </button>
        </>
      }
    >
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7 max-w-5xl">
        {/* ══ SALES HEADER ══════════════════════════════════════ */}
        <div className="pt-1 pb-2">
          <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">
            My Sales
          </h2>
          <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
            Track and manage your daily sales ·{" "}
            <span className="text-[#9ca3af]">តាមដាន និងគ្រប់គ្រងការលក់</span>
          </p>
        </div>

        {/* QUICK LOGGING SECTION - TRIGGER BUTTON */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-bold text-[19px]">Quick Log Sale</h2>
            <p className="text-sm font-khmer text-slate-500 dark:text-[#7d8590] mt-0.5">
              កត់ត្រាការលក់រហ័ស
            </p>
          </div>
          <button
            onClick={() => setIsQuickLogModalOpen(true)}
            className="bg-psar-primary hover:bg-psar-primary text-white font-bold text-[16px] px-6 py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 w-full sm:w-auto min-h-[50px]"
          >
            <Plus className="w-5 h-5" />
            <span>Add Sale</span>
          </button>
        </div>

        {/* QUICK LOGGING MODAL */}
        {isQuickLogModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div
              className="absolute inset-0"
              onClick={() => setIsQuickLogModalOpen(false)}
            ></div>

            <div className="bg-white dark:bg-dark-surface rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsQuickLogModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:text-[#c9d1d9] hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 flex items-center gap-2">
                <div className="p-2 bg-psar-primary/10 text-psar-primary rounded-lg">
                  <CircleDollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-[22px] text-slate-900 dark:text-white">
                    Log New Sale
                  </h2>
                  <p className="text-sm font-khmer text-slate-500 dark:text-[#7d8590]">
                    កត់ត្រាការលក់រហ័ស
                  </p>
                </div>
              </div>

              <form onSubmit={handleQuickLog} className="flex flex-col gap-6">
                <div className="relative group mt-2">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CircleDollarSign className="h-6 w-6 text-slate-400 group-focus-within:text-psar-primary transition-colors" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={quickAmount}
                    onChange={(e) => setQuickAmount(e.target.value)}
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 rounded-xl text-slate-900 dark:text-white text-xl font-bold placeholder-slate-400 focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none transition-all min-h-[60px]"
                  />
                  <div className="absolute top-[-10px] left-4 bg-white dark:bg-dark-surface px-1 text-[11px] font-bold text-slate-500 dark:text-[#7d8590]">
                    Amount (ចំនួនទឹកប្រាក់){" "}
                    <span className="text-red-500">*</span>
                  </div>
                </div>

                {/* Enhanced Dropdown with Inventory Selection Feature mapped to Pro */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-slate-400 group-focus-within:text-psar-primary transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., 2x Iced Coffee (Select from inventory)"
                    value={quickItem}
                    onChange={(e) => setQuickItem(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 rounded-xl text-slate-900 dark:text-white text-[15px] placeholder-slate-400 focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none transition-all min-h-[60px]"
                  />
                  <div className="absolute top-[-10px] left-4 bg-white dark:bg-dark-surface px-1 text-[11px] font-bold text-slate-500 dark:text-[#7d8590] mt-1">
                    Item / Track Inventory Stock (ទំនិញ)
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsQuickLogModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:text-[#c9d1d9] font-bold text-[16px] py-4 rounded-xl transition-all min-h-[56px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-psar-primary hover:bg-psar-primary text-white font-bold text-[16px] py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 min-h-[56px]"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Save Log</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <VendorSummaryCard
            variant="dark"
            title={`${period}'s Revenue`}
            khmerTitle="ចំណូលប្រចាំ"
            value={`$${totalRevenue.toFixed(2)}`}
          />
          <VendorSummaryCard
            title="Transactions"
            khmerTitle="ចំនួនការលក់"
            value={activeTxns.length}
            subtext="sales today"
          />
          <VendorSummaryCard
            title="Avg. Sale"
            khmerTitle="មធ្យមតម្លៃ"
            value={`$${avgSale.toFixed(2)}`}
            subtext="per txn"
          />
        </div>
        {/* TRANSACTION HISTORY */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 md:p-6 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-[17px] text-slate-900 dark:text-white">
                Unlimited Recent Transactions
              </h3>
              <p className="text-sm font-khmer text-slate-500 dark:text-[#7d8590] mt-0.5">
                ប្រវត្តិប្រតិបត្តិការ
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search all logs..."
                  className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-psar-primary focus:ring-1 focus:ring-psar-primary min-h-[40px]"
                />
              </div>
              <button className="p-2 border border-slate-200 rounded-xl text-slate-500 dark:text-[#7d8590] hover:bg-slate-50 dark:hover:bg-white/5 dark:bg-[#0d1117] transition-colors min-h-[40px]">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#0d1117] border-b border-slate-100 dark:border-white/5 text-[13px] text-slate-500 dark:text-[#7d8590] uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Item Breakdown</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-psar-primary/10/30 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-[15px] font-medium text-slate-900 dark:text-white">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {txn.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[14px] font-medium text-slate-700 dark:text-[#c9d1d9]">
                        {txn.item}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[16px] font-bold text-psar-primary">
                        {txn.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button className="p-2 text-slate-400 hover:text-psar-primary rounded-lg hover:bg-psar-primary/10 transition-colors opacity-0 group-hover:opacity-100 min-h-[40px] min-w-[40px]">
                        <MoreVertical className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-500 dark:text-[#7d8590]"
                    >
                      No transactions logged today yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0d1117] text-center">
            <button className="text-[14px] font-semibold text-psar-primary hover:text-psar-primary hover:underline">
              View All Required History
            </button>
          </div>
        </div>

        {/* Overlay modal for quick log logic is preserved */}
        {isQuickLogModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div
              className="absolute inset-0"
              onClick={() => setIsQuickLogModalOpen(false)}
            ></div>

            <div className="bg-white dark:bg-dark-surface rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsQuickLogModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:text-[#c9d1d9] hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 flex items-center gap-2">
                <div className="p-2 bg-psar-primary/10 text-psar-primary rounded-lg">
                  <CircleDollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-[22px] text-slate-900 dark:text-white">
                    Log New Sale
                  </h2>
                  <p className="text-sm font-khmer text-slate-500 dark:text-[#7d8590]">
                    កត់ត្រាការលក់រហ័ស
                  </p>
                </div>
              </div>

              <form onSubmit={handleQuickLog} className="flex flex-col gap-6">
                <div className="relative group mt-2">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CircleDollarSign className="h-6 w-6 text-slate-400 group-focus-within:text-psar-primary transition-colors" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={quickAmount}
                    onChange={(e) => setQuickAmount(e.target.value)}
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 rounded-xl text-slate-900 dark:text-white text-xl font-bold placeholder-slate-400 focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none transition-all min-h-[60px]"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-slate-400 group-focus-within:text-psar-primary transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Items (Optional, e.g. 2x Coffee)"
                    value={quickItem}
                    onChange={(e) => setQuickItem(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 rounded-xl text-slate-900 dark:text-white text-[15px] font-medium placeholder-slate-400 focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none transition-all min-h-[50px]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-psar-primary hover:bg-psar-primary text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all text-lg mt-2 min-h-[56px] flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Save Transaction
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </VendorDashboardLayout>
  );
}
