"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, CircleDollarSign, Receipt, Users, Settings,
  Plus, TrendingDown, Menu, X, Bell, ChevronRight,
  Search, Camera, Tag, Clock, Pencil, Trash2,
  Filter, CheckCircle2, AlertCircle, RotateCcw,
  PanelLeftClose, PanelLeftOpen, Lock, Info,
} from "lucide-react";

// Reusable components
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorTopbar from "@/components/vendor/VendorTopbar";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useUser } from "@/components/providers/UserProvider";

// ─── Types ────────────────────────────────────────────────────────
type Category = "Stock Purchase" | "Rent" | "Transport" | "Electricity" | "Labor" | "Others";
type ToastT   = { id: number; msg: string; type: "success" | "error" | "undo" | "locked"; expId?: string };

interface NavItemProps { icon: React.ElementType; title: string; href: string; active?: boolean; collapsed?: boolean; }

interface Expense {
  id:          string;
  time:        string;
  category:    Category;
  note:        string;
  amount:      number;
  hasReceipt:  boolean;
  deletedAt?:  number;
}

// ─── Demo Tooltip Component ──────────────────────────────────────
const DemoTooltip = ({ title, desc, children, position = "top" }: { title: string, desc: string, children: React.ReactNode, position?: "top" | "bottom" }) => (
  <div className="group relative w-full block">
    {children}
    <div className={`absolute z-[100] left-1/2 -translate-x-1/2 w-[280px] p-4 bg-[#0d1117] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none
      ${position === "top" ? "bottom-full mb-3 translate-y-2 group-hover:translate-y-0" : "top-full mt-3 -translate-y-2 group-hover:translate-y-0"}
    `}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-[#3ecf8e]/20 flex items-center justify-center">
          <Info size={14} className="text-[#3ecf8e]" />
        </div>
        <span className="text-[14px] font-bold text-white tracking-tight">{title}</span>
      </div>
      <p className="text-[12.5px] text-[#9ca3af] leading-relaxed font-medium">{desc}</p>
      {/* Arrow */}
      {position === "top" ? (
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#0d1117]"></div>
      ) : (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-[#0d1117]"></div>
      )}
    </div>
  </div>
);

// ─── Helpers ──────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const nowTime = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

// ─── Constants ────────────────────────────────────────────────────
const CATEGORIES: { value: Category; label: string; khmer: string; color: string }[] = [
  { value: "Stock Purchase", label: "Stock Purchase", khmer: "ទិញស្តុក",    color: "#3ecf8e" },
  { value: "Rent",        label: "Rent",        khmer: "ថ្លៃជួល",      color: "#3b82f6" },
  { value: "Transport",   label: "Transport",   khmer: "ការធ្វើដំណើរ", color: "#8b5cf6" },
  { value: "Electricity", label: "Electricity", khmer: "អគ្គិសនី",     color: "#f59e0b" },
  { value: "Labor",       label: "Labor",       khmer: "កម្លាំងពលកម្ម",color: "#ef4444" },
  { value: "Others",      label: "Others",      khmer: "ផ្សេងៗ",       color: "#6366f1" },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.value, c]));

const INITIAL_EXPENSES: Expense[] = [
  { id: uid(), time: "2:15 PM",   category: "Stock Purchase", note: "Wholesale stock reorder",   amount: 25.00, hasReceipt: false },
  { id: uid(), time: "10:00 AM",  category: "Transport",   note: "TukTuk to market",       amount:  3.50, hasReceipt: false },
  { id: uid(), time: "Yesterday", category: "Electricity", note: "Weekly stall power",     amount: 15.00, hasReceipt: true  },
  { id: uid(), time: "Yesterday", category: "Labor",       note: "Assistant pay",          amount: 10.00, hasReceipt: false },
  { id: uid(), time: "2 days ago",category: "Rent",        note: "Monthly stall rent",     amount: 80.00, hasReceipt: true  },
];

// ═════════════════════════════════════════════════════════════════
export default function ExpensesDemoDashboard() {
  const { resolvedTheme } = useTheme();
  const { language, t } = useLanguage();
  const { user, loading } = useUser();
  const isDark = resolvedTheme === "dark";
  const isKhmer = language === "km";

  // Initials logic
  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase();
  };

  const displayInitials = user?.fullName ? getInitials(user.fullName) : (loading ? ".." : "SM");

  const [isSidebarOpen,      setIsSidebarOpen]      = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expenses,           setExpenses]           = useState<Expense[]>(INITIAL_EXPENSES);
  const [toasts,             setToasts]             = useState<ToastT[]>([]);
  const [search,             setSearch]             = useState("");

  // Demo Specific State
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setIsSidebarOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const dismissToast = (id: number) => setToasts(p => p.filter(t => t.id !== id));

  // Demo Interceptor
  const triggerDemoLock = (e?: any) => {
    if (e && typeof e === 'object' && 'stopPropagation' in e) e.stopPropagation();
    const mid = Date.now();
    const msg = isKhmer ? "ទិដ្ឋភាពភ្ញៀវ៖ ការកែសម្រួលត្រូវបានដាក់កម្រិត" : "Guest View: Editing is restricted";
    setToasts(p => [...p, { id: mid, msg, type: "locked" }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== mid)), 3500);
    setShowDemoModal(true);
  };

  const active      = expenses.filter(e => !e.deletedAt);
  const filtered    = active.filter(e => e.note.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()));
  const todayTotal  = active.reduce((s, e) => s + e.amount, 0);
  const weeklyTotal = 180.50;
  const topCat      = CATEGORIES.find(c => c.value === "Stock Purchase")!;

  return (
    <div className={`flex flex-col h-screen overflow-hidden transition-colors duration-500 ${isDark ? "bg-[#0b0f14]" : "bg-[#f0f2f5]"} ${isKhmer ? "font-battambang" : ""}`}>
      {/* ── Guest Mode Strip ── */}
      <div className={`shrink-0 border-b py-2 text-center flex items-center justify-center h-[36px] transition-colors duration-500 ${isDark ? "bg-[#0d1117] border-white/10" : "bg-[#111827] border-[#3ecf8e]/20"}`}>
        <span className="text-xs text-[#e6edf3]">
          {isKhmer ? "អ្នកកំពុងស្ថិតក្នុង Guest Mode — ទិន្នន័យនឹងមិនត្រូវបានរក្សាទុកទេ" : "You are in Guest Mode — data will not be saved"}
        </span>
        <button 
          onClick={triggerDemoLock} 
          className="ml-3 text-xs font-bold text-[#3ecf8e] hover:underline cursor-pointer"
        >
          {isKhmer ? "បង្កើតគណនី →" : "Create account →"}
        </button>
      </div>

      <div className={`flex flex-1 overflow-hidden transition-colors duration-500 ${isDark ? "bg-[#0b0f14] text-[#e6edf3]" : "bg-[#f0f2f5] text-[#111827]"}`} style={{ fontFamily: "inherit" }}>

      {isSidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* ── Toasts ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.18)] text-[13.5px] font-semibold min-w-[280px] border animate-in slide-in-from-bottom-4 ${
            t.type === "locked" || t.type === "undo" ? "bg-[#0d1117] text-[#e6edf3] border-white/[0.1]" :
            t.type === "error" ? "bg-white text-[#ef4444] border-[#fecaca]" : "bg-white text-[#111827] border-[#e8eaed]"
          }`}>
            {t.type === "locked"  && <Lock          size={16} className="text-yellow-400 shrink-0" />}
            {t.type === "success" && <CheckCircle2 size={16} className="text-[#3ecf8e] shrink-0" />}
            {t.type === "error"   && <AlertCircle  size={16} className="text-[#ef4444] shrink-0" />}
            {t.type === "undo"    && <Trash2       size={16} className="text-[#7d8590] shrink-0" />}
            <span className="flex-1">{t.msg}</span>
            <button onClick={() => dismissToast(t.id)} className="bg-transparent border-0 cursor-pointer text-[#7d8590] hover:text-[#e6edf3] p-0 ml-1"><X size={14} /></button>
          </div>
        ))}
      </div>

      {/* ── Demo Modal ── */}
      {showDemoModal && (
        <div className="fixed inset-0 z-[200] bg-[#0d1117]/80 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setShowDemoModal(false)}>
          <div className="bg-white w-full max-w-md rounded-[24px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] transform animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={36} className="text-yellow-500" />
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight text-[#111827]">
                {isKhmer ? "បើកសិទ្ធិចូលប្រើប្រាស់ពេញលេញ" : "Unlock Full Access"}
              </h3>
              <p className="text-[#6b7280] text-[14px] mb-8 leading-relaxed font-medium">
                {isKhmer 
                  ? "អ្នកកំពុងស្ថិតក្នុង Guest View។ បង្កើតគណនីឥតគិតថ្លៃដើម្បីកត់ត្រាការចំណាយពិតប្រាកដ កែសម្រួលប្រវត្តិ និងគ្រប់គ្រងហាងរបស់អ្នក។"
                  : "You're currently in Guest View. Create a free account to log real expenses, edit history, and manage your store."}
              </p>
              <div className="space-y-3">
                <button onClick={() => (window.location.href = "/signup")} className="w-full py-3.5 bg-[#3ecf8e] text-[#0d1117] font-bold rounded-[12px] hover:bg-[#4dd49a] transition-all shadow-[0_4px_14px_rgba(62,207,142,0.3)]">
                  {isKhmer ? "បង្កើតគណនីឥតគិតថ្លៃ" : "Create Free Account"}
                </button>
                <button onClick={() => setShowDemoModal(false)} className="w-full py-3.5 bg-[#f0f2f5] text-[#6b7280] font-bold rounded-[12px] hover:bg-[#e8eaed] transition-all border-0 cursor-pointer">
                  {isKhmer ? "បន្តមើលការសាកល្បង" : "Keep Browsing Demo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ SIDEBAR ══════════════════════════════════════════════ */}
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
        currentPath="/guest/expenses"
        collapsed={isSidebarCollapsed}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* ══ MAIN ══════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* ── Topbar ── */}
        <VendorTopbar
          title="Expenses"
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          setIsMobileSidebarOpen={setIsSidebarOpen}
          rightActions={
            <>
              <DemoTooltip 
                title={isKhmer ? "កត់ត្រាចំណាយ" : "Log Expense"} 
                desc={isKhmer ? "កត់ត្រាការទូទាត់ចេញថ្មី។ (មិនអាចប្រើបានក្នុងការសាកល្បង)" : "Record new outgoing payments. (Disabled in Demo)"} 
                position="bottom"
              >
                <button onClick={triggerDemoLock} className="flex items-center gap-[7px] bg-[#3ecf8e] text-[#0d1117] border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer shadow-[0_2px_14px_rgba(62,207_142,0.28)] hover:bg-[#4dd49a] transition-colors">
                  <Plus size={14} /> {isKhmer ? "បន្ថែមចំណាយ" : "Add Expense"}
                </button>
              </DemoTooltip>
                <div className="w-[34px] h-[34px] rounded-full bg-[rgba(62,207,142,0.12)] border-[1.5px] border-[#3ecf8e] flex items-center justify-center text-[11px] font-bold text-[#3ecf8e]">
                  {loading ? ".." : displayInitials}
                </div>
            </>
          }
        />

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px]">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-5">

            {/* ── Page header ── */}
            <div className="pt-1 pb-2 flex justify-between items-center">
              <div>
                <h2 className={`text-[32px] font-extrabold leading-tight transition-colors duration-500 ${isDark ? "text-[#e6edf3]" : "text-[#111827]"}`}>
                  {isKhmer ? "ចំណាយរបស់ខ្ញុំ" : "My Expenses"}
                </h2>
                <p className="text-[14px] text-[#6b7280] mt-1">
                  {isKhmer ? "តាមដាន និងគ្រប់គ្រងការចំណាយរបស់អ្នក" : "Track and manage your spending"}
                </p>
              </div>
              <div className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={12} /> Guest Demo Mode
              </div>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
               <DemoTooltip 
                title={isKhmer ? "ការចំណាយប្រចាំថ្ងៃ" : "Daily Spending"} 
                desc={isKhmer ? "ការចំណាយសរុបដែលបានកត់ត្រាសម្រាប់ថ្ងៃនេះ។" : "Total expenses logged for today. Monitor daily cash out."}
              >
                <VendorSummaryCard
                  variant={isDark ? "dark" : "light"}
                  title={isKhmer ? "ចំណាយថ្ងៃនេះ" : "Today's Expenses"}
                  khmerTitle="ចំណាយថ្ងៃនេះ"
                  value={`$${todayTotal.toFixed(2)}`}
                  subtext={isKhmer ? `${active.length} ប្រតិបត្តិការ` : `${active.length} txns`}
                />
              </DemoTooltip>

               <DemoTooltip 
                title={isKhmer ? "ចំណាយច្រើនជាងគេ" : "Highest Expense"} 
                desc={isKhmer ? "ប្រភេទដែលអ្នកកំពុងចំណាយច្រើនបំផុត។" : "The category where you are currently spending the most capital."}
              >
                <VendorSummaryCard
                  variant={isDark ? "dark" : "light"}
                  title={isKhmer ? "ប្រភេទចំណាយច្រើនជាងគេ" : "Top Category"}
                  khmerTitle="ប្រភេទច្រើនជាងគេ"
                  value={isKhmer ? topCat.khmer : topCat.label}
                  subtext={isKhmer ? topCat.label : topCat.khmer}
                />
              </DemoTooltip>

               <DemoTooltip 
                title={isKhmer ? "សរុបប្រចាំសប្តាហ៍" : "Weekly Total"} 
                desc={isKhmer ? "ការចំណាយសរុបក្នុងរយៈពេល ៧ ថ្ងៃចុងក្រោយ។" : "Cumulative spending over the last 7 days."}
              >
                <VendorSummaryCard
                  variant="green"
                  title={isKhmer ? "ចំណាយសប្តាហ៍នេះ" : "Weekly Expenses"}
                  khmerTitle="ចំណាយប្រចាំសប្តាហ៍"
                  value={`$${weeklyTotal.toFixed(2)}`}
                  trend="+5%"
                  trendDirection="up"
                />
              </DemoTooltip>

               <DemoTooltip 
                title={isKhmer ? "ការរំពឹងទុកប្រចាំខែ" : "Monthly Forecast"} 
                desc={isKhmer ? "ការចំណាយសរុបសម្រាប់វដ្តវិក្កយបត្របច្ចុប្បន្ន។" : "Total rolling expenses for the current billing cycle."}
              >
                <VendorSummaryCard
                  variant={isDark ? "dark" : "light"}
                  title={isKhmer ? "សរុបខែនេះ" : "Monthly Total"}
                  khmerTitle="សរុបប្រចាំខែ"
                  value="$650.00"
                  subtext={isKhmer ? "ខែនេះ" : "this month"}
                />
              </DemoTooltip>
            </div>

            {/* ── Category breakdown mini bars ── */}
            <div className={`border rounded-[14px] px-[26px] py-[22px] transition-colors duration-500 ${isDark ? "bg-[#0d1117] border-white/[0.06]" : "bg-white border-[#e8eaed]"}`}>
              <div className={`text-[14px] font-semibold mb-0.5 transition-colors duration-500 ${isDark ? "text-[#e6edf3]" : "text-[#111827]"}`}>
                {isKhmer ? "ចំណាយតាមប្រភេទ" : "Breakdown by Category"}
              </div>
              <div className="text-[11px] text-[#6b7280] mb-5">
                {isKhmer ? "ចំណាយតាមប្រភេទសរុប" : "Spending divided by category type"}
              </div>
              <div className="flex flex-col gap-[14px]">
                {CATEGORIES.map(cat => {
                  const catTotal = active.filter(e => e.category === cat.value).reduce((s, e) => s + e.amount, 0);
                  const pct = todayTotal > 0 ? Math.round((catTotal / todayTotal) * 100) : 0;
                  return (
                    <div key={cat.value} className="flex items-center gap-4">
                      <div className="w-[100px] shrink-0">
                        <div className={`text-[12.5px] font-medium transition-colors duration-500 ${isDark ? "text-[#e6edf3]" : "text-[#111827]"}`}>
                          {isKhmer ? cat.khmer : cat.label}
                        </div>
                        <div className={`text-[10.5px] transition-colors duration-500 ${isDark ? "text-[#7d8590]" : "text-[#9ca3af]"}`}>{isKhmer ? cat.label : cat.khmer}</div>
                      </div>
                      <div className={`flex-1 h-[6px] rounded-full overflow-hidden transition-colors duration-500 ${isDark ? "bg-white/[0.05]" : "bg-[#f0f2f5]"}`}>
                        <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${pct}%`, background: cat.color }} />
                      </div>
                      <div className="w-[60px] text-right">
                        <span className={`text-[12.5px] font-bold transition-colors duration-500 ${isDark ? "text-[#e6edf3]" : "text-[#111827]"}`}>{pct > 0 ? `$${catTotal.toFixed(2)}` : "—"}</span>
                      </div>
                      <div className="w-[34px] text-right text-[11.5px] text-[#6b7280] shrink-0">{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Expense History table ── */}
             <DemoTooltip 
              title={isKhmer ? "សៀវភៅបញ្ជីចំណាយ" : "Expense Ledger"} 
              desc={isKhmer ? "ប្រវត្តិនៃការចំណាយពេញលេញរបស់អ្នក។ (ការកែសម្រួលត្រូវបានដាក់កម្រិតក្នុងការសាកល្បង)" : "Full history of your logged expenses. Searchable by category or note. (Edits disabled in Demo)"}
            >
              <div className={`border rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors duration-500 ${isDark ? "bg-[#0d1117] border-white/[0.06]" : "bg-white border-[#e8eaed]"}`}>
                <div className={`px-[22px] py-4 border-b flex items-center justify-between gap-3 flex-wrap transition-colors duration-500 ${isDark ? "border-white/[0.07]" : "border-[#f0f2f5]"}`}>
                  <div>
                    <div className={`text-[14px] font-semibold transition-colors duration-500 ${isDark ? "text-[#e6edf3]" : "text-[#111827]"}`}>
                      {isKhmer ? "ប្រវត្តិនៃការចំណាយ" : "Expense History"}
                    </div>
                    <div className="text-[11px] text-[#6b7280] mt-0.5">{active.length} {isKhmer ? "កំណត់ត្រា" : "record"}{active.length !== 1 ? (isKhmer ? "" : "s") : ""} · {isKhmer ? "ចុចលើជួរដើម្បីកែសម្រួល" : "Click row to edit"}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search size={13} className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none" />
                      <input type="text" placeholder={isKhmer ? "ស្វែងរក..." : "Search expenses..."} value={search} onChange={e => setSearch(e.target.value)}
                        className={`pl-[33px] pr-4 py-[9px] border rounded-[9px] text-[13px] outline-none transition-colors w-[200px] ${isDark ? "bg-white/5 border-white/10 text-white focus:border-[#3ecf8e]" : "bg-[#f7f8fa] border-[#e8eaed] text-[#111827] focus:border-[#3ecf8e]"}`}
                        style={{ fontFamily: "inherit" }} />
                    </div>
                    <button className={`w-[38px] h-[38px] flex items-center justify-center border rounded-[9px] transition-colors ${isDark ? "bg-white/5 border-white/10 text-[#7d8590] hover:text-white" : "bg-[#f7f8fa] border-[#e8eaed] text-[#6b7280] hover:bg-[#eff0f2]"} cursor-pointer`}>
                      <Filter size={14} />
                    </button>
                  </div>
                </div>

                <table className="w-full text-left">
                  <thead>
                    <tr className={`border-b text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em] transition-colors duration-500 ${isDark ? "bg-white/[0.02] border-white/[0.07]" : "bg-slate-50/50 border-slate-100"}`}>
                      <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">{isKhmer ? "ម៉ោង" : "Time"}</th>
                      <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">{isKhmer ? "ប្រភេទ" : "Category"}</th>
                      <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">{isKhmer ? "សម្គាល់" : "Note"}</th>
                      <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em] text-right">{isKhmer ? "ទឹកប្រាក់" : "Amount"}</th>
                      <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em] text-right">{isKhmer ? "សកម្មភាព" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length ? filtered.map((e, i) => {
                      const cat = CAT_MAP[e.category];
                      return (
                        <tr key={e.id} className={`group transition-colors cursor-pointer border-b transition-colors duration-500 ${isDark ? "hover:bg-white/5 border-white/[0.07]" : "hover:bg-[#f7f8fa] border-[#f0f2f5]"}`} onClick={triggerDemoLock}>
                          <td className="px-[22px] py-[14px] text-[13px] text-[#6b7280] whitespace-nowrap">
                            <div className="flex items-center gap-1.5"><Clock size={12} className="text-[#9ca3af]" />{e.time}</div>
                          </td>
                          <td className="px-[22px] py-[14px]">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[11.5px] font-semibold border" style={{ background: `${cat.color}14`, color: cat.color, borderColor: `${cat.color}30` }}>
                              {isKhmer ? cat.khmer : cat.label}
                            </span>
                          </td>
                          <td className="px-[22px] py-[14px]">
                            <div className="flex items-center gap-2">
                              <span className={`text-[13px] font-medium truncate max-w-[220px] transition-colors duration-500 ${isDark ? "text-[#e6edf3]" : "text-[#111827]"}`}>{e.note || "—"}</span>
                              {e.hasReceipt && <Camera size={13} className="text-[#3ecf8e] shrink-0" />}
                            </div>
                          </td>
                          <td className="px-[22px] py-[14px] text-[13.5px] font-bold text-[#ef4444] text-right whitespace-nowrap">-${e.amount.toFixed(2)}</td>
                          <td className="px-[22px] py-[14px] text-right" onClick={ev => ev.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={triggerDemoLock} className={`w-8 h-8 rounded-[8px] border-0 flex items-center justify-center cursor-pointer transition-colors ${isDark ? "bg-transparent hover:bg-white/5 text-[#7d8590] hover:text-[#e6edf3]" : "bg-transparent hover:bg-[#f0f2f5] text-[#6b7280] hover:text-[#111827]"}`}><Pencil size={13} /></button>
                              <button onClick={triggerDemoLock} className={`w-8 h-8 rounded-[8px] border-0 flex items-center justify-center cursor-pointer transition-colors ${isDark ? "bg-transparent hover:bg-red-500/10 text-red-400" : "bg-transparent hover:bg-[rgba(239,68,68,0.08)] text-[#6b7280] hover:text-[#ef4444]"}`}><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={5} className="px-[22px] py-14 text-center">
                           <div className="text-[13px] text-[#9ca3af]">{search ? (isKhmer ? "មិនមានចំណាយដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ" : "No expenses match your search") : (isKhmer ? "មិនទាន់មានចំណាយនៅឡើយទេ — កត់ត្រាចំណាយដំបូងរបស់អ្នក!" : "No expenses yet — log your first one!")}</div>
                          {!search && <button onClick={triggerDemoLock} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#3ecf8e] bg-transparent border-0 cursor-pointer hover:underline"><Plus size={14} /> {isKhmer ? "បន្ថែមចំណាយដំបូង" : "Add first expense"}</button>}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {active.length > 0 && (
                  <div className={`px-[22px] py-3 border-t flex items-center justify-between transition-colors duration-500 ${isDark ? "border-white/[0.07]" : "border-[#f0f2f5]"}`}>
                     <span className="text-[12px] text-[#9ca3af]">
                      {filtered.length} {isKhmer ? "ក្នុងចំណោម" : "of"} {active.length} {isKhmer ? "កំណត់ត្រា" : "records"}
                    </span>
                    <span className={`text-[13px] font-bold transition-colors duration-500 ${isDark ? "text-[#e6edf3]" : "text-[#111827]"}`}>
                      {isKhmer ? "សរុប" : "Total"}: <span className="text-[#ef4444]">${filtered.reduce((s, e) => s + e.amount, 0).toFixed(2)}</span>
                    </span>
                  </div>
                )}
              </div>
            </DemoTooltip>

             <div className="flex items-center gap-2 px-1">
               <RotateCcw size={12} className="text-[#9ca3af]" />
               <span className="text-[11.5px] text-[#9ca3af]">
                 {isKhmer 
                  ? "កំណត់ត្រាដែលបានលុបអាចទាញយកមកវិញក្នុងរយៈពេល ៥ វិនាទី · ចុចលើជួរណាមួយដើម្បីកែសម្រួល"
                  : "Deleted records can be undone within 5 seconds · Click any row to edit"}
               </span>
             </div>
            <div className="h-4" />
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

// ─── END COMPONENT ────────────────────────────────────────────────