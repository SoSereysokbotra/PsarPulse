"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Package,
  Settings,
  Plus,
  TrendingUp,
  Menu,
  X,
  Bell,
  Sparkles,
  Search,
  Camera,
  Tag,
  Clock,
  Filter,
  FileBarChart,
  Crown,
  FileText,
  FileSpreadsheet,
  TrendingDown,
} from "lucide-react";
import EllipsisVertical from "lucide-react/dist/esm/icons/ellipsis-vertical";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { offlineFetch } from "@/lib/pwa/offline-fetch";

const PRO_NAV = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    khmerTitle: "ផ្ទាំងគ្រប់គ្រង",
    href: "/vendor/pro",
  },
  {
    icon: CircleDollarSign,
    title: "Sales",
    khmerTitle: "ការលក់",
    href: "/vendor/pro/sales",
  },
  {
    icon: Receipt,
    title: "Expenses",
    khmerTitle: "ចំណាយ",
    href: "/vendor/pro/expenses",
    active: true,
  },
  {
    icon: Users,
    title: "Customers",
    khmerTitle: "អតិថិជន",
    href: "/vendor/pro/customer",
  },
  {
    icon: Package,
    title: "Inventory",
    khmerTitle: "ស្តុក",
    href: "/vendor/pro/inventory",
  },
  {
    icon: FileBarChart,
    title: "Reports",
    khmerTitle: "របាយការណ៍",
    href: "/vendor/pro/reports",
  },
];

export default function ProExpensePage() {
  const { t, language } = useLanguage();
  const isKhmer = language === "km";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Stock Purchase");
  const [expenseVendor, setExpenseVendor] = useState("");
  const [expenseNote, setExpenseNote] = useState("");
  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState(false);
  const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");

  // Categories mixing default and custom for Pro Plan
  const [categories, setCategories] = useState([
    { value: "Stock Purchase", label: "Stock Purchase", isCustom: false },
    { value: "Rent", label: "Rent", isCustom: false },
    { value: "Transport", label: "Transport", isCustom: false },
    { value: "Electricity", label: "Electricity", isCustom: false },
    { value: "Labor", label: "Labor", isCustom: false },
    { value: "Marketing", label: "Marketing", isCustom: true },
    { value: "Others", label: "Others", isCustom: false },
  ]);

  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await offlineFetch("/api/vendor/expenses");
        const json = await res.json();
        if (json.success) {
          setExpenses(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch expenses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const totalExpense = expenses.reduce(
    (sum, e) => sum + parseFloat(e.amount || "0"),
    0,
  );

  const summaryData = {
    todayTotal: `$${totalExpense.toFixed(2)}`,
    topCategory: expenses.length > 0 ? expenses[0].category : "None",
    weeklyTotal: `$${totalExpense.toFixed(2)}`,
    monthlyTotal: `$${totalExpense.toFixed(2)}`,
  };

  const handleQuickLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await offlineFetch("/api/vendor/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(expenseAmount),
          category: expenseCategory,
          description: expenseNote,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setExpenses((prev) => [json.data, ...prev]);
        setExpenseAmount("");
        setExpenseVendor("");
        setExpenseNote("");
        setIsQuickLogModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCustomCategory = () => {
    if (!customCategoryName.trim()) return;
    setCategories((prev) => [
      ...prev.slice(0, prev.length - 1), // insert before "Others"
      { value: customCategoryName, label: customCategoryName, isCustom: true },
      prev[prev.length - 1],
    ]);
    setExpenseCategory(customCategoryName);
    setCustomCategoryName("");
    setShowCustomCategoryModal(false);
  };

  return (
    <VendorDashboardLayout
      settingsHref="/vendor/pro/settings"
      plan="pro"
      navLinks={PRO_NAV}
      currentPath="/vendor/pro/expenses"
      title={t("dashboard.titles.myExpenses")}
      planBadge={{ label: "PRO", icon: Crown }}
      rightActions={
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 bg-psar-dark hover:opacity-90 text-white font-medium px-3.5 py-2 rounded-xl transition-colors text-sm min-h-[40px] cursor-pointer border-0">
            <FileText className="w-4 h-4" /> {t("dashboard.actions.exportPdf")}
          </button>
          <button
            onClick={() => setShowCustomCategoryModal(true)}
            className="flex items-center gap-2 bg-psar-primary/10 hover:bg-psar-primary/20 text-psar-primary font-medium px-3.5 py-2 rounded-xl transition-colors text-sm min-h-[40px] cursor-pointer border border-psar-primary/20"
          >
            <Plus className="w-4 h-4" />{" "}
            <span className="hidden sm:inline">
              {t("dashboard.actions.addCategory")}
            </span>
          </button>
          <button
            onClick={() => setIsQuickLogModalOpen(true)}
            className="flex items-center gap-2 bg-psar-primary hover:bg-psar-primary/90 text-white font-medium px-3.5 py-2 rounded-xl transition-colors text-sm min-h-[40px] cursor-pointer border-0"
          >
            <Plus className="w-4 h-4" /> {t("dashboard.actions.addExpense")}
          </button>
        </div>
      }
    >
      <div className="flex-1 w-full h-full overflow-y-auto p-6 md:p-8 space-y-7">
        {/* Header */}
        <div className="pt-1 pb-2">
          <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">
            {t("dashboard.titles.myExpenses")}
          </h2>
          <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
            {isKhmer
              ? "តាមដាន និងគ្រប់គ្រងការចំណាយ"
              : "Track and manage your expenses"}
          </p>
        </div>

        {/* QUICK LOGGING MODAL */}
        {isQuickLogModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
              className="absolute inset-0"
              onClick={() => setIsQuickLogModalOpen(false)}
            ></div>
            <div className="bg-white dark:bg-dark-surface rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsQuickLogModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:text-[#c9d1d9] hover:bg-slate-100 dark:hover:bg-white/5 p-1.5 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 flex items-center gap-2">
                <div className="p-2 bg-psar-primary/10 text-psar-primary rounded-lg transition-colors">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-[22px] text-slate-900 dark:text-white">
                    {t("dashboard.modals.addExpenseTitle")}
                  </h2>
                  <p className="text-sm font-khmer text-slate-500 dark:text-[#7d8590] mt-1">
                    {t("dashboard.actions.quickLogSub")}
                  </p>
                </div>
              </div>

              <form onSubmit={handleQuickLog} className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CircleDollarSign className="h-6 w-6 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        required
                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-xl font-bold placeholder-slate-400 focus:bg-white dark:bg-dark-surface focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all min-h-[60px]"
                      />
                      <div className="absolute top-[-10px] left-4 bg-white dark:bg-dark-surface px-1 text-[11px] font-bold text-slate-500 dark:text-[#7d8590] transition-colors group-focus-within:text-red-500">
                        {t("inventory.modal.amountLabel")}{" "}
                        <span className="text-red-500">*</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="relative group h-full">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Tag className="h-5 w-5 text-slate-400 group-focus-within:text-psar-primary transition-colors" />
                      </div>
                      <select
                        value={expenseCategory}
                        onChange={(e) => setExpenseCategory(e.target.value)}
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-[15px] font-medium focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none transition-all h-full min-h-[60px] appearance-none cursor-pointer"
                      >
                        {categories.map((cat, idx) => {
                          const displayLabel = cat.isCustom
                            ? cat.label
                            : cat.value === "Stock Purchase"
                              ? isKhmer
                                ? "ទិញស្តុក"
                                : "Stock Purchase"
                              : cat.value === "Rent"
                                ? isKhmer
                                  ? "ថ្លៃជួល"
                                  : "Rent"
                                : cat.value === "Transport"
                                  ? isKhmer
                                    ? "ការធ្វើដំណើរ"
                                    : "Transport"
                                  : cat.value === "Electricity"
                                    ? isKhmer
                                      ? "អគ្គិសនី"
                                      : "Electricity"
                                    : cat.value === "Labor"
                                      ? isKhmer
                                        ? "កម្លាំងពលកម្ម"
                                        : "Labor"
                                      : cat.value === "Marketing"
                                        ? isKhmer
                                          ? "ទីផ្សារ"
                                          : "Marketing"
                                        : cat.value === "Others"
                                          ? isKhmer
                                            ? "ផ្សេងៗ"
                                            : "Others"
                                          : cat.label;
                          return (
                            <option key={idx} value={cat.value}>
                              {displayLabel}{" "}
                              {cat.isCustom
                                ? isKhmer
                                  ? "(ផ្ទាល់ខ្លួន)"
                                  : "(Custom)"
                                : ""}
                            </option>
                          );
                        })}
                      </select>
                      <div className="absolute top-[-10px] left-4 bg-white dark:bg-dark-surface px-1 text-[11px] font-bold text-slate-500 dark:text-[#7d8590] flex items-center justify-between w-[calc(100%-32px)] transition-colors group-focus-within:text-psar-primary">
                        <span>{t("dashboard.table.category")}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsQuickLogModalOpen(false);
                            setShowCustomCategoryModal(true);
                          }}
                          className="text-psar-primary hover:text-psar-primary/80 flex items-center border-0 bg-transparent cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />{" "}
                          {isKhmer ? "ថ្មី" : "New"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 items-stretch mt-2">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-slate-400 group-focus-within:text-psar-primary transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="Supplier or Vendor Name"
                      value={expenseVendor}
                      onChange={(e) => setExpenseVendor(e.target.value)}
                      className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-[15px] placeholder-slate-400 focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none transition-all min-h-[60px]"
                    />
                    <div className="absolute top-[-10px] left-4 bg-white dark:bg-dark-surface px-1 text-[11px] font-bold text-slate-500 dark:text-[#7d8590] transition-colors group-focus-within:text-psar-primary">
                      {isKhmer ? "អ្នកផ្គត់ផ្គង់" : "Vendor"}
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t("dashboard.modals.notePlaceholder")}
                      value={expenseNote}
                      onChange={(e) => setExpenseNote(e.target.value)}
                      className="block w-full px-4 py-4 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-[15px] placeholder-slate-400 focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none transition-all min-h-[60px]"
                    />
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="submit"
                      className="w-full bg-psar-primary hover:opacity-90 text-white font-bold text-[16px] py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 min-h-[56px] border-0 cursor-pointer"
                    >
                      <Plus className="w-5 h-5" />
                      <span>{t("dashboard.actions.save")}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CUSTOM CATEGORY MODAL */}
        {showCustomCategoryModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
              className="absolute inset-0"
              onClick={() => setShowCustomCategoryModal(false)}
            ></div>
            <div className="bg-white dark:bg-dark-surface rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setShowCustomCategoryModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:text-[#c9d1d9] p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-psar-primary/10 text-psar-primary rounded-lg transition-colors">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[19px] text-slate-900 dark:text-white">
                    {t("dashboard.actions.addCategory")}
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-[#7d8590]">
                    {isKhmer
                      ? "បង្កើតប្រភេទចំណាយផ្ទាល់ខ្លួនរបស់អ្នក។"
                      : "Create your own expense category tag."}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="e.g., Marketing Ads"
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl text-[15px] font-medium focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none transition-all min-h-[48px]"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleCreateCustomCategory}
                  className="w-full bg-psar-primary hover:opacity-90 text-white font-bold py-3 rounded-xl transition-colors min-h-[48px] border-0 cursor-pointer shadow-sm"
                >
                  {t("common.save") || "Create Category"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <VendorSummaryCard
            title={"Today's Expenses"}
            khmerTitle="ចំណាយថ្ងៃនេះ"
            value={summaryData.todayTotal}
            icon={Receipt}
            trend={`${expenses.length} Transactions`}
            isPositive={false}
            highlight
          />
          <VendorSummaryCard
            title="Top Category"
            khmerTitle="ប្រភេទចំណាយច្រើនជាងគេ"
            value={summaryData.topCategory}
            icon={Tag}
          />
          <VendorSummaryCard
            title="Weekly Expenses"
            khmerTitle="ចំណាយប្រចាំសប្តាហ៍"
            value={summaryData.weeklyTotal}
            icon={TrendingDown}
            isPositive={false}
          />
          <VendorSummaryCard
            title="Monthly Total"
            khmerTitle="សរុបប្រចាំខែ"
            value={summaryData.monthlyTotal}
            icon={CircleDollarSign}
          />
        </div>

        {/* Expense History Log */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col transition-colors">
          <div className="p-5 md:p-6 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-[17px] text-slate-900 dark:text-white">
                {t("dashboard.titles.history")}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t("dashboard.placeholders.searchExp")}
                  className="w-full sm:w-auto pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 min-h-[40px] dark:text-white outline-none transition-all"
                />
              </div>
              <button className="p-2 border border-slate-200 dark:border-white/5 rounded-xl text-slate-500 dark:text-[#7d8590] hover:bg-slate-50 dark:hover:bg-white/5 bg-white dark:bg-dark-surface transition-colors min-h-[40px] cursor-pointer">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#0d1117] border-b border-slate-100 dark:border-white/5 text-[13px] text-slate-500 dark:text-[#7d8590] uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">{t("dashboard.table.time")}</th>
                  <th className="px-6 py-4">{t("dashboard.table.category")}</th>
                  <th className="px-6 py-4">
                    {t("dashboard.table.note")} / Receipt
                  </th>
                  <th className="px-6 py-4">{t("dashboard.table.amount")}</th>
                  <th className="px-6 py-4 text-center">
                    {t("dashboard.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {expenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className="hover:bg-psar-primary/5 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-[15px] font-medium text-slate-900 dark:text-white">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {new Date(exp.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[13px] font-bold border ${exp.isCustom ? "bg-psar-primary/10 text-psar-primary border-psar-primary/20" : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-[#c9d1d9] border-slate-200 dark:border-white/5"}`}
                        >
                          {exp.category}
                        </span>
                        {exp.isCustom && (
                          <span className="text-[9px] font-bold text-psar-primary uppercase tracking-wider bg-white dark:bg-dark-surface px-1.5 py-0.5 rounded border border-psar-primary/20 shadow-sm transition-colors">
                            Custom
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] text-slate-600 dark:text-[#9aa4b2]">
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
                        -${parseFloat(exp.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button className="p-2 text-slate-400 hover:text-psar-primary dark:hover:text-white rounded-lg hover:bg-psar-primary/10 dark:hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100 min-h-[40px] min-w-[40px] border-0 bg-transparent cursor-pointer">
                        <EllipsisVertical className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0d1117] text-center transition-colors">
            <button className="text-[14px] font-semibold text-psar-primary hover:underline min-h-[40px] px-4 border-0 bg-transparent cursor-pointer transition-all">
              {t("dashboard.actions.viewAll")} Pro Expenses
            </button>
          </div>
        </div>
      </div>
    </VendorDashboardLayout>
  );
}
