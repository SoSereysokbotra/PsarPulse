"use client";

import React, { useState } from "react";

import Link from "next/link";
import { Settings, ChevronRight, X, Crown, Sparkles, LogOut, User, CreditCard as BillingIcon, Star } from "lucide-react";
import VendorNavItem from "./VendorNavItem";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useUser } from "@/components/providers/UserProvider";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/utils/client-auth";

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
  isGuest?: boolean;
  onLockedClick?: () => void;
  collapsed?: boolean;  
  isOpen?: boolean;
  onClose?: () => void;
  currentPath?: string;
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
    ctaHref: "/vendor/pro",
  },
  premium: {
    label: "Premium Plan",
    labelKh: "ផែនការ Premium",
    sub: "$7/month · Unlimited AI Logs",
    icon: Sparkles,
    cta: "Manage Plan",
    ctaHref: "/vendor/premium",
  },
};

export default function VendorSidebar({
  plan,
  navLinks,
  settingsHref = "/vendor/settings",
  isGuest = false,
  onLockedClick,
  collapsed = false,
  isOpen = false,
  onClose,
  currentPath,
  userName: propUserName,
  userInitials: propUserInitials,
  userEmail: propUserEmail,
}: VendorSidebarProps) {
  const platform_name = "PsarPulse";
  const { language, t } = useLanguage();
  const { user, loading } = useUser();
  const isKhmer = language === "km";
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.logout();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Initials logic
  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase();
  };

  const userName = propUserName || user?.fullName || (loading ? "..." : (isKhmer ? "អ្នកប្រើប្រាស់" : "User"));
  const userInitials = propUserInitials || (user?.fullName ? getInitials(user.fullName) : (loading ? ".." : "U"));
  const userEmail = propUserEmail || user?.email || (loading ? "..." : "");
  const config = PLAN_CONFIG[plan];
  const PlanIcon = config.icon;

  // Determine active state: explicit `active` prop takes priority, otherwise match currentPath
  const resolvedLinks = navLinks.map((link: NavLink) => ({
    ...link,
    active: link.active !== undefined ? link.active : currentPath === link.href,
  }));

  // Automatically append Reviews if not present
  if (!resolvedLinks.some(link => link.href.includes('/reviews'))) {
    const reviewsHref = isGuest ? "/guest/reviews" : "/vendor/reviews";
    resolvedLinks.push({
      icon: Star,
      title: "Reviews",
      khmerTitle: "ការវាយតម្លៃ",
      href: reviewsHref,
      active: currentPath === reviewsHref
    });
  }

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex flex-col h-screen shrink-0
        transition-all duration-300 ease-in-out
        bg-[#0E1319] dark:bg-[#0B0F14] dark:border-r dark:border-white/5
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
            <span className="font-extrabold text-[16px] text-[#e6edf3] tracking-[0.02em] whitespace-nowrap">{platform_name}</span>
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
        {resolvedLinks.map((item: any) => (
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
        {!collapsed && (
          <>
            {/* Plan badge */}
            <div className="mt-2 px-4 py-3.5 rounded-[11px] bg-[rgba(41,178,141,0.08)] border border-[rgba(41,178,141,0.18)]">
              <div className="flex items-center gap-1.5 mb-1">
                {PlanIcon && <PlanIcon size={14} className="text-[#29B28D]" />}
                <span className="text-[13px] font-semibold text-[#e6edf3]">
                  {isKhmer ? config.labelKh : config.label}
                </span>
              </div>
              {config.sub && (
                <p className="text-[11px] text-[#7d8590] mb-2">{config.sub}</p>
              )}
              <Link
                href={config.ctaHref}
                className={`block text-center text-[13px] font-bold py-2 rounded-[8px] no-underline transition-colors text-[#29B28D] bg-[rgba(41,178,141,0.12)] hover:bg-[rgba(41,178,141,0.18)] dark:text-[#3ecf8e] dark:bg-[#3ecf8e]/10 dark:hover:bg-[#3ecf8e]/20`}
              >
                <span suppressHydrationWarning>
                  {plan === "free" ? t("settings.subscribe") : (isKhmer ? "បានជាវ" : "Subscribed")}
                </span>
              </Link>
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={isGuest ? onLockedClick : () => setUserMenuOpen((o) => !o)}
                className="w-full flex items-center gap-3 px-3 pt-4 pb-2 cursor-pointer bg-transparent border-0 text-left"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#29B28D] to-[#1a9c65] flex items-center justify-center text-[13px] font-bold text-white shrink-0">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={userName} className="w-full h-full object-cover" />
                  ) : (
                    userInitials
                  )}
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
                        <Settings size={16} className="text-[#6b7280]" />
                        {t("settings.title") || "Settings"}
                      </Link>
                      <Link href={`${settingsHref}?tab=billing`} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3.5 px-5 py-3 text-[14px] text-[#111827] no-underline hover:bg-[#f7f8fa] transition-colors">
                        <BillingIcon size={16} className="text-[#6b7280]" />
                        {t("settings.subscriptions")}
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3.5 px-5 py-3 text-[14px] text-[#111827] bg-transparent border-0 cursor-pointer hover:bg-[#f7f8fa] transition-colors text-left"
                      >
                        <LogOut size={16} className="text-[#6b7280]" />
                        Logout
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
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#29B28D] to-[#1a9c65] flex items-center justify-center text-[13px] font-bold text-white">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
              ) : (
                userInitials
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
