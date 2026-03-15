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

const getStatusBadge = (status: Transaction["status"]) => {
  const styles = {
    Success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    Failed: "bg-red-50 text-red-700 ring-red-600/10",
    Timeout: "bg-amber-50 text-amber-700 ring-amber-600/20",
    Pending: "bg-blue-50 text-blue-700 ring-blue-600/20",
  };

  const icons = {
    Success: <CheckCircle2 className="h-3.5 w-3.5" />,
    Failed: <XCircle className="h-3.5 w-3.5" />,
    Timeout: <Clock className="h-3.5 w-3.5" />,
    Pending: <RotateCcw className="h-3.5 w-3.5 animate-spin-slow" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
};

export default function BillingPage() {
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [showCashModal, setShowCashModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Financial Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor revenue, track subscriptions, and debug gateway logs.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() => setShowCashModal(true)}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Banknote className="h-4 w-4" />
              Log Manual Cash
            </button>
          </div>
        </div>

        {/* KPIs / Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-start gap-4">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg ring-1 ring-emerald-100">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Successful Collections (Today)
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">$450.00</p>
                <p className="text-sm font-medium text-slate-400 border-l border-slate-300 pl-2">
                  1.8M KHR
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-start gap-4">
            <div className="bg-red-50 text-red-600 p-3 rounded-lg ring-1 ring-red-100">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Failed / Declined (Today)
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">3</p>
                <p className="text-sm font-medium text-slate-400">
                  Transactions
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-start gap-4">
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-lg ring-1 ring-indigo-100">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Total Pro/Premium Revenue
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">$14,500</p>
                <p className="text-sm font-medium text-slate-400">YTD</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Ledger Area */}
        <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm flex flex-col">
          {/* Filters Bar */}
          <div className="p-4 border-b border-slate-200/60 flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-50/50 rounded-t-xl">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search TXN ID, gateway ID, or vendor..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
                <Calendar className="h-4 w-4 text-slate-400" />
                This Month
              </button>
              <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm">
                <option>All Gateways</option>
                <option>ABA PAY</option>
                <option>KHQR (Bakong)</option>
                <option>WeChat / Alipay</option>
                <option>Manual Cash</option>
              </select>
              <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm">
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
                <tr className="border-b border-slate-200/60 bg-white text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Transaction Details</th>
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4">Gateway</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    onClick={() => setSelectedTxn(txn)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{txn.id}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {txn.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {txn.vendor}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {txn.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-semibold text-slate-900">
                        {formatCurrency(txn.amount, txn.currency)}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {txn.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
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
                    <td className="px-6 py-4 text-right text-slate-400 group-hover:text-slate-600">
                      <ChevronRight className="h-4 w-4 inline-block" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200/60 bg-white rounded-b-xl flex items-center justify-between text-sm text-slate-500">
            <div>
              Showing <span className="font-medium text-slate-900">1</span> to{" "}
              <span className="font-medium text-slate-900">7</span> of{" "}
              <span className="font-medium text-slate-900">124</span> results
            </div>
            <div className="flex gap-1">
              <button
                className="p-1 border border-transparent hover:bg-slate-100 rounded transition-colors disabled:opacity-50"
                disabled
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-1 border border-transparent hover:bg-slate-100 rounded transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Overlay Drawer for Details */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedTxn(null)}
          />

          {/* Drawer */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300 border-l border-slate-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-slate-400" />
                Transaction Receipt
              </h3>
              <button
                onClick={() => setSelectedTxn(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-md transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Grand Total Area */}
              <div className="text-center bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">
                  Total Amount
                </p>
                <p className="text-4xl font-bold tracking-tight text-slate-900">
                  {formatCurrency(selectedTxn.amount, selectedTxn.currency)}
                </p>
                <div className="mt-4 flex justify-center">
                  {getStatusBadge(selectedTxn.status)}
                </div>
              </div>

              {/* Data Grid */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
                  Primary Details
                </h4>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <span className="block text-slate-500 mb-1">
                      Internal TXN ID
                    </span>
                    <span className="font-mono text-slate-900">
                      {selectedTxn.id}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">
                      Gateway Ref ID
                    </span>
                    <span className="font-mono text-slate-900">
                      {selectedTxn.gatewayId}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-slate-500 mb-1">
                      Date & Time
                    </span>
                    <span className="text-slate-900">{selectedTxn.date}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">
                      Payment Method
                    </span>
                    <span className="text-slate-900">{selectedTxn.method}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">
                      Vendor Account
                    </span>
                    <Link
                      href={`/admin/vendors/${selectedTxn.vendorId}`}
                      className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
                    >
                      {selectedTxn.vendor}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Error Logging */}
              {selectedTxn.error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-3">
                  <p className="text-xs font-bold text-red-800 flex items-center gap-1.5 uppercase tracking-wide">
                    <AlertCircle className="h-4 w-4" />
                    Gateway Raw Response
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-red-100 shadow-sm overflow-x-auto">
                    <code className="text-sm text-red-600 whitespace-pre-wrap font-mono">
                      {`{\n  "status": "failed",\n  "code": "${selectedTxn.error.split(":")[0] || "ERR"}",\n  "message": "${selectedTxn.error.split(":")[1]?.trim() || selectedTxn.error}"\n}`}
                    </code>
                  </div>
                  <p className="text-xs text-red-700 leading-relaxed">
                    <span className="font-semibold">Support Action:</span> Do
                    not issue subscription features. Instruct vendor to check
                    their mobile banking balance or utilize an alternative
                    payment method.
                  </p>
                </div>
              )}
            </div>

            {/* Action Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-3">
              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900 rounded-lg text-sm font-medium text-slate-700 transition-all shadow-sm"
                onClick={() => alert("Mock: Syncing with Gateway API...")}
              >
                <ArrowRightLeft className="h-4 w-4" />
                Re-sync Status with Gateway
              </button>

              {selectedTxn.status === "Success" &&
                !selectedTxn.method.includes("Cash") && (
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300 rounded-lg text-sm font-medium text-red-700 transition-all shadow-sm">
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
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowCashModal(false)}
          />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                  <div className="bg-emerald-100 p-1.5 rounded-md">
                    <Banknote className="h-5 w-5 text-emerald-600" />
                  </div>
                  Manual Cash Override
                </h3>
                <button
                  onClick={() => setShowCashModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Log physical cash received and force a subscription upgrade for
                the vendor.
              </p>
            </div>

            <form className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Vendor ID / Stall Name
                </label>
                <input
                  type="text"
                  placeholder="Search vendor database..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Amount Collected
                  </label>
                  <input
                    type="number"
                    placeholder="28000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Currency
                  </label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white">
                    <option>KHR (Riel)</option>
                    <option>USD ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Apply Subscription Tier
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white">
                  <option>1 Month Pro ($15 / 60,000 KHR)</option>
                  <option>1 Month Premium ($25 / 100,000 KHR)</option>
                  <option>Custom Duration Override</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Admin Notes & Receipt Ref
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Physical receipt #1244 given by Admin Sok..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none placeholder:text-slate-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowCashModal(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm"
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
