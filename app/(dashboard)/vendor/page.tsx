"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Plus,
  TrendingUp,
  Menu,
  X,
  Bell,
  Lock,
  CheckCircle2,
  Search,
  ChevronRight,
  Minus,
  ShoppingCart,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";

import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";

// ─── Types ─────────────────────────────────────────────────────────
interface NavItemProps {
  icon: React.ElementType;
  title: string;
  khmerTitle: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
}
interface SummaryCardProps {
  title: string;
  khmerTitle: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  isPositive?: boolean;
  subtext?: string;
  highlight?: boolean;
}
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

const EXP_BREAKDOWN = [
  {
    key: "ingredients",
    label: "គ្រឿងផ្សំ",
    labelEn: "Ingredients",
    pct: 43,
    color: "#3ecf8e",
  },
  { key: "rent", label: "ថ្លៃដូរ", labelEn: "Rent", pct: 25, color: "#3b82f6" },
  {
    key: "labor",
    label: "ពលកម្ម",
    labelEn: "Labor",
    pct: 16,
    color: "#f59e0b",
  },
  {
    key: "electricity",
    label: "អំពើពន្លឺ",
    labelEn: "Electric",
    pct: 9,
    color: "#ef4444",
  },
  {
    key: "transport",
    label: "អគ្គិសនី",
    labelEn: "Transport",
    pct: 5,
    color: "#8b5cf6",
  },
  { key: "other", label: "ផ្សេងៗ", labelEn: "Other", pct: 2, color: "#6366f1" },
];

const GOAL = {
  label: "Daily Revenue Goal",
  khmer: "គោលដៅចំណូលប្រចាំថ្ងៃ",
  current: 124.5,
  target: 200,
};

// ═══════════════════════════════════════════════════════════════════
export default function VendorDashboard() {
  const [isDayLocked, setIsDayLocked] = useState(false);
  const [quickSaleOpen, setQuickSaleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [customers, setCustomers] = useState(1);
  const [expLogged, setExpLogged] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const quickSaleRef = useRef<HTMLDivElement>(null);

  const summary = {
    sales: "$124.50",
    expenses: "$45.00",
    profit: "$79.50",
    customers: "42",
    avgCustomer: "$2.96",
  };

  const expenseCategories = [
    { label: "គ្រឿងផ្សំ", value: 38, color: "#3ecf8e" },
    { label: "ថ្លៃជួល", value: 22, color: "#3b82f6" },
    { label: "ពលកម្ម", value: 18, color: "#f59e0b" },
    { label: "ដឹកជញ្ជូន", value: 10, color: "#ef4444" },
    { label: "អគ្គិសនី", value: 5, color: "#8b5cf6" },
    { label: "ទីផ្សារ", value: 4, color: "#ec4899", custom: true },
    { label: "ផ្សេងៗ", value: 3, color: "#94a3b8" },
  ];

  const usage = { used: 127, limit: 500 };
  const usagePct = Math.min((usage.used / usage.limit) * 100, 100);

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

  const weeklyData = [40, 70, 45, 90, 65, 120, 85];
  const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthlyData = [320, 480, 410, 540];
  const monthlyLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];

  // Focus search on open
  useEffect(() => {
    if (quickSaleOpen) setTimeout(() => searchRef.current?.focus(), 120);
  }, [quickSaleOpen]);

  // Escape closes quick sale
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuickSale();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  // Click-outside closes quick sale
  useEffect(() => {
    if (!quickSaleOpen) return;
    const fn = (e: MouseEvent) => {
      if (
        quickSaleRef.current &&
        !quickSaleRef.current.contains(e.target as Node)
      ) {
        closeQuickSale();
      }
    };
    setTimeout(() => document.addEventListener("mousedown", fn), 0);
    return () => document.removeEventListener("mousedown", fn);
  }, [quickSaleOpen]);

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
  const closeQuickSale = useCallback(() => {
    setQuickSaleOpen(false);
    setCart([]);
    setSearchQuery("");
  }, []);

  const logExpense = () => {
    setExpLogged(true);
    setTimeout(() => setExpLogged(false), 2200);
  };

  return (
    <VendorDashboardLayout
      plan="free"
      navLinks={[
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
      ]}
      currentPath="/vendor"
      title="Overview"
      rightActions={
        <>
          {/* ─── QUICK SALE ─── */}
          <div ref={quickSaleRef} className="relative">
            <button
              onClick={() => setQuickSaleOpen((o) => !o)}
              className={`flex items-center gap-[7px] border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer transition-all duration-200 ${
                quickSaleOpen
                  ? "bg-[#0d1117] text-[#e6edf3]"
                  : "bg-[#3ecf8e] text-[#0d1117] shadow-[0_2px_14px_rgba(62,207,142,0.28)]"
              }`}
            >
              {quickSaleOpen ? (
                <>
                  <X size={14} /> Cancel
                </>
              ) : (
                <>
                  <Zap size={14} /> Quick Sale
                </>
              )}
              {cartItems > 0 && !quickSaleOpen && (
                <span className="bg-[#0d1117] text-[#3ecf8e] rounded-full w-[18px] h-[18px] text-[10px] font-extrabold flex items-center justify-center ml-0.5">
                  {cartItems}
                </span>
              )}
            </button>

            {/* Dropdown panel */}
            {quickSaleOpen && (
              <div
                className="absolute top-[calc(100%+10px)] right-0 w-[330px] bg-white border border-[#e8eaed] rounded-[14px] shadow-[0_20px_56px_rgba(0,0,0,0.18)] overflow-hidden"
                style={{ zIndex: 9999 }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center gap-2 px-[18px] py-[14px] border-b border-[#e8eaed]">
                  <ShoppingCart size={14} className="text-[#3ecf8e]" />
                  <span className="font-bold text-sm text-[#111827]">
                    Quick Sale
                  </span>
                  <span className="text-[11px] text-[#6b7280] ml-auto">
                    ការលក់រហ័ស
                  </span>
                </div>

                <div className="p-[14px_18px]">
                  {/* Search with autocomplete */}
                  <div className="relative mb-[14px]">
                    <Search
                      size={13}
                      className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none"
                    />
                    <input
                      ref={searchRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search product..."
                      className="w-full pl-[33px] pr-[11px] py-[9px] bg-[#f7f8fa] border border-[#e8eaed] rounded-[9px] text-[13px] outline-none text-[#111827] focus:border-[#3ecf8e] transition-colors"
                      style={{ fontFamily: "inherit" }}
                    />
                    {searchQuery && (
                      <div
                        className="absolute top-full left-0 right-0 bg-white border border-[#e8eaed] border-t-0 rounded-b-[9px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
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
                              className="w-full flex justify-between items-center px-[13px] py-[9px] bg-transparent border-0 cursor-pointer text-[13px] text-[#111827] text-left hover:bg-[#f7f8fa]"
                              style={{ fontFamily: "inherit" }}
                            >
                              <span>{p.name}</span>
                              <span className="text-[#3ecf8e] font-bold">
                                ${p.price.toFixed(2)}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-[13px] py-[10px] text-[12.5px] text-[#6b7280]">
                            No products found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Product grid */}
                  {!searchQuery && (
                    <div className="mb-[14px]">
                      <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.07em] mb-2">
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
                                  ? "bg-[rgba(62,207,142,0.12)] border-[#3ecf8e]"
                                  : "bg-[#f7f8fa] border-[#e8eaed] hover:bg-[#eff0f2]"
                              }`}
                            >
                              <div
                                className={`text-xs font-semibold truncate mb-0.5 ${inCart ? "text-[#3ecf8e]" : "text-[#111827]"}`}
                              >
                                {p.name}
                              </div>
                              <div
                                className={`text-[11px] font-bold ${inCart ? "text-[#3ecf8e]" : "text-[#6b7280]"}`}
                              >
                                ${p.price.toFixed(2)}
                              </div>
                              {inCart && (
                                <span className="absolute top-1.5 right-2 bg-[#3ecf8e] text-[#0d1117] rounded-full w-[17px] h-[17px] text-[9px] font-extrabold flex items-center justify-center">
                                  {inCart.qty}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Cart items */}
                  {cart.length > 0 && (
                    <div className="mb-3 max-h-[140px] overflow-y-auto">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center gap-2 py-[7px] border-b border-[#f0f2f5]"
                        >
                          <span className="text-[12.5px] flex-1 text-[#111827]">
                            {item.product.name}
                          </span>
                          <div className="flex items-center bg-[#f7f8fa] border border-[#e8eaed] rounded-[7px] overflow-hidden">
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault();
                                changeQty(item.product.id, -1);
                              }}
                              className="w-6 h-6 bg-transparent border-0 cursor-pointer flex items-center justify-center text-[#6b7280] hover:bg-[#e8eaed]"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-xs font-bold min-w-[18px] text-center">
                              {item.qty}
                            </span>
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault();
                                changeQty(item.product.id, 1);
                              }}
                              className="w-6 h-6 bg-transparent border-0 cursor-pointer flex items-center justify-center text-[#6b7280] hover:bg-[#e8eaed]"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          <span className="text-[12.5px] font-bold min-w-[48px] text-right">
                            ${(item.product.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Customers */}
                  <div className="flex items-center justify-between py-2 border-t border-[#f0f2f5] mb-3">
                    <span className="text-xs text-[#6b7280] font-medium">
                      Customers · អតិថិជន
                    </span>
                    <div className="flex items-center bg-[#f7f8fa] border border-[#e8eaed] rounded-[8px] overflow-hidden">
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setCustomers((c) => Math.max(1, c - 1));
                        }}
                        className="w-7 h-7 bg-transparent border-0 cursor-pointer text-[#6b7280] flex items-center justify-center hover:bg-[#e8eaed]"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-[13px] font-bold min-w-5 text-center">
                        {customers}
                      </span>
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setCustomers((c) => c + 1);
                        }}
                        className="w-7 h-7 bg-transparent border-0 cursor-pointer text-[#6b7280] flex items-center justify-center hover:bg-[#e8eaed]"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#6b7280]">
                      {cartItems} item{cartItems !== 1 ? "s" : ""}
                    </span>
                    <span className="font-extrabold text-xl text-[#3ecf8e]">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Complete sale */}
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      if (cart.length) completeSale();
                    }}
                    disabled={cart.length === 0}
                    className={`w-full py-3 font-bold text-[13.5px] border-0 rounded-[10px] flex items-center justify-center gap-[7px] transition-all ${
                      cart.length
                        ? "bg-[#3ecf8e] text-[#0d1117] cursor-pointer shadow-[0_4px_14px_rgba(62,207,142,0.28)] hover:bg-[#4dd49a]"
                        : "bg-[#f0f2f5] text-[#6b7280] cursor-not-allowed"
                    }`}
                  >
                    <CheckCircle2 size={15} /> Complete Sale
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      }
    >
      {/* ── Scrollable page body ── */}
      <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px]">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-5">
          {/* ══ WELCOME BANNER ══════════════════════════════════ */}
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

          {/* ── Usage bar ── */}
          <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[22px] py-4">
            <div className="flex items-center justify-between mb-[10px]">
              <div>
                <div className="text-[13.5px] font-semibold text-[#111827]">
                  Monthly Sales Logs
                </div>
                <div className="text-[11px] text-[#6b7280] mt-px">
                  កំណត់ត្រាលក់ប្រចាំខែ
                </div>
              </div>
              <span className="text-sm font-bold text-[#111827]">
                {usage.used}{" "}
                <span className="text-[#6b7280] font-normal">
                  / {usage.limit}
                </span>
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-[600ms] ease-in-out"
                style={{
                  width: `${usagePct}%`,
                  background: usagePct > 80 ? "#f59e0b" : "#3ecf8e",
                }}
              />
            </div>
            <div className="text-xs text-[#6b7280] mt-2">
              {usage.limit - usage.used} logs remaining · Resets monthly ·{" "}
              <Link
                href="/vendor/pricing"
                className="text-[#3ecf8e] no-underline font-semibold"
              >
                Upgrade for unlimited
              </Link>
            </div>
          </div>

          {/* ── Metric cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <VendorSummaryCard
              title="Total Sales"
              khmerTitle="ការលក់សរុប"
              value={summary.sales}
              icon={CircleDollarSign}
              trend="+12%"
              isPositive
            />
            <VendorSummaryCard
              title="Total Expenses"
              khmerTitle="ចំណាយសរុប"
              value={summary.expenses}
              icon={Receipt}
              trend="-5%"
              isPositive={false}
            />
            <VendorSummaryCard
              title="Net Profit"
              khmerTitle="ប្រាក់ចំណេញ"
              value={summary.profit}
              icon={TrendingUp}
              trend="+17%"
              isPositive
              highlight
            />
            <VendorSummaryCard
              title="Customers"
              khmerTitle="អតិថិជនសរុប"
              value={summary.customers}
              icon={Users}
              subtext={`Avg ${summary.avgCustomer}`}
            />
          </div>

          {/* ── Charts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-[#e8eaed] rounded-[14px] p-6 shadow-sm">
              <h3 className="font-semibold text-[15px] text-[#111827] mb-1">
                Monthly Revenue
              </h3>
              <p className="text-[12px] text-[#6b7280] mb-5">ចំណូលប្រចាំខែ</p>
              <div className="h-40 flex items-end gap-2">
                {monthlyData.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-[11px] font-bold text-[#6b7280]">
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
                    <span className="text-[10px] text-[#6b7280]">
                      {monthlyLabels[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Revenue */}
            <div className="bg-white border border-[#e8eaed] rounded-[14px] p-6 shadow-sm">
              <h3 className="font-semibold text-[15px] text-[#111827] mb-1">
                Weekly Revenue
              </h3>
              <p className="text-[12px] text-[#6b7280] mb-5">
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
                    <span className="text-[10px] text-[#6b7280]">
                      {weeklyLabels[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expenses */}
            <div className="bg-white border border-[#e8eaed] rounded-[14px] p-6 shadow-sm col-span-1 lg:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-[15px] text-[#111827]">
                  Expenses
                </h3>
                {expLogged && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[rgba(41,178,141,0.1)] text-[#29B28D] text-[10px] font-bold border border-[rgba(41,178,141,0.2)] uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3" /> Logged!
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[#6b7280] mb-4">ការចំណាយ</p>
              <div className="space-y-3">
                {expenseCategories.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-[#111827]">
                          {item.label}
                        </span>
                        {(item as any).custom && (
                          <span className="text-[9px] font-bold text-[#29B28D] bg-[rgba(41,178,141,0.1)] px-1.5 py-0.5 rounded border border-[rgba(41,178,141,0.2)]">
                            CUSTOM
                          </span>
                        )}
                      </div>
                      <span className="text-[13px] font-bold text-[#6b7280]">
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

          {/* ── Expenses Breakdown ── */}
          <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[26px] py-[22px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-[20px]">
              <div>
                <div className="text-sm font-semibold text-[#111827]">
                  Expenses
                </div>
                <div className="text-[11px] text-[#6b7280] mt-0.5">
                  ចំណាយតាមប្រភេទ
                </div>
              </div>
              {expLogged && (
                <span className="inline-flex items-center gap-[5px] px-3 py-[5px] rounded-full bg-[rgba(62,207,142,0.12)] text-[#3ecf8e] text-xs font-bold border border-[rgba(62,207,142,0.2)]">
                  <CheckCircle2 size={13} /> Logged!
                </span>
              )}
            </div>

            {/* Horizontal bar chart rows */}
            <div className="flex flex-col gap-[16px] mb-[24px]">
              {EXP_BREAKDOWN.map((item) => (
                <div key={item.key} className="flex items-center gap-4">
                  {/* Khmer label */}
                  <div className="w-[90px] shrink-0">
                    <div className="text-[12.5px] font-medium text-[#111827] leading-tight">
                      {item.label}
                    </div>
                  </div>
                  {/* Track */}
                  <div className="flex-1 h-[6px] bg-[#f0f2f5] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-700 ease-out"
                      style={{ width: `${item.pct}%`, background: item.color }}
                    />
                  </div>
                  {/* Percent */}
                  <div className="w-[36px] text-right text-[12.5px] font-bold text-[#6b7280] shrink-0">
                    {item.pct}%
                  </div>
                </div>
              ))}
            </div>

            {/* Quick log form */}
            <div className="pt-[18px] border-t border-[#f0f2f5]">
              <div className="text-[10.5px] font-bold text-[#6b7280] uppercase tracking-[0.06em] mb-3">
                Quick Log · ចំណាយ
              </div>
              <div className="flex flex-wrap gap-3 items-end">
                {/* Amount */}
                <div className="relative w-[140px]">
                  <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#6b7280]">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-[10px] bg-[#f7f8fa] border border-[#e8eaed] rounded-[10px] text-[15px] font-bold outline-none text-[#111827] focus:border-[#3ecf8e] transition-colors"
                    style={{ fontFamily: "inherit" }}
                  />
                </div>
                {/* Category pills — clicking one logs */}
                <div className="flex flex-wrap gap-[6px]">
                  {EXP_BREAKDOWN.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={logExpense}
                      className="px-3 py-[7px] rounded-[8px] text-[12px] font-semibold border border-[#e8eaed] bg-[#f7f8fa] text-[#6b7280] cursor-pointer hover:border-[#3ecf8e] hover:text-[#3ecf8e] hover:bg-[rgba(62,207,142,0.08)] transition-all duration-150"
                    >
                      {cat.labelEn}
                    </button>
                  ))}
                </div>
                {/* Note */}
                <input
                  type="text"
                  placeholder="Note (optional)"
                  className="flex-1 min-w-[160px] px-[14px] py-[10px] bg-[#f7f8fa] border border-[#e8eaed] rounded-[10px] text-[13px] outline-none text-[#111827] focus:border-[#3ecf8e] transition-colors"
                  style={{ fontFamily: "inherit" }}
                />
              </div>
            </div>
          </div>

          {/* ── End of Day ── */}
          <div className="bg-[#0d1117] rounded-[14px] border border-white/[0.06] overflow-hidden">
            <div className="px-[26px] py-[18px] border-b border-white/[0.07] flex items-center justify-between">
              <div>
                <div className="text-[15px] font-bold text-[#e6edf3]">
                  End-of-Day Summary
                </div>
                <div className="text-[11px] text-[#7d8590] mt-0.5">
                  សង្ខេបចុងថ្ងៃ
                </div>
              </div>
              {isDayLocked && (
                <span className="inline-flex items-center gap-[5px] px-[14px] py-1.5 rounded-full bg-[rgba(62,207,142,0.15)] text-[#3ecf8e] text-xs font-bold border border-[rgba(62,207,142,0.25)]">
                  <CheckCircle2 size={13} /> Day Locked
                </span>
              )}
            </div>

            <div className="px-[26px] py-[22px]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-[18px]">
                <div className="px-5 py-[18px] bg-white/[0.05] rounded-xl text-center border border-white/[0.07]">
                  <div className="text-[11px] font-semibold text-[#7d8590] mb-0.5">
                    Total Sales
                  </div>
                  <div className="text-[10px] text-[#4d5562] mb-[10px]">
                    ការលក់សរុប
                  </div>
                  <div className="font-bold text-[26px] text-[#e6edf3]">
                    {summary.sales}
                  </div>
                </div>
                <div className="px-5 py-[18px] bg-[rgba(239,68,68,0.08)] rounded-xl text-center border border-[rgba(239,68,68,0.15)]">
                  <div className="text-[11px] font-semibold text-[rgba(239,68,68,0.85)] mb-0.5">
                    Total Expenses
                  </div>
                  <div className="text-[10px] text-[#4d5562] mb-[10px]">
                    ចំណាយសរុប
                  </div>
                  <div className="font-bold text-[26px] text-[#ef4444]">
                    {summary.expenses}
                  </div>
                </div>
                <div className="px-5 py-[18px] bg-[rgba(62,207,142,0.10)] rounded-xl text-center border border-[rgba(62,207,142,0.20)]">
                  <div className="text-[11px] font-semibold text-[#3ecf8e] mb-0.5">
                    Net Profit
                  </div>
                  <div className="text-[10px] text-[#4d5562] mb-[10px]">
                    ប្រាក់ចំណេញ
                  </div>
                  <div className="font-bold text-[26px] text-[#3ecf8e]">
                    {summary.profit}
                  </div>
                </div>
              </div>

              <div className="text-[12.5px] text-[#7d8590] mb-[18px]">
                Auto-calculated: {summary.sales} − {summary.expenses} ={" "}
                <strong className="text-[#e6edf3]">{summary.profit}</strong>
              </div>

              {!isDayLocked ? (
                <button
                  onClick={() => setIsDayLocked(true)}
                  className="w-full flex items-center justify-center gap-[9px] bg-[#3ecf8e] text-[#0d1117] font-bold text-[15px] py-4 rounded-[11px] border-0 cursor-pointer transition-all duration-200 shadow-[0_4px_22px_rgba(62,207,142,0.28)] hover:bg-[#4dd49a]"
                >
                  <Lock size={16} />
                  Confirm &amp; Lock Day
                  <span className="text-xs opacity-65">បញ្ជាក់ និងចាក់សោ</span>
                </button>
              ) : (
                <div className="w-full flex items-center justify-center gap-2 bg-white/[0.05] text-[#7d8590] font-semibold text-sm py-4 rounded-[11px] border border-white/[0.08]">
                  <CheckCircle2 size={16} className="text-[#3ecf8e]" />
                  Day Locked — Records Finalized
                </div>
              )}
            </div>
          </div>

          {/* Bottom breathing room */}
        </div>
      </div>
    </VendorDashboardLayout>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function ChartCard({
  title,
  khmer,
  children,
}: {
  title: string;
  khmer: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[26px] py-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <div className="text-sm font-semibold text-[#111827] mb-0.5">{title}</div>
      <div className="text-[11px] text-[#6b7280] mb-5">{khmer}</div>
      {children}
    </div>
  );
}
