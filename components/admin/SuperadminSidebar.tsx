"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  Settings,
  ScrollText,
  LogOut,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

export function SuperadminSidebar() {
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isKhmer = language === "km";
  const navItems = [
    {
      name: t("superadmin.nav.overview"),
      href: "/superadmin",
      icon: LayoutDashboard,
    },
    {
      name: t("superadmin.sidebar.plansPricing"),
      href: "/superadmin/plans",
      icon: CreditCard,
    },
    {
      name: t("superadmin.nav.auditLog"),
      href: "/superadmin/audit-log",
      icon: ScrollText,
    },
  ];

  return (
    <div
      className={`flex h-screen w-64 flex-col shadow-xl transition-all duration-300 border-r ${
        isDark
          ? "bg-slate-900 text-white border-slate-800"
          : "bg-white text-slate-900 border-slate-200"
      } ${isKhmer ? "font-battambang" : ""}`}
    >
      {/* Logo/Header */}
      <div
        className={`flex h-16 items-center border-b px-6 font-bold text-xl tracking-tight ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}
      >
        <ShieldCheck className="w-6 h-6 text-violet-500 mr-2" />
        <span className="text-violet-400">PsarPulse</span>
        <span className={`ml-1 ${isDark ? "text-white" : "text-slate-900"}`}>
          SA
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
        <div
          className={`mb-4 text-xs font-semibold uppercase tracking-wider px-2 ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {t("superadmin.nav.systemControl")}
        </div>
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
              className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-violet-500/10 text-violet-400"
                  : isDark
                    ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`mr-3 h-5 w-5 shrink-0 transition-colors ${
                  isActive
                    ? "text-violet-400"
                    : isDark
                      ? "text-slate-400 group-hover:text-white"
                      : "text-slate-400 group-hover:text-slate-900"
                }`}
                aria-hidden="true"
              />
              {item.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
              )}
            </Link>
          );
        })}

        <div
          className={`mt-8 mb-4 text-xs font-semibold uppercase tracking-wider px-2 ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {t("superadmin.sidebar.configuration")}
        </div>
        {/* settings link removed — page deleted */}
      </nav>

      {/* Profile Footer */}
      <div
        className={`border-t p-4 ${isDark ? "border-slate-800" : "border-slate-200"}`}
      >
        <div
          className={`flex items-center gap-3 rounded-lg p-2 transition-colors cursor-pointer ${
            isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
          }`}
        >
          <div
            className={`flex h-10 w-10 shrink-0 border items-center justify-center rounded-full text-violet-400 font-bold shadow-inner ${
              isDark
                ? "border-slate-700 bg-slate-800"
                : "border-slate-300 bg-slate-100"
            }`}
          >
            SA
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className={`truncate text-sm font-medium ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {t("superadmin.common.systemAdmin")}
            </span>
            <span className="truncate text-xs text-slate-400 flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mr-1.5 animate-pulse"></div>
              {t("superadmin.common.godMode")}
            </span>
          </div>
          <button
            className={`ml-auto p-1.5 rounded-md transition-colors ${
              isDark
                ? "text-slate-400 hover:text-red-400 hover:bg-slate-700"
                : "text-slate-500 hover:text-red-600 hover:bg-slate-200"
            }`}
            title={t("superadmin.nav.signOut")}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
