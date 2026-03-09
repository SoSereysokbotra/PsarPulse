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
  Crown,
  Lock,
  CheckCircle2,
  ArrowUpRight,
  Download,
  FileSpreadsheet,
  FileText,
  MapPin,
  Sparkles,
  AlertTriangle,
  Edit2,
  PlusCircle,
  Search,
  ToggleLeft,
  ToggleRight,
  Map,
  FileBarChart,
  Tag,
} from "lucide-react";

export default function ProDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDayLocked, setIsDayLocked] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");

  const summaryData = {
    sales: "$324.50",
    expenses: "$95.00",
    profit: "$229.50",
    customers: "78",
    avgCustomer: "$4.16",
    bestSelling: "Iced Coffee",
    profitMargin: "70.7%",
  };

  // Pro: Unlimited logging
  const usageData = { used: 1247, limit: Infinity };

  // Advanced analytics data
  const weeklyData = [55, 82, 48, 95, 72, 130, 92];
  const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const monthlyData = [520, 680, 610, 740];
  const monthlyLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];

  // Best-selling products
  const bestSellingProducts = [
    { name: "Iced Coffee", khmer: "កាហ្វេទឹកកក", qty: 52, revenue: "$78.00", pct: 100 },
    { name: "Noodle Soup", khmer: "គុយទាវ", qty: 38, revenue: "$114.00", pct: 73 },
    { name: "Hot Latte", khmer: "ឡាតេក្តៅ", qty: 30, revenue: "$60.00", pct: 58 },
    { name: "Green Tea", khmer: "តែបៃតង", qty: 24, revenue: "$36.00", pct: 46 },
  ];

  // Expense categories (including custom)
  const expenseCategories = [
    { label: "គ្រឿងផ្សំ", value: 38, color: "#29B28D" },
    { label: "ថ្លៃជួល", value: 22, color: "#6366f1" },
    { label: "ពលកម្ម", value: 18, color: "#f59e0b" },
    { label: "ដឹកជញ្ជូន", value: 10, color: "#ef4444" },
    { label: "អគ្គិសនី", value: 5, color: "#8b5cf6" },
    { label: "ទីផ្សារ", value: 4, color: "#ec4899", custom: true },
    { label: "ផ្សេងៗ", value: 3, color: "#94a3b8" },
  ];

  // Inventory data
  const inventoryItems = [
    { id: 1, name: "Iced Coffee", khmer: "កាហ្វេទឹកកក", stock: 45, threshold: 10, status: "good" },
    { id: 2, name: "Hot Latte", khmer: "ឡាតេក្តៅ", stock: 8, threshold: 10, status: "low" },
    { id: 3, name: "Mango Sticky Rice", khmer: "បាយដំណើបស្វាយ", stock: 0, threshold: 5, status: "out" },
    { id: 4, name: "Noodle Soup", khmer: "គុយទាវ", stock: 24, threshold: 15, status: "good" },
    { id: 5, name: "Green Tea", khmer: "តែបៃតង", stock: 12, threshold: 10, status: "good" },
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
          <NavItem icon={LayoutDashboard} title="Dashboard" khmerTitle="ផ្ទាំងគ្រប់គ្រង" active />
          <NavItem icon={CircleDollarSign} title="Sales" khmerTitle="ការលក់" />
          <NavItem icon={Receipt} title="Expenses" khmerTitle="ចំណាយ" />
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
            <p className="text-xs text-indigo-400 mb-2">$3/month · Unlimited Logs</p>
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
                <h1 className="text-[22px] font-bold text-slate-900">Pro Dashboard</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[11px] font-bold rounded-full">
                  <Crown className="w-3 h-3" /> PRO
                </span>
              </div>
              <p className="text-[12px] font-khmer text-slate-500">ផ្ទាំងគ្រប់គ្រង Pro</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Export Buttons */}
            <button className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-3.5 py-2 rounded-xl transition-colors text-sm min-h-[40px]">
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
            <button className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-3.5 py-2 rounded-xl transition-colors text-sm min-h-[40px]">
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
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

          {/* Unlimited Logging Badge */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-5 shadow-md text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[17px]">Unlimited Transaction Logs</h3>
                <p className="text-indigo-200 text-sm mt-0.5">
                  {usageData.used.toLocaleString()} logs recorded this month · No limits on Pro
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-semibold">Unlimited</span>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <SummaryCard title="Total Sales" khmerTitle="ការលក់សរុប" value={summaryData.sales} icon={CircleDollarSign} trend="+18%" isPositive={true} />
            <SummaryCard title="Net Profit" khmerTitle="ប្រាក់ចំណេញ" value={summaryData.profit} icon={TrendingUp} trend="+24%" isPositive={true} highlight />
            <SummaryCard title="Profit Margin" khmerTitle="អត្រាចំណេញ" value={summaryData.profitMargin} icon={ArrowUpRight} trend="+3.2%" isPositive={true} />
            <SummaryCard title="Best Seller" khmerTitle="លក់ដាច់ជាងគេ" value={summaryData.bestSelling} icon={Crown} subtext="52 sold this week" />
          </div>

          {/* Advanced Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Revenue */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[15px] text-slate-900 mb-1">Weekly Revenue</h3>
              <p className="text-[12px] font-khmer text-slate-400 mb-5">ចំណូលប្រចាំសប្តាហ៍</p>
              <div className="h-40 flex items-end gap-1.5">
                {weeklyData.map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-indigo-50 rounded-t-lg relative group" style={{ height: "120px" }}>
                      <div
                        className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-600"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{weeklyLabels[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[15px] text-slate-900 mb-1">Monthly Revenue</h3>
              <p className="text-[12px] font-khmer text-slate-400 mb-5">ចំណូលប្រចាំខែ</p>
              <div className="h-40 flex items-end gap-2">
                {monthlyData.map((val, i) => {
                  const maxVal = 800;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[11px] font-bold text-slate-500">${val}</span>
                      <div className="w-full bg-indigo-50 rounded-t-lg relative group" style={{ height: "100px" }}>
                        <div
                          className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-600"
                          style={{ height: `${(val / maxVal) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{monthlyLabels[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expenses with Custom Categories */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-[15px] text-slate-900">Expenses</h3>
                <button
                  onClick={() => setShowCustomCategoryModal(true)}
                  className="flex items-center gap-1 text-[12px] font-bold text-indigo-500 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add Category
                </button>
              </div>
              <p className="text-[12px] font-khmer text-slate-400 mb-4">ការចំណាយ</p>
              <div className="space-y-2.5">
                {expenseCategories.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-khmer font-medium text-slate-600">{item.label}</span>
                        {(item as any).custom && (
                          <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">CUSTOM</span>
                        )}
                      </div>
                      <span className="text-[12px] font-bold text-slate-500">{item.value}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Best Selling Products */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[17px] text-slate-900">Best Selling Products</h3>
                <p className="text-[12px] font-khmer text-slate-400 mt-0.5">ផលិតផលលក់ដាច់ជាងគេ</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[11px] font-bold rounded-full">
                <Crown className="w-3 h-3" /> Pro Feature
              </span>
            </div>
            <div className="p-5 space-y-4">
              {bestSellingProducts.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 text-[12px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="text-[14px] font-semibold text-slate-900">{item.name}</span>
                        <span className="text-[11px] font-khmer text-slate-400 ml-2">{item.khmer}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[14px] font-bold text-indigo-600">{item.revenue}</span>
                        <span className="text-[12px] text-slate-400 ml-2">({item.qty} sold)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${item.pct}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Management + Map Visibility */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Inventory Management */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-indigo-500" />
                  <div>
                    <h3 className="font-bold text-[17px] text-slate-900">Inventory Management</h3>
                    <p className="text-[12px] font-khmer text-slate-400 mt-0.5">គ្រប់គ្រងស្តុក</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 bg-indigo-500 text-white font-medium px-4 py-2 rounded-xl hover:bg-indigo-600 transition-colors text-sm min-h-[40px]">
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Stock</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventoryItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-3.5">
                          <span className="text-[14px] font-semibold text-slate-900">{item.name}</span>
                          <span className="text-[11px] font-khmer text-slate-400 ml-2">{item.khmer}</span>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] font-bold text-slate-900 w-8">{item.stock}</span>
                            <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${item.status === "out" ? "bg-red-500" : item.status === "low" ? "bg-orange-400" : "bg-indigo-500"}`}
                                style={{ width: `${Math.min((item.stock / (item.threshold * 3)) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          {item.status === "out" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">Out</span>
                          ) : item.status === "low" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">Low</span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">OK</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-2 text-slate-400 hover:text-indigo-500 rounded-lg hover:bg-indigo-50 transition-colors" title="Restock">
                              <PlusCircle className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Public Map Visibility Toggle */}
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Map className="w-5 h-5 text-indigo-500" />
                  <div>
                    <h3 className="font-semibold text-[15px] text-slate-900">Market Pulse Map</h3>
                    <p className="text-[11px] font-khmer text-slate-400 mt-0.5">ផែនទីទីផ្សារ</p>
                  </div>
                </div>
                <p className="text-[13px] text-slate-500 mb-4 leading-relaxed">
                  Make your stall visible on the public discovery map for tourists & locals.
                </p>
                <button
                  onClick={() => setIsMapVisible(!isMapVisible)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    isMapVisible
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-5 h-5 ${isMapVisible ? "text-indigo-500" : "text-slate-400"}`} />
                    <div className="text-left">
                      <p className={`text-[14px] font-semibold ${isMapVisible ? "text-indigo-700" : "text-slate-700"}`}>
                        {isMapVisible ? "Visible on Map" : "Hidden from Map"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {isMapVisible ? "Customers can find you" : "Toggle to be discoverable"}
                      </p>
                    </div>
                  </div>
                  {isMapVisible ? (
                    <ToggleRight className="w-8 h-8 text-indigo-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-300" />
                  )}
                </button>
              </div>

              {/* Low Stock Alerts */}
              {inventoryItems.filter((i) => i.status !== "good").length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <h4 className="font-semibold text-[14px] text-orange-800">Low Stock Alert</h4>
                  </div>
                  <div className="space-y-2">
                    {inventoryItems
                      .filter((i) => i.status !== "good")
                      .map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-orange-100">
                          <span className="text-[13px] font-medium text-slate-700">{item.name}</span>
                          <span className={`text-[12px] font-bold ${item.status === "out" ? "text-red-600" : "text-orange-600"}`}>
                            {item.stock} left
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* End-of-Day Summary with AI Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[17px] text-slate-900">End-of-Day Summary</h3>
                <p className="text-[12px] font-khmer text-slate-400 mt-0.5">សង្ខេបចុងថ្ងៃ</p>
              </div>
              {isDayLocked && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[12px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Day Locked
                </span>
              )}
            </div>

            <div className="p-6">
              {/* Summary Cards */}
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
                <div className="p-4 bg-indigo-50 rounded-xl text-center border border-indigo-100">
                  <p className="text-[12px] font-semibold text-indigo-600 mb-1">Net Profit</p>
                  <p className="text-[12px] font-khmer text-indigo-400 mb-2">ប្រាក់ចំណេញ</p>
                  <p className="text-[22px] font-bold text-indigo-600">{summaryData.profit}</p>
                </div>
              </div>

              {/* AI Summary Section */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 mb-6 border border-indigo-100">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-bold text-[14px] text-indigo-700">AI Daily Summary</h4>
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-100 px-2 py-0.5 rounded-full">PRO</span>
                </div>
                <p className="text-[14px] text-slate-700 leading-relaxed">
                  📊 <strong>Great day!</strong> Revenue increased by 18% vs. yesterday. Iced Coffee continues to dominate with 52 units sold.
                  Your profit margin improved to 70.7%. Consider restocking Hot Latte — current stock is critically low at 8 units.
                  Mango Sticky Rice is completely sold out and should be replenished for tomorrow.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[13px] text-slate-400 mb-5">
                <span>Auto-calculated: Sales ({summaryData.sales}) − Expenses ({summaryData.expenses}) = <strong className="text-slate-700">{summaryData.profit}</strong></span>
              </div>

              {!isDayLocked ? (
                <button
                  onClick={() => setIsDayLocked(true)}
                  className="w-full flex items-center justify-center gap-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[16px] py-4 rounded-xl shadow-sm transition-all min-h-[56px]"
                >
                  <Lock className="w-5 h-5" />
                  <span>Confirm & Lock Day (បញ្ជាក់ និងចាក់សោ)</span>
                </button>
              ) : (
                <div className="w-full flex items-center justify-center gap-2.5 bg-slate-100 text-slate-500 font-bold text-[16px] py-4 rounded-xl min-h-[56px]">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  <span>Day Locked — Records Finalized</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Custom Category Modal */}
      {showCustomCategoryModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setShowCustomCategoryModal(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10">
            <button onClick={() => setShowCustomCategoryModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-5">
              <Tag className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-[19px] text-slate-900">Add Custom Category</h3>
            </div>
            <p className="text-[13px] text-slate-500 mb-5">Create your own expense categories beyond the default Khmer presets.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g., Marketing (ទីផ្សារ)"
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all min-h-[48px]"
                />
              </div>
              <button
                onClick={() => { setShowCustomCategoryModal(false); setCustomCategoryName(""); }}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-colors min-h-[48px]"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Reusable Components ---
function NavItem({ icon: Icon, title, khmerTitle, active = false }: { icon: any; title: string; khmerTitle: string; active?: boolean }) {
  const hrefMap: Record<string, string> = {
    Dashboard: "/vendor/pro",
    Sales: "/vendor/sales",
    Expenses: "/vendor/expenses",
    Customers: "/vendor/customer",
    Inventory: "/vendor/inventory",
    Reports: "/vendor/reports",
    Settings: "/vendor/settings",
  };
  return (
    <Link href={hrefMap[title] || "#"} className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors min-h-[48px] ${active ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
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
    <div className={`p-5 rounded-2xl border ${highlight ? "bg-indigo-500 text-white border-transparent shadow-md" : "bg-white border-slate-200 shadow-sm"}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className={`text-sm font-semibold ${highlight ? "text-white/90" : "text-slate-500"}`}>{title}</h4>
          <p className={`text-[11px] font-khmer mt-0.5 ${highlight ? "text-white/70" : "text-slate-400"}`}>{khmerTitle}</p>
        </div>
        <div className={`p-2 rounded-xl ${highlight ? "bg-white/20" : "bg-indigo-50 text-indigo-500 border border-indigo-100"}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-[28px] font-bold tracking-tight leading-none">{value}</h2>
        {trend && <span className={`text-sm font-semibold mb-0.5 ${highlight ? "text-white" : isPositive ? "text-indigo-500" : "text-red-500"}`}>{trend}</span>}
        {subtext && <span className={`text-sm font-medium mb-0.5 ${highlight ? "text-white/80" : "text-slate-400"}`}>{subtext}</span>}
      </div>
    </div>
  );
}
