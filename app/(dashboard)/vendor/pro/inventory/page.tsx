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
  Menu,
  X,
  Bell,
  Search,
  AlertTriangle,
  Edit2,
  PlusCircle,
  FileBarChart,
  Crown,
  FileText,
  Download,
  ArrowUpRight,
} from "lucide-react";

export default function ProInventoryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const summaryData = {
    totalItems: "48", // Pro has more items capability
    lowStock: "3",
    totalValue: "$1,245.50",
    mostSold: "Iced Coffee",
    stockTurnover: "4.2x",
  };

  // Mock Inventory Data mapping to SRS DB Requirements (ProductID, ProductName, DefaultPrice)
  const inventoryItems = [
    {
      id: 1,
      name: "Iced Coffee",
      khmerName: "កាហ្វេទឹកកក",
      price: "$1.50",
      stock: 45,
      threshold: 10,
      status: "good",
      lastRestock: "2 days ago",
    },
    {
      id: 2,
      name: "Hot Latte",
      khmerName: "ឡាតេក្តៅ",
      price: "$2.00",
      stock: 8,
      threshold: 10,
      status: "low",
      lastRestock: "1 week ago",
    },
    {
      id: 3,
      name: "Mango Sticky Rice",
      khmerName: "បាយដំណើបស្វាយ",
      price: "$2.50",
      stock: 0,
      threshold: 5,
      status: "out",
      lastRestock: "Yesterday",
    },
    {
      id: 4,
      name: "Noodle Soup",
      khmerName: "គុយទាវ",
      price: "$3.00",
      stock: 24,
      threshold: 15,
      status: "good",
      lastRestock: "3 days ago",
    },
    {
      id: 5,
      name: "Green Tea",
      khmerName: "តែបៃតង",
      price: "$1.50",
      stock: 12,
      threshold: 10,
      status: "good",
      lastRestock: "4 days ago",
    },
    {
      id: 6,
      name: "Croissant",
      khmerName: "នំខូសង់",
      price: "$1.80",
      stock: 5,
      threshold: 8,
      status: "low",
      lastRestock: "Today",
    },
  ];

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
          <NavItem icon={Users} title="Customers" khmerTitle="អតិថិជន" />
          <NavItem icon={Package} title="Inventory" khmerTitle="ស្តុក" active />
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
              $3/month · Advanced Inventory
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
                  Inventory Management
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[11px] font-bold rounded-full">
                  <Crown className="w-3 h-3" /> PRO
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-xl transition-colors text-[13px] min-h-[40px]">
              <Download className="w-4 h-4" /> Export Stock
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 text-sm shadow-sm">
              SM
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">
          {/* ══ INVENTORY HEADER ══════════════════════════════════════ */}
          <div className="pt-1 pb-2">
            <h2 className="text-[32px] font-extrabold text-[#111827] leading-tight">
              My Inventory
            </h2>
            <p className="text-[14px] text-[#6b7280] mt-1">
              Track and manage your product inventory ·{" "}
              <span className="text-[#9ca3af]">
                តាមដាន និងគ្រប់គ្រងស្តុកទំនិញ
              </span>
            </p>
          </div>

          {/* FR-26: Low Stock Notification Banner (Pro logic: handles more than just basic alerts) */}
          <div className="bg-orange-50 rounded-2xl p-5 md:p-6 border border-orange-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-orange-100 pointer-events-none" />
            <div className="flex items-start gap-4 z-10">
              <div className="p-3 bg-white border border-orange-200 rounded-xl shrink-0 shadow-sm">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-bold text-[16px] text-orange-900">
                    Low Stock Alert (3 Items)
                  </h3>
                </div>
                <p className="text-orange-800 text-[14px] leading-relaxed max-w-2xl">
                  Hot Latte, Mango Sticky Rice, and Croissant are running low.
                  Tap below to automatically generate a resupply list for your
                  suppliers.
                </p>
              </div>
            </div>
            <button className="w-full md:w-auto px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-colors text-sm shadow-sm min-h-[44px] z-10 flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" /> Create PO
            </button>
          </div>

          {/* Metric Cards - Pro introduces wider range of metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            <SummaryCard
              title="Total Products"
              khmerTitle="ផលិតផលសរុប"
              value={summaryData.totalItems}
              icon={Package}
              isPositive={true}
              trend="Unlimited"
            />
            <SummaryCard
              title="Low Stock"
              khmerTitle="ស្តុកជិតអស់"
              value={summaryData.lowStock}
              icon={AlertTriangle}
              trend="Needs attention"
              isPositive={false}
            />
            <SummaryCard
              title="Inventory Value"
              khmerTitle="តម្លៃស្តុក"
              value={summaryData.totalValue}
              icon={CircleDollarSign}
            />
            <SummaryCard
              title="Top Seller"
              khmerTitle="លក់ដាច់បំផុត"
              value={summaryData.mostSold}
              icon={TrendingUp}
              subtext="Highest margin"
            />
            {/* Pro Specific */}
            <SummaryCard
              title="Turnover Rate"
              khmerTitle="អត្រាលក់ចេញ"
              value={summaryData.stockTurnover}
              icon={ArrowUpRight}
              trend="Fast moving"
              isPositive={true}
              highlight
            />
          </div>

          {/* Inventory Table Area */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[17px] text-slate-900">
                  Master Product List
                </h3>
                <p className="text-[13px] font-khmer text-slate-500 mt-0.5">
                  បញ្ជីផលិតផលមេ
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-auto">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[44px]"
                  />
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl hover:bg-indigo-600 transition-colors min-h-[44px]">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Item</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4">Product Details</th>
                    <th className="px-6 py-4">Price / Cost</th>
                    <th className="px-6 py-4">Stock Level</th>
                    <th className="px-6 py-4">Last Restock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventoryItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-indigo-50/20 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-slate-900">
                            {item.name}
                          </span>
                          <span className="text-[12px] font-khmer text-slate-500">
                            {item.khmerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[15px] font-bold text-slate-700">
                          {item.price}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Cost: $1.00
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="text-[15px] font-bold text-slate-900 w-6">
                            {item.stock}
                          </span>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${item.status === "out" ? "bg-red-500" : item.status === "low" ? "bg-orange-500" : "bg-indigo-500"}`}
                              style={{
                                width: `${Math.min((item.stock / (item.threshold * 2)) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-slate-600">
                        {item.lastRestock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.status === "out" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-[11px] font-bold">
                            Out of Stock
                          </span>
                        ) : item.status === "low" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-orange-100 text-orange-700 text-[11px] font-bold">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                            title="Quick Restock"
                          >
                            <PlusCircle className="w-4 h-4 mx-auto" />
                          </button>
                          <button
                            className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
              <button className="text-[13px] font-semibold text-indigo-600 hover:underline">
                View All {summaryData.totalItems} Items
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
    Dashboard: "/vendor/pro",
    Sales: "/vendor/pro/sales",
    Expenses: "/vendor/pro/expenses",
    Customers: "/vendor/pro/customer",
    Inventory: "/vendor/pro/inventory",
    Reports: "/vendor/pro/reports",
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
            className={`text-[13px] font-semibold ${highlight ? "text-white/90" : "text-slate-500"}`}
          >
            {title}
          </h4>
          <p
            className={`text-[10px] font-khmer mt-0.5 ${highlight ? "text-white/70" : "text-slate-400"}`}
          >
            {khmerTitle}
          </p>
        </div>
        <div
          className={`p-2 rounded-xl ${highlight ? "bg-white/20" : "bg-indigo-50 text-indigo-500 border border-indigo-100"}`}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-[24px] font-bold tracking-tight leading-none">
          {value}
        </h2>
        {trend && (
          <span
            className={`text-[12px] font-semibold mb-0.5 ${highlight ? "text-white" : isPositive === false ? "text-red-500" : "text-indigo-500"}`}
          >
            {trend}
          </span>
        )}
        {subtext && (
          <span
            className={`text-[12px] font-medium mb-0.5 ${highlight ? "text-white/80" : "text-slate-400"}`}
          >
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
