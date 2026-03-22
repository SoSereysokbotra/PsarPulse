"use client";

import React, { useState, useEffect } from "react";
import { Search, UserX, UserCheck, Loader2, RotateCcw } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function AdminUsersPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [acting, setActing] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams({ ...(search && { search }) });
    fetch(`/api/admin/users?${params}`).then(r => r.json()).then(d => {
      if (d.success) setUsers(d.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAction = async (userId: string, action: "deactivate" | "reactivate") => {
    setActing(userId);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setActing(null);
    fetchUsers();
  };

  const roleColors: Record<string, string> = {
    admin: "bg-blue-100 text-blue-700",
    super_admin: "bg-violet-100 text-violet-700",
    vendor: "bg-emerald-100 text-emerald-700",
    customer: "bg-slate-100 text-slate-600",
  };

  const statusColors: Record<string, string> = {
    active: "text-emerald-600",
    pending: "text-amber-500",
    blocked: "text-red-500",
    deleted: "text-slate-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>User Management</h1>
        <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>View, deactivate or reactivate all platform users.</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchUsers()}
            className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-emerald-500/20 ${isDark ? "bg-[#161b22] border-white/10 text-white" : "bg-white border-slate-200"}`} />
        </div>
        <button onClick={fetchUsers} className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors">Search</button>
      </div>

      <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin text-slate-400 w-5 h-5" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={isDark ? "bg-white/5" : "bg-slate-50"}>
                  {["Name", "Email", "Role", "Status", "Joined", "Actions"].map(h => (
                    <th key={h} className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400">No users found</td></tr>
                ) : users.map((user) => (
                  <tr key={user.id} className={`border-t ${isDark ? "border-white/5" : "border-slate-100"}`}>
                    <td className={`px-6 py-4 font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}>{user.fullName}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${roleColors[user.role] || "bg-gray-100 text-gray-600"}`}>{user.role}</span>
                    </td>
                    <td className={`px-6 py-4 text-xs font-semibold capitalize ${statusColors[user.status] || "text-slate-400"}`}>{user.status}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {user.status === "blocked" ? (
                          <button onClick={() => handleAction(user.id, "reactivate")} disabled={acting === user.id}
                            className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
                            {acting === user.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserCheck className="w-3 h-3" />} Reactivate
                          </button>
                        ) : (
                          <button onClick={() => handleAction(user.id, "deactivate")} disabled={acting === user.id || user.role === "super_admin"}
                            className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-30">
                            {acting === user.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserX className="w-3 h-3" />} Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
