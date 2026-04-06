"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Plus,
  Search,
  X,
  Clock,
  Filter,
  TrendingUp,
  Package,
  FileBarChart,
  Crown,
  FileText,
  CheckCircle2,
  ArrowUpDown,
} from "lucide-react";

import Link from "next/link";
import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { offlineFetch } from "@/lib/pwa/offline-fetch";

export type Period = "Day" | "Week" | "Month";

const PRO_NAV = [
  { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/vendor/pro" },
  { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/vendor/pro/sales", active: true },
  { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/vendor/pro/expenses" },
  { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/vendor/pro/customer" },
  { icon: Package, title: "Inventory", khmerTitle: "ស្តុក", href: "/vendor/pro/inventory" },
  { icon: FileBarChart, title: "Reports", khmerTitle: "របាយការណ៍", href: "/vendor/pro/reports" },
];

export default function ProSalesPage() {
  const { t, language } = useLanguage();
  const [quickAmount, setQuickAmount] = useState("");
  const [quickItem, setQuickItem] = useState("");
  const [quickMethod, setQuickMethod] = useState("Cash");
  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("Day");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, invRes] = await Promise.all([
          offlineFetch("/api/vendor/sales"),
          offlineFetch("/api/vendor/inventory")
        ]);
        const salesJson = await salesRes.json();
        const invJson = await invRes.json();
        
        if (salesJson.success) setTransactions(salesJson.data);
        if (invJson.success) setInventory(invJson.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleQuickLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAmount || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await offlineFetch("/api/vendor/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(quickAmount),
          method: quickMethod,
          items: quickItem || "Quick Sale",
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setTransactions((prev) => [json.data, ...prev]);
        setQuickAmount("");
        setQuickItem("");
        setQuickMethod("Cash");
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setIsQuickLogModalOpen(false);
        }, 900);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("dashboard.modals.deleteConfirmDesc"))) return;
    // Optimistically remove from UI
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
  };

  const handleExportPDF = () => window.print();

  const handleExportCSV = () => {
    const rows = [
      ["Time", "Items", "Method", "Amount"],
      ...filteredTransactions.map((transaction) => [
        new Date(transaction.createdAt).toLocaleString(),
        transaction.items || "Sale",
        transaction.method || "Cash",
        parseFloat(transaction.amount).toFixed(2),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter + search
  const filtered = transactions.filter((transaction) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (transaction.items || "").toLowerCase().includes(q) ||
      (transaction.method || "").toLowerCase().includes(q) ||
      parseFloat(transaction.amount).toFixed(2).includes(q)
    );
  });

  const filteredTransactions = [...filtered].sort((a, b) => {
    const aAmt = parseFloat(a.amount);
    const bAmt = parseFloat(b.amount);
    return sortOrder === "desc" ? bAmt - aAmt : aAmt - bAmt;
  });

  const totalRevenue = transactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount || "0"), 0);
  const avgSaleNum = totalRevenue / (transactions.length || 1);

  const getTranslatedPeriod = (p: Period) => {
    switch (p) {
      case "Day": return t("Day");
      case "Week": return t("Week");
      case "Month": return t("Month");
      default: return p;
    }
  };

  return (
    <VendorDashboardLayout
      settingsHref="/vendor/pro/settings"
      plan="pro"
      navLinks={PRO_NAV}
      currentPath="/vendor/pro/sales"
      title={t("dashboard.titles.mySales")}
      planBadge={{ label: "PRO", icon: Crown }}
      rightActions={
        <>
          {/* Period Toggle */}
          <div className="hidden sm:flex items-center bg-[#f0f2f5] dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/5 rounded-[10px] p-[3px] transition-colors">
            {(["Day", "Week", "Month"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-[7px] rounded-[8px] text-[13px] font-semibold border-0 cursor-pointer transition-all ${
                  period === p
                    ? "bg-white dark:bg-dark-surface text-[#111827] dark:text-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                    : "bg-transparent text-[#6b7280] dark:text-[#7d8590] hover:text-[#111827] dark:hover:text-white"
                }`}
              >
                {getTranslatedPeriod(p)}
              </button>
            ))}
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="hidden sm:flex items-center gap-2 bg-white dark:bg-dark-surface border border-[#e8eaed] dark:border-white/5 hover:bg-[#f7f8fa] dark:hover:bg-white/5 text-[#111827] dark:text-white font-medium px-4 py-[9px] rounded-[10px] transition-colors text-[13px] cursor-pointer"
          >
            <FileText className="w-4 h-4" /> {t("dashboard.actions.exportCsv")}
          </button>

          {/* Add Sale */}
          <button
            onClick={() => setIsQuickLogModalOpen(true)}
            className="flex items-center gap-[7px] bg-[#3ecf8e] text-[#0d1117] border-0 rounded-[10px] px-4 py-[9px] font-bold text-[13px] cursor-pointer shadow-[0_2px_14px_rgba(62,207,142,0.28)] hover:bg-[#4dd49a] transition-colors"
          >
            <Plus size={14} /> {t("dashboard.actions.addSale")}
          </button>
        </>
      }
    >
      <div className="flex-1 overflow-y-auto h-full w-full">
        <div className="p-6 md:p-8 space-y-7 w-full">
          {/* Header */}
          <div className="pt-1 pb-2">
            <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">
              {t("dashboard.titles.mySales")}
            </h2>
            <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
              {t("dashboard.titles.salesSubtitle")} ·{" "}
              <span className="text-[#9ca3af] font-khmer">តាមដាន និងគ្រប់គ្រងការលក់</span>
            </p>
          </div>

          {/* Quick Log Modal */}
          {isQuickLogModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="absolute inset-0" onClick={() => !isSubmitting && setIsQuickLogModalOpen(false)} />
              <div className="bg-white dark:bg-dark-surface rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
                <button
                  onClick={() => setIsQuickLogModalOpen(false)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:text-[#c9d1d9] hover:bg-slate-100 dark:hover:bg-white/5 p-1.5 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-6 flex items-center gap-2">
                  <div className="p-2 bg-psar-primary/10 text-psar-primary rounded-lg transition-colors">
                    <CircleDollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[22px] text-slate-900 dark:text-white">{t("dashboard.modals.addSaleTitle")}</h2>
                    <p className="text-sm font-khmer text-slate-500 dark:text-[#7d8590]">{t("dashboard.actions.quickLogSub")}</p>
                  </div>
                </div>

                {submitSuccess ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <CheckCircle2 className="w-14 h-14 text-psar-primary" />
                    <p className="font-bold text-lg text-slate-900 dark:text-white">{t("dashboard.status.logged")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleQuickLog} className="flex flex-col gap-5">
                    {/* Inventory Picker */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 block">
                        {t("inventory.modal.pickLabel")} {language === "km" ? "(ជ្រើសរើសពីស្តុក)" : ""}
                      </label>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {inventory.length > 0 ? (
                          inventory.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setQuickAmount(item.price.toString());
                                setQuickItem(item.name);
                              }}
                              className={`shrink-0 px-4 py-2.5 rounded-xl border text-[13px] font-bold transition-all flex flex-col items-start gap-1 min-w-[120px] ${
                                quickItem === item.name 
                                  ? "bg-psar-primary border-psar-primary text-white shadow-md" 
                                  : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                              }`}
                            >
                              <span className="truncate w-full text-left">{item.name}</span>
                              <span className={`text-[11px] ${quickItem === item.name ? "text-white/80" : "text-slate-500"}`}>${parseFloat(item.price).toFixed(2)}</span>
                            </button>
                          ))
                        ) : (
                          <Link href="/vendor/pro/inventory" className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-300 dark:border-white/10 text-slate-500 text-xs no-underline hover:border-psar-primary transition-all">
                            <Package size={14} /> {t("inventory.modal.quickPickEmpty")}
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="relative group mt-2">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CircleDollarSign className="h-6 w-6 text-slate-400 group-focus-within:text-psar-primary transition-colors" />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={quickAmount}
                        onChange={(e) => setQuickAmount(e.target.value)}
                        required
                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 rounded-xl text-slate-900 dark:text-white text-xl font-bold placeholder-slate-400 focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none transition-all min-h-[60px]"
                      />
                      <div className="absolute top-[-10px] left-4 bg-white dark:bg-dark-surface px-1 text-[11px] font-bold text-slate-500 dark:text-[#7d8590] transition-colors group-focus-within:text-psar-primary">
                        {t("inventory.modal.amountLabel")} <span className="text-red-500">*</span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Package className="h-5 w-5 text-slate-400 group-focus-within:text-psar-primary transition-colors" />
                      </div>
                      <input
                        type="text"
                        placeholder={t("dashboard.modals.itemsPlaceholder")}
                        value={quickItem}
                        onChange={(e) => setQuickItem(e.target.value)}
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 rounded-xl text-slate-900 dark:text-white text-[15px] placeholder-slate-400 focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none transition-all min-h-[60px]"
                      />
                      <div className="absolute top-[-10px] left-4 bg-white dark:bg-dark-surface px-1 text-[11px] font-bold text-slate-500 dark:text-[#7d8590] transition-colors group-focus-within:text-psar-primary">
                        {t("inventory.modal.itemsLabel")}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="relative group">
                      <select
                        value={quickMethod}
                        onChange={(e) => setQuickMethod(e.target.value)}
                        className="block w-full px-4 py-4 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 rounded-xl text-slate-900 dark:text-white text-[15px] font-medium focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none transition-all min-h-[60px] appearance-none cursor-pointer"
                      >
                        <option value="Cash">{t("dashboard.methods.cash")}</option>
                        <option value="ABA">{t("dashboard.methods.aba")}</option>
                        <option value="Wing">{t("dashboard.methods.wing")}</option>
                        <option value="Card">{t("dashboard.methods.card")}</option>
                        <option value="Other">{t("dashboard.methods.other")}</option>
                      </select>
                      <div className="absolute top-[-10px] left-4 bg-white dark:bg-dark-surface px-1 text-[11px] font-bold text-slate-500 dark:text-[#7d8590] transition-colors group-focus-within:text-psar-primary">
                        {t("inventory.modal.paymentMethodLabel")}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setIsQuickLogModalOpen(false)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#0d1117] dark:hover:bg-white/5 text-slate-700 dark:text-[#c9d1d9] font-bold text-[16px] py-4 rounded-xl transition-all min-h-[56px] border-0 cursor-pointer"
                      >
                        {t("dashboard.actions.cancel")}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !quickAmount}
                        className="flex-[2] bg-psar-primary hover:opacity-90 text-white font-bold text-[16px] py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 min-h-[56px] border-0 cursor-pointer disabled:opacity-60"
                      >
                        <Plus className="w-5 h-5" />
                        <span>{isSubmitting ? t("inventory.modal.saving") : t("dashboard.actions.save")}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <VendorSummaryCard
              variant="dark"
              title={`${getTranslatedPeriod(period)} ${t("dashboard.metrics.revenue")}`}
              khmerTitle="ចំណូលប្រចាំ"
              value={`$${totalRevenue.toFixed(2)}`}
            />
            <VendorSummaryCard
              title={t("Transactions")}
              khmerTitle="ចំនួនការលក់"
              value={transactions.length}
              subtext={`total logs`}
            />
            <VendorSummaryCard
              title={t("dashboard.metrics.avgSale")}
              khmerTitle="មធ្យមតម្លៃ"
              value={`$${avgSaleNum.toFixed(2)}`}
              subtext="per txn"
            />
          </div>

          {/* Transaction History */}
          <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col transition-colors">
            <div className="p-5 md:p-6 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[17px] text-slate-900 dark:text-white">{t("dashboard.titles.history")}</h3>
                <p className="text-sm font-khmer text-slate-500 dark:text-[#7d8590] mt-0.5">ប្រវត្តិប្រតិបត្តិការ</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("dashboard.placeholders.searchLogs")}
                    className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:border-psar-primary focus:ring-1 focus:ring-psar-primary min-h-[40px] dark:text-white outline-none transition-all"
                  />
                </div>
                {/* Sort by amount */}
                <button
                  onClick={() => setSortOrder((o) => (o === "desc" ? "asc" : "desc"))}
                  title="Sort by amount"
                  className="p-2 border border-slate-200 dark:border-white/5 rounded-xl text-slate-500 dark:text-[#7d8590] hover:bg-slate-50 dark:hover:bg-white/5 bg-white dark:bg-dark-surface transition-colors min-h-[40px] cursor-pointer"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0d1117] border-b border-slate-100 dark:border-white/5 text-[13px] text-slate-500 dark:text-[#7d8590] uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4">{t("dashboard.table.time")}</th>
                    <th className="px-6 py-4">{t("dashboard.table.items")}</th>
                    <th className="px-6 py-4">{t("dashboard.table.method")}</th>
                    <th className="px-6 py-4">{t("dashboard.table.amount")}</th>
                    <th className="px-6 py-4 text-center">{t("dashboard.table.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading…</td>
                    </tr>
                  ) : filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-[#7d8590]">
                        {searchQuery ? "No results found." : "No transactions logged yet."}
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-psar-primary/5 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-[15px] font-medium text-slate-900 dark:text-white">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {new Date(txn.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {new Date(txn.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[14px] font-medium text-slate-700 dark:text-[#c9d1d9]">
                            {txn.items || "Sale"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-[#9aa4b2] text-[12px] font-semibold transition-colors">
                            {txn.method || "Cash"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-[16px] font-bold text-psar-primary">
                            ${parseFloat(txn.amount).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleDelete(txn.id)}
                            className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 min-h-[40px] min-w-[40px] cursor-pointer border-0 bg-transparent"
                            title={t("dashboard.common.delete")}
                          >
                            <X className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!loading && (
              <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0d1117] flex items-center justify-between text-[13px] transition-colors">
                <span className="text-slate-500 dark:text-[#7d8590]">
                  Showing <strong className="text-slate-900 dark:text-white">{filteredTransactions.length}</strong>{" "}
                  of <strong className="text-slate-900 dark:text-white">{transactions.length}</strong> records
                </span>
                <button
                  onClick={handleExportCSV}
                  className="text-psar-primary font-semibold hover:underline cursor-pointer border-0 bg-transparent"
                >
                  {t("dashboard.actions.exportCsv")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </VendorDashboardLayout>
  );
}
