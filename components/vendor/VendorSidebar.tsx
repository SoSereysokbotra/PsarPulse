"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Settings, ChevronRight, X, Crown, Sparkles } from "lucide-react";
import VendorNavItem from "./VendorNavItem";

interface NavLink {
  icon: React.ElementType;
  title: string;
  khmerTitle: string;
  href: string;
  active?: boolean;
}

interface VendorSidebarProps {
  plan: "free" | "pro" | "premium";
  navLinks: NavLink[];
  settingsHref?: string;
  collapsed?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  userName?: string;
  userInitials?: string;
  userEmail?: string;
}

const PLAN_CONFIG = {
  free: {
    label: "Free Plan",
    labelKh: "ឥតគិតថ្លៃ",
    sub: null,
    icon: null,
    cta: "Upgrade Plan ↗",
    ctaHref: "/vendor/pricing",
  },
  pro: {
    label: "Pro Plan",
    labelKh: "ផែនការ Pro",
    sub: "$3/month · Unlimited Logs",
    icon: Crown,
    cta: "Manage Plan",
    ctaHref: "/vendor/pricing",
  },
  premium: {
    label: "Premium Plan",
    labelKh: "ផែនការ Premium",
    sub: "$7/month · Unlimited AI Logs",
    icon: Sparkles,
    cta: "Manage Plan",
    ctaHref: "/vendor/pricing",
  },
};

export default function VendorSidebar({
  plan,
  navLinks,
  settingsHref = "/vendor/settings",
  collapsed = false,
  isOpen = false,
  onClose,
  userName = "Sok Maly",
  userInitials = "SM",
  userEmail = "sokmaly@gmail.com",
}: VendorSidebarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const config = PLAN_CONFIG[plan];
  const PlanIcon = config.icon;

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex flex-col h-screen shrink-0
        bg-[#0E1319]
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[68px]" : "w-64"}
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* Logo */}
      <div
        className={`flex items-center border-b border-white/[0.07] h-[70px] shrink-0 ${
          collapsed ? "justify-center px-0" : "justify-between px-6"
        }`}
      >
        {!collapsed && (
          <Link href="/vendor" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 rounded-[10px] bg-[#29B28D] flex items-center justify-center font-extrabold text-[#0E1319] text-[17px] shrink-0">
              P
            </div>
            <span className="font-extrabold text-[16px] text-[#e6edf3] tracking-[0.02em] whitespace-nowrap">
              PsarPulse KH
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/vendor" className="flex items-center justify-center no-underline">
            <div className="w-10 h-10 rounded-[10px] bg-[#29B28D] flex items-center justify-center font-extrabold text-[#0E1319] text-[17px]">
              P
            </div>
          </Link>
        )}
        {!collapsed && onClose && (
          <button
            className="lg:hidden bg-transparent border-0 text-[#7d8590] cursor-pointer p-0 shrink-0"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 pt-3 overflow-y-auto ${collapsed ? "px-2" : "px-3"}`}>
        {navLinks.map((item) => (
          <VendorNavItem
            key={item.title}
            icon={item.icon}
            title={item.title}
            khmerTitle={item.khmerTitle}
            href={item.href}
            active={item.active}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className={`pb-3 pt-2 border-t border-white/[0.07] ${collapsed ? "px-2" : "px-3"}`}>
        <VendorNavItem
          icon={Settings}
          title="Settings"
          khmerTitle="ការកំណត់"
          href={settingsHref}
          collapsed={collapsed}
        />

        {!collapsed && (
          <>
            {/* Plan badge */}
            <div className="mt-2 px-4 py-3.5 rounded-[11px] bg-[rgba(41,178,141,0.08)] border border-[rgba(41,178,141,0.18)]">
              <div className="flex items-center gap-1.5 mb-1">
                {PlanIcon && <PlanIcon size={14} className="text-[#29B28D]" />}
                <span className="text-[13px] font-semibold text-[#e6edf3]">
                  {config.label}
                </span>
                {config.labelKh && (
                  <span className="text-[11px] font-bold text-[#7d8590] ml-auto">
                    {config.labelKh}
                  </span>
                )}
              </div>
              {config.sub && (
                <p className="text-[11px] text-[#7d8590] mb-2">{config.sub}</p>
              )}
              <Link
                href={config.ctaHref}
                className="block text-center text-[13px] font-bold text-[#29B28D] bg-[rgba(41,178,141,0.12)] py-2 rounded-[8px] no-underline hover:bg-[rgba(41,178,141,0.18)] transition-colors"
              >
                {config.cta}
              </Link>
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="w-full flex items-center gap-3 px-3 pt-4 pb-2 cursor-pointer bg-transparent border-0 text-left"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#29B28D] to-[#1a9c65] flex items-center justify-center text-[13px] font-bold text-white shrink-0">
                  {userInitials}
                </div>
                <span className="text-[14px] font-medium text-[#e6edf3] flex-1">
                  {userName}
                </span>
                <ChevronRight
                  size={15}
                  className={`text-[#7d8590] transition-transform duration-200 ${
                    userMenuOpen ? "-rotate-90" : "rotate-0"
                  }`}
                />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute bottom-[calc(100%-8px)] left-3 right-3 z-50 bg-white rounded-[16px] shadow-[0_4px_32px_rgba(0,0,0,0.14)] border border-[#e8eaed] overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-4">
                      <div className="w-10 h-10 rounded-full border-2 border-[#e8eaed] flex items-center justify-center shrink-0">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[14px] font-semibold text-[#111827] leading-tight">{userName}</div>
                        <div className="text-[12px] text-[#6b7280] mt-0.5">{userEmail}</div>
                      </div>
                    </div>
                    <div className="border-t border-[#f0f2f5]" />
                    <div className="py-1">
                      <Link href={settingsHref} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3.5 px-5 py-3 text-[14px] text-[#111827] no-underline hover:bg-[#f7f8fa] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                        Account
                      </Link>
                      <Link href="/vendor/pricing" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3.5 px-5 py-3 text-[14px] text-[#111827] no-underline hover:bg-[#f7f8fa] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                        Plans &amp; Pricing
                      </Link>
                      <button className="w-full flex items-center gap-3.5 px-5 py-3 text-[14px] text-[#111827] bg-transparent border-0 cursor-pointer hover:bg-[#f7f8fa] transition-colors text-left">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {collapsed && (
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#29B28D] to-[#1a9c65] flex items-center justify-center text-[13px] font-bold text-white">
              {userInitials}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
