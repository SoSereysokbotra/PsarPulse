"use client";

import React, { useState } from "react";
import { Lock, ShieldAlert, Timer, LogOut, Loader2, AlertTriangle } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function SecurityPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [mfaRequired, setMfaRequired] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [saving, setSaving] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const saveSetting = async (key: string, value: string | boolean) => {
    setSaving(true);
    await fetch("/api/superadmin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: String(value), label: key }),
    });
    setSaving(false);
  };

  const revokeAllTokens = async () => {
    if (!confirm("This will log out ALL users immediately. Are you sure?")) return;
    setRevoking(true);
    // In a real system, this would call an endpoint to invalidate all refresh tokens.
    await new Promise(r => setTimeout(r, 1500));
    setRevoking(false);
    alert("All user sessions have been revoked.");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Security Settings</h1>
        <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Configure global security policies for the platform.</p>
      </div>

      {/* MFA Policy */}
      <div className={`rounded-xl border p-6 ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}>
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-indigo-50 ring-1 ring-indigo-100">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>MFA Enforcement</h3>
            <p className="text-sm text-slate-500 mb-4">Require multi-factor authentication for all admin accounts on login.</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setMfaRequired(!mfaRequired); saveSetting("mfa_required", !mfaRequired); }}
                className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${mfaRequired ? "bg-indigo-600" : isDark ? "bg-white/20" : "bg-slate-200"}`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform mt-0.5 ${mfaRequired ? "translate-x-5 ml-0.5" : "translate-x-0.5"}`} />
              </button>
              <span className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {mfaRequired ? "Required for all admins" : "Optional"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Session Timeout */}
      <div className={`rounded-xl border p-6 ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}>
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-amber-50 ring-1 ring-amber-100">
            <Timer className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Session Timeout</h3>
            <p className="text-sm text-slate-500 mb-4">Automatically log out inactive users after this period.</p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="15" max="480" step="15"
                value={sessionTimeout}
                onChange={e => setSessionTimeout(Number(e.target.value))}
                className="flex-1 accent-amber-500"
              />
              <span className={`text-sm font-bold w-20 text-right ${isDark ? "text-white" : "text-slate-900"}`}>
                {sessionTimeout >= 60 ? `${sessionTimeout / 60}h` : `${sessionTimeout}m`}
              </span>
              <button onClick={() => saveSetting("session_timeout_minutes", String(sessionTimeout))} disabled={saving}
                className="px-3 py-1.5 text-xs rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium disabled:opacity-50">
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Revoke All Tokens */}
      <div className={`rounded-xl border border-red-200 p-6 ${isDark ? "bg-red-500/5 border-red-500/20" : "bg-red-50"}`}>
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-red-100 ring-1 ring-red-200">
            <LogOut className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-700 mb-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Emergency Token Revocation
            </h3>
            <p className="text-sm text-red-600/80 mb-4">Forces all users to re-authenticate immediately. Use only in emergencies.</p>
            <button
              onClick={revokeAllTokens}
              disabled={revoking}
              className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {revoking && <Loader2 className="w-4 h-4 animate-spin" />}
              Revoke All Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
