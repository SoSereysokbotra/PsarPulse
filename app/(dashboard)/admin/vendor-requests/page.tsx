"use client";

import { useState } from "react";
import { 
  Search, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Store,
  Eye,
  Calendar,
  Phone,
  Mail,
  FileText,
  AlertCircle
} from "lucide-react";

// Mock data for pending vendor requests
const mockRequests = [
  {
    id: "req_001",
    fullName: "Sokha Meas",
    email: "sokha.meas@example.com",
    phone: "012 345 678",
    storeName: "Sokha Fresh Veggies",
    businessAddress: "Stall #12, Zone B, Central Market",
    description: "Selling organic and locally sourced fresh vegetables daily.",
    status: "pending",
    date: "Oct 16, 2025"
  },
  {
    id: "req_002",
    fullName: "Rithy Chea",
    email: "rithy.electronics@gmail.com",
    phone: "098 765 432",
    storeName: "Rithy Tech Hub",
    businessAddress: "Stall #45, Tech Zone, Night Market",
    description: "Mobile phone accessories, chargers, and small electronics repairs.",
    status: "pending",
    date: "Oct 15, 2025"
  },
  {
    id: "req_003",
    fullName: "Vanna Nhem",
    email: "vanna.clothing@yahoo.com",
    phone: "077 111 222",
    storeName: "Vanna Style",
    businessAddress: "Stall #88, Fashion Row, Boeung Keng Kang Market",
    description: "Women's traditional and modern clothing boutique.",
    status: "pending",
    date: "Oct 14, 2025"
  }
];

export default function VendorRequestsPage() {
  const [requests, setRequests] = useState(mockRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredRequests = requests.filter(req => 
    req.storeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = async () => {
    if (!selectedRequest || !modalAction) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Remove the processed request from the list
    setRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
    
    setIsLoading(false);
    setSelectedRequest(null);
    setModalAction(null);
  };

  const openModal = (request: any, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setModalAction(action);
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Vendor Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and approve new Free Plan vendor registrations.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-2 rounded-xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search pending requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 px-3">
          <span className="text-sm font-medium text-slate-600">
            <span className="text-emerald-600 font-bold">{requests.length}</span> Pending
          </span>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredRequests.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredRequests.map((req) => (
              <div key={req.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                
                {/* Info Section */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Store className="h-4 w-4 text-emerald-600" />
                        {req.storeName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-slate-400" /> {req.fullName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" /> {req.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-slate-600 truncate">{req.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-slate-600 truncate">{req.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 md:col-span-2">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-slate-600">{req.businessAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex flex-row md:flex-col lg:flex-row gap-2 w-full md:w-auto shrink-0 border-t border-slate-100 pt-4 md:border-t-0 md:pt-0">
                  <button 
                    onClick={() => openModal(req, "approve")}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </button>
                  <button 
                    onClick={() => openModal(req, "reject")}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                  <button 
                    onClick={() => setSelectedRequest({...req, viewOnly: true})}
                    className="flex-none flex items-center justify-center p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <Store className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <p className="text-lg font-medium text-slate-900">No pending requests</p>
            <p className="text-sm mt-1">Check back later for new vendor registrations.</p>
          </div>
        )}
      </div>

      {/* Action / Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className={`p-5 border-b flex items-center gap-3 ${
              selectedRequest.viewOnly ? 'bg-slate-50 mb-0' : 
              modalAction === 'approve' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
            }`}>
              {selectedRequest.viewOnly ? (
                <Eye className="h-5 w-5 text-slate-600" />
              ) : modalAction === 'approve' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <h2 className={`font-bold text-lg ${
                selectedRequest.viewOnly ? 'text-slate-900' :
                modalAction === 'approve' ? 'text-emerald-900' : 'text-red-900'
              }`}>
                {selectedRequest.viewOnly ? 'Vendor Details' : 
                 modalAction === 'approve' ? 'Approve Registration' : 'Reject Registration'}
              </h2>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {!selectedRequest.viewOnly && (
                <p className="text-sm text-slate-600 mb-4">
                  {modalAction === 'approve' 
                    ? "Carefully review the vendor details before approving. This will generate a login link and send it via email." 
                    : "Are you sure you want to reject this vendor application? This action cannot be undone."}
                </p>
              )}

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                  <span className="text-slate-500 font-medium">Store:</span>
                  <span className="font-semibold text-slate-900">{selectedRequest.storeName}</span>
                  
                  <span className="text-slate-500 font-medium">Owner:</span>
                  <span className="text-slate-800">{selectedRequest.fullName}</span>
                  
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="text-slate-800">{selectedRequest.email}</span>
                  
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <span className="text-slate-800">{selectedRequest.phone}</span>
                  
                  <span className="text-slate-500 font-medium">Location:</span>
                  <span className="text-slate-800">{selectedRequest.businessAddress}</span>
                  
                  <span className="text-slate-500 font-medium">Description:</span>
                  <span className="text-slate-800 italic">"{selectedRequest.description}"</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setSelectedRequest(null);
                  setModalAction(null);
                }}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors border border-transparent disabled:opacity-50"
              >
                {selectedRequest.viewOnly ? 'Close' : 'Cancel'}
              </button>
              
              {!selectedRequest.viewOnly && (
                <button 
                  onClick={handleAction}
                  disabled={isLoading}
                  className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors shadow-sm flex items-center justify-center min-w-[120px] disabled:opacity-70 disabled:cursor-not-allowed
                    ${modalAction === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : modalAction === 'approve' ? 'Confirm Approval' : 'Confirm Reject'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Ensure the User icon is exported from lucide-react if not already
function User(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
