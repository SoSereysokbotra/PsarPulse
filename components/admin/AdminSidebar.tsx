"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Store, 
  Map, 
  TrendingUp, 
  Settings, 
  CreditCard,
  LogOut,
  MailOpen
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Vendor Directory", href: "/admin/vendors", icon: Store },
  { name: "Stall Map", href: "/admin/map", icon: Map },
  { name: "Invitations", href: "/admin/invites", icon: MailOpen },
  { name: "Billing", href: "/admin/billing", icon: CreditCard },
  { name: "Rankings", href: "/admin/rankings", icon: TrendingUp },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900 text-white shadow-xl transition-all duration-300">
      {/* Logo/Header */}
      <div className="flex h-16 items-center border-b border-slate-800 px-6 font-bold text-xl tracking-tight">
        <span className="text-emerald-400">PsarPulse</span>
        <span className="text-white ml-1">KH</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
        <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">
          Management
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== "/admin");
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
                className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                  isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-white"
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
          Options
        </div>
        <Link
          href="/admin/settings"
          className="group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
        >
          <Settings className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
          Settings
        </Link>
      </nav>

      {/* Admin Profile Footer */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-800">
          <div className="flex h-10 w-10 shrink-0 border border-slate-700 items-center justify-center rounded-full bg-slate-800 text-emerald-400 font-bold shadow-inner">
            A
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-medium text-white">Admin User</span>
            <span className="truncate text-xs text-slate-400 flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></div>
              Market Manager
            </span>
          </div>
          <button className="ml-auto p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-md transition-colors" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
