"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LayoutDashboard, CircleDollarSign, Receipt, Users, Settings,
  Menu, X, Bell, ChevronRight, Search, Plus,
  ShoppingCart, TrendingUp, TrendingDown, BarChart3, CheckCircle2,
  Pencil, Trash2, RotateCcw, AlertCircle,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────
type Period  = "Day" | "Week" | "Month";
type Method  = "Cash" | "ABA/KHQR" | "Other";
type ToastT  = { id: number; msg: string; type: "success" | "error" | "undo"; txnId?: string; };

interface NavItemProps { icon: React.ElementType; title: string; href: string; active?: boolean; collapsed?: boolean; }

interface Transaction {
  id:        string;
  time:      string;
  items:     string;
  amount:    number;
  method:    Method;
  deletedAt?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const now  = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

// ─── Initial Data ─────────────────────────────────────────────────
const INITIAL: Transaction[] = [
  { id: uid(), time: "1:45 PM",  items: "2x Coffee Latte, 1x Spring Roll", amount: 10.80, method: "ABA/KHQR" },
  { id: uid(), time: "1:15 PM",  items: "1x Mango Sticky Rice",            amount:  2.00, method: "Cash"     },
  { id: uid(), time: "12:30 PM", items: "3x Fried Rice",                   amount:  7.50, method: "Cash"     },
  { id: uid(), time: "11:55 AM", items: "2x Green Tea, 2x Coconut Water",  amount:  6.40, method: "ABA/KHQR" },
  { id: uid(), time: "10:20 AM", items: "1x Coffee Latte",                 amount:  4.50, method: "Other"    },
  { id: uid(), time: "9:44 AM",  items: "1x Fried Rice, 1x Spring Roll",   amount:  4.30, method: "Cash"     },
];

const STATS: Record<Period, { revenue: number; change: string; positive: boolean }> = {
  Day:   { revenue: 35.50,    change: "+5%",  positive: true  },
  Week:  { revenue: 1240.00,  change: "+12%", positive: true  },
  Month: { revenue: 5820.00,  change: "-2%",  positive: false },
};

const METHOD_BADGE: Record<Method, string> = {
  "Cash":     "bg-[rgba(62,207,142,0.12)] text-[#3ecf8e] border border-[rgba(62,207,142,0.25)]",
  "ABA/KHQR": "bg-[rgba(59,130,246,0.10)] text-[#3b82f6] border border-[rgba(59,130,246,0.2)]",
  "Other":    "bg-[#f0f2f5] text-[#6b7280] border border-[#e8eaed]",
};

// ═════════════════════════════════════════════════════════════════
export default function SalesDashboard() {
  const [isSidebarOpen,      setIsSidebarOpen]      = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [period,             setPeriod]             = useState<Period>("Day");
  const [search,        setSearch]        = useState("");
  const [txns,          setTxns]          = useState<Transaction[]>(INITIAL);
  const [toasts,        setToasts]        = useState<ToastT[]>([]);

  const [modalOpen,   setModalOpen]   = useState(false);
  const [editTarget,  setEditTarget]  = useState<Transaction | null>(null);
  const [fAmount,     setFAmount]     = useState("");
  const [fItems,      setFItems]      = useState("");
  const [fMethod,     setFMethod]     = useState<Method>("Cash");
  const [saving,      setSaving]      = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

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
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeModal(); setDeleteTarget(null); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const toast = useCallback((msg: string, type: ToastT["type"], txnId?: string) => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type, txnId }]);
    if (type !== "undo") setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const dismissToast = (id: number) => setToasts(p => p.filter(t => t.id !== id));

  const openAdd = () => {
    setEditTarget(null);
    setFAmount(""); setFItems(""); setFMethod("Cash");
    setModalOpen(true);
  };

  const openEdit = (t: Transaction) => {
    setEditTarget(t);
    setFAmount(String(t.amount));
    setFItems(t.items);
    setFMethod(t.method);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false); setSaving(false);
    setEditTarget(null); setFAmount(""); setFItems(""); setFMethod("Cash");
  };

  const handleSave = () => {
    if (!fAmount || isNaN(Number(fAmount))) return;
    setSaving(true);

    setTimeout(() => {
      if (editTarget) {
        setTxns(p => p.map(t =>
          t.id === editTarget.id
            ? { ...t, amount: parseFloat(fAmount), items: fItems, method: fMethod }
            : t
        ));
        toast("Transaction updated successfully", "success");
      } else {
        const newTxn: Transaction = {
          id: uid(), time: now(),
          items: fItems || "Manual entry",
          amount: parseFloat(fAmount),
          method: fMethod,
        };
        setTxns(p => [newTxn, ...p]);
        toast("Sale logged successfully", "success");
      }
      closeModal();
    }, 400);
  };

  const handleDelete = (t: Transaction) => {
    setDeleteTarget(null);
    setTxns(p => p.map(x => x.id === t.id ? { ...x, deletedAt: Date.now() } : x));

    const toastId = Date.now();
    setToasts(p => [...p, { id: toastId, msg: `"${t.items.slice(0, 28)}..." deleted`, type: "undo", txnId: t.id }]);

    setTimeout(() => {
      setTxns(p => p.filter(x => x.id !== t.id));
      setToasts(p => p.filter(x => x.id !== toastId));
    }, 5000);
  };

  const handleUndo = (toastId: number, txnId: string) => {
    setTxns(p => p.map(t => t.id === txnId ? { ...t, deletedAt: undefined } : t));
    dismissToast(toastId);
    toast("Deletion undone", "success");
  };

  const activeTxns  = txns.filter(t => !t.deletedAt);
  const filtered    = activeTxns.filter(t =>
    t.items.toLowerCase().includes(search.toLowerCase()) ||
    t.time.toLowerCase().includes(search.toLowerCase())
  );
  const totalRevenue = activeTxns.reduce((s, t) => s + t.amount, 0);
  const avgSale      = activeTxns.length ? totalRevenue / activeTxns.length : 0;
  const statChange   = STATS[period];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5] text-[#111827]" style={{ fontFamily: "inherit" }}>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ── Toasts ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.18)] text-[13.5px] font-semibold min-w-[280px] border ${
              t.type === "undo"    ? "bg-[#0d1117] text-[#e6edf3] border-white/[0.1]" :
              t.type === "error"   ? "bg-white text-[#ef4444] border-[#fecaca]" :
                                     "bg-white text-[#111827] border-[#e8eaed]"
            }`}
          >
            {t.type === "success" && <CheckCircle2 size={16} className="text-[#3ecf8e] shrink-0" />}
            {t.type === "error"   && <AlertCircle  size={16} className="text-[#ef4444] shrink-0" />}
            {t.type === "undo"    && <Trash2        size={16} className="text-[#7d8590] shrink-0" />}
            <span className="flex-1">{t.msg}</span>
            {t.type === "undo" && t.txnId && (
              <button
                onClick={() => handleUndo(t.id, t.txnId!)}
                className="bg-[#3ecf8e] text-[#0d1117] font-bold text-[12px] px-3 py-1 rounded-[7px] cursor-pointer border-0 hover:bg-[#4dd49a] transition-colors"
              >
                Undo
              </button>
            )}
            <button onClick={() => dismissToast(t.id)} className="bg-transparent border-0 cursor-pointer text-[#7d8590] hover:text-[#111827] p-0 ml-1">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* ── Add/Edit Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white w-full max-w-md rounded-[20px] shadow-[0_32px_80px_rgba(0,0,0,0.2)] overflow-hidden">
            <div className="bg-[#0d1117] px-7 py-5 flex items-center justify-between">
              <div>
                <div className="text-[18px] font-bold text-[#e6edf3]">{editTarget ? "Edit Sale" : "Log New Sale"}</div>
                <div className="text-[12px] text-[#7d8590] mt-0.5">{editTarget ? "កែប្រែការលក់" : "កត់ត្រាការលក់រហ័ស"}</div>
              </div>
              <button onClick={closeModal} className="w-9 h-9 rounded-[9px] bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[#7d8590] hover:text-[#e6edf3] transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="p-7 flex flex-col gap-5">
              <div>
                <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.06em] mb-2">
                  Amount <span className="text-[#ef4444]">*</span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] font-bold text-[#6b7280]">$</span>
                  <input
                    ref={amountRef}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={fAmount}
                    onChange={e => setFAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-[#f7f8fa] border border-[#e8eaed] rounded-[12px] text-[24px] font-bold outline-none text-[#111827] focus:border-[#3ecf8e] transition-colors"
                    style={{ fontFamily: "inherit" }}
                  />
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.06em] mb-2">
                  Items <span className="text-[#9ca3af] font-normal normal-case tracking-normal">(optional)</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 2x Coffee Latte, 1x Spring Roll"
                  value={fItems}
                  onChange={e => setFItems(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && fAmount) handleSave(); }}
                  className="w-full px-4 py-3.5 bg-[#f7f8fa] border border-[#e8eaed] rounded-[12px] text-[14px] outline-none text-[#111827] focus:border-[#3ecf8e] transition-colors"
                  style={{ fontFamily: "inherit" }}
                />
              </div>

              <div>
                <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.06em] mb-2">Payment Method</div>
                <div className="grid grid-cols-3 gap-2">
                  {(["Cash", "ABA/KHQR", "Other"] as Method[]).map(m => (
                    <button
                      key={m}
                      onClick={() => setFMethod(m)}
                      className={`py-3 rounded-[10px] text-[13.5px] font-semibold border-0 cursor-pointer transition-all ${
                        fMethod === m
                          ? "bg-[rgba(62,207,142,0.12)] outline outline-1 outline-[#3ecf8e] text-[#3ecf8e]"
                          : "bg-[#f7f8fa] text-[#6b7280] hover:bg-[#eff0f2]"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={closeModal}
                  className="flex-1 py-4 rounded-[12px] bg-[#f0f2f5] text-[#6b7280] font-bold text-[14px] border-0 cursor-pointer hover:bg-[#e8eaed] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!fAmount || saving}
                  className={`flex-[1.5] py-4 rounded-[12px] font-bold text-[14px] border-0 flex items-center justify-center gap-2 transition-all ${
                    saving
                      ? "bg-[rgba(62,207,142,0.15)] text-[#3ecf8e] cursor-default"
                      : fAmount
                        ? "bg-[#3ecf8e] text-[#0d1117] cursor-pointer hover:bg-[#4dd49a] shadow-[0_4px_14px_rgba(62,207,142,0.3)]"
                        : "bg-[#f0f2f5] text-[#9ca3af] cursor-not-allowed"
                  }`}
                >
                  {saving
                    ? <><CheckCircle2 size={16} /> {editTarget ? "Updated!" : "Saved!"}</>
                    : <><Plus size={16} /> {editTarget ? "Update Sale" : "Save Log"}</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setDeleteTarget(null); }}
        >
          <div className="bg-white w-full max-w-sm rounded-[20px] shadow-[0_32px_80px_rgba(0,0,0,0.2)] p-7">
            <div className="w-12 h-12 rounded-full bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-[#ef4444]" />
            </div>
            <div className="text-center mb-1">
              <div className="text-[17px] font-bold text-[#111827]">Delete Transaction?</div>
              <div className="text-[13px] text-[#6b7280] mt-1.5 leading-relaxed">
                You can undo this within 5 seconds after deletion.
              </div>
            </div>
            <div className="mt-5 p-3.5 bg-[#f7f8fa] rounded-[10px] border border-[#e8eaed] mb-5">
              <div className="text-[13px] font-medium text-[#111827] truncate">{deleteTarget.items || "Manual entry"}</div>
              <div className="text-[12px] text-[#6b7280] mt-0.5">${deleteTarget.amount.toFixed(2)} · {deleteTarget.time}</div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3.5 rounded-[12px] bg-[#f0f2f5] text-[#6b7280] font-bold text-[14px] border-0 cursor-pointer hover:bg-[#e8eaed] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 py-3.5 rounded-[12px] bg-[#ef4444] text-white font-bold text-[14px] border-0 cursor-pointer hover:bg-[#dc2626] transition-colors shadow-[0_4px_14px_rgba(239,68,68,0.3)]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ SIDEBAR ════════════════════════════════════════════════ */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col h-screen shrink-0
          bg-[#0d1117]
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? "w-[68px]" : "w-72"}
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-white/[0.07] h-[70px] shrink-0 ${isSidebarCollapsed ? "justify-center px-0" : "justify-between px-6"}`}>
          {!isSidebarCollapsed && (
            <Link href="/vendor" className="flex items-center gap-3 no-underline">
              <div className="w-10 h-10 rounded-[10px] bg-[#3ecf8e] flex items-center justify-center font-extrabold text-[#0d1117] text-[17px] shrink-0">P</div>
              <span className="font-extrabold text-[16px] text-[#e6edf3] tracking-[0.02em] whitespace-nowrap">PsarPulse KH</span>
            </Link>
          )}
          {isSidebarCollapsed && (
            <Link href="/vendor" className="flex items-center justify-center no-underline">
              <div className="w-10 h-10 rounded-[10px] bg-[#3ecf8e] flex items-center justify-center font-extrabold text-[#0d1117] text-[17px]">P</div>
            </Link>
          )}
          <button className="lg:hidden bg-transparent border-0 text-[#7d8590] cursor-pointer p-0 shrink-0" onClick={() => setIsSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className={`flex-1 pt-3 overflow-y-auto ${isSidebarCollapsed ? "px-2" : "px-3"}`}>
          <NavItem icon={LayoutDashboard}  title="Dashboard" href="/vendor"           collapsed={isSidebarCollapsed} />
          <NavItem icon={CircleDollarSign} title="Sales"     href="/vendor/sales" active collapsed={isSidebarCollapsed} />
          <NavItem icon={Receipt}          title="Expenses"  href="/vendor/expenses"  collapsed={isSidebarCollapsed} />
          <NavItem icon={Users}            title="Customers" href="/vendor/customer"  collapsed={isSidebarCollapsed} />
        </nav>

        {/* Footer */}
        <div className={`pb-3 pt-2 border-t border-white/[0.07] ${isSidebarCollapsed ? "px-2" : "px-3"}`}>
          <NavItem icon={Settings} title="Settings" href="/vendor/settings" collapsed={isSidebarCollapsed} />
          {!isSidebarCollapsed && (
            <>
              <div className="mt-2 px-4 py-3.5 rounded-[11px] bg-[rgba(62,207,142,0.08)] border border-[rgba(62,207,142,0.18)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] font-semibold text-[#e6edf3]">Free Plan</span>
                  <span className="text-[11px] font-bold text-[#7d8590]">ឥតគិតថ្លៃ</span>
                </div>
                <Link href="/vendor/pricing" className="block text-center text-[13px] font-bold text-[#3ecf8e] bg-[rgba(62,207,142,0.12)] py-2 rounded-[8px] no-underline hover:bg-[rgba(62,207,142,0.18)] transition-colors">
                  Upgrade Plan ↗
                </Link>
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
            <button className="flex lg:hidden items-center justify-center w-10 h-10 rounded-[10px] bg-transparent border-0 cursor-pointer text-[#6b7280] hover:bg-[#f0f2f5] transition-colors" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <button
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-[10px] bg-transparent border-0 cursor-pointer text-[#6b7280] hover:bg-[#f0f2f5] transition-colors"
              onClick={() => setIsSidebarCollapsed(c => !c)}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <h1 className="font-bold text-[20px] text-[#111827]">Sales</h1>
            <span className="text-[13px] text-[#6b7280] hidden sm:block">ការគ្រប់គ្រងការលក់</span>
          </div>

          <div className="flex items-center gap-[10px]">
            <div className="hidden sm:flex items-center bg-[#f0f2f5] border border-[#e8eaed] rounded-[10px] p-[3px]">
              {(["Day", "Week", "Month"] as Period[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-[7px] rounded-[8px] text-[13px] font-semibold border-0 cursor-pointer transition-all ${
                    period === p
                      ? "bg-white text-[#111827] shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                      : "bg-transparent text-[#6b7280] hover:text-[#111827]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={openAdd}
              className="flex items-center gap-[7px] bg-[#3ecf8e] text-[#0d1117] border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer shadow-[0_2px_14px_rgba(62,207,142,0.28)] hover:bg-[#4dd49a] transition-colors"
            >
              <Plus size={14} /> Add Sale
            </button>

            <div className="w-[34px] h-[34px] rounded-full bg-[rgba(62,207,142,0.12)] border-[1.5px] border-[#3ecf8e] flex items-center justify-center text-[11px] font-bold text-[#3ecf8e]">
              SM
            </div>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px]">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-5">

            {/* ══ SALES HEADER ══════════════════════════════════════ */}
            <div className="pt-1 pb-2">
              <h2 className="text-[32px] font-extrabold text-[#111827] leading-tight">My Sales</h2>
              <p className="text-[14px] text-[#6b7280] mt-1">Track and manage your daily sales · <span className="text-[#9ca3af]">តាមដាន និងគ្រប់គ្រងការលក់</span></p>
            </div>

            {/* ── 3 stat cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="bg-[#0d1117] rounded-[14px] border border-white/[0.06] px-[26px] py-6">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="text-[10.5px] font-bold text-[#7d8590] uppercase tracking-[0.07em]">{period}'s Revenue</div>
                    <div className="text-[10px] text-[#4d5562] mt-0.5">ចំណូលប្រចាំ</div>
                  </div>
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-[rgba(62,207,142,0.12)] border border-[rgba(62,207,142,0.2)] flex items-center justify-center">
                    <CircleDollarSign size={15} className="text-[#3ecf8e]" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-bold text-[30px] leading-none text-[#e6edf3]">
                    ${totalRevenue.toFixed(2)}
                  </span>
                  <span className={`text-[12.5px] font-bold mb-0.5 flex items-center gap-1 ${statChange.positive ? "text-[#3ecf8e]" : "text-[#ef4444]"}`}>
                    {statChange.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {statChange.change}
                  </span>
                </div>
              </div>

              <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[26px] py-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="text-[10.5px] font-bold text-[#6b7280] uppercase tracking-[0.07em]">Transactions</div>
                    <div className="text-[10px] text-[#9ca3af] mt-0.5">ចំនួនការលក់</div>
                  </div>
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-[#f7f8fa] border border-[#e8eaed] flex items-center justify-center">
                    <ShoppingCart size={15} className="text-[#3ecf8e]" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-bold text-[30px] leading-none text-[#111827]">{activeTxns.length}</span>
                  <span className="text-[12.5px] text-[#6b7280] mb-0.5">sales today</span>
                </div>
              </div>

              <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[26px] py-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="text-[10.5px] font-bold text-[#6b7280] uppercase tracking-[0.07em]">Avg. Sale</div>
                    <div className="text-[10px] text-[#9ca3af] mt-0.5">មធ្យមតម្លៃ</div>
                  </div>
                  <div className="w-[34px] h-[34px] rounded-[10px] bg-[#f7f8fa] border border-[#e8eaed] flex items-center justify-center">
                    <BarChart3 size={15} className="text-[#3ecf8e]" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-bold text-[30px] leading-none text-[#111827]">${avgSale.toFixed(2)}</span>
                  <span className="text-[12.5px] text-[#6b7280] mb-0.5">per txn</span>
                </div>
              </div>
            </div>

            {/* ── Transactions table ── */}
            <div className="bg-white border border-[#e8eaed] rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <div className="px-[22px] py-4 border-b border-[#f0f2f5] flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-[14px] font-semibold text-[#111827]">Transaction History</div>
                  <div className="text-[11px] text-[#6b7280] mt-0.5">
                    {activeTxns.length} record{activeTxns.length !== 1 ? "s" : ""} · Click row to edit
                  </div>
                </div>
                <div className="relative">
                  <Search size={13} className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-[33px] pr-4 py-[9px] bg-[#f7f8fa] border border-[#e8eaed] rounded-[9px] text-[13px] outline-none text-[#111827] focus:border-[#3ecf8e] transition-colors w-[200px]"
                    style={{ fontFamily: "inherit" }}
                  />
                </div>
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#f0f2f5]">
                    <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">Time</th>
                    <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">Items</th>
                    <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">Method</th>
                    <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em] text-right">Amount</th>
                    <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length ? filtered.map((t, i) => (
                    <tr
                      key={t.id}
                      className={`group transition-colors hover:bg-[#f7f8fa] cursor-pointer ${i < filtered.length - 1 ? "border-b border-[#f0f2f5]" : ""}`}
                      onClick={() => openEdit(t)}
                    >
                      <td className="px-[22px] py-[14px] text-[13px] text-[#6b7280] whitespace-nowrap">{t.time}</td>
                      <td className="px-[22px] py-[14px] text-[13px] font-medium text-[#111827] max-w-[280px] truncate">{t.items || "—"}</td>
                      <td className="px-[22px] py-[14px]">
                        <span className={`inline-block px-2.5 py-[3px] rounded-full text-[11.5px] font-semibold ${METHOD_BADGE[t.method]}`}>
                          {t.method}
                        </span>
                      </td>
                      <td className="px-[22px] py-[14px] text-[13.5px] font-bold text-[#3ecf8e] text-right whitespace-nowrap">
                        +${t.amount.toFixed(2)}
                      </td>
                      <td className="px-[22px] py-[14px] text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(t)}
                            className="w-8 h-8 rounded-[8px] bg-transparent hover:bg-[#f0f2f5] border-0 flex items-center justify-center cursor-pointer text-[#6b7280] hover:text-[#111827] transition-colors"
                            title="Edit"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(t)}
                            className="w-8 h-8 rounded-[8px] bg-transparent hover:bg-[rgba(239,68,68,0.08)] border-0 flex items-center justify-center cursor-pointer text-[#6b7280] hover:text-[#ef4444] transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-[22px] py-14 text-center">
                        <div className="text-[13px] text-[#9ca3af]">
                          {search ? "No transactions match your search" : "No transactions yet — add your first sale!"}
                        </div>
                        {!search && (
                          <button
                            onClick={openAdd}
                            className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#3ecf8e] bg-transparent border-0 cursor-pointer hover:underline"
                          >
                            <Plus size={14} /> Add first sale
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {activeTxns.length > 0 && (
                <div className="px-[22px] py-3 border-t border-[#f0f2f5] flex items-center justify-between">
                  <span className="text-[12px] text-[#9ca3af]">{filtered.length} of {activeTxns.length} records</span>
                  <span className="text-[13px] font-bold text-[#111827]">
                    Total: <span className="text-[#3ecf8e]">${filtered.reduce((s, t) => s + t.amount, 0).toFixed(2)}</span>
                  </span>
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

// ─── NavItem ──────────────────────────────────────────────────────
function NavItem({ icon: Icon, title, href, active = false, collapsed = false }: NavItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? title : undefined}
      className={`flex items-center rounded-[10px] mb-0.5 no-underline transition-all duration-[120ms] ${
        collapsed ? "justify-center w-full h-11" : "gap-3 px-4 py-3"
      } ${
        active
          ? "bg-[rgba(62,207,142,0.12)] text-[#3ecf8e]"
          : "bg-transparent text-[#7d8590] hover:bg-white/[0.05] hover:text-[#e6edf3]"
      }`}
    >
      <Icon size={20} />
      {!collapsed && <span className={`text-[15px] ${active ? "font-semibold" : "font-normal"}`}>{title}</span>}
    </Link>
  );
}