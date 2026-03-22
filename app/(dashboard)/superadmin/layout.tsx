"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Settings,
  ScrollText,
  CreditCard,
  Lock,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const navItems = [
  { href: "/superadmin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/superadmin/permissions", label: "RBAC / Permissions", icon: ShieldCheck },
  { href: "/superadmin/plans", label: "Plans & Pricing", icon: CreditCard },
  { href: "/superadmin/settings", label: "Platform Settings", icon: Settings },
  { href: "/superadmin/security", label: "Security", icon: Lock },
  { href: "/superadmin/audit-log", label: "Audit Log", icon: ScrollText },
];

export default function SuperadminLayout({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const pathname = usePathname();

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${isDark ? "bg-[#0d1117]" : "bg-slate-50"}`}>
      {/* Sidebar */}
      <aside className={`w-64 min-h-screen flex-shrink-0 border-r flex flex-col ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200"}`}>
        {/* Logo */}
        <div className={`p-5 border-b ${isDark ? "border-white/10" : "border-slate-100"}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>PsarPulse</p>
              <p className="text-[10px] font-semibold text-violet-500 uppercase tracking-wider">Superadmin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-violet-600 text-white shadow-sm"
                    : isDark
                    ? "text-slate-400 hover:bg-white/5 hover:text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-current"}`} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t ${isDark ? "border-white/10" : "border-slate-100"}`}>
          <Link href="/admin" className={`flex items-center gap-2 text-xs font-medium ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"} transition-colors`}>
            <Users className="w-3.5 h-3.5" />
            Switch to Admin View
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="w-full px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
