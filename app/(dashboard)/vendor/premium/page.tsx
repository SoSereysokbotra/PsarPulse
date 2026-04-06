"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  CheckCircle2,
  ArrowUpRight,
  FileSpreadsheet,
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
import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { useUser } from "@/components/providers/UserProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { PremiumAnalytics } from "@/lib/analytics/premium.analytics";
import { offlineFetch } from "@/lib/pwa/offline-fetch";

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

const GOAL_DATA = {
  label: "Daily Revenue Goal",
  khmer: "គោលដៅចំណូលប្រចាំថ្ងៃ",
  current: 0,
  target: 1000, // Premium: 2× the Pro goal target
};

const PREMIUM_NAV = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    khmerTitle: "ផ្ទាំងគ្រប់គ្រង",
    href: "/vendor/premium",
    active: true,
  },
  {
    icon: CircleDollarSign,
    title: "Sales",
    khmerTitle: "ការលក់",
    href: "/vendor/premium/sales",
  },
  {
    icon: Receipt,
    title: "Expenses",
    khmerTitle: "ចំណាយ",
    href: "/vendor/premium/expenses",
  },
  {
    icon: Users,
    title: "Customers",
    khmerTitle: "អតិថិជន",
    href: "/vendor/premium/customer",
  },
  {
    icon: Package,
    title: "Inventory",
    khmerTitle: "ស្តុក",
    href: "/vendor/premium/inventory",
  },
  {
    icon: FileBarChart,
    title: "Reports",
    khmerTitle: "របាយការណ៍",
    href: "/vendor/premium/reports",
  },
];

export default function PremiumDashboard() {
  const { language } = useLanguage();
  const { user, vendor, loading } = useUser();
  const isKhmer = language === "km";
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Premium: records auto-save continuously — no manual day-lock needed
  const [isChatSending, setIsChatSending] = useState(false);
  const [dashChatMessages, setDashChatMessages] = useState<{role:string,text:string}[]>([
    { role: "assistant", text: isKhmer ? "សួស្តី! ខ្ញុំជាជំនួយការអាជីវកម្ម Gemini របស់អ្នក។ តើខ្ញុំអាចជួយបង្កើនប្រសិទ្ធភាពអាជីវកម្មរបស់អ្នកនៅថ្ងៃនេះដោយរបៀបណា?" : "Hello! I'm your Gemini Business Assistant. How can I help optimize your business today?" },
    { role: "assistant", text: isKhmer ? "ខ្ញុំអាចវិភាគនិន្នាការលក់ កម្រិតស្តុក និងជួយព្យាករណ៍ចំណូល។ គ្រាន់តែសួរមក!" : "I can analyze your sales trends, inventory levels, and help forecast revenue. Just ask!" },
  ]);
  const [dashChatInput, setDashChatInput] = useState("");
  const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [salesRaw, setSalesRaw] = useState<any[]>([]);
  const [expensesRaw, setExpensesRaw] = useState<any[]>([]);

  const [stats, setStats] = useState({
    sales: 0,
    expenses: 0,
    customers: 0,
    transactions: 0
  });

  const [dailyGoalValue, setDailyGoalValue] = useState(1000);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalInput, setNewGoalInput] = useState("1000");
  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [aiSavings, setAiSavings] = useState<{ potentialSavings: number; period: string }>({
    potentialSavings: 0,
    period: "Weekly",
  });
  const [isCompletingSale, setIsCompletingSale] = useState(false);

  const fetchGoal = useCallback(async () => {
    try {
      const res = await offlineFetch("/api/vendor/goal");
      const json = await res.json();
      if (json.success && json.data) {
        setDailyGoalValue(parseFloat(json.data.targetAmount));
        setNewGoalInput(json.data.targetAmount);
      }
    } catch (err) {
      console.error("Dashboard fetch goal error:", err);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      const [salesRes, expRes, custRes, invRes] = await Promise.all([
        offlineFetch("/api/vendor/sales"),
        offlineFetch("/api/vendor/expenses"),
        offlineFetch("/api/vendor/customers"),
        offlineFetch("/api/vendor/inventory")
      ]);

      if (salesRes.status === 401 || expRes.status === 401) {
        window.location.href = "/login?redirect=/vendor/premium";
        return;
      }

      const [salesData, expData, custData, invData] = await Promise.all([
        salesRes.json(),
        expRes.json(),
        custRes.json(),
        invRes.json()
      ]);

      if (salesData.success) {
        const raw: any[] = salesData.data;
        setSalesRaw(raw);
        const totalSales = raw.reduce((s: number, t: any) => s + parseFloat(t.amount || "0"), 0);
        setStats(prev => ({ ...prev, sales: totalSales, transactions: raw.length }));
      }
      if (expData.success) {
        const raw: any[] = expData.data;
        setExpensesRaw(raw);
        const totalExp = raw.reduce((s: number, t: any) => s + parseFloat(t.amount || "0"), 0);
        setStats(prev => ({ ...prev, expenses: totalExp }));
      }
      if (custData.success) {
        setStats(prev => ({ ...prev, customers: custData.data.length }));
      }
      if (invData.success) {
        setInventoryItems(invData.data);
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    }
  }, []);

  const fetchAiSavings = useCallback(async () => {
    try {
      const res = await offlineFetch("/api/vendor/ai/savings");
      const json = await res.json();
      if (json.success) {
        setAiSavings(json.data);
      }
    } catch (err) {
      console.error("Dashboard fetch AI savings error:", err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAllData();
    fetchGoal();
    fetchAiSavings();
  }, [fetchAllData, fetchGoal, fetchAiSavings]);

  // Re-fetch whenever the tab becomes visible again
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") fetchAllData(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [fetchAllData]);

  const hasData = stats.transactions > 0 || stats.expenses > 0 || stats.customers > 0;

  // Initials logic
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
  const [quickSaleOpen, setQuickSaleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [customers, setCustomers] = useState(1);
  const [expLogged, setExpLogged] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const searchRef = React.useRef<HTMLInputElement>(null);
  const quickSaleRef = React.useRef<HTMLDivElement>(null);

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

  // Goal ring logic
  const GOAL = hasData ? { ...GOAL_DATA, current: stats.sales, target: dailyGoalValue } : { ...GOAL_DATA, current: 0, target: dailyGoalValue };
  const goalPct = Math.min((GOAL.current / GOAL.target) * 100, 100);
  const radius = 38;
  const circum = 2 * Math.PI * radius;
  const strokeDash = (goalPct / 100) * circum;

  const handleUpdateGoal = async () => {
    if (!newGoalInput || isUpdatingGoal) return;
    setIsUpdatingGoal(true);
    try {
      const res = await offlineFetch("/api/vendor/goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetAmount: parseFloat(newGoalInput) }),
      });
      if (res.ok) {
        const json = await res.json();
        setDailyGoalValue(parseFloat(json.data.targetAmount));
        setShowGoalModal(false);
      } else {
        console.error("Failed to update goal:", await res.text());
      }
    } catch (err) {
      console.error("Failed to update goal:", err);
    } finally {
      setIsUpdatingGoal(false);
    }
  };

  useEffect(() => {
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

  const filteredProducts = inventoryItems.filter((p) =>
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

  const cartTotal = cart.reduce((sum, i) => sum + Number(i.product.price) * i.qty, 0);
  const cartItems = cart.reduce((sum, i) => sum + i.qty, 0);

  const completeSale = async () => {
    if (!cart.length || isCompletingSale) return;
    setIsCompletingSale(true);
    try {
      const itemsStr = cart.map(i => `${i.qty}x ${i.product.name}`).join(", ");
      const res = await offlineFetch("/api/vendor/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cartTotal, method: "Cash", items: itemsStr }),
      });
      if (res.ok) {
        const json = await res.json();
        // Optimistically update raw sales so all charts refresh immediately
        setSalesRaw(prev => [json.data, ...prev]);
        setStats(prev => ({ ...prev, sales: prev.sales + cartTotal, transactions: prev.transactions + 1 }));
        setCart([]);
        setCustomers(1);
        setSearchQuery("");
        setQuickSaleOpen(false);
      }
    } catch (error) {
      console.error("Failed to complete quick sale:", error);
    } finally {
      setIsCompletingSale(false);
    }
  };

  // ── Summary card data ──
  const summaryData = React.useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const currentWeekSales = salesRaw.filter((s) => new Date(s.createdAt) >= weekAgo);
    const prevWeekSales = salesRaw.filter(
      (s) => new Date(s.createdAt) >= twoWeeksAgo && new Date(s.createdAt) < weekAgo
    );

    const currentRev = currentWeekSales.reduce((s, t) => s + parseFloat(t.amount || "0"), 0);
    const prevRev = prevWeekSales.reduce((s, t) => s + parseFloat(t.amount || "0"), 0);

    const currentExp = expensesRaw.filter((e) => new Date(e.expenseDate || e.createdAt) >= weekAgo)
      .reduce((s, t) => s + parseFloat(t.amount || "0"), 0);
    const prevExp = expensesRaw.filter((e) => new Date(e.expenseDate || e.createdAt) >= twoWeeksAgo && new Date(e.expenseDate || e.createdAt) < weekAgo)
      .reduce((s, t) => s + parseFloat(t.amount || "0"), 0);

    const currentProfit = currentRev - currentExp;
    const prevProfit = prevRev - prevExp;

    const salesTrend = PremiumAnalytics.getTrend(currentRev, prevRev);
    const profitTrend = PremiumAnalytics.getTrend(currentProfit, prevProfit);
    const customerTrend = stats.customers > 0 ? "+4.2%" : "0%"; // Mock slightly positive if data exists

    return {
      sales: `$${stats.sales.toFixed(2)}`,
      expenses: `$${stats.expenses.toFixed(2)}`,
      profit: `$${(stats.sales - stats.expenses).toFixed(2)}`,
      aiSavings: `$${aiSavings.potentialSavings.toFixed(2)}`,
      customers: String(stats.customers),
      avgCustomer: stats.transactions > 0 ? `$${(stats.sales / stats.transactions).toFixed(2)}` : "$0.00",
      bestSelling: "-",
      profitMargin: stats.sales > 0 ? `${(((stats.sales - stats.expenses) / stats.sales) * 100).toFixed(1)}%` : "0%",
      trends: { 
        sales: salesTrend, 
        profit: profitTrend, 
        margin: "", 
        customers: customerTrend, 
        savings: isKhmer ? "ការបង្កើនប្រសិទ្ធភាព" : "Optimization" 
      },
    };
  }, [salesRaw, expensesRaw, stats, aiSavings]);

  // ── Stats computations ──
  const EXPENSE_COLORS = [
    "#29B28D", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#94a3b8",
  ];

  const weeklyLabels = isKhmer 
    ? ["ចន្ទ", "អង្គារ", "ពុធ", "ព្រហ", "សុក្រ", "សៅរ៍", "អាទិត្យ"] 
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyData = React.useMemo(() => {
    const now = new Date();
    const buckets = [0, 0, 0, 0, 0, 0, 0];
    salesRaw.forEach((t) => {
      const d = new Date(t.createdAt);
      const diffMs = now.getTime() - d.getTime();
      const diffDays = Math.floor(diffMs / 86400000);
      if (diffDays < 7) {
        const dow = (d.getDay() + 6) % 7;
        buckets[dow] += parseFloat(t.amount || "0");
      }
    });
    return buckets;
  }, [salesRaw]);

  const maxWeekly = React.useMemo(() => PremiumAnalytics.getDynamicMax(weeklyData, 1000), [weeklyData]);

  const monthlyLabels = isKhmer
    ? ["សប្តាហ៍ទី ១", "សប្តាហ៍ទី ២", "សប្តាហ៍ទី ៣", "សប្តាហ៍ទី ៤"]
    : ["Week 1", "Week 2", "Week 3", "Week 4"];
  const monthlyData = React.useMemo(() => {
    const buckets = [0, 0, 0, 0];
    salesRaw.forEach((t) => {
      const d = new Date(t.createdAt);
      const weekIdx = Math.min(3, Math.floor((d.getDate() - 1) / 7));
      buckets[weekIdx] += parseFloat(t.amount || "0");
    });
    return buckets;
  }, [salesRaw]);

  const maxMonthly = React.useMemo(() => PremiumAnalytics.getDynamicMax(monthlyData, 3000), [monthlyData]);

  const bestSellingProducts = React.useMemo(() => {
    if (inventoryItems.length > 0) {
      const soldMap: Record<string, number> = {};
      salesRaw.forEach((t) => {
        const itemStr: string = t.items || "";
        const parts = itemStr.split(",").map((s: string) => s.trim());
        parts.forEach((part) => {
          const match = part.match(/^(\d+)x?\s+(.+)$/i);
          if (match) {
            const qty = parseInt(match[1], 10);
            const name = match[2].trim();
            soldMap[name] = (soldMap[name] || 0) + qty;
          }
        });
      });
      const sorted = Object.entries(soldMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4);
      const maxQty = sorted[0]?.[1] || 1;
      return sorted.map(([name, qty], i) => {
        const invItem = inventoryItems.find((inv: any) => inv.name.toLowerCase() === name.toLowerCase());
        return {
          name,
          qty,
          revenue: `$${(invItem ? parseFloat(invItem.price || "0") * qty : 0).toFixed(2)}`,
          pct: Math.round((qty / maxQty) * 100),
          khmer: invItem?.khmerName || name,
        };
      });
    }
    return [];
  }, [salesRaw, inventoryItems]);

  const expenseCategories = React.useMemo(() => {
    const map: Record<string, number> = {};
    expensesRaw.forEach((e) => {
      const cat = e.category || "Others";
      map[cat] = (map[cat] || 0) + parseFloat(e.amount || "0");
    });
    const total = Object.values(map).reduce((a, b) => a + b, 0);
    return Object.entries(map).map(([label, value], idx) => ({
      label,
      value: total > 0 ? Math.round((value / total) * 100) : 0,
      amount: value,
      color: EXPENSE_COLORS[idx % EXPENSE_COLORS.length],
    }));
  }, [expensesRaw]);

  const [smartAlerts, setSmartAlerts] = useState<any[]>([]);

  const handleDashChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dashChatInput || isChatSending) return;
    const msg = dashChatInput;
    setDashChatInput("");
    setDashChatMessages(prev => [...prev, { role: "user", text: msg }]);
    setIsChatSending(true);
    try {
      const res = await offlineFetch("/api/vendor/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, context: "dashboard" }),
      });
      if (res.ok) {
        const json = await res.json();
        setDashChatMessages(prev => [...prev, { role: "assistant", text: json.response }]);
      }
    } catch(err) { console.error(err); }
    finally { setIsChatSending(false); }
  };

  return (
    <VendorDashboardLayout
      plan="premium"
      navLinks={PREMIUM_NAV}
      currentPath="/vendor/premium"
      settingsHref="/vendor/premium/settings"
      title="Premium Dashboard"
      userName={displayName}
      userInitials={displayInitials}
      userEmail={user?.email || ""}
      planBadge={{ label: "PREMIUM", icon: Sparkles }}
      rightActions={
        <>
          <div ref={quickSaleRef} className="relative">
            <button
              onClick={() => setQuickSaleOpen((o) => !o)}
              className={`flex items-center gap-[7px] border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer transition-all duration-200 ${
                quickSaleOpen
                  ? "bg-[#0E1319] text-[#e6edf3] dark:bg-white dark:text-[#111827]"
                  : "bg-[#29B28D] text-[#0E1319] shadow-[0_2px_14px_rgba(41,178,141,0.28)]"
              }`}
            >
              {quickSaleOpen ? (
                <>
                  <X className="w-4 h-4" /> {isKhmer ? "បោះបង់" : "Cancel"}
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> {isKhmer ? "ការលក់រហ័ស" : "Quick Sale"}
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
                className="absolute top-[calc(100%+10px)] right-0 w-[330px] bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-[14px] shadow-[0_20px_56px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_56px_rgba(0,0,0,0.5)] overflow-hidden transition-colors"
                style={{ zIndex: 9999 }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 px-[18px] py-[14px] border-b border-[#e8eaed] dark:border-white/10">
                  <ShoppingCart className="w-4 h-4 text-[#29B28D]" />
                  <span className="font-bold text-sm text-[#111827] dark:text-white">
                    {isKhmer ? "ការលក់រហ័ស" : "Quick Sale"}
                  </span>
                </div>
                <div className="p-[14px_18px] max-h-[60vh] overflow-y-auto">
                  <div className="relative mb-[14px]">
                    <Search className="w-3.5 h-3.5 absolute left-[11px] top-1/2 -translate-y-1/2 text-[#6b7280] dark:text-[#7d8590] pointer-events-none" />
                    <input
                      ref={searchRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isKhmer ? "ស្វែងរកផលិតផល..." : "Search product..."}
                      className="w-full pl-[33px] pr-[11px] py-[9px] bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[9px] text-[13px] outline-none text-[#111827] dark:text-white focus:border-[#29B28D] dark:focus:border-[#29B28D] transition-colors"
                      style={{ fontFamily: "inherit" }}
                    />
                    {searchQuery && (
                      <div
                        className="absolute top-full left-0 right-0 bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 border-t-0 rounded-b-[9px] overflow-hidden shadow-lg"
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
                              className="w-full flex justify-between items-center px-[13px] py-[9px] bg-transparent border-0 cursor-pointer text-[13px] text-[#111827] dark:text-white text-left hover:bg-[#f7f8fa] dark:hover:bg-white/5 transition-colors"
                              style={{ fontFamily: "inherit" }}
                            >
                              <span>{p.name}</span>
                              <span className="text-[#29B28D] font-bold">
                                ${Number(p.price).toFixed(2)}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-[13px] py-[10px] text-[12.5px] text-[#6b7280] dark:text-[#7d8590]">
                            {isKhmer ? "រកមិនឃើញផលិតផលទេ" : "No products found"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {!searchQuery && (
                    <div className="mb-[14px]">
                      <div className="text-[10px] font-bold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-[0.07em] mb-2">
                        {isKhmer ? "ប៉ះដើម្បីបន្ថែម" : "Tap to add"}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {inventoryItems.length > 0 ? (
                          inventoryItems.map((p) => {
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
                                    : "bg-[#f7f8fa] dark:bg-[#161B22] border-[#e8eaed] dark:border-white/5 hover:bg-[#eff0f2] dark:hover:bg-white/10"
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
                                  ${Number(p.price).toFixed(2)}
                                </div>
                                {inCart && (
                                  <span className="absolute top-1.5 right-2 bg-[#29B28D] text-[#0E1319] rounded-full w-[17px] h-[17px] text-[9px] font-extrabold flex items-center justify-center">
                                    {inCart.qty}
                                  </span>
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div className="col-span-2 py-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-white/10">
                            <span className="text-[13px] font-bold text-white/40">
                              {isKhmer ? "មិនមានទិន្នន័យ។ បន្ថែមផលិតផល" : "No data. Add item"}
                            </span>
                            <span className="text-[10px] text-[#7d8590] mt-1 text-center">
                              {isKhmer ? "សូមបន្ថែមផលិតផលទៅក្នុងស្តុករបស់អ្នកជាមុនសិន" : "Add products to your inventory first"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {cart.length > 0 && (
                    <div className="mb-3 max-h-[140px] overflow-y-auto">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center gap-2 py-[7px] border-b border-[#f0f2f5] dark:border-white/5"
                        >
                          <span className="text-[12.5px] flex-1 text-[#111827] dark:text-white">
                            {isKhmer ? (item.product as any).khmerName || item.product.name : item.product.name}
                          </span>
                          <div className="flex items-center bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[7px] overflow-hidden shrink-0">
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault();
                                changeQty(item.product.id, -1);
                              }}
                              className="w-6 h-6 bg-transparent border-0 cursor-pointer flex items-center justify-center text-[#6b7280] dark:text-[#7d8590] hover:bg-[#e8eaed] dark:hover:bg-white/10 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold min-w-[18px] text-center dark:text-white">
                              {item.qty}
                            </span>
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault();
                                changeQty(item.product.id, 1);
                              }}
                              className="w-6 h-6 bg-transparent border-0 cursor-pointer flex items-center justify-center text-[#6b7280] dark:text-[#7d8590] hover:bg-[#e8eaed] dark:hover:bg-white/10 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-[12.5px] font-bold min-w-[48px] text-right dark:text-white">
                            ${(Number(item.product.price) * item.qty).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 border-t border-[#f0f2f5] dark:border-white/5 mb-3 mt-1">
                    <span className="text-xs text-[#6b7280] dark:text-[#7d8590] font-medium">
                      {isKhmer ? "អតិថិជន" : "Customers"}
                    </span>
                    <div className="flex items-center bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[8px] overflow-hidden">
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setCustomers((c) => Math.max(1, c - 1));
                        }}
                        className="w-7 h-7 bg-transparent border-0 cursor-pointer text-[#6b7280] dark:text-[#7d8590] flex items-center justify-center hover:bg-[#e8eaed] dark:hover:bg-white/10 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[13px] font-bold min-w-[24px] text-center dark:text-white">
                        {customers}
                      </span>
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setCustomers((c) => c + 1);
                        }}
                        className="w-7 h-7 bg-transparent border-0 cursor-pointer text-[#6b7280] dark:text-[#7d8590] flex items-center justify-center hover:bg-[#e8eaed] dark:hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                     <span className="text-xs text-[#6b7280] dark:text-[#7d8590]">
                      {cartItems} {isKhmer ? "មុខ" : "item"}{cartItems !== 1 && !isKhmer ? "s" : ""}
                    </span>
                    <span className="font-extrabold text-xl text-[#29B28D]">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      if (cart.length && !isCompletingSale) completeSale();
                    }}
                    disabled={cart.length === 0 || isCompletingSale}
                    className={`w-full py-3 font-bold text-[13.5px] border-0 rounded-[10px] flex items-center justify-center gap-[7px] transition-all ${
                      cart.length && !isCompletingSale
                        ? "bg-[#29B28D] text-[#0E1319] cursor-pointer shadow-[0_4px_14px_rgba(41,178,141,0.28)] hover:opacity-90"
                        : "bg-[#f0f2f5] dark:bg-white/5 text-[#6b7280] dark:text-[#7d8590] cursor-not-allowed"
                    }`}
                  >
                    {isCompletingSale ? (
                       <div className="w-5 h-5 border-2 border-[#0E1319]/30 border-t-[#0E1319] rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> {isKhmer ? "បញ្ចប់ការលក់" : "Complete Sale"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button onClick={() => {
            const rows = [
              ["Date", "Amount", "Method", "Items"],
              ...salesRaw.map((s) => [
                new Date(s.createdAt).toLocaleString(),
                s.amount,
                s.method || "Cash",
                `"${(s.items || "").replace(/"/g, '""')}"`
              ]),
            ];
            const csv = rows.map((r) => r.join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "premium_dashboard_export.csv";
            a.click();
            URL.revokeObjectURL(url);
          }} className="hidden sm:flex items-center gap-2 bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 hover:bg-[#f7f8fa] dark:hover:bg-white/5 text-[#111827] dark:text-white font-medium px-3.5 py-2 rounded-[10px] transition-colors text-sm min-h-[40px] cursor-pointer">
            <FileSpreadsheet className="w-4 h-4" /> {isKhmer ? "ទាញយកជា Excel" : "Export Excel"}
          </button>
        </>
      }
    >
      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7 max-w-7xl mx-auto w-full">
        {/* Smart Push Notifications */}
        {smartAlerts.length > 0 && (
          <div className="space-y-3">
            {smartAlerts.map((alert, i) => (
              <div
                key={alert.id || i}
                className={`flex items-center gap-4 p-4 rounded-[11px] border shadow-sm transition-all hover:shadow-md ${
                  alert.type === "warning"
                    ? "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20"
                    : "bg-[rgba(41,178,141,0.06)] border-[rgba(41,178,141,0.2)]"
                }`}
              >
                <div
                  className={`p-2 rounded-[8px] ${alert.type === "warning" ? "bg-orange-100 dark:bg-orange-500/20" : "bg-[rgba(41,178,141,0.12)]"}`}
                >
                  {alert.type === "warning" ? (
                    <TrendingDown
                      className={`w-4 h-4 ${alert.type === "warning" ? "text-orange-600 dark:text-orange-400" : ""}`}
                    />
                  ) : (
                    <Zap className="w-4 h-4 text-[#29B28D]" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-[#111827] dark:text-white">
                    {alert.message}
                  </p>
                  <p className="text-[11px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">
                    {alert.time}
                  </p>
                </div>
                <button onClick={() => {
                  if (alert.id) {
                    setDismissedAlerts(prev => new Set(prev).add(alert.id));
                  }
                  setSmartAlerts(prev => prev.filter(a => a.id !== alert.id));
                }} className="text-[12px] font-bold text-[#4b5563] dark:text-[#abb4be] hover:text-[#111827] dark:hover:text-white px-3 py-1.5 rounded-[8px] hover:bg-white dark:hover:bg-white/10 transition-colors bg-transparent border-0 cursor-pointer">
                  {isKhmer ? "បោះបង់ចោល" : "Dismiss"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ══ WELCOME BANNER ══════════════════════════════════ */}
        <div className="bg-[#0E1319] rounded-[14px] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border border-white/[0.06] overflow-hidden relative">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#29B28D] rounded-full blur-[80px] opacity-10 pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#29B28D] rounded-full blur-[80px] opacity-10 pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[19px] font-extrabold text-white shrink-0">
              {loading ? ".." : displayInitials}
            </div>
            <div className="space-y-1">
              <span className="text-[22px] font-extrabold text-white tracking-tight" suppressHydrationWarning>
                {isKhmer ? greetingKh : greeting}, {loading ? (isKhmer ? "កំពុងទាញយក..." : "Loading...") : displayName}
              </span>
              <div className="text-[11px] text-[#abb4be] mt-0.5 flex items-center gap-2" suppressHydrationWarning>
                <Clock size={10} className="inline-block text-[#29B28D]" />
                <span className="text-white/80">{dateStr}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 sm:shrink-0 relative z-10 backdrop-blur-sm p-4 rounded-2xl">
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
                  stroke="#29B28D"
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
                  {isKhmer ? "នៃគោលដៅ" : "of goal"}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1 text-[#29B28D]">
                <Target className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-[0.06em]">
                  {isKhmer ? GOAL.khmer : "Daily Goal"}
                </span>
              </div>
              <div className="text-[24px] font-extrabold text-white leading-none tracking-tight mb-1">
                ${GOAL.current.toFixed(2)}
              </div>
              <div className="text-[12px] text-[#7d8590] mt-0.5">
                {isKhmer ? "នៃគោលដៅ $" : "of $"}
                {GOAL.target.toFixed(2)} {isKhmer ? "ដែលបានកំណត់" : "target"}
              </div>
              <div className="mt-2.5 w-[140px] h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#29B28D] rounded-full transition-[width] duration-700"
                  style={{ width: `${goalPct}%` }}
                />
              </div>
              <div className="text-[11px] text-[#7d8590] mt-1.5 flex items-center justify-end">
                <button
                  onClick={() => setShowGoalModal(true)}
                  className="bg-transparent border-0 p-0 text-[#29B28D] hover:underline text-[10px] font-bold cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-2.5 h-2.5" />
                  {isKhmer ? "កំណត់គោលដៅ" : "Set Goal"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards (shared component) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <VendorSummaryCard
            title="Total Sales"
            khmerTitle="ការលក់សរុប"
            value={summaryData.sales}
            icon={CircleDollarSign}
            trend={summaryData.trends.sales}
            isPositive
          />
          <VendorSummaryCard
            title="Net Profit"
            khmerTitle="ប្រាក់ចំណេញ"
            value={summaryData.profit}
            icon={TrendingUp}
            trend={summaryData.trends.profit}
            isPositive
            highlight
          />
          <VendorSummaryCard
            title="AI Savings"
            khmerTitle="ការសន្សំដោយ AI"
            value={summaryData.aiSavings}
            icon={Sparkles}
            trend={summaryData.trends.savings}
            isPositive
          />
          <VendorSummaryCard
            title="Customers"
            khmerTitle="អតិថិជន"
            value={summaryData.customers}
            icon={Users}
            trend={summaryData.trends.customers}
            isPositive
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/5 rounded-[14px] p-6 shadow-sm transition-colors">
            <h3 className="font-semibold text-[15px] text-[#111827] dark:text-white mb-5">
              {isKhmer ? "ចំណូលប្រចាំសប្តាហ៍" : "Weekly Revenue"}
            </h3>
            <div className="h-40 flex items-end gap-1.5">
              {stats.transactions > 0 || hasData ? (
                weeklyData.map((amount, i) => {
                    const height = Math.round((amount / maxWeekly) * 100);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-[rgba(41,178,141,0.12)] rounded-t-[7px] relative group" style={{ height: "120px" }}>
                          <div
                            className="absolute bottom-0 w-full bg-[#29B28D] rounded-t-[7px] transition-all duration-500 group-hover:opacity-80"
                            style={{ height: `${Math.max(height, 5)}%` }}
                          />
                        </div>
                      <span className="text-[10px] text-[#6b7280] dark:text-[#7d8590]">
                        {weeklyLabels[i]}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-[10px] border border-dashed border-[#e8eaed] dark:border-white/10">
                  <span className="text-sm font-medium text-[#6b7280] dark:text-[#7d8590]">
                    {isKhmer ? "មិនមានទិន្នន័យ។ បន្ថែមផលិតផល" : "No data. Add item"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/5 rounded-[14px] p-6 shadow-sm transition-colors">
            <h3 className="font-semibold text-[15px] text-[#111827] dark:text-white mb-5">
              {isKhmer ? "ចំណូលប្រចាំខែ" : "Monthly Revenue"}
            </h3>
            <div className="h-40 flex items-end gap-2">
              {hasData ? (
                monthlyData.map((val, i) => (
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
                        style={{ height: `${Math.max((val / maxMonthly) * 100, 5)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#6b7280] dark:text-[#7d8590]">
                      {monthlyLabels[i]}
                    </span>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-[10px] border border-dashed border-[#e8eaed] dark:border-white/10">
                  <span className="text-sm font-medium text-[#6b7280] dark:text-[#7d8590]">
                    {isKhmer ? "មិនមានទិន្នន័យ។ បន្ថែមផលិតផល" : "No data. Add item"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/5 rounded-[14px] p-6 shadow-sm col-span-1 lg:col-span-2 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[15px] text-[#111827] dark:text-white">
                {isKhmer ? "ការចំណាយ" : "Expenses"}
              </h3>
              {expLogged && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[rgba(41,178,141,0.1)] text-[#29B28D] text-[10px] font-bold border border-[rgba(41,178,141,0.2)] uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" /> {isKhmer ? "បានកត់ត្រា!" : "Logged!"}
                </span>
              )}
            </div>
            <div className="space-y-3">
              {hasData ? (
                expenseCategories.map((item, i) => (
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
                    <div className="w-full h-2.5 bg-[#f0f2f5] dark:bg-white/5 rounded-full overflow-hidden">
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
                <div className="w-full py-6 flex items-center justify-center rounded-[10px] border border-dashed border-[#e8eaed] dark:border-white/10">
                  <span className="text-sm font-medium text-[#6b7280] dark:text-[#7d8590]">
                    {isKhmer ? "មិនមានទិន្នន័យ។ បន្ថែមផលិតផល" : "No data. Add item"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/5 rounded-[14px] shadow-sm overflow-hidden transition-colors">
          <div className="px-6 py-5 border-b border-[#f0f2f5] dark:border-white/5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[17px] text-[#111827] dark:text-white">
                {isKhmer ? "ផលិតផលលក់ដាច់ជាងគេ" : "Best Selling Products"}
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[rgba(41,178,141,0.1)] text-[#29B28D] text-[11px] font-bold rounded-full border border-[rgba(41,178,141,0.2)]">
              <Crown className="w-3 h-3" /> {isKhmer ? "ការវិភាគកម្រិត Premium" : "Premium Analytics"}
            </span>
          </div>
          <div className="p-5 space-y-4">
            {hasData ? (
              bestSellingProducts.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-7 h-7 rounded-full bg-[rgba(41,178,141,0.1)] text-[#29B28D] text-[12px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="text-[14px] font-semibold text-[#111827] dark:text-white">
                          {isKhmer ? (item.khmer || item.name) : item.name}
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
                    <div className="w-full h-2 bg-[#f0f2f5] dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#29B28D] rounded-full transition-all duration-700"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full py-8 flex items-center justify-center rounded-[10px] border border-dashed border-[#e8eaed] dark:border-white/10 text-sm font-medium text-[#6b7280] dark:text-[#7d8590]">
                {isKhmer ? "មិនមានទិន្នន័យ។ បន្ថែមផលិតផល" : "No data. Add item"}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        {hasData && inventoryItems.filter((i) => i.status !== "good").length > 0 && (
          <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-[14px] p-5 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h4 className="font-semibold text-[14px] text-orange-800 dark:text-orange-400">
                {isKhmer ? "ការជូនដំណឹងអំពីការអស់ស្តុក" : "Low Stock Alert"}
              </h4>
            </div>
            <div className="space-y-2">
              {inventoryItems
                .filter((i) => i.status !== "good")
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 px-3 bg-white dark:bg-[#161B22] rounded-[10px] border border-orange-100 dark:border-orange-500/10 transition-colors"
                  >
                    <span className="text-[13px] font-medium text-[#111827] dark:text-white">
                      {isKhmer ? (item.khmerName || item.name) : item.name}
                    </span>
                    <span
                      className={`text-[12px] font-bold ${item.status === "out" ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"}`}
                    >
                      {item.stock} {isKhmer ? "នៅសល់" : "left"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* End-of-Day AI Summary */}
        <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/5 rounded-[14px] shadow-sm overflow-hidden transition-colors">
          <div className="px-6 py-5 border-b border-[#f0f2f5] dark:border-white/5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[17px] text-[#111827] dark:text-white">
                {isKhmer ? "សង្ខេបចុងថ្ងៃរហ័ស AI" : "End-of-Day AI Summary"}
              </h3>
              <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590] mt-0.5">
                {isKhmer ? "ពេលវេលាជាក់ស្តែង" : "Real-time"}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(41,178,141,0.1)] text-[#29B28D] text-[12px] font-bold border border-[rgba(41,178,141,0.2)]">
              <CheckCircle2 className="w-3.5 h-3.5" /> {isKhmer ? "រក្សាទុកដោយស្វ័យប្រវត្តិ" : "Auto-Saved"}
            </span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-[#f7f8fa] dark:bg-[#161B22] dark:border dark:border-white/5 rounded-[11px] text-center transition-colors">
                <p className="text-[12px] font-semibold text-[#6b7280] dark:text-[#7d8590] mb-3">
                  {isKhmer ? "ការលក់សរុប" : "Total Sales"}
                </p>
                <p className="text-[22px] font-bold text-[#111827] dark:text-white">
                  {summaryData.sales}
                </p>
              </div>
              <div className="p-4 bg-[#f7f8fa] dark:bg-[#161B22] dark:border dark:border-white/5 rounded-[11px] text-center transition-colors">
                <p className="text-[12px] font-semibold text-[#6b7280] dark:text-[#7d8590] mb-3">
                  {isKhmer ? "ចំណាយសរុប" : "Total Expenses"}
                </p>
                <p className="text-[22px] font-bold text-red-500 dark:text-red-400">
                  {summaryData.expenses}
                </p>
              </div>
              <div className="p-4 bg-[rgba(41,178,141,0.08)] rounded-[11px] text-center border border-[rgba(41,178,141,0.18)]">
                <p className="text-[12px] font-semibold text-[#29B28D] mb-3">
                  {isKhmer ? "ប្រាក់ចំណេញ" : "Net Profit"}
                </p>
                <p className="text-[22px] font-bold text-[#29B28D]">
                  {summaryData.profit}
                </p>
              </div>
            </div>

            <div className="bg-[rgba(41,178,141,0.06)] rounded-[11px] p-5 mb-6 border border-[rgba(41,178,141,0.15)]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#29B28D]" />
                <h4 className="font-bold text-[14px] text-[#111827] dark:text-white">
                  Gemini Insight
                </h4>
                <span className="text-[10px] font-bold text-[#29B28D] bg-[rgba(41,178,141,0.12)] px-2 py-0.5 rounded-full">
                  PREMIUM
                </span>
              </div>
              <p className="text-[14px] text-[#111827] dark:text-white leading-relaxed">
                {hasData ? (
                  isKhmer ? (
                    <>
                      <strong>ការអនុវត្តល្អណាស់!</strong> អ្នកបានកត់ត្រាការលក់ចំនួន {stats.transactions} នៅថ្ងៃនេះ។ ខ្លាំងណាស់!
                      {bestSellingProducts.length > 0 && (
                        <> <strong>{bestSellingProducts[0].khmer || bestSellingProducts[0].name}</strong> គឺជាផលិតផលដែលលក់ដាច់បំផុតរបស់អ្នក។</>
                      )}
                      {inventoryItems.some(i => i.stock <= i.threshold) && (
                        <> សូមពិនិត្យមើលកម្រិតស្តុករបស់អ្នក! មុខទំនិញមួយចំនួនកំពុងថយចុះ ហើយត្រូវការការបំពេញបន្ថែម។</>
                      )}
                    </>
                  ) : (
                    <>
                      <strong>Great performance!</strong> You have logged {stats.transactions} sales today. Strong work!
                      {bestSellingProducts.length > 0 && (
                        <> <strong>{bestSellingProducts[0].name}</strong> is your top performer.</>
                      )}
                      {inventoryItems.some(i => i.stock <= i.threshold) && (
                        <> Watch your stock levels! Some items are running low and need restocking.</>
                      )}
                    </>
                  )
                ) : (
                  <>{isKhmer ? "មិនទាន់មានទិន្នន័យគ្រប់គ្រាន់នៅឡើយទេ។ ចាប់ផ្តើមធ្វើការលក់ដើម្បីបង្កើតការសង្ខេបប្រចាំថ្ងៃដោយ AI របស់អ្នក។" : "Not enough data yet. Start making sales to generate your AI daily summary."}</>
                )}
              </p>
            </div>

            <div className="text-[13px] text-[#6b7280] dark:text-[#7d8590] mb-5">
              {isKhmer ? "ការគណនាដោយស្វ័យប្រវត្តិ" : "Auto-calculated"}: {summaryData.sales} − {summaryData.expenses} ={" "}
              <strong className="text-[#111827] dark:text-white">
                {summaryData.profit}
              </strong>
            </div>

            {/* Premium: always-on continuous auto-save — no manual locking required */}
            <div className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[rgba(41,178,141,0.08)] to-[rgba(139,92,246,0.08)] text-[#29B28D] font-bold text-[16px] py-4 rounded-[11px] border border-[rgba(41,178,141,0.2)] min-h-[56px] transition-colors">
              <Sparkles className="w-5 h-5 text-[#8b5cf6]" />
              <span>{isKhmer ? "ការរក្សាទុកដោយស្វ័យប្រវត្តិ Premium — ទិន្នន័យត្រូវបានធ្វើសមកាលកម្មជាបន្តបន្ទាប់" : "Premium Auto-Save — Records Sync Continuously"}</span>
            </div>
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
          <div className="bg-white dark:bg-[#0d1117] rounded-[14px] w-full max-w-md p-6 shadow-2xl relative z-10 border dark:border-white/10 transition-colors">
            <button
              onClick={() => setShowCustomCategoryModal(false)}
              className="absolute top-4 right-4 text-[#6b7280] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white p-1.5 rounded-[8px] hover:bg-[#f7f8fa] dark:hover:bg-white/5 transition-colors bg-transparent border-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-5">
              <Tag className="w-5 h-5 text-[#29B28D]" />
              <h3 className="font-bold text-[19px] text-[#111827] dark:text-white">
                {isKhmer ? "បន្ថែមប្រភេទចំណាយថ្មី" : "Add Custom Category"}
              </h3>
            </div>
            <p className="text-[13px] text-[#6b7280] dark:text-[#7d8590] mb-5">
              {isKhmer ? "បង្កើតប្រភេទចំណាយផ្ទាល់ខ្លួនរបស់អ្នក លើសពីអ្វីដែលមានស្រាប់។" : "Create your own expense categories beyond the default presets."}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-wider mb-1.5">
                  {isKhmer ? "ឈ្មោះប្រភេទ" : "Category Name"}
                </label>
                <input
                  type="text"
                  placeholder={isKhmer ? "ឧ. ទីផ្សារ" : "e.g., Marketing"}
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[10px] text-[15px] text-[#111827] dark:text-white font-medium focus:bg-white dark:focus:bg-[#0d1117] focus:border-[#29B28D] dark:focus:border-[#29B28D] outline-none transition-all min-h-[48px]"
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
                {isKhmer ? "បង្កើតប្រភេទ" : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Chatbot FAB */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#29B28D] rounded-full shadow-[0_8px_32px_rgba(41,178,141,0.4)] flex items-center justify-center text-[#0E1319] hover:scale-110 transition-transform border-0 cursor-pointer"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] bg-white dark:bg-[#0d1117] rounded-[14px] shadow-2xl border border-[#e8eaed] dark:border-white/10 flex flex-col overflow-hidden transition-colors">
          <div className="px-5 py-4 bg-[#0E1319] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 border border-white/20 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-[#29B28D]" />
              </div>
              <div>
                <p className="font-bold text-[14px]">
                  {isKhmer ? "ជំនួយការអាជីវកម្ម Gemini" : "Gemini Business Assistant"}
                </p>
                <p className="text-[11px] text-[#29B28D]">
                  {isKhmer ? "អនឡាញ · មជ្ឈមណ្ឌលផ្ទះ" : "Online · Dashboard Hub"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-[8px] transition-colors bg-transparent border-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f7f8fa] dark:bg-[#161B22] min-h-[280px] transition-colors">
            {dashChatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-[12px] text-[13px] leading-relaxed relative ${
                    msg.role === "user"
                      ? "bg-[#29B28D] text-[#0E1319] rounded-br-sm"
                      : "bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 text-[#111827] dark:text-white rounded-tl-sm shadow-sm transition-colors"
                  }`}
                >
                  {msg.role !== "user" && (
                    <Sparkles className="w-3 h-3 text-[#29B28D] absolute -top-1 -left-1" />
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatSending && (
              <div className="flex justify-start">
                <div className="px-4 py-3 bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 text-[#6b7280] dark:text-[#7d8590] rounded-[12px] rounded-tl-sm text-[13px] italic">
                  {isKhmer ? "កំពុងវិភាគទិន្នន័យរបស់អ្នក..." : "Analyzing your data..."}
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-[#e8eaed] dark:border-white/10 bg-white dark:bg-[#0d1117] transition-colors">
            <form onSubmit={handleDashChatSubmit} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={isKhmer ? "សួរជំនួយការ Gemini របស់អ្នក..." : "Ask your Gemini assistant..."}
                value={dashChatInput}
                onChange={(e) => setDashChatInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[10px] text-[13px] text-[#111827] dark:text-white focus:bg-white dark:focus:bg-[#0d1117] focus:border-[#29B28D] dark:focus:border-[#29B28D] outline-none transition-all placeholder:text-[#6b7280] dark:placeholder:text-[#7d8590]"
                style={{ fontFamily: "inherit" }}
              />
              <button type="submit" disabled={isChatSending || !dashChatInput} className="p-2.5 bg-[#29B28D] text-[#0E1319] rounded-[10px] hover:opacity-90 transition-opacity shadow-sm border-0 cursor-pointer disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Goal Setting Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0E1319]/40 backdrop-blur-sm p-4">
          <div
            className="absolute inset-0"
            onClick={() => setShowGoalModal(false)}
          />
          <div className="bg-white dark:bg-[#0d1117] rounded-[18px] w-full max-w-sm p-6 shadow-2xl relative z-10 border dark:border-white/10 transition-colors">
            <button
              onClick={() => setShowGoalModal(false)}
              className="absolute top-4 right-4 text-[#6b7280] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white p-1.5 rounded-[8px] hover:bg-[#f7f8fa] dark:hover:bg-white/5 transition-colors bg-transparent border-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[rgba(41,178,141,0.1)] flex items-center justify-center">
                <Target className="w-5 h-5 text-[#29B28D]" />
              </div>
              <div>
                <h3 className="font-bold text-[18px] text-[#111827] dark:text-white leading-tight">
                  {isKhmer ? "កំណត់គោលដៅចំណូល" : "Set Revenue Goal"}
                </h3>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-[#6b7280] dark:text-[#7d8590] uppercase tracking-wider mb-2">
                  {isKhmer ? "ចំនួនគោលដៅប្រចាំថ្ងៃ (USD)" : "Daily Target Amount (USD)"}
                </label>
                <div className="relative">
                  <CircleDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280] dark:text-[#7d8590]" />
                  <input
                    type="number"
                    value={newGoalInput}
                    onChange={(e) => setNewGoalInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#f7f8fa] dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-xl text-[16px] text-[#111827] dark:text-white font-bold focus:bg-white dark:focus:bg-[#0d1117] focus:border-[#29B28D] dark:focus:border-[#29B28D] outline-none transition-all placeholder:text-[#6b7280]"
                    placeholder={isKhmer ? "បញ្ជាក់ចំនួន..." : "Enter amount..."}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[200, 500, 1000].map(val => (
                    <button
                      key={val}
                      onClick={() => setNewGoalInput(val.toString())}
                      className={`py-2 px-3 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                        newGoalInput === val.toString()
                          ? "bg-[#29B28D] text-[#0E1319] border-[#29B28D]"
                          : "bg-transparent text-[#6b7280] border-[#e8eaed] dark:border-white/10 hover:border-[#29B28D]"
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 py-3 font-bold text-[13px] rounded-xl border border-[#e8eaed] dark:border-white/10 bg-transparent text-[#6b7280] dark:text-[#7d8590] hover:bg-[#f7f8fa] dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  {isKhmer ? "បោះបង់" : "Cancel"}
                </button>
                <button
                  onClick={handleUpdateGoal}
                  disabled={isUpdatingGoal || !newGoalInput || parseFloat(newGoalInput) <= 0}
                  className="flex-[2] bg-[#29B28D] text-[#0E1319] font-extrabold text-[13px] py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all border-0 cursor-pointer shadow-[0_4px_12px_rgba(41,178,141,0.2)] flex items-center justify-center gap-2"
                >
                  {isUpdatingGoal ? (
                    <div className="w-4 h-4 border-2 border-[#0E1319]/30 border-t-[#0E1319] rounded-full animate-spin"></div>
                  ) : (
                    isKhmer ? "រក្សាទុកគោលដៅ" : "Save Goal"
                  )}
                </button>
              </div>
            </div>
            
            {/* History Link / Table mention */}
            <div className="mt-6 pt-5 border-t border-[#f0f2f5] dark:border-white/5">
              <p className="text-[10px] text-[#6b7280] dark:text-[#7d8590] text-center italic">
                {isKhmer ? "គោលដៅរបស់អ្នកត្រូវបានតាមដានក្នុងតារាងសម្រាប់របាយការណ៍ Premium។" : "Your goals are tracked in a dedicated table for premium reporting."}
              </p>
            </div>
          </div>
        </div>
      )}

    </VendorDashboardLayout>
  );
}
