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
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function AdminSidebar() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isKhmer = language === "km";
  const navItems = [
    {
      name: isKhmer ? "ផ្ទាំងគ្រប់គ្រង" : "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: isKhmer ? "បញ្ជីអាជីវករ" : "Vendor Directory",
      href: "/admin/vendors",
      icon: Store,
    },
    { name: isKhmer ? "ផែនទីតូប" : "Stall Map", href: "/admin/map", icon: Map },
    {
      name: isKhmer ? "ការបង់ប្រាក់" : "Billing",
      href: "/admin/billing",
      icon: CreditCard,
    },
  ];

  return (
    <div
      className={`flex h-screen w-64 flex-col bg-slate-900 text-white shadow-xl transition-all duration-300 ${isKhmer ? "font-battambang" : ""}`}
    >
      {/* Logo/Header */}
      <div className="flex h-16 items-center border-b border-slate-800 px-6 font-bold text-xl tracking-tight">
        <span className="text-emerald-400">PsarPulse</span>
        <span className="text-white ml-1">KH</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
        <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">
          {isKhmer ? "ការគ្រប់គ្រង" : "Management"}
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(`${item.href}/`) && item.href !== "/admin");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon
                className={`mr-3 h-5 w-5 shrink-0 transition-colors ${
                  isActive
                    ? "text-emerald-400"
                    : "text-slate-400 group-hover:text-white"
                }`}
                aria-hidden="true"
              />
              {item.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              )}
            </Link>
          );
        })}

        <div className="mt-8 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">
          {isKhmer ? "ជម្រើស" : "Options"}
        </div>
        <Link
          href="/admin/settings"
          className="group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
        >
          <Settings className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
          {isKhmer ? "ការកំណត់" : "Settings"}
        </Link>
      </nav>

      {/* Admin Profile Footer */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-800">
          <div className="flex h-10 w-10 shrink-0 border border-slate-700 items-center justify-center rounded-full bg-slate-800 text-emerald-400 font-bold shadow-inner">
            A
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-medium text-white">
              {isKhmer ? "អ្នកគ្រប់គ្រង" : "Admin User"}
            </span>
            <span className="truncate text-xs text-slate-400 flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></div>
              {isKhmer ? "អ្នកគ្រប់គ្រងទីផ្សារ" : "Market Manager"}
            </span>
          </div>
          <button
            className="ml-auto p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-md transition-colors"
            title={isKhmer ? "ចាកចេញ" : "Sign out"}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
