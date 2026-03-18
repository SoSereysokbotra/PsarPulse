  "use client";

import React from "react";
import { Menu, PanelLeftClose, PanelLeftOpen, Bell } from "lucide-react";

interface FreeTopbarProps {
  title: string;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobileSidebarOpen: (o: boolean) => void;
  rightActions?: React.ReactNode;
}

export default function FreeTopbar({
  title,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  setIsMobileSidebarOpen,
  rightActions,
}: FreeTopbarProps) {
  return (
    <header className="bg-white border-b border-slate-200 h-16 px-5 flex items-center gap-3 sticky top-0 z-30 shrink-0">
      <button className="lg:hidden text-slate-500 hover:text-slate-900 border-0 bg-transparent p-0 cursor-pointer" onClick={() => setIsMobileSidebarOpen(true)}>
        <Menu className="w-5 h-5" />
      </button>

      <button
        onClick={() => setIsSidebarCollapsed((c) => !c)}
        className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
      </button>

      <span className="text-slate-500 text-sm font-medium">{title}</span>

      <div className="ml-auto flex items-center gap-2">
        {rightActions}
        <button className="relative p-2 text-slate-400 hover:text-slate-700 transition-colors border-0 bg-transparent cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
      </div>
    </header>
  );
}
