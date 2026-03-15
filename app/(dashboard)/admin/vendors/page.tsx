"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert,
  MapPin,
  Camera,
  Eye
} from "lucide-react";

// Mock Data
const vendors = [
  { id: 1, name: "Sokha's Grill", owner: "Sokha Heng", phone: "012-345-678", role: "Vendor", tier: "Pro", status: "Active", joined: "Oct 12, 2025" },
  { id: 2, name: "Nita Clothing", owner: "Nita Vong", phone: "098-765-432", role: "Vendor", tier: "Starter", status: "Active", joined: "Nov 01, 2025" },
  { id: 3, name: "Tech Accessories", owner: "Rithy Sok", phone: "011-222-333", role: "Vendor", tier: "Premium", status: "Pending", joined: "Just Now", documentUrl: "#" },
  { id: 4, name: "Bopha Smoothies", owner: "Bopha Ly", phone: "010-999-888", role: "Vendor", tier: "Pro", status: "Suspended", joined: "Aug 05, 2025" },
  { id: 5, name: "Admin Dashboard", owner: "Admin User", phone: "015-000-000", role: "Admin", tier: "N/A", status: "Active", joined: "Jan 01, 2025" },
];

export default function VendorDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<any>(null); // For verification modal
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Vendor Directory</h1>
          <p className="text-slate-500 mt-1">Manage vendor accounts, approve new registrations, and view performance.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          Export Directory
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search stall, owner, or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select className="px-3 py-2 border border-slate-200 text-sm rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white">
            <option>All Roles</option>
            <option>Vendor</option>
            <option>Admin</option>
          </select>
          <select className="px-3 py-2 border border-slate-200 text-sm rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white">
            <option>All Tiers</option>
            <option>Starter</option>
            <option>Smart (Pro)</option>
            <option>AI Assistant (Premium)</option>
          </select>
          <select className="px-3 py-2 border border-slate-200 text-sm rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Suspended</option>
          </select>
          <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Vendor Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-4">Stall / Owner</th>
                <th className="px-6 py-4">Role/Tier</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{vendor.name}</div>
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
                      <button className="p-1 hover:text-blue-600 transition-colors" title="View Details">
                        <Eye className="h-5 w-5" />
                      </button>
                      {vendor.status === 'Pending' ? (
                        <button className="p-1 hover:text-emerald-600 transition-colors" title="Approve">
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                      ) : (
                        <button className="p-1 hover:text-red-600 transition-colors" title="Suspend">
                          <ShieldAlert className="h-5 w-5" />
                        </button>
                      )}
                      <button className="p-1 hover:text-slate-900 transition-colors flex items-center">
                        <MoreVertical className="h-5 w-5" />
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
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            {/* Image Preview Area */}
            <div className="bg-slate-100 w-full md:w-1/2 p-6 flex flex-col items-center justify-center border-r border-slate-200">
              <div className="w-full aspect-video bg-slate-300 rounded-lg flex items-center justify-center mb-4 overflow-hidden border border-slate-400">
                 <MapPin className="h-10 w-10 text-slate-500" />
                 <span className="ml-2 font-medium text-slate-600">Storefront Photo</span>
              </div>
              <div className="w-full aspect-[1.58] bg-slate-300 rounded-lg flex items-center justify-center overflow-hidden border border-slate-400">
                 <span className="font-medium text-slate-600">Local ID Photo</span>
              </div>
            </div>
            {/* Validation Tools */}
            <div className="w-full md:w-1/2 p-6 flex flex-col bg-white">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Document Verification</h3>
                  <p className="text-sm text-slate-500">{selectedDocs.name} ({selectedDocs.owner})</p>
                </div>
                <button onClick={() => setSelectedDocs(null)} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-sm font-semibold text-amber-800 break-words mb-1">Warning</p>
                  <p className="text-xs text-amber-700">Please match the stall name and physical location with the provided photos to prevent fraudulent/duplicate entries.</p>
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
