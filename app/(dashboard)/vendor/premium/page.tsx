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
  MessageSquare,
  Send,
  Brain,
  Megaphone,
  TrendingDown,
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
  current: 485.5, // Different from pro
  target: 500,
};

export default function PremiumDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDayLocked, setIsDayLocked] = useState(false);
  const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");

  const [quickSaleOpen, setQuickSaleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [customers, setCustomers] = useState(1);
  const [expLogged, setExpLogged] = useState(false);
  
  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const searchRef = React.useRef<HTMLInputElement>(null);
  const quickSaleRef = React.useRef<HTMLDivElement>(null);

  // Greeting
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const greetingKh = hour < 12 ? "អរុណសួស្តី" : hour < 17 ? "ទិវាសួស្តី" : "សាយ័ណ្ហសួស្តី";
  const dateStr = now.toLocaleDateString("en-KH", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Goal ring logic
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
      if (quickSaleRef.current && !quickSaleRef.current.contains(e.target as Node)) {
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
      if (exists) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
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

  const summaryData = {
    sales: "$524.50",
    expenses: "$145.00",
    profit: "$379.50",
    customers: "124",
    avgCustomer: "$4.23",
    bestSelling: "Iced Coffee",
    profitMargin: "72.3%",
  };

  const usageData = { used: 3482, limit: Infinity };

  const weeklyData = [65, 88, 55, 110, 80, 145, 105];
  const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const monthlyData = [580, 720, 680, 810];
  const monthlyLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];

  const bestSellingProducts = [
    { name: "Iced Coffee", khmer: "កាហ្វេទឹកកក", qty: 62, revenue: "$93.00", pct: 100 },
    { name: "Noodle Soup", khmer: "គុយទាវ", qty: 45, revenue: "$135.00", pct: 78 },
    { name: "Hot Latte", khmer: "ឡាតេក្តៅ", qty: 35, revenue: "$70.00", pct: 62 },
    { name: "Green Tea", khmer: "តែបៃតង", qty: 28, revenue: "$42.00", pct: 50 },
  ];

  const expenseCategories = [
    { label: "គ្រឿងផ្សំ", value: 35, color: "#9333ea" }, // Purple
    { label: "ថ្លៃជួល", value: 25, color: "#a855f7" },
    { label: "ពលកម្ម", value: 15, color: "#d946ef" }, // Fuchsia
    { label: "ដឹកជញ្ជូន", value: 12, color: "#ec4899" }, // Pink
    { label: "អគ្គិសនី", value: 5, color: "#f43f5e" },
    { label: "ទីផ្សារ", value: 5, color: "#e879f9", custom: true },
    { label: "ផ្សេងៗ", value: 3, color: "#94a3b8" },
  ];

  const inventoryItems = [
    { id: 1, name: "Iced Coffee", khmer: "កាហ្វេទឹកកក", stock: 45, threshold: 10, status: "good" },
    { id: 2, name: "Hot Latte", khmer: "ឡាតេក្តៅ", stock: 3, threshold: 10, status: "low" },
    { id: 3, name: "Mango Sticky Rice", khmer: "បាយដំណើបស្វាយ", stock: 0, threshold: 5, status: "out" },
    { id: 4, name: "Noodle Soup", khmer: "គុយទាវ", stock: 24, threshold: 15, status: "good" },
    { id: 5, name: "Green Tea", khmer: "តែបៃតង", stock: 12, threshold: 10, status: "good" },
  ];

  // Premium Notification alerts
  const smartAlerts = [
    { type: "opportunity", message: "Nearby event detected: +40% foot traffic expected tonight", time: "30 min ago" },
    { type: "warning", message: "Trending Drop: Green Tea sales are down 15% today", time: "2 hours ago" },
  ];

  const chatMessages = [
    { role: "assistant", text: "សួស្តី! I'm your AI assistant. How can I help you today?" },
    { role: "assistant", text: "I can help with sales analysis, inventory advice, marketing tips, and more. Just ask!" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-purple-500 selection:text-white">
      {/* --- SIDEBAR --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <Link href="/vendor" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#29B28D] flex items-center justify-center font-bold text-white shadow-sm">P</div>
            <span className="font-bold text-[19px] tracking-tight">PsarPulse KH</span>
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
          <NavItem icon={Megaphone} title="Marketing" khmerTitle="ទីផ្សារ" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <NavItem icon={Settings} title="Settings" khmerTitle="ការកំណត់" />
          <div className="mt-3 p-3.5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl text-white">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-sm">Premium Plan</span>
            </div>
            <p className="text-xs text-slate-400 mb-2">$7/month · Unlimited AI Logs</p>
            <Link
              href="/vendor/pricing"
              className="block w-full text-center text-[12px] font-bold text-purple-300 hover:text-purple-200 bg-white/10 hover:bg-white/15 py-1.5 rounded-lg transition-colors"
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
                <h1 className="text-[22px] font-bold text-slate-900">Premium Dashboard</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-600 text-[11px] font-bold rounded-full">
                  <Sparkles className="w-3 h-3" /> PREMIUM
                </span>
              </div>
              <p className="text-[12px] font-khmer text-slate-500">ផ្ទាំងគ្រប់គ្រង</p>
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
                    : "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white hover:from-purple-600 hover:to-fuchsia-600 shadow-sm shadow-purple-200"
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
                  <span className="bg-white text-purple-600 rounded-full w-[18px] h-[18px] text-[10px] font-extrabold flex items-center justify-center ml-0.5 shadow-sm">
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
                    <ShoppingCart className="w-4 h-4 text-purple-500" />
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
                        className="w-full pl-[33px] pr-[11px] py-[9px] bg-slate-50 border border-slate-200 rounded-xl text-[13px] outline-none text-slate-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-sans"
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
                                <span className="text-purple-600 font-bold">
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
                                    ? "bg-purple-50 border-purple-300"
                                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                                } mb-0`}
                              >
                                <div
                                  className={`text-xs font-semibold truncate mb-0.5 ${inCart ? "text-purple-700" : "text-slate-700"}`}
                                >
                                  {p.name}
                                </div>
                                <div
                                  className={`text-[11px] font-bold ${inCart ? "text-purple-600" : "text-slate-500"}`}
                                >
                                  ${p.price.toFixed(2)}
                                </div>
                                {inCart && (
                                  <span className="absolute top-1.5 right-2 bg-purple-500 text-white rounded-full w-[17px] h-[17px] text-[9px] font-extrabold flex items-center justify-center shadow-sm">
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
                      <span className="font-extrabold text-xl text-purple-600">
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
                          ? "bg-purple-600 text-white cursor-pointer shadow-md hover:bg-purple-700 hover:shadow-lg"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      } mb-0`}
                    >
                      <CheckCircle2 className="w-4 h-4" /> Complete Sale
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-3.5 py-2 rounded-xl transition-colors text-sm min-h-[40px]">
              <FileSpreadsheet className="w-4 h-4" /> Export Excel
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-100 to-fuchsia-100 flex items-center justify-center text-purple-600 font-bold border border-purple-200 text-sm shadow-sm">
              SM
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7 max-w-7xl mx-auto w-full">

          {/* Smart Push Notifications */}
          {smartAlerts.length > 0 && (
            <div className="space-y-3">
              {smartAlerts.map((alert, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl border shadow-sm transition-all hover:shadow-md ${
                    alert.type === "warning"
                      ? "bg-orange-50 border-orange-200"
                      : alert.type === "opportunity"
                      ? "bg-purple-50 border-purple-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    alert.type === "warning" ? "bg-orange-100" : alert.type === "opportunity" ? "bg-purple-100" : "bg-red-100"
                  }`}>
                    {alert.type === "warning" ? <TrendingDown className="w-4 h-4 text-orange-600" /> :
                     alert.type === "opportunity" ? <Zap className="w-4 h-4 text-purple-600" /> :
                     <AlertTriangle className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold text-slate-800">{alert.message}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{alert.time}</p>
                  </div>
                  <button className="text-[12px] font-bold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-white transition-colors">
                    Dismiss
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ══ WELCOME BANNER (Premium Styled) ══════════════════════════════════ */}
          <div className="bg-slate-900 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-lg overflow-hidden relative border border-slate-800">
            {/* Background decoration */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-fuchsia-500 bg-opacity-30 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500 bg-opacity-30 rounded-full blur-[80px] pointer-events-none" />

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
                <div className="text-[13px] text-purple-200 mt-1 flex items-center gap-2 font-medium">
                  <span className="font-khmer">{greetingKh}</span>
                  <span className="w-1 h-1 rounded-full bg-purple-400/50 block" />
                  <Clock className="w-3.5 h-3.5 text-purple-300" />
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
                    stroke="#a855f7" // Purple
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
                <div className="flex items-center gap-1.5 mb-1 text-purple-300">
                  <Target className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.06em]">
                    Daily Goal
                  </span>
                </div>
                <div className="text-[24px] font-extrabold text-white leading-none tracking-tight mb-1">
                  ${GOAL.current.toFixed(2)}
                </div>
                <div className="text-[12px] text-purple-200 mt-0.5 font-medium">
                  of ${GOAL.target.toFixed(2)} target
                </div>
                <div className="mt-2.5 w-[140px] h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-[width] duration-700 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    style={{ width: `${goalPct}%` }}
                  />
                </div>
                <div className="text-[11px] font-khmer text-purple-300 mt-1.5 opacity-80">
                  {GOAL.khmer}
                </div>
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <SummaryCard title="Total Sales" khmerTitle="ការលក់សរុប" value={summaryData.sales} icon={CircleDollarSign} trend="+24%" isPositive={true} />
            <SummaryCard title="Net Profit" khmerTitle="ប្រាក់ចំណេញ" value={summaryData.profit} icon={TrendingUp} trend="+32%" isPositive={true} highlight />
            <SummaryCard title="Profit Margin" khmerTitle="អត្រាចំណេញ" value={summaryData.profitMargin} icon={ArrowUpRight} trend="+5.1%" isPositive={true} />
            <SummaryCard title="Customers" khmerTitle="អតិថិជន" value={summaryData.customers} icon={Users} trend="+18%" isPositive={true} />
          </div>

          {/* Advanced Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Revenue */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[15px] text-slate-900 mb-1">Weekly Revenue</h3>
              <p className="text-[12px] font-khmer text-slate-400 mb-5">ចំណូលប្រចាំសប្តាហ៍</p>
              <div className="h-40 flex items-end gap-1.5">
                {weeklyData.map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-purple-50 rounded-t-lg relative group" style={{ height: "120px" }}>
                      <div className="absolute bottom-0 w-full bg-purple-500 rounded-t-lg transition-all duration-500 group-hover:bg-purple-600" style={{ height: `${height}%` }}></div>
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
                  const maxVal = 900;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[11px] font-bold text-slate-500">${val}</span>
                      <div className="w-full bg-fuchsia-50 rounded-t-lg relative group" style={{ height: "100px" }}>
                        <div className="absolute bottom-0 w-full bg-fuchsia-500 rounded-t-lg transition-all duration-500 group-hover:bg-fuchsia-600" style={{ height: `${(val / maxVal) * 100}%` }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{monthlyLabels[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expenses with Custom Categories */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col col-span-1 lg:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-[15px] text-slate-900">Expenses</h3>
                <div className="flex items-center gap-2">
                  {expLogged && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100 uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" /> Logged!
                    </span>
                  )}
                </div>
              </div>
              <p className="text-[12px] font-khmer text-slate-400 mb-4">ការចំណាយ</p>
              <div className="space-y-3 flex-1">
                {expenseCategories.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-khmer font-medium text-slate-700">{item.label}</span>
                        {(item as any).custom && (
                          <span className="text-[9px] font-bold text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                            CUSTOM
                          </span>
                        )}
                      </div>
                      <span className="text-[13px] font-bold text-slate-500">{item.value}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
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
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-700 border border-purple-200 text-[11px] font-bold rounded-full">
                <Crown className="w-3 h-3 text-purple-500" /> Premium Analytics
              </span>
            </div>
            <div className="p-5 space-y-4">
              {bestSellingProducts.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 text-[12px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="text-[14px] font-semibold text-slate-900">{item.name}</span>
                        <span className="text-[11px] font-khmer text-slate-400 ml-2">{item.khmer}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[14px] font-bold text-purple-600">{item.revenue}</span>
                        <span className="text-[12px] text-slate-400 ml-2">({item.qty} sold)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full transition-all duration-700" style={{ width: `${item.pct}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

           {/* End-of-Day Summary with AI Summary */}
           <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[17px] text-slate-900">End-of-Day AI Summary</h3>
                <p className="text-[12px] font-khmer text-slate-400 mt-0.5">សង្ខេបចុងថ្ងៃរហ័ស</p>
              </div>
              {isDayLocked && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 text-[12px] font-bold border border-purple-100">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Day Locked
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
                <div className="p-4 bg-purple-50 rounded-xl text-center border border-purple-100">
                  <p className="text-[12px] font-semibold text-purple-600 mb-1">Net Profit</p>
                  <p className="text-[12px] font-khmer text-purple-400 mb-2">ប្រាក់ចំណេញ</p>
                  <p className="text-[22px] font-bold text-purple-600">{summaryData.profit}</p>
                </div>
              </div>

              {/* AI Summary Section */}
              <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl p-5 mb-6 border border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h4 className="font-bold text-[14px] text-purple-700">Gemini Insight</h4>
                </div>
                <p className="text-[14px] text-slate-700 leading-relaxed">
                  📊 <strong>Incredible day!</strong> Revenue increased by +24% vs. yesterday. Iced Coffee remains your top seller. Watch your Hot Latte stock though, it's critically low!
                </p>
              </div>

              <div className="flex items-center gap-2 text-[13px] text-slate-400 mb-5">
                <span>Auto-calculated: Sales ({summaryData.sales}) − Expenses ({summaryData.expenses}) = <strong className="text-slate-700">{summaryData.profit}</strong></span>
              </div>

              {!isDayLocked ? (
                <button onClick={() => setIsDayLocked(true)} className="w-full flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[16px] py-4 rounded-xl shadow-sm transition-all min-h-[56px]">
                  <Lock className="w-5 h-5 ml-2" /> <span>Confirm & Lock Day (បញ្ជាក់ និងចាក់សោ)</span>
                </button>
              ) : (
                <div className="w-full flex items-center justify-center gap-2.5 bg-slate-100 text-slate-500 font-bold text-[16px] py-4 rounded-xl min-h-[56px]">
                  <CheckCircle2 className="w-5 h-5 text-purple-500" /> <span>Day Locked — Records Finalized</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* AI Chatbot FAB + Chat Panel */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full shadow-xl shadow-purple-300 flex items-center justify-center text-white hover:scale-110 transition-transform"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Chat Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 border border-white/20 rounded-full flex items-center justify-center shadow-inner">
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="font-bold text-[14px]">Gemini Business Assistant</p>
                <p className="text-[11px] text-purple-200">Online • Dashboard Hub</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 min-h-[280px]">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed relative ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-br-sm shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"
                }`}>
                  {msg.role !== "user" && <Sparkles className="w-3 h-3 text-purple-400 absolute -top-1 -left-1" />}
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask your assistant..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-400"
              />
              <button className="p-2.5 bg-slate-900 text-white rounded-xl hover:opacity-90 transition-opacity shadow-sm">
                <Send className="w-4 h-4" />
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
    Dashboard: "/vendor/premium",
    Sales: "/vendor/premium/sales",
    Expenses: "/vendor/premium/expenses",
    Customers: "/vendor/premium/customer",
    Inventory: "/vendor/premium/inventory",
    Reports: "/vendor/premium/reports",
    Marketing: "/vendor/premium/marketing",
    Settings: "/vendor/settings",
  };
  return (
    <Link href={hrefMap[title] || "#"} className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors min-h-[48px] ${active ? "bg-purple-50 text-purple-600 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"}`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${active ? "text-purple-500" : "text-slate-400"}`} />
        <span className={`text-[15px]`}>{title}</span>
      </div>
      <span className="text-[11px] font-khmer opacity-60">{khmerTitle}</span>
    </Link>
  );
}

function SummaryCard({ title, khmerTitle, value, icon: Icon, trend, isPositive, subtext, highlight = false }: any) {
  return (
    <div className={`p-5 rounded-2xl border ${highlight ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white border-transparent shadow-lg shadow-purple-200" : "bg-white border-slate-200 shadow-sm"}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className={`text-sm font-semibold ${highlight ? "text-white/90" : "text-slate-500"}`}>{title}</h4>
          <p className={`text-[11px] font-khmer mt-0.5 ${highlight ? "text-white/70" : "text-slate-400"}`}>{khmerTitle}</p>
        </div>
        <div className={`p-2 rounded-xl ${highlight ? "bg-white/20" : "bg-purple-50 text-purple-500 border border-purple-100"}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-[28px] font-bold tracking-tight leading-none">{value}</h2>
        {trend && <span className={`text-sm font-semibold mb-0.5 ${highlight ? "text-white" : isPositive ? "text-purple-500" : "text-red-500"}`}>{trend}</span>}
        {subtext && <span className={`text-sm font-medium mb-0.5 ${highlight ? "text-white/80" : "text-slate-400"}`}>{subtext}</span>}
      </div>
    </div>
  );
}
