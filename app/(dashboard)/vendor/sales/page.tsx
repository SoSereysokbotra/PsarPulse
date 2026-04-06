"use client";
// dev-bump: 2026-03-26T11:28:00Z

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
  ShoppingCart,
  BarChart3,
  CreditCard,
  TrendingUp,
  Pencil,
  Trash2,
  Package,
  Clock
} from "lucide-react";
import EllipsisVertical from "lucide-react/dist/esm/icons/ellipsis-vertical";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useUser } from "@/components/providers/UserProvider";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorTopbar from "@/components/vendor/VendorTopbar";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { ConfirmModal } from "@/components/ConfirmModal";
import { offlineFetch } from "@/lib/pwa/offline-fetch";

// ─── Types ────────────────────────────────────────────────────────
export type Period = "Day" | "Week" | "Month";
export type Method = "Cash" | "ABA/KHQR" | "Other";
export type ToastT = {
  id: number;
  msg: string;
  type: "success" | "error";
};

export interface Transaction {
  id: string;
  time: string;
  date: string;
  items: string;
  amount: number;
  method: Method;
  rawDate?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────
const now = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

const METHOD_BADGE: Record<Method, string> = {
  Cash: "bg-[rgba(41,178,141,0.12)] text-[#29B28D] border border-[rgba(41,178,141,0.25)]",
  "ABA/KHQR":
    "bg-[rgba(59,130,246,0.10)] text-[#3b82f6] border border-[rgba(59,130,246,0.2)]",
  Other: "bg-[#f0f2f5] text-[#6b7280] border border-[#e8eaed]",
};

// ═════════════════════════════════════════════════════════════════
export default function SalesDashboard() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const { vendor } = useUser();
  const isKhmer = language === "km";
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [period, setPeriod] = useState<Period>("Day");
  const [search, setSearch] = useState("");

  // Data state
  const [toasts, setToasts] = useState<ToastT[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [fAmount, setFAmount] = useState("");
  const [fItems, setFItems] = useState("");
  const [fMethod, setFMethod] = useState<Method>("Cash");
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const amountRef = useRef<HTMLInputElement>(null);

  // Fetch sales on mount
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const [salesRes, invRes] = await Promise.all([
          offlineFetch("/api/vendor/sales"),
          offlineFetch("/api/vendor/inventory")
        ]);
        const salesData = await salesRes.json();
        const invData = await invRes.json();
        
        if (invData.success) {
          setInventory(invData.data);
        }

        if (salesData.success) {
          const mapped = salesData.data.map((s: any) => ({
            id: s.id,
            time: new Date(s.createdAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            }),
            date: new Date(s.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            }),
            items: s.items || "",
            amount: parseFloat(s.amount),
            method: s.method,
            rawDate: s.createdAt,
          }));
          setTxns(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch sales:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
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
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setSaving(false);
    setEditTarget(null);
    setFAmount("");
    setFItems("");
    setFMethod("Cash");
  };

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
    setActiveMenuId(null);
  };

  const handleSave = async () => {
    if (!fAmount || isNaN(Number(fAmount))) return;
    setSaving(true);
    try {
      const url = editTarget ? `/api/vendor/sales/${editTarget.id}` : "/api/vendor/sales";
      const method = editTarget ? "PUT" : "POST";
      
      const res = await offlineFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(fAmount),
          method: fMethod,
          items: fItems,
        }),
      });
      const result = await res.json();
      if (result.success) {
        const mappedTxn: Transaction = {
          id: result.data.id,
          time: editTarget ? editTarget.time : now(),
          date: editTarget ? editTarget.date : new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          }),
          items: result.data.items || "",
          amount: parseFloat(result.data.amount),
          method: result.data.method,
        };
               
        if (editTarget) {
          setTxns((p) => p.map((x) => x.id === editTarget.id ? mappedTxn : x));
          showToast(t("dashboard.status.logged")); // Simplified
        } else {
          setTxns((p) => [mappedTxn, ...p]);
          showToast(t("dashboard.status.logged"));
        }
        closeModal();
      }
    } catch (error) {
      showToast("Error saving sale", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await offlineFetch(`/api/vendor/sales/${deleteTarget.id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setTxns((p) => p.filter((x) => x.id !== deleteTarget.id));
        showToast("Sale deleted");
      }
    } catch (error) {
      showToast("Error deleting", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = txns.filter(
    (t) =>
      t.items.toLowerCase().includes(search.toLowerCase()) ||
      t.time.toLowerCase().includes(search.toLowerCase()),
  );
  const totalRevenue = txns.reduce((s, t) => s + t.amount, 0);
  const avgSale = txns.length ? totalRevenue / txns.length : 0;
  const hasData = txns.length > 0;

  return (
    <div className={`min-h-screen flex font-sans selection:bg-[#29B28D] transition-colors duration-200 ${isDark ? "bg-dark-bg text-[#e6edf3]" : "bg-slate-100 text-slate-900"}`}>
      {/* ── Toasts ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.18)] text-[13.5px] font-semibold min-w-[280px] border ${t.type === "error" ? "bg-white text-[#ef4444] border-[#fecaca]" : "bg-white text-[#111827] border-[#e8eaed]"}`}>
            {t.type === "success" ? <CheckCircle2 size={16} className="text-[#29B28D]" /> : <AlertCircle size={16} className="text-[#ef4444]" />}
            <span className="flex-1">{t.msg}</span>
          </div>
        ))}
      </div>

      <VendorSidebar plan={(vendor?.plan?.name as any) || "free"} currentPath="/vendor/sales" navLinks={[
        { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/vendor" },
        { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/vendor/sales" },
        { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/vendor/expenses" },
        { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/vendor/customer" },
        { icon: Package, title: "Inventory", khmerTitle: "ស្តុក", href: "/vendor/inventory" },
      ]} />

      <main className="flex-1 flex flex-col w-full h-screen overflow-hidden">
        <VendorTopbar
          title={t("dashboard.sales")}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          setIsMobileSidebarOpen={setIsSidebarOpen}
          rightActions={
          <>
            <div className={`hidden sm:flex items-center border rounded-[10px] p-[3px] ${isDark ? "bg-[#1a1a1a] border-white/10" : "bg-[#f0f2f5] border-[#e8eaed]"}`}>
              {(["Day", "Week", "Month"] as Period[]).map((p) => (
                <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-[7px] rounded-[8px] text-[13px] font-semibold border-0 cursor-pointer transition-all ${period === p ? (isDark ? "bg-dark-surface text-white shadow-md" : "bg-white text-[#111827] shadow-sm") : "text-slate-500 hover:text-[#111827]"}`}>{p}</button>
              ))}
            </div>
            <button onClick={openAdd} className="flex items-center gap-[7px] bg-[#0d1117] text-[#29B28D] border border-[#29B28D]/20 rounded-[10px] px-4 py-[9px] font-bold text-[13px] shadow-[0_2px_14px_rgba(0,0,0,0.15)] hover:bg-black transition-all">
              <Plus size={14} /> {t("dashboard.actions.addSale")}
            </button>
          </>
        } />

        <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px]">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-5">
            <div>
              <h1 className="text-[26px] font-bold">{t("dashboard.titles.mySales")}</h1>
              <p className="text-sm text-slate-500 mt-0.5">{t("dashboard.titles.salesSubtitle")}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <VendorSummaryCard variant="dark" title={t("dashboard.metrics.revenue")} khmerTitle={t("dashboard.metrics.revenue")} value={`$${totalRevenue.toFixed(2)}`} />
              <VendorSummaryCard title={t("dashboard.metrics.sales")} khmerTitle={t("dashboard.metrics.sales")} value={txns.length} variant={isDark ? "dark" : "light"} />
              <VendorSummaryCard title={t("dashboard.metrics.avgSale")} khmerTitle={t("dashboard.metrics.avgSale")} value={`$${avgSale.toFixed(2)}`} variant={isDark ? "dark" : "light"} />
            </div>

            <div className={`border rounded-[14px] overflow-hidden shadow-sm ${isDark ? "bg-dark-surface border-white/5" : "bg-white border-[#e8eaed]"}`}>
              <div className="px-[22px] py-4 border-b border-white/5 flex items-center justify-between flex-wrap gap-3">
                <h3 className="font-semibold text-[14px]">{t("dashboard.titles.history")}</h3>
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 transition-all w-64 focus-within:border-[#29B28D]/30 focus-within:shadow-[0_0_0_4px_rgba(41,178,141,0.03)] group">
                  <Search className="w-4 h-4 text-slate-300 dark:text-slate-500 transition-colors group-focus-within:text-[#29B28D]" />
                  <input type="text" placeholder={t("dashboard.common.search")} value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-[13px] w-full placeholder:text-slate-400 dark:text-white" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10.5px] uppercase font-bold text-slate-500 border-b border-white/5">
                    <tr>
                      <th className="px-[22px] py-[11px]">{t("dashboard.table.time")}</th>
                      <th className="px-[22px] py-[11px]">{t("dashboard.table.items")}</th>
                      <th className="px-[22px] py-[11px]">{t("dashboard.table.method")}</th>
                      <th className="px-[22px] py-[11px] text-right">{t("dashboard.table.amount")}</th>
                      <th className="px-[22px] py-[11px] text-center">{t("dashboard.table.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((txn) => (
                      <tr key={txn.id} className="group hover:bg-white/5 transition-colors text-[13px]">
                        <td className="px-[22px] py-[14px]">
                          <div className="text-white font-medium">{txn.time}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{txn.date}</div>
                        </td>
                        <td className="px-[22px] py-[14px] font-medium">{txn.items || "—"}</td>
                        <td className="px-[22px] py-[14px]">
                          <span className={`px-2.5 py-[3px] rounded-full text-[11px] font-bold ${METHOD_BADGE[txn.method]}`}>{txn.method}</span>
                        </td>
                        <td className="px-[22px] py-[14px] text-right font-bold text-[#29B28D]">+${txn.amount.toFixed(2)}</td>
                        <td className="px-[22px] py-[14px] text-center relative">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === txn.id ? null : txn.id); }}
                            className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${activeMenuId === txn.id ? "bg-white/10" : ""}`}
                          >
                            <EllipsisVertical size={16} className="text-slate-400" />
                          </button>
                          {activeMenuId === txn.id && (
                            <div className={`absolute right-full top-1/2 -translate-y-1/2 mr-2 z-20 w-[120px] rounded-xl shadow-2xl border overflow-hidden ${isDark ? "bg-dark-surface border-white/10" : "bg-white border-slate-200"}`}>
                              <button onClick={() => openEdit(txn)} className="w-full px-4 py-2.5 flex items-center gap-2 text-[12.5px] font-semibold hover:bg-white/5 text-[#29B28D] transition-colors"><Pencil size={14} /> {t("dashboard.common.edit")}</button>
                              <button onClick={() => { setDeleteTarget(txn); setActiveMenuId(null); }} className="w-full px-4 py-2.5 flex items-center gap-2 text-[12.5px] font-semibold hover:bg-white/5 text-red-500 transition-colors"><Trash2 size={14} /> {t("dashboard.common.delete")}</button>
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

      <ConfirmModal 
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete}
        title={t("dashboard.modals.deleteSaleTitle")} description={t("dashboard.modals.deleteConfirmDesc")} previewText={deleteTarget ? `$${deleteTarget.amount.toFixed(2)}` : ""}
      />

      {/* ── Add/Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden ${isDark ? "bg-dark-surface border border-white/5" : "bg-white"}`}>
            <div className="bg-[#0d1117] px-7 py-5 flex items-center justify-between text-[#e6edf3]">
              <div><div className="text-[18px] font-bold">{editTarget ? t("dashboard.modals.editSaleTitle") : t("dashboard.modals.addSaleTitle")}</div></div>
              <button onClick={closeModal}><X size={18} /></button>
            </div>
            <div className="p-7 space-y-5">
              {/* Inventory Picker */}
              {!editTarget && (
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 block">{t("inventory.modal.pickLabel")} {isKhmer ? "(ជ្រើសរើសពីស្តុក)" : ""}</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {inventory.length > 0 ? (
                      inventory.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setFAmount(item.price.toString());
                            setFItems(item.name);
                          }}
                          className={`shrink-0 px-4 py-2.5 rounded-xl border text-[13px] font-bold transition-all flex flex-col items-start gap-1 min-w-[120px] ${
                            fItems === item.name 
                              ? "bg-[#29B28D] border-[#29B28D] text-[#0d1117] shadow-md" 
                              : isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          <span className="truncate w-full text-left">{item.name}</span>
                          <span className={`text-[11px] ${fItems === item.name ? "text-[#0d1117]/70" : "text-slate-500"}`}>${parseFloat(item.price).toFixed(2)}</span>
                        </button>
                      ))
                    ) : (
                      <Link href="/vendor/inventory" className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-300 dark:border-white/10 text-slate-500 text-xs no-underline hover:border-[#29B28D] transition-all">
                        <Package size={14} /> {t("inventory.modal.quickPickEmpty")}
                      </Link>
                    )}
                  </div>
                </div>
              )}

              <div><label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t("inventory.modal.amountLabel")} *</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">$</span>
                  <input ref={amountRef} type="number" placeholder="0.00" value={fAmount} onChange={(e) => setFAmount(e.target.value)} className={`w-full pl-9 pr-4 py-4 rounded-xl text-2xl font-bold border outline-none transition-all ${isDark ? "bg-[#0d1117] border-white/10 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"}`} />
                </div>
              </div>
              <div><label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t("inventory.modal.itemsLabel")}</label>
                <input type="text" placeholder="e.g. 2x Coffee" value={fItems} onChange={(e) => setFItems(e.target.value)} className={`w-full px-4 py-3.5 rounded-xl text-[14px] border outline-none transition-all ${isDark ? "bg-[#0d1117] border-white/10 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"}`} />
              </div>
              <div><label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t("inventory.modal.paymentMethodLabel")}</label>
                <div className="grid grid-cols-3 gap-2">{(["Cash", "ABA/KHQR", "Other"] as Method[]).map((m) => (
                  <button key={m} onClick={() => setFMethod(m)} className={`py-3 rounded-[10px] text-[13px] font-bold transition-all ${fMethod === m ? "bg-[#29B28D] text-[#0d1117] shadow-lg" : isDark ? "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10" : "bg-slate-50 text-slate-500 border border-transparent hover:bg-slate-100"}`}>
                    {m === "Cash" ? t("dashboard.methods.cash") : m === "ABA/KHQR" ? t("dashboard.methods.qr") : t("dashboard.methods.other")}
                  </button>
                ))}</div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={closeModal} className={`flex-1 py-4 rounded-xl font-bold transition-all ${isDark ? "bg-white/5 text-slate-400 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{t("dashboard.actions.cancel")}</button>
                <button onClick={handleSave} disabled={!fAmount || saving} className="flex-[1.5] py-4 bg-[#0d1117] text-[#29B28D] font-bold rounded-xl shadow-lg border border-[#29B28D]/20 hover:bg-black transition-all">{saving ? t("inventory.modal.saving") : t("inventory.modal.saveLog")}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
