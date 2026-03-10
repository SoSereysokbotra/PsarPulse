"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, CircleDollarSign, Receipt, Users, Settings,
  Plus, TrendingDown, Menu, X, Bell, ChevronRight,
  Search, Camera, Tag, Clock, Pencil, Trash2,
  Filter, CheckCircle2, AlertCircle, RotateCcw,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────
type Category = "Ingredients" | "Rent" | "Transport" | "Electricity" | "Labor" | "Others";
type ToastT   = { id: number; msg: string; type: "success" | "error" | "undo"; expId?: string };

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
export default function ExpensesPage() {
  const [isSidebarOpen,      setIsSidebarOpen]      = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expenses,           setExpenses]           = useState<Expense[]>(INITIAL_EXPENSES);
  const [toasts,             setToasts]             = useState<ToastT[]>([]);
  const [search,             setSearch]             = useState("");

  // Modal state
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editTarget,  setEditTarget]  = useState<Expense | null>(null);
  const [fAmount,     setFAmount]     = useState("");
  const [fCategory,   setFCategory]   = useState<Category>("Ingredients");
  const [fNote,       setFNote]       = useState("");
  const [fVendor,     setFVendor]     = useState("");
  const [saving,      setSaving]      = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setIsSidebarOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    if (modalOpen) setTimeout(() => amountRef.current?.focus(), 120);
  }, [modalOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") { closeModal(); setDeleteTarget(null); } };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const toast = (msg: string, type: ToastT["type"], expId?: string) => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type, expId }]);
    if (type !== "undo") setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };
  const dismissToast = (id: number) => setToasts(p => p.filter(t => t.id !== id));

  const openAdd = () => {
    setEditTarget(null); setFAmount(""); setFCategory("Ingredients"); setFNote(""); setFVendor("");
    setModalOpen(true);
  };
  const openEdit = (e: Expense) => {
    setEditTarget(e); setFAmount(String(e.amount)); setFCategory(e.category); setFNote(e.note); setFVendor("");
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false); setSaving(false);
    setEditTarget(null); setFAmount(""); setFCategory("Ingredients"); setFNote(""); setFVendor("");
  };

  const handleSave = () => {
    if (!fAmount || isNaN(Number(fAmount))) return;
    setSaving(true);
    setTimeout(() => {
      if (editTarget) {
        setExpenses(p => p.map(e => e.id === editTarget.id ? { ...e, amount: parseFloat(fAmount), category: fCategory, note: fNote } : e));
        toast("Expense updated", "success");
      } else {
        setExpenses(p => [{ id: uid(), time: nowTime(), category: fCategory, note: fNote || "Manual entry", amount: parseFloat(fAmount), hasReceipt: false }, ...p]);
        toast("Expense logged", "success");
      }
      closeModal();
    }, 400);
  };

  const handleDelete = (e: Expense) => {
    setDeleteTarget(null);
    setExpenses(p => p.map(x => x.id === e.id ? { ...x, deletedAt: Date.now() } : x));
    const toastId = Date.now();
    setToasts(p => [...p, { id: toastId, msg: `"${e.note.slice(0, 28)}" deleted`, type: "undo", expId: e.id }]);
    setTimeout(() => {
      setExpenses(p => p.filter(x => x.id !== e.id));
      setToasts(p => p.filter(x => x.id !== toastId));
    }, 5000);
  };

  const handleUndo = (toastId: number, expId: string) => {
    setExpenses(p => p.map(e => e.id === expId ? { ...e, deletedAt: undefined } : e));
    dismissToast(toastId);
    toast("Deletion undone", "success");
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
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.18)] text-[13.5px] font-semibold min-w-[280px] border ${
            t.type === "undo" ? "bg-[#0d1117] text-[#e6edf3] border-white/[0.1]" :
            t.type === "error" ? "bg-white text-[#ef4444] border-[#fecaca]" : "bg-white text-[#111827] border-[#e8eaed]"
          }`}>
            {t.type === "success" && <CheckCircle2 size={16} className="text-[#3ecf8e] shrink-0" />}
            {t.type === "error"   && <AlertCircle  size={16} className="text-[#ef4444] shrink-0" />}
            {t.type === "undo"    && <Trash2        size={16} className="text-[#7d8590] shrink-0" />}
            <span className="flex-1">{t.msg}</span>
            {t.type === "undo" && t.expId && (
              <button onClick={() => handleUndo(t.id, t.expId!)} className="bg-[#3ecf8e] text-[#0d1117] font-bold text-[12px] px-3 py-1 rounded-[7px] cursor-pointer border-0 hover:bg-[#4dd49a]">Undo</button>
            )}
            <button onClick={() => dismissToast(t.id)} className="bg-transparent border-0 cursor-pointer text-[#7d8590] hover:text-[#111827] p-0 ml-1"><X size={14} /></button>
          </div>
        ))}
      </div>

      {/* ── Add/Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="bg-white w-full max-w-md rounded-[20px] shadow-[0_32px_80px_rgba(0,0,0,0.2)] overflow-hidden">
            <div className="bg-[#0d1117] px-7 py-5 flex items-center justify-between">
              <div>
                <div className="text-[18px] font-bold text-[#e6edf3]">{editTarget ? "Edit Expense" : "Log New Expense"}</div>
                <div className="text-[12px] text-[#7d8590] mt-0.5">{editTarget ? "កែប្រែចំណាយ" : "កត់ត្រាចំណាយថ្មី"}</div>
              </div>
              <button onClick={closeModal} className="w-9 h-9 rounded-[9px] bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[#7d8590] hover:text-[#e6edf3] cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="p-7 flex flex-col gap-5">
              {/* Amount */}
              <div>
                <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.06em] mb-2">Amount <span className="text-[#ef4444]">*</span></div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] font-bold text-[#6b7280]">$</span>
                  <input ref={amountRef} type="number" min="0" step="0.01" placeholder="0.00" value={fAmount} onChange={e => setFAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-[#f7f8fa] border border-[#e8eaed] rounded-[12px] text-[24px] font-bold outline-none text-[#111827] focus:border-[#ef4444] transition-colors"
                    style={{ fontFamily: "inherit" }} />
                </div>
              </div>
              {/* Category */}
              <div>
                <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.06em] mb-2">Category</div>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat.value} onClick={() => setFCategory(cat.value)}
                      className={`py-2.5 rounded-[10px] text-[12.5px] font-semibold border-0 cursor-pointer transition-all ${fCategory === cat.value ? "text-white" : "bg-[#f7f8fa] text-[#6b7280] hover:bg-[#eff0f2]"}`}
                      style={fCategory === cat.value ? { background: cat.color } : {}}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Note */}
              <div>
                <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.06em] mb-2">Note <span className="text-[#9ca3af] font-normal normal-case">(optional)</span></div>
                <input type="text" placeholder="e.g. Pork and vegetables from market" value={fNote} onChange={e => setFNote(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && fAmount) handleSave(); }}
                  className="w-full px-4 py-3.5 bg-[#f7f8fa] border border-[#e8eaed] rounded-[12px] text-[14px] outline-none text-[#111827] focus:border-[#3ecf8e] transition-colors"
                  style={{ fontFamily: "inherit" }} />
              </div>
              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button onClick={closeModal} className="flex-1 py-4 rounded-[12px] bg-[#f0f2f5] text-[#6b7280] font-bold text-[14px] border-0 cursor-pointer hover:bg-[#e8eaed] transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={!fAmount || saving}
                  className={`flex-[1.5] py-4 rounded-[12px] font-bold text-[14px] border-0 flex items-center justify-center gap-2 transition-all ${
                    saving ? "bg-[rgba(62,207,142,0.15)] text-[#3ecf8e] cursor-default" :
                    fAmount ? "bg-[#3ecf8e] text-[#0d1117] cursor-pointer hover:bg-[#4dd49a] shadow-[0_4px_14px_rgba(62,207,142,0.3)]" :
                    "bg-[#f0f2f5] text-[#9ca3af] cursor-not-allowed"
                  }`}>
                  {saving ? <><CheckCircle2 size={16} /> {editTarget ? "Updated!" : "Saved!"}</> : <><Plus size={16} /> {editTarget ? "Update Expense" : "Save Expense"}</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
          <div className="bg-white w-full max-w-sm rounded-[20px] shadow-[0_32px_80px_rgba(0,0,0,0.2)] p-7">
            <div className="w-12 h-12 rounded-full bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-[#ef4444]" />
            </div>
            <div className="text-center mb-1">
              <div className="text-[17px] font-bold text-[#111827]">Delete Expense?</div>
              <div className="text-[13px] text-[#6b7280] mt-1.5">You can undo this within 5 seconds.</div>
            </div>
            <div className="mt-5 p-3.5 bg-[#f7f8fa] rounded-[10px] border border-[#e8eaed] mb-5">
              <div className="text-[13px] font-medium text-[#111827] truncate">{deleteTarget.note}</div>
              <div className="text-[12px] text-[#6b7280] mt-0.5">${deleteTarget.amount.toFixed(2)} · {deleteTarget.category} · {deleteTarget.time}</div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3.5 rounded-[12px] bg-[#f0f2f5] text-[#6b7280] font-bold text-[14px] border-0 cursor-pointer hover:bg-[#e8eaed] transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteTarget)} className="flex-1 py-3.5 rounded-[12px] bg-[#ef4444] text-white font-bold text-[14px] border-0 cursor-pointer hover:bg-[#dc2626] transition-colors shadow-[0_4px_14px_rgba(239,68,68,0.3)]">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ SIDEBAR ══════════════════════════════════════════════ */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col h-screen shrink-0 bg-[#0d1117] transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "w-[68px]" : "w-72"} ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className={`flex items-center border-b border-white/[0.07] h-[70px] shrink-0 ${isSidebarCollapsed ? "justify-center px-0" : "justify-between px-6"}`}>
          {!isSidebarCollapsed && (
            <Link href="/vendor" className="flex items-center gap-3 no-underline">
              <div className="w-10 h-10 rounded-[10px] bg-[#3ecf8e] flex items-center justify-center font-extrabold text-[#0d1117] text-[17px] shrink-0">P</div>
              <span className="font-extrabold text-[16px] text-[#e6edf3] tracking-[0.02em] whitespace-nowrap">PsarPulse KH</span>
            </Link>
          )}
          {isSidebarCollapsed && (
            <Link href="/vendor" className="no-underline">
              <div className="w-10 h-10 rounded-[10px] bg-[#3ecf8e] flex items-center justify-center font-extrabold text-[#0d1117] text-[17px]">P</div>
            </Link>
          )}
          <button className="lg:hidden bg-transparent border-0 text-[#7d8590] cursor-pointer p-0 shrink-0" onClick={() => setIsSidebarOpen(false)}><X size={18} /></button>
        </div>

        <nav className={`flex-1 pt-3 overflow-y-auto ${isSidebarCollapsed ? "px-2" : "px-3"}`}>
          <NavItem icon={LayoutDashboard}  title="Dashboard" href="/vendor"           collapsed={isSidebarCollapsed} />
          <NavItem icon={CircleDollarSign} title="Sales"     href="/vendor/sales"     collapsed={isSidebarCollapsed} />
          <NavItem icon={Receipt}          title="Expenses"  href="/vendor/expenses"  collapsed={isSidebarCollapsed} active />
          <NavItem icon={Users}            title="Customers" href="/vendor/customer"  collapsed={isSidebarCollapsed} />
        </nav>

        <div className={`pb-3 pt-2 border-t border-white/[0.07] ${isSidebarCollapsed ? "px-2" : "px-3"}`}>
          <NavItem icon={Settings} title="Settings" href="/vendor/settings" collapsed={isSidebarCollapsed} />
          {!isSidebarCollapsed && (
            <>
              <div className="mt-2 px-4 py-3.5 rounded-[11px] bg-[rgba(62,207,142,0.08)] border border-[rgba(62,207,142,0.18)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] font-semibold text-[#e6edf3]">Free Plan</span>
                  <span className="text-[11px] font-bold text-[#7d8590]">ឥតគិតថ្លៃ</span>
                </div>
                <Link href="/vendor/pricing" className="block text-center text-[13px] font-bold text-[#3ecf8e] bg-[rgba(62,207,142,0.12)] py-2 rounded-[8px] no-underline hover:bg-[rgba(62,207,142,0.18)] transition-colors">Upgrade Plan ↗</Link>
              </div>
              <div className="flex items-center gap-3 px-3 pt-4 pb-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3ecf8e] to-[#1a9c65] flex items-center justify-center text-[13px] font-bold text-white shrink-0">SM</div>
                <span className="text-[14px] font-medium text-[#e6edf3] flex-1">Sok Maly</span>
                <ChevronRight size={15} className="text-[#7d8590]" />
              </div>
            </>
          )}
          {isSidebarCollapsed && (
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3ecf8e] to-[#1a9c65] flex items-center justify-center text-[13px] font-bold text-white">SM</div>
            </div>
          )}
        </div>
      </aside>

      {/* ══ MAIN ══════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* ── Topbar ── */}
        <header className="bg-white border-b border-[#e8eaed] px-5 lg:px-7 h-[70px] flex items-center justify-between shrink-0 relative z-30">
          <div className="flex items-center gap-3">
            <button className="flex lg:hidden items-center justify-center w-10 h-10 rounded-[10px] bg-transparent border-0 cursor-pointer text-[#6b7280] hover:bg-[#f0f2f5] transition-colors" onClick={() => setIsSidebarOpen(true)}><Menu size={22} /></button>
            <button className="hidden lg:flex items-center justify-center w-10 h-10 rounded-[10px] bg-transparent border-0 cursor-pointer text-[#6b7280] hover:bg-[#f0f2f5] transition-colors" onClick={() => setIsSidebarCollapsed(c => !c)}>
              {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <h1 className="font-bold text-[20px] text-[#111827]">Expenses</h1>
            <span className="text-[13px] text-[#6b7280] hidden sm:block">ការគ្រប់គ្រងចំណាយ</span>
          </div>
          <div className="flex items-center gap-[10px]">
            <button onClick={openAdd} className="flex items-center gap-[7px] bg-[#3ecf8e] text-[#0d1117] border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer shadow-[0_2px_14px_rgba(62,207,142,0.28)] hover:bg-[#4dd49a] transition-colors">
              <Plus size={14} /> Add Expense
            </button>
            <div className="w-[34px] h-[34px] rounded-full bg-[rgba(62,207,142,0.12)] border-[1.5px] border-[#3ecf8e] flex items-center justify-center text-[11px] font-bold text-[#3ecf8e]">SM</div>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px]">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-5">

            {/* ── Page header ── */}
            <div className="pt-1 pb-2">
              <h2 className="text-[32px] font-extrabold text-[#111827] leading-tight">My Expenses</h2>
              <p className="text-[14px] text-[#6b7280] mt-1">Track and manage your spending · <span className="text-[#9ca3af]">តាមដាន និងគ្រប់គ្រងចំណាយ</span></p>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Today — dark hero, GREEN */}
              <div className="bg-[#0d1117] rounded-[14px] border border-white/[0.06] px-[26px] py-6">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="text-[10.5px] font-bold text-[#7d8590] uppercase tracking-[0.07em]">Today's Expenses</div>
                    <div className="text-[10px] text-[#4d5562] mt-0.5">ចំណាយថ្ងៃនេះ</div>
                  </div>
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-[rgba(62,207,142,0.12)] border border-[rgba(62,207,142,0.2)] flex items-center justify-center">
                    <Receipt size={15} className="text-[#3ecf8e]" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-bold text-[30px] leading-none text-[#3ecf8e]">${todayTotal.toFixed(2)}</span>
                  <span className="text-[12.5px] font-bold mb-0.5 text-[#7d8590]">{active.length} txns</span>
                </div>
              </div>

              {/* Top Category */}
              <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[26px] py-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="text-[10.5px] font-bold text-[#6b7280] uppercase tracking-[0.07em]">Top Category</div>
                    <div className="text-[10px] text-[#9ca3af] mt-0.5">ប្រភេទច្រើនជាងគេ</div>
                  </div>
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-[#f7f8fa] border border-[#e8eaed] flex items-center justify-center">
                    <Tag size={15} className="text-[#3ecf8e]" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-bold text-[22px] leading-none text-[#111827]">{topCat.label}</span>
                  <span className="text-[12px] font-bold mb-0.5 px-2 py-0.5 rounded-full" style={{ background: `${topCat.color}18`, color: topCat.color }}>{topCat.khmer}</span>
                </div>
              </div>

              {/* Weekly — GREEN */}
              <div className="bg-[#3ecf8e] rounded-[14px] border border-[#3ecf8e] px-[26px] py-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="text-[10.5px] font-bold text-white/80 uppercase tracking-[0.07em]">Weekly Expenses</div>
                    <div className="text-[10px] text-white/60 mt-0.5">ចំណាយប្រចាំសប្តាហ៍</div>
                  </div>
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-white/20 border border-transparent flex items-center justify-center">
                    <TrendingDown size={15} className="text-white" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-bold text-[30px] leading-none text-white">${weeklyTotal.toFixed(2)}</span>
                  <span className="text-[12.5px] font-bold mb-0.5 text-white">+5%</span>
                </div>
              </div>

              {/* Monthly */}
              <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[26px] py-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="text-[10.5px] font-bold text-[#6b7280] uppercase tracking-[0.07em]">Monthly Total</div>
                    <div className="text-[10px] text-[#9ca3af] mt-0.5">សរុបប្រចាំខែ</div>
                  </div>
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-[#f7f8fa] border border-[#e8eaed] flex items-center justify-center">
                    <CircleDollarSign size={15} className="text-[#3ecf8e]" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-bold text-[30px] leading-none text-[#111827]">$650.00</span>
                  <span className="text-[12.5px] text-[#6b7280] mb-0.5">this month</span>
                </div>
              </div>
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
                      <tr key={e.id} className={`group transition-colors hover:bg-[#f7f8fa] cursor-pointer ${i < filtered.length - 1 ? "border-b border-[#f0f2f5]" : ""}`} onClick={() => openEdit(e)}>
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
                            <button onClick={() => openEdit(e)} className="w-8 h-8 rounded-[8px] bg-transparent hover:bg-[#f0f2f5] border-0 flex items-center justify-center cursor-pointer text-[#6b7280] hover:text-[#111827] transition-colors"><Pencil size={13} /></button>
                            <button onClick={() => setDeleteTarget(e)} className="w-8 h-8 rounded-[8px] bg-transparent hover:bg-[rgba(239,68,68,0.08)] border-0 flex items-center justify-center cursor-pointer text-[#6b7280] hover:text-[#ef4444] transition-colors"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={5} className="px-[22px] py-14 text-center">
                        <div className="text-[13px] text-[#9ca3af]">{search ? "No expenses match your search" : "No expenses yet — log your first one!"}</div>
                        {!search && <button onClick={openAdd} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#3ecf8e] bg-transparent border-0 cursor-pointer hover:underline"><Plus size={14} /> Add first expense</button>}
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

function NavItem({ icon: Icon, title, href, active = false, collapsed = false }: NavItemProps) {
  return (
    <Link href={href} title={collapsed ? title : undefined}
      className={`flex items-center rounded-[10px] mb-0.5 no-underline transition-all duration-[120ms] ${collapsed ? "justify-center w-full h-11" : "gap-3 px-4 py-3"} ${active ? "bg-[rgba(62,207,142,0.12)] text-[#3ecf8e]" : "bg-transparent text-[#7d8590] hover:bg-white/[0.05] hover:text-[#e6edf3]"}`}>
      <Icon size={20} />
      {!collapsed && <span className={`text-[15px] ${active ? "font-semibold" : "font-normal"}`}>{title}</span>}
    </Link>
  );
}