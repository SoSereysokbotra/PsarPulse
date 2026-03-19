"use client";

import React, { useState, useEffect } from "react";
import VendorSidebar from "./VendorSidebar";
import VendorTopbar from "./VendorTopbar";

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
    <div className="min-h-screen bg-[#f0f2f5] flex font-sans text-slate-900 selection:bg-[#29B28D] selection:text-white">
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
