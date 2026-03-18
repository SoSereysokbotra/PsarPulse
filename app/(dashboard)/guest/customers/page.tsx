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
  Minus,
  Menu,
  X,
  Bell,
  Search,
  Clock,
  Zap,
  ShoppingCart,
  CheckCircle2,
  ChevronRight,
  FileText,
  FileSpreadsheet,
  PanelLeftClose,
  PanelLeftOpen,
  Info,
} from "lucide-react";

// Reusable components
import FreeSidebar from "@/components/vendor/FreeSidebar";
import FreeTopbar from "@/components/vendor/FreeTopbar";
import FreeStatCard from "@/components/vendor/FreeStatCard";

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
const TABS = [
  { id: "analysis", label: "Customers Analysis", khmer: "វិភាគអតិថិជន" },
  {
    id: "forecast",
    label: "Forecast Analytics",
    khmer: "ការព្យាករណ៍វិភាគទិន្នន័យ",
  },
  { id: "log", label: "Customers Log", khmer: "កំណត់ហេតុអតិថិជន" },
];

const PRODUCT_LIBRARY: Product[] = [
  { id: "1", name: "Coffee Latte", price: 4.5 },
  { id: "2", name: "Green Tea", price: 3.2 },
  { id: "3", name: "Fried Rice", price: 2.5 },
  { id: "4", name: "Spring Roll", price: 1.8 },
  { id: "5", name: "Coconut Water", price: 1.5 },
  { id: "6", name: "Mango Sticky Rice", price: 2.0 },
];

// ═══════════════════════════════════════════════════════════════════
export default function CustomersPage() {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [quickSaleOpen, setQuickSaleOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState("");
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [cartCustomers, setCartCustomers] = useState(1);
  const searchRef = useRef<HTMLInputElement>(null);
  const quickSaleRef = useRef<HTMLDivElement>(null);

  // Custom UI States
  const [tooltip, setTooltip] = useState<TooltipData>({
    content: null,
    x: 0,
    y: 0,
  });
  const [toast, setToast] = useState<string | null>(null);

  // Customer Page States
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("analysis");
  const [customCount, setCustomCount] = useState(1);
  const [logHistory, setLogHistory] = useState([
    { id: 1, time: "2:15 PM", count: 2, status: "Regular" },
    { id: 2, time: "10:00 AM", count: 2, status: "Peak Traffic" },
    { id: 3, time: "11:00 AM", count: 12, status: "Peak Traffic" },
  ]);

  const summaryData = {
    todayCount: 48,
    todayLogs: 4,
    avgSpend: "$5.45",
    weeklyCount: 315,
    weeklyChange: "+27% than last week",
    weeklyCustomers: "15 Customers",
    peakTime: "12:10 PM",
    avgLTV: "$102.02",
  };

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleLog = (amount: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    setLogHistory((prev) => [
      {
        id: Date.now(),
        time: timeStr,
        count: amount,
        status: amount >= 10 ? "Peak Traffic" : "Regular",
      },
      ...prev,
    ]);
    showToast(`Logged +${amount} customers! Sign up to save permanently.`);
  };

  const filteredLogs = logHistory.filter(
    (l) =>
      l.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    setMounted(true);
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Quick Sale Listeners
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
    p.name.toLowerCase().includes(quickSearchQuery.toLowerCase()),
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
    setQuickSearchQuery("");
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
    setQuickSearchQuery("");
  }, []);

  if (!mounted) return null;

  return (
    <TooltipContext.Provider value={setTooltip}>
      {/* ── Guest Mode Strip ── */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-[#0d1117] border-b border-[#3ecf8e]/20 py-2 text-center flex items-center justify-center h-[36px]">
        <span className="text-xs text-[#e6edf3]">
          You are in Guest Mode — data will not be saved
        </span>
        <button
          onClick={() => (window.location.href = "/auth")}
          className="ml-3 text-[#3ecf8e] text-xs font-semibold bg-transparent border-0 cursor-pointer hover:underline"
        >
          Create account →
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

      {/* ── Floating Tooltip ── */}
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
          <Info size={12} /> Guest Insight
        </p>
        <p>{tooltip.content}</p>
      </div>

      {/* Main layout with top padding for guest strip */}
      <div className="flex h-screen w-full overflow-hidden bg-slate-100 pt-[36px]">
        {/* Reusable Sidebar */}
        <FreeSidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          setIsOpen={setIsSidebarOpen}
          currentPath="/guest/customers"
        />

        {/* Main content area */}
        <main className="flex-1 flex flex-col w-full min-w-0 h-full overflow-hidden">
          {/* Reusable Topbar with custom right actions */}
          <FreeTopbar
            title="Customers"
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
            setIsMobileSidebarOpen={setIsSidebarOpen}
            rightActions={
              <>
                {/* Create Account button (visible on sm+) */}
                <button
                  onClick={() => (window.location.href = "/auth")}
                  className="hidden sm:block px-4 py-[9px] rounded-[10px] bg-[#3ecf8e] text-[#0d1117] text-[13px] font-bold hover:bg-[#4dd49a] transition-colors shadow-[0_2px_14px_rgba(62,207,142,0.28)] border-0 cursor-pointer"
                >
                  Create Account
                </button>

                {/* Quick Sale button with dropdown */}
                <div ref={quickSaleRef} className="relative">
                  <button
                    onClick={() => setQuickSaleOpen((o) => !o)}
                    onMouseEnter={(e) =>
                      setTooltip({
                        content:
                          "Simplified sales logging. Add products to cart and complete sales instantly.",
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }
                    onMouseLeave={() =>
                      setTooltip({ content: null, x: 0, y: 0 })
                    }
                    className={`flex items-center gap-[7px] border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer transition-all duration-200 ${quickSaleOpen ? "bg-[#0d1117] text-[#e6edf3]" : "bg-[#111827] text-white hover:bg-[#1f2937]"}`}
                  >
                    {quickSaleOpen ? (
                      <>
                        <X size={14} /> Close
                      </>
                    ) : (
                      <>
                        <Zap size={14} className="text-[#3ecf8e]" /> Quick Sale
                      </>
                    )}
                    {cartItems > 0 && !quickSaleOpen && (
                      <span className="bg-[#3ecf8e] text-[#0d1117] rounded-full w-[18px] h-[18px] text-[10px] font-extrabold flex items-center justify-center ml-0.5">
                        {cartItems}
                      </span>
                    )}
                  </button>

                  {/* Dropdown panel */}
                  {quickSaleOpen && (
                    <div
                      className="absolute top-[calc(100%+10px)] right-0 w-[330px] bg-white border border-[#e8eaed] rounded-[14px] shadow-[0_20px_56px_rgba(0,0,0,0.18)] overflow-hidden"
                      style={{ zIndex: 999 }}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2 px-[18px] py-[14px] border-b border-[#e8eaed]">
                        <ShoppingCart size={14} className="text-[#3ecf8e]" />
                        <span className="font-bold text-sm text-[#111827]">
                          Quick Sale
                        </span>
                      </div>
                      <div className="p-[14px_18px]">
                        <div className="relative mb-[14px]">
                          <Search
                            size={13}
                            className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none"
                          />
                          <input
                            ref={searchRef}
                            value={quickSearchQuery}
                            onChange={(e) =>
                              setQuickSearchQuery(e.target.value)
                            }
                            placeholder="Search product..."
                            className="w-full pl-[33px] pr-[11px] py-[9px] bg-[#f7f8fa] border border-[#e8eaed] rounded-[9px] text-[13px] outline-none focus:border-[#3ecf8e] transition-colors"
                          />
                        </div>
                        {!quickSearchQuery && (
                          <div className="mb-[14px]">
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
                                    className={`px-3 py-[9px] rounded-[9px] text-left cursor-pointer transition-all border ${inCart ? "bg-[rgba(62,207,142,0.12)] border-[#3ecf8e]" : "bg-[#f7f8fa] border-[#e8eaed] hover:bg-[#eff0f2]"}`}
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
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-[#6b7280]">
                            {cartItems} item{cartItems !== 1 ? "s" : ""}
                          </span>
                          <span className="font-extrabold text-xl text-[#3ecf8e]">
                            ${cartTotal.toFixed(2)}
                          </span>
                        </div>
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            if (cart.length) {
                              showToast(
                                "Sale recorded! Create an account to save.",
                              );
                              closeQuickSale();
                            }
                          }}
                          className={`w-full py-3 font-bold text-[13.5px] border-0 rounded-[10px] flex items-center justify-center gap-[7px] transition-all ${cart.length ? "bg-[#3ecf8e] text-[#0d1117] cursor-pointer hover:bg-[#4dd49a]" : "bg-[#f0f2f5] text-[#6b7280] cursor-not-allowed"}`}
                        >
                          <CheckCircle2 size={15} /> Confirm Sale
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User avatar */}
                <div
                  className="w-[34px] h-[34px] rounded-full bg-[rgba(156,163,175,0.12)] border-[1.5px] border-[#9ca3af] flex items-center justify-center text-[11px] font-bold text-[#9ca3af] cursor-pointer hover:bg-[rgba(156,163,175,0.2)] transition-colors"
                  onClick={() => (window.location.href = "/auth")}
                >
                  GU
                </div>
              </>
            }
          />

          {/* Scrollable page body */}
          <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px]">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
              {/* Page Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="text-[24px] font-bold text-slate-900">
                    My Customers
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    Track and log your daily foot traffic.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[13px] font-semibold px-4 py-2 rounded-[10px] transition-colors cursor-pointer">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Export PDF
                  </button>
                  <button className="flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[13px] font-semibold px-4 py-2 rounded-[10px] transition-colors cursor-pointer">
                    <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-slate-200">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 flex flex-col items-start transition-colors bg-transparent border-0 border-b-2 cursor-pointer ${
                      activeTab === tab.id
                        ? "border-[#3ecf8e] text-slate-900"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <span className="font-semibold text-sm">{tab.label}</span>
                    <span className="text-[10px] opacity-70 mt-0.5">
                      {tab.khmer}
                    </span>
                  </button>
                ))}
              </div>

              {/* 5 Summary Cards using FreeStatCard */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <FreeStatCard
                  variant="dark"
                  title="Today Customer"
                  khmerTitle="អតិថិជនថ្ងៃនេះ"
                  value={summaryData.todayCount}
                  subtext={`${summaryData.todayLogs} logs recorded`}
                />
                <FreeStatCard
                  title="Avg.Spend"
                  khmerTitle="ការចំណាយជាមធ្យម"
                  value={summaryData.avgSpend}
                  subtext="per customer"
                />
                <FreeStatCard
                  variant="green"
                  title="Weekly Customer"
                  khmerTitle="អតិថិជនសប្តាហ៍នេះ"
                  value={summaryData.weeklyCount}
                  subtext={summaryData.weeklyChange}
                />
                <FreeStatCard
                  title="Peak Time"
                  khmerTitle="ម៉ោងមមាញឹក"
                  value={summaryData.peakTime}
                  subtext={summaryData.weeklyCustomers}
                />
                <FreeStatCard
                  title="Avg.LTV"
                  khmerTitle="តម្លៃអតិថិជនមធ្យម"
                  value={summaryData.avgLTV}
                  subtext="Lifetime Value"
                />
              </div>

              {/* Log Customers Bar (custom, not reusable) */}
              <div
                className="bg-[#0d1117] border border-white/[0.06] rounded-[14px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 cursor-help"
                onMouseEnter={(e) =>
                  setTooltip({
                    content:
                      "Log walk-ins or large groups quickly. Real accounts build predictive traffic models with this data.",
                    x: e.clientX,
                    y: e.clientY,
                  })
                }
                onMouseLeave={() => setTooltip({ content: null, x: 0, y: 0 })}
              >
                <div>
                  <p className="font-bold text-white text-[15px]">
                    Log Customers
                  </p>
                  <p className="text-[11px] text-[#7d8590] mt-0.5">
                    កត់ត្រាអតិថិជន
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {[1, 5, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => handleLog(n)}
                      className="px-4 py-2 bg-[rgba(62,207,142,0.12)] border border-[#3ecf8e]/30 hover:bg-[#3ecf8e] text-[#3ecf8e] hover:text-[#0d1117] text-sm font-bold rounded-[10px] transition-all cursor-pointer min-h-[42px]"
                    >
                      +{n}
                    </button>
                  ))}

                  <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block"></div>

                  <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-[10px] overflow-hidden min-h-[42px]">
                    <button
                      onClick={() => setCustomCount((c) => Math.max(1, c - 1))}
                      className="px-3 py-2 text-[#9ca3af] hover:text-white hover:bg-white/10 transition-colors bg-transparent border-0 cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-white font-bold text-sm w-7 text-center">
                      {customCount}
                    </span>
                    <button
                      onClick={() => setCustomCount((c) => c + 1)}
                      className="px-3 py-2 text-[#9ca3af] hover:text-white hover:bg-white/10 transition-colors bg-transparent border-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleLog(customCount)}
                    className="px-5 py-2 bg-[#3ecf8e] hover:bg-[#4dd49a] text-[#0d1117] border-0 font-bold rounded-[10px] transition-colors text-sm flex items-center gap-1.5 min-h-[42px] cursor-pointer shadow-[0_2px_10px_rgba(62,207,142,0.2)]"
                  >
                    <Plus className="w-4 h-4" />
                    Log {customCount}
                  </button>
                </div>
              </div>

              {/* Log History Table (custom) */}
              <div className="bg-white border border-slate-200 rounded-[14px] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-[16px] text-slate-900">
                      Traffic History
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      ប្រវត្តិនៃការចូលរបស់អតិថិជន
                    </p>
                  </div>
                  <div className="relative w-full sm:w-auto">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-[240px] pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-[13px] focus:outline-none focus:border-[#3ecf8e] transition-colors min-h-[40px] text-slate-900"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                        <th className="px-6 py-3.5">Time Logged</th>
                        <th className="px-6 py-3.5">Customer Count</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-slate-600 text-[14px] font-medium">
                              <Clock className="w-4 h-4 text-slate-400" />
                              {log.time}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-extrabold text-slate-900">
                                +{log.count}
                              </span>
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {log.status === "Peak Traffic" ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold uppercase tracking-wider">
                                Peak Traffic
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-bold uppercase tracking-wider">
                                Regular
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button className="text-slate-300 hover:text-slate-600 text-xl tracking-widest transition-colors bg-transparent border-0 cursor-pointer">
                              ···
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredLogs.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-8 text-center text-slate-500 text-[13px]"
                          >
                            No customer logs found matching "{searchTerm}"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3.5 border-t border-slate-100 text-center bg-slate-50/50">
                  <button className="text-[#3ecf8e] text-[13px] font-bold hover:underline bg-transparent border-0 cursor-pointer">
                    View Full History →
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
