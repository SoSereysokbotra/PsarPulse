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
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

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
  const { language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

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
    <div className={`space-y-6 font-sans pb-10 ${isKhmer ? "font-suwannaphum" : ""} ${isDark ? "text-slate-100" : "text-slate-900"}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            {isKhmer ? "សំណើសុំចុះឈ្មោះអាជីវករ" : "Vendor Requests"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isKhmer ? "ពិនិត្យ និងអនុម័តការចុះឈ្មោះអាជីវករថ្មីសម្រាប់គម្រោងឥតគិតថ្លៃ។" : "Review and approve new Free Plan vendor registrations."}
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className={`p-2 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200/60"}`}>
        <div className="relative w-full md:max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={isKhmer ? "ស្វែងរកសំណើដែលកំពុងរង់ចាំ..." : "Search pending requests..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-emerald-500/20 ${
              isDark ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500" : "bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400"
            }`}
          />
        </div>
        
        <div className="flex items-center gap-2 px-3">
          <span className="text-sm font-medium text-slate-500">
            <span className="text-emerald-500 font-bold">{requests.length}</span> {isKhmer ? "កំពុងរង់ចាំ" : "Pending"}
          </span>
        </div>
      </div>

      {/* Requests List */}
      <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}>
        {filteredRequests.length > 0 ? (
          <div className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-100"}`}>
            {filteredRequests.map((req) => (
              <div key={req.id} className={`p-5 transition-colors flex flex-col md:flex-row gap-6 justify-between items-start md:items-center ${isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"}`}>
                
                {/* Info Section */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                        <Store className="h-4 w-4 text-emerald-500" />
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
                      <Mail className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                      <span className="text-slate-500 truncate">{req.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                      <span className="text-slate-500 truncate">{req.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 md:col-span-2">
                      <MapPin className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                      <span className="text-slate-500">{req.businessAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className={`flex flex-row md:flex-col lg:flex-row gap-2 w-full md:w-auto shrink-0 border-t pt-4 md:border-t-0 md:pt-0 ${isDark ? "border-white/5" : "border-slate-100"}`}>
                  <button 
                    onClick={() => openModal(req, "approve")}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      isDark ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {isKhmer ? "អនុម័ត" : "Approve"}
                  </button>
                  <button 
                    onClick={() => openModal(req, "reject")}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      isDark ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20" : "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                    }`}
                  >
                    <XCircle className="h-4 w-4" />
                    {isKhmer ? "បដិសេធ" : "Reject"}
                  </button>
                  <button 
                    onClick={() => setSelectedRequest({...req, viewOnly: true})}
                    className={`flex-none flex items-center justify-center p-2 rounded-lg transition-colors border ${
                      isDark ? "bg-white/5 text-slate-400 hover:bg-white/10 border-white/10" : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200"
                    }`}
                    title={isKhmer ? "មើលព័ត៌មានលម្អិត" : "View Details"}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <Store className="h-12 w-12 mx-auto text-slate-600 mb-3" />
            <p className={`text-lg font-medium ${isDark ? "text-slate-300" : "text-slate-900"}`}>{isKhmer ? "មិនមានសំណើដែលកំពុងរង់ចាំទេ" : "No pending requests"}</p>
            <p className="text-sm mt-1">{isKhmer ? "សូមពិនិត្យមើលឡើងវិញនៅពេលក្រោយសម្រាប់ការចុះឈ្មោះអាជីវករថ្មី។" : "Check back later for new vendor registrations."}</p>
          </div>
        )}
      </div>

      {/* Action / Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border animate-in zoom-in-95 duration-200 ${
            isDark ? "bg-[#0d1117] border-white/10" : "bg-white border-slate-200"
          }`}>
            {/* Modal Header */}
            <div className={`p-5 border-b flex items-center gap-3 ${
              selectedRequest.viewOnly ? (isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100') : 
              modalAction === 'approve' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
            }`}>
              {selectedRequest.viewOnly ? (
                <Eye className={`h-5 w-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
              ) : modalAction === 'approve' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <h2 className={`font-bold text-lg ${
                selectedRequest.viewOnly ? (isDark ? 'text-white' : 'text-slate-900') :
                modalAction === 'approve' ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {selectedRequest.viewOnly ? (isKhmer ? 'ព័ត៌មានលម្អិតអំពីអាជីវករ' : 'Vendor Details') : 
                 modalAction === 'approve' ? (isKhmer ? 'អនុម័តការចុះឈ្មោះ' : 'Approve Registration') : (isKhmer ? 'បដិសេធការចុះឈ្មោះ' : 'Reject Registration')}
              </h2>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {!selectedRequest.viewOnly && (
                <p className="text-sm text-slate-500 mb-4">
                  {modalAction === 'approve' 
                    ? (isKhmer ? "សូមពិនិត្យព័ត៌មានលម្អិតរបស់អាជីវករឱ្យបានហ្មត់ចត់មុននឹងអនុម័ត។ វានឹងបង្កើតតំណភ្ជាប់សម្រាប់ចូលប្រព័ន្ធ ហើយផ្ញើវាទៅកាន់អ៊ីមែល។" : "Carefully review the vendor details before approving. This will generate a login link and send it via email.")
                    : (isKhmer ? "តើអ្នកប្រាកដថាចង់បដិសេធសំណើសុំរបស់អាជីវករនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយវិញបានទេ។" : "Are you sure you want to reject this vendor application? This action cannot be undone.")}
                </p>
              )}

              <div className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"} space-y-3`}>
                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                  <span className="text-slate-500 font-medium">{isKhmer ? "ហាង:" : "Store:"}</span>
                  <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{selectedRequest.storeName}</span>
                  
                  <span className="text-slate-500 font-medium">{isKhmer ? "ម្ចាស់:" : "Owner:"}</span>
                  <span className={isDark ? "text-slate-300" : "text-slate-800"}>{selectedRequest.fullName}</span>
                  
                  <span className="text-slate-500 font-medium">{isKhmer ? "អ៊ីមែល:" : "Email:"}</span>
                  <span className={isDark ? "text-slate-300" : "text-slate-800"}>{selectedRequest.email}</span>
                  
                  <span className="text-slate-500 font-medium">{isKhmer ? "ទូរស័ព្ទ:" : "Phone:"}</span>
                  <span className={isDark ? "text-slate-300" : "text-slate-800"}>{selectedRequest.phone}</span>
                  
                  <span className="text-slate-500 font-medium">{isKhmer ? "ទីតាំង:" : "Location:"}</span>
                  <span className={isDark ? "text-slate-300" : "text-slate-800"}>{selectedRequest.businessAddress}</span>
                  
                  <span className="text-slate-500 font-medium">{isKhmer ? "ការពិពណ៌នា:" : "Description:"}</span>
                  <span className={`italic ${isDark ? "text-slate-400" : "text-slate-800"}`}>"{selectedRequest.description}"</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex justify-end gap-3 ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
              <button 
                onClick={() => {
                  setSelectedRequest(null);
                  setModalAction(null);
                }}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border border-transparent disabled:opacity-50 ${
                  isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                {selectedRequest.viewOnly ? (isKhmer ? "បិទ" : "Close") : (isKhmer ? "បោះបង់" : "Cancel")}
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
                  ) : modalAction === 'approve' ? (isKhmer ? "បញ្ជាក់ការអនុម័ត" : "Confirm Approval") : (isKhmer ? "បញ្ជាក់ការបដិសេធ" : "Confirm Reject")}
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
