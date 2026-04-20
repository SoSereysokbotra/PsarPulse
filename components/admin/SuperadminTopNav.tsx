"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  ScrollText,
  LogOut,
  Bell,
  ChevronDown,
  Users,
  MailOpen,
  Receipt,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LanguageDropdown } from "@/components/ui/LanguageDropdown";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/components/providers/ThemeProvider";

export function SuperadminTopNav() {
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isKhmer = language === "km";
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    {
      name: t("superadmin.nav.overview"),
      href: "/superadmin",
      icon: LayoutDashboard,
    },
    {
      name: t("superadmin.nav.invitations"),
      href: "/superadmin/invitations",
      icon: MailOpen,
    },
    {
      name: t("superadmin.nav.plans"),
      href: "/superadmin/plans",
      icon: CreditCard,
    },
    {
      name: "Transactions",
      href: "/superadmin/transactions",
      icon: Receipt,
    },
    {
      name: t("superadmin.nav.auditLog"),
      href: "/superadmin/audit-log",
      icon: ScrollText,
    },
    {
      name: t("superadmin.nav.settings"),
      href: "/superadmin/settings",
      icon: Settings,
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b ${
        isDark
          ? "bg-slate-900 shadow-lg shadow-slate-900/20 border-slate-800"
          : "bg-white shadow-sm border-slate-200"
      }`}
    >
      <div className="flex h-14 items-center px-4 md:px-6 gap-4">
        {/* Logo */}
        <Link
          href="/superadmin"
          className="flex items-center gap-1.5 shrink-0 mr-2"
        >
          <span className="text-lg font-bold text-violet-400 tracking-tight">
            PsarPulse
          </span>
          <span
            className={`text-lg font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
          >
            SA
          </span>
        </Link>

        {/* Superadmin label */}
        <span
          className={`hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isDark
              ? "bg-slate-800 border border-slate-700 text-slate-400"
              : "bg-slate-100 border border-slate-200 text-slate-500"
          }`}
        >
          {t("superadmin.nav.systemControl")}
        </span>

        {/* Divider */}
        <div
          className={`hidden md:block h-6 w-px mx-1 ${isDark ? "bg-slate-700" : "bg-slate-300"}`}
        />

        {/* Nav Items */}
        <nav
          className={`flex items-center gap-0.5 overflow-x-auto flex-1 scrollbar-none ${isKhmer ? "font-battambang" : ""}`}
        >
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(`${item.href}/`) &&
                item.href !== "/superadmin");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-violet-500/10 text-violet-400"
                    : isDark
                      ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive
                      ? "text-violet-400"
                      : isDark
                        ? "text-slate-500 group-hover:text-white"
                        : "text-slate-400 group-hover:text-slate-900"
                  }`}
                />
                <span className="hidden sm:inline">{item.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-violet-400 rounded-full shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side Actions */}
        <div
          className={`flex items-center gap-2 ml-auto shrink-0 ${isKhmer ? "font-battambang" : ""}`}
        >
          {/* Theme Switcher */}
          <ThemeToggle />

          {/* Language Switcher */}
          <LanguageDropdown variant={isDark ? "transparent" : "light"} />

          {/* Switch to Admin link */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs font-semibold whitespace-nowrap"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {t("superadmin.nav.adminView")}
            </span>
          </Link>

          {/* Notification Bell */}
          <button
            className={`relative p-2 rounded-lg transition-all ${
              isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-400 rounded-full shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all group ${
                isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-violet-400 font-bold text-xs shadow-inner ${
                  isDark
                    ? "bg-slate-700 border border-slate-600"
                    : "bg-slate-100 border border-slate-300"
                }`}
              >
                SA
              </div>
              <div className="hidden md:flex flex-col items-start leading-tight">
                <span
                  className={`text-xs font-semibold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {t("superadmin.common.systemAdmin")}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse inline-block" />
                  {t("superadmin.common.godMode")}
                </span>
              </div>
              <ChevronDown
                className={`hidden md:block h-3.5 w-3.5 transition-transform ${
                  isDark
                    ? "text-slate-500 group-hover:text-white"
                    : "text-slate-400 group-hover:text-slate-900"
                } ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {profileOpen && (
              <div
                className={`absolute right-0 mt-2 w-44 rounded-xl shadow-xl py-1 text-sm z-50 ${
                  isDark
                    ? "bg-slate-800 border border-slate-700"
                    : "bg-white border border-slate-200"
                }`}
              >
                <Link
                  href="/superadmin/settings"
                  onClick={() => setProfileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 transition-colors ${
                    isDark
                      ? "text-slate-300 hover:bg-slate-700 hover:text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  {t("superadmin.nav.settings")}
                </Link>
                <div
                  className={`my-1 border-t ${
                    isDark ? "border-slate-700" : "border-slate-200"
                  }`}
                />
                <button
                  className={`w-full flex items-center gap-2 px-3 py-2 transition-colors ${
                    isDark
                      ? "text-red-400 hover:bg-slate-700 hover:text-red-300"
                      : "text-red-600 hover:bg-slate-100 hover:text-red-700"
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  {t("superadmin.nav.signOut")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
