"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  MouseEvent,
  createContext,
  useContext,
} from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Settings,
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
  PanelLeftClose,
  PanelLeftOpen,
  Info,
  BarChart3,
} from "lucide-react";

// Reusable components
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorTopbar from "@/components/vendor/VendorTopbar";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";

// ─── Types ─────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  price: number;
}
type TooltipData = { content: string | null; x: number; y: number };

// ─── Tooltip Context ───────────────────────────────────────────────
const TooltipContext = createContext<(val: TooltipData) => void>(() => {});

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
export default function DemoDashboard() {
  const { resolvedTheme } = useTheme();
  const { language, t } = useLanguage();
  const isDark = resolvedTheme === "dark";
  const isKhmer = language === "km";
  
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [quickSaleOpen, setQuickSaleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [customers, setCustomers] = useState(1);
  const searchRef = useRef<HTMLInputElement>(null);
  const quickSaleRef = useRef<HTMLDivElement>(null);

  // Custom UI States
  const [tooltip, setTooltip] = useState<TooltipData>({
    content: null,
    x: 0,
    y: 0,
  });
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }, []);

  const triggerDemoLock = (val?: any) => {
    const msg = isKhmer ? "ទិដ្ឋភាពភ្ញៀវ៖ ការកែសម្រួលត្រូវបានដាក់កម្រិត" : "Guest View: Editing is restricted";
    showToast(msg);
  };

  // ─── DEMO STATIC DATA ───
  const demoSummary = {
    sales: "$124.50",
    expenses: "$45.00",
    profit: "$79.50",
    customers: "42",
    avgCustomer: "$2.96",
  };
  const demoUsage = { used: 127, limit: 500 };
  const demoUsagePct = Math.min((demoUsage.used / demoUsage.limit) * 100, 100);

  // ─── Demo Static Charts Data ───
  const weeklyData = [40, 70, 45, 90, 65, 120, 85];
  const weeklyLabels = isKhmer 
    ? ["ច័ន្ទ", "អង្គារ", "ពុធ", "ព្រហ", "សុក្រ", "សៅរ៍", "អាទិត្យ"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthlyData = [320, 480, 410, 540];

  const goalPct = Math.min((GOAL.current / GOAL.target) * 100, 100);
  const radius = 38;
  const circum = 2 * Math.PI * radius;
  const strokeDash = (goalPct / 100) * circum;

  const [timeData, setTimeData] = useState({
    greeting: "Welcome",
    greetingKh: "សួស្តី",
    dateStr: "Loading...",
  });

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    const hour = now.getHours();
    setTimeData({
      greeting:
        hour < 12
          ? "Good morning"
          : hour < 17
            ? "Good afternoon"
            : "Good evening",
      greetingKh:
        hour < 12 ? "អរុណសួស្តី" : hour < 17 ? "ទិវាសួស្តី" : "សាយ័ណ្ហសួស្តី",
      dateStr: now.toLocaleDateString("en-KH", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    });
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (quickSaleOpen) setTimeout(() => searchRef.current?.focus(), 120);
  }, [quickSaleOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuickSale();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  useEffect(() => {
    if (!quickSaleOpen) return;
    const fn = (e: globalThis.MouseEvent) => {
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

  const closeQuickSale = useCallback(() => {
    setQuickSaleOpen(false);
    setCart([]);
    setSearchQuery("");
  }, []);

  if (!mounted) return null;

  return (
    <TooltipContext.Provider value={setTooltip}>
      {/* ── Guest Mode Strip ── */}
      <div className={`fixed top-0 left-0 right-0 z-[100] border-b py-2 text-center flex items-center justify-center h-[36px] transition-colors duration-500 ${isDark ? "bg-[#0d1117] border-white/10" : "bg-[#111827] border-[#3ecf8e]/20"}`}>
        <span className="text-xs text-[#e6edf3]">
          {isKhmer ? "អ្នកកំពុងស្ថិតក្នុង Guest Mode — ទិន្នន័យនឹងមិនត្រូវបានរក្សាទុកទេ" : "You are in Guest Mode — data will not be saved"}
        </span>
        <button
          onClick={() => (window.location.href = "/signup")}
          className="ml-3 text-[#3ecf8e] text-xs font-semibold bg-transparent border-0 cursor-pointer hover:underline"
        >
          {isKhmer ? "បង្កើតគណនី →" : "Create account →"}
        </button>
      </div>

      {/* ── Custom Toast Notification ── */}
      <div
        className={`fixed top-[50px] left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
      >
        <div className="bg-[#0d1117] text-white px-5 py-3 rounded-full shadow-2xl border border-white/10 text-[13px] font-medium flex items-center gap-2">
          {toast}
        </div>
      </div>

      <div className={`flex h-screen w-full overflow-hidden transition-colors duration-500 pt-[36px] ${isDark ? "bg-[#0b0f14] text-[#e6edf3]" : "bg-[#f0f2f5] text-[#111827]"} ${isKhmer ? "font-suwannaphum" : "font-sans"}`}>
        {/* ── Custom Floating Tooltip ── */}
        <div
          className={`fixed z-[9999] bg-[#0d1117] text-[#e6edf3] p-3 rounded-lg text-xs shadow-xl w-[250px] pointer-events-none transition-opacity duration-150 ease-out ${tooltip.content ? "opacity-100" : "opacity-0"}`}
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, 0) translateY(15px)",
          }}
        >
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent border-b-[6px] border-b-[#0d1117]" />
          <p className="font-medium text-white mb-1.5 flex items-center gap-1.5">
            <Info size={12} /> {isKhmer ? "ការណែនាំពីការប្រើប្រាស់" : "Demo Insight"}
          </p>
          <p>{tooltip.content}</p>
        </div>

        {/* ══ SIDEBAR (Reusable) ═══════════════════════════════════ */}
        <VendorSidebar
          plan="free"
          isGuest={true}
          onLockedClick={() => triggerDemoLock("settings")}
          navLinks={[
            { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/guest" },
            { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/guest/sales" },
            { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/guest/expenses" },
            { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/guest/customers" },
          ]}
          currentPath="/guest"
          collapsed={isSidebarCollapsed}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* ══ MAIN ══════════════════════════════════════════════════ */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* ── Topbar (Reusable) ── */}
          <VendorTopbar
            title="Overview"
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
            setIsMobileSidebarOpen={setIsSidebarOpen}
            rightActions={
              <>
                {/* Create Account button (visible on sm+) */}
                <button
                  onClick={() => (window.location.href = "/signup")}
                  className="hidden sm:block px-4 py-[9px] rounded-[10px] bg-[#3ecf8e] text-[#0d1117] text-[13px] font-bold hover:bg-[#4dd49a] transition-colors shadow-[0_2px_14px_rgba(62,207,142,0.28)] border-0 cursor-pointer"
                >
                  {isKhmer ? "បង្កើតគណនី" : "Create Account"}
                </button>

                {/* Quick Sale button with dropdown */}
                <div ref={quickSaleRef} className="relative">
                  <button
                    onClick={() => setQuickSaleOpen((o) => !o)}
                    onMouseEnter={(e) =>
                      setTooltip({
                        content: isKhmer 
                          ? "ការកត់ត្រាការលក់សាមញ្ញ។ បន្ថែមផលិតផលទៅក្នុងកន្ត្រក និងបញ្ចប់ការលក់ភ្លាមៗ។"
                          : "Simplified sales logging. Add products to cart and complete sales instantly.",
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }
                    onMouseLeave={() =>
                      setTooltip({ content: null, x: 0, y: 0 })
                    }
                    className={`flex items-center gap-[7px] border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer transition-all duration-200 ${
                      quickSaleOpen
                        ? "bg-[#0d1117] text-[#e6edf3]"
                        : "bg-[#111827] text-white hover:bg-[#1f2937]"
                    }`}
                  >
                    {quickSaleOpen ? (
                      <>
                        <X size={14} /> {isKhmer ? "បិទការលក់" : "Close Sales"}
                      </>
                    ) : (
                      <>
                        <Zap size={14} className="text-[#3ecf8e]" /> {isKhmer ? "លក់រហ័ស" : "Quick Sale"}
                      </>
                    )}
                    {cartItems > 0 && !quickSaleOpen && (
                      <span className="bg-[#3ecf8e] text-[#0d1117] rounded-full w-[18px] h-[18px] text-[10px] font-extrabold flex items-center justify-center ml-0.5">
                        {cartItems}
                      </span>
                    )}
                  </button>

                  {/* Dropdown panel (unchanged) */}
                  {quickSaleOpen && (
                    <div
                      className="absolute top-[calc(100%+10px)] right-0 w-[330px] bg-white border border-[#e8eaed] rounded-[14px] shadow-[0_20px_56px_rgba(0,0,0,0.18)] overflow-hidden"
                      style={{ zIndex: 999 }}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {/* ... quick sale panel content (same as original) ... */}
                      <div className="flex items-center gap-2 px-[18px] py-[14px] border-b border-[#e8eaed]">
                        <ShoppingCart size={14} className="text-[#3ecf8e]" />
                        <span className="font-bold text-sm text-[#111827]">
                          {isKhmer ? "ការលក់រហ័ស" : "Quick Sale"}
                        </span>
                        <span className="text-[11px] text-[#6b7280] ml-auto">
                          {isKhmer ? "Quick Sale" : "ការលក់រហ័ស"}
                        </span>
                      </div>
                      <div className="p-[14px_18px]">
                        {/* Search */}
                        <div className="relative mb-[14px]">
                          <Search
                            size={13}
                            className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none"
                          />
                          <input
                            ref={searchRef}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={isKhmer ? "ស្វែងរកផលិតផល..." : "Search product..."}
                            className="w-full pl-[33px] pr-[11px] py-[9px] bg-[#f7f8fa] border border-[#e8eaed] rounded-[9px] text-[13px] outline-none text-[#111827] focus:border-[#3ecf8e] transition-colors"
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
                              {isKhmer ? "ចុចដើម្បីបន្ថែម" : "Tap to add"}
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
                            {isKhmer ? "អតិថិជន" : "Customers"} · {isKhmer ? "Customers" : "អតិថិជន"}
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

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-[#6b7280]">
                            {cartItems} {isKhmer ? "មុខ" : "item"}{cartItems !== 1 ? (isKhmer ? "" : "s") : ""}
                          </span>
                          <span className="font-extrabold text-xl text-[#3ecf8e]">
                            ${cartTotal.toFixed(2)}
                          </span>
                        </div>

                        {/* Complete sale */}
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            if (cart.length) {
                              showToast(
                                "Sale recorded! Create an account to save permanently.",
                              );
                              closeQuickSale();
                            }
                          }}
                          className={`w-full py-3 font-bold text-[13.5px] border-0 rounded-[10px] flex items-center justify-center gap-[7px] transition-all ${
                            cart.length
                              ? "bg-[#3ecf8e] text-[#0d1117] cursor-pointer hover:bg-[#4dd49a]"
                              : "bg-[#f0f2f5] text-[#6b7280] cursor-not-allowed"
                          }`}
                        >
                          <CheckCircle2 size={15} /> {isKhmer ? "យល់ព្រមលក់" : "Confirm Sale"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User avatar */}
                <div
                  className="w-[34px] h-[34px] rounded-full bg-[rgba(156,163,175,0.12)] border-[1.5px] border-[#9ca3af] flex items-center justify-center text-[11px] font-bold text-[#9ca3af] cursor-pointer hover:bg-[rgba(156,163,175,0.2)] transition-colors"
                  onClick={() => (window.location.href = "/signup")}
                >
                  GU
                </div>
              </>
            }
          />

          {/* ── Scrollable page body ── */}
          <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px]">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-5">
              {/* ══ WELCOME BANNER ══════════════════════════════════ */}
              <div className="bg-[#0d1117] rounded-[14px] border border-white/[0.06] px-[26px] py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d1d5db] to-[#9ca3af] flex items-center justify-center text-[17px] font-extrabold text-[#0d1117] shrink-0 shadow-[0_0_0_3px_rgba(156,163,175,0.2)]">
                    GU
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[18px] font-extrabold text-[#e6edf3]">
                        {isKhmer ? timeData.greetingKh : timeData.greeting}, {isKhmer ? "អ្នកប្រើប្រាស់ជាភ្ញៀវ" : "Guest User"}!
                      </span>
                    </div>
                    <div className="text-[11px] text-[#7d8590] mt-0.5 flex items-center gap-2">
                      <span>{isKhmer ? "សូមស្វាគមន៍" : "Welcome"}</span>
                      <span className="w-[3px] h-[3px] rounded-full bg-[#4d5562] inline-block" />
                      <Clock size={10} className="inline-block" />
                      <span>{timeData.dateStr}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 sm:shrink-0">
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
                        {isKhmer ? "នៃគោលដៅ" : "of goal"}
                      </span>
                    </div>
                  </div>
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
                      {isKhmer ? "នៃ" : "of"} ${GOAL.target.toFixed(2)} {isKhmer ? "គោលដៅ" : "target"}
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
              <div
                className={`border rounded-[14px] px-[22px] py-4 cursor-help transition-colors duration-500 ${isDark ? "bg-[#0d1117] border-white/[0.06]" : "bg-white border-[#e8eaed]"}`}
                onMouseEnter={(e) =>
                  setTooltip({
                    content: isKhmer
                      ? "ការតាមដានការប្រើប្រាស់គំរូ។ គណនីពិតប្រាកដទទួលបានការកត់ត្រាប្រចាំថ្ងៃគ្មានដែនកំណត់។"
                      : "Simplified usage tracker. Real accounts get unlimited daily logs.",
                    x: e.clientX,
                    y: e.clientY,
                  })
                }
                onMouseLeave={() => setTooltip({ content: null, x: 0, y: 0 })}
              >
                <div className="flex items-center justify-between mb-[10px]">
                  <div>
                    <div className="text-[13.5px] font-semibold text-[#111827]">
                      {isKhmer ? "កំណត់ត្រាលក់សាកល្បង" : "Demo Sales Logs"}
                    </div>
                    <div className={`text-[11px] mt-px transition-colors duration-500 ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}>
                      {isKhmer ? "គំរូនៃកំណត់ត្រាលក់ប្រចាំខែ" : "Sample monthly sales logs"}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#111827]">
                    {demoUsage.used}{" "}
                    <span className="text-[#6b7280] font-normal">
                      / {demoUsage.limit}
                    </span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-[width] duration-[600ms] ease-in-out"
                    style={{
                      width: `${demoUsagePct}%`,
                      background: demoUsagePct > 80 ? "#f59e0b" : "#3ecf8e",
                    }}
                  />
                </div>
                <div className="text-[12px] text-[#6b7280] mt-2">
                  {isKhmer ? "នៅសល់ ៣៧៣ កំណត់ត្រា · កំណត់ឡើងវិញរៀងរាល់ខែ · " : "373 logs remaining · Resets monthly · "}
                  <button
                    onClick={() => (window.location.href = "/signup")}
                    className="bg-transparent border-0 p-0 text-[#3ecf8e] cursor-pointer no-underline hover:underline"
                  >
                    {isKhmer ? "ធ្វើឱ្យប្រសើរឡើងសម្រាប់គ្មានដែនកំណត់" : "Upgrade for unlimited"}
                  </button>
                </div>
              </div>

              {/* ── Metric cards (Reusable FreeStatCard) ── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onMouseEnter={(e) =>
                    setTooltip({
                      content: isKhmer
                        ? "តាមដានចំណូលជាក់ស្តែងពីការបញ្ជាទិញលក់ដែលបានដំណើរការ។ បើកការតាមដាននេះជាមួយគណនី។"
                        : "Track real-time income from processed sales orders. Unlock this tracking with an account.",
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  onMouseLeave={() => setTooltip({ content: null, x: 0, y: 0 })}
                >
                  <VendorSummaryCard
                    variant={isDark ? "dark" : "light"}
                    title="Total Sales"
                    khmerTitle="ការលក់សរុប"
                    value={demoSummary.sales}
                  />
                </div>
                <div
                  onMouseEnter={(e) =>
                    setTooltip({
                      content: isKhmer
                        ? "តាមដានរាល់ការចំណាយប្រតិបត្តិការដោយស្វ័យប្រវត្តិ។ បង្កើតគណនីដើម្បីចាប់ផ្តើមការកត់ត្រា។"
                        : "Track all operational costs automatically. Create an account to start logging.",
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  onMouseLeave={() => setTooltip({ content: null, x: 0, y: 0 })}
                >
                  <VendorSummaryCard
                    variant={isDark ? "dark" : "light"}
                    title="Total Expenses"
                    khmerTitle="ចំណាយសរុប"
                    value={demoSummary.expenses}
                  />
                </div>
                <div
                  onMouseEnter={(e) =>
                    setTooltip({
                      content: isKhmer
                        ? "ប្រាក់ចំណេញសុទ្ធត្រូវបានគណនាដោយស្វ័យប្រវត្តិ។ បើកនិន្នាការប្រាក់ចំណេញប្រវត្តិសាស្ត្រត្រឹមត្រូវដោយការចុះឈ្មោះ។"
                        : "Net Profit auto-calculated. Unlock accurate historical profit trends by signing up.",
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  onMouseLeave={() => setTooltip({ content: null, x: 0, y: 0 })}
                >
                  <VendorSummaryCard
                    variant="green"
                    title="Net Profit"
                    khmerTitle="ប្រាក់ចំណេញ"
                    value={demoSummary.profit}
                  />
                </div>
                <div
                  onMouseEnter={(e) =>
                    setTooltip({
                      content: isKhmer
                        ? "បរិមាណប្រតិបត្តិការរបស់អតិថិជន។ បង្កើតកម្មវិធីភាពស្មោះត្រង់របស់អតិថិជននៅពេលអ្នកធ្វើឱ្យប្រសើរឡើង។"
                        : "Customer transaction volume. Build customer loyalty programs when you upgrade.",
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  onMouseLeave={() => setTooltip({ content: null, x: 0, y: 0 })}
                >
                  <VendorSummaryCard
                    variant={isDark ? "dark" : "light"}
                    title="Customers"
                    khmerTitle="អតិថិជនសរុប"
                    value={demoSummary.customers}
                    subtext={`Avg ${demoSummary.avgCustomer}`}
                  />
                </div>
              </div>

              {/* ── Charts Grid ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 1. Weekly Revenue */}
                <ChartCard
                  title={isKhmer ? "ចំណូលប្រចាំសប្តាហ៍" : "Weekly Revenue"}
                  khmer="ចំណូលប្រចាំសប្តាហ៍"
                  tooltipText={isKhmer 
                    ? "ការបង្ហាញពីចំណូលលក់ប្រចាំសប្តាហ៍។ ទាញយករបាយការណ៍ពិតប្រាកដជាមួយគណនីគាំទ្រ។" 
                    : "Demo Weekly Sales Performance. Export real reports with a pro account."}
                >
                  <div className="h-[180px] flex items-end gap-[7px]">
                    {weeklyData.map((v, i) => (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center gap-[5px]"
                      >
                        <div className="w-full h-[155px] relative bg-[rgba(156,163,175,0.12)] rounded-t-[7px] group cursor-pointer hover:bg-[rgba(62,207,142,0.15)] transition-colors">
                          <div
                            className="absolute bottom-0 w-full bg-[#3ecf8e] rounded-t-[7px] transition-all duration-500 ease-in-out opacity-80 group-hover:opacity-100"
                            style={{ height: `${v}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-[#6b7280]">
                          {weeklyLabels[i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </ChartCard>

                {/* 2. Monthly Revenue */}
                <ChartCard
                  title={isKhmer ? "ចំណូលប្រចាំខែ" : "Monthly Revenue"}
                  khmer="ចំណូលប្រចាំខែ"
                  tooltipText={isKhmer 
                    ? "ទិដ្ឋភាពទូទៅនៃចំណូលលក់ប្រចាំខែ។" 
                    : "Monthly Sales Performance overview."}
                >
                  <div className="h-[180px] flex items-end gap-[7px]">
                    {monthlyData.map((v, i) => (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center gap-[5px]"
                      >
                        <div className="w-full h-[155px] relative bg-[rgba(156,163,175,0.12)] rounded-t-[7px] group cursor-pointer hover:bg-[rgba(62,207,142,0.15)] transition-colors">
                          <div
                            className="absolute bottom-0 w-full bg-[#3ecf8e] rounded-t-[7px] transition-all duration-500 ease-in-out opacity-80 group-hover:opacity-100"
                            style={{ height: `${(v / 600) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-[#6b7280]">
                          {isKhmer ? `សប្តាហ៍ទី ${i + 1}` : `Week ${i + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              </div>

              {/* ── Expenses Breakdown ── */}
              <div className={`border rounded-[14px] px-[26px] py-[22px] transition-colors duration-500 ${isDark ? "bg-[#0d1117] border-white/[0.06]" : "bg-white border-[#e8eaed]"}`}>
                <div className="flex items-center justify-between mb-[20px]">
                  <div>
                    <div className={`text-sm font-semibold transition-colors duration-500 ${isDark ? "text-[#e6edf3]" : "text-[#111827]"}`}>
                      {isKhmer ? "ចំណាយ" : "Expenses"}
                    </div>
                    <div className="text-[11px] text-[#6b7280] mt-0.5">
                      ចំណាយតាមប្រភេទ
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-[16px] mb-[24px]">
                  {EXP_BREAKDOWN.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center gap-4 cursor-help"
                      onMouseEnter={(e) =>
                        setTooltip({
                          content: `Unlock dynamic expense categorization for ${item.labelEn} with an account.`,
                          x: e.clientX,
                          y: e.clientY,
                        })
                      }
                      onMouseLeave={() =>
                        setTooltip({ content: null, x: 0, y: 0 })
                      }
                    >
                      <div className="w-[90px] shrink-0">
                        <div className={`text-[12.5px] font-medium leading-tight transition-colors duration-500 ${isDark ? "text-[#e6edf3]" : "text-[#111827]"}`}>
                          {item.label}
                        </div>
                      </div>
                      <div className={`flex-1 h-[6px] rounded-full overflow-hidden transition-colors duration-500 ${isDark ? "bg-white/5" : "bg-[#f0f2f5]"}`}>
                        <div
                          className="h-full rounded-full transition-[width] duration-700 ease-out"
                          style={{
                            width: `${item.pct}%`,
                            background: item.color,
                          }}
                        />
                      </div>
                      <div className="w-[36px] text-right text-[12.5px] font-bold text-[#6b7280] shrink-0">
                        {item.pct}%
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick log form */}
                <div className="pt-[18px] border-t border-[#f0f2f5]">
                  <div className="text-[10.5px] font-bold text-[#6b7280] uppercase tracking-[0.06em] mb-3 flex items-center gap-1.5">
                    {isKhmer ? "កត់ត្រារហ័ស · ចំណាយ (Demo)" : "Quick Log · Expenses (Demo)"}
                  </div>
                  <div className="flex flex-wrap gap-3 items-end">
                    <div className="relative w-[140px]">
                      <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#6b7280]">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        className={`w-full pl-7 pr-3 py-[10px] border rounded-[10px] text-[15px] font-bold outline-none transition-colors duration-500 ${isDark ? "bg-white/5 border-white/10 text-white focus:border-[#3ecf8e]" : "bg-white border-[#e8eaed] text-[#111827] focus:border-[#3ecf8e]"}`}
                        style={{ fontFamily: "inherit" }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-[6px]">
                      {EXP_BREAKDOWN.slice(0, 3).map((cat) => (
                        <button
                          key={cat.key}
                          className={`px-3 py-[7px] rounded-[8px] text-[12px] font-semibold border cursor-pointer transition-colors duration-500 ${isDark ? "bg-white/5 border-white/10 text-[#7d8590] hover:bg-white/10 hover:text-white" : "bg-white border-[#e8eaed] text-[#6b7280] hover:bg-[#f0f2f5] hover:text-[#111827]"} focus:border-[#3ecf8e] focus:text-[#3ecf8e] focus:bg-[rgba(62,207,142,0.05)]`}
                        >
                          {cat.labelEn}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder={isKhmer ? "បន្ថែមចំណាំ..." : "Add note..."}
                      className={`flex-1 min-w-[160px] px-[14px] py-[10px] border rounded-[10px] text-[13px] outline-none transition-colors duration-500 ${isDark ? "bg-white/5 border-white/10 text-white focus:border-[#3ecf8e]" : "bg-white border-[#e8eaed] text-[#111827] focus:border-[#3ecf8e]"}`}
                      style={{ fontFamily: "inherit" }}
                    />
                    <button
                      onClick={() =>
                        showToast(isKhmer 
                          ? "បានកត់ត្រាចំណាយ! បង្កើតគណនីដើម្បីរក្សាទុកក្នុងកំណត់ត្រារបស់អ្នកជាអចិន្ត្រៃយ៍។"
                          : "Expense logged! Create an account to permanently save to your records.",
                        )
                      }
                      className="px-6 py-[10px] rounded-[10px] text-[13px] font-bold border-0 bg-[#111827] text-white cursor-pointer shadow-[0_4px_14px_rgba(0,0,0,0.06)] hover:bg-[#1f2937] transition-colors"
                    >
                      {isKhmer ? "កត់ត្រាចំណាយ" : "Log Expense"}
                    </button>
                  </div>
                </div>
              </div>

              {/* ── End of Day Summary ── */}
              <div className="bg-[#0d1117] rounded-[14px] border border-white/[0.06] overflow-hidden">
                <div className="px-[26px] py-[18px] border-b border-white/[0.07] flex items-center justify-between">
                  <div>
                    <div className="text-[15px] font-bold text-[#e6edf3]">
                      {isKhmer ? "សេចក្តីសង្ខេបចុងថ្ងៃ" : "End-of-Day Summary"}
                    </div>
                    <div className="text-[11px] text-[#7d8590] mt-0.5">
                      សង្ខេបចុងថ្ងៃ
                    </div>
                  </div>
                </div>

                <div className="px-[26px] py-[22px]">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-[18px]">
                    <div className="px-5 py-[18px] bg-white/[0.05] rounded-xl text-center border border-white/[0.07]">
                        <div className="text-[11px] font-semibold text-[#7d8590] mb-0.5">
                          {isKhmer ? "ការលក់សរុប" : "Total Sales"}
                        </div>
                      <div className="text-[10px] text-[#4d5562] mb-[10px]">
                        ការលក់សរុប
                      </div>
                      <div className="font-bold text-[26px] text-[#e6edf3]">
                        {demoSummary.sales}
                      </div>
                    </div>
                    <div className="px-5 py-[18px] bg-[rgba(239,68,68,0.08)] rounded-xl text-center border border-[rgba(239,68,68,0.15)]">
                        <div className="text-[11px] font-semibold text-[rgba(239,68,68,0.85)] mb-0.5">
                          {isKhmer ? "ចំណាយសរុប" : "Total Expenses"}
                        </div>
                      <div className="text-[10px] text-[#4d5562] mb-[10px]">
                        ចំណាយសរុប
                      </div>
                      <div className="font-bold text-[26px] text-[#ef4444]">
                        {demoSummary.expenses}
                      </div>
                    </div>
                    <div className="px-5 py-[18px] bg-[rgba(62,207,142,0.10)] rounded-xl text-center border border-[rgba(62,207,142,0.20)]">
                        <div className="text-[11px] font-semibold text-[#3ecf8e] mb-0.5">
                          {isKhmer ? "ប្រាក់ចំណេញ" : "Net Profit"}
                        </div>
                      <div className="text-[10px] text-[#4d5562] mb-[10px]">
                        ប្រាក់ចំណេញ
                      </div>
                      <div className="font-bold text-[26px] text-[#3ecf8e]">
                        {demoSummary.profit}
                      </div>
                    </div>
                  </div>

                  <div className="text-[12.5px] text-[#7d8590] mb-[18px]">
                    {isKhmer 
                      ? `គណនាដោយស្វ័យប្រវត្តិ (ទិន្នន័យសាកល្បង)៖ ${demoSummary.sales} − ${demoSummary.expenses} = `
                      : `Auto-calculated (Demo data): ${demoSummary.sales} − ${demoSummary.expenses} = `}
                    <strong className="text-[#e6edf3]">
                      {demoSummary.profit}
                    </strong>
                  </div>

                  <button
                    onClick={() =>
                      showToast(isKhmer
                        ? "បានបញ្ជាក់ថ្ងៃនេះ! ចុះឈ្មោះដើម្បីបង្កើតរបាយការណ៍គណនេយ្យចុងក្រោយរបស់អ្នក។"
                        : "Day confirmed! Sign up to generate your final accounting report.",
                      )
                    }
                    className="w-full flex items-center justify-center gap-[9px] bg-[#3ecf8e] text-[#0d1117] font-bold text-[15px] py-4 rounded-[11px] border-0 cursor-pointer hover:bg-[#4dd49a] transition-colors shadow-[0_2px_14px_rgba(62,207,142,0.2)]"
                  >
                    <CheckCircle2 size={18} />
                    {isKhmer ? "បញ្ជាក់ និងចាក់សោថ្ងៃ" : "Confirm & Lock Day"}
                  </button>
                </div>
              </div>

              <div className="h-4" />
            </div>
          </div>
        </main>
      </div>
    </TooltipContext.Provider>
  );
}

// ─── ChartCard (custom, kept as is) ────────────────────────────────
function ChartCard({
  title,
  khmer,
  children,
  tooltipText,
}: {
  title: string;
  khmer: string;
  children: React.ReactNode;
  tooltipText?: string;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const setTooltip = useContext(TooltipContext);

  return (
    <div
      className={`border rounded-[14px] px-[26px] py-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] cursor-help flex flex-col h-full transition-colors duration-500 ${isDark ? "bg-[#0d1117] border-white/[0.06]" : "bg-white border-[#e8eaed]"}`}
      onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
        if (tooltipText)
          setTooltip({ content: tooltipText, x: e.clientX, y: e.clientY });
      }}
      onMouseLeave={() => setTooltip({ content: null, x: 0, y: 0 })}
    >
      <div className={`text-sm font-semibold mb-0.5 transition-colors duration-500 ${isDark ? "text-[#e6edf3]" : "text-[#111827]"}`}>{title}</div>
      <div className="text-[11px] text-[#6b7280] mb-5">{khmer}</div>
      {children}
    </div>
  );
}
