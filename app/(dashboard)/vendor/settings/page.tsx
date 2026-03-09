"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CircleDollarSign,
  Receipt,
  Users,
  Package,
  Settings,
  Menu,
  X,
  Bell,
  Sparkles,
  User,
  CreditCard,
  Lock,
  LogOut,
  Globe,
  MapPin,
  Phone,
  CheckCircle2,
  ChevronRight,
  FileBarChart,
} from "lucide-react";

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock User Data mapping to SRS DB Requirements (Users Table: Role, Phone, StallLocation, Subscription Tier)
  const userProfile = {
    name: "Sokha Vendor",
    phone: "012 345 678",
    email: "sokha.vendor@gmail.com",
    stallLocation: "Night Market, Stall B42",
    plan: "Free Plan",
    role: "Vendor",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-[#29B28D] selection:text-white">
      {/* --- SIDEBAR --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#29B28D] flex items-center justify-center font-bold text-white shadow-sm">
              P
            </div>
            <span className="font-bold text-[19px] tracking-tight">
              PsarPulse KH
            </span>
          </Link>
          <button
            className="lg:hidden text-slate-400"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          <NavItem
            icon={LayoutDashboard}
            title="Dashboard"
            khmerTitle="ផ្ទាំងគ្រប់គ្រង"
          />
          <NavItem icon={CircleDollarSign} title="Sales" khmerTitle="ការលក់" />
          <NavItem icon={Receipt} title="Expenses" khmerTitle="ចំណាយ" />
          <NavItem icon={Users} title="Customers" khmerTitle="អតិថិជន" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <NavItem
            icon={Settings}
            title="Settings"
            khmerTitle="ការកំណត់"
            active
          />
          <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-slate-700">Free Plan</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ឥតគិតថ្លៃ</span>
            </div>
            <Link
              href="/vendor/pricing"
              className="block w-full text-center text-[13px] font-bold text-[#29B28D] hover:text-[#239979] bg-[#29B28D]/10 hover:bg-[#29B28D]/15 py-2 rounded-lg transition-colors"
            >
              Upgrade Plan ↗
            </Link>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col w-full min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-slate-500 hover:text-slate-900"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-[22px] font-bold text-slate-900">Settings</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#29B28D]/10 flex items-center justify-center text-[#29B28D] font-bold border border-[#29B28D] text-sm shadow-sm">
              SV
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-4xl mx-auto space-y-7">
            {/* 1. PROFILE SECTION (Maps to Users Table schema) */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                <div>
                  <h3 className="font-bold text-[17px] text-slate-900">
                    Profile Information
                  </h3>
                  <p className="text-[13px] font-khmer text-slate-500 mt-0.5">
                    ព័ត៌មានគណនី
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={userProfile.name}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium focus:bg-white focus:border-[#29B28D] focus:ring-1 focus:ring-[#29B28D] outline-none transition-all min-h-[48px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            defaultValue={userProfile.phone}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium focus:bg-white focus:border-[#29B28D] focus:ring-1 focus:ring-[#29B28D] outline-none transition-all min-h-[48px]"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Stall Location
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            defaultValue={userProfile.stallLocation}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium focus:bg-white focus:border-[#29B28D] focus:ring-1 focus:ring-[#29B28D] outline-none transition-all min-h-[48px]"
                          />
                        </div>
                      </div>
                    </div>
                    <button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors min-h-[48px]">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. SUBSCRIPTION MANAGEMENT (FR-19, FR-20, & Payment Integration) */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-slate-400" />
                <div>
                  <h3 className="font-bold text-[17px] text-slate-900">
                    Subscription & Billing
                  </h3>
                  <p className="text-[13px] font-khmer text-slate-500 mt-0.5">
                    ការជាវ និងការបង់ប្រាក់
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-[19px] text-slate-900">
                        {userProfile.plan}
                      </h4>
                    </div>
                    <p className="text-[14px] text-slate-600">
                      Basic Sales Logging, Expense Tracking, and Analytics.
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Usage Limit
                    </p>
                    <p className="text-[15px] font-bold text-slate-900">
                      500 Logs / Month
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-[#29B28D] hover:bg-[#239979] text-white font-semibold px-6 py-3 rounded-xl transition-colors min-h-[48px]">
                    Manage Subscription
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-colors min-h-[48px]">
                    View Payment History
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[12px] text-slate-500 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#29B28D]" />
                  <span>
                    Payments securely processed via ABA PayWay & KHQR.
                  </span>
                </div>
              </div>
            </div>

            {/* 3. PREFERENCES & NOTIFICATIONS (FR-26, FR-29) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                  <Globe className="w-5 h-5 text-slate-400" />
                  <h3 className="font-bold text-[17px] text-slate-900">
                    Language (ភាសា)
                  </h3>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                    <span className="text-[15px] font-medium text-slate-900">
                      English (Default)
                    </span>
                    <div className="w-5 h-5 rounded-full border-4 border-[#29B28D] bg-white"></div>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group">
                    <span className="text-[15px] font-medium text-slate-600 font-khmer">
                      ភាសាខ្មែរ
                    </span>
                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 bg-white group-hover:border-slate-300"></div>
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                  <Bell className="w-5 h-5 text-slate-400" />
                  <h3 className="font-bold text-[17px] text-slate-900">
                    Notifications
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[15px] font-medium text-slate-900">
                        Daily Summary Notifications
                      </p>
                      <p className="text-[12px] text-slate-500">
                        Receive end-of-day sales summaries
                      </p>
                    </div>
                    {/* Mock Toggle Switch */}
                    <div className="w-12 h-6 bg-[#29B28D] rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. SECURITY (Password Reset Requirement) */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <Lock className="w-5 h-5 text-slate-400" />
                <div>
                  <h3 className="font-bold text-[17px] text-slate-900">
                    Security
                  </h3>
                  <p className="text-[13px] font-khmer text-slate-500 mt-0.5">
                    សុវត្ថិភាព
                  </p>
                </div>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors min-h-[56px]">
                  <span className="text-[15px] font-medium text-slate-900">
                    Change Password
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* LOG OUT */}
            <div className="pt-4 pb-8">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-8 py-3.5 rounded-xl transition-colors min-h-[52px]">
                <LogOut className="w-5 h-5" />
                <span>Log Out (ចាកចេញ)</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// NavItem Component (Mirroring sizing)
function NavItem({
  icon: Icon,
  title,
  khmerTitle,
  active = false,
}: {
  icon: any;
  title: string;
  khmerTitle: string;
  active?: boolean;
}) {
  const hrefMap: Record<string, string> = {
    Dashboard: "/vendor",
    Sales: "/vendor/sales",
    Expenses: "/vendor/expenses",
    Customers: "/vendor/customer",
    Settings: "/vendor/settings",
  };

  return (
    <Link
      href={hrefMap[title] || "#"}
      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors min-h-[48px] ${
        active
          ? "bg-[#29B28D]/10 text-[#29B28D]"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`w-4 h-4 ${active ? "text-[#29B28D]" : "text-slate-400"}`}
        />
        <span
          className={`text-[15px] ${active ? "font-semibold" : "font-medium"}`}
        >
          {title}
        </span>
      </div>
      <span className="text-[11px] font-khmer opacity-60">{khmerTitle}</span>
    </Link>
  );
}
