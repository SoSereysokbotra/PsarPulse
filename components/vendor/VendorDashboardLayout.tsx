"use client";

import React, { useState, useEffect } from "react";
import VendorSidebar from "./VendorSidebar";
import VendorTopbar from "./VendorTopbar";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface NavLink {
  icon: React.ElementType;
  title: string;
  khmerTitle: string;
  href: string;
  active?: boolean;
}

interface VendorDashboardLayoutProps {
  children: React.ReactNode;
  plan: "free" | "pro" | "premium";
  navLinks: NavLink[];
  title: string;
  planBadge?: { label: string; icon: React.ElementType };
  rightActions?: React.ReactNode;
  currentPath?: string;
  settingsHref?: string;
  userName?: string;
  userInitials?: string;
  userEmail?: string;
}

export default function VendorDashboardLayout({
  children,
  plan,
  navLinks,
  title,
  planBadge,
  rightActions,
  currentPath,
  settingsHref = "/vendor/settings",
  userName,
  userInitials,
  userEmail,
}: VendorDashboardLayoutProps) {
  const { resolvedTheme } = useTheme();
  const { language } = useLanguage();
  const isDark = resolvedTheme === "dark";
  const isKhmer = language === "km";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Auto-close sidebar on desktop resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className={`min-h-screen flex font-sans selection:bg-[#29B28D] selection:text-white ${isDark ? "bg-dark-bg text-white" : "bg-[#f0f2f5] text-slate-900"} ${isKhmer ? "font-suwannaphum" : ""}`}>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ══ SIDEBAR ════════════════════════════════════════════════ */}
      <VendorSidebar
        plan={plan}
        navLinks={navLinks}
        currentPath={currentPath}
        settingsHref={settingsHref}
        collapsed={isSidebarCollapsed}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userName={userName}
        userInitials={userInitials}
        userEmail={userEmail}
      />

      {/* ══ MAIN ══════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col w-full min-w-0 h-screen overflow-hidden">
        {/* ── Topbar ── */}
        <VendorTopbar
          title={title}
          planBadge={planBadge}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          setIsMobileSidebarOpen={setIsSidebarOpen}
          rightActions={rightActions}
        />

        {/* ── Page Content ── */}
        {children}
      </main>
    </div>
  );
}
