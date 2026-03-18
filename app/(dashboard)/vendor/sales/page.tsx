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
  CircleDollarSign,
  ShoppingCart,
  BarChart3,
} from "lucide-react";

// Import our newly created reusable components
import FreeSidebar from "@/components/vendor/FreeSidebar";
import FreeTopbar from "@/components/vendor/FreeTopbar";
import FreeStatCard from "@/components/vendor/FreeStatCard";
import { ConfirmModal } from "@/components/ConfirmModal";

// ─── Types ────────────────────────────────────────────────────────
export type Period = "Day" | "Week" | "Month";
export type Method = "Cash" | "ABA/KHQR" | "Other";
export type ToastT = {
  id: number;
  msg: string;
  type: "success" | "error" | "undo";
  txnId?: string;
};

export interface Transaction {
  id: string;
  time: string;
  items: string;
  amount: number;
  method: Method;
  deletedAt?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const now = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

// ─── Initial Data ─────────────────────────────────────────────────
const INITIAL: Transaction[] = [
  {
    id: uid(),
    time: "1:45 PM",
    items: "2x Coffee Latte, 1x Spring Roll",
    amount: 10.8,
    method: "ABA/KHQR",
  },
  {
    id: uid(),
    time: "1:15 PM",
    items: "1x Mango Sticky Rice",
    amount: 2.0,
    method: "Cash",
  },
  {
    id: uid(),
    time: "12:30 PM",
    items: "3x Fried Rice",
    amount: 7.5,
    method: "Cash",
  },
  {
    id: uid(),
    time: "11:55 AM",
    items: "2x Green Tea, 2x Coconut Water",
    amount: 6.4,
    method: "ABA/KHQR",
  },
  {
    id: uid(),
    time: "10:20 AM",
    items: "1x Coffee Latte",
    amount: 4.5,
    method: "Other",
  },
  {
    id: uid(),
    time: "9:44 AM",
    items: "1x Fried Rice, 1x Spring Roll",
    amount: 4.3,
    method: "Cash",
  },
];

const STATS: Record<
  Period,
  { revenue: number; change: string; positive: boolean }
> = {
  Day: { revenue: 35.5, change: "+5%", positive: true },
  Week: { revenue: 1240.0, change: "+12%", positive: true },
  Month: { revenue: 5820.0, change: "-2%", positive: false },
};

const METHOD_BADGE: Record<Method, string> = {
  Cash: "bg-[rgba(62,207,142,0.12)] text-[#3ecf8e] border border-[rgba(62,207,142,0.25)]",
  "ABA/KHQR":
    "bg-[rgba(59,130,246,0.10)] text-[#3b82f6] border border-[rgba(59,130,246,0.2)]",
  Other: "bg-[#f0f2f5] text-[#6b7280] border border-[#e8eaed]",
};

// ═════════════════════════════════════════════════════════════════
export default function SalesDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [period, setPeriod] = useState<Period>("Day");
  const [search, setSearch] = useState("");
  const [txns, setTxns] = useState<Transaction[]>(INITIAL);
  const [toasts, setToasts] = useState<ToastT[]>([]);

  // Add/Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [fAmount, setFAmount] = useState("");
  const [fItems, setFItems] = useState("");
  const [fMethod, setFMethod] = useState<Method>("Cash");
  const [saving, setSaving] = useState(false);

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

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
    (msg: string, type: ToastT["type"], txnId?: string) => {
      const id = Date.now();
      setToasts((p) => [...p, { id, msg, type, txnId }]);
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
    setFItems("");
    setFMethod("Cash");
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
    setModalOpen(false);
    setSaving(false);
    setEditTarget(null);
    setFAmount("");
    setFItems("");
    setFMethod("Cash");
  };

  const handleSave = () => {
    if (!fAmount || isNaN(Number(fAmount))) return;
    setSaving(true);

    setTimeout(() => {
      if (editTarget) {
        setTxns((p) =>
          p.map((t) =>
            t.id === editTarget.id
              ? {
                  ...t,
                  amount: parseFloat(fAmount),
                  items: fItems,
                  method: fMethod,
                }
              : t,
          ),
        );
        toast("Transaction updated successfully", "success");
      } else {
        const newTxn: Transaction = {
          id: uid(),
          time: now(),
          items: fItems || "Manual entry",
          amount: parseFloat(fAmount),
          method: fMethod,
        };
        setTxns((p) => [newTxn, ...p]);
        toast("Sale logged successfully", "success");
      }
      closeModal();
    }, 400);
  };

  const handleDelete = (t: Transaction) => {
    setDeleteTarget(null);
    setTxns((p) =>
      p.map((x) => (x.id === t.id ? { ...x, deletedAt: Date.now() } : x)),
    );

    const toastId = Date.now();
    setToasts((p) => [
      ...p,
      {
        id: toastId,
        msg: `"${t.items.slice(0, 28)}..." deleted`,
        type: "undo",
        txnId: t.id,
      },
    ]);

    setTimeout(() => {
      setTxns((p) => p.filter((x) => x.id !== t.id));
      setToasts((p) => p.filter((x) => x.id !== toastId));
    }, 5000);
  };

  const handleUndo = (toastId: number, txnId: string) => {
    setTxns((p) =>
      p.map((t) => (t.id === txnId ? { ...t, deletedAt: undefined } : t)),
    );
    dismissToast(toastId);
    toast("Deletion undone", "success");
  };

  const activeTxns = txns.filter((t) => !t.deletedAt);
  const filtered = activeTxns.filter(
    (t) =>
      t.items.toLowerCase().includes(search.toLowerCase()) ||
      t.time.toLowerCase().includes(search.toLowerCase()),
  );
  const totalRevenue = activeTxns.reduce((s, t) => s + t.amount, 0);
  const avgSale = activeTxns.length ? totalRevenue / activeTxns.length : 0;
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
            {t.type === "undo" && t.txnId && (
              <button
                onClick={() => handleUndo(t.id, t.txnId!)}
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
        currentPath="/vendor/sales"
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        title="Delete Transaction?"
        description="You can undo this within 5 seconds after deletion."
        previewText={deleteTarget?.items || "Manual entry"}
        previewSubtext={
          deleteTarget
            ? `$${deleteTarget.amount.toFixed(2)} · ${deleteTarget.time}`
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
                  {editTarget ? "Edit Sale" : "Log New Sale"}
                </div>
                <div className="text-[12px] text-[#7d8590] mt-0.5">
                  {editTarget ? "កែប្រែការលក់" : "កត់ត្រាការលក់រហ័ស"}
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
                    className="w-full pl-10 pr-4 py-4 bg-[#f7f8fa] border border-[#e8eaed] rounded-[12px] text-[24px] font-bold outline-none text-[#111827] focus:border-[#3ecf8e] transition-colors"
                    style={{ fontFamily: "inherit" }}
                  />
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.06em] mb-2">
                  Items{" "}
                  <span className="text-[#9ca3af] font-normal normal-case tracking-normal">
                    (optional)
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 2x Coffee Latte, 1x Spring Roll"
                  value={fItems}
                  onChange={(e) => setFItems(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && fAmount) handleSave();
                  }}
                  className="w-full px-4 py-3.5 bg-[#f7f8fa] border border-[#e8eaed] rounded-[12px] text-[14px] outline-none text-[#111827] focus:border-[#3ecf8e] transition-colors"
                  style={{ fontFamily: "inherit" }}
                />
              </div>

              <div>
                <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.06em] mb-2">
                  Payment Method
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["Cash", "ABA/KHQR", "Other"] as Method[]).map((m) => (
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
                  {saving ? (
                    <>
                      <CheckCircle2 size={16} />{" "}
                      {editTarget ? "Updated!" : "Saved!"}
                    </>
                  ) : (
                    <>
                      <Plus size={16} />{" "}
                      {editTarget ? "Update Sale" : "Save Log"}
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
        {/* ── Topbar ── */}
        <FreeTopbar
          title="Sales"
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
                <Plus size={14} /> Add Sale
              </button>
            </>
          }
        />

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px]">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-5">
            {/* ══ SALES HEADER ══════════════════════════════════════ */}
            <div className="pt-1 pb-2">
              <h1 className="text-[26px] font-bold text-slate-900">My Sales</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Track and manage your daily sales · តាមដាន និងគ្រប់គ្រងការលក់
              </p>
            </div>

            {/* ── 3 stat cards (Using Extracted Components) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FreeStatCard
                variant="dark"
                title={`${period}'s Revenue`}
                khmerTitle="ចំណូលប្រចាំ"
                value={`$${totalRevenue.toFixed(2)}`}
              />
              <FreeStatCard
                title="Transactions"
                khmerTitle="ចំនួនការលក់"
                value={activeTxns.length}
                subtext="sales today"
              />
              <FreeStatCard
                title="Avg. Sale"
                khmerTitle="មធ្យមតម្លៃ"
                value={`$${avgSale.toFixed(2)}`}
                subtext="per txn"
              />
            </div>

            {/* ── Transactions table (Still Inline) ── */}
            <div className="bg-white border border-[#e8eaed] rounded-[14px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <div className="px-[22px] py-4 border-b border-[#f0f2f5] flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-[14px] font-semibold text-[#111827]">
                    Transaction History
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
                    placeholder="Search transactions..."
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
                      Items
                    </th>
                    <th className="px-[22px] py-[11px] text-[10.5px] font-bold text-[#9ca3af] uppercase tracking-[0.07em]">
                      Method
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
                    filtered.map((t, i) => (
                      <tr
                        key={t.id}
                        className={`group transition-colors hover:bg-[#f7f8fa] cursor-pointer ${i < filtered.length - 1 ? "border-b border-[#f0f2f5]" : ""}`}
                        onClick={() => openEdit(t)}
                      >
                        <td className="px-[22px] py-[14px] text-[13px] text-[#6b7280] whitespace-nowrap">
                          {t.time}
                        </td>
                        <td className="px-[22px] py-[14px] text-[13px] font-medium text-[#111827] max-w-[280px] truncate">
                          {t.items || "—"}
                        </td>
                        <td className="px-[22px] py-[14px]">
                          <span
                            className={`inline-block px-2.5 py-[3px] rounded-full text-[11.5px] font-semibold ${METHOD_BADGE[t.method]}`}
                          >
                            {t.method}
                          </span>
                        </td>
                        <td className="px-[22px] py-[14px] text-[13.5px] font-bold text-[#3ecf8e] text-right whitespace-nowrap">
                          +${t.amount.toFixed(2)}
                        </td>
                        <td
                          className="px-[22px] py-[14px] text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-[22px] py-14 text-center">
                        <div className="text-[13px] text-[#9ca3af]">
                          {search
                            ? "No transactions match your search"
                            : "No transactions yet — add your first sale!"}
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
                  <span className="text-[12px] text-[#9ca3af]">
                    {filtered.length} of {activeTxns.length} records
                  </span>
                  <span className="text-[13px] font-bold text-[#111827]">
                    Total:{" "}
                    <span className="text-[#3ecf8e]">
                      ${filtered.reduce((s, t) => s + t.amount, 0).toFixed(2)}
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
