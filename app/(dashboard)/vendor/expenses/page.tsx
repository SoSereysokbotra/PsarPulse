"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Menu,
  X,
  Plus,
  Search,
  CheckCircle2,
  Pencil,
  Trash2,
  RotateCcw,
  AlertCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Receipt,
  Tag,
  TrendingDown,
  Clock,
  Camera,
} from "lucide-react";

// Import our reusable components
import FreeSidebar from "@/components/vendor/FreeSidebar";
import FreeTopbar from "@/components/vendor/FreeTopbar";
import FreeStatCard from "@/components/vendor/FreeStatCard";
import { ConfirmModal } from "@/components/ConfirmModal";

// ─── Types ────────────────────────────────────────────────────────
export type Period = "Day" | "Week" | "Month";
export type Category =
  | "Ingredients"
  | "Rent"
  | "Transport"
  | "Electricity"
  | "Labor"
  | "Others";
export type ToastT = {
  id: number;
  msg: string;
  type: "success" | "error" | "undo";
  expId?: string;
};

export interface Expense {
  id: string;
  time: string;
  category: Category;
  note: string;
  amount: number;
  hasReceipt: boolean;
  deletedAt?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const now = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

// ─── Constants & Initial Data ─────────────────────────────────────
const CATEGORIES: {
  value: Category;
  label: string;
  khmer: string;
  color: string;
}[] = [
  {
    value: "Ingredients",
    label: "Ingredients",
    khmer: "គ្រឿងផ្សំ",
    color: "#3ecf8e",
  },
  { value: "Rent", label: "Rent", khmer: "ថ្លៃជួល", color: "#3b82f6" },
  {
    value: "Transport",
    label: "Transport",
    khmer: "ការធ្វើដំណើរ",
    color: "#8b5cf6",
  },
  {
    value: "Electricity",
    label: "Electricity",
    khmer: "អគ្គិសនី",
    color: "#f59e0b",
  },
  { value: "Labor", label: "Labor", khmer: "កម្លាំងពលកម្ម", color: "#ef4444" },
  { value: "Others", label: "Others", khmer: "ផ្សេងៗ", color: "#6366f1" },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

const INITIAL_EXPENSES: Expense[] = [
  {
    id: uid(),
    time: "2:15 PM",
    category: "Ingredients",
    note: "Pork and Vegetables",
    amount: 25.0,
    hasReceipt: false,
  },
  {
    id: uid(),
    time: "10:00 AM",
    category: "Transport",
    note: "TukTuk to market",
    amount: 3.5,
    hasReceipt: false,
  },
  {
    id: uid(),
    time: "Yesterday",
    category: "Electricity",
    note: "Weekly stall power",
    amount: 15.0,
    hasReceipt: true,
  },
  {
    id: uid(),
    time: "Yesterday",
    category: "Labor",
    note: "Assistant pay",
    amount: 10.0,
    hasReceipt: false,
  },
  {
    id: uid(),
    time: "2 days ago",
    category: "Rent",
    note: "Monthly stall rent",
    amount: 80.0,
    hasReceipt: true,
  },
];

const STATS: Record<
  Period,
  { expense: number; change: string; positive: boolean }
> = {
  Day: { expense: 38.5, change: "-2%", positive: true }, // Less expense is positive
  Week: { expense: 320.0, change: "+5%", positive: false },
  Month: { expense: 1450.0, change: "-8%", positive: true },
};

// ═════════════════════════════════════════════════════════════════
export default function ExpensesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [period, setPeriod] = useState<Period>("Day");
  const [search, setSearch] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [toasts, setToasts] = useState<ToastT[]>([]);

  // Add/Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [fAmount, setFAmount] = useState("");
  const [fCategory, setFCategory] = useState<Category>("Ingredients");
  const [fNote, setFNote] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    if (modalOpen) setTimeout(() => amountRef.current?.focus(), 120);
  }, [modalOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
        setDeleteTarget(null);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const toast = useCallback(
    (msg: string, type: ToastT["type"], expId?: string) => {
      const id = Date.now();
      setToasts((p) => [...p, { id, msg, type, expId }]);
      if (type !== "undo")
        setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
    },
    [],
  );

  const dismissToast = (id: number) =>
    setToasts((p) => p.filter((t) => t.id !== id));

  const openAdd = () => {
    setEditTarget(null);
    setFAmount("");
    setFCategory("Ingredients");
    setFNote("");
    setModalOpen(true);
  };

  const openEdit = (e: Expense) => {
    setEditTarget(e);
    setFAmount(String(e.amount));
    setFCategory(e.category);
    setFNote(e.note);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSaving(false);
    setEditTarget(null);
    setFAmount("");
    setFCategory("Ingredients");
    setFNote("");
  };

  const handleSave = () => {
    if (!fAmount || isNaN(Number(fAmount))) return;
    setSaving(true);
    setTimeout(() => {
      if (editTarget) {
        setExpenses((p) =>
          p.map((e) =>
            e.id === editTarget.id
              ? {
                  ...e,
                  amount: parseFloat(fAmount),
                  category: fCategory,
                  note: fNote,
                }
              : e,
          ),
        );
        toast("Expense updated successfully", "success");
      } else {
        const newExp: Expense = {
          id: uid(),
          time: now(),
          category: fCategory,
          note: fNote || "Manual entry",
          amount: parseFloat(fAmount),
          hasReceipt: false,
        };
        setExpenses((p) => [newExp, ...p]);
        toast("Expense logged successfully", "success");
      }
      closeModal();
    }, 400);
  };

  const handleDelete = (e: Expense) => {
    setDeleteTarget(null);
    setExpenses((p) =>
      p.map((x) => (x.id === e.id ? { ...x, deletedAt: Date.now() } : x)),
    );
    const toastId = Date.now();
    setToasts((p) => [
      ...p,
      {
        id: toastId,
        msg: `"${e.note.slice(0, 28)}" deleted`,
        type: "undo",
        expId: e.id,
      },
    ]);
    setTimeout(() => {
      setExpenses((p) => p.filter((x) => x.id !== e.id));
      setToasts((p) => p.filter((x) => x.id !== toastId));
    }, 5000);
  };

  const handleUndo = (toastId: number, expId: string) => {
    setExpenses((p) =>
      p.map((e) => (e.id === expId ? { ...e, deletedAt: undefined } : e)),
    );
    dismissToast(toastId);
    toast("Deletion undone", "success");
  };

  const activeTxns = expenses.filter((e) => !e.deletedAt);
  const filtered = activeTxns.filter(
    (e) =>
      e.note.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase()),
  );
  const totalExpense = activeTxns.reduce((s, e) => s + e.amount, 0);
  const avgExpense = activeTxns.length ? totalExpense / activeTxns.length : 0;
  const statChange = STATS[period];

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900 selection:bg-[#29B28D] selection:text-white">
      {/* ── Toasts ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.18)] text-[13.5px] font-semibold min-w-[280px] border ${
              t.type === "undo"
                ? "bg-[#0d1117] text-[#e6edf3] border-white/[0.1]"
                : t.type === "error"
                  ? "bg-white text-[#ef4444] border-[#fecaca]"
                  : "bg-white text-[#111827] border-[#e8eaed]"
            }`}
          >
            {t.type === "success" && (
              <CheckCircle2 size={16} className="text-[#3ecf8e] shrink-0" />
            )}
            {t.type === "error" && (
              <AlertCircle size={16} className="text-[#ef4444] shrink-0" />
            )}
            {t.type === "undo" && (
              <Trash2 size={16} className="text-[#7d8590] shrink-0" />
            )}
            <span className="flex-1">{t.msg}</span>
            {t.type === "undo" && t.expId && (
              <button
                onClick={() => handleUndo(t.id, t.expId!)}
                className="bg-[#3ecf8e] text-[#0d1117] font-bold text-[12px] px-3 py-1 rounded-[7px] cursor-pointer border-0 hover:bg-[#4dd49a] transition-colors"
              >
                Undo
              </button>
            )}
            <button
              onClick={() => dismissToast(t.id)}
              className="bg-transparent border-0 cursor-pointer text-[#7d8590] hover:text-[#111827] p-0 ml-1"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* ── Extracted Components ── */}
      <FreeSidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsOpen={setIsSidebarOpen}
        currentPath="/vendor/expenses"
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        title="Delete Expense?"
        description="You can undo this within 5 seconds after deletion."
        previewText={deleteTarget?.note || "Manual entry"}
        previewSubtext={
          deleteTarget
            ? `$${deleteTarget.amount.toFixed(2)} · ${deleteTarget.category} · ${deleteTarget.time}`
            : undefined
        }
      />

      {/* ── Add/Edit Modal (Still Inline) ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white w-full max-w-md rounded-[20px] shadow-[0_32px_80px_rgba(0,0,0,0.2)] overflow-hidden">
            <div className="bg-[#0d1117] px-7 py-5 flex items-center justify-between">
              <div>
                <div className="text-[18px] font-bold text-[#e6edf3]">
                  {editTarget ? "Edit Expense" : "Log New Expense"}
                </div>
                <div className="text-[12px] text-[#7d8590] mt-0.5">
                  {editTarget ? "កែប្រែចំណាយ" : "កត់ត្រាចំណាយថ្មី"}
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-[9px] bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[#7d8590] hover:text-[#e6edf3] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-7 flex flex-col gap-5">
              <div>
                <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.06em] mb-2">
                  Amount <span className="text-[#ef4444]">*</span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] font-bold text-[#6b7280]">
                    $
                  </span>
                  <input
                    ref={amountRef}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={fAmount}
                    onChange={(e) => setFAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-[#f7f8fa] border border-[#e8eaed] rounded-[12px] text-[24px] font-bold outline-none text-[#111827] focus:border-[#ef4444] transition-colors"
                    style={{ fontFamily: "inherit" }}
                  />
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.06em] mb-2">
                  Category
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setFCategory(cat.value)}
                      className={`py-2.5 rounded-[10px] text-[12.5px] font-semibold border-0 cursor-pointer transition-all ${fCategory === cat.value ? "text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]" : "bg-[#f7f8fa] text-[#6b7280] hover:bg-[#eff0f2]"}`}
                      style={
                        fCategory === cat.value ? { background: cat.color } : {}
                      }
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.06em] mb-2">
                  Note{" "}
                  <span className="text-[#9ca3af] font-normal normal-case">
                    (optional)
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Pork and vegetables from market"
                  value={fNote}
                  onChange={(e) => setFNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && fAmount) handleSave();
                  }}
                  className="w-full px-4 py-3.5 bg-[#f7f8fa] border border-[#e8eaed] rounded-[12px] text-[14px] outline-none text-[#111827] focus:border-[#3ecf8e] transition-colors"
                  style={{ fontFamily: "inherit" }}
                />
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
                  {saving ? (
                    <>
                      <CheckCircle2 size={16} />{" "}
                      {editTarget ? "Updated!" : "Saved!"}
                    </>
                  ) : (
                    <>
                      <Plus size={16} />{" "}
                      {editTarget ? "Update Expense" : "Save Expense"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ MAIN ══════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col w-full min-w-0 h-screen overflow-hidden">
        {/* ── Topbar (Matched with Sales) ── */}
        <FreeTopbar
          title="Expenses"
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          setIsMobileSidebarOpen={setIsSidebarOpen}
          rightActions={
            <>
              <div className="hidden sm:flex items-center bg-[#f0f2f5] border border-[#e8eaed] rounded-[10px] p-[3px]">
                {(["Day", "Week", "Month"] as Period[]).map((p) => (
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
                <Plus size={14} /> Add Expense
              </button>
            </>
          }
        />

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px]">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-5">
            <div className="pt-1 pb-2">
              <h1 className="text-[26px] font-bold text-slate-900">
                My Expenses
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Track and manage your spending · តាមដាន និងគ្រប់គ្រងចំណាយ
              </p>
            </div>

            {/* ── 3 Stat Cards (Exactly like Sales Page layout) ── */}
            <div className="grid grid-cols-1  sm:grid-cols-4 gap-4">
              <FreeStatCard
                variant="dark"
                title="Today's Expenses"
                khmerTitle="ចំណាយថ្ងៃនេះ"
                value={`$${totalExpense.toFixed(2)}`}
              />
              <FreeStatCard
                title="Top Category"
                khmerTitle="ប្រភេទច្រើនជាងគេ"
                value={activeTxns.length}
                subtext="expenses today"
              />
              <FreeStatCard
                variant="green"
                title="Weekly Expenses"
                khmerTitle="ចំណាយប្រចាំសប្តាហ៍"
                value={`$${avgExpense.toFixed(2)}`}
                subtext="per txn"
                trend="+5%"
                trendDirection="up"
              />
              <FreeStatCard
                title="Monthly Total"
                khmerTitle="សរុបប្រចាំខែ"
                value="$650.00"
                subtext="this month"
              />
            </div>

            {/* ── Category Breakdown (Specific to Expenses but styled to match) ── */}
            <div className="bg-white border border-[#e8eaed] rounded-[14px] px-[26px] py-[22px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <div className="text-[14px] font-semibold text-[#111827] mb-0.5">
                Breakdown by Category
              </div>
              <div className="text-[11px] text-[#6b7280] mb-5">
                ចំណាយតាមប្រភេទ
              </div>
              <div className="flex flex-col gap-[14px]">
                {CATEGORIES.map((cat) => {
                  const catTotal = activeTxns
                    .filter((e) => e.category === cat.value)
                    .reduce((s, e) => s + e.amount, 0);
                  const pct =
                    totalExpense > 0
                      ? Math.round((catTotal / totalExpense) * 100)
                      : 0;
                  return (
                    <div key={cat.value} className="flex items-center gap-4">
                      <div className="w-[100px] shrink-0">
                        <div className="text-[12.5px] font-medium text-[#111827]">
                          {cat.label}
                        </div>
                        <div className="text-[10.5px] text-[#9ca3af]">
                          {cat.khmer}
                        </div>
                      </div>
                      <div className="flex-1 h-[6px] bg-[#f0f2f5] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-[width] duration-700 ease-out"
                          style={{ width: `${pct}%`, background: cat.color }}
                        />
                      </div>
                      <div className="w-[60px] text-right">
                        <span className="text-[12.5px] font-bold text-[#111827]">
                          {pct > 0 ? `$${catTotal.toFixed(2)}` : "—"}
                        </span>
                      </div>
                      <div className="w-[34px] text-right text-[11.5px] text-[#6b7280] shrink-0">
                        {pct}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Expense Table (Search Bar matched exactly with Sales) ── */}
            <div className="bg-white border border-[#e8eaed] rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <div className="px-[22px] py-4 border-b border-[#f0f2f5] flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-[14px] font-semibold text-[#111827]">
                    Expense History
                  </div>
                  <div className="text-[11px] text-[#6b7280] mt-0.5">
                    {activeTxns.length} record
                    {activeTxns.length !== 1 ? "s" : ""} · Click row to edit
                  </div>
                </div>
                <div className="relative">
                  <Search
                    size={13}
                    className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-[33px] pr-4 py-[9px] bg-[#f7f8fa] border border-[#e8eaed] rounded-[9px] text-[13px] outline-none text-[#111827] focus:border-[#3ecf8e] transition-colors w-[200px]"
                    style={{ fontFamily: "inherit" }}
                  />
                </div>
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#f0f2f5]">
                    <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">
                      Time
                    </th>
                    <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">
                      Category
                    </th>
                    <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">
                      Note
                    </th>
                    <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em] text-right">
                      Amount
                    </th>
                    <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em] text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length ? (
                    filtered.map((e, i) => {
                      const cat = CAT_MAP[e.category];
                      return (
                        <tr
                          key={e.id}
                          className={`group transition-colors hover:bg-[#f7f8fa] cursor-pointer ${i < filtered.length - 1 ? "border-b border-[#f0f2f5]" : ""}`}
                          onClick={() => openEdit(e)}
                        >
                          <td className="px-[22px] py-[14px] text-[13px] text-[#6b7280] whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Clock size={12} className="text-[#9ca3af]" />
                              {e.time}
                            </div>
                          </td>
                          <td className="px-[22px] py-[14px]">
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[11.5px] font-semibold border"
                              style={{
                                background: `${cat.color}14`,
                                color: cat.color,
                                borderColor: `${cat.color}30`,
                              }}
                            >
                              {e.category}
                            </span>
                          </td>
                          <td className="px-[22px] py-[14px]">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-medium text-[#111827] truncate max-w-[220px]">
                                {e.note || "—"}
                              </span>
                              {e.hasReceipt && (
                                <Camera
                                  size={13}
                                  className="text-[#3ecf8e] shrink-0"
                                />
                              )}
                            </div>
                          </td>
                          <td className="px-[22px] py-[14px] text-[13.5px] font-bold text-[#ef4444] text-right whitespace-nowrap">
                            -${e.amount.toFixed(2)}
                          </td>
                          <td
                            className="px-[22px] py-[14px] text-right"
                            onClick={(ev) => ev.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEdit(e)}
                                className="w-8 h-8 rounded-[8px] bg-transparent hover:bg-[#f0f2f5] border-0 flex items-center justify-center cursor-pointer text-[#6b7280] hover:text-[#111827] transition-colors"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(e)}
                                className="w-8 h-8 rounded-[8px] bg-transparent hover:bg-[rgba(239,68,68,0.08)] border-0 flex items-center justify-center cursor-pointer text-[#6b7280] hover:text-[#ef4444] transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-[22px] py-14 text-center">
                        <div className="text-[13px] text-[#9ca3af]">
                          {search
                            ? "No expenses match your search"
                            : "No expenses yet — log your first one!"}
                        </div>
                        {!search && (
                          <button
                            onClick={openAdd}
                            className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#3ecf8e] bg-transparent border-0 cursor-pointer hover:underline"
                          >
                            <Plus size={14} /> Add first expense
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {activeTxns.length > 0 && (
                <div className="px-[22px] py-3 border-t border-[#f0f2f5] flex items-center justify-between">
                  <span className="text-[12px] text-[#9ca3af]">
                    {filtered.length} of {activeTxns.length} records
                  </span>
                  <span className="text-[13px] font-bold text-[#111827]">
                    Total:{" "}
                    <span className="text-[#ef4444]">
                      ${filtered.reduce((s, e) => s + e.amount, 0).toFixed(2)}
                    </span>
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 px-1">
              <RotateCcw size={12} className="text-[#9ca3af]" />
              <span className="text-[11.5px] text-[#9ca3af]">
                Deleted records can be undone within 5 seconds · Click any row
                to edit
              </span>
            </div>
            <div className="h-4" />
          </div>
        </div>
      </main>
    </div>
  );
}
