"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Package,
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
  Sparkles,
  AlertTriangle,
  Search,
  FileBarChart,
  Tag,
  Zap,
  ShoppingCart,
  Minus,
  Clock,
  Target,
} from "lucide-react";
import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";

// ─── Types ─────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  price: number;
}

// ─── Constants ─────────────────────────────────────────────────────
const PRODUCT_LIBRARY: Product[] = [
  { id: "1", name: "Coffee Latte", price: 4.5 },
  { id: "2", name: "Green Tea", price: 3.2 },
  { id: "3", name: "Fried Rice", price: 2.5 },
  { id: "4", name: "Spring Roll", price: 1.8 },
  { id: "5", name: "Coconut Water", price: 1.5 },
  { id: "6", name: "Mango Sticky Rice", price: 2.0 },
];

const GOAL = {
  label: "Daily Revenue Goal",
  khmer: "គោលដៅចំណូលប្រចាំថ្ងៃ",
  current: 324.5,
  target: 500,
};

const PRO_NAV = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    khmerTitle: "ផ្ទាំងគ្រប់គ្រង",
    href: "/vendor/pro",
    active: true,
  },
  {
    icon: CircleDollarSign,
    title: "Sales",
    khmerTitle: "ការលក់",
    href: "/vendor/pro/sales",
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

export default function ProDashboard() {
  const [isDayLocked, setIsDayLocked] = useState(false);
  const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");

  const [quickSaleOpen, setQuickSaleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [customers, setCustomers] = useState(1);
  const [expLogged, setExpLogged] = useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const quickSaleRef = React.useRef<HTMLDivElement>(null);

  // Greeting
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const greetingKh =
    hour < 12 ? "អរុណសួស្តី" : hour < 17 ? "ទិវាសួស្តី" : "សាយ័ណ្ហសួស្តី";
  const dateStr = now.toLocaleDateString("en-KH", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Goal ring
  const goalPct = Math.min((GOAL.current / GOAL.target) * 100, 100);
  const radius = 38;
  const circum = 2 * Math.PI * radius;
  const strokeDash = (goalPct / 100) * circum;

  React.useEffect(() => {
    if (quickSaleOpen) setTimeout(() => searchRef.current?.focus(), 120);
  }, [quickSaleOpen]);

  const closeQuickSale = React.useCallback(() => {
    setQuickSaleOpen(false);
    setCart([]);
    setSearchQuery("");
  }, []);

  React.useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuickSale();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [closeQuickSale]);

  React.useEffect(() => {
    if (!quickSaleOpen) return;
    const fn = (e: MouseEvent) => {
      if (
        quickSaleRef.current &&
        !quickSaleRef.current.contains(e.target as Node)
      )
        closeQuickSale();
    };
    setTimeout(() => document.addEventListener("mousedown", fn), 0);
    return () => document.removeEventListener("mousedown", fn);
  }, [quickSaleOpen, closeQuickSale]);

  const filteredProducts = PRODUCT_LIBRARY.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.product.id === product.id);
      if (exists)
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      return [...prev, { product, qty: 1 }];
    });
    setSearchQuery("");
    searchRef.current?.focus();
  };

  const changeQty = (id: string, delta: number) =>
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const cartItems = cart.reduce((sum, i) => sum + i.qty, 0);

  const completeSale = () => {
    setCart([]);
    setCustomers(1);
    setSearchQuery("");
    setQuickSaleOpen(false);
  };
  const logExpense = () => {
    setExpLogged(true);
    setTimeout(() => setExpLogged(false), 2200);
  };

  const summaryData = {
    sales: "$324.50",
    expenses: "$95.00",
    profit: "$229.50",
    customers: "78",
    avgCustomer: "$4.16",
    bestSelling: "Iced Coffee",
    profitMargin: "70.7%",
  };

  const weeklyData = [55, 82, 48, 95, 72, 130, 92];
  const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthlyData = [520, 680, 610, 740];
  const monthlyLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];

  const bestSellingProducts = [
    {
      name: "Iced Coffee",
      khmer: "កាហ្វេទឹកកក",
      qty: 52,
      revenue: "$78.00",
      pct: 100,
    },
    {
      name: "Noodle Soup",
      khmer: "គុយទាវ",
      qty: 38,
      revenue: "$114.00",
      pct: 73,
    },
    {
      name: "Hot Latte",
      khmer: "ឡាតេក្តៅ",
      qty: 30,
      revenue: "$60.00",
      pct: 58,
    },
    { name: "Green Tea", khmer: "តែបៃតង", qty: 24, revenue: "$36.00", pct: 46 },
  ];

  const expenseCategories = [
    { label: "គ្រឿងផ្សំ", value: 38, color: "#29B28D" },
    { label: "ថ្លៃជួល", value: 22, color: "#6366f1" },
    { label: "ពលកម្ម", value: 18, color: "#f59e0b" },
    { label: "ដឹកជញ្ជូន", value: 10, color: "#ef4444" },
    { label: "អគ្គិសនី", value: 5, color: "#8b5cf6" },
    { label: "ទីផ្សារ", value: 4, color: "#ec4899", custom: true },
    { label: "ផ្សេងៗ", value: 3, color: "#94a3b8" },
  ];

  const inventoryItems = [
    {
      id: 1,
      name: "Iced Coffee",
      khmer: "កាហ្វេទឹកកក",
      stock: 45,
      threshold: 10,
      status: "good",
    },
    {
      id: 2,
      name: "Hot Latte",
      khmer: "ឡាតេក្តៅ",
      stock: 8,
      threshold: 10,
      status: "low",
    },
    {
      id: 3,
      name: "Mango Sticky Rice",
      khmer: "បាយដំណើបស្វាយ",
      stock: 0,
      threshold: 5,
      status: "out",
    },
    {
      id: 4,
      name: "Noodle Soup",
      khmer: "គុយទាវ",
      stock: 24,
      threshold: 15,
      status: "good",
    },
    {
      id: 5,
      name: "Green Tea",
      khmer: "តែបៃតង",
      stock: 12,
      threshold: 10,
      status: "good",
    },
  ];

  return (
    <VendorDashboardLayout
      plan="pro"
      navLinks={PRO_NAV}
      currentPath="/vendor/pro"
      settingsHref="/vendor/pro/settings"
      title="Pro Dashboard"
      planBadge={{ label: "PRO", icon: Crown }}
      rightActions={
        <>
          <div ref={quickSaleRef} className="relative">
            <button
              onClick={() => setQuickSaleOpen((o) => !o)}
              className={`flex items-center gap-[7px] border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer transition-all duration-200 ${
                quickSaleOpen
                  ? "bg-[#0E1319] text-[#e6edf3]"
                  : "bg-[#29B28D] text-[#0E1319] shadow-[0_2px_14px_rgba(41,178,141,0.28)]"
              }`}
            >
              {quickSaleOpen ? (
                <>
                  <X className="w-4 h-4" /> Cancel
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Quick Sale
                </>
              )}
              {cartItems > 0 && !quickSaleOpen && (
                <span className="bg-[#0E1319] text-[#29B28D] rounded-full w-[18px] h-[18px] text-[10px] font-extrabold flex items-center justify-center ml-0.5">
                  {cartItems}
                </span>
              )}
            </button>

            {quickSaleOpen && (
              <div
                className="absolute top-[calc(100%+10px)] right-0 w-[330px] bg-white dark:bg-dark-surface border border-[#e8eaed] dark:border-white/5 rounded-[14px] shadow-[0_20px_56px_rgba(0,0,0,0.18)] overflow-hidden"
                style={{ zIndex: 9999 }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 px-[18px] py-[14px] border-b border-[#e8eaed] dark:border-white/5">
                  <ShoppingCart className="w-4 h-4 text-[#29B28D]" />
                  <span className="font-bold text-sm text-[#111827] dark:text-white">
                    Quick Sale
                  </span>
                  <span className="text-[11px] text-[#6b7280] dark:text-[#7d8590] ml-auto">
                    ការលក់រហ័ស
                  </span>
                </div>
                <div className="p-[14px_18px] max-h-[60vh] overflow-y-auto">
                  <div className="relative mb-[14px]">
                    <Search className="w-3.5 h-3.5 absolute left-[11px] top-1/2 -translate-y-1/2 text-[#6b7280] dark:text-[#7d8590] pointer-events-none" />
                    <input
                      ref={searchRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search product..."
                      className="w-full pl-[33px] pr-[11px] py-[9px] bg-[#f7f8fa] dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/5 rounded-[9px] text-[13px] outline-none text-[#111827] dark:text-white focus:border-[#29B28D] transition-colors"
                      style={{ fontFamily: "inherit" }}
                    />
                    {searchQuery && (
                      <div
                        className="absolute top-full left-0 right-0 bg-white dark:bg-dark-surface border border-[#e8eaed] dark:border-white/5 border-t-0 rounded-b-[9px] overflow-hidden shadow-lg"
                        style={{ zIndex: 10 }}
                      >
                        {filteredProducts.length ? (
                          filteredProducts.map((p) => (
                            <button
                              key={p.id}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                addToCart(p);
                              }}
                              className="w-full flex justify-between items-center px-[13px] py-[9px] bg-transparent border-0 cursor-pointer text-[13px] text-[#111827] dark:text-white text-left hover:bg-[#f7f8fa] dark:hover:bg-white/5 dark:bg-[#0d1117]"
                              style={{ fontFamily: "inherit" }}
                            >
                              <span>{p.name}</span>
                              <span className="text-[#29B28D] font-bold">
                                ${p.price.toFixed(2)}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-[13px] py-[10px] text-[12.5px] text-[#6b7280] dark:text-[#7d8590]">
                            No products found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {!searchQuery && (
                    <div className="mb-[14px]">
                      <div className="text-[10px] font-bold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-[0.07em] mb-2">
                        Tap to add
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {PRODUCT_LIBRARY.map((p) => {
                          const inCart = cart.find(
                            (i) => i.product.id === p.id,
                          );
                          return (
                            <button
                              key={p.id}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                addToCart(p);
                              }}
                              className={`px-3 py-[9px] rounded-[9px] text-left cursor-pointer transition-all duration-[120ms] relative border ${
                                inCart
                                  ? "bg-[rgba(41,178,141,0.12)] border-[#29B28D]"
                                  : "bg-[#f7f8fa] dark:bg-[#0d1117] border-[#e8eaed] dark:border-white/5 hover:bg-[#eff0f2]"
                              }`}
                            >
                              <div
                                className={`text-xs font-semibold truncate mb-0.5 ${inCart ? "text-[#29B28D]" : "text-[#111827] dark:text-white"}`}
                              >
                                {p.name}
                              </div>
                              <div
                                className={`text-[11px] font-bold ${inCart ? "text-[#29B28D]" : "text-[#6b7280] dark:text-[#7d8590]"}`}
                              >
                                ${p.price.toFixed(2)}
                              </div>
                              {inCart && (
                                <span className="absolute top-1.5 right-2 bg-[#29B28D] text-[#0E1319] rounded-full w-[17px] h-[17px] text-[9px] font-extrabold flex items-center justify-center">
                                  {inCart.qty}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {cart.length > 0 && (
                    <div className="mb-3 max-h-[140px] overflow-y-auto">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center gap-2 py-[7px] border-b border-[#f0f2f5]"
                        >
                          <span className="text-[12.5px] flex-1 text-[#111827] dark:text-white">
                            {item.product.name}
                          </span>
                          <div className="flex items-center bg-[#f7f8fa] dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/5 rounded-[7px] overflow-hidden shrink-0">
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault();
                                changeQty(item.product.id, -1);
                              }}
                              className="w-6 h-6 bg-transparent border-0 cursor-pointer flex items-center justify-center text-[#6b7280] dark:text-[#7d8590] hover:bg-[#e8eaed]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold min-w-[18px] text-center">
                              {item.qty}
                            </span>
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault();
                                changeQty(item.product.id, 1);
                              }}
                              className="w-6 h-6 bg-transparent border-0 cursor-pointer flex items-center justify-center text-[#6b7280] dark:text-[#7d8590] hover:bg-[#e8eaed]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-[12.5px] font-bold min-w-[48px] text-right">
                            ${(item.product.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 border-t border-[#f0f2f5] mb-3 mt-1">
                    <span className="text-xs text-[#6b7280] dark:text-[#7d8590] font-medium">
                      Customers · អតិថិជន
                    </span>
                    <div className="flex items-center bg-[#f7f8fa] dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/5 rounded-[8px] overflow-hidden">
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setCustomers((c) => Math.max(1, c - 1));
                        }}
                        className="w-7 h-7 bg-transparent border-0 cursor-pointer text-[#6b7280] dark:text-[#7d8590] flex items-center justify-center hover:bg-[#e8eaed]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[13px] font-bold min-w-[24px] text-center">
                        {customers}
                      </span>
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setCustomers((c) => c + 1);
                        }}
                        className="w-7 h-7 bg-transparent border-0 cursor-pointer text-[#6b7280] dark:text-[#7d8590] flex items-center justify-center hover:bg-[#e8eaed]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#6b7280] dark:text-[#7d8590]">
                      {cartItems} item{cartItems !== 1 ? "s" : ""}
                    </span>
                    <span className="font-extrabold text-xl text-[#29B28D]">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      if (cart.length) completeSale();
                    }}
                    disabled={cart.length === 0}
                    className={`w-full py-3 font-bold text-[13.5px] border-0 rounded-[10px] flex items-center justify-center gap-[7px] transition-all ${
                      cart.length
                        ? "bg-[#29B28D] text-[#0E1319] cursor-pointer shadow-[0_4px_14px_rgba(41,178,141,0.28)] hover:opacity-90"
                        : "bg-[#f0f2f5] text-[#6b7280] dark:text-[#7d8590] cursor-not-allowed"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Complete Sale
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export buttons */}
          <button className="hidden lg:flex items-center gap-2 bg-[#0E1319] hover:opacity-90 text-white font-medium px-3.5 py-2 rounded-[10px] transition-colors text-sm min-h-[40px] cursor-pointer border-0">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button className="hidden lg:flex items-center gap-2 bg-white dark:bg-dark-surface border border-[#e8eaed] dark:border-white/5 hover:bg-[#f7f8fa] dark:hover:bg-white/5 dark:bg-[#0d1117] text-[#111827] dark:text-white font-medium px-3.5 py-2 rounded-[10px] transition-colors text-sm min-h-[40px] cursor-pointer">
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
        </>
      }
    >
      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">
        <div className="bg-[#0d1117] rounded-[14px] border border-white/[0.06] px-[26px] py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          {/* Left — greeting */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3ecf8e] to-[#1a9c65] flex items-center justify-center text-[17px] font-extrabold text-white shrink-0 shadow-[0_0_0_3px_rgba(62,207,142,0.2)]">
              SM
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[18px] font-extrabold text-[#e6edf3]">
                  {greeting}, Sok Maly 👋
                </span>
              </div>
              <div className="text-[11px] text-[#7d8590] mt-0.5 flex items-center gap-2">
                <span>{greetingKh}</span>
                <span className="w-[3px] h-[3px] rounded-full bg-[#4d5562] inline-block" />
                <Clock size={10} className="inline-block" />
                <span>{dateStr}</span>
              </div>
            </div>
          </div>

          {/* Right — goal ring */}
          <div className="flex items-center gap-5 sm:shrink-0">
            {/* SVG ring */}
            <div className="relative w-[88px] h-[88px]">
              <svg width="88" height="88" className="-rotate-90">
                <circle
                  cx="44"
                  cy="44"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="7"
                />
                <circle
                  cx="44"
                  cy="44"
                  r={radius}
                  fill="none"
                  stroke="#3ecf8e"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={`${strokeDash} ${circum}`}
                  style={{ transition: "stroke-dasharray 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[15px] font-extrabold text-[#e6edf3] leading-none">
                  {Math.round(goalPct)}%
                </span>
                <span className="text-[9px] text-[#7d8590] mt-0.5">
                  of goal
                </span>
              </div>
            </div>
            {/* Goal text */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Target size={12} className="text-[#3ecf8e]" />
                <span className="text-[11px] font-bold text-[#3ecf8e] uppercase tracking-[0.06em]">
                  Daily Goal
                </span>
              </div>
              <div className="text-[22px] font-extrabold text-[#e6edf3] leading-none">
                ${GOAL.current.toFixed(2)}
              </div>
              <div className="text-[11px] text-[#7d8590] mt-1">
                of ${GOAL.target.toFixed(2)} target
              </div>
              <div className="mt-2 w-[120px] h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3ecf8e] rounded-full transition-[width] duration-700"
                  style={{ width: `${goalPct}%` }}
                />
              </div>
              <div className="text-[10px] text-[#7d8590] mt-1">
                {GOAL.khmer}
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards (shared component) */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <VendorSummaryCard
            title="Total Sales"
            khmerTitle="ការលក់សរុប"
            value={summaryData.sales}
            icon={CircleDollarSign}
            trend="+12%"
            isPositive
          />
          <VendorSummaryCard
            title="Total Expenses"
            khmerTitle="ចំណាយសរុប"
            value={summaryData.expenses}
            icon={Receipt}
            trend="-5%"
            isPositive={false}
          />
          <VendorSummaryCard
            title="Net Profit"
            khmerTitle="ប្រាក់ចំណេញ"
            value={summaryData.profit}
            icon={TrendingUp}
            trend="+17%"
            isPositive
            highlight
          />
          <VendorSummaryCard
            title="Customers"
            khmerTitle="អតិថិជនសរុប"
            value={summaryData.customers}
            icon={Users}
            subtext={`Avg ${summaryData.avgCustomer}`}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Revenue */}
          <div className="bg-white dark:bg-dark-surface border border-[#e8eaed] dark:border-white/5 rounded-[14px] p-6 shadow-sm">
            <h3 className="font-semibold text-[15px] text-[#111827] dark:text-white mb-1">
              Weekly Revenue
            </h3>
            <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590] mb-5">
              ចំណូលប្រចាំសប្តាហ៍
            </p>
            <div className="h-40 flex items-end gap-1.5">
              {weeklyData.map((height, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-[rgba(41,178,141,0.12)] rounded-t-[7px] relative group"
                    style={{ height: "120px" }}
                  >
                    <div
                      className="absolute bottom-0 w-full bg-[#29B28D] rounded-t-[7px] transition-all duration-500 group-hover:opacity-80"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#6b7280] dark:text-[#7d8590]">
                    {weeklyLabels[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white dark:bg-dark-surface border border-[#e8eaed] dark:border-white/5 rounded-[14px] p-6 shadow-sm">
            <h3 className="font-semibold text-[15px] text-[#111827] dark:text-white mb-1">
              Monthly Revenue
            </h3>
            <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590] mb-5">ចំណូលប្រចាំខែ</p>
            <div className="h-40 flex items-end gap-2">
              {monthlyData.map((val, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590]">
                    ${val}
                  </span>
                  <div
                    className="w-full bg-[rgba(41,178,141,0.12)] rounded-t-[7px] relative group"
                    style={{ height: "100px" }}
                  >
                    <div
                      className="absolute bottom-0 w-full bg-[#29B28D] rounded-t-[7px] transition-all duration-500 group-hover:opacity-80"
                      style={{ height: `${(val / 800) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#6b7280] dark:text-[#7d8590]">
                    {monthlyLabels[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white dark:bg-dark-surface border border-[#e8eaed] dark:border-white/5 rounded-[14px] p-6 shadow-sm col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-[15px] text-[#111827] dark:text-white">
                Expenses
              </h3>
              {expLogged && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[rgba(41,178,141,0.1)] text-[#29B28D] text-[10px] font-bold border border-[rgba(41,178,141,0.2)] uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" /> Logged!
                </span>
              )}
            </div>
            <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590] mb-4">ការចំណាយ</p>
            <div className="space-y-3">
              {expenseCategories.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-[#111827] dark:text-white">
                        {item.label}
                      </span>
                      {(item as any).custom && (
                        <span className="text-[9px] font-bold text-[#29B28D] bg-[rgba(41,178,141,0.1)] px-1.5 py-0.5 rounded border border-[rgba(41,178,141,0.2)]">
                          CUSTOM
                        </span>
                      )}
                    </div>
                    <span className="text-[13px] font-bold text-[#6b7280] dark:text-[#7d8590]">
                      {item.value}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#f0f2f5] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white dark:bg-dark-surface border border-[#e8eaed] dark:border-white/5 rounded-[14px] shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#f0f2f5] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[17px] text-[#111827] dark:text-white">
                Best Selling Products
              </h3>
              <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">
                ផលិតផលលក់ដាច់ជាងគេ
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[rgba(41,178,141,0.1)] text-[#29B28D] text-[11px] font-bold rounded-full border border-[rgba(41,178,141,0.2)]">
              <Crown className="w-3 h-3" /> Pro Feature
            </span>
          </div>
          <div className="p-5 space-y-4">
            {bestSellingProducts.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-7 h-7 rounded-full bg-[rgba(41,178,141,0.1)] text-[#29B28D] text-[12px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-[14px] font-semibold text-[#111827] dark:text-white">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#6b7280] dark:text-[#7d8590] ml-2">
                        {item.khmer}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[14px] font-bold text-[#29B28D]">
                        {item.revenue}
                      </span>
                      <span className="text-[12px] text-[#6b7280] dark:text-[#7d8590] ml-2">
                        ({item.qty} sold)
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-[#f0f2f5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#29B28D] rounded-full transition-all duration-700"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        {inventoryItems.filter((i) => i.status !== "good").length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-[14px] p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h4 className="font-semibold text-[14px] text-orange-800">
                Low Stock Alert
              </h4>
            </div>
            <div className="space-y-2">
              {inventoryItems
                .filter((i) => i.status !== "good")
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 px-3 bg-white dark:bg-dark-surface rounded-[10px] border border-orange-100"
                  >
                    <span className="text-[13px] font-medium text-[#111827] dark:text-white">
                      {item.name}
                    </span>
                    <span
                      className={`text-[12px] font-bold ${item.status === "out" ? "text-red-600" : "text-orange-600"}`}
                    >
                      {item.stock} left
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* End-of-Day Summary */}
        <div className="bg-white dark:bg-dark-surface border border-[#e8eaed] dark:border-white/5 rounded-[14px] shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#f0f2f5] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[17px] text-[#111827] dark:text-white">
                End-of-Day Summary
              </h3>
              <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">សង្ខេបចុងថ្ងៃ</p>
            </div>
            {isDayLocked && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(41,178,141,0.1)] text-[#29B28D] text-[12px] font-bold border border-[rgba(41,178,141,0.2)]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Day Locked
              </span>
            )}
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-[#f7f8fa] dark:bg-[#0d1117] rounded-[11px] text-center">
                <p className="text-[12px] font-semibold text-[#6b7280] dark:text-[#7d8590] mb-1">
                  Total Sales
                </p>
                <p className="text-[12px] text-[#9ca3af] mb-2">ការលក់សរុប</p>
                <p className="text-[22px] font-bold text-[#111827] dark:text-white">
                  {summaryData.sales}
                </p>
              </div>
              <div className="p-4 bg-[#f7f8fa] dark:bg-[#0d1117] rounded-[11px] text-center">
                <p className="text-[12px] font-semibold text-[#6b7280] dark:text-[#7d8590] mb-1">
                  Total Expenses
                </p>
                <p className="text-[12px] text-[#9ca3af] mb-2">ចំណាយសរុប</p>
                <p className="text-[22px] font-bold text-red-500">
                  {summaryData.expenses}
                </p>
              </div>
              <div className="p-4 bg-[rgba(41,178,141,0.08)] rounded-[11px] text-center border border-[rgba(41,178,141,0.18)]">
                <p className="text-[12px] font-semibold text-[#29B28D] mb-1">
                  Net Profit
                </p>
                <p className="text-[12px] text-[#29B28D]/60 mb-2">
                  ប្រាក់ចំណេញ
                </p>
                <p className="text-[22px] font-bold text-[#29B28D]">
                  {summaryData.profit}
                </p>
              </div>
            </div>

            {/* AI Summary Section */}
            <div className="bg-[rgba(41,178,141,0.06)] rounded-[11px] p-5 mb-6 border border-[rgba(41,178,141,0.15)]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#29B28D]" />
                <h4 className="font-bold text-[14px] text-[#111827] dark:text-white">
                  AI Daily Summary
                </h4>
                <span className="text-[10px] font-bold text-[#29B28D] bg-[rgba(41,178,141,0.12)] px-2 py-0.5 rounded-full">
                  PRO
                </span>
              </div>
              <p className="text-[14px] text-[#111827] dark:text-white leading-relaxed">
                📊 <strong>Great day!</strong> Revenue increased by 18% vs.
                yesterday. Iced Coffee continues to dominate with 52 units sold.
                Your profit margin improved to 70.7%. Consider restocking Hot
                Latte — current stock is critically low at 8 units.
              </p>
            </div>

            <div className="text-[13px] text-[#6b7280] dark:text-[#7d8590] mb-5">
              Auto-calculated: {summaryData.sales} − {summaryData.expenses} ={" "}
              <strong className="text-[#111827] dark:text-white">{summaryData.profit}</strong>
            </div>

            {!isDayLocked ? (
              <button
                onClick={() => setIsDayLocked(true)}
                className="w-full flex items-center justify-center gap-2.5 bg-[#29B28D] hover:opacity-90 text-[#0E1319] font-bold text-[16px] py-4 rounded-[11px] border-0 cursor-pointer transition-all shadow-[0_4px_22px_rgba(41,178,141,0.28)] min-h-[56px]"
              >
                <Lock className="w-5 h-5" />
                <span>Confirm &amp; Lock Day (បញ្ជាក់ និងចាក់សោ)</span>
              </button>
            ) : (
              <div className="w-full flex items-center justify-center gap-2.5 bg-[#f7f8fa] dark:bg-[#0d1117] text-[#6b7280] dark:text-[#7d8590] font-bold text-[16px] py-4 rounded-[11px] border border-[#e8eaed] dark:border-white/5 min-h-[56px]">
                <CheckCircle2 className="w-5 h-5 text-[#29B28D]" />
                <span>Day Locked — Records Finalized</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Category Modal */}
      {showCustomCategoryModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0E1319]/40 backdrop-blur-sm p-4">
          <div
            className="absolute inset-0"
            onClick={() => setShowCustomCategoryModal(false)}
          />
          <div className="bg-white dark:bg-dark-surface rounded-[14px] w-full max-w-md p-6 shadow-2xl relative z-10">
            <button
              onClick={() => setShowCustomCategoryModal(false)}
              className="absolute top-4 right-4 text-[#6b7280] dark:text-[#7d8590] hover:text-[#111827] dark:text-white p-1.5 rounded-[8px] hover:bg-[#f7f8fa] dark:hover:bg-white/5 dark:bg-[#0d1117] transition-colors bg-transparent border-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-5">
              <Tag className="w-5 h-5 text-[#29B28D]" />
              <h3 className="font-bold text-[19px] text-[#111827] dark:text-white">
                Add Custom Category
              </h3>
            </div>
            <p className="text-[13px] text-[#6b7280] dark:text-[#7d8590] mb-5">
              Create your own expense categories beyond the default presets.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-wider mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Marketing (ទីផ្សារ)"
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f7f8fa] dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/5 rounded-[10px] text-[15px] font-medium focus:bg-white dark:bg-dark-surface focus:border-[#29B28D] outline-none transition-all min-h-[48px]"
                  style={{ fontFamily: "inherit" }}
                />
              </div>
              <button
                onClick={() => {
                  setShowCustomCategoryModal(false);
                  setCustomCategoryName("");
                }}
                className="w-full bg-[#29B28D] hover:opacity-90 text-[#0E1319] font-bold py-3 rounded-[10px] transition-colors min-h-[48px] border-0 cursor-pointer"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}
    </VendorDashboardLayout>
  );
}
