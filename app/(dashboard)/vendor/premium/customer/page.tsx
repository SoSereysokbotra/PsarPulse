"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Package,
  Plus,
  Minus,
  FileBarChart,
  Zap,
  Search,
  Clock,
  Trash2,
  Edit,
  AlertCircle,
  Sparkles,
  Phone,
  User,
  Heart,
  TrendingUp,
  X,
  PlusCircle,
  Filter,
} from "lucide-react";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { ConfirmModal } from "@/components/ConfirmModal";

const TABS = [
  { id: "log", label: "Traffic Log", khmer: "កំណត់ហេតុអតិថិជន" },
  { id: "crm", label: "Customer CRM", khmer: "ទំនាក់ទំនងអតិថិជន" },
  { id: "analysis", label: "Analytics", khmer: "វិភាគអតិថិជន" },
];

const PREMIUM_NAV = [
  { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/vendor/premium" },
  { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/vendor/premium/sales" },
  { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/vendor/premium/expenses" },
  { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/vendor/premium/customer", active: true },
  { icon: Package, title: "Inventory", khmerTitle: "ស្តុក", href: "/vendor/premium/inventory" },
  { icon: FileBarChart, title: "Reports", khmerTitle: "របាយការណ៍", href: "/vendor/premium/reports" },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("log");
  const [customCount, setCustomCount] = useState(1);
  const [loading, setLoading] = useState(true);

  // Data States
  const [logHistory, setLogHistory] = useState<any[]>([]);
  const [crmDatabase, setCrmDatabase] = useState<any[]>([]);

  // CRM Form States
  const [crmName, setCrmName] = useState("");
  const [crmPhone, setCrmPhone] = useState("");
  const [crmNotes, setCrmNotes] = useState("");
  const [crmSubmitting, setCrmSubmitting] = useState(false);
  const [crmSuccess, setCrmSuccess] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isLogLogging, setIsLogLogging] = useState(false);
  const [isLogDeleting, setIsLogDeleting] = useState<string | null>(null);
  const [todaySales, setTodaySales] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [custRes, salesRes] = await Promise.all([
          fetch("/api/vendor/customers"),
          fetch("/api/vendor/sales")
        ]);
        const custJson = await custRes.json();
        const salesJson = await salesRes.json();
        if (custJson.success) {
          setLogHistory(custJson.data.trafficLogs || []);
          setCrmDatabase(custJson.data.customers || []);
        }
        if (salesJson.success) {
          const now = new Date();
          const todayAmt = salesJson.data
            .filter((s: any) => new Date(s.createdAt).toDateString() === now.toDateString())
            .reduce((sum: number, s: any) => sum + parseFloat(s.amount || "0"), 0);
          setTodaySales(todayAmt);
        }
      } catch (error) {
        console.error("Failed to fetch customer data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLog = async (amount: number) => {
    if (isLogLogging) return;
    setIsLogLogging(true);
    try {
      const res = await fetch("/api/vendor/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: amount }),
      });
      if (res.ok) {
        const json = await res.json();
        setLogHistory((prev) => [json.data, ...prev]);
        setCustomCount(1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLogLogging(false);
    }
  };

  const handleDeleteLog = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLogDeleting === id) return;
    if (!window.confirm("Delete this traffic log?")) return;
    setIsLogDeleting(id);
    try {
      const res = await fetch(`/api/vendor/customers?id=${id}&type=traffic`, { method: "DELETE" });
      if (res.ok) {
        setLogHistory((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLogDeleting(null);
    }
  };

  const handleCRMSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crmName.trim() || crmSubmitting) return;
    setCrmSubmitting(true);
    try {
      const res = await fetch("/api/vendor/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: crmName, phone: crmPhone, notes: crmNotes }),
      });
      if (res.ok) {
        const json = await res.json();
        setCrmDatabase((prev) => [json.data, ...prev]);
        setCrmName("");
        setCrmPhone("");
        setCrmNotes("");
        setCrmSuccess(true);
        setTimeout(() => setCrmSuccess(false), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCrmSubmitting(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    try {
      const res = await fetch(`/api/vendor/customers/${selectedCustomer.id}`, { method: "DELETE" });
      if (res.ok) {
        setCrmDatabase((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
        setIsDeleteModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredLogs = logHistory.filter((l) => {
    const timeStr = l.createdAt ? new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
    const statusStr = l.count >= 10 ? "Peak Traffic" : "Regular";
    return timeStr.toLowerCase().includes(searchTerm.toLowerCase()) || statusStr.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredCRM = crmDatabase.filter((c) => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.phone && c.phone.includes(searchTerm))
  );

  const summaryData = React.useMemo(() => {
    const now = new Date();
    const todayLogs = logHistory.filter(l => new Date(l.createdAt).toDateString() === now.toDateString());
    const todayCount = todayLogs.reduce((s, l) => s + (l.count || 0), 0);

    // Peak Hour logic
    const hours: Record<number, number> = {};
    logHistory.forEach(l => {
      const h = new Date(l.createdAt).getHours();
      hours[h] = (hours[h] || 0) + (l.count || 0);
    });
    const peakHArr = Object.entries(hours).sort((a,b) => b[1] - a[1]);
    const peakH = peakHArr[0]?.[0];
    const peakTime = peakH !== undefined ? `${Number(peakH) % 12 || 12}:00 ${Number(peakH) >= 12 ? 'PM' : 'AM'}` : "-";

    const weeklyCount = logHistory.filter(l => now.getTime() - new Date(l.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000)
      .reduce((s, l) => s + (l.count || 0), 0);

    return {
      todayCount,
      todayLogs: todayLogs.length,
      avgSpend: todayCount > 0 ? `$${(todaySales / todayCount).toFixed(2)}` : "$0.00",
      weeklyCount,
      peakTime,
      avgLTV: "$102.02",
    };
  }, [logHistory, todaySales]);

  return (
    <VendorDashboardLayout
      settingsHref="/vendor/premium/settings"
      plan="premium"
      navLinks={PREMIUM_NAV}
      currentPath="/vendor/premium/customer"
      title="Customer Management"
      planBadge={{ label: "PREMIUM", icon: Sparkles }}
      rightActions={
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-[#3ecf8e] hover:bg-[#4dd49a] text-[#0d1117] font-bold px-4 py-2 rounded-[10px] text-sm shadow-[0_2px_14px_rgba(62,207,142,0.28)] transition-colors cursor-pointer border-0">
          <PlusCircle className="w-4 h-4" /> Add Profile
        </button>
      }
    >
      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-6 transition-colors">
        <div className="pt-1 pb-1">
          <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">My Customers</h2>
          <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
            Track traffic and manage loyalty · <span className="text-[#9ca3af] dark:text-[#4d5562]">តាមដាន និងគ្រប់គ្រងអតិថិជន</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <VendorSummaryCard variant="dark" title="Today Traffic" khmerTitle="អតិថិជនថ្ងៃនេះ" value={summaryData.todayCount} subtext={`${summaryData.todayLogs} log entries`} />
          <VendorSummaryCard title="Avg. Spend" khmerTitle="ការចំណាយមធ្យម" value={summaryData.avgSpend} subtext="per visit" />
          <VendorSummaryCard variant="green" title="Weekly Reach" khmerTitle="អតិថិជនសរុប" value={summaryData.weeklyCount} subtext="+12% from last week" />
          <VendorSummaryCard title="Peak Hours" khmerTitle="ម៉ោងមមាញឹក" value={summaryData.peakTime} subtext="Lunch time spike" />
          <VendorSummaryCard title="Customer LTV" khmerTitle="តម្លៃអតិថិជន" value={summaryData.avgLTV} icon={Sparkles} subtext="Lifetime value" />
        </div>

        <div className="flex items-end gap-0 border-b border-[#e8eaed] dark:border-white/10 transition-colors">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-[13.5px] font-medium border-b-2 -mb-px flex flex-col items-start gap-0.5 bg-transparent border-x-0 border-t-0 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-[#111827] dark:border-b-white text-[#111827] dark:text-white font-semibold"
                  : "border-b-transparent text-[#6b7280] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] text-[#9ca3af] dark:text-[#6b7280]">{tab.khmer}</span>
            </button>
          ))}
        </div>

        {activeTab === "log" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors">
              <div>
                <p className="font-bold text-[16px] text-slate-900 dark:text-white">Quick Log Traffic</p>
                <p className="text-[12px] text-slate-500 dark:text-[#7d8590] mt-1">Immediately record incoming groups</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {[1, 5, 10].map((n) => (
                  <button key={n} onClick={() => handleLog(n)} className="w-14 h-14 bg-[#29B28D] hover:bg-[#239979] text-white text-lg font-bold rounded-xl transition-all shadow-lg shadow-[#29B28D]/20 border-0 cursor-pointer">+{n}</button>
                ))}
                <div className="flex items-center bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-2 h-14 transition-colors">
                  <button onClick={() => setCustomCount(Math.max(1, customCount - 1))} className="p-2 text-slate-500 hover:text-psar-primary transition-colors bg-transparent border-0 cursor-pointer"><Minus className="w-5 h-5" /></button>
                  <span className="w-10 text-center font-bold text-lg dark:text-white">{customCount}</span>
                  <button onClick={() => setCustomCount(customCount + 1)} className="p-2 text-slate-500 hover:text-psar-primary transition-colors bg-transparent border-0 cursor-pointer"><Plus className="w-5 h-5" /></button>
                </div>
                <button onClick={() => handleLog(customCount)} className="h-14 px-6 bg-[#111827] dark:bg-white text-white dark:text-[#111827] font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity border-0 cursor-pointer shadow-xl">
                  <User className="w-5 h-5" /> Log {customCount}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl shadow-sm overflow-hidden transition-colors">
              <div className="p-6 border-b border-[#f0f2f5] dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
                <h3 className="font-bold text-[17px] text-slate-900 dark:text-white">Traffic History</h3>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search logs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#29B28D] dark:text-white" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 text-[11px] uppercase font-bold text-slate-500 dark:text-[#7d8590] tracking-wider transition-colors">
                      <th className="px-6 py-4">Time Entry</th>
                      <th className="px-6 py-4">Group Size</th>
                      <th className="px-6 py-4">Traffic Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 transition-colors">
                    {loading ? (
                       <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">Loading traffic logs...</td></tr>
                    ) : filteredLogs.length === 0 ? (
                       <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No logs found.</td></tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4"><div className="flex items-center gap-2 text-[14px] font-medium dark:text-white"><Clock className="w-4 h-4 text-slate-400" /> {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div></td>
                          <td className="px-6 py-4 font-bold text-[15px] dark:text-white">+{log.count} Persons</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold border ${log.count >= 10 ? "bg-orange-50 border-orange-100 text-orange-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"}`}>
                              {log.count >= 10 ? "Peak Traffic" : "Regular"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={(e) => handleDeleteLog(log.id, e)} 
                              disabled={isLogDeleting === log.id}
                              className="text-slate-400 hover:text-red-500 p-1 transition-colors bg-transparent border-0 cursor-pointer disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "crm" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl shadow-sm p-6 space-y-5 h-fit transition-colors">
              <div>
                <h3 className="font-bold text-[18px] text-slate-900 dark:text-white">Register Customer</h3>
                <p className="text-[12px] text-slate-500 dark:text-[#7d8590] mt-1">Save details for loyalty & discounts</p>
              </div>
              <form onSubmit={handleCRMSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700 dark:text-[#9aa4b2] ml-1">Full Name</label>
                  <input required placeholder="e.g. John Doe" value={crmName} onChange={e => setCrmName(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-psar-primary transition-colors text-sm dark:text-white" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700 dark:text-[#9aa4b2] ml-1">Phone Number</label>
                  <input placeholder="012 345 678" value={crmPhone} onChange={e => setCrmPhone(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-psar-primary transition-colors text-sm dark:text-white" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700 dark:text-[#9aa4b2] ml-1">Preferences / Tags</label>
                  <textarea placeholder="Likes spicy, regular Sunday buyer..." value={crmNotes} onChange={e => setCrmNotes(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-psar-primary transition-colors text-sm h-24 resize-none dark:text-white" />
                </div>
                <button type="submit" disabled={crmSubmitting || !crmName.trim()} className="w-full bg-[#3ecf8e] text-[#0d1117] font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#3ecf8e]/20 flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50">
                  {crmSubmitting ? "Processing..." : crmSuccess ? "Customer Saved ✓" : "Create Profile"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl shadow-sm overflow-hidden transition-colors">
              <div className="p-6 border-b border-[#f0f2f5] dark:border-white/5 flex items-center justify-between transition-colors">
                <h3 className="font-bold text-[17px] text-slate-900 dark:text-white">Customer Database</h3>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search profiles..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#29B28D] dark:text-white" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 text-[11px] uppercase font-bold text-slate-500 dark:text-[#7d8590] transition-colors">
                      <th className="px-6 py-4">Customer Details</th>
                      <th className="px-6 py-4">Loyalty Status</th>
                      <th className="px-6 py-4">Recent Growth</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 transition-colors">
                    {loading ? (
                       <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">Loading profiles...</td></tr>
                    ) : filteredCRM.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No customers registered yet.</td></tr>
                    ) : (
                      filteredCRM.map((customer) => (
                        <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#3ecf8e]/10 flex items-center justify-center border border-[#3ecf8e]/20"><User className="w-5 h-5 text-[#3ecf8e]" /></div>
                              <div>
                                <p className="font-bold text-[14px] text-slate-900 dark:text-white">{customer.name}</p>
                                <p className="text-[12px] text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {customer.phone || "No phone"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-extrabold shadow-sm"><Heart className="w-3 h-3" /> Regular</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[13px]"><TrendingUp className="w-3.5 h-3.5" /> +5%</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-slate-400 hover:text-psar-primary transition-colors bg-transparent border-0 cursor-pointer"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => { setSelectedCustomer(customer); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-transparent border-0 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="bg-[#0d1117] rounded-3xl p-12 flex flex-col items-center text-center space-y-6 border border-white/10 shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-[#8b5cf6] to-[#3ecf8e] rounded-3xl flex items-center justify-center shadow-lg shadow-[#8b5cf6]/20"><Sparkles className="w-10 h-10 text-white" /></div>
            <div className="max-w-md">
              <h3 className="text-2xl font-black text-white mb-2">Deep Customer Analytics</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Our AI is currently crunching your traffic data to provide spending forecasts and peak hour optimizations. Check back in 24 hours!</p>
            </div>
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold text-slate-400 uppercase tracking-widest">Cohort Analysis</div>
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold text-slate-400 uppercase tracking-widest">Retention Rate</div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteCustomer} title="Delete Customer Profile?" description="This action cannot be undone. All spending history and loyalty points will be permanently removed." confirmText="Yes, Delete Profile" />
    </VendorDashboardLayout>
  );
}
