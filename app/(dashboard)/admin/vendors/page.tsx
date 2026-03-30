"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert,
  MapPin,
  Camera,
  Eye,
  Trash2,
  RefreshCcw,
  X,
  Store,
  Phone,
  Clock
} from "lucide-react";
import EllipsisVertical from "lucide-react/dist/esm/icons/ellipsis-vertical";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Select } from "@/components/ui/Select";

// Mock Data fallback if needed, but we'll fetch from API

export default function VendorDirectoryPage() {
  const { language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<any>(null); // For verification modal
  const [selectedVendor, setSelectedVendor] = useState<any>(null); // For details modal
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [roleFilter, setRoleFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function fetchVendors() {
      try {
        const response = await fetch("/api/admin/vendors");
        if (response.ok) {
          const json = await response.json();
          if (json.success) {
            setVendors(json.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch vendors", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVendors();
  }, []);
    const filteredVendors = vendors.filter(v => {
    const matchesSearch = 
      v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.owner?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.phone?.includes(searchQuery);
    
    const matchesRole = roleFilter === "all" || v.role === roleFilter;
    const matchesTier = tierFilter === "all" || v.tier === tierFilter;
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;

    return matchesSearch && matchesRole && matchesTier && matchesStatus;
  });

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/vendors");
      if (response.ok) {
        const json = await response.json();
        if (json.success) setVendors(json.data);
      }
    } catch (error) {
       console.error("Failed to fetch vendors", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (vendorId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "blocked" : "active";
    if (!confirm(`Are you sure you want to ${newStatus === 'blocked' ? 'Suspend' : 'Reactivate'} this vendor?`)) return;

    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchVendors();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (!confirm("Are you sure you want to DELETE this vendor? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: "DELETE"
      });
      if (res.ok) fetchVendors();
    } catch (error) {
      alert("Failed to delete vendor");
    }
  };

  return (
    <div className={`space-y-6 ${isKhmer ? "font-suwannaphum" : ""} ${isDark ? "text-slate-100" : "text-slate-900"}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 fade-in">
        <div>
          <h1 className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            {isKhmer ? "បញ្ជីអាជីវករ" : "Vendor Directory"}
          </h1>
          <p className="text-slate-500 mt-1">
            {isKhmer ? "គ្រប់គ្រងគណនីអាជីវករ ពិនិត្យការចុះឈ្មោះថ្មី និងមើលលទ្ធផលការងារ។" : "Manage vendor accounts, approve new registrations, and view performance."}
          </p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          {isKhmer ? "នាំចេញបញ្ជី" : "Export Directory"}
        </button>
      </div>

      {/* Filters and Search */}
      <div className={`p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center fade-in-1 ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder={isKhmer ? "ស្វែងរកតូប ម្ចាស់ ឬទូរស័ព្ទ..." : "Search stall, owner, or phone..."} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto items-center overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          <Select 
            value={roleFilter}
            onChange={setRoleFilter}
            isDark={isDark}
            options={[
              { value: "all", label: isKhmer ? "គ្រប់តួនាទី" : "All Roles" },
              { value: "Vendor", label: isKhmer ? "អាជីវករ" : "Vendor" },
              { value: "Admin", label: isKhmer ? "អ្នកគ្រប់គ្រង" : "Admin" }
            ]}
          />
          <Select 
            value={tierFilter}
            onChange={setTierFilter}
            isDark={isDark}
            options={[
              { value: "all", label: isKhmer ? "គ្រប់កម្រិត" : "All Tiers" },
              { value: "Starter", label: isKhmer ? "កម្រិតចាប់ផ្តើម" : "Starter" },
              { value: "Smart (Pro)", label: isKhmer ? "កម្រិតឈ្លាសវៃ (Pro)" : "Smart (Pro)" },
              { value: "AI Assistant (Premium)", label: isKhmer ? "កម្រិតបញ្ញាសិប្បនិម្មិត (Premium)" : "AI Assistant (Premium)" }
            ]}
          />
          <Select 
            value={statusFilter}
            onChange={setStatusFilter}
            isDark={isDark}
            options={[
              { value: "all", label: isKhmer ? "គ្រប់ស្ថានភាព" : "All Statuses" },
              { value: "Active", label: isKhmer ? "សកម្ម" : "Active" },
              { value: "Pending", label: isKhmer ? "កំពុងរង់ចាំ" : "Pending" },
              { value: "Suspended", label: isKhmer ? "ត្រូវបានផ្អាក" : "Suspended" }
            ]}
          />
          <button className={`p-2.5 rounded-xl border transition-all flex items-center justify-center min-w-[42px] ${
            isDark 
              ? "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10" 
              : "bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 shadow-sm"
          }`}>
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Vendor Table */}
      <div className={`rounded-xl border shadow-sm overflow-hidden fade-in-2 ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-xs uppercase tracking-wider font-semibold ${isDark ? "bg-white/5 border-white/10 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                <th className="px-6 py-4">{isKhmer ? "តូប / ម្ចាស់" : "Stall / Owner"}</th>
                <th className="px-6 py-4">{isKhmer ? "តួនាទី / កម្រិត" : "Role/Tier"}</th>
                <th className="px-6 py-4">{isKhmer ? "ទំនាក់ទំនង" : "Contact"}</th>
                <th className="px-6 py-4">{isKhmer ? "ស្ថានភាព" : "Status"}</th>
                <th className="px-6 py-4">{isKhmer ? "បានចូលរួម" : "Joined"}</th>
                <th className="px-6 py-4 text-right">{isKhmer ? "សកម្មភាព" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      {isKhmer ? "កំពុងផ្ទុកទិន្នន័យ..." : "Loading vendors..."}
                    </div>
                  </td>
                </tr>
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    {isKhmer ? "មិនមានអាជីវករទេ" : "No vendors found"}
                  </td>
                </tr>
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    No vendors found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => (
                <tr key={vendor.id} className={`transition-colors ${isDark ? "hover:bg-white/5 border-b border-white/5 last:border-0" : "hover:bg-slate-50 border-b border-slate-100 last:border-0"}`}>
                  <td className="px-6 py-4">
                    <div className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{vendor.name}</div>
                    <div className="text-sm text-slate-500">{vendor.owner}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{vendor.role}</div>
                    <div className="text-xs text-slate-500">{vendor.tier}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {vendor.phone}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex flex-col items-start gap-1`}>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${vendor.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : ''}
                        ${vendor.status === 'Pending' ? 'bg-amber-100 text-amber-700' : ''}
                        ${vendor.status === 'Suspended' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                        {vendor.status}
                      </span>
                      {vendor.status === 'Pending' && (
                        <button 
                          onClick={() => setSelectedDocs(vendor)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center mt-1"
                        >
                          <Camera className="h-3 w-3 mr-1" />
                          Review Docs
                        </button>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {vendor.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 text-slate-400">
                      <button 
                        className="p-1 hover:text-blue-600 transition-colors" 
                        title={isKhmer ? "មើលព័ត៌មានលម្អិត" : "View Details"}
                        onClick={() => setSelectedVendor(vendor)}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {vendor.status === 'Pending' ? (
                        <button className="p-1 hover:text-emerald-600 transition-colors" title={isKhmer ? "អនុម័ត" : "Approve"}>
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                      ) : (
                        <button 
                          className={`p-1 transition-colors ${vendor.status === 'Suspended' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`} 
                          title={vendor.status === 'Suspended' ? (isKhmer ? "ធ្វើឱ្យសកម្មឡើងវិញ" : "Reactivate") : (isKhmer ? "ផ្អាក" : "Suspend")}
                          onClick={() => handleToggleStatus(vendor.id, vendor.status)}
                        >
                          {vendor.status === 'Suspended' ? <RefreshCcw className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
                        </button>
                      )}

                      <button 
                        className="p-1 hover:text-red-600 transition-colors" 
                        title={isKhmer ? "លុប" : "Delete"}
                        onClick={() => handleDeleteVendor(vendor.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button className={`p-1 transition-colors flex items-center ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>
                        <EllipsisVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className={`rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border ${isDark ? "bg-[#0d1117] border-white/10" : "bg-white border-slate-200"}`}>
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                    <Store className={`h-8 w-8 ${isDark ? "text-psar-primary" : "text-psar-primary"}`} />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{selectedVendor.name}</h3>
                    <p className="text-slate-500 font-medium">{selectedVendor.owner}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedVendor(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"}`}>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Status</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                    ${selectedVendor.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : ''}
                    ${selectedVendor.status === 'Pending' ? 'bg-amber-100 text-amber-700' : ''}
                    ${selectedVendor.status === 'Suspended' ? 'bg-red-100 text-red-700' : ''}
                  `}>
                    {selectedVendor.status}
                  </span>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"}`}>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Plan</p>
                  <p className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{selectedVendor.tier}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm">
                   <Phone className="h-4 w-4 text-emerald-500" />
                   <span className={isDark ? "text-slate-300" : "text-slate-600"}>{selectedVendor.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                   <Clock className="h-4 w-4 text-blue-500" />
                   <span className={isDark ? "text-slate-300" : "text-slate-600"}>{isKhmer ? "ចូលរួមនៅ៖" : "Joined on:"} {selectedVendor.joined}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                   <MapPin className="h-4 w-4 text-psar-primary" />
                   <span className={isDark ? "text-slate-300" : "text-slate-600"}>{selectedVendor.latitude}, {selectedVendor.longitude}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleToggleStatus(selectedVendor.id, selectedVendor.status)}
                  className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition-all ${
                    selectedVendor.status === 'Suspended' 
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" 
                    : "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                  }`}
                >
                  {selectedVendor.status === 'Suspended' ? (isKhmer ? "ធ្វើឱ្យសកម្មឡើងវិញ" : "Reactivate") : (isKhmer ? "ផ្អាក" : "Suspend Vendor")}
                </button>
                <button 
                  onClick={() => {
                    handleDeleteVendor(selectedVendor.id);
                    setSelectedVendor(null);
                  }}
                  className={`py-3 px-4 rounded-2xl font-bold text-sm transition-all ${isDark ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20" : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"}`}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal overlay mockup */}
      {selectedDocs && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row border ${isDark ? "bg-[#0d1117] border-white/10" : "bg-white border-slate-200"}`}>
            {/* Image Preview Area */}
            <div className={`w-full md:w-1/2 p-6 flex flex-col items-center justify-center border-r ${isDark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"}`}>
              <div className={`w-full aspect-video rounded-lg flex items-center justify-center mb-4 overflow-hidden border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-300 border-slate-400"}`}>
                 <MapPin className="h-10 w-10 text-slate-500" />
                 <span className="ml-2 font-medium text-slate-600">{isKhmer ? "រូបថតមុខហាង" : "Storefront Photo"}</span>
              </div>
              <div className={`w-full aspect-[1.58] rounded-lg flex items-center justify-center overflow-hidden border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-300 border-slate-400"}`}>
                 <span className="font-medium text-slate-600">{isKhmer ? "រូបថតអត្តសញ្ញាណប័ណ្ណ" : "Local ID Photo"}</span>
              </div>
            </div>
            {/* Validation Tools */}
            <div className="w-full md:w-1/2 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {isKhmer ? "ការផ្ទៀងផ្ទាត់ឯកសារ" : "Document Verification"}
                  </h3>
                  <p className="text-sm text-slate-500">{selectedDocs.name} ({selectedDocs.owner})</p>
                </div>
                <button onClick={() => setSelectedDocs(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-sm font-semibold text-amber-500 break-words mb-1">
                    {isKhmer ? "ការព្រមាន" : "Warning"}
                  </p>
                  <p className="text-xs text-amber-600/80">
                    {isKhmer ? "សូមផ្ទៀងផ្ទាត់ឈ្មោះតូប និងទីតាំងជាក់ស្តែងជាមួយរូបថតដែលបានផ្តល់ឱ្យ ដើម្បីការពារការបញ្ចូលព័ត៌មានមិនពិត ឬស្ទួន។" : "Please match the stall name and physical location with the provided photos to prevent fraudulent/duplicate entries."}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 text-xs block">Phone</span>
                    <span className="font-medium">{selectedDocs.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block">Submitted Tier</span>
                    <span className="font-medium">{selectedDocs.tier}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 text-xs block">Geolocation</span>
                    <span className="font-medium text-indigo-600 cursor-pointer">11.5564° N, 104.9282° E (View on Map)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setSelectedDocs(null)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition"
                >
                  Reject & Delete
                </button>
                <button 
                  onClick={() => setSelectedDocs(null)}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
                >
                  Approve Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
