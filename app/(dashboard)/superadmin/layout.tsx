"use client";

import { ReactNode } from "react";
import { SuperadminTopNav } from "../../../components/admin/SuperadminTopNav"; // Adjust path as needed
// import { SuperadminSidebar } from "./SuperadminSidebar"; // Uncomment if using Sidebar layout

export default function SuperadminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0d1117]">
      {/* Top Navigation Bar */}
      <SuperadminTopNav />

      {/* If you want to use the Sidebar layout instead, comment out TopNav above and use this: */}
      {/* <div className="flex flex-1 overflow-hidden">
        <SuperadminSidebar />
        <main className="flex-1 overflow-y-auto w-full">
          <div className="w-full px-4 md:px-6 py-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div> 
      */}

      {/* Main content area for TopNav only layout */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="w-full px-4 md:px-6 py-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
