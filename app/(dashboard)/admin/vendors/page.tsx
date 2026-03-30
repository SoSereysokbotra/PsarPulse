"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert,
  MapPin,
  Camera,
  Eye
} from "lucide-react";
import EllipsisVertical from "lucide-react/dist/esm/icons/ellipsis-vertical";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

// Mock Data
const vendors = [
  { id: 1, name: "Sokha's Grill", owner: "Sokha Heng", phone: "012-345-678", role: "Vendor", tier: "Pro", status: "Active", joined: "Oct 12, 2025" },
  { id: 2, name: "Nita Clothing", owner: "Nita Vong", phone: "098-765-432", role: "Vendor", tier: "Starter", status: "Active", joined: "Nov 01, 2025" },
  { id: 3, name: "Tech Accessories", owner: "Rithy Sok", phone: "011-222-333", role: "Vendor", tier: "Premium", status: "Pending", joined: "Just Now", documentUrl: "#" },
  { id: 4, name: "Bopha Smoothies", owner: "Bopha Ly", phone: "010-999-888", role: "Vendor", tier: "Pro", status: "Suspended", joined: "Aug 05, 2025" },
  { id: 5, name: "Admin Dashboard", owner: "Admin User", phone: "015-000-000", role: "Admin", tier: "N/A", status: "Active", joined: "Jan 01, 2025" },
];

export default function VendorDirectoryPage() {
  const { language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<any>(null); // For verification modal
  
  return (
    <div className={`space-y-6 ${isKhmer ? "font-suwannaphum" : ""} ${isDark ? "text-slate-100" : "text-slate-900"}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
      <div className={`p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}>
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
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select className={`px-3 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
            isDark ? "bg-[#161b22] border-white/10 text-slate-300" : "bg-white border-slate-200 text-slate-600"
          }`}>
            <option>{isKhmer ? "គ្រប់តួនាទី" : "All Roles"}</option>
            <option>{isKhmer ? "អាជីវករ" : "Vendor"}</option>
            <option>{isKhmer ? "អ្នកគ្រប់គ្រង" : "Admin"}</option>
          </select>
          <select className={`px-3 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
            isDark ? "bg-[#161b22] border-white/10 text-slate-300" : "bg-white border-slate-200 text-slate-600"
          }`}>
            <option>{isKhmer ? "គ្រប់កម្រិត" : "All Tiers"}</option>
            <option>{isKhmer ? "កម្រិតចាប់ផ្តើម" : "Starter"}</option>
            <option>{isKhmer ? "កម្រិតឈ្លាសវៃ (Pro)" : "Smart (Pro)"}</option>
            <option>{isKhmer ? "កម្រិតបញ្ញាសិប្បនិម្មិត (Premium)" : "AI Assistant (Premium)"}</option>
          </select>
          <select className={`px-3 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
            isDark ? "bg-[#161b22] border-white/10 text-slate-300" : "bg-white border-slate-200 text-slate-600"
          }`}>
            <option>{isKhmer ? "គ្រប់ស្ថានភាព" : "All Statuses"}</option>
            <option>{isKhmer ? "សកម្ម" : "Active"}</option>
            <option>{isKhmer ? "កំពុងរង់ចាំ" : "Pending"}</option>
            <option>{isKhmer ? "ត្រូវបានផ្អាក" : "Suspended"}</option>
          </select>
          <button className={`p-2 border rounded-lg transition-colors ${
            isDark ? "border-white/10 text-slate-500 hover:bg-white/5" : "border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}>
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Vendor Table */}
      <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}>
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
              {vendors.map((vendor) => (
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
                      <button className="p-1 hover:text-blue-600 transition-colors" title={isKhmer ? "មើលព័ត៌មានលម្អិត" : "View Details"}>
                        <Eye className="h-5 w-5" />
                      </button>
                      {vendor.status === 'Pending' ? (
                        <button className="p-1 hover:text-emerald-600 transition-colors" title={isKhmer ? "អនុម័ត" : "Approve"}>
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                      ) : (
                        <button className="p-1 hover:text-red-600 transition-colors" title={isKhmer ? "ផ្អាក" : "Suspend"}>
                          <ShieldAlert className="h-5 w-5" />
                        </button>
                      )}
                      <button className={`p-1 transition-colors flex items-center ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>
                        <EllipsisVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
