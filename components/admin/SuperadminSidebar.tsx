"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  Settings,
  Lock,
  ScrollText,
  LogOut,
  Users,
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/superadmin", icon: LayoutDashboard },
  {
    name: "RBAC / Permissions",
    href: "/superadmin/permissions",
    icon: ShieldCheck,
  },
  { name: "Plans & Pricing", href: "/superadmin/plans", icon: CreditCard },
  { name: "Security", href: "/superadmin/security", icon: Lock },
  { name: "Audit Log", href: "/superadmin/audit-log", icon: ScrollText },
];

export function SuperadminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900 text-white shadow-xl transition-all duration-300 border-r border-slate-800">
      {/* Logo/Header */}
      <div className="flex h-16 items-center border-b border-slate-800 px-6 font-bold text-xl tracking-tight">
        <ShieldCheck className="w-6 h-6 text-violet-500 mr-2" />
        <span className="text-violet-400">PsarPulse</span>
        <span className="text-white ml-1">SA</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
        <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">
          System Control
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
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon
                className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                  isActive
                    ? "text-violet-400"
                    : "text-slate-400 group-hover:text-white"
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

        <div className="mt-8 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">
          Configuration
        </div>
        <Link
          href="/superadmin/settings"
          className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
            pathname.includes("/superadmin/settings")
              ? "bg-violet-500/10 text-violet-400"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Settings
            className={`mr-3 h-5 w-5 transition-colors ${pathname.includes("/superadmin/settings") ? "text-violet-400" : "text-slate-400 group-hover:text-white"}`}
          />
          Settings
        </Link>
      </nav>

      {/* Profile Footer */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-800 cursor-pointer">
          <div className="flex h-10 w-10 shrink-0 border border-slate-700 items-center justify-center rounded-full bg-slate-800 text-violet-400 font-bold shadow-inner">
            SA
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-medium text-white">
              System Admin
            </span>
            <span className="truncate text-xs text-slate-400 flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mr-1.5 animate-pulse"></div>
              God Mode
            </span>
          </div>
          <button
            className="ml-auto p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-md transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
