import { ReactNode } from "react";
import { AdminTopNav } from "@/components/admin/AdminTopNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Top Navigation Bar */}
      <AdminTopNav />

      {/* Main content area — full screen below the nav */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="w-full px-4 md:px-6 py-6">
          {children}
        </div> a  
      </main>
    </div>
  );
}
