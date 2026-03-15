import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
        <AdminSidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 md:pl-64 h-full overflow-hidden">
        {/* Mobile top bar could go here if needed, keeping it simple for now */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
