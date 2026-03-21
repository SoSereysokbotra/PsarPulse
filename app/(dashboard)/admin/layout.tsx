"use client";

import { ReactNode } from "react";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDark ? "bg-[#0d1117]" : "bg-slate-50"}`}>
      {/* Top Navigation Bar */}
      <AdminTopNav />

      {/* Main content area — full screen below the nav */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="w-full px-4 md:px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
