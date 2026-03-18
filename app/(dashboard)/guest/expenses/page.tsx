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
import FreeSidebar from "@/components/vendor/FreeSidebar";
import FreeTopbar from "@/components/vendor/FreeTopbar";
import FreeStatCard from "@/components/vendor/FreeStatCard";

// ─── Types ────────────────────────────────────────────────────────
type Category = "Ingredients" | "Rent" | "Transport" | "Electricity" | "Labor" | "Others";
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
  { value: "Ingredients", label: "Ingredients", khmer: "គ្រឿងផ្សំ",    color: "#3ecf8e" },
  { value: "Rent",        label: "Rent",        khmer: "ថ្លៃជួល",      color: "#3b82f6" },
  { value: "Transport",   label: "Transport",   khmer: "ការធ្វើដំណើរ", color: "#8b5cf6" },
  { value: "Electricity", label: "Electricity", khmer: "អគ្គិសនី",     color: "#f59e0b" },
  { value: "Labor",       label: "Labor",       khmer: "កម្លាំងពលកម្ម",color: "#ef4444" },
  { value: "Others",      label: "Others",      khmer: "ផ្សេងៗ",       color: "#6366f1" },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.value, c]));

const INITIAL_EXPENSES: Expense[] = [
  { id: uid(), time: "2:15 PM",   category: "Ingredients", note: "Pork and Vegetables",   amount: 25.00, hasReceipt: false },
  { id: uid(), time: "10:00 AM",  category: "Transport",   note: "TukTuk to market",       amount:  3.50, hasReceipt: false },
  { id: uid(), time: "Yesterday", category: "Electricity", note: "Weekly stall power",     amount: 15.00, hasReceipt: true  },
  { id: uid(), time: "Yesterday", category: "Labor",       note: "Assistant pay",          amount: 10.00, hasReceipt: false },
  { id: uid(), time: "2 days ago",category: "Rent",        note: "Monthly stall rent",     amount: 80.00, hasReceipt: true  },
];

// ═════════════════════════════════════════════════════════════════
export default function ExpensesDemoDashboard() {
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
  const triggerDemoLock = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const id = Date.now();
    setToasts(p => [...p, { id, msg: "Guest View: Editing is restricted", type: "locked" }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
    setShowDemoModal(true);
  };

  const active      = expenses.filter(e => !e.deletedAt);
  const filtered    = active.filter(e => e.note.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()));
  const todayTotal  = active.reduce((s, e) => s + e.amount, 0);
  const weeklyTotal = 180.50;
  const topCat      = CATEGORIES.find(c => c.value === "Ingredients")!;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5] text-[#111827]" style={{ fontFamily: "inherit" }}>

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
              <h3 className="text-2xl font-black mb-2 tracking-tight text-[#111827]">Unlock Full Access</h3>
              <p className="text-[#6b7280] text-[14px] mb-8 leading-relaxed font-medium">
                You're currently in <b>Guest View</b>. Create a free account to log real expenses, edit history, and manage your store.
              </p>
              <div className="space-y-3">
                <button onClick={() => window.location.reload()} className="w-full py-3.5 bg-[#3ecf8e] text-[#0d1117] font-bold rounded-[12px] hover:bg-[#4dd49a] transition-all shadow-[0_4px_14px_rgba(62,207,142,0.3)]">
                  Create Free Account
                </button>
                <button onClick={() => setShowDemoModal(false)} className="w-full py-3.5 bg-[#f0f2f5] text-[#6b7280] font-bold rounded-[12px] hover:bg-[#e8eaed] transition-all border-0 cursor-pointer">
                  Keep Browsing Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ SIDEBAR ══════════════════════════════════════════════ */}
      <FreeSidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsOpen={setIsSidebarOpen}
        currentPath="/guest/expenses"
        navItems={[
          { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/guest" },
          { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/guest/sales" },
          { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/guest/expenses" },
          { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/guest/customers" },
        ]}
      />

      {/* ══ MAIN ══════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* ── Topbar ── */}
        <FreeTopbar
          title="Expenses"
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          setIsMobileSidebarOpen={setIsSidebarOpen}
          rightActions={
            <>
              <DemoTooltip title="Log Expense" desc="Record new outgoing payments. (Disabled in Demo)" position="bottom">
                <button onClick={triggerDemoLock} className="flex items-center gap-[7px] bg-[#3ecf8e] text-[#0d1117] border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer shadow-[0_2px_14px_rgba(62,207,142,0.28)] hover:bg-[#4dd49a] transition-colors">
                  <Plus size={14} /> Add Expense
                </button>
              </DemoTooltip>
              <div className="w-[34px] h-[34px] rounded-full bg-[rgba(62,207,142,0.12)] border-[1.5px] border-[#3ecf8e] flex items-center justify-center text-[11px] font-bold text-[#3ecf8e]">SM</div>
            </>
          }
        />

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px]">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-5">

            {/* ── Page header ── */}
            <div className="pt-1 pb-2 flex justify-between items-center">
              <div>
                <h2 className="text-[32px] font-extrabold text-[#111827] leading-tight">My Expenses</h2>
                <p className="text-[14px] text-[#6b7280] mt-1">Track and manage your spending · <span className="text-[#9ca3af]">តាមដាន និងគ្រប់គ្រងចំណាយ</span></p>
              </div>
              <div className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={12} /> Guest Demo Mode
              </div>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <DemoTooltip title="Daily Spending" desc="Total expenses logged for today. Monitor daily cash out.">
                <FreeStatCard
                  variant="dark"
                  title="Today's Expenses"
                  khmerTitle="ចំណាយថ្ងៃនេះ"
                  value={`$${todayTotal.toFixed(2)}`}
                  subtext={`${active.length} txns`}
                />
              </DemoTooltip>

              <DemoTooltip title="Highest Expense" desc="The category where you are currently spending the most capital.">
                <FreeStatCard
                  title="Top Category"
                  khmerTitle="ប្រភេទច្រើនជាងគេ"
                  value={topCat.label}
                  subtext={topCat.khmer}
                />
              </DemoTooltip>

              <DemoTooltip title="Weekly Total" desc="Cumulative spending over the last 7 days.">
                <FreeStatCard
                  variant="green"
                  title="Weekly Expenses"
                  khmerTitle="ចំណាយប្រចាំសប្តាហ៍"
                  value={`$${weeklyTotal.toFixed(2)}`}
                  trend="+5%"
                  trendDirection="up"
                />
              </DemoTooltip>

              <DemoTooltip title="Monthly Forecast" desc="Total rolling expenses for the current billing cycle.">
                <FreeStatCard
                  title="Monthly Total"
                  khmerTitle="សរុបប្រចាំខែ"
                  value="$650.00"
                  subtext="this month"
                />
              </DemoTooltip>
            </div>

            {/* ── Category breakdown mini bars ── */}
            <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[26px] py-[22px]">
              <div className="text-[14px] font-semibold text-[#111827] mb-0.5">Breakdown by Category</div>
              <div className="text-[11px] text-[#6b7280] mb-5">ចំណាយតាមប្រភេទ</div>
              <div className="flex flex-col gap-[14px]">
                {CATEGORIES.map(cat => {
                  const catTotal = active.filter(e => e.category === cat.value).reduce((s, e) => s + e.amount, 0);
                  const pct = todayTotal > 0 ? Math.round((catTotal / todayTotal) * 100) : 0;
                  return (
                    <div key={cat.value} className="flex items-center gap-4">
                      <div className="w-[100px] shrink-0">
                        <div className="text-[12.5px] font-medium text-[#111827]">{cat.label}</div>
                        <div className="text-[10.5px] text-[#9ca3af]">{cat.khmer}</div>
                      </div>
                      <div className="flex-1 h-[6px] bg-[#f0f2f5] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${pct}%`, background: cat.color }} />
                      </div>
                      <div className="w-[60px] text-right">
                        <span className="text-[12.5px] font-bold text-[#111827]">{pct > 0 ? `$${catTotal.toFixed(2)}` : "—"}</span>
                      </div>
                      <div className="w-[34px] text-right text-[11.5px] text-[#6b7280] shrink-0">{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Expense History table ── */}
            <DemoTooltip title="Expense Ledger" desc="Full history of your logged expenses. Searchable by category or note. (Edits disabled in Demo)">
              <div className="bg-white border border-[#e8eaed] rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <div className="px-[22px] py-4 border-b border-[#f0f2f5] flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-[14px] font-semibold text-[#111827]">Expense History</div>
                    <div className="text-[11px] text-[#6b7280] mt-0.5">{active.length} record{active.length !== 1 ? "s" : ""} · Click row to edit</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search size={13} className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none" />
                      <input type="text" placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)}
                        className="pl-[33px] pr-4 py-[9px] bg-[#f7f8fa] border border-[#e8eaed] rounded-[9px] text-[13px] outline-none text-[#111827] focus:border-[#3ecf8e] transition-colors w-[200px]"
                        style={{ fontFamily: "inherit" }} />
                    </div>
                    <button className="w-[38px] h-[38px] flex items-center justify-center border border-[#e8eaed] rounded-[9px] bg-[#f7f8fa] text-[#6b7280] hover:bg-[#eff0f2] cursor-pointer">
                      <Filter size={14} />
                    </button>
                  </div>
                </div>

                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#f0f2f5]">
                      <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">Time</th>
                      <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">Category</th>
                      <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">Note</th>
                      <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em] text-right">Amount</th>
                      <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length ? filtered.map((e, i) => {
                      const cat = CAT_MAP[e.category];
                      return (
                        <tr key={e.id} className={`group transition-colors hover:bg-[#f7f8fa] cursor-pointer ${i < filtered.length - 1 ? "border-b border-[#f0f2f5]" : ""}`} onClick={triggerDemoLock}>
                          <td className="px-[22px] py-[14px] text-[13px] text-[#6b7280] whitespace-nowrap">
                            <div className="flex items-center gap-1.5"><Clock size={12} className="text-[#9ca3af]" />{e.time}</div>
                          </td>
                          <td className="px-[22px] py-[14px]">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[11.5px] font-semibold border" style={{ background: `${cat.color}14`, color: cat.color, borderColor: `${cat.color}30` }}>
                              {e.category}
                            </span>
                          </td>
                          <td className="px-[22px] py-[14px]">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-medium text-[#111827] truncate max-w-[220px]">{e.note || "—"}</span>
                              {e.hasReceipt && <Camera size={13} className="text-[#3ecf8e] shrink-0" />}
                            </div>
                          </td>
                          <td className="px-[22px] py-[14px] text-[13.5px] font-bold text-[#ef4444] text-right whitespace-nowrap">-${e.amount.toFixed(2)}</td>
                          <td className="px-[22px] py-[14px] text-right" onClick={ev => ev.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={triggerDemoLock} className="w-8 h-8 rounded-[8px] bg-transparent hover:bg-[#f0f2f5] border-0 flex items-center justify-center cursor-pointer text-[#6b7280] hover:text-[#111827] transition-colors"><Pencil size={13} /></button>
                              <button onClick={triggerDemoLock} className="w-8 h-8 rounded-[8px] bg-transparent hover:bg-[rgba(239,68,68,0.08)] border-0 flex items-center justify-center cursor-pointer text-[#6b7280] hover:text-[#ef4444] transition-colors"><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={5} className="px-[22px] py-14 text-center">
                          <div className="text-[13px] text-[#9ca3af]">{search ? "No expenses match your search" : "No expenses yet — log your first one!"}</div>
                          {!search && <button onClick={triggerDemoLock} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#3ecf8e] bg-transparent border-0 cursor-pointer hover:underline"><Plus size={14} /> Add first expense</button>}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {active.length > 0 && (
                  <div className="px-[22px] py-3 border-t border-[#f0f2f5] flex items-center justify-between">
                    <span className="text-[12px] text-[#9ca3af]">{filtered.length} of {active.length} records</span>
                    <span className="text-[13px] font-bold text-[#111827]">Total: <span className="text-[#ef4444]">${filtered.reduce((s, e) => s + e.amount, 0).toFixed(2)}</span></span>
                  </div>
                )}
              </div>
            </DemoTooltip>

            <div className="flex items-center gap-2 px-1">
              <RotateCcw size={12} className="text-[#9ca3af]" />
              <span className="text-[11.5px] text-[#9ca3af]">Deleted records can be undone within 5 seconds · Click any row to edit</span>
            </div>
            <div className="h-4" />
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── END COMPONENT ────────────────────────────────────────────────