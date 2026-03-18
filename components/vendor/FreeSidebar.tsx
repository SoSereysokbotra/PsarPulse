"use client";

import React from "react";
import Link from "next/link";
import {
  Settings,
  Sparkles,
  X,
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
} from "lucide-react";

export interface NavItem {
  icon: any;
  title: string;
  khmerTitle?: string;
  href: string;
}

interface FreeSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  setIsOpen: (val: boolean) => void;
  currentPath?: string;
  navItems?: NavItem[]; // <-- new prop
}

const DEFAULT_VENDOR_ITEMS: NavItem[] = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    khmerTitle: "ផ្ទាំងគ្រប់គ្រង",
    href: "/vendor",
  },
  {
    icon: CircleDollarSign,
    title: "Sales",
    khmerTitle: "ការលក់",
    href: "/vendor/sales",
  },
  {
    icon: Receipt,
    title: "Expenses",
    khmerTitle: "ចំណាយ",
    href: "/vendor/expenses",
  },
  {
    icon: Users,
    title: "Customers",
    khmerTitle: "អតិថិជន",
    href: "/vendor/customer",
  },
];

function NavItem({
  icon: Icon,
  title,
  khmerTitle,
  href,
  active = false,
  collapsed = false,
}: {
  icon: any;
  title: string;
  khmerTitle?: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? title : undefined}
      className={`flex items-center rounded-lg transition-colors min-h-11 px-2.5 mb-0.5 no-underline
        ${collapsed ? "justify-center" : "justify-between"}
        ${
          active
            ? "bg-white/10 text-white"
            : "text-white/50 hover:bg-white/5 hover:text-white/80"
        }`}
    >
      <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
        <Icon
          className={`w-4 h-4 shrink-0 ${active ? "text-[#29B28D]" : ""}`}
        />
        {!collapsed && (
          <span
            className={`text-[14px] ${active ? "font-semibold text-white" : "font-medium"}`}
          >
            {title}
          </span>
        )}
      </div>
      {!collapsed && khmerTitle && (
        <span className="text-[10px] font-khmer opacity-50">{khmerTitle}</span>
      )}
    </Link>
  );
}

export default function FreeSidebar({
  isOpen,
  isCollapsed,
  setIsOpen,
  currentPath = "/vendor",
  navItems = DEFAULT_VENDOR_ITEMS, // <-- use custom items or default
}: FreeSidebarProps) {
  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#0f1117] transform transition-all duration-300 ease-in-out flex flex-col shrink-0
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "lg:w-18" : "lg:w-56"}
        w-56`}
    >
      <div
        className={`h-16 flex items-center border-b border-white/10 shrink-0 ${
          isCollapsed ? "justify-center px-3" : "px-4 gap-3"
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-[#29B28D] flex items-center justify-center font-bold text-white text-sm shrink-0">
          P
        </div>
        {!isCollapsed && (
          <span className="font-bold text-white text-[17px] tracking-tight whitespace-nowrap flex-1">
            PsarPulse KH
          </span>
        )}
        <button
          className="lg:hidden text-white/40 hover:text-white ml-auto border-0 bg-transparent p-0 cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            title={item.title}
            khmerTitle={item.khmerTitle}
            href={item.href}
            active={currentPath === item.href}
            collapsed={isCollapsed}
          />
        ))}
      </nav>

      <div className="px-2 pb-4 space-y-0.5 border-t border-white/10 pt-3">
        {/* Settings is always present, but you could also pass it via navItems if desired */}
        <NavItem
          icon={Settings}
          title="Settings"
          khmerTitle="ការកំណត់"
          href="/vendor/settings"
          collapsed={isCollapsed}
          active={currentPath === "/vendor/settings"}
        />
        {!isCollapsed ? (
          <div className="mt-3 mx-1 p-3 bg-[#29B28D] rounded-xl text-white">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-semibold text-sm">Free Plan</span>
            </div>
            <p className="text-xs text-white/70">Upgrade for more features</p>
          </div>
        ) : (
          <div className="mt-2 flex justify-center">
            <div className="p-2 bg-[#29B28D] rounded-xl">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-2 pt-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold shrink-0">
              U
            </div>
            <span className="text-white/70 text-sm">User</span>
          </div>
        )}
      </div>
    </aside>
  );
}
