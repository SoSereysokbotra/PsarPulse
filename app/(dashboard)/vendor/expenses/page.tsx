"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
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
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Tag,
  TrendingDown,
  Clock,
  Camera,
  Filter,
  MoreVertical,
  CreditCard,
  PieChart,
} from "lucide-react";

// Import unified reusable components
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorTopbar from "@/components/vendor/VendorTopbar";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
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
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

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

  const topCategoryData = activeTxns.reduce(
    (acc, txn) => {
      acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
      return acc;
    },
    {} as Record<string, number>,
  );
  const topCategoryKey = Object.keys(topCategoryData).sort(
    (a, b) => topCategoryData[b] - topCategoryData[a],
  )[0];
  const topCategoryName = topCategoryKey
    ? CATEGORIES.find((c) => c.value === topCategoryKey)?.label ||
      topCategoryKey
    : "None";

  return (
    <div className={`min-h-screen flex font-sans selection:bg-[#29B28D] selection:text-white transition-colors duration-300 ${isDark ? "bg-dark-bg text-[#e6edf3]" : "bg-slate-100 text-slate-900"}`}>
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
      <VendorSidebar
        plan="free"
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
        ]}
        currentPath="/vendor/expenses"
        collapsed={isSidebarCollapsed}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
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
        <VendorTopbar
          title={t("expenses.title")}
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
              <h1 className={`text-[26px] font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {t("expenses.title") || "My Expenses"}
              </h1>
              <p className={`text-sm mt-0.5 ${isDark ? "text-[#7d8590]" : "text-slate-500"}`}>
                {t("expenses.subtitle") || "Track and manage your spending"} · តាមដាន និងគ្រប់គ្រងចំណាយ
              </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <VendorSummaryCard
                title={t("dashboard.metrics.totalExpenses")}
                khmerTitle="ចំណាយសរុប"
                value="$3,840.00"
                icon={Receipt}
                trend="+8.2%"
                isPositive={false}
                variant={isDark ? "dark" : "light"}
              />
              <VendorSummaryCard
                title={t("dashboard.metrics.breakdown")}
                khmerTitle="ការបែងចែកចំណាយ"
                value="6 Categories"
                icon={PieChart}
                variant={isDark ? "dark" : "light"}
              />
              <VendorSummaryCard
                title={t("dashboard.metrics.dailyGoal")}
                khmerTitle="គោលដៅប្រចាំថ្ងៃ"
                value="$128.00"
                icon={TrendingDown}
                subtext="Under budget by $22"
                highlight
                variant={isDark ? "dark" : "light"}
              />
              <VendorSummaryCard
                title="Today's Expenses"
                khmerTitle="ចំណាយថ្ងៃនេះ"
                value={`$${totalExpense.toFixed(2)}`}
                icon={Receipt}
                trend={`${activeTxns.length} Transactions`}
                isPositive={false}
                highlight
                variant={isDark ? "dark" : "light"}
              />
            </div>

            {/* ── Category Breakdown (Specific to Expenses but styled to match) ── */}
            <div className={`border rounded-[14px] px-[26px] py-[22px] shadow-sm ${
              isDark ? "bg-dark-surface border-white/5" : "bg-white border-[#e8eaed]"
            }`}>
              <div className={`text-[14px] font-semibold mb-0.5 ${isDark ? "text-white" : "text-[#111827]"}`}>
                Breakdown by Category
              </div>
              <div className={`text-[11px] mb-5 ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}>
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
                        <div className={`text-[12.5px] font-medium ${isDark ? "text-white" : "text-[#111827]"}`}>
                          {cat.label}
                        </div>
                        <div className="text-[10.5px] text-[#9ca3af]">
                          {cat.khmer}
                        </div>
                      </div>
                      <div className={`flex-1 h-[6px] rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-[#f0f2f5]"}`}>
                        <div
                          className="h-full rounded-full transition-[width] duration-700 ease-out"
                          style={{ width: `${pct}%`, background: cat.color }}
                        />
                      </div>
                      <div className="w-[80px] text-right">
                        <span className={`text-[12.5px] font-bold ${isDark ? "text-white" : "text-[#111827]"}`}>
                          {pct > 0 ? `$${catTotal.toFixed(2)}` : "—"}
                        </span>
                      </div>
                      <div className={`w-[34px] text-right text-[11.5px] shrink-0 ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}>
                        {pct}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expense History Log */}
            <div className={`${isDark ? "bg-dark-surface border-white/5" : "bg-white border-[#e8eaed]"} rounded-[16px] shadow-sm p-6`}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className={`font-semibold text-[16px] ${isDark ? "text-white" : "text-[#111827]"}`}>
                    Spending Trends
                  </h3>
                  <p className={`text-[12px] mt-0.5 ${isKhmer ? "font-suwannaphum" : ""} ${isDark ? "text-[#7d8590]" : "text-[#6b7280]"}`}>
                    និន្នាការចំណាយ
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative w-full sm:w-auto">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search expenses..."
                      className="w-full sm:w-auto pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 min-h-[40px]"
                    />
                  </div>
                  <button className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors min-h-[40px] cursor-pointer bg-white">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className={`border-b text-[13px] uppercase tracking-wider font-semibold ${isDark ? "bg-white/5 border-white/5 text-[#7d8590]" : "bg-slate-50 border-slate-100 text-slate-500"}`}>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Note / Receipt</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-100"}`}>
                    {filtered.map((exp) => (
                      <tr
                        key={exp.id}
                        className={`transition-colors group ${isDark ? "hover:bg-white/5" : "hover:bg-psar-primary/10/30"}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center gap-2 text-[15px] font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                            <Clock className="w-4 h-4 text-slate-400" />
                            {exp.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-[13px] font-bold border ${isDark ? "bg-white/5 text-white border-white/10" : "bg-slate-100 text-slate-700 border-slate-200"}`}
                            >
                              {exp.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-[14px] ${isDark ? "text-[#7d8590]" : "text-slate-600"}`}>
                              {exp.note}
                            </span>
                            {exp.hasReceipt && (
                              <span
                                title="Receipt attached"
                                className="flex items-center"
                              >
                                <Camera className="w-4 h-4 text-psar-primary" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-[16px] font-bold text-red-500">
                            -${exp.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button className={`p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 min-h-[40px] min-w-[40px] border-0 bg-transparent cursor-pointer ${isDark ? "text-[#7d8590] hover:text-[#3ecf8e]" : "text-slate-400 hover:text-psar-primary hover:bg-psar-primary/10"}`}>
                            <MoreVertical className="w-5 h-5 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


              <div className={`p-4 border-t text-center ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                <button className={`text-[14px] font-semibold hover:underline min-h-[40px] px-4 border-0 bg-transparent cursor-pointer ${isDark ? "text-[#3ecf8e]" : "text-psar-primary"}`}>
                  View All Pro Expenses
                </button>
              </div>
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
