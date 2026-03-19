"use client";

import React from "react";
import { Menu, PanelLeftClose, PanelLeftOpen, Bell } from "lucide-react";

interface VendorTopbarProps {
  title: string;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobileSidebarOpen: (o: boolean) => void;
  planBadge?: { label: string; icon: React.ElementType };
  rightActions?: React.ReactNode;
}

export default function VendorTopbar({
  title,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  setIsMobileSidebarOpen,
  planBadge,
  rightActions,
}: VendorTopbarProps) {
  return (
    <header className="bg-white border-b border-[#e8eaed] h-[70px] px-5 md:px-8 flex items-center gap-3 sticky top-0 z-30 shrink-0">
      <button
        className="lg:hidden text-[#6b7280] hover:text-[#111827] border-0 bg-transparent p-0 cursor-pointer"
        onClick={() => setIsMobileSidebarOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      <button
        onClick={() => setIsSidebarCollapsed((c) => !c)}
        className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-[#7d8590] hover:text-[#111827] hover:bg-[#f7f8fa] transition-colors border-0 bg-transparent cursor-pointer"
        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isSidebarCollapsed ? (
          <PanelLeftOpen className="w-4 h-4" />
        ) : (
          <PanelLeftClose className="w-4 h-4" />
        )}
      </button>

      <div className="flex items-center gap-2">
        <span className="text-[#111827] text-[15px] font-semibold">{title}</span>
        {planBadge && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[rgba(41,178,141,0.12)] text-[#29B28D] text-[11px] font-bold rounded-full border border-[rgba(41,178,141,0.25)]">
            <planBadge.icon className="w-3 h-3" /> {planBadge.label}
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {rightActions}
        <button className="relative p-2 text-[#6b7280] hover:text-[#111827] transition-colors border-0 bg-transparent cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
      </div>
    </header>
  );
}
