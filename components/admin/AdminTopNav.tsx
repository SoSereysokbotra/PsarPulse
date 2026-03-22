"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Map,
  Settings,
  CreditCard,
  LogOut,
  MailOpen,
  ClipboardList,
  Bell,
  ChevronDown,
  Users,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function AdminTopNav() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isKhmer = language === "km";
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { name: isKhmer ? "ផ្ទាំងគ្រប់គ្រង" : "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: isKhmer ? "អាជីវករ" : "Vendors", href: "/admin/vendors", icon: Store },
    { name: isKhmer ? "សំណើសុំ" : "Requests", href: "/admin/vendor-requests", icon: ClipboardList },
    { name: isKhmer ? "អ្នកប្រើ" : "Users", href: "/admin/users", icon: Users },
    { name: isKhmer ? "ផែនទីតូប" : "Stall Map", href: "/admin/map", icon: Map },
    { name: isKhmer ? "ការអញ្ជើញ" : "Invitations", href: "/admin/invites", icon: MailOpen },
    { name: isKhmer ? "ការបង់ប្រាក់" : "Billing", href: "/admin/billing", icon: CreditCard },
    { name: isKhmer ? "ជំនួយ" : "Support", href: "/admin/support", icon: Headphones },
    { name: isKhmer ? "ការកំណត់" : "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 shadow-lg shadow-slate-900/20">
      <div className="flex h-14 items-center px-4 md:px-6 gap-4">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-1.5 shrink-0 mr-2">
          <span className="text-lg font-bold text-emerald-400 tracking-tight">PsarPulse</span>
          <span className="text-lg font-bold text-white tracking-tight">KH</span>
        </Link>

        {/* Admin label */}
        <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Admin
        </span>

        {/* Divider */}
        <div className="hidden md:block h-6 w-px bg-slate-700 mx-1" />

        {/* Nav Items */}
        <nav className={`flex items-center gap-0.5 overflow-x-auto flex-1 scrollbar-none ${isKhmer ? "font-suwannaphum" : ""}`}>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(`${item.href}/`) && item.href !== "/admin");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-white"}`} />
                <span className="hidden sm:inline">{item.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Superadmin link + Notifications + Profile */}
        <div className={`flex items-center gap-2 ml-auto shrink-0 ${isKhmer ? "font-suwannaphum" : ""}`}>
          {/* Superadmin link */}
          <Link href="/superadmin" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors text-xs font-semibold whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Superadmin</span>
          </Link>

          {/* Notification Bell */}
          <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-all group">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 border border-slate-600 text-emerald-400 font-bold text-xs shadow-inner">
                A
              </div>
              <div className="hidden md:flex flex-col items-start leading-tight">
                <span className="text-xs font-semibold text-white">{isKhmer ? "អ្នកគ្រប់គ្រង" : "Admin User"}</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  {isKhmer ? "អ្នកគ្រប់គ្រងទីផ្សារ" : "Market Manager"}
                </span>
              </div>
              <ChevronDown className={`hidden md:block h-3.5 w-3.5 text-slate-500 group-hover:text-white transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-800 border border-slate-700 shadow-xl py-1 text-sm z-50">
                <Link href="/admin/settings" onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <Settings className="h-4 w-4 text-slate-400" />
                  {isKhmer ? "ការកំណត់" : "Settings"}
                </Link>
                <div className="my-1 border-t border-slate-700" />
                <button className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors">
                  <LogOut className="h-4 w-4" />
                  {isKhmer ? "ចាកចេញ" : "Sign out"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
