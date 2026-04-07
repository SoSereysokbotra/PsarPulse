"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, MessageSquare, Loader2 } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AdminSupportPage() {
  const { resolvedTheme } = useTheme();
  const { language } = useLanguage();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [search, setSearch] = useState("");
  const [postingNote, setPostingNote] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);

  const fetchUsers = () => {
    const params = new URLSearchParams({ ...(search && { search }) });
    fetch(`/api/admin/users?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setUsers(d.data);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const selectUser = (user: any) => {
    setSelectedUser(user);
    setLoadingNotes(true);
    fetch(`/api/admin/users/${user.id}/notes`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setNotes(d.data);
        setLoadingNotes(false);
      });
  };

  const addNote = async () => {
    if (!newNote.trim() || !selectedUser) return;
    setPostingNote(true);
    const res = await fetch(`/api/admin/users/${selectedUser.id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: newNote.trim() }),
    });
    const data = await res.json();
    if (data.success) {
      setNotes((prev) => [data.data, ...prev]);
      setNewNote("");
    }
    setPostingNote(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {isKhmer ? "កំណត់ចំណាំជំនួយ" : "Support Notes"}
        </h1>
        <p
          className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {isKhmer
            ? "បន្ថែមកំណត់ចំណាំខាងក្នុងលើគណនីអ្នកប្រើសម្រាប់ការគាំទ្រ។"
            : "Add internal notes to user accounts for support purposes."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-220px)]">
        {/* User list */}
        <div
          className={`rounded-xl border flex flex-col overflow-hidden ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}
        >
          <div
            className={`p-3 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={isKhmer ? "ស្វែងរកអ្នកប្រើ..." : "Find user..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                className={`w-full pl-8 pr-4 py-2 text-sm rounded-lg border ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200"} outline-none`}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => selectUser(user)}
                className={`w-full text-left px-4 py-3 border-b transition-colors ${isDark ? "border-white/5 hover:bg-white/5" : "border-slate-50 hover:bg-slate-50"} ${selectedUser?.id === user.id ? (isDark ? "bg-white/10" : "bg-emerald-50") : ""}`}
              >
                <p
                  className={`text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}
                >
                  {user.fullName}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div
          className={`rounded-xl border flex flex-col overflow-hidden ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}
        >
          {!selectedUser ? (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400">
                  {isKhmer
                    ? "ជ្រើសរើសអ្នកប្រើដើម្បីមើល និងបន្ថែមកំណត់ចំណាំ"
                    : "Select a user to view and add support notes"}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div
                className={`px-4 py-3 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}
              >
                <p
                  className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-800"}`}
                >
                  {selectedUser.fullName}
                </p>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingNotes ? (
                  <div className="flex justify-center pt-8">
                    <Loader2 className="animate-spin text-slate-400 w-5 h-5" />
                  </div>
                ) : notes.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center pt-8">
                    {isKhmer ? "មិនទាន់មានកំណត់ចំណាំ" : "No notes yet"}
                  </p>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      className={`rounded-lg p-3 ${isDark ? "bg-white/5" : "bg-slate-50"}`}
                    >
                      <p
                        className={`text-sm ${isDark ? "text-slate-200" : "text-slate-700"}`}
                      >
                        {note.note}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div
                className={`p-3 border-t ${isDark ? "border-white/5" : "border-slate-100"}`}
              >
                <div className="flex gap-2">
                  <textarea
                    placeholder={
                      isKhmer
                        ? "បន្ថែមកំណត់ចំណាំខាងក្នុង..."
                        : "Add internal note..."
                    }
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={2}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border resize-none outline-none ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200"}`}
                  />
                  <button
                    onClick={addNote}
                    disabled={postingNote || !newNote.trim()}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm disabled:opacity-50 flex items-center"
                  >
                    {postingNote ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
