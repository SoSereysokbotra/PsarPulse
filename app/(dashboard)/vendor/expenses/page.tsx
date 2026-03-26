"use client";
// dev-bump: 2026-03-26T11:29:00Z

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Menu,
  X,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  PieChart,
  TrendingDown,
  Clock,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
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
  type: "success" | "error";
};

export interface Expense {
  id: string;
  time: string;
  category: Category;
  note: string;
  amount: number;
  rawDate?: string;
}

// ─── Constants ────────────────────────────────────────────────────
const CATEGORIES: {
  value: Category;
  label: string;
  khmer: string;
  color: string;
}[] = [
  { value: "Ingredients", label: "Ingredients", khmer: "គ្រឿងផ្សំ", color: "#3ecf8e" },
  { value: "Rent", label: "Rent", khmer: "ថ្លៃជួល", color: "#3b82f6" },
  { value: "Transport", label: "Transport", khmer: "ការធ្វើដំណើរ", color: "#8b5cf6" },
  { value: "Electricity", label: "Electricity", khmer: "អគ្គិសនី", color: "#f59e0b" },
  { value: "Labor", label: "Labor", khmer: "កម្លាំងពលកម្ម", color: "#ef4444" },
  { value: "Others", label: "Others", khmer: "ផ្សេងៗ", color: "#6366f1" },
];

const CAT_BADGE: Record<string, string> = {
  Ingredients: "bg-[rgba(62,207,142,0.12)] text-[#3ecf8e] border border-[rgba(62,207,142,0.25)]",
  Rent: "bg-[rgba(59,130,246,0.1)] text-[#3b82f6] border border-[rgba(59,130,246,0.2)]",
  Transport: "bg-[rgba(139,92,246,0.1)] text-[#8b5cf6] border border-[rgba(139,92,246,0.2)]",
  Electricity: "bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border border-[rgba(245,158,11,0.2)]",
  Labor: "bg-[rgba(239,68,68,0.1)] text-[#ef4444] border border-[rgba(239,68,68,0.2)]",
  Others: "bg-[#f0f2f5] text-[#6b7280] border border-[#e8eaed]",
};

// ═════════════════════════════════════════════════════════════════
export default function ExpensesPage() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isKhmer = language === "km";
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<Period>("Day");
  const [toasts, setToasts] = useState<ToastT[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [fAmount, setFAmount] = useState("");
  const [fCategory, setFCategory] = useState<Category>("Ingredients");
  const [fNote, setFNote] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);

  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch("/api/vendor/expenses");
        const data = await res.json();
        if (data.success) {
          const mapped = data.data.map((e: any) => ({
            id: e.id,
            time: new Date(e.expenseDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            category: e.category as Category,
            note: e.description || "",
            amount: parseFloat(e.amount),
            rawDate: e.expenseDate,
          }));
          setExpenses(mapped);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // Click-away for menu
  useEffect(() => {
    const handleClick = () => setActiveMenuId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const showToast = useCallback((msg: string, type: ToastT["type"] = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 3500);
  }, []);

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
    setActiveMenuId(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSaving(false);
    setEditTarget(null);
    setFAmount("");
    setFNote("");
  };

  const handleSave = async () => {
    if (!fAmount || isNaN(Number(fAmount))) return;
    setSaving(true);
    try {
      const url = editTarget ? `/api/vendor/expenses/${editTarget.id}` : "/api/vendor/expenses";
      const method = editTarget ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(fAmount),
          category: fCategory,
          description: fNote,
          expenseDate: editTarget ? editTarget.rawDate : new Date().toISOString(),
        }),
      });
      const result = await res.json();
      if (result.success) {
        const mappedExp: Expense = {
          id: result.data.id,
          time: editTarget ? editTarget.time : "Just now",
          category: result.data.category as Category,
          note: result.data.description || "",
          amount: parseFloat(result.data.amount),
        };
        
        if (editTarget) {
          setExpenses((p) => p.map((x) => x.id === editTarget.id ? mappedExp : x));
          showToast("Expense updated");
        } else {
          setExpenses((p) => [mappedExp, ...p]);
          showToast("Expense logged successfully");
        }
        closeModal();
      }
    } catch (error) {
      showToast("Error saving", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/vendor/expenses/${deleteTarget.id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setExpenses((p) => p.filter((x) => x.id !== deleteTarget.id));
        showToast("Expense deleted");
      }
    } catch (error) {
      showToast("Error deleting", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = expenses.filter(
    (e) => e.note.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase())
  );
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const avgExpense = expenses.length ? totalExpense / expenses.length : 0;

  return (
    <div className={`min-h-screen flex font-sans selection:bg-[#29B28D] transition-colors duration-300 ${isDark ? "bg-dark-bg text-[#e6edf3]" : "bg-slate-100 text-slate-900"}`}>
      {/* ── Toasts ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.18)] text-[13.5px] font-semibold min-w-[280px] border ${t.type === "error" ? "bg-white text-red-500 border-red-100" : "bg-white text-slate-900 border-slate-200"}`}>
            {t.type === "success" ? <CheckCircle2 size={16} className="text-[#3ecf8e]" /> : <AlertCircle size={16} className="text-red-500" />}
            <span className="flex-1">{t.msg}</span>
          </div>
        ))}
      </div>

      <VendorSidebar plan="free" currentPath="/vendor/expenses" navLinks={[
        { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/vendor" },
        { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/vendor/sales" },
        { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/vendor/expenses" },
        { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/vendor/customer" },
      ]} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <VendorTopbar
          title="Expenses"
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          setIsMobileSidebarOpen={setIsSidebarOpen}
          rightActions={
          <>
            <div className={`hidden sm:flex items-center border rounded-[10px] p-[3px] ${isDark ? "bg-[#1a1a1a] border-white/10" : "bg-[#f0f2f5] border-[#e8eaed]"}`}>
              {(["Day", "Week", "Month"] as Period[]).map((p) => (
                <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-[7px] rounded-[8px] text-[13px] font-semibold border-0 cursor-pointer transition-all ${period === p ? (isDark ? "bg-dark-surface text-white shadow-md" : "bg-white text-slate-900 shadow-sm") : "bg-transparent text-slate-500 hover:text-slate-900"}`}>{p}</button>
              ))}
            </div>
            <button onClick={openAdd} className="flex items-center gap-2 bg-[#0d1117] text-[#3ecf8e] px-4 py-[9px] rounded-[10px] font-bold text-[13px] border border-[#3ecf8e]/20 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-black transition-all">
              <Plus size={14} /> Add Expense
            </button>
          </>
        } />

        <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px]">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
            <div>
              <h1 className={`text-[26px] font-bold ${isDark ? "text-white" : "text-slate-900"}`}>My Expenses</h1>
              <p className={`text-sm mt-0.5 text-slate-500`}>Track and manage your spending · តាមដាន និងគ្រប់គ្រងចំណាយ</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <VendorSummaryCard variant="dark" title="Total Expenses" khmerTitle="ចំណាយសរុប" value={`$${totalExpense.toFixed(2)}`} icon={Receipt} />
              <VendorSummaryCard title="Categories" khmerTitle="ប្រភេទ" value={new Set(expenses.map(e => e.category)).size} icon={PieChart} variant={isDark ? "dark" : "light"} />
              <VendorSummaryCard title="Avg. Expense" khmerTitle="មធ្យមចំណាយ" value={`$${avgExpense.toFixed(2)}`} icon={TrendingDown} variant={isDark ? "dark" : "light"} />
              <VendorSummaryCard title="Today's Count" khmerTitle="ចំនួនថ្ងៃនេះ" value={expenses.length} icon={Clock} highlight variant={isDark ? "dark" : "light"} />
            </div>

            {/* Category Breakdown */}
            <div className={`border rounded-[14px] px-[26px] py-[22px] shadow-sm ${isDark ? "bg-dark-surface border-white/5" : "bg-white border-[#e8eaed]"}`}>
              <div className={`text-[14px] font-semibold mb-0.5 ${isDark ? "text-white" : "text-[#111827]"}`}>Breakdown by Category</div>
              <div className={`text-[11px] text-slate-500 mb-5`}>ចំណាយតាមប្រភេទ</div>
              <div className="flex flex-col gap-[14px]">
                {CATEGORIES.map((cat) => {
                  const catTotal = expenses.filter(e => e.category === cat.value).reduce((s, e) => s + e.amount, 0);
                  const pct = totalExpense > 0 ? Math.round((catTotal / totalExpense) * 100) : 0;
                  return (
                    <div key={cat.value} className="flex items-center gap-4">
                      <div className="w-[100px] shrink-0">
                        <div className={`text-[12.5px] font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{cat.label}</div>
                        <div className="text-[10.5px] text-slate-400">{cat.khmer}</div>
                      </div>
                      <div className={`flex-1 h-[6px] rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: cat.color }} />
                      </div>
                      <div className="w-[80px] text-right font-bold text-[12.5px] text-[#ef4444]">{pct > 0 ? `$${catTotal.toFixed(2)}` : "—"}</div>
                      <div className="w-[34px] text-right text-[11.5px] text-slate-400">{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* History Table */}
            <div className={`border rounded-[14px] overflow-hidden shadow-sm ${isDark ? "bg-dark-surface border-white/5" : "bg-white border-[#e8eaed]"}`}>
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between flex-wrap gap-4">
                <h3 className="font-semibold text-sm">Spending Trends</h3>
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 transition-all w-60 focus-within:border-[#3ecf8e]/30 focus-within:shadow-[0_0_0_4px_rgba(62,207,142,0.03)] group">
                  <Search className="w-4 h-4 text-slate-300 dark:text-slate-500 transition-colors group-focus-within:text-[#3ecf8e]" />
                  <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-[13px] w-full placeholder:text-slate-400 dark:text-white" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10.5px] uppercase font-bold text-slate-500 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-3">Time</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Note</th>
                      <th className="px-6 py-3 text-right">Amount</th>
                      <th className="px-6 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((e) => (
                      <tr key={e.id} className="group hover:bg-white/5 transition-colors text-[13.5px]">
                        <td className="px-6 py-4 text-slate-400 flex items-center gap-2"><Clock size={14} /> {e.time}</td>
                        <td className="px-6 py-4 font-medium">
                          <span className={`px-2.5 py-1 rounded-md text-[11.5px] font-bold ${CAT_BADGE[e.category]}`}>{e.category}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{e.note || "—"}</td>
                        <td className="px-6 py-4 text-right font-bold text-red-500">-${e.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center relative">
                          <button onClick={(x) => { x.stopPropagation(); setActiveMenuId(activeMenuId === e.id ? null : e.id); }} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                            <MoreVertical size={16} className="text-slate-400" />
                          </button>
                          {activeMenuId === e.id && (
                            <div className={`absolute right-full top-1/2 -translate-y-1/2 mr-2 z-20 w-[120px] rounded-xl shadow-2xl border overflow-hidden ${isDark ? "bg-dark-surface border-white/10" : "bg-white border-slate-200"}`}>
                              <button onClick={() => openEdit(e)} className="w-full px-4 py-2.5 flex items-center gap-2 text-[12.5px] font-semibold hover:bg-white/5 text-[#3ecf8e] transition-colors"><Pencil size={14} /> Edit</button>
                              <button onClick={() => { setDeleteTarget(e); setActiveMenuId(null); }} className="w-full px-4 py-2.5 flex items-center gap-2 text-[12.5px] font-semibold hover:bg-white/5 text-red-500 transition-colors"><Trash2 size={14} /> Delete</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} title="Delete Expense?" description="This action cannot be undone." previewText={deleteTarget ? `$${deleteTarget.amount.toFixed(2)}` : ""} />

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden ${isDark ? "bg-dark-surface border border-white/10" : "bg-white"}`}>
            <div className="bg-[#0d1117] px-7 py-5 flex items-center justify-between text-[#e6edf3]">
              <div><div className="text-[18px] font-bold">{editTarget ? "Edit Expense" : "Log New Expense"}</div><div className="text-[12px] text-slate-500">{editTarget ? "កែប្រែចំណាយ" : "កត់ត្រាចំណាយ"}</div></div>
              <button onClick={closeModal}><X size={18} /></button>
            </div>
            <div className="p-7 space-y-5">
              <div><label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Amount *</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">$</span>
                  <input ref={amountRef} type="number" placeholder="0.00" value={fAmount} onChange={(e) => setFAmount(e.target.value)} className="w-full pl-9 pr-4 py-4 rounded-xl text-2xl font-bold border outline-none bg-slate-50 focus:border-[#ef4444]" />
                </div>
              </div>
              <div><label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Category</label>
                <div className="grid grid-cols-3 gap-2">{CATEGORIES.map(cat => (
                  <button key={cat.value} onClick={() => setFCategory(cat.value)} className={`py-2.5 rounded-lg text-xs font-bold transition-all border-0 ${fCategory === cat.value ? "text-white shadow-md" : "bg-slate-50 text-slate-500"}`} style={fCategory === cat.value ? { background: cat.color } : {}}>{cat.label}</button>
                ))}</div>
              </div>
              <div><label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Note (Optional)</label>
                <input type="text" placeholder="e.g. Market run" value={fNote} onChange={(e) => setFNote(e.target.value)} className="w-full px-4 py-3.5 rounded-xl text-sm border outline-none bg-slate-50 focus:border-[#3ecf8e]" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={closeModal} className="flex-1 py-4 rounded-xl bg-slate-100 text-slate-500 font-bold">Cancel</button>
                <button onClick={handleSave} disabled={!fAmount || saving} className="flex-[1.5] py-4 bg-[#0d1117] text-[#3ecf8e] font-bold rounded-xl shadow-lg border border-[#3ecf8e]/20 hover:bg-black disabled:opacity-50 transition-all">{saving ? "Saving..." : "Save Log"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
