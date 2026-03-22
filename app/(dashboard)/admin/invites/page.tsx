"use client";

import { useState } from "react";
import {
  Link as LinkIcon,
  Copy,
  Check,
  ShieldUser,
  Star,
  RefreshCw,
  MailOpen,
  Trash2,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const pastInvites = [
  {
    id: 1,
    email: "manager@psarpulse.com",
    role: "Co-Admin",
    status: "Accepted",
    date: "Oct 10, 2025",
  },
  {
    id: 2,
    email: "vip_fashion@gmail.com",
    role: "VIP Vendor (Premium)",
    status: "Pending",
    date: "Oct 15, 2025",
  },
  {
    id: 3,
    email: "test_stall@outlook.com",
    role: "VIP Vendor (Pro)",
    status: "Expired",
    date: "Oct 01, 2025",
  },
];

export default function InvitesPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [copied, setCopied] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [inviteType, setInviteType] = useState("vip");
  const [emailInput, setEmailInput] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const token = Math.random().toString(36).substring(7);
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://psarpulse.kh";

    if (inviteType === "vip" && emailInput) {
      setGeneratedLink(
        `${baseUrl}/vendor/vip?token=pp_vip_${token}&email=${encodeURIComponent(emailInput)}`,
      );
      setInviteSent(true);
    } else {
      setGeneratedLink(`${baseUrl}/vendor/vip?token=pp_vip_${token}`);
      setInviteSent(false);
    }

    setCopied(false);
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`space-y-6 font-sans transition-colors duration-200 ${isDark ? "text-slate-100" : "text-slate-900"}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            className={`text-3xl font-bold tracking-tight transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Secure Invitations
          </h1>
          <p className="text-slate-500 mt-1 transition-colors">
            Generate magic links for Co-Admins or VIP Vendors to bypass manual
            approval.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Form */}
        <div
          className={`lg:col-span-1 rounded-xl border shadow-sm overflow-hidden transition-colors ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200/60"}`}
        >
          <div
            className={`p-5 border-b flex items-center gap-3 transition-colors ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"}`}
          >
            <div
              className={`p-2 rounded-lg transition-colors ${isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}
            >
              <LinkIcon className="h-5 w-5" />
            </div>
            <h2
              className={`font-semibold transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Create Invite Link
            </h2>
          </div>

          <div className="p-5">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 transition-colors ${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  Invite Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInviteType("admin")}
                    className={`flex items-center justify-center gap-2 py-2 px-3 border rounded-lg text-sm transition-all
                      ${
                        inviteType === "admin"
                          ? isDark
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_0_1px_rgba(16,185,129,0.5)] scale-[1.02]"
                            : "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,1)] scale-[1.02]"
                          : isDark
                            ? "border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200"
                            : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                  >
                    <ShieldUser className="h-4 w-4" />
                    Co-Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setInviteType("vip")}
                    className={`flex items-center justify-center gap-2 py-2 px-3 border rounded-lg text-sm transition-all
                      ${
                        inviteType === "vip"
                          ? isDark
                            ? "border-amber-500/50 bg-amber-500/10 text-amber-400 shadow-[0_0_0_1px_rgba(245,158,11,0.5)] scale-[1.02]"
                            : "border-amber-500 bg-amber-50 text-amber-700 shadow-[0_0_0_1px_rgba(245,158,11,1)] scale-[1.02]"
                          : isDark
                            ? "border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200"
                            : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                  >
                    <Star className="h-4 w-4" />
                    VIP Vendor
                  </button>
                </div>
              </div>

              {inviteType === "vip" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 transition-colors ${isDark ? "text-slate-300" : "text-slate-700"}`}
                    >
                      Incentive Tier
                    </label>
                    <select
                      className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white"
                          : "bg-slate-50/50 border-slate-200 text-slate-900"
                      }`}
                    >
                      <option>1 Month Premium Free</option>
                      <option>3 Months Pro Free</option>
                      <option>No Promo (Bypass Approval Only)</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 transition-colors ${isDark ? "text-slate-300" : "text-slate-700"}`}
                    >
                      Recipient Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. sokha@gmail.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                          : "bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                      }`}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      If left blank, link can be copied and shared via Telegram.
                    </p>
                  </div>
                </div>
              )}

              {inviteType === "admin" && (
                <div
                  className={`p-3 border rounded-lg animate-in fade-in slide-in-from-top-2 duration-200 transition-colors ${
                    isDark
                      ? "bg-red-500/10 border-red-500/20"
                      : "bg-red-50 border-red-100"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold break-words mb-1 transition-colors ${isDark ? "text-red-400" : "text-red-800"}`}
                  >
                    High Privilege Action
                  </p>
                  <p
                    className={`text-[11px] transition-colors ${isDark ? "text-red-300" : "text-red-600"}`}
                  >
                    This link grants full administrative access to the platform.
                    Only send to trusted market managers.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm ${
                  isDark
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-slate-900 hover:bg-slate-800"
                }`}
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : emailInput ? (
                  <MailOpen className="h-4 w-4" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {isLoading
                  ? "Processing..."
                  : emailInput
                    ? "Send Invite Email"
                    : "Generate Link"}
              </button>
            </form>

            {inviteSent && (
              <div
                className={`mt-4 p-4 border rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 transition-colors ${
                  isDark
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-emerald-50 border-emerald-200"
                }`}
              >
                <Check
                  className={`h-5 w-5 shrink-0 mt-0.5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                />
                <div>
                  <h4
                    className={`text-sm font-semibold transition-colors ${isDark ? "text-emerald-400" : "text-emerald-800"}`}
                  >
                    Invitation Sent Successfully!
                  </h4>
                  <p
                    className={`text-xs mt-1 transition-colors ${isDark ? "text-emerald-500" : "text-emerald-600"}`}
                  >
                    An email with the registration link has been dispatched to{" "}
                    {emailInput}.
                  </p>
                </div>
              </div>
            )}

            {generatedLink && (
              <div
                className={`mt-6 pt-6 border-t animate-in fade-in slide-in-from-bottom-2 duration-300 transition-colors ${isDark ? "border-white/10" : "border-slate-100"}`}
              >
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  Shareable Link (Single Use)
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      className={`w-full pl-3 pr-10 py-2.5 border text-xs rounded-lg outline-none font-mono transition-colors ${
                        isDark
                          ? "bg-[#161b22] border-emerald-500/30 text-emerald-400"
                          : "bg-slate-50 border-emerald-200 text-emerald-800"
                      }`}
                    />
                    <button
                      onClick={copyToClipboard}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 transition-colors pl-2 ${
                        isDark
                          ? "text-slate-500 hover:text-slate-300 bg-[#161b22]"
                          : "text-slate-400 hover:text-slate-600 bg-slate-50"
                      }`}
                    >
                      {copied ? (
                        <Check
                          className={`h-4 w-4 ${isDark ? "text-emerald-400" : "text-emerald-500"}`}
                        />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History Table */}
        <div
          className={`lg:col-span-2 rounded-xl border shadow-sm overflow-hidden flex flex-col transition-colors ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200/60"}`}
        >
          <div
            className={`p-5 border-b flex items-center justify-between transition-colors ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg transition-colors ${isDark ? "bg-white/5 text-slate-400" : "bg-slate-200 text-slate-600"}`}
              >
                <MailOpen className="h-5 w-5" />
              </div>
              <h2
                className={`font-semibold transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Invitation History
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`border-b text-xs uppercase tracking-wider font-semibold transition-colors ${
                    isDark
                      ? "bg-white/5 border-white/10 text-slate-400"
                      : "bg-slate-50/50 border-slate-200 text-slate-500"
                  }`}
                >
                  <th className="px-6 py-4">Target / Email</th>
                  <th className="px-6 py-4">Granted Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y transition-colors ${isDark ? "divide-white/10 bg-[#161b22]" : "divide-slate-100 bg-white"}`}
              >
                {pastInvites.map((invite) => (
                  <tr
                    key={invite.id}
                    className={`text-sm transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50/50"}`}
                  >
                    <td
                      className={`px-6 py-4 font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}
                    >
                      {invite.email}
                    </td>
                    <td
                      className={`px-6 py-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {invite.role}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold
                        ${invite.status === "Accepted" ? (isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-700") : ""}
                        ${invite.status === "Pending" ? (isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-100 text-amber-700") : ""}
                        ${invite.status === "Expired" ? (isDark ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-600") : ""}
                      `}
                      >
                        {invite.status}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {invite.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {invite.status === "Pending" && (
                        <button
                          className={`transition-colors p-1 ${isDark ? "text-slate-500 hover:text-red-400" : "text-slate-400 hover:text-red-500"}`}
                          title="Revoke Invitation"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
