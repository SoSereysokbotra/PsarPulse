"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Package,
  Plus,
  TrendingUp,
  Search,
  AlertTriangle,
  Edit2,
  X,
  PlusCircle,
  TrendingDown,
  Clock,
  PieChart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useUser } from "@/components/providers/UserProvider";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorTopbar from "@/components/vendor/VendorTopbar";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { ConfirmModal } from "@/components/ConfirmModal";
import { offlineFetch } from "@/lib/pwa/offline-fetch";

export type Category = "Clothing" | "Electronics" | "Household" | "Stationery" | "Personal Care" | "Toys" | "Hardware" | "Other";

export interface InventoryItem {
  id: string;
  name: string;
  khmerName?: string;
  price: number;
  stock: number;
  threshold: number;
  status: "good" | "low" | "out";
  category?: string;
}

export type ToastT = {
  id: number;
  msg: string;
  type: "success" | "error" | "warning";
};

export default function FreeInventoryPage() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const { vendor } = useUser();
  const isKhmer = language === "km";
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState<ToastT[]>([]);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<InventoryItem | null>(null);
  const [fName, setFName] = useState("");
  const [fKhName, setFKhName] = useState("");
  const [fPrice, setFPrice] = useState("");
  const [fStock, setFStock] = useState("");
  const [fThreshold, setFThreshold] = useState("10");
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null);

  const fetchInventory = async () => {
    try {
      const res = await offlineFetch("/api/vendor/inventory");
      const data = await res.json();
      if (data.success) {
        const mapped = data.data.map((i: any) => ({
          ...i,
          price: parseFloat(i.price),
          stock: parseInt(i.stock),
          threshold: parseInt(i.threshold)
        }));
        setInventory(mapped);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const showToast = useCallback((msg: string, type: ToastT["type"] = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 3500);
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    setFName("");
    setFKhName("");
    setFPrice("");
    setFStock("");
    setFThreshold("10");
  };

  const openAdd = () => {
    if (inventory.length >= 30) {
      showToast("Inventory limit reached (30/30). Upgrade for more!", "warning");
      return;
    }
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditTarget(item);
    setFName(item.name);
    setFKhName(item.khmerName || "");
    setFPrice(item.price.toString());
    setFStock(item.stock.toString());
    setFThreshold(item.threshold.toString());
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fName || !fPrice || !fStock) return;
    setSaving(true);
    try {
      const url = editTarget ? `/api/vendor/inventory/${editTarget.id}` : "/api/vendor/inventory";
      const method = editTarget ? "PUT" : "POST";
      const res = await offlineFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fName,
          khmerName: fKhName,
          price: parseFloat(fPrice),
          stock: parseInt(fStock),
          threshold: parseInt(fThreshold),
        }),
      });
      const result = await res.json();
      if (result.success) {
        showToast(editTarget ? t("inventory.modal.updated") || "Item updated" : t("inventory.modal.added") || "Item added to inventory");
        fetchInventory();
        closeModal();
      } else {
        showToast(result.message || t("dashboard.status.error"), "error");
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
      const res = await offlineFetch(`/api/vendor/inventory/${deleteTarget.id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        showToast(t("dashboard.status.logged") || "Item deleted");
        fetchInventory();
      }
    } catch (error) {
      showToast("Error deleting", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = inventory.filter(
    (i) => i.name.toLowerCase().includes(search.toLowerCase()) || (i.khmerName || "").includes(search)
  );

  const lowStock = inventory.filter(i => i.stock <= i.threshold).length;
  const totalValue = inventory.reduce((s, i) => s + (i.price * i.stock), 0);

  const sidebarLinks = [
    { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/vendor" },
    { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/vendor/sales" },
    { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/vendor/expenses" },
    { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/vendor/customer" },
    { icon: Package, title: "Inventory", khmerTitle: "ស្តុក", href: "/vendor/inventory" },
  ];

  return (
    <div className={`min-h-screen flex font-sans selection:bg-[#29B28D] transition-colors duration-300 ${isDark ? "bg-dark-bg text-[#e6edf3]" : "bg-slate-100 text-slate-900"}`}>
      {/* ── Toasts ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.18)] text-[13.5px] font-semibold min-w-[300px] border ${
            t.type === "error" ? "bg-white text-red-500 border-red-100" : 
            t.type === "warning" ? "bg-[#FFF4E5] text-[#B76E00] border-[#FFE2B7]" :
            "bg-white text-slate-900 border-slate-200"
          }`}>
            {t.type === "success" ? <CheckCircle2 size={16} className="text-[#29B28D]" /> : 
             t.type === "warning" ? <AlertTriangle size={16} className="text-[#f59e0b]" /> :
             <AlertCircle size={16} className="text-red-500" />}
            <span className="flex-1">{t.msg}</span>
          </div>
        ))}
      </div>

      <VendorSidebar plan={(vendor?.plan?.name as any) || "free"} currentPath="/vendor/inventory" navLinks={sidebarLinks} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <VendorTopbar
          title={t("inventory.title")}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          setIsMobileSidebarOpen={setIsSidebarOpen}
          rightActions={
            <button onClick={openAdd} className="flex items-center gap-2 bg-[#0d1117] text-[#29B28D] px-4 py-[9px] rounded-[10px] font-bold text-[13px] border border-[#29B28D]/20 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-black transition-all">
              <Plus size={14} /> {t("inventory.addProduct")}
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px]">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
            <div className="flex justify-between items-end">
              <div>
                <h1 className={`text-[26px] font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{t("inventory.title")}</h1>
                <p className={`text-sm mt-0.5 text-slate-500`}>{t("inventory.subtitle")}</p>
              </div>
              <div className={`px-4 py-2 rounded-xl border flex items-center gap-3 ${
                inventory.length >= 30 ? "bg-red-50 border-red-100 text-red-600" : "bg-white dark:bg-dark-surface border-slate-200"
              }`}>
                <div className="text-xs font-bold uppercase tracking-wider opacity-60">{t("inventory.usage")}</div>
                <div className="text-lg font-black tracking-tight">{inventory.length}<span className="opacity-30 mx-1">/</span>30</div>
              </div>
            </div>

            {/* Upgrade Banner if limit approached */}
            {inventory.length >= 25 && (
              <div className="bg-gradient-to-r from-[#0d1117] to-[#1a222e] rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#29B28D]/10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#29B28D]/10 border border-[#29B28D]/20 flex items-center justify-center text-[#29B28D] shrink-0">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{t("inventory.upgrade.title")}</h3>
                    <p className="text-slate-400 text-sm mt-1">{t("inventory.upgrade.desc")}</p>
                  </div>
                </div>
                <Link href="/vendor/pricing" className="bg-[#29B28D] text-[#0d1117] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#249e7d] transition-all no-underline whitespace-nowrap">
                  {t("inventory.upgrade.button")} <ArrowRight size={16} />
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <VendorSummaryCard variant="dark" title={t("inventory.inStock")} khmerTitle={t("inventory.inStock")} value={inventory.length} icon={Package} />
              <VendorSummaryCard title={t("inventory.inventoryValue")} khmerTitle={t("inventory.inventoryValue")} value={`$${totalValue.toFixed(2)}`} icon={PieChart} variant={isDark ? "dark" : "light"} />
              <VendorSummaryCard title={t("inventory.lowStock")} khmerTitle={t("inventory.lowStock")} value={lowStock} icon={AlertTriangle} highlight={lowStock > 0} variant={isDark ? "dark" : "light"} />
              <VendorSummaryCard title={t("inventory.todaysActive")} khmerTitle={t("inventory.todaysActive")} value={inventory.filter(i => i.stock > 0).length} icon={Clock} variant={isDark ? "dark" : "light"} />
            </div>

            {/* Search and Table */}
            <div className={`border rounded-[14px] overflow-hidden shadow-sm ${isDark ? "bg-dark-surface border-white/5" : "bg-white border-[#e8eaed]"}`}>
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between flex-wrap gap-4">
                <h3 className="font-semibold text-sm">{t("inventory.productList")}</h3>
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 transition-all w-60 focus-within:border-[#29B28D]/30 group">
                  <Search className="w-4 h-4 text-slate-300 dark:text-slate-500 transition-colors group-focus-within:text-[#29B28D]" />
                  <input type="text" placeholder={t("inventory.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-[13px] w-full placeholder:text-slate-400 dark:text-white" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10.5px] uppercase font-bold text-slate-500 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-3">{t("inventory.table.productInfo")}</th>
                      <th className="px-6 py-3">{t("inventory.table.price")}</th>
                      <th className="px-6 py-3">{t("inventory.table.stockLevel")}</th>
                      <th className="px-6 py-3">{t("inventory.table.status")}</th>
                      <th className="px-6 py-3 text-right">{t("inventory.table.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((item) => (
                      <tr key={item.id} className="group hover:bg-white/5 transition-colors text-[13.5px]">
                        <td className="px-6 py-4">
                          <div className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{item.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{item.khmerName || "—"}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-[#29B28D]">${parseFloat(item.price?.toString() || "0").toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="font-bold">{item.stock}</span>
                            <div className="w-24 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-700 ${
                                item.stock === 0 ? "bg-red-500" : item.stock <= item.threshold ? "bg-orange-500" : "bg-[#29B28D]"
                              }`} style={{ width: `${Math.min((item.stock / (item.threshold * 2)) * 100, 100)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.stock === 0 ? (
                            <span className="px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-[11px] font-bold">{t("inventory.status.outOfStock")}</span>
                          ) : item.stock <= item.threshold ? (
                            <span className="px-2.5 py-1 rounded-md bg-orange-100 text-orange-700 text-[11px] font-bold">{t("inventory.status.lowStock")}</span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 text-[11px] font-bold">{t("inventory.status.good")}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-1">
                            <button onClick={() => openEdit(item)} className="p-2 text-slate-400 hover:text-[#29B28D] hover:bg-[#29B28D]/10 rounded-lg transition-colors"><Edit2 size={15} /></button>
                            <button onClick={() => setDeleteTarget(item)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && !loading && (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">{t("inventory.empty")}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} title={isKhmer ? "លុបទំនិញ?" : "Delete Product?"} description={isKhmer ? "ការលុបទំនិញនេះនឹងមិនប៉ះពាល់ដល់ប្រវត្តិលក់ឡើយ។" : "Removing this product will not affect previous sales logs."} previewText={deleteTarget?.name} />

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden ${isDark ? "bg-dark-surface border border-white/10" : "bg-white"}`}>
            <div className="bg-[#0d1117] px-7 py-5 flex items-center justify-between text-[#e6edf3]">
              <div><div className="text-[18px] font-bold">{editTarget ? t("inventory.modal.editTitle") : t("inventory.modal.addTitle")}</div></div>
              <button onClick={closeModal}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-7 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t("inventory.modal.nameLabel")} *</label>
                <input required type="text" placeholder="e.g. Phone Case" value={fName} onChange={(e) => setFName(e.target.value)} className={`w-full px-4 py-3.5 rounded-xl text-[14px] border outline-none transition-all ${isDark ? "bg-[#0d1117] border-white/10 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"}`} />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t("inventory.modal.khmerNameLabel")}</label>
                <input type="text" placeholder={t("inventory.modal.khmerNamePlaceholder")} value={fKhName} onChange={(e) => setFKhName(e.target.value)} className={`w-full px-4 py-3.5 rounded-xl text-[14px] font-khmer border outline-none transition-all ${isDark ? "bg-[#0d1117] border-white/10 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"}`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t("inventory.modal.priceLabel")} *</label>
                  <input required type="number" step="0.01" placeholder="0.00" value={fPrice} onChange={(e) => setFPrice(e.target.value)} className={`w-full px-4 py-3.5 rounded-xl text-[14px] font-bold border outline-none transition-all ${isDark ? "bg-[#0d1117] border-white/10 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"}`} />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t("inventory.modal.stockLabel")} *</label>
                  <input required type="number" placeholder="0" value={fStock} onChange={(e) => setFStock(e.target.value)} className={`w-full px-4 py-3.5 rounded-xl text-[14px] border outline-none transition-all ${isDark ? "bg-[#0d1117] border-white/10 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"}`} />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t("inventory.modal.thresholdLabel")}</label>
                <input type="number" value={fThreshold} onChange={(e) => setFThreshold(e.target.value)} className={`w-full px-4 py-3.5 rounded-xl text-[14px] border outline-none transition-all ${isDark ? "bg-[#0d1117] border-white/10 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"}`} />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className={`flex-1 py-4 rounded-xl font-bold transition-all ${isDark ? "bg-white/5 text-slate-400 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{t("dashboard.actions.cancel")}</button>
                <button type="submit" disabled={saving} className="flex-[1.5] py-4 bg-[#0d1117] text-[#29B28D] font-bold rounded-xl shadow-lg border border-[#29B28D]/20 hover:bg-black disabled:opacity-50 transition-all">{saving ? t("inventory.modal.saving") : editTarget ? t("inventory.modal.update") : t("inventory.addProduct")}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
