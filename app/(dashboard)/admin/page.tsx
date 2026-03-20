"use client";

import {
  Users,
  CreditCard,
  CircleDollarSign,
  Clock,
  Search,
  CloudLightning,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  FileText,
  Download,
  TrendingUp,
  MapPin,
  CheckCircle2,
  XCircle,
  Store,
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 font-sans text-slate-900">
        {/* Header & Context Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dashboard Overview
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              High-level summary of the market`s digital ecosystem.
            </p>
          </div>

          {/* Live Weather & Impact Widget */}
          <div className="flex items-center bg-white rounded-xl border border-slate-200/60 shadow-sm p-1.5 pr-5">
            <div className="bg-slate-50 rounded-lg p-2 mr-3 border border-slate-100">
              <CloudLightning className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="flex flex-col pr-4 border-r border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  26°C Thunderstorm
                </span>
              </div>
              <p className="text-xs text-slate-500">Phnom Penh</p>
            </div>
            <div className="pl-4">
              <p className="text-xs text-slate-500 mb-0.5">Predicted Impact</p>
              <p className="text-sm font-medium text-red-600 flex items-center gap-1">
                <ArrowDownRight className="h-3.5 w-3.5" />
                15% Footfall
              </p>
            </div>
          </div>
        </div>

        {/* Global Search & Quick Actions */}
        <div className="bg-white p-2 rounded-xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-2 justify-between items-center">
          <div className="relative w-full md:max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search vendors, stall owners, or phone numbers..."
              className="w-full pl-9 pr-12 py-2.5 bg-slate-50/50 border-none rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 px-2 md:px-0">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-sm font-medium transition-all shadow-sm whitespace-nowrap">
              <UserPlus className="h-4 w-4" />
              Onboard Vendor
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-all shadow-sm whitespace-nowrap">
              <FileText className="h-4 w-4 text-slate-400" />
              Review Stalls
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-all shadow-sm whitespace-nowrap">
              <Download className="h-4 w-4 text-slate-400" />
              Export
            </button>
          </div>
        </div>

        {/* Quick Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title="Registered Vendors"
            value="1,248"
            trend="+12%"
            trendUp={true}
            icon={<Users className="h-5 w-5 text-blue-600" />}
            iconBg="bg-blue-50 ring-1 ring-blue-100"
          />

          {/* Custom Card for Subscriptions to show breakdown */}
          <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">
                  Active Subscriptions
                </p>
                <p className="text-2xl font-bold tracking-tight text-slate-900">
                  892
                </p>
              </div>
              <div className="bg-emerald-50 ring-1 ring-emerald-100 p-2.5 rounded-lg">
                <CreditCard className="h-5 w-5 text-emerald-600" />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Free</span>
                <span className="font-medium text-slate-700">356</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-600 font-medium">Pro</span>
                <span className="font-medium text-slate-700">244</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-600 font-medium">Premium</span>
                <span className="font-medium text-slate-700">292</span>
              </div>
            </div>
          </div>

          <StatCard
            title="Market Revenue"
            value="$14,500"
            subtext="This Month"
            trend="-2%"
            trendUp={false}
            icon={<CircleDollarSign className="h-5 w-5 text-indigo-600" />}
            iconBg="bg-indigo-50 ring-1 ring-indigo-100"
          />
          <StatCard
            title="Pending Approvals"
            value="34"
            subtext="Stalls need verification"
            trend="Action needed"
            trendUp={null}
            icon={<Clock className="h-5 w-5 text-amber-600" />}
            iconBg="bg-amber-50 ring-1 ring-amber-100"
          />
        </div>

        {/* Bottom Section: Chart & Action List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart Placeholder */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/60 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Revenue & Footfall Trends
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Correlation between weather patterns and digital payments.
                </p>
              </div>
              <select className="bg-slate-50 border border-slate-200 text-sm text-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-[300px] w-full bg-slate-50/50 border border-slate-200/50 border-dashed rounded-xl flex items-center justify-center flex-col text-slate-400">
              <TrendingUp className="h-8 w-8 mb-3 text-slate-300" />
              <p className="text-sm font-medium">Revenue Chart Integration</p>
              <p className="text-xs mt-1 text-slate-400">
                Insert Recharts or Chart.js component here
              </p>
            </div>
          </div>

          {/* Action List: Pending Approvals */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Store className="h-4 w-4 text-amber-500" />
                Pending Approvals
              </h2>
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                34
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {/* Mock Pending Items */}
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 mb-1 group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Sokha`s Fresh Veggies {item}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> Zone B, Stall{" "}
                        {100 + item}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors">
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
              <button className="w-full text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                View All Pending Stalls →
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}

// Reusable StatCard Component
function StatCard({
  title,
  value,
  subtext,
  trend,
  trendUp,
  icon,
  iconBg,
}: any) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <div className={`${iconBg} p-2.5 rounded-lg`}>{icon}</div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {trendUp !== null && (
          <span
            className={`flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-md ${trendUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
          >
            {trendUp ? (
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-0.5" />
            )}
            {trend}
          </span>
        )}
        {trendUp === null && trend && (
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
            {trend}
          </span>
        )}
        <span className="text-xs text-slate-400 truncate">
          {subtext || "vs last month"}
        </span>
      </div>
    </div>
  );
}
