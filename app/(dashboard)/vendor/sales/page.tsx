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
  Sparkles,
  Clock,
  Filter,
  TrendingUp,
  FileBarChart,
} from "lucide-react";

export default function SalesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quickAmount, setQuickAmount] = useState("");
  const [quickItem, setQuickItem] = useState("");
  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState(false);

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
    // Transaction logging logic here
    console.log("Logged:", quickAmount, quickItem);
    setQuickAmount("");
    setQuickItem("");
    setIsQuickLogModalOpen(false); // Close the modal after savingQuick Log Sale
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
              <h1 className="text-[22px] font-bold text-slate-900">
                Sales Management
              </h1>
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

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7 max-w-5xl">
          {/* QUICK LOGGING SECTION - TRIGGER BUTTON */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-bold text-[19px]">Quick Log Sale</h2>
              <p className="text-sm font-khmer text-slate-500 mt-0.5">
                កត់ត្រាការលក់រហ័ស
              </p>
            </div>
            <button
              onClick={() => setIsQuickLogModalOpen(true)}
              className="bg-[#29B28D] hover:bg-[#239979] text-white font-bold text-[16px] px-6 py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add Sale</span>
            </button>
          </div>

          {/* QUICK LOGGING MODAL */}
          {isQuickLogModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
              {/* Modal Backdrop (Click to close) */}
              <div
                className="absolute inset-0"
                onClick={() => setIsQuickLogModalOpen(false)}
              ></div>

              {/* Modal Content */}
              <div className="bg-white rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => setIsQuickLogModalOpen(false)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                  <h2 className="font-bold text-[22px] text-slate-900">
                    Log New Sale
                  </h2>
                  <p className="text-sm font-khmer text-slate-500 mt-1">
                    កត់ត្រាការលក់រហ័ស
                  </p>
                </div>

                <form onSubmit={handleQuickLog} className="flex flex-col gap-6">
                  {/* Amount Input */}
                  <div className="relative group mt-2">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CircleDollarSign className="h-6 w-6 text-slate-400 group-focus-within:text-[#29B28D] transition-colors" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={quickAmount}
                      onChange={(e) => setQuickAmount(e.target.value)}
                      required
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xl font-bold placeholder-slate-400 focus:bg-white focus:border-[#29B28D] focus:ring-1 focus:ring-[#29B28D] outline-none transition-all min-h-[60px]"
                    />
                    <div className="absolute top-[-10px] left-4 bg-white px-1 text-[11px] font-bold text-slate-500">
                      Amount (ចំនួនទឹកប្រាក់){" "}
                      <span className="text-red-500">*</span>
                    </div>
                  </div>

                  {/* Item Input */}
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="e.g., 2x Iced Coffee (Optional)"
                      value={quickItem}
                      onChange={(e) => setQuickItem(e.target.value)}
                      className="block w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-[15px] placeholder-slate-400 focus:bg-white focus:border-[#29B28D] focus:ring-1 focus:ring-[#29B28D] outline-none transition-all min-h-[60px]"
                    />
                    <div className="absolute top-[-10px] left-4 bg-white px-1 text-[11px] font-bold text-slate-500">
                      Item Description (ទំនិញ)
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsQuickLogModalOpen(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[16px] py-4 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] bg-[#29B28D] hover:bg-[#239979] text-white font-bold text-[16px] py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Save Log</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TODAY's SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#29B28D]/10 border border-[#29B28D]/20 rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 bg-[#29B28D] text-white rounded-xl">
                <CircleDollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-600">
                  Today's Revenue
                </p>
                <h3 className="text-[24px] font-bold text-slate-900">$40.00</h3>
              </div>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 bg-slate-50 text-slate-500 rounded-xl border border-slate-100">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-600">
                  Transactions
                </p>
                <h3 className="text-[24px] font-bold text-slate-900">4</h3>
              </div>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex items-center gap-4">
              <div className="p-3 bg-slate-50 text-slate-500 rounded-xl border border-slate-100">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-600">
                  Avg. Sale Value
                </p>
                <h3 className="text-[24px] font-bold text-slate-900">$10.00</h3>
              </div>
            </div>
          </div>

          {/* TRANSACTION HISTORY */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[17px] text-slate-900">
                  Recent Transactions
                </h3>
                <p className="text-sm font-khmer text-slate-500 mt-0.5">
                  ប្រវត្តិប្រតិបត្តិការ
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#29B28D] focus:ring-1 focus:ring-[#29B28D] min-h-[44px]"
                  />
                </div>
                <button className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors min-h-[44px]">
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
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-[15px] font-medium text-slate-900">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {txn.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[14px] text-slate-600">
                          {txn.item}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[16px] font-bold text-[#29B28D]">
                          {txn.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100 min-h-[44px] min-w-[44px]">
                          <MoreVertical className="w-5 h-5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Empty State / Bottom padding row */}
                  {transactions.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        No transactions logged today yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
              <button className="text-[14px] font-semibold text-[#29B28D] hover:underline">
                View All History
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
