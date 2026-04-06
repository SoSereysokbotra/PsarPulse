"use client";
// dev-bump: 2026-03-26T11:27:00Z

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Search,
  Plus,
  Minus,
  Zap,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Package,
} from "lucide-react";
import EllipsisVertical from "lucide-react/dist/esm/icons/ellipsis-vertical";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useUser } from "@/components/providers/UserProvider";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorTopbar from "@/components/vendor/VendorTopbar";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { ConfirmModal } from "@/components/ConfirmModal";
import { offlineFetch } from "@/lib/pwa/offline-fetch";

export default function CustomersPage() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const { vendor } = useUser();
  const isKhmer = language === "km";
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customCount, setCustomCount] = useState(1);
  const [qExpAmount, setQExpAmount] = useState("");

  // Data state
  const [customers, setCustomers] = useState<any[]>([]);
  const [logHistory, setLogHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modal State (For Edit only now)
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [fName, setFName] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fSpent, setFSpent] = useState("0");
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [toasts, setToasts] = useState<any[]>([]);

  // Form Ref
  const addFormRef = useRef<HTMLFormElement>(null);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await offlineFetch("/api/vendor/customers");
        const data = await res.json();
        if (data.success) setCustomers(data.data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Fetch Traffic
  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        const res = await offlineFetch("/api/vendor/traffic");
        const data = await res.json();
        if (data.success) {
          const mapped = data.data.map((l: any) => ({
            id: l.id,
            time: new Date(l.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            count: l.count,
            status: l.status,
            rawDate: l.createdAt,
          }));
          setLogHistory(mapped);
        }
      } catch (e) {
        console.error("Traffic fetch error:", e);
      }
    };
    fetchTraffic();
  }, []);

  // Click-away for action menus
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".action-menu-container")) {
        setActiveMenuId(null);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);

  const summaryData = React.useMemo(() => {
    const nowTimestamp = new Date();
    const startOfToday = new Date(nowTimestamp.getFullYear(), nowTimestamp.getMonth(), nowTimestamp.getDate()).getTime();
    const sevenDaysAgo = nowTimestamp.getTime() - 7 * 24 * 60 * 60 * 1000;

    const todayMatches = logHistory.filter(l => new Date(l.rawDate).getTime() >= startOfToday);
    const weeklyMatches = logHistory.filter(l => new Date(l.rawDate).getTime() >= sevenDaysAgo);

    const totalSpentValue = customers.reduce((sum, c) => sum + parseFloat(c.totalSpent || 0), 0);
    const avgLTVValue = customers.length > 0 ? totalSpentValue / customers.length : 0;

    return {
      todayCount: todayMatches.reduce((sum, l) => sum + l.count, 0),
      todayLogs: todayMatches.length,
      avgSpend: customers.length > 0 ? `$${(totalSpentValue / (customers.length || 1)).toFixed(2)}` : "$0.00",
      weeklyCount: weeklyMatches.reduce((sum, l) => sum + l.count, 0),
      weeklyChange: "+12% vs last week",
      weeklyCustomers: `${customers.length} Customer${customers.length !== 1 ? "s" : ""}`,
      peakTime: todayMatches.length > 0 ? todayMatches[0].time : "—",
      avgLTV: `$${avgLTVValue.toFixed(2)}`,
    };
  }, [logHistory, customers]);

  const handleLogTraffic = async (amount: number) => {
    const status = amount >= 10 ? "Peak Traffic" : "Regular";
    try {
      const res = await offlineFetch("/api/vendor/traffic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: amount, status }),
      });
      if (res.ok) {
        const result = await res.json();
        setLogHistory((prev) => [
          {
            id: result.data.id,
            time: new Date(result.data.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            count: result.data.count,
            status: result.data.status,
            rawDate: result.data.createdAt,
          },
          ...prev,
        ]);
        showToast(t("dashboard.status.logged"));
      }
    } catch (e) {
      showToast("Failed to log traffic", "error");
    }
  };

  const handleLogQuickExpense = async (amt?: number) => {
    if (typeof amt !== "number" && (!qExpAmount || isNaN(Number(qExpAmount)))) return;
    try {
      const res = await offlineFetch("/api/vendor/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: typeof amt === "number" ? amt : parseFloat(qExpAmount),
          category: "Others",
          description: "Quick log from dashboard",
          expenseDate: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        showToast(t("dashboard.status.logged"));
        setQExpAmount("");
      }
    } catch (e) {
      showToast("Failed to log expense", "error");
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      totalSpent: parseFloat(formData.get("totalSpent") as string || "0"),
    };
    try {
      const res = await offlineFetch("/api/vendor/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        setCustomers(p => [result.data, ...p]);
        showToast(t("dashboard.status.logged"));
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      showToast("Error adding customer", "error");
    }
  };

  const openEdit = (c: any) => {
    setEditTarget(c);
    setFName(c.name);
    setFPhone(c.phone || "");
    setFEmail(c.email || "");
    setFSpent(c.totalSpent?.toString() || "0");
    setModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSaveEdit = async () => {
    if (!fName || !editTarget) return;
    setSaving(true);
    try {
      const res = await offlineFetch(`/api/vendor/customers/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: fName, 
          phone: fPhone, 
          email: fEmail,
          totalSpent: parseFloat(fSpent)
        }),
      });
      const result = await res.json();
      if (result.success) {
        setCustomers(p => p.map(x => x.id === editTarget.id ? result.data : x));
        showToast(t("dashboard.status.logged"));
        setModalOpen(false);
      }
    } catch (e) {
      showToast("Error updating", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await offlineFetch(`/api/vendor/customers/${deleteTarget.id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setCustomers(p => p.filter(x => x.id !== deleteTarget.id));
        showToast(t("dashboard.status.logged"));
      }
    } catch (e) {
      showToast("Error deleting", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredItems = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm))
  );

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-200 ${isDark ? "bg-dark-bg text-[#e6edf3]" : "bg-slate-100 text-slate-900"}`}>
      {/* Toasts */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.18)] text-[13.5px] font-semibold min-w-[280px] border ${t.type === "error" ? "bg-white text-[#ef4444] border-[#fecaca]" : "bg-white text-[#111827] border-[#e8eaed]"}`}>
            {t.type === "success" ? <CheckCircle2 size={16} className="text-[#29B28D]" /> : <AlertCircle size={16} className="text-[#ef4444]" />}
            <span className="flex-1">{t.msg}</span>
          </div>
        ))}
      </div>

      <VendorSidebar plan={(vendor?.plan?.name as any) || "free"} currentPath="/vendor/customer" navLinks={[
        { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/vendor" },
        { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/vendor/sales" },
        { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/vendor/expenses" },
        { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/vendor/customer" },
        { icon: Package, title: "Inventory", khmerTitle: "ស្តុក", href: "/vendor/inventory" },
      ]} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <VendorTopbar title={t("dashboard.customers")} isSidebarCollapsed={isCollapsed} setIsSidebarCollapsed={setIsCollapsed} setIsMobileSidebarOpen={setIsMobileOpen} />

        <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px] space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h1 className="text-[26px] font-bold">{t("dashboard.titles.myCustomers")}</h1>
              <p className="text-sm text-slate-500 mt-0.5">{t("dashboard.titles.customersSubtitle")}</p>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 transition-all w-64 focus-within:border-[#29B28D]/30 focus-within:shadow-[0_0_0_4px_rgba(41,178,141,0.03)] group">
              <Search className="w-4 h-4 text-slate-300 dark:text-slate-500 transition-colors group-focus-within:text-[#29B28D]" />
              <input type="text" placeholder={t("dashboard.common.search")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-[13px] w-full placeholder:text-slate-400 dark:text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <VendorSummaryCard variant="dark" title={t("dashboard.metrics.todayCustomer")} khmerTitle={t("dashboard.metrics.todayCustomer")} value={summaryData.todayCount} subtext={`${summaryData.todayLogs} logs`} />
            <VendorSummaryCard title={t("dashboard.metrics.avgSpend")} khmerTitle={t("dashboard.metrics.avgSpend")} value={summaryData.avgSpend} variant={isDark ? "dark" : "light"} />
            <VendorSummaryCard variant="green" title={t("dashboard.metrics.weeklyCustomer")} khmerTitle={t("dashboard.metrics.weeklyCustomer")} value={summaryData.weeklyCount} subtext={summaryData.weeklyChange} />
            <VendorSummaryCard title={t("dashboard.metrics.avgLtv")} khmerTitle={t("dashboard.metrics.avgLtv")} value={summaryData.avgLTV} variant={isDark ? "dark" : "light"} />
          </div>

          {/* Log Traffic Bar */}
          <div className="bg-[#0d1117] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#29B28D]/10">
            <div><p className="font-bold text-white text-[15px]">{t("dashboard.actions.logTraffic")}</p><p className="text-[11px] text-slate-400 mt-0.5">{t("dashboard.actions.logTrafficSub")}</p></div>
            <div className="flex items-center gap-2 flex-wrap">
              {[1, 5, 10].map(n => <button key={n} onClick={() => handleLogTraffic(n)} className="px-4 py-2 bg-[#1a1a1a] text-[#29B28D] text-sm font-bold rounded-xl border border-[#29B28D]/20 min-h-11 hover:bg-black transition-all">+{n}</button>)}
              <div className="flex items-center bg-white/10 rounded-xl px-2 py-1"><button onClick={() => setCustomCount(c => Math.max(1, c - 1))} className="text-white"><Minus size={14} /></button><span className="text-white font-bold mx-3">{customCount}</span><button onClick={() => setCustomCount(c => c + 1)} className="text-white"><Plus size={14} /></button></div>
              <button onClick={() => handleLogTraffic(customCount)} className="px-5 py-2 bg-[#29B28D] text-[#0d1117] font-bold rounded-xl text-sm min-h-11 hover:bg-[#249e7d] transition-colors flex items-center gap-1.5"><Plus size={14} /> {t("dashboard.actions.log")} {customCount}</button>
            </div>
          </div>

          {/* Quick Expense Bar */}
          <div className="bg-[#161B22] rounded-2xl p-5 flex flex-col lg:flex-row items-center justify-between gap-4 border border-red-500/10">
            <div className="flex items-center gap-3">
              <div className="bg-red-500/10 p-2 rounded-lg"><Receipt className="w-5 h-5 text-red-400" /></div>
              <div><p className="font-bold text-white text-[15px]">{t("dashboard.actions.quickLogExpense")}</p><p className="text-[11px] text-slate-400 mt-0.5">{t("dashboard.actions.quickLogSub")}</p></div>
            </div>
            <div className="flex flex-1 items-center gap-2 w-full lg:max-w-2xl justify-end">
               <div className="flex items-center gap-2 mr-2">
                 {[1, 5, 10].map(n => (
                   <button key={n} onClick={() => handleLogQuickExpense(n)} className="px-4 py-2 bg-red-500/5 text-red-400 text-sm font-bold rounded-xl border border-red-500/10 min-h-11 hover:bg-red-500/10 transition-all">
                     ${n}
                   </button>
                 ))}
               </div>
               <div className="relative w-32">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                 <input type="number" placeholder="0.00" value={qExpAmount} onChange={e => setQExpAmount(e.target.value)} className="w-full bg-[#0d1117] border border-white/10 rounded-xl pl-6 pr-3 py-2.5 text-sm text-white outline-none focus:border-red-500/30 transition-all" />
               </div>
               <button onClick={() => handleLogQuickExpense()} disabled={!qExpAmount} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold px-5 py-2.5 rounded-xl text-sm transition-all border border-red-500/20 disabled:opacity-50">{t("dashboard.actions.log")}</button>
            </div>
          </div>

          {/* Inline Form (Restored) */}
          <div className={`${isDark ? "bg-[#0d1117] border-white/10" : "bg-white border-slate-200"} border rounded-2xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{t("dashboard.modals.addCustomerTitle")}</h3>
              <Users className="w-5 h-5 text-[#29B28D]" />
            </div>
            <form ref={addFormRef} onSubmit={handleCreateCustomer} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Name *</label>
                <input name="name" required className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all ${isDark ? "bg-black/20 border-white/10 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"}`} placeholder="John Doe" />
              </div>
              <div>
                <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Phone</label>
                <input name="phone" className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all ${isDark ? "bg-black/20 border-white/10 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"}`} placeholder="012 345 678" />
              </div>
              <div>
                <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Email</label>
                <input name="email" type="email" className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all ${isDark ? "bg-black/20 border-white/10 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"}`} placeholder="john@example.com" />
              </div>
              <div>
                <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Spent ($)</label>
                <input name="totalSpent" type="number" step="0.01" defaultValue="0.00" className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all ${isDark ? "bg-black/20 border-white/10 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"}`} />
              </div>
              <button type="submit" className="bg-[#29B28D] text-white font-bold py-2.5 rounded-xl text-sm border border-[#29B28D]/20 hover:bg-[#249e7d] transition-all shadow-lg">
                {t("AddCustomer")}
              </button>
            </form>
          </div>

          {/* Table */}
          <div className={`border rounded-2xl overflow-hidden shadow-sm ${isDark ? "bg-dark-surface border-white/5" : "bg-white border-slate-200"}`}>
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="font-bold text-sm">{t("dashboard.titles.customerDirectory")}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10.5px] uppercase font-bold text-slate-500 border-b border-white/5">
                  <tr><th className="px-6 py-3">{t("dashboard.table.customer")}</th><th className="px-6 py-3">{t("dashboard.table.phone")}</th><th className="px-6 py-3">{t("dashboard.table.spent")}</th><th className="px-6 py-3">{t("dashboard.table.joined")}</th><th className="px-6 py-3 text-center">{t("dashboard.table.actions")}</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[13.5px]">
                  {filteredItems.map(cust => (
                    <tr key={cust.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4"><div className="font-bold">{cust.name}</div><div className="text-[11px] text-slate-400">{cust.email || (isKhmer ? "គ្មានអ៊ីមែល" : "No email")}</div></td>
                      <td className="px-6 py-4 text-slate-500">{cust.phone || "—"}</td>
                      <td className="px-6 py-4 font-bold text-[#29B28D] text-[15px]">${parseFloat(cust.totalSpent).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock size={12} className="opacity-50" />
                          <span className="text-[12px]">{new Date(cust.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center relative action-menu-container">
                        <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === cust.id ? null : cust.id); }} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                          <EllipsisVertical size={16} className="text-slate-400" />
                        </button>
                        {activeMenuId === cust.id && (
                          <div className={`absolute right-[80%] top-1/2 -translate-y-1/2 mr-2 z-20 w-[120px] rounded-xl shadow-2xl border overflow-hidden ${isDark ? "bg-dark-surface border-white/10" : "bg-white border-slate-200"}`}>
                            <button onClick={() => openEdit(cust)} className="w-full px-4 py-2.5 flex items-center gap-2 text-[12.5px] font-semibold hover:bg-white/5 text-[#29B28D] transition-colors"><Pencil size={14} /> {t("dashboard.common.edit")}</button>
                            <button onClick={() => { setDeleteTarget(cust); setActiveMenuId(null); }} className="w-full px-4 py-2.5 flex items-center gap-2 text-[12.5px] font-semibold hover:bg-white/5 text-red-500 transition-colors"><Trash2 size={14} /> {t("dashboard.common.delete")}</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!filteredItems.length && (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">{isKhmer ? "រកមិនឃើញអតិថិជនទេ" : "No customers found"}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} title={t("dashboard.modals.deleteCustomerTitle")} description={t("dashboard.modals.deleteCustomerDesc")} previewText={deleteTarget?.name} />

      {modalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden ${isDark ? "bg-dark-surface border border-white/5" : "bg-white"}`}>
            <div className="bg-[#0d1117] px-7 py-5 flex items-center justify-between text-white">
              <div><div className="text-[18px] font-bold">{t("dashboard.modals.editCustomerTitle")}</div></div>
              <button onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="p-7 space-y-5">
              <div><label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Name *</label>
                <input value={fName} onChange={e => setFName(e.target.value)} className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? "bg-[#0d1117] border-white/10 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"}`} />
              </div>
              <div><label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Phone (Optional)</label>
                <input value={fPhone} onChange={e => setFPhone(e.target.value)} className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? "bg-[#0d1117] border-white/10 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"}`} />
              </div>
              <div><label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Email (Optional)</label>
                <input type="email" value={fEmail} onChange={e => setFEmail(e.target.value)} className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? "bg-[#0d1117] border-white/10 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"}`} placeholder="email@example.com" />
              </div>
              <div><label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Total Spent ($)</label>
                <input type="number" step="0.01" value={fSpent} onChange={e => setFSpent(e.target.value)} className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? "bg-[#0d1117] border-white/10 text-white focus:border-[#29B28D]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#29B28D]"}`} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModalOpen(false)} className={`flex-1 py-4 rounded-xl font-bold transition-all ${isDark ? "bg-white/5 text-slate-400 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{t("dashboard.common.cancel")}</button>
                <button onClick={handleSaveEdit} disabled={!fName || saving} className="flex-[1.5] py-4 bg-[#0d1117] text-[#29B28D] font-bold rounded-xl shadow-lg border border-[#29B28D]/20 hover:bg-black transition-all">{saving ? t("inventory.modal.saving") : t("dashboard.common.save")}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
