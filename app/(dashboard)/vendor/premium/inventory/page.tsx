"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Package,
  Plus,
  TrendingUp,
  Search,
  AlertTriangle,
  Edit2,
  PlusCircle,
  Download,
  ArrowUpRight,
} from "lucide-react";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";

const FREE_NAV = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    khmerTitle: "ផ្ទាំងគ្រប់គ្រង",
    href: "/vendor",
  },
  {
    icon: CircleDollarSign,
    title: "Sales",
    khmerTitle: "ការលក់",
    href: "/vendor/sales",
  },
  {
    icon: Receipt,
    title: "Expenses",
    khmerTitle: "ចំណាយ",
    href: "/vendor/expenses",
  },
  {
    icon: Users,
    title: "Customers",
    khmerTitle: "អតិថិជន",
    href: "/vendor/customer",
  },
  {
    icon: Package,
    title: "Inventory",
    khmerTitle: "ស្តុក",
    href: "/vendor/inventory",
    active: true,
  },
];

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const summaryData = {
    totalItems: "24",
    lowStock: "3",
    totalValue: "$345.50",
    mostSold: "Iced Coffee",
    stockTurnover: "2.1x",
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
  ];

  return (
    <VendorDashboardLayout
      plan="free"
      navLinks={FREE_NAV}
      currentPath="/vendor/inventory"
      title="Inventory Management"
      rightActions={
        <>
          <button className="hidden sm:flex items-center gap-2 bg-psar-dark hover:opacity-90 text-white dark:bg-white dark:text-psar-dark font-medium px-4 py-2 rounded-xl transition-colors text-[13px] min-h-[40px] cursor-pointer">
            <Download className="w-4 h-4" /> Export Stock
          </button>
        </>
      }
    >
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7 transition-colors">
        {/* ══ INVENTORY HEADER ══════════════════════════════════════ */}
        <div className="pt-1 pb-2">
          <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">
            My Inventory
          </h2>
          <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
            Track and manage your product inventory ·{" "}
            <span className="text-[#9ca3af] dark:text-[#4d5562]">
              តាមដាន និងគ្រប់គ្រងស្តុកទំនិញ
            </span>
          </p>
        </div>

        {/* FR-26: Low Stock Notification Banner (Free logic: matches pro UI style) */}
        <div className="bg-orange-50 dark:bg-orange-500/10 rounded-2xl p-5 md:p-6 border border-orange-200 dark:border-orange-500/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden transition-colors">
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-orange-100 dark:from-orange-500/10 pointer-events-none" />
          <div className="flex items-start gap-4 z-10">
            <div className="p-3 bg-white dark:bg-[#161B22] border border-orange-200 dark:border-orange-500/20 rounded-xl shrink-0 shadow-sm transition-colors">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="font-bold text-[16px] text-orange-900 dark:text-orange-400">
                  Low Stock Alert (2 Items)
                </h3>
              </div>
              <p className="text-orange-800 dark:text-orange-300/80 text-[14px] leading-relaxed max-w-2xl">
                Hot Latte and Mango Sticky Rice are running low. Consider
                restocking soon to avoid stockouts.
              </p>
            </div>
          </div>
          <button className="w-full md:w-auto px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-colors text-sm shadow-sm min-h-[44px] z-10 flex items-center justify-center gap-2">
            View Items
          </button>
        </div>

        {/* Metric Cards - Matching Pro layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <VendorSummaryCard
            title="Total Products"
            khmerTitle="ផលិតផលសរុប"
            value={summaryData.totalItems}
            icon={Package}
            isPositive={true}
            trend="Limit: 50"
          />
          <VendorSummaryCard
            title="Low Stock"
            khmerTitle="ស្តុកជិតអស់"
            value={summaryData.lowStock}
            icon={AlertTriangle}
            trend="Needs attention"
            isPositive={false}
          />
          <VendorSummaryCard
            title="Inventory Value"
            khmerTitle="តម្លៃស្តុក"
            value={summaryData.totalValue}
            icon={CircleDollarSign}
          />
          <VendorSummaryCard
            title="Top Seller"
            khmerTitle="លក់ដាច់បំផុត"
            value={summaryData.mostSold}
            icon={TrendingUp}
            subtext="Highest margin"
          />
        </div>

        {/* Inventory Table Area */}
        <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-colors">
          <div className="p-5 md:p-6 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
            <div>
              <h3 className="font-bold text-[17px] text-slate-900 dark:text-white">
                Product List
              </h3>
              <p className="text-[13px] font-khmer text-slate-500 dark:text-[#7d8590] mt-0.5">
                បញ្ជីផលិតផល
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate-400 dark:text-[#7d8590] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-psar-primary focus:ring-1 focus:ring-psar-primary min-h-[44px] transition-colors placeholder:text-slate-400 dark:placeholder:text-[#7d8590]"
                />
              </div>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-psar-primary text-white font-medium px-4 py-2.5 rounded-xl hover:bg-psar-primary/90 transition-colors min-h-[44px]">
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add Item</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#161B22] border-b border-slate-100 dark:border-white/5 text-[11px] text-slate-500 dark:text-[#7d8590] uppercase tracking-wider font-semibold transition-colors">
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Price / Cost</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4">Last Restock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 transition-colors">
                {inventoryItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-psar-primary/10 dark:hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </span>
                        <span className="text-[12px] font-khmer text-slate-500 dark:text-[#7d8590]">
                          {item.khmerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[15px] font-bold text-slate-700 dark:text-[#e6edf3]">
                        {item.price}
                      </span>
                      <div className="text-[11px] text-slate-400 dark:text-[#7d8590] mt-0.5">
                        Cost: $1.00
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-[15px] font-bold text-slate-900 dark:text-white w-6">
                          {item.stock}
                        </span>
                        <div className="w-24 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden transition-colors">
                          <div
                            className={`h-full rounded-full ${item.status === "out" ? "bg-red-500" : item.status === "low" ? "bg-orange-500" : "bg-psar-primary"}`}
                            style={{
                              width: `${Math.min((item.stock / (item.threshold * 2)) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-slate-600 dark:text-[#e6edf3]">
                      {item.lastRestock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === "out" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-[11px] font-bold transition-colors">
                          Out of Stock
                        </span>
                      ) : item.status === "low" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-[11px] font-bold transition-colors">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold transition-colors">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="p-2 text-slate-400 dark:text-[#7d8590] hover:text-psar-primary dark:hover:text-psar-primary rounded-lg hover:bg-psar-primary/10 transition-colors"
                          title="Quick Restock"
                        >
                          <PlusCircle className="w-4 h-4 mx-auto" />
                        </button>
                        <button
                          className="p-2 text-slate-400 dark:text-[#7d8590] hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
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
          <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#161B22] text-center transition-colors">
            <button className="text-[13px] font-semibold text-psar-primary hover:underline">
              View All {summaryData.totalItems} Items
            </button>
          </div>
        </div>
      </div>
    </VendorDashboardLayout>
  );
}
