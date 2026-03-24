"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  Loader2,
  Send,
  RefreshCcw,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

type InviteRole = "admin" | "vip_vendor";

type InvitationItem = {
  id: string;
  email: string;
  role: "admin" | "vendor";
  status: "pending" | "accepted" | "expired";
  expiresAt: string;
  createdAt: string;
};

export default function SuperadminInvitationsPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole>("admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [invitations, setInvitations] = useState<InvitationItem[]>([]);

  const roleLabel = useMemo(() => {
    return role === "admin" ? "Admin" : "VIP Vendor";
  }, [role]);

  const loadInvitations = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/superadmin/invitations", {
        method: "GET",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load invitations");
      }

      setInvitations(data.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load invitations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim()) return;

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/superadmin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send invitation");
      }

      setSuccessMessage(
        data.message || `${roleLabel} invitation sent successfully`,
      );
      setEmail("");
      await loadInvitations();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusClass = (status: InvitationItem["status"]) => {
    if (status === "accepted") {
      return isDark
        ? "bg-emerald-500/10 text-emerald-300"
        : "bg-emerald-100 text-emerald-700";
    }
    if (status === "pending") {
      return isDark
        ? "bg-amber-500/10 text-amber-300"
        : "bg-amber-100 text-amber-700";
    }
    return isDark
      ? "bg-white/10 text-slate-300"
      : "bg-slate-100 text-slate-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
        >
          Invitation Center
        </h1>
        <p
          className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          Superadmin can invite Admin users and VIP Vendors from one secure
          flow.
        </p>
      </div>

      <div
        className={`rounded-xl border shadow-sm p-6 ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label
                className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                Invite Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className={`w-full rounded-lg border pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/25 ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                  required
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                Invite Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`rounded-lg px-3 py-2.5 text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${role === "admin" ? "bg-violet-600 text-white border-violet-600" : isDark ? "border-white/10 text-slate-300 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole("vip_vendor")}
                  className={`rounded-lg px-3 py-2.5 text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${role === "vip_vendor" ? "bg-teal-600 text-white border-teal-600" : isDark ? "border-white/10 text-slate-300 hover:bg-white/5" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  <Star className="w-3.5 h-3.5" />
                  VIP Vendor
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-medium"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send {roleLabel} Invite
            </button>
            <button
              type="button"
              onClick={loadInvitations}
              disabled={isLoading}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border ${isDark ? "border-white/10 text-slate-300 hover:bg-white/5" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
            >
              <RefreshCcw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {successMessage && (
            <p
              className={`text-sm ${isDark ? "text-emerald-300" : "text-emerald-700"}`}
            >
              {successMessage}
            </p>
          )}
          {error && (
            <p
              className={`text-sm ${isDark ? "text-red-300" : "text-red-700"}`}
            >
              {error}
            </p>
          )}
        </form>
      </div>

      <div
        className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}
      >
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? "border-white/10" : "border-slate-100"}`}
        >
          <h2
            className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Recent Invitations
          </h2>
          <span
            className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {invitations.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? "bg-white/5" : "bg-slate-50"}>
                {["Email", "Role", "Status", "Expires", "Created"].map(
                  (header) => (
                    <th
                      key={header}
                      className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {header}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Loading invitations...
                  </td>
                </tr>
              ) : invitations.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No invitations found
                  </td>
                </tr>
              ) : (
                invitations.map((invite) => (
                  <tr
                    key={invite.id}
                    className={`border-t ${isDark ? "border-white/5 hover:bg-white/3" : "border-slate-100 hover:bg-slate-50"}`}
                  >
                    <td
                      className={`px-6 py-4 ${isDark ? "text-slate-200" : "text-slate-800"}`}
                    >
                      {invite.email}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                      {invite.role === "admin" ? "Admin" : "VIP Vendor"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${statusClass(invite.status)}`}
                      >
                        {invite.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(invite.expiresAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(invite.createdAt).toLocaleString()}
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
