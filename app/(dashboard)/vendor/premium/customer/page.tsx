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
  const [logHistory, setLogHistory] = useState([
    { id: 1, time: "2:15 PM", count: 2, status: "Regular" },
    { id: 2, time: "10:00 AM", count: 8, status: "Peak Traffic" },
    { id: 3, time: "11:00 AM", count: 12, status: "Peak Traffic" },
  ]);

  // CRM States
  const [crmDatabase, setCrmDatabase] = useState<any[]>([]);
  const [crmName, setCrmName] = useState("");
  const [crmPhone, setCrmPhone] = useState("");
  const [crmNotes, setCrmNotes] = useState("");
  const [crmSubmitting, setCrmSubmitting] = useState(false);
  const [crmSuccess, setCrmSuccess] = useState(false);

  // Customer Management States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", notes: "" });

  useEffect(() => {
    const fetchCrm = async () => {
      try {
        const res = await fetch("/api/vendor/customers");
        const json = await res.json();
        if (json.success) setCrmDatabase(json.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCrm();
  }, []);

  const handleLog = (amount: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setLogHistory((prev) => [
      {
        id: Date.now(),
        time: timeStr,
        count: amount,
        status: amount >= 10 ? "Peak Traffic" : "Regular",
      },
      ...prev,
    ]);
  };

  const handleCRMSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCrmSubmitting(true);
    try {
      const res = await fetch("/api/vendor/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: crmName, phone: crmPhone, notes: crmNotes }),
      });
      if (res.ok) {
        setCrmSuccess(true);
        setCrmName("");
        setCrmPhone("");
        setCrmNotes("");
        const json = await res.json();
        setCrmDatabase(prev => [json.data, ...prev]);
        setTimeout(() => setCrmSuccess(false), 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCrmSubmitting(false);
    }
  };

  const handleSaveCustomer = async () => {
    // Logic for updating/saving customer in CRM modal if needed
    setIsAddModalOpen(false);
  };

  const handleDeleteCustomer = async () => {
    // Logic for deleting customer
    setIsDeleteModalOpen(false);
  };

  const filteredLogs = logHistory.filter(
    (l) => l.time.toLowerCase().includes(searchTerm.toLowerCase()) || l.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const summaryData = {
    todayCount: logHistory.reduce((acc, curr) => acc + curr.count, 0),
    todayLogs: logHistory.length,
    avgSpend: "$5.45",
    weeklyCount: 315,
    peakTime: "12:10 PM",
    avgLTV: "$102.02",
  };

  return (
    <VendorDashboardLayout
      settingsHref="/vendor/premium/settings"
      plan="premium"
      navLinks={PREMIUM_NAV}
      currentPath="/vendor/premium/customer"
      title="Customer Management"
      rightActions={
        <button onClick={() => setIsAddModalOpen(true)} className="hidden sm:flex items-center gap-2 bg-psar-primary text-white font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity border-0 cursor-pointer text-sm min-h-[40px]">
          <Plus className="w-4 h-4" /> Add Profile
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

        <div className="flex gap-6 border-b border-[#e8eaed] dark:border-white/10 transition-colors">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 flex flex-col items-start transition-colors bg-transparent border-x-0 border-t-0 cursor-pointer ${
                activeTab === tab.id
                  ? "border-b-2 border-[#111827] dark:border-white text-[#111827] dark:text-white"
                  : "border-b-2 border-transparent text-[#6b7280] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white"
              }`}
            >
              <span className="font-bold text-[14px]">{tab.label}</span>
              <span className="text-[10px] mt-0.5 opacity-70">{tab.khmer}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <VendorSummaryCard title="Today Traffic" khmerTitle="អតិថិជនថ្ងៃនេះ" value={summaryData.todayCount} subtext={`${summaryData.todayLogs} log entries`} />
          <VendorSummaryCard title="Avg. Spend" khmerTitle="ការចំណាយមធ្យម" value={summaryData.avgSpend} subtext="per visit" />
          <VendorSummaryCard variant="green" title="Weekly Reach" khmerTitle="អតិថិជនសរុប" value={summaryData.weeklyCount} subtext="+12% from last week" />
          <VendorSummaryCard title="Peak Hours" khmerTitle="ម៉ោងមមាញឹក" value={summaryData.peakTime} subtext="Lunch time spike" />
          <VendorSummaryCard title="Customer LTV" khmerTitle="តម្លៃអតិថិជន" value={summaryData.avgLTV} icon={Sparkles} subtext="Lifetime value" />
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
                <button onClick={() => handleLog(customCount)} className="h-14 px-6 bg-psar-dark text-white font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity border-0 cursor-pointer shadow-xl">
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
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4"><div className="flex items-center gap-2 text-[14px] font-medium dark:text-white"><Clock className="w-4 h-4 text-slate-400" /> {log.time}</div></td>
                        <td className="px-6 py-4 font-bold text-[15px] dark:text-white">+{log.count} Persons</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold border ${log.status === "Peak Traffic" ? "bg-orange-50 border-orange-100 text-orange-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right"><button className="text-slate-400 hover:text-red-500 p-1 transition-colors bg-transparent border-0 cursor-pointer"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
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
                <button type="submit" disabled={crmSubmitting || !crmName.trim()} className="w-full bg-psar-primary text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-psar-primary/20 flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50">
                  {crmSubmitting ? "Processing..." : crmSuccess ? "Customer Saved ✓" : "Create Profile"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl shadow-sm overflow-hidden transition-colors">
              <div className="p-6 border-b border-[#f0f2f5] dark:border-white/5 flex items-center justify-between transition-colors">
                <h3 className="font-bold text-[17px] text-slate-900 dark:text-white">Customer Database</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-slate-500 font-medium">{crmDatabase.length} registered profiles</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 text-[11px] uppercase font-bold text-slate-500 dark:text-[#7d8590] transition-colors">
                      <th className="px-6 py-4">Customer Details</th>
                      <th className="px-6 py-4">Loyalty Status</th>
                      <th className="px-6 py-4">Growth</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 transition-colors">
                    {crmDatabase.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No customers registered yet.</td></tr>
                    ) : (
                      crmDatabase.map((customer) => (
                        <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-psar-primary/10 flex items-center justify-center border border-psar-primary/20"><User className="w-5 h-5 text-psar-primary" /></div>
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
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-slate-400 hover:text-psar-primary transition-colors bg-transparent border-0 cursor-pointer"><Edit className="w-4 h-4" /></button>
                              <button className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-transparent border-0 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
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

        {/* Analytics Placeholder */}
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setIsAddModalOpen(false)} />
          <div className="bg-white dark:bg-[#0d1117] p-8 rounded-[32px] shadow-2xl w-full max-w-lg relative z-10 border border-white/10 transition-colors" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 text-[#9ca3af] hover:text-white hover:bg-white/5 p-2 rounded-xl transition-colors border-0 bg-transparent cursor-pointer"><X className="w-6 h-6" /></button>
            <h3 className="text-[24px] font-black mb-8 text-slate-900 dark:text-white">Customer Information</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-5">
                 <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:border-psar-primary outline-none transition-all dark:text-white" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider ml-1">Contact Details</label>
                    <input placeholder="Phone or Email" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:border-psar-primary outline-none transition-all dark:text-white" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider ml-1">Business Notes</label>
                    <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:border-psar-primary outline-none transition-all min-h-[120px] resize-none dark:text-white" />
                 </div>
              </div>
              <div className="flex gap-4 pt-4">
                 <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 bg-slate-100 dark:bg-white/5 font-bold text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all border-0 cursor-pointer">Cancel</button>
                 <button onClick={handleSaveCustomer} className="flex-[2] py-4 bg-psar-primary text-white font-bold rounded-2xl shadow-xl shadow-psar-primary/20 hover:opacity-90 transition-opacity border-0 cursor-pointer">Save Profile</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </VendorDashboardLayout>
  );
}
