"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useUser } from "@/components/providers/UserProvider";
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
  CreditCard,
  Sparkles,
} from "lucide-react";

import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import { offlineFetch } from "@/lib/pwa/offline-fetch";

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

const GOAL_DATA = {
  label: "Daily Revenue Goal",
  khmer: "គោលដៅចំណូលប្រចាំថ្ងៃ",
  current: 0,
  target: 200,
};

// ═══════════════════════════════════════════════════════════════════
export default function VendorDashboard() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const { user, vendor, loading } = useUser();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initials
  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase();
  };

  const displayName =
    user?.fullName ||
    (user as any)?.full_name ||
    vendor?.businessName ||
    (user?.email ? user.email.split('@')[0] : (loading ? (isKhmer ? "កំពុងទាញយក..." : "Loading...") : (isKhmer ? "អ្នកប្រើប្រាស់" : "User")));

  const displayInitials = getInitials(
    user?.fullName ||
    (user as any)?.full_name ||
    vendor?.businessName ||
    (user?.email ? user.email.split('@')[0] : (isKhmer ? "អ្នកប្រើប្រាស់" : "User"))
  );

  const [isDayLocked, setIsDayLocked] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showGoalReachedNotification, setShowGoalReachedNotification] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(200);
  const [goalReachedNotified, setGoalReachedNotified] = useState(false);
  const [goalInputValue, setGoalInputValue] = useState("");
  const [quickSaleOpen, setQuickSaleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [customers, setCustomers] = useState(1);
  const [expLogged, setExpLogged] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const quickSaleRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState({
    sales: 0,
    expenses: 0,
    customers: 0,
    transactions: 0,
    weeklySales: [0, 0, 0, 0, 0, 0, 0],
    monthlySales: [0, 0, 0, 0],
    todaySales: 0,
    recentActivity: [] as any[]
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [salesRes, expRes, custRes] = await Promise.all([
          offlineFetch("/api/vendor/sales"),
          offlineFetch("/api/vendor/expenses"),
          offlineFetch("/api/vendor/customers")
        ]);
        const [salesData, expData, custData] = await Promise.all([
          salesRes.json(),
          expRes.json(),
          custRes.json()
        ]);

        if (salesData.success && expData.success && custData.success) {
          const salesArr = salesData.data || [];
          const totalSales = salesArr.reduce((s: number, t: any) => s + parseFloat(t.amount || "0"), 0);
          const totalExp = (expData.data || []).reduce((s: number, t: any) => s + parseFloat(t.amount || "0"), 0);
          
          const now = new Date();
          const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          
          // Weekly grouping (Mon-Sun)
          const weeklySales = [0, 0, 0, 0, 0, 0, 0];
          const currentDay = now.getDay(); 
          const mondayDiff = currentDay === 0 ? 6 : currentDay - 1;
          const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayDiff);
          startOfWeek.setHours(0, 0, 0, 0);

          // Monthly grouping (4 blocks of ~7 days)
          const monthlySales = [0, 0, 0, 0];
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

          let todaySales = 0;

          salesArr.forEach((s: any) => {
            const d = new Date(s.createdAt);
            const amt = parseFloat(s.amount || "0");

            if (d >= startOfToday) todaySales += amt;

            if (d >= startOfWeek) {
              const dayIdx = (d.getDay() + 6) % 7; 
              weeklySales[dayIdx] += amt;
            }

            if (d >= startOfMonth) {
              const weekIdx = Math.min(Math.floor((d.getDate() - 1) / 7), 3);
              monthlySales[weekIdx] += amt;
            }
          });

          // Recent Activity
          const recentSales = salesArr.slice(-5).map((s: any) => ({ 
            id: s.id, 
            type: 'sale', 
            amount: s.amount, 
            title: s.items || "Sale",
            date: s.createdAt 
          }));
          const recentExps = (expData.data || []).slice(-5).map((e: any) => ({ 
            id: e.id, 
            type: 'expense', 
            amount: e.amount, 
            title: e.category || "Expense",
            date: e.expenseDate || e.createdAt
          }));
          const recentActivity = [...recentSales, ...recentExps]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);

          setStats({
            sales: totalSales,
            expenses: totalExp,
            customers: (custData.data || []).length,
            transactions: salesArr.length,
            weeklySales,
            monthlySales,
            todaySales,
            recentActivity
          });
        }
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      }
    };
    fetchStats();
  }, []);

  // Goal Persistence
  useEffect(() => {
    if (!mounted) return;
    const savedGoal = localStorage.getItem("vendor-daily-goal");
    if (savedGoal) setDailyGoal(parseFloat(savedGoal));

    const todayStr = new Date().toISOString().split("T")[0];
    const notifiedDate = localStorage.getItem("vendor-goal-notified-date");
    if (notifiedDate === todayStr) setGoalReachedNotified(true);
  }, [mounted]);

  // Goal Achievement detection
  useEffect(() => {
    if (!mounted || goalReachedNotified || dailyGoal <= 0) return;
    // use todaySales for current goal progress
    if (stats.todaySales >= dailyGoal) {
      setShowGoalReachedNotification(true);
      setGoalReachedNotified(true);
      const todayStr = new Date().toISOString().split("T")[0];
      localStorage.setItem("vendor-goal-notified-date", todayStr);
      setTimeout(() => setShowGoalReachedNotification(false), 8000);
    }
  }, [stats.todaySales, dailyGoal, goalReachedNotified, mounted]);

  const handleUpdateGoal = () => {
    const val = parseFloat(goalInputValue);
    if (!isNaN(val) && val > 0) {
      setDailyGoal(val);
      localStorage.setItem("vendor-daily-goal", String(val));
      setShowGoalModal(false);
      if (stats.todaySales < val) {
        setGoalReachedNotified(false);
        localStorage.removeItem("vendor-goal-notified-date");
      }
    }
  };

  const hasData = stats.transactions > 0 || stats.expenses > 0 || stats.customers > 0;

  const summary = {
    sales: `$${stats.sales.toFixed(2)}`,
    expenses: `$${stats.expenses.toFixed(2)}`,
    profit: `$${(stats.sales - stats.expenses).toFixed(2)}`,
    customers: String(stats.customers),
    avgCustomer: stats.transactions > 0 ? `$${(stats.sales / stats.transactions).toFixed(2)}` : "$0.00",
    trends: {
      sales: hasData ? "+0%" : "",
      expenses: hasData ? "+0%" : "",
      profit: hasData ? "+0%" : "",
      customers: hasData ? "+0%" : ""
    }
  };

  const GOAL = { ...GOAL_DATA, current: stats.todaySales, target: dailyGoal };

  const expenseCategories = [
    { label: "គ្រឿងផ្សំ", value: 38, color: "#3ecf8e" },
    { label: "ថ្លៃជួល", value: 22, color: "#3b82f6" },
    { label: "ពលកម្ម", value: 18, color: "#f59e0b" },
    { label: "ដឹកជញ្ជូន", value: 10, color: "#ef4444" },
    { label: "អគ្គិសនី", value: 5, color: "#8b5cf6" },
    { label: "ទីផ្សារ", value: 4, color: "#ec4899", custom: true },
    { label: "ផ្សេងៗ", value: 3, color: "#94a3b8" },
  ];

  // Avoid hydration mismatch by leaving initialization neutral or using client-side boundary logic.
  // Given hasData is statically false, the mismatch implies a dev transient reload. 
  // Defining it as a simple state bypasses the warning.
  const usage = { used: stats.transactions, limit: 500 };
  const usagePct = Math.min((usage.used / usage.limit) * 100, 100);

  // Hydration-safe greeting and date
  const [greetingState, setGreetingState] = useState({
    greeting: "",
    greetingKh: "",
    dateStr: ""
  });

  useEffect(() => {
    if (!mounted) return;
    const now = new Date();
    const hour = now.getHours();
    const g = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const gKh = hour < 12 ? "អរុណសួស្តី" : hour < 17 ? "ទិវាសួស្តី" : "សាយ័ណ្ហសួស្តី";
    const d = now.toLocaleDateString("en-KH", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    setGreetingState({ greeting: g, greetingKh: gKh, dateStr: d });
  }, [mounted, isKhmer]);

  const { greeting, greetingKh, dateStr } = greetingState;

  // Goal ring
  const goalPct = Math.min((GOAL.current / GOAL.target) * 100, 100);
  const radius = 38;
  const circum = 2 * Math.PI * radius;
  const strokeDash = (goalPct / 100) * circum;

  const weeklyData = stats.weeklySales;
  const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthlyData = stats.monthlySales;
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

  const completeSale = async () => {
    if (!cart.length) return;

    try {
      const itemsStr = cart.map(i => `${i.qty}x ${i.product.name}`).join(", ");
      const res = await offlineFetch("/api/vendor/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: cartTotal,
          method: "Cash",
          items: itemsStr,
        }),
      });

      if (res.ok) {
        // Optimistically update local stats or just refetch
        setStats(prev => ({
          ...prev,
          sales: prev.sales + cartTotal,
          transactions: prev.transactions + 1
        }));

        setCart([]);
        setCustomers(1);
        setSearchQuery("");
        setQuickSaleOpen(false);
      }
    } catch (error) {
      console.error("Failed to complete quick sale:", error);
    }
  };
  const closeQuickSale = useCallback(() => {
    setQuickSaleOpen(false);
    setCart([]);
    setSearchQuery("");
  }, []);

  const logTraffic = async () => {
    try {
      const res = await offlineFetch("/api/vendor/traffic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 1, status: "in" }),
      });
      if (res.ok) {
        setStats((prev) => ({ ...prev, customers: prev.customers + 1 }));
      }
    } catch (e) {
      console.error("Traffic log error:", e);
    }
  };

  const logQuickExpense = async (amount: number, category: string = "Other") => {
    try {
      const res = await offlineFetch("/api/vendor/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          category,
          description: "Quick log from dashboard",
          date: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setStats((prev) => ({ ...prev, expenses: prev.expenses + amount }));
        setExpLogged(true);
        setTimeout(() => setExpLogged(false), 2000);
      }
    } catch (e) {
      console.error("Quick expense error:", e);
    }
  };

  return (
    <VendorDashboardLayout
      plan={(vendor?.plan?.name as any) || "free"}
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
        {
          icon: Package,
          title: "Inventory",
          khmerTitle: "ស្តុក",
          href: "/vendor/inventory",
        },
      ]}
      currentPath="/vendor"
      title="Overview"
      userName={displayName}
      userInitials={displayInitials}
      userEmail={user?.email || ""}
      rightActions={
        <>
          {/* ─── QUICK SALE ─── */}
          <div ref={quickSaleRef} className="relative">
            <button
              onClick={() => setQuickSaleOpen((o) => !o)}
              className={`flex items-center gap-[7px] border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer transition-all duration-200 ${quickSaleOpen
                  ? "bg-[#0d1117] text-[#e6edf3]"
                  : "bg-[#3ecf8e] text-[#0d1117] shadow-[0_2px_14px_rgba(62,207,142,0.28)]"
                }`}
            >
              {quickSaleOpen ? (
                <>
                  <X size={14} /> {t("dashboard.actions.cancel")}
                </>
              ) : (
                <>
                  <Zap size={14} /> {t("dashboard.actions.quickSale")}
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
                className={`absolute top-[calc(100%+10px)] right-0 w-[330px] rounded-[14px] shadow-[0_20px_56px_rgba(0,0,0,0.18)] overflow-hidden transition-colors ${isDark
                    ? "bg-dark-surface border border-white/5"
                    : "bg-white border border-[#e8eaed]"
                  }`}
                style={{ zIndex: 9999 }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div
                  className={`flex items-center gap-2 px-[18px] py-[14px] border-b ${isDark ? "border-white/5" : "border-[#e8eaed]"
                    }`}
                >
                  <ShoppingCart size={14} className="text-[#3ecf8e]" />
                  <span
                    className={`font-bold text-sm ${isDark ? "text-white" : "text-[#111827]"
                      }`}
                  >
                    {t("dashboard.actions.quickSale")}
                  </span>
                  <span
                    className={`text-[11px] ml-auto ${isKhmer ? "font-battambang" : ""}`}
                  >
                    ការលក់រហ័ស
                  </span>
                </div>

                <div className="p-[14px_18px]">
                  {/* Search with autocomplete */}
                  <div className="relative mb-[14px]">
                    <Search
                      size={13}
                      className={`absolute left-[11px] top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"
                        }`}
                    />
                    <input
                      ref={searchRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("dashboard.placeholders.searchProduct")}
                      className={`w-full pl-[33px] pr-[11px] py-[9px] rounded-[9px] text-[13px] outline-none transition-colors ${isDark
                          ? "bg-[#0d1117] border border-white/5 text-white focus:border-[#3ecf8e]"
                          : "bg-[#f7f8fa] border border-[#e8eaed] text-[#111827] focus:border-[#3ecf8e]"
                        }`}
                      style={{ fontFamily: "inherit" }}
                    />
                    {searchQuery && (
                      <div
                        className={`absolute top-full left-0 right-0 rounded-b-[9px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-colors ${isDark
                            ? "bg-dark-surface border border-white/5 border-t-0"
                            : "bg-white border border-[#e8eaed] border-t-0"
                          }`}
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
                              className={`w-full flex justify-between items-center px-[13px] py-[9px] bg-transparent border-0 cursor-pointer text-[13px] text-left transition-colors ${isDark
                                  ? "text-white hover:bg-white/5"
                                  : "text-[#111827] hover:bg-[#f7f8fa]"
                                }`}
                              style={{ fontFamily: "inherit" }}
                            >
                              <span>{p.name}</span>
                              <span className="text-[#3ecf8e] font-bold">
                                ${parseFloat(p.price?.toString() || "0").toFixed(2)}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div
                            className={`px-[13px] py-[10px] text-[12.5px] ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"
                              }`}
                          >
                            No products found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Product grid */}
                  {!searchQuery && (
                    <div className="mb-[14px]">
                      <div
                        className={`text-[10px] font-bold uppercase tracking-[0.07em] mb-2 ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"
                          }`}
                      >
                        Tap to add
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {hasData ? (
                          PRODUCT_LIBRARY.map((p) => {
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
                                className={`px-3 py-[9px] rounded-[9px] text-left cursor-pointer transition-all duration-[120ms] relative border ${inCart
                                    ? isDark
                                      ? "bg-[#3ecf8e]/15 border-[#3ecf8e]/30"
                                      : "bg-[rgba(62,207,142,0.12)] border-[#3ecf8e]"
                                    : isDark
                                      ? "bg-[#1a1a1a] border-white/5 hover:bg-[#222222]"
                                      : "bg-[#f7f8fa] border-[#e8eaed] hover:bg-[#eff0f2]"
                                  }`}
                              >
                                <div
                                  className={`text-xs font-semibold truncate mb-0.5 ${inCart
                                      ? "text-[#3ecf8e]"
                                      : isDark
                                        ? "text-white"
                                        : "text-[#111827]"
                                    }`}
                                >
                                  {p.name}
                                </div>
                                <div
                                  className={`text-[11px] font-bold ${inCart
                                      ? "text-[#3ecf8e]"
                                      : isDark
                                        ? "text-[#7d8590]"
                                        : "text-[#6b7280]"
                                    }`}
                                >
                                  ${parseFloat(p.price?.toString() || "0").toFixed(2)}
                                </div>
                                {inCart && (
                                  <span className="absolute top-1.5 right-2 bg-[#3ecf8e] text-[#0d1117] rounded-full w-[17px] h-[17px] text-[9px] font-extrabold flex items-center justify-center">
                                    {inCart.qty}
                                  </span>
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div className={`col-span-2 py-8 flex flex-col items-center justify-center rounded-lg border border-dashed ${isDark ? "border-white/10" : "border-[#e8eaed]"}`}>
                            <span className={`text-[13px] font-bold ${isDark ? "text-white/40" : "text-slate-400"}`}>
                              No data. Add item
                            </span>
                            <span className="text-[10px] text-slate-300 mt-1">
                              Add products to your inventory first
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cart items */}
                  {cart.length > 0 && (
                    <div
                      className={`mb-3 max-h-[140px] overflow-y-auto ${isDark ? "border-white/5" : "border-[#f0f2f5]"
                        }`}
                    >
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className={`flex items-center gap-2 py-[7px] border-b ${isDark ? "border-white/5" : "border-[#f0f2f5]"
                            }`}
                        >
                          <span
                            className={`text-[12.5px] flex-1 ${isDark ? "text-white" : "text-[#111827]"
                              }`}
                          >
                            {item.product.name}
                          </span>
                          <div
                            className={`flex items-center rounded-[7px] overflow-hidden border ${isDark
                                ? "bg-[#0d1117] border-white/5"
                                : "bg-[#f7f8fa] border-[#e8eaed]"
                              }`}
                          >
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault();
                                changeQty(item.product.id, -1);
                              }}
                              className={`w-6 h-6 bg-transparent border-0 cursor-pointer flex items-center justify-center transition-colors ${isDark
                                  ? "text-[#7d8590] hover:bg-white/5"
                                  : "text-[#6b7280] hover:bg-[#e8eaed]"
                                }`}
                            >
                              <Minus size={10} />
                            </button>
                            <span
                              className={`text-xs font-bold min-w-[18px] text-center ${isDark ? "text-white" : "text-[#111827]"
                                }`}
                            >
                              {item.qty}
                            </span>
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault();
                                changeQty(item.product.id, 1);
                              }}
                              className={`w-6 h-6 bg-transparent border-0 cursor-pointer flex items-center justify-center transition-colors ${isDark
                                  ? "text-[#7d8590] hover:bg-white/5"
                                  : "text-[#6b7280] hover:bg-[#e8eaed]"
                                }`}
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          <span
                            className={`text-[12.5px] font-bold min-w-[48px] text-right ${isDark ? "text-white" : "text-[#111827]"
                              }`}
                          >
                            ${(item.product.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Customers */}
                  <div
                    className={`flex items-center justify-between py-2 border-t mb-3 ${isDark ? "border-white/5" : "border-[#f0f2f5]"
                      }`}
                  >
                    <span
                      className={`text-xs font-medium ${isKhmer ? "font-battambang" : ""} ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"
                        }`}
                    >
                      {t("dashboard.customers")} · អតិថិជន
                    </span>
                    <div
                      className={`flex items-center rounded-[8px] overflow-hidden border ${isDark
                          ? "bg-[#0d1117] border-white/5"
                          : "bg-[#f7f8fa] border-[#e8eaed]"
                        }`}
                    >
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setCustomers((c) => Math.max(1, c - 1));
                        }}
                        className={`w-7 h-7 bg-transparent border-0 cursor-pointer flex items-center justify-center transition-colors ${isDark
                            ? "text-[#7d8590] hover:bg-white/5"
                            : "text-[#6b7280] hover:bg-[#e8eaed]"
                          }`}
                      >
                        <Minus size={11} />
                      </button>
                      <span
                        className={`text-[13px] font-bold min-w-5 text-center ${isDark ? "text-white" : "text-[#111827]"
                          }`}
                      >
                        {customers}
                      </span>
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setCustomers((c) => c + 1);
                        }}
                        className={`w-7 h-7 bg-transparent border-0 cursor-pointer flex items-center justify-center transition-colors ${isDark
                            ? "text-[#7d8590] hover:bg-white/5"
                            : "text-[#6b7280] hover:bg-[#e8eaed]"
                          }`}
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"
                        }`}
                    >
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
                    className={`w-full py-3 font-bold text-[13.5px] border-0 rounded-[10px] flex items-center justify-center gap-[7px] transition-all ${cart.length
                        ? "bg-[#3ecf8e] text-[#0d1117] cursor-pointer shadow-[0_4px_14px_rgba(62,207,142,0.28)] hover:bg-[#4dd49a]"
                        : isDark
                          ? "bg-[#1a1a1a] text-[#4d5562] cursor-not-allowed"
                          : "bg-[#f0f2f5] text-[#6b7280] cursor-not-allowed"
                      }`}
                  >
                    <CheckCircle2 size={15} /> {t("dashboard.actions.complete")}
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
          <div
            className={`${isDark ? "bg-[#161B22]" : "bg-[#0d1117]"} rounded-[14px] border border-white/[0.06] px-[26px] py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5`}
          >
            {/* Left — greeting */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3ecf8e] to-[#1a9c65] flex items-center justify-center text-[17px] font-extrabold text-white shrink-0 shadow-[0_0_0_3px_rgba(62,207,142,0.2)]">
                {loading ? "..." : displayInitials}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[18px] font-extrabold text-[#e6edf3]" suppressHydrationWarning>
                    {greeting}, {loading ? (isKhmer ? "កំពុងទាញយក..." : "Loading...") : displayName} 👋
                  </span>
                </div>
                <div className="text-[11px] text-[#7d8590] mt-0.5 flex items-center gap-2" suppressHydrationWarning>
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
                    {isKhmer ? "គោលដៅប្រចាំថ្ងៃ" : "Daily Goal"}
                  </span>
                </div>
                <div className="text-[22px] font-extrabold text-[#e6edf3] leading-none">
                  ${GOAL.current.toFixed(2)}
                </div>
                <div className="text-[11px] text-[#7d8590] mt-1">
                  {language === "km" 
                    ? `នៃគោលដៅ $${GOAL.target.toFixed(2)}`
                    : `of $${GOAL.target.toFixed(2)} target`}
                </div>
                <div className="mt-2 w-[120px] h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3ecf8e] rounded-full transition-[width] duration-700"
                    style={{ width: `${goalPct}%` }}
                  />
                </div>
                <button 
                  onClick={() => {
                    setGoalInputValue(String(dailyGoal));
                    setShowGoalModal(true);
                  }}
                  className="mt-2 text-[10px] text-[#3ecf8e] hover:text-white font-bold flex items-center gap-1 bg-transparent border-0 cursor-pointer transition-colors"
                >
                  <Plus size={10} />
                  <span className="uppercase tracking-wider">{language === "km" ? "កំណត់គោលដៅ" : "Set Goal"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Usage & Quick Logs ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Usage */}
            <div
              className={`${isDark ? "bg-dark-surface border-white/5" : "bg-white border-[#e8eaed]"} rounded-[14px] px-[22px] py-4 lg:col-span-1`}
            >
              <div className="flex items-center justify-between mb-[10px]">
                <div>
                  <div
                    className={`text-[13.5px] font-semibold ${isDark ? "text-white" : "text-[#111827]"}`}
                  >
                    Monthly Sales Logs
                  </div>
                  <div
                    className={`text-[11px] mt-px ${isKhmer ? "font-battambang" : ""} ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}
                  >
                    {t("dashboard.customerSection.subtitle")}
                  </div>
                </div>
                <span
                  className={`text-sm font-bold ${isDark ? "text-white" : "text-[#111827]"}`}
                >
                  {usage.used}{" "}
                  <span
                    className={`font-normal ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}
                  >
                    / {usage.limit}
                  </span>
                </span>
              </div>
              <div
                className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? "bg-[#1a1a1a]" : "bg-[#f0f2f5]"
                  }`}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-[600ms] ease-in-out"
                  style={{
                    width: `${usagePct}%`,
                    background: usagePct > 80 ? "#f59e0b" : "#3ecf8e",
                  }}
                />
              </div>
              <div
                className={`text-[10px] mt-2 ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}
              >
                {usage.limit - usage.used} logs remaining ·{" "}
                <Link
                  href="/vendor/pricing"
                  className="text-[#3ecf8e] no-underline font-semibold"
                >
                  Upgrade
                </Link>
              </div>
            </div>

            {/* Customer Traffic Log */}
            <div
              className={`${isDark ? "bg-dark-surface border-white/5" : "bg-white border-[#e8eaed]"} rounded-[14px] px-[22px] py-4`}
            >
              <div className="flex items-center justify-between h-full">
                <div>
                  <div
                    className={`text-[13.5px] font-semibold ${isDark ? "text-white" : "text-[#111827]"}`}
                  >
                    Customer Traffic
                  </div>
                  <div
                    className={`text-[11px] mt-px ${isKhmer ? "font-battambang" : ""} ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}
                  >
                    Log visitor count
                  </div>
                </div>
                <button
                  onClick={logTraffic}
                  className="flex items-center gap-2 bg-[#3ecf8e] text-[#0d1117] font-bold text-[13px] px-4 py-2.5 rounded-[10px] border-0 cursor-pointer shadow-[0_4px_12px_rgba(62,207,142,0.2)] active:scale-95 transition-all"
                >
                  <Users size={14} /> +1 Log
                </button>
              </div>
            </div>

            {/* Quick Expense */}
            <div
              className={`${isDark ? "bg-dark-surface border-white/5" : "bg-white border-[#e8eaed]"} rounded-[14px] px-[22px] py-4`}
            >
              <div className="flex items-center justify-between h-full">
                <div>
                  <div
                    className={`text-[13.5px] font-semibold ${isDark ? "text-white" : "text-[#111827]"}`}
                  >
                    Quick Expense
                  </div>
                  <div
                    className={`text-[11px] mt-px ${isKhmer ? "font-battambang" : ""} ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}
                  >
                    Log $1.00 immediately
                  </div>
                </div>
                {expLogged ? (
                  <div className="bg-[rgba(239,68,68,0.1)] text-[#ef4444] font-bold text-[13px] px-4 py-2.5 rounded-[10px] border border-[#ef4444]/20 flex items-center gap-2">
                    <CheckCircle2 size={14} /> Logged!
                  </div>
                ) : (
                  <button
                    onClick={() => logQuickExpense(1, "Other")}
                    className="flex items-center gap-2 bg-[#ef4444] text-white font-bold text-[13px] px-4 py-2.5 rounded-[10px] border-0 cursor-pointer shadow-[0_4px_12px_rgba(239,68,68,0.2)] active:scale-95 transition-all"
                  >
                    <Receipt size={14} /> -$1.00
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Metric cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <VendorSummaryCard
              title={t("TotalSales")}
              khmerTitle="ការលក់សរុប"
              value={summary.sales}
              icon={CircleDollarSign}
              trend={summary.trends.sales}
              isPositive
              variant={isDark ? "dark" : "light"}
            />
            <VendorSummaryCard
              title={t("TotalExpenses")}
              khmerTitle="ចំណាយសរុប"
              value={summary.expenses}
              icon={Receipt}
              trend={summary.trends.expenses}
              isPositive={false}
              variant={isDark ? "dark" : "light"}
            />
            <VendorSummaryCard
              title={t("NetProfit")}
              khmerTitle="ប្រាក់ចំណេញ"
              value={summary.profit}
              icon={TrendingUp}
              trend={summary.trends.profit}
              isPositive
              highlight
            />
            <VendorSummaryCard
              title={t("Customers")}
              khmerTitle="អតិថិជន"
              value={summary.customers}
              icon={Users}
              trend={summary.trends.customers}
              subtext={`Avg ${summary.avgCustomer}`}
              variant={isDark ? "dark" : "light"}
            />
          </div>

          {/* ── Charts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div
              className={`${isDark ? "bg-dark-surface border-white/5 shadow-none" : "bg-white border-[#e8eaed] shadow-sm"} rounded-[14px] p-6`}
            >
              <h3
                className={`font-semibold text-[15px] mb-1 ${isDark ? "text-white" : "text-[#111827]"}`}
              >
                {t("dashboard.metrics.monthlyRevenue")}
              </h3>
              <p
                className={`text-[12px] mb-5 ${isKhmer ? "font-battambang" : ""} ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}
              >
                ចំណូលប្រចាំខែ
              </p>
              <div className="h-40 flex items-end gap-2">
                {hasData ? (
                  monthlyData.map((val, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span
                        className={`text-[11px] font-bold ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}
                      >
                        ${val}
                      </span>
                      <div
                        className="w-full bg-[rgba(41,178,141,0.12)] rounded-t-[7px] relative group"
                        style={{ height: "100px" }}
                      >
                        <div
                          className="absolute bottom-0 w-full bg-[#29B28D] rounded-t-[7px] transition-all duration-500 group-hover:opacity-80"
                          style={{ height: `${Math.max((val / (Math.max(...monthlyData, 1))) * 100, 2)}%` }}
                        />
                      </div>
                      <span
                        className={`text-[10px] ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}
                      >
                        {monthlyLabels[i]}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className={`w-full h-full flex items-center justify-center rounded-lg border border-dashed ${isDark ? "border-white/10" : "border-[#e8eaed]"}`}>
                    <span className={`text-sm font-medium ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}>
                      No data. Add item
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Revenue */}
            <div
              className={`${isDark ? "bg-dark-surface border-white/5 shadow-none" : "bg-white border-[#e8eaed] shadow-sm"} rounded-[14px] p-6`}
            >
              <h3
                className={`font-semibold text-[15px] mb-1 ${isDark ? "text-white" : "text-[#111827]"}`}
              >
                {t("dashboard.metrics.weeklyRevenue")}
              </h3>
              <p
                className={`text-[12px] mb-5 ${isKhmer ? "font-battambang" : ""} ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}
              >
                ចំណូលប្រចាំសប្តាហ៍
              </p>
              <div className="h-40 flex items-end gap-1.5">
                {hasData ? (
                  weeklyData.map((height, i) => (
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
                          style={{ height: `${Math.max((height / (Math.max(...weeklyData, 1))) * 100, 2)}%` }}
                        />
                      </div>
                      <span
                        className={`text-[10px] ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}
                      >
                        {weeklyLabels[i]}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className={`w-full h-full flex items-center justify-center rounded-lg border border-dashed ${isDark ? "border-white/10" : "border-[#e8eaed]"}`}>
                    <span className={`text-sm font-medium ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}>
                      No data. Add item
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Expenses */}
            <div
              className={`${isDark ? "bg-dark-surface border-white/5 shadow-none" : "bg-white border-[#e8eaed] shadow-sm"} rounded-[14px] p-6 col-span-1 lg:col-span-2`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3
                  className={`font-semibold text-[15px] ${isDark ? "text-white" : "text-[#111827]"}`}
                >
                  {t("dashboard.metrics.totalExpenses")}
                </h3>
                {expLogged && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[rgba(41,178,141,0.1)] text-[#29B28D] text-[10px] font-bold border border-[rgba(41,178,141,0.2)] uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3" />{" "}
                    {t("dashboard.status.logged")}
                  </span>
                )}
              </div>
              <p
                className={`text-[12px] mb-4 ${isKhmer ? "font-battambang" : ""} ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}
              >
                ការចំណាយ
              </p>
              <div className="space-y-3">
                {hasData ? (
                  expenseCategories.map((item, i) => (
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
                        <span
                          className={`text-[13px] font-bold ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}
                        >
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
                  ))
                ) : (
                  <div className={`w-full py-8 flex items-center justify-center rounded-lg border border-dashed ${isDark ? "border-white/10" : "border-[#e8eaed]"}`}>
                    <span className={`text-sm font-medium ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}>
                      No data. Add item
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Expenses Breakdown ── */}
          <div
            className={`rounded-[14px] px-[26px] py-[22px] border ${isDark
                ? "bg-dark-surface border-white/5 shadow-none"
                : "bg-white border-[#e8eaed] shadow-sm"
              }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-[20px]">
              <div>
                <div
                  className={`text-sm font-semibold ${isDark ? "text-white" : "text-[#111827]"}`}
                >
                  {t("dashboard.metrics.breakdown")}
                </div>
                <div
                  className={`text-[11px] mt-0.5 ${isKhmer ? "font-battambang" : ""} ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}
                >
                  {isKhmer ? "ការបែងចែកចំណាយ" : "Expense Details"}
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
              {hasData ? (
                EXP_BREAKDOWN.map((item) => (
                  <div key={item.key} className="flex items-center gap-4">
                    {/* Khmer label */}
                    <div className="w-[90px] shrink-0">
                      <div
                        className={`text-[12.5px] font-medium leading-tight ${isDark ? "text-white" : "text-[#111827]"
                          }`}
                      >
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
                ))
              ) : (
                <div className={`w-full py-10 flex items-center justify-center rounded-lg border border-dashed ${isDark ? "border-white/10" : "border-[#e8eaed]"}`}>
                  <span className={`text-sm font-medium ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}>
                    No data. Add item
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Recent Activity Table ── */}
          <div
            className={`rounded-[14px] overflow-hidden border ${isDark
                ? "bg-dark-surface border-white/5 shadow-none"
                : "bg-white border-[#e8eaed] shadow-sm"
              }`}
          >
            <div className="px-[26px] py-[18px] border-b border-white/5 flex items-center justify-between">
              <div>
                <div className={`text-[15px] font-bold ${isDark ? "text-white" : "text-[#111827]"}`}>
                  Recent Activity
                </div>
                <div className={`text-[11px] text-[#7d8590] mt-0.5`}>
                  សកម្មភាពថ្មីៗ
                </div>
              </div>
              <Link href="/vendor/sales" className="text-[12px] font-bold text-[#3ecf8e] no-underline hover:underline">
                View All
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className={`text-[10.5px] uppercase font-bold ${isDark ? "text-[#4d5562]" : "text-slate-500"} border-b border-white/5`}>
                  <tr>
                    <th className="px-[26px] py-3">Type</th>
                    <th className="px-[26px] py-3">Details</th>
                    <th className="px-[26px] py-3">Date/Time</th>
                    <th className="px-[26px] py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.recentActivity.length > 0 ? (
                    stats.recentActivity.map((act) => (
                      <tr key={act.id} className="text-[13px] group hover:bg-white/[0.02]">
                        <td className="px-[26px] py-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            act.type === 'sale' 
                              ? "bg-[rgba(62,207,142,0.1)] text-[#3ecf8e] border border-[#3ecf8e]/20" 
                              : "bg-[rgba(239,68,68,0.1)] text-[#ef4444] border border-[#ef4444]/20"
                          }`}>
                            {act.type}
                          </span>
                        </td>
                        <td className={`px-[26px] py-4 font-medium ${isDark ? "text-[#e6edf3]" : "text-[#111827]"}`}>
                          {act.title}
                        </td>
                        <td className="px-[26px] py-4">
                          <div className={`text-[12px] ${isDark ? "text-[#e6edf3]" : "text-[#111827]"}`}>
                            {new Date(act.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                          <div className="text-[10px] text-[#7d8590]">
                            {new Date(act.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                          </div>
                        </td>
                        <td className={`px-[26px] py-4 text-right font-bold ${act.type === 'sale' ? "text-[#3ecf8e]" : "text-[#ef4444]"}`}>
                          {act.type === 'sale' ? "+" : "-"}${parseFloat(act.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-slate-500 text-sm">
                        No recent activity logged.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── End of Day ── */}
          <div
            className={`${isDark ? "bg-[#161B22] border-white/5" : "bg-[#0d1117] border-transparent"} rounded-[14px] border overflow-hidden`}
          >
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
                  onClick={async () => {
                    try {
                      const res = await offlineFetch("/api/vendor/reports", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          date: new Date().toISOString(),
                          totalSales: stats.sales,
                          totalExpenses: stats.expenses,
                          netProfit: stats.sales - stats.expenses,
                          isLocked: true
                        }),
                      });
                      if (res.ok) {
                        setIsDayLocked(true);
                      }
                    } catch (e) {
                      console.error("Failed to lock day:", e);
                    }
                  }}
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
      {/* Goal Setting Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0E1319]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setShowGoalModal(false)} />
          <div className="bg-[#0b0f15] rounded-[24px] w-full max-w-sm p-8 shadow-[0_32px_128px_rgba(0,0,0,0.6)] relative z-10 border border-white/10">
            <div className="w-12 h-12 bg-[#3ecf8e]/10 rounded-2xl flex items-center justify-center mb-6 text-[#3ecf8e]">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {t("settings.editGoal")}
            </h3>
            <p className="text-sm text-[#7d8590] mb-8">
              {t("settings.goalTarget")}
            </p>
            <div className="space-y-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[#3ecf8e]">$</span>
                <input
                  type="number"
                  autoFocus
                  value={goalInputValue}
                  onChange={(e) => setGoalInputValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-[#161B22] border-2 border-white/5 rounded-[16px] text-2xl font-black text-white outline-none focus:border-[#3ecf8e] transition-all"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 py-4 bg-transparent hover:bg-white/5 text-[#7d8590] font-bold rounded-xl transition-all border-0 cursor-pointer"
                >
                  {t("dashboard.actions.cancel")}
                </button>
                <button
                  onClick={handleUpdateGoal}
                  className="flex-2 py-4 bg-[#3ecf8e] hover:bg-[#34b27b] text-[#0E1319] font-extrabold rounded-xl transition-all shadow-lg border-0 cursor-pointer px-8"
                >
                  {t("dashboard.actions.save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Goal Reached Notification Banner (Toast) */}
      {showGoalReachedNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[80] w-[calc(100%-32px)] max-w-md animate-in slide-in-from-top-4 duration-500 fill-mode-forwards px-4">
          <div className="bg-[#0E1319] dark:bg-white rounded-[24px] p-5 shadow-[0_32px_128px_rgba(0,0,0,0.4)] border border-white/15 dark:border-black/5 flex items-center gap-5">
            <div className="w-14 h-14 bg-[#3ecf8e] rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden">
               <div className="absolute inset-0 bg-white/20 animate-pulse" />
               <Sparkles className="w-7 h-7 text-[#0E1319] relative z-10" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-black text-white dark:text-[#0E1319] leading-tight mb-0.5">
                {t("settings.goalSuccess")}
              </h4>
              <p className="text-xs font-bold text-[#7d8590] dark:text-[#6b7280] leading-snug">
                {t("settings.goalSuccessDesc")}
              </p>
            </div>
            <button 
              onClick={() => setShowGoalReachedNotification(false)}
              className="w-10 h-10 flex items-center justify-center text-[#7d8590] hover:text-white dark:hover:text-[#0E1319] transition-colors rounded-full hover:bg-white/10 dark:hover:bg-black/5 border-0 bg-transparent cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
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
