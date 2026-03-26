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
  MoreVertical,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorTopbar from "@/components/vendor/VendorTopbar";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { ConfirmModal } from "@/components/ConfirmModal";

export default function CustomersPage() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isKhmer = language === "km";
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customCount, setCustomCount] = useState(1);

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
        const res = await fetch("/api/vendor/customers");
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
        const res = await fetch("/api/vendor/traffic");
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

  // Click-away
  useEffect(() => {
    const handleClick = () => setActiveMenuId(null);
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
      const res = await fetch("/api/vendor/traffic", {
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
        showToast("Traffic logged");
      }
    } catch (e) {
      showToast("Failed to log traffic", "error");
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
    };
    try {
      const res = await fetch("/api/vendor/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        setCustomers(p => [result.data, ...p]);
        showToast("Customer added to directory");
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
    setModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSaveEdit = async () => {
    if (!fName || !editTarget) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/vendor/customers/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fName, phone: fPhone, email: fEmail }),
      });
      const result = await res.json();
      if (result.success) {
        setCustomers(p => p.map(x => x.id === editTarget.id ? result.data : x));
        showToast("Customer updated");
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
      const res = await fetch(`/api/vendor/customers/${deleteTarget.id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setCustomers(p => p.filter(x => x.id !== deleteTarget.id));
        showToast("Customer deleted");
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
            {t.type === "success" ? <CheckCircle2 size={16} className="text-[#3ecf8e]" /> : <AlertCircle size={16} className="text-[#ef4444]" />}
            <span className="flex-1">{t.msg}</span>
          </div>
        ))}
      </div>

      <VendorSidebar plan="free" currentPath="/vendor/customer" navLinks={[
        { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/vendor" },
        { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/vendor/sales" },
        { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/vendor/expenses" },
        { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/vendor/customer" },
      ]} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <VendorTopbar title="Customers" isSidebarCollapsed={isCollapsed} setIsSidebarCollapsed={setIsCollapsed} setIsMobileSidebarOpen={setIsMobileOpen} />

        <div className="flex-1 overflow-y-auto px-5 lg:px-9 py-[26px] space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h1 className="text-[26px] font-bold">My Customers</h1>
              <p className="text-sm text-slate-500 mt-0.5">Tracker and Log your daily foot traffic</p>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 transition-all w-64 focus-within:border-[#29B28D]/30 focus-within:shadow-[0_0_0_4px_rgba(41,178,141,0.03)] group">
              <Search className="w-4 h-4 text-slate-300 dark:text-slate-500 transition-colors group-focus-within:text-[#29B28D]" />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-[13px] w-full placeholder:text-slate-400 dark:text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <VendorSummaryCard variant="dark" title="Today Customer" khmerTitle="អតិថិជនថ្ងៃនេះ" value={summaryData.todayCount} subtext={`${summaryData.todayLogs} logs`} />
            <VendorSummaryCard title="Avg.Spend" khmerTitle="មធ្យមចាយ" value={summaryData.avgSpend} variant={isDark ? "dark" : "light"} />
            <VendorSummaryCard variant="green" title="Weekly Customer" khmerTitle="អតិថិជនប្រចាំសប្តាហ៍" value={summaryData.weeklyCount} subtext={summaryData.weeklyChange} />
            <VendorSummaryCard title="Avg.LTV" khmerTitle="តម្លៃអតិថិជនមធ្យម" value={summaryData.avgLTV} variant={isDark ? "dark" : "light"} />
          </div>

          {/* Log Traffic Bar */}
          <div className="bg-[#0d1117] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#3ecf8e]/10">
            <div><p className="font-bold text-white text-[15px]">Log Customers</p><p className="text-[11px] text-slate-400 mt-0.5">កត់ត្រាអតិថិជន</p></div>
            <div className="flex items-center gap-2 flex-wrap">
              {[1, 5, 10].map(n => <button key={n} onClick={() => handleLogTraffic(n)} className="px-4 py-2 bg-[#1a1a1a] text-[#3ecf8e] text-sm font-bold rounded-xl border border-[#3ecf8e]/20 min-h-11 hover:bg-black transition-all">+{n}</button>)}
              <div className="flex items-center bg-white/10 rounded-xl px-2 py-1"><button onClick={() => setCustomCount(c => Math.max(1, c - 1))} className="text-white"><Minus size={14} /></button><span className="text-white font-bold mx-3">{customCount}</span><button onClick={() => setCustomCount(c => c + 1)} className="text-white"><Plus size={14} /></button></div>
              <button onClick={() => handleLogTraffic(customCount)} className="px-5 py-2 bg-[#3ecf8e] text-[#0d1117] font-bold rounded-xl text-sm min-h-11 hover:bg-[#4dd49a] transition-colors flex items-center gap-1.5"><Plus size={14} /> Log {customCount}</button>
            </div>
          </div>

          {/* Inline Form (Restored) */}
          <div className={`${isDark ? "bg-dark-surface border-white/5" : "bg-white border-slate-200"} border rounded-2xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Add Customer to Directory</h3>
              <Users className="w-5 h-5 text-[#29B28D]" />
            </div>
            <form ref={addFormRef} onSubmit={handleCreateCustomer} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Name <span className="text-red-500">*</span></label>
                <input name="name" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#29B28D]" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Phone (Optional)</label>
                <input name="phone" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#29B28D]" placeholder="012 345 678" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Email (Optional)</label>
                <input name="email" type="email" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#29B28D]" placeholder="john@example.com" />
              </div>
              <button type="submit" className="bg-[#0d1117] text-[#3ecf8e] font-bold py-2.5 rounded-xl text-sm border border-[#3ecf8e]/20 hover:bg-black transition-all">
                Add Customer
              </button>
            </form>
          </div>

          {/* Table */}
          <div className={`border rounded-2xl overflow-hidden shadow-sm ${isDark ? "bg-dark-surface border-white/5" : "bg-white border-slate-200"}`}>
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="font-bold text-sm">Customer Directory</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10.5px] uppercase font-bold text-slate-500 border-b border-white/5">
                  <tr><th className="px-6 py-3">Customer</th><th className="px-6 py-3">Phone</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Total Spent</th><th className="px-6 py-3 text-center">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[13.5px]">
                  {filteredItems.map(c => (
                    <tr key={c.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4"><div className="font-bold">{c.name}</div><div className="text-[11px] text-slate-400">{c.email || "No email"}</div></td>
                      <td className="px-6 py-4 text-slate-500">{c.phone || "—"}</td>
                      <td className="px-6 py-4"><span className="px-2.5 py-[3px] rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">{c.points} Points</span></td>
                      <td className="px-6 py-4 text-right font-bold text-[#29B28D]">${parseFloat(c.totalSpent).toFixed(2)}</td>
                      <td className="px-6 py-4 text-center relative">
                        <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === c.id ? null : c.id); }} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                          <MoreVertical size={16} className="text-slate-400" />
                        </button>
                        {activeMenuId === c.id && (
                          <div className={`absolute right-[80%] top-1/2 -translate-y-1/2 mr-2 z-20 w-[120px] rounded-xl shadow-2xl border overflow-hidden ${isDark ? "bg-dark-surface border-white/10" : "bg-white border-slate-200"}`}>
                            <button onClick={() => openEdit(c)} className="w-full px-4 py-2.5 flex items-center gap-2 text-[12.5px] font-semibold hover:bg-white/5 text-[#3ecf8e] transition-colors"><Pencil size={14} /> Edit</button>
                            <button onClick={() => { setDeleteTarget(c); setActiveMenuId(null); }} className="w-full px-4 py-2.5 flex items-center gap-2 text-[12.5px] font-semibold hover:bg-white/5 text-red-500 transition-colors"><Trash2 size={14} /> Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!filteredItems.length && (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">No customers found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} title="Delete Customer?" description="Permanently remove customer from directory." previewText={deleteTarget?.name} />

      {/* Edit Modal Only */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden">
            <div className="bg-[#0d1117] px-7 py-5 flex items-center justify-between text-white">
              <div><div className="text-[18px] font-bold">Edit Customer</div><div className="text-[12px] text-slate-500">កែប្រែព័ត៌មានអតិថិជន</div></div>
              <button onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="p-7 space-y-5">
              <div><label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Name *</label><input value={fName} onChange={e => setFName(e.target.value)} className="w-full px-4 py-3 rounded-xl border bg-slate-50 focus:border-[#29B28D] outline-none" /></div>
              <div><label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Phone (Optional)</label><input value={fPhone} onChange={e => setFPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border bg-slate-50 focus:border-[#29B28D] outline-none" /></div>
              <div><label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Email (Optional)</label><input type="email" value={fEmail} onChange={e => setFEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border bg-slate-50 focus:border-[#29B28D] outline-none" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModalOpen(false)} className="flex-1 py-4 rounded-xl bg-slate-100 text-slate-500 font-bold">Cancel</button>
                <button onClick={handleSaveEdit} disabled={!fName || saving} className="flex-[1.5] py-4 bg-[#0d1117] text-[#3ecf8e] font-bold rounded-xl shadow-lg border border-[#3ecf8e]/20 hover:bg-black transition-all">{saving ? "Saving..." : "Save Changes"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
