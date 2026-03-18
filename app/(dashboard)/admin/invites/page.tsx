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
  Trash2
} from "lucide-react";

const pastInvites = [
  { id: 1, email: "manager@psarpulse.com", role: "Co-Admin", status: "Accepted", date: "Oct 10, 2025" },
  { id: 2, email: "vip_fashion@gmail.com", role: "VIP Vendor (Premium)", status: "Pending", date: "Oct 15, 2025" },
  { id: 3, email: "test_stall@outlook.com", role: "VIP Vendor (Pro)", status: "Expired", date: "Oct 01, 2025" },
];

export default function InvitesPage() {
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
    await new Promise(resolve => setTimeout(resolve, 1000));

    const token = Math.random().toString(36).substring(7);
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://psarpulse.kh';
    
    if (inviteType === "vip" && emailInput) {
      setGeneratedLink(`${baseUrl}/vendor/vip?token=pp_vip_${token}&email=${encodeURIComponent(emailInput)}`);
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Secure Invitations</h1>
          <p className="text-slate-500 mt-1">Generate magic links for Co-Admins or VIP Vendors to bypass manual approval.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Generator Form */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
              <LinkIcon className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-slate-900">Create Invite Link</h2>
          </div>
          
          <div className="p-5">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Invite Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setInviteType("admin")}
                    className={`flex items-center justify-center gap-2 py-2 px-3 border rounded-lg text-sm transition-all
                      ${inviteType === "admin" 
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,1)] scale-[1.02]" 
                        : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                  >
                    <ShieldUser className="h-4 w-4" />
                    Co-Admin
                  </button>
                  <button 
                    type="button"
                    onClick={() => setInviteType("vip")}
                    className={`flex items-center justify-center gap-2 py-2 px-3 border rounded-lg text-sm transition-all
                      ${inviteType === "vip" 
                        ? "border-amber-500 bg-amber-50 text-amber-700 shadow-[0_0_0_1px_rgba(245,158,11,1)] scale-[1.02]" 
                        : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                  >
                    <Star className="h-4 w-4" />
                    VIP Vendor
                  </button>
                </div>
              </div>

              {inviteType === "vip" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Incentive Tier</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/50">
                      <option>1 Month Premium Free</option>
                      <option>3 Months Pro Free</option>
                      <option>No Promo (Bypass Approval Only)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Email (Optional)</label>
                    <input 
                      type="email" 
                      placeholder="e.g. sokha@gmail.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    <p className="text-xs text-slate-500 mt-1">If left blank, link can be copied and shared via Telegram.</p>
                  </div>
                </div>
              )}

              {inviteType === "admin" && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-xs font-semibold text-red-800 break-words mb-1">High Privilege Action</p>
                  <p className="text-[11px] text-red-600">This link grants full administrative access to the platform. Only send to trusted market managers.</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : emailInput ? (
                  <MailOpen className="h-4 w-4" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {isLoading ? "Processing..." : emailInput ? "Send Invite Email" : "Generate Link"}
              </button>
            </form>

            {inviteSent && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-emerald-800">Invitation Sent Successfully!</h4>
                  <p className="text-xs text-emerald-600 mt-1">An email with the registration link has been dispatched to {emailInput}.</p>
                </div>
              </div>
            )}

            {generatedLink && (
              <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <label className="block text-sm font-medium text-slate-700 mb-2">Shareable Link (Single Use)</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      readOnly 
                      value={generatedLink}
                      className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg outline-none font-mono"
                    />
                    <button 
                      onClick={copyToClipboard}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 pl-2"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-200 p-2 rounded-lg text-slate-600">
                <MailOpen className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-slate-900">Invitation History</h2>
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Target / Email</th>
                  <th className="px-6 py-4">Granted Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pastInvites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-slate-50/50 transition-colors text-sm">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {invite.email}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {invite.role}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold
                        ${invite.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : ''}
                        ${invite.status === 'Pending' ? 'bg-amber-100 text-amber-700' : ''}
                        ${invite.status === 'Expired' ? 'bg-slate-100 text-slate-600' : ''}
                      `}>
                        {invite.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {invite.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {invite.status === 'Pending' && (
                        <button className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Revoke Invitation">
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
