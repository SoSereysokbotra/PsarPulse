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
  Search,
  AlertTriangle,
  Edit2,
  PlusCircle,
  FileBarChart,
  Crown,
  FileText,
  Download,
  ArrowUpRight,
} from "lucide-react";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { offlineFetch } from "@/lib/pwa/offline-fetch";

const PRO_NAV = [
  { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/vendor/pro" },
  { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/vendor/pro/sales" },
  { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/vendor/pro/expenses" },
  { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/vendor/pro/customer" },
  { icon: Package, title: "Inventory", khmerTitle: "ស្តុក", href: "/vendor/pro/inventory", active: true },
  { icon: FileBarChart, title: "Reports", khmerTitle: "របាយការណ៍", href: "/vendor/pro/reports" },
];

export default function ProInventoryPage() {
  const { t, language } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", khmerName: "", price: "", stock: 0, threshold: 10 });

  const fetchInventory = async () => {
    try {
      const res = await offlineFetch("/api/vendor/inventory");
      const data = await res.json();
      if (data.success) setInventoryItems(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  React.useEffect(() => { fetchInventory(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingItem ? `/api/vendor/inventory/${editingItem.id}` : "/api/vendor/inventory";
    const method = editingItem ? "PUT" : "POST";
    try {
      const res = await offlineFetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingItem(null);
        fetchInventory();
      }
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm(t("dashboard.modals.deleteConfirmDesc"))) return;
    try {
      const res = await offlineFetch(`/api/vendor/inventory/${id}`, { method: "DELETE" });
      if (res.ok) fetchInventory();
    } catch (error) { console.error(error); }
  };

  const openAdd = () => {
    if (inventoryItems.length >= 100) {
      setNotice("Pro inventory limit reached (100/100).");
      return;
    }
    setNotice(null);
    setFormData({ name: "", khmerName: "", price: "", stock: 0, threshold: 10 });
    setEditingItem(null);
    setIsModalOpen(true);
  };
  const openEdit = (item: any) => { setFormData({ name: item.name, khmerName: item.khmerName || "", price: item.price, stock: item.stock, threshold: item.threshold }); setEditingItem(item); setIsModalOpen(true); };

  const handleExportCSV = () => {
    const rows = [
      ["Name", "Khmer Name", "Price", "Stock", "Status", "Threshold"],
      ...inventoryItems.map((item) => [
        item.name,
        item.khmerName || "",
        item.price,
        item.stock,
        item.status,
        item.threshold,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const lowStockItems = inventoryItems.filter(
    (i) => i.status === "low" || i.status === "out" || (typeof i.stock === "number" && typeof i.threshold === "number" && i.stock <= i.threshold)
  );

  const summaryData = {
    totalItems: inventoryItems.length.toString(),
    lowStock: inventoryItems.filter(i => i.status === 'low' || i.stock <= i.threshold).length.toString(),
    totalValue: "$" + inventoryItems.reduce((acc, curr) => acc + (parseFloat(curr.price) * curr.stock), 0).toFixed(2),
    mostSold: inventoryItems.length > 0 ? inventoryItems[0].name : "-",
    stockTurnover: "N/A",
  };


  return (
    <VendorDashboardLayout
      settingsHref="/vendor/pro/settings"
      plan="pro"
      navLinks={PRO_NAV}
      currentPath="/vendor/pro/inventory"
      title={t("inventory.title")}
      planBadge={{ label: "PRO", icon: Crown }}
      notifications={notice ? [{
        title: "Limit Reached",
        desc: notice,
        time: "Just now",
        unread: true,
        type: "error"
      }] : []}
      rightActions={
        <>
          <button
            onClick={handleExportCSV}
            className="hidden sm:flex items-center gap-2 bg-psar-dark hover:opacity-90 text-white font-medium px-4 py-2 rounded-xl transition-colors text-[13px] min-h-[40px] cursor-pointer border-0"
          >
            <Download className="w-4 h-4" /> {t("dashboard.actions.exportCsv")}
          </button>
        </>
      }
    >
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">
          {/* ══ INVENTORY HEADER ══════════════════════════════════════ */}
          <div className="pt-1 pb-2">
            <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">
              {t("dashboard.customerSection.title") === "My Customers" ? "My Inventory" : "ស្តុករបស់ខ្ញុំ"}
            </h2>
            <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
              {t("inventory.subtitle")} ·{" "}
              <span className="text-[#9ca3af] font-khmer">
                តាមដាន និងគ្រប់គ្រងស្តុកទំនិញ
              </span>
            </p>
          </div>

          {/* Metric Cards - Pro introduces wider range of metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            <VendorSummaryCard
              title={t("TotalProducts")}
              khmerTitle="ផលិតផលសរុប"
              value={summaryData.totalItems}
              icon={Package}
              isPositive={true}
              trend="Max 100"
            />
            <VendorSummaryCard
              title={t("LowStock")}
              khmerTitle="ស្តុកជិតអស់"
              value={summaryData.lowStock}
              icon={AlertTriangle}
              trend="Needs attention"
              isPositive={false}
            />
            <VendorSummaryCard
              title={t("InventoryValue")}
              khmerTitle="តម្លៃស្តុក"
              value={summaryData.totalValue}
              icon={CircleDollarSign}
            />
            <VendorSummaryCard
              title={t("TopSeller")}
              khmerTitle="លក់ដាច់បំផុត"
              value={summaryData.mostSold}
              icon={TrendingUp}
              subtext="Highest margin"
            />
            {/* Pro Specific */}
            <VendorSummaryCard
              title={t("dashboard.metrics.turnover")}
              khmerTitle="អត្រាលក់ចេញ"
              value={summaryData.stockTurnover}
              icon={ArrowUpRight}
              trend="Fast moving"
              isPositive={true}
              highlight
            />
          </div>

          {/* Inventory Table Area */}
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:bg-dark-surface dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 md:p-6 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[17px] text-slate-900 dark:text-white">
                  {t("inventory.table.masterList")}
                </h3>
                <p className="text-[13px] font-khmer text-slate-500 dark:text-[#7d8590] mt-0.5">
                  បញ្ជីផលិតផលមេ
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-auto">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t("inventory.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-psar-primary focus:ring-1 focus:ring-psar-primary min-h-[44px] transition-colors"
                  />
                </div>
                <button onClick={openAdd} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-psar-primary text-white font-medium px-4 py-2.5 rounded-xl hover:opacity-90 transition-colors min-h-[44px]">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">{t("inventory.addProduct")}</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0d1117] border-b border-slate-100 dark:border-white/5 text-[11px] text-slate-500 dark:text-[#7d8590] uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4">{t("inventory.table.productInfo")}</th>
                    <th className="px-6 py-4">{t("inventory.table.price")}</th>
                    <th className="px-6 py-4">{t("inventory.table.stockLevel")}</th>
                    <th className="px-6 py-4">{t("inventory.table.lastRestock")}</th>
                    <th className="px-6 py-4">{t("inventory.table.status")}</th>
                    <th className="px-6 py-4 text-right">{t("inventory.table.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {inventoryItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-psar-primary/10 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-slate-900 dark:text-white">
                            {language === 'km' && item.khmerName ? item.khmerName : item.name}
                          </span>
                          <span className="text-[12px] font-khmer text-slate-500 dark:text-[#7d8590]">
                            {item.khmerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[15px] font-bold text-slate-700 dark:text-[#c9d1d9]">
                          {item.price}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Cost: $1.00
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="text-[15px] font-bold text-slate-900 dark:text-white w-6">
                            {item.stock}
                          </span>
                          <div className="w-24 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden transition-colors">
                            <div
                              className={`h-full rounded-full ${item.status === "out" ? "bg-red-500" : item.status === "low" ? "bg-orange-500" : "bg-psar-primary"}`}
                              style={{
                                width: `${Math.min((item.stock / (item.threshold * 2)) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-slate-600 dark:text-[#9aa4b2]">
                        {item.lastRestock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.status === "out" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-[11px] font-bold transition-colors">
                            {t("inventory.status.outOutOfStock") || t("inventory.status.out")}
                          </span>
                        ) : item.status === "low" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-[11px] font-bold transition-colors">
                            {t("inventory.status.lowStock")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold transition-colors">
                            {t("inventory.status.good")}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors border-0 bg-transparent cursor-pointer"
                            title={t("dashboard.common.delete")}
                          >
                            <X className="w-4 h-4 mx-auto" />
                          </button>
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 text-slate-400 hover:text-slate-900 dark:text-white rounded-lg hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                            title={t("dashboard.actions.edit") || t("dashboard.actions.save")}
                          >
                            <Edit2 className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0d1117] text-center transition-colors">
              <button className="text-[13px] font-semibold text-psar-primary hover:underline border-0 bg-transparent cursor-pointer">
                {t("dashboard.actions.viewAll")} {summaryData.totalItems} {t("dashboard.table.items")}
              </button>
            </div>
          </div>
      </div>
        
        {/* Modals */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl shadow-xl w-full max-w-md relative animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:text-[#c9d1d9] transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                {editingItem ? t("inventory.modal.editTitle") : t("inventory.modal.addTitle")}
              </h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-500 dark:text-[#7d8590] mb-1.5 ml-1">
                    {t("inventory.modal.nameLabel")}
                  </label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl text-[15px] focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-500 dark:text-[#7d8590] mb-1.5 ml-1">
                    {t("inventory.modal.khmerNameLabel")}
                  </label>
                  <input placeholder={t("inventory.modal.khmerNamePlaceholder")} value={formData.khmerName} onChange={e => setFormData({...formData, khmerName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl text-[15px] focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-500 dark:text-[#7d8590] mb-1.5 ml-1">
                    {t("inventory.modal.priceLabel")}
                  </label>
                  <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl text-[15px] focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none transition-all" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[12px] font-bold text-slate-500 dark:text-[#7d8590] mb-1.5 ml-1">
                      {t("inventory.table.stockLevel")}
                    </label>
                    <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl text-[15px] focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none transition-all" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[12px] font-bold text-slate-500 dark:text-[#7d8590] mb-1.5 ml-1">
                      Threshold
                    </label>
                    <input type="number" required value={formData.threshold} onChange={e => setFormData({...formData, threshold: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl text-[15px] focus:bg-white dark:bg-dark-surface focus:border-psar-primary focus:ring-1 focus:ring-psar-primary outline-none transition-all" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#0d1117] dark:hover:bg-white/5 text-slate-700 dark:text-[#c9d1d9] font-bold rounded-xl transition-all border-0 cursor-pointer">
                    {t("dashboard.actions.cancel")}
                  </button>
                  <button type="submit" className="px-5 py-2.5 bg-psar-primary hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-sm border-0 cursor-pointer">
                    {t("dashboard.actions.save")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </VendorDashboardLayout>
  );
}
