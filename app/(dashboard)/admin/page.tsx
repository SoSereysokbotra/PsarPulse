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
  User,
  Store,
  Loader2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Select } from "@/components/ui/Select";

export default function AdminDashboardPage() {
  const { language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isKhmer = language === "km";
  const isDark = resolvedTheme === "dark";

  const [vendorRequests, setVendorRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeVendors: 0,
    activeSubs: 0,
    monthlyRevenue: 0,
    pendingRequests: 0,
    subscriptionsBreakdown: { free: 0, paid: 0 },
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [trendsLoading, setTrendsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const [trendData, setTrendData] = useState<any[]>([]);

  async function fetchRequests() {
    try {
      const [reqRes, statsRes] = await Promise.all([
        fetch("/api/admin/vendor-requests"),
        fetch("/api/admin/stats"),
      ]);

      if (reqRes.ok) {
        const json = await reqRes.json();
        if (json.success) setVendorRequests(json.data);
      }

      if (statsRes.ok) {
        const json = await statsRes.json();
        if (json.success && json.data) {
          setStats(json.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch pending requests", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTrends(rangeValue: string) {
    setTrendsLoading(true);
    try {
      const res = await fetch(`/api/admin/trends?range=${rangeValue}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) setTrendData(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch trends", error);
    } finally {
      setTrendsLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
    fetchTrends(timeRange);
  }, [timeRange]);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    if (
      !confirm(
        `Are you sure you want to ${status === "approved" ? "approve" : "reject"} this vendor?`,
      )
    )
      return;

    try {
      const response = await fetch(`/api/admin/vendor-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success) {
          setVendorRequests((prev) => prev.filter((req) => req.id !== id));
        } else {
          alert("Error: " + json.message);
        }
      } else {
        alert("Server error while performing action.");
      }
    } catch (e) {
      alert("Failed to connect to the server.");
    }
  };

  const filteredRequests = vendorRequests.filter(
    (req) =>
      req.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.businessEmail?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleExport = async () => {
    try {
      const res = await fetch("/api/admin/vendors");
      const json = await res.json();
      if (json.success) {
        const data = json.data;
        const csvRows = [
          ["ID", "Name", "Owner", "Phone", "Tier", "Status", "Joined"],
          ...data.map((v: any) => [
            v.id,
            v.name,
            v.owner,
            v.phone,
            v.tier,
            v.status,
            v.joined,
          ]),
        ];
        const csvContent =
          "data:text/csv;charset=utf-8," +
          csvRows.map((e) => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute(
          "download",
          `vendors_export_${new Date().toISOString().split("T")[0]}.csv`,
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  return (
    <div
      className={`space-y-8 font-sans ${isKhmer ? "font-battambang" : ""} ${isDark ? "text-slate-100" : "text-slate-900"}`}
    >
      {/* Header & Context Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 fade-in">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {isKhmer ? "ទិដ្ឋភាពទូទៅនៃផ្ទាំងគ្រប់គ្រង" : "Dashboard Overview"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isKhmer
              ? "សេចក្តីសង្ខេបកម្រិតខ្ពស់នៃប្រព័ន្ធអេកូឡូស៊ីឌីជីថលរបស់ទីផ្សារ។"
              : "High-level summary of the market's digital ecosystem."}
          </p>
        </div>

        {/* Live Weather & Impact Widget */}
        <div
          className={`flex items-center rounded-xl border shadow-sm p-1.5 pr-5 ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200/60"}`}
        >
          <div
            className={`rounded-lg p-2 mr-3 border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"}`}
          >
            <CloudLightning className="h-5 w-5 text-indigo-500" />
          </div>
          <div
            className={`flex flex-col pr-4 border-r ${isDark ? "border-white/10" : "border-slate-100"}`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
              >
                26°C {isKhmer ? "មានផ្គររន្ទះ" : "Thunderstorm"}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {isKhmer ? "ភ្នំពេញ" : "Phnom Penh"}
            </p>
          </div>
          <div className="pl-4">
            <p className="text-xs text-slate-500 mb-0.5">
              {isKhmer ? "ផលប៉ះពាល់ដែលបានទស្សទាយ" : "Predicted Impact"}
            </p>
            <p className="text-sm font-medium text-red-600 flex items-center gap-1">
              <ArrowDownRight className="h-3.5 w-3.5" />
              15% {isKhmer ? "ចំនួនមនុស្សដើរ" : "Footfall"}
            </p>
          </div>
        </div>
      </div>

      {/* Global Search & Quick Actions */}
      <div
        className={`p-2 rounded-xl border shadow-sm flex flex-col md:flex-row gap-2 justify-between items-center fade-in-1 ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200/60"}`}
      >
        <div className="relative w-full md:max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              isKhmer
                ? "ស្វែងរកអាជីវករ ម្ចាស់តូប ឬលេខទូរស័ព្ទ..."
                : "Search vendors, stall owners, or phone numbers..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-12 py-2.5 border-none rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${
              isDark ? "bg-white/5 text-white" : "bg-slate-50/50 text-slate-900"
            }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 px-2 md:px-0">
          <Link href="/admin/vendor-requests">
            <button
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-all shadow-sm whitespace-nowrap ${
                isDark
                  ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <FileText className="h-4 w-4 text-slate-400" />
              {isKhmer ? "ពិនិត្យតូប" : "Review Stalls"}
            </button>
          </Link>
          <button
            onClick={handleExport}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-all shadow-sm whitespace-nowrap ${
              isDark
                ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Download className="h-4 w-4 text-slate-400" />
            {isKhmer ? "នាំចេញ" : "Export"}
          </button>
        </div>
      </div>

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 fade-in-2">
        <StatCard
          title={isKhmer ? "អាជីវករដែលបានចុះឈ្មោះ" : "Registered Vendors"}
          value={stats.activeVendors.toString()}
          trend=""
          trendUp={true}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-50 ring-1 ring-blue-100"
          isDark={isDark}
          isKhmer={isKhmer}
        />

        {/* Custom Card for Subscriptions to show breakdown */}
        <div
          className={`rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200/60"}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">
                {isKhmer ? "ការជាវសកម្ម" : "Active Subscriptions"}
              </p>
              <p
                className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {stats.activeSubs}
              </p>
            </div>
            <div className="bg-emerald-50 ring-1 ring-emerald-100 p-2.5 rounded-lg">
              <CreditCard className="h-5 w-5 text-emerald-600" />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Free</span>
              <span className="font-medium text-slate-700">
                {stats.subscriptionsBreakdown?.free || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-medium">Paid</span>
              <span className="font-medium text-slate-700">
                {stats.subscriptionsBreakdown?.paid || 0}
              </span>
            </div>
          </div>
        </div>

        <StatCard
          title={isKhmer ? "ចំណូលទីផ្សារអតិបរមា" : "Market Revenue"}
          value={`$${stats.monthlyRevenue}`}
          subtext={isKhmer ? "សរុប" : "Total Generated"}
          trend=""
          trendUp={false}
          icon={<CircleDollarSign className="h-5 w-5 text-indigo-600" />}
          iconBg="bg-indigo-50 ring-1 ring-indigo-100"
          isDark={isDark}
          isKhmer={isKhmer}
        />
        <StatCard
          title={isKhmer ? "ការអនុម័តដែលកំពុងរង់ចាំ" : "Pending Approvals"}
          value={vendorRequests.length.toString()}
          subtext={
            isKhmer ? "តូបត្រូវការការផ្ទៀងផ្ទាត់" : "Stalls need verification"
          }
          trend={isKhmer ? "ត្រូវការសកម្មភាព" : "Action needed"}
          trendUp={null}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          iconBg="bg-amber-50 ring-1 ring-amber-100"
          isDark={isDark}
          isKhmer={isKhmer}
        />
      </div>

      {/* Bottom Section: Chart & Action List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-in-3">
        {/* Revenue Chart Placeholder */}
        <div
          className={`lg:col-span-2 rounded-xl border shadow-sm p-6 ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200/60"}`}
        >
          <div className="flex justify-between items-center mb-13">
            <div>
              <h2
                className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {isKhmer
                  ? "និន្នាការចំណូល និងការដើរទិញឥវ៉ាន់"
                  : "Revenue & Footfall Trends"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isKhmer
                  ? "ទំនាក់ទំនងរវាងលំនាំអាកាសធាតុ និងការទូទាត់ឌីជីថល។"
                  : "Correlation between weather patterns and digital payments."}
              </p>
            </div>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              isDark={isDark}
              options={[
                { value: "7d", label: isKhmer ? "៧ ថ្ងៃចុងក្រោយ" : "Last 7 Days" },
                { value: "30d", label: isKhmer ? "៣០ ថ្ងៃចុងក្រោយ" : "Last 30 Days" },
                { value: "1y", label: isKhmer ? "ឆ្នាំនេះ" : "This Year" }
              ]}
            />
          </div>
          <div
            className={`h-72 w-full flex items-end justify-between gap-2 px-2 pb-8 pt-4 relative ${
              isDark ? "bg-white/0" : "bg-slate-50/0"
            }`}
          >
            {/* Y-Axis Labels */}
            <div className="absolute left-0 h-full flex flex-col justify-between text-[10px] text-slate-400 pb-8 pr-2 border-r border-slate-100 dark:border-white/5">
              <span>${Math.max(...trendData.map((d) => d.revenue), 1000)}</span>
              <span>
                ${Math.max(...trendData.map((d) => d.revenue), 1000) * 0.75}
              </span>
              <span>
                ${Math.max(...trendData.map((d) => d.revenue), 1000) * 0.5}
              </span>
              <span>
                ${Math.max(...trendData.map((d) => d.revenue), 1000) * 0.25}
              </span>
              <span>0</span>
            </div>

            {/* Grid Lines */}
            <div className="absolute inset-0 ml-8 mb-8 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-full border-t border-slate-100 dark:border-white/5 h-0"
                />
              ))}
            </div>

            {/* Bars */}
            <div className="flex-1 ml-8 h-full flex items-end justify-around gap-2 pb-1 relative z-10">
              {trendsLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
              ) : trendData.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                  {isKhmer ? "មិនមានទិន្នន័យ" : "No trend data available"}
                </div>
              ) : (
                trendData.map((data, i) => {
                  const maxRevenue =
                    Math.max(...trendData.map((d) => d.revenue), 1) || 1000;
                  const maxFootfall =
                    Math.max(...trendData.map((d) => d.footfall), 1) || 500;
                  const revHeight = (data.revenue / maxRevenue) * 100;
                  const footHeight = (data.footfall / maxFootfall) * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center group relative h-full justify-end"
                    >
                      {/* Tooltip Content (Hover) */}
                      <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] p-2 rounded shadow-lg z-20 whitespace-nowrap pointer-events-none">
                        <div className="font-bold border-b border-white/20 pb-1 mb-1">
                          {data.label} ({data.date})
                        </div>
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                          Revenue: ${data.revenue.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                          Footfall: {data.footfall.toLocaleString()}
                        </div>
                      </div>

                      <div className="w-full flex justify-center gap-1 h-full items-end">
                        {/* Revenue Bar */}
                        <div
                          className="w-1.5 sm:w-2.5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm transition-all duration-500 hover:brightness-110"
                          style={{ height: `${revHeight}%` }}
                        ></div>
                        {/* Footfall Bar */}
                        <div
                          className="w-0.5 sm:w-1 bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t-sm transition-all duration-500 hover:brightness-110 opacity-60"
                          style={{ height: `${footHeight}%` }}
                        ></div>
                      </div>

                      {/* X-Axis Label */}
                      <span className="absolute -bottom-6 text-[10px] font-medium text-slate-500">
                        {data.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Legend */}
            <div className="absolute bottom-1 right-2 flex gap-4 text-[10px] font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-500">
                  {isKhmer ? "ចំណូល" : "Revenue"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="text-slate-500">
                  {isKhmer ? "ចំនួនអ្នកដើរ" : "Footfall"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action List: Pending Approvals */}
        <div
          className={`rounded-xl border shadow-sm flex flex-col h-full ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200/60"}`}
        >
          <div
            className={`p-5 border-b flex justify-between items-center ${isDark ? "border-white/5" : "border-slate-100"}`}
          >
            <h2
              className={`text-base font-semibold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              <Store className="h-4 w-4 text-amber-500" />
              {isKhmer ? "ការអនុម័តដែលកំពុងរង់ចាំ" : "Pending Approvals"}
            </h2>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {vendorRequests.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="flex items-center justify-center h-full p-6 text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="flex items-center justify-center h-full p-6 text-slate-400 text-sm">
                {isKhmer
                  ? "មិនមានការអនុម័តដែលកំពុងរង់ចាំទេ"
                  : "No pending approvals"}
              </div>
            ) : (
              filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 mb-1 group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p
                        className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-900"}`}
                      >
                        {req.businessName}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {req.businessEmail}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleAction(req.id, "approved")}
                        title="Approve"
                        className={`p-1.5 rounded-md transition-colors ${isDark ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "rejected")}
                        title="Reject"
                        className={`p-1.5 rounded-md transition-colors ${isDark ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div
            className={`p-4 border-t rounded-b-xl ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50/50 border-slate-100"}`}
          >
            <button className="w-full text-sm font-medium text-slate-500 hover:text-indigo-400 transition-colors">
              {isKhmer
                ? "មើលតូបទាំងអស់ដែលកំពុងរង់ចាំ →"
                : "View All Pending Stalls →"}
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
  isDark,
  isKhmer,
}: any) {
  return (
    <div
      className={`rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-slate-200/60"}`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p
            className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
          >
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
          {subtext || (isKhmer ? "ធៀបនឹងខែមុន" : "vs last month")}
        </span>
      </div>
    </div>
  );
}
