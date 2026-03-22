"use client";

import { useState } from "react";
import {
  CreditCard,
  Search,
  Filter,
  Download,
  FileText,
  AlertCircle,
  Banknote,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Receipt,
  ArrowRightLeft,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/providers/ThemeProvider";

// --- Types ---
interface Transaction {
  id: string;
  gatewayId: string;
  date: string;
  vendor: string;
  vendorId: string;
  amount: number;
  currency: "USD" | "KHR";
  method: string;
  type: string;
  status: "Success" | "Failed" | "Timeout" | "Pending";
  error?: string;
}

// --- Mock Data ---
const transactions: Transaction[] = [
  {
    id: "TXN-98213",
    gatewayId: "aba_982b13x",
    date: "Oct 15, 2025 14:30:12",
    vendor: "Sokha's Grill",
    vendorId: "1",
    amount: 15.0,
    currency: "USD",
    method: "ABA PAY",
    type: "Renewal",
    status: "Success",
  },
  {
    id: "TXN-98214",
    gatewayId: "bkg_76asdf2",
    date: "Oct 15, 2025 13:15:00",
    vendor: "Nita Clothing",
    vendorId: "2",
    amount: 28000,
    currency: "KHR",
    method: "KHQR (Bakong)",
    type: "New Subscription",
    status: "Success",
  },
  {
    id: "TXN-98215",
    gatewayId: "aba_11czx1",
    date: "Oct 15, 2025 11:45:22",
    vendor: "Tech Accessories",
    vendorId: "3",
    amount: 25.0,
    currency: "USD",
    method: "ABA PAY",
    type: "Upgrade",
    status: "Failed",
    error: "04: Insufficient Funds",
  },
  {
    id: "TXN-98216",
    gatewayId: "bkg_0012xc2",
    date: "Oct 14, 2025 19:20:05",
    vendor: "Bopha Smoothies",
    vendorId: "4",
    amount: 15.0,
    currency: "USD",
    method: "KHQR (Bakong)",
    type: "Renewal",
    status: "Timeout",
    error: "QR Expired (No scan detected within 3 mins)",
  },
  {
    id: "TXN-98217",
    gatewayId: "cash_txn_1",
    date: "Oct 14, 2025 16:00:00",
    vendor: "Rotha Seafood",
    vendorId: "5",
    amount: 60000,
    currency: "KHR",
    method: "Cash (Manual)",
    type: "Renewal",
    status: "Success",
  },
  {
    id: "TXN-98218",
    gatewayId: "vis_88x912",
    date: "Oct 14, 2025 09:12:00",
    vendor: "Phnom Penh Electronics",
    vendorId: "6",
    amount: 25.0,
    currency: "USD",
    method: "Visa/Mastercard",
    type: "New Subscription",
    status: "Success",
  },
  {
    id: "TXN-98219",
    gatewayId: "wch_99120z",
    date: "Oct 13, 2025 18:45:11",
    vendor: "Lucky Mart Accessories",
    vendorId: "7",
    amount: 15.0,
    currency: "USD",
    method: "WeChat Pay",
    type: "Renewal",
    status: "Pending",
  },
];

// --- Helper Functions ---
const formatCurrency = (amount: number, currency: string) => {
  if (currency === "KHR") {
    return new Intl.NumberFormat("en-KH", {
      style: "currency",
      currency: "KHR",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function BillingPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [showCashModal, setShowCashModal] = useState(false);

  const getStatusBadge = (status: Transaction["status"]) => {
    const styles = {
      Success: isDark
        ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
        : "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      Failed: isDark
        ? "bg-red-500/10 text-red-400 ring-red-500/20"
        : "bg-red-50 text-red-700 ring-red-600/10",
      Timeout: isDark
        ? "bg-amber-500/10 text-amber-400 ring-amber-500/20"
        : "bg-amber-50 text-amber-700 ring-amber-600/20",
      Pending: isDark
        ? "bg-blue-500/10 text-blue-400 ring-blue-500/20"
        : "bg-blue-50 text-blue-700 ring-blue-600/20",
    };

    const icons = {
      Success: <CheckCircle2 className="h-3.5 w-3.5" />,
      Failed: <XCircle className="h-3.5 w-3.5" />,
      Timeout: <Clock className="h-3.5 w-3.5" />,
      Pending: <RotateCcw className="h-3.5 w-3.5 animate-spin-slow" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ring-1 ring-inset transition-colors ${styles[status]}`}
      >
        {icons[status]}
        {status}
      </span>
    );
  };

  return (
    <div
      className={`space-y-8 font-sans transition-colors duration-200 ${isDark ? "text-slate-100" : "text-slate-900"}`}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Financial Management
          </h1>
          <p className="text-sm text-slate-500 mt-1 transition-colors">
            Monitor revenue, track subscriptions, and debug gateway logs.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 border ${
              isDark
                ? "bg-[#161b22] border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowCashModal(true)}
            className={`flex-1 sm:flex-none text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 ${
              isDark
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            <Banknote className="h-4 w-4" />
            Log Manual Cash
          </button>
        </div>
      </div>

      {/* KPIs / Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <div
          className={`p-5 rounded-xl border shadow-sm flex items-start gap-4 transition-colors ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200/60"}`}
        >
          <div
            className={`p-3 rounded-lg ring-1 transition-colors ${isDark ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" : "bg-emerald-50 text-emerald-600 ring-emerald-100"}`}
          >
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1 transition-colors">
              Successful Collections (Today)
            </p>
            <div className="flex items-baseline gap-2">
              <p
                className={`text-2xl font-bold transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
              >
                $450.00
              </p>
              <p
                className={`text-sm font-medium border-l pl-2 transition-colors ${isDark ? "text-slate-400 border-white/10" : "text-slate-500 border-slate-300"}`}
              >
                1.8M KHR
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-5 rounded-xl border shadow-sm flex items-start gap-4 transition-colors ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200/60"}`}
        >
          <div
            className={`p-3 rounded-lg ring-1 transition-colors ${isDark ? "bg-red-500/10 text-red-400 ring-red-500/20" : "bg-red-50 text-red-600 ring-red-100"}`}
          >
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1 transition-colors">
              Failed / Declined (Today)
            </p>
            <div className="flex items-baseline gap-2">
              <p
                className={`text-2xl font-bold transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
              >
                3
              </p>
              <p className="text-sm font-medium text-slate-500 transition-colors">
                Transactions
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-5 rounded-xl border shadow-sm flex items-start gap-4 transition-colors ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200/60"}`}
        >
          <div
            className={`p-3 rounded-lg ring-1 transition-colors ${isDark ? "bg-indigo-500/10 text-indigo-400 ring-indigo-500/20" : "bg-indigo-50 text-indigo-600 ring-indigo-100"}`}
          >
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1 transition-colors">
              Total Pro/Premium Revenue
            </p>
            <div className="flex items-baseline gap-2">
              <p
                className={`text-2xl font-bold transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
              >
                $14,500
              </p>
              <p className="text-sm font-medium text-slate-500 transition-colors">
                YTD
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Ledger Area */}
      <div
        className={`rounded-xl border shadow-sm flex flex-col transition-colors ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200/60"}`}
      >
        {/* Filters Bar */}
        <div
          className={`p-4 border-b flex flex-col lg:flex-row gap-4 justify-between items-center rounded-t-xl transition-colors ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50/50 border-slate-200/60"}`}
        >
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search TXN ID, gateway ID, or vendor..."
              className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm ${
                isDark
                  ? "bg-[#161b22] border-white/10 text-white placeholder:text-slate-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
              }`}
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <button
              className={`px-3 py-2 border rounded-lg text-sm flex items-center gap-2 shadow-sm transition-colors ${
                isDark
                  ? "bg-[#161b22] border-white/10 text-slate-300 hover:bg-white/5"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Calendar className="h-4 w-4 text-slate-500" />
              This Month
            </button>
            <select
              className={`px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-colors ${
                isDark
                  ? "bg-[#161b22] border-white/10 text-slate-300"
                  : "bg-white border-slate-200 text-slate-600 focus:ring-emerald-500/20 focus:border-emerald-500"
              }`}
            >
              <option>All Gateways</option>
              <option>ABA PAY</option>
              <option>KHQR (Bakong)</option>
              <option>WeChat / Alipay</option>
              <option>Manual Cash</option>
            </select>
            <select
              className={`px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-colors ${
                isDark
                  ? "bg-[#161b22] border-white/10 text-slate-300"
                  : "bg-white border-slate-200 text-slate-600 focus:ring-emerald-500/20 focus:border-emerald-500"
              }`}
            >
              <option>All Statuses</option>
              <option>Success</option>
              <option>Failed</option>
              <option>Timeout</option>
              <option>Pending</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr
                className={`border-b text-xs uppercase tracking-wider font-semibold transition-colors ${
                  isDark
                    ? "bg-white/5 border-white/10 text-slate-400"
                    : "bg-white border-slate-200/60 text-slate-500"
                }`}
              >
                <th className="px-6 py-4">Transaction Details</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Gateway</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody
              className={`divide-y transition-colors ${isDark ? "divide-white/10 bg-[#161b22]" : "divide-slate-100 bg-white"}`}
            >
              {transactions.map((txn) => (
                <tr
                  key={txn.id}
                  onClick={() => setSelectedTxn(txn)}
                  className={`cursor-pointer group transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50/80"}`}
                >
                  <td className="px-6 py-4">
                    <div
                      className={`font-medium ${isDark ? "text-slate-200" : "text-slate-900"}`}
                    >
                      {txn.id}
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {txn.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`font-medium transition-colors ${isDark ? "text-slate-200 group-hover:text-indigo-400" : "text-slate-900 group-hover:text-indigo-600"}`}
                    >
                      {txn.vendor}
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {txn.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div
                      className={`font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}
                    >
                      {formatCurrency(txn.amount, txn.currency)}
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                    >
                      {txn.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
                    >
                      {txn.method.includes("ABA") && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                      {txn.method.includes("KHQR") && (
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      )}
                      {txn.method.includes("Cash") && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                      {txn.method.includes("Visa") && (
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                      )}
                      {txn.method.includes("WeChat") && (
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      )}
                      {txn.method}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(txn.status)}</td>
                  <td
                    className={`px-6 py-4 text-right transition-colors ${isDark ? "text-slate-500 group-hover:text-slate-300" : "text-slate-400 group-hover:text-slate-600"}`}
                  >
                    <ChevronRight className="h-4 w-4 inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className={`p-4 border-t rounded-b-xl flex items-center justify-between text-sm transition-colors ${
            isDark
              ? "bg-[#161b22] border-white/10 text-slate-400"
              : "bg-white border-slate-200/60 text-slate-500"
          }`}
        >
          <div>
            Showing{" "}
            <span
              className={`font-medium ${isDark ? "text-slate-200" : "text-slate-900"}`}
            >
              1
            </span>{" "}
            to{" "}
            <span
              className={`font-medium ${isDark ? "text-slate-200" : "text-slate-900"}`}
            >
              7
            </span>{" "}
            of{" "}
            <span
              className={`font-medium ${isDark ? "text-slate-200" : "text-slate-900"}`}
            >
              124
            </span>{" "}
            results
          </div>
          <div className="flex gap-1">
            <button
              className={`p-1 border border-transparent rounded transition-colors disabled:opacity-50 ${isDark ? "hover:bg-white/5" : "hover:bg-slate-100"}`}
              disabled
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className={`p-1 border border-transparent rounded transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-slate-100"}`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Overlay Drawer for Details */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 backdrop-blur-sm transition-opacity ${isDark ? "bg-slate-900/60" : "bg-slate-900/20"}`}
            onClick={() => setSelectedTxn(null)}
          />

          {/* Drawer */}
          <div
            className={`relative w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300 border-l transition-colors ${
              isDark
                ? "bg-[#161b22] border-white/10"
                : "bg-white border-slate-200"
            }`}
          >
            <div
              className={`px-6 py-5 border-b flex justify-between items-center transition-colors ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-100"}`}
            >
              <h3
                className={`font-semibold flex items-center gap-2 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
              >
                <Receipt className="h-5 w-5 text-slate-500" />
                Transaction Receipt
              </h3>
              <button
                onClick={() => setSelectedTxn(null)}
                className={`p-1.5 rounded-md transition-colors ${isDark ? "text-slate-500 hover:text-slate-300 hover:bg-white/10" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Grand Total Area */}
              <div
                className={`text-center p-6 rounded-xl border transition-colors ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"}`}
              >
                <p
                  className={`text-xs uppercase tracking-wider mb-2 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Total Amount
                </p>
                <p
                  className={`text-4xl font-bold tracking-tight transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {formatCurrency(selectedTxn.amount, selectedTxn.currency)}
                </p>
                <div className="mt-4 flex justify-center">
                  {getStatusBadge(selectedTxn.status)}
                </div>
              </div>

              {/* Data Grid */}
              <div className="space-y-4">
                <h4
                  className={`text-sm font-semibold border-b pb-2 transition-colors ${isDark ? "text-white border-white/10" : "text-slate-900 border-slate-100"}`}
                >
                  Primary Details
                </h4>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <span
                      className={`block mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Internal TXN ID
                    </span>
                    <span
                      className={`font-mono ${isDark ? "text-slate-200" : "text-slate-900"}`}
                    >
                      {selectedTxn.id}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`block mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Gateway Ref ID
                    </span>
                    <span
                      className={`font-mono ${isDark ? "text-slate-200" : "text-slate-900"}`}
                    >
                      {selectedTxn.gatewayId}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`block mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Date & Time
                    </span>
                    <span
                      className={`${isDark ? "text-slate-200" : "text-slate-900"}`}
                    >
                      {selectedTxn.date}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`block mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Payment Method
                    </span>
                    <span
                      className={`${isDark ? "text-slate-200" : "text-slate-900"}`}
                    >
                      {selectedTxn.method}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`block mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Vendor Account
                    </span>
                    <Link
                      href={`/admin/vendors/${selectedTxn.vendorId}`}
                      className={`font-medium hover:underline transition-colors ${isDark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}
                    >
                      {selectedTxn.vendor}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Error Logging */}
              {selectedTxn.error && (
                <div
                  className={`p-4 border rounded-xl space-y-3 transition-colors ${isDark ? "bg-red-500/10 border-red-500/20" : "bg-red-50 border-red-100"}`}
                >
                  <p
                    className={`text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide ${isDark ? "text-red-400" : "text-red-800"}`}
                  >
                    <AlertCircle className="h-4 w-4" />
                    Gateway Raw Response
                  </p>
                  <div
                    className={`p-3 rounded-lg border shadow-sm overflow-x-auto transition-colors ${isDark ? "bg-[#161b22] border-red-500/20" : "bg-white border-red-100"}`}
                  >
                    <code
                      className={`text-sm whitespace-pre-wrap font-mono ${isDark ? "text-red-400" : "text-red-600"}`}
                    >
                      {`{\n  "status": "failed",\n  "code": "${selectedTxn.error.split(":")[0] || "ERR"}",\n  "message": "${selectedTxn.error.split(":")[1]?.trim() || selectedTxn.error}"\n}`}
                    </code>
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${isDark ? "text-red-300" : "text-red-700"}`}
                  >
                    <span className="font-semibold">Support Action:</span> Do
                    not issue subscription features. Instruct vendor to check
                    their mobile banking balance or utilize an alternative
                    payment method.
                  </p>
                </div>
              )}
            </div>

            {/* Action Footer */}
            <div
              className={`p-6 border-t space-y-3 transition-colors ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50/50 border-slate-100"}`}
            >
              <button
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 border rounded-lg text-sm font-medium transition-all shadow-sm ${
                  isDark
                    ? "bg-[#161b22] border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
                onClick={() => alert("Mock: Syncing with Gateway API...")}
              >
                <ArrowRightLeft className="h-4 w-4" />
                Re-sync Status with Gateway
              </button>

              {selectedTxn.status === "Success" &&
                !selectedTxn.method.includes("Cash") && (
                  <button
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 border rounded-lg text-sm font-medium transition-all shadow-sm ${
                      isDark
                        ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30"
                        : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
                    }`}
                  >
                    Initiate Gateway Refund
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Cash Override Modal */}
      {showCashModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className={`absolute inset-0 backdrop-blur-sm transition-opacity ${isDark ? "bg-slate-900/80" : "bg-slate-900/40"}`}
            onClick={() => setShowCashModal(false)}
          />
          <div
            className={`rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200 border transition-colors ${
              isDark
                ? "bg-[#161b22] border-white/10"
                : "bg-white border-transparent"
            }`}
          >
            <div
              className={`px-6 py-5 border-b transition-colors ${isDark ? "border-white/10" : "border-slate-100"}`}
            >
              <div className="flex justify-between items-center mb-1">
                <h3
                  className={`font-semibold text-lg flex items-center gap-2 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  <div
                    className={`p-1.5 rounded-md transition-colors ${isDark ? "bg-emerald-500/20" : "bg-emerald-100"}`}
                  >
                    <Banknote
                      className={`h-5 w-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                    />
                  </div>
                  Manual Cash Override
                </h3>
                <button
                  onClick={() => setShowCashModal(false)}
                  className={`p-1 rounded-md transition-colors ${isDark ? "text-slate-500 hover:text-slate-300 hover:bg-white/5" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <p
                className={`text-sm mt-2 transition-colors ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                Log physical cash received and force a subscription upgrade for
                the vendor.
              </p>
            </div>

            <form className="p-6 space-y-5">
              <div>
                <label
                  className={`block text-sm font-medium mb-1.5 transition-colors ${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  Vendor ID / Stall Name
                </label>
                <input
                  type="text"
                  placeholder="Search vendor database..."
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 transition-all ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:ring-emerald-500/50"
                      : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-emerald-500/20 focus:border-emerald-500"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 transition-colors ${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    Amount Collected
                  </label>
                  <input
                    type="number"
                    placeholder="28000"
                    className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 transition-all ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white focus:ring-emerald-500/50"
                        : "bg-white border-slate-300 text-slate-900 focus:ring-emerald-500/20 focus:border-emerald-500"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 transition-colors ${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    Currency
                  </label>
                  <select
                    className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 transition-all ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white focus:ring-emerald-500/50"
                        : "bg-white border-slate-300 text-slate-900 focus:ring-emerald-500/20 focus:border-emerald-500"
                    }`}
                  >
                    <option>KHR (Riel)</option>
                    <option>USD ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1.5 transition-colors ${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  Apply Subscription Tier
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 transition-all ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white focus:ring-emerald-500/50"
                      : "bg-white border-slate-300 text-slate-900 focus:ring-emerald-500/20 focus:border-emerald-500"
                  }`}
                >
                  <option>1 Month Pro ($15 / 60,000 KHR)</option>
                  <option>1 Month Premium ($25 / 100,000 KHR)</option>
                  <option>Custom Duration Override</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1.5 transition-colors ${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  Admin Notes & Receipt Ref
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Physical receipt #1244 given by Admin Sok..."
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 transition-all resize-none ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:ring-emerald-500/50"
                      : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-emerald-500/20 focus:border-emerald-500"
                  }`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowCashModal(false)}
                  className={`w-full text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm ${
                    isDark
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  Confirm Payment & Upgrade Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
