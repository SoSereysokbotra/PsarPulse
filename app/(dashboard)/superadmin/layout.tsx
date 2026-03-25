"use client";

import { ReactNode } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { SuperadminTopNav } from "../../../components/admin/SuperadminTopNav";

export default function SuperadminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={`min-h-screen flex font-sans transition-colors duration-300 ${isDark ? "bg-[#0d1117]" : "bg-slate-50"}`}
    >
      {/* Content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <SuperadminTopNav />
        <div className="w-full px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
