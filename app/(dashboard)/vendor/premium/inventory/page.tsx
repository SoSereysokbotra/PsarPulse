"use client";

import React, { useState, useEffect } from "react";
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
  Download,
  ArrowUpRight,
  FileBarChart,
  PlusCircle,
  X,
  FileText,
} from "lucide-react";

import VendorDashboardLayout from "@/components/vendor/VendorDashboardLayout";
import VendorSummaryCard from "@/components/vendor/VendorSummaryCard";

const PREMIUM_NAV = [
  { icon: LayoutDashboard, title: "Dashboard", khmerTitle: "ផ្ទាំងគ្រប់គ្រង", href: "/vendor/premium" },
  { icon: CircleDollarSign, title: "Sales", khmerTitle: "ការលក់", href: "/vendor/premium/sales" },
  { icon: Receipt, title: "Expenses", khmerTitle: "ចំណាយ", href: "/vendor/premium/expenses" },
  { icon: Users, title: "Customers", khmerTitle: "អតិថិជន", href: "/vendor/premium/customer" },
  { icon: Package, title: "Inventory", khmerTitle: "ស្តុក", href: "/vendor/premium/inventory", active: true },
  { icon: FileBarChart, title: "Reports", khmerTitle: "របាយការណ៍", href: "/vendor/premium/reports" },
];

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "low" | "out">("all");
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    khmerName: "",
    price: "",
    stock: 0,
    threshold: 10
  });

  // Mock Inventory Data
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/vendor/inventory");
        const json = await res.json();
        if (json.success) {
          setInventoryItems(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch inventory", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const lowStockItems = inventoryItems.filter(item => item.stock <= item.threshold);

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.khmerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "low" && item.stock <= item.threshold && item.stock > 0) ||
                         (filterStatus === "out" && item.stock === 0);
    return matchesSearch && matchesFilter;
  });

  const summaryData = React.useMemo(() => {
    const totalItems = inventoryItems.length;
    const lowStockCount = inventoryItems.filter(item => item.stock <= (item.threshold || 10)).length;
    const value = inventoryItems.reduce((acc, item) => acc + (parseFloat(item.price || "0") * (item.stock || 0)), 0);

    return {
      totalItems: totalItems.toString(),
      lowStock: lowStockCount.toString(),
      totalValue: `$${value.toFixed(2)}`,
      mostSold: inventoryItems.length > 0 ? inventoryItems[0].name : "-", // Placeholder logic
      stockTurnover: "2.1x",
    };
  }, [inventoryItems]);

  const handleExportCSV = () => { console.log("Exporting CSV..."); };
  const handleCreatePO = () => { console.log("Creating PO..."); };
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setError(null);
    try {
      const url = editingItem ? `/api/vendor/inventory/${editingItem.id}` : "/api/vendor/inventory";
      const res = await fetch(url, {
        method: editingItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (res.ok) {
        if (editingItem) {
          setInventoryItems(prev => prev.map(item => item.id === editingItem.id ? json.data : item));
        } else {
          setInventoryItems(prev => [json.data, ...prev]);
        }
        setIsModalOpen(false);
      } else {
        setError(json.message || "Failed to save item");
      }
    } catch (err) {
      setError("Server error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/vendor/inventory/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInventoryItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleQuickRestock = async (item: any) => {
    try {
      const newStock = item.stock + 10;
      const res = await fetch(`/api/vendor/inventory/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        setInventoryItems(prev => prev.map(i => i.id === item.id ? { ...i, stock: newStock } : i));
      }
    } catch (err) {
      console.error("Restock failed", err);
    }
  };

  return (
    <VendorDashboardLayout
      settingsHref="/vendor/premium/settings"
      plan="premium"
      navLinks={PREMIUM_NAV}
      currentPath="/vendor/premium/inventory"
      title="Inventory Management"
      rightActions={
        <button onClick={handleExportCSV} className="hidden sm:flex items-center gap-2 bg-[#111827] dark:bg-white hover:opacity-90 text-white dark:text-[#111827] font-medium px-4 py-2 rounded-xl transition-colors text-[13px] min-h-[40px] cursor-pointer border-0">
          <Download className="w-4 h-4" /> Export Stock
        </button>
      }
    >
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7 transition-colors">
        <div className="pt-1 pb-2">
          <h2 className="text-[32px] font-extrabold text-[#111827] dark:text-white leading-tight">My Inventory</h2>
          <p className="text-[14px] text-[#6b7280] dark:text-[#7d8590] mt-1">
            Track and manage your product inventory · <span className="text-[#9ca3af] dark:text-[#4d5562]">តាមដាន និងគ្រប់គ្រងស្តុកទំនិញ</span>
          </p>
        </div>

        {lowStockItems.length > 0 ? (
          <div className="bg-orange-50 dark:bg-orange-500/10 rounded-2xl p-5 md:p-6 border border-orange-200 dark:border-orange-500/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden transition-colors">
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-orange-100 dark:from-orange-500/10 pointer-events-none" />
            <div className="flex items-start gap-4 z-10">
              <div className="p-3 bg-white dark:bg-[#161B22] border border-orange-200 dark:border-orange-500/20 rounded-xl shrink-0 shadow-sm transition-colors">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-[16px] text-orange-900 dark:text-orange-400 mb-1.5">Low Stock Alert ({lowStockItems.length} Item{lowStockItems.length !== 1 ? "s" : ""})</h3>
                <p className="text-orange-800 dark:text-orange-300/80 text-[14px] leading-relaxed max-w-2xl">
                  <strong>{lowStockItems.map((i) => i.name).slice(0, 3).join(", ")}{lowStockItems.length > 3 ? "..." : ""}</strong> {lowStockItems.length === 1 ? "is" : "are"} running low. Consider restocking soon to avoid stockouts.
                </p>
              </div>
            </div>
            <button onClick={handleCreatePO} className="w-full md:w-auto px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-colors text-sm shadow-sm min-h-[44px] z-10 flex items-center justify-center gap-2 cursor-pointer border-0">
              <FileText className="w-4 h-4" /> Create PO
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-[#161B22] border border-emerald-200 dark:border-emerald-500/20 rounded-xl"><AlertTriangle className="w-5 h-5 text-emerald-600 dark:text-emerald-500" /></div>
            <p className="text-emerald-800 dark:text-emerald-300 text-[14px] font-medium">All items are well stocked ✓</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <div onClick={() => setFilterStatus("all")} className="cursor-pointer">
            <VendorSummaryCard title="Total Products" khmerTitle="ផលិតផលសរុប" value={summaryData.totalItems} icon={Package} isPositive={true} highlight={filterStatus === "all"} />
          </div>
          <div onClick={() => setFilterStatus("low")} className="cursor-pointer">
            <VendorSummaryCard title="Low Stock" khmerTitle="ស្តុកជិតអស់" value={summaryData.lowStock} icon={AlertTriangle} isPositive={false} highlight={filterStatus === "low"} />
          </div>
          <VendorSummaryCard title="Inventory Value" khmerTitle="តម្លៃស្តុក" value={summaryData.totalValue} icon={CircleDollarSign} />
          <VendorSummaryCard title="Top Seller" khmerTitle="លក់ដាច់បំផុត" value={summaryData.mostSold} icon={TrendingUp} />
          <VendorSummaryCard title="Turnover Rate" khmerTitle="អត្រាលក់ចេញ" value={summaryData.stockTurnover} icon={ArrowUpRight} isPositive={true} />
        </div>

        <div className="bg-white dark:bg-[#0d1117] border border-[#e8eaed] dark:border-white/10 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-colors">
          <div className="p-5 md:p-6 border-b border-[#f0f2f5] dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
            <div>
              <h3 className="font-bold text-[17px] text-slate-900 dark:text-white">Product List</h3>
              <p className="text-[13px] text-slate-500 dark:text-[#7d8590] mt-0.5">បញ្ជីផលិតផល</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-white/10 rounded-xl text-sm dark:text-white focus:outline-none focus:border-[#3ecf8e] min-h-[44px] transition-colors" />
              </div>
              <button onClick={() => { setEditingItem(null); setFormData({name:"", khmerName:"", price:"", stock:0, threshold:10}); setIsModalOpen(true); }} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#3ecf8e] text-[#0d1117] font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity min-h-[44px] border-0 cursor-pointer">
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 border-b border-[#f0f2f5] dark:border-white/5 text-[11px] text-slate-500 dark:text-[#7d8590] uppercase tracking-wider font-semibold transition-colors">
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Price / Cost</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4">Threshold</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5] dark:divide-white/5 transition-colors">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-slate-900 dark:text-white">{item.name}</span>
                        <span className="text-[12px] text-slate-500 dark:text-[#7d8590]">{item.khmerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[15px] font-bold text-slate-700 dark:text-[#e6edf3]">{item.price}</span>
                      <div className="text-[11px] text-slate-400 mt-0.5">Cost: $1.00</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[15px] font-bold text-slate-900 dark:text-white w-6">{item.stock}</span>
                        <div className="w-24 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${item.status === "out" ? "bg-red-500" : item.status === "low" ? "bg-orange-500" : "bg-[#3ecf8e]"}`} style={{ width: `${Math.min((item.stock / 50) * 100, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-600 dark:text-[#e6edf3]">{item.lastRestock}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold ${item.status === 'out' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' : item.status === 'low' ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'}`}>
                        {item.status === 'out' ? 'Out of Stock' : item.status === 'low' ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleQuickRestock(item)} className="p-2 text-slate-400 hover:text-[#3ecf8e] rounded-lg transition-colors bg-transparent border-0 cursor-pointer" title="Quick Restock +10"><PlusCircle className="w-4 h-4" /></button>
                        <button onClick={() => { setEditingItem(item); setFormData({name: item.name, khmerName: item.khmerName || "", price: item.price.toString().replace('$',''), stock: item.stock, threshold: item.threshold}); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-[#111827] dark:hover:text-white rounded-lg transition-colors bg-transparent border-0 cursor-pointer" title="Edit Product"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item.id)} disabled={isDeleting === item.id} className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors bg-transparent border-0 cursor-pointer">{isDeleting === item.id ? <PlusCircle className="w-4 h-4 animate-spin rotate-45" /> : <X className="w-4 h-4" />}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(filterStatus !== "all" || searchTerm !== "") && (
            <div className="p-4 border-t border-[#f0f2f5] dark:border-white/5 bg-slate-50 dark:bg-[#161B22] text-center">
              <button onClick={() => { setSearchTerm(""); setFilterStatus("all"); }} className="inline-flex items-center gap-2 px-6 py-2 bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20 text-[#8b5cf6] font-bold rounded-full transition-all border-0 cursor-pointer text-[13px]">
                <X className="w-4 h-4" /> Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white dark:bg-[#0d1117] p-6 md:p-8 rounded-[24px] shadow-2xl w-full max-w-md relative z-10 border border-[#e8eaed] dark:border-white/10 transition-colors">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-[#9ca3af] hover:text-[#111827] hover:bg-[#f0f2f5] p-1.5 rounded-[8px] transition-colors border-0 bg-transparent cursor-pointer"><X className="w-5 h-5" /></button>
            <h3 className="text-[22px] font-bold mb-6 text-[#111827] dark:text-white">{editingItem ? "Edit Inventory Item" : "Add New Item"}</h3>
            {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg">{error}</div>}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-[#9aa4b2] mb-1.5 font-khmer">Product Name ឈ្មោះទំនិញ <span className="text-red-500">*</span></label>
                <input required placeholder="e.g. Milk Tea" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-[#3ecf8e] transition-colors text-[14px]" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-[#9aa4b2] mb-1.5">Khmer Name (Optional)</label>
                <input placeholder="e.g. តែទឹកដោះគោ" value={formData.khmerName} onChange={e => setFormData({ ...formData, khmerName: e.target.value })} className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-[#3ecf8e] transition-colors text-[14px]" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-700 dark:text-[#9aa4b2] mb-1.5">Price ($) <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" placeholder="0.00" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-[#3ecf8e] transition-colors text-[14px]" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-[#9aa4b2] mb-1.5">Current Stock <span className="text-red-500">*</span></label>
                  <input type="number" placeholder="0" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-[#3ecf8e] transition-colors text-[14px]" />
                </div>
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-[#9aa4b2] mb-1.5">Alert Threshold</label>
                  <input type="number" placeholder="10" required value={formData.threshold} onChange={e => setFormData({ ...formData, threshold: parseInt(e.target.value) || 0 })} className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#161B22] text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-[#3ecf8e] transition-colors text-[14px]" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#f0f2f5] dark:border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-3 text-[#374151] dark:text-[#e6edf3] font-bold hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors border-0 cursor-pointer bg-transparent">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-5 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#3ecf8e] text-white font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity border-0 cursor-pointer disabled:opacity-50 min-w-[120px]">{isSaving ? "Saving..." : editingItem ? "Save Changes" : "Confirm Item"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </VendorDashboardLayout>
  );
}
