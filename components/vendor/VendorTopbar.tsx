"use client";

import React from "react";
import { Menu, PanelLeftClose, PanelLeftOpen, Bell, Sun, Moon } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

interface VendorTopbarProps {
  title: string;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobileSidebarOpen: (o: boolean) => void;
  planBadge?: { label: string; icon: React.ElementType };
  rightActions?: React.ReactNode;
  userName?: string;
  userInitials?: string;
}

import { useState, useRef, useEffect } from "react";

export default function VendorTopbar({
  title,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  setIsMobileSidebarOpen,
  planBadge,
  rightActions,
  userName,
  userInitials,
}: VendorTopbarProps) {
  const { language } = useLanguage();
  const isKhmer = language === "km";
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showNotifications]);

  return (
    <header className="h-[70px] px-5 md:px-8 flex items-center gap-3 sticky top-0 z-30 shrink-0 border-b transition-colors bg-white border-[#e8eaed] dark:bg-[#0d1117] dark:border-white/5">
      <button
        className="lg:hidden text-[#6b7280] hover:text-[#111827] border-0 bg-transparent p-0 cursor-pointer"
        onClick={() => setIsMobileSidebarOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      <button
        onClick={() => setIsSidebarCollapsed((c) => !c)}
        className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-[#7d8590] hover:text-[#111827] hover:bg-[#f7f8fa] transition-colors border-0 bg-transparent cursor-pointer"
        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isSidebarCollapsed ? (
          <PanelLeftOpen className="w-4 h-4" />
        ) : (
          <PanelLeftClose className="w-4 h-4" />
        )}
      </button>

      <div className="flex items-center gap-2">
        <span className="text-[15px] font-semibold text-[#111827] dark:text-white">{title}</span>
        {planBadge && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[rgba(41,178,141,0.12)] text-[#29B28D] text-[11px] font-bold rounded-full border border-[rgba(41,178,141,0.25)]">
            <planBadge.icon className="w-3 h-3" /> {planBadge.label}
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* rightActions (Quick Sale button etc) */}
        {rightActions && (
          <div className="flex items-center gap-3">
            {rightActions}
          </div>
        )}

        <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-[#e8eaed] dark:border-white/10 mr-1">
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg transition-colors border-0 bg-transparent cursor-pointer text-[#6b7280] hover:text-[#111827] hover:bg-[#f7f8fa] dark:text-[#7d8590] dark:hover:text-white dark:hover:bg-white/5"
          >
            <Sun className="w-5 h-5 hidden dark:block" />
            <Moon className="w-5 h-5 block dark:hidden" />
          </button>
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications((p) => !p)} 
              className={`relative p-2 transition-colors border-0 bg-transparent cursor-pointer rounded-lg ${showNotifications ? "bg-[#f7f8fa] text-[#111827] dark:bg-white/5 dark:text-white" : "text-[#6b7280] hover:text-[#111827] dark:text-[#7d8590] dark:hover:text-white hover:bg-[#f7f8fa] dark:hover:bg-white/5"}`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0d1117]" />
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#161B22] border border-[#e8eaed] dark:border-white/10 rounded-[14px] shadow-lg z-50 overflow-hidden text-left">
                <div className="p-4 border-b border-[#e8eaed] dark:border-white/10 flex justify-between items-center bg-[#f7f8fa] dark:bg-[#0d1117]">
                  <h3 className="font-bold text-[15px] text-[#111827] dark:text-white flex items-center gap-2"><Bell className="w-4 h-4"/> {isKhmer ? "ការជូនដំណឹង" : "Notifications"}</h3>
                  <span className="text-[11px] font-bold text-[#3ecf8e] bg-[rgba(62,207,142,0.15)] px-2.5 py-1 rounded-full border border-[rgba(62,207,142,0.3)]">{isKhmer ? "៣ ថ្មី" : "3 New"}</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {[
                    { title: "AI Smart Alert", desc: "Demand for Hot Lattes is spiking. Suggest moving cups to front.", time: "10 min ago", unread: true },
                    { title: "Goal Reached", desc: "You hit your daily revenue target!", time: "2 hours ago", unread: true },
                    { title: "Automated Warning", desc: "Sales dropped 15% in the last hour.", time: "5 hours ago", unread: true }
                  ].map((notif, i) => (
                    <div key={i} className={`p-4 border-b border-[#e8eaed] dark:border-white/10 hover:bg-[#f7f8fa] dark:hover:bg-white/5 transition-colors cursor-pointer ${notif.unread ? "bg-[rgba(59,130,246,0.03)] dark:bg-[rgba(59,130,246,0.05)]" : ""}`}>
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[13px] font-bold text-[#111827] dark:text-white">{notif.title}</p>
                        {notif.unread && <span className="w-2 h-2 bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.6)] rounded-full mt-1 shrink-0"></span>}
                      </div>
                      <p className="text-[12px] text-[#6b7280] dark:text-[#7d8590] leading-snug">{notif.desc}</p>
                      <span className="text-[11px] font-medium text-[#9ca3af] dark:text-[#6b7280] block mt-2">{notif.time}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center bg-[#f7f8fa] dark:bg-[#0d1117] cursor-pointer hover:bg-[#f0f2f5] dark:hover:bg-white/5 transition-colors">
                  <span className="text-[13px] font-bold text-[#3ecf8e] hover:underline">{isKhmer ? "សម្គាល់ថាបានអានទាំងអស់" : "Mark all as read"}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Icon */}
        <button className="w-9 h-9 rounded-full bg-[#f7f8fa] dark:bg-white/5 border border-[#e8eaed] dark:border-white/10 flex items-center justify-center cursor-pointer transition-colors hover:border-[#3ecf8e]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3ecf8e] to-[#1a9c65] flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
            {userInitials || "U"}
          </div>
        </button>
      </div>
    </header>
  );
}
