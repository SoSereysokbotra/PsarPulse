"use client";

import React, { useEffect, useState, useCallback } from "react";
import { offlineFetch } from "@/lib/pwa/offline-fetch";
import { Check, X, Loader2, Banknote, HelpCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface Transaction {
  id: string;
  transactionId: string;
  planCode: string;
  billingCycle: string;
  method: string;
  amount: string;
  currency: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  } | null;
  vendor: {
    id: string;
    businessName: string;
  } | null;
}

export default function TransactionsPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showFlash = (type: "success" | "error", message: string) => {
    setFlash({ type, message });
    setTimeout(() => setFlash(null), 4000);
  };

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await offlineFetch("/api/superadmin/transactions", {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error(error);
      showFlash("error", "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleApprove = async (tx: Transaction) => {
    if (
      !confirm(
        `Approve this transaction?\n\nVendor: ${tx.vendor?.businessName || tx.user?.fullName || "Unknown"}\nPlan: ${tx.planCode.toUpperCase()}\nAmount: ${tx.currency} ${tx.amount}\n\nThe vendor's subscription will be activated instantly.`
      )
    )
      return;

    setActionLoading(tx.transactionId);
    try {
      const res = await offlineFetch(
        `/api/superadmin/transactions/${tx.transactionId}/approve`,
        { method: "POST" }
      );
      const data = await res.json();
      if (data.success) {
        showFlash("success", `Transaction approved — ${tx.vendor?.businessName || tx.user?.fullName} is now on ${tx.planCode.toUpperCase()}.`);
        fetchTransactions();
      } else {
        showFlash("error", data.message || "Failed to approve transaction");
      }
    } catch (err) {
      console.error(err);
      showFlash("error", "Server error while approving");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (tx: Transaction) => {
    if (!confirm("Are you sure you want to reject this transaction?")) return;

    setActionLoading(tx.transactionId);
    try {
      const res = await offlineFetch(
        `/api/superadmin/transactions/${tx.transactionId}/reject`,
        { method: "POST" }
      );
      const data = await res.json();
      if (data.success) {
        showFlash("success", "Transaction rejected.");
        fetchTransactions();
      } else {
        showFlash("error", data.message || "Failed to reject transaction");
      }
    } catch (err) {
      console.error(err);
      showFlash("error", "Server error while rejecting");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
            <X className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const pendingCount = transactions.filter((t) => t.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Flash notification */}
      {flash && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${
            flash.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
              : "bg-red-50 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
          }`}
        >
          {flash.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          {flash.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Transactions
          </h1>
          <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Verify and manage KHQR subscription payments.
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 self-start">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              {pendingCount} pending approval{pendingCount !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Table */}
      <div
        className={`border rounded-xl overflow-hidden shadow-sm ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-sm font-medium ${
                  isDark
                    ? "bg-slate-800/50 border-slate-800 text-slate-400"
                    : "bg-slate-50 border-slate-200 text-slate-500"
                }`}
              >
                <th className="px-6 py-4 whitespace-nowrap">Transaction</th>
                <th className="px-6 py-4 whitespace-nowrap">Customer</th>
                <th className="px-6 py-4 whitespace-nowrap">Plan & Amount</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}
            >
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <HelpCircle
                        className={`w-10 h-10 ${isDark ? "text-slate-600" : "text-slate-300"}`}
                      />
                      <p className={`font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        No transactions found.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className={`transition-colors ${
                      isDark ? "hover:bg-slate-800/30" : "hover:bg-slate-50/70"
                    }`}
                  >
                    {/* Transaction ID & Date */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`font-mono text-sm font-medium truncate max-w-[180px] ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                          title={tx.transactionId}
                        >
                          {tx.transactionId.length > 24
                            ? `${tx.transactionId.slice(0, 12)}...${tx.transactionId.slice(-8)}`
                            : tx.transactionId}
                        </span>
                        <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                          {new Date(tx.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                        >
                          {tx.vendor?.businessName || tx.user?.fullName || "Unknown"}
                        </span>
                        <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                          {tx.user?.email || "No email"}
                        </span>
                      </div>
                    </td>

                    {/* Plan & Amount */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span
                            className={`text-sm font-bold uppercase tracking-wider ${
                              isDark ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {tx.planCode}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                              isDark
                                ? "bg-slate-800 text-slate-400"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {tx.billingCycle}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}
                        >
                          {tx.currency} {tx.amount} · {tx.method.toUpperCase()}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">{getStatusBadge(tx.status)}</td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {tx.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={actionLoading === tx.transactionId}
                            onClick={() => handleApprove(tx)}
                            title="Approve & Activate Subscription"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 dark:border-emerald-500/20 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === tx.transactionId ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            Approve
                          </button>
                          <button
                            disabled={actionLoading === tx.transactionId}
                            onClick={() => handleReject(tx)}
                            title="Reject Transaction"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:border-red-500/20 transition-colors disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`text-xs font-medium ${isDark ? "text-slate-600" : "text-slate-400"}`}
                        >
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
