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
  Zap,
  ShoppingCart,
  Minus,
  Clock,
  Target,
} from "lucide-react";

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

export default function ProDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDayLocked, setIsDayLocked] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
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
      ) {
        closeQuickSale();
      }
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

  // Pro: Unlimited logging
  const usageData = { used: 1247, limit: Infinity };

  // Advanced analytics data
  const weeklyData = [55, 82, 48, 95, 72, 130, 92];
  const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const monthlyData = [520, 680, 610, 740];
  const monthlyLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];

  // Best-selling products
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
            active
          />
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
              <span className="font-semibold text-sm text-indigo-700">
                Pro Plan
              </span>
            </div>
            <p className="text-xs text-indigo-400 mb-2">
              $3/month · Unlimited Logs
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
                  Pro Dashboard
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[11px] font-bold rounded-full">
                  <Crown className="w-3 h-3" /> PRO
                </span>
              </div>
              <p className="text-[12px] font-khmer text-slate-500">
                ផ្ទាំងគ្រប់គ្រង Pro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* ─── QUICK SALE ─── */}
            <div ref={quickSaleRef} className="relative">
              <button
                onClick={() => setQuickSaleOpen((o) => !o)}
                className={`flex items-center gap-[7px] border-0 rounded-xl px-4 py-[9px] font-bold text-[13px] cursor-pointer transition-all duration-200 ${
                  quickSaleOpen
                    ? "bg-slate-900 text-white"
                    : "bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm"
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
                  <span className="bg-white text-indigo-600 rounded-full w-[18px] h-[18px] text-[10px] font-extrabold flex items-center justify-center ml-0.5 shadow-sm">
                    {cartItems}
                  </span>
                )}
              </button>

              {/* Dropdown panel */}
              {quickSaleOpen && (
                <div
                  className="absolute top-[calc(100%+10px)] right-0 w-[330px] bg-white border border-slate-200 rounded-2xl shadow-[0_20px_56px_rgba(0,0,0,0.18)] overflow-hidden"
                  style={{ zIndex: 9999 }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2 px-[18px] py-[14px] border-b border-slate-100 bg-slate-50">
                    <ShoppingCart className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-sm text-slate-900">
                      Quick Sale
                    </span>
                    <span className="text-[11px] text-slate-500 ml-auto font-khmer">
                      ការលក់រហ័ស
                    </span>
                  </div>

                  <div className="p-[14px_18px] max-h-[60vh] overflow-y-auto">
                    <div className="relative mb-[14px]">
                      <Search className="w-3.5 h-3.5 absolute left-[11px] top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        ref={searchRef}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search product..."
                        className="w-full pl-[33px] pr-[11px] py-[9px] bg-slate-50 border border-slate-200 rounded-xl text-[13px] outline-none text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                      />
                      {searchQuery && (
                        <div
                          className="absolute top-full left-0 right-0 bg-white border border-slate-200 border-t-0 rounded-b-xl overflow-hidden shadow-lg mt-0.5"
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
                                className="w-full flex justify-between items-center px-[13px] py-[9px] bg-transparent border-0 cursor-pointer text-[13px] text-slate-700 text-left hover:bg-slate-50 mb-0"
                              >
                                <span className="font-medium">{p.name}</span>
                                <span className="text-indigo-600 font-bold">
                                  ${p.price.toFixed(2)}
                                </span>
                              </button>
                            ))
                          ) : (
                            <div className="px-[13px] py-[10px] text-[12.5px] text-slate-500">
                              No products found
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {!searchQuery && (
                      <div className="mb-[14px]">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                          Tap to add
                        </div>
                        <div className="grid grid-cols-2 gap-2">
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
                                className={`px-3 py-[9px] rounded-xl text-left cursor-pointer transition-all duration-[120ms] relative border ${
                                  inCart
                                    ? "bg-indigo-50 border-indigo-300"
                                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                                } mb-0`}
                              >
                                <div
                                  className={`text-xs font-semibold truncate mb-0.5 ${inCart ? "text-indigo-700" : "text-slate-700"}`}
                                >
                                  {p.name}
                                </div>
                                <div
                                  className={`text-[11px] font-bold ${inCart ? "text-indigo-600" : "text-slate-500"}`}
                                >
                                  ${p.price.toFixed(2)}
                                </div>
                                {inCart && (
                                  <span className="absolute top-1.5 right-2 bg-indigo-500 text-white rounded-full w-[17px] h-[17px] text-[9px] font-extrabold flex items-center justify-center shadow-sm">
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
                      <div className="mb-3 max-h-[140px] overflow-y-auto pr-1">
                        {cart.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex items-center gap-2 py-[7px] border-b border-slate-100"
                          >
                            <span className="text-[12.5px] flex-1 text-slate-700 font-medium">
                              {item.product.name}
                            </span>
                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shrink-0">
                              <button
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  changeQty(item.product.id, -1);
                                }}
                                className="w-6 h-6 bg-transparent border-0 cursor-pointer flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold min-w-[20px] text-center text-slate-700">
                                {item.qty}
                              </span>
                              <button
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  changeQty(item.product.id, 1);
                                }}
                                className="w-6 h-6 bg-transparent border-0 cursor-pointer flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-[12.5px] font-bold min-w-[48px] text-right text-slate-900">
                              ${(item.product.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between py-2 border-t border-slate-100 mb-3 mt-1">
                      <span className="text-xs text-slate-500 font-medium">
                        Customers · <span className="font-khmer">អតិថិជន</span>
                      </span>
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setCustomers((c) => Math.max(1, c - 1));
                          }}
                          className="w-7 h-7 bg-transparent border-0 cursor-pointer text-slate-500 flex items-center justify-center hover:bg-slate-200 hover:text-slate-700 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[13px] font-bold min-w-[24px] text-center text-slate-700">
                          {customers}
                        </span>
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setCustomers((c) => c + 1);
                          }}
                          className="w-7 h-7 bg-transparent border-0 cursor-pointer text-slate-500 flex items-center justify-center hover:bg-slate-200 hover:text-slate-700 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">
                        {cartItems} item{cartItems !== 1 ? "s" : ""}
                      </span>
                      <span className="font-extrabold text-xl text-indigo-600">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        if (cart.length) completeSale();
                      }}
                      disabled={cart.length === 0}
                      className={`w-full py-3.5 font-bold text-[13.5px] border-0 rounded-xl flex items-center justify-center gap-[7px] transition-all ${
                        cart.length
                          ? "bg-indigo-500 text-white cursor-pointer shadow-md hover:bg-indigo-600 hover:shadow-lg"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      } mb-0`}
                    >
                      <CheckCircle2 className="w-4 h-4" /> Complete Sale
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Export Buttons */}
            <button className="hidden lg:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-3.5 py-2 rounded-xl transition-colors text-sm min-h-[40px] cursor-pointer border-0">
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
            <button className="hidden lg:flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-3.5 py-2 rounded-xl transition-colors text-sm min-h-[40px] cursor-pointer">
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative bg-transparent border-0 cursor-pointer">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 text-sm shadow-sm shrink-0">
              SM
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">
          {/* ══ WELCOME BANNER ══════════════════════════════════ */}
          <div className="bg-indigo-900 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-lg overflow-hidden relative border border-indigo-800">
            {/* Background decoration */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20 pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500 rounded-full blur-[80px] opacity-20 pointer-events-none" />

            {/* Left — greeting */}
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[19px] font-extrabold text-white shrink-0 shadow-lg">
                SM
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[22px] font-extrabold text-white tracking-tight">
                    {greeting}, Sok Maly{" "}
                    <span className="inline-block origin-bottom-right hover:rotate-12 transition-transform cursor-default">
                      👋
                    </span>
                  </span>
                </div>
                <div className="text-[13px] text-indigo-200 mt-1 flex items-center gap-2 font-medium">
                  <span className="font-khmer">{greetingKh}</span>
                  <span className="w-1 h-1 rounded-full bg-indigo-400/50 block" />
                  <Clock className="w-3.5 h-3.5 text-indigo-300" />
                  <span>{dateStr}</span>
                </div>
              </div>
            </div>

            {/* Right — goal ring */}
            <div className="flex items-center gap-6 sm:shrink-0 relative z-10 backdrop-blur-sm p-4 rounded-2xl">
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
                <div className="flex items-center gap-1.5 mb-1 text-indigo-300">
                  <Target className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.06em]">
                    Daily Goal
                  </span>
                </div>
                <div className="text-[24px] font-extrabold text-white leading-none tracking-tight mb-1">
                  ${GOAL.current.toFixed(2)}
                </div>
                <div className="text-[12px] text-indigo-200 mt-0.5 font-medium">
                  of ${GOAL.target.toFixed(2)} target
                </div>
                <div className="mt-2.5 w-[140px] h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
                  <div
                    className="h-full bg-indigo-400 rounded-full transition-[width] duration-700 shadow-[0_0_10px_rgba(129,140,248,0.5)]"
                    style={{ width: `${goalPct}%` }}
                  />
                </div>
                <div className="text-[11px] font-khmer text-indigo-300 mt-1.5 opacity-80">
                  {GOAL.khmer}
                </div>
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <SummaryCard
              title="Total Sales"
              khmerTitle="ការលក់សរុប"
              value={summaryData.sales}
              icon={CircleDollarSign}
              trend="+18%"
              isPositive={true}
            />
            <SummaryCard
              title="Net Profit"
              khmerTitle="ប្រាក់ចំណេញ"
              value={summaryData.profit}
              icon={TrendingUp}
              trend="+24%"
              isPositive={true}
              highlight
            />
            <SummaryCard
              title="Profit Margin"
              khmerTitle="អត្រាចំណេញ"
              value={summaryData.profitMargin}
              icon={ArrowUpRight}
              trend="+3.2%"
              isPositive={true}
            />
            <SummaryCard
              title="Best Seller"
              khmerTitle="លក់ដាច់ជាងគេ"
              value={summaryData.bestSelling}
              icon={Crown}
              subtext="52 sold this week"
            />
          </div>

          {/* Advanced Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Revenue */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[15px] text-slate-900 mb-1">
                Weekly Revenue
              </h3>
              <p className="text-[12px] font-khmer text-slate-400 mb-5">
                ចំណូលប្រចាំសប្តាហ៍
              </p>
              <div className="h-40 flex items-end gap-1.5">
                {weeklyData.map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full bg-indigo-50 rounded-t-lg relative group"
                      style={{ height: "120px" }}
                    >
                      <div
                        className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-600"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {weeklyLabels[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[15px] text-slate-900 mb-1">
                Monthly Revenue
              </h3>
              <p className="text-[12px] font-khmer text-slate-400 mb-5">
                ចំណូលប្រចាំខែ
              </p>
              <div className="h-40 flex items-end gap-2">
                {monthlyData.map((val, i) => {
                  const maxVal = 800;
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span className="text-[11px] font-bold text-slate-500">
                        ${val}
                      </span>
                      <div
                        className="w-full bg-indigo-50 rounded-t-lg relative group"
                        style={{ height: "100px" }}
                      >
                        <div
                          className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-600"
                          style={{ height: `${(val / maxVal) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {monthlyLabels[i]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expenses with Custom Categories */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col col-span-2">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-[15px] text-slate-900">
                  Expenses
                </h3>
                <div className="flex items-center gap-2">
                  {expLogged && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" /> Logged!
                    </span>
                  )}
                </div>
              </div>
              <p className="text-[12px] font-khmer text-slate-400 mb-4">
                ការចំណាយ
              </p>
              <div className="space-y-3 flex-1">
                {expenseCategories.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-khmer font-medium text-slate-700">
                          {item.label}
                        </span>
                        {(item as any).custom && (
                          <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                            CUSTOM
                          </span>
                        )}
                      </div>
                      <span className="text-[13px] font-bold text-slate-500">
                        {item.value}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${item.value}%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
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
                <h3 className="font-bold text-[17px] text-slate-900">
                  Best Selling Products
                </h3>
                <p className="text-[12px] font-khmer text-slate-400 mt-0.5">
                  ផលិតផលលក់ដាច់ជាងគេ
                </p>
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
                        <span className="text-[14px] font-semibold text-slate-900">
                          {item.name}
                        </span>
                        <span className="text-[11px] font-khmer text-slate-400 ml-2">
                          {item.khmer}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[14px] font-bold text-indigo-600">
                          {item.revenue}
                        </span>
                        <span className="text-[12px] text-slate-400 ml-2">
                          ({item.qty} sold)
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                        style={{ width: `${item.pct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Management + Map Visibility */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="flex flex-col gap-6">
              {/* Low Stock Alerts */}
              {inventoryItems.filter((i) => i.status !== "good").length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
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
                          className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-orange-100"
                        >
                          <span className="text-[13px] font-medium text-slate-700">
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
            </div>
          </div>

          {/* End-of-Day Summary with AI Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[17px] text-slate-900">
                  End-of-Day Summary
                </h3>
                <p className="text-[12px] font-khmer text-slate-400 mt-0.5">
                  សង្ខេបចុងថ្ងៃ
                </p>
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
                  <p className="text-[12px] font-semibold text-slate-500 mb-1">
                    Total Sales
                  </p>
                  <p className="text-[12px] font-khmer text-slate-400 mb-2">
                    ការលក់សរុប
                  </p>
                  <p className="text-[22px] font-bold text-slate-900">
                    {summaryData.sales}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <p className="text-[12px] font-semibold text-slate-500 mb-1">
                    Total Expenses
                  </p>
                  <p className="text-[12px] font-khmer text-slate-400 mb-2">
                    ចំណាយសរុប
                  </p>
                  <p className="text-[22px] font-bold text-red-500">
                    {summaryData.expenses}
                  </p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-xl text-center border border-indigo-100">
                  <p className="text-[12px] font-semibold text-indigo-600 mb-1">
                    Net Profit
                  </p>
                  <p className="text-[12px] font-khmer text-indigo-400 mb-2">
                    ប្រាក់ចំណេញ
                  </p>
                  <p className="text-[22px] font-bold text-indigo-600">
                    {summaryData.profit}
                  </p>
                </div>
              </div>

              {/* AI Summary Section */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 mb-6 border border-indigo-100">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-bold text-[14px] text-indigo-700">
                    AI Daily Summary
                  </h4>
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-100 px-2 py-0.5 rounded-full">
                    PRO
                  </span>
                </div>
                <p className="text-[14px] text-slate-700 leading-relaxed">
                  📊 <strong>Great day!</strong> Revenue increased by 18% vs.
                  yesterday. Iced Coffee continues to dominate with 52 units
                  sold. Your profit margin improved to 70.7%. Consider
                  restocking Hot Latte — current stock is critically low at 8
                  units. Mango Sticky Rice is completely sold out and should be
                  replenished for tomorrow.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[13px] text-slate-400 mb-5">
                <span>
                  Auto-calculated: Sales ({summaryData.sales}) − Expenses (
                  {summaryData.expenses}) ={" "}
                  <strong className="text-slate-700">
                    {summaryData.profit}
                  </strong>
                </span>
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
          <div
            className="absolute inset-0"
            onClick={() => setShowCustomCategoryModal(false)}
          ></div>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10">
            <button
              onClick={() => setShowCustomCategoryModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-5">
              <Tag className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-[19px] text-slate-900">
                Add Custom Category
              </h3>
            </div>
            <p className="text-[13px] text-slate-500 mb-5">
              Create your own expense categories beyond the default Khmer
              presets.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Marketing (ទីផ្សារ)"
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all min-h-[48px]"
                />
              </div>
              <button
                onClick={() => {
                  setShowCustomCategoryModal(false);
                  setCustomCategoryName("");
                }}
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
    Sales: "/vendor/sales",
    Expenses: "/vendor/expenses",
    Customers: "/vendor/customer",
    Inventory: "/vendor/inventory",
    Reports: "/vendor/reports",
    Settings: "/vendor/settings",
  };
  return (
    <Link
      href={hrefMap[title] || "#"}
      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors min-h-[48px] ${active ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
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
