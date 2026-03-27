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

const PRO_NAV = [
  { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/vendor/pro" },
  { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/vendor/pro/sales" },
  { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/vendor/pro/expenses" },
  { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/vendor/pro/customer" },
  { icon: Package, title: "Inventory", khmerTitle: "ស្តុក", href: "/vendor/pro/inventory", active: true },
  { icon: FileBarChart, title: "Reports", khmerTitle: "របាយការណ៍", href: "/vendor/pro/reports" },
];

export default function ProInventoryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", khmerName: "", price: "", stock: 0, threshold: 10 });

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/vendor/inventory");
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
      const res = await fetch(url, {
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
    if(!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/vendor/inventory/${id}`, { method: "DELETE" });
      if (res.ok) fetchInventory();
    } catch (error) { console.error(error); }
  };

  const openAdd = () => { setFormData({ name: "", khmerName: "", price: "", stock: 0, threshold: 10 }); setEditingItem(null); setIsModalOpen(true); };
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
      title="Inventory Management"
      planBadge={{ label: "PRO", icon: Crown }}
      rightActions={
        <>
          <button
            onClick={handleExportCSV}
            className="hidden sm:flex items-center gap-2 bg-psar-dark hover:opacity-90 text-white font-medium px-4 py-2 rounded-xl transition-colors text-[13px] min-h-[40px] cursor-pointer border-0"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </>
      }
    >
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7">
          {/* ══ INVENTORY HEADER ══════════════════════════════════════ */}
          <div className="pt-1 pb-2">
            <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">
              My Inventory
            </h2>
            <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
              Track and manage your product inventory ·{" "}
              <span className="text-[#9ca3af]">
                តាមដាន និងគ្រប់គ្រងស្តុកទំនិញ
              </span>
            </p>
          </div>

          {/* FR-26: Dynamic Low Stock Alert Banner */}
          {lowStockItems.length > 0 ? (
          <div className="bg-orange-50 rounded-2xl p-5 md:p-6 border border-orange-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-orange-100 pointer-events-none" />
            <div className="flex items-start gap-4 z-10">
              <div className="p-3 bg-white dark:bg-dark-surface border border-orange-200 rounded-xl shrink-0 shadow-sm">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-bold text-[16px] text-orange-900">
                    Low Stock Alert ({lowStockItems.length} Item{lowStockItems.length !== 1 ? "s" : ""})
                  </h3>
                </div>
                <p className="text-orange-800 text-[14px] leading-relaxed max-w-2xl">
                  <strong>{lowStockItems.map((i) => i.name).join(", ")}</strong>{" "}
                  {lowStockItems.length === 1 ? "is" : "are"} running low. Tap below to review and restock.
                </p>
              </div>
            </div>
            <button className="w-full md:w-auto px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-colors text-sm shadow-sm min-h-[44px] z-10 flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" /> Create PO
            </button>
          </div>
          ) : (
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 flex items-center gap-3">
            <div className="p-2 bg-white border border-emerald-200 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-emerald-800 text-[14px] font-medium">All items are well stocked ✓</p>
          </div>
          )}

          {/* Metric Cards - Pro introduces wider range of metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            <VendorSummaryCard
              title="Total Products"
              khmerTitle="ផលិតផលសរុប"
              value={summaryData.totalItems}
              icon={Package}
              isPositive={true}
              trend="Unlimited"
            />
            <VendorSummaryCard
              title="Low Stock"
              khmerTitle="ស្តុកជិតអស់"
              value={summaryData.lowStock}
              icon={AlertTriangle}
              trend="Needs attention"
              isPositive={false}
            />
            <VendorSummaryCard
              title="Inventory Value"
              khmerTitle="តម្លៃស្តុក"
              value={summaryData.totalValue}
              icon={CircleDollarSign}
            />
            <VendorSummaryCard
              title="Top Seller"
              khmerTitle="លក់ដាច់បំផុត"
              value={summaryData.mostSold}
              icon={TrendingUp}
              subtext="Highest margin"
            />
            {/* Pro Specific */}
            <VendorSummaryCard
              title="Turnover Rate"
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
                  Master Product List
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
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-psar-primary focus:ring-1 focus:ring-psar-primary min-h-[44px]"
                  />
                </div>
                <button onClick={openAdd} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-psar-primary text-white font-medium px-4 py-2.5 rounded-xl hover:bg-psar-primary transition-colors min-h-[44px]">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Item</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0d1117] border-b border-slate-100 dark:border-white/5 text-[11px] text-slate-500 dark:text-[#7d8590] uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4">Product Details</th>
                    <th className="px-6 py-4">Price / Cost</th>
                    <th className="px-6 py-4">Stock Level</th>
                    <th className="px-6 py-4">Last Restock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {inventoryItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-psar-primary/10/20 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-slate-900 dark:text-white">
                            {item.name}
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
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
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
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-[11px] font-bold">
                            Out of Stock
                          </span>
                        ) : item.status === "low" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-orange-100 text-orange-700 text-[11px] font-bold">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete Product"
                          >
                            <X className="w-4 h-4 mx-auto" />
                          </button>
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 text-slate-400 hover:text-slate-900 dark:text-white rounded-lg hover:bg-slate-100 transition-colors"
                            title="Edit Product"
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
            <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0d1117] text-center">
              <button className="text-[13px] font-semibold text-psar-primary hover:underline">
                View All {summaryData.totalItems} Items
              </button>
            </div>
          </div>
        </div>
        
        {/* Modals */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl shadow-xl w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">{editingItem ? "Edit Item" : "Add New Item"}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-[#0d1117] dark:border-white/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Khmer Name</label>
                  <input value={formData.khmerName} onChange={e => setFormData({...formData, khmerName: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-[#0d1117] dark:border-white/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($)</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-[#0d1117] dark:border-white/10" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} className="w-full border rounded-lg p-2 dark:bg-[#0d1117] dark:border-white/10" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Threshold</label>
                    <input type="number" required value={formData.threshold} onChange={e => setFormData({...formData, threshold: parseInt(e.target.value)})} className="w-full border rounded-lg p-2 dark:bg-[#0d1117] dark:border-white/10" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-psar-primary text-white rounded-lg">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
    </VendorDashboardLayout>
  );
}
