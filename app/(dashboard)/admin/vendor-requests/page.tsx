"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  CheckCircle2,
  XCircle,
  Store,
  Eye,
  Calendar,
  Mail,
  FileText,
  AlertCircle,
  RefreshCw,
  UserIcon,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

type VendorRequest = {
  id: string;
  userId: string;
  fullName: string | null;
  businessName: string;
  businessEmail: string;
  businessPhone: string | null;
  businessAddress: string | null;
  businessDescription: string | null;
  businessCategory: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reasonForRejection: string | null;
};

export default function VendorRequestsPage() {
  const { language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

  const [requests, setRequests] = useState<VendorRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<VendorRequest | null>(
    null,
  );
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(
    null,
  );
  const [viewOnly, setViewOnly] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchRequests = async () => {
    setIsFetching(true);
    try {
      const res = await fetch("/api/admin/vendor-requests", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch vendor requests", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(
    (req) =>
      req.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.businessEmail.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAction = async () => {
    if (!selectedRequest || !modalAction) return;

    setIsLoading(true);
    setFeedback(null);
    try {
      const res = await fetch(
        `/api/admin/vendor-requests/${selectedRequest.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: modalAction === "approve" ? "approved" : "rejected",
            reason: modalAction === "reject" ? rejectionReason : undefined,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
        setFeedback({
          type: "success",
          message:
            modalAction === "approve"
              ? isKhmer
                ? "អ្នកអាជីវករត្រូវបានអនុម័ត ហើយអ៊ីមែលត្រូវបានផ្ញើ។"
                : "Vendor approved! Activation email sent."
              : isKhmer
                ? "សំណើត្រូវបានបដិសេធ ហើយអ៊ីមែលត្រូវបានផ្ញើ។"
                : "Request rejected. Notification email sent.",
        });
        closeModal();
      } else {
        setFeedback({ type: "error", message: data.message || "An error occurred." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (request: VendorRequest, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setModalAction(action);
    setViewOnly(false);
    setRejectionReason("");
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setModalAction(null);
    setViewOnly(false);
    setRejectionReason("");
  };

  return (
    <div
      className={`space-y-6 font-sans pb-10 ${isKhmer ? "font-suwannaphum" : ""} ${isDark ? "text-slate-100" : "text-slate-900"}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {isKhmer ? "សំណើសុំចុះឈ្មោះអាជីវករ" : "Vendor Requests"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isKhmer
              ? "ពិនិត្យ និងអនុម័តការចុះឈ្មោះអាជីវករថ្មី។"
              : "Review and approve new vendor registrations. An email is sent automatically on approval or rejection."}
          </p>
        </div>
        <button
          onClick={fetchRequests}
          disabled={isFetching}
          className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors ${isDark ? "border-white/10 hover:bg-white/5 text-slate-400" : "border-slate-200 hover:bg-slate-50 text-slate-600"}`}
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          {isKhmer ? "ផ្ទុកឡើងវិញ" : "Refresh"}
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium ${feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
              : "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
            }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Search Bar */}
      <div
        className={`p-2 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200/60"}`}
      >
        <div className="relative w-full md:max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              isKhmer
                ? "ស្វែងរកសំណើដែលកំពុងរង់ចាំ..."
                : "Search pending requests..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-emerald-500/20 ${isDark
                ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                : "bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400"
              }`}
          />
        </div>
        <div className="flex items-center gap-2 px-3">
          <span className="text-sm font-medium text-slate-500">
            <span className="text-emerald-500 font-bold">{requests.length}</span>{" "}
            {isKhmer ? "កំពុងរង់ចាំ" : "Pending"}
          </span>
        </div>
      </div>

      {/* Requests List */}
      <div
        className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}
      >
        {isFetching ? (
          <div className="p-12 text-center">
            <RefreshCw className="h-8 w-8 mx-auto text-slate-400 animate-spin mb-3" />
            <p className="text-slate-500 text-sm">
              {isKhmer ? "កំពុងផ្ទុក..." : "Loading requests…"}
            </p>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div
            className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-100"}`}
          >
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className={`p-5 transition-colors flex flex-col md:flex-row gap-6 justify-between items-start md:items-center ${isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"}`}
              >
                {/* Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3
                      className={`text-base font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      <Store className="h-4 w-4 text-emerald-500" />
                      {req.businessName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                      {req.businessCategory && (
                        <span className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" />
                          {req.businessCategory}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{req.businessEmail}</span>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className={`flex flex-row md:flex-col lg:flex-row gap-2 w-full md:w-auto shrink-0 border-t pt-4 md:border-t-0 md:pt-0 ${isDark ? "border-white/5" : "border-slate-100"}`}
                >
                  <button
                    onClick={() => openModal(req, "approve")}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${isDark
                        ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                      }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {isKhmer ? "អនុម័ត" : "Approve"}
                  </button>
                  <button
                    onClick={() => openModal(req, "reject")}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${isDark
                        ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
                        : "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                      }`}
                  >
                    <XCircle className="h-4 w-4" />
                    {isKhmer ? "បដិសេធ" : "Reject"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(req);
                      setViewOnly(true);
                    }}
                    className={`flex-none flex items-center justify-center p-2 rounded-lg transition-colors border ${isDark
                        ? "bg-white/5 text-slate-400 hover:bg-white/10 border-white/10"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200"
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
            <Store className="h-12 w-12 mx-auto text-slate-400 mb-3" />
            <p
              className={`text-lg font-medium ${isDark ? "text-slate-300" : "text-slate-900"}`}
            >
              {isKhmer ? "មិនមានសំណើដែលកំពុងរង់ចាំទេ" : "No pending requests"}
            </p>
            <p className="text-sm mt-1">
              {isKhmer
                ? "សូមពិនិត្យមើលឡើងវិញនៅពេលក្រោយ។"
                : "Check back later for new vendor registrations."}
            </p>
          </div>
        )}
      </div>

      {/* Action / Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border animate-in zoom-in-95 duration-200 ${isDark ? "bg-[#0d1117] border-white/10" : "bg-white border-slate-200"
              }`}
          >
            {/* Modal Header */}
            <div
              className={`p-5 border-b flex items-center gap-3 ${viewOnly
                  ? isDark
                    ? "bg-white/5 border-white/5"
                    : "bg-slate-50 border-slate-100"
                  : modalAction === "approve"
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
            >
              {viewOnly ? (
                <Eye
                  className={`h-5 w-5 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                />
              ) : modalAction === "approve" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <h2
                className={`font-bold text-lg ${viewOnly
                    ? isDark
                      ? "text-white"
                      : "text-slate-900"
                    : modalAction === "approve"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
              >
                {viewOnly
                  ? isKhmer
                    ? "ព័ត៌មានលម្អិតអំពីអាជីវករ"
                    : "Vendor Details"
                  : modalAction === "approve"
                    ? isKhmer
                      ? "អនុម័តការចុះឈ្មោះ"
                      : "Approve Registration"
                    : isKhmer
                      ? "បដិសេធការចុះឈ្មោះ"
                      : "Reject Registration"}
              </h2>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {!viewOnly && (
                <p className="text-sm text-slate-500">
                  {modalAction === "approve"
                    ? isKhmer
                      ? "ការអនុម័តនឹងបង្កើតតំណភ្ជាប់ ហើយផ្ញើវាទៅកាន់អ៊ីមែលរបស់អាជីវករ។"
                      : "Approving will generate a magic link and send it to the vendor's email."
                    : isKhmer
                      ? "ការបដិសេធនឹងផ្ញើអ៊ីមែលជូនដំណឹង។"
                      : "Rejecting will send a notification email to the vendor."}
                </p>
              )}

              {/* Request Details */}
              <div
                className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"} space-y-3`}
              >
                <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-3 text-sm">
                  <span className="text-slate-500 font-medium shrink-0">
                    {isKhmer ? "ឈ្មោះអ្នកលក់:" : "Full Name:"}
                  </span>
                  <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {selectedRequest.fullName || "N/A"}
                  </span>

                  <span className="text-slate-500 font-medium shrink-0">
                    {isKhmer ? "លេខទូរស័ព្ទ:" : "Phone:"}
                  </span>
                  <span className={isDark ? "text-slate-300" : "text-slate-800"}>
                    {selectedRequest.businessPhone || "N/A"}
                  </span>

                  <span className="text-slate-500 font-medium shrink-0">
                    {isKhmer ? "អ៊ីមែល:" : "Email:"}
                  </span>
                  <span className={isDark ? "text-slate-300" : "text-slate-800"}>
                    {selectedRequest.businessEmail}
                  </span>

                  <span className="text-slate-500 font-medium shrink-0">
                    {isKhmer ? "ឈ្មោះហាង:" : "Store Name:"}
                  </span>
                  <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {selectedRequest.businessName}
                  </span>

                  <span className="text-slate-500 font-medium shrink-0">
                    {isKhmer ? "អាសយដ្ឋាន:" : "Address:"}
                  </span>
                  <span className={isDark ? "text-slate-300" : "text-slate-800"}>
                    {selectedRequest.businessAddress || "N/A"}
                  </span>

                  <span className="text-slate-500 font-medium shrink-0">
                    {isKhmer ? "ការពិពណ៌នា:" : "Description:"}
                  </span>
                  <span className={`leading-relaxed ${isDark ? "text-slate-300" : "text-slate-800"}`}>
                    {selectedRequest.businessDescription || "N/A"}
                  </span>

                  <span className="text-slate-500 font-medium shrink-0 text-[11px] uppercase tracking-wider mt-1">
                    {isKhmer ? "ថ្ងៃដាក់:" : "Submitted:"}
                  </span>
                  <span className={`text-[11px] mt-1 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Rejection reason textarea */}
              {!viewOnly && modalAction === "reject" && (
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    {isKhmer
                      ? "មូលហេតុបដិសេធ (ស្រេចចិត្ត)"
                      : "Reason for rejection (optional)"}
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    placeholder={
                      isKhmer
                        ? "ពន្យល់ពីមូលហេតុ..."
                        : "Explain why the application was rejected…"
                    }
                    className={`w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none focus:ring-2 focus:ring-red-500/20 ${isDark
                        ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                        : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                      }`}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className={`p-4 border-t flex justify-end gap-3 ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}
            >
              <button
                onClick={closeModal}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border border-transparent disabled:opacity-50 ${isDark
                    ? "text-slate-400 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
              >
                {viewOnly
                  ? isKhmer
                    ? "បិទ"
                    : "Close"
                  : isKhmer
                    ? "បោះបង់"
                    : "Cancel"}
              </button>

              {!viewOnly && (
                <button
                  onClick={handleAction}
                  disabled={isLoading}
                  className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors shadow-sm flex items-center justify-center min-w-[130px] disabled:opacity-70 disabled:cursor-not-allowed ${modalAction === "approve"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                    }`}
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : modalAction === "approve" ? (
                    isKhmer ? "បញ្ជាក់ការអនុម័ត" : "Confirm Approval"
                  ) : isKhmer ? (
                    "បញ្ជាក់ការបដិសេធ"
                  ) : (
                    "Confirm Rejection"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
